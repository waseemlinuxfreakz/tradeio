import React, { useState } from 'react';
import { Award, TrendingUp, TrendingDown, Info, ChevronRight, Star } from 'lucide-react';
import ReputationPointsCard from '../signals/ReputationPointsCard';
import { getDecodedUserToken } from '../../utils';
import useAchievementDetails from '../../hooks/useAchievementDetails';

interface ReputationPointsInfoProps {
  compact?: boolean;
  showDetails?: boolean;
}

const ReputationPointsInfo = ({ 
  compact = false,
  showDetails = true
}:ReputationPointsInfoProps) => {
  const [showInfoCard, setShowInfoCard] = useState(false);
  const user = getDecodedUserToken();
  const {achievementData} = useAchievementDetails(user!.userId)
  const points = achievementData?.data?.stats?.reputationPoints;
  if (!points) return null;
  // Determine reputation level based on points
  const getReputationLevel = (points: number) => {
    if (points >= 500) return { level: 'Expert', color: 'text-emerald-500' };
    if (points >= 200) return { level: 'Advanced', color: 'text-blue-500' };
    if (points >= 100) return { level: 'Intermediate', color: 'text-purple-500' };
    return { level: 'Beginner', color: 'text-slate-400' };
  };
  
  const { level, color } = getReputationLevel(points);
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-pink-500" />
        <div className="flex items-center gap-1">
          <span className="font-medium">{points}</span>
          <span className="text-sm text-slate-400">points</span>
        </div>
        <span className={`text-xs ${color}`}>{level}</span>
        {showDetails && (
          <button 
            onClick={() => setShowInfoCard(true)}
            className="p-1 rounded-full hover:bg-slate-800/50"
          >
            <Info className="w-4 h-4 text-slate-400" />
          </button>
        )}
        
        {showInfoCard && (
          <ReputationPointsCard 
            isOpen={showInfoCard}
            onClose={() => setShowInfoCard(false)}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-pink-500" />
          <h3 className="font-medium">Reputation Points</h3>
        </div>
        {showDetails && (
          <button 
            onClick={() => setShowInfoCard(true)}
            className="p-1 rounded-full hover:bg-slate-800/50"
          >
            <Info className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{points}</div>
          <div className={`text-sm ${color}`}>{level} Trader</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-slate-400">Points Earned</span>
          </div>
          <div className="text-lg font-bold text-emerald-500">+125</div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-slate-400">Points Lost</span>
          </div>
          <div className="text-lg font-bold text-rose-500">-25</div>
        </div>
      </div>
      
      {showDetails && (
        <button
          onClick={() => setShowInfoCard(true)}
          className="w-full mt-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Info className="w-4 h-4" />
          How Points Work
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      
      {showInfoCard && (
        <ReputationPointsCard 
          isOpen={showInfoCard}
          onClose={() => setShowInfoCard(false)}
        />
      )}
    </div>
  );
};

export default ReputationPointsInfo;