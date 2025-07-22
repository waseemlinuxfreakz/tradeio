import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getInviteCount, getRecentReferrals} from "../apis/apiEndpoints";

const useInviteDetails = (userId: string | null) => {

	const {
		data: isInviteCount,
		isLoading: isInviteLoading,
		isError: isInviteError,
	} = useQuery({
		queryKey: ["InviteCount"],
		queryFn: () => getInviteCount(),
		enabled: !!userId,
	});
	const {
		data: recentReferralsData,
		isLoading: recentReferralsLoading,
		isError: queryError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["ReferralDetails"],
		queryFn: ({pageParam = 0}) => getRecentReferrals(pageParam),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.data.length && lastPage.data.length >= 10
				? pages.length
				: undefined;
		},
		enabled: (isInviteCount?.data.acceptedReferrals ?? 0) > 0,
		initialPageParam: 0,
	});
	const flatData =
		recentReferralsData?.pages.flatMap((page) => page.data) ?? [];
	const recentReferralDetailsError =
		queryError || flatData.some((item) => item == null);
	return {
		isInviteCount,
		isInviteLoading,
		isInviteError,
		recentReferralsDetails: flatData,
		recentReferralsLoading,
		recentReferralDetailsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};
export default useInviteDetails;
