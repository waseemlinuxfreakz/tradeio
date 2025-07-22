import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import React from "react";
import {
	getPortfolioStats,
	getPortfolioStatsDetails,
} from "../apis/apiEndpoints";

const usePortfolioStats = (
	userId: string,
	activeTab: "active" | "completed" | "failed"
) => {
	const {
		data: portfolioStats,
		isLoading: isLoadingPortfolioStats,
		isError: isErrorPortfolioStats,
	} = useQuery({
		queryKey: ["PortfolioStats"],
		queryFn: () => getPortfolioStats(),
		enabled: !!userId,
	});
	const {
		data: portfolioStatsDetails,
		isLoading: isLoadingPortfolioStatsDetails,
		isError: isErrorPortfolioStatsDetails,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["PortfolioStatsDetails", userId, activeTab],
		queryFn: ({pageParam = 0}) =>
			getPortfolioStatsDetails(pageParam, activeTab),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.data.trades.length && lastPage.data.trades.length >= 10
				? pages.length
				: undefined;
		},
		initialPageParam: 0,
		enabled: !!userId,
	});
	const flatData =
		portfolioStatsDetails?.pages.flatMap((page) => page.data) ?? [];
	const portfolioError =
		isErrorPortfolioStatsDetails ||
		flatData.some((item) => item == null);
	return {
		portfolioStats,
		isLoadingPortfolioStats,
		isErrorPortfolioStats,
		porfolioFlatData:flatData,
		portfolioError,
		isLoadingPortfolioStatsDetails,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default usePortfolioStats;
