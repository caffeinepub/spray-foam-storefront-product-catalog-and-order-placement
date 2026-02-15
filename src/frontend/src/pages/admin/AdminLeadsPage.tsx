import { useState } from 'react';
import { useGetQuotes, useUpdateQuote } from '../../hooks/useAdminLeads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { QuoteStatus, type ServiceQuote } from '../../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AdminLeadsPage() {
  const { data: quotes, isLoading, error } = useGetQuotes();
  const { mutate: updateQuote, isPending: isUpdating } = useUpdateQuote();
  const [selectedQuote, setSelectedQuote] = useState<ServiceQuote | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const getStatusBadgeVariant = (status: QuoteStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case QuoteStatus.received:
        return 'default';
      case QuoteStatus.in_progress:
        return 'secondary';
      case QuoteStatus.completed:
        return 'outline';
      case QuoteStatus.rejected:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.received:
        return 'New';
      case QuoteStatus.in_progress:
        return 'In Progress';
      case QuoteStatus.completed:
        return 'Completed';
      case QuoteStatus.rejected:
        return 'Rejected';
      default:
        return status;
    }
  };

  const handleStatusChange = (quoteId: bigint, quote: ServiceQuote, newStatus: string) => {
    updateQuote({
      id: quoteId,
      update: {
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        message: quote.message,
        serviceType: quote.serviceType,
        adminNotes: quote.adminNotes,
        status: newStatus as QuoteStatus,
      },
    });
  };

  const handleSaveNotes = () => {
    if (!selectedQuote) return;
    
    updateQuote({
      id: selectedQuote.id,
      update: {
        name: selectedQuote.name,
        email: selectedQuote.email,
        phone: selectedQuote.phone,
        address: selectedQuote.address,
        message: selectedQuote.message,
        serviceType: selectedQuote.serviceType,
        adminNotes: adminNotes,
        status: selectedQuote.status,
      },
    });
    setSelectedQuote(null);
    setAdminNotes('');
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load quote requests. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  const sortedQuotes = quotes ? [...quotes].sort((a, b) => Number(b.createdTime - a.createdTime)) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-muted-foreground">Manage service quote requests and customer inquiries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            {quotes?.length || 0} total inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedQuotes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No quote requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedQuotes.map((quote) => (
                    <TableRow key={quote.id.toString()}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(quote.createdTime)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{quote.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {quote.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate">{quote.email}</span>
                            </div>
                          )}
                          {quote.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{quote.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {quote.address.city && quote.address.state
                              ? `${quote.address.city}, ${quote.address.state}`
                              : 'Not provided'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{quote.serviceType || 'General'}</span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={quote.status}
                          onValueChange={(value) => handleStatusChange(quote.id, quote, value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              <Badge variant={getStatusBadgeVariant(quote.status)}>
                                {getStatusLabel(quote.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={QuoteStatus.received}>New</SelectItem>
                            <SelectItem value={QuoteStatus.in_progress}>In Progress</SelectItem>
                            <SelectItem value={QuoteStatus.completed}>Completed</SelectItem>
                            <SelectItem value={QuoteStatus.rejected}>Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedQuote(quote);
                                setAdminNotes(quote.adminNotes);
                              }}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Quote Request Details</DialogTitle>
                              <DialogDescription>
                                Submitted on {formatDate(quote.createdTime)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label className="text-sm font-semibold">Customer Name</Label>
                                  <p className="text-sm">{quote.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-semibold">Service Type</Label>
                                  <p className="text-sm">{quote.serviceType || 'General Inquiry'}</p>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label className="text-sm font-semibold">Email</Label>
                                  <p className="text-sm">{quote.email || 'Not provided'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-semibold">Phone</Label>
                                  <p className="text-sm">{quote.phone || 'Not provided'}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-semibold">Service Address</Label>
                                <p className="text-sm">
                                  {quote.address.street && `${quote.address.street}, `}
                                  {quote.address.city && `${quote.address.city}, `}
                                  {quote.address.state && `${quote.address.state} `}
                                  {quote.address.zip && quote.address.zip}
                                  {quote.address.country && `, ${quote.address.country}`}
                                  {!quote.address.street && !quote.address.city && 'Not provided'}
                                </p>
                              </div>

                              <div>
                                <Label className="text-sm font-semibold">Project Description</Label>
                                <p className="text-sm whitespace-pre-wrap rounded-md bg-muted p-3">
                                  {quote.message}
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="adminNotes" className="text-sm font-semibold">
                                  Admin Notes
                                </Label>
                                <Textarea
                                  id="adminNotes"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add internal notes about this quote..."
                                  rows={4}
                                  className="mt-2"
                                />
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedQuote(null)}>
                                  Close
                                </Button>
                                <Button onClick={handleSaveNotes} disabled={isUpdating}>
                                  {isUpdating ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    'Save Notes'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
