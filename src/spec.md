# Specification

## Summary
**Goal:** Refresh the storefront to use best-in-class spray-foam contractor website UX patterns and add a service lead (quote) workflow, while keeping the existing product shopping experience intact.

**Planned changes:**
- Update the homepage with an improved above-the-fold hero (short value prop + at least two primary CTAs: “Shop Products” and “Request a Quote”) plus new trust-building sections (service highlights, benefits/“Why choose us”, simple process steps, testimonials placeholders, FAQ accordion) without hiding or removing the existing products grid.
- Add a dedicated “Request a Quote” page/route with a lead-capture form, inline client-side validation, and a post-submit confirmation/success state.
- Implement backend storage for quote inquiries with unique incrementing IDs and timestamps, including a public (guest) submit method and admin-only methods to list inquiries and update inquiry status.
- Add an admin “Leads” page under the existing admin area to view inquiries and update status with in-place UI updates (no full reload).
- Improve header/footer for a contractor/service company feel: header links (Products, Request a Quote, Admin) while keeping cart access; footer contact block, service area text (placeholders allowed), and quick links; add on-site “trust signals” badges/tiles on the homepage.

**User-visible outcome:** Visitors can browse products as before, see a more contractor-style homepage with clear CTAs and trust sections, submit a service quote request without logging in, and admins can review and manage leads (including status updates) in the admin area.
