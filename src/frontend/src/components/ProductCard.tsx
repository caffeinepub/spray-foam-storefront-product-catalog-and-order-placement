import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image || '/assets/generated/spray-foam-product-placeholder.dim_800x800.png';

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/assets/generated/spray-foam-product-placeholder.dim_800x800.png';
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
        <Link to="/product/$productId" params={{ productId: product.id.toString() }}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
