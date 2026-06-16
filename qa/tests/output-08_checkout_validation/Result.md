---
test: ../08_checkout_validation_test.md
status: passed
started: 2026-06-16T08:17:09.595Z
duration_s: 335
session_id: 7fc4c654-76b3-423f-b810-7e9a3114687b
---

# Checkout form rejects invalid payment and missing required fields — Result

## Open the store and reach checkout ✓ passed (83.7s)
md5: 5091ff4e2d11f1f90afb7a951771da41
Open {{BASE_URL}}, add the first product (with a size selected) to the cart, open the cart and proceed to checkout.

## Submit empty form ✓ passed (66.9s)
md5: 6648057394c29d476e2ee65ffe2b6b11
Submit the checkout form without filling any fields.
Verify validation errors are shown for the required fields and the order is NOT placed.

## Submit invalid card ✓ passed (178.1s)
md5: 575d99c6ffd261d4582d8a1cfd127d9a
Fill the shipping fields with plausible values, then enter card number "1111 1111 1111 1111" with expiry "12/29" and CVC "123" and submit.
Verify a payment validation error is shown and the user remains on the checkout page.
