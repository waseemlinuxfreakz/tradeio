import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Search,
	Clock,
	AlertCircle
} from "lucide-react";
import NavigationBar from "../components/NavigationBar";
import PageTransition from "../components/PageTransition";
import { getDecodedUserToken, StatsFormatValues } from "../utils";
import usePortfolioStats from "../hooks/usePortfolioStats";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { TRADE_TYPE } from "../lib/tradingLogic";
import ActiveTradeCard from "../components/portfolio/ActiveTradeCard";
export interface TradeCoins {
	price: number
	name: string
}
const PortfolioTradesPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"active" | "completed" | "failed">(
		"active"
	);
	const [tradeCoins, setTradeCoins] = useState<TradeCoins[]>([]);
	const [tradeCoinsPrice, setTradeCoinsPrice] = useState<TradeCoins[]>([]);
	const socketRef = useRef<WebSocket | null>(null);
	// const {trades, activeTrades, completedTrades, failedTrades} = useTradeStore();

	const user = getDecodedUserToken();
	const {
		portfolioStats,
		isLoadingPortfolioStats,
		isErrorPortfolioStats,
		porfolioFlatData,
		portfolioError,
		isLoadingPortfolioStatsDetails,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = usePortfolioStats(user!.userId, activeTab);
	const [searchQuery, setSearchQuery] = useState("");


	const coinsRef = useRef<any[]>([]); // Keeps the latest coin list for reference



	const loadMoreRef = useIntersectionObserver(
		([entry], observer) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && user) {
				fetchNextPage();
			}
		},
		{ threshold: 0.1 }
	);

	const getVisibleTrades = () => {
		const allTrades = porfolioFlatData?.flatMap((page) => page?.trades);

		return allTrades?.filter((trade) => {
			const matchesTab =
				(activeTab === "active" &&
					(trade.status === TRADE_TYPE.PENDING)) ||
				(activeTab === "completed" && trade.status === TRADE_TYPE.COMPLETED) ||
				(activeTab === "failed" && trade.status === TRADE_TYPE.FAILED);

			const matchesSearch = trade.details?.pair
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			return matchesTab && matchesSearch;
		});
	};


	const calculateStats = () => {
		if (portfolioStats && 'data' in portfolioStats) {
			return {
				totalValue: portfolioStats.data.totalValue || 0,
				totalProfit: portfolioStats.data.totalProfit || 0,
				totalLoss: portfolioStats.data.totalLoss || 0,
				netPnL: portfolioStats.data.netPnL || 0,
			};
		}

		return {
			totalValue: 0,
			totalProfit: 0,
			totalLoss: 0,
			netPnL: 0,
		};
	};


	const stats = calculateStats();


	const visibleTrades = getVisibleTrades();

	useEffect(() => {
		coinsRef.current = tradeCoins;
	}, [tradeCoins]);

	useEffect(() => {
		if (tradeCoins.length === 0) return;

		if (socketRef.current) {
			socketRef.current.close();
		}

		const streamNames = tradeCoins.map(coin => `${coin.name.toLowerCase()}@ticker`);
		const streamUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames.join("/")}`;
		socketRef.current = new WebSocket(streamUrl);

		socketRef.current.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			const symbol = msg?.data?.s?.toLowerCase();
			const price = parseFloat(msg?.data?.c);

			if (!symbol || !price) return;

			setTradeCoinsPrice(prev => {
				const exists = prev.some(coin => coin.name.toLowerCase() === symbol);
				if (exists) {
					return prev.map(coin =>
						coin.name.toLowerCase() === symbol
							? { ...coin, price }
							: coin
					);
				} else {
					return [...prev, { name: symbol, price }];
				}
			});
		};

		return () => {
			socketRef.current?.close();
		};
	}, [tradeCoins]);

	useEffect(() => {
		if (visibleTrades.length === 0) return;

		const pairs = visibleTrades
			.map(trade => trade.details?.pair)
			.filter((pair): pair is string => !!pair);

		pairs.forEach(pair => {
			setTradeCoins(prev => {
				const exists = prev.some(coin => coin.name === pair);
				if (!exists) {
					return [...prev, { name: pair, price: 0 }];
				}
				return prev;
			});
		});
	}, [visibleTrades]);
	if (isLoadingPortfolioStats) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900">
				<div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
			</div>
		);
	}
	if (
		isErrorPortfolioStats ||
		!portfolioStats?.success ||
		!porfolioFlatData ||
		portfolioError
	) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
				<p>Something went wrong while fetching Portfolio Trade Page.</p>
			</div>
		);
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-slate-900 text-white pb-20">
				{/* Header */}
				<div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
					<div className="p-4 flex items-center gap-3">
						<button
							onClick={() => navigate(-1)}
							className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-lg font-bold">Portfolio Trades</h1>
					</div>
				</div>

				{/* Portfolio Stats */}
				<div className="p-4 bg-slate-800/30">
					<div className="grid grid-cols-2 gap-3 mb-4">
						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
							<div className="text-sm text-slate-400 mb-1">Total Value</div>
							<div className="text-xl font-bold">
								${StatsFormatValues(stats?.totalValue)}
							</div>
						</div>

						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
							<div className="text-sm text-slate-400 mb-1">Net P&L</div>
							<div
								className={`text-xl font-bold ${stats.netPnL >= 0 ? "text-emerald-500" : "text-rose-500"
									}`}
							>
								{stats.netPnL >= 0 ? "+" : ""}
								{StatsFormatValues(stats.netPnL)} USD
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
							<div className="flex items-center gap-2 mb-1">
								<TrendingUp className="w-4 h-4 text-emerald-500" />
								<span className="text-sm text-slate-400">Total Profit</span>
							</div>
							<div className="text-lg font-bold text-emerald-500">
								+{StatsFormatValues(stats.totalProfit)} USD
							</div>
						</div>

						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
							<div className="flex items-center gap-2 mb-1">
								<TrendingDown className="w-4 h-4 text-rose-500" />
								<span className="text-sm text-slate-400">Total Loss</span>
							</div>
							<div className="text-lg font-bold text-rose-500">
								{StatsFormatValues(stats.totalLoss)} USD
							</div>
						</div>
					</div>
				</div>

				{/* Search & Filter */}
				<div className="p-4">
					<div className="relative mb-4">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search trades..."
							className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
						/>
						<Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
					</div>

					{/* Tabs */}
					<div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
						<button
							onClick={() => setActiveTab("active")}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "active"
								? "bg-pink-500 text-white"
								: "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
								}`}
						>
							<Clock className="w-4 h-4" />
							Active ({portfolioStats.data.activeTrades})
						</button>

						<button
							onClick={() => setActiveTab("completed")}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "completed"
								? "bg-emerald-500 text-white"
								: "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
								}`}
						>
							<TrendingUp className="w-4 h-4" />
							Completed ({portfolioStats.data.completedTrades})
						</button>

						<button
							onClick={() => setActiveTab("failed")}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "failed"
								? "bg-rose-500 text-white"
								: "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
								}`}
						>
							<AlertCircle className="w-4 h-4" />
							Failed ({portfolioStats.data.rejectedTrades})
						</button>
					</div>
				</div>

				{/* Trade List */}
				<div className="p-4 space-y-4">
					{isLoadingPortfolioStatsDetails ? (
						<div className="flex justify-center py-6">
							<div className="w-8 h-8 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
						</div>
					) : visibleTrades.length > 0 ? (
						visibleTrades.map((trade) => (
							<ActiveTradeCard
								key={trade.tradeId}
								trade={trade}
								activeTab={activeTab}
								tradeCoinsPrice={tradeCoinsPrice}
							/>
						))
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
								{activeTab === "active" ? (
									<Clock className="w-8 h-8 text-slate-400" />
								) : activeTab === "completed" ? (
									<TrendingUp className="w-8 h-8 text-slate-400" />
								) : (
									<AlertCircle className="w-8 h-8 text-slate-400" />
								)}
							</div>
							<h3 className="text-lg font-medium mb-2">No trades found</h3>
							<p className="text-slate-400 max-w-sm">
								{activeTab === "active"
									? "You don't have any active trades. Execute a signal to start trading."
									: activeTab === "completed"
										? "You don't have any completed trades yet."
										: "You don't have any failed trades yet."}
							</p>
						</div>
					)}
					{hasNextPage && (
						<div
							ref={loadMoreRef}
							className="flex justify-center items-center py-4"
						>
							{isFetchingNextPage && (
								<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
									<div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
								</div>
							)}
						</div>
					)}
				</div>

				<NavigationBar onQuickAction={() => navigate("/signals")} />
			</div>
		</PageTransition>
	);
};

export default PortfolioTradesPage;
