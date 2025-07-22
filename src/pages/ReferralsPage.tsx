import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Copy,
	Share2,
	Users,
	Wallet,
	Award,
	Gift,
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import { getDecodedUserToken } from "../utils";
import useInviteDetails from "../hooks/useAcceptedInvite";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { getRewardTiers } from "../utils/invite";

const ReferralsPage = () => {
	const navigate = useNavigate();
	const [showCopiedAlert, setShowCopiedAlert] = useState(false);
	const [showSharedAlert, setShowSharedAlert] = useState(false);
	const [copied, setCopied] = useState(false);
	const [shared, setShared] = useState(false);

	const user = getDecodedUserToken();
	const {
		isInviteCount,
		isInviteLoading,
		isInviteError,
		recentReferralsDetails,
		recentReferralsLoading,
		recentReferralDetailsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInviteDetails(user!.userId);
	const loadMoreRef = useIntersectionObserver(
		([entry], observer) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && user) {
				fetchNextPage();
			}
		},
		{ threshold: 0.1 }
	);
	if (isInviteLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900">
				<div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
			</div>
		);
	}
	if (isInviteError || !isInviteCount || recentReferralDetailsError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
				<p>Something went wrong while fetching referral data.</p>
			</div>
		);
	}
	const referralData = {
		totalReferrals: isInviteCount?.data?.acceptedReferrals || 0,
		activeReferrals: isInviteCount?.data?.acceptedReferrals || 0,
		totalEarnings: isInviteCount?.data?.balance || 0,
		referralCode: isInviteCount?.data?.username || "Traderate referral link",
		recentReferrals: recentReferralsDetails,
		rewardTiers: getRewardTiers(isInviteCount?.data?.acceptedReferrals),
	};

	const copyReferralCode = () => {
		const referralLink = `${window.location.origin}/register?ref=${referralData?.referralCode}`;
		navigator.clipboard.writeText(referralLink);
		setCopied(true);
		setShowCopiedAlert(true);
		setTimeout(() => {
			setCopied(false);
			setShowCopiedAlert(false);
		}, 2000);
	};

	const shareReferralLink = () => {
		const referralLink = `${window.location.origin}/register?ref=${referralData?.referralCode}`;
		navigator.clipboard.writeText(referralLink);
		setShared(true);
		setShowSharedAlert(true);

		setTimeout(() => {
			setShared(false);
			setShowSharedAlert(false);
		}, 2000);
	};
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
						<h1 className="text-lg font-bold">Referrals</h1>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="p-4 grid grid-cols-2 gap-3">
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
						<div className="flex items-center gap-2 mb-1">
							<Users className="w-4 h-4 text-blue-500" />
							<span className="text-xs text-slate-400">Total Referrals</span>
						</div>
						<div className="text-xl font-bold text-blue-500">
							{referralData.totalReferrals}
						</div>
						<div className="text-xs text-slate-400 mt-1">
							{referralData.activeReferrals} active users
						</div>
					</div>

					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
						<div className="flex items-center gap-2 mb-1">
							<Wallet className="w-4 h-4 text-emerald-500" />
							<span className="text-xs text-slate-400">Total Earnings</span>
						</div>
						<div className="text-xl font-bold text-emerald-500">
							{referralData.totalEarnings.toFixed(2)} TRT
						</div>
						<div className="text-xs text-slate-400 mt-1">Lifetime earnings</div>
					</div>
				</div>

				{/* Referral Code Section */}
				<div className="p-4">
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Gift className="w-5 h-5 text-pink-500" />
								<span className="font-medium">Your Referral Code</span>
							</div>
							<button
								onClick={copyReferralCode}
								disabled={shared}
								className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 transition-colors
										${copied
										? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
										: "bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
									}
										${shared ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<Copy className="w-4 h-4" />
								{copied ? "Copied!" : "Copy"}
							</button>
						</div>
						<div className="bg-slate-900/50 p-3 rounded-lg font-mono text-lg text-center border border-pink-500/20">
							{referralData.referralCode}
						</div>

						<div className="flex justify-center mt-4">
							<button
								onClick={shareReferralLink}
								disabled={copied}
								className={`px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-bold flex items-center gap-2 transition-all
										  ${shared ? "opacity-80" : ""}
										  ${copied ? "opacity-50 cursor-not-allowed" : ""}
										`}
							>
								<Share2 className="w-4 h-4" />
								{shared ? "Link Copied!" : "Share Referral Link"}
							</button>
						</div>
					</div>
				</div>

				{/* Reward Tiers */}
				<div className="p-4">
					<h2 className="text-lg font-bold mb-3">Reward Tiers</h2>
					<div className="space-y-2">
						{referralData.rewardTiers.map((tier) => (
							<div
								key={tier.level}
								className={`p-4 rounded-xl border ${tier.current
									? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/30"
									: "bg-slate-800/50 border-slate-700/50"
									}`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Award
											className={`w-5 h-5 ${tier.current ? "text-pink-500" : "text-slate-400"
												}`}
										/>
										<div>
											<div className="font-medium">{tier.level}</div>
											<div className="text-sm text-slate-400">
												{tier.referrals} referrals
											</div>
										</div>
									</div>
									<div className="text-sm font-medium text-emerald-400">
										{tier.reward}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recent Referrals */}
				<div className="p-4">
					<h2 className="text-lg font-bold mb-3">Recent Referrals</h2>

					{recentReferralsLoading ? (
						<div className="flex justify-center py-6">
							<div className="w-8 h-8 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
						</div>
					) : referralData.recentReferrals?.length > 0 ? (
						<div className="space-y-2">
							{referralData.recentReferrals.map((referral) => (
								<div
									key={referral.id}
									className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
								>
									<div className="flex justify-between items-center">
										<div>
											<div className="font-medium">{referral.username}</div>
											<div className="text-sm text-slate-400">
												{referral.date}
											</div>
										</div>
										<div className="text-right">
											<div
												className={`text-sm ${referral.status === "Active"
													? "text-emerald-500"
													: "text-amber-500"
													}`}
											>
												{referral.earnings}
											</div>
											<div className="text-xs text-slate-400">
												{referral.status}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-6 text-slate-400">
							No recent referrals found.
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

				{/* Copied Alert */}
				{showCopiedAlert && (
					<div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
						<div className="bg-green-600/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg shadow-lg">
							<div className="font-semibold">Referral link copied</div>
							<div className="text-sm">You can now share it with others.</div>
						</div>
					</div>
				)}

				{showSharedAlert && (
					<div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
						<div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-6 py-3 rounded-lg shadow-lg">
							<div className="font-semibold">Referral link copied</div>
							<div className="text-sm">You can now paste and share it anywhere.</div>
						</div>
					</div>
				)}

				{/* Navigation Bar */}
				<NavigationBar onQuickAction={() => navigate("/create-signal")} />
			</div>
		</PageTransition>
	);
};

export default ReferralsPage;
