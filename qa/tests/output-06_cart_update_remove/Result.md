---
test: ../06_cart_update_remove_test.md
status: passed
started: 2026-06-16T08:05:04.407Z
duration_s: 353
session_id: 5e97789e-9f8d-45c0-85c5-80a2e4107c64
---

# Cart quantity update and item removal recalculate totals — Result

## Open the store and add a product ✓ passed (91.2s)
md5: 8f5b34d5ecfc9937197f0f0457114c60
Open {{BASE_URL}}, open the first product, select an available size and add it to the cart.

## Increase quantity ✓ passed (70.5s)
md5: 1a10a4229b4039b67a2f6085d4bd9294
Open the cart slideout and increase the quantity of the item to 2.
Verify the line total and cart subtotal double accordingly.

## Decrease quantity ✓ passed (86s)
md5: f9d572a9c5a217a6558ac3d5653dd946
Decrease the quantity back to 1 and verify the subtotal is recalculated.

## Remove the item ✓ passed (97.4s)
md5: 975ae5d951918e5a4378ff88f2748db0
Remove the item from the cart and verify the cart shows an empty state and the header cart count is 0 or hidden.
