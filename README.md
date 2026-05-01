# feriados.dev — Code Examples

Examples for using the [feriados.dev](https://feriados.dev) API — a REST API for Brazilian national, state, and municipal holidays.

**Base URL:** `https://api.feriados.dev`

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/v1/holidays` | Search holidays with filters |
| `GET /api/v1/holidays/year/:year` | All holidays for a year |
| `GET /api/v1/holidays/next` | Next upcoming holidays for a location |
| `GET /api/v1/holidays/range` | Holidays in a date range |
| `GET /api/v1/locations/search` | Search for a city or state |
| `GET /api/v1/locations/states` | List all Brazilian states |
| `GET /api/v1/locations/municipalities` | List municipalities |

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
