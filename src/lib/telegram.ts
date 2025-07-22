import { useAuthStore } from './store';
import { TELEGRAM_CONFIG } from '../config/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        isExpanded: boolean;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
      };
    };
  }
}

export const initTelegramWebApp = () => {
  try {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn('Telegram WebApp is not available');
      return null;
    }

    // Initialize WebApp
    tg.ready();
    tg.expand();

    // Set theme colors
    tg.setHeaderColor('#0f172a');
    tg.setBackgroundColor('#0f172a');

    // Enable closing confirmation
    tg.enableClosingConfirmation();

    return tg;
  } catch (error) {
    console.error('Failed to initialize Telegram WebApp:', error);
    return null;
  }
};

export const connectTelegramWallet = () => {
  const botUsername = TELEGRAM_CONFIG.botUsername;
  const webAppUrl = TELEGRAM_CONFIG.webAppUrl;
  const deepLink = `https://t.me/${botUsername}/start?startapp=${encodeURIComponent(webAppUrl)}`;
  window.open(deepLink, '_blank');
};

export const sendSignalToTelegram = (signal: any) => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const signalData = JSON.stringify({
    type: 'signal',
    data: signal
  });

  tg.sendData(signalData);
};

export const closeTelegramWebApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.close();
  }
};