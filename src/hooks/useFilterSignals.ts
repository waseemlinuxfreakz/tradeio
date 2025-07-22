import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
	getFilterStatus,
	getPaginatedFilterStatusData,
	getSignalCountValues,
} from "../apis/apiEndpoints";

const useFilterSignals = (
	userId: string,
	filter?: string,
	selectedTimeframe?: string,
	sortBy?: string
) => {
	const {
		data: filterCount,
		isLoading: filterCountLoading,
		isError: filterCountError
	} = useQuery({
		queryKey: ["FiltersCount"],
		queryFn: () => getSignalCountValues(),
		enabled: !!userId
	})
	const {
		data: filterStatus,
		isLoading: statusLoading,
		isError: statusError,
	} = useQuery({
		queryKey: ["Filters", selectedTimeframe, sortBy],
		queryFn: () => getFilterStatus(selectedTimeframe, sortBy),
		enabled: !!userId,
	});

	const {
		data: filterData,
		isLoading: filterDataLoading,
		isError: filterDataError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["FilterData", filter, selectedTimeframe, sortBy],
		queryFn: ({ pageParam = 0 }) =>
			getPaginatedFilterStatusData(filter, pageParam, selectedTimeframe, sortBy),
		getNextPageParam: (lastPage, pages) =>
			lastPage.data.result.length && lastPage.data.result.length >= 10
				? pages.length
				: undefined,
		initialPageParam: 0,
		enabled:
			!!userId &&
			!!filter &&
			!!filterStatus?.data?.active
			&& filterStatus.data.active > 0
			|| !!filterStatus?.data?.trending
			&& filterStatus.data.trending > 0
			|| !!filterStatus?.data?.userSignals
			&& filterStatus.data.userSignals > 0
			|| !!filterStatus?.data?.history
			&& filterStatus.data.history > 0
			|| !!filterStatus?.data?.completedSignals
			&& filterStatus.data.completedSignals > 0 || !!filterStatus?.data.favourites && filterStatus?.data.favourites > 0 || !!filterStatus?.data.myvotes && filterStatus?.data.myvotes > 0
	});
	const flatData = filterData?.pages.map((item) => item.data.result).flat() || [];

	const queryError = filterDataError || flatData.some((item) => item == null);

	return {
		filterCount,
		filterCountLoading,
		filterCountError,
		filterStatus,
		statusLoading,
		statusError,
		filterData: flatData,
		filterDataLoading,
		filterDataError: queryError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default useFilterSignals;
