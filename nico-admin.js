// ================= NICO ADMIN - NIVEL JEFE UI =================
// WebRTC + voz + texto + memoria + micrófono inteligente

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoMicStream = null;
let nicoActivo = false;
let nicoRespuesta = "";
let ultimoTextoUsuario = "";
let nicoEstaHablando = false;
let nicoReadyResolve = null;
let nicoReadyPromise = null;

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <img id="nicoImg" src="nico-assets/saluda.png" />
  <button id="nicoBtn">🎙️</button>
`;

const nicoChatBox = document.createElement("div");
nicoChatBox.id = "nicoChatBox";
nicoChatBox.innerHTML = `
  <button id="nicoWriteBtn">✍️ Escribir con Nico</button>

  <div id="nicoChatPanel">
    <div id="nicoChatHeader">
      <span>Nico Jefe</span>
      <button id="nicoChatClose">×</button>
    </div>

    <div id="nicoChatMessages"></div>

    <div id="nicoChatInputRow">
      <textarea id="nicoChatInput" placeholder="Escríbele a Nico..."></textarea>
      <button id="nicoChatSend">Enviar</button>
    </div>
  </div>
`;

document.body.appendChild(nicoBox);
document.body.appendChild(nicoChatBox);

const style = document.createElement("style");
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
  width:92px;
  height:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 14px rgba(0,0,0,.65));
  margin-bottom:4px;
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

#nicoChatBox{
  position:fixed;
  left:16px;
  right:96px;
  bottom:22px;
  z-index:99998;
  pointer-events:none;
}

#nicoChatBox *{ pointer-events:auto; }

#nicoWriteBtn{
  width:100%;
  padding:14px 16px;
  border:none;
  border-radius:18px;
  background:#1c1c1e;
  color:white;
  font-size:15px;
  font-weight:900;
  border:1px solid #3b82f6;
  box-shadow:0 8px 22px rgba(0,0,0,.45);
}

#nicoChatPanel{
  display:none;
  margin-top:10px;
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
const nicoWriteBtn = document.getElementById("nicoWriteBtn");
const nicoChatPanel = document.getElementById("nicoChatPanel");
const nicoChatClose = document.getElementById("nicoChatClose");
const nicoChatMessages = document.getElementById("nicoChatMessages");
const nicoChatInput = document.getElementById("nicoChatInput");
const nicoChatSend = document.getElementById("nicoChatSend");

nicoBtn.onclick = () => {
  if (nicoActivo) apagarNico();
  else activarNico();
};

nicoWriteBtn.onclick = () => {
  nicoChatPanel.style.display = nicoChatPanel.style.display === "block" ? "none" : "block";
};

nicoChatClose.onclick = () => {
  nicoChatPanel.style.display = "none";
};

nicoChatSend.onclick = enviarTextoANico;

nicoChatInput.addEventListener("keydown", (e) => {
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

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();
  if (t.includes("g.g") || t.includes("risa") || t.includes("chiste")) return "rie";
  if (t.includes("trabajo") || t.includes("cliente") || t.includes("agenda") || t.includes("limpieza")) return "celular";
  if (t.includes("música") || t.includes("musica") || t.includes("guitarra") || t.includes("cantar")) return "canta";
  if (t.includes("bien") || t.includes("perfecto") || t.includes("listo")) return "bien";
  return "alegre";
}

// ================= CHAT UI =================

function agregarMensaje(tipo, texto) {
  const div = document.createElement("div");
  div.className = `nicoMsg ${tipo}`;
  div.innerText = texto;
  nicoChatMessages.appendChild(div);
  nicoChatMessages.scrollTop = nicoChatMessages.scrollHeight;
  return div;
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

// ================= ACTIVAR WEBRTC =================

async function activarNico() {
  try {
    if (nicoActivo) return nicoReadyPromise;

    nicoActivo = true;
    nicoRespuesta = "";
    ultimoTextoUsuario = "";
    nicoEstaHablando = false;

    nicoReadyPromise = new Promise(resolve => {
      nicoReadyResolve = resolve;
    });

    nicoBtn.innerText = "⛔";
    imagenNico("piensa");

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

    nicoDC.onopen = () => {
      imagenNico("saluda");
      activarMicrofono();
      if (nicoReadyResolve) nicoReadyResolve();
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

          if (window.nicoCurrentAssistantMsg) {
            window.nicoCurrentAssistantMsg.innerText = nicoRespuesta;
            nicoChatMessages.scrollTop = nicoChatMessages.scrollHeight;
          }
        }

        if (msg.type === "response.done") {
          const userFinal = (ultimoTextoUsuario || "").trim();
          const nicoFinal = (nicoRespuesta || "").trim();

          if (userFinal && nicoFinal) {
            await guardarMemoria(userFinal, nicoFinal);
          }

          nicoRespuesta = "";
          ultimoTextoUsuario = "";
          nicoEstaHablando = false;
          window.nicoCurrentAssistantMsg = null;

          imagenNico("saluda");

          setTimeout(() => {
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

    return nicoReadyPromise;

  } catch (error) {
    console.error("Error Nico:", error);
    nicoActivo = false;
    nicoEstaHablando = false;
    nicoBtn.innerText = "🎙️";
    imagenNico("reposo");
  }
}

// ================= ENVIAR TEXTO A NICO =================

async function enviarTextoANico() {
  const mensaje = nicoChatInput.value.trim();
  if (!mensaje) return;

  nicoChatInput.value = "";
  nicoChatPanel.style.display = "block";

  agregarMensaje("user", mensaje);

  if (debeApagarse(mensaje)) {
    agregarMensaje("nico", "Listo Rodri... me desconecto.");
    apagarNico();
    return;
  }

  await activarNico();
  silenciarMicrofono();

  ultimoTextoUsuario = mensaje;
  nicoRespuesta = "";
  window.nicoCurrentAssistantMsg = agregarMensaje("nico", "Nico está pensando...");

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

  nicoDC.send(JSON.stringify({
    type: "response.create"
  }));
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoRespuesta = "";
  ultimoTextoUsuario = "";
  nicoEstaHablando = false;
  window.nicoCurrentAssistantMsg = null;

  nicoBtn.innerText = "🎙️";
  imagenNico("reposo");

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
