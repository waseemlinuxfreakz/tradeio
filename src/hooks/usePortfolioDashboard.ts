import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPortfolioOverview } from "../apis/apiEndpoints";

const usePortfolioDashboard = (userId: string) => {
	const {
		data: portfolioOverviewData,
		isLoading: portfolioOverviewLoading,
		isError: portfolioOverviewError,
	} = useQuery({
		queryKey: ["PortfolioOverview", userId],
		queryFn: () => getPortfolioOverview(),
		enabled: !!userId,
	});
	return {
		portfolioOverviewData,
		portfolioOverviewLoading,
		portfolioOverviewError,
	};
};

export default usePortfolioDashboard;
