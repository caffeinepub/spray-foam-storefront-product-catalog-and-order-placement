import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'John M.',
      location: 'Winnipeg, MB',
      rating: 5,
      text: 'Outstanding service! Our heating bills dropped by 40% after they insulated our attic. The crew was professional and cleaned up perfectly.',
    },
    {
      name: 'Sarah T.',
      location: 'Thunder Bay, ON',
      rating: 5,
      text: 'Best investment we made in our home. The difference in comfort is incredible, and the team was knowledgeable and efficient.',
    },
    {
      name: 'Mike R.',
      location: 'Brandon, MB',
      rating: 5,
      text: 'From quote to completion, everything was seamless. Highly recommend Foam Daddy for anyone looking to improve their insulation.',
    },
  ];

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.location}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
