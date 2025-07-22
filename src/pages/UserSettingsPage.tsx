import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '../lib/menuStore';
import {
  Star,
  ArrowLeft,
  Bell,
  Wallet,
  Settings,
  Globe,
  Shield,
  Sliders,
  AlertCircle,
  ChevronRight,
  Power,
  Lock,
  User,
  AtSign,
  Image,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Clock,
  TrendingUp,
  BarChart2,
  Scale,
  PieChart,
  Timer,
  DollarSign,
  Percent,
  Hash,
  ChevronDown,
  Menu
} from 'lucide-react';

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { open: openMenu } = useMenuStore();
  const [profileCompletion, setProfileCompletion] = useState(50);
  const [activeTab, setActiveTab] = useState('basic');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ... rest of your existing state ...

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Edit Profile</h1>
          </div>
          <button 
            onClick={openMenu}
            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Rest of your existing JSX */}
    </div>
  );
};

export default UserSettingsPage;