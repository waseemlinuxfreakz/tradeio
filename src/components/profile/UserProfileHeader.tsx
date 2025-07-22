import React from 'react';
import { Star, Shield, Award, Users } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { getUserReputationPoints, getUserBadges } from '../../lib/reputationSystem';
import ReputationPointsInfo from './ReputationPointsInfo';

interface UserProfileHeaderProps {
  showReputationDetails?: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ showReputationDetails = true }) => {
  const { user } = useAuthStore();
  const points = getUserReputationPoints();
  const badges = getUserBadges().filter(badge => badge.earned);
  
  // Determine reputation level based on points
  const getReputationLevel = (points: number) => {
    if (points >= 500) return { level: 'Expert', color: 'text-emerald-500' };
    if (points >= 200) return { level: 'Advanced', color: 'text-blue-500' };
    if (points >= 100) return { level: 'Intermediate', color: 'text-purple-500' };
    return { level: 'Beginner', color: 'text-slate-400' };
  };
  
  const { level, color } = getReputationLevel(points);
  
  return (
    <div className="p-6 bg-slate-800/30">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces"
              alt={user?.email}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.email || 'User'}</h2>
          <div className="flex items-center gap-2 mt-1">
            {badges.length > 0 ? (
              badges.slice(0, 2).map((badge) => (
                <div key={badge.id} className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {badge.name}
                </div>
              ))
            ) : (
              <div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block">
                Trader
              </div>
            )}
            
            {badges.length > 2 && (
              <div className="text-xs text-slate-400">+{badges.length - 2} more</div>
            )}
          </div>
          <div className={`text-sm ${color} mt-1`}>{level} Trader</div>
        </div>
      </div>
      
      {showReputationDetails && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-pink-500" />
              <span className="text-xs text-slate-400">Reputation</span>
            </div>
            <div className="text-lg font-bold">{points}</div>
            <div className="text-xs text-pink-400">points</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-400">Badges</span>
            </div>
            <div className="text-lg font-bold">{badges.length}</div>
            <div className="text-xs text-purple-400">earned</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-400">Invites</span>
            </div>
            <div className="text-lg font-bold">3</div>
            <div className="text-xs text-blue-400">referrals</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;