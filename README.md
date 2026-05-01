# feriados.dev — Code Examples

Examples for using the [feriados.dev](https://feriados.dev) API — a REST API for Brazilian national, state, and municipal holidays.

**Base URL:** `https://api.feriados.dev`

## Authentication

All data endpoints require an API key in the `X-API-Key` header. To get one, create a free account:

```bash
curl -X POST https://api.feriados.dev/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "yourpassword"}'
```

The response includes your API key — **save it, it is only shown once**:

```json
{
  "status": "success",
  "message": "Store your API key safely — it will not be shown again.",
  "data": {
    "user": { "email": "you@example.com", "plan": "free" },
    "apiKey": { "prefix": "frd_abc...", "key": "frd_FULL_KEY_HERE" }
  }
}
```

Use the key in every request:

```
X-API-Key: frd_YOUR_KEY_HERE
```

## Endpoints

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/v1/auth/register` | — | Create account and get API key |
| `POST /api/v1/auth/login` | — | Login → JWT (for key management) |
| `GET /api/v1/auth/keys` | Bearer | List your API keys |
| `POST /api/v1/auth/keys` | Bearer | Create a new API key |
| `DELETE /api/v1/auth/keys/:id` | Bearer | Revoke an API key |
| `GET /api/v1/holidays` | X-API-Key | Search holidays with filters |
| `GET /api/v1/holidays/year/:year` | X-API-Key | All holidays for a year |
| `GET /api/v1/holidays/next` | X-API-Key | Next upcoming holidays for a location |
| `GET /api/v1/holidays/range` | X-API-Key | Holidays in a date range |
| `GET /api/v1/locations/search` | X-API-Key | Search for a city or state |
| `GET /api/v1/locations/states` | X-API-Key | List all Brazilian states |
| `GET /api/v1/locations/municipalities` | X-API-Key | List municipalities |

## Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `year` | Filter by year | `2026` |
| `city` | City code | `SP-sao-paulo` |
| `state` | State code | `SP` |
| `type` | Holiday type: `national`, `state`, `municipal`, `optional` | `national` |
| `startDate` | Start date (ISO 8601) | `2026-01-01` |
| `endDate` | End date (ISO 8601) | `2026-12-31` |

## Location Codes

City codes follow the pattern `{STATE_CODE}-{city-name-slug}`:

```
SP-sao-paulo
RJ-rio-de-janeiro
MG-belo-horizonte
PR-curitiba
PR-londrina
RS-porto-alegre
BA-salvador
```

Use `GET /api/v1/locations/search?q={name}` to find the code for any city.

## Examples

- [cURL](./curl/examples.sh)
- [JavaScript (fetch)](./javascript/fetch.js)
- [JavaScript (axios)](./javascript/axios.js)
- [Python](./python/example.py)
- [PHP](./php/example.php)
- [Go](./go/example.go)
- [Ruby](./ruby/example.rb)
- [Java](./java/Example.java)
- [C#](./csharp/Example.cs)
