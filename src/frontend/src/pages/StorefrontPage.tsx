import { useGetActiveProducts } from '../hooks/useProducts';
import { useNavigate } from '@tanstack/react-router';
import ProductCard from '../components/ProductCard';
import TrustSignals from '../components/Storefront/TrustSignals';
import { Loader2, ShoppingBag, Phone, CheckCircle, Shield, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SERVICE_AREA_COPY } from '../constants/serviceAreaCopy';

export default function StorefrontPage() {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetActiveProducts();

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden bg-muted">
        <img
          src="/assets/generated/spray-foam-hero-blue.dim_1600x600.png"
          alt="Spray Foam Insulation"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40">
          <div className="container mx-auto flex h-full items-center px-4">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
                Professional Spray Foam Insulation
              </h1>
              <p className="mb-8 text-xl text-white/95">
                Superior energy efficiency and comfort for your home or business. {SERVICE_AREA_COPY}.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/request-quote' })} className="bg-white text-primary hover:bg-white/90">
                  <Phone className="mr-2 h-5 w-5" />
                  Request a Quote
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToProducts} className="border-white bg-transparent text-white hover:bg-white/10">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Service Highlights */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Foam Daddy?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Licensed & Insured</CardTitle>
                <CardDescription>
                  Fully certified professionals with comprehensive insurance coverage for your peace of mind.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Energy Savings</CardTitle>
                <CardDescription>
                  Reduce your energy bills by up to 50% with our high-performance spray foam insulation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Quality Guarantee</CardTitle>
                <CardDescription>
                  We stand behind our work with industry-leading warranties and exceptional customer service.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple Process Steps */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Simple Process</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Request a Quote</h3>
              <p className="text-sm text-muted-foreground">
                Fill out our simple form or give us a call to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Free Inspection</h3>
              <p className="text-sm text-muted-foreground">
                We'll visit your property to assess your insulation needs.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Professional Installation</h3>
              <p className="text-sm text-muted-foreground">
                Our certified team completes the job efficiently and cleanly.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                4
              </div>
              <h3 className="mb-2 text-xl font-semibold">Enjoy the Savings</h3>
              <p className="text-sm text-muted-foreground">
                Experience improved comfort and lower energy bills immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="container mx-auto px-4 py-16">
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

      {/* Final CTA */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Improve Your Home's Efficiency?</h2>
          <p className="mb-8 text-xl text-white/90">
            Get a free, no-obligation quote today and start saving on energy costs.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/request-quote' })} className="bg-white text-primary hover:bg-white/90">
            <Phone className="mr-2 h-5 w-5" />
            Request Your Free Quote
          </Button>
        </div>
      </section>
    </div>
  );
}
