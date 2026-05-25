window.iniciarVozNico = function(){

  try{

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if(!SpeechRecognition){

      agregarMensaje(
        "nico",
        "Rodri, este navegador no soporta reconocimiento de voz."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "es-ES";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    agregarMensaje(
      "nico",
      "🎤 Te escucho, Rodri..."
    );

    recognition.start();

    recognition.onresult = async (event) => {

      try{

        const texto =
          event.results[0][0].transcript;

        nicoChatInput.value = texto;

        await enviarTextoANico();

      }catch(e){

        console.log(e);

        agregarMensaje(
          "nico",
          "Rodri, no pude entender la voz."
        );
      }
    };

    recognition.onerror = (event) => {

      console.log("VOICE ERROR:", event);

      agregarMensaje(
        "nico",
        "Rodri, tuve un problema escuchando tu voz."
      );
    };

    recognition.onend = () => {

      console.log("Reconocimiento finalizado");

    };

  }catch(e){

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, ocurrió un error iniciando el micrófono."
    );
  }
};
