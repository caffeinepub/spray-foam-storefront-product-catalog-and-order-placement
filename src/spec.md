# Specification

## Summary
**Goal:** Publish the current Foam Daddy Storefront as a publicly accessible, non-expiring live deployment while keeping admin access protected.

**Planned changes:**
- Create and release a production/live (non-draft) deployment of the current app.
- Verify public routes (/, /products, /product/:productId, /cart, /checkout, /request-quote) work end-to-end without requiring authentication.
- Ensure admin routes (/admin/*) remain gated behind Internet Identity authentication and existing role checks.
- Confirm SPA deep linking works in the live deployment via the existing 404-to-app-shell fallback.
- Validate the Share button copies the live deployed (non-localhost) URL correctly.

**User-visible outcome:** Anyone can browse and use the storefront flows without logging in on the live URL, while admin pages still require Internet Identity login; shared links and deep links work correctly on the published deployment.
