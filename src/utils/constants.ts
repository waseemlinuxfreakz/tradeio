export const durations = [
	{ value: "1h", label: "1 Hour" },
	{ value: "4h", label: "4 Hours" },
	{ value: "1d", label: "1 Day" },
	{ value: "3d", label: "3 Days" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
];

export const tradingPairs = [
	{ symbol: "BTCUSDT", name: "Bitcoin", displaySymbol: "BTC/USDT" },
	{ symbol: "ETHUSDT", name: "Ethereum", displaySymbol: "ETH/USDT" },
	{ symbol: "BNBUSDT", name: "Binance Coin", displaySymbol: "BNB/USDT" },
	{ symbol: "SOLUSDT", name: "Solana", displaySymbol: "SOL/USDT" },
	{ symbol: "TONUSDT", name: "Toncoin", displaySymbol: "TON/USDT" },
];

export const timeframes = [
	{ value: "1", label: "1m" },
	{ value: "5", label: "5m" },
	{ value: "15", label: "15m" },
	{ value: "60", label: "1h" },
	{ value: "240", label: "4h" },
	{ value: "1d", label: "1d" },
];

export const orderTypes = [
	{
		value: "MARKET",
		label: "Market",
		description: "Market order - Immediate execution at current market price",
	},
	{
		value: "LIMIT",
		label: "Limit",
		description: "Limit order - Execute only at specified price or better",
	},
	{
		value: "STOP_LIMIT",
		label: "Stop Limit",
		description:
			"A limit order that gets activated when price reaches the stop level, then places a limit order at specified price",
	},
	{
		value: "STOP_MARKET",
		label: "Stop Market",
		description:
			"A market order that gets activated when price reaches the stop level, then executes at market price",
	},
];

export const leaderboardData = {
	swipers: [
		{
			rank: 1,
			name: "Sarah Miller",
			accuracy: "96.8%",
			profit: "+458.2%",
			followers: "12.5K",
			img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 2,
			name: "John Doe",
			accuracy: "95.2%",
			profit: "+412.7%",
			followers: "10.2K",
			img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 3,
			name: "Emma Wilson",
			accuracy: "94.5%",
			profit: "+389.4%",
			followers: "9.8K",
			img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
		},
	],
	analysts: [
		{
			rank: 1,
			name: "Michael Chen",
			accuracy: "98.2%",
			profit: "+512.4%",
			followers: "25.3K",
			img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 2,
			name: "Lisa Wang",
			accuracy: "97.1%",
			profit: "+486.9%",
			followers: "22.1K",
			img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 3,
			name: "David Kim",
			accuracy: "96.8%",
			profit: "+452.3%",
			followers: "20.8K",
			img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=faces",
		},
	],
	traders: [
		{
			rank: 1,
			name: "Alex Thompson",
			accuracy: "94.7%",
			profit: "+625.8%",
			followers: "18.4K",
			img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 2,
			name: "Maria Garcia",
			accuracy: "93.9%",
			profit: "+589.2%",
			followers: "16.7K",
			img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 3,
			name: "James Wilson",
			accuracy: "93.2%",
			profit: "+547.6%",
			followers: "15.9K",
			img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&crop=faces",
		},
	],
	investors: [
		{
			rank: 1,
			name: "Robert Zhang",
			accuracy: "97.5%",
			profit: "+892.3%",
			followers: "45.2K",
			img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 2,
			name: "Sophie Anderson",
			accuracy: "96.8%",
			profit: "+845.7%",
			followers: "42.8K",
			img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=faces",
		},
		{
			rank: 3,
			name: "William Lee",
			accuracy: "96.2%",
			profit: "+812.4%",
			followers: "40.1K",
			img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&crop=faces",
		},
	],
};

export const normalizeTimeframe = (interval: string): string => {
	switch (interval) {
		case "1":
		case "3":
		case "5":
		case "15":
		case "30":
			return `${interval}m`;
		case "60":
			return "1h";
		case "1":
			return "1m";
		case "240":
			return "4h";
		case "1d":
			return "1d";
		default:
			throw new Error(`Unsupported interval: ${interval}`);
	}
};

export const BADGES = {
	INVITE_MASTER: "INVITE_MASTER",
	CONTRIBUTOR: "CONTRIBUTOR",
	VALIDATOR: "VALIDATOR",
};

export const SIGNAL_STATUS = {
	PENDING: "PENDING",
	COMPLETED: "COMPLETED",
	EXPIRED: "EXPIRED"
}