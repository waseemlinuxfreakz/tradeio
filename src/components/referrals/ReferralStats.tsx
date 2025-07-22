import React from 'react';
import { Users, Signal, Wallet, Award, Share2 } from 'lucide-react';

interface ReferralStatsProps {
  systemReferrals: {
    total: number;
    active: number;
    earnings: string;
    commission: string;
  };
  signalReferrals: {
    total: number;
    active: number;
    earnings: string;
    commission: string;
    totalShares: number;
  };
  activeTab: string;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ 
  systemReferrals, 
  signalReferrals,
  activeTab
}) => {
  if (activeTab === 'system') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-400">Total Referrals</span>
          </div>
          <div className="text-xl font-bold text-blue-500">{systemReferrals.total}</div>
          <div className="text-xs text-slate-400 mt-1">{systemReferrals.active} active users</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-slate-400">Commission Rate</span>
          </div>
          <div className="text-xl font-bold text-purple-500">{systemReferrals.commission}</div>
          <div className="text-xs text-slate-400 mt-1">Based on tier level</div>
        </div>

        <div className="col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-slate-400">Total Earnings</span>
          </div>
          <div className="text-xl font-bold text-emerald-500">{systemReferrals.earnings} TRT</div>
          <div className="text-xs text-slate-400 mt-1">From referral commissions</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Share2 className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-slate-400">Total Shares</span>
        </div>
        <div className="text-xl font-bold text-blue-500">{signalReferrals.totalShares}</div>
        <div className="text-xs text-slate-400 mt-1">{signalReferrals.active} active shares</div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Signal className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-slate-400">Profit Share</span>
        </div>
        <div className="text-xl font-bold text-purple-500">{signalReferrals.commission}</div>
        <div className="text-xs text-slate-400 mt-1">Of referred profits</div>
      </div>

      <div className="col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-slate-400">Total Earnings</span>
        </div>
        <div className="text-xl font-bold text-emerald-500">{signalReferrals.earnings} TRT</div>
        <div className="text-xs text-slate-400 mt-1">From shared signals</div>
      </div>
    </div>
  );
};

export default ReferralStats;