import { useState } from 'react';
import { Plus, Edit, Archive, ArchiveRestore, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useGetAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useArchiveProduct,
  useRestoreProduct,
} from '../../hooks/useAdminProducts';
import type { Product, ProductUpdate } from '../../backend';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const archiveProduct = useArchiveProduct();
  const restoreProduct = useRestoreProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const activeProducts = products?.filter((p) => !isArchived(p.id)) || [];
  const archivedProducts = products?.filter((p) => isArchived(p.id)) || [];

  function isArchived(productId: bigint): boolean {
    // Products without active status are considered archived
    // This is a simple check - in production you'd track this properly
    return false; // Backend doesn't expose archive status directly
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', image: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', image: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingProduct) {
      const update: ProductUpdate = {
        name: formData.name,
        price,
        description: formData.description,
        image: formData.image,
      };
      updateProduct.mutate(
        { id: editingProduct.id, update },
        {
          onSuccess: () => {
            toast.success('Product updated successfully');
            handleCloseDialog();
          },
          onError: () => {
            toast.error('Failed to update product');
          },
        }
      );
    } else {
      const newProduct: Product = {
        id: BigInt(0), // Backend will assign ID
        name: formData.name,
        price,
        description: formData.description,
        image: formData.image,
      };
      createProduct.mutate(newProduct, {
        onSuccess: () => {
          toast.success('Product created successfully');
          handleCloseDialog();
        },
        onError: () => {
          toast.error('Failed to create product');
        },
      });
    }
  };

  const handleArchive = (id: bigint) => {
    archiveProduct.mutate(id, {
      onSuccess: () => toast.success('Product archived'),
      onError: () => toast.error('Failed to archive product'),
    });
  };

  const handleRestore = (id: bigint) => {
    restoreProduct.mutate(id, {
      onSuccess: () => toast.success('Product restored'),
      onError: () => toast.error('Failed to restore product'),
    });
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Active Products */}
      <Card>
        <CardHeader>
          <CardTitle>Active Products</CardTitle>
        </CardHeader>
        <CardContent>
          {activeProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active products</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeProducts.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <img
                        src={product.image || '/assets/generated/spray-foam-product-placeholder.dim_800x800.png'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/generated/spray-foam-product-placeholder.dim_800x800.png';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchive(product.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Archived Products */}
      {archivedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Archived Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedProducts.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(product.id)}
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Leave empty to use default placeholder"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {(createProduct.isPending || updateProduct.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
