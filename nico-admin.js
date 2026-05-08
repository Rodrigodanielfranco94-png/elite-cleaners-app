// ================= NICO ADMIN FINAL LEFT PANEL + ESTIMATES + PDF BUTTON =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";

const CREAR_ESTIMATE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearEstimateNico";

const CONSULTAR_ESTIMATES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarEstimates";

const CREAR_INVOICE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearInvoiceNico";

const CONSULTAR_INVOICES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarInvoices";

const CREAR_RECEIPT_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearReceiptNico";

const ELITE_LOGO_URL = "assets/Logo.png";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoActivo = false;
let nicoPensando = false;

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

  nicoFloatingAvatar.src = imgs[tipo] || imgs.saluda;
}

// ================= CHAT =================

function agregarMensaje(tipo, texto){
  const div = document.createElement("div");
  div.className = `nicoMsg ${tipo}`;
  div.innerText = texto;
  nicoChatMessages.appendChild(div);
  nicoChatMessages.scrollTop = nicoChatMessages.scrollHeight;
  return div;
}

function agregarMensajeConBotonPDF(texto, numeroEstimate){
  const div = document.createElement("div");
  div.className = "nicoMsg nico";
  div.innerText = texto;

  const btn = document.createElement("button");
  btn.className = "nicoPdfBtn";
  btn.innerText = "📄 Ver / Descargar PDF";
  btn.onclick = () => abrirEstimatePDF(numeroEstimate);

  div.appendChild(btn);
  nicoChatMessages.appendChild(div);
  nicoChatMessages.scrollTop = nicoChatMessages.scrollHeight;

  return div;
}

// ================= OPEN / CLOSE =================

function abrirNico(){
  nicoActivo = true;
  imagenNico("saluda");
  nicoChatPanelEl.style.display = "block";

  if(!nicoChatMessages.dataset.saludo){
    agregarMensaje("nico", "Hola hola, ¿en qué puedo ayudarte?");
    nicoChatMessages.dataset.saludo = "true";
  }

  setTimeout(() => {
    nicoChatInput.focus();
  }, 120);
}

function cerrarNico(){
  nicoActivo = false;
  nicoChatPanelEl.style.display = "none";
  imagenNico("saluda");
}

nicoBtn.onclick = () => {
  if(nicoActivo) cerrarNico();
  else abrirNico();
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
  return document.getElementById(id)?.value?.trim() || "";
}

function obtenerDatosFormularioActual(){
  return {
    cliente_nombre: obtenerValor("cliente"),
    cliente_email: obtenerValor("email_cliente"),
    cliente_telefono: obtenerValor("whatsapp").replace(/\D/g, ""),
    cliente_direccion: obtenerValor("direccion"),
    tipo_limpieza: typeof tipoSeleccionado !== "undefined" ? tipoSeleccionado : "",
    notes: obtenerValor("notas"),
    total: Number(obtenerValor("precio_total") || 0),
    fecha: obtenerValor("fecha"),
    hora: obtenerValor("hora")
  };
}

function extraerNombreDesdeComando(texto){
  let t = texto.trim();

  t = t
    .replace(/nico/ig, "")
    .replace(/crea/ig, "")
    .replace(/crear/ig, "")
    .replace(/estimate/ig, "")
    .replace(/estimado/ig, "")
    .replace(/cotizacion/ig, "")
    .replace(/cotización/ig, "")
    .replace(/de /ig, "")
    .trim();

  return t;
}

function buscarDatosCliente(nombre){
  const nombreNorm = normalizarTexto(nombre);

  let cliente = null;
  let servicio = null;

  if (typeof todosLosClientes !== "undefined") {
    cliente = todosLosClientes.find(c =>
      normalizarTexto(c.nombre || c.id || "").includes(nombreNorm) ||
      nombreNorm.includes(normalizarTexto(c.nombre || c.id || ""))
    );
  }

  if (typeof todosLosServicios !== "undefined") {
    servicio = [...todosLosServicios].reverse().find(s =>
      normalizarTexto(s.cliente || "").includes(nombreNorm) ||
      nombreNorm.includes(normalizarTexto(s.cliente || ""))
    );
  }

  return { cliente, servicio };
}

function construirPayloadEstimateDesdeDatos(datos){
  return {
    cliente_nombre: datos.cliente_nombre || "",
    cliente_email: datos.cliente_email || "",
    cliente_telefono: (datos.cliente_telefono || "").replace(/\D/g, ""),
    cliente_direccion: datos.cliente_direccion || "",
    tipo_limpieza: datos.tipo_limpieza || "",
    notes: datos.notes || "",
    total: Number(datos.total || 0),
    subtotal: Number(datos.total || 0),
    items: [
      {
        description: datos.tipo_limpieza || "Cleaning Service",
        price: Number(datos.total || 0),
        quantity: 1,
        total: Number(datos.total || 0)
      }
    ],
    status: "Draft"
  };
}

// ================= ESTIMATE CREATE =================

async function crearEstimateConDatos(datos){
  if(!datos.cliente_nombre){
    agregarMensaje("nico", "Rodri, falta el nombre del cliente para crear el estimate.");
    return;
  }

  if(!datos.total || Number(datos.total) <= 0){
    agregarMensaje("nico", "Rodri, falta el precio total. Escríbelo en el campo Precio Total del Servicio para poder crear el estimate.");
    return;
  }

  imagenNico("celular");

  const payload = construirPayloadEstimateDesdeDatos(datos);

  const res = await fetch(CREAR_ESTIMATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if(!res.ok || !data.ok){
    console.log(data);
    agregarMensaje("nico", "Rodri, no pude crear el estimate. Revisa la consola por si Firebase devolvió un error.");
    return;
  }

  imagenNico("bien");

  const numero = data.estimate.numero;

  agregarMensajeConBotonPDF(
`✅ Estimate creado correctamente

👤 Cliente: ${payload.cliente_nombre}
🧼 Tipo: ${payload.tipo_limpieza || "Sin tipo"}
💵 Total: $${dinero(payload.total)}
📍 Dirección: ${payload.cliente_direccion || "Sin dirección"}

📄 Estimate:
${numero}`,
    numero
  );
}

// ================= ESTIMATE LIST =================

async function mostrarEstimates(){
  try{
    imagenNico("celular");

    const res = await fetch(CONSULTAR_ESTIMATES_URL);
    const data = await res.json();

    const estimates = data.estimates || [];

    if(!estimates.length){
      agregarMensaje("nico", "Rodri, todavía no encontré estimates guardados.");
      return;
    }

    let texto = "📋 Últimos estimates:\n\n";

    estimates.slice(0,10).forEach((e, i) => {
      texto += `${i + 1}. ${e.cliente_nombre || "Sin cliente"}\n`;
      texto += `Tipo: ${e.tipo_limpieza || "Sin tipo"}\n`;
      texto += `Total: $${dinero(e.total)}\n`;
      texto += `Estimate: ${e.numero || "Sin número"}\n`;
      texto += `Para verlo: ver estimate ${e.numero || ""}\n\n`;
    });

    agregarMensaje("nico", texto.trim());
    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje("nico", "Rodri, hubo un error consultando los estimates.");
  }
}

// ================= ESTIMATE PDF =================

async function abrirEstimatePDF(numeroEstimate){
  try{
    imagenNico("celular");

    const res = await fetch(CONSULTAR_ESTIMATES_URL);
    const data = await res.json();

    const estimates = data.estimates || [];

    const estimate = estimates.find(e =>
      normalizarTexto(e.numero || "").includes(normalizarTexto(numeroEstimate || ""))
    );

    if(!estimate){
      agregarMensaje("nico", "Rodri, no encontré ese estimate.");
      return;
    }

    const logoUrl = ELITE_LOGO_URL;
    const total = dinero(estimate.total);

    const nuevaVentana = window.open("", "_blank");

    if(!nuevaVentana){
      agregarMensaje("nico", "Rodri, el navegador bloqueó la ventana. Permite pop-ups para abrir el PDF.");
      return;
    }

    nuevaVentana.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${estimate.numero}</title>
<style>
  body{
    font-family: Arial, Helvetica, sans-serif;
    background:#f3f4f6;
    margin:0;
    padding:30px;
    color:#111827;
  }

  .page{
    max-width:800px;
    margin:0 auto;
    background:white;
    padding:45px;
    border-radius:8px;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
  }

  .top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    border-bottom:2px solid #e5e7eb;
    padding-bottom:25px;
    margin-bottom:30px;
  }

  .logo{
    width:190px;
    height:auto;
  }

  .title{
    text-align:right;
  }

  .title h1{
    margin:0;
    font-size:38px;
    color:#1f2937;
    letter-spacing:1px;
  }

  .estimate-number{
    margin-top:8px;
    color:#6b7280;
    font-size:14px;
  }

  .grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:30px;
    margin-bottom:30px;
  }

  .section-title{
    font-size:13px;
    color:#2563eb;
    font-weight:bold;
    text-transform:uppercase;
    margin-bottom:8px;
  }

  .info{
    font-size:15px;
    line-height:1.55;
  }

  table{
    width:100%;
    border-collapse:collapse;
    margin-top:25px;
  }

  th{
    background:#1f2937;
    color:white;
    text-align:left;
    padding:12px;
    font-size:13px;
    text-transform:uppercase;
  }

  td{
    border-bottom:1px solid #e5e7eb;
    padding:14px 12px;
    font-size:14px;
    vertical-align:top;
  }

  .right{
    text-align:right;
  }

  .notes{
    margin-top:30px;
    padding:18px;
    background:#f9fafb;
    border-left:4px solid #2563eb;
    font-size:14px;
    line-height:1.5;
  }

  .total-box{
    margin-top:30px;
    display:flex;
    justify-content:flex-end;
  }

  .total-inner{
    width:300px;
    border-top:2px solid #111827;
    padding-top:15px;
  }

  .total-row{
    display:flex;
    justify-content:space-between;
    font-size:18px;
    font-weight:bold;
  }

  .total-price{
    color:#16a34a;
    font-size:28px;
  }

  .footer{
    margin-top:45px;
    color:#6b7280;
    font-size:12px;
    text-align:center;
    border-top:1px solid #e5e7eb;
    padding-top:18px;
  }

  .btns{
    max-width:800px;
    margin:20px auto;
    display:flex;
    gap:10px;
    justify-content:center;
  }

  button{
    border:none;
    border-radius:10px;
    padding:14px 22px;
    font-size:15px;
    font-weight:bold;
    cursor:pointer;
  }

  .download{
    background:#2563eb;
    color:white;
  }

  .close{
    background:#111827;
    color:white;
  }

  @media print{
    body{
      background:white;
      padding:0;
    }

    .page{
      box-shadow:none;
      border-radius:0;
      max-width:none;
    }

    .btns{
      display:none;
    }
  }
</style>
</head>

<body>
  <div class="page">
    <div class="top">
      <div>
        <img class="logo" src="${logoUrl}" />
        <div class="info" style="margin-top:12px;">
          <strong>Elite Cleaners Company</strong><br>
          Pleasanton, CA 94566<br>
          elitecleanerscompany@gmail.com<br>
          +1 (925) 336-2884
        </div>
      </div>

      <div class="title">
        <h1>ESTIMATE</h1>
        <div class="estimate-number">${estimate.numero || ""}</div>
        <div class="estimate-number">Date: ${estimate.fecha || ""}</div>
        <div class="estimate-number">Status: ${estimate.status || "Draft"}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="section-title">Bill To</div>
        <div class="info">
          <strong>${estimate.cliente_nombre || ""}</strong><br>
          ${estimate.cliente_email || ""}<br>
          ${estimate.cliente_telefono || ""}<br>
          ${estimate.cliente_direccion || ""}
        </div>
      </div>

      <div>
        <div class="section-title">Service Details</div>
        <div class="info">
          <strong>Cleaning Type:</strong> ${estimate.tipo_limpieza || ""}<br>
          <strong>Valid Until:</strong> ${estimate.valid_until || estimate.fecha || ""}<br>
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
          (estimate.items && estimate.items.length)
          ? estimate.items.map(item => `
            <tr>
              <td>${item.description || estimate.tipo_limpieza || "Cleaning Service"}</td>
              <td class="right">$${dinero(item.price || estimate.total)}</td>
              <td class="right">${item.quantity || 1}</td>
              <td class="right">$${dinero(item.total || estimate.total)}</td>
            </tr>
          `).join("")
          : `
            <tr>
              <td>${estimate.tipo_limpieza || "Cleaning Service"}</td>
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
      ${estimate.notes || "Includes supplies, equipment, and all work materials. This estimate does not include additional services not requested in the initial inquiry."}
    </div>

    <div class="total-box">
      <div class="total-inner">
        <div class="total-row">
          <span>Estimate Total</span>
          <span class="total-price">$${total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      Thank you for choosing Elite Cleaners Company.<br>
      This is an estimate and may be adjusted if additional services are requested.
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

    agregarMensaje("nico", "✅ Estimate abierto correctamente. Desde ahí puedes descargarlo o imprimirlo como PDF.");
    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje("nico", "❌ Error abriendo estimate.");
  }
}

// ================= THINK =================

async function pensarConNico(mensaje){
  try{
    imagenNico("piensa");

    const res = await fetch(PENSAR_NICO_URL, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ mensaje })
    });

    const data = await res.json();

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

// ================= SEND =================

async function enviarTextoANico(){
  const mensaje = nicoChatInput.value.trim();

  if(!mensaje || nicoPensando) return;

  nicoChatInput.value = "";
  agregarMensaje("user", mensaje);

  const t = normalizarTexto(mensaje);

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
    const numero = mensaje.replace(/ver estimate/ig, "").trim();

    if(!numero){
      agregarMensaje("nico", "Rodri, dime cuál estimate quieres ver. Ejemplo: ver estimate EST-20260508-1293");
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
    t.includes("estimate") ||
    t.includes("crear estimado") ||
    t.includes("crea estimado") ||
    t.includes("cotizacion") ||
    t.includes("cotización")
  ){
    const datosFormulario = obtenerDatosFormularioActual();
    const nombreExtraido = extraerNombreDesdeComando(mensaje);

    if(datosFormulario.cliente_nombre && datosFormulario.total > 0){
      await crearEstimateConDatos(datosFormulario);
      return;
    }

    if(nombreExtraido){
      const { cliente, servicio } = buscarDatosCliente(nombreExtraido);

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
          Number(servicio?.precio_total || datosFormulario.total || 0)
      };

      await crearEstimateConDatos(datosEncontrados);
      return;
    }

    agregarMensaje(
      "nico",
`Rodri, para crear el estimate necesito que el formulario tenga:

• Cliente
• Precio Total del Servicio
• Tipo de limpieza
• Dirección si aplica

Luego dime: "Nico, crea estimate".`
    );

    return;
  }

  // ================= IA NORMAL =================

  nicoPensando = true;

  const thinking = agregarMensaje("nico", "Nico está pensando...");

  try{
    const respuesta = await pensarConNico(mensaje);
    thinking.innerText = respuesta;
    imagenNico("alegre");

  }catch(e){
    console.log(e);
    thinking.innerText = "Rodri, tuve un problema respondiendo.";

  }finally{
    nicoPensando = false;
    nicoChatMessages.scrollTop = nicoChatMessages.scrollHeight;
  }
}

nicoSend.onclick = enviarTextoANico;

nicoChatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    enviarTextoANico();
  }
});

// ================= STOP =================

function apagarNico(){
  nicoActivo = false;
  nicoPensando = false;
  nicoChatPanelEl.style.display = "none";
  imagenNico("saluda");
}

window.NICO_STOP = apagarNico;
