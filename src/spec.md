# Specification

## Summary
**Goal:** Trigger a clean rebuild and redeploy of the existing Foam Daddy Storefront application without introducing feature changes.

**Planned changes:**
- Perform a fresh build for frontend and backend and resolve any build/deployment-blocking errors found during rebuild.
- Redeploy the app and verify public routes remain accessible without authentication and admin routes remain gated behind Internet Identity and admin role checks.

**User-visible outcome:** The production app loads successfully and renders the landing page; public routes (`/`, `/products`, `/product/:id`, `/cart`, `/checkout`, `/request-quote`) work without login, while `/admin/*` remains restricted to authenticated admins.
