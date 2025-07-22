import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  Wallet, 
  TrendingUp, 
  Clock,
  Award,
  Gift,
  ArrowUpRight
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NavigationBar from '../components/NavigationBar';

const StakingPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const stakingStats = {
    totalStaked: '5,678.90',
    availableBalance: '1,234.56',
    currentAPY: '12.5',
    rewardsEarned: '345.67',
    lockPeriod: '30'
  };

  const stakingTiers = [
    {
      name: 'Bronze',
      minStake: '1,000',
      apy: '8',
      lockPeriod: '30',
      benefits: ['Basic signal access', 'Community voting']
    },
    {
      name: 'Silver',
      minStake: '5,000',
      apy: '12',
      lockPeriod: '60',
      benefits: ['Premium signals', 'Enhanced voting power', 'Reduced fees']
    },
    {
      name: 'Gold',
      minStake: '10,000',
      apy: '15',
      lockPeriod: '90',
      benefits: ['VIP signals', 'Maximum voting power', 'Zero fees', 'Priority support']
    }
  ];

  const rewardHistory = [
    {
      id: 1,
      type: 'Staking',
      amount: '+25.50',
      time: '2h ago'
    },
    {
      id: 2,
      type: 'Signal Bonus',
      amount: '+12.75',
      time: '1d ago'
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
            <h1 className="text-lg font-bold">Staking</h1>
          </div>
        </div>

        {/* Staking Overview */}
        <div className="p-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Total Staked</h2>
                <div className="text-2xl font-bold">{stakingStats.totalStaked} TRADE</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Available Balance</div>
                <div className="text-xl font-bold">{stakingStats.availableBalance} TRADE</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Current APY</div>
                <div className="text-xl font-bold text-emerald-500">{stakingStats.currentAPY}%</div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTier('Silver')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Stake Tokens
            </button>
          </div>
        </div>

        {/* Reward Tiers */}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3">Reward Tiers</h2>
          <div className="space-y-2">
            {stakingTiers.map((tier) => (
              <div 
                key={tier.name}
                onClick={() => setSelectedTier(tier.name)}
                className={`p-4 rounded-xl border ${
                  selectedTier === tier.name 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/30' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className={`w-5 h-5 ${
                      tier.name === 'Gold' ? 'text-yellow-500' :
                      tier.name === 'Silver' ? 'text-slate-400' :
                      'text-orange-500'
                    }`} />
                    <div>
                      <div className="font-medium">{tier.name}</div>
                      <div className="text-sm text-slate-400">{tier.minStake} TRADE min</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-emerald-400">{tier.apy}% APY</div>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {tier.benefits.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rewards */}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3">Recent Rewards</h2>
          <div className="space-y-2">
            {rewardHistory.map((reward) => (
              <div key={reward.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{reward.type} Reward</div>
                    <div className="text-sm text-slate-400">{reward.time}</div>
                  </div>
                  <div className="text-emerald-500 font-medium">{reward.amount} TRADE</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <NavigationBar onQuickAction={() => navigate('/create-signal')} />
      </div>
    </PageTransition>
  );
};

export default StakingPage;