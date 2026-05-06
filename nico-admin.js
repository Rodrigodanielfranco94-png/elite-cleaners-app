// ================= NICO ADMIN WEBRTC FINAL + TORNADO + AGENDA DIRECTA FIRESTORE =================

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
let nicoReadyResolve = null;
let nicoReadyPromise = null;
let currentAssistantMsg = null;
let saludoInicialHecho = false;
let ultimoTrabajoCreado = "";

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
  margin-bottom:4px;
  filter:
    drop-shadow(0 0 12px rgba(59,130,246,.7))
    drop-shadow(0 12px 22px rgba(0,0,0,.65));
  animation:
    nicoTornado .9s cubic-bezier(.19,1,.22,1),
    nicoFloat 3s ease-in-out infinite;
}

@keyframes nicoTornado{
  0%{
    opacity:0;
    transform:scale(.15) rotate(-720deg) translateY(120px);
    filter:blur(18px);
  }
  40%{
    opacity:1;
    transform:scale(1.15) rotate(25deg) translateY(-8px);
    filter:blur(2px);
  }
  70%{
    transform:scale(.96) rotate(-8deg) translateY(4px);
  }
  100%{
    opacity:1;
    transform:scale(1) rotate(0deg) translateY(0);
    filter:blur(0);
  }
}

@keyframes nicoFloat{
  0%{ transform:translateY(0px); }
  50%{ transform:translateY(-4px); }
  100%{ transform:translateY(0px); }
}

#nicoBtn{
  width:68px;
  height:68px;
  border-radius:50%;
  border:none;
  background:linear-gradient(135deg,#3b82f6,#2563eb);
  color:white;
  font-size:30px;
  font-weight:bold;
  box-shadow:
    0 10px 28px rgba(0,0,0,.45),
    0 0 18px rgba(59,130,246,.5);
  transition:.25s;
}

#nicoBtn:active{
  transform:scale(.92);
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
  animation:nicoChatOpen .25s ease-out;
}

@keyframes nicoChatOpen{
  from{ opacity:0; transform:translateY(15px) scale(.96); }
  to{ opacity:1; transform:translateY(0) scale(1); }
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
  nicoImg.style.animation = "none";
  void nicoImg.offsetWidth;
  nicoImg.style.animation = "nicoTornado .9s cubic-bezier(.19,1,.22,1), nicoFloat 3s ease-in-out infinite";
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

function normalizarTexto(texto) {
  return (texto || "")
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
    t.includes("bay nico") ||
    t.includes("chao nico") ||
    t.includes("desconectate nico") ||
    t.includes("nico desconectate")
  );
}

function debeAbrirChat(texto) {
  const t = normalizarTexto(texto);
  return (
    t.includes("te quiero escribir") ||
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

// ================= AGENDA DIRECTA FIRESTORE =================

function esComandoAgenda(texto) {
  const t = normalizarTexto(texto);
  return (
    t.includes("agenda") ||
    t.includes("agendar") ||
    t.includes("programa") ||
    t.includes("programar") ||
    t.includes("crear limpieza") ||
    t.includes("crea limpieza") ||
    t.includes("crear trabajo") ||
    t.includes("crea trabajo") ||
    t.includes("pon una limpieza") ||
    t.includes("ponme una limpieza")
  );
}

function extraerTipo(texto) {
  const t = normalizarTexto(texto);

  if (t.includes("profunda") || t.includes("deep clean") || t.includes("deep")) return "PROFUNDA";
  if (t.includes("move in") || t.includes("move-in")) return "MOVE-IN";
  if (t.includes("move out") || t.includes("move-out")) return "MOVE-OUT";
  if (t.includes("post construction") || t.includes("post-construction") || t.includes("post construccion")) return "POST-CONSTRUCCION";
  if (t.includes("primera") || t.includes("first clean")) return "PRIMERA";

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

  let match = t.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(\d{4}))?/i);

  if (match) {
    const dia = match[1].padStart(2, "0");
    const mes = meses[match[2].toLowerCase()];
    if (match[3]) year = match[3];
    return `${year}-${mes}-${dia}`;
  }

  match = t.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);

  if (match) {
    const mes = match[1].padStart(2, "0");
    const dia = match[2].padStart(2, "0");
    if (match[3]) year = match[3].length === 2 ? `20${match[3]}` : match[3];
    return `${year}-${mes}-${dia}`;
  }

  if (t.includes("manana")) {
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

  let match = t.match(/(?:a\s+las\s+|alas\s+)?(\d{1,2})(?::(\d{2}))?\s*(a\s*m|p\s*m|am|pm)?/i);
  if (!match) return "";

  let hora = parseInt(match[1], 10);
  const minutos = match[2] || "00";
  const meridiano = (match[3] || "").replace(/\s/g, "");

  if (meridiano === "pm" && hora < 12) hora += 12;
  if (meridiano === "am" && hora === 12) hora = 0;

  return `${hora.toString().padStart(2, "0")}:${minutos}`;
}

function extraerCliente(texto) {
  let limpio = texto;

  limpio = limpio.replace(/agenda(r)?/gi, "");
  limpio = limpio.replace(/programa(r)?/gi, "");
  limpio = limpio.replace(/crea(r)?/gi, "");
  limpio = limpio.replace(/ponme/gi, "");
  limpio = limpio.replace(/pon/gi, "");
  limpio = limpio.replace(/la limpieza de/gi, "");
  limpio = limpio.replace(/limpieza de/gi, "");
  limpio = limpio.replace(/una limpieza de/gi, "");
  limpio = limpio.replace(/un trabajo para/gi, "");
  limpio = limpio.replace(/trabajo para/gi, "");
  limpio = limpio.replace(/^a\s+/i, "");
  limpio = limpio.trim();

  const corte = limpio.search(/(\d{1,2}\s+de\s+|hoy|mañana|manana|\d{1,2}\/\d{1,2}|a las|alas|limpieza|estandar|estándar|profunda|move|post|primera)/i);

  if (corte > 0) limpio = limpio.substring(0, corte);

  limpio = limpio
    .replace(/\bel\b/gi, "")
    .replace(/\bpara\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return limpio;
}

function construirTrabajoDesdeTexto(textoOriginal) {
  const cliente = extraerCliente(textoOriginal);
  const fecha = extraerFecha(textoOriginal);
  const hora = extraerHora(textoOriginal);
  const tipo = extraerTipo(textoOriginal);

  if (!cliente || !fecha || !hora) {
    return {
      ok: false,
      cliente,
      fecha,
      hora,
      tipo
    };
  }

  return {
    ok: true,
    trabajo: {
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
    }
  };
}

async function decirPorWebRTC(texto) {
  if (!nicoDC || nicoDC.readyState !== "open") return;

  nicoDC.send(JSON.stringify({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: texto
        }
      ]
    }
  }));

  nicoDC.send(JSON.stringify({ type: "response.create" }));
}

async function crearTrabajoDirectoFirestore(textoOriginal) {
  try {
    if (!esComandoAgenda(textoOriginal)) return false;

    const resultado = construirTrabajoDesdeTexto(textoOriginal);

    if (!resultado.ok) {
      let faltan = [];
      if (!resultado.cliente) faltan.push("el nombre del cliente");
      if (!resultado.fecha) faltan.push("la fecha");
      if (!resultado.hora) faltan.push("la hora");

      await decirPorWebRTC(`Dile a Rodri en una frase corta: No pude agendar todavía porque me falta ${faltan.join(", ")}.`);
      return true;
    }

    const trabajo = resultado.trabajo;
    const firma = JSON.stringify({
      cliente: trabajo.cliente,
      fecha: trabajo.fecha,
      hora: trabajo.hora,
      tipo: trabajo.tipo
    });

    if (firma === ultimoTrabajoCreado) return true;
    ultimoTrabajoCreado = firma;

    imagenNico("celular");

    const docRef = await db.collection("servicios").add(trabajo);

    await db.collection("clientes").doc(trabajo.cliente).set({
      nombre: trabajo.cliente,
      direccion: "",
      whatsapp: "",
      telefono: "",
      actualizado: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await guardarMemoria(
      textoOriginal,
      `Agendé el trabajo para ${trabajo.cliente} el ${trabajo.fecha} a las ${trabajo.hora}, tipo ${trabajo.tipo}. ID: ${docRef.id}`
    );

    await decirPorWebRTC(
      `Confirma en una frase corta y honesta: Listo Rodri, ya agendé a ${trabajo.cliente} el ${trabajo.fecha} a las ${trabajo.hora} con limpieza ${trabajo.tipo}. Ya debe aparecer en la app.`
    );

    return true;

  } catch (e) {
    console.log("No pude crear trabajo directo:", e);

    await decirPorWebRTC(
      "Dile a Rodri en una frase corta: Rodri, hubo un error guardando directo en Firestore y no pude agendarlo."
    );

    return true;
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
      console.log("NICO DATA CHANNEL ABIERTO");
alert("Nico conectado");
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
                text: "Nico, saluda exactamente diciendo: Hola hola, ¿en qué puedo ayudarte? Después quédate completamente callado esperando que Rodrigo hable."
              }
            ]
          }
        }));

        nicoDC.send(JSON.stringify({
          type: "response.create",
          response: {
            instructions: "Di exactamente: Hola hola, ¿en qué puedo ayudarte? Después guarda silencio total esperando que Rodrigo hable."
          }
        }));
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
          console.log("Nico escuchó:", msg.transcript);
alert("Escuché: " + msg.transcript);
          const texto = msg.transcript || "";
          if (nicoEstaHablando) return;

          ultimoTextoUsuario = texto;

          if (debeApagarse(texto)) {
            imagenNico("bien");
            setTimeout(apagarNico, 500);
            return;
          }

          if (debeAbrirChat(texto)) {
            await decirPorWebRTC("Responde solamente: Ok.");
            setTimeout(() => abrirChatNico(), 900);
            ultimoTextoUsuario = "";
            return;
          }

          const ejecutado = await crearTrabajoDirectoFirestore(texto);

          if (ejecutado) {
            ultimoTextoUsuario = "";
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

  const ejecutado = await crearTrabajoDirectoFirestore(mensaje);

  if (ejecutado) {
    agregarMensaje("nico", "Listo, Rodri. Ya lo guardé directo en Firestore y debe aparecer en la app.");
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

  nicoDC.send(JSON.stringify({ type: "response.create" }));
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
