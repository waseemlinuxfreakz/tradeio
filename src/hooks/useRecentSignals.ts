import {useInfiniteQuery} from "@tanstack/react-query";
import {getRecentSignals} from "../apis/apiEndpoints";

const useRecentSignals = (userId: string) => {
	const {
		data: recentSignalData,
		isLoading: recentSignalLoading,
		isError: queryError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["recentsignals", userId],
		queryFn: ({pageParam = 0}) => getRecentSignals(pageParam),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.data.data.length && lastPage.data.data.length >= 10
				? pages.length
				: undefined;
		},
		enabled: !!userId,
		initialPageParam: 0,
	});
	const flatData = recentSignalData?.pages.flatMap((page) => page.data) ?? [];
	const recentSignalError = queryError || flatData.some((item) => item == null);
	return {
		recentSignalData,
		recentSignalLoading,
		recentSignalError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default useRecentSignals;
