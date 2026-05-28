// ================= NICO ADMIN FINAL LEFT PANEL + ESTIMATES + INVOICES + JOBS + PDF BUTTON + CLIENT APPROVAL + SALES MESSAGES + MEMORY =================
const {
  CREAR_ESTIMATE_URL,
  CONSULTAR_ESTIMATES_URL,
  CREAR_INVOICE_URL,
  CONSULTAR_INVOICES_URL,
  CREAR_RECEIPT_URL,
  ENVIAR_CORREO_NICO_URL,
  ELITE_REVIEW_LINK,
  ELITE_BASE_URL,
  ELITE_LOGO_URL
} = window.NICO_CONFIG;

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
      <button id="nicoMic">🎤</button>
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

#nicoMic{
  width:58px;
  min-height:58px;
  border:none;
  border-radius:16px;
  background:linear-gradient(135deg,#f59e0b,#d97706);
  color:white;
  font-size:22px;
  font-weight:900;
  box-shadow:0 0 18px rgba(245,158,11,.35);
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
const nicoMic = document.getElementById("nicoMic");
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

    const usuarioNico =
      window.usuarioActual?.nombre ||
      localStorage.getItem("usuarioActivo") ||
      localStorage.getItem("usuario") ||
      localStorage.getItem("nombreUsuario") ||
      "Rodrigo";

    const saludoNico = `Hola ${usuarioNico}, ¿en qué puedo ayudarte?`;

    agregarMensaje("nico", saludoNico);

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

  let t = String(texto || "").trim();

  t = t
    .replace(/nico/ig,"")
    .replace(/oye nico/ig,"")
    .replace(/crea/ig,"")
    .replace(/crear/ig,"")
    .replace(/hacer/ig,"")
    .replace(/haz/ig,"")
    .replace(/dame/ig,"")
    .replace(/prepara/ig,"")
    .replace(/prepárame/ig,"")
    .replace(/preparame/ig,"")
    .replace(/estimate/ig,"")
    .replace(/estimado/ig,"")
    .replace(/cotizacion/ig,"")
    .replace(/cotización/ig,"")
    .replace(/\bel\b/ig,"")
    .replace(/\bde\b/ig,"")
    .replace(/\s+/g," ")
    .trim();

  return t;
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

// ================= SEND =================

async function enviarTextoANico(){

  const mensaje =
    nicoChatInput.value.trim();

  if(!mensaje || nicoPensando) return;

  nicoChatInput.value = "";

  agregarMensaje("user", mensaje);

  
  const textoMemoria = normalizarTexto(mensaje);

const esComandoNico =
  textoMemoria.includes("crear estimate") ||
  textoMemoria.includes("crea estimate") ||
  textoMemoria.includes("crear el estimate") ||
  textoMemoria.includes("crea el estimate") ||
  textoMemoria.includes("dame el estimate") ||
  textoMemoria.includes("prepara el estimate") ||
  textoMemoria.includes("crear estimado") ||
  textoMemoria.includes("crea estimado") ||
  textoMemoria.includes("hacer estimate") ||
  textoMemoria.includes("haz estimate") ||
  textoMemoria.includes("cotizacion") ||
  textoMemoria.includes("cotización") ||
  textoMemoria.includes("create estimate") ||
  textoMemoria.includes("send estimate") ||
  textoMemoria.includes("enviar estimate") ||
  textoMemoria.includes("crear invoice") ||
  textoMemoria.includes("crea invoice") ||
  textoMemoria.includes("create invoice") ||
  textoMemoria.includes("send invoice") ||
  textoMemoria.includes("enviar invoice") ||
  textoMemoria.includes("ver estimate") ||
  textoMemoria.includes("ver invoice") ||
  textoMemoria.includes("mostrar estimates") ||
  textoMemoria.includes("mostrar invoices") ||
  textoMemoria.includes("pedir reseña") ||
  textoMemoria.includes("recordatorio") ||
  textoMemoria.includes("enviar contrato");

try {
  if (!esComandoNico && typeof detectarMemoriaAutomatica === "function") {
    detectarMemoriaAutomatica(mensaje);
  }
} catch (e) {
  console.log("Error memoria automática:", e);
}

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
  if(
  t.includes("mostrar memorias") ||
  t.includes("ver memorias") ||
  t.includes("panel de memorias") ||
  t.includes("memorias de nico")
){
  await mostrarPanelMemoriasNico();
  return;
}
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

// ================= LIMPIEZA INTELIGENTE DE VOZ =================

nombreCliente = nombreCliente

  // comandos basura
  .replace(/creame/ig, "")
  .replace(/créame/ig, "")
  .replace(/preparame/ig, "")
  .replace(/prepárame/ig, "")
  .replace(/hazme/ig, "")
  .replace(/dame/ig, "")
  .replace(/busca/ig, "")
  .replace(/quiero/ig, "")

  // estimate/invoice extras
  .replace(/el estimate de/ig, "")
  .replace(/estimate de/ig, "")
  .replace(/invoice de/ig, "")
  .replace(/el invoice de/ig, "")

  // errores comunes de voz
  .replace(/esa charry/ig, "Zachary")
  .replace(/sacary/ig, "Zachary")
  .replace(/zacary/ig, "Zachary")
  .replace(/zacari/ig, "Zachary")
  .replace(/zachari/ig, "Zachary")
  .replace(/zach/ig, "Zachary")

  .trim();
// ================= CORRECCIÓN DE VOZ =================

nombreCliente = nombreCliente
  .replace(/esa charry/ig, "Zachary")
  .replace(/zach/ig, "Zachary")
  .replace(/sacary/ig, "Zachary")
  .replace(/zacari/ig, "Zachary")
  .replace(/zachari/ig, "Zachary")
  .trim();
  
  if(!nombreCliente){

    agregarMensaje(
      "nico",
      "Rodri, dime el nombre del cliente."
    );

    return;
  }

 const estimates = [
  ...(await obtenerEstimates()),
  ...(typeof todosLosServicios !== "undefined" ? todosLosServicios.map(s => ({
    numero: s.numero || "",
    cliente_nombre: s.cliente || "",
    cliente_direccion: s.direccion || "",
    notes: s.notas || "",
    total: s.precio_total || 0,
    tipo_limpieza: s.tipo || "",
    millas_servicio: s.millas_servicio || 0,
    fecha: s.fecha || "",
    hora: s.hora || ""
  })) : [])
];

const nombreBuscado =
    normalizarTexto(nombreCliente);

const estimate =
    [...estimates]
    .reverse()
    .find(e => {

      const nombreEstimate =
        normalizarTexto(e.cliente_nombre || "");

      const direccionEstimate =
        normalizarTexto(e.cliente_direccion || "");

      const notasEstimate =
        normalizarTexto(e.notes || "");

      return (

        nombreEstimate.includes(nombreBuscado)

        ||

        nombreBuscado.includes(nombreEstimate)

        ||

        direccionEstimate.includes(nombreBuscado)

        ||

        notasEstimate.includes(nombreBuscado)
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
    t.includes("crear el estimate") ||
    t.includes("crea el estimate") ||
    t.includes("dame el estimate") ||
    t.includes("prepara el estimate") ||
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

  // ================= ESTIMADO RÁPIDO DESDE TEXTO =================

  if(
  typeof esSolicitudDeEstimadoRapido === "function" &&
  esSolicitudDeEstimadoRapido(mensaje)
){

  const calculo =
    typeof responderEstimadoRapido === "function"
      ? responderEstimadoRapido(mensaje)
      : null;

  if(!calculo){
    agregarMensaje("nico", "Rodri, no pude calcular ese estimate rápido.");
    return;
  }

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
  
// ================= BUSCAR TRABAJO AGENDADO / CREAR ESTIMATE DESDE AGENDA =================

if(
  t.includes("estimate") &&
  (
    t.includes("dame") ||
    t.includes("prepara") ||
    t.includes("prepárame") ||
    t.includes("crear") ||
    t.includes("crea")
  )
){
  let nombreCliente = mensaje
    .replace(/nico/ig,"")
    .replace(/oye nico/ig,"")
    .replace(/dame/ig,"")
    .replace(/prepara/ig,"")
    .replace(/prepárame/ig,"")
    .replace(/preparame/ig,"")
    .replace(/crear/ig,"")
    .replace(/crea/ig,"")
    .replace(/el estimate/ig,"")
    .replace(/estimate/ig,"")
    .replace(/de/ig,"")
    .trim();

  if(!nombreCliente){
    agregarMensaje("nico", "Rodri, dime el nombre del cliente.");
    return;
  }

  const nombreBuscado = normalizarTexto(nombreCliente);

  const servicio = [...todosLosServicios]
    .reverse()
    .find(s => {
      const cliente = normalizarTexto(s.cliente || "");
      const direccion = normalizarTexto(s.direccion || "");
      const notas = normalizarTexto(s.notas || "");

      return (
        cliente.includes(nombreBuscado) ||
        nombreBuscado.includes(cliente) ||
        direccion.includes(nombreBuscado) ||
        notas.includes(nombreBuscado)
      );
    });

  if(!servicio){
    agregarMensaje("nico", `Rodri, no encontré a ${nombreCliente} en los trabajos agendados.`);
    return;
  }

  const datosEstimate = {
    cliente_nombre: servicio.cliente || "",
    cliente_email: servicio.email_cliente || "",
    cliente_telefono: servicio.whatsapp || "",
    cliente_direccion: servicio.direccion || "",
    tipo_limpieza: servicio.tipo || "",
    notes: servicio.notas || "",
    total: Number(servicio.precio_total || 0),
    millas_servicio: Number(servicio.millas_servicio || servicio.millas_estimadas || 0),
    fecha: servicio.fecha || "",
    hora: servicio.hora || ""
  };

  if(!datosEstimate.cliente_nombre || datosEstimate.total <= 0){
    agregarMensaje("nico", "Rodri, encontré el cliente, pero falta precio o nombre para crear el estimate.");
    return;
  }

  await crearEstimateConDatos(datosEstimate);
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

nicoSend.addEventListener("click", enviarTextoANico);

nicoMic.addEventListener("click", () => {
  if(typeof iniciarVozNico === "function"){
    iniciarVozNico();
  }else{
    agregarMensaje("nico", "Rodri, la voz de Nico todavía no está cargada.");
  }
});

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
