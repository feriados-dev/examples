<?php
// feriados.dev API — PHP examples

define('BASE_URL', 'https://api.feriados.dev/api/v1');

function apiGet(string $path, array $params = []): array
{
    $url = BASE_URL . $path;
    if ($params) {
        $url .= '?' . http_build_query($params);
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status !== 200) {
        throw new RuntimeException("API error: HTTP $status for $url");
    }

    return json_decode($response, true);
}

// All national holidays in 2026
$national = apiGet('/holidays', ['year' => 2026, 'type' => 'national']);
echo "National holidays:\n";
print_r($national);

// All holidays for São Paulo city in 2026
$sp = apiGet('/holidays', ['city' => 'SP-sao-paulo', 'year' => 2026]);
echo "\nSão Paulo holidays:\n";
print_r($sp);

// All holidays for the state of Ceará in 2026
$ce = apiGet('/holidays', ['state' => 'CE', 'year' => 2026]);
echo "\nCeará holidays:\n";
print_r($ce);

// Next 5 upcoming holidays for Salvador
$next = apiGet('/holidays/next', ['location' => 'BA-salvador', 'limit' => 5]);
echo "\nNext holidays in Salvador:\n";
print_r($next);

// Search for a city
$search = apiGet('/locations/search', ['q' => 'recife']);
echo "\nSearch results for 'recife':\n";
print_r($search);
