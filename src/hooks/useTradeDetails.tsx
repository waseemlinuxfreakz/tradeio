import { useQuery } from "@tanstack/react-query";
import { getTradeDetails } from "../apis/apiEndpoints";

const useTradeDetails = (tradeId:string) => {
    const {
        data: tradeDetails,
        isLoading: tradeDetailsLoading,
        isError: tradeDetailsError,
    } = useQuery({
        queryKey: ["trade-details"],
        queryFn: () => getTradeDetails(tradeId),
		enabled: !!tradeId,
    });
    return {
        tradeDetails,
        tradeDetailsError,
        tradeDetailsLoading,
    };
};

export default useTradeDetails;
