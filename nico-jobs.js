// ================= CLIENT MESSAGES =================

function prepararMensajeCliente({telefono,mensaje,cliente}){

if(!telefono){

agregarMensaje(
  "nico",
  "Rodri, el cliente no tiene teléfono."
);

return;

}

nicoMensajeClientePendiente = {telefono,mensaje};

agregarMensaje("nico",

`⚠️ MENSAJE PENDIENTE DE APROBACIÓN

Cliente:${cliente || "Cliente"}

Mensaje en inglés que se enviará:

${mensaje}

Si todo está correcto escribe:

APROBAR

Si no quieres enviarlo escribe:

CANCELAR`);}

function confirmarEnvioCliente(){

if(!nicoMensajeClientePendiente){

agregarMensaje(
  "nico",
  "No hay mensajes pendientes."
);

return;

}

abrirSMSDirecto(nicoMensajeClientePendiente.telefono,nicoMensajeClientePendiente.mensaje);

agregarMensaje("nico","✅ Perfecto Rodri. Abrí el SMS listo para enviarse al cliente.");

imagenNico("bien");

nicoMensajeClientePendiente = null;}

function cancelarEnvioCliente(){

nicoMensajeClientePendiente = null;

agregarMensaje("nico","❌ Mensaje cancelado. No se enviará nada al cliente.");}

// ================= CONTRACT =================

function prepararContratoCliente(){

const datos =obtenerDatosFormularioActual();

if(!datos.cliente_nombre){

agregarMensaje(
  "nico",
  "Rodri, falta el nombre del cliente."
);

return;

}

if(!datos.cliente_telefono){

agregarMensaje(
  "nico",
  "Rodri, falta el teléfono del cliente."
);

return;

}

const urlFirma =

${ELITE_BASE_URL}/firmar.html?cliente=${encodeURIComponent(
  datos.cliente_nombre
)};

const mensaje =

`Hello ${datos.cliente_nombre},

Thank you for choosing Elite Cleaners Company 🌟

To confirm your cleaning service, please review and sign your service agreement using the secure link below:

${urlFirma}

Thank you again for trusting Elite Cleaners Company.`;

prepararMensajeCliente({

telefono:
  datos.cliente_telefono,

mensaje,

cliente:
  datos.cliente_nombre

});}

// ================= REVIEW =================

function prepararReviewCliente(){

const datos =obtenerDatosFormularioActual();

if(!datos.cliente_nombre){

agregarMensaje(
  "nico",
  "Rodri, falta el nombre del cliente."
);

return;

}

if(!datos.cliente_telefono){

agregarMensaje(
  "nico",
  "Rodri, falta el teléfono del cliente."
);

return;

}

const mensaje =

`Hello ${datos.cliente_nombre},

Thank you for choosing Elite Cleaners Company 🌟

It was truly a pleasure serving you.

We would greatly appreciate your feedback.

Please tap the secure link below to leave us a Google review:

${ELITE_REVIEW_LINK}

Thank you again for trusting Elite Cleaners Company.`;

prepararMensajeCliente({

telefono:
  datos.cliente_telefono,

mensaje,

cliente:
  datos.cliente_nombre

});}

// ================= REMINDER =================

function prepararRecordatorioCliente(){

const datos =obtenerDatosFormularioActual();

if(!datos.cliente_nombre){

agregarMensaje(
  "nico",
  "Rodri, falta el nombre del cliente."
);

return;

}

if(!datos.cliente_telefono){

agregarMensaje(
  "nico",
  "Rodri, falta el teléfono del cliente."
);

return;

}

const staff =

obtenerValor(
  "search-empleado"
)

||

"Elite Cleaners Team";

const mensaje =

`Hello ${datos.cliente_nombre}! 🌟

This is a friendly reminder from Elite Cleaners Company about your upcoming cleaning service:

📅 Date: ${datos.fecha || "TBD"}⏰ Time: ${datos.hora || "TBD"}👤 Staff: ${staff}

We look forward to seeing you.

Please let us know if you have any questions.`;

prepararMensajeCliente({

telefono:
  datos.cliente_telefono,

mensaje,

cliente:
  datos.cliente_nombre

});}

// ================= SALES MESSAGE =================

function prepararMensajeVenta(nombreCliente = ""){

let datos =obtenerDatosFormularioActual();

if(nombreCliente){

const {
  cliente,
  servicio
} =
  buscarDatosCliente(
    nombreCliente
  );

datos.cliente_nombre =

  servicio?.cliente ||

  cliente?.nombre ||

  cliente?.id ||

  nombreCliente;

datos.cliente_telefono =

  servicio?.whatsapp ||

  cliente?.whatsapp ||

  cliente?.telefono ||

  "";

}

if(!datos.cliente_nombre){

agregarMensaje(
  "nico",
  "Rodri, selecciona o escribe primero el nombre del cliente."
);

return;

}

if(!datos.cliente_telefono){

agregarMensaje(
  "nico",
  "Rodri, falta el teléfono del cliente."
);

return;

}

const mensaje =

`Hello ${datos.cliente_nombre}! 🌟

This is Elite Cleaners Company.

We wanted to let you know that we are currently offering Deep Cleaning services for our recurring clients.

A Deep Clean is a great option to refresh your home and take care of areas that are not always covered during regular maintenance cleanings.

If you would like, we can send you an estimate or help you schedule a Deep Cleaning service.

Thank you for trusting Elite Cleaners Company!`;

prepararMensajeCliente({

telefono:
  datos.cliente_telefono,

mensaje,

cliente:
  datos.cliente_nombre

});}

// ================= PAYLOADS =================

function construirPayloadEstimateDesdeDatos(datos){

const cleaningTotal = Number(datos.total || 0);const millasServicio = Number(datos.millas_servicio || 0);const mileageRate = 0.67;const travelFee = millasServicio * mileageRate;const totalFinal = cleaningTotal + travelFee;

return {cliente_nombre: datos.cliente_nombre || "",cliente_email: datos.cliente_email || "",cliente_telefono: limpiarTelefono(datos.cliente_telefono),cliente_direccion: datos.cliente_direccion || "",tipo_limpieza: datos.tipo_limpieza || "",

notes:

`${datos.notes || ""}

Mileage / Travel Fee

• ${millasServicio} miles round trip• $${dinero(mileageRate)} per mile• Travel Fee: $${dinero(travelFee)}`,cleaning_total: cleaningTotal,millas_servicio: millasServicio,mileage_rate: mileageRate,travel_fee: Number(travelFee.toFixed(2)),

total: Number(totalFinal.toFixed(2)),
subtotal: Number(totalFinal.toFixed(2)),

items: [
  {
    description: datos.tipo_limpieza || "Cleaning Service",
    price: cleaningTotal,
    quantity: 1,
    total: cleaningTotal
  },
  {
    description: `Mileage / Travel Fee (${millasServicio} miles × $0.67)`,
    price: Number(travelFee.toFixed(2)),
    quantity: 1,
    total: Number(travelFee.toFixed(2))
  }
],

status: "Draft"

};}function construirPayloadInvoiceDesdeEstimate(estimate){

return {

estimate_numero:
  estimate.numero || "",

cliente_nombre:
  estimate.cliente_nombre || "",

cliente_email:
  estimate.cliente_email || "",

cliente_telefono:
  estimate.cliente_telefono || "",

cliente_direccion:
  estimate.cliente_direccion || "",

tipo_limpieza:
  estimate.tipo_limpieza || "",

notes:
  estimate.notes || "",

total:
  Number(estimate.total || 0),

subtotal:
  Number(
    estimate.subtotal
    ||
    estimate.total
    || 0
  ),

amount_due:
  Number(estimate.total || 0),

paid: 0,

balance_due:
  Number(estimate.total || 0),

items:

  estimate.items &&
  estimate.items.length

  ? estimate.items

  : [
    {
      description:
        estimate.tipo_limpieza
        || "Cleaning Service",

      price:
        Number(estimate.total || 0),

      quantity: 1,

      total:
        Number(estimate.total || 0)
    }
  ],

status: "Unpaid",

fecha: hoyISO(),

due_date:
  sumarDiasISO(7)

};}

function construirTrabajoDesdeEstimate(estimate,fecha,hora){

return {

cliente:
  estimate.cliente_nombre || "",

direccion:
  estimate.cliente_direccion || "",

whatsapp:
  limpiarTelefono(
    estimate.cliente_telefono
  ),

telefono:
  limpiarTelefono(
    estimate.cliente_telefono
  ),

email_cliente:
  estimate.cliente_email || "",

precio_total:
  Number(estimate.total || 0),

millas_servicio:

Number(estimate.millas_servicio || 0),

travel_fee:Number(estimate.travel_fee || 0),

cleaning_total:Number(estimate.cleaning_total || estimate.total || 0),

empleado_nombre:
  obtenerValor(
    "search-empleado"
  ),

empleado_email:
  obtenerValor(
    "email-empleado"
  ),

empleado_nombre_2:
  obtenerValor(
    "search-empleado-2"
  ),

empleado_email_2:
  obtenerValor(
    "email-empleado-2"
  ),

fecha,
hora,

notas:
  estimate.notes || "",

tipo:
  estimate.tipo_limpieza
  || "ESTÁNDAR",

estado: "pendiente",

hora_inicio: "--:--",

hora_fin: "--:--",

firma_cliente: false,

estimate_numero:
  estimate.numero || "",

creado_por: "Nico",

timestamp:
  firebase.firestore
  .FieldValue
  .serverTimestamp()

};}

// ================= ESTIMATES =================

async function crearEstimateConDatos(datos){

if(!datos.cliente_nombre){

agregarMensaje(
  "nico",
  "Rodri, falta el nombre del cliente para crear el estimate."
);

return;

}

if(!datos.total ||Number(datos.total) <= 0){

agregarMensaje(
  "nico",
  "Rodri, falta el precio total."
);

return;

}

imagenNico("celular");

const payload =construirPayloadEstimateDesdeDatos(datos);

const res = await fetch(CREAR_ESTIMATE_URL,{method: "POST",

  headers: {
    "Content-Type":
      "application/json"
  },

  body:
    JSON.stringify(payload)
}

);

const data = await res.json();

if(!res.ok || !data.ok){

console.log(data);

agregarMensaje(
  "nico",
  "Rodri, no pude crear el estimate."
);

return;

}

const numero =data.estimate.numero;await guardarMemoriaNico({tipo: "cliente",titulo:"Estimate creado para " +(payload.cliente_nombre || "cliente"),contenido:Cliente ${payload.cliente_nombre} recibió un estimate ${numero}. Tipo: ${payload.tipo_limpieza}. Total: $${dinero(payload.total)}. Dirección: ${payload.cliente_direccion}. Millas: ${payload.millas_servicio}.,prioridad: "importante"});

imagenNico("bien");

agregarMensajeConBotonPDF(

`✅ Estimate creado correctamente

👤 Cliente:${payload.cliente_nombre}

🧼 Tipo:${payload.tipo_limpieza || "Sin tipo"}

💵 Cleaning:$${dinero(payload.cleaning_total)}

🚗 Travel Fee:$${dinero(payload.travel_fee)}

📍 Millas ida/vuelta:${payload.millas_servicio}

💰 Total:$${dinero(payload.total)}

📍 Dirección:${payload.cliente_direccion || "Sin dirección"}

📄 Estimate:${numero}`,

"estimate",
numero

);}

async function obtenerEstimates(){

const res = await fetch(CONSULTAR_ESTIMATES_URL);

const data = await res.json();

return data.estimates || [];}

async function mostrarEstimates(){

try{

imagenNico("celular");

const estimates =
  await obtenerEstimates();

if(!estimates.length){

  agregarMensaje(
    "nico",
    "Rodri, todavía no encontré estimates guardados."
  );

  return;
}

let texto =
  "📋 Últimos estimates:\n\n";

estimates
  .slice(0,10)
  .forEach((e, i) => {

  texto +=

`${i + 1}. ${e.cliente_nombre || "Sin cliente"}

Tipo:${e.tipo_limpieza || "Sin tipo"}

Total:$${dinero(e.total)}

Estimate:${e.numero || "Sin número"}

Para verlo:ver estimate ${e.numero || ""}

\n`;});

agregarMensaje(
  "nico",
  texto.trim()
);

imagenNico("bien");

}catch(e){

console.log(e);

agregarMensaje(
  "nico",
  "Rodri, hubo un error consultando los estimates."
);

}}

// ================= INVOICES =================

async function convertirEstimateAInvoice(numeroEstimate){

try{

imagenNico("celular");

const estimates =
  await obtenerEstimates();

const estimate =
  estimates.find(e =>

    normalizarTexto(
      e.numero || ""
    ).includes(

      normalizarTexto(
        numeroEstimate || ""
      )
    )
  );

if(!estimate){

  agregarMensaje(
    "nico",
    "Rodri, no encontré ese estimate."
  );

  return;
}

const payload =
  construirPayloadInvoiceDesdeEstimate(
    estimate
  );

const res = await fetch(
  CREAR_INVOICE_URL,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json"
    },

    body:
      JSON.stringify(payload)
  }
);

const data = await res.json();

if(!res.ok || !data.ok){

  console.log(data);

  agregarMensaje(
    "nico",
    "Rodri, no pude crear el invoice."
  );

  return;
}

const invoice =
  data.invoice || {};

const numeroInvoice =

  invoice.numero ||

  invoice.invoice_numero ||

  data.numero ||

  "INV-SIN-NUMERO";
await guardarMemoriaNico({

tipo: "invoice",titulo:"Invoice creado para " +(payload.cliente_nombre || "cliente"),contenido:Invoice ${numeroInvoice} creado para ${payload.cliente_nombre}. Viene del estimate ${estimate.numero}. Tipo: ${payload.tipo_limpieza}. Total: $${dinero(payload.total)}. Dirección: ${payload.cliente_direccion}.,prioridad: "importante"});

imagenNico("bien");

agregarMensajeConBotonPDF(

`✅ Invoice creado desde estimate

📄 Estimate:${estimate.numero}

🧾 Invoice:${numeroInvoice}

👤 Cliente:${payload.cliente_nombre}

🧼 Tipo:${payload.tipo_limpieza || "Sin tipo"}

💵 Total:$${dinero(payload.total)}

📍 Dirección:${payload.cliente_direccion || "Sin dirección"}`,

  "invoice",
  numeroInvoice
);

}catch(e){

console.log(e);

agregarMensaje(
  "nico",
  "Rodri, hubo un error convirtiendo el estimate a invoice."
);

}}

async function obtenerInvoices(){

const res = await fetch(CONSULTAR_INVOICES_URL);

const data = await res.json();

return data.invoices || [];}

async function mostrarInvoices(){

try{

imagenNico("celular");

const invoices =
  await obtenerInvoices();

if(!invoices.length){

  agregarMensaje(
    "nico",
    "Rodri, todavía no encontré invoices guardados."
  );

  return;
}

let texto =
  "🧾 Últimos invoices:\n\n";

invoices
  .slice(0,10)
  .forEach((inv, i) => {

  texto +=

`${i + 1}. ${inv.cliente_nombre || "Sin cliente"}

Total:$${dinero(inv.total ||inv.amount_due ||inv.balance_due)}

Invoice:${inv.numero || inv.invoice_numero || "Sin número"}

Para verlo:ver invoice ${inv.numero || inv.invoice_numero || ""}

\n`;});

agregarMensaje(
  "nico",
  texto.trim()
);

imagenNico("bien");

}catch(e){

console.log(e);

agregarMensaje(
  "nico",
  "Rodri, hubo un error consultando los invoices."
);

}}

// ================= JOBS =================

async function convertirEstimateATrabajo(numeroEstimate){

try{

imagenNico("celular");

const estimates =
  await obtenerEstimates();

const estimate =
  estimates.find(e =>

    normalizarTexto(
      e.numero || ""
    ).includes(

      normalizarTexto(
        numeroEstimate || ""
      )
    )
  );

if(!estimate){

  agregarMensaje(
    "nico",
    "Rodri, no encontré ese estimate para convertirlo a trabajo."
  );

  return;
}

const datosFormulario =
  obtenerDatosFormularioActual();

const fecha =
  datosFormulario.fecha || "";

const hora =
  datosFormulario.hora || "";

if(!fecha || !hora){

  nicoTrabajoPendiente =
    estimate;

  agregarMensaje(
    "nico",

`Rodri, ya encontré el estimate, pero falta fecha y hora para crear el trabajo.

Envíamelo así:

2026-05-12, 09:00`);

  return;
}

await crearTrabajoRealDesdeEstimate(
  estimate,
  fecha,
  hora
);

}catch(e){

console.log(e);

agregarMensaje(
  "nico",
  "Rodri, hubo un error convirtiendo el estimate a trabajo."
);

}}

async function crearTrabajoRealDesdeEstimate(estimate,fecha,hora){

try{

imagenNico("celular");

const payload =
  construirTrabajoDesdeEstimate(
    estimate,
    fecha,
    hora
  );

if(!payload.cliente){

  agregarMensaje(
    "nico",
    "Rodri, falta el nombre del cliente."
  );

  return;
}

if(!payload.direccion){

  agregarMensaje(
    "nico",
    "Rodri, falta la dirección del servicio."
  );

  return;
}

await db
  .collection("clientes")
  .doc(payload.cliente)
  .set({

    nombre:
      payload.cliente,

    direccion:
      payload.direccion,

    whatsapp:
      payload.whatsapp,

    telefono:
      payload.whatsapp,

    email:
      payload.email_cliente

  }, {
    merge: true
  });

const docRef =
  await db
  .collection("servicios")
  .add(payload);
await guardarMemoriaNico({

tipo: "trabajo",titulo:"Trabajo creado para " +(payload.cliente || "cliente"),contenido:Trabajo creado para ${payload.cliente}. Fecha: ${payload.fecha}. Hora: ${payload.hora}. Tipo: ${payload.tipo}. Precio: $${dinero(payload.precio_total)}. Dirección: ${payload.direccion}. Estimate: ${payload.estimate_numero}.,prioridad: "importante"});

imagenNico("bien");

agregarMensaje(

  "nico",

`✅ Trabajo real creado correctamente

📄 Estimate:${payload.estimate_numero}

🧼 Tipo:${payload.tipo}

👤 Cliente:${payload.cliente}

💵 Precio:$${dinero(payload.precio_total)}

📍 Dirección:${payload.direccion}

📅 Fecha:${payload.fecha}

⏰ Hora:${payload.hora}

🆔 Trabajo ID:${docRef.id}

Ya debe aparecer en tu Admin como pendiente.`);

nicoTrabajoPendiente =
  null;

}catch(e){

console.log(e);

agregarMensaje(
  "nico",
  "Rodri, no pude crear el trabajo en Firebase."
);

}}

async function completarTrabajoPendienteConFechaHora(mensaje){

const datos =extraerFechaHora(mensaje);

if(!datos.fecha ||!datos.hora){

agregarMensaje(
  "nico",

`Rodri, necesito fecha y hora en este formato:

2026-05-12, 09:00`);

return;

}

await crearTrabajoRealDesdeEstimate(

nicoTrabajoPendiente,

datos.fecha,

datos.hora

);}
