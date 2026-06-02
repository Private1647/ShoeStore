# SoleStyle — Premium Footwear E-Commerce Store

SoleStyle is a full-stack e-commerce shoe store demo application built with **React**, **Express**, and **TypeScript**. It features a multi-page product catalog with 24 products across 4 categories, working search, cart management, a checkout flow with dummy payment validation, and 8 informational pages. Originally scaffolded on [Replit](https://replit.com), it runs locally with a single command.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Product Catalog](#product-catalog)
- [Checkout Flow](#checkout-flow)
- [Automation Testing Support](#automation-testing-support)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features

- **Product Catalog** — Browse 24 shoes across athletic, casual, dress, and boots categories
- **Search** — Full-text product search with instant results
- **Filtering** — Filter by category, gender, and sale items
- **Cart Management** — Session-based cart with slideout panel, quantity updates, and item removal
- **Checkout** — Full shipping & payment form with validation (test card: `4242 4242 4242 4242`)
- **Order Confirmation** — Post-checkout order summary page
- **Responsive Design** — Mobile-first layout with hamburger menu and touch-friendly UI
- **8 Informational Pages** — About, Contact, Size Guide, Returns, Shipping, Privacy, Terms, Cookies
- **Automation Testing Support** — Shadow DOM, Slots, iframes, and dynamic elements integrated into real pages

---

## Project Structure

```
ShoeStore/
├── client/                   # Frontend (React + Vite)
│   ├── index.html            # HTML entry point
│   ├── public/               # Static assets (iframe widget)
│   └── src/
│       ├── main.tsx           # React entry point
│       ├── App.tsx            # Root component with routing
│       ├── components/        # Reusable UI components
│       │   ├── ui/            # shadcn/ui primitives
│       │   ├── header.tsx     # Navigation & search bar
│       │   ├── footer.tsx     # Footer with Shadow DOM newsletter
│       │   ├── hero-section.tsx
│       │   ├── product-card.tsx
│       │   ├── product-grid.tsx
│       │   ├── product-filters.tsx
│       │   ├── product-modal.tsx
│       │   ├── cart-slideout.tsx
│       │   ├── shadow-dom-components.tsx
│       │   ├── slot-components.tsx
│       │   └── dynamic-elements.tsx
│       ├── contexts/          # React context providers
│       │   └── cart-context.tsx
│       ├── hooks/             # Custom hooks
│       ├── lib/               # Utilities (query client, cn helper)
│       └── pages/             # Page components
│           ├── home.tsx
│           ├── category.tsx
│           ├── product.tsx
│           ├── search.tsx
│           ├── checkout.tsx
│           ├── order-confirmation.tsx
│           ├── about.tsx
│           ├── contact.tsx
│           ├── size-guide.tsx
│           ├── returns.tsx
│           ├── shipping.tsx
│           ├── privacy.tsx
│           ├── terms.tsx
│           ├── cookies.tsx
│           ├── test-elements.tsx
│           └── not-found.tsx
├── server/                   # Backend (Express)
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API route handlers
│   ├── storage.ts            # In-memory data store + seed data
│   └── vite.ts               # Vite dev middleware integration
├── shared/                   # Shared code (frontend + backend)
│   └── schema.ts             # Drizzle schema, Zod validators, TypeScript types
├── docs/                     # Documentation
│   └── add-to-cart-flow.md   # Add-to-cart acceptance criteria
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
└── components.json           # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Private1647/ShoeStore.git
cd ShoeStore

# Install dependencies
npm install
```

### Running in Development

```bash
npm run dev
```

The app starts on **https://lt-shoe-store.replit.app** with hot-reload enabled (Vite HMR). Both the API and the client are served from the same port.

### Building for Production

```bash
# Build frontend (Vite) and backend (esbuild)
npm run build

# Start the production server
npm start
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start the dev server with hot reload (port 5000) |
| `build` | `npm run build` | Build frontend with Vite and bundle backend with esbuild |
| `start` | `npm start` | Run the production build |
| `check` | `npm run check` | Run TypeScript type checking |
| `db:push` | `npm run db:push` | Push Drizzle schema to a PostgreSQL database (requires `DATABASE_URL`) |

> **Note:** The application uses in-memory storage by default — no database setup is required. The `db:push` script is only needed if you want to connect to a real PostgreSQL instance.

---

## API Reference

All endpoints are served from the same origin as the frontend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products. Supports query params: `?category`, `?search`, `?gender`, `?sale=true` |
| `GET` | `/api/products/:id` | Get a single product by ID |
| `GET` | `/api/cart` | Get cart items for the current session (`x-session-id` header) |
| `POST` | `/api/cart` | Add item to cart. Body: `{ productId, size, quantity }` |
| `PUT` | `/api/cart/:id` | Update cart item quantity. Body: `{ quantity }` |
| `DELETE` | `/api/cart/:id` | Remove a single cart item |
| `DELETE` | `/api/cart` | Clear the entire cart for the current session |
| `POST` | `/api/checkout` | Process checkout. Validates payment and creates an order |
| `GET` | `/api/orders/:id` | Get order details by ID |

### Session Management

Cart operations use the `x-session-id` HTTP header to identify the browser session. The client generates a UUID on first visit and stores it in `localStorage`.

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero banner + product catalog with filters and iframe promo widget |
| `/category/:category` | Category | Products filtered by category: `athletic`, `casual`, `dress`, `boots`, `sale` |
| `/gender/:gender` | Gender | Products filtered by gender: `men`, `women` (includes unisex) |
| `/product/:id` | Product Detail | Full product page with image gallery, size selector, and reviews |
| `/search?q=query` | Search | Search results from the API |
| `/checkout` | Checkout | Shipping + payment form |
| `/order/:id` | Order Confirmation | Post-checkout confirmation with order summary |
| `/about` | About Us | Company info with slot-based value/stats cards |
| `/contact` | Contact | Contact form (Shadow DOM) |
| `/size-guide` | Size Guide | Size charts for all shoe types |
| `/returns` | Returns | Return policy |
| `/shipping` | Shipping | Shipping information |
| `/privacy` | Privacy Policy | Privacy policy |
| `/terms` | Terms of Service | Terms of service |
| `/cookies` | Cookie Policy | Cookie policy |
| `/test-elements` | Test Playground | Shadow DOM, slots, iframes, and dynamic elements for automation testing |

---

## Product Catalog

- **24 products** across 4 categories: Athletic (6), Casual (8), Dress (5), Boots (5)
- **Brands**: Nike, Adidas, Puma, New Balance, Vans, Converse, Reebok, Cole Haan, Dr. Martens, Timberland
- **Genders**: Men, Women, Unisex
- **9 sale items** with original and discounted prices
- Product images sourced from Unsplash

---

## Checkout Flow

1. Add items to cart (size selection required)
2. Open the cart slideout and click "Checkout"
3. Fill in shipping information (name, email, address, city, state, zip)
4. Enter payment details (cardholder name, card number, expiry, CVV)
5. Submit the order

### Test Card

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| Any other number | Payment declined (HTTP 402) |

On success, an order is created, the cart is cleared, and the user is redirected to the order confirmation page.

---

## Automation Testing Support

SoleStyle is designed as a demo site for automation testing on both desktop and mobile viewports. Special non-standard DOM elements are integrated into real shopping pages for realistic testing scenarios:

| Page | Element | Type | Selector |
|------|---------|------|----------|
| Home `/` | Promo Banner | Iframe | `iframe-promo-widget` |
| Home `/` | Load More Products | Dynamic Locator | ID + `data-testid` regenerate per click |
| Footer (all pages) | Newsletter Form | Shadow DOM | `shadow-host-newsletter` |
| Product Detail | Star Rating | Shadow DOM | `shadow-host-rating` |
| Product Detail | Review Cards | Slot | `slot-host-card` (header/body/footer) |
| Checkout | Payment Fields | Shadow DOM | `shadow-host-payment` |
| Checkout | Place Order Button | Dynamic Locator | ID + `data-testid` regenerate per click |
| Cart Slideout | Cart Item Cards | Slot | `slot-host-highlight` (image/title/description/action) |
| Contact | Contact Form | Shadow DOM | `shadow-host-contact-form` |
| About | Value/Stats Cards | Slot | `slot-host-card` (header/body/footer) |

The `/test-elements` page provides a playground and glossary documenting all special element types.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI) |
| **State** | TanStack Query (server state), React Context + useReducer (cart state) |
| **Routing** | Wouter |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Node.js, Express.js, TypeScript (ES modules) |
| **Data** | In-memory storage (no database required) |
| **Schema** | Drizzle ORM type definitions + Drizzle-Zod for validation |
| **Build** | Vite (frontend), esbuild (backend) |

---

## License

MIT
