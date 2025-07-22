import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, ChevronRight, Shield, Gift } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: CreditCard,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Pay with TON, BTC, ETH, or USDT',
      icon: Wallet,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      price: '49',
      period: 'month',
      features: [
        'Access to all signals',
        'Basic analytics',
        'Community chat access',
        '24/7 support'
      ],
      recommended: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '99',
      period: 'month',
      features: [
        'Everything in Starter',
        'Advanced analytics',
        'Priority signals',
        'Personal signal advisor',
        'Custom alerts'
      ],
      recommended: true
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Payment</h1>
          </div>
        </div>

        {/* Packages */}
        <div className="p-4 grid gap-4">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                pkg.recommended ? 'border-pink-500/50' : 'border-slate-700/50'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-medium">
                  Recommended
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold">${pkg.price}</span>
                    <span className="text-sm text-slate-400">/{pkg.period}</span>
                  </div>
                </div>
                <Gift className="w-6 h-6 text-pink-500" />
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setSelectedMethod('card')}
                className={`w-full py-3 rounded-xl font-medium ${
                  pkg.recommended
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
                    : 'bg-slate-700/50 hover:bg-slate-700'
                } transition-all`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border ${
                  selectedMethod === method.id ? 'border-pink-500/50' : 'border-slate-700/50'
                } hover:bg-slate-800/70 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${method.bgColor} flex items-center justify-center`}>
                    <method.icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-slate-400">{method.description}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="p-4 mt-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-slate-400">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentPage;