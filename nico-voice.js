// ================= NICO VOICE =================

let nicoReconocimiento = null;
let nicoEscuchando = false;

function iniciarVozNico(){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    agregarMensaje(
      "nico",
      "Rodri, este navegador no permite usar micrófono con reconocimiento de voz. Prueba en Chrome."
    );
    return;
  }

  nicoReconocimiento = new SpeechRecognition();

  nicoReconocimiento.lang = "es-US";
  nicoReconocimiento.continuous = false;
  nicoReconocimiento.interimResults = false;

  nicoReconocimiento.onstart = () => {
    nicoEscuchando = true;
    imagenNico("piensa");
    agregarMensaje("nico", "🎤 Te escucho, Rodri...");
  };

  nicoReconocimiento.onresult = (event) => {
    const texto =
      event.results[0][0].transcript;

    nicoChatInput.value = texto;
    enviarTextoANico();
  };

  nicoReconocimiento.onerror = (event) => {
    console.log("Error voz Nico:", event.error);
    agregarMensaje("nico", "Rodri, tuve un problema escuchando tu voz.");
  };

  nicoReconocimiento.onend = () => {
    nicoEscuchando = false;
  };

  nicoReconocimiento.start();
}

function detenerVozNico(){
  if(nicoReconocimiento){
    nicoReconocimiento.stop();
  }

  nicoEscuchando = false;
}

window.iniciarVozNico = iniciarVozNico;
window.detenerVozNico = detenerVozNico;
