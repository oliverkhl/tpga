-- Empty schema only. Price figures are loaded from the seed file, which is not in git.

CREATE TABLE engine_settings (
  page TEXT NOT NULL,
  setting_key TEXT NOT NULL,
  amount REAL NOT NULL,
  PRIMARY KEY (page, setting_key)
);

CREATE TABLE input_defaults (
  page TEXT NOT NULL,
  input_id TEXT NOT NULL,
  amount REAL NOT NULL,
  PRIMARY KEY (page, input_id)
);

CREATE TABLE product_costs (
  page TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  fob_usd REAL,
  ctn_price_usd REAL,
  PRIMARY KEY (page, product_id)
);

CREATE TABLE competitor_prices (
  page TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('asian', 'aus')),
  sort_order INTEGER NOT NULL,
  brand TEXT NOT NULL,
  weight_g REAL NOT NULL,
  price_aud REAL NOT NULL,
  source TEXT,
  PRIMARY KEY (page, product_id, market, sort_order)
);

CREATE TABLE catalog_prices (
  product_id INTEGER PRIMARY KEY,
  amount_aud REAL NOT NULL,
  unit TEXT NOT NULL
);

CREATE TABLE saved_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('save', 'export_pdf')),
  customer_json TEXT,
  line_items_json TEXT,
  totals_json TEXT,
  form_data_json TEXT NOT NULL,
  saved_by TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_saved_records_page ON saved_records (page, id DESC);
