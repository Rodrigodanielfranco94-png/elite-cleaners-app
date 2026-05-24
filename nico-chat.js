// ================= THINK =================

async function pensarConNico(
  mensaje
){

  try{

    imagenNico("piensa");

    const memorias =
      await obtenerMemoriasNico();
    const conversacionesRecientes =
  await obtenerConversacionesRecientesNico();

    const contextoMemoria =

      memorias
      .map(m =>
        `- ${m.contenido}`
      )
      .join("\n");
    const contextoConversacion =

  conversacionesRecientes
  .map(c =>
    `${c.usuario_nombre || "Usuario"} (${c.tipo}): ${c.mensaje}`
  )
  .join("\n");

 const nombreUsuario =
  window.usuarioActual?.nombre || "Rodrigo";

const mensajeConMemoria =

`USUARIO ACTUAL DEL SISTEMA:

${nombreUsuario}

MEMORIA PERMANENTE DE NICO:

${contextoMemoria || "Sin memorias guardadas todavía."}

CONVERSACIÓN RECIENTE:

${contextoConversacion || "Sin conversación reciente."}

MENSAJE DEL USUARIO:

${mensaje}`;
    const res = await fetch(
  window.NICO_CONFIG.PENSAR_NICO_URL,
  {
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mensaje: mensajeConMemoria
    })
  }
);

    const data =
      await res.json();

    if(!res.ok){

      console.log(data);

      return "Rodri, no pude responder ahora mismo.";
    }

    return (

      data.respuesta ||

      data.output_text ||

      "Aquí estoy, Rodri."

    ).trim();

}catch(e){

  console.log("ERROR REAL DE NICO:", e);

  return "Rodri, el error real es: " + (e.message || e);
}

    console.log(e);

    return "Rodri, hubo un problema conectando con Nico.";
  }
}
