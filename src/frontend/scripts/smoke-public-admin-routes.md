# Foam Daddy Storefront - Public & Admin Routes Smoke Test

This checklist verifies that public routes remain accessible without authentication and admin routes remain properly gated after deployment.

## Test Environment
- **Date**: _____________
- **Tester**: _____________
- **Frontend Canister ID**: _____________
- **Backend Canister ID**: _____________
- **Base URL**: `https://<frontend-canister-id>.ic0.app`

---

## Public Routes (No Authentication Required)

### 1. Landing Page - `/`
- [ ] Page loads without login prompt
- [ ] Hero section displays with image
- [ ] "Request a Quote" button navigates to `/request-quote`
- [ ] "Shop Products" button navigates to `/products`
- [ ] Trust signals section renders
- [ ] Service highlights section renders
- [ ] Process steps section renders
- [ ] Footer displays with Caffeine.ai attribution

**Notes**: _______________________________________________

---

### 2. Products Page - `/products`
- [ ] Page loads without login prompt
- [ ] Product grid displays (or empty state if no products)
- [ ] Product cards show image, name, description, price
- [ ] "View Details" button on each product works
- [ ] Navigation to individual product page works

**Notes**: _______________________________________________

---

### 3. Product Detail Page - `/product/:id`
- [ ] Page loads without login prompt (test with actual product ID)
- [ ] Product image displays
- [ ] Product name, description, price shown
- [ ] Quantity selector works
- [ ] "Add to Cart" button functions
- [ ] Success toast appears on add to cart
- [ ] Cart count updates in header

**Test Product ID Used**: _____________

**Notes**: _______________________________________________

---

### 4. Cart Page - `/cart`
- [ ] Page loads without login prompt
- [ ] Empty cart state displays if cart is empty
- [ ] Cart items display with images, names, prices
- [ ] Quantity controls work (increase/decrease)
- [ ] Remove item button works
- [ ] Order summary calculates correctly
- [ ] "Proceed to Checkout" button navigates to `/checkout`

**Notes**: _______________________________________________

---

### 5. Checkout Page - `/checkout`
- [ ] Page loads without login prompt
- [ ] Customer info form displays (name, email, phone)
- [ ] Delivery address form displays
- [ ] Order summary shows cart items and total
- [ ] Form validation works (required fields)
- [ ] "Place Order" button submits successfully
- [ ] Navigates to order confirmation page after submission

**Notes**: _______________________________________________

---

### 6. Order Confirmation Page - `/order-confirmation/:orderId`
- [ ] Page loads without login prompt (after placing order)
- [ ] Success message displays
- [ ] Order ID shown
- [ ] "Continue Shopping" button navigates to `/products`

**Test Order ID Used**: _____________

**Notes**: _______________________________________________

---

### 7. Request Quote Page - `/request-quote`
- [ ] Page loads without login prompt
- [ ] Quote request form displays
- [ ] All form fields present (name, email, phone, address, message, service type)
- [ ] Form validation works
- [ ] "Submit Request" button works
- [ ] Success confirmation displays after submission
- [ ] Contact information (phone number) displays

**Notes**: _______________________________________________

---

## Admin Routes (Authentication + Admin Role Required)

### Reference: Current Admin Gating Implementation
- **File**: `frontend/src/pages/admin/AdminLayout.tsx`
- **Authentication Check**: Lines 38-62 (Internet Identity required)
- **Admin Role Check**: Lines 72-86 (Admin role required)

---

### 8. Admin Products - `/admin/products`
- [ ] Redirects to login if not authenticated
- [ ] Shows "Access Denied" if authenticated but not admin
- [ ] Loads admin panel if authenticated AND admin
- [ ] Product management table displays
- [ ] Create product button works
- [ ] Edit product button works
- [ ] Archive/restore product buttons work

**Authentication Status**: [ ] Guest [ ] User [ ] Admin

**Notes**: _______________________________________________

---

### 9. Admin Orders - `/admin/orders`
- [ ] Redirects to login if not authenticated
- [ ] Shows "Access Denied" if authenticated but not admin
- [ ] Loads admin panel if authenticated AND admin
- [ ] Orders table displays
- [ ] Order status dropdown works
- [ ] Status updates save successfully

**Authentication Status**: [ ] Guest [ ] User [ ] Admin

**Notes**: _______________________________________________

---

### 10. Admin Leads - `/admin/leads`
- [ ] Redirects to login if not authenticated
- [ ] Shows "Access Denied" if authenticated but not admin
- [ ] Loads admin panel if authenticated AND admin
- [ ] Leads/quotes table displays
- [ ] Lead status dropdown works
- [ ] View details dialog works
- [ ] Admin notes can be updated

**Authentication Status**: [ ] Guest [ ] User [ ] Admin

**Notes**: _______________________________________________

---

### 11. Admin Users - `/admin/users`
- [ ] Redirects to login if not authenticated
- [ ] Shows "Access Denied" if authenticated but not admin
- [ ] Loads admin panel if authenticated AND admin
- [ ] Grant admin form displays
- [ ] Email input validation works
- [ ] "Grant Admin Permission" button works
- [ ] Success/error messages display appropriately

**Authentication Status**: [ ] Guest [ ] User [ ] Admin

**Notes**: _______________________________________________

---

## Deep Link Testing

### 12. Direct Navigation (Incognito/Private Window)
Test that deep links work when opened directly in a new browser session:

- [ ] `https://<canister-id>.ic0.app/products` loads products page
- [ ] `https://<canister-id>.ic0.app/product/1` loads product detail
- [ ] `https://<canister-id>.ic0.app/cart` loads cart page
- [ ] `https://<canister-id>.ic0.app/request-quote` loads quote form
- [ ] `https://<canister-id>.ic0.app/admin/products` shows login prompt

**Notes**: _______________________________________________

---

## Authentication Flow Testing

### 13. Login/Logout Flow
- [ ] Click "Admin" link in header
- [ ] Login prompt appears
- [ ] Internet Identity authentication completes
- [ ] Admin panel loads (if admin role assigned)
- [ ] Logout button works
- [ ] Redirects to home page after logout
- [ ] All cached data cleared after logout

**Notes**: _______________________________________________

---

## Summary

**Total Tests**: 13
**Passed**: _____
**Failed**: _____
**Blocked**: _____

**Critical Issues Found**: 
_______________________________________________
_______________________________________________
_______________________________________________

**Recommendations**:
_______________________________________________
_______________________________________________
_______________________________________________

**Sign-off**:
- [ ] All public routes accessible without authentication
- [ ] All admin routes properly gated
- [ ] Deep links work correctly
- [ ] Authentication flow functions as expected
- [ ] Ready for production use

**Tester Signature**: _______________  **Date**: _______________
