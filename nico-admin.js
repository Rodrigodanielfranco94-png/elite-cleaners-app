// ================= NICO ADMIN WEBRTC
// MEMORIA HUMANA PERMANENTE + MICRÓFONO INTELIGENTE
// =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoMicStream = null;
let nicoActivo = false;

let nicoRespuesta = "";
let ultimoTextoUsuario = "";
let nicoEstaHablando = false;

// ================= UI SIN CUADRO BLANCO =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
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

#nicoBox *{
  pointer-events:auto;
}

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
`;
document.head.appendChild(style);

const nicoImg = document.getElementById("nicoImg");
const nicoBtn = document.getElementById("nicoBtn");

nicoBtn.onclick = () => {
  if (nicoActivo) apagarNico();
  else activarNico();
};

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

// ================= MICRÓFONO INTELIGENTE =================

function silenciarMicrofono() {
  if (!nicoMicStream) return;

  nicoMicStream.getAudioTracks().forEach(track => {
    track.enabled = false;
  });
}

function activarMicrofono() {
  if (!nicoMicStream || !nicoActivo) return;

  nicoMicStream.getAudioTracks().forEach(track => {
    track.enabled = true;
  });
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

// ================= MEMORIA HUMANA PERMANENTE =================

async function guardarMemoria(user, nico) {
  try {
    if (!user || !nico) return;

    await db.collection("memoria_nico").add({
      user: user,
      nico: nico,
      fecha_texto: new Date().toLocaleString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    await db.collection("memoria_nico_completa").add({
      role_user: "Rodri",
      user: user,
      role_nico: "Nico",
      nico: nico,
      fecha_texto: new Date().toLocaleString(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

  } catch (e) {
    console.log("No pude guardar memoria:", e);
  }
}

// ================= ACTIVAR NICO =================

async function activarNico() {
  try {
    if (nicoActivo) return;

    nicoActivo = true;
    nicoRespuesta = "";
    ultimoTextoUsuario = "";
    nicoEstaHablando = false;

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

      nicoAudio.onplay = () => {
        nicoEstaHablando = true;
        imagenNico("alegre");
        silenciarMicrofono();
      };

      nicoAudio.onended = () => {
        nicoEstaHablando = false;
        imagenNico("saluda");
        setTimeout(() => {
          activarMicrofono();
        }, 500);
      };

      try {
        await nicoAudio.play();
      } catch (e) {
        console.log("Audio bloqueado:", e);
      }
    };

    nicoMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    nicoMicStream.getTracks().forEach(track => nicoPC.addTrack(track, nicoMicStream));

    nicoDC = nicoPC.createDataChannel("oai-events");

    nicoDC.onopen = () => {
      imagenNico("saluda");
      activarMicrofono();
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
          if (!nicoEstaHablando) {
            imagenNico("piensa");
          }
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          ultimoTextoUsuario = msg.transcript || "";

          if (debeApagarse(ultimoTextoUsuario)) {
            imagenNico("bien");
            setTimeout(apagarNico, 500);
            return;
          }
        }

        if (msg.type === "response.audio_transcript.delta") {
          const delta = msg.delta || "";
          nicoRespuesta += delta;

          imagenNico(detectarImagen(nicoRespuesta));
          silenciarMicrofono();
        }

        if (msg.type === "response.audio.delta") {
          nicoEstaHablando = true;
          silenciarMicrofono();
          imagenNico(detectarImagen(nicoRespuesta));
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

          imagenNico("saluda");

          setTimeout(() => {
            activarMicrofono();
          }, 700);
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

    if (!sdpResponse.ok) {
      throw new Error(await sdpResponse.text());
    }

    await nicoPC.setRemoteDescription({
      type: "answer",
      sdp: await sdpResponse.text()
    });

  } catch (error) {
    console.error("Error Nico:", error);

    nicoActivo = false;
    nicoEstaHablando = false;
    nicoBtn.innerText = "🎙️";
    imagenNico("reposo");

    if (nicoMicStream) {
      nicoMicStream.getTracks().forEach(track => track.stop());
      nicoMicStream = null;
    }
  }
}

// ================= APAGAR NICO =================

function apagarNico() {
  nicoActivo = false;
  nicoRespuesta = "";
  ultimoTextoUsuario = "";
  nicoEstaHablando = false;

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
}
