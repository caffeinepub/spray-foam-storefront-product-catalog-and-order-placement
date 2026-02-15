import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../store/cart';

export default function Header() {
  const navigate = useNavigate();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/spray-foam-logo-blue.dim_512x512.png"
            alt="Cold Country Spray Foam"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight">Cold Country Spray Foam</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Products
          </Link>
          <Link
            to="/request-quote"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Request a Quote
          </Link>
          <Link
            to="/admin/products"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Admin
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => navigate({ to: '/cart' })}
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
