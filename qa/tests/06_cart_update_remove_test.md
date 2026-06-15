---
mode: testing
max_steps: 35
variables:
  BASE_URL:
    value: "https://lt-shoe-store.replit.app"
---

# Cart quantity update and item removal recalculate totals

## Open the store and add a product
Open {{BASE_URL}}, open the first product, select an available size and add it to the cart.

## Increase quantity
Open the cart slideout and increase the quantity of the item to 2.
Verify the line total and cart subtotal double accordingly.

## Decrease quantity
Decrease the quantity back to 1 and verify the subtotal is recalculated.

## Remove the item
Remove the item from the cart and verify the cart shows an empty state and the header cart count is 0 or hidden.
