import { describe, it, expect, beforeEach } from 'vitest';
import { useVotingStore } from '../../lib/votingStore';

describe('votingStore', () => {
  beforeEach(() => {
    useVotingStore.setState({
      signals: new Map(),
      userVotes: new Map()
    });
  });

  it('initializes with default state', () => {
    const state = useVotingStore.getState();
    expect(state.signals.size).toBe(0);
    expect(state.userVotes.size).toBe(0);
  });

  it('records votes correctly', () => {
    const { vote } = useVotingStore.getState();
    const signalId = 'test-signal';
    
    vote(signalId, {
      id: 'user1',
      type: 'analyst',
      reputation: 85,
      successRate: 92
    }, 'up');

    const state = useVotingStore.getState();
    const signal = state.signals.get(signalId);
    
    expect(signal).toBeDefined();
    expect(signal?.upVotes).toBe(1);
    expect(signal?.downVotes).toBe(0);
  });

  it('calculates consensus correctly', () => {
    const { vote, calculateConsensus } = useVotingStore.getState();
    const signalId = 'test-signal';

    // Add multiple votes
    vote(signalId, { id: 'user1', type: 'analyst', reputation: 85, successRate: 92 }, 'up');
    vote(signalId, { id: 'user2', type: 'analyst', reputation: 80, successRate: 88 }, 'up');
    vote(signalId, { id: 'user3', type: 'analyst', reputation: 75, successRate: 85 }, 'down');

    calculateConsensus(signalId);

    const signal = useVotingStore.getState().signals.get(signalId);
    const consensus = signal?.consensus || 0;
    expect(Math.round(consensus)).toBe(67); // 2 up votes out of 3 total votes ≈ 66.67%
  });

  it('prevents duplicate votes from same user', () => {
    const { vote } = useVotingStore.getState();
    const signalId = 'test-signal';
    const userId = 'user1';

    vote(signalId, { id: userId, type: 'analyst', reputation: 85, successRate: 92 }, 'up');
    vote(signalId, { id: userId, type: 'analyst', reputation: 85, successRate: 92 }, 'up');

    const signal = useVotingStore.getState().signals.get(signalId);
    expect(signal?.upVotes).toBe(1); // Should only count one vote
  });
});