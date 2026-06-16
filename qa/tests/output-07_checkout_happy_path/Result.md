---
test: ../07_checkout_happy_path_test.md
status: passed
started: 2026-06-16T08:11:06.676Z
duration_s: 354
session_id: 4b6a38a7-15aa-4a03-bf88-bd5d47b8461c
---

# Checkout with valid shipping and test card reaches order confirmation — Result

## Open the store and add a product ✓ passed (71.7s)
md5: 8f5b34d5ecfc9937197f0f0457114c60
Open {{BASE_URL}}, open the first product, select an available size and add it to the cart.

## Proceed to checkout ✓ passed (55.9s)
md5: 12f281e64503710a2b1aecf935a13640
Open the cart slideout and click the checkout button to open the checkout page.

## Fill shipping details ✓ passed (94.9s)
md5: 1dae7cb026b7b790d4896678de9a1191
Fill the shipping form with: full name "QA Pipeline", email "qa@example.com", address "123 Test Street", city "Testville", postal code "12345", and any other required shipping fields with plausible values.

## Fill payment details ✓ passed (50.8s)
md5: 59711602ea3621cfe6b97b04bde5138c
Fill the payment form with card number "4242 4242 4242 4242", a future expiry date such as "12/29", and CVC "123".

## Place the order ✓ passed (70s)
md5: 3e64e91a690df4e18a2392055687972a
Submit the order.
Verify an order confirmation page is shown with an order summary that includes the purchased product.
