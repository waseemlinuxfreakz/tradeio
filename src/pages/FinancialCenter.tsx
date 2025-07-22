import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Search,
  Bell,
  Home,
  Menu,
  Shield,
  BarChart2,
  Lock,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useMenuStore } from '../lib/menuStore';
import NavigationBar from '../components/NavigationBar';
import PageTransition from '../components/PageTransition';

const FinancialCenter = () => {
  const navigate = useNavigate();
  const { open } = useMenuStore();
  const [currentView, setCurrentView] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'assets', label: 'Portfolio', icon: Wallet },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'staking', label: 'Staking', icon: Lock }
  ];

  const data = {
    totalBalance: '45,678.90',
    change: '+1,234.56',
    changePercent: '+2.78%',
    alerts: 2,
    stakedAmount: '8,500.00',
    rewards: '345.78',
    nextReward: '2d 14h',
    assets: [
      {
        id: 1,
        name: 'TRTest',
        amount: '15,234.56',
        value: '15,234.56',
        change: '+2.3%',
        hasAlert: true
      },
      {
        id: 2,
        name: 'BTC',
        amount: '0.45',
        value: '18,234.67',
        change: '+1.8%'
      }
    ]
  };

  return (
    <PageTransition>
      <div className="bg-slate-900 min-h-screen text-white pb-20">
        {/* Header Section */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Financial Center</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Balance:</span>
                  <span className="font-medium">${data.totalBalance}</span>
                  <span className={`flex items-center ${
                    data.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {data.changePercent}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {data.alerts > 0 && (
                <button className="relative p-2 rounded-lg bg-rose-500/10">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center">
                    {data.alerts}
                  </span>
                </button>
              )}
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-sm">
                <Shield className="w-4 h-4" />
                Protected
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-3">
              <Lock className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm text-slate-400">Total Staked</div>
                <div className="font-bold">${data.stakedAmount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-3">
              <Gift className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-sm text-slate-400">Next Reward</div>
                <div className="font-bold">{data.nextReward}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="p-4 flex gap-2 overflow-x-auto hide-scrollbar">
          {navigation.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                  : 'bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <button className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <ArrowUpRight className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-sm font-medium">Deposit</div>
            <div className="text-xs text-slate-400 mt-1">Add Funds</div>
          </button>

          <button className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <ArrowLeftRight className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-sm font-medium">Trade</div>
            <div className="text-xs text-slate-400 mt-1">Exchange</div>
          </button>

          <button className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-sm font-medium">Stake</div>
            <div className="text-xs text-slate-400 mt-1">Earn Rewards</div>
          </button>
        </div>

        {/* Assets List */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Assets</h2>
            <button className="p-2 rounded-lg bg-slate-800/50">
              <Search className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-3">
            {data.assets.map(asset => (
              <button
                key={asset.id}
                onClick={() => setExpandedCard(asset.id)}
                className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-600/10 p-0.5">
                      <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${asset.name}`} alt={asset.name} className="w-full h-full rounded-full" />
                    </div>
                    <div>
                      <div className="font-bold">{asset.name}</div>
                      <div className="text-sm text-slate-400">{asset.amount}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${asset.value}</div>
                    <div className={`text-sm ${
                      asset.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {asset.change}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Bar */}
        <NavigationBar onQuickAction={() => navigate('/wallet')} />
      </div>
    </PageTransition>
  );
};

export default FinancialCenter;