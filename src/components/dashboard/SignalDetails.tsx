import React from 'react';
import { ChevronRight, Star } from 'lucide-react';

interface SignalStats {
  signals: number;
  followers: string;
  success: string;
}

interface Signal {
  id: string;
  name: string;
  type: string;
  stats: SignalStats;
}

interface SignalDetailsProps {
  signals: Signal[];
  onSignalClick: (id: string) => void;
}

const SignalDetails: React.FC<SignalDetailsProps> = ({ signals, onSignalClick }) => {
  return (
    <div className="p-4 space-y-4">
      {signals.map((signal) => (
        <div 
          key={signal.id}
          onClick={() => onSignalClick(signal.id)}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
                  <img 
                    src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces`}
                    alt={signal.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <div className="font-medium">{signal.name}</div>
                <div className="text-xs text-pink-400">{signal.type}</div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-slate-400">{signal.stats.signals} signals</span>
                  <span className="text-sm text-slate-400">{signal.stats.followers} followers</span>
                  <span className="text-sm text-emerald-400">{signal.stats.success} success</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignalDetails;