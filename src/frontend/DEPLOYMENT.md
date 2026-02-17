# Foam Daddy Storefront - Deployment Guide

## Overview
This document outlines the deployment process for the Foam Daddy spray foam insulation storefront application.

## Pre-Deployment Checklist

### 1. Build Validation
- [ ] Run `npm run build` locally to ensure the build completes without errors
- [ ] Verify no TypeScript compilation errors
- [ ] Check browser console for runtime errors on initial load
- [ ] Test all primary user flows (browse products, add to cart, checkout, request quote)

### 2. Public Access Requirements
- [ ] **Critical**: The public storefront MUST be accessible without authentication
- [ ] Guest users can browse products (`/`, `/products`, `/product/:id`), add to cart, and request quotes
- [ ] Only admin routes (`/admin/*`) require Internet Identity authentication
- [ ] Verify the homepage (`/`) loads without requiring login
- [ ] Test `/products`, `/cart`, `/checkout`, and `/request-quote` routes work without authentication

### 3. Authentication & Authorization
- [ ] Admin routes (`/admin/products`, `/admin/orders`, `/admin/leads`, `/admin/users`) require login
- [ ] Non-admin users see "Access Denied" message when attempting to access admin area
- [ ] Logout clears all cached data and redirects to homepage
- [ ] Login flow works correctly with Internet Identity

### 4. Deep Link Support (SPA Routing)
- [ ] 404.html fallback is configured and stores redirect path in sessionStorage
- [ ] main.tsx restores deep links on app initialization
- [ ] Test deep links after deployment (e.g., `/products`, `/product/1`, `/request-quote`)
- [ ] Verify search params and hash fragments are preserved in deep links

### 5. Share Functionality
- [ ] Share button copies the full current URL including path, search params, and hash
- [ ] Share button works correctly on deployed URL (not localhost)
- [ ] Success/error toasts display appropriately when sharing
- [ ] Test share functionality on multiple pages (homepage, product detail, etc.)

### 6. Error Handling
- [ ] Error boundary is in place to prevent blank screens
- [ ] All API errors display user-friendly messages via toast notifications
- [ ] Network failures are handled gracefully
- [ ] Loading states are shown during async operations

### 7. Performance & UX
- [ ] Images load correctly (including placeholder fallbacks)
- [ ] Shopping cart persists across page reloads (localStorage)
- [ ] Mobile responsiveness verified on multiple screen sizes
- [ ] Dark mode toggle works correctly

## Deployment Process

### Step 1: Build the Application

