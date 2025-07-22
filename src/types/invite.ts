export type InviteCountSuccessResponse = {
  success: true;
  message: string;
  data: {
    username: string;
    balance: number;
    acceptedReferrals: number;
  };
};

export type InviteCountErrorResponse = {
  success: false;
  error: string;
};

export type InviteCountResponse =
  | InviteCountSuccessResponse
  | InviteCountErrorResponse;
export interface ReferralItem {
	id: number;
	username: string;
	date: string;
	status: "Active" | "Pending";
	earnings: string;
}

export interface ReferralSuccessResponse {
	success: true;
    message:string;
	data: ReferralItem[];
}

export interface ReferralErrorResponse {
	success: false;
	error: string;
}
export interface RewardTier {
  level: 'Bronze' | 'Silver' | 'Gold';
  referrals: string;
  reward: string;
  current: boolean;
}
