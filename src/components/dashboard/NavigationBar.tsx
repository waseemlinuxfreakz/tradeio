import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, ArrowUpCircle, Bell, Menu } from 'lucide-react';
import { useSideMenuStore } from '../../lib/store';

interface NavigationBarProps {
  onQuickTrade?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onQuickTrade }) => {
  const navigate = useNavigate();
  const { actions } = useSideMenuStore();

  return (
    <div className="fixed bottom-6 left-4 right-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-full py-4 px-8 border border-slate-700/50 flex justify-between items-center">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="hover:opacity-80 transition-opacity"
        >
          <Home className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={() => navigate('/signals')} 
          className="hover:opacity-80 transition-opacity"
        >
          <BarChart2 className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={onQuickTrade}
          className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full -mt-8 hover:opacity-90 transition-opacity"
        >
          <ArrowUpCircle className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={() => navigate('/notifications')} 
          className="hover:opacity-80 transition-opacity"
        >
          <Bell className="w-6 h-6 text-slate-400" />
        </button>
        <button 
          onClick={() => actions.openMenu()}
          className="hover:opacity-80 transition-opacity"
        >
          <Menu className="w-6 h-6 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;