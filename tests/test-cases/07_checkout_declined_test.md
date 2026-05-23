---
mode: testing
max_steps: 50
timeout: 240
---

# TC-07: Checkout Flow — Payment Declined

## Add item to cart
Go to http://localhost:5000/product/nike-air-max-pro.
Click on size "10" from the size selector.
Click the "Add to Cart" button.
Wait for the confirmation toast.

## Navigate to checkout
Click on the shopping cart icon in the header.
Click the "Proceed to Checkout" button.
Assert that the checkout page loads.

## Fill shipping information
Type "Jane Smith" into the Full Name field.
Type "jane@example.com" into the Email field.
Type "456 Oak Avenue" into the Address field.
Type "Los Angeles" into the City field.
Type "CA" into the State field.
Type "90001" into the ZIP Code field.

## Fill invalid payment information
Type "Jane Smith" into the Cardholder Name payment field.
Type "1111 2222 3333 4444" into the Card Number payment field.
Type "06/27" into the Expiry payment field.
Type "456" into the CVV payment field.

## Submit and verify declined
Click the "Place Order" button.
Assert that a payment declined error message is displayed on the page.
Assert that the user remains on the checkout page and is NOT redirected to an order confirmation.
