# feriados.dev API — Python examples
# pip install requests

import requests

BASE = "https://api.feriados.dev/v1"
API_KEY = "frd_YOUR_KEY_HERE"

HEADERS = {"X-API-Key": API_KEY}


# ---------------------------------------------------------------------------
# Registration (only needed once — save the returned key)
# ---------------------------------------------------------------------------

def register(email: str, password: str, name: str = "") -> str:
    """Create an account and return the API key. Save it — shown only once."""
    r = requests.post(f"{BASE}/auth/register", json={"email": email, "password": password, "name": name})
    r.raise_for_status()
    return r.json()["data"]["apiKey"]["key"]


def login(email: str, password: str) -> str:
    """Login and return a JWT for dashboard/account endpoints."""
    r = requests.post(f"{BASE}/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    return r.json()["data"]["token"]


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

def get_national_holidays(year: int = 2026) -> dict:
    """Get all national holidays for a year."""
    r = requests.get(f"{BASE}/holidays", headers=HEADERS, params={"year": year, "type": "national"})
    r.raise_for_status()
    return r.json()


def get_city_holidays(city_code: str, year: int = 2026) -> dict:
    """Get all holidays for a city in a given year."""
    r = requests.get(f"{BASE}/holidays", headers=HEADERS, params={"city": city_code, "year": year})
    r.raise_for_status()
    return r.json()


def get_state_holidays(state_code: str, year: int = 2026) -> dict:
    """Get all holidays for a state in a given year."""
    r = requests.get(f"{BASE}/holidays", headers=HEADERS, params={"state": state_code, "year": year})
    r.raise_for_status()
    return r.json()


def get_next_holidays(location_code: str, limit: int = 5) -> dict:
    """Get next upcoming holidays for a location."""
    r = requests.get(f"{BASE}/holidays/next", headers=HEADERS, params={"location": location_code, "limit": limit})
    r.raise_for_status()
    return r.json()


def is_holiday(date: str, location_code: str) -> dict:
    """Check whether a date is a holiday for a location."""
    r = requests.get(f"{BASE}/holidays/is", headers=HEADERS, params={"date": date, "location": location_code})
    r.raise_for_status()
    return r.json()


def count_business_days(from_date: str, to_date: str, location_code: str) -> dict:
    """Count business days between two dates."""
    r = requests.get(
        f"{BASE}/business-days",
        headers=HEADERS,
        params={"from": from_date, "to": to_date, "location": location_code},
    )
    r.raise_for_status()
    return r.json()


def get_marketing_dates(year: int = 2026, category: str = "ecommerce") -> dict:
    """Get marketing and ecommerce dates. Requires a paid plan."""
    r = requests.get(f"{BASE}/marketing-dates", headers=HEADERS, params={"year": year, "category": category})
    r.raise_for_status()
    return r.json()


def search_location(query: str) -> dict:
    """Search for a city or state to find its code."""
    r = requests.get(f"{BASE}/locations/search", headers=HEADERS, params={"q": query})
    r.raise_for_status()
    return r.json()


def create_webhook(token: str, url: str, days_before: int, location_code: str) -> dict:
    """Create a pre-holiday webhook. Requires a paid plan."""
    r = requests.post(
        f"{BASE}/webhooks",
        headers={"Authorization": f"Bearer {token}"},
        json={"url": url, "daysBefore": days_before, "locationCode": location_code},
    )
    r.raise_for_status()
    # Response includes signingSecret only once. Store it securely.
    return r.json()


def list_webhooks(token: str) -> dict:
    r = requests.get(f"{BASE}/webhooks", headers={"Authorization": f"Bearer {token}"})
    r.raise_for_status()
    return r.json()


def get_webhook_deliveries(token: str, subscription_id: str, page: int = 1, limit: int = 50) -> dict:
    r = requests.get(
        f"{BASE}/webhooks/deliveries",
        headers={"Authorization": f"Bearer {token}"},
        params={"subscriptionId": subscription_id, "page": page, "limit": limit},
    )
    r.raise_for_status()
    return r.json()


def data_status() -> dict:
    r = requests.get(f"{BASE}/data/status")
    r.raise_for_status()
    return r.json()


if __name__ == "__main__":
    # National holidays in 2026
    national = get_national_holidays(2026)
    print("National holidays:", national)

    # All holidays for Rio de Janeiro city
    rj = get_city_holidays("RJ-rio-de-janeiro", 2026)
    print("Rio de Janeiro holidays:", rj)

    # All holidays for the state of Bahia
    ba = get_state_holidays("BA", 2026)
    print("Bahia holidays:", ba)

    # Next 3 holidays for Manaus
    next_holidays = get_next_holidays("AM-manaus", 3)
    print("Next holidays in Manaus:", next_holidays)

    # Holiday and business-day checks
    print("Holiday check:", is_holiday("2026-12-10", "PR-londrina"))
    print("Business days:", count_business_days("2026-12-01", "2026-12-31", "PR-londrina"))

    # Paid-plan marketing dates
    # print("Marketing dates:", get_marketing_dates(2026, "ecommerce"))

    # Search for a city
    results = search_location("florianopolis")
    print("Search results:", results)

    # Dashboard webhook flow
    # token = login("you@example.com", "yourpassword")
    # webhook = create_webhook(token, "https://example.com/webhook", 1, "PR-londrina")
    # print("Save signing secret:", webhook["data"]["subscription"]["signingSecret"])
