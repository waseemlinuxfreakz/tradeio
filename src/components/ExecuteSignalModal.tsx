import  { useState, useEffect, useRef } from "react";
import {
	X,
	DollarSign,
	Percent,
	ArrowUpCircle,
	ArrowDownCircle,
	Send,
	Target,
	ChevronRight,
	Loader2,
	CheckCircle,
} from "lucide-react";
import { createChart, ColorType, CandlestickData } from "lightweight-charts";
import { useResponsive } from "../lib/useResponsive";
import { Signals } from "../types/signal";
import { createUserTrade } from "../apis/apiEndpoints";
import { message } from "antd";
import { Tradingtype } from "../lib/tradingLogic";

interface ExecuteSignalModalProps {
	onClose: () => void;
	signalData?: Signals
}

const ExecuteSignalModal = ({ onClose, signalData }: ExecuteSignalModalProps) => {
	const { isMobile, isTablet } = useResponsive();
	const [amount, setAmount] = useState("");
	const [leverage, setLeverage] = useState(100);
	const [coordinatedExecution, setCoordinatedExecution] = useState(false);
	const [minimumConsensus, setMinimumConsensus] = useState(50);
	const [savePreferences, setSavePreferences] = useState(false);
	const [isExecuting, setIsExecuting] = useState(false);
	const [executionSuccess, setExecutionSuccess] = useState(false);
	const [executionMessage, setExecutionMessage] = useState("");
	const chartContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!chartContainerRef.current || !signalData) return;

		const chartHeight = isMobile ? 180 : isTablet ? 250 : 300;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: "#131722" },
				textColor: "#94a3b8",
				fontSize: isMobile ? 10 : 12,
			},
			grid: {
				vertLines: { color: "rgba(148, 163, 184, 0.1)" },
				horzLines: { color: "rgba(148, 163, 184, 0.1)" },
			},
			width: chartContainerRef.current.clientWidth,
			height: chartHeight,
			timeScale: {
				timeVisible: true,
				secondsVisible: false,
				borderColor: "rgba(148, 163, 184, 0.2)",
				fixLeftEdge: true,
				fixRightEdge: true,
			},
			rightPriceScale: {
				borderColor: "rgba(148, 163, 184, 0.2)",
				scaleMargins: { top: 0.2, bottom: 0.2 },
			},
			crosshair: {
				mode: 1,
				vertLine: {
					color: "#94a3b8",
					labelBackgroundColor: "#1e293b",
				},
				horzLine: {
					color: "#94a3b8",
					labelBackgroundColor: "#1e293b",
				},
			},
			handleScroll: false,
			handleScale: false,
		});

		const candlestickSeries = chart.addCandlestickSeries({
			upColor: "#10b981",
			downColor: "#ef4444",
			borderUpColor: "#10b981",
			borderDownColor: "#ef4444",
			wickUpColor: "#10b981",
			wickDownColor: "#ef4444",
		});

		const loadData = async () => {
			try {
				const data = await generateSampleData();

				// ✅ Step 1: Set data first
				candlestickSeries.setData(data);

				// ✅ Step 2: Add price lines AFTER setData
				if (signalData.entryPrice)
					candlestickSeries.createPriceLine({
						price: signalData.entryPrice,
						color: "#60a5fa",
						lineWidth: 2,
						title: "Entry",
						axisLabelVisible: true,
						axisLabelTextColor: "#FFFFFF",
					});

				if (signalData.takeProfit)
					candlestickSeries.createPriceLine({
						price: signalData.takeProfit,
						color: "#10b981",
						lineWidth: 2,
						title: "Take Profit",
						axisLabelVisible: true,
						axisLabelTextColor: "#FFFFFF",
					});

				if (signalData.stopLoss)
					candlestickSeries.createPriceLine({
						price: signalData.stopLoss,
						color: "#ef4444",
						lineWidth: 2,
						title: "Stop Loss",
						axisLabelVisible: true,
						axisLabelTextColor: "#FFFFFF",
					});
			} catch (err) {
				console.error("Error loading chart data:", err);
			}
		};

		loadData();

		const handleResize = () => {
			if (chartContainerRef.current) {
				chart.applyOptions({
					width: chartContainerRef.current.clientWidth,
					height: chartHeight,
				});
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			chart.remove();
		};
	}, [signalData, isMobile, isTablet]);

	const generateSampleData = async () => {
		const response = await fetch(
			`https://api.binance.com/api/v3/klines?symbol=${signalData!.pair
			}&interval=${signalData!.timeframe}&limit=100`
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const candleData = data
			.map((d: any) => ({
				time: d[0] / 1000,
				open: parseFloat(d[1]),
				high: parseFloat(d[2]),
				low: parseFloat(d[3]),
				close: parseFloat(d[4]),
			}))
			.sort(
				(a: CandlestickData, b: CandlestickData) =>
					(a.time as number) - (b.time as number)
			);

		return candleData;
	};

	const handleExecute = async () => {
		if (!amount || !leverage || !signalData) {
			setExecutionMessage("Please fill in all required fields");
			return;
		}

		setIsExecuting(true);
		setExecutionMessage("");
		try {
			const tradeParams: Tradingtype = {
				signalId: signalData!.id,
				coin: signalData.pair,
				type: signalData.type,
				tradeAmount: parseFloat(amount),
				leveragePercent: leverage,
				entryPrice: signalData.entryPrice,
				takeProfitTargets: [{
					price: signalData.takeProfit,
					allocationType: "amount",
					allocationValue: "100",
				}],
				stopLossTargets: [{
					price: signalData.stopLoss,
					allocationType: "amount",
					allocationValue: "100",
				}],
				orderType: signalData.ordertype,
				coordinatedExecution,
				minimumConsensus: `${minimumConsensus}%`,
			};

			// Execute trade
			createUserTrade(tradeParams)
				.then((response) => {
					if (response.status === 201) {
						setExecutionSuccess(false);
						setIsExecuting(false);
						message.success("Trade executed successfully!");
						onClose();
					}
					if (response.status === 409) {
						setExecutionSuccess(false);
						setIsExecuting(false);
						message.error(response.data.message);
					}
					if (response.status === 400) {
						setExecutionSuccess(false);
						setIsExecuting(false);
						message.error(response.data.message);
					}
				})
				.catch((error) => {
					if (error?.response?.data?.error) {
						setExecutionSuccess(false);
						setExecutionMessage("Failed to Execute Trade ");
						message.error(error);
					}
				})
				.finally(() => {
					setExecutionSuccess(false);
				});
			// Save preferences if selected
			if (savePreferences) {
				localStorage.setItem(
					"signalPreferences",
					JSON.stringify({
						coordinatedExecution,
						minimumConsensus,
					})
				);
			}
		} catch (error) {
			console.error("Failed to execute trade:", error);
			setExecutionSuccess(false);
			setExecutionMessage(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
			setIsExecuting(false);
		}
	};

	// Split trading pair into base and quote currencies
	const [baseCurrency, quoteCurrency] = (signalData?.pair || "BTC/USDT").split(
		"/"
	);

	const gainPercentage = (
		((signalData!.takeProfit - signalData!.entryPrice) /
			signalData!.entryPrice) *
		100
	).toFixed(2);
	const lossPercentage = (
		((signalData!.entryPrice - signalData!.stopLoss) / signalData!.entryPrice) *
		100
	).toFixed(2);
	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-2 z-[60] overflow-y-auto">
			<div
				className={`w-full ${isMobile ? "max-w-full" : isTablet ? "max-w-2xl" : "max-w-3xl"
					} bg-slate-900/95 backdrop-blur-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300 border border-slate-700/50 shadow-2xl shadow-pink-500/10 my-2`}
			>
				{/* Header */}
				<div className="relative bg-gradient-to-r from-slate-900 to-slate-800 px-3 sm:px-6 py-3 border-b border-slate-700/50">
					<div className="flex justify-between items-center">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="text-lg font-bold text-white">
									{baseCurrency}
								</span>
								<ChevronRight className="w-4 h-4 text-slate-400" />
								<span className="text-base text-slate-300">
									{quoteCurrency}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${signalData?.type === "LONG"
										? "bg-emerald-500/20 text-emerald-400"
										: "bg-rose-500/20 text-rose-400"
										}`}
								>
									{signalData?.type}
								</span>
							</div>
							<div className="text-xs text-slate-400">
								Execute trade with optimal parameters
							</div>
						</div>
						<button
							onClick={onClose}
							className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-700/50 transition-colors group"
							disabled={isExecuting}
						>
							<X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-3 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto max-h-[80vh]">

					
					{/* Signal Info */}
					<div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
						<div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
							<div className="flex items-center gap-2 mb-1">
								<Target className="w-4 h-4 text-blue-500" />
								{(signalData?.ordertype === "LIMIT" || signalData?.ordertype === "MARKET") && <span className="text-xs text-slate-300">Entry Price</span>}
								{(signalData?.ordertype === "STOP_LIMIT" || signalData?.ordertype === "STOP_MARKET") && <span className="text-xs text-slate-300">Stop Price</span>}

							</div>
							<div className="text-base font-medium text-blue-500">
								${signalData!.entryPrice || "45,000"}
							</div>
							<div className="text-xs text-blue-400 mt-1">
								Current market price
							</div>
						</div>

						<div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
							<div className="flex items-center gap-2 mb-1">
								<ArrowUpCircle className="w-4 h-4 text-emerald-500" />
								<span className="text-xs text-slate-300">Take Profit</span>
							</div>
							<div className="text-base font-medium text-emerald-500">
								${signalData?.takeProfit || "48,500"}
							</div>
							<div className="text-xs text-emerald-400 mt-1">
								+{gainPercentage}% potential gain
							</div>
						</div>

						<div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
							<div className="flex items-center gap-2 mb-1">
								<ArrowDownCircle className="w-4 h-4 text-rose-500" />
								<span className="text-xs text-slate-300">Stop Loss</span>
							</div>
							<div className="text-base font-medium text-rose-500">
								${signalData?.stopLoss || "42,500"}
							</div>
							<div className="text-xs text-rose-400 mt-1">
								{lossPercentage}% max loss
							</div>
						</div>
					</div>


					{/* Chart */}
					<div className="bg-[#131722] rounded-xl border border-slate-700/50 overflow-hidden shadow-inner">
						<div
							ref={chartContainerRef}
							className="w-full"
							style={{
								height: isMobile ? "180px" : isTablet ? "250px" : "300px",
							}}
						/>
					</div>

					{/* Signal Options */}
					<div className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-6 rounded-xl border border-slate-700/30 space-y-3 sm:space-y-4">
						<h4 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
							Signal Options
						</h4>

						{/* Coordinated Execution */}
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium text-sm">Coordinated Execution</div>
								<div className="text-xs text-slate-400">
									Execute together with signal creator
								</div>
							</div>
							<button
								onClick={() => setCoordinatedExecution(!coordinatedExecution)}
								className={`w-12 h-6 rounded-full transition-all duration-300 ${coordinatedExecution
									? "bg-gradient-to-r from-pink-500 to-purple-600"
									: "bg-slate-700"
									}`}
								disabled={isExecuting}
							>
								<div
									className={`w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 transform ${coordinatedExecution ? "translate-x-7" : "translate-x-1"
										}`}
								/>
							</button>
						</div>

						{/* Minimum Consensus */}
						<div className="space-y-2">
							<div className="flex items-center justify-between mb-1">
								<div>
									<div className="font-medium text-sm">Minimum Consensus</div>
									<div className="text-xs text-slate-400">
										Required community agreement
									</div>
								</div>
								<span className="text-xs font-medium text-pink-500">
									{minimumConsensus}%
								</span>
							</div>
							<div className="relative">
								<input
									type="range"
									min="0"
									max="100"
									value={minimumConsensus}
									onChange={(e) =>
										setMinimumConsensus(parseInt(e.target.value))
									}
									className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20"
									disabled={isExecuting}
								/>
								<div className="absolute -bottom-5 left-0 right-0 flex justify-between text-xs text-slate-400">
									<span>Low Risk</span>
									<span>Balanced</span>
									<span>High Reward</span>
								</div>
							</div>
						</div>

						{/* Save Preferences */}
						<div className="flex items-center gap-3 pt-4">
							<input
								type="checkbox"
								id="save-preferences"
								checked={savePreferences}
								onChange={(e) => setSavePreferences(e.target.checked)}
								className="w-4 h-4 rounded-md border-slate-600 bg-slate-700 text-pink-500 
                  focus:ring-pink-500 focus:ring-offset-0 focus:ring-offset-transparent"
								disabled={isExecuting}
							/>
							<label
								htmlFor="save-preferences"
								className="text-xs text-slate-300"
							>
								Save preferences for next time
							</label>
						</div>
					</div>

					{/* Trade Amount & Leverage */}
					{/* Update by Wassem */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

						<div className="relative">
							<label className="block text-xs text-slate-400 mb-1">
								Trade Amount <span className="valueRange font-medium text-sm text-white">{amount}$</span>
							</label>
							<div className="relative group space-y-2">
								<div className="relative flex items-center">
								<input
									type="range"
									min="10"
									max="10000"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									step="10"
									className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer pl-8
									[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
									[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
									[&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
									[&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
									[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
									hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
									disabled={isExecuting}
								/>
								</div>
							</div>
						</div>

						<div className="relative">
							<label className="block text-xs text-slate-400 mb-1">
								Leverage <span className="valueRange font-medium text-sm text-white">{leverage}x</span>
							</label>
							<div className="relative group space-y-2">
								<input
								type="range"
								min="1"
								max="100"
								value={leverage}
								onChange={(e) => setLeverage(Number(e.target.value))}
								className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
									[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
									[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
									[&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
									[&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
									[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
									hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
								disabled={isExecuting}
								/>
								<div className="flex justify-between text-xs text-slate-400 px-1">
								<span>1x</span>
								<span>50x</span>
								<span>100x</span>
								</div>
							</div>
						</div>

					</div>

					{/* Error/Success Message */}
					{executionMessage && (
						<div
							className={`p-3 rounded-xl ${executionSuccess
								? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
								: "bg-rose-500/10 border border-rose-500/30 text-rose-400"
								}`}
						>
							<div className="flex items-center gap-2">
								{executionSuccess ? (
									<CheckCircle className="w-4 h-4" />
								) : (
									<X className="w-4 h-4" />
								)}
								<span className="text-sm">{executionMessage}</span>
							</div>
						</div>
					)}

					<button
						onClick={handleExecute}
						disabled={isExecuting || !amount || !leverage}
						className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl 
              font-medium hover:opacity-90 transition-all transform hover:scale-[0.99] 
              active:scale-[0.97] flex items-center justify-center gap-2 group shadow-xl 
              shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isExecuting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								<span className="text-sm">Executing Trade...</span>
							</>
						) : (
							<>
								<Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								<span className="text-sm">Execute Now</span>
							</>
						)}
					</button>
				</div>

				<div className="bg-gradient-to-r from-slate-900 to-slate-800 px-3 sm:px-6 py-3 border-t border-slate-700/50">
					<p className="text-xs text-slate-400 text-center">
						Please confirm your trade details before execution
					</p>
				</div>
			</div>
		</div>
	);
};

export default ExecuteSignalModal;
