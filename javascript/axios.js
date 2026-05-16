// feriados.dev API — JavaScript (axios) examples
// npm install axios

import axios from "axios";

const API_KEY = "frd_YOUR_KEY_HERE";

// ---------------------------------------------------------------------------
// Authenticated client for data endpoints
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: "https://api.feriados.dev/v1",
  headers: { "X-API-Key": API_KEY },
});

// ---------------------------------------------------------------------------
// Registration (only needed once — save the returned key)
// ---------------------------------------------------------------------------
async function register(email, password, name) {
  const { data } = await axios.post("https://api.feriados.dev/v1/auth/register", {
    email,
    password,
    name,
  });
  // data.data.apiKey.key — shown only once, store it securely
  return data.data.apiKey.key;
}

async function login(email, password) {
  const { data } = await axios.post("https://api.feriados.dev/v1/auth/login", {
    email,
    password,
  });
  return data.data.token;
}

// ---------------------------------------------------------------------------
// Data requests
// ---------------------------------------------------------------------------

// All national holidays in 2026
const { data: national } = await api.get("/holidays", {
  params: { year: 2026, type: "national" },
});
console.log("National holidays:", national);

// All holidays for São Paulo (city) in 2026
const { data: spHolidays } = await api.get("/holidays", {
  params: { city: "SP-sao-paulo", year: 2026 },
});
console.log("São Paulo holidays:", spHolidays);

// All holidays for the state of Minas Gerais in 2026
const { data: mgHolidays } = await api.get("/holidays", {
  params: { state: "MG", year: 2026 },
});
console.log("Minas Gerais holidays:", mgHolidays);

// Next 5 upcoming holidays for Curitiba
const { data: next } = await api.get("/holidays/next", {
  params: { location: "PR-curitiba", limit: 5 },
});
console.log("Next holidays in Curitiba:", next);

// Holidays in a date range
const { data: range } = await api.get("/holidays/range", {
  params: { startDate: "2026-06-01", endDate: "2026-06-30" },
});
console.log("June 2026 holidays:", range);

// Check if a date is a holiday
const { data: holidayCheck } = await api.get("/holidays/is", {
  params: { date: "2026-12-10", location: "PR-londrina" },
});
console.log("Holiday check:", holidayCheck);

// Count business days
const { data: businessDays } = await api.get("/business-days", {
  params: { from: "2026-12-01", to: "2026-12-31", location: "PR-londrina" },
});
console.log("Business days:", businessDays);

// Marketing dates require a paid plan
// const { data: marketingDates } = await api.get("/marketing-dates", {
//   params: { year: 2026, category: "ecommerce" },
// });
// console.log("Marketing dates:", marketingDates);

// Search for a city
const { data: search } = await api.get("/locations/search", {
  params: { q: "porto alegre" },
});
console.log("Search results:", search);

// Public metadata
const { data: dataStatus } = await axios.get("https://api.feriados.dev/v1/data/status");
console.log("Data status:", dataStatus);

// ---------------------------------------------------------------------------
// Premium webhooks — API key or JWT
// ---------------------------------------------------------------------------

// const token = await login("you@example.com", "yourpassword");
// const dashboard = axios.create({
//   baseURL: "https://api.feriados.dev/v1",
//   headers: { Authorization: `Bearer ${token}` },
// });
//
// const { data: createdWebhook } = await dashboard.post("/webhooks", {
//   url: "https://example.com/webhook",
//   daysBefore: 1,
//   locationCode: "PR-londrina",
// });
// console.log("Save signingSecret now:", createdWebhook.data.subscription.signingSecret);
//
// const { data: webhooks } = await dashboard.get("/webhooks");
// console.log("Webhooks:", webhooks);
//
// const { data: deliveries } = await dashboard.get("/webhooks/deliveries", {
//   params: { subscriptionId: "WEBHOOK_UUID_HERE", page: 1, limit: 50 },
// });
// console.log("Webhook deliveries:", deliveries);
