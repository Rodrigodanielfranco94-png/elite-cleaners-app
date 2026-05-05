// ===== NICO FLOATING ASSISTANT =====

let nicoActivo = false;
let recognition;

// Crear botón
const btn = document.createElement("button");
btn.innerText = "🎙️";
btn.style.position = "fixed";
btn.style.bottom = "20px";
btn.style.right = "20px";
btn.style.background = "#3b82f6";
btn.style.color = "#fff";
btn.style.border = "none";
btn.style.padding = "15px";
btn.style.borderRadius = "50%";
btn.style.fontSize = "18px";
btn.style.zIndex = "9999";
btn.style.cursor = "pointer";

// Crear panel
const panel = document.createElement("div");
panel.style.position = "fixed";
panel.style.bottom = "80px";
panel.style.right = "20px";
panel.style.width = "220px";
panel.style.background = "#1c1c1e";
panel.style.border = "1px solid #3b82f6";
panel.style.borderRadius = "20px";
panel.style.padding = "10px";
panel.style.display = "none";
panel.style.zIndex = "9999";

const img = document.createElement("img");
img.src = "nico-assets/alegre.png";
img.style.width = "100%";
img.style.borderRadius = "15px";

const text = document.createElement("div");
text.innerText = "Listo bro… te escucho 👀";
text.style.fontSize = "12px";
text.style.marginTop = "6px";
text.style.textAlign = "center";

panel.appendChild(img);
panel.appendChild(text);

document.body.appendChild(btn);
document.body.appendChild(panel);

// Click botón
btn.onclick = () => {
    if (!nicoActivo) {
        panel.style.display = "block";
        text.innerText = "👂 Escuchando...";
        iniciarMicrofono();
        nicoActivo = true;
    } else {
        panel.style.display = "none";
        detenerMicrofono();
        nicoActivo = false;
    }
};

// ===== MIC =====

function iniciarMicrofono() {
    try {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "es-US";
        recognition.continuous = true;

        recognition.onresult = function (event) {
            const texto = event.results[event.results.length - 1][0].transcript.toLowerCase();

            console.log("Escuché:", texto);

            if (texto.includes("bye nico") || texto.includes("desconéctate")) {
                btn.click();
                return;
            }

            responder(texto);
        };

        recognition.start();

    } catch (e) {
        console.log("Mic error", e);
    }
}

function detenerMicrofono() {
    if (recognition) recognition.stop();
}

// ===== RESPUESTAS =====

function responder(texto) {

    let respuesta = "mmm no entendí bro";

    if (texto.includes("hola")) {
        respuesta = "Qué más Rodrigo, todo bien?";
    }

    if (texto.includes("trabajos")) {
        respuesta = "Tienes servicios pendientes en la lista bro";
    }

    if (texto.includes("cuántos")) {
        respuesta = "Arriba puedes ver los pendientes y completados";
    }

    if (texto.includes("gracias")) {
        respuesta = "Siempre bro, aquí estoy pa ayudarte";
    }

    hablar(respuesta);
}

// ===== VOZ =====

function hablar(texto) {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-US";
    voz.rate = 0.9;
    voz.pitch = 0.8;
    speechSynthesis.speak(voz);
}
