// ================= NICO ADMIN TEXTO + AVATAR PRO + MEMORIA + AGENDA =================

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
  <button id="nicoBtn" aria-label="Abrir Nico">
    <img id="nicoBtnImg" src="nico-assets/saluda.png" />
  </button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";
nicoChatPanel.innerHTML = `
  <div id="nicoChatHeader">
    <div>
      <div id="nicoTitleRow">
        <span id="nicoTitle">NICO</span>
        <span id="nicoStatusDot"></span>
        <span id="nicoStatusText">ONLINE</span>
      </div>
      <div id="nicoSubtitle">Asistente IA de Elite Cleaners</div>
    </div>
    <button id="nicoChatClose">×</button>
  </div>

  <div id="nicoBody">
    <div id="nicoLeft">
      <div id="nicoChatMessages"></div>

      <div id="nicoChatInputRow">
        <textarea id="nicoChatInput" placeholder="Escribe tu mensaje..."></textarea>
        <button id="nicoChatSend">➤</button>
      </div>
    </div>

    <div id="nicoRight">
      <div id="nicoGlow"></div>
      <img id="nicoAvatar" src="nico-assets/saluda.png" />
    </div>
  </div>
`;

document.body.appendChild(nicoBox);
document.body.appendChild(nicoChatPanel);

const style = document.createElement("style");
style.id = "nicoFinalStyle";
style.innerHTML = `
#nicoBox{
  position:fixed !important;
  right:16px !important;
  bottom:18px !important;
  z-index:99999;
}

#nicoBtn{
  width:82px;
  height:82px;
  border-radius:50%;
  border:2px solid #3b82f6;
  background:radial-gradient(circle at 35% 25%, #2563eb, #020617 70%);
  box-shadow:0 0 22px rgba(59,130,246,.65), 0 12px 30px rgba(0,0,0,.55);
  overflow:hidden;
  padding:0;
}

#nicoBtnImg{
  width:90px;
  height:90px;
  object-fit:contain;
  transform:translateY(8px);
}

#nicoChatPanel{
  display:none;
  position:fixed !important;
  left:18px !important;
  right:18px !important;
  bottom:18px !important;
  z-index:99998;
  background:linear-gradient(145deg, rgba(5,12,28,.98), rgba(11,18,32,.97));
  border:1px solid rgba(59,130,246,.8);
  border-radius:26px;
  overflow:hidden;
  box-shadow:0 0 32px rgba(37,99,235,.45), 0 18px 50px rgba(0,0,0,.8);
  max-width:760px;
  margin:0 auto;
}

#nicoChatHeader{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding:18px 20px 12px;
  background:linear-gradient(180deg, rgba(15,23,42,.95), rgba(2,6,23,.65));
  color:white;
  border-bottom:1px solid rgba(59,130,246,.28);
}

#nicoTitleRow{
  display:flex;
  align-items:center;
  gap:9px;
}

#nicoTitle{
  font-size:28px;
  font-weight:1000;
  letter-spacing:.5px;
}

#nicoStatusDot{
  width:10px;
  height:10px;
  background:#22c55e;
  border-radius:50%;
  box-shadow:0 0 12px rgba(34,197,94,.9);
}

#nicoStatusText{
  color:#22c55e;
  font-size:13px;
  font-weight:900;
}

#nicoSubtitle{
  margin-top:4px;
  font-size:14px;
  color:#cbd5e1;
}

#nicoChatClose{
  background:#ef4444;
  color:white;
  border:none;
  border-radius:50%;
  width:42px;
  height:42px;
  font-size:24px;
  font-weight:bold;
  box-shadow:0 8px 22px rgba(239,68,68,.35);
}

#nicoBody{
  display:grid;
  grid-template-columns:1fr 220px;
  gap:10px;
  padding:16px 18px 18px;
  min-height:360px;
}

#nicoLeft{
  display:flex;
  flex-direction:column;
  min-width:0;
}

#nicoChatMessages{
  height:250px;
  overflow-y:auto;
  padding:4px 4px 12px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.nicoMsg{
  padding:13px 15px;
  border-radius:18px;
  font-size:15px;
  line-height:1.42;
  max-width:92%;
  word-break:break-word;
  white-space:pre-wrap;
}

.nicoMsg.user{
  align-self:flex-end;
  background:linear-gradient(135deg, #3b82f6, #2563eb);
  color:white;
  box-shadow:0 8px 20px rgba(37,99,235,.25);
}

.nicoMsg.nico{
  align-self:flex-start;
  background:rgba(39,39,42,.9);
  color:white;
  border:1px solid rgba(255,255,255,.04);
}

#nicoChatInputRow{
  display:flex;
  gap:10px;
  padding-top:10px;
}

#nicoChatInput{
  flex:1;
  min-height:56px;
  max-height:110px;
  resize:none;
  border:1px solid rgba(59,130,246,.25);
  border-radius:18px;
  padding:16px;
  background:rgba(15,23,42,.95);
  color:white;
  font-size:16px;
  outline:none;
}

#nicoChatInput:focus{
  border-color:#3b82f6;
  box-shadow:0 0 0 2px rgba(59,130,246,.18);
}

#nicoChatSend{
  width:64px;
  border:none;
  border-radius:18px;
  background:linear-gradient(135deg, #22c55e, #16a34a);
  color:white;
  font-size:24px;
  font-weight:900;
  box-shadow:0 10px 22px rgba(34,197,94,.35);
}

#nicoRight{
  position:relative;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  min-height:310px;
}

#nicoGlow{
  position:absolute;
  width:210px;
  height:210px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(37,99,235,.55), rgba(37,99,235,.12), transparent 70%);
  filter:blur(2px);
  bottom:12px;
  animation:nicoPulse 2.4s infinite ease-in-out;
}

#nicoAvatar{
  position:relative;
  z-index:2;
  width:230px;
  max-height:330px;
  object-fit:contain;
  filter:drop-shadow(0 18px 28px rgba(0,0,0,.75));
  animation:nicoFloat 3.2s infinite ease-in-out;
}

@keyframes nicoPulse{
  0%,100%{ transform:scale(.95); opacity:.75; }
  50%{ transform:scale(1.08); opacity:1; }
}

@keyframes nicoFloat{
  0%,100%{ transform:translateY(0); }
  50%{ transform:translateY(-8px); }
}

@media (max-width:700px){
  #nicoChatPanel{
    left:10px !important;
    right:10px !important;
    bottom:12px !important;
    border-radius:24px;
  }

  #nicoBody{
    grid-template-columns:1fr 132px;
    padding:14px;
    min-height:350px;
  }

  #nicoChatMessages{
    height:250px;
  }

  #nicoRight{
    min-height:300px;
    align-items:flex-end;
  }

  #nicoGlow{
    width:140px;
    height:140px;
    bottom:42px;
  }

  #nicoAvatar{
    width:150px;
    transform:translateX(8px);
  }

  #nicoTitle{
    font-size:24px;
  }

  .nicoMsg{
    font-size:14px;
    max-width:96%;
  }

  #nicoBtn{
    width:78px;
    height:78px;
  }
}
`;
document.head.appendChild(style);

const nicoBtn = document.getElementById("nicoBtn");
const nicoBtnImg = document.getElementById("nicoBtnImg");
const nicoAvatar = document.getElementById("nicoAvatar");
const chatPanel = document.getElementById("nicoChatPanel");
const chatClose = document.getElementById("nicoChatClose");
const chatMessages = document.getElementById("nicoChatMessages");
const chatInput = document.getElementById("nicoChatInput");
const chatSend = document.getElementById("nicoChatSend");

// ================= BOTONES =================

nicoBtn.onclick = () => {
  if (nicoActivo) cerrarNico();
  else abrirNico();
};

chatClose.onclick = cerrarNico;
chatSend.onclick = enviarTextoANico;

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarTextoANico();
  }
});

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
  nicoAvatar.src = src;
  nicoBtnImg.src = src;
}

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();
  if (t.includes("g.g") || t.includes("risa") || t.includes("chiste")) return "rie";
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
  imagenNico("reposo");
  chatPanel.style.display = "none";
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
    console.log("No pude guardar memoria desde frontend:", e);
  }
}

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
    enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
    julio: "07", agosto: "08", septiembre: "09", setiembre: "09", octubre: "10",
    noviembre: "11", diciembre: "12"
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

  if (t.includes("hoy")) return new Date().toISOString().slice(0, 10);

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

// ================= FUNCIONES EMPRESA =================

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

    return true;
  } catch (e) {
    console.log("No pude crear trabajo automático:", e);
    return false;
  }
}

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
}

async function consultarPendientes() {
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
}

async function ejecutarFuncionLocal(texto) {
  const funcion = detectarFuncionLocal(texto);

  if (funcion === "hoy") return await consultarTrabajosHoy();
  if (funcion === "pendientes") return await consultarPendientes();

  if (funcion === "resena") {
    agregarMensaje("nico", mensajeResena());
    return true;
  }

  if (funcion === "contrato") {
    agregarMensaje("nico", mensajeContrato());
    return true;
  }

  if (funcion === "aviso") {
    agregarMensaje("nico", mensajeAviso());
    return true;
  }

  return false;
}

// ================= NICO IA =================

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

// ================= ENVIAR TEXTO =================

async function enviarTextoANico() {
  const mensaje = chatInput.value.trim();
  if (!mensaje || nicoPensando) return;

  chatInput.value = "";
  chatPanel.style.display = "block";

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

  } catch (e) {
    console.log("Error general Nico:", e);
    pensando.innerText = "Rodri, tuve un problema respondiendo. Abre la consola para revisar el error.";
  } finally {
    nicoPensando = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoPensando = false;
  ultimoComandoAgenda = "";
  imagenNico("reposo");
  chatPanel.style.display = "none";
}

window.NICO_STOP = apagarNico;
