import React from 'react';
import { Star, Bell, Plus, Settings } from 'lucide-react';

interface SignalProfileProps {
  name: string;
  image: string;
  badge: string;
  onNotification: () => void;
  onSettings: () => void;
  onAdd: () => void;
}

const SignalProfile: React.FC<SignalProfileProps> = ({
  name,
  image,
  badge,
  onNotification,
  onSettings,
  onAdd
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
              <img 
                src={image}
                alt={name} 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Signal by</div>
            <div className="text-base font-bold">{name}</div>
            <div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
              {badge}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onAdd} className="p-2 rounded-full hover:bg-slate-800/50">
            <Plus className="w-5 h-5 text-pink-500" />
          </button>
          <button onClick={onNotification} className="p-2 rounded-full hover:bg-slate-800/50">
            <Bell className="w-5 h-5 text-slate-400" />
          </button>
          <button onClick={onSettings} className="p-2 rounded-full hover:bg-slate-800/50">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalProfile;