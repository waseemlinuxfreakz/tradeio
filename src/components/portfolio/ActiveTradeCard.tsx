import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Target, Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TradeResult } from '../../lib/tradingLogic';

interface ActiveTradeCardProps {
  trade: TradeResult;
  onClick?: () => void;
}

const ActiveTradeCard: React.FC<ActiveTradeCardProps> = ({ trade, onClick }) => {
  const navigate = useNavigate();

  if (!trade.details) {
    return null;
  }

  const { pair, type, entryPrice, currentPrice, takeProfit, stopLoss, amount, leveragePercent } = trade.details;

  // Calculate current profit/loss
  const calculatePnL = () => {
    if (
      entryPrice === null || entryPrice < 0 ||
      currentPrice === null ||
      takeProfit === null || takeProfit < 0 ||
      stopLoss === null || stopLoss < 0
    ) return 0;
    if (!currentPrice || currentPrice < 0) return 0;

    if (type === 'LONG') {
      const tmp = ((currentPrice - entryPrice) / entryPrice) * amount * leveragePercent;
      if (tmp > 0) {
        return tmp
      } else {
        return 0
      }
    }
    if (type === 'SHORT') {
      const tmp = ((entryPrice - currentPrice) / entryPrice) * amount * leveragePercent;
      if (tmp > 0) {
        return tmp
      } else {
        return 0
      }
    }
    return 0;
  };

  const pnl = calculatePnL();
  const pnlPercent = (pnl / amount) * 100;
  const isProfitable = pnl > 0;

  const calculateProgress = () => {
    if (
      entryPrice === null || entryPrice < 0 ||
      currentPrice === null ||
      takeProfit === null || takeProfit < 0 ||
      stopLoss === null || stopLoss < 0
    ) return 0;
    if (!currentPrice || currentPrice < 0) return 0;

    if (type === 'LONG') {
      if (currentPrice <= entryPrice) {
        return Math.min(100, Math.max(0, (entryPrice - currentPrice) / (entryPrice - stopLoss) * 100));
      } else {
        return Math.min(100, Math.max(0, (currentPrice - entryPrice) / (takeProfit - entryPrice) * 100));
      }
    } else {
      if (currentPrice >= entryPrice) {
        return Math.min(100, Math.max(0, (currentPrice - entryPrice) / (stopLoss - entryPrice) * 100));
      } else {
        return Math.min(100, Math.max(0, (entryPrice - currentPrice) / (entryPrice - takeProfit) * 100));
      }
    }
  };

  const progress = calculateProgress();

  return (
    <div
      onClick={onClick}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{pair}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${type === 'LONG'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/20 text-rose-400'
              }`}>
              {type}
            </span>
          </div>
          <div className="text-sm text-slate-400 mt-1">
            {leveragePercent}x Leverage • ${amount.toLocaleString()} Position
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold ${isProfitable ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isProfitable ? '+' : ''}{pnl.toFixed(2) > "0" ? pnl.toFixed(2) : 0} USD
          </div>
          <div className={`text-sm ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2) > "0" ? pnlPercent.toFixed(2) : 0}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          {type === 'LONG' ? (
            <>
              {/* For LONG positions */}
              <div
                className="absolute left-0 top-0 h-full bg-rose-500 rounded-full"
                style={{ width: `${Math.min(50, progress)}%` }}
              />
              <div
                className="absolute left-[50%] top-0 h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.max(0, progress - 50)}%` }}
              />
              {/* Entry marker */}
              <div className="absolute left-[50%] top-0 h-full w-0.5 bg-white" />
            </>
          ) : (
            <>
              {/* For SHORT positions */}
              <div
                className="absolute right-0 top-0 h-full bg-rose-500 rounded-full"
                style={{ width: `${Math.min(50, progress)}%` }}
              />
              <div
                className="absolute right-[50%] top-0 h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.max(0, progress - 50)}%` }}
              />
              {/* Entry marker */}
              <div className="absolute right-[50%] top-0 h-full w-0.5 bg-white" />
            </>
          )}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{type === 'LONG' ? 'Stop Loss' : 'Take Profit'}</span>
          <span>Entry</span>
          <span>{type === 'LONG' ? 'Take Profit' : 'Stop Loss'}</span>
        </div>
      </div>

      {/* Price details */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-slate-400">Entry</div>
          <div className="font-medium">${entryPrice.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-400">Current</div>
          <div className={`font-medium ${currentPrice && currentPrice > entryPrice ? 'text-emerald-500' :
            currentPrice && currentPrice < entryPrice ? 'text-rose-500' : ''
            }`}>
            ${currentPrice?.toLocaleString() || entryPrice.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-slate-400">{type === 'LONG' ? 'Take Profit' : 'Stop Loss'}</div>
          <div className="font-medium">
            ${(type === 'LONG' ? takeProfit : stopLoss).toLocaleString()}
          </div>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-2 gap-2 text-sm">
            <a href='./edit-signal' className='px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 text-center'>Edit <br /> Trade</a>
            <button className='px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-rose-500 hover:bg-slate-700/50'>Close <br /> Position</button>
      </div>
    </div>
  );
};

export default ActiveTradeCard;