---
mode: testing
max_steps: 30
timeout: 120
---

# TC-10: Informational Pages Load Correctly

## Visit About page
Go to http://localhost:5000/about.
Assert that the About page loads with company information visible.
Assert that the header and footer are present.

## Visit Size Guide page
Go to http://localhost:5000/size-guide.
Assert that the Size Guide page loads with size chart tables or content visible.

## Visit Returns page
Go to http://localhost:5000/returns.
Assert that the Returns page loads with return policy information visible.

## Visit Shipping page
Go to http://localhost:5000/shipping.
Assert that the Shipping page loads with shipping information visible.
