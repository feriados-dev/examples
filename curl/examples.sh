#!/bin/bash
# feriados.dev API — cURL examples

BASE="https://api.feriados.dev/v1"

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

# Check whether a date is a holiday in Londrina
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/is?date=2026-12-10&location=PR-londrina"

# Compare holidays between Curitiba and Londrina
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/compare?locations=PR-curitiba,PR-londrina&year=2026"

# Full year calendar for 2026
curl -H "X-API-Key: $API_KEY" \
  "$BASE/holidays/year/2026"

# Public iCalendar feed for a location
curl "$BASE/holidays/ical?location=PR-londrina&year=2026"

# Count business days in a range
curl -H "X-API-Key: $API_KEY" \
  "$BASE/business-days?from=2026-12-01&to=2026-12-31&location=PR-londrina"

# Add 10 business days
curl -H "X-API-Key: $API_KEY" \
  "$BASE/business-days/add?date=2026-12-01&days=10&location=PR-londrina"

# Find the next business day
curl -H "X-API-Key: $API_KEY" \
  "$BASE/business-days/next?date=2026-12-10&location=PR-londrina"

# Check whether a date is a business day
curl -H "X-API-Key: $API_KEY" \
  "$BASE/business-days/is?date=2026-12-10&location=PR-londrina"

# Marketing dates require a paid plan
curl -H "X-API-Key: $API_KEY" \
  "$BASE/marketing-dates?year=2026&category=ecommerce"

curl -H "X-API-Key: $API_KEY" \
  "$BASE/marketing-dates/next?limit=5"

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

# Current-month usage and quota
curl -H "Authorization: Bearer $TOKEN" "$BASE/auth/usage/current-month"

# Create a new key
curl -X POST "$BASE/auth/keys" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Production"}'

# Revoke a key
curl -X DELETE "$BASE/auth/keys/KEY_UUID_HERE" \
  -H "Authorization: Bearer $TOKEN"

# ---------------------------------------------------------------------------
# Billing self-service (JWT)
# ---------------------------------------------------------------------------

# Create a Stripe checkout session
curl -X POST "$BASE/billing/checkout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "basic"}'

# Create a Stripe billing portal session
curl -X POST "$BASE/billing/portal" \
  -H "Authorization: Bearer $TOKEN"

# ---------------------------------------------------------------------------
# Premium webhooks (API key or JWT)
# ---------------------------------------------------------------------------

# Create a pre-holiday webhook. Save signingSecret from the response.
curl -X POST "$BASE/webhooks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/webhook", "daysBefore": 1, "locationCode": "PR-londrina"}'

# List webhooks
curl -H "Authorization: Bearer $TOKEN" "$BASE/webhooks"

# Delivery history
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/webhooks/deliveries?subscriptionId=WEBHOOK_UUID_HERE&page=1&limit=50"

# Deactivate a webhook
curl -X DELETE "$BASE/webhooks/WEBHOOK_UUID_HERE" \
  -H "Authorization: Bearer $TOKEN"

# ---------------------------------------------------------------------------
# Public metadata
# ---------------------------------------------------------------------------

curl "$BASE/data/status"
curl "$BASE/data/changelog"
curl "$BASE/changelog"
