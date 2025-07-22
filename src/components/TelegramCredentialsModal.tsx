import React, { useState } from 'react';
import { Mail, Lock, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../lib/store';

const TelegramCredentialsModal = () => {
  const { actions, loading, error, showCredentialsModal } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!showCredentialsModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actions.completeTelegramLogin({ email, password });
    } catch (error) {
      console.error('Telegram login failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md relative animate-slide-in">
        <button
          onClick={actions.hideCredentialsModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
        <p className="text-slate-400 mb-6">Please enter your credentials to complete Telegram login</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Complete Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TelegramCredentialsModal;