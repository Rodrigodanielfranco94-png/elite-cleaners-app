// ============================
// NICO ADMIN - AGENDA CORREGIDA FINAL
// ============================

const CREAR_TRABAJO_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearTrabajoConfirmado";

// ========================================
// DETECTAR SI EL USUARIO QUIERE AGENDAR
// ========================================

function esComandoAgenda(texto) {
    const t = texto.toLowerCase();

    return (
        t.includes("agenda") ||
        t.includes("agendar") ||
        t.includes("programa") ||
        t.includes("programar") ||
        t.includes("crear limpieza") ||
        t.includes("crea limpieza") ||
        t.includes("crear trabajo") ||
        t.includes("crea trabajo")
    );
}

// ========================================
// EXTRAER TIPO
// ========================================

function extraerTipo(texto) {

    const t = texto.toLowerCase();

    if (
        t.includes("profunda") ||
        t.includes("deep clean")
    ) {
        return "PROFUNDA";
    }

    if (
        t.includes("move in")
    ) {
        return "MOVE-IN";
    }

    if (
        t.includes("move out")
    ) {
        return "MOVE-OUT";
    }

    if (
        t.includes("post construction") ||
        t.includes("post-construction")
    ) {
        return "POST-CONSTRUCCION";
    }

    return "ESTÁNDAR";
}

// ========================================
// EXTRAER FECHA
// ========================================

function extraerFecha(texto) {

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
        octubre: "10",
        noviembre: "11",
        diciembre: "12"
    };

    const regex =
/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i;

    const match = texto.match(regex);

    if (!match) return "";

    const dia = match[1].padStart(2, "0");

    const mes = meses[
        match[2].toLowerCase()
    ];

    const year = new Date().getFullYear();

    return `${year}-${mes}-${dia}`;
}

// ========================================
// EXTRAER HORA
// ========================================

function extraerHora(texto) {

    const regex =
/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)/i;

    const match = texto.match(regex);

    if (!match) return "";

    let hora = parseInt(match[1]);

    const minutos = match[2] || "00";

    const meridiano =
        match[3].toLowerCase();

    if (
        meridiano.includes("p") &&
        hora < 12
    ) {
        hora += 12;
    }

    if (
        meridiano.includes("a") &&
        hora === 12
    ) {
        hora = 0;
    }

    return `${hora
        .toString()
        .padStart(2, "0")}:${minutos}`;
}

// ========================================
// EXTRAER NOMBRE CLIENTE
// ========================================

function extraerCliente(texto) {

    let limpio = texto;

    limpio = limpio.replace(
        /agenda(r)?/gi,
        ""
    );

    limpio = limpio.replace(
        /programa(r)?/gi,
        ""
    );

    limpio = limpio.replace(
        /la limpieza de/gi,
        ""
    );

    limpio = limpio.replace(
        /limpieza de/gi,
        ""
    );

    limpio = limpio.replace(
        /el/gi,
        ""
    );

    limpio = limpio.trim();

    const corteFecha =
        limpio.search(
            /\d{1,2}\s+de/i
        );

    if (corteFecha === -1) {
        return limpio.trim();
    }

    return limpio
        .substring(0, corteFecha)
        .trim();
}

// ========================================
// CREAR TRABAJO REAL EN FIREBASE
// ========================================

async function crearTrabajoDesdeNico(textoOriginal) {

    try {

        const cliente =
            extraerCliente(textoOriginal);

        const fecha =
            extraerFecha(textoOriginal);

        const hora =
            extraerHora(textoOriginal);

        const tipo =
            extraerTipo(textoOriginal);

        // =====================
        // VALIDAR DATOS
        // =====================

        if (!cliente) {

            hablarTextoNico(
                "Rodri, no entendí el nombre del cliente."
            );

            return false;
        }

        if (!fecha) {

            hablarTextoNico(
                "Rodri, no entendí la fecha."
            );

            return false;
        }

        if (!hora) {

            hablarTextoNico(
                "Rodri, no entendí la hora."
            );

            return false;
        }

        // =====================
        // CREAR OBJETO
        // =====================

        const payload = {

            cliente: cliente,

            direccion: "",

            whatsapp: "",

            empleado_nombre: "",

            empleado_email: "",

            empleado_nombre_2: "",

            empleado_email_2: "",

            fecha: fecha,

            hora: hora,

            notas:
                "Creado automáticamente por Nico",

            tipo: tipo,

            estado: "pendiente",

            hora_inicio: "--:--",

            hora_fin: "--:--",

            firma_cliente: false
        };

        console.log(
            "ENVIANDO A FIREBASE:",
            payload
        );

        // =====================
        // FIREBASE REAL
        // =====================

        const response = await fetch(
            CREAR_TRABAJO_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(payload)
            }
        );

        const data =
            await response.json();

        console.log(
            "RESPUESTA FIREBASE:",
            data
        );

        // =====================
        // CONFIRMACIÓN REAL
        // =====================

        if (data.ok === true) {

            hablarTextoNico(
                `Listo Rodri. Ya agendé a ${cliente} el ${fecha} a las ${hora}. Ya debe aparecer en la aplicación.`
            );

            return true;
        }

        // =====================
        // ERROR REAL
        // =====================

        hablarTextoNico(
            "Rodri, hubo un error guardando el trabajo en la aplicación."
        );

        return false;

    } catch (error) {

        console.error(error);

        hablarTextoNico(
            "Rodri, hubo un error conectando con Firebase."
        );

        return false;
    }
}

// ========================================
// INTERCEPTAR MENSAJES DE NICO
// ========================================

async function procesarComandoNico(textoUsuario) {

    if (
        !textoUsuario ||
        textoUsuario.length < 3
    ) return false;

    if (
        esComandoAgenda(textoUsuario)
    ) {

        await crearTrabajoDesdeNico(
            textoUsuario
        );

        return true;
    }

    return false;
}
