export type CommunityCountSuccessResponse = {
	success: true;
	message: string;
	data: {
		totalUsers: number;
		totalSignals: number;
		activeSignals: number;
	};
};

export type CommunityCountErrorResponse = {
	success: false;
	error: string;
};

export type CommunityCountResponse =
	| CommunityCountSuccessResponse
	| CommunityCountErrorResponse;

export type TopAnalystSuccessResponse = {
	success: true;
	message: string;
	data: TopAnalystData[];
};

export type TopAnalystData = {
	id: string;
	name: string;
	image: string;
	type: string;
	stats: {
		signals: number;
		followers: string;
		success: string;
	};
};
export type TopAnalystErrorResponse = {
	success: false;
	error: string;
};
export type TopAnalystDetailsResponse =
	| TopAnalystSuccessResponse
	| TopAnalystErrorResponse;
