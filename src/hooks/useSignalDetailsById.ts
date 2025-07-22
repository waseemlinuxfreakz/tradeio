import {useQuery} from "@tanstack/react-query";
import {getSignalDetailsById} from "../apis/apiEndpoints";

const useSignalDetailsById = (userId: string, signalId: string | undefined) => {
	const {
		data:signalDetailsResult,
		isLoading:signalDetailsLoading,
		isError:signalDetailsError,
		error: signalDetailsErrorMessage
	} = useQuery({
		queryKey: ["SignalDetails", signalId],
		queryFn: () => getSignalDetailsById(signalId),
		enabled: !!userId && !!signalId,
	});
	return {
		signalDetailsResult,
		signalDetailsLoading,
		signalDetailsError,
		signalDetailsErrorMessage
	};
};

export default useSignalDetailsById;
