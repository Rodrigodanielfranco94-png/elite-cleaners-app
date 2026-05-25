// ================= NICO VOICE =================

window.iniciarVozNico = function(){

  try{

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if(!SpeechRecognition){
      agregarMensaje("nico", "Rodri, este navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "es-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    agregarMensaje("nico", "🎤 Te escucho, Rodri... Di: Oye Nico...");

    recognition.start();

    recognition.onresult = async (event) => {

  try{

    let textoFinal = "";
    let textoTemporal = "";

    for(let i = event.resultIndex; i < event.results.length; i++){

      const texto =
        event.results[i][0].transcript || "";

      if(event.results[i].isFinal){

        textoFinal += texto;

      }else{

        textoTemporal += texto;
      }
    }

    // ================= MOSTRAR DICTADO EN VIVO =================

    nicoChatInput.value =
      (textoFinal || textoTemporal).trim();

    // ================= CUANDO TERMINA DE HABLAR =================

    if(textoFinal.trim()){

      let texto = textoFinal.trim();

      let limpio =
        normalizarTexto(texto);

      if(
        limpio.startsWith("oye nico") ||
        limpio.startsWith("hey nico") ||
        limpio.startsWith("nico")
      ){

        texto = texto
          .replace(/oye nico/ig, "")
          .replace(/hey nico/ig, "")
          .replace(/^nico/ig, "")
          .trim();
      }

      if(!texto){

        agregarMensaje(
          "nico",
          "Rodri, te escuché, pero no recibí el comando."
        );

        return;
      }

      nicoChatInput.value = texto;

      await enviarTextoANico();
    }

  }catch(e){

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, no pude entender la voz."
    );
  }
};
        console.log(e);
        agregarMensaje("nico", "Rodri, no pude entender la voz.");
      }
    };

    recognition.onerror = (event) => {
      console.log("VOICE ERROR:", event);
      agregarMensaje("nico", "Rodri, tuve un problema escuchando tu voz.");
    };

    recognition.onend = () => {
      console.log("Reconocimiento finalizado");
    };

  }catch(e){
    console.log(e);
    agregarMensaje("nico", "Rodri, ocurrió un error iniciando el micrófono.");
  }
};
