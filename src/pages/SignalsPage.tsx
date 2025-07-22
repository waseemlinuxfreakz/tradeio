import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Plus,
	Search,
	History,
	Signal,
	CheckCircle,
	User,
	TrendingUp,
	ChevronDown,
	Star,
	Percent,
	AlertTriangle,
	VoteIcon,
	Pencil
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import SignalFilter from "../components/signals/SignalFilter";
import NavigationBar from "../components/NavigationBar";
import { useResponsive } from "../lib/useResponsive";
import useFilterSignals from "../hooks/useFilterSignals";
import { getDecodedUserToken } from "../utils";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import SignalCard from "../components/signals/SignalCard";

const SignalsPage = () => {
	const navigate = useNavigate();
	const { isMobile } = useResponsive();
	const [activeCategory, setActiveCategory] = useState("active");
	const [showFilter, setShowFilter] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTimeframe, setSelectedTimeframe] = useState("15m");
	const user = getDecodedUserToken();
	const [sortBy, setSortBy] = useState<"date" | "profit" | "consensus" | "winners" | "losers">("date");
	const [open, setOpen] = useState(false);

	const handleSelect = (value: "date" | "profit" | "consensus" | "winners" | "losers") => {
		setSortBy(value);
		setOpen(false);
	};
	const {
		filterCount,
		filterCountLoading,
		filterCountError,
		filterStatus,
		statusLoading,
		statusError,
		filterData,
		filterDataLoading,
		filterDataError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useFilterSignals(user!.userId, activeCategory, selectedTimeframe, sortBy);
	const loadMoreRef = useIntersectionObserver(
		([entry], observer) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && user) {
				fetchNextPage();
			}
		},
		{ threshold: 0.1 }
	);
	const categories = [
		{
			id: "active",
			label: "Active",
			icon: Signal,
			count: filterStatus?.data.active,
		},
		{
			id: "trending",
			label: "Trending",
			icon: TrendingUp,
			count: filterStatus?.data.trending,
		},
		{
			id: "my",
			label: "My Signals",
			icon: User,
			count: filterStatus?.data.userSignals,
		},
		{
			id: "completed",
			label: "Completed",
			icon: CheckCircle,
			count: filterStatus?.data.completedSignals,
		},
		{
			id: "history",
			label: "History",
			icon: History,
			count: filterStatus?.data.history,
		},
		{
			id: "favourites",
			label: "Favourites",
			icon: Star,
			count: filterStatus?.data.favourites,
		},
		{
			id: "myvotes",
			label: "My Votes",
			icon: VoteIcon,
			count: filterStatus?.data.myvotes,
		},
	];

	const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"];
	const stats = {
		totalSignals: filterCount?.data.totalSignals,
		activeSignals: filterCount?.data.userActiveSIgnals,
		successRate: filterCount?.data.successRate,
		avgProfit: filterCount?.data.averageProfit,
	};

	const handleCreateSignal = () => {
		navigate("/create-signal");
	};

	const handleSignalClick = (signalId: string) => {
		navigate(`/signal/${signalId}`);
	};

	const handleApplyFilters = (filters: any) => {
		setShowFilter(false);
	};

	const filteredSignals = filterData.filter((item) => {
		if (searchQuery) {
			const searchLower = searchQuery.toLowerCase();
			return (
				item.pair.toLowerCase().includes(searchLower) ||
				item.user.name.toLowerCase().includes(searchLower)
			);
		}
		return true;
	});
	if (filterCountLoading) {
		return <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-pulse">
			<div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
			<p className="text-slate-400 text-lg">
				Fetching the latest signals...
			</p>
		</div>
	}
	if (filterCountError) {
		return <div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
				<AlertTriangle className="w-8 h-8 text-slate-400" />
			</div>
			<h3 className="text-lg font-medium mb-2">No signals found</h3>
			<p className="text-slate-400 max-w-sm">
				No signals match your current filters. Try adjusting your search
				criteria or create a new signal.
			</p>
		</div>
	}
	return (
		<PageTransition>
			<div className="min-h-screen bg-slate-900 text-white pb-20">
				{/* Header */}
				<div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
					<div className="p-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<button
									onClick={() => navigate(-1)}
									className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
								>
									<ArrowLeft className="w-5 h-5" />
								</button>
								<h1 className="text-lg font-bold">Signals</h1>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={handleCreateSignal}
									className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
								>
									<Plus className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Stats Overview */}
						<div className="grid grid-cols-4 gap-2 mb-4">
							<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
								<div className="flex items-center gap-2 mb-1">
									<Signal className="w-4 h-4 text-blue-500" />
									<span className="text-xs text-slate-400">Total</span>
								</div>
								{stats && stats.totalSignals ? <div className="text-lg font-bold">{stats.totalSignals}</div> :
									<div className="text-lg font-bold">0</div>}
							</div>
							<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
								<div className="flex items-center gap-2 mb-1">
									<TrendingUp className="w-4 h-4 text-emerald-500" />
									<span className="text-xs text-slate-400">Active</span>
								</div>
								{stats && stats.activeSignals ? (
									<div className="text-lg font-bold text-emerald-500">
										{stats.activeSignals}
									</div>
								) : (
									<div className="text-lg font-bold text-emerald-500">0</div>
								)}
							</div>
							<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
								<div className="flex items-center gap-2 mb-1">
									<CheckCircle className="w-4 h-4 text-purple-500" />
									<span className="text-xs text-slate-400">Success</span>
								</div>
								{stats && stats.successRate ? (
									<div className="text-lg font-bold text-purple-500">
										{stats.successRate}%
									</div>
								) : (
									<div className="text-lg font-bold text-purple-500">0%</div>
								)}
							</div>
							<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
								<div className="flex items-center gap-2 mb-1">
									<Percent className="w-4 h-4 text-pink-500" />
									<span className="text-xs text-slate-400">Avg. Profit</span>
								</div>
								{stats && stats.avgProfit ? (
									<div className="text-lg font-bold text-pink-500">
										{stats.avgProfit}%
									</div>
								) : (
									<div className="text-lg font-bold text-pink-500">0%</div>
								)}
							</div>
						</div>

						{/* Search Bar */}
						<div className="relative mb-4">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search signals..."
								className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
							/>
							<Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
						</div>

						{/* Categories */}
						<div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => {
										if (category.id === "myvotes") {
											setActiveCategory(category.id)
											setSortBy("winners")
										} else {
											setActiveCategory(category.id)
										}
									}}
									className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category.id
										? "bg-pink-500 text-white"
										: "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
										}`}
								>
									<category.icon className="w-4 h-4" />
									<span>{category.label}</span>
									<span className="px-1.5 py-0.5 rounded-full bg-slate-700/50 text-xs">
										{category.count}
									</span>
								</button>
							))}
						</div>

						{/* Timeframe & Sort */}
						<div className="flex justify-between items-center">
							<div className="flex gap-2">
								{timeframes.map((tf) => (
									<button
										key={tf}
										onClick={() => setSelectedTimeframe(tf)}
										className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTimeframe === tf
											? "bg-slate-700 text-white"
											: "text-slate-400 hover:bg-slate-800/50"
											}`}
									>
										{tf}
									</button>
								))}
							</div>
							<div className="relative inline-block text-left">
								<button
									onClick={() => setOpen(!open)}
									className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
								>
									<span>
										Sort by:
										{sortBy === "date"
											? "Date"
											: sortBy === "profit"
												? "Profit"
												: sortBy === "consensus"
													? "Consensus"
													: activeCategory === "myvotes" && sortBy === "winners"
														? "Winner"
														: activeCategory === "myvotes" && sortBy === "losers"
															? "Loser"
															: ""}
									</span>

									<ChevronDown className="w-4 h-4" />
								</button>

								{open && (
									<div className="absolute mt-2 w-28 bg-slate-800 border border-slate-700 rounded shadow-lg z-10">
										<ul className="text-sm text-slate-300">

											{activeCategory === "myvotes" ? (
												<>
													<li>
														<button
															onClick={() => handleSelect("winners")}
															className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${sortBy === "winners" ? "text-white font-semibold" : ""
																}`}
														>
															Winner
														</button>
													</li>
													<li>
														<button
															onClick={() => handleSelect("losers")}
															className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${sortBy === "losers" ? "text-white font-semibold" : ""
																}`}
														>
															loser
														</button>
													</li>
												</>
											) : (<>
												<li>
													<button
														onClick={() => handleSelect("date")}
														className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${sortBy === "date" ? "text-white font-semibold" : ""
															}`}
													>
														Date
													</button>
												</li>
												<li>
													<button
														onClick={() => handleSelect("profit")}
														className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${sortBy === "profit" ? "text-white font-semibold" : ""
															}`}
													>
														Profit
													</button>
												</li>
												<li>
													<button
														onClick={() => handleSelect("consensus")}
														className={`w-full text-left px-4 py-2 hover:bg-slate-700 ${sortBy === "consensus" ? "text-white font-semibold" : ""
															}`}
													>
														consensus
													</button>
												</li>
											</>)}
										</ul>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="p-4 towColumSignal">
					{filterDataLoading ? (
						<div className="flex flex-col items-center justify-center py-16 space-y-4 animate-pulse">
							<div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
							<p className="text-slate-400 text-lg">
								Fetching the latest signals...
							</p>
						</div>
					) : statusError || filterDataError ? (
						<div className="flex flex-col items-center justify-center py-16 text-red-500 space-y-4">
							<AlertTriangle className="w-10 h-10" />
							<p className="text-lg font-semibold">
								Oops! Something went wrong.
							</p>
							<p className="text-sm text-red-400">
								Unable to fetch signals. Please try again later.
							</p>
						</div>
					) : filteredSignals && filteredSignals.length > 0 ? (
						<div
							className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"
								} gap-4`}
						>
							{filteredSignals.map((signal) => (
								<SignalCard
									key={signal.id}
									signal={signal}
									onClick={() => handleSignalClick(signal.id)}
									isSignalsPage={true}
									activeCategory={activeCategory}
									loading={filterDataLoading || statusLoading}
									sortBy={sortBy}
									timeframe={selectedTimeframe}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
								<AlertTriangle className="w-8 h-8 text-slate-400" />
							</div>
							<h3 className="text-lg font-medium mb-2">No signals found</h3>
							<p className="text-slate-400 max-w-sm">
								No signals match your current filters. Try adjusting your search
								criteria or create a new signal.
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

				{/* Filter Modal */}
				<SignalFilter
					isOpen={showFilter}
					onClose={() => setShowFilter(false)}
					onApply={handleApplyFilters}
				/>

				{/* Navigation Bar */}
				<NavigationBar onQuickAction={handleCreateSignal} />
			</div>
		</PageTransition>
	);
};

export default SignalsPage;
