import React from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface voteData {
  totalVotes: number;
  userVote: string;
  consensus: number;
}

interface VotingStageIndicatorProps {
  voteData?: voteData;
  compact?: boolean;
  totalValidators?: number;
  isValidator?: boolean;
  approved?: boolean;
}

const VotingStageIndicator: React.FC<VotingStageIndicatorProps> = ({
  voteData,
  compact = false,
  totalValidators = 0,
  isValidator = false,
  approved
}) => {
  const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4';

  if (!voteData) {
    return (
      <div
        className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}
      >
        <Clock className={`${iconSize} text-slate-400`} />
        <span className="text-slate-400">Awaiting votes</span>
      </div>
    );
  }

  const { consensus, verified } = voteData.validatorVoteData;

  const minRequiredVotes = Math.ceil(totalValidators * 0.1);
  const isExecutable = verified >= minRequiredVotes && consensus >= 70;
  const isRejected = verified >= minRequiredVotes && consensus < 70;
  const isValidatorStage = verified < minRequiredVotes && verified > 0;
  const isPending = verified === 0;

  const getStageInfo = () => {
    if (!approved) {
      return {
        icon: <Users className={`${iconSize} text-blue-500`} />,
        label: 'Validator Stage',
        description: `${verified} validators voted (${consensus.toFixed(
          1
        )}% positive)`,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    }
    if (isPending) {
      return {
        icon: <Clock className={`${iconSize} text-amber-500`} />,
        label: 'Active',
        description: 'Signal is active and awaiting validator votes',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
      };
    }

    if (isExecutable) {
      return {
        icon: <CheckCircle className={`${iconSize} text-emerald-500`} />,
        label: 'Executable',
        description: 'Signal validated by validators',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
      };
    }

    if (isRejected) {
      return {
        icon: <XCircle className={`${iconSize} text-rose-500`} />,
        label: 'Rejected',
        description: 'Signal rejected by validator consensus',
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10',
      };
    }

    if (isValidatorStage) {
      return {
        icon: <Users className={`${iconSize} text-blue-500`} />,
        label: 'Validator Stage',
        description: `${verified} validators voted (${consensus.toFixed(
          1
        )}% positive)`,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    }

    return {
      icon: <AlertTriangle className={`${iconSize} text-amber-500`} />,
      label: 'Unknown',
      description: 'Unable to determine stage',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    };
  };

  const stageInfo = getStageInfo();

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${stageInfo.bgColor} ${stageInfo.color} text-xs`}
      >
        {stageInfo.icon}
        <span>{stageInfo.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        {stageInfo.icon}
        <span className={`font-medium ${stageInfo.color}`}>{stageInfo.label}</span>
      </div>
      <p className="text-sm text-slate-400">{stageInfo.description}</p>

      {isValidatorStage && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Validator Consensus</span>
            <span className={consensus >= 70 ? 'text-emerald-500' : 'text-slate-400'}>
              {consensus.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full ${consensus >= 70 ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
              style={{ width: `${Math.min(100, consensus)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>Required: 70%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingStageIndicator;
