// ================= NICO ADMIN FINAL + AVATAR VISIBLE + MINI CHAT =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";
const CREAR_TRABAJO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearTrabajoConfirmado";
const CONSULTAR_HOY_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarTrabajosHoy";
const CONSULTAR_PENDIENTES_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarPendientes";
const GUARDAR_MEMORIA_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/guardarMemoria";

const GOOGLE_REVIEW_LINK = "https://share.google/zJY5nmJjhgUWoz0IX";
const ELITE_PHONE = "+1 (925) 336-2884";
const ELITE_EMAIL = "elitecleanerscompany@gmail.com";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoActivo = false;
let nicoPensando = false;
let ultimoComandoAgenda = "";

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <img id="nicoFloatingAvatar" src="nico-assets/saluda.png" />
  <button id="nicoBtn" aria-label="Abrir Nico">🎙️</button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";
nicoChatPanel.innerHTML = `
  <div id="nicoHeader">
    <div>
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

// ================= CSS =================

const style = document.createElement("style");
style.id = "nicoFinalStyle";
style.innerHTML = `
#nicoBox{
  position:fixed !important;
  right:18px !important;
  bottom:18px !important;
  z-index:999999 !important;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}

#nicoFloatingAvatar{
  width:118px;
  max-height:175px;
  object-fit:contain;
  filter:drop-shadow(0 12px 20px rgba(0,0,0,.75));
  animation:nicoFloat 3s infinite ease-in-out;
  margin-bottom:-8px;
  pointer-events:none;
}

#nicoBtn{
  width:72px;
  height:72px;
  border:none;
  border-radius:50%;
  background:linear-gradient(135deg,#3b82f6,#2563eb);
  color:white;
  font-size:34px;
  box-shadow:0 0 22px rgba(59,130,246,.65),0 10px 30px rgba(0,0,0,.7);
}

#nicoChatPanel{
  display:none;
  position:fixed !important;
  right:10px !important;
  bottom:84px !important;
  width:320px !important;
  max-width:92vw !important;
  z-index:999998 !important;
  background:linear-gradient(180deg,#0b1120,#020617);
  border-radius:22px;
  border:1px solid rgba(59,130,246,.55);
  overflow:hidden;
  box-shadow:0 0 24px rgba(37,99,235,.28),0 10px 40px rgba(0,0,0,.75);
  backdrop-filter:blur(12px);
}

#nicoHeader{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding:14px 14px 10px;
  border-bottom:1px solid rgba(59,130,246,.25);
}

#nicoTitleRow{
  display:flex;
  align-items:center;
  gap:7px;
}

#nicoTitle{
  color:white;
  font-size:22px;
  font-weight:900;
}

#nicoOnlineDot{
  width:9px;
  height:9px;
  border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 10px #22c55e;
}

#nicoOnlineText{
  color:#22c55e;
  font-size:12px;
  font-weight:800;
}

#nicoSubtitle{
  color:#cbd5e1;
  font-size:12px;
  margin-top:3px;
}

#nicoClose{
  width:40px;
  height:40px;
  border:none;
  border-radius:50%;
  background:#ef4444;
  color:white;
  font-size:22px;
  font-weight:bold;
  box-shadow:0 0 18px rgba(239,68,68,.4);
}

#nicoBody{
  padding:10px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

#nicoChatMessages{
  max-height:255px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:8px;
  padding-right:2px;
}

.nicoMsg{
  padding:10px 12px;
  border-radius:14px;
  font-size:14px;
  line-height:1.4;
  max-width:100%;
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

#nicoInputRow{
  display:flex;
  gap:8px;
  align-items:flex-end;
}

#nicoChatInput{
  flex:1;
  min-height:54px;
  max-height:85px;
  resize:none;
  border-radius:16px;
  border:1px solid rgba(59,130,246,.45);
  background:rgba(15,23,42,.95);
  color:white;
  padding:12px;
  font-size:14px;
  outline:none;
}

#nicoChatInput:focus{
  border-color:#3b82f6;
  box-shadow:0 0 0 2px rgba(59,130,246,.15);
}

#nicoChatInput::placeholder{
  color:#94a3b8;
}

#nicoSend{
  width:76px;
  min-height:54px;
  border:none;
  border-radius:16px;
  background:linear-gradient(135deg,#22c55e,#16a34a);
  color:white;
  font-size:14px;
  font-weight:900;
  box-shadow:0 0 18px rgba(34,197,94,.3);
}

@keyframes nicoFloat{
  0%,100%{ transform:translateY(0); }
  50%{ transform:translateY(-5px); }
}

@media(max-width:600px){
  #nicoBox{
    right:16px !important;
    bottom:18px !important;
  }

  #nicoFloatingAvatar{
    width:112px;
    max-height:165px;
  }

  #nicoBtn{
    width:70px;
    height:70px;
  }

  #nicoChatPanel{
    width:320px !important;
    right:10px !important;
    bottom:84px !important;
  }

  #nicoChatMessages{
    max-height:245px;
  }
}
`;
document.head.appendChild(style);

// ================= ELEMENTOS =================

const nicoBtn = document.getElementById("nicoBtn");
const nicoFloatingAvatar = document.getElementById("nicoFloatingAvatar");
const chatPanel = document.getElementById("nicoChatPanel");
const chatMessages = document.getElementById("nicoChatMessages");
const chatInput = document.getElementById("nicoChatInput");
const nicoSend = document.getElementById("nicoSend");
const nicoClose = document.getElementById("nicoClose");

// ================= IMÁGENES =================

function imagenNico(tipo) {
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

  const src = imgs[tipo] || imgs.saluda;
  if (nicoFloatingAvatar) nicoFloatingAvatar.src = src;
}

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();

  if (t.includes("risa") || t.includes("chiste") || t.includes("g.g")) return "rie";
  if (t.includes("trabajo") || t.includes("cliente") || t.includes("agenda") || t.includes("limpieza") || t.includes("cotización") || t.includes("cotizacion")) return "celular";
  if (t.includes("música") || t.includes("musica") || t.includes("guitarra") || t.includes("cantar")) return "canta";
  if (t.includes("bien") || t.includes("perfecto") || t.includes("listo") || t.includes("claro")) return "bien";

  return "alegre";
}

// ================= CHAT =================

function agregarMensaje(tipo, texto) {
  const div = document.createElement("div");
  div.className = `nicoMsg ${tipo}`;
  div.innerText = texto;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function abrirNico() {
  nicoActivo = true;
  imagenNico("saluda");
  chatPanel.style.display = "block";

  if (!chatMessages.dataset.saludo) {
    agregarMensaje("nico", "Hola hola, ¿en qué puedo ayudarte?");
    chatMessages.dataset.saludo = "true";
  }

  setTimeout(() => chatInput.focus(), 150);
}

function cerrarNico() {
  nicoActivo = false;
  imagenNico("saluda");
  chatPanel.style.display = "none";
}

nicoBtn.onclick = () => {
  if (nicoActivo) cerrarNico();
  else abrirNico();
};

nicoClose.onclick = cerrarNico;
nicoSend.onclick = enviarTextoANico;

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarTextoANico();
  }
});

// ================= UTILIDADES =================

function normalizarTexto(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function debeApagarse(texto) {
  const t = normalizarTexto(texto);

  return (
    t.includes("bye nico") ||
    t.includes("chao nico") ||
    t.includes("desconectate nico") ||
    t.includes("nico desconectate")
  );
}

// ================= MEMORIA =================

async function guardarMemoria(user, nico) {
  try {
    if (!user || !nico) return;

    await fetch(GUARDAR_MEMORIA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, nico })
    });

  } catch (e) {
    console.log("No pude guardar memoria:", e);
  }
}

// ================= AGENDA AUTOMÁTICA =================

function detectarTipoLimpieza(t) {
  const x = normalizarTexto(t);

  if (x.includes("profunda") || x.includes("deep")) return "PROFUNDA";
  if (x.includes("move in") || x.includes("move-in")) return "MOVE-IN";
  if (x.includes("move out") || x.includes("move-out")) return "MOVE-OUT";
  if (x.includes("post construccion") || x.includes("post-construccion") || x.includes("construction")) return "POST-CONSTRUCCION";
  if (x.includes("primera") || x.includes("first")) return "PRIMERA";

  return "ESTÁNDAR";
}

function extraerFecha(texto) {
  const t = normalizarTexto(texto);

  const meses = {
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    setiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12"
  };

  let year = new Date().getFullYear();

  let m = t.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/);

  if (m) {
    const dia = m[1].padStart(2, "0");
    const mes = meses[m[2]];
    if (m[3]) year = m[3];
    return `${year}-${mes}-${dia}`;
  }

  m = t.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);

  if (m) {
    const mes = m[1].padStart(2, "0");
    const dia = m[2].padStart(2, "0");
    if (m[3]) year = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${year}-${mes}-${dia}`;
  }

  if (t.includes("mañana") || t.includes("manana")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  if (t.includes("hoy")) {
    return new Date().toISOString().slice(0, 10);
  }

  return "";
}

function extraerHora(texto) {
  const t = normalizarTexto(texto);
  const horas = [...t.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a m|p m|a\.m|p\.m)?/g)];

  if (!horas.length) return "";

  let mejor = horas[horas.length - 1];
  let h = parseInt(mejor[1], 10);
  let min = mejor[2] || "00";
  const mer = (mejor[3] || "").replace(/\s|\./g, "");

  if (mer === "pm" && h < 12) h += 12;
  if (mer === "am" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${min}`;
}

function extraerCliente(texto) {
  let t = texto
    .replace(/agenda(?:r)?/i, "")
    .replace(/programa(?:r)?/i, "")
    .replace(/crea(?:r)?/i, "")
    .replace(/un trabajo/i, "")
    .replace(/una limpieza/i, "")
    .trim();

  t = t.replace(/^a\s+/i, "");

  const corte = t.search(/(\d{1,2}\s+de\s+|hoy|mañana|manana|\d{1,2}\/\d{1,2}| a las | limpieza | estandar| estándar| profunda| move)/i);

  if (corte > 0) t = t.slice(0, corte);

  return t.replace(/\s+/g, " ").trim();
}

function detectarComandoAgenda(texto) {
  const t = normalizarTexto(texto);

  return (
    t.includes("agenda") ||
    t.includes("agendar") ||
    t.includes("programa") ||
    t.includes("programar") ||
    t.includes("crea un trabajo") ||
    t.includes("crear un trabajo")
  );
}

function construirTrabajoDesdeTexto(texto) {
  const cliente = extraerCliente(texto);
  const fecha = extraerFecha(texto);
  const hora = extraerHora(texto);
  const tipo = detectarTipoLimpieza(texto);

  if (!cliente || !fecha || !hora) return null;

  return {
    confirmado: true,
    cliente,
    direccion: "",
    whatsapp: "",
    empleado_nombre: "",
    empleado_email: "",
    empleado_nombre_2: "",
    empleado_email_2: "",
    fecha,
    hora,
    notas: `Creado por Nico desde texto. Comando original: ${texto}`,
    tipo
  };
}

async function crearTrabajoAutomatico(texto) {
  try {
    if (!detectarComandoAgenda(texto)) return false;

    const trabajo = construirTrabajoDesdeTexto(texto);
    if (!trabajo) return false;

    const firma = JSON.stringify(trabajo);

    if (firma === ultimoComandoAgenda) return true;

    ultimoComandoAgenda = firma;

    imagenNico("celular");

    const res = await fetch(CREAR_TRABAJO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trabajo)
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      console.log("Error creando trabajo:", data);
      return false;
    }

    const respuesta = `Listo, Rodri. Ya agendé a ${trabajo.cliente} para el ${trabajo.fecha} a las ${trabajo.hora}. Tipo de limpieza: ${trabajo.tipo}.`;

    agregarMensaje("nico", respuesta);
    await guardarMemoria(texto, respuesta);

    return true;

  } catch (e) {
    console.log("No pude crear trabajo automático:", e);
    return false;
  }
}

// ================= FUNCIONES LOCALES =================

function mensajeResena() {
  return `Claro, Rodri. Puedes enviarle esto al cliente:

Hola, muchas gracias por confiar en Elite Cleaners Company. Fue un gusto ayudarle con su limpieza.

Si quedó satisfecho/a con nuestro servicio, nos ayudaría muchísimo dejándonos una reseña en Google.

Puede dejar su reseña aquí:
${GOOGLE_REVIEW_LINK}

Muchas gracias por su apoyo.
Elite Cleaners Company
${ELITE_PHONE}`;
}

function mensajeContrato() {
  return `Claro, Rodri. Puedes enviarle esto al cliente:

Hola, muchas gracias por elegir Elite Cleaners Company.

Antes de realizar el servicio, le enviaremos nuestro acuerdo de servicios de limpieza para confirmar los detalles, condiciones del trabajo y responsabilidades de ambas partes.

Por favor revise el contrato con calma y fírmelo antes de la fecha programada.

Elite Cleaners Company
${ELITE_PHONE}
${ELITE_EMAIL}`;
}

function mensajeAviso() {
  return `Claro, Rodri. Puedes enviarle este aviso al cliente:

Hola, le saluda Elite Cleaners Company.

Queremos recordarle que su limpieza está programada próximamente. Por favor asegúrese de que tengamos acceso a la propiedad, agua y electricidad disponibles.

Muchas gracias.
Elite Cleaners Company
${ELITE_PHONE}`;
}

function detectarFuncionLocal(texto) {
  const t = normalizarTexto(texto);

  if (t.includes("trabajos de hoy") || t.includes("limpiezas de hoy") || t.includes("que tengo hoy")) return "hoy";
  if (t.includes("pendientes") || t.includes("trabajos pendientes")) return "pendientes";
  if (t.includes("reseña") || t.includes("resena") || t.includes("review")) return "resena";
  if (t.includes("contrato")) return "contrato";
  if (t.includes("aviso") || t.includes("recordatorio")) return "aviso";

  return "";
}

async function consultarTrabajosHoy() {
  try {
    const res = await fetch(CONSULTAR_HOY_URL);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      agregarMensaje("nico", "Rodri, no pude consultar los trabajos de hoy en este momento.");
      return true;
    }

    const trabajos = data.trabajos || [];

    if (!trabajos.length) {
      agregarMensaje("nico", "Rodri, hoy no aparecen trabajos agendados.");
      return true;
    }

    let texto = `Rodri, estos son los trabajos de hoy (${data.fecha}):\n\n`;

    trabajos.forEach((t, i) => {
      texto += `${i + 1}. ${t.cliente || "Cliente sin nombre"}\n`;
      texto += `Hora: ${t.hora || "--:--"}\n`;
      texto += `Dirección: ${t.direccion || "Sin dirección"}\n`;
      texto += `Tipo: ${t.tipo || "Sin tipo"}\n`;
      texto += `Estado: ${t.estado || "pendiente"}\n\n`;
    });

    agregarMensaje("nico", texto.trim());
    return true;

  } catch (e) {
    console.log("Error consultando hoy:", e);
    agregarMensaje("nico", "Rodri, hubo un error consultando los trabajos de hoy.");
    return true;
  }
}

async function consultarPendientes() {
  try {
    const res = await fetch(CONSULTAR_PENDIENTES_URL);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      agregarMensaje("nico", "Rodri, no pude consultar los pendientes en este momento.");
      return true;
    }

    const pendientes = data.pendientes || [];

    if (!pendientes.length) {
      agregarMensaje("nico", "Rodri, no hay trabajos pendientes.");
      return true;
    }

    let texto = `Rodri, tienes ${pendientes.length} trabajos pendientes:\n\n`;

    pendientes.slice(0, 10).forEach((t, i) => {
      texto += `${i + 1}. ${t.cliente || "Cliente sin nombre"}\n`;
      texto += `Fecha: ${t.fecha || "Sin fecha"}\n`;
      texto += `Hora: ${t.hora || "--:--"}\n`;
      texto += `Tipo: ${t.tipo || "Sin tipo"}\n`;
      texto += `Estado: ${t.estado || "pendiente"}\n\n`;
    });

    agregarMensaje("nico", texto.trim());
    return true;

  } catch (e) {
    console.log("Error consultando pendientes:", e);
    agregarMensaje("nico", "Rodri, hubo un error consultando los pendientes.");
    return true;
  }
}

async function ejecutarFuncionLocal(texto) {
  const funcion = detectarFuncionLocal(texto);

  if (funcion === "hoy") return await consultarTrabajosHoy();
  if (funcion === "pendientes") return await consultarPendientes();

  if (funcion === "resena") {
    const r = mensajeResena();
    agregarMensaje("nico", r);
    await guardarMemoria(texto, "Preparé un mensaje para pedir reseña.");
    return true;
  }

  if (funcion === "contrato") {
    const r = mensajeContrato();
    agregarMensaje("nico", r);
    await guardarMemoria(texto, "Preparé un mensaje para enviar contrato.");
    return true;
  }

  if (funcion === "aviso") {
    const r = mensajeAviso();
    agregarMensaje("nico", r);
    await guardarMemoria(texto, "Preparé un aviso para cliente.");
    return true;
  }

  return false;
}

// ================= IA =================

async function pensarConNico(mensaje) {
  try {
    imagenNico("piensa");

    const res = await fetch(PENSAR_NICO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje })
    });

    let data = {};

    try {
      data = await res.json();
    } catch (e) {
      console.log("No pude leer JSON pensarNico:", e);
    }

    if (!res.ok) {
      console.log("Error pensarNico:", data);
      return "Rodri, ahora mismo no pude pensar la respuesta. Revisa si la API tiene crédito o si la función pensarNico está funcionando.";
    }

    const respuesta = data.respuesta || data.output_text || data.text || "";

    return (respuesta || "Aquí estoy, Rodri. Dime qué necesitas y lo resolvemos.").trim();

  } catch (e) {
    console.log("Error llamando pensarNico:", e);
    return "Rodri, no pude conectarme con Nico ahora mismo. Revisa internet, Firebase Functions o el crédito de OpenAI API.";
  }
}

// ================= ENVIAR =================

async function enviarTextoANico() {
  const mensaje = chatInput.value.trim();

  if (!mensaje || nicoPensando) return;

  chatInput.value = "";
  agregarMensaje("user", mensaje);

  if (debeApagarse(mensaje)) {
    agregarMensaje("nico", "Listo, Rodri. Me quedo quieto por ahora. Cuando me necesites, toca mi botón.");
    cerrarNico();
    return;
  }

  nicoPensando = true;
  imagenNico("piensa");

  const pensando = agregarMensaje("nico", "Nico está pensando...");

  try {
    const agendado = await crearTrabajoAutomatico(mensaje);

    if (agendado) {
      pensando.remove();
      return;
    }

    const local = await ejecutarFuncionLocal(mensaje);

    if (local) {
      pensando.remove();
      return;
    }

    const respuesta = await pensarConNico(mensaje);

    pensando.innerText = respuesta;
    imagenNico(detectarImagen(respuesta));

    await guardarMemoria(mensaje, respuesta);

  } catch (e) {
    console.log("Error general Nico:", e);
    pensando.innerText = "Rodri, tuve un problema respondiendo. Abre la consola para revisar el error.";
  } finally {
    nicoPensando = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ================= STOP =================

function apagarNico() {
  nicoActivo = false;
  nicoPensando = false;
  ultimoComandoAgenda = "";

  imagenNico("saluda");

  chatPanel.style.display = "none";
  nicoBox.style.display = "flex";
}

window.NICO_STOP = apagarNico;
