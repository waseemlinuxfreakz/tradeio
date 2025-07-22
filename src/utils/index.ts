import { Metrics } from "../types/signal";

export type DecodedToken = {
	userId: string;
	email: string;
	name: string;
	username: string;
	user_type: string;
	image: string;
	iat: number;
	exp: number;
};
function base64UrlDecode(str: string) {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const decoded = decodeURIComponent(
		atob(base64)
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
	return decoded;
}

export const getDecodedUserToken = () => {
	const token = localStorage.getItem("token");
	if (!token) return null;

	const payload = token.split(".")[1];
	if (!payload) return null;

	try {
		const json = base64UrlDecode(payload);
		return JSON.parse(json);
	} catch (err) {
		console.error("Invalid token", err);
		return null;
	}

};
export const getHoursAgo = (isoString: string | null | undefined): string => {
	if (!isoString) return "";

	const createdAt = new Date(isoString);
	const now = new Date();

	const diffMs = now.getTime() - createdAt.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (diffHours < 1) {
		return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
	} else {
		const days = Math.floor(diffHours / 24);
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	}
};
type AISentiment = {
	sentiment: string;
	confidence: number;
};
export const getAISentimentFromMetrics = (metrics: Metrics): AISentiment => {
	const { rsi, macd, volume, volatility } = metrics;

	let score = 0;
	let total = 0;

	// RSI
	total += 1;
	if (rsi > 70) score += 1; // overbought - bullish
	else if (rsi > 50) score += 0.75;
	else if (rsi > 30) score += 0.5;
	else score += 0.25; // bearish

	// MACD
	total += 1;
	if (macd > 0) score += 1;
	else score += 0.3;

	// Volume (assume >50 is high volume, range 0–100)
	total += 1;
	if (volume > 70) score += 1;
	else if (volume > 50) score += 0.75;
	else score += 0.4;

	// Volatility
	total += 1;
	if (volatility === "low") score += 0.8;
	else if (volatility === "medium") score += 0.5;
	else score += 0.2;

	const normalized = (score / total) * 100;

	let sentiment = "Neutral";
	if (normalized >= 75) sentiment = "Highly Bullish";
	else if (normalized >= 60) sentiment = "Bullish";
	else if (normalized >= 40) sentiment = "Neutral";
	else if (normalized >= 25) sentiment = "Bearish";
	else sentiment = "Highly Bearish";

	return {
		sentiment,
		confidence: Math.round(normalized),
	};
};