---
mode: testing
max_steps: 25
timeout: 120
---

# TC-08: Category Navigation and Filtering

## Navigate to Athletic category
Go to http://localhost:5000/category/athletic.
Assert that the page loads and displays athletic shoes.
Assert that product cards are visible.

## Navigate to Sale category
Click the "Sale" link in the header navigation.
Assert that the page shows sale items.
Assert that products displayed have discounted prices (showing both original and sale price).

## Navigate to Casual category
Go to http://localhost:5000/category/casual.
Assert that casual category products are displayed.
Assert that product cards are visible with product names and prices.
