import React from 'react';
import { Star, Award, TrendingUp, Signal } from 'lucide-react';

interface TopContributorCardProps {
  name: string;
  image: string;
  badge: string;
  stats: {
    signals: number;
    successRate: string;
    impact: string;
  };
  onClick?: () => void;
}

const TopContributorCard: React.FC<TopContributorCardProps> = ({
  name,
  image,
  badge,
  stats,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
            <img 
              src={image}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>

        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
            {badge}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mb-1">
            <Signal className="w-4 h-4" />
            Signals
          </div>
          <div className="font-medium">{stats.signals}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mb-1">
            <Award className="w-4 h-4" />
            Success
          </div>
          <div className="font-medium text-emerald-500">{stats.successRate}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            Impact
          </div>
          <div className="font-medium text-blue-500">{stats.impact}</div>
        </div>
      </div>
    </div>
  );
};

export default TopContributorCard;