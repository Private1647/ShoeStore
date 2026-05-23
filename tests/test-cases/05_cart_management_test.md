---
mode: testing
max_steps: 40
timeout: 180
---

# TC-05: Cart Management — Quantity Update and Remove

## Add a product to cart
Go to http://localhost:5000/product/nike-air-max-pro.
Click on size "10" from the size selector.
Click the "Add to Cart" button.

## Open cart and verify item
Click on the shopping cart icon in the header.
Assert that the cart slideout opens and "Nike Air Max Pro" is listed.

## Increase quantity
Click the plus (+) button next to the quantity for the cart item.
Assert that the quantity updates to "2".

## Decrease quantity
Click the minus (-) button next to the quantity for the cart item.
Assert that the quantity goes back to "1".

## Remove item from cart
Click the trash/delete icon button for the cart item.
Assert that the cart shows "Your cart is empty" message.
Assert that the cart count badge in the header is no longer visible or shows 0.
