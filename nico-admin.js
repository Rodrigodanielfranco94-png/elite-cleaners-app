// ================= NICO ADMIN WEBRTC + MEMORIA + FIJO DERECHA =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoActivo = false;
let nicoRespuesta = "";
let ultimoTextoUsuario = "";

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <div id="nicoBubble">Toca el micrófono y dime: Hola Nico</div>
  <img id="nicoImg" src="nico-assets/saluda.png" />
  <button id="nicoBtn">🎙️</button>
`;
document.body.appendChild(nicoBox);

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
}
#nicoBubble{
  background:white;
  color:#111;
  border:2px solid #3b82f6;
  border-radius:18px;
  padding:10px 12px;
  max-width:245px;
  font-size:14px;
  font-weight:800;
  line-height:1.25;
  margin-bottom:4px;
  box-shadow:0 8px 22px rgba(0,0,0,.35);
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
`;
document.head.appendChild(style);

const nicoImg = document.getElementById("nicoImg");
const nicoBubble = document.getElementById("nicoBubble");
const nicoBtn = document.getElementById("nicoBtn");

nicoBtn.onclick = () => {
  if (nicoActivo) apagarNico();
  else activarNico();
};

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

function decir(texto, imagen = "saluda") {
  imagenNico(imagen);
  nicoBubble.innerText = texto;
}

function debeApagarse(texto) {
  const t = (texto || "").toLowerCase();
  return t.includes("bye nico") ||
         t.includes("bay nico") ||
         t.includes("chao nico") ||
         t.includes("nico desconéctate") ||
         t.includes("nico desconectate");
}

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();
  if (t.includes("g.g") || t.includes("risa") || t.includes("chiste")) return "rie";
  if (t.includes("trabajo") || t.includes("cliente") || t.includes("agenda") || t.includes("limpieza")) return "celular";
  if (t.includes("música") || t.includes("musica") || t.includes("guitarra") || t.includes("cantar")) return "canta";
  if (t.includes("bien") || t.includes("perfecto") || t.includes("listo")) return "bien";
  return "alegre";
}

async function guardarMemoria(user, nico) {
  try {
    if (!user || !nico) return;
    await db.collection("memoria_nico").add({
      user,
      nico,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.log("No pude guardar memoria:", e);
  }
}

async function activarNico() {
  try {
    nicoActivo = true;
    nicoRespuesta = "";
    ultimoTextoUsuario = "";
    nicoBtn.innerText = "⛔";
    decir("Conectando con Nico...", "piensa");

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

    const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    mic.getTracks().forEach(track => nicoPC.addTrack(track, mic));

    nicoDC = nicoPC.createDataChannel("oai-events");

    nicoDC.onopen = () => {
      decir("Listo, Rodri. Te escucho...", "saluda");
    };

    nicoDC.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "input_audio_buffer.speech_started") {
          nicoRespuesta = "";
          decir("Te escucho...", "saluda");
        }

        if (msg.type === "input_audio_buffer.speech_stopped") {
          decir("Mmm... pensando.", "piensa");
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          ultimoTextoUsuario = msg.transcript || "";

          if (debeApagarse(ultimoTextoUsuario)) {
            decir("Listo Rodri... me desconecto.", "bien");
            setTimeout(apagarNico, 900);
            return;
          }
        }

        if (msg.type === "response.audio_transcript.delta") {
          nicoRespuesta += msg.delta || "";
          decir(nicoRespuesta, detectarImagen(nicoRespuesta));
        }

        if (msg.type === "response.done") {
          if (ultimoTextoUsuario && nicoRespuesta) {
            await guardarMemoria(ultimoTextoUsuario, nicoRespuesta);
          }

          nicoRespuesta = "";
          ultimoTextoUsuario = "";

          setTimeout(() => {
            if (nicoActivo) decir("Te escucho, Rodri...", "saluda");
          }, 1200);
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
    decir("Uff... no pude conectarme, Rodri.", "piensa");
    nicoActivo = false;
    nicoBtn.innerText = "🎙️";
  }
}

function apagarNico() {
  nicoActivo = false;
  nicoRespuesta = "";
  ultimoTextoUsuario = "";
  nicoBtn.innerText = "🎙️";

  if (nicoPC) {
    nicoPC.getSenders().forEach(sender => {
      if (sender.track) sender.track.stop();
    });
    nicoPC.close();
  }

  nicoPC = null;
  nicoDC = null;
  nicoAudio = null;

  decir("Toca el micrófono y dime: Hola Nico", "saluda");
}
