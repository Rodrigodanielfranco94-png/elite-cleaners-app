// ================= NICO PRICING / ESTIMATE DESDE TEXTO =================

const NICO_PRICING = {
  "ESTÁNDAR": {
    base: 120,
    habitacion: 20,
    bano: 30
  },

  "PROFUNDA": {
    base: 180,
    habitacion: 25,
    bano: 40
  },

  "MOVE-IN": {
    base: 220,
    habitacion: 30,
    bano: 45
  },

  "MOVE-OUT": {
    base: 220,
    habitacion: 30,
    bano: 45
  },

  "POST-CONSTRUCCIÓN": {
    base: 260,
    habitacion: 35,
    bano: 50
  },

  extras: {
    nevera: 25,
    horno: 25,
    gabinetes: 40,
    ventanas: 45,
    baseboards: 35
  }
};

function extraerNumeroPorPalabra(texto, palabras){
  const t = normalizarTexto(texto);

  for(const palabra of palabras){
    const regex = new RegExp("(\\d+)\\s*(?:de\\s*)?" + palabra, "i");
    const match = t.match(regex);
    if(match) return Number(match[1]);
  }

  return 0;
}

function detectarTipoLimpiezaDesdeTexto(texto){
  const t = normalizarTexto(texto);

  if(t.includes("post construccion") || t.includes("post-construccion")){
    return "POST-CONSTRUCCIÓN";
  }

  if(t.includes("move in") || t.includes("move-in")){
    return "MOVE-IN";
  }

  if(t.includes("move out") || t.includes("move-out")){
    return "MOVE-OUT";
  }

  if(t.includes("profunda") || t.includes("deep")){
    return "PROFUNDA";
  }

  if(t.includes("estandar") || t.includes("standard")){
    return "ESTÁNDAR";
  }

  return "ESTÁNDAR";
}

function calcularEstimateDesdeTexto(mensaje){
  const t = normalizarTexto(mensaje);

  const tipo = detectarTipoLimpiezaDesdeTexto(mensaje);

  const habitaciones = extraerNumeroPorPalabra(t, [
    "habitaciones",
    "habitacion",
    "cuartos",
    "bedrooms",
    "rooms"
  ]);

  const banos = extraerNumeroPorPalabra(t, [
    "banos",
    "bano",
    "bathrooms",
    "bathroom",
    "baths",
    "bath"
  ]);

  const extras = [];

  if(t.includes("nevera") || t.includes("refrigerador") || t.includes("fridge")){
    extras.push("nevera");
  }

  if(t.includes("horno") || t.includes("oven")){
    extras.push("horno");
  }

  if(t.includes("gabinete") || t.includes("gabinetes") || t.includes("cabinets")){
    extras.push("gabinetes");
  }

  if(t.includes("ventana") || t.includes("ventanas") || t.includes("windows")){
    extras.push("ventanas");
  }

  if(
    t.includes("baseboard") ||
    t.includes("baseboards") ||
    t.includes("zocalo") ||
    t.includes("zocalos") ||
    t.includes("base or") ||
    t.includes("bases")
  ){
    extras.push("baseboards");
  }

  const reglas = NICO_PRICING[tipo] || NICO_PRICING["ESTÁNDAR"];

  let total = reglas.base;

  total += habitaciones * reglas.habitacion;
  total += banos * reglas.bano;

  extras.forEach(extra => {
    total += NICO_PRICING.extras[extra] || 0;
  });

  const notes = [
    `${habitaciones || 0} habitaciones`,
    `${banos || 0} baños`,
    extras.length ? `Extras: ${extras.join(", ")}` : "",
    `Tipo de limpieza: ${tipo}`
  ].filter(Boolean).join(" | ");

  return {
    tipo_limpieza: tipo,
    habitaciones,
    banos,
    extras,
    total,
    notes
  };
}

function esSolicitudDeEstimadoRapido(texto){
  const t = normalizarTexto(texto);

  return (
    t.includes("estimado") ||
    t.includes("estimate") ||
    t.includes("cotizacion") ||
    t.includes("cotización") ||
    t.includes("precio") ||
    t.includes("cuanto") ||
    t.includes("cuánto")
  ) && (
    t.includes("habitacion") ||
    t.includes("habitaciones") ||
    t.includes("bano") ||
    t.includes("banos") ||
    t.includes("bath") ||
    t.includes("bedroom") ||
    t.includes("limpieza") ||
    t.includes("cleaning")
  );
}

function responderEstimadoRapido(mensaje){

  const calculo =
    calcularEstimateDesdeTexto(mensaje);

  nicoUltimoEstimadoRapido =
    calculo;

  if(document.getElementById("precio_total")){
    document.getElementById("precio_total").value =
      calculo.total;
  }

  if(document.getElementById("notas")){
    document.getElementById("notas").value =
      calculo.notes;
  }

  const cliente =
    obtenerValor("cliente");

  const direccion =
    obtenerValor("direccion");

  const telefono =
    obtenerValor("whatsapp");

  const email =
    obtenerValor("email_cliente");

  let faltantes = [];

  if(!cliente) faltantes.push("nombre");
  if(!direccion) faltantes.push("dirección");
  if(!telefono) faltantes.push("teléfono");
  if(!email) faltantes.push("email");

  agregarMensaje(
    "nico",

`✅ Perfecto Rodri, ya calculé el estimado aproximado.

🧼 Tipo:
${calculo.tipo_limpieza}

🛏️ Habitaciones:
${calculo.habitaciones || 0}

🚿 Baños:
${calculo.banos || 0}

➕ Extras:
${calculo.extras.length ? calculo.extras.join(", ") : "Sin extras"}

💵 Total estimado:
$${dinero(calculo.total)}

📝 Notas:
${calculo.notes}

Ya coloqué el precio y las notas automáticamente en el formulario.

${
  faltantes.length
  ? `Para crear el PDF todavía faltan:\n\n• ${faltantes.join("\n• ")}`
  : `🔥 Todo está listo para crear el Estimate PDF.\n\nSi quieres crearlo ahora, escribe:\n\nCREAR PDF`
}`
  );

  imagenNico("bien");

  return calculo;
}
