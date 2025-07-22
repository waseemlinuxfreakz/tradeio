import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../apis/apiEndpoints";

const useUserDetials = (userId:string) => {
    const {
        data: userDetails,
        isLoading: userDetialsLoading,
        isError: userDetailsError,
    } = useQuery({
        queryKey: ["user-details"],
        queryFn: () => getUserDetails(),
		enabled: !!userId,
    });
    return {
        userDetails,
        userDetailsError,
        userDetialsLoading,
    };
};

export default useUserDetials;
