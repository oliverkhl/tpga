import json
import urllib.request
from datetime import datetime, timezone

JSON_FILE = "prices.json"

def fetch_live_aud_usd_rate():
    """
    Fetches the live AUD/USD exchange rate from a public financial API.
    Falls back to a standard baseline if network or API issues occur.
    """
    url = "https://open.er-api.com/v6/latest/AUD"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            usd_rate = data.get("rates", {}).get("USD")
            if usd_rate:
                print(f"[FX Sync Success] 1 AUD = {usd_rate:.4f} USD")
                return round(usd_rate, 4)
    except Exception as e:
        print(f"[FX Sync Warning] Failed to fetch live FX rate: {e}. Falling back to default.")
    
    return 0.6500

# Verified market survey benchmarks for key products
PRODUCT_BENCHMARKS = {
    "1": {
        "name": "Rice Flour 500g",
        "asianComps": [
            {"brand": "Erawan Rice Flour", "weightG": 500, "priceAud": 1.60, "source": "Src: KFL Asian Grocery Springvale"},
            {"brand": "Cock Brand Rice Flour", "weightG": 500, "priceAud": 1.65, "source": "Src: Minh Phat Market Richmond"},
            {"brand": "Anil Fine Rice Flour", "weightG": 500, "priceAud": 1.80, "source": "Src: DesiKart Indian Grocery"},
            {"brand": "Harischandra Rice Flour", "weightG": 500, "priceAud": 1.90, "source": "Src: Lankan Groceries Melbourne"},
            {"brand": "Maneely Rice Flour", "weightG": 1000, "priceAud": 3.20, "source": "Src: Nepsay Nepalese Mart"}
        ],
        "ausComps": [
            {"brand": "McKenzie's Rice Flour", "weightG": 375, "priceAud": 1.70, "source": "Src: Woolworths AU"},
            {"brand": "Anchor Rice Flour", "weightG": 500, "priceAud": 2.20, "source": "Src: Woolworths Supermarkets VIC"},
            {"brand": "Has No Wheat Rice Flour", "weightG": 500, "priceAud": 1.80, "source": "Src: ALDI Australia"},
            {"brand": "Kirkland White Rice Flour Bulk", "weightG": 2000, "priceAud": 6.99, "source": "Src: Costco Wholesale AU"}
        ]
    },
    "4": {
        "name": "Pancake Mix 500g",
        "asianComps": [
            {"brand": "Bot Banh Xeo Pancake Mix", "weightG": 500, "priceAud": 2.80, "source": "Src: KFL Asian Grocery Springvale"},
            {"brand": "Vinh Thuan Pancake Mix", "weightG": 500, "priceAud": 2.90, "source": "Src: Minh Phat Market Richmond"},
            {"brand": "Gits Dosa Pancake Mix", "weightG": 500, "priceAud": 3.10, "source": "Src: India Gate Supermarket"}
        ],
        "ausComps": [
            {"brand": "Green's Original Pancake Shake", "weightG": 375, "priceAud": 2.40, "source": "Src: Woolworths Supermarkets VIC"},
            {"brand": "White Wings Pancake Shake", "weightG": 325, "priceAud": 2.50, "source": "Src: Coles Online AU"},
            {"brand": "Krusteaz Pancake Mix Bulk", "weightG": 2000, "priceAud": 9.99, "source": "Src: Costco Wholesale AU"}
        ]
    },
    "8": {
        "name": "Whole Black Peppercorn 100g",
        "asianComps": [
            {"brand": "Thai Whole Black Peppercorn", "weightG": 100, "priceAud": 4.80, "source": "Src: KFL Asian Grocery Springvale"},
            {"brand": "Cock Brand Whole Pepper", "weightG": 100, "priceAud": 4.60, "source": "Src: Minh Phat Market Richmond"},
            {"brand": "MD Black Peppercorns", "weightG": 100, "priceAud": 5.10, "source": "Src: Lankan Groceries Melbourne"},
            {"brand": "Deep Whole Black Pepper", "weightG": 100, "priceAud": 4.50, "source": "Src: India Gate Supermarket"}
        ],
        "ausComps": [
            {"brand": "Hoyts Whole Black Peppercorn", "weightG": 100, "priceAud": 4.90, "source": "Src: Woolworths Supermarkets VIC"},
            {"brand": "MasterFoods Black Peppercorn", "weightG": 100, "priceAud": 5.50, "source": "Src: Coles Online AU"},
            {"brand": "Stonemill Whole Peppercorns", "weightG": 100, "priceAud": 3.80, "source": "Src: ALDI Australia"},
            {"brand": "Kirkland Signature Black Peppercorn", "weightG": 357, "priceAud": 14.50, "source": "Src: Costco Wholesale AU"}
        ]
    },
    "9": {
        "name": "Ground Black Pepper 80g",
        "asianComps": [
            {"brand": "Cock Brand Ground Black Pepper", "weightG": 80, "priceAud": 2.80, "source": "Src: KFL Asian Grocery Springvale"},
            {"brand": "Thai Pure Black Pepper", "weightG": 80, "priceAud": 2.65, "source": "Src: Minh Phat Market Richmond"}
        ],
        "ausComps": [
            {"brand": "Saxa Black Pepper Ground", "weightG": 50, "priceAud": 2.90, "source": "Src: Coles Online AU"},
            {"brand": "McCormick Ground Black Pepper", "weightG": 50, "priceAud": 3.10, "source": "Src: Woolworths Supermarkets VIC"},
            {"brand": "Kirkland Fine Ground Pepper", "weightG": 348, "priceAud": 13.50, "source": "Src: Costco Wholesale AU"}
        ]
    },
    "10": {
        "name": "Cracked Black Pepper 80g",
        "asianComps": [
            {"brand": "MasterFoods Cracked Pepper", "weightG": 50, "priceAud": 3.20, "source": "Src: KFL Asian Grocery Springvale"},
            {"brand": "Cock Brand Cracked Pepper", "weightG": 80, "priceAud": 2.85, "source": "Src: Minh Phat Market Richmond"}
        ],
        "ausComps": [
            {"brand": "McCormick Cracked Black Pepper", "weightG": 40, "priceAud": 3.10, "source": "Src: Woolworths Supermarkets VIC"},
            {"brand": "Hoyts Cracked Black Pepper", "weightG": 50, "priceAud": 2.95, "source": "Src: Coles Online AU"},
            {"brand": "Kirkland Coarse Ground Pepper", "weightG": 359, "priceAud": 10.50, "source": "Src: Costco Wholesale AU"}
        ]
    }
}

def surveyed_benchmarks():
    """Return only products with a real price survey.

    Invented rows ("Product Item #N", "Asian Import Brand #N") were being
    copied over the quote tool's surveyed prices. Products without a survey
    keep the prices already stored in the quote scripts.
    """
    return {key: PRODUCT_BENCHMARKS[key] for key in sorted(PRODUCT_BENCHMARKS, key=int)}

def main():
    aud_usd_rate = fetch_live_aud_usd_rate()
    competitors_data = surveyed_benchmarks()

    payload = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "exchangeRates": {
            "base": "AUD",
            "rates": {
                "USD": aud_usd_rate
            }
        },
        "totalProductsSynced": len(competitors_data),
        "competitors": competitors_data
    }

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Successfully generated {JSON_FILE} with {len(competitors_data)} surveyed products and AUD/USD = {aud_usd_rate}")

if __name__ == "__main__":
    main()
