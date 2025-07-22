// Common Types
export interface User {
  id: number;
  name: string;
  image: string;
  role?: string;
  stats?: UserStats;
}

export interface UserStats {
  signals?: number;
  followers?: string;
  success?: string;
  profit?: string;
}

export interface Signal {
  id: string;
  asset: string;
  price: string;
  status: 'Active' | 'Completed' | 'Failed';
  time: string;
  takeProfit: string;
  stopLoss: string;
  riskReward: string;
  successRate: string;
  analyst: User;
  consensus?: number;
  votes?: number;
}

export interface VoteData {
  consensus: number;
  totalVotes: number;
  successRate: string;
  upVotes: number;
  downVotes: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

// Store Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SwipeState {
  stats: {
    totalSwipes: number;
    successfulSwipes: number;
    accuracy: number;
    rating: number;
    favoriteSignals: string[];
  };
}

export interface VotingState {
  signals: Map<string, VoteData>;
  userVotes: Map<string, Set<string>>;
}

// Component Props Types
export interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar';
  count?: number;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface NavigationBarProps {
  onQuickAction?: () => void;
}

export interface SignalCardProps {
  signal: Signal;
  isExpanded: boolean;
  onToggle: () => void;
}
