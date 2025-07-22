import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import React from "react";
import {getTopAnalystData, getTotalCommunity} from "../apis/apiEndpoints";

const useCommunityData = (userId: string) => {
	const {
		data: isCommunityCount,
		isLoading: isCommunityLoading,
		isError: isCommunityError,
	} = useQuery({
		queryKey: ["UserCommunity"],
		queryFn: () => getTotalCommunity(),
		enabled: !!userId,
	});
	const {
		data: communityDetails,
		isLoading: communityDetailsLoading,
		isError: queryError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["CommunityDetails"],
		queryFn: ({pageParam = 0}) => getTopAnalystData(pageParam),
		getNextPageParam: (lastPage, pages) => {
			if ("data" in lastPage && Array.isArray(lastPage.data)) {
				return lastPage.data.length >= 10 ? pages.length : undefined;
			}
			return undefined;
		},
		enabled: !!userId,
		initialPageParam: 0,
	});
	const flatData =
		communityDetails?.pages.flatMap((page) =>
			"data" in page && Array.isArray(page.data) ? page.data : []
		) ?? [];
	const communityDetailsError =
		queryError || flatData.some((item) => item == null);
	return {
		isCommunityCount,
		isCommunityLoading,
		isCommunityError,
		communityDetails:flatData,
		communityDetailsLoading,
		communityDetailsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default useCommunityData;
