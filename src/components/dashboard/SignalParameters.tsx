import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Target, Clock, TrendingUp } from 'lucide-react';
import { ORDER_TYPE } from '../../types/signal';

interface SignalParametersProps {
  takeProfit?: string;
  stopLoss?: string;
  entry: string;
  riskReward: string;
  time: string;
  status: string;
  currentPrice?: number;
  potentialGainLoss?: {
    gainPercent: number;
    lossPercent: number;
  } | undefined,
  orderType?: ORDER_TYPE
}

const SignalParameters: React.FC<SignalParametersProps> = ({
  takeProfit,
  stopLoss,
  entry,
  riskReward,
  time,
  status,
  currentPrice,
  potentialGainLoss,
  orderType
}) => {
  const provideFormat = (value: number | string | undefined) => {
    if (!value) return "0";
    const formatted = Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return formatted;
  }

  return (
    <div className="p-4 space-y-3">
      {/* Main Parameters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-slate-400">Take Profit</span>
          </div>
          <div className="text-sm font-bold text-emerald-500 mt-1">${provideFormat(takeProfit)}
          </div>
          <div className="text-xs text-emerald-400">{provideFormat(potentialGainLoss?.gainPercent)}%</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-slate-400">Stop Loss</span>
          </div>
          <div className="text-sm font-bold text-rose-500 mt-1">${provideFormat(stopLoss)}</div>
          <div className="text-xs text-rose-400">{provideFormat(potentialGainLoss?.lossPercent)}%</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            {(orderType === "STOP_LIMIT" || orderType === "STOP_MARKET") && <span className="text-xs text-slate-400">Stop Price</span>}
            {(orderType === "MARKET"|| orderType === "LIMIT") && <span className="text-xs text-slate-400">Entry Price</span>}
          </div>
          <div className="text-sm font-bold text-blue-500 mt-1">${provideFormat(entry)}</div>
          <div className="text-xs text-blue-400">${provideFormat(currentPrice)}</div>
        </div>
      </div>

      {/* Additional Parameters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-slate-400">Risk/Reward</span>
          </div>
          <div className="text-sm font-bold text-purple-500 mt-1">{riskReward}</div>
          <div className="text-xs text-purple-400">Ratio</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Created</span>
          </div>
          <div className="text-sm font-bold mt-1">{time}</div>
          <div className="text-xs text-slate-400">{status}</div>
        </div>
      </div>
    </div>
  );
};

export default SignalParameters;