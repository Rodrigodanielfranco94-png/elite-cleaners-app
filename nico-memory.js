// ================= MEMORIA NICO =================

async function guardarMemoriaNico({

  tipo = "general",

  titulo = "",

  contenido = "",

  prioridad = "normal",

  expira = null

}){

try{

    const memoriaParecida =
      await db
      .collection("memoria_nico")
      .where(
        "usuario_nombre",
        "==",
        window.usuarioActual?.nombre || "Rodrigo"
      )
      .limit(50)
      .get();

    const yaExiste =
      memoriaParecida.docs.some(doc => {
        const data = doc.data();

        return normalizarTexto(data.contenido || "") ===
               normalizarTexto(contenido || "");
      });

    if(yaExiste){
      console.log("Memoria duplicada ignorada");
      return;
    }

    await db
  .collection("memoria_nico")
  .add({
    usuario_id:
      window.usuarioActual?.id || "sin_usuario",

    usuario_email:
      window.usuarioActual?.email || "sin_email",

    usuario_nombre:
      window.usuarioActual?.nombre || "Rodrigo",

    tipo,
    titulo,
    contenido,
    prioridad,
    expira,

        creado_por: "Nico",

        fecha_creacion:
          firebase.firestore
          .FieldValue
          .serverTimestamp()
      });

    agregarMensaje(

      "nico",

`🧠 Perfecto Rodri. Ya guardé este recuerdo en mi memoria permanente.

${contenido}`
    );

    imagenNico("bien");

  }catch(e){

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, hubo un problema guardando la memoria."
    );
  }
}
async function obtenerConversacionesRecientesNico(){
  try{
    const usuarioNombre =
      window.usuarioActual?.nombre || "Rodrigo";

    const snapshot = await db
      .collection("conversaciones_nico")
      .where("usuario_nombre", "==", usuarioNombre)
      .limit(20)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  }catch(e){
    console.log(e);
    return [];
  }
}
async function obtenerMemoriasNico(){
  try{
    const usuarioNombre =
      window.usuarioActual?.nombre || "Rodrigo";

    const criticasSnap = await db.collection("memoria_nico")
      .where("usuario_nombre", "in", [usuarioNombre, "General"])
      .where("prioridad", "==", "critica")
      .limit(15)
      .get();

    const importantesSnap = await db.collection("memoria_nico")
      .where("usuario_nombre", "in", [usuarioNombre, "General"])
      .where("prioridad", "==", "importante")
      .limit(20)
      .get();

    const normalesSnap = await db.collection("memoria_nico")
      .where("usuario_nombre", "in", [usuarioNombre, "General"])
      .where("prioridad", "==", "normal")
      .limit(10)
      .get();

    const temporalesSnap = await db.collection("memoria_nico")
      .where("usuario_nombre", "in", [usuarioNombre, "General"])
      .where("prioridad", "==", "temporal")
      .limit(5)
      .get();

    const docs = [
      ...criticasSnap.docs,
      ...importantesSnap.docs,
      ...normalesSnap.docs,
      ...temporalesSnap.docs
    ];

    const ahora = Date.now();

const memoriasFiltradas = docs.filter(doc => {

  const data = doc.data();

  if(
    data.expira &&
    ahora > data.expira
  ){

    db.collection("memoria_nico")
      .doc(doc.id)
      .delete();

    console.log(
      "Memoria expirada eliminada:",
      doc.id
    );

    return false;
  }

  return true;
});
    
    return memoriasFiltradas.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  }catch(e){
    console.log(e);
    return [];
  }
}

