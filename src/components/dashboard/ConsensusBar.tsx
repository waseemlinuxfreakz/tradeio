import React from 'react';
import { Users, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ConsensusBarProps {
  communityConsensus: number;
  signalGroupConsensus: number;
  totalVotes: number;
  onVoteUp: () => void;
  onVoteDown: () => void;
}

const ConsensusBar: React.FC<ConsensusBarProps> = ({
  communityConsensus,
  signalGroupConsensus,
  totalVotes,
  onVoteUp,
  onVoteDown
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
      <div className="flex justify-between items-center p-4">
        <button 
          onClick={onVoteDown}
          className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
        >
          <ThumbsDown className="w-6 h-6 text-rose-500" />
        </button>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Community Consensus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Live</span>
              <span className="text-blue-500">{communityConsensus}% Positive</span>
            </div>
          </div>

          {/* Signal Group Consensus */}
          <div className="relative w-full h-1 bg-slate-700/50 rounded-full mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              style={{ width: `${signalGroupConsensus}%` }}
            />
          </div>

          {/* Community Consensus */}
          <div className="relative w-full h-1 bg-slate-700/50 rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              style={{ width: `${communityConsensus}%` }}
            />
          </div>

          <div className="flex justify-between text-xs mt-1">
            <span className="text-slate-400">top verified consensus</span>
            <span className="text-slate-400">{totalVotes.toLocaleString()} votes</span>
          </div>
        </div>

        <button 
          onClick={onVoteUp}
          className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
        >
          <ThumbsUp className="w-6 h-6 text-emerald-500" />
        </button>
      </div>
    </div>
  );
};

export default ConsensusBar;