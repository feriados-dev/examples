# feriados.dev API — Ruby examples

require "net/http"
require "uri"
require "json"

BASE   = "https://api.feriados.dev/v1"
API_KEY = "frd_YOUR_KEY_HERE"

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def api_get(path, params = {})
  uri = URI("#{BASE}#{path}")
  uri.query = URI.encode_www_form(params) unless params.empty?

  req = Net::HTTP::Get.new(uri)
  req["X-API-Key"] = API_KEY

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
  raise "API error: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

  JSON.parse(response.body)
end

# Registration (only needed once — save the returned key)
# def register(email, password)
#   uri = URI("#{BASE}/auth/register")
#   req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
#   req.body = { email: email, password: password }.to_json
#   response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
#   JSON.parse(response.body).dig("data", "apiKey", "key") # save — shown only once
# end

# ---------------------------------------------------------------------------
# Data requests
# ---------------------------------------------------------------------------

# All national holidays in 2026
national = api_get("/holidays", year: 2026, type: "national")
puts "National holidays: #{national}"

# All holidays for Belo Horizonte in 2026
bh = api_get("/holidays", city: "MG-belo-horizonte", year: 2026)
puts "\nBelo Horizonte holidays: #{bh}"

# All holidays for the state of Pernambuco in 2026
pe = api_get("/holidays", state: "PE", year: 2026)
puts "\nPernambuco holidays: #{pe}"

# Next 5 upcoming holidays for Recife
next_holidays = api_get("/holidays/next", location: "PE-recife", limit: 5)
puts "\nNext holidays in Recife: #{next_holidays}"

# Check whether a date is a holiday
holiday_check = api_get("/holidays/is", date: "2026-12-10", location: "PR-londrina")
puts "\nHoliday check: #{holiday_check}"

# Count business days
business_days = api_get("/business-days", from: "2026-12-01", to: "2026-12-31", location: "PR-londrina")
puts "\nBusiness days: #{business_days}"

# Marketing dates require a paid plan
# marketing_dates = api_get("/marketing-dates", year: 2026, category: "ecommerce")
# puts "\nMarketing dates: #{marketing_dates}"

# Search for a city
results = api_get("/locations/search", q: "brasilia")
puts "\nSearch results: #{results}"
