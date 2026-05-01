// feriados.dev API — Go examples
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const (
	baseURL = "https://api.feriados.dev/v1"
	apiKey  = "frd_YOUR_KEY_HERE"
)

var httpClient = &http.Client{}

func apiGet(path string, params map[string]string) (map[string]any, error) {
	u, err := url.Parse(baseURL + path)
	if err != nil {
		return nil, err
	}

	q := u.Query()
	for k, v := range params {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()

	req, err := http.NewRequest(http.MethodGet, u.String(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-API-Key", apiKey)

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: HTTP %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]any
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return result, nil
}

func main() {
	// All national holidays in 2026
	national, err := apiGet("/holidays", map[string]string{
		"year": "2026",
		"type": "national",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("National holidays:", national)

	// All holidays for Curitiba in 2026
	curitiba, err := apiGet("/holidays", map[string]string{
		"city": "PR-curitiba",
		"year": "2026",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Curitiba holidays:", curitiba)

	// All holidays for the state of Rio Grande do Sul
	rs, err := apiGet("/holidays", map[string]string{
		"state": "RS",
		"year":  "2026",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Rio Grande do Sul holidays:", rs)

	// Next 5 upcoming holidays for Porto Alegre
	next, err := apiGet("/holidays/next", map[string]string{
		"location": "RS-porto-alegre",
		"limit":    "5",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Next holidays in Porto Alegre:", next)

	// Search for a city
	search, err := apiGet("/locations/search", map[string]string{
		"q": "fortaleza",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Search results:", search)
}
