import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  Send,
  DollarSign,
  Percent,
  Globe,
  HelpCircle,
} from "lucide-react";
import LiveCandlestickChart from "../components/LiveCandlestickChart";
import CustomSwitch from "../components/CustomSwitch";
import dayjs from "dayjs";
import { message } from "antd";
import { Loader2 } from "lucide-react";
import { CreateSignalPayload, ORDER_TYPE } from "../types/signal";
import useCreateSignal from "../hooks/useCreateSignal";
import { createSignal, getCoinsList } from "../apis/apiEndpoints";

import { getDecodedUserToken } from "../utils";
import { Spin } from "antd";
import {
  durations,
  tradingPairs,
  timeframes,
  orderTypes,
} from "../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import useUserDetials from "../hooks/useUserDetails";
import SearchablePairSelector from "../components/SearchAbleDropdown";
import useSignalDetailsById from "../hooks/useSignalDetailsById";
import LimitClose from "../components/editsignalmodal/LimitClose";
import TPSLModal from "../components/editsignalmodal/TPSLModal";

type TakeProfitTarget = {
  price: string;
  allocationType: "percentage";
  allocationValue: string;
};

type StopLossTarget = {
  price: string;
  allocationType: "percentage";
  allocationValue: string;
};

const CreateSignalPage = () => {
  const navigate = useNavigate();
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [signalType, setSignalType] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getDecodedUserToken();
  const [takeProfit, setTakeProfit] = useState<TakeProfitTarget[]>([
    { price: "", allocationType: "percentage", allocationValue: "100" },
  ]);
  const [stopLoss, setStopLoss] = useState<StopLossTarget[]>([
    { price: "", allocationType: "percentage", allocationValue: "100" },
  ]);
  const [tradeAllocationType, setTradeAllocationType] = useState<"amount">("amount");
  const [leverage, setLeverage] = useState('');
  const [tradeAllocationValue, setTradeAllocationValue] = useState("10"); // Default 10%

  const [description, setDescription] = useState("");
  const [timeframe, setTimeframe] = useState("15");
  const [signalDuration, setSignalDuration] = useState("1d");
  const [orderType, setOrderType] = useState<ORDER_TYPE>("MARKET");
  const [isPublic, setIsPublic] = useState(true);
  const [listedCoins, setListedCoins] = useState([]);
  const [selectedInput, setSelectedInput] = useState<
    "entry" | "tp" | "sl" | null
  >(null);

  const { signalPending } = useCreateSignal();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const signalId = searchParams.get('signalId') || undefined;

  const { userDetails, userDetialsLoading } = useUserDetials(user!.userId);
  const { signalDetailsResult, signalDetailsLoading } = useSignalDetailsById(user!.userId, signalId);
  
  const getTradeDurationRange = (durationValue: string) => {
    const startDateTime = dayjs();

    // Extract number and unit
    const amount = parseInt(durationValue); // e.g., '1h' -> 1
    const unit = durationValue.replace(amount.toString(), ""); // e.g., '1h' -> 'h'

    // Map to dayjs duration units
    const unitMap: { [key: string]: dayjs.ManipulateType } = {
      h: "hour",
      d: "day",
      w: "week",
      m: "month",
    };

    const timeUnit = unitMap[unit];
    if (!timeUnit) throw new Error("Invalid duration unit");

    const endDateTime = startDateTime.add(amount, timeUnit);

    return {
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };
  };

  const handleAddTakeProfit = () => {
    setTakeProfit([
      ...takeProfit,
      { price: "", allocationType: "percentage", allocationValue: "" },
    ]);
  };

  const handleRemoveTakeProfit = (index: number) => {
    setTakeProfit(takeProfit.filter((_, i) => i !== index));
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

  const handleAddStopLoss = () => {
    setStopLoss([
      ...stopLoss,
      { price: "", allocationType: "percentage", allocationValue: "" },
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

  const isValidation = (
    signalType: string,
    orderType: ORDER_TYPE,
    entryPrice: string,
    stopPrice: number,
    takeProfit: TakeProfitTarget[],
    stopLoss: StopLossTarget[],
    leverage: number,
  ): boolean => {
    signalType = signalType.toLowerCase();

    const entryPriceNum = Number(entryPrice);

    if (leverage < 100) {
      message.error("Leverage must be at least 100x");
      return false;
    }

    if (["STOP_MARKET", "STOP_LIMIT"].includes(orderType) && (stopPrice === undefined || isNaN(stopPrice))) {
      message.error("Invalid or missing stop price");
      return false;
    }

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
            validateTargets(takeProfit, (tp, ref) => tp <= ref, stopPrice, "Take Profit must be greater than stop price") &&
            validateTargets(stopLoss, (sl, ref) => sl >= ref, stopPrice, "Stop Loss must be less than stop price")
          );
        } else if (signalType === "short") {
          return (
            validateTargets(takeProfit, (tp, ref) => tp >= ref, stopPrice, "Take Profit must be less than stop price") &&
            validateTargets(stopLoss, (sl, ref) => sl <= ref, stopPrice, "Stop Loss must be greater than stop price")
          );
        }
        break;
      }

      case "STOP_LIMIT": {

        if (signalType === "long") {
          return (
            validateTargets(takeProfit, (tp, ref) => tp <= ref, stopPrice, "Take Profit must be greater than stop price") &&
            validateTargets(stopLoss, (sl, ref) => sl >= ref, stopPrice, "Stop Loss must be less than stop price")
          );
        } else if (signalType === "short") {
          return (
            validateTargets(takeProfit, (tp, ref) => tp >= ref, stopPrice, "Take Profit must be less than stop price") &&
            validateTargets(stopLoss, (sl, ref) => sl <= ref, stopPrice, "Stop Loss must be greater than stop price")
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
  const handleSubmit = async () => {
    if (!signalDuration) {
      message.info("Signal Duration is required");
      return;
    }
    const userBalance = userDetails?.data?.data?.balance;

    const allocationAmount = Number(tradeAllocationValue);
    const userAvailableBalance = Number(userBalance);

    if (allocationAmount > userAvailableBalance) {
      message.error(`Trade allocation value must not exceed your available balance ${userAvailableBalance}`);
      return;
    }
    const validationResult = isValidation(
      signalType,
      orderType,
      entryPrice,
      Number(stopPrice),
      takeProfit,
      stopLoss,
      Number(leverage)
    );

    if (!validationResult) {
      return; // Stop execution if validation fails
    }

    const { startDateTime, endDateTime } = getTradeDurationRange(signalDuration);

    const signalData: CreateSignalPayload = {
      coin: selectedPair,
      type: signalType.toUpperCase(),
      entryPrice: Number(entryPrice) > 0 ? entryPrice : "0",
      stopPrice: orderType === "STOP_LIMIT" || orderType === "STOP_MARKET" ? stopPrice : "0",
      takeProfitTargets: takeProfit,
      stopLossTargets: stopLoss,
      description: description,
      timeframe: timeframe,
      signalDuration: signalDuration,
      orderType: orderType,
      isPublic: isPublic,
      startDate: startDateTime,
      endDate: endDateTime,
      leverage: Number(leverage),
      tradeAllocation: {
        allocationValue: Number(tradeAllocationValue),
        allocationType: tradeAllocationType,
      },
    };

    setLoading(true);

    createSignal(signalData)
      .then((response) => {
        if (response.status === 201) {
          message.success("Signal created successfully");
          queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
        } else if (response?.data.error) {
          message.error(response?.data.error);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          message.error(error.response.data.error, 2);
          return;
        }
        message.error("Something went wrong", 2);
      })
      .finally(() => {
        setLoading(false);
      });

    setSignalType("long");
    setEntryPrice("");
    setStopPrice("");
    setTakeProfit([
      { price: "", allocationType: "percentage", allocationValue: "100" },
    ]);
    setStopLoss([
      { price: "", allocationType: "percentage", allocationValue: "100" },
    ]);
    setDescription("");
    setTimeframe("15");
    setSignalDuration("1d");
    setOrderType("MARKET");
    setIsPublic(true);
    setTradeAllocationType("amount");
    setTradeAllocationValue("10");
  };

  const coinNames: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "Binance Coin",
    SOL: "Solana",
    TON: "Toncoin",
    USDT: "Tether",
  };
  const fetchCoinsList = async () => {
    try {
      setLoading(true);
      const result = await getCoinsList();
      const symbols = result?.data?.symbols;
      const filteredSymbols = symbols
        .filter((pair: any) => pair.quoteAsset === "USDT")
        .map((pair: any) => ({
          symbol: pair.symbol,
          name: coinNames[pair.baseAsset] || pair.baseAsset,
          displaySymbol: `${pair.baseAsset}/${pair.quoteAsset}`,
        }));
      setListedCoins(filteredSymbols)
    } catch (error) {
      console.log('error ', error)
    } finally {
      setLoading(false);
    }
  };

  const priceLines = React.useMemo(() => ({
    takeProfit: takeProfit[0]?.price
      ? parseFloat(takeProfit[0].price)
      : undefined,
    stopLoss: stopLoss[0]?.price
      ? parseFloat(stopLoss[0].price)
      : undefined,
    entry: entryPrice ? parseFloat(entryPrice) : undefined,
  }), [takeProfit, stopLoss, entryPrice]);

  useEffect(() => {
    fetchCoinsList();
  }, []);
  
  
  const [sliderValue, setSliderValue] = useState(50); // Initialize with default value 50%

  const [showModal, setShowModal] = useState(false);
  const [showTPSLModal, setShowTPSLModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Edit Signal</h1>
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            disabled={signalPending}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {signalPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Signal...
              </>
            ) : (
              "Update Signal"
            )}
          </button>

        </div>
      </div>

      {/* Trading Pair Selector */}
      <div className="p-4">
        <div className="relative">
          {/* <button
            onClick={() => setShowPairSelector(!showPairSelector)}
            className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                {
                  tradingPairs.find((p) => p.symbol === selectedPair)
                    ?.displaySymbol
                }
              </span>
              <span className="text-sm text-slate-400">
                {tradingPairs.find((p) => p.symbol === selectedPair)?.name}
              </span>
            </div>
          </button> */}
          {/* <Spin spinning={loading}>
            <SearchablePairSelector
              tradingPairs={listedCoins}
              selectedPair={selectedPair}
              setSelectedPair={setSelectedPair}
            />
          </Spin> */}
          <div class="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="text-lg font-bold">BTC/USDT</span>
                <span class="text-sm text-slate-400">Bitcoin</span>
              </div>
          </div>
          {showPairSelector && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-slate-700 shadow-lg z-50">
              {tradingPairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    setSelectedPair(pair.symbol);
                    setShowPairSelector(false);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-medium">{pair.displaySymbol}</span>
                  <span className="text-sm text-slate-400">{pair.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${timeframe === tf.value
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Chart */}
      <div className="bg-[#131722] border-y border-slate-800">
        <LiveCandlestickChart
          symbol={selectedPair}
          interval={timeframe}
          // onPriceSelect={(price) => {
          //   if (!selectedInput) return;
          //   const formattedPrice = price.toFixed(2);

          //   switch (selectedInput) {
          //     case "entry":
          //       setEntryPrice(formattedPrice);
          //       break;
          //     case "tp":
          //       const newTakeProfit = [...takeProfit];
          //       newTakeProfit[0] = {
          //         ...newTakeProfit[0],
          //         price: formattedPrice,
          //       };
          //       setTakeProfit(newTakeProfit);
          //       break;
          //     case "sl":
          //       const newStopLoss = [...stopLoss];
          //       newStopLoss[0] = { ...newStopLoss[0], price: formattedPrice };
          //       setStopLoss(newStopLoss);
          //       break;
          //   }
          //   setSelectedInput(null);
          // }}
          priceLines={priceLines}
        // priceLines={{
        //   takeProfit: takeProfit[0]?.price
        //     ? parseFloat(takeProfit[0].price)
        //     : undefined,
        //   stopLoss: stopLoss[0]?.price
        //     ? parseFloat(stopLoss[0].price)
        //     : undefined,
        //   entry: entryPrice ? parseFloat(entryPrice) : undefined,
        // }}
        />
      </div>


      {/* Signal Type */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSignalType("long")}
            className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${signalType === "long"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
              : "bg-slate-800/50 border-slate-700/50 text-slate-400"
              }`}
          >
            <ArrowUpCircle className="w-5 h-5" />
            Long
          </button>
          {/* <button
            onClick={() => setSignalType("short")}
            className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${signalType === "short"
              ? "bg-rose-500/20 border-rose-500/50 text-rose-500"
              : "bg-slate-800/50 border-slate-700/50 text-slate-400"
              }`}
          >
            <ArrowDownCircle className="w-5 h-5" />
            Short
          </button> */}
        </div>
      </div>

      {/* Order Type */}
      <div className="px-4 mb-4">
        <label className="block text-sm text-slate-400 mb-2">Order Type</label>
        <div className="space-y-2 orderList">
          {orderTypes.map((type) => (
            <div key={type.value} className="relative">
              <button
                onClick={() => setOrderType(type.value as any)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-colors ${orderType === type.value
                  ? "bg-pink-500/20 border-pink-500/50"
                  : "bg-slate-800/50 border-slate-700/50"
                  }`}
              >
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {type.description}
                  </div>
                </div>
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      
      {/* Resize */}
      <div className="px-4 mb-4">
        <p className="block text-sm text-slate-400 mb-2">Size</p>
        <div className="sizeChange">
          <div className="sizeGroup">
            <input type="radio" name="reduce_increase" id="reduce_size" />
            <label htmlFor="reduce_size" className="text-slate-400">Reduce size</label>
          </div>
          <div className="sizeGroup">
            <input type="radio" name="reduce_increase" id="increase_size" />
            <label htmlFor="increase_size" className="text-slate-400">increase size</label>
          </div>
        </div>
      </div>


       {/* Update by Wassel */}
      <div className="px-4 mb-4">
        <label className="block text-sm text-slate-400 mb-2">
          Trade Allocation<span className="ml-2 font-medium text-sm text-white">$</span>
        </label>
      
      
        <div className="flex gap-2 items-center pl-3">
          <span className="text-emerald-500 text-xl">$</span>
          <h3 className="text-white text-xl">10</h3>
          {/* <input type="text" name="" id="" readOnly value={10} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50" /> */}
        </div>
      
        {/* <div className="flex gap-2 items-center">
          <div className="relative flex-1 space-y-2">
            <span className="w-5 h-5 text-emerald-500 absolute left-4 top-5">$</span>
            <input type="text" name="" id="" readOnly value={10} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50" />
          </div>
        </div> */}

      </div>

      {/* Update by Wassel */}
      <div className="px-4 mb-4">
        <label className="block text-sm text-slate-400 mb-2">
          Leverage<span className="ml-2 font-medium text-sm text-white">x</span>
        </label>
        
          <div className="flex gap-2 items-center pl-3">
            <span className="text-emerald-500 text-xl">x</span>
            <h3 className="text-white text-xl">10</h3>
            {/* <input type="text" name="" id="" readOnly value={10} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50" /> */}
          </div>
      </div>


      {/* Entry or Stop Price */}
      {orderType !== "MARKET" &&

        <div className="px-4 mb-4">
          <label className="block text-sm text-slate-400 mb-2">
            {orderType === "STOP_LIMIT" || orderType === "STOP_MARKET"
              ? "Stop Price"
              : "Entry Price"}
          </label>
          <div className="relative">

            <input
              type="number"
              value={
                orderType === "STOP_LIMIT" || orderType === "STOP_MARKET"
                  ? stopPrice
                  : entryPrice
              }
              onChange={(e) =>
                orderType === "STOP_LIMIT" || orderType === "STOP_MARKET"
                  ? setStopPrice(e.target.value)
                  : setEntryPrice(e.target.value)
              }
              onFocus={() => setSelectedInput("entry")}
              placeholder={
                orderType === "STOP_LIMIT" || orderType === "STOP_MARKET"
                  ? "Enter stop trigger price"
                  : "Click chart or enter price"
              }
              className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${selectedInput === "entry" ? "border-pink-500" : "border-slate-700/50"
                }`}
            />
            <Target className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          </div>
        </div>
      }



      {/* Take Profit Levels */}
      <div className="px-4 mb-4">
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
      <div className="px-4 mb-4">
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

      <div className="p-4 mb-4">
          <label htmlFor="Partialclose" className="block text-sm text-slate-400 ">
            Partial close
            <span className="ml-2 text-slate-200">{sliderValue}%</span>
          </label>
          <input
            type="range"
            name="Partialclose"
            id="Partialclose"
            min="0"
            max="100"
            step="1"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
      </div>

            {/* Modal Buttons */}
      <div className="px-4 mb-4 mt-4">
        <label className="block text-sm text-slate-400 mb-2">Realized PNL(USDT)</label>
        <div className="modalButtonsGroup flex gap-2 overflow-x-auto hide-scrollbar mb-4">

      <button 
        onClick={() => setShowTPSLModal(true)}
        className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
      >
        TP/SL
      </button>
      
      {showTPSLModal && <TPSLModal onClose={() => setShowTPSLModal(false)} />}

          <button  
           onClick={() => setShowModal(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-slate-800/50 text-slate-400 hover:bg-slate-700/50">
            Limit close
          </button>
          {showModal && <LimitClose onClose={() => setShowModal(false)} />}

          <button 
          className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-slate-800/50 text-slate-400 hover:bg-slate-700/50">
            Market close
          </button>

        </div>
      </div>


      <div className="footerButton flex justify-center pb-4">
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={signalPending}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {signalPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Signal...
            </>
          ) : (
            "Update Signal"
          )}
        </button>
      </div>

    </div>
  );
};

export default CreateSignalPage;

