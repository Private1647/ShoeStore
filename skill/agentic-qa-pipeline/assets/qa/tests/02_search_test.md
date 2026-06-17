---
mode: testing
max_steps: 25
variables:
  BASE_URL:
    value: "https://lt-shoe-store.replit.app"
---

# Product search returns relevant results

## Open the store
Open {{BASE_URL}}.

## Search for running shoes
Type "running" into the search bar in the header and submit the search.

## Verify results
Verify at least one product result is shown and the results relate to running shoes.

## Search with no matches
Search for "xyzzynonexistent" and verify the page shows an empty state or "no results" message instead of crashing.
