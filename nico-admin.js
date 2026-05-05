// ================= NICO ADMIN WEBRTC LIMPIO =================

const NICO_SESSION_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearSesionRealtime";

let nicoPC = null;
let nicoDC = null;
let nicoAudio = null;
let nicoActivo = false;
let nicoVisible = false;
let nicoRespuesta = "";

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";
nicoBox.innerHTML = `
  <div id="nicoBubble">Toca el micrófono y dime: “Hola Nico”.</div>
  <img id="nicoImg" src="nico-assets/saluda.png" />
  <button id="nicoMicBtn">🎙️</button>
`;

document.body.appendChild(nicoBox);

const style = document.createElement("style");
style.innerHTML = `
#nicoBox{
  position:fixed;
  right:16px;
  bottom:18px;
  z-index:99999;
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  pointer-events:none;
}

#nicoImg{
  width:92px;
  height:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 14px rgba(0,0,0,.65));
  display:none;
  pointer-events:auto;
}

#nicoBubble{
  display:none;
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
  pointer-events:auto;
}

#nicoMicBtn{
  width:64px;
  height:64px;
  border-radius:50%;
  border:none;
  background:#3b82f6;
  color:white;
  font-size:28px;
  font-weight:bold;
  box-shadow:0 8px 22px rgba(0,0,0,.45);
  pointer-events:auto;
}
`;
document.head.appendChild(style);

const nicoImg = document.getElementById("nicoImg");
const nicoBubble = document.getElementById("nicoBubble");
const nicoMicBtn = document.getElementById("nicoMicBtn");

nicoMicBtn.onclick = () => {
  if (nicoActivo) {
    apagarNico();
  } else {
    activarNico();
  }
};

function mostrarNico(texto = "Aquí estoy, Rodri.") {
  nicoVisible = true;
  nicoImg.style.display = "block";
  nicoBubble.style.display = "block";
  nicoBubble.innerText = texto;
}

function ocultarNico() {
  nicoVisible = false;
  nicoImg.style.display = "none";
  nicoBubble.style.display = "none";
}

function imagenNico(tipo) {
  const imagenes = {
    saluda: "nico-assets/saluda.png",
    piensa: "nico-assets/piensa.png",
    alegre: "nico-assets/alegre.png",
    rie: "nico-assets/rie.png",
    celular: "nico-assets/celular.png",
    canta: "nico-assets/canta.png",
    bien: "nico-assets/bien.png",
    reposo: "nico-assets/reposo.png"
  };
  nicoImg.src = imagenes[tipo] || imagenes.saluda;
}

function debeApagarse(texto) {
  const t = (texto || "").toLowerCase();
  return (
    t.includes("bye nico") ||
    t.includes("bay nico") ||
    t.includes("chao nico") ||
    t.includes("nico desconéctate") ||
    t.includes("nico desconectate")
  );
}

function debeAparecer(texto) {
  const t = (texto || "").toLowerCase();
  return (
    t.includes("hola nico") ||
    t.includes("oye nico") ||
    t.includes("hey nico")
  );
}

function detectarImagen(texto) {
  const t = (texto || "").toLowerCase();

  if (t.includes("g.g") || t.includes("risa") || t.includes("chiste")) return "rie";
  if (t.includes("trabajo") || t.includes("cliente") || t.includes("agenda") || t.includes("limpieza")) return "celular";
  if (t.includes("música") || t.includes("musica") || t.includes("guitarra") || t.includes("cantar")) return "canta";
  if (t.includes("bien") || t.includes("perfecto") || t.includes("listo")) return "bien";

  return "alegre";
}

async function activarNico() {
  try {
    nicoActivo = true;
    nicoMicBtn.innerText = "⛔";
    imagenNico("saluda");
    mostrarNico("Conectando con Nico...");

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
      try {
        await nicoAudio.play();
      } catch (e) {
        console.log("Audio bloqueado:", e);
      }
    };

    const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    mic.getTracks().forEach(track => nicoPC.addTrack(track, mic));

    nicoDC = nicoPC.createDataChannel("oai-events");

    nicoDC.onopen = () => {
      imagenNico("saluda");
      mostrarNico("Listo, Rodri. Dime: “Hola Nico”.");
    };

    nicoDC.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "input_audio_buffer.speech_started") {
          nicoRespuesta = "";
          if (nicoVisible) {
            imagenNico("saluda");
            mostrarNico("Te escucho...");
          }
        }

        if (msg.type === "input_audio_buffer.speech_stopped") {
          if (nicoVisible) {
            imagenNico("piensa");
            mostrarNico("Mmm... pensando.");
          }
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          const userText = msg.transcript || "";

          if (debeApagarse(userText)) {
            imagenNico("bien");
            mostrarNico("Listo, Rodri... me desconecto.");
            setTimeout(apagarNico, 900);
            return;
          }

          if (debeAparecer(userText)) {
            imagenNico("saluda");
            mostrarNico("Aquí estoy, Rodri. Te escucho.");
          }
        }

        if (msg.type === "response.audio_transcript.delta") {
          nicoRespuesta += msg.delta || "";
          if (!nicoVisible) mostrarNico("");
          imagenNico(detectarImagen(nicoRespuesta));
          nicoBubble.innerText = nicoRespuesta || "Nico está hablando...";
        }

        if (msg.type === "response.done") {
          if (nicoRespuesta.trim()) {
            imagenNico(detectarImagen(nicoRespuesta));
            nicoBubble.innerText = nicoRespuesta.trim();
          }

          setTimeout(() => {
            if (nicoActivo && nicoVisible) {
              imagenNico("saluda");
              nicoBubble.innerText = "Te escucho, Rodri...";
            }
          }, 1200);

          nicoRespuesta = "";
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
    imagenNico("piensa");
    mostrarNico("Uff... no pude conectarme, Rodri.");
    nicoActivo = false;
    nicoMicBtn.innerText = "🎙️";
  }
}

function apagarNico() {
  nicoActivo = false;
  nicoRespuesta = "";
  nicoMicBtn.innerText = "🎙️";

  if (nicoPC) {
    nicoPC.getSenders().forEach(sender => {
      if (sender.track) sender.track.stop();
    });
    nicoPC.close();
  }

  nicoPC = null;
  nicoDC = null;
  nicoAudio = null;

  ocultarNico();
}
