# Add to Cart — Product Context & Acceptance Criteria

## 1. Overview

The **Add to Cart** action is the core conversion moment of the SoleStyle storefront. It lets a guest shopper move a chosen shoe — in a specific size and quantity — into their cart so they can later check out. The cart should feel reliable, immediate, and forgiving: shoppers should always trust that what they added is actually there.

## 2. Personas

| Persona | Goal |
|---|---|
| **Guest shopper** | Browse shoes, pick a size, add to cart, and check out without creating an account. |
| **Returning visitor (same browser)** | Come back later and still see the items they previously added. |
| **Gift buyer** | Add multiple pairs (sometimes the same shoe in different sizes) in a single visit. |

## 3. User stories

- As a shopper, I want to pick a size before adding a shoe so I don't accidentally order the wrong fit.
- As a shopper, I want to choose how many pairs to add so I don't have to repeat the action.
- As a shopper, I want immediate visual confirmation when an item is added so I know it worked.
- As a shopper, I want adding the same shoe and same size again to **increase the quantity** of that item, not create a duplicate.
- As a shopper, I want different sizes of the same shoe to be tracked separately so I can manage them independently.
- As a returning visitor, I want my cart contents to still be there after a refresh.

## 4. Entry points

- **Product detail page** — the primary place to add an item.
- **Quick-view product modal** — opened from a product card in the grid.

## 5. Business rules

- A size must be chosen before the shopper can add a shoe to the cart.
- Quantity defaults to one and must be at least one.
- The same shoe in the same size should appear as a single line in the cart, with its quantity reflecting how many pairs the shopper has added in total.
- The same shoe in a different size should appear as a separate cart line.
- The cart count shown in the header reflects the **total number of pairs** in the cart, not the number of distinct lines.
- The cart belongs to the shopper's current browser session and should survive a page refresh.
- If something goes wrong, the shopper should be told clearly — the action must never silently appear to succeed when it didn't.

## 6. Acceptance Criteria

### AC-1 — Size required
- **Given** a shopper is on a product page and has not picked a size,
- **When** they look at the Add to Cart action,
- **Then** it is unavailable and nothing happens if they try to use it.

### AC-2 — Single add succeeds
- **Given** a shopper has picked a size and left the quantity at one,
- **When** they add the item to the cart,
- **Then** the header cart count increases by one,
- **And** they see a confirmation,
- **And** the item appears in the cart with the chosen size and quantity one.

### AC-3 — Quantity selector respected
- **Given** a shopper sets the quantity to three and picks a size,
- **When** they add the item,
- **Then** the cart shows that item with quantity three,
- **And** the header count increases by three.

### AC-4 — Clicking Add to Cart twice for the same size merges
- **Given** a shopper is on a product page and has picked size 9 with quantity one,
- **When** they click **Add to Cart** once, and then click **Add to Cart** a second time without changing the size or quantity,
- **Then** the cart still shows **one line** for that shoe in size 9,
- **And** that line's quantity is **two** (one from each click),
- **And** the header cart count increases by one with each click (from zero to one, then from one to two).

> ⚠️ Known issue: this criterion is **currently failing**. After the first click the item is added correctly, but the second click on Add to Cart for the same size silently leaves the cart quantity at one instead of increasing it to two, and the header cart count does not change.

### AC-5 — Different sizes are separate lines
- **Given** the cart contains a shoe in size 9,
- **When** the shopper adds the same shoe in size 10,
- **Then** the cart shows **two separate lines** (one per size),
- **And** the header count increases by one.

### AC-6 — Live total on the action label
- **Given** a shoe priced at $129.99,
- **When** the shopper sets the quantity to two,
- **Then** the Add to Cart label reflects the live total of $259.98.

### AC-7 — Session persistence
- **Given** a shopper has items in their cart,
- **When** they refresh the page in the same browser,
- **Then** the cart contents are unchanged.

### AC-8 — Error visibility
- **Given** the add action fails for any reason,
- **When** the shopper tries to add an item,
- **Then** they see a clear error message,
- **And** the cart count does **not** change.

## 7. Out of scope

- User accounts and carts that follow the shopper across devices.
- Real payment processing (checkout uses a dummy test card).
- Live inventory or stock checks at the moment of adding.
- Discounts, coupons, or promotions tied to the Add to Cart action.
