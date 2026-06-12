---
mode: testing
max_steps: 30
variables:
  BASE_URL:
    value: "https://lt-shoe-store.replit.app"
---

# Add to cart updates cart count and slideout contents

## Open the store
Open {{BASE_URL}}.

## Add a product to the cart
Open the first product in the grid, select an available size, and click "Add to Cart".

## Verify cart badge
Verify the cart icon in the header shows a count of 1.

## Verify cart slideout
Open the cart (slideout panel) and verify it contains the product that was just added, with the correct name and price.
