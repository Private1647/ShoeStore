# KaneAI custom instructions — ShoeStore (SoleStyle)

## App overview
SoleStyle is an e-commerce shoe store: 24 products in 4 categories (athletic,
casual, dress, boots), full-text search, category/gender/sale filters,
session-based cart with a slideout panel, checkout with dummy payment
validation (test card `4242 4242 4242 4242`, any future expiry, any CVC), an
order-confirmation page, and 8 informational pages.

## Testing priorities (highest first)
1. Checkout flow (cart → shipping → payment → confirmation) — revenue critical.
2. Cart operations: add, quantity update, remove, subtotal math.
3. Search and category/gender filters.
4. Product detail: name, price, size selection gating Add to Cart.
5. Informational pages — smoke level only.

## Rules
- Always select a shoe size before asserting Add to Cart behaviour; the
  button is disabled until a size is chosen.
- Use card `4242 4242 4242 4242` for successful payments; any other number
  must be rejected by validation — that rejection is expected behaviour, not
  a bug.
- The cart is session-based (no login). Do not generate auth/login tests.
- The footer newsletter widget uses Shadow DOM and there are intentional
  iframe/slot/dynamic elements on real pages for automation-testing demos —
  interact through accessible roles/text rather than brittle selectors.
- Prefer assertions on visible text and counts (cart badge, subtotal) over
  pixel positions; the layout is responsive.
- An existing regression suite lives in `qa/tests/` (REG-001 … REG-009).
  Avoid duplicating those flows; focus generated tests on the PR's diff.
