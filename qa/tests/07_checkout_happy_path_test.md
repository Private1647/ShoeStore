---
mode: testing
max_steps: 40
variables:
  BASE_URL:
    value: "https://lt-shoe-store.replit.app"
---

# Checkout with valid shipping and test card reaches order confirmation

## Open the store and add a product
Open {{BASE_URL}}, open the first product, select an available size and add it to the cart.

## Proceed to checkout
Open the cart slideout and click the checkout button to open the checkout page.

## Fill shipping details
Fill the shipping form with: full name "QA Pipeline", email "qa@example.com", address "123 Test Street", city "Testville", postal code "12345", and any other required shipping fields with plausible values.

## Fill payment details
Fill the payment form with card number "4242 4242 4242 4242", a future expiry date such as "12/29", and CVC "123".

## Place the order
Submit the order.
Verify an order confirmation page is shown with an order summary that includes the purchased product.
