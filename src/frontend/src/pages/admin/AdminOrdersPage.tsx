import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useAdminOrders';
import { OrderStatus } from '../../backend';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  processing: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  shipped: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  delivered: 'bg-green-500/10 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: bigint, newStatus: OrderStatus) => {
    updateStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => toast.success('Order status updated'),
        onError: () => toast.error('Failed to update order status'),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Orders</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id.toString()}>
                    <TableCell className="font-medium">#{order.id.toString()}</TableCell>
                    <TableCell>{order.profile.name}</TableCell>
                    <TableCell>{order.profile.email || order.profile.phone}</TableCell>
                    <TableCell>{order.productIds.length}</TableCell>
                    <TableCell className="font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge
                              variant="outline"
                              className={statusColors[order.status] || ''}
                            >
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(Number(order.orderTime) / 1000000).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
