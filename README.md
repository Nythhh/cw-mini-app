# CW Telegram Mini App Front-End

Premium mobile-first Telegram Mini App storefront for **CW / Canna-Weed** (legal CBD-only shop), built with Next.js App Router and TypeScript.

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
  page.tsx
  layout.tsx
  globals.css
  catalog/page.tsx
  product/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx
  offers/page.tsx
  store/page.tsx
components/
  ui/
  layout/
  navigation/
  product/
  cart/
  checkout/
  shared/
data/
  products.ts
  categories.ts
  offers.ts
types/
  product.ts
  cart.ts
  checkout.ts
lib/
  utils.ts
  format.ts
  constants.ts
  telegram.ts
hooks/
  useCart.ts
  useFilters.ts
```

## What Is Mocked

- Product catalog and product details (`data/products.ts`)
- Categories and offers (`data/categories.ts`, `data/offers.ts`)
- Cart persistence in localStorage (`hooks/useCart.ts`)
- Promo code UI behavior (front-end only, no real validation)
- Contact finalization links (Telegram/WhatsApp/Snapchat placeholders)

## What To Connect Later

### Backend

- Replace mock datasets with API calls (catalog, stock, offers, pricing).
- Validate promo codes server-side.
- Create real order endpoint and order status tracking.
- Add inventory checks and delivery rules from backend.

### Telegram APIs

- Wire real Telegram WebApp SDK state and theme events in `lib/telegram.ts`.
- Pull Telegram user data (first name/username) automatically.
- Use Telegram native main button / back button if needed.

## Where To Edit Quickly

- **Products:** `data/products.ts`
- **Categories:** `data/categories.ts`
- **Offers:** `data/offers.ts`
- **Branding text:** `lib/constants.ts`
- **Contact links:** `lib/constants.ts`
- **Theme / visual style:** `app/globals.css`, `tailwind.config.ts`

## Notes

- Front-end only implementation by design.
- No auth and no payment integration included.
- Built for Telegram mobile viewport first with sticky bottom navigation.
