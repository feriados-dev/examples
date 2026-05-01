// feriados.dev API — JavaScript (fetch) examples

const BASE = "https://api.feriados.dev/api/v1";

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

// Login to get a JWT (used for key management, not for data requests)
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

async function searchLocation(query) {
  const res = await fetch(`${BASE}/locations/search?q=${encodeURIComponent(query)}`, { headers });
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

// Find city code
searchLocation("belo horizonte").then(data => {
  console.log("Search results:", data);
});
