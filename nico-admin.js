// ================= NICO ADMIN WEBRTC FINAL + AGENDA AUTOMÁTICA =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";
const CREAR_TRABAJO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearTrabajoConfirmado";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoMicStream = null;
let nicoActivo = false;
let nicoEstaHablando = false;
let nicoRespuesta = "";
let ultimoTextoUsuario = "";
let nicoReadyResolve = null;
let nicoReadyPromise = null;
let currentAssistantMsg = null;
let saludoInicialHecho = false;
let ultimoComandoAgenda = "";

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <img id="nicoImg" src="nico-assets/saluda.png" />
  <button id="nicoBtn">🎙️</button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";
nicoChatPanel.innerHTML = `
  <div id="nicoChatHeader">
    <span>Chatear con Nico</span>
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
  max-height:230px;
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
  line-height:1.3;
  max-width:88%;
  word-break:break-word;
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
  max-height:90px;
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

nicoBtn.onclick = async () => {
  if (nicoActivo) apagarNico();
  else await activarNico();
};

chatClose.onclick = () => {
  chatPanel.style.display = "none";
};

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

// ================= MICRÓFONO =================

function silenciarMicrofono() {
  if (!nicoMicStream) return;
  nicoMicStream.getAudioTracks().forEach(track => track.enabled = false);
}

function activarMicrofono() {
  if (!nicoMicStream || !nicoActivo || nicoEstaHablando) return;
  nicoMicStream.getAudioTracks().forEach(track => track.enabled = true);
}

function debeApagarse(texto) {
  const t = (texto || "").toLowerCase();
  return (
    t.includes("bye nico") ||
    t.includes("bay nico") ||
    t.includes("chao nico") ||
    t.includes("desconéctate nico") ||
    t.includes("desconectate nico") ||
    t.includes("nico desconéctate") ||
    t.includes("nico desconectate")
  );
}

function debeAbrirChat(texto) {
  const t = (texto || "").toLowerCase();
  return (
    t.includes("te voy a escribir") ||
    t.includes("voy a escribir") ||
    t.includes("quiero escribirte") ||
    t.includes("quiero escribir") ||
    t.includes("abrir chat") ||
    t.includes("abre el chat") ||
    t.includes("escribir con nico")
  );
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

function abrirChatNico() {
  chatPanel.style.display = "block";
  setTimeout(() => chatInput.focus(), 200);
}

// ================= MEMORIA =================

async function guardarMemoria(user, nico) {
  try {
    if (!user || !nico) return;

    await db.collection("memoria_nico").add({
      user,
      nico,
      fecha_texto: new Date().toLocaleString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    await db.collection("memoria_nico_completa").add({
      role_user: "Rodri",
      user,
      role_nico: "Nico",
      nico,
      fecha_texto: new Date().toLocaleString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

  } catch (e) {
    console.log("No pude guardar memoria:", e);
  }
}

// ================= AGENDA AUTOMÁTICA =================

function normalizarTexto(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

  let m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a m|p m|a\.m|p\.m)?/);
  if (!m) return "";

  let h = parseInt(m[1], 10);
  let min = m[2] || "00";
  const mer = (m[3] || "").replace(/\s|\./g, "");

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
    notas: `Creado por Nico desde voz/texto. Comando original: ${texto}`,
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

    await guardarMemoria(
      texto,
      `Agendé el trabajo para ${trabajo.cliente} el ${trabajo.fecha} a las ${trabajo.hora}, tipo ${trabajo.tipo}.`
    );

    if (nicoDC && nicoDC.readyState === "open") {
      nicoDC.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Confirma en una frase corta que ya agendaste a ${trabajo.cliente} el ${trabajo.fecha} a las ${trabajo.hora} con limpieza ${trabajo.tipo}.`
            }
          ]
        }
      }));

      setTimeout(() => {
        nicoDC.send(JSON.stringify({
          type: "response.create",
          response: {
            instructions: "Confirma en una frase corta que el trabajo fue agendado."
          }
        }));
      }, 300);
    }

    return true;

  } catch (e) {
    console.log("No pude crear trabajo automático:", e);
    return false;
  }
}

// ================= ACTIVAR NICO =================

async function activarNico() {
  try {
    if (nicoActivo) return nicoReadyPromise;

    nicoActivo = true;
    nicoEstaHablando = false;
    nicoRespuesta = "";
    ultimoTextoUsuario = "";
    saludoInicialHecho = false;

    nicoBtn.innerText = "⛔";
    imagenNico("saluda");
    mostrarNico();

    nicoReadyPromise = new Promise(resolve => {
      nicoReadyResolve = resolve;
    });

    const tokenRes = await fetch(NICO_SESSION_URL);
    const tokenData = await tokenRes.json();

    const KEY = tokenData.client_secret?.value || tokenData.client_secret || tokenData.value;

    if (!KEY) throw new Error("No llegó token Realtime");

    nicoPC = new RTCPeerConnection();

    nicoAudio = document.createElement("audio");
    nicoAudio.autoplay = true;
    nicoAudio.playsInline = true;

    nicoPC.ontrack = async (event) => {
      nicoAudio.srcObject = event.streams[0];
      try { await nicoAudio.play(); } catch (e) {}
    };

    nicoMicStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    nicoMicStream.getTracks().forEach(track => {
      nicoPC.addTrack(track, nicoMicStream);
    });

    nicoDC = nicoPC.createDataChannel("oai-events");

    nicoDC.onopen = () => {
      imagenNico("saluda");

      if (nicoReadyResolve) nicoReadyResolve();

      if (!saludoInicialHecho) {
        saludoInicialHecho = true;
        silenciarMicrofono();

        nicoDC.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Nico, saluda una sola vez, muy corto, y después quédate callado esperando que Rodrigo hable."
              }
            ]
          }
        }));

        setTimeout(() => {
          nicoDC.send(JSON.stringify({
            type: "response.create",
            response: {
              instructions: "Di exactamente: Hola hola, ¿en qué puedo ayudarte? Después guarda silencio."
            }
          }));
        }, 800);
      }
    };

    nicoDC.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "input_audio_buffer.speech_started") {
          if (nicoEstaHablando) {
            silenciarMicrofono();
            return;
          }
          nicoRespuesta = "";
          imagenNico("saluda");
        }

        if (msg.type === "input_audio_buffer.speech_stopped") {
          if (!nicoEstaHablando) imagenNico("piensa");
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          const texto = msg.transcript || "";
          if (nicoEstaHablando) return;

          ultimoTextoUsuario = texto;

          if (debeApagarse(texto)) {
            imagenNico("bien");
            setTimeout(apagarNico, 500);
            return;
          }

          if (debeAbrirChat(texto)) {
            abrirChatNico();
          }

          await crearTrabajoAutomatico(texto);
        }

        if (msg.type === "response.created") {
          nicoEstaHablando = true;
          nicoRespuesta = "";
          silenciarMicrofono();
          imagenNico("piensa");
        }

        if (msg.type === "response.audio.delta") {
          nicoEstaHablando = true;
          silenciarMicrofono();
          imagenNico(detectarImagen(nicoRespuesta));
        }

        if (msg.type === "response.audio_transcript.delta") {
          nicoEstaHablando = true;
          silenciarMicrofono();

          const delta = msg.delta || "";
          nicoRespuesta += delta;

          imagenNico(detectarImagen(nicoRespuesta));

          if (currentAssistantMsg) {
            currentAssistantMsg.innerText = nicoRespuesta;
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }

        if (msg.type === "response.done") {
          const userFinal = (ultimoTextoUsuario || "").trim();
          const nicoFinal = (nicoRespuesta || "").trim();

          const esSaludoAuto = nicoFinal.toLowerCase().includes("hola hola") && !userFinal;

          if (userFinal && nicoFinal && !esSaludoAuto) {
            await guardarMemoria(userFinal, nicoFinal);
          }

          nicoRespuesta = "";
          ultimoTextoUsuario = "";
          currentAssistantMsg = null;

          imagenNico("saluda");

          setTimeout(() => {
            nicoEstaHablando = false;
            activarMicrofono();
          }, 2200);
        }

      } catch (e) {
        console.log("Evento Nico:", event.data);
      }
    };

    const offer = await nicoPC.createOffer();
    await nicoPC.setLocalDescription(offer);

    const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/sdp"
      }
    });

    if (!sdpResponse.ok) throw new Error(await sdpResponse.text());

    await nicoPC.setRemoteDescription({
      type: "answer",
      sdp: await sdpResponse.text()
    });

    return nicoReadyPromise;

  } catch (error) {
    console.error("Error Nico:", error);
    apagarNico();
  }
}

// ================= ENVIAR TEXTO =================

async function enviarTextoANico() {
  const mensaje = chatInput.value.trim();
  if (!mensaje) return;

  chatInput.value = "";
  chatPanel.style.display = "block";

  agregarMensaje("user", mensaje);

  if (debeApagarse(mensaje)) {
    agregarMensaje("nico", "Listo Rodri... me desconecto.");
    apagarNico();
    return;
  }

  await activarNico();

  const creado = await crearTrabajoAutomatico(mensaje);
  if (creado) {
    agregarMensaje("nico", "Listo, Rodri. Ya lo agendé y debe aparecer en la app.");
    return;
  }

  silenciarMicrofono();

  ultimoTextoUsuario = mensaje;
  nicoRespuesta = "";
  currentAssistantMsg = agregarMensaje("nico", "Nico está pensando...");

  nicoDC.send(JSON.stringify({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: mensaje
        }
      ]
    }
  }));

  setTimeout(() => {
    nicoDC.send(JSON.stringify({
      type: "response.create"
    }));
  }, 300);
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoEstaHablando = false;
  nicoRespuesta = "";
  ultimoTextoUsuario = "";
  currentAssistantMsg = null;
  saludoInicialHecho = false;

  nicoBtn.innerText = "🎙️";
  imagenNico("reposo");
  ocultarNico();
  chatPanel.style.display = "none";

  if (nicoAudio) {
    try {
      nicoAudio.pause();
      nicoAudio.srcObject = null;
    } catch (e) {}
  }

  if (nicoMicStream) {
    nicoMicStream.getTracks().forEach(track => track.stop());
  }

  if (nicoPC) {
    nicoPC.getSenders().forEach(sender => {
      if (sender.track) sender.track.stop();
    });
    nicoPC.close();
  }

  nicoPC = null;
  nicoDC = null;
  nicoAudio = null;
  nicoMicStream = null;
  nicoReadyPromise = null;
  nicoReadyResolve = null;
}

window.NICO_STOP = apagarNico;
