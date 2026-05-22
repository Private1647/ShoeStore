# Overview

SoleStyle is a full-stack e-commerce shoe store demo application built with React and Express. It features a complete multi-page product catalog with 24 products across 4 categories, working search, cart management, checkout flow with dummy payment validation, and 8 informational pages. Designed as a demo site suitable for automation testing on both desktop and mobile resolutions.

# User Preferences

Preferred communication style: Simple, everyday language.
Purpose: Automation testing demo site compatible with desktop and mobile.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context (with useMemo/useCallback) for cart state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for products, cart, checkout, and orders
- **Data Storage**: In-memory storage (MemStorage) with interface abstraction
- **Development**: Hot reload with Vite middleware integration

## Database Schema (shared/schema.ts)
- **Products**: id, name, description, price, originalPrice, category, subcategory, brand, gender, imageUrl, thumbnails, sizes, inStock, isOnSale, rating, reviewCount, features
- **Cart Items**: id, productId, quantity, size, sessionId
- **Orders**: id, sessionId, items (JSON), subtotal, shipping, total, customerName, customerEmail, shippingAddress, shippingCity, shippingState, shippingZip, cardLast4, status, createdAt
- **Validation**: checkoutSchema for payment form validation

## Pages & Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero + product catalog with filters |
| `/category/:category` | Category | athletic, casual, dress, boots, sale |
| `/gender/:gender` | Gender | men, women (includes unisex) |
| `/product/:id` | Product Detail | Full product page with reviews |
| `/search?q=query` | Search | Search results from API |
| `/checkout` | Checkout | Shipping + payment form |
| `/order/:id` | Order Confirmation | Post-checkout confirmation |
| `/about` | About Us | Company info |
| `/contact` | Contact | Contact form |
| `/size-guide` | Size Guide | Size charts |
| `/returns` | Returns | Return policy |
| `/shipping` | Shipping | Shipping info |
| `/privacy` | Privacy Policy | Privacy policy |
| `/terms` | Terms of Service | ToS |
| `/cookies` | Cookie Policy | Cookie policy |
| `/test-elements` | Test Playground | Shadow DOM, slots, iframes, dynamic elements for automation testing |

## Site-Wide Special Elements (Non-Regular DOM)
Special element types are integrated into real shopping pages for realistic automation testing:

| Page | Element | Type | Host/Selector |
|------|---------|------|---------------|
| Home `/` | Promo Banner | Iframe | `iframe-promo-widget` |
| Home `/` | Load More Products | Dynamic Locator | id + data-testid regenerate per click |
| Footer (all pages) | Newsletter Form | Shadow DOM | `shadow-host-newsletter` |
| Product Detail `/product/:id` | Star Rating | Shadow DOM | `shadow-host-rating` |
| Product Detail `/product/:id` | Review Cards | Slot | `slot-host-card` (header/body/footer) |
| Checkout `/checkout` | Payment Fields | Shadow DOM | `shadow-host-payment` |
| Checkout `/checkout` | Place Order Button | Dynamic Locator | id + data-testid regenerate per click |
| Cart Slideout (all pages) | Cart Item Cards | Slot | `slot-host-highlight` (image/title/description/action) |
| Contact `/contact` | Contact Form | Shadow DOM | `shadow-host-contact-form` |
| About `/about` | Value/Stats Cards | Slot | `slot-host-card` (header/body/footer) |

Component files: `shadow-dom-components.tsx`, `slot-components.tsx`, `dynamic-elements.tsx`
Glossary on `/test-elements` documents both playground-only and site-wide elements.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports ?category, ?search, ?gender, ?sale) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/cart` | Get cart items (x-session-id header) |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/checkout` | Process checkout (card 4242424242424242 succeeds, all others fail) |
| GET | `/api/orders/:id` | Get order details |

## Cart Management
- **Session-Based**: Cart items tied to session IDs via `x-session-id` header, stored in localStorage
- **Context**: CartProvider with useReducer + useMemo/useCallback for stable references
- **Slideout Interface**: Non-intrusive cart overlay with quantity management and checkout navigation

## Product Data
- **24 products** across categories: athletic (6), casual (8), dress (5), boots (5)
- **Brands**: Nike, Adidas, Puma, New Balance, Vans, Converse, Reebok, Cole Haan, Dr. Martens, Timberland
- **Genders**: men, women, unisex
- **9 on-sale items** with original prices

## Checkout Flow
- Shipping form: name, email, address, city, state, zip
- Payment form: cardholder name, card number, expiry, CVV
- **Test card**: 4242 4242 4242 4242 (passes), all other numbers return 402 payment declined
- On success: creates order, clears cart, redirects to order confirmation

# External Dependencies

## Core Frameworks
- **@vitejs/plugin-react**: React integration for Vite
- **express**: Web framework for Node.js
- **react**: UI library
- **typescript**: Type system

## Database & ORM
- **drizzle-orm**: TypeScript ORM (schema definitions only, using in-memory storage)
- **drizzle-kit**: Database toolkit
- **drizzle-zod**: Zod schema generation from Drizzle schemas

## UI Components
- **@radix-ui/***: Headless UI primitives
- **@tanstack/react-query**: Server state management
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form management
- **@hookform/resolvers**: Zod integration for forms

## Routing & Validation
- **wouter**: Lightweight client-side routing
- **zod**: Runtime type validation
