import React, { useState, useMemo, useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
} from 'lucide-react';
import {
  voteOnSignal,
  checkUserVote,
  checkIsValidator,
  Voter,
} from '../../lib/votingSystem';
import { useAuthStore } from '../../lib/store';
import { recordVoteOutcome } from '../../lib/reputationSystem';
import { Signals } from '../../types/signal';
import useAddUserVote from '../../hooks/useAddUserVote';
import { getDecodedUserToken } from '../../utils';
import { useQueryClient } from '@tanstack/react-query';

interface SignalVotingControlsProps {
  signal: Signals;
  onVoteComplete?: () => void;
  isValidator?: boolean
}

const clamp = (num: number, min = 0, max = 100) =>
  Math.min(Math.max(num, min), max);

const SignalVotingControls: React.FC<SignalVotingControlsProps> = ({
  signal,
  onVoteComplete,
  isValidator
}) => {
  const { user } = useAuthStore();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [positiveCount, setPositiveVoteCount] = useState(0)
  const [negativeCount, setNegativeVoteCount] = useState(0)

  const [voteStatus, setVoteStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const { createUserVote } = useAddUserVote();
  const userData = getDecodedUserToken();
  const isOwnSignal = userData?.userId === signal.user.id;
  const queryClient = useQueryClient();
  useEffect(() => {
    if (signal?.userVoteValidatorConsensus === 'like') {
      setUserVote('up');
    } else if (signal?.userVoteValidatorConsensus === 'dislike') {
      setUserVote('down');
    }
  }, [signal.userVote]);

  const handleVote = async (voteType: 'up' | 'down', consensus: "community" | "validator") => {
    if (!user?.email || isVoting) return;

    setIsVoting(true);
    setMessage('');

    try {
      const voter: Voter = {
        id: user.email,
        type: isValidator ? 'validator' : 'regular',
        reputation: 85, // Demo value
        successRate: 92, // Demo value
      };
      const type = voteType === 'up' ? 'like' : 'dislike';
      await createUserVote({
        signalId: signal.id,
        type,
        consensus
      });
      queryClient.invalidateQueries({ queryKey: ["SignalDetails", signal.id] })

      const simulatedSuccess = Math.random() > 0.3; // 70% chance success
      recordVoteOutcome(simulatedSuccess, voteType);
      voteType === 'up' ? setPositiveVoteCount(1) : setNegativeVoteCount(1)
      setUserVote(voteType);
      setVoteStatus('success');
      setMessage(
        isValidator
          ? 'Your validator vote has been recorded! +5 reputation points if correct.'
          : 'Your vote has been recorded! +5 reputation points if correct.'
      );

      if (onVoteComplete) onVoteComplete();
    } catch (error) {
      console.error('Voting error:', error);
      setVoteStatus('error');
      setMessage('Failed to record your vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };


  const validatorPositiveVotes = signal.validator.validatorPositive;
  const validatorNegativeVotes = signal.validator.validatorNegative;
  const totalVotes = validatorPositiveVotes + validatorNegativeVotes;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Validator Consensus</span>

          </div>

          <div className="text-sm text-slate-400">
            {positiveCount + negativeCount <= Number(signal?.validator?.validatorPercentage)
              ? `${signal.validator.validatorPositive + signal.validator.validatorNegative} validators voted`
              : positiveCount + negativeCount >= Number(signal?.validator?.validatorPercentage)
                ? `${signal.community.verifiedCommunity} community votes`
                : ''}
          </div>
        </div>

        {(positiveCount <= Number(signal?.validator?.validatorPercentage) || signal.validator.validatorPositive + signal.validator.validatorNegative >= Number(signal?.validator?.validatorPercentage)) && (
          <div className="mt-2">
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              {totalVotes > 0 && (
                <>
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all"
                    style={{
                      width: `${totalVotes > 0 ? (validatorPositiveVotes / totalVotes) * 100 : 0}%`,
                    }}

                  />
                  <div
                    className="absolute left-0 top-0 h-full bg-rose-500 transition-all"
                    style={{
                      width: `${(validatorNegativeVotes / totalVotes) * 100}%`,
                      marginLeft: `${(validatorPositiveVotes / totalVotes) * 100}%`,
                    }}
                  />
                </>
              )}

            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{signal.validator.validatorPositive + signal.validator.validatorNegative}%</span>
              <span>Required: {signal.validator.validatorPercentage}%</span>
              <span>100%</span>
            </div>
          </div>
        )}


      </div>

      {((positiveCount + negativeCount) <= Number(signal?.validator?.validatorPercentage) || (positiveCount + negativeCount) >= Number(signal?.validator?.validatorPercentage)) &&
        !userVote && (
          <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">
                Voting correctly earns you +5 reputation points
              </span>
            </div>
          </div>
        )}

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${voteStatus === 'success'
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-rose-500/10 text-rose-400'
            }`}
        >
          {voteStatus === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {((positiveCount + negativeCount) <= Number(signal?.validator?.validatorPercentage) || (positiveCount + negativeCount) >= Number(signal?.validator?.validatorPercentage)) && (
        <div className="flex justify-between">
          {signal?.status === "PENDING" &&
            <>
              <button
                onClick={() => handleVote('down', 'validator')}
                disabled={
                  isVoting ||
                  isOwnSignal ||
                  (!isValidator)
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${(!isValidator || isOwnSignal)
                  ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                  : userVote === "down" ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                  }`}
              >

                <ThumbsDown className="w-5 h-5" />
                <span>Reject Signal</span>

              </button>

              <div className="w-4"></div>

              <button
                onClick={() => handleVote('up', "validator")}
                disabled={
                  isVoting ||
                  isOwnSignal ||
                  (!isValidator)
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${(!isValidator || isOwnSignal)
                  ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                  : userVote === "up" ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                  }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Approve Signal</span>

              </button>
            </>}
        </div>
      )}


      <style>{`
        .progress-bar {
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default SignalVotingControls;
