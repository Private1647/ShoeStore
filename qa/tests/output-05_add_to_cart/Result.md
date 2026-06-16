---
test: ../05_add_to_cart_test.md
status: passed
started: 2026-06-16T08:01:03.942Z
duration_s: 232
session_id: 4645c051-3621-46d5-94f8-fb0de9940850
---

# Add to cart updates cart count and slideout contents — Result

## Open the store ✓ passed (6.4s)
md5: f14b5ca7eff36a78a3d35a7d7deda355
Open {{BASE_URL}}.

## Add a product to the cart ✓ passed (89.1s)
md5: ec2e4341de6b640149a084b86767e161
Open the first product in the grid, select an available size, and click "Add to Cart".

## Verify cart badge ✓ passed (71.2s)
md5: 5e15cc90120811e51d5597255227808e
Verify the cart icon in the header shows a count of 1.

## Verify cart slideout ✓ passed (56.6s)
md5: 8a7e6fd30e21aeffb2c4e0a82c93881a
Open the cart (slideout panel) and verify it contains the product that was just added, with the correct name and price.
