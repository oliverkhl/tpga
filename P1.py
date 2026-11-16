import json
import os
import re
import sys

def update_files(payload_json_str):
    try:
        data = json.loads(payload_json_str)
    except Exception as e:
        print(f"Error parsing JSON payload: {e}")
        sys.exit(1)

    # 1. Update P1.json
    with open("P1.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("Updated P1.json successfully.")

    # 2. Update default input values directly inside index.html
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            html_content = f.read()

        # Only write a figure when the dispatch payload includes it. This file stores no salaries.
        fields = {
            "input-md-salary": data.get("md_salary"),
            "input-ops-salary": data.get("ops_salary"),
            "input-sales-salary": data.get("sales_salary"),
            "input-wh-salary": data.get("wh_salary"),
            "input-super-rate": data.get("super_rate"),
        }
        for input_id, amount in fields.items():
            if amount is None:
                continue
            html_content = re.sub(
                rf'id="{input_id}"\s+value="[^"]*"',
                f'id="{input_id}" value="{amount}"',
                html_content,
            )

        with open("index.html", "w", encoding="utf-8") as f:
            f.write(html_content)
        print("Updated index.html default input values successfully.")

if __name__ == "__main__":
    # Expect payload passed as first argument or via environment variable
    payload = os.getenv("CLIENT_PAYLOAD", "{}")
    if len(sys.argv) > 1:
        payload = sys.argv[1]
    update_files(payload)