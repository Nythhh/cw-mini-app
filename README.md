# CW Shop

Mobile-first storefront for **CW / Canna-Weed** (legal CBD-only shop), built with Next.js App Router and TypeScript.

## Setup

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Type check

```bash
npx tsc --noEmit
```

## Project Structure

```text
app/
  page.tsx              # Home (hero, featured, categories)
  layout.tsx
  globals.css
  catalog/page.tsx      # Full catalog with filters
  product/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx     # Order via WhatsApp / Signal / Snapchat
  offers/page.tsx
  store/page.tsx
  api/products/route.ts
components/
  ui/                   # Button, Badge, Input, Select, Textarea, Card
  layout/               # AppHeader, MainShell
  navigation/           # BottomNav
  product/              # ProductCard, ProductGrid, CategoryPills, FilterBar, SearchBar
  cart/                  # CartItem, QuantitySelector, PriceBlock
  checkout/             # OrderSummaryCard, ContactMethodSelector, CheckoutPromoSection
  shared/               # EmptyState, PromoBanner, SectionTitle, StoreInfoCard
data/
  products.ts           # 4 static CBD products
  categories.ts         # Flowers, Resins, Oils, Infusions
  offers.ts
types/
  product.ts
  cart.ts
  checkout.ts
lib/
  utils.ts
  format.ts
  constants.ts          # Branding, contact links
  promo-codes.ts        # Client-side promo codes
  checkout-draft.ts     # localStorage draft persistence
hooks/
  useCart.ts             # Cart context + localStorage
  useFilters.ts          # Search, category, tag, sort
  useProducts.ts         # Static product data
  useCheckoutFormPersist.ts
```

## How It Works

- **Products** are static data in `data/products.ts` (4 CBD products across 4 categories).
- **Cart** is persisted in localStorage.
- **Checkout** generates a pre-filled WhatsApp message or copies it for Signal/Snapchat.
- **Promo codes** are validated client-side (`lib/promo-codes.ts`).

## Where To Edit Quickly

- **Products:** `data/products.ts`
- **Categories:** `data/categories.ts`
- **Offers:** `data/offers.ts`
- **Branding text:** `lib/constants.ts`
- **Contact links:** `lib/constants.ts`
- **Promo codes:** `lib/promo-codes.ts`
- **Theme / visual style:** `app/globals.css`, `tailwind.config.ts`
