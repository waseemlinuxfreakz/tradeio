import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Target, Clock } from 'lucide-react';

interface ParameterGridProps {
  takeProfit: number;
  stopLoss: number;
  riskReward: string;
  timeCreated: string;
}

const ParameterGrid: React.FC<ParameterGridProps> = ({
  takeProfit,
  stopLoss,
  riskReward,
  timeCreated,
}) => {
  const potentialProfit = ((takeProfit - 3400) / 3400 * 100).toFixed(2);
  const maxLoss = ((stopLoss - 3400) / 3400 * 100).toFixed(2);

  return (
    <div className="px-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
          <div>
            <div className="text-xs text-slate-400">Take Profit</div>
            <div className="text-sm font-bold text-emerald-500">${takeProfit}</div>
            <div className="text-xs text-emerald-400">+{potentialProfit}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="w-4 h-4 text-rose-500" />
          <div>
            <div className="text-xs text-slate-400">Stop Loss</div>
            <div className="text-sm font-bold text-rose-500">${stopLoss}</div>
            <div className="text-xs text-rose-400">{maxLoss}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-500" />
          <div>
            <div className="text-xs text-slate-400">Risk/Reward</div>
            <div className="text-sm font-bold text-purple-500">{riskReward}</div>
            <div className="text-xs text-purple-400">Ratio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterGrid;