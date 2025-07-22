import {useInfiniteQuery} from "@tanstack/react-query";
import {getSignals} from "../apis/apiEndpoints";

const useDashboardSignals = (userId: string ) => {
	const {
		data,
		isLoading,
		isError: queryError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["Dashboard"],
		queryFn: ({pageParam = 0}) => getSignals(pageParam),
		getNextPageParam: (lastPage, pages) => {
			return lastPage.data.length && lastPage.data.length >= 10
				? pages.length
				: undefined;
		},
		initialPageParam: 0,
		enabled: !!userId ,
	});
	const flatData = data?.pages.flatMap((page) => page.data) ?? [];
	const isError = queryError || flatData.some((item) => item == null);
	return {
		data: flatData,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default useDashboardSignals;
