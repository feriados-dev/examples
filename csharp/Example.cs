// feriados.dev API — C# examples
// Works with .NET 6+

using System.Net.Http.Json;
using System.Web;

const string apiKey = "frd_YOUR_KEY_HERE";

var client = new HttpClient { BaseAddress = new Uri("https://api.feriados.dev/v1/") };
client.DefaultRequestHeaders.Add("X-API-Key", apiKey);

// ---------------------------------------------------------------------------
// Registration (only needed once — save the returned key)
// ---------------------------------------------------------------------------
// var reg = await new HttpClient().PostAsJsonAsync(
//     "https://api.feriados.dev/v1/auth/register",
//     new { email = "you@example.com", password = "yourpassword" });
// var regData = await reg.Content.ReadFromJsonAsync<JsonElement>();
// var key = regData.GetProperty("data").GetProperty("apiKey").GetProperty("key").GetString();
// // Save key — it is shown only once.

// ---------------------------------------------------------------------------
// Data requests
// ---------------------------------------------------------------------------

// All national holidays in 2026
var national = await client.GetFromJsonAsync<object>("holidays?year=2026&type=national");
Console.WriteLine($"National holidays: {national}");

// All holidays for São Paulo city in 2026
var sp = await client.GetFromJsonAsync<object>("holidays?city=SP-sao-paulo&year=2026");
Console.WriteLine($"São Paulo holidays: {sp}");

// All holidays for the state of Minas Gerais in 2026
var mg = await client.GetFromJsonAsync<object>("holidays?state=MG&year=2026");
Console.WriteLine($"Minas Gerais holidays: {mg}");

// Next 5 upcoming holidays for Curitiba
var next = await client.GetFromJsonAsync<object>("holidays/next?location=PR-curitiba&limit=5");
Console.WriteLine($"Next holidays in Curitiba: {next}");

// Check whether a date is a holiday
var holidayCheck = await client.GetFromJsonAsync<object>("holidays/is?date=2026-12-10&location=PR-londrina");
Console.WriteLine($"Holiday check: {holidayCheck}");

// Count business days
var businessDays = await client.GetFromJsonAsync<object>("business-days?from=2026-12-01&to=2026-12-31&location=PR-londrina");
Console.WriteLine($"Business days: {businessDays}");

// Marketing dates require a paid plan
// var marketingDates = await client.GetFromJsonAsync<object>("marketing-dates?year=2026&category=ecommerce");
// Console.WriteLine($"Marketing dates: {marketingDates}");

// Holidays in June 2026
var june = await client.GetFromJsonAsync<object>("holidays/range?startDate=2026-06-01&endDate=2026-06-30");
Console.WriteLine($"June 2026 holidays: {june}");

// Search for a city
var query = HttpUtility.UrlEncode("belo horizonte");
var search = await client.GetFromJsonAsync<object>($"locations/search?q={query}");
Console.WriteLine($"Search results: {search}");
