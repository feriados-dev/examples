// feriados.dev API — JavaScript (fetch) examples

const BASE = "https://api.feriados.dev/v1";

// ---------------------------------------------------------------------------
// Authentication helpers
// ---------------------------------------------------------------------------

// Register and get your API key (only needed once — save the returned key)
async function register(email, password, name) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error(`Registration failed: ${res.status}`);
  const data = await res.json();
  // data.data.apiKey.key — shown only once, store it securely
  return data.data.apiKey.key;
}

// Login to get a JWT (used for key management, billing, and dashboard webhooks)
async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  return data.data.token;
}

// ---------------------------------------------------------------------------
// Data helpers — all require X-API-Key
// ---------------------------------------------------------------------------

const API_KEY = "frd_YOUR_KEY_HERE";

const headers = { "X-API-Key": API_KEY };

async function getNationalHolidays(year = 2026) {
  const res = await fetch(`${BASE}/holidays?year=${year}&type=national`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getCityHolidays(cityCode, year = 2026) {
  const res = await fetch(`${BASE}/holidays?city=${cityCode}&year=${year}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getStateHolidays(stateCode, year = 2026) {
  const res = await fetch(`${BASE}/holidays?state=${stateCode}&year=${year}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getNextHolidays(locationCode, limit = 5) {
  const res = await fetch(`${BASE}/holidays/next?location=${locationCode}&limit=${limit}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function isHoliday(date, locationCode) {
  const params = new URLSearchParams({ date, location: locationCode });
  const res = await fetch(`${BASE}/holidays/is?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function countBusinessDays(from, to, locationCode) {
  const params = new URLSearchParams({ from, to, location: locationCode });
  const res = await fetch(`${BASE}/business-days?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getMarketingDates(year = 2026, category = "ecommerce") {
  const params = new URLSearchParams({ year: String(year), category });
  const res = await fetch(`${BASE}/marketing-dates?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function searchLocation(query) {
  const res = await fetch(`${BASE}/locations/search?q=${encodeURIComponent(query)}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Account helpers — JWT
// ---------------------------------------------------------------------------

async function getCurrentMonthUsage(token) {
  const res = await fetch(`${BASE}/auth/usage/current-month`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function createCheckoutSession(token, plan = "basic") {
  const res = await fetch(`${BASE}/billing/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Premium webhooks — API key or JWT
// ---------------------------------------------------------------------------

async function createWebhook(token, { url, daysBefore, locationCode }) {
  const res = await fetch(`${BASE}/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, daysBefore, locationCode }),
  });
  if (!res.ok) throw new Error(`Webhook creation failed: ${res.status}`);
  const data = await res.json();
  // data.data.subscription.signingSecret is shown only once. Store it securely.
  return data;
}

async function listWebhooks(token) {
  const res = await fetch(`${BASE}/webhooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function listWebhookDeliveries(token, subscriptionId, page = 1, limit = 50) {
  const params = new URLSearchParams({ subscriptionId, page: String(page), limit: String(limit) });
  const res = await fetch(`${BASE}/webhooks/deliveries?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function deactivateWebhook(token, webhookId) {
  const res = await fetch(`${BASE}/webhooks/${webhookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Public metadata
// ---------------------------------------------------------------------------

async function getDataStatus() {
  const res = await fetch(`${BASE}/data/status`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function getProductChangelog() {
  const res = await fetch(`${BASE}/changelog`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

// Holidays for São Paulo city in 2026
getCityHolidays("SP-sao-paulo", 2026).then(data => {
  console.log("São Paulo holidays:", data);
});

// Next holidays for Londrina
getNextHolidays("PR-londrina", 3).then(data => {
  console.log("Next holidays in Londrina:", data);
});

// Check holiday and business-day status
isHoliday("2026-12-10", "PR-londrina").then(data => {
  console.log("Is holiday:", data);
});

countBusinessDays("2026-12-01", "2026-12-31", "PR-londrina").then(data => {
  console.log("Business days:", data);
});

// Paid-plan marketing dates
// getMarketingDates(2026, "ecommerce").then(data => {
//   console.log("Marketing dates:", data);
// });

// Find city code
searchLocation("belo horizonte").then(data => {
  console.log("Search results:", data);
});

// Dashboard webhook flow
// const token = await login("you@example.com", "yourpassword");
// const webhook = await createWebhook(token, {
//   url: "https://example.com/webhook",
//   daysBefore: 1,
//   locationCode: "PR-londrina",
// });
// console.log("Webhook created:", webhook);
