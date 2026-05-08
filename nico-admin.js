// ================= NICO ADMIN FINAL PREMIUM =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";
const CREAR_TRABAJO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/crearTrabajoConfirmado";
const CONSULTAR_HOY_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarTrabajosHoy";
const CONSULTAR_PENDIENTES_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarPendientes";
const GUARDAR_MEMORIA_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/guardarMemoria";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoActivo = false;
let nicoPensando = false;

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";

nicoBox.innerHTML = `
  <button id="nicoBtn">
      <img id="nicoBtnImg" src="nico-assets/saluda.png" />
  </button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";

nicoChatPanel.innerHTML = `
  <div id="nicoHeader">

      <div>
          <div id="nicoTitleRow">
              <span id="nicoTitle">NICO</span>

              <span id="nicoOnlineDot"></span>

              <span id="nicoOnlineText">ONLINE</span>
          </div>

          <div id="nicoSubtitle">
              Asistente IA de Elite Cleaners
          </div>
      </div>

      <button id="nicoClose">×</button>

  </div>

  <div id="nicoBody">

      <div id="nicoLeft">

          <div id="nicoChatMessages"></div>

          <div id="nicoInputRow">

              <textarea
                id="nicoChatInput"
                placeholder="Escribe tu mensaje..."
              ></textarea>

              <button id="nicoSend">
                ➤
              </button>

          </div>

      </div>

      <div id="nicoRight">

          <div id="nicoGlow"></div>

          <img
            id="nicoAvatar"
            src="nico-assets/saluda.png"
          />

      </div>

  </div>
`;

document.body.appendChild(nicoBox);
document.body.appendChild(nicoChatPanel);

// ================= ESTILOS =================

const style = document.createElement("style");
style.id = "nicoFinalStyle";

style.innerHTML = `

#nicoBox{
    position:fixed;
    right:16px;
    bottom:18px;
    z-index:999999;
}

#nicoBtn{
    width:76px;
    height:76px;
    border:none;
    border-radius:50%;
    overflow:hidden;
    background:
      radial-gradient(circle at top,#3b82f6,#020617 70%);
    box-shadow:
      0 0 25px rgba(59,130,246,.55),
      0 10px 30px rgba(0,0,0,.7);
    padding:0;
}

#nicoBtnImg{
    width:100%;
    height:100%;
    object-fit:cover;
}

#nicoChatPanel{
    position:fixed;
    left:10px;
    right:10px;
    bottom:96px;

    z-index:999998;

    display:none;

    max-width:720px;
    margin:auto;

    background:
      radial-gradient(circle at top right,#1d4ed844,transparent 35%),
      linear-gradient(180deg,#020617,#07101f);

    border-radius:26px;

    border:1px solid rgba(59,130,246,.5);

    overflow:hidden;

    box-shadow:
      0 0 35px rgba(37,99,235,.35),
      0 15px 55px rgba(0,0,0,.75);
}

#nicoHeader{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;

    padding:18px 18px 12px;

    border-bottom:1px solid rgba(59,130,246,.2);
}

#nicoTitleRow{
    display:flex;
    align-items:center;
    gap:8px;
}

#nicoTitle{
    font-size:28px;
    font-weight:1000;
    color:white;
}

#nicoOnlineDot{
    width:10px;
    height:10px;
    border-radius:50%;
    background:#22c55e;

    box-shadow:0 0 10px rgba(34,197,94,.9);
}

#nicoOnlineText{
    color:#22c55e;
    font-size:14px;
    font-weight:900;
}

#nicoSubtitle{
    color:#cbd5e1;
    font-size:14px;
    margin-top:4px;
}

#nicoClose{
    width:52px;
    height:52px;

    border:none;
    border-radius:50%;

    background:#ef4444;

    color:white;

    font-size:28px;
    font-weight:bold;

    box-shadow:
      0 0 18px rgba(239,68,68,.45);
}

#nicoBody{
    display:grid;
    grid-template-columns:1fr 95px;

    gap:8px;

    min-height:260px;

    padding:12px;
}

#nicoLeft{
    display:flex;
    flex-direction:column;
}

#nicoChatMessages{
    height:165px;

    overflow-y:auto;

    display:flex;
    flex-direction:column;

    gap:10px;

    padding-right:2px;
}

.nicoMsg{
    padding:13px 14px;

    border-radius:18px;

    font-size:15px;
    line-height:1.42;

    white-space:pre-wrap;
    word-break:break-word;

    max-width:96%;
}

.nicoMsg.user{
    align-self:flex-end;

    background:
      linear-gradient(135deg,#3b82f6,#2563eb);

    color:white;
}

.nicoMsg.nico{
    align-self:flex-start;

    background:
      rgba(255,255,255,.08);

    color:white;
}

#nicoInputRow{
    display:flex;
    gap:10px;

    margin-top:12px;
}

#nicoChatInput{
    flex:1;

    min-height:62px;
    max-height:100px;

    resize:none;

    border-radius:18px;

    border:1px solid rgba(59,130,246,.4);

    background:
      rgba(15,23,42,.92);

    color:white;

    padding:14px;

    font-size:16px;

    outline:none;
}

#nicoChatInput:focus{
    border-color:#3b82f6;
    box-shadow:0 0 0 2px rgba(59,130,246,.15);
}

#nicoSend{
    width:70px;

    border:none;
    border-radius:18px;

    background:
      linear-gradient(135deg,#22c55e,#16a34a);

    color:white;

    font-size:28px;
    font-weight:bold;

    box-shadow:
      0 0 20px rgba(34,197,94,.35);
}

#nicoRight{
    position:relative;

    display:flex;
    align-items:flex-end;
    justify-content:center;
}

#nicoGlow{
    position:absolute;

    width:95px;
    height:95px;

    border-radius:50%;

    background:
      radial-gradient(circle,
      rgba(37,99,235,.5),
      rgba(37,99,235,.1),
      transparent 70%);

    bottom:34px;

    animation:nicoPulse 2.6s infinite ease-in-out;
}

#nicoAvatar{
    position:relative;
    z-index:2;

    width:105px;
    max-height:210px;

    object-fit:contain;

    filter:
      drop-shadow(0 15px 25px rgba(0,0,0,.75));

    animation:nicoFloat 3s infinite ease-in-out;
}

@keyframes nicoPulse{
    0%,100%{
        transform:scale(.95);
        opacity:.8;
    }

    50%{
        transform:scale(1.08);
        opacity:1;
    }
}

@keyframes nicoFloat{
    0%,100%{
        transform:translateY(0);
    }

    50%{
        transform:translateY(-6px);
    }
}

@media(max-width:700px){

    #nicoChatPanel{
        bottom:92px;
    }

    #nicoTitle{
        font-size:24px;
    }

    .nicoMsg{
        font-size:14px;
    }
}

`;

document.head.appendChild(style);

// ================= ELEMENTOS =================

const nicoBtn = document.getElementById("nicoBtn");
const nicoBtnImg = document.getElementById("nicoBtnImg");

const chatPanel = document.getElementById("nicoChatPanel");

const nicoAvatar = document.getElementById("nicoAvatar");

const nicoClose = document.getElementById("nicoClose");

const chatMessages = document.getElementById("nicoChatMessages");

const chatInput = document.getElementById("nicoChatInput");

const nicoSend = document.getElementById("nicoSend");

// ================= IMAGENES =================

function imagenNico(tipo){

    const imgs = {

        saluda:"nico-assets/saluda.png",
        piensa:"nico-assets/piensa.png",
        alegre:"nico-assets/alegre.png",
        rie:"nico-assets/rie.png",
        celular:"nico-assets/celular.png",
        canta:"nico-assets/canta.png",
        bien:"nico-assets/bien.png",
        reposo:"nico-assets/reposo.png"
    };

    const src = imgs[tipo] || imgs.saluda;

    nicoAvatar.src = src;
    nicoBtnImg.src = src;
}

// ================= CHAT =================

function agregarMensaje(tipo,texto){

    const div = document.createElement("div");

    div.className = `nicoMsg ${tipo}`;

    div.innerText = texto;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

    return div;
}

// ================= ABRIR =================

function abrirNico(){

    nicoActivo = true;

    imagenNico("saluda");

    nicoBox.style.display = "none";

    chatPanel.style.display = "block";

    if(!chatMessages.dataset.saludo){

        agregarMensaje(
          "nico",
          "Hola hola, ¿en qué puedo ayudarte?"
        );

        chatMessages.dataset.saludo = "true";
    }

    setTimeout(()=>{
        chatInput.focus();
    },150);
}

// ================= CERRAR =================

function cerrarNico(){

    nicoActivo = false;

    imagenNico("reposo");

    chatPanel.style.display = "none";

    nicoBox.style.display = "block";
}

// ================= BOTONES =================

nicoBtn.onclick = abrirNico;

nicoClose.onclick = cerrarNico;

nicoSend.onclick = enviarTextoANico;

chatInput.addEventListener("keydown",(e)=>{

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        enviarTextoANico();
    }
});

// ================= MENSAJES =================

async function guardarMemoria(user,nico){

    try{

        await fetch(GUARDAR_MEMORIA_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                user,
                nico
            })
        });

    }catch(e){

        console.log("Error memoria:",e);
    }
}

// ================= IA =================

async function pensarConNico(mensaje){

    try{

        imagenNico("piensa");

        const res = await fetch(PENSAR_NICO_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                mensaje
            })
        });

        const data = await res.json();

        if(!res.ok){

            console.log(data);

            return "Rodri, no pude responder ahora mismo.";
        }

        return (
          data.respuesta ||
          "Aquí estoy contigo, Rodri."
        ).trim();

    }catch(e){

        console.log(e);

        return "Rodri, hubo un problema conectando con Nico.";
    }
}

// ================= ENVIAR =================

async function enviarTextoANico(){

    const mensaje = chatInput.value.trim();

    if(!mensaje || nicoPensando) return;

    nicoPensando = true;

    chatInput.value = "";

    agregarMensaje("user",mensaje);

    imagenNico("piensa");

    const pensando = agregarMensaje(
      "nico",
      "Nico está pensando..."
    );

    try{

        const respuesta =
          await pensarConNico(mensaje);

        pensando.innerText = respuesta;

        imagenNico("alegre");

        await guardarMemoria(
          mensaje,
          respuesta
        );

    }catch(e){

        console.log(e);

        pensando.innerText =
          "Rodri, tuve un problema respondiendo.";
    }

    finally{

        nicoPensando = false;

        chatMessages.scrollTop =
          chatMessages.scrollHeight;
    }
}

// ================= STOP =================

function apagarNico(){

    nicoActivo = false;

    nicoPensando = false;

    imagenNico("reposo");

    chatPanel.style.display = "none";

    nicoBox.style.display = "block";
}

window.NICO_STOP = apagarNico;
