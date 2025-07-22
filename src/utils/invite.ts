import {RewardTier} from "../types/invite";

export const rewardTiersBase: RewardTier[] = [
	{
		level: "Bronze",
		referrals: "0-10",
		reward: "5%",
		current: false,
	},
	{
		level: "Silver",
		referrals: "11-50",
		reward: "7.5%",
		current: false,
	},
	{
		level: "Gold",
		referrals: "51+",
		reward: "10%",
		current: false,
	},
];

export const getRewardTiers = (referralCount: number): RewardTier[] => {
	return rewardTiersBase.map((tier) => {
		const [minStr, maxStr] = tier.referrals.split("-");
		const min = parseInt(minStr, 10);
		const max = maxStr === "+" ? Infinity : parseInt(maxStr, 10);

		return {
			...tier,
			current: referralCount >= min && referralCount <= max,
		};
	});
};
