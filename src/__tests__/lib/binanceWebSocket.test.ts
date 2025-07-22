import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BinanceWebSocket } from '../../lib/binanceWebSocket';

describe('BinanceWebSocket', () => {
  let ws: BinanceWebSocket;
  const mockHandlers = {
    onMessage: vi.fn(),
    onError: vi.fn(),
    onStateChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    ws = new BinanceWebSocket('BTCUSDT', '15', mockHandlers);
  });

  it('initializes with correct configuration', () => {
    expect(ws).toBeDefined();
  });

  it('handles connection state changes', async () => {
    ws.connect();
    await vi.waitFor(() => {
      expect(mockHandlers.onStateChange).toHaveBeenCalledWith('connecting');
    });
  });

  it('processes incoming messages correctly', () => {
    const mockMessage = {
      k: {
        t: 1625232000000,
        o: '35000',
        h: '36000',
        l: '34000',
        c: '35500'
      }
    };

    const event = new MessageEvent('message', {
      data: JSON.stringify(mockMessage)
    });

    ws['handleMessage'](event);

    expect(mockHandlers.onMessage).toHaveBeenCalledWith({
      time: mockMessage.k.t / 1000,
      open: 35000,
      high: 36000,
      low: 34000,
      close: 35500
    });
  });

  it('handles reconnection attempts', async () => {
    ws['reconnectAttempts'] = 0;
    ws['attemptReconnect']();
    
    await vi.waitFor(() => {
      expect(mockHandlers.onStateChange).toHaveBeenCalledWith('connecting');
    });
  });

  it('cleans up resources on destroy', () => {
    ws.destroy();
    expect(ws['isDestroyed']).toBe(true);
  });
});