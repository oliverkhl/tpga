const RECORD_PAGES = new Set(['Q1', 'Q1-1', 'qc1', 'B1']);
const PRICE_PAGES = new Set(['Q1', 'Q1-1', 'qc1', 'B1', 'catalog']);
const QUOTE_PAGES = ['Q1', 'Q1-1', 'qc1'];
const MAX_BODY = 500000;

const keyCache = { host: '', expires: 0, keys: new Map() };

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function log(fields) {
  console.log(JSON.stringify(fields));
}

function accessHost(teamDomain) {
  const trimmed = String(teamDomain).trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (trimmed.includes('.')) return trimmed;
  return trimmed + '.cloudflareaccess.com';
}

function bytesFromBase64Url(value) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function secretsMatch(provided, expected) {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}

// Cloudflare adds a cf-ray header to every request that reaches a deployed
// Worker, and it replaces any value a client sends. Local `wrangler dev`
// does not add cf-ray (it does set cf-connecting-ip to 127.0.0.1 and rewrites
// the host to the route zone). No variable can remove cf-ray in production.
function isLocalDev(request) {
  return !request.headers.get('cf-ray');
}

async function accessKey(host, kid) {
  if (keyCache.host !== host || keyCache.expires < Date.now()) {
    const response = await fetch('https://' + host + '/cdn-cgi/access/certs');
    if (!response.ok) return null;
    const body = await response.json();
    const keys = new Map();
    for (const jwk of body.keys || []) {
      const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );
      keys.set(jwk.kid, key);
    }
    keyCache.host = host;
    keyCache.expires = Date.now() + 60 * 60 * 1000;
    keyCache.keys = keys;
  }
  return keyCache.keys.get(kid) || null;
}

async function verifyAccessJwt(token, env) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const header = JSON.parse(new TextDecoder().decode(bytesFromBase64Url(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(bytesFromBase64Url(parts[1])));
  if (header.alg !== 'RS256' || !header.kid) return null;
  const host = accessHost(env.TEAM_DOMAIN);
  if (payload.iss !== 'https://' + host) return null;
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.POLICY_AUD)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null;
  const key = await accessKey(host, header.kid);
  if (!key) return null;
  const signed = new TextEncoder().encode(parts[0] + '.' + parts[1]);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, bytesFromBase64Url(parts[2]), signed);
  return ok ? payload : null;
}

async function authorizeStaff(request, env) {
  if (isLocalDev(request)) {
    return { ok: true, email: 'local-dev@localhost' };
  }
  if (!env.TEAM_DOMAIN || !env.POLICY_AUD) {
    return { ok: false, status: 503, error: 'access_not_configured' };
  }
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return { ok: false, status: 401, error: 'unauthorized' };
  try {
    const payload = await verifyAccessJwt(token, env);
    if (!payload) return { ok: false, status: 401, error: 'unauthorized' };
    const email = payload.email || (payload.identity && payload.identity.email) || payload.sub || '';
    return { ok: true, email: String(email).slice(0, 320) };
  } catch (err) {
    log({ level: 'warn', msg: 'access_jwt_rejected' });
    return { ok: false, status: 401, error: 'unauthorized' };
  }
}

async function authorizePriceUpdate(request, env) {
  if (!env.PRICE_UPDATE_SECRET) {
    return { ok: false, status: 503, error: 'price_update_not_configured' };
  }
  const provided = request.headers.get('X-Price-Update-Secret') || '';
  const secretOk = await secretsMatch(provided, env.PRICE_UPDATE_SECRET);
  if (!secretOk) return { ok: false, status: 401, error: 'unauthorized' };
  // /api/* is behind Access. The GitHub Action sends a service token, Access
  // checks it, and the Worker still requires the JWT Access adds. Local
  // wrangler has no Access in front, so the shared secret is enough there.
  if (isLocalDev(request)) return { ok: true };
  return authorizeStaff(request, env);
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) {
    const error = new Error('body_too_large');
    error.status = 413;
    throw error;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    const error = new Error('invalid_json');
    error.status = 400;
    throw error;
  }
}

async function loadPrices(db, page) {
  if (page === 'catalog') {
    const rows = await db.prepare('SELECT product_id, amount_aud, unit FROM catalog_prices ORDER BY product_id').all();
    return { page, catalog: rows.results };
  }
  const engineRows = await db.prepare('SELECT setting_key, amount FROM engine_settings WHERE page = ?').bind(page).all();
  const engine = {};
  for (const row of engineRows.results) engine[row.setting_key] = row.amount;
  const inputRows = await db.prepare('SELECT input_id, amount FROM input_defaults WHERE page = ?').bind(page).all();
  const inputs = {};
  for (const row of inputRows.results) inputs[row.input_id] = row.amount;
  const costRows = await db.prepare(
    'SELECT product_id, fob_usd, ctn_price_usd FROM product_costs WHERE page = ? ORDER BY product_id'
  ).bind(page).all();
  const compRows = await db.prepare(
    'SELECT product_id, market, brand, weight_g, price_aud, source FROM competitor_prices WHERE page = ? ORDER BY product_id, market, sort_order'
  ).bind(page).all();
  const grouped = new Map();
  for (const row of compRows.results) {
    if (!grouped.has(row.product_id)) grouped.set(row.product_id, { asian: [], aus: [] });
    const bucket = row.market === 'aus' ? 'aus' : 'asian';
    grouped.get(row.product_id)[bucket].push({
      brand: row.brand,
      weightG: row.weight_g,
      priceAud: row.price_aud,
      source: row.source || ''
    });
  }
  const products = costRows.results.map((row) => {
    const comps = grouped.get(row.product_id) || { asian: [], aus: [] };
    return {
      id: row.product_id,
      fobUsd: row.fob_usd,
      ctnPriceUsd: row.ctn_price_usd,
      asianComps: comps.asian,
      ausComps: comps.aus
    };
  });
  return { page, engine, inputs, products };
}

function compRows(entry) {
  const lists = [
    ['asian', entry.asianComps || []],
    ['aus', entry.ausComps || []]
  ];
  const rows = [];
  for (const [market, list] of lists) {
    if (!Array.isArray(list) || list.length > 30) {
      const error = new Error('invalid_competitors');
      error.status = 400;
      throw error;
    }
    list.forEach((row, index) => {
      const brand = row && typeof row.brand === 'string' ? row.brand.trim() : '';
      const weight = Number(row && row.weightG);
      const price = Number(row && row.priceAud);
      if (!brand || brand.length > 200 || !Number.isFinite(weight) || weight <= 0 || weight > 100000 || !Number.isFinite(price) || price < 0 || price > 1000000) {
        const error = new Error('invalid_competitors');
        error.status = 400;
        throw error;
      }
      rows.push({
        market,
        index,
        brand,
        weight,
        price,
        source: String((row && row.source) || '').slice(0, 300)
      });
    });
  }
  return rows;
}

async function applySurvey(db, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('invalid_body');
    error.status = 400;
    throw error;
  }
  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'fxAudUsd' && key !== 'competitors') || keys.length === 0) {
    const error = new Error('invalid_body');
    error.status = 400;
    throw error;
  }
  const statements = [];
  if (body.fxAudUsd != null) {
    const fx = Number(body.fxAudUsd);
    if (!Number.isFinite(fx) || fx <= 0 || fx > 100) {
      const error = new Error('invalid_fx');
      error.status = 400;
      throw error;
    }
    for (const page of ['survey', 'Q1', 'Q1-1', 'qc1', 'B1']) {
      statements.push(
        db.prepare(
          'INSERT INTO engine_settings (page, setting_key, amount) VALUES (?, ?, ?) ON CONFLICT(page, setting_key) DO UPDATE SET amount = excluded.amount'
        ).bind(page, page === 'survey' ? 'fxAudUsd' : 'fxFallback', fx)
      );
    }
    for (const page of ['Q1', 'Q1-1', 'qc1']) {
      statements.push(
        db.prepare(
          'INSERT INTO input_defaults (page, input_id, amount) VALUES (?, ?, ?) ON CONFLICT(page, input_id) DO UPDATE SET amount = excluded.amount'
        ).bind(page, 'input-fx', fx)
      );
    }
    statements.push(
      db.prepare(
        'INSERT INTO input_defaults (page, input_id, amount) VALUES (?, ?, ?) ON CONFLICT(page, input_id) DO UPDATE SET amount = excluded.amount'
      ).bind('B1', 'aud-usd-rate-input', fx)
    );
  }
  if (body.competitors != null) {
    if (typeof body.competitors !== 'object' || Array.isArray(body.competitors)) {
      const error = new Error('invalid_competitors');
      error.status = 400;
      throw error;
    }
    const entries = Object.entries(body.competitors);
    if (entries.length > 60) {
      const error = new Error('invalid_competitors');
      error.status = 400;
      throw error;
    }
    for (const [id, entry] of entries) {
      const productId = Number(id);
      if (!Number.isInteger(productId) || productId < 1 || productId > 500 || !entry || typeof entry !== 'object') {
        const error = new Error('invalid_competitors');
        error.status = 400;
        throw error;
      }
      const rows = compRows(entry);
      for (const page of ['survey', ...QUOTE_PAGES]) {
        statements.push(db.prepare('DELETE FROM competitor_prices WHERE page = ? AND product_id = ?').bind(page, productId));
        for (const row of rows) {
          statements.push(
            db.prepare(
              'INSERT INTO competitor_prices (page, product_id, market, sort_order, brand, weight_g, price_aud, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(page, productId, row.market, row.index, row.brand, row.weight, row.price, row.source)
          );
        }
      }
    }
  }
  if (!statements.length) {
    const error = new Error('invalid_body');
    error.status = 400;
    throw error;
  }
  await db.batch(statements);
  return { updated: true };
}

function asObject(value, name) {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) {
    const error = new Error('invalid_' + name);
    error.status = 400;
    throw error;
  }
  return value;
}

async function saveRecord(db, body, savedBy) {
  const page = body && body.page;
  const recordType = body && body.recordType;
  if (!RECORD_PAGES.has(page) || (recordType !== 'save' && recordType !== 'export_pdf')) {
    const error = new Error('invalid_record');
    error.status = 400;
    throw error;
  }
  const customer = asObject(body.customer, 'customer');
  const totals = asObject(body.totals, 'totals');
  const formData = asObject(body.formData, 'form');
  if (!formData) {
    const error = new Error('invalid_form');
    error.status = 400;
    throw error;
  }
  if (body.lineItems != null && !Array.isArray(body.lineItems)) {
    const error = new Error('invalid_lines');
    error.status = 400;
    throw error;
  }
  const stored = {
    customer: customer ? JSON.stringify(customer) : null,
    lines: body.lineItems ? JSON.stringify(body.lineItems) : null,
    totals: totals ? JSON.stringify(totals) : null,
    form: JSON.stringify(formData)
  };
  if (Object.values(stored).some((part) => part && part.length > MAX_BODY)) {
    const error = new Error('body_too_large');
    error.status = 413;
    throw error;
  }
  const createdAt = new Date().toISOString();
  const result = await db.prepare(
    'INSERT INTO saved_records (page, record_type, customer_json, line_items_json, totals_json, form_data_json, saved_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(page, recordType, stored.customer, stored.lines, stored.totals, stored.form, savedBy || null, createdAt).run();
  return { id: result.meta.last_row_id, createdAt };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      return json(404, { error: 'not_found' });
    }
    try {
      if (url.pathname === '/api/prices/survey' && request.method === 'POST') {
        const auth = await authorizePriceUpdate(request, env);
        if (!auth.ok) return json(auth.status, { error: auth.error });
        const body = await readJson(request);
        const result = await applySurvey(env.DB, body);
        log({ level: 'info', route: 'prices.survey', status: 200 });
        return json(200, result);
      }

      const auth = await authorizeStaff(request, env);
      if (!auth.ok) {
        log({ level: 'info', route: url.pathname, status: auth.status });
        return json(auth.status, { error: auth.error });
      }

      if (url.pathname === '/api/prices' && request.method === 'GET') {
        const page = url.searchParams.get('page') || '';
        if (!PRICE_PAGES.has(page)) return json(400, { error: 'invalid_page' });
        return json(200, await loadPrices(env.DB, page));
      }

      if (url.pathname === '/api/records' && request.method === 'POST') {
        const body = await readJson(request);
        const saved = await saveRecord(env.DB, body, auth.email);
        log({ level: 'info', route: 'records.create', page: body.page, id: saved.id });
        return json(201, saved);
      }

      if (url.pathname === '/api/records' && request.method === 'GET') {
        const page = url.searchParams.get('page') || '';
        if (!RECORD_PAGES.has(page)) return json(400, { error: 'invalid_page' });
        const rows = await env.DB.prepare(
          'SELECT id, page, record_type, customer_json, totals_json, saved_by, created_at FROM saved_records WHERE page = ? ORDER BY id DESC LIMIT 50'
        ).bind(page).all();
        return json(200, { records: rows.results });
      }

      const recordMatch = url.pathname.match(/^\/api\/records\/(\d+)$/);
      if (recordMatch && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM saved_records WHERE id = ?').bind(Number(recordMatch[1])).first();
        if (!row) return json(404, { error: 'not_found' });
        return json(200, { record: row });
      }

      return json(404, { error: 'not_found' });
    } catch (err) {
      const status = err.status || 500;
      log({ level: 'error', route: url.pathname, status, msg: err.message || 'error' });
      return json(status, { error: status === 500 ? 'server_error' : err.message });
    }
  }
};
