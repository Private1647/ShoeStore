---
mode: testing
max_steps: 50
timeout: 240
---

# TC-06: Checkout Flow — Successful Order

## Add item to cart
Go to http://localhost:5000/product/nike-air-max-pro.
Click on size "10" from the size selector.
Click the "Add to Cart" button.
Wait for the confirmation toast to appear.

## Navigate to checkout
Click on the shopping cart icon in the header.
Assert the cart slideout opens with the item.
Click the "Proceed to Checkout" button.
Assert that the checkout page loads with the heading "Checkout".

## Fill shipping information
Type "John Doe" into the Full Name field.
Type "john@example.com" into the Email field.
Type "123 Main Street" into the Address field.
Type "New York" into the City field.
Type "NY" into the State field.
Type "10001" into the ZIP Code field.

## Fill payment information
The payment fields are inside a Shadow DOM component.
Type "John Doe" into the Cardholder Name payment field.
Type "4242 4242 4242 4242" into the Card Number payment field.
Type "12/28" into the Expiry payment field.
Type "123" into the CVV payment field.

## Submit order
Click the "Place Order" button.
Assert that the page redirects to an order confirmation page.
Assert that a success message or order confirmation details are displayed showing the order was placed successfully.
