# feriados.dev — Code Examples

Examples for using the [feriados.dev](https://feriados.dev) API — a REST API for Brazilian national, state, and municipal holidays.

**Base URL:** `https://api.feriados.dev`

## Authentication

Most API endpoints require an API key in the `X-API-Key` header. To get one, create a free account:

```bash
curl -X POST https://api.feriados.dev/v1/auth/register \
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

Some dashboard and account-management endpoints use a JWT returned by login:

```bash
curl -X POST https://api.feriados.dev/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "yourpassword"}'
```

Use the token as:

```
Authorization: Bearer YOUR_JWT_HERE
```

## Endpoints

| Endpoint | Auth | Description |
|---|---|---|
| `POST /v1/auth/register` | — | Create account and get API key |
| `POST /v1/auth/login` | — | Login and get a JWT |
| `GET /v1/auth/me` | Bearer | Current account |
| `GET /v1/auth/keys` | Bearer | List your API keys |
| `POST /v1/auth/keys` | Bearer | Create a new API key |
| `DELETE /v1/auth/keys/:id` | Bearer | Revoke an API key |
| `GET /v1/auth/usage` | X-API-Key or Bearer | Account usage for a date range |
| `GET /v1/auth/usage/current-month` | X-API-Key or Bearer | Current-month usage and quota |
| `POST /v1/billing/checkout` | Bearer | Create a Stripe checkout session |
| `POST /v1/billing/portal` | Bearer | Create a Stripe billing portal session |
| `GET /v1/holidays` | X-API-Key | Search holidays with filters |
| `GET /v1/holidays/year/:year` | X-API-Key | All holidays for a year |
| `GET /v1/holidays/next` | X-API-Key | Next upcoming holidays for a location |
| `GET /v1/holidays/range` | X-API-Key | Holidays in a date range |
| `GET /v1/holidays/is` | X-API-Key | Check if a date is a holiday |
| `GET /v1/holidays/compare` | X-API-Key | Compare holidays between locations |
| `GET /v1/holidays/ical` | Public | iCalendar feed |
| `GET /v1/business-days` | X-API-Key | Count business days in a date range |
| `GET /v1/business-days/add` | X-API-Key | Add or subtract business days |
| `GET /v1/business-days/next` | X-API-Key | Find the next business day |
| `GET /v1/business-days/is` | X-API-Key | Check if a date is a business day |
| `GET /v1/marketing-dates` | X-API-Key, paid plan | Marketing and ecommerce dates |
| `GET /v1/marketing-dates/next` | X-API-Key, paid plan | Next marketing dates |
| `GET /v1/webhooks` | X-API-Key or Bearer, paid plan | List pre-holiday webhooks |
| `POST /v1/webhooks` | X-API-Key or Bearer, paid plan | Create a pre-holiday webhook |
| `DELETE /v1/webhooks/:id` | X-API-Key or Bearer, paid plan | Deactivate a webhook |
| `GET /v1/webhooks/deliveries` | X-API-Key or Bearer, paid plan | Webhook delivery history |
| `GET /v1/locations/search` | X-API-Key | Search for a city or state |
| `GET /v1/locations/states` | X-API-Key | List all Brazilian states |
| `GET /v1/locations/municipalities` | X-API-Key | List municipalities |
| `GET /v1/data/status` | Public | Data coverage and freshness |
| `GET /v1/data/changelog` | Public | Official data change history |
| `GET /v1/changelog` | Public | Product changelog |
| `GET /widget.js` | Public | Embeddable holiday calendar widget |

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

Use `GET /v1/locations/search?q={name}` to find the code for any city. Webhook creation accepts codes case-insensitively, but responses use the canonical code stored by the API, for example `PR-londrina`.

## Premium Webhooks

Paid plans can receive `POST` notifications before upcoming holidays. Webhooks can be managed with either an API key or a dashboard JWT.

Create a webhook:

```bash
curl -X POST https://api.feriados.dev/v1/webhooks \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhook",
    "daysBefore": 1,
    "locationCode": "PR-londrina"
  }'
```

The creation response includes a `signingSecret`. Save it immediately; it is only returned once.

Webhook event payload:

```json
{
  "event": "holiday.upcoming",
  "webhookId": "subscription-uuid",
  "deliveryId": "delivery-uuid",
  "daysBefore": 1,
  "locationCode": "PR-londrina",
  "scheduledFor": "2026-12-09T00:00:00.000Z",
  "holiday": {
    "id": "holiday-uuid",
    "name": "Aniversário de Londrina",
    "date": "2026-12-10",
    "year": 2026,
    "type": "municipal",
    "description": "Fundação de Londrina"
  }
}
```

Every delivery includes these headers:

```http
X-Feriados-Webhook-Id: subscription-uuid
X-Feriados-Delivery-Id: delivery-uuid
X-Feriados-Timestamp: 1796774400
X-Feriados-Signature: sha256=<hmac>
```

The signature is HMAC-SHA256 over `<timestamp>.<raw_json_body>` using the `signingSecret`.

## MCP

feriados.dev also provides an MCP server for agents and MCP-compatible clients.

Local stdio server:

```bash
npx -y @feriados-dev/mcp-server
```

The local MCP server uses the same API key:

```bash
FERIADOS_API_KEY=frd_YOUR_KEY_HERE
```

Remote MCP endpoint:

```text
https://mcp.feriados.dev/
```

For a programmatic JavaScript client example, see [JavaScript MCP client](./javascript/mcp-client.js).

## Examples

- [cURL](./curl/examples.sh)
- [JavaScript (fetch)](./javascript/fetch.js)
- [JavaScript (axios)](./javascript/axios.js)
- [JavaScript MCP client](./javascript/mcp-client.js)
- [JavaScript webhook receiver](./javascript/webhook-receiver.js)
- [Python](./python/example.py)
- [Python webhook receiver](./python/webhook_receiver.py)
- [PHP](./php/example.php)
- [Go](./go/example.go)
- [Ruby](./ruby/example.rb)
- [Java](./java/Example.java)
- [C#](./csharp/Example.cs)
