# Specification

## Summary
**Goal:** Remove all customer-facing “Serving Ontario” / “Ontario” service-area references from the storefront UI and ensure the remaining copy reads naturally.

**Planned changes:**
- Remove or rewrite any header, hero, footer, and other storefront text that mentions “Ontario” or includes the phrase “Serving Ontario”.
- Update `frontend/src/constants/serviceAreaCopy.ts` and any dependent UI to ensure correct punctuation/grammar after removing Ontario-related wording.
- Verify no remaining customer-facing “Ontario” strings remain in the frontend, while keeping the footer “Contact Us” section phone-only.

**User-visible outcome:** Storefront pages no longer display “Serving Ontario” (or any Ontario mention), and the updated header/hero/footer copy reads cleanly without awkward punctuation.
