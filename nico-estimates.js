// ================= NICO PRICING / ESTIMATE DESDE TEXTO =================

const NICO_PRICING = {
  "ESTÁNDAR": {
    base: 180,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  "PROFUNDA": {
    base: 250,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  "PRIMERA": {
    base: 250,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  "MOVE-IN": {
    base: 320,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  "MOVE-OUT": {
    base: 320,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  "POST-CONSTRUCCIÓN": {
    base: 450,
    habitacion: 20,
    bano: 30,
    medio_bano: 15,
    sala: 15,
    cocina: 25,
    oficina: 20,
    lavanderia: 10,
    garaje: 20,
    comedor: 10,
    sala_juegos: 20
  },

  extras: {
    nevera_outside: 20,
    nevera_inside: 60,
    nevera_inside_outside: 80,

    horno: 85,

    gabinetes_outside: 20,
    gabinetes_inside: 45,
    gabinetes_inside_outside: 65,

    ventanas_outside: 50,
    ventanas_inside: 50,
    ventanas_inside_outside: 100,

    baseboards: 35,

    alfombra_habitacion: 50,
    alfombra_ft2: 0.25,

    milla: 0.22
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

  if(t.includes("primera") || t.includes("primera vez") || t.includes("first cleaning")){
    return "PRIMERA";
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

  const medios_banos = extraerNumeroPorPalabra(t, [
    "medio bano",
    "medios banos",
    "half bath",
    "half baths"
  ]);

  const salas = extraerNumeroPorPalabra(t, [
    "sala",
    "salas",
    "living room",
    "living rooms"
  ]);

  const cocinas = extraerNumeroPorPalabra(t, [
    "cocina",
    "cocinas",
    "kitchen",
    "kitchens"
  ]);

  const oficinas = extraerNumeroPorPalabra(t, [
    "oficina",
    "oficinas",
    "office",
    "offices"
  ]);

  const lavanderia = extraerNumeroPorPalabra(t, [
    "lavanderia",
    "laundry"
  ]);

  const garaje = extraerNumeroPorPalabra(t, [
    "garaje",
    "garage"
  ]);

  const comedor = extraerNumeroPorPalabra(t, [
    "comedor",
    "dining room"
  ]);

  const sala_juegos = extraerNumeroPorPalabra(t, [
    "sala de juegos",
    "game room",
    "play room"
  ]);

  const alfombra_habitaciones = extraerNumeroPorPalabra(t, [
    "habitaciones con alfombra",
    "carpet rooms",
    "carpet bedrooms"
  ]);

  const alfombra_pies_cuadrados = extraerNumeroPorPalabra(t, [
    "pies cuadrados de alfombra",
    "carpet square feet",
    "carpet ft"
  ]);

  const millas = extraerNumeroPorPalabra(t, [
    "millas",
    "miles"
  ]);

  const extras = [];

  if(t.includes("nevera outside") || t.includes("fridge outside")){
    extras.push("nevera_outside");
  } else if(t.includes("nevera inside") || t.includes("fridge inside")){
    extras.push("nevera_inside");
  } else if(t.includes("nevera") || t.includes("refrigerador") || t.includes("fridge")){
    extras.push("nevera_inside_outside");
  }

  if(t.includes("horno") || t.includes("oven")){
    extras.push("horno");
  }

  if(t.includes("gabinetes outside") || t.includes("cabinets outside")){
    extras.push("gabinetes_outside");
  } else if(t.includes("gabinetes inside") || t.includes("cabinets inside")){
    extras.push("gabinetes_inside");
  } else if(t.includes("gabinete") || t.includes("gabinetes") || t.includes("cabinets")){
    extras.push("gabinetes_inside_outside");
  }

  if(t.includes("ventanas outside") || t.includes("windows outside")){
    extras.push("ventanas_outside");
  } else if(t.includes("ventanas inside") || t.includes("windows inside")){
    extras.push("ventanas_inside");
  } else if(t.includes("ventana") || t.includes("ventanas") || t.includes("windows")){
    extras.push("ventanas_inside_outside");
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
  total += medios_banos * reglas.medio_bano;
  total += salas * reglas.sala;
  total += cocinas * reglas.cocina;
  total += oficinas * reglas.oficina;
  total += lavanderia * reglas.lavanderia;
  total += garaje * reglas.garaje;
  total += comedor * reglas.comedor;
  total += sala_juegos * reglas.sala_juegos;

  total += alfombra_habitaciones * NICO_PRICING.extras.alfombra_habitacion;
  total += alfombra_pies_cuadrados * NICO_PRICING.extras.alfombra_ft2;
  total += millas * NICO_PRICING.extras.milla;

  extras.forEach(extra => {
    total += NICO_PRICING.extras[extra] || 0;
  });

  total = Math.round(total);

  const notes = [
    `Tipo de limpieza: ${tipo}`,
    `Base: $${reglas.base}`,
    `${habitaciones || 0} habitaciones`,
    `${banos || 0} baños`,
    `${medios_banos || 0} medios baños`,
    `${salas || 0} salas`,
    `${cocinas || 0} cocinas`,
    `${oficinas || 0} oficinas`,
    `${lavanderia || 0} lavandería`,
    `${garaje || 0} garaje`,
    `${comedor || 0} comedor`,
    `${sala_juegos || 0} sala de juegos`,
    alfombra_habitaciones ? `Alfombra habitaciones: ${alfombra_habitaciones}` : "",
    alfombra_pies_cuadrados ? `Alfombra ft²: ${alfombra_pies_cuadrados}` : "",
    millas ? `Millas: ${millas}` : "",
    extras.length ? `Extras: ${extras.join(", ")}` : ""
  ].filter(Boolean).join(" | ");

  return {
    tipo_limpieza: tipo,
    habitaciones,
    banos,
    medios_banos,
    salas,
    cocinas,
    oficinas,
    lavanderia,
    garaje,
    comedor,
    sala_juegos,
    alfombra_habitaciones,
    alfombra_pies_cuadrados,
    millas,
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

  const calculo = calcularEstimateDesdeTexto(mensaje);

  nicoUltimoEstimadoRapido = calculo;

  if(document.getElementById("precio_total")){
    document.getElementById("precio_total").value = calculo.total;
  }

  if(document.getElementById("notas")){
    document.getElementById("notas").value = calculo.notes;
  }

  if(document.getElementById("notas_internas")){
    document.getElementById("notas_internas").value = calculo.notes;
  }

  const cliente = obtenerValor("cliente");
  const direccion = obtenerValor("direccion");
  const telefono = obtenerValor("whatsapp");
  const email = obtenerValor("email_cliente");

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

🚽 Medios baños:
${calculo.medios_banos || 0}

🏠 Ambientes:
Salas: ${calculo.salas || 0}
Cocinas: ${calculo.cocinas || 0}
Oficinas: ${calculo.oficinas || 0}
Lavandería: ${calculo.lavanderia || 0}
Garaje: ${calculo.garaje || 0}
Comedor: ${calculo.comedor || 0}
Sala de juegos: ${calculo.sala_juegos || 0}

🧼 Alfombra:
Habitaciones: ${calculo.alfombra_habitaciones || 0}
Pies cuadrados: ${calculo.alfombra_pies_cuadrados || 0}

🚗 Millas:
${calculo.millas || 0}

➕ Extras:
${calculo.extras.length ? calculo.extras.join(", ") : "Sin extras"}

💵 Total estimado:
$${dinero(calculo.total)}

📝 Notas:
${calculo.notes}

Ya coloqué el precio automáticamente en el formulario.

${
  faltantes.length
  ? `Para crear el PDF todavía faltan:\n\n• ${faltantes.join("\n• ")}`
  : `🔥 Todo está listo para crear el Estimate PDF.\n\nSi quieres crearlo ahora, escribe:\n\nCREAR PDF`
}`
  );

  imagenNico("bien");

  return calculo;
}
