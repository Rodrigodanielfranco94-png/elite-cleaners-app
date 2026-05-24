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

async function detectarMemoriaAutomatica(mensaje){
  try{
    const t = normalizarTexto(mensaje);

    if(!t || t.length < 12) return;

    if(
      t.includes("hola") ||
      t.includes("gracias") ||
      t.includes("ok") ||
      t.includes("perfecto") ||
      t.includes("jaja")
    ) return;

    let tipo = "auto";
    let prioridad = "normal";
    let expira = null;

if(
  t.includes("muy importante") ||
  t.includes("crítico") ||
  t.includes("critico") ||
  t.includes("critical") ||
  t.includes("no olvidar") ||
  t.includes("nunca olvidar")
){
  tipo = "critica";
  prioridad = "critica";
} else if(
  t.includes("cliente") ||
  t.includes("client") ||
  t.includes("prefiere") ||
  t.includes("prefers") ||
  t.includes("siempre") ||
  t.includes("always")
){
  tipo = "cliente";
  prioridad = "importante";
} else if(
  t.includes("precio") ||
  t.includes("price") ||
  t.includes("cobra") ||
  t.includes("charge") ||
  t.includes("millas") ||
  t.includes("miles") ||
  t.includes("$")
){
  tipo = "financiera";
  prioridad = "importante";
} else if(
  t.includes("horario") ||
  t.includes("schedule") ||
  t.includes("lunes") ||
  t.includes("martes") ||
  t.includes("miercoles") ||
  t.includes("jueves") ||
  t.includes("viernes") ||
  t.includes("sabado") ||
  t.includes("domingo")
){
  tipo = "operativa";
  prioridad = "importante";
} else if(
  t.includes("triste") ||
  t.includes("feliz") ||
  t.includes("extraño") ||
  t.includes("extrano") ||
  t.includes("familia") ||
  t.includes("nico") ||
  t.includes("dayana") ||
  t.includes("rodri")
){
  tipo = "emocional";
  prioridad = "importante";
} else if(
  t.includes("mañana") ||
  t.includes("manana") ||
  t.includes("solo hoy") ||
  t.includes("por ahora") ||
  t.includes("temporal")
){
  tipo = "temporal";
  prioridad = "temporal";
} else {
  return;
}

if(
  t.includes("solo hoy") ||
  t.includes("por hoy")
){
  expira =
    Date.now() +
    (1000 * 60 * 60 * 24);
}

if(
  t.includes("hasta mañana") ||
  t.includes("mañana olvidar")
){
  expira =
    Date.now() +
    (1000 * 60 * 60 * 48);
}

if(
  t.includes("temporal") ||
  t.includes("temporalmente")
){
  expira =
    Date.now() +
    (1000 * 60 * 60 * 24 * 7);
}

  await guardarMemoriaNico({
  tipo,
  titulo:
    "Memoria inteligente detectada por Nico",
  contenido:
    mensaje,
  prioridad,
  expira
});

  }catch(e){
    console.log("No se pudo guardar memoria automática:", e);
  }
}

async function mostrarPanelMemoriasNico(){
  if(!memorias.length){
    agregarMensaje("nico", "Todavía no tengo memorias guardadas para este usuario.");
    return;
  }

  let texto = "🧠 MEMORIAS GUARDADAS:\n\n";

  memorias.forEach((m, i) => {
    texto += `${i + 1}. [${m.prioridad || "normal"}] ${m.tipo || "general"}\n`;
    texto += `${m.contenido || "Sin contenido"}\n`;
    texto += `ID: ${m.id}\n\n`;
  });

  agregarMensaje("nico", texto.trim());
}

window.obtenerMemoriasNico = obtenerMemoriasNico;
window.obtenerConversacionesRecientesNico = obtenerConversacionesRecientesNico;
window.guardarMemoriaNico = guardarMemoriaNico;
window.detectarMemoriaAutomatica = detectarMemoriaAutomatica;
window.mostrarPanelMemoriasNico = mostrarPanelMemoriasNico;
