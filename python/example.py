# feriados.dev API — Python examples
# pip install requests

import requests

BASE = "https://api.feriados.dev/api/v1"


def get_national_holidays(year: int = 2026) -> dict:
    """Get all national holidays for a year."""
    r = requests.get(f"{BASE}/holidays", params={"year": year, "type": "national"})
    r.raise_for_status()
    return r.json()


def get_city_holidays(city_code: str, year: int = 2026) -> dict:
    """Get all holidays for a city in a given year."""
    r = requests.get(f"{BASE}/holidays", params={"city": city_code, "year": year})
    r.raise_for_status()
    return r.json()


def get_state_holidays(state_code: str, year: int = 2026) -> dict:
    """Get all holidays for a state in a given year."""
    r = requests.get(f"{BASE}/holidays", params={"state": state_code, "year": year})
    r.raise_for_status()
    return r.json()


def get_next_holidays(location_code: str, limit: int = 5) -> dict:
    """Get next upcoming holidays for a location."""
    r = requests.get(f"{BASE}/holidays/next", params={"location": location_code, "limit": limit})
    r.raise_for_status()
    return r.json()


def search_location(query: str) -> dict:
    """Search for a city or state to find its code."""
    r = requests.get(f"{BASE}/locations/search", params={"q": query})
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

    # Search for a city
    results = search_location("florianopolis")
    print("Search results:", results)
