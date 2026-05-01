#!/bin/bash
# feriados.dev API — cURL examples

BASE="https://api.feriados.dev/api/v1"

# All national holidays in 2026
curl "$BASE/holidays?year=2026&type=national"

# All holidays for São Paulo (city) in 2026
curl "$BASE/holidays?city=SP-sao-paulo&year=2026"

# All holidays for the state of Paraná in 2026
curl "$BASE/holidays?state=PR&year=2026"

# Next 5 upcoming holidays for Londrina
curl "$BASE/holidays/next?location=PR-londrina&limit=5"

# All holidays in a date range
curl "$BASE/holidays/range?startDate=2026-06-01&endDate=2026-06-30"

# Full year calendar for 2026
curl "$BASE/holidays/year/2026"

# Search for a city by name to find its code
curl "$BASE/locations/search?q=londrina"

# List all Brazilian states
curl "$BASE/locations/states"

# List all municipalities in São Paulo state
curl "$BASE/locations/municipalities?state=SP"
