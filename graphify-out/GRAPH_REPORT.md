# Graph Report - FINAL WEB 2026  (2026-11-12)

## Corpus Check
- 46 files · ~27,602 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 220 nodes · 484 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dee522f1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- package.json
- query
- Rules
- APEX ESPORTS // Official Tournament Gear Marketplace
- app/page.jsx
- Referensi Desain: E-Commerce Esports
- orders.js
- [slug]/page.jsx
- seller/route.js
- cart/route.js
- auth/route.js
- Ponytail, lazy senior dev mode
- compilerOptions
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `query()` - 50 edges
2. `useAuth()` - 25 edges
3. `next` - 24 edges
4. `lucide-react` - 19 edges
5. `react` - 17 edges
6. `Referensi Desain: E-Commerce Esports` - 12 edges
7. `getCategories()` - 10 edges
8. `Rules` - 10 edges
9. `useCart()` - 9 edges
10. `getProducts()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `updateOrderStatus()` --calls--> `query()`  [EXTRACTED]
  src/lib/orders.js → src/lib/db.js
- `getProductById()` --calls--> `query()`  [EXTRACTED]
  src/lib/products.js → src/lib/db.js
- `checkCanReview()` --calls--> `query()`  [EXTRACTED]
  src/lib/reviews.js → src/lib/db.js
- `AdminDashboardPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/admin/dashboard/page.jsx → src/context/AuthContext.jsx
- `GET()` --calls--> `getCategories()`  [EXTRACTED]
  src/app/api/admin/route.js → src/lib/categories.js

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.15
Nodes (23): lucide-react, next, react, AdminDashboardPage(), CartPage(), metadata, RootLayout(), LoginFormContent() (+15 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (28): dependencies, lucide-react@^1.16.0, next@^15.2.0, pg@^8.13.3, react@^19.0.0, react-dom@^19.0.0, server-only@^0.0.1, devDependencies (+20 more)

### Community 2 - "query"
Cohesion: 0.33
Nodes (14): GET(), POST(), approveSeller(), deleteInfringingProduct(), deleteUser(), getAdminStats(), getAdminUsers(), getPendingSellers() (+6 more)

### Community 3 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 4 - "APEX ESPORTS // Official Tournament Gear Marketplace"
Cohesion: 0.12
Nodes (15): 1. Prasyarat Sistem, 2. Kloning Repositori, 3. Konfigurasi Database (pgAdmin 4), 4. Konfigurasi Variabel Lingkungan (`.env.local`), 5. Seeding Data Awal dari Internet API, 6. Menjalankan Server Pengembangan, 📋 Akun Uji Coba Cepat (Demo Testing Accounts), APEX ESPORTS // Official Tournament Gear Marketplace (+7 more)

### Community 5 - "app/page.jsx"
Cohesion: 0.31
Nodes (10): CatalogPage(), dynamic, dynamic, HomePage(), DropCountdown(), ProductCard(), getCategories(), getFeaturedProducts() (+2 more)

### Community 6 - "Referensi Desain: E-Commerce Esports"
Cohesion: 0.15
Nodes (12): 1. Homepage dan Identitas Visual Esports, 1B. Studi Situs Tim Esports Besar, 2. Product List dan Product Details, 3. Rating dan Review, 4. Keranjang dan Checkout, 5. Order History dan Order Tracking, 6. Register Seller, Pending Page, dan Seller Dashboard, 7. Admin Dashboard (+4 more)

### Community 7 - "orders.js"
Cohesion: 0.27
Nodes (10): GET(), POST(), dynamic, OrderDetailPage(), OrderDetailTracker(), checkoutOrder(), getBuyerOrders(), getOrderDetail() (+2 more)

### Community 8 - "[slug]/page.jsx"
Cohesion: 0.28
Nodes (10): GET(), POST(), dynamic, ProductDetailPage(), AddToCartSection(), getProductBySlug(), checkCanReview(), createReview() (+2 more)

### Community 9 - "seller/route.js"
Cohesion: 0.36
Nodes (11): DELETE(), GET(), POST(), createSellerProduct(), deleteSellerProduct(), getSellerIncomingOrders(), getSellerProducts(), getSellerStore() (+3 more)

### Community 10 - "cart/route.js"
Cohesion: 0.38
Nodes (9): DELETE(), GET(), PATCH(), POST(), addToCart(), clearCart(), getCart(), removeFromCart() (+1 more)

### Community 11 - "auth/route.js"
Cohesion: 0.42
Nodes (7): GET(), POST(), deleteRejectedSeller(), getUserById(), loginUser(), registerBuyer(), registerSeller()

### Community 12 - "Ponytail, lazy senior dev mode"
Cohesion: 0.50
Nodes (3): Before you write, Ponytail, lazy senior dev mode, The smallest complete change

### Community 13 - "compilerOptions"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `useAuth` to `package.json`, `query`, `app/page.jsx`, `orders.js`, `[slug]/page.jsx`, `seller/route.js`, `cart/route.js`, `auth/route.js`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07741935483870968 - nodes in this community are weakly interconnected._
- **Why does `query()` connect `query` to `app/page.jsx`, `orders.js`, `[slug]/page.jsx`, `seller/route.js`, `cart/route.js`, `auth/route.js`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `useAuth` to `[slug]/page.jsx`, `package.json`, `app/page.jsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `APEX ESPORTS // Official Tournament Gear Marketplace` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._