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

// Search for a city
const { data: search } = await api.get("/locations/search", {
  params: { q: "porto alegre" },
});
console.log("Search results:", search);
