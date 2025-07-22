import {useQuery} from "@tanstack/react-query";
import {getAchievementsDetails} from "../apis/apiEndpoints";

const useAchievementDetails = (userId: string) => {
	const {
		data: achievementData,
		isLoading: achievementLoading,
		isError: achievementError,
	} = useQuery({
		queryKey: ["user-achievement"],
		queryFn: () => getAchievementsDetails(),
		enabled: !!userId,
	});
	return {
		achievementData,
		achievementError,
		achievementLoading,
	};
};

export default useAchievementDetails;
