// feriados.dev API — JavaScript (fetch) examples

const BASE = "https://api.feriados.dev/api/v1";

// All national holidays in 2026
async function getNationalHolidays(year = 2026) {
  const res = await fetch(`${BASE}/holidays?year=${year}&type=national`);
  const data = await res.json();
  return data;
}

// All holidays for a city in a given year
async function getCityHolidays(cityCode, year = 2026) {
  const res = await fetch(`${BASE}/holidays?city=${cityCode}&year=${year}`);
  const data = await res.json();
  return data;
}

// All holidays for a state in a given year
async function getStateHolidays(stateCode, year = 2026) {
  const res = await fetch(`${BASE}/holidays?state=${stateCode}&year=${year}`);
  const data = await res.json();
  return data;
}

// Next upcoming holidays for a location
async function getNextHolidays(locationCode, limit = 5) {
  const res = await fetch(`${BASE}/holidays/next?location=${locationCode}&limit=${limit}`);
  const data = await res.json();
  return data;
}

// Search for a city to find its code
async function searchLocation(query) {
  const res = await fetch(`${BASE}/locations/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data;
}

// --- Usage ---

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
