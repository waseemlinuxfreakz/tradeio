import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Signal {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  takeProfit: number;
  stopLoss: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  currentPrice?: number;
  profit?: number;
  createdAt: string;
  metrics?: {
    rsi: number;
    macd: number;
    volume: string;
    volatility: string;
  };
  analyst: {
    name: string;
    image: string;
    badge: string;
  };
}

interface SignalState {
  personalSignals: Signal[];
  currentSignalValue: number | undefined;

  // Actions
  addSignal: (signal: Signal) => void;
  removeSignal: (signalId: string) => void;
  updateSignal: (signalId: string, updates: Partial<Signal>) => void;
  getSignalById: (signalId: string) => Signal | undefined;
  setCurrentSignalValue: (value?: number) => void;
}

export const useSignalStore = create<SignalState>()(
  persist(
    (set, get) => ({
      personalSignals: [],
      currentSignalValue: undefined,

      addSignal: (signal) =>
        set((state) => ({
          personalSignals: [signal, ...state.personalSignals]
        })),

      removeSignal: (signalId) =>
        set((state) => {
          const filtered = state.personalSignals.filter((s) => s.id !== signalId);
          const current = get().currentSignalValue;
          return {
            personalSignals: filtered,
            currentSignalValue:
              filtered.find((s) => s.id === String(current)) ? current : undefined
          };
        }),

      updateSignal: (signalId, updates) =>
        set((state) => ({
          personalSignals: state.personalSignals.map((signal) =>
            signal.id === signalId ? { ...signal, ...updates } : signal
          )
        })),

      getSignalById: (signalId) =>
        get().personalSignals.find((s) => s.id === signalId),

      setCurrentSignalValue: (value) =>
        set(() => ({
          currentSignalValue: value
        }))
    }),
    {
      name: 'signal-store',
      partialize: (state) => ({
        personalSignals: state.personalSignals,
        currentSignalValue: state.currentSignalValue
      })
    }
  )
);