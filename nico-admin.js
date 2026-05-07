// ================= NICO ADMIN TEXTO + MEMORIA + AGENDA + MENSAJES EMPRESA =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";
const CREAR_TRABAJO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearTrabajoConfirmado";
const CONSULTAR_HOY_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarTrabajosHoy";
const CONSULTAR_PENDIENTES_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarPendientes";
const CONSULTAR_CLIENTES_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarClientes";
const GUARDAR_MEMORIA_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/guardarMemoria";

const GOOGLE_REVIEW_LINK = "https://share.google/zJY5nmJjhgUWoz0IX";
const ELITE_PHONE = "+1 (925) 336-2884";
const ELITE_EMAIL = "elitecleanerscompany@gmail.com";
const ELITE_WEBSITE = "https://elitecleanerscompany.com";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();
document.getElementById("nicoRealtimeAudio")?.remove();

let nicoActivo = false;
let nicoPensando = false;
let ultimoComandoAgenda = "";

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <img id="nicoImg" src="nico-assets/saluda.png" />
  <button id="nicoBtn">💬</button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";
nicoChatPanel.innerHTML = `
  <div id="nicoChatHeader">
    <span>Nico</span>
    <button id="nicoChatClose">×</button>
  </div>
  <div id="nicoChatMessages"></div>
  <div id="nicoChatInputRow">
    <textarea id="nicoChatInput" placeholder="Escríbele a Nico..."></textarea>
    <button id="nicoChatSend">Enviar</button>
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
  left:auto !important;
  z-index:99999;
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  pointer-events:none;
}
#nicoBox *{ pointer-events:auto; }

#nicoImg{
  display:none;
  width:95px;
  height:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 14px rgba(0,0,0,.65));
  margin-bottom:4px;
  animation:nicoMagic .35s ease-out;
}

@keyframes nicoMagic{
  from{ opacity:0; transform:scale(.7) translateY(15px); }
  to{ opacity:1; transform:scale(1) translateY(0); }
}

#nicoBtn{
  width:64px;
  height:64px;
  border-radius:50%;
  border:none;
  background:#3b82f6;
  color:white;
  font-size:28px;
  font-weight:bold;
  box-shadow:0 8px 22px rgba(0,0,0,.45);
}

#nicoChatPanel{
  display:none;
  position:fixed !important;
  left:16px !important;
  right:96px !important;
  bottom:22px !important;
  z-index:99998;
  background:#111;
  border:1px solid #3b82f6;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,.6);
}

#nicoChatHeader{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 14px;
  background:#1c1c1e;
  color:white;
  font-weight:900;
}

#nicoChatClose{
  background:#ef4444;
  color:white;
  border:none;
  border-radius:50%;
  width:28px;
  height:28px;
  font-weight:bold;
}

#nicoChatMessages{
  max-height:300px;
  overflow-y:auto;
  padding:12px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.nicoMsg{
  padding:10px 12px;
  border-radius:15px;
  font-size:14px;
  line-height:1.35;
  max-width:90%;
  word-break:break-word;
  white-space:pre-wrap;
}

.nicoMsg.user{
  align-self:flex-end;
  background:#3b82f6;
  color:white;
}

.nicoMsg.nico{
  align-self:flex-start;
  background:#2c2c2e;
  color:white;
}

#nicoChatInputRow{
  display:flex;
  gap:8px;
  padding:10px;
  background:#1c1c1e;
}

#nicoChatInput{
  flex:1;
  min-height:44px;
  max-height:100px;
  resize:none;
  border:none;
  border-radius:14px;
  padding:12px;
  background:#2c2c2e;
  color:white;
  font-size:14px;
}

#nicoChatSend{
  border:none;
  border-radius:14px;
  padding:0 14px;
  background:#22c55e;
  color:white;
  font-weight:900;
}
`;
document.head.appendChild(style);

const nicoImg = document.getElementById("nicoImg");
const nicoBtn = document.getElementById("nicoBtn");
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
  nicoImg.src = imgs[tipo] || imgs.saluda;
}

function mostrarNico() {
  nicoImg.style.display = "block";
}

function ocultarNico() {
  nicoImg.style.display = "none";
}

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();
  if (t.includes("g.g") || t.includes("risa") || t.includes("chiste")) return "rie";
  if (t.includes("trabajo") || t.includes("cliente") || t.includes("agenda") || t.includes("limpieza")) return "celular";
  if (t.includes("música") || t.includes("musica") || t.includes("guitarra") || t.includes("cantar")) return "canta";
  if (t.includes("bien") || t.includes("perfecto") || t.includes("listo")) return "bien";
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
  nicoBtn.innerText = "×";
  imagenNico("saluda");
  mostrarNico();
  chatPanel.style.display = "block";

  if (!chatMessages.dataset.saludo) {
    agregarMensaje("nico", "Hola hola, ¿en qué puedo ayudarte?");
    chatMessages.dataset.saludo = "true";
  }

  setTimeout(() => chatInput.focus(), 150);
}

function cerrarNico() {
  nicoActivo = false;
  nicoBtn.innerText = "💬";
  imagenNico("reposo");
  ocultarNico();
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

// ================= TEXTO =================

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

Si quedó satisfecho/a con nuestro servicio, nos ayudaría muchísimo dejándonos una reseña en Google. Su opinión nos ayuda a seguir creciendo y a que más familias y empresas confíen en nuestro trabajo.

Puede dejar su reseña aquí:
${GOOGLE_REVIEW_LINK}

Muchas gracias por su apoyo.
Elite Cleaners Company
${ELITE_PHONE}`;
}

function mensajeContrato() {
  return `Claro, Rodri. Puedes enviarle esto al cliente:

Hola, muchas gracias por elegir Elite Cleaners Company.

Antes de realizar el servicio, le enviaremos nuestro acuerdo de servicios de limpieza para confirmar los detalles, condiciones del trabajo, responsabilidades y protección de ambas partes.

Por favor revise el contrato con calma y fírmelo antes de la fecha programada.

Si tiene alguna pregunta, con gusto podemos ayudarle.

Elite Cleaners Company
${ELITE_PHONE}
${ELITE_EMAIL}`;
}

function mensajeAviso() {
  return `Claro, Rodri. Puedes enviarle este aviso al cliente:

Hola, le saluda Elite Cleaners Company.

Queremos recordarle que su limpieza está programada próximamente. Por favor asegúrese de que tengamos acceso a la propiedad, agua y electricidad disponibles, y que cualquier área especial sea indicada antes de iniciar el servicio.

Si necesita hacer algún cambio en el horario o en los detalles de la limpieza, por favor avísenos con anticipación.

Muchas gracias.
Elite Cleaners Company
${ELITE_PHONE}`;
}

function mensajeConfirmacion() {
  return `Claro, Rodri. Puedes enviarle esto al cliente:

Hola, queremos confirmar su servicio de limpieza con Elite Cleaners Company.

Por favor confírmenos que la fecha, hora y dirección están correctas. También puede enviarnos cualquier instrucción especial antes de la limpieza.

Muchas gracias por confiar en nosotros.
Elite Cleaners Company
${ELITE_PHONE}`;
}

function mensajeCobro() {
  return `Claro, Rodri. Puedes enviarle esto al cliente:

Hola, muchas gracias por confiar en Elite Cleaners Company.

Le compartimos este mensaje como recordatorio amable del pago correspondiente al servicio de limpieza realizado. Puede realizar el pago por el método acordado.

Quedamos atentos. Muchas gracias.
Elite Cleaners Company
${ELITE_PHONE}`;
}

async function consultarTrabajosHoy() {
  try {
    imagenNico("celular");

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
    imagenNico("celular");

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

function detectarFuncionLocal(texto) {
  const t = normalizarTexto(texto);

  if (t.includes("trabajos de hoy") || t.includes("limpiezas de hoy") || t.includes("que tengo hoy")) return "hoy";
  if (t.includes("pendientes") || t.includes("trabajos pendientes")) return "pendientes";
  if (t.includes("reseña") || t.includes("resena") || t.includes("review")) return "resena";
  if (t.includes("contrato")) return "contrato";
  if (t.includes("aviso") || t.includes("recordatorio")) return "aviso";
  if (t.includes("confirmacion") || t.includes("confirmación") || t.includes("confirmar servicio")) return "confirmacion";
  if (t.includes("cobro") || t.includes("pago") || t.includes("payment")) return "cobro";

  return "";
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

  if (funcion === "confirmacion") {
    agregarMensaje("nico", mensajeConfirmacion());
    return true;
  }

  if (funcion === "cobro") {
    agregarMensaje("nico", mensajeCobro());
    return true;
  }

  return false;
}

// ================= NICO IA TEXTO =================

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
  nicoBtn.innerText = "…";

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
    nicoBtn.innerText = nicoActivo ? "×" : "💬";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoPensando = false;
  ultimoComandoAgenda = "";

  if (nicoBtn) nicoBtn.innerText = "💬";
  imagenNico("reposo");
  ocultarNico();
  chatPanel.style.display = "none";
}

window.NICO_STOP = apagarNico;
