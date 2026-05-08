// ================= NICO ADMIN FINAL LEFT PANEL =================

const PENSAR_NICO_URL = "https://us-central1-elite-cleaners-app.cloudfunctions.net/pensarNico";
// ================= ESTIMATES =================

const CREAR_ESTIMATE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearEstimateNico";

const CONSULTAR_ESTIMATES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarEstimates";

// ================= INVOICES =================

const CREAR_INVOICE_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearInvoiceNico";

const CONSULTAR_INVOICES_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/consultarInvoices";

// ================= RECEIPTS =================

const CREAR_RECEIPT_URL =
"https://us-central1-elite-cleaners-app.cloudfunctions.net/crearReceiptNico";
if (window.NICO_STOP) {
  try { window.NICO_STOP(); } catch (e) {}
}

document.getElementById("nicoBox")?.remove();
document.getElementById("nicoChatPanel")?.remove();
document.getElementById("nicoFinalStyle")?.remove();

let nicoActivo = false;
let nicoPensando = false;
let nicoModoEstimate = false;

// ================= UI =================

const nicoBox = document.createElement("div");
nicoBox.id = "nicoBox";

nicoBox.innerHTML = `
  <button id="nicoBtn" aria-label="Abrir Nico">
    <img id="nicoFloatingAvatar" src="nico-assets/saluda.png" />
  </button>
`;

const nicoChatPanel = document.createElement("div");
nicoChatPanel.id = "nicoChatPanel";

nicoChatPanel.innerHTML = `
  <div id="nicoHeader">

    <div id="nicoHeaderLeft">
      <div id="nicoTitleRow">
        <span id="nicoTitle">Nico</span>

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

    <div id="nicoChatMessages"></div>

    <div id="nicoInputRow">

      <textarea
        id="nicoChatInput"
        placeholder="Escríbele a Nico..."
      ></textarea>

      <button id="nicoSend">
        Enviar
      </button>

    </div>

  </div>
`;

document.body.appendChild(nicoBox);
document.body.appendChild(nicoChatPanel);

// ================= STYLE =================

const style = document.createElement("style");
style.id = "nicoFinalStyle";

style.innerHTML = `

#nicoBox{
  position:fixed !important;
  right:18px !important;
  bottom:18px !important;
  z-index:999999 !important;
}

#nicoBtn{
  width:110px;
  height:155px;
  border:none;
  background:transparent;
  padding:0;
  cursor:pointer;
}

#nicoFloatingAvatar{
  width:100%;
  height:100%;
  object-fit:contain;
  filter:drop-shadow(0 10px 20px rgba(0,0,0,.7));
  animation:nicoFloat 3s infinite ease-in-out;
}

@keyframes nicoFloat{
  0%,100%{
    transform:translateY(0px);
  }

  50%{
    transform:translateY(-6px);
  }
}

#nicoChatPanel{
  display:none;

  position:fixed !important;

  left:10px !important;
  right:auto !important;

  bottom:20px !important;

  width:320px !important;
  max-width:92vw !important;

  z-index:999998 !important;

  background:linear-gradient(
    180deg,
    #071226,
    #020617
  );

  border-radius:24px;

  border:1px solid rgba(59,130,246,.45);

  overflow:hidden;

  box-shadow:
    0 0 24px rgba(37,99,235,.25),
    0 12px 40px rgba(0,0,0,.75);

  backdrop-filter:blur(12px);
}

#nicoHeader{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;

  padding:14px;

  border-bottom:1px solid rgba(59,130,246,.2);
}

#nicoTitleRow{
  display:flex;
  align-items:center;
  gap:7px;
}

#nicoTitle{
  color:white;
  font-size:24px;
  font-weight:900;
}

#nicoOnlineDot{
  width:10px;
  height:10px;
  border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 10px #22c55e;
}

#nicoOnlineText{
  color:#22c55e;
  font-size:13px;
  font-weight:800;
}

#nicoSubtitle{
  color:#cbd5e1;
  font-size:12px;
  margin-top:4px;
}

#nicoClose{
  width:44px;
  height:44px;

  border:none;
  border-radius:50%;

  background:#ef4444;
  color:white;

  font-size:24px;
  font-weight:900;

  box-shadow:0 0 16px rgba(239,68,68,.45);
}

#nicoBody{
  padding:10px;
}

#nicoChatMessages{
  display:flex;
  flex-direction:column;
  gap:8px;

  max-height:260px;
  overflow-y:auto;

  margin-bottom:10px;
}

.nicoMsg{
  padding:11px 13px;

  border-radius:15px;

  font-size:14px;
  line-height:1.4;

  white-space:pre-wrap;
  word-break:break-word;
}

.nicoMsg.user{
  align-self:flex-end;

  background:linear-gradient(
    135deg,
    #3b82f6,
    #2563eb
  );

  color:white;
}

.nicoMsg.nico{
  align-self:flex-start;

  background:rgba(39,39,42,.95);

  color:white;
}

#nicoInputRow{
  display:flex;
  gap:8px;
  align-items:flex-end;
}

#nicoChatInput{
  flex:1;

  min-height:58px;
  max-height:85px;

  resize:none;

  border-radius:16px;

  border:1px solid rgba(59,130,246,.5);

  background:#0b1120;

  color:white;

  padding:12px;

  font-size:14px;

  outline:none;
}

#nicoChatInput::placeholder{
  color:#94a3b8;
}

#nicoChatInput:focus{
  border-color:#3b82f6;

  box-shadow:
    0 0 0 2px rgba(59,130,246,.15);
}

#nicoSend{
  width:82px;
  min-height:58px;

  border:none;
  border-radius:16px;

  background:linear-gradient(
    135deg,
    #22c55e,
    #16a34a
  );

  color:white;

  font-size:15px;
  font-weight:900;

  box-shadow:
    0 0 18px rgba(34,197,94,.3);
}

@media(max-width:600px){

  #nicoChatPanel{
    width:320px !important;
    left:10px !important;
    bottom:16px !important;
  }

  #nicoBtn{
    width:100px;
    height:145px;
  }

}

`;

document.head.appendChild(style);

// ================= ELEMENTS =================

const nicoBtn = document.getElementById("nicoBtn");
const nicoChatPanelEl = document.getElementById("nicoChatPanel");
const nicoChatMessages = document.getElementById("nicoChatMessages");
const nicoChatInput = document.getElementById("nicoChatInput");
const nicoSend = document.getElementById("nicoSend");
const nicoClose = document.getElementById("nicoClose");
const nicoFloatingAvatar = document.getElementById("nicoFloatingAvatar");

// ================= IMAGES =================

function imagenNico(tipo){

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

  nicoFloatingAvatar.src =
    imgs[tipo] || imgs.saluda;
}

// ================= CHAT =================

function agregarMensaje(tipo, texto){

  const div = document.createElement("div");

  div.className = `nicoMsg ${tipo}`;

  div.innerText = texto;

  nicoChatMessages.appendChild(div);

  nicoChatMessages.scrollTop =
    nicoChatMessages.scrollHeight;

  return div;
}

// ================= OPEN / CLOSE =================

function abrirNico(){

  nicoActivo = true;

  imagenNico("saluda");

  nicoChatPanelEl.style.display = "block";

  if(!nicoChatMessages.dataset.saludo){

    agregarMensaje(
      "nico",
      "Hola hola, ¿en qué puedo ayudarte?"
    );

    nicoChatMessages.dataset.saludo = "true";
  }

  setTimeout(() => {
    nicoChatInput.focus();
  }, 120);
}

function cerrarNico(){

  nicoActivo = false;

  nicoChatPanelEl.style.display = "none";

  imagenNico("saluda");
}

nicoBtn.onclick = () => {

  if(nicoActivo){
    cerrarNico();
  }else{
    abrirNico();
  }
};

nicoClose.onclick = cerrarNico;

// ================= THINK =================

async function pensarConNico(mensaje){

  try{

    imagenNico("piensa");

    const res = await fetch(
      PENSAR_NICO_URL,
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          mensaje
        })
      }
    );

    const data = await res.json();

    if(!res.ok){

      console.log(data);

      return "Rodri, no pude responder ahora mismo.";
    }

    return (
      data.respuesta ||
      data.output_text ||
      "Aquí estoy, Rodri."
    ).trim();

  }catch(e){

    console.log(e);

    return "Rodri, hubo un problema conectando con Nico.";
  }
}

// ================= SEND =================

async function enviarTextoANico(){

  const mensaje =
    nicoChatInput.value.trim();

  if(!mensaje || nicoPensando) return;

  nicoChatInput.value = "";

  agregarMensaje("user", mensaje);

  // ================= CREAR ESTIMATE =================

  if(
    mensaje.toLowerCase().includes("crear estimate") ||
    mensaje.toLowerCase().includes("create estimate")
  ){

    agregarMensaje(
      "nico",
`🧾 Claro Rodri.

Envíame así:

Cliente, Tipo, Precio, Detalles

Ejemplo:

Amanda, Deep Clean, 450, Cocina y baños`
    );

    nicoModoEstimate = true;
    return;
  }

  // ================= GUARDAR ESTIMATE =================

  if(nicoModoEstimate){

    try{

      const partes =
        mensaje.split(",");

      const cliente =
        partes[0]?.trim() || "";

      const tipo =
        partes[1]?.trim() || "";

      const total =
        partes[2]?.trim() || "";

      const detalles =
        partes[3]?.trim() || "";

      const payload = {

        cliente_nombre: cliente,
        tipo_limpieza: tipo,
        total: Number(total),
        notes: detalles

      };

      const res = await fetch(
        CREAR_ESTIMATE_URL,
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if(!res.ok){

        console.log(data);

        agregarMensaje(
          "nico",
          "❌ No pude crear el estimate."
        );

        nicoModoEstimate = false;
        return;
      }

      agregarMensaje(
        "nico",
`✅ Estimate creado correctamente

👤 Cliente: ${cliente}
🧼 Tipo: ${tipo}
💵 Total: $${total}

📄 Estimate:
${data.estimate.numero}`
      );

      imagenNico("bien");

      nicoModoEstimate = false;

      return;

    }catch(e){

      console.log(e);

      agregarMensaje(
        "nico",
        "❌ Error creando estimate."
      );

      nicoModoEstimate = false;

      return;
    }
  }

  // ================= MOSTRAR ESTIMATES =================

  if(
    mensaje.toLowerCase().includes("mostrar estimates") ||
    mensaje.toLowerCase().includes("ver estimates")
  ){

    try{

      const res =
        await fetch(CONSULTAR_ESTIMATES_URL);

      const data =
        await res.json();

      const estimates =
        data.estimates || [];

      if(!estimates.length){

        agregarMensaje(
          "nico",
          "No encontré estimates."
        );

        return;
      }

      let texto =
        "📋 ESTIMATES:\n\n";

      estimates
      .slice(0,10)
      .forEach((e)=>{

        texto +=
`👤 ${e.cliente_nombre}
🧼 ${e.tipo_limpieza}
💵 $${e.total}
📄 ${e.numero}

`;

      });

      agregarMensaje(
        "nico",
        texto
      );

      return;

    }catch(e){

      console.log(e);

      agregarMensaje(
        "nico",
        "❌ Error consultando estimates."
      );

      return;
    }
  }

  // ================= IA NORMAL =================

  nicoPensando = true;

  const thinking =
    agregarMensaje(
      "nico",
      "Nico está pensando..."
    );

  try{

    const respuesta =
      await pensarConNico(mensaje);

    thinking.innerText = respuesta;

    imagenNico("alegre");

  }catch(e){

    console.log(e);

    thinking.innerText =
      "Rodri, tuve un problema respondiendo.";

  }finally{

    nicoPensando = false;

    nicoChatMessages.scrollTop =
      nicoChatMessages.scrollHeight;
  }
}
nicoSend.onclick = enviarTextoANico;

nicoChatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarTextoANico();
  }
});
// ================= STOP =================

function apagarNico(){

  nicoActivo = false;
  nicoPensando = false;

  nicoChatPanelEl.style.display = "none";

  imagenNico("saluda");
}

window.NICO_STOP = apagarNico;
