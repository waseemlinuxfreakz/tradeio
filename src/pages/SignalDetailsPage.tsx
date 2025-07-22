import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	Share2,
	User,
} from "lucide-react";
import ChartSection from "../components/dashboard/ChartSection";
import SignalDetailsSection from "../components/dashboard/SignalDetailsSection";
import SignalParameters from "../components/dashboard/SignalParameters";
import ShareModal from "../components/ShareModal";
import PageTransition from "../components/PageTransition";
import SignalVotingControls from "../components/signals/SignalVotingControls";
import ExecuteSignalModal from "../components/ExecuteSignalModal";
import { getDecodedUserToken, getHoursAgo } from "../utils";
import useSignalDetailsById from "../hooks/useSignalDetailsById";
import { Spin } from "antd";
import { SignalByIdResponse } from "../types/signal";
import useUserDetials from "../hooks/useUserDetails";

const SignalDetailsPage = () => {
	const { signalId } = useParams();

	if (!signalId) return;
	const navigate = useNavigate();
	const [showShareModal, setShowShareModal] = React.useState(false);
	const [showExecuteModal, setShowExecuteModal] = React.useState(false);
	const chartRef = useRef<HTMLDivElement>(null);
	const user = getDecodedUserToken();
	const { userDetails, userDetialsLoading } = useUserDetials(user!.userId);
	const { signalDetailsResult: signalDetailsData, signalDetailsLoading } =
		useSignalDetailsById(user!.userId, signalId);
	if (!signalDetailsData) return;
	if (signalDetailsLoading || userDetialsLoading) {
		return (
			<PageTransition>
				<div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">
					<Spin size="large" />
				</div>
			</PageTransition>
		);
	}
	if (signalDetailsData.success === false) {
		return (
			<PageTransition>
				<div className="min-h-screen flex justify-center flex-col items-center bg-slate-900 text-white">
					<p className="text-red-500">Failed to load signal details. Head Back to Dashboard</p>
					<button
						onClick={() => navigate("/dashboard")}
						className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mt-4">
						Back to Dashboard
					</button>
				</div>
			</PageTransition>
		);
	}

	const calculateRiskRewardRatioForCurrentPrice = () => {
		const takeProfit = Number.isFinite(signalDetailsData?.data?.takeProfit) ? signalDetailsData?.data?.takeProfit : 0;
		const stopLoss = Number.isFinite(signalDetailsData?.data?.stopLoss) ? signalDetailsData?.data?.stopLoss : 0;
		const currentPrice = signalDetailsData?.data?.currentPrice || 0;

		const potentialProfit = takeProfit - currentPrice;
		const potentialLoss = currentPrice - stopLoss;

		if (potentialLoss <= 0) return '1:0';

		const ratio = Math.abs(potentialProfit / potentialLoss).toFixed(1);
		return `1:${ratio}`;
	};


	const signalData = {
		id: signalDetailsData!.data?.id,
		pair: signalDetailsData!.data?.pair,
		type: signalDetailsData!.data?.type,
		entry: signalDetailsData!.data?.entryPrice?.toString() ?? "",
		takeProfit: signalDetailsData!.data?.takeProfit?.toString() ?? "",
		stopLoss: signalDetailsData!.data?.stopLoss?.toString() ?? "",
		consensus: signalDetailsData!.data?.user?.consensus?.toString() ?? "",
		votes: signalDetailsData!.data,
		time: getHoursAgo(signalDetailsData!.data?.time),
		riskReward: calculateRiskRewardRatioForCurrentPrice(),
		status: "Active Signal",
		analyst: {
			name: signalDetailsData!.data?.user?.name,
			image: signalDetailsData!.data?.user?.image,
			type: signalDetailsData!.data?.user?.badge,
			stats: {
				signals: signalDetailsData?.data?.totalSignals,
				followers: signalDetailsData!.data?.user?.followers.toString(),
				success: signalDetailsData!.data?.user?.successRate,
			},
		},
		currentPrice: signalDetailsData?.data?.currentPrice
	};
	const voteData = {
		totalVotes: signalDetailsData!.data!.community!.votes ?? 0,
		userVote: signalDetailsData!.data!.userVote ?? "",
		consensus: signalDetailsData!.data!.community!.consensus ?? 0,
		validator: {
			validatorPositive: signalDetailsData!.data!.validator!.validatorPositive,
			validatorNegative: signalDetailsData!.data!.validator!.validatorNegative,
			verifiedValidators: signalDetailsData!.data!.validator!.verifiedValidators,
			validatorPercentage: signalDetailsData!.data!.validator!.validatorPercentage,
		},
		community: {
			communityPositive: signalDetailsData!.data!.community!.communityPositive,
			communityNegative: signalDetailsData!.data!.community!.communityNegative,
			votes: signalDetailsData!.data!.community!.votes,
			consensus: signalDetailsData!.data!.community!.consensus,
			verifiedCommunity: signalDetailsData!.data!.community!.verifiedCommunity
		},
	}

	const handleShare = () => {
		setShowShareModal(true);
	};
	const calculatePotentialGainLoss = (
		signalDetailsData: SignalByIdResponse) => {

		const { entryPrice, type, takeProfit, stopLoss } = signalDetailsData?.data

		if (!entryPrice) return null;
		let gainPercent: number;
		let lossPercent: number;

		if (type === "LONG") {
			gainPercent = ((takeProfit - entryPrice) / entryPrice) * 100;
			lossPercent = ((stopLoss - entryPrice) / entryPrice) * 100;
		} else {
			gainPercent = ((entryPrice - takeProfit) / entryPrice) * 100;
			lossPercent = ((entryPrice - stopLoss) / entryPrice) * 100;
		}


		return {
			gainPercent: parseFloat(gainPercent.toFixed(2)),
			lossPercent: parseFloat(lossPercent.toFixed(2)),
		};
	};
	const potentiapotentialloss = calculatePotentialGainLoss(signalDetailsData) ?? undefined;
	return (
		<PageTransition>
			<div className="min-h-screen bg-slate-900 text-white pb-20">


				{/* Navigation Header */}
				<div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
					<div className="p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate(-1)
								}
								className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
							<h1 className="text-lg font-bold">Signal Details</h1>
						</div>
						<button
							onClick={handleShare}
							className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
						>
							<Share2 className="w-5 h-5" />
						</button>
					</div>
				</div>
				{/* Analyst Profile */}
				<div className="p-4 border-b border-slate-800">
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
							{signalData && signalData.analyst.image ? (
								<img
									src={signalData.analyst.image}
									alt={signalData.analyst.name}
									referrerPolicy="no-referrer"
									className="w-full h-full rounded-full object-cover"
								/>
							) : (
								<User className="w-10 h-10 text-white" />
							)}
						</div>
						<div>
							<div className="font-medium">{signalData.analyst.name}</div>
							<div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
								{signalData.analyst.type}
							</div>
							<div className="flex items-center gap-4 mt-1">
								<span className="text-sm text-slate-400">
									{signalData?.analyst?.stats?.signals} signals
								</span>
								<span className="text-sm text-emerald-400">
									{signalData?.analyst?.stats?.success} success
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Signal Parameters */}
				<SignalParameters
					takeProfit={signalData.takeProfit ?? "0"}
					stopLoss={signalData.stopLoss ?? "0"}
					entry={signalData.entry ?? "0"}
					riskReward={signalData.riskReward ?? "0"}
					time={signalData.time}
					status={signalData.status ?? "Active Signal"}
					currentPrice={signalData.currentPrice ?? 0}
					potentialGainLoss={potentiapotentialloss}
					orderType={signalDetailsData.data.orderType}
				/>

				{/* Voting Stage Indicator */}
				{/* <div className="p-4">
					<VotingStageIndicator voteData={voteData} totalValidators={total} isValidator={userDetails?.data?.data?.isValidator} />
				</div> */}

				{/* Chart Section */}
				<div ref={chartRef}>
					<ChartSection
						signal={signalDetailsData?.data}
						priceLines={{
							takeProfit: Number(signalData.takeProfit) || 0,
							stopLoss: Number(signalData.stopLoss) || 0,
							currentPrice: Number(signalData.entry),
						}}
						voteData={voteData}
						isValidator={userDetails?.data?.data?.isValidator}

					/>
				</div>

				{/* Voting Controls */}
				{signalDetailsData?.data && (
					<SignalVotingControls signal={signalDetailsData.data} isValidator={userDetails?.data?.data?.isValidator} />
				)}

				{/* Additional Details */}
				<SignalDetailsSection
				// signal={signalDetailsData!.data}
				// analyst={signalData.analyst}
				// onSignalClick={() => { }}
				/>

				{/* Share Modal */}
				<ShareModal
					isOpen={showShareModal}
					onClose={() => setShowShareModal(false)}
					chartRef={chartRef}
					signalDetails={{
						pair: signalData.pair,
						type: signalData.type,
						entry: signalData.entry,
						takeProfit: signalData.takeProfit,
						stopLoss: signalData.stopLoss,
						consensus: signalData.consensus,
						id: signalData.id
					}}
				/>

				{/* Execute Signal Modal */}
				{showExecuteModal && (
					<ExecuteSignalModal
						onClose={() => setShowExecuteModal(false)}
						signalData={signalDetailsData?.data}
					/>
				)}
			</div>
		</PageTransition>
	);
};

export default SignalDetailsPage;
