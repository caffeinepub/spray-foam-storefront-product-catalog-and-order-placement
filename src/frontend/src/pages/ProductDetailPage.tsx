import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetProduct } from '../hooks/useProducts';
import { useCart } from '../store/cart';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProduct(BigInt(productId));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  const imageUrl = product?.image || '/assets/generated/spray-foam-product-placeholder-blue.dim_800x800.png';

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Product not found or failed to load. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8">
        ← Back to Products
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="aspect-square bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/spray-foam-product-placeholder-blue.dim_800x800.png';
              }}
            />
          </div>
        </Card>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="mb-4 text-4xl font-bold">{product.name}</h1>
          <p className="mb-6 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button size="lg" onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
