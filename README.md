# Two Parrots Group Australia

The public site is static HTML. Internal quote and budget pages load their prices from a Cloudflare Worker (`two-parrots-db`) backed by the D1 database `tpga-internal`. Staff save a quote or export a PDF through the same API.

## Cloudflare Access

Access application **TPGA internal pages** locks the internal tools. Staff sign in with a one-time email PIN (`kimheng@` and `info@twoparrotsgroup.com.au`). The old password typed into the page is gone.

Paths already on that application:

- `/Q1.html` and `/Q1`
- `/Q1-1.html` and `/Q1-1`
- `/qc1.html` and `/qc1`
- `/B1.html` and `/B1`
- `/api/*`

Add these as well. The quote pages load them, and they are not covered by the paths above:

- `/staff-store.js`
- `/script-Q1.js`
- `/script-Q2.js`
- `/script-Q3.js`
- `/script-b3.js`
- `/styles-Q1.css`

No other HTML page or API path was added. `POST /api/prices/survey` is already inside `/api/*`.

After someone passes Access, Cloudflare sends `Cf-Access-Jwt-Assertion`. The Worker checks the signature against the team certificates, and checks the audience against `POLICY_AUD`. The email on the token is stored as `saved_by`.

### Worker variables and secrets

`TEAM_DOMAIN` and `POLICY_AUD` are plain vars in `wrangler.jsonc` (not secrets):

- `TEAM_DOMAIN` = `https://holy-limit-fa1d.cloudflareaccess.com`
- `POLICY_AUD` = `e14558467b6fe9598d2a8ac660e8468eff3e8c4facf2f1e3cc17e3769c175c68`

| Name | Kind | Where it is set | Purpose |
| --- | --- | --- | --- |
| `PRICE_UPDATE_SECRET` | Worker secret | `npx wrangler secret put PRICE_UPDATE_SECRET` | Shared secret checked only on `POST /api/prices/survey`. |
| `PRICE_UPDATE_SECRET` | GitHub Actions secret | Repository secret, same name. | Sent as `X-Price-Update-Secret`. |
| `CF_ACCESS_CLIENT_ID` | GitHub Actions secret | Repository secret, this exact name. | Access service token id. Sent as `CF-Access-Client-Id`. |
| `CF_ACCESS_CLIENT_SECRET` | GitHub Actions secret | Repository secret, this exact name. | Access service token secret. Sent as `CF-Access-Client-Secret`. |

Create the service token in Zero Trust and allow it on **TPGA internal pages** (same audience as `POLICY_AUD`). Access checks the token at the edge and adds the JWT. The Worker then checks that JWT and the shared secret. The service token headers alone do not open the other API routes. A staff PIN login does not open the price-update route unless it also has the shared secret.

Do not put `PRICE_UPDATE_SECRET`, `CF_ACCESS_CLIENT_ID`, or `CF_ACCESS_CLIENT_SECRET` in `wrangler.jsonc`.

### Database

D1 database `tpga-internal`, id `1f207914-0258-4ffd-b5e2-405ea7e9a0b2`, binding `DB`.

Migrations in `migrations/` create empty tables. The current price figures are in `/opt/cursor/artifacts/tpga-price-seed.sql` from the maintenance run that moved them out of git. Apply that file yourself:

```bash
npx wrangler d1 execute tpga-internal --remote --file=/opt/cursor/artifacts/tpga-price-seed.sql
```

Those figures also remain in git history from before this change.

### Local check

`wrangler dev` serves the HTML and `/api/*` together. A request with no `cf-ray` header may read prices and save records without an Access token. Cloudflare adds that header to every deployed request and replaces any copy a client sends, so the bypass cannot be switched on in production. Locally, `POST /api/prices/survey` still needs `PRICE_UPDATE_SECRET` in `.dev.vars` (git ignores that file). The service-token headers are only required once the call goes through Access on the public hostname.
