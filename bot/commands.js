const { Markup } = require('telegraf');

const mainKeyboard = Markup.keyboard([
  ['📊 Signals', '💼 Portfolio'],
  ['⚙️ Settings', '📈 Statistics'],
  ['👥 Community', '🔔 Notifications']
]).resize();

const signalKeyboard = (signalId) => Markup.inlineKeyboard([
  [
    Markup.button.webApp('View Signal', `https://your-webapp-url.com/signal/${signalId}`),
    Markup.button.callback('Quick Vote', `vote_${signalId}`)
  ],
  [
    Markup.button.callback('⬆️ Like', `like_${signalId}`),
    Markup.button.callback('⬇️ Dislike', `dislike_${signalId}`)
  ]
]);

const portfolioKeyboard = Markup.inlineKeyboard([
  [Markup.button.webApp('Open Portfolio', 'https://your-webapp-url.com/portfolio')],
  [Markup.button.callback('Quick Stats', 'portfolio_stats')]
]);

module.exports = {
  mainKeyboard,
  signalKeyboard,
  portfolioKeyboard
};