import React from 'react';
import { TrendingUp, TrendingDown, Award, Star, AlertTriangle } from 'lucide-react';

interface ReputationPointsCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReputationPointsCard: React.FC<ReputationPointsCardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-pink-500/10 overflow-hidden mt-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold">Reputation Point System</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            How points are earned and lost in the Traderate system
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Point System Overview</span>
            </h3>
            
            <p className="text-sm text-slate-300 mb-4">
              Your reputation points determine your influence in the system and whether you qualify as a validator.
              Points are earned or lost based on your signal creation and voting accuracy.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Validator Status:</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                  Top 10% of Users
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Your Current Points:</span>
                <span className="text-lg font-bold text-pink-500">85</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Your Rank:</span>
                <span className="text-sm">125 / 1250 users</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Points Earned</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                <div>
                  <div className="font-medium">Signal is successful</div>
                  <div className="text-xs text-slate-400">When your created signal reaches its target</div>
                </div>
                <div className="text-lg font-bold text-emerald-500">+20</div>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                <div>
                  <div className="font-medium">Positive vote on successful signal</div>
                  <div className="text-xs text-slate-400">When you vote positively on a signal that succeeds</div>
                </div>
                <div className="text-lg font-bold text-emerald-500">+5</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Negative vote on unsuccessful signal</div>
                  <div className="text-xs text-slate-400">When you correctly vote against a bad signal</div>
                </div>
                <div className="text-lg font-bold text-emerald-500">+5</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              <span>Points Lost</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                <div>
                  <div className="font-medium">Signal is unsuccessful</div>
                  <div className="text-xs text-slate-400">When your created signal fails to reach its target</div>
                </div>
                <div className="text-lg font-bold text-rose-500">-20</div>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                <div>
                  <div className="font-medium">Positive vote on unsuccessful signal</div>
                  <div className="text-xs text-slate-400">When you vote positively on a signal that fails</div>
                </div>
                <div className="text-lg font-bold text-rose-500">-5</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Negative vote on successful signal</div>
                  <div className="text-xs text-slate-400">When you incorrectly vote against a good signal</div>
                </div>
                <div className="text-lg font-bold text-rose-500">-5</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Important Notes</h3>
            </div>
            
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                <span>Points are calculated and updated when a signal is completed (reaches take profit or stop loss).</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                <span>Validator status is recalculated daily based on the top 10% of users by reputation points.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                <span>Consistently accurate voting and signal creation is the fastest way to increase your reputation.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReputationPointsCard;