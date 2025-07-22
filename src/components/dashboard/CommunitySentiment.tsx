import React from 'react';
import { Users } from 'lucide-react';

interface CommunitySentimentProps {
  signalId?: string;
}

const CommunitySentiment: React.FC<CommunitySentimentProps> = ({ signalId = 'default' }) => {
  const consensusData = {
    signalGroup: {
      consensus: 92.4,
      analysts: 238,
      sentiment: 'Bullish'
    },
    community: {
      consensus: 78.2,
      votes: 1012,
      sentiment: 'Bullish',
      change: {
        value: 12.5,
        period: '1h'
      }
    },
    totalVotes: 1250
  };

  return (
    <div className="px-4 mb-4">
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Consensus</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
              Live
            </span>
          </div>
          <div className="text-sm">
            Total Votes: {consensusData.totalVotes}
          </div>
        </div>

        {/* Signal Group */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Signal Group</span>
            <div className="flex items-center gap-2">
              <span className="text-pink-500">{consensusData.signalGroup.consensus}% {consensusData.signalGroup.sentiment}</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
              style={{ width: `${consensusData.signalGroup.consensus}%` }}
            />
          </div>
          <div className="text-right text-sm text-slate-400 mt-1">
            {consensusData.signalGroup.analysts} verified analysts
          </div>
        </div>

        {/* Community */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Community</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">{consensusData.community.consensus}% {consensusData.community.sentiment}</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              style={{ width: `${consensusData.community.consensus}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-emerald-500">
              +{consensusData.community.change.value}% ({consensusData.community.change.period})
            </span>
            <span className="text-slate-400">
              {consensusData.community.votes} votes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySentiment;