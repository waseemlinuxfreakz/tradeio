import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import SignalCard from "./SignalCard";
import { Signals } from "../../types/signal";
import { useQueryClient } from "@tanstack/react-query";
import { DecodedToken, getDecodedUserToken } from "../../utils";
import ErrorCard from "./ErrorCard";
import RefreshData from "./RefreshData";
import useAddUserVote from "../../hooks/useAddUserVote";
import FullPageLoader from "../Loader";

type SwipeableSignalListProps = {
	signals: Signals[];
	onSwipe: (direction: "left" | "right" | "up", signalIndex: number) => void;
	isLoading: boolean;
	isError: boolean;
	isValidatorFlag?: boolean;
};

const SwipeableSignalList = ({
	signals,
	onSwipe,
	isLoading,
	isError,
	isValidatorFlag
}: SwipeableSignalListProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotate = useTransform(x, [-200, 200], [-10, 10]);
	const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
	const [isVoting, setIsVoting] = useState(false);
	const user = getDecodedUserToken();
	const { createUserVote } = useAddUserVote();

	const handleVote = async (type: "like" | "dislike") => {
		if (!user || !currentSignal?.id || isVoting) return;

		setIsVoting(true);
		try {
			await createUserVote({
				signalId: currentSignal.id,
				type,
				consensus: "community"

			});

			setCurrentIndex((prev) => {
				const nextIndex = prev + 1;
				return nextIndex < signals.length ? nextIndex : 0;
			});
		} finally {
			setIsVoting(false);
		}
	};

	const handleDragEnd = (event: any, info: any) => {
		const swipeThreshold = 100;
		const upSwipeThreshold = -100;

		if (info.offset.y < upSwipeThreshold) {
			onSwipe("up", currentIndex);
			return;
		}

		if (Math.abs(info.offset.x) > swipeThreshold) {
			const direction = info.offset.x > 0 ? "right" : "left";
			onSwipe(direction, currentIndex);

			const voteType = direction === "right" ? "like" : "dislike";
			handleVote(voteType);
		}
	};
	if (isLoading) {
		return <FullPageLoader loading={isLoading} />;

	}
	if (isError) {
		return <ErrorCard />;
	}
	if (!signals || signals.length === 0) {
		return <RefreshData isLoading={isLoading} />;
	}

	const currentSignal = signals?.[currentIndex] ?? null;
	if (!currentSignal || !currentSignal.user || !currentSignal.community) {
		return (
			<div className="w-full p-4">
				<div className="animate-pulse rounded-xl bg-slate-800/50 border border-slate-700 h-[400px]" />
			</div>
		);
	}

	return (
		<motion.div
			drag
			dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
			dragElastic={0.9}
			onDragEnd={handleDragEnd}
			animate={{ x: 0, y: 0 }}
			style={{ x, y, rotate, opacity }}
			className="relative w-full"
		>
			<SignalCard signal={currentSignal} loading={false} isValidatorFlag={isValidatorFlag} />
		</motion.div>
	);
};

export default SwipeableSignalList;
