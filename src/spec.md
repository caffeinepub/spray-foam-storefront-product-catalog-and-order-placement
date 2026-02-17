# Specification

## Summary
**Goal:** Add a simple public landing page at `/` to improve discoverability while keeping the storefront and quote flow easily accessible.

**Planned changes:**
- Create a dedicated public landing page at route `/` with clear calls-to-action linking to Products and Request Quote.
- Move the existing storefront/product browsing experience from `/` to a new public route (e.g., `/products`) and update header/footer/navigation links accordingly (brand/logo links to `/`, Products links to `/products`).
- Update public HTML metadata (document title and meta description) in `frontend/index.html` to reflect the landing-page-first experience, keeping all user-facing text in English.

**User-visible outcome:** Visiting `/` shows a lightweight landing page with prominent links to browse products and request a quote; products are now browsed at `/products`, and public pages remain accessible without authentication (only `/admin/*` requires login).
