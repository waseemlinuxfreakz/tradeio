import React, { useState } from 'react';
import { X, Check, TrendingUp, Clock, DollarSign, Percent } from 'lucide-react';

interface SignalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const SignalFilter = ({ isOpen, onClose, onApply }:SignalFilterProps) => {
  const [filters, setFilters] = useState({
    timeframe: 'all',
    profitRange: [0, 100],
    riskLevel: 'all',
    consensus: 50,
    verified: false,
    pairs: [] as string[]
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-slate-900 rounded-t-xl animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">סינון סיגנלים</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Time Frame */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">טווח זמן</label>
            <div className="grid grid-cols-4 gap-2">
              {['24h', '7d', '30d', 'All'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setFilters(prev => ({ ...prev, timeframe: tf }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium ${
                    filters.timeframe === tf
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Profit Range */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">טווח רווח צפוי</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.profitRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  profitRange: [prev.profitRange[0], parseInt(e.target.value)]
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>{filters.profitRange[0]}%</span>
                <span>{filters.profitRange[1]}%</span>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">רמת סיכון</label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setFilters(prev => ({ ...prev, riskLevel: risk }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium ${
                    filters.riskLevel === risk
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Consensus */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">קונצנזוס מינימלי</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.consensus}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  consensus: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>0%</span>
                <span>{filters.consensus}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Trading Pairs */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">זוגות מסחר</label>
            <div className="grid grid-cols-3 gap-2">
              {['BTC/USDT', 'ETH/USDT', 'TON/USDT'].map((pair) => (
                <button
                  key={pair}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    pairs: prev.pairs.includes(pair)
                      ? prev.pairs.filter(p => p !== pair)
                      : [...prev.pairs, pair]
                  }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium ${
                    filters.pairs.includes(pair)
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {pair}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Check className="w-5 h-5" />
            החל סינון
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalFilter;