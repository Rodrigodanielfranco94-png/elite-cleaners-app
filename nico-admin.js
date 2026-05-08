// ================= NICO ADMIN ULTRA UI FINAL =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";

if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoUltraStyle")?.remove();

let nicoActivo = false;

// ================= PANEL =================

const nicoPanel = document.createElement("div");
nicoPanel.id = "nicoChatPanel";

nicoPanel.innerHTML = `
    <div id="nicoHeader">

        <div>
            <div id="nicoTitle">
                NICO
                <span id="nicoOnline"></span>
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

            <div id="nicoChatMessages">
                <div class="nicoMsg nico">
                    Hola hola, ¿en qué puedo ayudarte?
                </div>
            </div>

            <div id="nicoInputRow">
                <textarea id="nicoChatInput" placeholder="Escribe tu mensaje..."></textarea>

                <button id="nicoSend">➤</button>
            </div>

        </div>

        <div id="nicoRight">
            <img
              id="nicoAvatar"
              src="nico-assets/alegre.png"
            />
        </div>

    </div>
`;

document.body.appendChild(nicoPanel);

// ================= ESTILOS =================

const style = document.createElement("style");
style.id = "nicoUltraStyle";

style.innerHTML = `

#nicoChatPanel{
    position:fixed;

    left:12px;
    right:12px;

    bottom:92px;

    z-index:999998;

    display:block;

    max-width:560px;

    margin:auto;

    background:
      radial-gradient(circle at top right,#1d4ed844,transparent 35%),
      linear-gradient(180deg,#020617,#07101f);

    border-radius:24px;

    border:1px solid rgba(59,130,246,.45);

    overflow:hidden;

    box-shadow:
      0 0 25px rgba(37,99,235,.25),
      0 10px 40px rgba(0,0,0,.75);

    backdrop-filter:blur(10px);
}

#nicoHeader{
    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:18px 18px 12px;

    border-bottom:1px solid rgba(59,130,246,.25);
}

#nicoTitle{
    color:white;

    font-size:22px;

    font-weight:900;

    letter-spacing:1px;
}

#nicoOnline{
    width:12px;
    height:12px;

    background:#22c55e;

    border-radius:50%;

    display:inline-block;

    margin-left:10px;

    box-shadow:
      0 0 10px #22c55e;
}

#nicoOnlineText{
    color:#22c55e;

    font-size:12px;

    font-weight:700;

    margin-left:6px;
}

#nicoSubtitle{
    color:#cbd5e1;

    font-size:12px;

    margin-top:4px;
}

#nicoClose{
    width:46px;
    height:46px;

    border:none;

    border-radius:50%;

    background:#ef4444;

    color:white;

    font-size:24px;

    font-weight:bold;

    box-shadow:
      0 0 20px rgba(239,68,68,.4);
}

#nicoBody{
    display:grid;

    grid-template-columns:1fr 90px;

    gap:6px;

    min-height:210px;

    padding:10px;
}

#nicoLeft{
    display:flex;
    flex-direction:column;
}

#nicoChatMessages{
    height:120px;

    overflow-y:auto;

    display:flex;
    flex-direction:column;

    gap:8px;
}

.nicoMsg{
    padding:11px 12px;

    border-radius:16px;

    font-size:14px;

    line-height:1.35;

    max-width:95%;

    white-space:pre-wrap;

    word-break:break-word;
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
      rgba(30,41,59,.92);

    color:white;
}

#nicoInputRow{
    display:flex;

    gap:8px;

    margin-top:8px;
}

#nicoChatInput{
    flex:1;

    min-height:52px;

    max-height:80px;

    resize:none;

    border-radius:16px;

    border:1px solid rgba(59,130,246,.4);

    background:
      rgba(15,23,42,.92);

    color:white;

    padding:12px;

    font-size:15px;

    outline:none;
}

#nicoChatInput::placeholder{
    color:#94a3b8;
}

#nicoSend{
    width:62px;

    border:none;

    border-radius:16px;

    background:
      linear-gradient(135deg,#22c55e,#16a34a);

    color:white;

    font-size:24px;
    font-weight:bold;

    box-shadow:
      0 0 18px rgba(34,197,94,.3);
}

#nicoRight{
    display:flex;

    align-items:flex-end;

    justify-content:center;
}

#nicoAvatar{
    position:relative;
    z-index:2;

    width:90px;

    max-height:150px;

    object-fit:contain;

    filter:
      drop-shadow(0 12px 20px rgba(0,0,0,.75));

    animation:nicoFloat 3s infinite ease-in-out;
}

@keyframes nicoFloat{
    0%{
        transform:translateY(0px);
    }

    50%{
        transform:translateY(-6px);
    }

    100%{
        transform:translateY(0px);
    }
}

@media(max-width:600px){

    #nicoChatPanel{
        bottom:84px;
    }

    #nicoBody{
        grid-template-columns:1fr 78px;

        min-height:190px;
    }

    #nicoAvatar{
        width:78px;
    }

    #nicoChatMessages{
        height:110px;
    }
}

`;

document.head.appendChild(style);

// ================= ELEMENTOS =================

const chatMessages = document.getElementById("nicoChatMessages");
const chatInput = document.getElementById("nicoChatInput");
const chatSend = document.getElementById("nicoSend");
const chatClose = document.getElementById("nicoClose");

// ================= FUNCIONES =================

function agregarMensaje(tipo, texto){

    const div = document.createElement("div");

    div.className = "nicoMsg " + tipo;

    div.innerText = texto;

    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function pensarConNico(mensaje){

    try{

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
            return "Rodri, ahora mismo no pude responder.";
        }

        return (
            data.respuesta ||
            "Aquí estoy, Rodri."
        );

    }catch(e){

        console.log(e);

        return "Rodri, hubo un problema conectando conmigo.";
    }
}

// ================= ENVIAR =================

async function enviarMensaje(){

    const mensaje = chatInput.value.trim();

    if(!mensaje) return;

    agregarMensaje("user",mensaje);

    chatInput.value = "";

    agregarMensaje("nico","Pensando...");

    const pensando =
      chatMessages.lastElementChild;

    const respuesta =
      await pensarConNico(mensaje);

    pensando.innerText = respuesta;

    chatMessages.scrollTop =
      chatMessages.scrollHeight;
}

chatSend.onclick = enviarMensaje;

chatInput.addEventListener("keydown",(e)=>{

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){
        e.preventDefault();

        enviarMensaje();
    }
});

chatClose.onclick = ()=>{

    nicoPanel.style.display = "none";
};

// ================= STOP =================

window.NICO_STOP = ()=>{

    nicoPanel.remove();

    style.remove();
};
