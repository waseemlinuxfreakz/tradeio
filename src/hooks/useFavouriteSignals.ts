import { useQuery } from "@tanstack/react-query";
import { getFavouriteSignals } from "../apis/apiEndpoints";

const useFavouriteSignals = (userId: string) => {
    const {
        data: favouriteSignals,
        isLoading: favouriteSignalsLoading,
        isError: favouriteSignalsError,
    } = useQuery({
        queryKey: ["favourite-signals"],
        queryFn: () => getFavouriteSignals(),
        enabled: !!userId,
    });
    return {
        favouriteSignals,
        favouriteSignalsLoading,
        favouriteSignalsError,
    };
};

export default useFavouriteSignals;
