import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Users,
	Star,
	Signal,
	MessageCircle,
	Search,
	User,
} from "lucide-react";
import NavigationBar from "../components/NavigationBar";
import { getDecodedUserToken } from "../utils";
import useCommunityData from "../hooks/useCommunityData";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const CommunityPage = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const user = getDecodedUserToken();
	const {
		isCommunityCount,
		isCommunityLoading,
		isCommunityError,
		communityDetails,
		communityDetailsLoading,
		communityDetailsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useCommunityData(user!.userId);
	const loadMoreRef = useIntersectionObserver(
		([entry], observer) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && user) {
				fetchNextPage();
			}
		},
		{ threshold: 0.1 }
	);
	if (isCommunityLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900">
				<div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
			</div>
		);
	}
	if (isCommunityError || !isCommunityCount?.success || communityDetailsError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
				<p>Something went wrong while fetching referral data.</p>
			</div>
		);
	}
	const formatNumber = (num: number | undefined) => {
		if (!num) return 0;
		return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
	}
	const analysts = communityDetails;

	const filteredAnalysts = analysts.filter((analyst) =>
		analyst.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
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
					<h1 className="text-lg font-bold">Community</h1>
				</div>
			</div>

			{/* Search Bar */}
			<div className="p-4">
				<div className="relative">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search analysts..."
						className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
					/>
					<Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
				</div>
			</div>

			{/* Stats Overview */}
			<div className="px-4 mb-6">
				<div className="grid grid-cols-3 gap-3">
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
						<div className="flex items-center gap-2 mb-1">
							<Users className="w-4 h-4 text-blue-500" />
							<span className="text-xs text-slate-400">Members</span>
						</div>
						<div className="text-lg font-bold">
							{formatNumber(isCommunityCount?.data?.totalUsers)}
						</div>
					</div>

					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
						<div className="flex items-center gap-2 mb-1">
							<Signal className="w-4 h-4 text-purple-500" />
							<span className="text-xs text-slate-400">Signals</span>
						</div>
						<div className="text-lg font-bold">
							{formatNumber(isCommunityCount?.data?.totalSignals)}
						</div>
					</div>

					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
						<div className="flex items-center gap-2 mb-1">
							<MessageCircle className="w-4 h-4 text-emerald-500" />
							<span className="text-xs text-slate-400">Active</span>
						</div>
						<div className="text-lg font-bold">
							{formatNumber(isCommunityCount?.data?.activeSignals)}
						</div>
					</div>
				</div>
			</div>

			{/* Top Analysts */}
			<div className="px-4">
				<h2 className="text-lg font-bold mb-4">Top Analysts</h2>
				<div className="space-y-4">
					{communityDetailsLoading ? (
						<div className="flex justify-center py-6">
							<div className="w-8 h-8 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
						</div>
					) : filteredAnalysts.length > 0 ? (
						<>
							{filteredAnalysts.map((analyst) => (
								<div
									key={analyst.id}
									onClick={() => navigate(`/analyst/${analyst.id}`)}
									className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="relative">
											<div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
												{analyst && analyst.image ? (
													<img
														src={analyst.image}
														alt={analyst.name}
														className="w-full h-full rounded-full object-cover"
													/>
												) : (
													<User className="w-10 h-10 text-white" />
												)}
											</div>
											<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
												<Star className="w-3 h-3 text-white" />
											</div>
										</div>
										<div>
											<div className="font-medium">{analyst.name}</div>
											<div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
												{analyst.type}
											</div>
											<div className="flex items-center gap-4 mt-1">
												<span className="text-sm text-slate-400">
													{analyst.stats.signals} signals
												</span>
												<span className="text-sm text-slate-400">
													{analyst.stats.followers} followers
												</span>
												<span className="text-sm text-emerald-400">
													{analyst.stats.success} success
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</>
					) : (
						<div className="text-center py-6 text-slate-400">
							No recent referrals found.
						</div>
					)}
				</div>
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

			{/* Navigation Bar */}
			<NavigationBar onQuickAction={() => navigate("/create-signal")} />
		</div>
	);
};

export default CommunityPage;
