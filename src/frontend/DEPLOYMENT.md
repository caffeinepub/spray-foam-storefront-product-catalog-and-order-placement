# Foam Daddy Storefront - Production Deployment Guide

## Pre-Deployment Checklist

### 1. Public Access Verification
- [ ] Landing page (`/`) loads without authentication
- [ ] Products page (`/products`) is accessible to guests
- [ ] Individual product pages (`/product/:id`) load correctly
- [ ] Cart page (`/cart`) functions without login
- [ ] Checkout page (`/checkout`) works for guest users
- [ ] Request Quote page (`/request-quote`) is publicly accessible

### 2. Authentication & Authorization
- [ ] Admin routes (`/admin/*`) require Internet Identity login
- [ ] Admin panel checks for admin role after authentication
- [ ] Non-admin authenticated users see "Access Denied" message
- [ ] Logout clears all cached data and redirects to home
- [ ] Login flow handles errors gracefully

### 3. Deep Link & SPA Routing
- [ ] Direct navigation to `/products` works after deployment
- [ ] Direct navigation to `/product/:id` works after deployment
- [ ] Direct navigation to `/cart` works after deployment
- [ ] Direct navigation to `/request-quote` works after deployment
- [ ] 404.html redirects to root and restores path via sessionStorage
- [ ] main.tsx reads sessionStorage and restores deep-link path

### 4. Share Functionality
- [ ] ShareButton copies full URL including path, search params, and hash
- [ ] Share button shows success toast on copy
- [ ] Share button shows error toast on failure
- [ ] Shared links work when opened in new browser/incognito

### 5. Frontend Build
- [ ] Run `pnpm typescript-check` - no errors
- [ ] Run `pnpm lint` - no critical issues
- [ ] Run `pnpm build:skip-bindings` - successful build
- [ ] Check `frontend/dist` folder exists with assets
- [ ] Verify `frontend/dist/404.html` exists

## Deployment Steps

### Step 1: Clean Build
