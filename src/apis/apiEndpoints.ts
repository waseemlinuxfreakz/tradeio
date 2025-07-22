import { message } from "antd";
import {
	AddUserVoteResponse,
	CreateSignalPayload,
	GetFilterCountValues,
	GetFilterDataStatus,
	GetFilterStatus,
	GetSignalResponse,
	SignalByIdResponse,
	UserVotePayload,
} from "../types/signal";
import { UpdateTradeData } from "../types/trades";
import API from "./axios-interceptors";
import axios from "axios";
import { AchievementError, GetAchievementResponse, UnlockAchievementPayload } from "../types/achievement";
import {
	AuthError,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { EmailAuthPayload } from "../types/auth";
import {
	InviteCountSuccessResponse,
	ReferralSuccessResponse,
} from "../types/invite";
import {
	CommunityCountResponse,
	TopAnalystDetailsResponse,
} from "../types/community";
import { Tradingtype } from "../lib/tradingLogic";
import {
	PortfolioDetailsResponse,
	PortfolioOverviewResponse,
	StatsPortfolioResponse,
} from "../types/trades";
import { FirebaseError } from "firebase/app";
const BASE_URL = import.meta.env.VITE_API_URL;

type RegisterBody = {
	email: string;
	password: string;
	username: string;
	user_type: string;
	reference: string | null;
};

export const login = async (body: { email: string; password: string }) => {
	const response = await axios.post(`${BASE_URL}/api/login`, body);
	return response;
};

export const telegramSignIn = async (body: {}) => {
	const referrerUsername = localStorage.getItem("referrer_username");
	if (referrerUsername) {
		body = { ...body, referrerUsername };
	}
	const response = await axios.post(`${BASE_URL}/api/telegram`, body);
	if (referrerUsername) {
		localStorage.removeItem("referrer_username");
	}
	return response;
};

export const register = async (body: RegisterBody) => {
	const response = await axios.post(`${BASE_URL}/api/signup`, body);
	return response;
};

export const googleLogin = async (body: { token: string }) => {
	const response = await axios.post(`${BASE_URL}/api/google`, body);
	return response;
};
export const handleLoginFirebaseEmailAuth = async (payload: EmailAuthPayload) => {
	try {
		const result = await signInWithEmailAndPassword(auth, payload.email, payload.password);
		const token = await result.user.getIdToken();
		const body = { firebaseToken: token, payload };

		const response = await API.post(`/api/authenticate`, body);

		if (response.status === 200) {
			return response;
		} else if (response.status === 400) {
			const error = response.data as AuthError;
			if (error.message.includes("User not found")) {
				message.error("Account not found. Please check your email or register.");
			} else {
				message.error(error.message || "Incorrect email or password.");
			}
			return null;
		} else {
			message.error("Unexpected server error. Please try again later.");
			return null;
		}
	} catch (error: any) {
		console.error("Error during Firebase email login:", error);

		if (error instanceof FirebaseError) {
			switch (error.code) {
				case "auth/user-not-found":
					message.error("No account is associated with this email.");
					break;
				case "auth/wrong-password":
					message.error("Incorrect password. Please try again.");
					break;
				case "auth/invalid-email":
					message.error("The email format is invalid.");
					break;
				case "auth/too-many-requests":
					message.error("Too many login attempts. Please try again later.");
					break;
				case "auth/network-request-failed":
					message.error("Network error. Please check your internet connection.");
					break;
				case "auth/invalid-credential":
					message.error("Login credentials are invalid");
					break;
				default:
					message.error("Login failed. Please try again.");
					break;
			}
		} else {
			message.error("An unexpected error occurred. Please try again.");
		}

		return null;
	}
};

export const handleRegisterFirebaseEmailAuth = async (
	payload: EmailAuthPayload
) => {
	try {
		const result = await createUserWithEmailAndPassword(
			auth,
			payload.email,
			payload.password
		);

		const token = await result.user.getIdToken();
		const body = { firebaseToken: token, payload };

		const response = await API.post(`/api/authenticate`, body);

		if (response.status === 400 || response.status === 500) {
			const error = response.data as AuthError;
			message.error(error.message);
			return null;
		}

		if (response.status === 200) {
			return response;
		}

		return null;
	} catch (error: any) {
		console.error("Error during Firebase email registration:", error);

		if (error instanceof FirebaseError) {
			switch (error.code) {
				case "auth/email-already-in-use":
					message.error("This email is already registered.");
					break;
				case "auth/invalid-email":
					message.error("The email address entered is invalid.");
					break;
				case "auth/weak-password":
					message.error("Your password is too weak. Please choose a stronger one.");
					break;
				default:
					message.error("An unexpected error occurred. Please try again.");
					break;
			}
		} else {
			message.error("Registration failed. Please try again.");
		}

		return null;
	}
};
export const loginWithGoogle = async (reference: string | null) => {
	try {
		const result = await signInWithPopup(auth, provider);
		const firebaseToken = await result.user.getIdToken();

		if (!firebaseToken) return null;

		const body = {
			firebaseToken,
			reference,
		};

		const response = await API.post(`/api/google`, body);

		if (response.status === 400 || response.status === 500) {
			const error = response.data as AuthError;
			message.error(error.message);
		}

		return response;
	} catch (error: any) {
		if (error.code === "auth/popup-closed-by-user") {
			message.warning("Google sign-in was cancelled.");
		} else {
			message.error("Google sign-in failed. Please try again.");
			console.error("Google login error:", error);
		}
		return null;
	}
};

export const createSignal = async (body: CreateSignalPayload) => {
	const response = API.post(`/api/signal`, body);
	return response;
};
export const getRecentSignals = async (pageParam: number) => {
	const limit = 10;
	const offset = pageParam * limit;
	const response = await API.get(
		`/api/signal/recentsignals?offset=${offset}&limit=${limit}`
	);
	return response;
};

export const getSignals = async (pageParam: number) => {
	const limit = 10;
	const offset = pageParam * limit;
	const response = API.post(
		`/api/signal/fetch_dashboard_signals?offset=${offset}&limit=${limit}`
	);
	return (await response).data as GetSignalResponse;
};

export const addUserVote = async (payload: UserVotePayload) => {
	const endPoint = `/api/signal/add_user_vote`;
	const response = API.post(endPoint, payload);
	return (await response).data as AddUserVoteResponse;
};

export const getSignalCountValues = async () => {
	const response = await API.get(`/api/signal/get-signal-count`)
	return response.data as GetFilterCountValues;

}
export const getFilterStatus = async (
	selectedTimeframe: string | undefined,
	sortBy: string | undefined
) => {
	const response = await API.get(`/api/signal/fetch_filter_status`, {
		params: {
			timeframe: selectedTimeframe,
			sortBy,
		},
	});
	return response.data as GetFilterStatus;
};


export const getPaginatedFilterStatusData = async (
	filter: string | undefined,
	pageParam: number,
	selectedTimeframe: string | undefined,
	sortBy: string | undefined,
) => {
	const limit = 10;
	const offset = pageParam * limit;
	const endPoint = `/api/signal/fetch_paginated_status_signal?filter=${filter}&offset=${offset}&timeframe=${selectedTimeframe}&sortBy=${sortBy}`;
	const response = await API.get(endPoint);
	return response.data as GetFilterDataStatus;
};

export const getSignalDetailsById = async (signalId: string | undefined) => {
	const endPoint = `/api/signal/signalById?signalId=${signalId}`;
	const response = await API.get(endPoint);
	return response?.data
};

export const getAchievementsDetails = async () => {
	const endPoint = "/api/achievement";
	const response = API.get(endPoint);
	if ((await response).status === 404) {
		const error = (await response).data as AchievementError;
		message.error(error.message);
	}
	if ((await response).status === 500) {
		const error = (await response).data as AchievementError;
		message.error(error.message);
	}
	if ((await response).status === 200) {
		return (await response).data as GetAchievementResponse;
	}
	return null;
};

export const postUploadUserImage = async (file: File) => {
	const endPoint = `/api/user/upload`;
	const formData = new FormData();
	formData.append("file", file);

	try {
		const response = await API.post(endPoint, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Upload failed:", error);
		throw error;
	}
};

export const getLeaderboard = async (duration: string, activeTab: string) => {
	const response = await API.get(
		`/api/signal/leaderboard?duration=${duration}&activeTab=${activeTab}`
	);
	return response;
};

export const getVoteActivityRecords = async (duration: string) => {
	const response = await API.get(
		`/api/signal/vote-activity?duration=${duration}`
	);
	return response;
};

export const getGlobalNotification = async () => {
	const response = await API.get("/api/global-notification");
	return response;
};
export const updateUserProfile = async (body: {
	image: string;
	about_me: string;
}) => {
	const response = await API.put("/api/user/update-profile", body);
	return response;
};

export const updateTrade = async (tradeId: string, body: UpdateTradeData) => {
	const response = await API.put(`/api/trades/${tradeId}`, body);
	return response;
};

export const getTradeDetails = async (tradeId: string) => {
	const response = await API.get(`/api/trades/${tradeId}`);
	return response;
};

export const getInviteCount = async (): Promise<InviteCountSuccessResponse> => {

	try {
		const response = await API.get("/api/invite/get_referees");

		const data = response.data;
		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}

		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};

export const getRecentReferrals = async (
	pageParams: number
): Promise<ReferralSuccessResponse> => {
	const limit = 10;
	const offset = pageParams * limit;
	const response = await API.get("/api/invite/get_recent_referrals", {
		params: { offset, limit },
	});

	if (!response.data.success) {
		throw new Error(response.data.error || "Failed to fetch referrals");
	}

	return response.data;
};

export const getTotalCommunity = async (): Promise<CommunityCountResponse> => {
	try {
		const response = await API.get("/api/user/get_community_count");

		const data = response.data;
		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}

		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};

export const getTopAnalystData = async (
	pageParams: number
): Promise<TopAnalystDetailsResponse> => {
	try {
		const limit = 10;
		const offset = pageParams * limit;
		const response = await API.get("/api/user/get_top_analyst", {
			params: { offset, limit },
		});
		const data = response.data;
		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}
		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Some thing went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};

export const createUserTrade = async (payload: Tradingtype) => {
	const response = await API.post("/api/trades/create_trade", payload);
	return response;
};

export const getUserDetails = async () => {
	const response = await API.get("/api/user/user-details");
	return response;
};

export const getBadges = async () => {
	const response = await API.get("/api/achievement/badges");
	return response;
};

export const getAdminUsers = async (page: number) => {
	const response = await API.get(`/api/admin/users?page=${page}`);
	return response;
};

export const getConfigurtions = async () => {
	const response = await API.get("/api/admin/get-config");
	return response;
};

export const getCoinsList = async () => {
	const response = await axios.get("https://api.binance.com/api/v3/exchangeInfo");
	return response;
}

export const updateConfigurtions = async (body: {}) => {
	const response = await API.post(`/api/admin/update-config`, body);
	return response;

};

export const getAdminSignals = async (page: number) => {
	const response = await API.get(`/api/admin/signals?page=${page}`);
	return response;
};

export const getFavouriteSignals = async () => {
	const response = await API.get(`/api/favourite`);
	return response;
};

export const createFavouriteRecord = async (body: { signal: string }) => {
	const response = await API.post(`/api/favourite`, body);
	return response;
};

export const checkFavouriteSignalsStatus = async (signalId: string) => {
	const response = await API.get(`/api/favourite/${signalId}`);
	return response;
};

export const unlockAchievement = async (body: UnlockAchievementPayload) => {
	const response = await API.post("/api/achievement/achievement-unlock", body);
	return response;
};

export const getPortfolioStats = async (): Promise<StatsPortfolioResponse> => {
	try {
		const response = await API.get("/api/trades/get_portfolio_stats");
		const data = response.data;
		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}
		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};

export const getPortfolioStatsDetails = async (
	pageParams: number,
	activeTab: "active" | "completed" | "failed"
) => {
	const limit = 10;
	const offset = pageParams * limit;
	const category = activeTab;
	try {
		const response = await API.get("/api/trades/get_portfolio_details", {
			params: { offset, limit, category },
		});
		const data = response.data as PortfolioDetailsResponse;
		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}
		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};

export const getPortfolioOverview = async () => {
	try {
		const response = await API.get(`/api/trades/get_portfolio_overview`);
		const data = response.data as PortfolioOverviewResponse;

		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}
		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
};


export const getLatestTrade = async () => {
	try {
		const response = await API.get(`/api/trades/get_latest_trades
			`);
		const data = response.data as PortfolioDetailsResponse;

		if (!data.success) {
			message.error(data.error);
			throw new Error(data.error);
		}
		return data;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
}


export const getAnalystProfileData = async (analystId: string) => {
	try {
		const response = await API.get(`/api/user/analystProfile/${analystId}`);
		if (!response.data) {
			message.error(response.data.error);
			throw new Error(response.data.error);
		}
		return response;
	} catch (error: any) {
		const fallbackMsg = error?.response?.data?.error || "Something went wrong";
		message.error(fallbackMsg);
		throw new Error(fallbackMsg);
	}
}