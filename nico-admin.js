// ================= NICO ADMIN ESTABLE - WEBRTC PURO =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

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
let saludoInicialHecho = false;

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
  margin-bottom:4px;
  filter:drop-shadow(0 0 12px rgba(59,130,246,.7)) drop-shadow(0 12px 22px rgba(0,0,0,.65));
}

.nicoTornado{
  animation:nicoTornado .9s cubic-bezier(.19,1,.22,1), nicoFloat 3s ease-in-out infinite;
}

@keyframes nicoTornado{
  0%{ opacity:0; transform:scale(.15) rotate(-720deg) translateY(120px); filter:blur(18px); }
  40%{ opacity:1; transform:scale(1.15) rotate(25deg) translateY(-8px); filter:blur(2px); }
  70%{ transform:scale(.96) rotate(-8deg) translateY(4px); }
  100%{ opacity:1; transform:scale(1) rotate(0deg) translateY(0); filter:blur(0); }
}

@keyframes nicoFloat{
  0%{ transform:translateY(0); }
  50%{ transform:translateY(-4px); }
  100%{ transform:translateY(0); }
}

#nicoBtn{
  width:68px;
  height:68px;
  border-radius:50%;
  border:none;
  background:linear-gradient(135deg,#3b82f6,#2563eb);
  color:white;
  font-size:30px;
  box-shadow:0 10px 28px rgba(0,0,0,.45), 0 0 18px rgba(59,130,246,.5);
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
  resize:none;
  border:none;
  border-radius:14px;
  padding:12px;
  background:#2c2c2e;
  color:white;
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

// ================= HELPERS =================

function normalizarTexto(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  nicoImg.classList.remove("nicoTornado");
  void nicoImg.offsetWidth;
  nicoImg.classList.add("nicoTornado");
}

function ocultarNico() {
  nicoImg.style.display = "none";
}

function abrirChatNico() {
  chatPanel.style.display = "block";
  setTimeout(() => chatInput.focus(), 200);
}

function agregarMensaje(tipo, texto) {
  const div = document.createElement("div");
  div.className = `nicoMsg ${tipo}`;
  div.innerText = texto;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function silenciarMicrofono() {
  if (!nicoMicStream) return;
  nicoMicStream.getAudioTracks().forEach(track => track.enabled = false);
}

function activarMicrofono() {
  if (!nicoMicStream || !nicoActivo || nicoEstaHablando) return;
  nicoMicStream.getAudioTracks().forEach(track => track.enabled = true);
}

function debeApagarse(texto) {
  const t = normalizarTexto(texto);
  return t.includes("bye nico") || t.includes("bay nico") || t.includes("chao nico") || t.includes("desconectate nico") || t.includes("nico desconectate");
}

function debeAbrirChat(texto) {
  const t = normalizarTexto(texto);
  return t.includes("te quiero escribir") || t.includes("te voy a escribir") || t.includes("quiero escribirte") || t.includes("abrir chat") || t.includes("abre el chat");
}

async function guardarMemoria(user, nico) {
  try {
    if (!user || !nico) return;
    await db.collection("memoria_nico").add({
      user,
      nico,
      fecha_texto: new Date().toLocaleString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.log("No pude guardar memoria:", e);
  }
}

async function decirPorWebRTC(texto) {
  if (!nicoDC || nicoDC.readyState !== "open") return;

  nicoDC.send(JSON.stringify({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: texto }]
    }
  }));

  nicoDC.send(JSON.stringify({ type: "response.create" }));
}

// ================= AGENDA DIRECTA FIRESTORE =================

function esComandoAgenda(texto) {
  const t = normalizarTexto(texto);
  return t.includes("agenda") || t.includes("agendar") || t.includes("programa") || t.includes("programar") || t.includes("crear limpieza") || t.includes("crea limpieza");
}

function extraerTipo(texto) {
  const t = normalizarTexto(texto);
  if (t.includes("profunda") || t.includes("deep")) return "PROFUNDA";
  if (t.includes("move in")) return "MOVE-IN";
  if (t.includes("move out")) return "MOVE-OUT";
  if (t.includes("post construccion") || t.includes("post construction")) return "POST-CONSTRUCCION";
  if (t.includes("primera")) return "PRIMERA";
  return "ESTÁNDAR";
}

function extraerFecha(texto) {
  const t = normalizarTexto(texto);
  const meses = {
    enero:"01", febrero:"02", marzo:"03", abril:"04", mayo:"05", junio:"06",
    julio:"07", agosto:"08", septiembre:"09", setiembre:"09", octubre:"10",
    noviembre:"11", diciembre:"12"
  };
  let year = new Date().getFullYear();

  let m = t.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/);
  if (m) {
    if (m[3]) year = m[3];
    return `${year}-${meses[m[2]]}-${m[1].padStart(2,"0")}`;
  }

  if (t.includes("manana")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0,10);
  }

  if (t.includes("hoy")) return new Date().toISOString().slice(0,10);

  return "";
}

function extraerHora(texto) {
  const t = normalizarTexto(texto);

  let m = t.match(/(?:a\s+las\s+|alas\s+)(\d{1,2})(?::(\d{2}))?\s*(am|pm|a m|p m)?/);
  if (!m) m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a m|p m)/);
  if (!m) return "";

  let h = parseInt(m[1], 10);
  const min = m[2] || "00";
  const mer = (m[3] || "").replace(/\s/g, "");

  if (mer === "pm" && h < 12) h += 12;
  if (mer === "am" && h === 12) h = 0;

  return `${String(h).padStart(2,"0")}:${min}`;
}

function extraerCliente(texto) {
  let limpio = texto
    .replace(/agenda(r)?/gi, "")
    .replace(/programa(r)?/gi, "")
    .replace(/la limpieza de/gi, "")
    .replace(/limpieza de/gi, "")
    .replace(/una limpieza de/gi, "")
    .replace(/^a\s+/i, "")
    .trim();

  const corte = limpio.search(/(\d{1,2}\s+de\s+|hoy|mañana|manana|a las|alas|limpieza|estandar|estándar|profunda|move|post|primera)/i);
  if (corte > 0) limpio = limpio.substring(0, corte);

  return limpio.replace(/\s+/g, " ").trim();
}

async function crearTrabajoDirectoFirestore(textoOriginal) {
  try {
    if (!esComandoAgenda(textoOriginal)) return false;

    const cliente = extraerCliente(textoOriginal);
    const fecha = extraerFecha(textoOriginal);
    const hora = extraerHora(textoOriginal);
    const tipo = extraerTipo(textoOriginal);

    if (!cliente || !fecha || !hora) {
      await decirPorWebRTC(`Dile a Rodri en una frase corta: No pude agendar porque me falta ${!cliente ? "el cliente " : ""}${!fecha ? "la fecha " : ""}${!hora ? "la hora" : ""}.`);
      return true;
    }

    const trabajo = {
      cliente,
      direccion: "",
      whatsapp: "",
      empleado_nombre: "",
      empleado_email: "",
      empleado_nombre_2: "",
      empleado_email_2: "",
      fecha,
      hora,
      notas: `Creado automáticamente por Nico. Comando original: ${textoOriginal}`,
      tipo,
      estado: "pendiente",
      hora_inicio: "--:--",
      hora_fin: "--:--",
      firma_cliente: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("servicios").add(trabajo);

    await db.collection("clientes").doc(cliente).set({
      nombre: cliente,
      direccion: "",
      whatsapp: "",
      telefono: "",
      actualizado: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await guardarMemoria(textoOriginal, `Agendé ${cliente} ${fecha} ${hora} ${tipo}. ID ${docRef.id}`);

    await decirPorWebRTC(`Confirma en una frase corta: Listo, ya agendé a ${cliente} el ${fecha} a las ${hora} con limpieza ${tipo}.`);

    return true;

  } catch (e) {
    console.log("Error agenda:", e);
    await decirPorWebRTC("Dile a Rodri en una frase corta: Hubo un error guardando la limpieza en Firestore.");
    return true;
  }
}

// ================= ACTIVAR NICO =================

async function activarNico() {
  try {
    if (nicoActivo) return;

    nicoActivo = true;
    nicoEstaHablando = false;
    nicoRespuesta = "";
    ultimoTextoUsuario = "";
    saludoInicialHecho = false;

    nicoBtn.innerText = "⛔";
    imagenNico("saluda");
    mostrarNico();

    const tokenRes = await fetch(NICO_SESSION_URL);
    const tokenData = await tokenRes.json();
    const KEY = tokenData.client_secret?.value || tokenData.value;

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

    nicoMicStream.getTracks().forEach(track => nicoPC.addTrack(track, nicoMicStream));

    nicoDC = nicoPC.createDataChannel("oai-events");

    nicoDC.onopen = async () => {
      imagenNico("saluda");

      if (!saludoInicialHecho) {
        saludoInicialHecho = true;
        silenciarMicrofono();

        await decirPorWebRTC("Di exactamente: Hola hola, ¿en qué puedo ayudarte? Luego guarda silencio.");
      }
    };

    nicoDC.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          const texto = msg.transcript || "";

          if (debeAbrirChat(texto)) {
            abrirChatNico();
            await decirPorWebRTC("Responde solamente: Ok.");
            ultimoTextoUsuario = "";
            return;
          }

          if (nicoEstaHablando) return;

          ultimoTextoUsuario = texto;

          if (debeApagarse(texto)) {
            imagenNico("bien");
            setTimeout(apagarNico, 500);
            return;
          }

          const ejecutado = await crearTrabajoDirectoFirestore(texto);
          if (ejecutado) ultimoTextoUsuario = "";
        }

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

        if (msg.type === "response.created") {
          nicoEstaHablando = true;
          nicoRespuesta = "";
          silenciarMicrofono();
          imagenNico("piensa");
        }

        if (msg.type === "response.audio_transcript.delta") {
          nicoEstaHablando = true;
          silenciarMicrofono();
          nicoRespuesta += msg.delta || "";
        }

        if (msg.type === "response.done") {
          const userFinal = (ultimoTextoUsuario || "").trim();
          const nicoFinal = (nicoRespuesta || "").trim();

          if (userFinal && nicoFinal && !nicoFinal.toLowerCase().includes("hola hola")) {
            await guardarMemoria(userFinal, nicoFinal);
          }

          nicoRespuesta = "";
          ultimoTextoUsuario = "";
          imagenNico("saluda");

          setTimeout(() => {
            nicoEstaHablando = false;
            activarMicrofono();
          }, 1800);
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
  agregarMensaje("user", mensaje);

  if (!nicoActivo) await activarNico();

  const ejecutado = await crearTrabajoDirectoFirestore(mensaje);
  if (ejecutado) return;

  ultimoTextoUsuario = mensaje;
  nicoRespuesta = "";
  const msgDiv = agregarMensaje("nico", "Nico está pensando...");

  nicoDC.send(JSON.stringify({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: mensaje }]
    }
  }));

  nicoDC.send(JSON.stringify({ type: "response.create" }));

  currentAssistantMsg = msgDiv;
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoEstaHablando = false;
  nicoRespuesta = "";
  ultimoTextoUsuario = "";
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
}

window.NICO_STOP = apagarNico;
