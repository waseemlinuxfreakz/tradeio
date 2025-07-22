import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for the reputation system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'points' | 'invite' | 'trading' | 'community';
  requirement: number;
  currentProgress: number;
  reward: number;
  completed: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'validator' | 'invite' | 'contributor';
  requirement: string;
  earned: boolean;
  icon: string;
}

export interface ReputationState {
  points: number;
  successfulSignals: number;
  failedSignals: number;
  successfulVotes: number;
  failedVotes: number;
  invites: number;
  achievements: Achievement[];
  badges: Badge[];
  
  // Actions
  addPoints: (amount: number, reason: string) => void;
  deductPoints: (amount: number, reason: string) => void;
  recordSignalResult: (success: boolean, isCreator: boolean) => void;
  recordVoteResult: (success: boolean, voteType: 'up' | 'down') => void;
  recordInvite: () => void;
  checkAchievements: () => void;
  checkBadges: () => void;
  getAchievements: () => Achievement[];
  getBadges: () => Badge[];
  getPointsHistory: () => { amount: number; reason: string; timestamp: string }[];
}

export const useReputationSystem = create<ReputationState>()(
  persist(
    (set, get) => ({
      points: 100, // Start with 100 points
      successfulSignals: 0,
      failedSignals: 0,
      successfulVotes: 0,
      failedVotes: 0,
      invites: 0,
      achievements: [
        {
          id: 'points_100',
          name: 'Century Club',
          description: 'Reach 100 reputation points',
          category: 'points',
          requirement: 100,
          currentProgress: 100,
          reward: 1000,
          completed: true,
          icon: 'award'
        },
        {
          id: 'points_200',
          name: 'Rising Star',
          description: 'Reach 200 reputation points',
          category: 'points',
          requirement: 200,
          currentProgress: 100,
          reward: 1000,
          completed: false,
          icon: 'star'
        },
        {
          id: 'points_500',
          name: 'Expert Analyst',
          description: 'Reach 500 reputation points',
          category: 'points',
          requirement: 500,
          currentProgress: 100,
          reward: 2000,
          completed: false,
          icon: 'trending-up'
        },
        {
          id: 'points_1000',
          name: 'Master Trader',
          description: 'Reach 1000 reputation points',
          category: 'points',
          requirement: 1000,
          currentProgress: 100,
          reward: 5000,
          completed: false,
          icon: 'award'
        },
        {
          id: 'invite_5',
          name: 'Network Builder',
          description: 'Invite 5 new users',
          category: 'invite',
          requirement: 5,
          currentProgress: 0,
          reward: 500,
          completed: false,
          icon: 'users'
        },
        {
          id: 'invite_10',
          name: 'Community Leader',
          description: 'Invite 10 new users',
          category: 'invite',
          requirement: 10,
          currentProgress: 0,
          reward: 1000,
          completed: false,
          icon: 'users'
        },
        {
          id: 'trading_10',
          name: 'Signal Specialist',
          description: 'Create 10 successful signals',
          category: 'trading',
          requirement: 10,
          currentProgress: 0,
          reward: 1500,
          completed: false,
          icon: 'signal'
        },
        {
          id: 'community_50',
          name: 'Community Voice',
          description: 'Vote on 50 signals',
          category: 'community',
          requirement: 50,
          currentProgress: 0,
          reward: 1000,
          completed: false,
          icon: 'message-circle'
        }
      ],
      badges: [
        {
          id: 'validator',
          name: 'Validator',
          description: 'Top 10% of users by reputation',
          category: 'validator',
          requirement: 'Top 10%',
          earned: false,
          icon: 'shield'
        },
        {
          id: 'invite_master',
          name: 'Invite Master',
          description: 'Top 100 inviters',
          category: 'invite',
          requirement: 'Top 100',
          earned: false,
          icon: 'users'
        },
        {
          id: 'contributor',
          name: 'Contributor',
          description: 'Top 40% of voters',
          category: 'contributor',
          requirement: 'Top 40%',
          earned: false,
          icon: 'thumbs-up'
        }
      ],
      pointsHistory: [],
      
      addPoints: (amount, reason) => {
        set(state => {
          const newPoints = state.points + amount;
          const newHistory = [...(state.pointsHistory || []), {
            amount,
            reason,
            timestamp: new Date().toISOString()
          }];
          
          return {
            points: newPoints,
            pointsHistory: newHistory
          };
        });
        
        // Check for achievements after adding points
        get().checkAchievements();
        get().checkBadges();
      },
      
      deductPoints: (amount, reason) => {
        set(state => {
          const newPoints = Math.max(0, state.points - amount); // Prevent negative points
          const newHistory = [...(state.pointsHistory || []), {
            amount: -amount,
            reason,
            timestamp: new Date().toISOString()
          }];
          
          return {
            points: newPoints,
            pointsHistory: newHistory
          };
        });
        
        // Check badges after deducting points
        get().checkBadges();
      },
      
      recordSignalResult: (success, isCreator) => {
        if (isCreator) {
          // Signal creator
          if (success) {
            // Successful signal
            set(state => ({
              successfulSignals: state.successfulSignals + 1
            }));
            get().addPoints(20, 'Created successful signal');
          } else {
            // Failed signal
            set(state => ({
              failedSignals: state.failedSignals + 1
            }));
            get().deductPoints(20, 'Created unsuccessful signal');
          }
        }
        
        // Update achievements for signal creation
        get().checkAchievements();
      },
      
      recordVoteResult: (success, voteType) => {
        if (success && voteType === 'up' || !success && voteType === 'down') {
          // Correct vote
          set(state => ({
            successfulVotes: state.successfulVotes + 1
          }));
          get().addPoints(5, 'Correct signal vote');
        } else {
          // Incorrect vote
          set(state => ({
            failedVotes: state.failedVotes + 1
          }));
          get().deductPoints(5, 'Incorrect signal vote');
        }
        
        // Update achievements for voting
        get().checkAchievements();
      },
      
      recordInvite: () => {
        set(state => ({
          invites: state.invites + 1
        }));
        
        // Check for invite achievements
        get().checkAchievements();
      },
      
      checkAchievements: () => {
        set(state => {
          const { points, successfulSignals, invites, successfulVotes, failedVotes } = state;
          const totalVotes = successfulVotes + failedVotes;
          
          // Update achievement progress
          const updatedAchievements = state.achievements.map(achievement => {
            let currentProgress = achievement.currentProgress;
            let completed = achievement.completed;
            
            // Update progress based on category
            if (achievement.category === 'points') {
              currentProgress = points;
              if (points >= achievement.requirement && !completed) {
                completed = true;
                // In a real app, we would add tokens to user's wallet here
              }
            } else if (achievement.category === 'invite') {
              currentProgress = invites;
              if (invites >= achievement.requirement && !completed) {
                completed = true;
              }
            } else if (achievement.category === 'trading') {
              currentProgress = successfulSignals;
              if (successfulSignals >= achievement.requirement && !completed) {
                completed = true;
              }
            } else if (achievement.category === 'community') {
              currentProgress = totalVotes;
              if (totalVotes >= achievement.requirement && !completed) {
                completed = true;
              }
            }
            
            return {
              ...achievement,
              currentProgress,
              completed
            };
          });
          
          return { achievements: updatedAchievements };
        });
      },
      
      checkBadges: () => {
        set(state => {
          const { points, invites, successfulVotes, failedVotes } = state;
          const totalVotes = successfulVotes + failedVotes;
          
          // For demo purposes, we'll use some thresholds
          const isTop10Percent = points >= 200; // Simplified check
          const isTop100Inviters = invites >= 5; // Simplified check
          const isTop40PercentVoters = totalVotes >= 20; // Simplified check
          
          const updatedBadges = state.badges.map(badge => {
            let earned = badge.earned;
            
            if (badge.id === 'validator' && isTop10Percent) {
              earned = true;
            } else if (badge.id === 'invite_master' && isTop100Inviters) {
              earned = true;
            } else if (badge.id === 'contributor' && isTop40PercentVoters) {
              earned = true;
            }
            
            return {
              ...badge,
              earned
            };
          });
          
          return { badges: updatedBadges };
        });
      },
      
      getAchievements: () => {
        return get().achievements;
      },
      
      getBadges: () => {
        return get().badges;
      },
      
      getPointsHistory: () => {
        return get().pointsHistory || [];
      }
    }),
    {
      name: 'reputation-system-storage',
      partialize: (state) => ({
        points: state.points,
        successfulSignals: state.successfulSignals,
        failedSignals: state.failedSignals,
        successfulVotes: state.successfulVotes,
        failedVotes: state.failedVotes,
        invites: state.invites,
        achievements: state.achievements,
        badges: state.badges,
        pointsHistory: state.pointsHistory
      })
    }
  )
);

// Helper functions
export const addReputationPoints = (amount: number, reason: string) => {
  useReputationSystem.getState().addPoints(amount, reason);
};

export const deductReputationPoints = (amount: number, reason: string) => {
  useReputationSystem.getState().deductPoints(amount, reason);
};

export const recordSignalOutcome = (success: boolean, isCreator: boolean) => {
  useReputationSystem.getState().recordSignalResult(success, isCreator);
};

export const recordVoteOutcome = (success: boolean, voteType: 'up' | 'down') => {
  useReputationSystem.getState().recordVoteResult(success, voteType);
};

export const recordUserInvite = () => {
  useReputationSystem.getState().recordInvite();
};

export const getUserAchievements = () => {
  return useReputationSystem.getState().getAchievements();
};

export const getUserBadges = () => {
  return useReputationSystem.getState().getBadges();
};

export const getUserReputationPoints = () => {
  return useReputationSystem.getState().points;
};

// Initialize the reputation system
export const initializeReputationSystem = () => {
  // Check achievements and badges on initialization
  useReputationSystem.getState().checkAchievements();
  useReputationSystem.getState().checkBadges();
};