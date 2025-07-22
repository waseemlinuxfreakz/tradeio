import { QueryClient } from "@tanstack/react-query";
import { AddUserVoteResponse, GetFilterDataStatus, GetSignalResponse, ResponseVoteData, Signals } from "../types/signal";

type QueryData = {
	pageParams: string[];
	pages: GetSignalResponse[];
};
type FilterQueryData = {
	pageParams: string[];
	pages: GetFilterDataStatus[]
}
export const updateOptimisticallyQueryCache = (
	payload: ResponseVoteData,
	queryClient: QueryClient
) => {
	const signalsListKey = ["Dashboard"];
	const oldData = queryClient.getQueryData<QueryData>(signalsListKey);

	if (!oldData) return;

	const pageLimit = oldData.pages[0]?.pagination?.limit || 10;

	const allSignals = oldData.pages
		.flatMap((page) => page.data)
		.filter((signal) => signal.id !== payload.signalId);

	const rebuiltPages = [];
	let offset = 0;

	while (offset < allSignals.length || rebuiltPages.length < oldData.pages.length) {
		const slice = allSignals.slice(offset, offset + pageLimit);
		const referencePage: GetSignalResponse = oldData.pages[rebuiltPages.length] || oldData.pages[0];

		rebuiltPages.push({
			...referencePage,
			data: slice,
			pagination: {
				...referencePage.pagination,
				offset,
				total: allSignals.length,
				limit: pageLimit,
			},
		});

		offset += pageLimit;
	}

	queryClient.setQueryData<QueryData>(signalsListKey, {
		...oldData,
		pages: rebuiltPages,
	});
};

export const addSignalInCache = (signal: Signals, queryClient: QueryClient) => {
	const signalsListKey = ["Dashboard"];
	const oldData = queryClient.getQueryData<QueryData>(signalsListKey);

	if (!oldData) return;

	const pageLimit = oldData.pages[0]?.pagination?.limit || 10;

	const allSignals = oldData.pages.flatMap((page) => page.data);

	const updatedSignals = [signal, ...allSignals];

	const rebuiltPages = [];
	let offset = 0;

	for (let i = 0; offset < updatedSignals.length; i++) {
		const pageSlice = updatedSignals.slice(offset, offset + pageLimit);
		const existingPage = oldData.pages[i];

		rebuiltPages.push({
			...existingPage,
			data: pageSlice,
			pagination: {
				...existingPage?.pagination,
				offset,
				total: updatedSignals.length,
				limit: pageLimit,
			},
		});

		offset += pageLimit;
	}

	queryClient.setQueryData<QueryData>(signalsListKey, {
		...oldData,
		pages: rebuiltPages,
	});
};

// export const updateOptimisticallyAddVoteCache = (
//   data: AddUserVoteResponse,
//   activeCategory: string,
//   queryClient: QueryClient
// ) => {
//   const FilterKey = ["FilterData", activeCategory];
//   const oldCacheData = queryClient.getQueryData<FilterQueryData>(FilterKey);

//   if (!oldCacheData) return;

//   const signalId = data.data.signalId;
//   const userVote = data.data.userVote;

//   const newPages = oldCacheData.pages.map(page => {
//     if (!page.data || !Array.isArray(page.data.result)) {
//       console.warn("Expected page.data.result to be an array, but got:", page.data);
//       return page;
//     }

//     const updatedSignals = page.data.result.map(signal => {
//       if (signal.id === signalId) {
//         return { ...signal, userVote };
//       }
//       return signal;
//     });

//     return {
//       ...page,
//       data: {
//         ...page.data,
//         result: updatedSignals,
//       },
//     };
//   });

//   queryClient.setQueryData(FilterKey, {
//     ...oldCacheData,
//     pages: newPages,
//   });
// };


export const updateOptimisticallyAddVoteCache = (
	data: AddUserVoteResponse,
	activeCategory: string,
	queryClient: QueryClient,
	sortBy?: string,
	timeframe?: string
) => {
	if (!data?.data?.signalId || !data.data.userVote) {
		console.warn("Invalid vote response structure:", data);
		return;
	}

	const signalId = data.data.signalId;
	const voteType = data.data.userVote;

	const keysToUpdate: (readonly unknown[])[] = [
		["FilterData", activeCategory, timeframe, sortBy],
		["Dashboard"],
	];

	keysToUpdate.forEach((queryKey) => {
		const cacheData = queryClient.getQueryData<FilterQueryData>(queryKey);

		if (!cacheData || !Array.isArray(cacheData.pages)) {
			console.warn("No valid cache found for", queryKey, cacheData);
			return;
		}

		const newPages = cacheData.pages.map((page) => {
			if (!page?.data || !Array.isArray(page.data.result)) {
				console.warn("Invalid page structure in", queryKey, page?.data);
				return page;
			}

			const updatedSignals = page.data.result.map((signal) => {
				if (signal.id === signalId) {
					const previousVote = signal.userVote;
					let communityPositive = signal.community.communityPositive;
					let communityNegative = signal.community.communityNegative;

					if (previousVote === "like") communityPositive -= 1;
					if (previousVote === "dislike") communityNegative -= 1;

					if (voteType === "like") communityPositive += 1;
					if (voteType === "dislike") communityNegative += 1;

					return {
						...signal,
						userVote: voteType,
						community: {
							...signal.community,
							communityPositive,
							communityNegative,
						},
					};
				}
				return signal;
			});


			return {
				...page,
				data: {
					...page.data,
					result: updatedSignals,
				},
			};
		});

		queryClient.setQueryData(queryKey, {
			...cacheData,
			pages: newPages,
		});
	});
};


