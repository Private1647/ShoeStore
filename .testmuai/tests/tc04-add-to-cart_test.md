---
mode: testing
max_steps: 30
timeout: 150
target: cdp
cdp_endpoint: http://localhost:9222
local_context: >-
  # SoleStyle — ShoeStore E-Commerce App


  ## Application URL

  - Base URL: http://localhost:5000

  - This is a React + Express full-stack shoe store


  ## Key Pages

  - Home: `/` — hero banner, product grid with filters, iframe promo widget

  - Product Detail: `/product/:id` — image gallery, size selector, add to cart,
  reviews

  - Search: `/search?q=query` — search results

  - Category: `/category/:category` — athletic, casual, dress, boots, sale

  - Gender: `/gender/:gender` — men, women

  - Checkout: `/checkout` — shipping + payment form

  - Order Confirmation: `/order/:id`

  - Contact: `/contact` — Shadow DOM contact form

  - About: `/about`

  - Info pages: `/size-guide`, `/returns`, `/shipping`, `/privacy`, `/terms`,
  `/cookies`


  ## Test Data

  - Test card number: `4242 4242 4242 4242` (payment succeeds)

  - Any other card number causes payment declined

  - 24 products across 4 categories: Athletic (6), Casual (8), Dress (5), Boots
  (5)

  - First product ID: `nike-air-max-pro` (price $129.99, on sale from $159.99)


  ## Special DOM Elements

  - Shadow DOM: Newsletter (footer), Star Rating (product detail), Payment
  Fields (checkout), Contact Form

  - Slots: Review cards (product detail), Cart item cards (cart slideout), Value
  cards (about page)

  - Dynamic Locators: Load More button (home), Place Order button (checkout) —
  IDs regenerate per click

  - Iframe: Promo banner widget on home page


  ## Cart Behavior

  - Session-based via `x-session-id` header (UUID in localStorage)

  - Size must be selected before adding to cart

  - Cart slideout opens on cart icon click
---

# Session: tc04-add-to-cart

## Step 1
Go to http://localhost:5000/product/nike-air-max-pro. Scroll down to see the product details including price and size options. Click on size 10 from the size selector buttons. Click the 'Add to Cart' button. Assert that a confirmation toast or notification appears. Assert that the cart icon in the header shows a count badge.
