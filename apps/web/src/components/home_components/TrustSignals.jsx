import React from 'react';
import { Shield, RotateCcw, Users, CreditCard } from 'lucide-react';

const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      text: 'Secure Payments',
      description: 'SSL encrypted checkout'
    },
    {
      icon: RotateCcw,
      text: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Users,
      text: 'Trusted by 10,000+',
      description: 'Happy customers worldwide'
    },
    {
      icon: CreditCard,
      text: 'Multiple Payment Options',
      description: 'Visa, Mastercard, UPI & more'
    }
  ];

  return (
    <div className="w-full bg-secondary py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <span className="text-primary">✔</span>
                    {signal.text}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {signal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Payment Logos */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-4">
            We accept
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-card rounded border border-border text-sm font-medium">
              VISA
            </div>
            <div className="px-4 py-2 bg-card rounded border border-border text-sm font-medium">
              Mastercard
            </div>
            <div className="px-4 py-2 bg-card rounded border border-border text-sm font-medium">
              UPI
            </div>
            <div className="px-4 py-2 bg-card rounded border border-border text-sm font-medium">
              PayPal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;