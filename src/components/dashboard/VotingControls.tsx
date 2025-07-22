import React from 'react';
import { ThumbsUp, ThumbsDown, Loader2, Check } from 'lucide-react';
import { useVotingStore } from '../../lib/votingStore';
import { useSwipeStore } from '../../lib/store';

interface VotingControlsProps {
  signalId: string;
  currentUserId: string;
  userType: 'analyst' | 'community';
  onVoteComplete?: () => void;
}

const VotingControls: React.FC<VotingControlsProps> = ({
  signalId,
  currentUserId,
  userType,
  onVoteComplete
}) => {
  const [isVoting, setIsVoting] = React.useState(false);
  const [lastVote, setLastVote] = React.useState<'up' | 'down' | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { actions } = useVotingStore();
  const { actions: swipeActions } = useSwipeStore();

  const hasVoted = React.useMemo(() => {
    const userVoteSet = actions.getUserVotes(currentUserId);
    return userVoteSet.has(signalId);
  }, [currentUserId, signalId, actions]);

  const handleVote = async (vote: 'up' | 'down') => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    setLastVote(vote);
    
    try {
      // Record vote in voting system
      actions.vote(signalId, {
        id: currentUserId,
        type: userType,
        reputation: 85,
        successRate: 92
      }, vote);

      // Record swipe action
      swipeActions.recordSwipe(vote === 'up' ? 'like' : 'dislike');

      // Force consensus recalculation
      actions.calculateConsensus(signalId);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);

      onVoteComplete?.();
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex justify-around gap-6">
      <button 
        onClick={() => handleVote('down')}
        disabled={hasVoted || isVoting}
        className="group flex-1 flex flex-col items-center"
      >
        <div className="relative">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            hasVoted && lastVote === 'down'
              ? 'bg-rose-500/20'
              : hasVoted
                ? 'bg-slate-800/50'
                : 'bg-rose-500/10 group-hover:bg-rose-500/20'
          }`}>
            {isVoting ? (
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            ) : (
              <ThumbsDown className={`w-8 h-8 ${
                hasVoted && lastVote === 'down' ? 'text-rose-500' : 'text-rose-500/80'
              }`} />
            )}
          </div>
          {hasVoted && lastVote === 'down' && showSuccess && (
            <div className="absolute inset-0 rounded-full border-2 border-rose-500 scale-110 animate-pulse" />
          )}
        </div>
        <span className="text-sm mt-2 text-slate-400">Skip Signal</span>
      </button>

      <button 
        onClick={() => handleVote('up')}
        disabled={hasVoted || isVoting}
        className="group flex-1 flex flex-col items-center"
      >
        <div className="relative">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            hasVoted && lastVote === 'up'
              ? 'bg-emerald-500/20'
              : hasVoted
                ? 'bg-slate-800/50'
                : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'
          }`}>
            {isVoting ? (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            ) : (
              <ThumbsUp className={`w-8 h-8 ${
                hasVoted && lastVote === 'up' ? 'text-emerald-500' : 'text-emerald-500/80'
              }`} />
            )}
          </div>
          {hasVoted && lastVote === 'up' && showSuccess && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 scale-110 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-4 h-4 text-white" />
              </div>
            </>
          )}
        </div>
        <span className="text-sm mt-2 text-slate-400">Add to Favorites</span>
      </button>
    </div>
  );
};

export default VotingControls;