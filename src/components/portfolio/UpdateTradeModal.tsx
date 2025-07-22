import {
  Plus,
  Minus,
  ArrowUpCircle,
  ArrowDownCircle,
  Percent,
  X,
  Send,
  Loader2,
  Target,
  Scale
} from 'lucide-react';
import { message } from 'antd'
import { TakeProfitTarget, StopLossTarget } from '../../pages/CreateSignalPage';
import { useEffect, useState } from 'react';
import CustomSwitch from '../CustomSwitch';
import { updateTrade } from '../../apis/apiEndpoints';
import useTradeDetails from '../../hooks/useTradeDetails';
import { useQueryClient } from '@tanstack/react-query';
import LiveCandlestickChart from '../LiveCandlestickChart';
import { useSignalStore } from '../../lib/signalStore';
import { ORDER_TYPE } from '../../types/signal';

import { TradeResult } from '../../lib/tradingLogic';
import FullPageLoader from '../Loader';
interface TradeModalProps {
  tradeId?: string;
  onClose: () => void;
  trade: TradeResult
}

const isValidation = (
  signalType: string,
  orderType: ORDER_TYPE,
  entryPrice: string,
  // stopPrice: number,
  takeProfit: TakeProfitTarget[],
  stopLoss: StopLossTarget[],
): boolean => {
  signalType = signalType.toLowerCase();

  const entryPriceNum = Number(entryPrice);

  if (!takeProfit.length) {
    message.error("At least one Take Profit target is required");
    return false;
  }

  if (!stopLoss.length) {
    message.error("At least one Stop Loss target is required");
    return false;
  }

  const validateTargets = (
    list: { price: string }[],
    comparator: (a: number, b: number) => boolean,
    reference: number,
    messageText: string
  ): boolean => {
    for (const target of list) {
      if (comparator(Number(target.price), reference)) {
        message.error(messageText);
        return false;
      }
    }
    return true;
  };

  switch (orderType) {
    case "MARKET":
      return true;

    case "LIMIT": {
      if (signalType === "long") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp <= ref, entryPriceNum, "Take Profit must be greater than entry price") &&
          validateTargets(stopLoss, (sl, ref) => sl >= ref, entryPriceNum, "Stop Loss must be less than entry price")
        );
      } else if (signalType === "short") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp >= ref, entryPriceNum, "Take Profit must be less than entry price") &&
          validateTargets(stopLoss, (sl, ref) => sl <= ref, entryPriceNum, "Stop Loss must be greater than entry price")
        );
      }
      break;
    }

    case "STOP_MARKET": {
      if (signalType === "long") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp <= ref, entryPriceNum, "Take Profit must be greater than stop price") &&
          validateTargets(stopLoss, (sl, ref) => sl >= ref, entryPriceNum, "Stop Loss must be less than stop price")
        );
      } else if (signalType === "short") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp >= ref, entryPriceNum, "Take Profit must be less than stop price") &&
          validateTargets(stopLoss, (sl, ref) => sl <= ref, entryPriceNum, "Stop Loss must be greater than stop price")
        );
      }
      break;
    }

    case "STOP_LIMIT": {

      if (signalType === "long") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp <= ref, entryPriceNum, "Take Profit must be greater than stop price") &&
          validateTargets(stopLoss, (sl, ref) => sl >= ref, entryPriceNum, "Stop Loss must be less than stop price")
        );
      } else if (signalType === "short") {
        return (
          validateTargets(takeProfit, (tp, ref) => tp >= ref, entryPriceNum, "Take Profit must be less than stop price") &&
          validateTargets(stopLoss, (sl, ref) => sl <= ref, entryPriceNum, "Stop Loss must be greater than stop price")
        );
      }
      break;
    }

    default:
      return true;
  }

  message.error("Unknown order or signal type");
  return false;
};

const TradeModal: React.FC<TradeModalProps> = ({
  tradeId,
  onClose,
  trade
}) => {
  if (!tradeId) return null;
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { tradeDetails, tradeDetailsLoading } = useTradeDetails(tradeId);
  const tradeData = tradeDetails?.data?.data
  const currentPrice = useSignalStore((state) => state.currentSignalValue) || 0;
  const [stopLoss, setStopLoss] = useState<StopLossTarget[]>([
    { price: "", allocationType: "percentage", allocationValue: "100" },
  ]);
  const [selectedInput, setSelectedInput] = useState<
    "entry" | "tp" | "sl" | null
  >(null);
  const [status, setStatus] = useState(false);

  const [takeProfit, setTakeProfit] = useState<TakeProfitTarget[]>([
    { price: "", allocationType: "percentage", allocationValue: "100" },
  ]);

  const handleAddTakeProfit = () => {
    setTakeProfit([
      ...takeProfit,
      { price: "", allocationType: "percentage", allocationValue: "100" },
    ]);
  };

  const handleTakeProfitChange = (
    index: number,
    field: keyof TakeProfitTarget,
    value: string
  ) => {
    const newTakeProfit = [...takeProfit];
    newTakeProfit[index] = { ...newTakeProfit[index], [field]: value };
    setTakeProfit(newTakeProfit);
  };

  const handleRemoveTakeProfit = (index: number) => {
    setTakeProfit(takeProfit.filter((_, i) => i !== index));
  };

  const handleAddStopLoss = () => {
    setStopLoss([
      ...stopLoss,
      { price: "", allocationType: "percentage", allocationValue: "100" },
    ]);
  };

  const handleRemoveStopLoss = (index: number) => {
    setStopLoss(stopLoss.filter((_, i) => i !== index));
  };

  const handleStopLossChange = (
    index: number,
    field: keyof StopLossTarget,
    value: string
  ) => {
    const newStopLoss = [...stopLoss];
    newStopLoss[index] = { ...newStopLoss[index], [field]: value };
    setStopLoss(newStopLoss);
  };

  const handleSubmit = () => {

    // if (!takeProfit.length) {
    //   message.error("At least one Take Profit target is required");
    //   return false;
    // }

    // if (!stopLoss.length) {
    //   message.error("At least one Stop Loss target is required");
    //   return false;
    // }


    const validationResult = isValidation(
      trade?.details?.type || '',
      trade?.details?.orderType || 'STOP_MARKET',
      trade?.details?.entryPrice.toString() || '',
      // Number(stopPrice || 0),
      takeProfit,
      stopLoss,
    );

    if (!validationResult) {
      return; // Stop execution if validation fails
    }
    const signalPayload = {
      takeProfitTargets: takeProfit,
      stopLossTargets: stopLoss,
      ...(status && { status: 'close' }),
    };

    setLoading(true)
    updateTrade(tradeData?.id, signalPayload)
      .then((response) => {
        if (response.status === 200) {
          message.success("Trade updated successfully");
          queryClient.invalidateQueries({ queryKey: ["trade-details"] });
          onClose()
        } else {
          if (response.status === 400) {
            if (response.data.message) {
              message.error(response.data.message);
              return;
            }
          }
          message.error("Failed to update configuration");
        }
      })
      .catch((error) => {
        message.error(error?.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const calculateRiskRewardRatio = (): string => {
    // Safely extract values with defaults
    const takeProfit = trade?.details?.takeProfit ?? 0;
    const stopLoss = trade?.details?.stopLoss ?? 0;
    const entryPrice = trade?.details?.entryPrice ?? 0;

    // Validate we have valid numbers (handle cases where values might be null/undefined/NaN)
    const validTakeProfit = Number.isFinite(takeProfit) ? takeProfit : 0;
    const validStopLoss = Number.isFinite(stopLoss) ? stopLoss : 0;
    const validEntryPrice = Number.isFinite(entryPrice) ? entryPrice : 0;

    // Calculate potential profit/loss
    const potentialProfit = validTakeProfit - validEntryPrice;
    const potentialLoss = validEntryPrice - validStopLoss;
    // Handle edge cases
    if (potentialLoss <= 0) {
      return '1:0';
    }

    // Calculate and format ratio
    const ratio = Math.abs(potentialProfit / potentialLoss);
    return `1:${ratio.toFixed(1)}`;
  };

  const calculateRiskRewardRatioForCurrentPrice = () => {
    const takeProfit = trade?.details?.takeProfit ?? 0;
    const stopLoss = trade?.details?.stopLoss ?? 0;
    const validPrice = currentPrice || 0;

    const potentialProfit = takeProfit - validPrice;
    const potentialLoss = validPrice - stopLoss;

    if (potentialLoss <= 0) return '1:0';

    const ratio = Math.abs(potentialProfit / potentialLoss);
    return potentialProfit >= 0
      ? `1:${ratio.toFixed(1)}`
      : `${ratio.toFixed(1)}:1`;
  };

  useEffect(() => {
    if (tradeData) {
      setStopLoss(tradeData?.stopLossTargets || [])
      setTakeProfit(tradeData?.takeProfitTargets || [])
      if (tradeData?.status === 'close') {
        setStatus(true)
      }
    }
  }, [tradeData])
  if (tradeDetailsLoading) {
    return <FullPageLoader loading={tradeDetailsLoading} />
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl w-full relative animate-in fade-in slide-in-from-bottom duration-300 max-w-[90%] md:max-w-[75%] hide-scrollbar lg:max-w-[50%]
      max-h-[80vh] overflow-y-scroll pb-2">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font105-bold">Update Trade</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative px-4 mb-4 mx-3 bg-slate-700/50 p-2 mt-2 rounded-md" >

          <LiveCandlestickChart
            symbol={trade?.details?.pair?.replace("/", "") || ''}
            interval="15"
            priceLines={{
              takeProfit: trade?.details?.takeProfit,
              stopLoss: trade?.details?.stopLoss,
              entry: trade?.details?.entryPrice,
            }}
          />


          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-blue-400">
                  ${Number.isFinite(trade?.details?.entryPrice) ? trade?.details?.entryPrice : 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400">
                  {
                    trade?.details?.entryPrice != null &&
                      trade?.details?.takeProfit != null &&
                      Number.isFinite(trade.details.entryPrice) &&
                      Number.isFinite(trade.details.takeProfit) &&
                      trade.details.entryPrice !== 0
                      ? (((trade.details.takeProfit - trade.details.entryPrice) / trade.details.entryPrice) * 100).toFixed(2)
                      : '0'
                  }%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                <span className="text-rose-400">
                  {
                    trade?.details?.entryPrice != null &&
                      trade?.details?.stopLoss != null &&
                      Number.isFinite(trade.details.entryPrice) &&
                      Number.isFinite(trade.details.stopLoss) &&
                      trade.details.entryPrice !== 0
                      ? (((trade.details.entryPrice - trade.details.stopLoss) / trade.details.entryPrice) * 100).toFixed(2)
                      : '0'
                  }%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Scale className="w-4 h-4 text-purple-500" />
                <span className="text-purple-400">
                  {calculateRiskRewardRatio()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-blue-400">
                  ${Number.isFinite(currentPrice) ? currentPrice : 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400">
                  {trade?.details?.takeProfit && currentPrice && Number.isFinite(trade?.details?.takeProfit) && Number.isFinite(currentPrice) && currentPrice !== 0
                    ? (((trade?.details?.takeProfit - currentPrice) / currentPrice) * 100).toFixed(2)
                    : '0'}%

                  {/* {Number.isFinite(signal.takeProfit) && Number.isFinite(currentPrice) && currentPrice !== 0 ? (((signal.takeProfit - currentPrice) / currentPrice) * 100).toFixed(2) : '0'}% */}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                <span className="text-rose-400">
                  {trade?.details?.stopLoss && currentPrice && Number.isFinite(trade?.details?.stopLoss) && Number.isFinite(currentPrice) && currentPrice !== 0 ? (((currentPrice - trade?.details?.stopLoss) / currentPrice) * 100).toFixed(2) : '0'}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Scale className="w-4 h-4 text-purple-500" />
                <span className="text-purple-400">
                  {calculateRiskRewardRatioForCurrentPrice()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-4 mx-3 bg-slate-700/50 p-2 mt-2 rounded-md flex justify-between items-center">
          <label className="text-sm text-slate-400">Stop Price</label>
          <button
            onClick={handleAddTakeProfit}
            className="p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            {tradeData?.entryPrice}
          </button>
        </div>

        {/* flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed */}
        <div className="px-4 mb-4 mx-3 bg-slate-700/50 p-2 mt-2 rounded-md" >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-400">Take Profit Levels</label>
            <button
              onClick={handleAddTakeProfit}
              className="p-1 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
          {takeProfit.map((tp, index) => (
            <div key={index} className="relative mb-2">
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={tp.price}
                    onChange={(e) =>
                      handleTakeProfitChange(index, "price", e.target.value)
                    }
                    onFocus={() => setSelectedInput("tp")}
                    placeholder={`Take Profit ${index + 1}`}
                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${selectedInput === "tp"
                      ? "border-pink-500"
                      : "border-slate-700/50"
                      }`}
                  />
                  <ArrowUpCircle className="w-5 h-5 text-emerald-500 absolute left-4 top-3.5" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={tp.allocationValue}
                      onChange={(e) =>
                        handleTakeProfitChange(
                          index,
                          "allocationValue",
                          e.target.value
                        )
                      }
                      placeholder="Allocation"
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                    {tp.allocationType === "percentage" && (
                      <Percent className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">

                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveTakeProfit(index)}
                      className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-rose-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stop Loss Levels */}
        <div className="px-4 mb-4 bg-slate-700/50 p-2 mt-2 rounded-md mx-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-400">Stop Loss Levels</label>
            <button
              onClick={handleAddStopLoss}
              className="p-1 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Plus className="w-4 h-4 text-rose-500" />
            </button>
          </div>
          {stopLoss.map((sl, index) => (
            <div key={index} className="relative mb-2">
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={sl.price}
                    onChange={(e) =>
                      handleStopLossChange(index, "price", e.target.value)
                    }
                    onFocus={() => setSelectedInput("sl")}
                    placeholder={`Stop Loss ${index + 1}`}
                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${selectedInput === "sl"
                      ? "border-pink-500"
                      : "border-slate-700/50"
                      }`}
                  />
                  <ArrowDownCircle className="w-5 h-5 text-rose-500 absolute left-4 top-3.5" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={sl.allocationValue}
                      onChange={(e) =>
                        handleStopLossChange(
                          index,
                          "allocationValue",
                          e.target.value
                        )
                      }
                      placeholder="Allocation"
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                    {sl.allocationType === "percentage" && (
                      <Percent className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">

                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveStopLoss(index)}
                      className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-rose-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 mb-4 ">
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2">
              <span>Close Trade</span>
            </div>
            <CustomSwitch checked={status} onCheckedChange={setStatus} />
          </div>
        </div>
        <div className='m-2 flex justify-end me-4 my-4'>
          <button
            onClick={handleSubmit}
            type="submit"
            // disabled={signalPending}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Trade...
              </>
            ) : (
              <>
                Update Trade
              </>)}
          </button>
        </div>


      </div>
    </div>
  );
};

export default TradeModal;
