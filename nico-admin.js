// ===============================
// 🧠 MEMORIA PERMANENTE
// ===============================
let memoria = JSON.parse(localStorage.getItem("nico_memoria") || "{}");

function guardarMemoria(key, value){
    memoria[key] = value;
    localStorage.setItem("nico_memoria", JSON.stringify(memoria));
}

// ===============================
// 🎤 VOZ CONFIG (MASCULINA)
// ===============================
const voz = new SpeechSynthesisUtterance();
voz.lang = "es-US";
voz.rate = 0.9;
voz.pitch = 0.9;

// ===============================
// 🧍 CREAR NICO UI
// ===============================
const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";

nicoBox.innerHTML = `
    <img id="nicoAvatar" src="nico-avatar.png" />
    <div id="nicoBubble">Toca el micrófono y dime: Hola Nico</div>
    <button id="nicoBtn">🎤</button>
`;

document.body.appendChild(nicoBox);

// ===============================
// 🎨 ESTILO (FIJO A LA DERECHA)
// ===============================
const style = document.createElement("style");
style.innerHTML = `
#nicoBox{
  position:fixed !important;
  right:16px !important;
  bottom:20px !important;
  left:auto !important;
  z-index:99999;
  display:flex;
  flex-direction:column;
  align-items:flex-end;
}

#nicoAvatar{
  width:90px;
  margin-bottom:5px;
  pointer-events:none;
}

#nicoBubble{
  background:white;
  color:black;
  padding:10px 14px;
  border-radius:18px;
  font-size:13px;
  max-width:220px;
  margin-bottom:8px;
}

#nicoBtn{
  width:55px;
  height:55px;
  border-radius:50%;
  border:none;
  background:#3b82f6;
  color:white;
  font-size:20px;
}
`;
document.head.appendChild(style);

// ===============================
// 🎧 RECONOCIMIENTO DE VOZ
// ===============================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "es-US";
recognition.continuous = false;
recognition.interimResults = false;

let escuchando = false;

document.getElementById("nicoBtn").onclick = () => {
    if(!escuchando){
        recognition.start();
        escuchando = true;
        document.getElementById("nicoBubble").innerText = "👂 Escuchando...";
    }
};

// ===============================
// 🧠 PERSONALIDAD DE NICO
// ===============================
const contexto = `
Eres Nico, hermano de Rodrigo.

Familia:
- Rodrigo es tu hermano
- Jorge también
- Dayana es esposa de Rodrigo
- Carol esposa de Jorge
- Bastian hijo de Jorge
- Julia mamá de Rodrigo y Jorge
- Rodolfo es su papá
- Charlie es su perro

Viven:
- Rodrigo en California
- Jorge en Boston
- Julia en NY
- Papá en Paraguay

Personalidad:
- cariñoso
- divertido
- humano
- cercano
- inteligente
- musical

Habla como amigo cercano, natural, con pausas.
`;

// ===============================
// 🤖 RESPUESTA INTELIGENTE
// ===============================
async function pensar(mensaje){

    document.getElementById("nicoBubble").innerText = "💭 Pensando...";

    const res = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer TU_API_KEY_AQUI"
        },
        body: JSON.stringify({
            model:"gpt-4o-mini",
            messages:[
                {role:"system", content: contexto},
                {role:"user", content: mensaje}
            ]
        })
    });

    const data = await res.json();
    const texto = data.choices[0].message.content;

    hablar(texto);
}

// ===============================
// 🔊 HABLAR NATURAL
// ===============================
function hablar(texto){
    document.getElementById("nicoBubble").innerText = texto;

    voz.text = texto;
    speechSynthesis.speak(voz);
}

// ===============================
// 🧠 GUARDAR MEMORIA
// ===============================
function analizarMemoria(texto){
    if(texto.includes("me llamo")){
        let nombre = texto.split("me llamo")[1];
        guardarMemoria("nombre", nombre);
    }
}

// ===============================
// 🎤 RESULTADO DE VOZ
// ===============================
recognition.onresult = (event)=>{
    escuchando = false;

    const texto = event.results[0][0].transcript;

    analizarMemoria(texto);
    pensar(texto);
};

// ===============================
// ❌ ERROR
// ===============================
recognition.onerror = ()=>{
    escuchando = false;
    document.getElementById("nicoBubble").innerText = "No te escuché bien...";
};

// ===============================
// 👋 ANIMACIÓN INICIAL
// ===============================
window.onload = ()=>{
    document.getElementById("nicoAvatar").src = "nico-assets/saluda.png";

    setTimeout(()=>{
        hablar("¿Qué onda Rodrigo? Aquí estoy contigo 👋");
    },1000);
};
