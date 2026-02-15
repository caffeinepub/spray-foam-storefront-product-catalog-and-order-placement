import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/order-confirmation' }) as { orderId?: string };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We've received your request and will process it shortly.
          </p>

          {search.orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-xl font-bold">#{search.orderId}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email with your order details and tracking information
            once your order ships.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate({ to: '/' })}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
