import { describe, it, expect, vi } from 'vitest';
import { initTelegramWebApp, connectTelegramWallet, sendSignalToTelegram } from '../../lib/telegram';

describe('Telegram Integration', () => {
  beforeEach(() => {
    // Mock Telegram WebApp
    global.Telegram = {
      WebApp: {
        ready: vi.fn(),
        expand: vi.fn(),
        close: vi.fn(),
        MainButton: {
          text: '',
          show: vi.fn(),
          hide: vi.fn(),
          onClick: vi.fn(),
          offClick: vi.fn()
        },
        onEvent: vi.fn(),
        sendData: vi.fn(),
        initDataUnsafe: {},
        initData: ''
      }
    };
  });

  it('initializes Telegram WebApp', () => {
    const tg = initTelegramWebApp();
    expect(tg).toBeDefined();
    expect(global.Telegram.WebApp.ready).toHaveBeenCalled();
    expect(global.Telegram.WebApp.expand).toHaveBeenCalled();
  });

  it('connects Telegram wallet', () => {
    const windowSpy = vi.spyOn(window, 'open');
    connectTelegramWallet();
    expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('t.me'), '_blank');
  });

  it('sends signal data to Telegram', () => {
    const mockSignal = {
      id: 'test-signal',
      type: 'LONG',
      pair: 'BTC/USDT'
    };

    sendSignalToTelegram(mockSignal);
    expect(global.Telegram.WebApp.sendData).toHaveBeenCalledWith(
      expect.stringContaining('test-signal')
    );
  });
});