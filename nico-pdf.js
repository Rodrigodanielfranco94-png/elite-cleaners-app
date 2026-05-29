// ================= DOCUMENT PDF =================

function escribirDocumentoPDF(nuevaVentana, tipo, doc){
  const isInvoice = tipo === "invoice";
  const titulo = isInvoice ? "INVOICE" : "ESTIMATE";
  const numero = doc.numero || doc.invoice_numero || "";
  const total = dinero(doc.total || doc.amount_due || doc.balance_due || 0);
  const status = doc.status || (isInvoice ? "Unpaid" : "Draft");

  nuevaVentana.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${numero}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;margin:0;padding:30px;color:#111827;}
  .page{max-width:800px;margin:0 auto;background:white;padding:45px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.12);}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e5e7eb;padding-bottom:25px;margin-bottom:30px;}
  .logo{width:190px;height:auto;}
  .title{text-align:right;}
  .title h1{margin:0;font-size:38px;color:#1f2937;letter-spacing:1px;}
  .doc-number{margin-top:8px;color:#6b7280;font-size:14px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px;}
  .section-title{font-size:13px;color:#2563eb;font-weight:bold;text-transform:uppercase;margin-bottom:8px;}
  .info{font-size:15px;line-height:1.55;}
  table{width:100%;border-collapse:collapse;margin-top:25px;}
  th{background:#1f2937;color:white;text-align:left;padding:12px;font-size:13px;text-transform:uppercase;}
  td{border-bottom:1px solid #e5e7eb;padding:14px 12px;font-size:14px;vertical-align:top;}
  .right{text-align:right;}
  .notes{
  margin-top:30px;
  padding:18px;
  background:#f9fafb;
  border-left:4px solid #2563eb;
  font-size:14px;
  line-height:1.5;
  white-space:pre-line;
}
  .total-box{margin-top:30px;display:flex;justify-content:flex-end;}
  .total-inner{width:300px;border-top:2px solid #111827;padding-top:15px;}
  .total-row{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;}
  .total-price{color:#16a34a;font-size:28px;}
  .footer{margin-top:45px;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;padding-top:18px;}
  .btns{max-width:800px;margin:20px auto;display:flex;gap:10px;justify-content:center;}
  button{border:none;border-radius:10px;padding:14px 22px;font-size:15px;font-weight:bold;cursor:pointer;}
  .download{background:#2563eb;color:white;}
  .close{background:#111827;color:white;}
  @media print{body{background:white;padding:0;}.page{box-shadow:none;border-radius:0;max-width:none;}.btns{display:none;}}
</style>
</head>

<body>
  <div class="page">
    <div class="top">
      <div>
        <img class="logo" src="${ELITE_LOGO_URL}" />
        <div class="info" style="margin-top:12px;">
          <strong>Elite Cleaners Company</strong><br>
          Pleasanton, CA 94566<br>
          elitecleanerscompany@gmail.com<br>
          +1 (925) 336-2884
        </div>
      </div>

      <div class="title">
        <h1>${titulo}</h1>
        <div class="doc-number">${numero}</div>
        <div class="doc-number">Date: ${doc.fecha || hoyISO()}</div>
        ${
          isInvoice
          ? `<div class="doc-number">Due Date: ${doc.due_date || ""}</div>`
          : `<div class="doc-number">Valid Until: ${doc.valid_until || doc.fecha || ""}</div>`
        }
        <div class="doc-number">Status: ${status}</div>
      </div>
    </div>

  <div class="grid">
  <div>
    <div class="section-title">Bill To</div>
    <div class="info">
      <strong>${doc.cliente_nombre || ""}</strong><br>
      ${doc.cliente_email || ""}<br>
      ${doc.cliente_telefono || ""}<br>
      ${doc.cliente_direccion || ""}
    </div>
  </div>

  <div>
    <div class="section-title">Service Details</div>
    <div class="info">
      <strong>Cleaning Type:</strong> ${doc.tipo_limpieza || ""}<br>
      ${doc.estimate_numero ? `<strong>From Estimate:</strong> ${doc.estimate_numero}<br>` : ""}
      <strong>Created By:</strong> Nico
    </div>
  </div>
</div>

<div class="section-title" style="margin-top:20px;">Property Details</div>
<div class="info">
  <strong>Square Feet:</strong> ${doc.pies_cuadrados || "0"} ft²<br>
  <strong>Bedrooms:</strong> ${doc.habitaciones || "0"}<br>
  <strong>Bathrooms:</strong> ${doc.banos || "0"}<br>
  <strong>Half Bathrooms:</strong> ${doc.medios_banos || "0"}<br>
  <strong>Living Rooms:</strong> ${doc.salas || "0"}<br>
  <strong>Kitchens:</strong> ${doc.cocinas || "0"}<br>
  <strong>Offices:</strong> ${doc.oficinas || "0"}<br>
  <strong>Miles:</strong> ${doc.millas_servicio || "0"} miles
</div>

<div class="section-title" style="margin-top:20px;">Extras</div>
<div class="info">
  <strong>Oven:</strong> ${doc.horno || "0"}<br>
  <strong>Fridge:</strong> ${doc.nevera || "No"}<br>
  <strong>Cabinets:</strong> ${doc.gabinetes || "No"}<br>
  <strong>Windows:</strong> ${doc.ventanas || "No"}<br>
  <strong>Baseboards:</strong> ${doc.baseboards || "No"}<br>
  <strong>Carpet Rooms:</strong> ${doc.alfombra_habitaciones || "0"}<br>
  <strong>Carpet Sq Ft:</strong> ${doc.alfombra_pies_cuadrados || "0"} ft²<br>
  <strong>Carpet Notes:</strong> ${doc.alfombra_notas || ""}
</div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th class="right">Price</th>
          <th class="right">Quantity</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${
          (doc.items && doc.items.length)
          ? doc.items.map(item => `
            <tr>
              <td>${item.description || doc.tipo_limpieza || "Cleaning Service"}</td>
              <td class="right">$${dinero(item.price || doc.total)}</td>
              <td class="right">${item.quantity || 1}</td>
              <td class="right">$${dinero(item.total || doc.total)}</td>
            </tr>
          `).join("")
          : `
            <tr>
              <td>${doc.tipo_limpieza || "Cleaning Service"}</td>
              <td class="right">$${total}</td>
              <td class="right">1</td>
              <td class="right">$${total}</td>
            </tr>
          `
        }
      </tbody>
    </table>

    <div class="notes">
      <strong>Notes:</strong><br>
      ${doc.notes || "Includes supplies, equipment, and all work materials. This document does not include additional services not requested in the initial inquiry."}
    </div>

    <div class="total-box">
      <div class="total-inner">
        <div class="total-row">
          <span>${isInvoice ? "Balance Due" : "Estimate Total"}</span>
          <span class="total-price">$${total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      Thank you for choosing Elite Cleaners Company.<br>
      ${isInvoice ? "Payment is due according to the agreed terms." : "This is an estimate and may be adjusted if additional services are requested."}
    </div>
  </div>

  <div class="btns">
    <button class="download" onclick="window.print()">Download / Print PDF</button>
    <button class="close" onclick="window.close()">Close</button>
  </div>
</body>
</html>
  `);

  nuevaVentana.document.close();
}

async function abrirEstimatePDF(numeroEstimate){

  try{
    imagenNico("celular");

    const estimates =
      await obtenerEstimates();

    const estimate =
      estimates.find(e =>
        normalizarTexto(e.numero || "").includes(
          normalizarTexto(numeroEstimate || "")
        )
      );

    if(!estimate){
      agregarMensaje(
        "nico",
        "Rodri, no encontré ese estimate."
      );
      return;
    }

    const nuevaVentana =
      window.open("", "_blank");

    if(!nuevaVentana){
      agregarMensaje(
        "nico",
        "Rodri, el navegador bloqueó la ventana. Permite pop-ups para abrir el PDF."
      );
      return;
    }

    escribirDocumentoPDF(
      nuevaVentana,
      "estimate",
      estimate
    );

    agregarMensaje(
      "nico",
      "✅ Estimate abierto correctamente. Desde ahí puedes descargarlo o imprimirlo como PDF."
    );

    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje(
      "nico",
      "❌ Error abriendo estimate."
    );
  }
}

async function abrirInvoicePDF(numeroInvoice){

  try{
    imagenNico("celular");

    const invoices =
      await obtenerInvoices();

    const invoice =
      invoices.find(inv =>
        normalizarTexto(
          inv.numero || inv.invoice_numero || ""
        ).includes(
          normalizarTexto(numeroInvoice || "")
        )
      );

    if(!invoice){
      agregarMensaje(
        "nico",
        "Rodri, no encontré ese invoice."
      );
      return;
    }

    const nuevaVentana =
      window.open("", "_blank");

    if(!nuevaVentana){
      agregarMensaje(
        "nico",
        "Rodri, el navegador bloqueó la ventana. Permite pop-ups para abrir el PDF."
      );
      return;
    }

    escribirDocumentoPDF(
      nuevaVentana,
      "invoice",
      invoice
    );

    agregarMensaje(
      "nico",
      "✅ Invoice abierto correctamente. Desde ahí puedes descargarlo o imprimirlo como PDF."
    );

    imagenNico("bien");

  }catch(e){
    console.log(e);
    agregarMensaje(
      "nico",
      "❌ Error abriendo invoice."
    );
  }
}
