---
mode: testing
max_steps: 30
timeout: 120
---

# TC-03: Product Detail Page

## Navigate to a product
Go to http://localhost:5000/product/nike-air-max-pro.
Verify the product detail page loads.

## Verify product info
Assert that the product name "Nike Air Max Pro" is visible.
Assert that the brand "Nike" is displayed.
Assert that the price "$129.99" is visible.
Assert that an original price "$159.99" is shown (indicating a sale item).

## Verify size selector
Assert that size selection buttons are visible on the page.
Assert that multiple size options are available (e.g., sizes 7 through 14).

## Verify product image
Assert that a product image is displayed on the page.

## Verify add to cart button
Assert that an "Add to Cart" button is present on the page.

## Verify reviews section
Scroll down and assert that a customer reviews section is visible with review cards.
