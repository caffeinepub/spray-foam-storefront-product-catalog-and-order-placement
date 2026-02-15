import { Shield, Award, Leaf, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      label: 'Licensed & Insured',
      description: 'Fully certified professionals',
    },
    {
      icon: Award,
      label: 'Free Estimates',
      description: 'No obligation quotes',
    },
    {
      icon: Leaf,
      label: 'Energy Efficiency',
      description: 'Eco-friendly solutions',
    },
    {
      icon: Clock,
      label: 'Warranty Included',
      description: 'Quality guaranteed',
    },
  ];

  return (
    <section className="border-b bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{signal.label}</div>
                  <div className="text-xs text-muted-foreground">{signal.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
