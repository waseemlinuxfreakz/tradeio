import { create } from "zustand";
import { ORDER_TYPE } from "../types/signal";

// Types for trading logic
export interface TradeParameters {
	signalId: string;
	coin: string;
	type: "LONG" | "SHORT";
	tradeAmount: string | number;
	leveragePercent: number;
	entryPrice: string | number;
	takeProfit: string | number;
	stopLoss: string | number;
	orderType?: ORDER_TYPE;
	coordinatedExecution?: boolean;
	minimumConsensus?: string;
}
export interface RiskLevelVal {
	price: string | number;
	allocationType: "percentage" | "amount";
	allocationValue: string;
}
export interface Tradingtype {
	signalId: string;
	coin: string;
	type: "LONG" | "SHORT";
	tradeAmount: string | number;
	leveragePercent: number;
	entryPrice: string | number;
	takeProfitTargets: RiskLevelVal[];
	stopLossTargets: RiskLevelVal[];
	orderType?: ORDER_TYPE;
	coordinatedExecution?: boolean;
	minimumConsensus?: string;
}

export interface TradeResult {
	success: boolean;
	tradeId?: string;
	message: string;
	executedAt: string;
	status: "pending" | "active" | "completed" | "failed";
	details?: {
		pair: string;
		type: "LONG" | "SHORT";
		entryPrice: number;
		currentPrice?: number;
		takeProfit: number;
		stopLoss: number;
		amount: number;
		leverage: number;
		potentialProfit: number;
		maxLoss: number;
		liquidationPrice?: number;
		pnl?: number;
		orderType?: ORDER_TYPE;
		executedProfit?: number;
		executedLoss?: number
	};
}

// Store for managing trades
interface TradeStore {
	trades: Record<string, TradeResult>;
	pendingTrades: string[];
	activeTrades: string[];
	completedTrades: string[];
	failedTrades: string[];

	// Actions
	executeTrade: (params: TradeParameters) => Promise<TradeResult>;
	updateTradeStatus: (
		tradeId: string,
		status: "pending" | "active" | "completed" | "failed"
	) => void;
	getTrade: (tradeId: string) => TradeResult | undefined;
	getAllTrades: () => TradeResult[];
}

export const useTradeStore = create<TradeStore>((set, get) => ({
	trades: {},
	pendingTrades: [],
	activeTrades: [],
	completedTrades: [],
	failedTrades: [],

	executeTrade: async (params: TradeParameters) => {
		try {

			// Generate a unique trade ID
			const tradeId = `trade_${Date.now()}_${Math.random()
				.toString(36)
				.substring(2, 9)}`;

			// Calculate potential profit and max loss
			const entryPrice =
				typeof params.entryPrice === "string"
					? parseFloat(params.entryPrice.replace(/,/g, ""))
					: params.entryPrice;
			const takeProfit =
				typeof params.takeProfit === "string"
					? parseFloat(params.takeProfit.replace(/,/g, ""))
					: params.takeProfit;
			const stopLoss =
				typeof params.stopLoss === "string"
					? parseFloat(params.stopLoss.replace(/,/g, ""))
					: params.stopLoss;
			const amount =
				typeof params.tradeAmount === "string"
					? parseFloat(params.tradeAmount)
					: params.tradeAmount;
			const leverage = params.leveragePercent

			// Calculate potential profit and max loss based on trade type
			let potentialProfit, maxLoss, liquidationPrice;

			if (params.type === "LONG") {
				potentialProfit =
					((takeProfit - entryPrice) / entryPrice) * amount * leverage;
				maxLoss = ((entryPrice - stopLoss) / entryPrice) * amount * leverage;
				liquidationPrice = entryPrice * (1 - (1 / leverage) * 0.95); // 95% of margin used
			} else {
				potentialProfit =
					((entryPrice - takeProfit) / entryPrice) * amount * leverage;
				maxLoss = ((stopLoss - entryPrice) / entryPrice) * amount * leverage;
				liquidationPrice = entryPrice * (1 + (1 / leverage) * 0.95); // 95% of margin used
			}

			// Create trade result
			const tradeResult: TradeResult = {
				success: true,
				tradeId,
				message: "Trade executed successfully",
				executedAt: new Date().toISOString(),
				status: "active",
				details: {
					pair: params.coin,
					type: params.type,
					entryPrice,
					takeProfit,
					stopLoss,
					amount,
					leverage: leverage,
					potentialProfit,
					maxLoss,
					liquidationPrice,
					currentPrice: entryPrice,
				},
			};

			// Update store
			set((state) => {
				const newTrades = { ...state.trades, [tradeId]: tradeResult };
				const newActiveTrades = [...state.activeTrades, tradeId];

				return {
					trades: newTrades,
					activeTrades: newActiveTrades,
				};
			});

			// Simulate trade updates (for demo purposes)
			setTimeout(() => {
				simulateTradeUpdates(
					tradeId,
					params.type,
					entryPrice,
					takeProfit,
					stopLoss
				);
			}, 5000);

			return tradeResult;
		} catch (error) {
			console.error("Trade execution failed:", error);

			const errorResult: TradeResult = {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
				executedAt: new Date().toISOString(),
				status: "failed",
			};

			return errorResult;
		}
	},

	updateTradeStatus: (tradeId, status) => {
		set((state) => {
			// Get the current trade
			const trade = state.trades[tradeId];
			if (!trade) return state;

			// Create updated trade
			const updatedTrade = { ...trade, status };

			// Update lists based on new status
			let pendingTrades = [...state.pendingTrades];
			let activeTrades = [...state.activeTrades];
			let completedTrades = [...state.completedTrades];
			let failedTrades = [...state.failedTrades];

			// Remove from all lists first
			pendingTrades = pendingTrades.filter((id) => id !== tradeId);
			activeTrades = activeTrades.filter((id) => id !== tradeId);
			completedTrades = completedTrades.filter((id) => id !== tradeId);
			failedTrades = failedTrades.filter((id) => id !== tradeId);

			// Add to appropriate list
			switch (status) {
				case "pending":
					pendingTrades.push(tradeId);
					break;
				case "active":
					activeTrades.push(tradeId);
					break;
				case "completed":
					completedTrades.push(tradeId);
					break;
				case "failed":
					failedTrades.push(tradeId);
					break;
			}

			return {
				trades: { ...state.trades, [tradeId]: updatedTrade },
				pendingTrades,
				activeTrades,
				completedTrades,
				failedTrades,
			};
		});
	},

	getTrade: (tradeId) => {
		return get().trades[tradeId];
	},

	getAllTrades: () => {
		return Object.values(get().trades);
	},
}));

// Helper function to simulate trade updates over time (for demo purposes)
function simulateTradeUpdates(
	tradeId: string,
	tradeType: "LONG" | "SHORT",
	entryPrice: number,
	takeProfit: number,
	stopLoss: number
) {
	// Simulation parameters
	const updateInterval = 5000; // 5 seconds
	const priceVolatility = 0.002; // 0.2% price movement per update
	const maxUpdates = 20; // Maximum number of updates

	let updates = 0;

	const updateInterval$ = setInterval(() => {
		const trade = useTradeStore.getState().trades[tradeId];
		if (!trade || !trade.details || updates >= maxUpdates) {
			clearInterval(updateInterval$);
			return;
		}

		updates++;

		// Generate a random price movement
		const priceChange = (Math.random() * 2 - 1) * priceVolatility * entryPrice;
		const newPrice = (trade.details.currentPrice || entryPrice) + priceChange;

		// Update the trade with the new price
		useTradeStore.setState((state) => {
			const updatedTrade = {
				...state.trades[tradeId],
				details: {
					...state.trades[tradeId].details!,
					currentPrice: newPrice,
				},
			};

			// Check if take profit or stop loss has been hit
			if (
				(tradeType === "LONG" && newPrice >= takeProfit) ||
				(tradeType === "SHORT" && newPrice <= takeProfit)
			) {
				updatedTrade.status = "completed";
				updatedTrade.message = "Take profit reached";
				clearInterval(updateInterval$);

				// Update status lists
				const newActiveTrades = state.activeTrades.filter(
					(id) => id !== tradeId
				);
				const newCompletedTrades = [...state.completedTrades, tradeId];

				return {
					trades: { ...state.trades, [tradeId]: updatedTrade },
					activeTrades: newActiveTrades,
					completedTrades: newCompletedTrades,
				};
			}

			if (
				(tradeType === "LONG" && newPrice <= stopLoss) ||
				(tradeType === "SHORT" && newPrice >= stopLoss)
			) {
				updatedTrade.status = "failed";
				updatedTrade.message = "Stop loss triggered";
				clearInterval(updateInterval$);

				// Update status lists
				const newActiveTrades = state.activeTrades.filter(
					(id) => id !== tradeId
				);
				const newFailedTrades = [...state.failedTrades, tradeId];

				return {
					trades: { ...state.trades, [tradeId]: updatedTrade },
					activeTrades: newActiveTrades,
					failedTrades: newFailedTrades,
				};
			}

			return {
				trades: { ...state.trades, [tradeId]: updatedTrade },
			};
		});
	}, updateInterval);
}

// Function to execute a trade
export const executeTrade = async (
	params: TradeParameters
): Promise<TradeResult> => {
	return useTradeStore.getState().executeTrade(params);
};
