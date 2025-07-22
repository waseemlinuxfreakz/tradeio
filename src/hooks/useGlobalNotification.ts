import { useQuery } from "@tanstack/react-query";
import { getGlobalNotification } from "../apis/apiEndpoints";

const useSignalDetailsById = (userId: string) => {
    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["global-notification"],
        queryFn: () => getGlobalNotification(),
        enabled: !!userId,
    });
    return {
        data,
        isLoading,
        isError,
    };
};

export default useSignalDetailsById;
