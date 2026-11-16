function tpgaInstallMarginStyle() {
  if (document.getElementById('tpga-margin-style')) return;
  const style = document.createElement('style');
  style.id = 'tpga-margin-style';
  style.textContent = 'tr.tpga-margin-override{box-shadow:inset 4px 0 0 #d97706;}input.tpga-margin-override{background:#fffbeb;border-color:#d97706;color:#92400e;font-weight:700;}';
  document.head.appendChild(style);
}

function tpgaMainMargin() {
  const raw = parseFloat((document.getElementById('input-margin') || {}).value);
  if (Number.isFinite(raw) && raw >= 0) return raw;
  const fallback = tpgaNum('marginPercent');
  return Number.isFinite(fallback) ? fallback : 0;
}

function tpgaEffectiveMargin(product) {
  const override = product && product.marginOverride;
  if (override != null && override !== '' && Number.isFinite(Number(override))) {
    return { percent: Number(override), override: true };
  }
  return { percent: tpgaMainMargin(), override: false };
}

function tpgaMarginInputHtml(product) {
  const main = tpgaMainMargin();
  const active = product.marginOverride != null && Number.isFinite(Number(product.marginOverride));
  const value = active ? product.marginOverride : '';
  const cls = active ? 'tpga-margin-override' : '';
  return '<label class="inline-flex items-center gap-1">' +
    '<input type="number" id="product-margin-' + product.id + '" value="' + value + '" placeholder="' + main + '" min="0" max="95" step="0.5" title="Leave blank to use the main margin (' + main + '%)" aria-label="Margin percent for product ' + product.id + '" oninput="tpgaSyncProductMargin(' + product.id + ', this.value)" class="w-16 text-right border rounded py-0.5 px-1 font-mono text-xs focus:outline-none ' + cls + '">' +
    (active ? '<span class="text-[9px] font-bold uppercase text-amber-700">override</span>' : '') +
    '</label>';
}

function tpgaSyncProductMargin(id, value) {
  const product = (window.tpgaProducts || []).find(function (item) { return item.id === id; });
  if (!product) return;
  if (value === '' || value == null) product.marginOverride = null;
  else {
    const number = parseFloat(value);
    product.marginOverride = Number.isFinite(number) && number >= 0 ? number : null;
  }
  const previous = document.getElementById('product-margin-' + id);
  const caret = previous ? previous.selectionStart : null;
  if (typeof renderTable === 'function') renderTable();
  const field = document.getElementById('product-margin-' + id);
  if (field) {
    field.focus();
    if (caret != null && field.setSelectionRange) field.setSelectionRange(caret, caret);
  }
}

function tpgaNum(key) {
  const value = window.tpgaEngineState && window.tpgaEngineState[key];
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function tpgaShowStatus(message, ok) {
  let node = document.getElementById('tpga-save-status');
  if (!node) {
    node = document.createElement('p');
    node.id = 'tpga-save-status';
    node.setAttribute('role', 'status');
    node.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:10001;margin:0;padding:12px 16px;border-radius:12px;font-weight:700;text-align:center;';
    document.body.appendChild(node);
  }
  node.style.display = 'block';
  node.style.background = ok ? '#ecfdf5' : '#fef2f2';
  node.style.color = ok ? '#065f46' : '#991b1b';
  node.style.border = ok ? '1px solid #10b981' : '1px solid #f87171';
  node.textContent = message;
}

async function tpgaHydratePage(page, refs) {
  const response = await fetch('/api/prices?page=' + encodeURIComponent(page));
  if (!response.ok) {
    throw new Error('Price service returned ' + response.status);
  }
  const data = await response.json();
  window.tpgaEngineState = data.engine || {};
  if (data.inputs && data.inputs['input-margin'] != null) {
    window.tpgaEngineState.marginPercent = data.inputs['input-margin'];
  }
  window.tpgaPage = page;
  window.tpgaProducts = refs && refs.products ? refs.products : [];
  if (data.inputs) {
    Object.keys(data.inputs).forEach(function (id) {
      if (refs && refs.defaults && Object.prototype.hasOwnProperty.call(refs.defaults, id)) {
        refs.defaults[id] = data.inputs[id];
      }
      const field = document.getElementById(id);
      if (field) field.value = data.inputs[id];
    });
  }
  if (refs && refs.products && data.products) {
    data.products.forEach(function (row) {
      const product = refs.products.find(function (item) { return item.id === row.id; });
      if (!product) return;
      product.fobUsd = row.fobUsd;
      if (row.ctnPriceUsd != null) product.ctnPriceUsd = row.ctnPriceUsd;
      if (row.asianComps) product.asianComps = row.asianComps;
      if (row.ausComps) product.ausComps = row.ausComps;
      product.marginOverride = row.marginPct == null ? null : Number(row.marginPct);
    });
  }
  tpgaInstallMarginStyle();
  if (refs && refs.presets) {
    if (refs.presets['20ft']) {
      refs.presets['20ft'].freightUsd = data.engine.freight20;
      refs.presets['20ft'].cartageAud = data.engine.cartage20;
      refs.presets['20ft'].localCharges = data.engine.localCharges20;
      refs.presets['20ft'].warehouse = data.engine.warehouse20;
    }
    if (refs.presets['40ft']) {
      refs.presets['40ft'].freightUsd = data.engine.freight40;
      refs.presets['40ft'].cartageAud = data.engine.cartage40;
      refs.presets['40ft'].localCharges = data.engine.localCharges40;
      refs.presets['40ft'].warehouse = data.engine.warehouse40;
    }
  }
  return data;
}

function tpgaSnapshot(page) {
  const inputs = {};
  document.querySelectorAll('input, select, textarea').forEach(function (field) {
    if (!field.id || field.id === 'password-input') return;
    inputs[field.id] = field.type === 'checkbox' ? field.checked : field.value;
  });
  const mainMargin = tpgaMainMargin();
  const products = (window.tpgaProducts || []).map(function (product) {
    const name = product.name && product.name.en ? product.name.en : product.name;
    const margin = tpgaEffectiveMargin(product);
    return {
      id: product.id,
      name: name || '',
      orderQty: product.orderQty || 0,
      fobUsd: product.fobUsd,
      marginPct: product.marginOverride == null ? null : product.marginOverride,
      effectiveMarginPct: margin.percent,
      marginSource: margin.override ? 'product' : 'main'
    };
  });
  const customer = {
    company: (document.getElementById('cust-company') || {}).value || '',
    contact: (document.getElementById('cust-contact') || {}).value || '',
    email: (document.getElementById('cust-email') || {}).value || '',
    phone: (document.getElementById('cust-phone') || {}).value || ''
  };
  const totals = {};
  ['banner-opex-total', 'kpi-annual-opex', 'master-profit-total-val', 'dash-card-profit'].forEach(function (id) {
    const node = document.getElementById(id);
    if (node) totals[id] = node.textContent.trim();
  });
  return {
    page: page,
    recordType: 'save',
    customer: customer,
    lineItems: products,
    totals: totals,
    formData: { inputs: inputs, mainMargin: mainMargin, products: products }
  };
}

async function tpgaSaveRecord(page, recordType) {
  const snapshot = tpgaSnapshot(page);
  snapshot.recordType = recordType;
  try {
    const response = await fetch('/api/records', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(snapshot)
    });
    if (!response.ok) {
      return { ok: false, message: 'HTTP ' + response.status };
    }
    const body = await response.json();
    return { ok: true, id: body.id };
  } catch (err) {
    return { ok: false, message: 'network' };
  }
}

async function tpgaSaveClick(page) {
  const saved = await tpgaSaveRecord(page, 'save');
  tpgaShowStatus(saved.ok ? 'Saved to Cloudflare.' : 'Could not save to Cloudflare (' + saved.message + ').', saved.ok);
}

async function tpgaLoadPdf() {
  if (window.jspdf && window.jspdf.jsPDF) return;
  await new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function tpgaSimpleQuotePdf() {
  await tpgaLoadPdf();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFontSize(14);
  doc.text('Two Parrots Group Australia', 14, 16);
  doc.setFontSize(10);
  doc.text('Market Research', 14, 23);
  let y = 32;
  (window.tpgaProducts || []).forEach(function (product) {
    const name = product.name && product.name.en ? product.name.en : String(product.name || product.id);
    const margin = tpgaEffectiveMargin(product);
    const line = product.id + '. ' + name + '   qty ' + (product.orderQty || 0) + '   margin ' + margin.percent + '%' + (margin.override ? ' override' : ' main') + '   FOB USD ' + Number(product.fobUsd).toFixed(4);
    doc.text(line.slice(0, 110), 14, y);
    y += 6;
    if (y > 280) {
      doc.addPage();
      y = 16;
    }
  });
  doc.save('TwoParrots_Market_Research.pdf');
}

async function tpgaExportPdf(page) {
  const saved = await tpgaSaveRecord(page, 'export_pdf');
  tpgaShowStatus(
    saved.ok ? 'Saved. Preparing the PDF.' : 'Could not save to Cloudflare (' + saved.message + '). The PDF will still download.',
    saved.ok
  );
  if (page === 'Q1') return tpgaSimpleQuotePdf();
  if (page === 'Q1-1' || page === 'qc1') return exportPurchaseOrderPDF();
  if (page === 'B1') return exportBudgetPDF();
}

window.tpgaNum = tpgaNum;
window.tpgaMainMargin = tpgaMainMargin;
window.tpgaEffectiveMargin = tpgaEffectiveMargin;
window.tpgaMarginInputHtml = tpgaMarginInputHtml;
window.tpgaSyncProductMargin = tpgaSyncProductMargin;
window.tpgaHydratePage = tpgaHydratePage;
window.tpgaSaveRecord = tpgaSaveRecord;
window.tpgaSaveClick = tpgaSaveClick;
window.tpgaExportPdf = tpgaExportPdf;
window.tpgaShowStatus = tpgaShowStatus;
