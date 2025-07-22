import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserVote } from "../apis/apiEndpoints";
import { AddUserVoteResponse, UserVotePayload } from "../types/signal";
import {
	updateOptimisticallyAddVoteCache,
	updateOptimisticallyQueryCache,
} from "../utils/signal";
import { message } from "antd";
const useAddUserVote = (activeCategory?: string, sortBy?: string,
	timeframe?: string) => {
	const queryClient = useQueryClient();
	const {
		mutateAsync: createUserVote,
		isPending: votePending,
		isError: voteError,
		data: voteData,
	} = useMutation({
		mutationFn: (payload: UserVotePayload) => addUserVote(payload),
		onSuccess: (data: AddUserVoteResponse) => {
			if (!data?.data?.signalId) {
				console.warn("No signalId in vote response:", data);
				return;
			}
			message.success(data.message);
			updateOptimisticallyQueryCache(data.data, queryClient);
			queryClient.invalidateQueries({ queryKey: ["analystProfileData"] })
			if (activeCategory && data.success === true) {
				updateOptimisticallyAddVoteCache(data, activeCategory, queryClient, sortBy,
					timeframe);
			}
		},
		onError: (error) => {
			message.error(error.message);
			queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
		},
	});

	return {
		createUserVote,
		votePending,
		voteError,
		voteData,
	};
};

export default useAddUserVote;
