// ================= NICO VOICE =================

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

    recognition.lang = "es-US";

    recognition.continuous = false;

    // ================= DICTADO EN VIVO =================

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    agregarMensaje(
      "nico",
      "🎤 Te escucho, Rodri... Di: Oye Nico..."
    );

    recognition.start();

    // ================= RESULTADOS DE VOZ =================

    recognition.onresult = async (event) => {

      try {

        let textoFinal = "";

        let textoTemporal = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {

          const texto =
            event.results[i][0].transcript || "";

          // ================= TEXTO FINAL =================

          if (event.results[i].isFinal) {

            textoFinal += texto;

          } else {

            // ================= TEXTO TEMPORAL (EN VIVO) =================

            textoTemporal += texto;
          }
        }

        // ================= MOSTRAR DICTADO EN TIEMPO REAL =================

        nicoChatInput.value =
          (textoFinal || textoTemporal).trim();

        // ================= CUANDO TERMINA DE HABLAR =================

        if (textoFinal.trim()) {

          let texto =
            textoFinal.trim();

          let limpio =
            normalizarTexto(texto);

          // ================= REMOVER "OYE NICO" =================

          if (
            limpio.startsWith("oye nico") ||
            limpio.startsWith("hey nico") ||
            limpio.startsWith("nico")
          ) {

            texto = texto
              .replace(/oye nico/ig, "")
              .replace(/hey nico/ig, "")
              .replace(/^nico/ig, "")
              .trim();
          }

          // ================= VALIDAR =================

          if (!texto) {

            agregarMensaje(
              "nico",
              "Rodri, te escuché, pero no recibí el comando."
            );

            return;
          }

          // ================= PONER TEXTO FINAL =================

          nicoChatInput.value = texto;

          // ================= ENVIAR A NICO =================

          await enviarTextoANico();
        }

      } catch (e) {

        console.log(e);

        agregarMensaje(
          "nico",
          "Rodri, no pude entender la voz."
        );
      }
    };

    // ================= ERROR =================

    recognition.onerror = (event) => {

      console.log(
        "VOICE ERROR:",
        event
      );

      agregarMensaje(
        "nico",
        "Rodri, tuve un problema escuchando tu voz."
      );
    };

    // ================= FIN =================

    recognition.onend = () => {

      console.log(
        "Reconocimiento finalizado"
      );
    };

  } catch (e) {

    console.log(e);

    agregarMensaje(
      "nico",
      "Rodri, ocurrió un error iniciando el micrófono."
    );
  }
};
