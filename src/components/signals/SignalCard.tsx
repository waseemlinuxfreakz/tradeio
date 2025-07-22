import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Spin, message } from "antd";
import {
	Star,
	ArrowUpCircle,
	ArrowDownCircle,
	Target,
	Scale,
	Share2,
	ThumbsUp,
	ThumbsDown,
	Brain,
	ChevronLeft,
	User,
	Pencil
} from "lucide-react";
import LiveCandlestickChart from "../LiveCandlestickChart";
import SignalAnalysisModal from "./SignalAnalysisModal";
import { useResponsive } from "../../lib/useResponsive";
import ShareModal from "../ShareModal";
import { Signals } from "../../types/signal";
import { getDecodedUserToken } from "../../utils";
import useAddUserVote from "../../hooks/useAddUserVote";
import SignalChat from "../dashboard/SignalChat";
import SignalMatchPopup from "../SignalMatchPopup";
import { createFavouriteRecord } from "../../apis/apiEndpoints";
import useFavouriteSignalsStatus from "../../hooks/useCheckFavouriteStatus";
import { useQueryClient } from "@tanstack/react-query";
import { CoinPrice } from '../../components/LiveCandlestickChart'
import { useNavigate } from "react-router-dom";

type SignalCardProps = {
	signal: Signals;
	onClick?: () => void;
	isSignalsPage?: boolean;
	activeCategory?: string;
	loading?: boolean;
	isValidatorFlag?: boolean;
	sortBy?: string;
	timeframe?: string;
};

const SignalCard = ({
	signal,
	onClick,
	activeCategory,
	loading,
	sortBy,
	timeframe
}: SignalCardProps) => {
	const { isMobile } = useResponsive();
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLoadind, setIsLoading] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const pressTimer = useRef<NodeJS.Timeout>();
	const chartRef = useRef<HTMLDivElement>(null);
	const [showSignalMatch, setShowSignalMatch] = useState(false);
	const queryClient = useQueryClient();
	const user = getDecodedUserToken();
	const navigate = useNavigate()
	const { createUserVote } = useAddUserVote(activeCategory, sortBy,
		timeframe);
	// const { sentiment, confidence } = getAISentimentFromMetrics(signal.metrics);
	const { signalStatus, signalStatusLoading } = useFavouriteSignalsStatus(user!.userId, signal?.id);
	const isFavourite = signalStatus?.data?.data
	const [currentCoinsPrice, setCurrentCoinsPrice] = useState<CoinPrice[]>([{
		price: 0,
		name: '',
	}])
	const currentSignalValues = currentCoinsPrice?.find((item) => {
		return item.name.toLowerCase() === signal.pair.toLowerCase()
	})

	const handlePressStart = () => {
		pressTimer.current = setTimeout(() => {
			setShowAnalysis(true);
		}, 2000); // 2 seconds long press
	};

	const handlePressEnd = () => {
		if (pressTimer.current) {
			clearTimeout(pressTimer.current);
		}
	};

	useEffect(() => {
		return () => {
			if (pressTimer.current) {
				clearTimeout(pressTimer.current);
			}
		};
	}, []);

	const calculateRiskRewardRatio = () => {
		const takeProfit = Number.isFinite(signal.takeProfit) ? signal.takeProfit : 0;
		const stopLoss = Number.isFinite(signal.stopLoss) ? signal.stopLoss : 0;
		const entryPrice = signal.entryPrice || 0;

		const potentialProfit = takeProfit - entryPrice;
		const potentialLoss = entryPrice - stopLoss;

		if (potentialLoss <= 0) return '1:0';

		const ratio = Math.abs(potentialProfit / potentialLoss).toFixed(1);
		return `1:${ratio}`;
	};

	const calculateRiskRewardRatioForCurrentPrice = () => {
		const takeProfit = Number.isFinite(signal.takeProfit) ? signal.takeProfit : 0;
		const stopLoss = Number.isFinite(signal.stopLoss) ? signal.stopLoss : 0;
		const currentPrice = currentSignalValues?.price || 0;

		const potentialProfit = takeProfit - currentPrice;
		const potentialLoss = currentPrice - stopLoss;

		if (potentialLoss <= 0) return '1:0';

		const ratio = Math.abs(potentialProfit / potentialLoss).toFixed(1);
		return `1:${ratio}`;
	};

	const addSignalToFavourite = async () => {
		const payload = {
			signal: signal.id
		}
		setIsLoading(true)
		createFavouriteRecord(payload)
			.then((response) => {
				if (response.status === 201) {
					message.success("Signal added to favourites", 2);
					queryClient.invalidateQueries({
						queryKey: ["check-favourite", signal.id]
					});
				} else if (response.status === 200) {
					message.success("Signal removed from favourites", 2);
					queryClient.invalidateQueries({
						queryKey: ["check-favourite", signal.id]
					});
				} else if (response?.data.error) {
					message.error(response?.data.error);
				}
			})
			.catch((error) => {
				debugger
				if (error?.response?.data?.error) {
					message.error(error.response.data.error, 2);
					return;
				}
				message.error("Something went wrong", 2);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}


	const handleCardClick = (signal: any) => {
		if (!onClick) {
			setIsFlipped(!isFlipped);
		} else {
			onClick();
		}
	};
	const handleVote = async (type: "like" | "dislike") => {
		if (!user || !signal?.id) return;

		await createUserVote({
			signalId: signal.id,
			type,
			consensus: "community"
		});
	};
	const handleActionClick = (e: React.MouseEvent, action: string) => {
		e.stopPropagation();
		switch (action) {
			case "share":
				setShowShareModal(true);
				break;

			case "like":
				handleVote("like");
				break;

			case "dislike":
				handleVote("dislike");
				break;

			case "favourite":
				addSignalToFavourite();
				break;
		}
	};

	const ValidatorPositiveVotes = signal.validator.validatorPositive;
	const ValidatorNegativeVotes = signal.validator.validatorNegative
	const totalValidatorVotes = ValidatorPositiveVotes + ValidatorNegativeVotes

	const CommunityPositiveVotes = signal.community.communityPositive;
	const CommunityNegativeVotes = signal.community.communityNegative;


	const totalCommunityVotes = CommunityPositiveVotes + CommunityNegativeVotes;

	const communityPercentage =
		totalCommunityVotes > 0
			? (CommunityPositiveVotes / totalCommunityVotes) * 100
			: 0;
	const formattedCommunityPercentage = Number.isFinite(communityPercentage)
		? communityPercentage.toFixed(2)
		: "0.00";

	return (
		<Spin spinning={loading || isLoadind}>
			<>
				<div
					className="relative"
					style={{ perspective: "1000px" }}
					onMouseDown={handlePressStart}
					onMouseUp={handlePressEnd}
					onMouseLeave={handlePressEnd}
					onTouchStart={handlePressStart}
					onTouchEnd={handlePressEnd}
				>
					<motion.div
						initial={false}
						animate={{ rotateY: isFlipped ? 180 : 0 }}
						transition={{
							duration: 0.6,
							type: "spring",
							stiffness: 500,
							damping: 30,
						}}
						style={{ transformStyle: "preserve-3d" }}
						onTap={(e) => {
							const target = e.target as HTMLElement;
							if (
								target.closest("button") ||
								target.closest("svg") ||
								target.closest(".no-flip")
							) {
								return;
							}
							handleCardClick(signal);
						}}
						className="relative w-full cursor-pointer"
					>

						{/* Front of card */}
						<motion.div
							style={{ backfaceVisibility: "hidden" }}
							className={`bg-[#131722] backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden ${isFlipped ? "absolute inset-0" : ""
								}`}
						>
							{/* Voting Stage Indicator */}


							{/* Consensus Bars */}
							<div className="px-4 pt-4">
								{/* Validators Bar */}
								<div className="mb-1">
									<div className="flex justify-between items-center text-xs mb-1">
										<span>Validators</span>
										<div className="flex items-center gap-2">
											{signal.isApproved && signal.status === "PENDING" ? (
												<span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">
													Executable
												</span>

											) : !signal.isApproved && signal.status === "PENDING" ?
												<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
													Validating
												</span> : signal.isApproved && signal.status === "EXPIRED" ?
													<span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
														Expired
													</span> : !signal.isApproved && signal.status === "EXPIRED" ?
														<span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">
															Rejected
														</span> :
														<span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
															Completed
														</span>
											}
											<span className="text-pink-500">
												{signal.user.consensus.toFixed(2)}%{" "}
												{signal.user.consensus > 50
													? "Bullish"
													: signal.user.consensus < 50
														? "Bearish"
														: "Neutral"}
											</span>
											<span className="text-slate-500">{signal.user.verifiedValidators} verified</span>
										</div>
									</div>
									<div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
										{totalValidatorVotes > 0 && (
											<>
												<div
													className="absolute left-0 top-0 h-full bg-emerald-500 transition-all"
													style={{
														width: `${(ValidatorPositiveVotes / totalValidatorVotes) * 100}%`,
													}}
												/>
												<div
													className="absolute left-0 top-0 h-full bg-rose-500 transition-all"
													style={{
														width: `${(ValidatorNegativeVotes / totalValidatorVotes) * 100}%`,
														marginLeft: `${(ValidatorPositiveVotes / totalValidatorVotes) * 100}%`,
													}}
												/>
											</>
										)}

									</div>

								</div>

								{/* Community Bar */}
								<div className="mb-2">
									<div className="flex justify-between items-center text-xs mb-1">
										<span>Community</span>
										<div className="flex items-center gap-2">
											<span className="text-emerald-500">
												{formattedCommunityPercentage}%
											</span>
											<span className="text-slate-500">
												{totalCommunityVotes} votes
											</span>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
										{totalCommunityVotes > 0 && (
											<>
												<div
													className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
													style={{
														width: `${(CommunityPositiveVotes / totalCommunityVotes) * 100}%`,
													}}
												/>
												<div
													className="absolute left-0 top-0 h-full bg-rose-500 transition-all"
													style={{
														width: `${(CommunityNegativeVotes / totalCommunityVotes) * 100}%`,
														marginLeft: `${(CommunityPositiveVotes / totalCommunityVotes) * 100}%`,
													}}
												/>
											</>
										)}
									</div>

								</div>

							</div>

							{/* Analyst Profile */}
							<div className="p-4 flex items-center gap-3 signaleUserName">
								<div className="relative">
									<div
										className={`${isMobile ? "w-10 h-10" : "w-12 h-12"
											} rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center`}
									>
										{signal && signal.user.image ? (
											<img
												src={signal.user.image}
												alt={signal.user.name}
												referrerPolicy="no-referrer"
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
									<div className="font-medium">{signal.user.name}</div>
									<div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
										{signal.user.badge}
									</div>
								</div>
								<div className="flex w-full justify-end">
									<Pencil className="text-pink-400"
										onClick={() => {
											navigate(`/create-signal?signalId=${signal.id}`)
										}} />
								</div>
							</div>

							{/* Chart */}
							<div className="relative mx-4 rounded-lg border border-slate-700/30 overflow-hidden chartFrame">
								<LiveCandlestickChart
									symbol={signal.pair.replace("/", "")}
									interval="15"
									priceLines={{
										takeProfit: signal.takeProfit,
										stopLoss: signal.stopLoss,
										entry: signal.entryPrice,
									}}
									setCurrentCoinsPrice={setCurrentCoinsPrice}
								/>
								
								<div className="actionPossitonMobile absolute left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
									<button className="ordermob-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors
                  						bg-slate-700/50 hover:bg-slate-700">
										<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g id="SVGRepo_bgCarrier" stroke-width="0"/>
											<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
											<g id="SVGRepo_iconCarrier"> <path d="M21 3L15.6 3C15.2686 3 15 3.26863 15 3.6V3.6L15 9" stroke="#9333ea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15.5 3.5C18.7983 4.80851 21 8.29825 21 12C21 16.8715 16.9706 21 12 21C7.02944 21 3 16.8715 3 12C3 8.73514 4.80989 5.52512 7.5 4" stroke="#9333ea" stroke-width="2" stroke-linecap="round"/> </g>
										</svg>
									</button>
									{signal.status === "PENDING" && (
										<>
											<button
												onClick={(e) => handleActionClick(e, "like")}
												className={`ordermob-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors
    										${(signal.userVote === "like")
														? "bg-emerald-700/80"
														: "bg-slate-700/50 hover:bg-slate-700"}`}
												disabled={signal.userVote === "like"}>
												<ThumbsUp className="w-4 h-4 text-emerald-400" />
											</button>


											<button
												onClick={(e) => handleActionClick(e, "dislike")}
												className={`ordermob-1 w-8 h-8 flex items-center justify-center rounded-full transition-colors
      										${signal.userVote === "dislike"
														? "bg-rose-700/80"
														: "bg-slate-700/50 hover:bg-slate-700"}`}
												disabled={signal.userVote === "dislike"}>
												<ThumbsDown className="w-4 h-4 text-rose-400" />
											</button>
										</>
									)}
									<button
										onClick={(e) => handleActionClick(e, "share")}
										className="ordermob-1 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
									>
										<Share2 className="w-4 h-4 text-blue-400" />
									</button>
									<button
										onClick={(e) => handleActionClick(e, "favourite")}
										className="ordermob-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
									>
										<Star
											className={`
												w-4 h-4 text-purple-400 cursor-pointer 
												transition-transform duration-150 ease-out
												${isFavourite ? "scale-125 fill-[#c084fc]" : "scale-100"}
											`}
										/>
									</button>
								</div>
							</div>

							{/* Signal Info */}
							<div className="p-4 border-t border-slate-700/50 signalFooter">

								<div className="flex items-center gap-2 mb-2 signalFooterTitle">
									<h3
										className={`${isMobile ? "text-base" : "text-lg"
											} font-bold`}
									>
										{signal.pair}
									</h3>
									<div
										className={`text-sm px-2 py-0.5 rounded-full ${signal.type === "LONG"
											? "bg-emerald-500/20 text-emerald-400"
											: "bg-rose-500/20 text-rose-400"
											}`}
									>
										{signal.type}
									</div>
									<div className="text-emerald-400">+23%</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4 text-sm">
										<div className="flex items-center gap-1">
											<Target className="w-4 h-4 text-blue-500" />
											<span className="text-blue-400">
												${Number.isFinite(signal.entryPrice) ? signal.entryPrice : 0}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<ArrowUpCircle className="w-4 h-4 text-emerald-500" />
											<span className="text-emerald-400">
												{Number.isFinite(signal.takeProfit) && Number.isFinite(signal.entryPrice) && signal.entryPrice !== 0 ? (((signal.takeProfit - signal.entryPrice) / signal.entryPrice) * 100).toFixed(2) : '0'}%
											</span>
										</div>
										<div className="flex items-center gap-1">
											<ArrowDownCircle className="w-4 h-4 text-rose-500" />
											<span className="text-rose-400">
												{Number.isFinite(signal.stopLoss) && Number.isFinite(signal.entryPrice) && signal.entryPrice !== 0 ? (((signal.entryPrice - signal.stopLoss) / signal.entryPrice) * 100).toFixed(2) : '0'}%
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

								{/* <div className="flex items-center justify-between">
									<div className="flex items-center gap-4 text-sm">
										<div className="flex items-center gap-1">
											<Target className="w-4 h-4 text-blue-500" />
											<span className="text-blue-400">
												${Number.isFinite(currentSignalValues?.price) ? currentSignalValues?.price : 0}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<ArrowUpCircle className="w-4 h-4 text-emerald-500" />
											<span className="text-emerald-400">
												{currentSignalValues?.price && Number.isFinite(signal.takeProfit) && Number.isFinite(currentSignalValues.price) && currentSignalValues.price !== 0
													? (((signal.takeProfit - currentSignalValues.price) / currentSignalValues.price) * 100).toFixed(2)
													: '0'}%

											</span>
										</div>
										<div className="flex items-center gap-1">
											<ArrowDownCircle className="w-4 h-4 text-rose-500" />
											<span className="text-rose-400">
												{currentSignalValues?.price && Number.isFinite(signal.stopLoss) && Number.isFinite(currentSignalValues?.price) && currentSignalValues?.price !== 0 ? (((currentSignalValues?.price - signal.stopLoss) / currentSignalValues?.price) * 100).toFixed(2) : '0'}%
											</span>
										</div>
										<div className="flex items-center gap-1">
											<Scale className="w-4 h-4 text-purple-500" />
											<span className="text-purple-400">
												{calculateRiskRewardRatioForCurrentPrice()}
											</span>
										</div>
									</div>
								</div> */}
								
							</div>

							{/* <div className="space-y-3">
								{signal?.id && (
									<SignalChat signalId={signal.id} isDashboard={true} />
								)}
							</div> */}
							
						</motion.div>

						{/* Back of card */}
						<motion.div
							style={{
								backfaceVisibility: "hidden",
								transform: "rotateY(180deg)",
								height: "100%",
							}}
							className={`bg-[#131722] backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden ${!isFlipped ? "absolute inset-0" : ""
								}`}
						>
							<div className="p-4">
								<div className="flex items-center justify-between mb-6">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setIsFlipped(false);
										}}
										className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
									>
										<ChevronLeft className="w-5 h-5" />
										Back
									</button>
									<button
										className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-medium transition-opacity ${!signal.isApproved ? "opacity-50 cursor-not-allowed" : ""
											}`}
										onClick={() => setShowSignalMatch(true)}
										disabled={!signal.isApproved}
									>
										Join Signal
									</button>
								</div>

								{/* Analysis */}
								<div className="mb-6">
									<div className="flex items-center gap-2 mb-4">
										<Brain className="w-5 h-5 text-purple-500" />
										<h3 className="font-medium">Analysis</h3>
									</div>

									<div className="space-y-4">
										<div className="bg-slate-800/50 rounded-lg p-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm text-slate-400">
													Sentiment
												</span>
												<span className="text-emerald-400">
													{signal.user.consensus > 50
														? "Bullish"
														: signal.user.consensus < 50
															? "Bearish"
															: "Neutral"}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-slate-400">
													Confidence
												</span>
												<span className="text-emerald-400">
													{signal.user.consensus.toFixed(2)}%
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<h4 className="text-sm text-slate-400">Description</h4>
											<p className="text-sm text-slate-400 leading-relaxed">
												{signal.description}
											</p>
										</div>
									</div>
								</div>

								{/* Signal Chat */}

							</div>
						</motion.div>
					</motion.div>
				</div>

				<SignalAnalysisModal
					isOpen={showAnalysis}
					onClose={() => setShowAnalysis(false)}
					signal={signal}
				/>

				<ShareModal
					isOpen={showShareModal}
					onClose={() => setShowShareModal(false)}
					chartRef={chartRef}
					signalDetails={{
						pair: signal.pair,
						type: signal.type,
						entry: signal.entryPrice ? signal.entryPrice.toLocaleString() : "0",
						takeProfit:
							signal.takeProfit != null
								? signal.takeProfit.toLocaleString()
								: undefined,
						stopLoss:
							signal.stopLoss != null
								? signal.stopLoss.toLocaleString()
								: undefined,

						// takeProfit: signal.takeProfit ? signal.takeProfit.toLocaleString():undefined,
						// stopLoss: signal.takeProfit ? signal.stopLoss.toLocaleString():undefined,
						consensus: `${signal.community.consensus}%`,
						id: signal.id
					}}
				/>
			</>
			{showSignalMatch && (
				<SignalMatchPopup
					onClose={() => setShowSignalMatch(false)}
					signal={signal}
				/>
			)}
		</Spin>
	);
};

export default SignalCard;
