import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gift, BarChart2, ArrowUpCircle, Home, Wallet, Menu } from 'lucide-react';
import { useMenuStore } from '../lib/store';

interface NavigationBarProps {
  onQuickAction?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onQuickAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useMenuStore();

  const isHomePage = location.pathname === '/dashboard';

  const handleCenterClick = () => {
    if (isHomePage && onQuickAction) {
      onQuickAction();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[999]">
      <div className="bg-slate-800/70 backdrop-blur-sm rounded-full py-4 px-8 border border-slate-700/50 flex justify-between items-center">
        <button 
          onClick={() => navigate('/personal')}
          className="hover:opacity-80 transition-opacity"
        >
          <Gift className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={() => navigate('/signals')}
          className="hover:opacity-80 transition-opacity"
        >
          <BarChart2 className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={handleCenterClick}
          className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full -mt-8 hover:opacity-90 transition-opacity"
        >
          {isHomePage ? (
            <ArrowUpCircle className="w-6 h-6 text-white" />
          ) : (
            <Home className="w-6 h-6 text-white" />
          )}
        </button>
        <button 
          onClick={() => navigate('/portfolio')}
          className="hover:opacity-80 transition-opacity"
        >
          <Wallet className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={actions.open}
          className="hover:opacity-80 transition-opacity"
        >
          <Menu className="w-6 h-6 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;