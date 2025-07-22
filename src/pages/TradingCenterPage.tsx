import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  Signal as SignalIcon
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SignalCard from '../components/signals/SignalCard';
import SignalFilter from '../components/signals/SignalFilter';
import NavigationBar from '../components/NavigationBar';

const TradingCenterPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('active');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'active', label: 'Active', icon: SignalIcon },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  const signals = [
    {
      id: '1',
      pair: 'BTC/USDT',
      type: 'LONG',
      entry: '45,000',
      takeProfit: '48,500',
      stopLoss: '42,500',
      consensus: '89%',
      votes: 1250,
      time: '2h ago',
      analyst: {
        name: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces',
        badge: 'Top Analyst'
      }
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      type: 'SHORT',
      entry: '2,450',
      takeProfit: '2,250',
      stopLoss: '2,550',
      consensus: '92%',
      votes: 980,
      time: '4h ago',
      analyst: {
        name: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces',
        badge: 'Signal Expert'
      }
    }
  ];

  const handleCreateSignal = () => {
    navigate('/create-signal');
  };

  const handleSignalClick = (signalId: string) => {
    navigate(`/signal/${signalId}`);
  };

  const handleApplyFilters = (filters: any) => {
    setShowFilter(false);
  };

  const filteredSignals = signals.filter(signal =>
    signal.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    signal.analyst.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search signals..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              </div>
              <button 
                onClick={() => setShowFilter(true)}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={handleCreateSignal}
                className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Signal Grid */}
        <div className="p-4 space-y-4">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onClick={() => handleSignalClick(signal.id)}
              activeCategory={activeCategory}
              
            />
          ))}
        </div>

        {/* Navigation Bar */}
        <NavigationBar onQuickAction={handleCreateSignal} />

        {/* Filter Modal */}
        <SignalFilter
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilters}
        />
      </div>
    </PageTransition>
  );
};

export default TradingCenterPage;