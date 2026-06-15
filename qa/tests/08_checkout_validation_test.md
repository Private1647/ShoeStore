---
mode: testing
max_steps: 35
variables:
  BASE_URL:
    value: "https://lt-shoe-store.replit.app"
---

# Checkout form rejects invalid payment and missing required fields

## Open the store and reach checkout
Open {{BASE_URL}}, add the first product (with a size selected) to the cart, open the cart and proceed to checkout.

## Submit empty form
Submit the checkout form without filling any fields.
Verify validation errors are shown for the required fields and the order is NOT placed.

## Submit invalid card
Fill the shipping fields with plausible values, then enter card number "1111 1111 1111 1111" with expiry "12/29" and CVC "123" and submit.
Verify a payment validation error is shown and the user remains on the checkout page.
