---
mode: testing
max_steps: 35
timeout: 150
---

# TC-04: Add to Cart Flow

## Navigate to product page
Go to http://localhost:5000/product/nike-air-max-pro.
Verify the product detail page loads with "Nike Air Max Pro" visible.

## Verify add to cart requires size selection
Assert that the Add to Cart button is disabled or shows a message indicating a size must be selected first.

## Select a size and add to cart
Click on size "10" from the size selector.
Click the "Add to Cart" button.
Assert that a confirmation message or toast notification appears indicating the item was added.

## Verify cart count updates
Assert that the cart icon in the header now shows a badge with count "1".

## Open cart slideout
Click on the shopping cart icon in the header.
Assert that a cart slideout panel opens.
Assert that "Nike Air Max Pro" appears in the cart with size "10" and quantity "1".

## Verify cart totals
Assert that the cart shows a subtotal amount.
Assert that shipping cost is displayed.
Assert that a total amount is displayed.

## Close cart
Click the X button or close button to close the cart slideout panel.
