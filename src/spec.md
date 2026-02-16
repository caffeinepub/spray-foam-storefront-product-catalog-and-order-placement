# Specification

## Summary
**Goal:** Deploy the latest Foam Daddy Storefront build to a live/public URL and confirm sharing uses the deployed URL.

**Planned changes:**
- Publish/deploy the current latest build so it is publicly accessible via a live URL.
- Post-deploy, verify the Share button copies the correct live URL based on `window.location.origin + window.location.pathname`, with success/error toasts as appropriate.

**User-visible outcome:** Users can access the storefront at a live URL without authentication, and the Share button copies the correct live link with clear success/failure feedback.
