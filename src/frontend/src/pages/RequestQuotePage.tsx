import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRequestServiceQuote } from '../hooks/useServiceQuotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2, Phone } from 'lucide-react';

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'Province/State is required';
    if (!formData.zip.trim()) newErrors.zip = 'Postal/ZIP code is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.message.trim()) newErrors.message = 'Project description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

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
      serviceType: formData.serviceType,
      message: formData.message,
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quote Request Received!</CardTitle>
            <CardDescription>
              Thank you for your interest in Foam Daddy. We'll review your request and contact you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Request a Free Quote</h1>
        <p className="text-lg text-muted-foreground">
          Fill out the form below and we'll get back to you with a detailed estimate for your project.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Tell us about your insulation needs and we'll provide a customized quote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(204) 555-1234"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>

            {/* Service Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Address</h3>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  placeholder="123 Main Street"
                />
                {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Winnipeg"
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="MB"
                  />
                  {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal/ZIP Code *</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    placeholder="R3C 0A1"
                  />
                  {errors.zip && <p className="text-sm text-destructive">{errors.zip}</p>}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleChange('serviceType', value)}>
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-attic">Residential - Attic</SelectItem>
                    <SelectItem value="residential-walls">Residential - Walls</SelectItem>
                    <SelectItem value="residential-basement">Residential - Basement</SelectItem>
                    <SelectItem value="commercial">Commercial Building</SelectItem>
                    <SelectItem value="agricultural">Agricultural Building</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Project Description *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Please describe your project, including approximate square footage and any specific requirements..."
                  rows={5}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Request Free Quote
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Prefer to speak with us directly? Give us a call!
        </p>
        <a href="tel:2045265420" className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
          <Phone className="h-5 w-5" />
          204 526 5420
        </a>
      </div>
    </div>
  );
}
