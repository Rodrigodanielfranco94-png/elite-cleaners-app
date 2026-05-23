// ================= NICO ADMIN FINAL LEFT PANEL + ESTIMATES + INVOICES + JOBS + PDF BUTTON + CLIENT APPROVAL + SALES MESSAGES + MEMORY =================

const PENSAR_NICO_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";

const CREAR_ESTIMATE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearEstimateNico";

const CONSULTAR_ESTIMATES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarEstimates";

const CREAR_INVOICE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearInvoiceNico";

const CONSULTAR_INVOICES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarInvoices";

const ENVIAR_CORREO_NICO_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/enviarCorreoNico";

const CREAR_RECEIPT_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearReceiptNico";

const ELITE_LOGO_URL = "assets/Logo.png";

const ELITE_REVIEW_LINK =
"https://maps.app.goo.gl/VZjAsLsYbKYhszx27?g_st=ic";

const ELITE_BASE_URL =
"https://rodrigodanielfranco94-png.github.io/elite-cleaners-app";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoActivo = false;
let nicoPensando = false;
let nicoTrabajoPendiente = null;
let nicoMensajeClientePendiente = null;
let nicoUltimoEstimadoRapido = null;
let nicoEmailDocumentoPendiente = null;

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";

nicoBox.innerHTML = `
  <button id="nicoBtn" aria-label="Abrir Nico">
    <img id="nicoFloatingAvatar" src="nico-assets/saluda.png" />
  </button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";

nicoChatPanel.innerHTML = `
  <div id="nicoHeader">
    <div id="nicoHeaderLeft">
      <div id="nicoTitleRow">
        <span id="nicoTitle">Nico</span>
        <span id="nicoOnlineDot"></span>
        <span id="nicoOnlineText">ONLINE</span>
      </div>
      <div id="nicoSubtitle">Asistente IA de Elite Cleaners</div>
    </div>
    <button id="nicoClose">×</button>
  </div>

  <div id="nicoBody">
    <div id="nicoChatMessages"></div>

    <div id="nicoInputRow">
      <textarea id="nicoChatInput" placeholder="Escríbele a Nico..."></textarea>
      <button id="nicoSend">Enviar</button>
    </div>
  </div>
`;

document.body.appendChild(nicoBox);
document.body.appendChild(nicoChatPanel);

// ================= STYLE =================

const style = document.createElement("style");
style.id = "nicoFinalStyle";

style.innerHTML = `
#nicoBox{
  position:fixed !important;
  right:18px !important;
  bottom:18px !important;
  z-index:999999 !important;
}

#nicoBtn{
  width:110px;
  height:155px;
  border:none;
  background:transparent;
  padding:0;
  cursor:pointer;
}

#nicoFloatingAvatar{
  width:100%;
  height:100%;
  object-fit:contain;
  filter:drop-shadow(0 10px 20px rgba(0,0,0,.7));
  animation:nicoFloat 3s infinite ease-in-out;
}

@keyframes nicoFloat{
  0%,100%{ transform:translateY(0px); }
  50%{ transform:translateY(-6px); }
}

#nicoChatPanel{
  display:none;
  position:fixed !important;
  left:10px !important;
  right:auto !important;
  bottom:20px !important;
  width:320px !important;
  max-width:92vw !important;
  z-index:999998 !important;
  background:linear-gradient(180deg,#071226,#020617);
  border-radius:24px;
  border:1px solid rgba(59,130,246,.45);
  overflow:hidden;
  box-shadow:0 0 24px rgba(37,99,235,.25),0 12px 40px rgba(0,0,0,.75);
  backdrop-filter:blur(12px);
}

#nicoHeader{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding:14px;
  border-bottom:1px solid rgba(59,130,246,.2);
}

#nicoTitleRow{
  display:flex;
  align-items:center;
  gap:7px;
}

#nicoTitle{
  color:white;
  font-size:24px;
  font-weight:900;
}

#nicoOnlineDot{
  width:10px;
  height:10px;
  border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 10px #22c55e;
}

#nicoOnlineText{
  color:#22c55e;
  font-size:13px;
  font-weight:800;
}

#nicoSubtitle{
  color:#cbd5e1;
  font-size:12px;
  margin-top:4px;
}

#nicoClose{
  width:44px;
  height:44px;
  border:none;
  border-radius:50%;
  background:#ef4444;
  color:white;
  font-size:24px;
  font-weight:900;
  box-shadow:0 0 16px rgba(239,68,68,.45);
}

#nicoBody{
  padding:10px;
}

#nicoChatMessages{
  display:flex;
  flex-direction:column;
  gap:8px;
  max-height:260px;
  overflow-y:auto;
  margin-bottom:10px;
}

.nicoMsg{
  padding:11px 13px;
  border-radius:15px;
  font-size:14px;
  line-height:1.4;
  white-space:pre-wrap;
  word-break:break-word;
}

.nicoMsg.user{
  align-self:flex-end;
  background:linear-gradient(135deg,#3b82f6,#2563eb);
  color:white;
}

.nicoMsg.nico{
  align-self:flex-start;
  background:rgba(39,39,42,.95);
  color:white;
}

.nicoPdfBtn{
  margin-top:10px;
  width:100%;
  border:none;
  border-radius:14px;
  padding:13px;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:white;
  font-weight:900;
  font-size:14px;
  cursor:pointer;
  box-shadow:0 0 16px rgba(37,99,235,.35);
}

#nicoInputRow{
  display:flex;
  gap:8px;
  align-items:flex-end;
}

#nicoChatInput{
  flex:1;
  min-height:58px;
  max-height:85px;
  resize:none;
  border-radius:16px;
  border:1px solid rgba(59,130,246,.5);
  background:#0b1120;
  color:white;
  padding:12px;
  font-size:14px;
  outline:none;
}

#nicoChatInput::placeholder{
  color:#94a3b8;
}

#nicoChatInput:focus{
  border-color:#3b82f6;
  box-shadow:0 0 0 2px rgba(59,130,246,.15);
}

#nicoSend{
  width:82px;
  min-height:58px;
  border:none;
  border-radius:16px;
  background:linear-gradient(135deg,#22c55e,#16a34a);
  color:white;
  font-size:15px;
  font-weight:900;
  box-shadow:0 0 18px rgba(34,197,94,.3);
}

@media(max-width:600px){
  #nicoChatPanel{
    width:320px !important;
    left:10px !important;
    bottom:16px !important;
  }

  #nicoBtn{
    width:100px;
    height:145px;
  }
}
`;

document.head.appendChild(style);

// ================= ELEMENTS =================

const nicoBtn = document.getElementById("nicoBtn");
const nicoChatPanelEl = document.getElementById("nicoChatPanel");
const nicoChatMessages = document.getElementById("nicoChatMessages");
const nicoChatInput = document.getElementById("nicoChatInput");
const nicoSend = document.getElementById("nicoSend");
const nicoClose = document.getElementById("nicoClose");
const nicoFloatingAvatar = document.getElementById("nicoFloatingAvatar");

// ================= IMAGES =================

function imagenNico(tipo){

  const imgs = {
    saluda: "nico-assets/saluda.png",
    piensa: "nico-assets/piensa.png",
    alegre: "nico-assets/alegre.png",
    rie: "nico-assets/rie.png",
    celular: "nico-assets/celular.png",
    canta: "nico-assets/canta.png",
    bien: "nico-assets/bien.png",
    reposo: "nico-assets/reposo.png"
  };

  nicoFloatingAvatar.src =
    imgs[tipo] || imgs.saluda;
}

// ================= CHAT =================

function agregarMensaje(tipo, texto){

  const div = document.createElement("div");

  div.className = `nicoMsg ${tipo}`;

  div.innerText = texto;

  nicoChatMessages.appendChild(div);

  nicoChatMessages.scrollTop =
    nicoChatMessages.scrollHeight;
  guardarConversacionNico(tipo, texto);

  return div;
}
async function guardarConversacionNico(tipo, texto){
  try{
    await db.collection("conversaciones_nico").add({
      usuario_id: window.usuarioActual?.id || "sin_usuario",
      usuario_email: window.usuarioActual?.email || "sin_email",
      usuario_nombre: window.usuarioActual?.nombre || "Rodrigo",
      tipo: tipo,
      mensaje: texto,
      fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
    });
  }catch(e){
    console.log("No se pudo guardar conversación Nico:", e);
  }
}

// ================= PDF BUTTON =================

function agregarMensajeConBotonPDF(
  texto,
  tipoDocumento,
  numeroDocumento
){

  const div = document.createElement("div");

  div.className = "nicoMsg nico";

  div.innerText = texto;

  const btn = document.createElement("button");

  btn.className = "nicoPdfBtn";

  btn.innerText =
    "📄 Ver / Descargar PDF";

  if(tipoDocumento === "invoice"){

    btn.onclick = () =>
      abrirInvoicePDF(numeroDocumento);

  }else{

    btn.onclick = () =>
      abrirEstimatePDF(numeroDocumento);
  }

  div.appendChild(btn);

  nicoChatMessages.appendChild(div);

  nicoChatMessages.scrollTop =
    nicoChatMessages.scrollHeight;

  return div;
}

// ================= OPEN / CLOSE =================

function abrirNico(){

  nicoActivo = true;

  imagenNico("saluda");

  nicoChatPanelEl.style.display =
    "block";

  if(!nicoChatMessages.dataset.saludo){

    agregarMensaje(
      "nico",
      "Hola chicos 👋 Estoy listo para ayudarles con estimates, invoices, trabajos y mensajes para clientes."
    );

    nicoChatMessages.dataset.saludo =
      "true";
  }

  setTimeout(() => {
    nicoChatInput.focus();
  }, 120);
}

function cerrarNico(){

  nicoActivo = false;

  nicoChatPanelEl.style.display =
    "none";

  imagenNico("saluda");
}

nicoBtn.onclick = () => {

  if(nicoActivo){

    cerrarNico();

  }else{

    abrirNico();
  }
};

nicoClose.onclick = cerrarNico;

// ================= HELPERS =================

function normalizarTexto(t){

  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function dinero(valor){

  const n = Number(valor || 0);

  return n.toFixed(2);
}

function obtenerValor(id){

  return (
    document.getElementById(id)
    ?.value
    ?.trim() || ""
  );
}

function hoyISO(){

  return new Date()
    .toISOString()
    .slice(0,10);
}

function sumarDiasISO(dias){

  const d = new Date();

  d.setDate(d.getDate() + dias);

  return d
    .toISOString()
    .slice(0,10);
}

function limpiarTelefono(numero){

  return (numero || "")
    .replace(/\D/g,"");
}

function abrirSMSDirecto(
  numero,
  mensaje
){

  const limpio =
    limpiarTelefono(numero);

  if(!limpio){

    alert("No hay teléfono.");

    return;
  }

  const body =
    encodeURIComponent(mensaje || "");

  const isiPhone =
    /iPad|iPhone|iPod/.test(
      navigator.userAgent
    );

  if(isiPhone){

    window.location.href =
      `sms:${limpio}&body=${body}`;

  }else{

    window.location.href =
      `sms:${limpio}?body=${body}`;
  }
}

function obtenerDatosFormularioActual(){

  return {

    cliente_nombre:
      obtenerValor("cliente"),

    cliente_email:
      obtenerValor("email_cliente"),

    cliente_telefono:
      limpiarTelefono(
        obtenerValor("whatsapp")
      ),

    cliente_direccion:
      obtenerValor("direccion"),

    tipo_limpieza:
      typeof tipoSeleccionado !==
      "undefined"
      ? tipoSeleccionado
      : "",

    notes:
      obtenerValor("notas"),

    total:
      Number(
        obtenerValor("precio_total")
        || 0
      ),

millas_servicio:
  Number(obtenerValor("millas_servicio") || 0),
    
    fecha:
      obtenerValor("fecha"),

    hora:
      obtenerValor("hora")
  };
}

function extraerNombreDesdeComando(texto){

  let t = texto.trim();

  t = t
    .replace(/nico/ig,"")
    .replace(/crea/ig,"")
    .replace(/crear/ig,"")
    .replace(/estimate/ig,"")
    .replace(/estimado/ig,"")
    .replace(/cotizacion/ig,"")
    .replace(/cotización/ig,"")
    .replace(/de /ig,"")
    .trim();

  return t;
}

function extraerNumeroDocumento(texto){

  const match = texto.match(
    /(EST|INV|REC)-[A-Z0-9-]+/i
  );

  return match
    ? match[0].toUpperCase()
    : "";
}

function extraerFechaHora(texto){

  const fechaMatch = texto.match(
    /\d{4}-\d{2}-\d{2}/
  );

  const horaMatch = texto.match(
    /\d{1,2}:\d{2}/
  );

  return {
    fecha:
      fechaMatch
      ? fechaMatch[0]
      : "",

    hora:
      horaMatch
      ? horaMatch[0]
      : ""
  };
}

function buscarDatosCliente(nombre){

  const nombreNorm =
    normalizarTexto(nombre);

  let cliente = null;
  let servicio = null;

  if(
    typeof todosLosClientes !==
    "undefined"
  ){

    cliente =
      todosLosClientes.find(c =>

        normalizarTexto(
          c.nombre || c.id || ""
        ).includes(nombreNorm)

        ||

        nombreNorm.includes(
          normalizarTexto(
            c.nombre || c.id || ""
          )
        )
      );
  }

  if(
    typeof todosLosServicios !==
    "undefined"
  ){

    servicio =
      [...todosLosServicios]
      .reverse()
      .find(s =>

        normalizarTexto(
          s.cliente || ""
        ).includes(nombreNorm)

        ||

        nombreNorm.includes(
          normalizarTexto(
            s.cliente || ""
          )
        )
      );
  }

  return {
    cliente,
    servicio
  };
}

// ================= CLIENT MESSAGES =================

function prepararMensajeCliente({
  telefono,
  mensaje,
  cliente
}){

  if(!telefono){

    agregarMensaje(
      "nico",
      "Rodri, el cliente no tiene teléfono."
    );

    return;
  }

  nicoMensajeClientePendiente = {
    telefono,
    mensaje
  };

  agregarMensaje(
    "nico",

`⚠️ MENSAJE PENDIENTE DE APROBACIÓN

Cliente:
${cliente || "Cliente"}

Mensaje en inglés que se enviará:

${mensaje}

Si todo está correcto escribe:

APROBAR

Si no quieres enviarlo escribe:

CANCELAR`
  );
}

function confirmarEnvioCliente(){

  if(!nicoMensajeClientePendiente){

    agregarMensaje(
      "nico",
      "No hay mensajes pendientes."
    );

    return;
  }

  abrirSMSDirecto(
    nicoMensajeClientePendiente.telefono,
    nicoMensajeClientePendiente.mensaje
  );

  agregarMensaje(
    "nico",
    "✅ Perfecto Rodri. Abrí el SMS listo para enviarse al cliente."
  );

  imagenNico("bien");

  nicoMensajeClientePendiente = null;
}

function cancelarEnvioCliente(){

  nicoMensajeClientePendiente = null;

  agregarMensaje(
    "nico",
    "❌ Mensaje cancelado. No se enviará nada al cliente."
  );
}

// ================= CONTRACT =================

function prepararContratoCliente(){

  const datos =
    obtenerDatosFormularioActual();

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

`${ELITE_BASE_URL}/firmar.html?cliente=${encodeURIComponent(
  datos.cliente_nombre
)}`;

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
  });
}

// ================= REVIEW =================

function prepararReviewCliente(){

  const datos =
    obtenerDatosFormularioActual();

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
  });
}

// ================= REMINDER =================

function prepararRecordatorioCliente(){

  const datos =
    obtenerDatosFormularioActual();

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

📅 Date: ${datos.fecha || "TBD"}
⏰ Time: ${datos.hora || "TBD"}
👤 Staff: ${staff}

We look forward to seeing you.

Please let us know if you have any questions.`;

  prepararMensajeCliente({

    telefono:
      datos.cliente_telefono,

    mensaje,

    cliente:
      datos.cliente_nombre
  });
}

// ================= SALES MESSAGE =================

function prepararMensajeVenta(
  nombreCliente = ""
){

  let datos =
    obtenerDatosFormularioActual();

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
  });
}

// ================= PAYLOADS =================

function construirPayloadEstimateDesdeDatos(datos){

  const cleaningTotal = Number(datos.total || 0);
  const millasServicio = Number(datos.millas_servicio || 0);
  const mileageRate = 0.67;
  const travelFee = millasServicio * mileageRate;
  const totalFinal = cleaningTotal + travelFee;

  return {
    cliente_nombre: datos.cliente_nombre || "",
    cliente_email: datos.cliente_email || "",
    cliente_telefono: limpiarTelefono(datos.cliente_telefono),
    cliente_direccion: datos.cliente_direccion || "",
    tipo_limpieza: datos.tipo_limpieza || "",

    notes:
`${datos.notes || ""}

--------------------------------

Mileage / Travel Fee

• ${millasServicio} miles round trip
• $${dinero(mileageRate)} per mile
• Travel Fee: $${dinero(travelFee)}`,
    cleaning_total: cleaningTotal,
    millas_servicio: millasServicio,
    mileage_rate: mileageRate,
    travel_fee: Number(travelFee.toFixed(2)),

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
  };
}
function construirPayloadInvoiceDesdeEstimate(
  estimate
){

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
  };
}

function construirTrabajoDesdeEstimate(
  estimate,
  fecha,
  hora
){

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

travel_fee:
  Number(estimate.travel_fee || 0),

cleaning_total:
  Number(estimate.cleaning_total || estimate.total || 0),

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
  };
}

// ================= ESTIMATES =================

async function crearEstimateConDatos(
  datos
){

  if(!datos.cliente_nombre){

    agregarMensaje(
      "nico",
      "Rodri, falta el nombre del cliente para crear el estimate."
    );

    return;
  }

  if(
    !datos.total ||
    Number(datos.total) <= 0
  ){

    agregarMensaje(
      "nico",
      "Rodri, falta el precio total."
    );

    return;
  }

  imagenNico("celular");

  const payload =
    construirPayloadEstimateDesdeDatos(
      datos
    );

  const res = await fetch(
    CREAR_ESTIMATE_URL,
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
      "Rodri, no pude crear el estimate."
    );

    return;
  }

  const numero =
    data.estimate.numero;

  imagenNico("bien");

  agregarMensajeConBotonPDF(

`✅ Estimate creado correctamente

👤 Cliente:
${payload.cliente_nombre}

🧼 Tipo:
${payload.tipo_limpieza || "Sin tipo"}

💵 Cleaning:
$${dinero(payload.cleaning_total)}

🚗 Travel Fee:
$${dinero(payload.travel_fee)}

📍 Millas ida/vuelta:
${payload.millas_servicio}

💰 Total:
$${dinero(payload.total)}

📍 Dirección:
${payload.cliente_direccion || "Sin dirección"}

📄 Estimate:
${numero}`,

    "estimate",
    numero
  );
}

async function obtenerEstimates(){

  const res = await fetch(
    CONSULTAR_ESTIMATES_URL
  );

  const data = await res.json();

  return data.estimates || [];
}

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

Tipo:
${e.tipo_limpieza || "Sin tipo"}

Total:
$${dinero(e.total)}

Estimate:
${e.numero || "Sin número"}

Para verlo:
ver estimate ${e.numero || ""}

\n`;
    });

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
  }
}

// ================= INVOICES =================

async function convertirEstimateAInvoice(
  numeroEstimate
){

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

    imagenNico("bien");

    agregarMensajeConBotonPDF(

`✅ Invoice creado desde estimate

📄 Estimate:
${estimate.numero}

🧾 Invoice:
${numeroInvoice}

👤 Cliente:
${payload.cliente_nombre}

🧼 Tipo:
${payload.tipo_limpieza || "Sin tipo"}

💵 Total:
$${dinero(payload.total)}

📍 Dirección:
${payload.cliente_direccion || "Sin dirección"}`,

      "invoice",
      numeroInvoice
    );

  }catch(e){

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, hubo un error convirtiendo el estimate a invoice."
    );
  }
}

async function obtenerInvoices(){

  const res = await fetch(
    CONSULTAR_INVOICES_URL
  );

  const data = await res.json();

  return data.invoices || [];
}

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

Total:
$${dinero(
  inv.total ||
  inv.amount_due ||
  inv.balance_due
)}

Invoice:
${inv.numero || inv.invoice_numero || "Sin número"}

Para verlo:
ver invoice ${inv.numero || inv.invoice_numero || ""}

\n`;
    });

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
  }
}

// ================= JOBS =================

async function convertirEstimateATrabajo(
  numeroEstimate
){

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

2026-05-12, 09:00`
      );

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
  }
}

async function crearTrabajoRealDesdeEstimate(
  estimate,
  fecha,
  hora
){

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

    imagenNico("bien");

    agregarMensaje(

      "nico",

`✅ Trabajo real creado correctamente

📄 Estimate:
${payload.estimate_numero}

🧼 Tipo:
${payload.tipo}

👤 Cliente:
${payload.cliente}

💵 Precio:
$${dinero(payload.precio_total)}

📍 Dirección:
${payload.direccion}

📅 Fecha:
${payload.fecha}

⏰ Hora:
${payload.hora}

🆔 Trabajo ID:
${docRef.id}

Ya debe aparecer en tu Admin como pendiente.`
    );

    nicoTrabajoPendiente =
      null;

  }catch(e){

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, no pude crear el trabajo en Firebase."
    );
  }
}

async function completarTrabajoPendienteConFechaHora(
  mensaje
){

  const datos =
    extraerFechaHora(mensaje);

  if(
    !datos.fecha ||
    !datos.hora
  ){

    agregarMensaje(
      "nico",

`Rodri, necesito fecha y hora en este formato:

2026-05-12, 09:00`
    );

    return;
  }

  await crearTrabajoRealDesdeEstimate(

    nicoTrabajoPendiente,

    datos.fecha,

    datos.hora
  );
}

// ================= DOCUMENT PDF =================

function escribirDocumentoPDF(nuevaVentana, tipo, doc){
  const isInvoice = tipo === "invoice";
  const titulo = isInvoice ? "INVOICE" : "ESTIMATE";
  const numero = doc.numero || doc.invoice_numero || "";
  const total = dinero(doc.total || doc.amount_due || doc.balance_due || 0);
  const status = doc.status || (isInvoice ? "Unpaid" : "Draft");

  nuevaVentana.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${numero}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;margin:0;padding:30px;color:#111827;}
  .page{max-width:800px;margin:0 auto;background:white;padding:45px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.12);}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e5e7eb;padding-bottom:25px;margin-bottom:30px;}
  .logo{width:190px;height:auto;}
  .title{text-align:right;}
  .title h1{margin:0;font-size:38px;color:#1f2937;letter-spacing:1px;}
  .doc-number{margin-top:8px;color:#6b7280;font-size:14px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px;}
  .section-title{font-size:13px;color:#2563eb;font-weight:bold;text-transform:uppercase;margin-bottom:8px;}
  .info{font-size:15px;line-height:1.55;}
  table{width:100%;border-collapse:collapse;margin-top:25px;}
  th{background:#1f2937;color:white;text-align:left;padding:12px;font-size:13px;text-transform:uppercase;}
  td{border-bottom:1px solid #e5e7eb;padding:14px 12px;font-size:14px;vertical-align:top;}
  .right{text-align:right;}
  .notes{
  margin-top:30px;
  padding:18px;
  background:#f9fafb;
  border-left:4px solid #2563eb;
  font-size:14px;
  line-height:1.5;
  white-space:pre-line;
}
  .total-box{margin-top:30px;display:flex;justify-content:flex-end;}
  .total-inner{width:300px;border-top:2px solid #111827;padding-top:15px;}
  .total-row{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;}
  .total-price{color:#16a34a;font-size:28px;}
  .footer{margin-top:45px;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;padding-top:18px;}
  .btns{max-width:800px;margin:20px auto;display:flex;gap:10px;justify-content:center;}
  button{border:none;border-radius:10px;padding:14px 22px;font-size:15px;font-weight:bold;cursor:pointer;}
  .download{background:#2563eb;color:white;}
  .close{background:#111827;color:white;}
  @media print{body{background:white;padding:0;}.page{box-shadow:none;border-radius:0;max-width:none;}.btns{display:none;}}
</style>
</head>

<body>
  <div class="page">
    <div class="top">
      <div>
        <img class="logo" src="${ELITE_LOGO_URL}" />
        <div class="info" style="margin-top:12px;">
          <strong>Elite Cleaners Company</strong><br>
          Pleasanton, CA 94566<br>
          elitecleanerscompany@gmail.com<br>
          +1 (925) 336-2884
        </div>
      </div>

      <div class="title">
        <h1>${titulo}</h1>
        <div class="doc-number">${numero}</div>
        <div class="doc-number">Date: ${doc.fecha || hoyISO()}</div>
        ${
          isInvoice
          ? `<div class="doc-number">Due Date: ${doc.due_date || ""}</div>`
          : `<div class="doc-number">Valid Until: ${doc.valid_until || doc.fecha || ""}</div>`
        }
        <div class="doc-number">Status: ${status}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="section-title">Bill To</div>
        <div class="info">
          <strong>${doc.cliente_nombre || ""}</strong><br>
          ${doc.cliente_email || ""}<br>
          ${doc.cliente_telefono || ""}<br>
          ${doc.cliente_direccion || ""}
        </div>
      </div>

      <div>
        <div class="section-title">Service Details</div>
        <div class="info">
          <strong>Cleaning Type:</strong> ${doc.tipo_limpieza || ""}<br>
          ${doc.estimate_numero ? `<strong>From Estimate:</strong> ${doc.estimate_numero}<br>` : ""}
          <strong>Created By:</strong> Nico
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th class="right">Price</th>
          <th class="right">Quantity</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${
          (doc.items && doc.items.length)
          ? doc.items.map(item => `
            <tr>
              <td>${item.description || doc.tipo_limpieza || "Cleaning Service"}</td>
              <td class="right">$${dinero(item.price || doc.total)}</td>
              <td class="right">${item.quantity || 1}</td>
              <td class="right">$${dinero(item.total || doc.total)}</td>
            </tr>
          `).join("")
          : `
            <tr>
              <td>${doc.tipo_limpieza || "Cleaning Service"}</td>
              <td class="right">$${total}</td>
              <td class="right">1</td>
              <td class="right">$${total}</td>
            </tr>
          `
        }
      </tbody>
    </table>

    <div class="notes">
      <strong>Notes:</strong><br>
      ${doc.notes || "Includes supplies, equipment, and all work materials. This document does not include additional services not requested in the initial inquiry."}
    </div>

    <div class="total-box">
      <div class="total-inner">
        <div class="total-row">
          <span>${isInvoice ? "Balance Due" : "Estimate Total"}</span>
          <span class="total-price">$${total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      Thank you for choosing Elite Cleaners Company.<br>
      ${isInvoice ? "Payment is due according to the agreed terms." : "This is an estimate and may be adjusted if additional services are requested."}
    </div>
  </div>

  <div class="btns">
    <button class="download" onclick="window.print()">Download / Print PDF</button>
    <button class="close" onclick="window.close()">Close</button>
  </div>
</body>
</html>
  `);

  nuevaVentana.document.close();
}

async function abrirEstimatePDF(numeroEstimate){

  try{
    imagenNico("celular");

    const estimates =
      await obtenerEstimates();

    const estimate =
      estimates.find(e =>
        normalizarTexto(e.numero || "").includes(
          normalizarTexto(numeroEstimate || "")
        )
      );

    if(!estimate){
      agregarMensaje(
        "nico",
        "Rodri, no encontré ese estimate."
      );
      return;
    }

    const nuevaVentana =
      window.open("", "_blank");

    if(!nuevaVentana){
      agregarMensaje(
        "nico",
        "Rodri, el navegador bloqueó la ventana. Permite pop-ups para abrir el PDF."
      );
      return;
    }

    escribirDocumentoPDF(
      nuevaVentana,
      "estimate",
      estimate
    );

    agregarMensaje(
      "nico",
      "✅ Estimate abierto correctamente. Desde ahí puedes descargarlo o imprimirlo como PDF."
    );

    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje(
      "nico",
      "❌ Error abriendo estimate."
    );
  }
}

async function abrirInvoicePDF(numeroInvoice){

  try{
    imagenNico("celular");

    const invoices =
      await obtenerInvoices();

    const invoice =
      invoices.find(inv =>
        normalizarTexto(
          inv.numero || inv.invoice_numero || ""
        ).includes(
          normalizarTexto(numeroInvoice || "")
        )
      );

    if(!invoice){
      agregarMensaje(
        "nico",
        "Rodri, no encontré ese invoice."
      );
      return;
    }

    const nuevaVentana =
      window.open("", "_blank");

    if(!nuevaVentana){
      agregarMensaje(
        "nico",
        "Rodri, el navegador bloqueó la ventana. Permite pop-ups para abrir el PDF."
      );
      return;
    }

    escribirDocumentoPDF(
      nuevaVentana,
      "invoice",
      invoice
    );

    agregarMensaje(
      "nico",
      "✅ Invoice abierto correctamente. Desde ahí puedes descargarlo o imprimirlo como PDF."
    );

    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje(
      "nico",
      "❌ Error abriendo invoice."
    );
  }
}

// ================= MEMORIA NICO =================

async function guardarMemoriaNico({

  tipo = "general",

  titulo = "",

  contenido = "",

  prioridad = "normal"

}){

  try{

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

const snapshot =

  await db
  .collection("memoria_nico")
  .where("usuario_nombre", "in", [
    usuarioNombre,
    "General"
  ])
  .limit(50)
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

// ================= THINK =================

async function pensarConNico(
  mensaje
){

  try{

    imagenNico("piensa");

    const memorias =
      await obtenerMemoriasNico();

    const contextoMemoria =

      memorias
      .map(m =>
        `- ${m.contenido}`
      )
      .join("\n");

 const nombreUsuario =
  window.usuarioActual?.nombre || "Rodrigo";

const mensajeConMemoria =

`USUARIO ACTUAL DEL SISTEMA:

${nombreUsuario}

MEMORIA PERMANENTE DE NICO:

${contextoMemoria || "Sin memorias guardadas todavía."}

MENSAJE DEL USUARIO:

${mensaje}`;
    const res = await fetch(
      PENSAR_NICO_URL,
      {

        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          mensaje:
            mensajeConMemoria
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

    console.log(e);

    return "Rodri, hubo un problema conectando con Nico.";
  }
}
// ================= NICO PRICING / ESTIMATE DESDE TEXTO =================

const NICO_PRICING = {
  "ESTÁNDAR": {
    base: 120,
    habitacion: 20,
    bano: 30
  },

  "PROFUNDA": {
    base: 180,
    habitacion: 25,
    bano: 40
  },

  "MOVE-IN": {
    base: 220,
    habitacion: 30,
    bano: 45
  },

  "MOVE-OUT": {
    base: 220,
    habitacion: 30,
    bano: 45
  },

  "POST-CONSTRUCCIÓN": {
    base: 260,
    habitacion: 35,
    bano: 50
  },

  extras: {
    nevera: 25,
    horno: 25,
    gabinetes: 40,
    ventanas: 45,
    baseboards: 35
  }
};

function extraerNumeroPorPalabra(texto, palabras){
  const t = normalizarTexto(texto);

  for(const palabra of palabras){
    const regex = new RegExp("(\\d+)\\s*(?:de\\s*)?" + palabra, "i");
    const match = t.match(regex);
    if(match) return Number(match[1]);
  }

  return 0;
}

function detectarTipoLimpiezaDesdeTexto(texto){
  const t = normalizarTexto(texto);

  if(t.includes("post construccion") || t.includes("post-construccion")){
    return "POST-CONSTRUCCIÓN";
  }

  if(t.includes("move in") || t.includes("move-in")){
    return "MOVE-IN";
  }

  if(t.includes("move out") || t.includes("move-out")){
    return "MOVE-OUT";
  }

  if(t.includes("profunda") || t.includes("deep")){
    return "PROFUNDA";
  }

  if(t.includes("estandar") || t.includes("standard")){
    return "ESTÁNDAR";
  }

  return "ESTÁNDAR";
}

function calcularEstimateDesdeTexto(mensaje){
  const t = normalizarTexto(mensaje);

  const tipo = detectarTipoLimpiezaDesdeTexto(mensaje);

  const habitaciones = extraerNumeroPorPalabra(t, [
    "habitaciones",
    "habitacion",
    "cuartos",
    "bedrooms",
    "rooms"
  ]);

  const banos = extraerNumeroPorPalabra(t, [
    "banos",
    "bano",
    "bathrooms",
    "bathroom",
    "baths",
    "bath"
  ]);

  const extras = [];

  if(t.includes("nevera") || t.includes("refrigerador") || t.includes("fridge")){
    extras.push("nevera");
  }

  if(t.includes("horno") || t.includes("oven")){
    extras.push("horno");
  }

  if(t.includes("gabinete") || t.includes("gabinetes") || t.includes("cabinets")){
    extras.push("gabinetes");
  }

  if(t.includes("ventana") || t.includes("ventanas") || t.includes("windows")){
    extras.push("ventanas");
  }

  if(
    t.includes("baseboard") ||
    t.includes("baseboards") ||
    t.includes("zocalo") ||
    t.includes("zocalos") ||
    t.includes("base or") ||
    t.includes("bases")
  ){
    extras.push("baseboards");
  }

  const reglas = NICO_PRICING[tipo] || NICO_PRICING["ESTÁNDAR"];

  let total = reglas.base;

  total += habitaciones * reglas.habitacion;
  total += banos * reglas.bano;

  extras.forEach(extra => {
    total += NICO_PRICING.extras[extra] || 0;
  });

  const notes = [
    `${habitaciones || 0} habitaciones`,
    `${banos || 0} baños`,
    extras.length ? `Extras: ${extras.join(", ")}` : "",
    `Tipo de limpieza: ${tipo}`
  ].filter(Boolean).join(" | ");

  return {
    tipo_limpieza: tipo,
    habitaciones,
    banos,
    extras,
    total,
    notes
  };
}

function esSolicitudDeEstimadoRapido(texto){
  const t = normalizarTexto(texto);

  return (
    t.includes("estimado") ||
    t.includes("estimate") ||
    t.includes("cotizacion") ||
    t.includes("cotización") ||
    t.includes("precio") ||
    t.includes("cuanto") ||
    t.includes("cuánto")
  ) && (
    t.includes("habitacion") ||
    t.includes("habitaciones") ||
    t.includes("bano") ||
    t.includes("banos") ||
    t.includes("bath") ||
    t.includes("bedroom") ||
    t.includes("limpieza") ||
    t.includes("cleaning")
  );
}

function responderEstimadoRapido(mensaje){

  const calculo =
    calcularEstimateDesdeTexto(mensaje);

  nicoUltimoEstimadoRapido =
    calculo;

  if(document.getElementById("precio_total")){
    document.getElementById("precio_total").value =
      calculo.total;
  }

  if(document.getElementById("notas")){
    document.getElementById("notas").value =
      calculo.notes;
  }

  const cliente =
    obtenerValor("cliente");

  const direccion =
    obtenerValor("direccion");

  const telefono =
    obtenerValor("whatsapp");

  const email =
    obtenerValor("email_cliente");

  let faltantes = [];

  if(!cliente) faltantes.push("nombre");
  if(!direccion) faltantes.push("dirección");
  if(!telefono) faltantes.push("teléfono");
  if(!email) faltantes.push("email");

  agregarMensaje(
    "nico",

`✅ Perfecto Rodri, ya calculé el estimado aproximado.

🧼 Tipo:
${calculo.tipo_limpieza}

🛏️ Habitaciones:
${calculo.habitaciones || 0}

🚿 Baños:
${calculo.banos || 0}

➕ Extras:
${calculo.extras.length ? calculo.extras.join(", ") : "Sin extras"}

💵 Total estimado:
$${dinero(calculo.total)}

📝 Notas:
${calculo.notes}

Ya coloqué el precio y las notas automáticamente en el formulario.

${
  faltantes.length
  ? `Para crear el PDF todavía faltan:\n\n• ${faltantes.join("\n• ")}`
  : `🔥 Todo está listo para crear el Estimate PDF.\n\nSi quieres crearlo ahora, escribe:\n\nCREAR PDF`
}`
  );

  imagenNico("bien");

  return calculo;
}
// ================= EMAIL DOCUMENTS =================

let nicoEmailPendiente = null;

function prepararEmailDocumento(tipo, doc){
  const isInvoice = tipo === "invoice";
  const numero = doc.numero || doc.invoice_numero || "";
  const email = doc.cliente_email || "";

  if(!email){
    agregarMensaje("nico", "Rodri, este cliente no tiene email guardado.");
    return;
  }

  const asunto = isInvoice
    ? `Invoice ${numero} - Elite Cleaners Company`
    : `Estimate ${numero} - Elite Cleaners Company`;

  const mensaje = isInvoice
    ? `Hello ${doc.cliente_nombre || "there"},

Thank you for choosing Elite Cleaners Company.

Your invoice ${numero} is ready.

Total Due: $${dinero(doc.total || doc.amount_due || doc.balance_due || 0)}

Please let us know if you have any questions.

Best regards,
Elite Cleaners Company`
    : `Hello ${doc.cliente_nombre || "there"},

Thank you for considering Elite Cleaners Company.

Your estimate ${numero} is ready.

Estimated Total: $${dinero(doc.total || 0)}

Please let us know if you have any questions or if you would like to schedule your cleaning service.

Best regards,
Elite Cleaners Company`;

  nicoEmailPendiente = {
    para: email,
    asunto,
    mensaje
  };

  agregarMensaje("nico",
`⚠️ EMAIL PENDIENTE DE APROBACIÓN

Para:
${email}

Asunto:
${asunto}

Mensaje:

${mensaje}

Si todo está correcto escribe:

APROBAR EMAIL

Si no quieres enviarlo escribe:

CANCELAR EMAIL`
  );
}

async function enviarEmailPendiente(){
  if(!nicoEmailPendiente){
    agregarMensaje("nico", "Rodri, no hay ningún email pendiente.");
    return;
  }

  imagenNico("celular");

  const res = await fetch(ENVIAR_CORREO_NICO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nicoEmailPendiente)
  });

  const data = await res.json();

  if(!res.ok || !data.ok){
    console.log(data);
    agregarMensaje("nico", "Rodri, no pude enviar el email.");
    return;
  }

  agregarMensaje("nico", "✅ Email enviado correctamente desde Elite Cleaners Company.");
  imagenNico("bien");
  nicoEmailPendiente = null;
}

function cancelarEmailPendiente(){
  nicoEmailPendiente = null;
  agregarMensaje("nico", "❌ Email cancelado. No se envió nada.");
}

async function prepararEnvioEstimateEmail(numeroEstimate){
  const estimates = await obtenerEstimates();

  const estimate = estimates.find(e =>
    normalizarTexto(e.numero || "").includes(normalizarTexto(numeroEstimate || ""))
  );

  if(!estimate){
    agregarMensaje("nico", "Rodri, no encontré ese estimate.");
    return;
  }

  prepararEmailDocumento("estimate", estimate);
}

async function prepararEnvioInvoiceEmail(numeroInvoice){
  const invoices = await obtenerInvoices();

  const invoice = invoices.find(inv =>
    normalizarTexto(inv.numero || inv.invoice_numero || "").includes(normalizarTexto(numeroInvoice || ""))
  );

  if(!invoice){
    agregarMensaje("nico", "Rodri, no encontré ese invoice.");
    return;
  }

  prepararEmailDocumento("invoice", invoice);
}
// ================= SEND =================

async function enviarTextoANico(){

  const mensaje =
    nicoChatInput.value.trim();

  if(!mensaje || nicoPensando) return;

  nicoChatInput.value = "";

  agregarMensaje("user", mensaje);

// ================= EMAIL PENDIENTE =================

if(
  nicoEmailDocumentoPendiente &&
  (
    mensaje.toUpperCase().includes("INV-") ||
    mensaje.toUpperCase().includes("EST-")
  )
){

  const numeroDocumento = extraerNumeroDocumento(mensaje);

  if(!numeroDocumento){
    agregarMensaje("nico", "Rodri, no pude leer el número del documento.");
    return;
  }

  if(nicoEmailDocumentoPendiente === "invoice"){
    await prepararEnvioInvoiceEmail(numeroDocumento);
  }

  if(nicoEmailDocumentoPendiente === "estimate"){
    await prepararEnvioEstimateEmail(numeroDocumento);
  }

  nicoEmailDocumentoPendiente = null;

  return;
}
  
  const t = normalizarTexto(mensaje);
  // ================= APROBAR / CANCELAR EMAIL =================

if(t === "aprobar email" || t === "approve email"){
  await enviarEmailPendiente();
  return;
}

if(t === "cancelar email" || t === "cancel email"){
  cancelarEmailPendiente();
  return;
}

// ================= ENVIAR ESTIMATE POR EMAIL =================

if(
  t.includes("enviar estimate") ||
  t.includes("mandar estimate") ||
  t.includes("send estimate")
){
  const numero = extraerNumeroDocumento(mensaje);

  if(!numero){
    agregarMensaje("nico", "Rodri, dime cuál estimate quieres enviar. Ejemplo: enviar estimate EST-XXXXX");
    nicoEmailDocumentoPendiente = "estimate";
    return;
  }

  await prepararEnvioEstimateEmail(numero);
  return;
}

// ================= ENVIAR INVOICE POR EMAIL =================

if(
  t.includes("enviar invoice") ||
  t.includes("mandar invoice") ||
  t.includes("send invoice")
){
  const numero = extraerNumeroDocumento(mensaje);

  if(!numero){
    agregarMensaje("nico", "Rodri, dime cuál invoice quieres enviar. Ejemplo: enviar invoice INV-XXXXX");
    nicoEmailDocumentoPendiente = "invoice";
    return;
  }

  await prepararEnvioInvoiceEmail(numero);
  return;
}
    // ================= ESTIMADO RÁPIDO DESDE TEXTO =================

  if(esSolicitudDeEstimadoRapido(mensaje)){

    const calculo =
      responderEstimadoRapido(mensaje);

    const quiereCrear =
      t.includes("crear") ||
      t.includes("crea") ||
      t.includes("haz") ||
      t.includes("hacer") ||
      t.includes("create");

    if(quiereCrear){

      const datosFormulario =
        obtenerDatosFormularioActual();

      const datosEstimate = {
        ...datosFormulario,
        tipo_limpieza: calculo.tipo_limpieza,
        notes: calculo.notes,
        total: calculo.total
      };

      if(
        !datosEstimate.cliente_nombre ||
        !datosEstimate.cliente_direccion
      ){
        agregarMensaje(
          "nico",
          "Rodri, ya calculé el precio y lo puse en el formulario, pero falta el nombre del cliente o la dirección para crear el PDF."
        );
        return;
      }

      await crearEstimateConDatos(datosEstimate);
      return;
    }

    return;
  }

  // ================= CREAR PDF DESDE ÚLTIMO ESTIMADO =================

  if(
    t === "crear pdf" ||
    t === "create pdf" ||
    t === "crear estimate pdf" ||
    t === "create estimate"
  ){

    if(!nicoUltimoEstimadoRapido){
      agregarMensaje(
        "nico",
        "Rodri, todavía no tengo ningún estimado calculado. Primero dime los detalles de la limpieza."
      );
      return;
    }

    const datosFormulario =
      obtenerDatosFormularioActual();

    const datosFinales = {
      ...datosFormulario,
      tipo_limpieza: nicoUltimoEstimadoRapido.tipo_limpieza,
      notes: nicoUltimoEstimadoRapido.notes,
      total: nicoUltimoEstimadoRapido.total
    };

    if(
      !datosFinales.cliente_nombre ||
      !datosFinales.cliente_direccion
    ){
      agregarMensaje(
        "nico",
        "Rodri, para crear el PDF necesito al menos el nombre del cliente y la dirección en el formulario."
      );
      return;
    }

    await crearEstimateConDatos(datosFinales);
    return;
  }
  // ================= GUARDAR MEMORIA =================

  if(
    t.includes("recuerda que") ||
    t.includes("remember that")
  ){
    const contenido = mensaje
      .replace(/nico/ig,"")
      .replace(/recuerda que/ig,"")
      .replace(/remember that/ig,"")
      .trim();

    if(!contenido){
      agregarMensaje(
        "nico",
        "Rodri, dime qué quieres que recuerde. Ejemplo: Nico, recuerda que los clientes solo hablan inglés."
      );
      return;
    }

    await guardarMemoriaNico({
      tipo: "general",
      titulo:
  "Memoria guardada por " +
  (window.usuarioActual?.nombre || "Rodrigo"),
      contenido,
      prioridad: "normal"
    });

    return;
  }

  // ================= APROBAR MENSAJE =================

  if(
    t === "aprobar" ||
    t === "approve"
  ){
    confirmarEnvioCliente();
    return;
  }

  // ================= CANCELAR MENSAJE =================

  if(
    t === "cancelar" ||
    t === "cancel"
  ){
    cancelarEnvioCliente();
    return;
  }

  // ================= ENVIAR CONTRATO =================

  if(
    t.includes("enviar contrato") ||
    t.includes("mandar contrato") ||
    t.includes("send contract") ||
    t.includes("agreement")
  ){
    prepararContratoCliente();
    return;
  }

  // ================= PEDIR RESEÑA =================

  if(
    t.includes("pedir reseña") ||
    t.includes("solicitar reseña") ||
    t.includes("google review") ||
    t.includes("review")
  ){
    prepararReviewCliente();
    return;
  }

  // ================= RECORDATORIO =================

  if(
    t.includes("recordatorio") ||
    t.includes("reminder")
  ){
    prepararRecordatorioCliente();
    return;
  }

  // ================= MENSAJE DE VENTA =================

  if(
    t.includes("mensaje de venta") ||
    t.includes("vender") ||
    t.includes("venta") ||
    t.includes("deep clean")
  ){
    let nombreCliente = mensaje
      .replace(/nico/ig,"")
      .replace(/crea/ig,"")
      .replace(/crear/ig,"")
      .replace(/un mensaje/ig,"")
      .replace(/mensaje de venta/ig,"")
      .replace(/mensaje para vender/ig,"")
      .replace(/vender/ig,"")
      .replace(/deep clean/ig,"")
      .replace(/clientes recurrentes/ig,"")
      .replace(/\ba\b/ig,"")
      .trim();

    prepararMensajeVenta(nombreCliente);
    return;
  }

  // ================= COMPLETAR TRABAJO PENDIENTE =================

  if(nicoTrabajoPendiente){
    await completarTrabajoPendienteConFechaHora(mensaje);
    return;
  }

  // ================= CONVERTIR ESTIMATE A TRABAJO =================

  if(
    (
      t.includes("convierte") ||
      t.includes("convertir") ||
      t.includes("pasa") ||
      t.includes("pasar")
    ) &&
    t.includes("estimate") &&
    (
      t.includes("trabajo") ||
      t.includes("servicio") ||
      t.includes("job")
    )
  ){
    const numeroEstimate =
      extraerNumeroDocumento(mensaje);

    if(!numeroEstimate){
      agregarMensaje(
        "nico",
        "Rodri, dime cuál estimate quieres convertir."
      );
      return;
    }

    await convertirEstimateATrabajo(numeroEstimate);
    return;
  }

  // ================= CONVERTIR ESTIMATE A INVOICE =================

  if(
    (
      t.includes("convierte") ||
      t.includes("convertir") ||
      t.includes("pasa") ||
      t.includes("pasar")
    ) &&
    t.includes("estimate") &&
    t.includes("invoice")
  ){
    const numeroEstimate =
      extraerNumeroDocumento(mensaje);

    if(!numeroEstimate){
      agregarMensaje(
        "nico",
        "Rodri, dime cuál estimate quieres convertir."
      );
      return;
    }

    await convertirEstimateAInvoice(numeroEstimate);
    return;
  }
// ================= CREAR INVOICE DESDE CLIENTE =================

if(
  t.includes("crear invoice") ||
  t.includes("crea invoice") ||
  t.includes("create invoice")
){

  let nombreCliente = mensaje
    .replace(/nico/ig,"")
    .replace(/crear/ig,"")
    .replace(/crea/ig,"")
    .replace(/create/ig,"")
    .replace(/invoice/ig,"")
    .replace(/\bde\b/ig,"")
    .replace(/[,.]/g,"")
    .trim();

  if(!nombreCliente){

    agregarMensaje(
      "nico",
      "Rodri, dime el nombre del cliente."
    );

    return;
  }

  const estimates =
    await obtenerEstimates();

  const nombreBuscado =
    normalizarTexto(nombreCliente);

  const estimate =
    [...estimates]
    .reverse()
    .find(e => {

      const nombreEstimate =
        normalizarTexto(e.cliente_nombre || "");

      return (
        nombreEstimate.includes(nombreBuscado) ||
        nombreBuscado.includes(nombreEstimate)
      );
    });

  if(!estimate){

    agregarMensaje(
      "nico",
      `Rodri, no encontré estimates de ${nombreCliente}.`
    );

    return;
  }

  await convertirEstimateAInvoice(
    estimate.numero
  );

  return;
}
  // ================= MOSTRAR INVOICES =================

  if(
    t.includes("mostrar invoices") ||
    t.includes("ver invoices") ||
    t.includes("muestrame invoices") ||
    t.includes("muéstrame invoices")
  ){
    await mostrarInvoices();
    return;
  }

  // ================= VER INVOICE PDF =================

  if(t.includes("ver invoice")){
    const numero =
      extraerNumeroDocumento(mensaje);

    if(!numero){
      agregarMensaje(
        "nico",
        "Rodri, dime cuál invoice quieres ver."
      );
      return;
    }

    await abrirInvoicePDF(numero);
    return;
  }

  // ================= MOSTRAR ESTIMATES =================

  if(
    t.includes("mostrar estimates") ||
    t.includes("ver estimates") ||
    t.includes("muestrame estimates") ||
    t.includes("muéstrame estimates")
  ){
    await mostrarEstimates();
    return;
  }

  // ================= VER ESTIMATE PDF =================

  if(t.includes("ver estimate")){
    const numero =
      extraerNumeroDocumento(mensaje);

    if(!numero){
      agregarMensaje(
        "nico",
        "Rodri, dime cuál estimate quieres ver."
      );
      return;
    }

    await abrirEstimatePDF(numero);
    return;
  }
  // ================= CREAR ESTIMATE =================

  if(
    t.includes("crear estimate") ||
    t.includes("crea estimate") ||
    t.includes("create estimate") ||
    t.includes("hacer estimate") ||
    t.includes("haz estimate") ||
    t.includes("crear estimado") ||
    t.includes("crea estimado") ||
    t.includes("cotizacion") ||
    t.includes("cotización")
  ){

    const datosFormulario =
      obtenerDatosFormularioActual();

    const nombreExtraido =
      extraerNombreDesdeComando(mensaje);

    if(
      datosFormulario.cliente_nombre &&
      datosFormulario.total > 0
    ){
      await crearEstimateConDatos(datosFormulario);
      return;
    }

    if(nombreExtraido){

      const { cliente, servicio } =
        buscarDatosCliente(nombreExtraido);

      const datosEncontrados = {
        cliente_nombre:
          servicio?.cliente ||
          cliente?.nombre ||
          cliente?.id ||
          nombreExtraido,

        cliente_email:
          servicio?.email_cliente ||
          cliente?.email ||
          "",

        cliente_telefono:
          servicio?.whatsapp ||
          cliente?.whatsapp ||
          cliente?.telefono ||
          "",

        cliente_direccion:
          servicio?.direccion ||
          cliente?.direccion ||
          "",

        tipo_limpieza:
          servicio?.tipo ||
          datosFormulario.tipo_limpieza ||
          "",

        notes:
          servicio?.notas ||
          datosFormulario.notes ||
          "",

        total:
  Number(
    servicio?.precio_total ||
    datosFormulario.total ||
    0
  ),

millas_servicio:
  Number(
    servicio?.millas_servicio ||
    servicio?.millas_estimadas ||
    cliente?.millas_servicio ||
    datosFormulario.millas_servicio ||
    0
  )
      };

      await crearEstimateConDatos(datosEncontrados);
      return;
    }

    agregarMensaje(
      "nico",
`Rodri, para crear el estimate necesito:

• Cliente
• Precio Total
• Tipo de limpieza
• Dirección`
    );

    return;
  }

  // ================= IA NORMAL =================

  nicoPensando = true;

  const thinking =
    agregarMensaje(
      "nico",
      "Nico está pensando..."
    );

  try{

    const respuesta =
      await pensarConNico(mensaje);

    thinking.innerText = respuesta;

    imagenNico("alegre");

  }catch(e){

    console.log(e);

    thinking.innerText =
      "Rodri, tuve un problema respondiendo.";

  }finally{

    nicoPensando = false;

    nicoChatMessages.scrollTop =
      nicoChatMessages.scrollHeight;
  }
}

nicoSend.onclick = enviarTextoANico;

nicoChatInput.addEventListener(
  "keydown",
  (e) => {

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){
      e.preventDefault();
      enviarTextoANico();
    }
  }
);

// ================= STOP =================

function apagarNico(){

  nicoActivo = false;
  nicoPensando = false;
  nicoTrabajoPendiente = null;
  nicoMensajeClientePendiente = null;

  nicoChatPanelEl.style.display = "none";

  imagenNico("saluda");
}

window.NICO_STOP = apagarNico;
