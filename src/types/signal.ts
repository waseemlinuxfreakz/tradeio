export type CreateSignalResponse = {
	message: string;
	success: boolean;
	data: Signals;
};
export type ActiveSignalResponse = {
	message: string;
	success: boolean;
	data: Signals[];
}


export type GetSignalResponse = {
	message: string;
	success: boolean;
	data: Signals[];
	pagination: {
		total: number;
		offset: number;
		limit: number;
	};
};
export type Signals = {
	id: string;
	pair: string;
	type: SIGNAL_TYPE;
	entryPrice: number;
	takeProfit: number;
	stopLoss: number;
	status: SIGNAL_STAGE;
	currentPrice: number;
	stopPrice?: number;
	timeframe: string;
	profit: number;
	ordertype: ORDER_TYPE;
	metrics: {
		rsi: number;
		macd: number;
		volume: number;
		volatility: string;
	};
	user: {
		id: string;
		name: string;
		image: string;
		badge: string;
		followers: number;
		consensus: number;
		successRate: string;
		verifiedValidators: number;
		totalSignals?: number;
		detailUserSuccessRate?: number;
	};
	community: {
		communityPositive: number;
		communityNegative: number;
		votes: number;
		consensus: number;
		verifiedCommunity: number
	};
	validator: {
		validatorPositive: number;
		validatorNegative: number;
		verifiedValidators: number;
		validatorPercentage: string;
	};
	totalValidators?: number;
	riskRewardRatio?: string | null;
	description: string;
	userVote: string | null;
	userVoteCommunityConsensus?: string | null,
	userVoteValidatorConsensus?: string | null,
	time?: string | null
	isApproved?: boolean;
	totalSignals?: number;
};

export type Metrics = {
	rsi: number;
	macd: number;
	volume: number;
	volatility: string;
}

export type ORDER_TYPE = "MARKET" | "LIMIT" | "STOP_LIMIT" | "STOP_MARKET";

export type SIGNAL_TYPE = "LONG" | "SHORT";

export type SIGNAL_STAGE =
	| "PENDING" | "COMPLETE" | "EXPIRED"

export type VoteResponse = {
	success: false;
	message: string;
};

export type VoteSignalPayload = {
	userId: string;
	signalId: string;
	type: string;
};

export type UserVotePayload = {
	signalId: string;
	type: "like" | "dislike";
	consensus: string,

};

export type AddUserVoteResponse = {
	success: boolean;
	message: string;
	data: ResponseVoteData;
};

export type ResponseVoteData = {
	signalId: string;
	userVote: string;
	totalVotes: number;
	positiveVotes: number;
	negativeVotes: number;
	positiveVotePercentage: number;
};

export type RiskLevel = {
	price: string;
	allocationType: "percentage" | "amount";
	allocationValue: string;
};
export type CreateSignalPayload = {
	coin: string;
	type: string;
	entryPrice: string;
	stopPrice: string;
	takeProfitTargets: RiskLevel[];
	stopLossTargets: RiskLevel[];
	description: string;
	timeframe: string;
	signalDuration: string;
	orderType: ORDER_TYPE;
	isPublic: boolean;
	startDate: string;
	leverage?: number;
	endDate: string;
	tradeAllocation: {
		allocationValue: number;
		allocationType: "percentage" | "amount";
	}
};


export type GetFilterStatus = {
	success: boolean;
	message: string;
	data: {
		active: number;
		trending: number;
		completedSignals: number;
		history: number;
		userSignals: number;
		favourites: number;
		myvotes: number;


	}
}
export type GetFilterCountValues = {
	success: boolean;
	message: string;
	data: {
		totalSignals: number;
		userActiveSIgnals: number;
		successRate: number;
		averageProfit: number;

	}
}

export type GetFilterDataStatus = {
	success: boolean;
	message: string;
	data: {
		status: string;
		result: Signals[];
	};
	pagination: {
		total: number;
		offset: number;
		limit: number;
	};
}

export type SignalByIdResponse = {
	success: boolean;
	message: string;
	data: Signals
}

export type ErrorResponse = {
	success: boolean;
	error: string;
	details: string[]
}
export type User = {
	id?: string | number;
	name?: string;
	email?: string;
	userType?: string;
	reputationPoints?: number;
	successRate?: number;
	isValidator?: boolean;
};

// interface Signal {
//   id?: string | number;
//   coin: string;
//   user: User;
//   type: "LONG" | "SHORT";
//   status: "validator" | "community" | "executable" | string;
//   totalVotes: number;
//   positiveVotes: number;
//   createdAt: string;
// }

export type Signal = {
	id?: string | number;
	coin: string;
	user: User;
	type: "LONG" | "SHORT";
	status: "validator" | "community" | "executable" | string;
	totalVotes: number;
	positiveVotes: number;
	createdAt: string;
}

export type SignalsProps = {
	signalsData: any;
	setSignalsData: (signals: Signal[]) => void;
	signalData: Signal[];
	signalsDataLoading: boolean;
	currentPageSignal: number;
	setCurrentPageSignal: (page: number) => void;
}