import React, { useState } from "react";
import {
  X,
  Brain,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  Scale,
} from "lucide-react";
import LiveCandlestickChart from "../LiveCandlestickChart";
import { Signals } from "../../types/signal";

interface SignalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: Signals;
}

const SignalAnalysisModal: React.FC<SignalAnalysisModalProps> = ({
  isOpen,
  onClose,
  signal,
}) => {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const indicators = [
    { id: "rsi", name: "RSI" },
    { id: "macd", name: "MACD" },
    { id: "bb", name: "Bollinger Bands" },
    { id: "ema", name: "EMA" },
  ];

  const toggleIndicator = (id: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-slate-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold">Signal Analysis</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chart */}
        <div className="p-4">
          <div className="bg-[#131722] rounded-xl border border-slate-700/50 overflow-hidden">
            <LiveCandlestickChart
              symbol={signal.pair.replace("/", "")}
              interval="15"
              priceLines={{
                takeProfit: signal.takeProfit,
                stopLoss: signal.stopLoss,
                entry: signal.entryPrice,
              }}
            />
          </div>
        </div>

        {/* Indicators */}
        <div className="px-4 pb-4">
          <h4 className="text-sm text-slate-400 mb-2">Technical Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {indicators.map((indicator) => (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedIndicators.includes(indicator.id)
                    ? "bg-pink-500 text-white"
                    : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                }`}>
                {indicator.name}
              </button>
            ))}
          </div>
        </div>

        {/* Signal Details */}
        <div className="p-4 border-t border-slate-700">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-slate-400">Entry</span>
              </div>
              <div className="text-sm font-medium">
                ${signal.entryPrice.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-400">Take Profit</span>
              </div>
              <div className="text-sm font-medium text-emerald-500">
                ${signal.takeProfit.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                <span className="text-xs text-slate-400">Stop Loss</span>
              </div>
              <div className="text-sm font-medium text-rose-500">
                ${signal.stopLoss.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-slate-400">Risk/Reward</span>
              </div>
              <div className="text-sm font-medium text-purple-500">
                1:
                {Math.abs(
                  (signal.takeProfit - signal.entryPrice) /
                    (signal.entryPrice - signal.stopLoss)
                ).toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">
              Close
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
              Join Signal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalAnalysisModal;
