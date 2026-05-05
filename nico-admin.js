// ================= NICO ADMIN CON MEMORIA PERMANENTE =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoActivo = false;
let nicoRespuesta = "";

// 🔥 MEMORIA
let ultimoTextoUsuario = "";

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.innerHTML = `
<div id="nicoBubble">Toca el micrófono y dime: Hola Nico</div>
<img id="nicoImg" src="nico-assets/saluda.png">
<button id="nicoBtn">🎙️</button>
`;
document.body.appendChild(nicoBox);

const style = document.createElement("style");
style.innerHTML = `
#nicoBox{position:fixed;right:16px;bottom:18px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;}
#nicoImg{width:90px;filter:drop-shadow(0 6px 12px rgba(0,0,0,.6));}
#nicoBubble{background:white;color:black;padding:10px;border-radius:15px;margin-bottom:6px;font-weight:bold;font-size:14px;max-width:220px;}
#nicoBtn{width:60px;height:60px;border-radius:50%;background:#3b82f6;color:white;font-size:24px;border:none;}
`;
document.head.appendChild(style);

const nicoImg = document.getElementById("nicoImg");
const nicoBubble = document.getElementById("nicoBubble");
const nicoBtn = document.getElementById("nicoBtn");

// ================= BOTÓN =================

nicoBtn.onclick = () => {
  if (nicoActivo) apagarNico();
  else activarNico();
};

// ================= MEMORIA =================

async function guardarMemoria(user, nico) {
  try {
    await db.collection("memoria_nico").add({
      user,
      nico,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.log("Error guardando memoria:", e);
  }
}

// ================= ACTIVAR =================

async function activarNico() {
  nicoActivo = true;
  nicoBtn.innerText = "⛔";
  nicoBubble.innerText = "Conectando con Nico...";

  const tokenRes = await fetch(NICO_SESSION_URL);
  const data = await tokenRes.json();
  const KEY = data.client_secret.value;

  nicoPC = new RTCPeerConnection();

  nicoAudio = document.createElement("audio");
  nicoAudio.autoplay = true;

  nicoPC.ontrack = e => nicoAudio.srcObject = e.streams[0];

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach(t => nicoPC.addTrack(t, stream));

  nicoDC = nicoPC.createDataChannel("oai-events");

  nicoDC.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    // 🧠 Lo que tú dices
    if (msg.type === "conversation.item.input_audio_transcription.completed") {
      ultimoTextoUsuario = msg.transcript || "";
    }

    // 🤖 Nico hablando
    if (msg.type === "response.audio_transcript.delta") {
      nicoRespuesta += msg.delta;
      nicoBubble.innerText = nicoRespuesta;
    }

    // ✅ Fin de respuesta
    if (msg.type === "response.done") {
      if (ultimoTextoUsuario && nicoRespuesta) {
        guardarMemoria(ultimoTextoUsuario, nicoRespuesta);
      }
      nicoRespuesta = "";
      ultimoTextoUsuario = "";
    }
  };

  const offer = await nicoPC.createOffer();
  await nicoPC.setLocalDescription(offer);

  const res = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/sdp"
    }
  });

  const answer = await res.text();
  await nicoPC.setRemoteDescription({ type: "answer", sdp: answer });
}

// ================= APAGAR =================

function apagarNico() {
  nicoActivo = false;
  nicoBtn.innerText = "🎙️";

  if (nicoPC) {
    nicoPC.getSenders().forEach(s => s.track && s.track.stop());
    nicoPC.close();
  }

  nicoPC = null;
  nicoDC = null;
  nicoAudio = null;

  nicoBubble.innerText = "Nico apagado";
}
