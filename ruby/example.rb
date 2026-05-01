# feriados.dev API — Ruby examples
# gem install httparty (optional, also works with net/http)

require "net/http"
require "uri"
require "json"

BASE = "https://api.feriados.dev/api/v1"

def api_get(path, params = {})
  uri = URI("#{BASE}#{path}")
  uri.query = URI.encode_www_form(params) unless params.empty?

  response = Net::HTTP.get_response(uri)
  raise "API error: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

  JSON.parse(response.body)
end

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

# Search for a city
results = api_get("/locations/search", q: "brasilia")
puts "\nSearch results: #{results}"
