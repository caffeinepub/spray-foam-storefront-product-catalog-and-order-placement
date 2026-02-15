import { useGetActiveProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StorefrontPage() {
  const { data: products, isLoading, error } = useGetActiveProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-muted">
        <img
          src="/assets/generated/spray-foam-hero.dim_1600x600.png"
          alt="Spray Foam Insulation"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50">
          <div className="container mx-auto flex h-full items-center px-4">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-5xl font-bold tracking-tight">
                Premium Spray Foam Solutions
              </h1>
              <p className="text-xl text-muted-foreground">
                Professional-grade insulation products for superior energy efficiency and comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold">Our Products</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load products. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {products && products.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No products available at the moment.</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
