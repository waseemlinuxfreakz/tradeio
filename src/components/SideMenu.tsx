import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Home, Signal, Wallet, Users, Gift, Award, FileText, Settings, LogOut } from 'lucide-react';
import { useSideMenuStore, useAuthStore } from '../lib/store';

const SideMenu = () => {
  const navigate = useNavigate();
  const { isOpen, actions } = useSideMenuStore();
  const { actions: authActions } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Signal, label: 'Signals', path: '/signals' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Gift, label: 'Referrals', path: '/referrals' },
    { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
    { icon: FileText, label: 'Whitepaper', path: '/whitepaper' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    actions.closeMenu();
  };

  const handleLogout = () => {
    authActions.logout();
    actions.closeMenu();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Traderate
          </h2>
          <button
            onClick={actions.closeMenu}
            className="p-2 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-slate-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;