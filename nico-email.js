// ================= EMAIL DOCUMENTS =================

let nicoEmailPendiente = null;

function prepararEmailDocumento(tipo, doc){
  const isInvoice = tipo === "invoice";
  const numero = doc.numero || doc.invoice_numero || "";
  const email = doc.cliente_email || "";

  if(!email){
    agregarMensaje("nico", "Rodri, este cliente no tiene email guardado.");
    return;
  }

  const asunto = isInvoice
    ? `Invoice ${numero} - Elite Cleaners Company`
    : `Estimate ${numero} - Elite Cleaners Company`;

  const mensaje = isInvoice
    ? `Hello ${doc.cliente_nombre || "there"},

Thank you for choosing Elite Cleaners Company.

Your invoice ${numero} is ready.

Total Due: $${dinero(doc.total || doc.amount_due || doc.balance_due || 0)}

Please let us know if you have any questions.

Best regards,
Elite Cleaners Company`
    : `Hello ${doc.cliente_nombre || "there"},

Thank you for considering Elite Cleaners Company.

Your estimate ${numero} is ready.

Estimated Total: $${dinero(doc.total || 0)}

Please let us know if you have any questions or if you would like to schedule your cleaning service.

Best regards,
Elite Cleaners Company`;

  nicoEmailPendiente = {
    para: email,
    asunto,
    mensaje
  };

  agregarMensaje("nico",
`⚠️ EMAIL PENDIENTE DE APROBACIÓN

Para:
${email}

Asunto:
${asunto}

Mensaje:

${mensaje}

Si todo está correcto escribe:

APROBAR EMAIL

Si no quieres enviarlo escribe:

CANCELAR EMAIL`
  );
}

async function enviarEmailPendiente(){
  if(!nicoEmailPendiente){
    agregarMensaje("nico", "Rodri, no hay ningún email pendiente.");
    return;
  }

  imagenNico("celular");

  const res = await fetch(ENVIAR_CORREO_NICO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nicoEmailPendiente)
  });

  const data = await res.json();

  if(!res.ok || !data.ok){
    console.log(data);
    agregarMensaje("nico", "Rodri, no pude enviar el email.");
    return;
  }

  agregarMensaje("nico", "✅ Email enviado correctamente desde Elite Cleaners Company.");
  imagenNico("bien");
  nicoEmailPendiente = null;
}

function cancelarEmailPendiente(){
  nicoEmailPendiente = null;
  agregarMensaje("nico", "❌ Email cancelado. No se envió nada.");
}

async function prepararEnvioEstimateEmail(numeroEstimate){
  const estimates = await obtenerEstimates();

  const estimate = estimates.find(e =>
    normalizarTexto(e.numero || "").includes(normalizarTexto(numeroEstimate || ""))
  );

  if(!estimate){
    agregarMensaje("nico", "Rodri, no encontré ese estimate.");
    return;
  }

  prepararEmailDocumento("estimate", estimate);
}

async function prepararEnvioInvoiceEmail(numeroInvoice){
  const invoices = await obtenerInvoices();

  const invoice = invoices.find(inv =>
    normalizarTexto(inv.numero || inv.invoice_numero || "").includes(normalizarTexto(numeroInvoice || ""))
  );

  if(!invoice){
    agregarMensaje("nico", "Rodri, no encontré ese invoice.");
    return;
  }

  agregarMensaje("nico", texto.trim());
}
