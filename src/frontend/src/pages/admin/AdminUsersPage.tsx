import { useState } from 'react';
import { useAddAdminByEmail } from '../../hooks/useAdminUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UserPlus, Shield, Info } from 'lucide-react';

export default function AdminUsersPage() {
  const [email, setEmail] = useState('');
  const { mutate: addAdmin, isPending } = useAddAdminByEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    addAdmin(email.trim(), {
      onSuccess: () => {
        setEmail('');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage admin permissions and user roles</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Enter the email address of a user who has already logged in and created a profile. 
          The system will find their account and grant them admin permissions.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Grant Admin Permission
          </CardTitle>
          <CardDescription>
            Add admin role to an existing user by their email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
              <p className="text-sm text-muted-foreground">
                The user must have already logged in and created a profile with this email address.
              </p>
            </div>

            <Button type="submit" disabled={isPending || !email.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Granting Permission...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Admin Permission
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Only existing admins can grant admin permissions to other users.</p>
          <p>• The user must have logged in at least once and saved their profile with the email address.</p>
          <p>• Admin users have full access to manage products, orders, leads, and other users.</p>
          <p>• There is no way to revoke admin permissions through this interface currently.</p>
        </CardContent>
      </Card>
    </div>
  );
}
