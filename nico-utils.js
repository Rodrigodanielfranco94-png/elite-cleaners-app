function normalizarTexto(t){
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function dinero(valor){
  const n = Number(valor || 0);
  return n.toFixed(2);
}

function obtenerValor(id){
  return document.getElementById(id)?.value?.trim() || "";
}

function hoyISO(){
  return new Date().toISOString().slice(0,10);
}

function sumarDiasISO(dias){
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0,10);
}

function limpiarTelefono(numero){
  return (numero || "").replace(/\D/g,"");
}

function extraerNumeroDocumento(texto){
  const match = texto.match(/(EST|INV|REC)-[A-Z0-9-]+/i);
  return match ? match[0].toUpperCase() : "";
}

function extraerFechaHora(texto){
  const fechaMatch = texto.match(/\d{4}-\d{2}-\d{2}/);
  const horaMatch = texto.match(/\d{1,2}:\d{2}/);

  return {
    fecha: fechaMatch ? fechaMatch[0] : "",
    hora: horaMatch ? horaMatch[0] : ""
  };
}
