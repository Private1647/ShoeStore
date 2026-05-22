---
mode: testing
max_steps: 25
timeout: 120
---

# TC-02: Product Search Functionality

## Open homepage
Go to http://localhost:5000.
Verify the page loads and the SoleStyle logo/text is visible.

## Search for Nike
Type "Nike" into the search input field in the header and press Enter.
Assert that search results are displayed.
Assert that the page shows results containing "Nike" in the product names.

## Verify search results count
Assert that the results text shows the number of results found for "Nike".

## Search for non-existent product
Clear the search field, type "xyznonexistent" into the search input and press Enter.
Assert that a "No results found" message is displayed.
