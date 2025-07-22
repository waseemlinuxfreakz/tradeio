import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for the voting system
export interface Voter {
  id: string;
  type: 'validator' | 'regular';
  reputation: number;
  successRate: number;
}

export interface VoteData {
  signalId: string;
  validatorVotes: {
    up: number;
    down: number;
    total: number;
    consensus: number; // Percentage of positive votes
  };
  communityVotes: {
    up: number;
    down: number;
    total: number;
    consensus: number; // Percentage of positive votes
  };
  stage: 'validator' | 'community' | 'executable' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface VotingSystemConfig {
  validatorThreshold: number; // % of validators needed to vote
  validatorConsensusThreshold: number; // % of positive votes needed in validator stage
  communityThreshold: number; // % of users needed to vote
  communityConsensusThreshold: number; // % of positive votes needed in community stage
  validatorPercentage: number; // Top % of users considered validators
}

interface VotingSystemState {
  signals: Map<string, VoteData>;
  userVotes: Map<string, Map<string, 'up' | 'down'>>;
  config: VotingSystemConfig;
  validators: Set<string>; // Set of user IDs who are validators
  
  // Actions
  vote: (signalId: string, voter: Voter, voteType: 'up' | 'down') => void;
  getSignalVotes: (signalId: string) => VoteData | undefined;
  getUserVote: (userId: string, signalId: string) => 'up' | 'down' | undefined;
  updateStage: (signalId: string) => void;
  isValidator: (userId: string) => boolean;
  setValidators: (userIds: string[]) => void;
  updateConfig: (config: Partial<VotingSystemConfig>) => void;
}

// Default configuration
const DEFAULT_CONFIG: VotingSystemConfig = {
  validatorThreshold: 10, // 10% of validators need to vote
  validatorConsensusThreshold: 70, // 70% of validator votes need to be positive
  communityThreshold: 16, // 16% of users need to vote
  communityConsensusThreshold: 70, // 70% of community votes need to be positive
  validatorPercentage: 10 // Top 10% of users are validators
};

export const useVotingSystem = create<VotingSystemState>()(
  persist(
    (set, get) => ({
      signals: new Map(),
      userVotes: new Map(),
      config: DEFAULT_CONFIG,
      validators: new Set(),
      
      vote: (signalId, voter, voteType) => {
        set(state => {
          // Check if user has already voted on this signal
          const userVotesForSignal = state.userVotes.get(voter.id) || new Map();
          if (userVotesForSignal.has(signalId)) {
            // User has already voted, don't allow changing vote
            return state;
          }
          
          // Get current signal data or create new
          const signal = state.signals.get(signalId) || {
            signalId,
            validatorVotes: { up: 0, down: 0, total: 0, consensus: 0 },
            communityVotes: { up: 0, down: 0, total: 0, consensus: 0 },
            stage: 'validator',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Update vote counts based on voter type
          const isValidatorUser = state.validators.has(voter.id);
          
          if (isValidatorUser && signal.stage === 'validator') {
            // Validator vote in validator stage
            const validatorVotes = {
              up: signal.validatorVotes.up + (voteType === 'up' ? 1 : 0),
              down: signal.validatorVotes.down + (voteType === 'down' ? 1 : 0),
              total: signal.validatorVotes.total + 1,
              consensus: 0 // Will be calculated below
            };
            
            // Calculate new consensus
            validatorVotes.consensus = validatorVotes.total > 0 
              ? (validatorVotes.up / validatorVotes.total) * 100 
              : 0;
            
            signal.validatorVotes = validatorVotes;
          } else {
            // Community vote or validator voting in community stage
            const communityVotes = {
              up: signal.communityVotes.up + (voteType === 'up' ? 1 : 0),
              down: signal.communityVotes.down + (voteType === 'down' ? 1 : 0),
              total: signal.communityVotes.total + 1,
              consensus: 0 // Will be calculated below
            };
            
            // Calculate new consensus
            communityVotes.consensus = communityVotes.total > 0 
              ? (communityVotes.up / communityVotes.total) * 100 
              : 0;
            
            signal.communityVotes = communityVotes;
          }
          
          // Update signal's updatedAt timestamp
          signal.updatedAt = new Date().toISOString();
          
          // Record user's vote
          userVotesForSignal.set(signalId, voteType);
          
          // Create new state
          const newSignals = new Map(state.signals);
          newSignals.set(signalId, signal);
          
          const newUserVotes = new Map(state.userVotes);
          newUserVotes.set(voter.id, userVotesForSignal);
          
          // Check if stage should be updated
          const updatedState = {
            signals: newSignals,
            userVotes: newUserVotes
          };
          
          // Update stage if needed
          get().updateStage(signalId);
          
          return updatedState;
        });
      },
      
      getSignalVotes: (signalId) => {
        return get().signals.get(signalId);
      },
      
      getUserVote: (userId, signalId) => {
        const userVotes = get().userVotes.get(userId);
        if (!userVotes) return undefined;
        return userVotes.get(signalId);
      },
      
      updateStage: (signalId) => {
        set(state => {
          const signal = state.signals.get(signalId);
          if (!signal) return state;
          
          const { config } = state;
          let newStage = signal.stage;
          
          // Check if signal should move from validator to community stage
          if (signal.stage === 'validator') {
            const validatorVotePercentage = signal.validatorVotes.total / state.validators.size * 100;
            
            if (validatorVotePercentage >= config.validatorThreshold) {
              // Enough validators have voted, check consensus
              if (signal.validatorVotes.consensus >= config.validatorConsensusThreshold) {
                // Enough positive votes, move to community stage
                newStage = 'community';
              } else {
                // Not enough positive votes, reject signal
                newStage = 'rejected';
              }
            }
          }
          
          // Check if signal should move from community to executable stage
          else if (signal.stage === 'community') {
            // For demo purposes, we'll use a fixed number of total users
            const totalUsers = 1000;
            const communityVotePercentage = signal.communityVotes.total / totalUsers * 100;
            
            if (communityVotePercentage >= config.communityThreshold) {
              // Enough community members have voted, check consensus
              if (signal.communityVotes.consensus >= config.communityConsensusThreshold) {
                // Enough positive votes, move to executable stage
                newStage = 'executable';
              } else {
                // Not enough positive votes, reject signal
                newStage = 'rejected';
              }
            }
          }
          
          // If stage has changed, update the signal
          if (newStage !== signal.stage) {
            const updatedSignal = {
              ...signal,
              stage: newStage,
              updatedAt: new Date().toISOString()
            };
            
            const newSignals = new Map(state.signals);
            newSignals.set(signalId, updatedSignal);
            
            return { signals: newSignals };
          }
          
          return state;
        });
      },
      
      isValidator: (userId) => {
        return get().validators.has(userId);
      },
      
      setValidators: (userIds) => {
        set({ validators: new Set(userIds) });
      },
      
      updateConfig: (config) => {
        set(state => ({
          config: { ...state.config, ...config }
        }));
      }
    }),
    {
      name: 'voting-system-storage',
      partialize: (state) => ({
        signals: Array.from(state.signals.entries()),
        userVotes: Array.from(state.userVotes.entries()).map(([userId, votes]) => [
          userId,
          Array.from(votes.entries())
        ]),
        config: state.config,
        validators: Array.from(state.validators)
      }),
      merge: (persistedState: any, currentState) => {
        // Convert arrays back to Maps and Sets
        const signals = new Map(persistedState.signals || []);
        
        const userVotes = new Map();
        (persistedState.userVotes || []).forEach(([userId, votes]: [string, [string, 'up' | 'down'][]]) => {
          userVotes.set(userId, new Map(votes));
        });
        
        const validators = new Set(persistedState.validators || []);
        
        return {
          ...currentState,
          signals,
          userVotes,
          config: persistedState.config || DEFAULT_CONFIG,
          validators
        };
      }
    }
  )
);

// Helper functions for the voting system
export const voteOnSignal = (signalId: string, voter: Voter, voteType: 'up' | 'down') => {
  useVotingSystem.getState().vote(signalId, voter, voteType);
};

export const getSignalVotingStatus = (signalId: string) => {
  return useVotingSystem.getState().getSignalVotes(signalId);
};

export const checkUserVote = (userId: string, signalId: string) => {
  return useVotingSystem.getState().getUserVote(userId, signalId);
};

export const checkIsValidator = (userId: string) => {
  return useVotingSystem.getState().isValidator(userId);
};

// Initialize some validators for demo purposes
export const initializeValidators = () => {
  // In a real app, this would come from a backend service
  const validatorIds = [
    'user1', 'user2', 'user3', 'user4', 'user5',
    'validator1', 'validator2', 'validator3', 'validator4', 'validator5',
    'demo@example.com' // Add the demo user as a validator
  ];
  
  useVotingSystem.getState().setValidators(validatorIds);
};

// Initialize some sample signals for demo purposes
export const initializeSampleSignals = () => {
  const { signals } = useVotingSystem.getState();
  
  // Only initialize if we don't have any signals yet
  if (signals.size === 0) {
    // Create sample signals in different stages
    const sampleSignals: VoteData[] = [
      // Validator stage signal
      {
        signalId: 'signal1',
        validatorVotes: { up: 3, down: 1, total: 4, consensus: 75 },
        communityVotes: { up: 0, down: 0, total: 0, consensus: 0 },
        stage: 'validator',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      },
      // Community stage signal
      {
        signalId: 'signal2',
        validatorVotes: { up: 8, down: 2, total: 10, consensus: 80 },
        communityVotes: { up: 45, down: 15, total: 60, consensus: 75 },
        stage: 'community',
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
      },
      // Executable signal
      {
        signalId: 'signal3',
        validatorVotes: { up: 9, down: 1, total: 10, consensus: 90 },
        communityVotes: { up: 140, down: 20, total: 160, consensus: 87.5 },
        stage: 'executable',
        createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        updatedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      // Rejected signal
      {
        signalId: 'signal4',
        validatorVotes: { up: 3, down: 7, total: 10, consensus: 30 },
        communityVotes: { up: 0, down: 0, total: 0, consensus: 0 },
        stage: 'rejected',
        createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        updatedAt: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
      }
    ];
    
    // Add sample signals to the store
    const newSignals = new Map(useVotingSystem.getState().signals);
    sampleSignals.forEach(signal => {
      newSignals.set(signal.signalId, signal);
    });
    
    useVotingSystem.setState({ signals: newSignals });
  }
};

// Initialize the system
export const initializeVotingSystem = () => {
  initializeValidators();
  initializeSampleSignals();
};