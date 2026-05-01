// feriados.dev API — Java examples
// Requires Java 11+ (uses java.net.http)

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

public class Example {

    private static final String BASE   = "https://api.feriados.dev/v1";
    private static final String API_KEY = "frd_YOUR_KEY_HERE";
    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    // -----------------------------------------------------------------------
    // HTTP helpers
    // -----------------------------------------------------------------------

    public static String apiGet(String path, Map<String, String> params) throws Exception {
        String query = params.entrySet().stream()
                .map(e -> URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8)
                        + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        String url = BASE + path + (query.isEmpty() ? "" : "?" + query);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Accept", "application/json")
                .header("X-API-Key", API_KEY)
                .GET()
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("API error: HTTP " + response.statusCode());
        }

        return response.body();
    }

    // -----------------------------------------------------------------------
    // Usage
    // -----------------------------------------------------------------------

    public static void main(String[] args) throws Exception {
        // All national holidays in 2026
        String national = apiGet("/holidays", Map.of("year", "2026", "type", "national"));
        System.out.println("National holidays: " + national);

        // All holidays for São Paulo city in 2026
        String sp = apiGet("/holidays", Map.of("city", "SP-sao-paulo", "year", "2026"));
        System.out.println("São Paulo holidays: " + sp);

        // All holidays for the state of Rio de Janeiro
        String rj = apiGet("/holidays", Map.of("state", "RJ", "year", "2026"));
        System.out.println("Rio de Janeiro state holidays: " + rj);

        // Next 5 upcoming holidays for Manaus
        String next = apiGet("/holidays/next", Map.of("location", "AM-manaus", "limit", "5"));
        System.out.println("Next holidays in Manaus: " + next);

        // Search for a city
        String search = apiGet("/locations/search", Map.of("q", "salvador"));
        System.out.println("Search results: " + search);
    }
}
