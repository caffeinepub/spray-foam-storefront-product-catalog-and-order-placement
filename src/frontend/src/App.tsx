import { RouterProvider, createRouter, createRoute, createRootRoute, ErrorComponent } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import StorefrontPage from './pages/StorefrontPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import RequestQuotePage from './pages/RequestQuotePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AppErrorBoundary from './components/AppErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ErrorComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StorefrontPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const requestQuoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-quote',
  component: RequestQuotePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: AdminProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage,
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/leads',
  component: AdminLeadsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: AdminUsersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  requestQuoteRoute,
  adminRoute.addChildren([adminProductsRoute, adminOrdersRoute, adminLeadsRoute, adminUsersRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
