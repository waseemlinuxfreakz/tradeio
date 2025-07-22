import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Globe, Phone, Send } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NavigationBar from '../components/NavigationBar';

const SupportPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: () => window.open(`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT}`, "_blank"),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@traderate.io',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => window.location.href = 'mailto:support@traderate.io'
    },
    {
      icon: Globe,
      title: 'Help Center',
      description: 'Browse our knowledge base',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      action: () => console.log('Open help center')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Support</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Support Options */}
          {supportOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${option.bgColor} flex items-center justify-center`}>
                  <option.icon className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-slate-400">{option.description}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-lg font-bold mb-4">Send us a message</h2>
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full h-32 bg-slate-700/30 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </form>

          {/* FAQ Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-slate-700/50 pb-4">
                <h3 className="font-medium mb-2">How do I get started?</h3>
                <p className="text-sm text-slate-400">
                  Create an account, complete verification, and start exploring signals from our community.
                </p>
              </div>
              <div className="border-b border-slate-700/50 pb-4">
                <h3 className="font-medium mb-2">How do rewards work?</h3>
                <p className="text-sm text-slate-400">
                  Earn TRT tokens by sharing successful signals and building your reputation in the community.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is my data secure?</h3>
                <p className="text-sm text-slate-400">
                  Yes, we use industry-standard encryption and security measures to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <NavigationBar onQuickAction={() => navigate('/create-signal')} />
      </div>
    </PageTransition>
  );
};

export default SupportPage;