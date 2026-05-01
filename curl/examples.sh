#!/bin/bash
# feriados.dev API — cURL examples

BASE="https://api.feriados.dev/api/v1"

# ---------------------------------------------------------------------------
# 1. Register and get your API key (only needed once)
# ---------------------------------------------------------------------------
curl -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "yourpassword"}'
# The response includes your key — save it, it is shown only once.

# ---------------------------------------------------------------------------
# 2. Set your key and use the API
# ---------------------------------------------------------------------------
API_KEY="frd_YOUR_KEY_HERE"

# All national holidays in 2026
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays?year=2026&type=national"

# All holidays for São Paulo (city) in 2026
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays?city=SP-sao-paulo&year=2026"

# All holidays for the state of Paraná in 2026
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays?state=PR&year=2026"

# Next 5 upcoming holidays for Londrina
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/next?location=PR-londrina&limit=5"

# All holidays in a date range
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/range?startDate=2026-06-01&endDate=2026-06-30"

# Full year calendar for 2026
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/year/2026"

# Search for a city by name to find its code
curl -H "X-API-Key: $API_KEY" \
  "$BASE/locations/search?q=londrina"

# List all Brazilian states
curl -H "X-API-Key: $API_KEY" \
  "$BASE/locations/states"

# List all municipalities in São Paulo state
curl -H "X-API-Key: $API_KEY" \
  "$BASE/locations/municipalities?state=SP"

# ---------------------------------------------------------------------------
# Key management (requires login to get a Bearer token)
# ---------------------------------------------------------------------------

# Login
TOKEN=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "yourpassword"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# List your API keys
curl -H "Authorization: Bearer $TOKEN" "$BASE/auth/keys"

# Create a new key
curl -X POST "$BASE/auth/keys" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Production"}'

# Revoke a key
curl -X DELETE "$BASE/auth/keys/KEY_UUID_HERE" \
  -H "Authorization: Bearer $TOKEN"
