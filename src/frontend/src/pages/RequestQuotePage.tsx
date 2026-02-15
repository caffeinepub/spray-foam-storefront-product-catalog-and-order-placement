import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRequestServiceQuote } from '../hooks/useServiceQuotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2, Phone, Mail } from 'lucide-react';

export default function RequestQuotePage() {
  const navigate = useNavigate();
  const { mutate: requestQuote, isPending, isSuccess } = useRequestServiceQuote();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Canada',
    serviceType: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Please provide either an email or phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please describe your project';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    requestQuote({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      serviceType: formData.serviceType || 'General Inquiry',
      message: formData.message,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (field === 'email' || field === 'phone') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contact;
        return newErrors;
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quote Request Received!</CardTitle>
            <CardDescription>
              Thank you for your interest in Cold Country Spray Foam. We've received your request and will contact you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription>
                One of our insulation specialists will review your project details and reach out to schedule a free on-site inspection and provide you with a detailed quote.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/' })} className="flex-1">
                Back to Home
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Request a Free Quote</h1>
          <p className="text-lg text-muted-foreground">
            Fill out the form below and we'll get back to you within 24 hours with a detailed estimate.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Tell us about your insulation needs and we'll provide a customized solution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Smith"
                    disabled={isPending}
                  />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="john@example.com"
                      disabled={isPending}
                    />
                    {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(204) 555-1234"
                      disabled={isPending}
                    />
                  </div>
                </div>
                {errors.contact && <p className="text-sm text-destructive">{errors.contact}</p>}
              </div>

              {/* Service Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Address</h3>
                
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="123 Main Street"
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Winnipeg"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Province/State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="MB"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="zip">Postal/Zip Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleChange('zip', e.target.value)}
                      placeholder="R3C 0A1"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Details</h3>
                
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleChange('serviceType', value)} disabled={isPending}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential Insulation">Residential Insulation</SelectItem>
                      <SelectItem value="Commercial Insulation">Commercial Insulation</SelectItem>
                      <SelectItem value="Attic Insulation">Attic Insulation</SelectItem>
                      <SelectItem value="Basement Insulation">Basement Insulation</SelectItem>
                      <SelectItem value="Wall Insulation">Wall Insulation</SelectItem>
                      <SelectItem value="New Construction">New Construction</SelectItem>
                      <SelectItem value="Retrofit">Retrofit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Project Description *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Please describe your project, including the area to be insulated, approximate square footage, and any specific requirements or concerns..."
                    rows={6}
                    disabled={isPending}
                  />
                  {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Request Free Quote
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: '/' })} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Need immediate assistance? Call us at <strong>(204) 555-FOAM</strong> or email{' '}
            <strong>info@coldcountryfoam.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
