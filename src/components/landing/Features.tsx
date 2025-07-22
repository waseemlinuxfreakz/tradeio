import React from 'react';
import { Shield, Users, BarChart2, Signal } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain-Verified Signals',
      description: 'Every trading signal is verified on the blockchain for complete transparency and trust.',
      iconColor: 'text-pink-500',
      iconBgColor: 'bg-pink-500/10'
    },
    {
      icon: Users,
      title: 'Community Intelligence',
      description: 'Leverage collective wisdom through our unique dual voting mechanism.',
      iconColor: 'text-purple-500',
      iconBgColor: 'bg-purple-500/10'
    },
    {
      icon: BarChart2,
      title: 'Real-time Analytics',
      description: 'Track performance and analyze market trends with advanced tools.',
      iconColor: 'text-blue-500',
      iconBgColor: 'bg-blue-500/10'
    },
    {
      icon: Signal,
      title: 'Automated Trading',
      description: 'Set your preferences and let our platform execute trades automatically.',
      iconColor: 'text-emerald-500',
      iconBgColor: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="px-6 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Traderate</h2>
      <div className="grid gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Features;