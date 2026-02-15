import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Package, ShoppingBag, Users, LogOut, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Admin Access Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please log in with Internet Identity to access the admin area.
          </p>
          <Button onClick={handleAuth} disabled={isLoggingIn} size="lg" className="w-full">
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login with Internet Identity
              </>
            )}
          </Button>
        </Card>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="mx-auto max-w-md">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin area.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate({ to: '/' })}>Back to Store</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <nav className="flex gap-4">
              <Link
                to="/admin/products"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Link>
              <Link
                to="/admin/leads"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                <Users className="h-4 w-4" />
                Leads
              </Link>
            </nav>
          </div>
          <Button variant="outline" onClick={handleAuth}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
