import json
import os
import sys
import urllib.request

# Shelf prices live in Cloudflare D1. This job only sends the live AUD/USD
# rate. It must not write price figures into the repository.
API_URL = os.environ.get("PRICE_UPDATE_URL", "https://twoparrotsgroup.com.au/api/prices/survey")


def fetch_live_aud_usd_rate():
    url = "https://open.er-api.com/v6/latest/AUD"
    req = urllib.request.Request(url, headers={"User-Agent": "TwoParrotsPriceSync"})
    with urllib.request.urlopen(req, timeout=20) as response:
        data = json.loads(response.read().decode("utf-8"))
    usd_rate = data.get("rates", {}).get("USD")
    if not isinstance(usd_rate, (int, float)) or usd_rate <= 0:
        raise RuntimeError("FX response did not include a USD rate")
    return round(float(usd_rate), 4)


def main():
    secret = os.environ.get("PRICE_UPDATE_SECRET", "")
    client_id = os.environ.get("CF_ACCESS_CLIENT_ID", "")
    client_secret = os.environ.get("CF_ACCESS_CLIENT_SECRET", "")
    missing = [
        name
        for name, value in (
            ("PRICE_UPDATE_SECRET", secret),
            ("CF_ACCESS_CLIENT_ID", client_id),
            ("CF_ACCESS_CLIENT_SECRET", client_secret),
        )
        if not value
    ]
    if missing:
        print("Missing environment values: " + ", ".join(missing), file=sys.stderr)
        sys.exit(1)
    rate = fetch_live_aud_usd_rate()
    payload = json.dumps({"fxAudUsd": rate}).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Price-Update-Secret": secret,
            "CF-Access-Client-Id": client_id,
            "CF-Access-Client-Secret": client_secret,
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read().decode("utf-8")
        print(f"Updated AUD/USD to {rate}: {body}")


if __name__ == "__main__":
    main()
