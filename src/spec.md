# Specification

## Summary
**Goal:** Build a public spray foam storefront for browsing products and placing orders, with an Internet Identity–protected admin area for managing products and viewing orders.

**Planned changes:**
- Create public pages for product listing, product detail (with quantity), cart (add/remove, subtotal), and checkout.
- Implement checkout flow to collect customer contact/delivery info, show order summary, and submit orders with success/error states and an order confirmation ID.
- Add backend data models and APIs to list products, fetch product by ID/slug, and create/store orders durably in canister state.
- Add an admin area protected by Internet Identity for product create/edit/archive and for viewing incoming orders; restrict admin backend methods to the configured owner/allowlist.
- Apply an industrial, high-contrast neutral visual theme (no blue/purple) with consistent responsive layout and CTA hierarchy.
- Add and reference generated static brand assets (logo and hero/banner, plus a product placeholder image) from `frontend/public/assets/generated`.

**User-visible outcome:** Customers can browse spray foam products, view details, add items to a cart, and submit an order via checkout; admins can sign in with Internet Identity to manage the catalog and view incoming orders.
