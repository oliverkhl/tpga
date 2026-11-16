-- Optional per-product margin. NULL means the row uses the page's main margin input.
ALTER TABLE product_costs ADD COLUMN margin_pct REAL;
