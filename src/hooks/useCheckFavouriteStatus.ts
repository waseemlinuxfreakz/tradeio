import { useQuery } from "@tanstack/react-query";
import { checkFavouriteSignalsStatus } from "../apis/apiEndpoints";

const useFavouriteSignalsStatus = (userId: string, signalId: string) => {
    const {
        data: signalStatus,
        isLoading: signalStatusLoading,
        isError: signalStatusError,
    } = useQuery({
        queryKey: ["check-favourite", signalId],
        queryFn: () => checkFavouriteSignalsStatus(signalId),
        enabled: !!userId,
    });
    return {
        signalStatus,
        signalStatusLoading,
        signalStatusError,
    };
};

export default useFavouriteSignalsStatus;
