# Admin Panel — Product CRUD & Stock Management

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an admin panel at `/admin` to manage products (create, edit, delete) with Upstash Redis persistence.

**Architecture:** Single Next.js project with `/admin` routes (no auth for now). Products stored in Upstash Redis (`cw:products:v1`), with fallback to static seed data. Admin writes to Redis via API routes, shop reads from same Redis.

**Tech Stack:** Next.js 15 App Router, Upstash Redis, Zod validation, Tailwind CSS, Lucide icons

---

### Task 1: Install Upstash Redis & update types

**Files:**
- Modify: `package.json` — add `@upstash/redis`
- Modify: `types/product.ts` — change `ProductCategory` from union to `string`
- Modify: `data/categories.ts` — change type to `string[]`

**Step 1:** Install dependency
```bash
npm install @upstash/redis
```

**Step 2:** Update `types/product.ts` — `ProductCategory` becomes `string`, `ProductTag` stays as-is for now

**Step 3:** Update `data/categories.ts` — default categories as `string[]`

**Step 4:** Type-check
```bash
npx tsc --noEmit
```

**Step 5:** Commit
```bash
git add -A && git commit -m "feat: add upstash/redis, relax ProductCategory to string"
```

---

### Task 2: Products repository (Redis + fallback)

**Files:**
- Create: `lib/products-repository.ts`
- Create: `lib/slug.ts`

**Step 1:** Create `lib/products-repository.ts`:
- `getRedis()` — lazy singleton, reads `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- `getProducts(): Promise<Product[]>` — Redis → parse → return; fallback to SEED
- `saveProducts(products: Product[]): Promise<void>` — write to Redis; in dev fallback to JSON file
- `hasRedis(): boolean`

**Step 2:** Create `lib/slug.ts`:
- `slugify(name: string): string` — lowercase, replace spaces with hyphens, strip non-alphanumeric
- `uniqueSlug(name: string, taken: Set<string>): string` — append `-2`, `-3` etc. if needed

**Step 3:** Type-check

**Step 4:** Commit

---

### Task 3: Update shop to read from repository

**Files:**
- Modify: `app/api/products/route.ts` — use `getProducts()` from repository
- Modify: `hooks/useProducts.ts` — fetch from `/api/products` instead of static import

**Step 1:** Update API route to call `getProducts()`

**Step 2:** Update `useProducts` hook to fetch from API with loading/error states

**Step 3:** Type-check + build

**Step 4:** Commit

---

### Task 4: Admin API routes

**Files:**
- Create: `lib/validations/product.ts` — Zod schemas for create/update
- Create: `app/api/admin/products/route.ts` — POST (create)
- Create: `app/api/admin/products/[id]/route.ts` — PUT (update), DELETE

**Step 1:** Create Zod schemas:
- `productCreateSchema` — all fields required except id/slug (auto-generated)
- `productUpdateSchema` — all fields optional (partial update)

**Step 2:** Create POST route — validate body, generate id + slug, append to products, save

**Step 3:** Create PUT route — find by id, merge fields, save

**Step 4:** Create DELETE route — filter out by id, save

**Step 5:** Type-check

**Step 6:** Commit

---

### Task 5: Admin list page

**Files:**
- Create: `app/admin/page.tsx` — product list with cards
- Create: `app/admin/layout.tsx` — admin layout (force-dynamic)

**Step 1:** Create layout with force-dynamic export

**Step 2:** Create list page:
- Fetch products from `/api/products`
- Display as vertical cards: image thumbnail, name, category badge, price, stock indicator
- FAB "+" button (fixed bottom-right) linking to `/admin/product/new`
- Each card links to `/admin/product/[id]`
- Stock color: green (>5), orange (1-5), red (0)

**Step 3:** Type-check + build

**Step 4:** Commit

---

### Task 6: Admin product form page

**Files:**
- Create: `app/admin/product/[id]/page.tsx` — edit form
- Create: `app/admin/product/new/page.tsx` — create form (reuses component)
- Create: `components/admin/product-form.tsx` — shared form component

**Step 1:** Create `ProductForm` component:
- Fields: image URL (with live preview), name, category (input with datalist for autocomplete), short description, long description, price, stock, format, tags (clickable pills), featured (checkbox)
- Props: `initialData?: Product`, `onSubmit`, `onDelete?`
- Zod client-side validation, inline errors
- Save button full-width sticky bottom, loading state
- Delete button (red, with confirmation dialog) only when editing

**Step 2:** Create edit page `/admin/product/[id]` — fetch product, pass to form, PUT on save, DELETE on delete

**Step 3:** Create new page `/admin/product/new` — empty form, POST on save

**Step 4:** Type-check + build

**Step 5:** Commit

---

### Task 7: Final polish & verify

**Step 1:** Update `.env.example` with Redis vars
**Step 2:** Update `README.md` with admin section
**Step 3:** Full build verification: `npx tsc --noEmit && npx next build`
**Step 4:** Visual verification via dev server
**Step 5:** Commit
