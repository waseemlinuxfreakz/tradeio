import { TradeResult } from "../lib/tradingLogic";
import { RiskLevel } from "./signal";

export type PortfolioStatsSuccess = {
	success: true;
	message: string;
	data: {
		totalValue: number;
		totalProfit: number;
		totalLoss: number;
		netPnL: number;
		activeTrades: number;
		completedTrades: number;
		rejectedTrades: number;
	};
};

export type PortfolioStatsError = {
	success: false;
	error: string;
};

export type StatsPortfolioResponse =
	| PortfolioStatsSuccess
	| PortfolioStatsError;

export type PortfolioDetailsSuccess = {
	success: true;
	message: string;
	data: {
		trades: TradeResult[];
		pagination: {
			limit: number;
			offset: number;
			total: number;
		};
	};
};

export type PortfolioDetailsError = {
	success: false;
	error: string;
};

export type PortfolioDetailsResponse =
	| PortfolioDetailsSuccess
	| PortfolioDetailsError;

export type PortfolioOverviewSuccess = {
	success: true;
	message: string;
	data: {
		portfolioStats: {
			totalValue: string;
			todayChange: string;
			todayChangePercent: string;
			totalProfit: string;
			totalProfitPercent: string;
		};
		performanceData: PerformanceData[];
		distribution: Distribution[];
		recentTransactions: RecentTransaction[];
	};
};

export type PortfolioOverviewError = {
	success: false;
	error: string;
};
export type RecentTransaction = {
	id: string;
	type: string;
	asset: string;
	amount: string;
	value: number;
	time: string;
	outcome:string;
};
export type PerformanceData = {
	date: string;
	value: number;
};
export type Distribution = {
	name: string;
	value: number;
	color: string;
};
export type PortfolioOverviewResponse =
	| PortfolioOverviewSuccess
	| PortfolioOverviewError;

export type UpdateTradeData = {
  takeProfitTargets: {
    allocationType: string;
    allocationValue: string;
    price: string;
  }[];
  stopLossTargets: {
    allocationType: string;
    allocationValue: string;
    price: string;
  }[];
  status?: string;
}