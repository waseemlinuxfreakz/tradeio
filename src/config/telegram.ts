// Telegram Bot Configuration
export const TELEGRAM_CONFIG = {
  botToken: '7540116512:AAEEDVRe-9zdsVgW4b0IQZBIcGPhFCj31eU',
  botUsername: 'Traderatetest_bot',
  webAppUrl: window.location.origin,
  commands: {
    start: '/start',
    signals: '/signals',
    portfolio: '/portfolio',
    settings: '/settings',
    notifications: '/notifications'
  },
  deepLink: {
    prefix: 'https://t.me/Traderatetest_bot?start=',
    signalParam: 'signal_'
  }
};

// Mini App Configuration
export const TELEGRAM_MINI_APP = {
  appName: 'TraderateApp',
  shortName: 'Traderate',
  description: 'Smart Trading Platform with Community Intelligence',
  botDomain: 'Traderatetest_bot',
  features: {
    notifications: true,
    sharing: true,
    deepLinking: true,
    authentication: true
  }
};