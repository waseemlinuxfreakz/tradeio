import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoteData {
  consensus: number;
  totalVotes: number;
  successRate: string;
  upVotes: number;
  downVotes: number;
}

interface VotingState {
  signals: Map<string, VoteData>;
  userVotes: Map<string, Set<string>>;
  getConsensusData: (signalId: string) => {
    consensus: number;
    totalVotes: number;
    successRate: string;
  };
  vote: (signalId: string, voteType: 'up' | 'down') => void;
  getUserVotes: (userId: string) => Set<string>;
  calculateConsensus: (signalId: string) => void;
}

const defaultSignal: VoteData = {
  consensus: 78,
  totalVotes: 1250,
  successRate: '92%',
  upVotes: 975,
  downVotes: 275
};

export const useVotingStore = create<VotingState>()(
  persist(
    (set, get) => ({
      signals: new Map([['default', defaultSignal]]),
      userVotes: new Map(),

      getConsensusData: (signalId: string) => {
        const signal = get().signals.get(signalId) || defaultSignal;
        return {
          consensus: signal.consensus,
          totalVotes: signal.totalVotes,
          successRate: signal.successRate
        };
      },

      vote: (signalId: string, voteType: 'up' | 'down') => {
        set((state) => {
          const signals = new Map(state.signals);
          const currentSignal = signals.get(signalId) || { ...defaultSignal };
          
          const newSignal = {
            ...currentSignal,
            upVotes: currentSignal.upVotes + (voteType === 'up' ? 1 : 0),
            downVotes: currentSignal.downVotes + (voteType === 'down' ? 1 : 0)
          };

          const totalVotes = newSignal.upVotes + newSignal.downVotes;
          newSignal.consensus = (newSignal.upVotes / totalVotes) * 100;
          newSignal.totalVotes = totalVotes;
          newSignal.successRate = `${Math.round(newSignal.consensus)}%`;

          signals.set(signalId, newSignal);
          return { signals };
        });
      },

      getUserVotes: (userId: string) => {
        return get().userVotes.get(userId) || new Set();
      },

      calculateConsensus: (signalId: string) => {
        set((state) => {
          const signals = new Map(state.signals);
          const signal = signals.get(signalId);
          
          if (!signal) return state;

          const totalVotes = signal.upVotes + signal.downVotes;
          const consensus = (signal.upVotes / totalVotes) * 100;
          
          signals.set(signalId, {
            ...signal,
            consensus,
            totalVotes,
            successRate: `${Math.round(consensus)}%`
          });

          return { signals };
        });
      }
    }),
    {
      name: 'voting-storage',
      partialize: (state) => ({
        signals: Array.from(state.signals.entries()),
        userVotes: Array.from(state.userVotes.entries()).map(([userId, votes]) => [
          userId,
          Array.from(votes)
        ])
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        signals: new Map(persistedState.signals || [['default', defaultSignal]]),
        userVotes: new Map(
          (persistedState.userVotes || []).map(([userId, votes]: [string, string[]]) => [
            userId,
            new Set(votes)
          ])
        )
      })
    }
  )
);