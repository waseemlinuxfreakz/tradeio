export type AchievementError = {
    success: boolean;
    message: string;
}
export type GetAchievementResponse = {
    success: boolean;
    message: string;
    data: {
        stats: AchievementStats,
        achievements: Achievements[],
        badges: AchievementBadge[]
    }
}
export type AchievementStats = {
    reputationPoints: number;
    referralCount: number;
    successfulTrades: number;
    voteCount: number;
}
export type Achievements = {
    id: string;
    name: string;
    label: string,
    description: string;
    category: string;
    requirement: number;
    currentProgress: number;
    reward: number;
    completed: boolean;
    icon: string;
    collected: boolean
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  provider: string; 
  user_type: string;
  isValidator: boolean;
  image: string;
  balance: number;
  reputationPoints: number;
  collectedAchievements?: string[]; 
}


export type AchievementBadge = {
    id: string;
    name: string;
    description: string;
    category: string;
    requirement: string;
    earned: string;
    icon: string;
}
export interface UnlockAchievementPayload {
  amount: number;
  label: string;
}
