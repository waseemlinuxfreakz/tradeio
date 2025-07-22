import React from 'react';
import { Star, Settings, Bell, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalystProfileProps {
  name: string;
  image: string;
  badge: string;
}

const AnalystProfile: React.FC<AnalystProfileProps> = ({ name, image, badge }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate(`/analyst/${name.toLowerCase().replace(' ', '-')}`)}
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
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
            <div className="text-slate-400">Signal by</div>
            <div className="text-lg font-bold">{name}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">
                {badge}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/create-signal')}
            className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-400" />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalystProfile;