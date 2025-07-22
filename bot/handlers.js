const { signalKeyboard, portfolioKeyboard } = require('./commands');

const handleStart = async (ctx) => {
  const { first_name, username } = ctx.from;
  
  await ctx.reply(
    `Welcome to Traderate, ${first_name}! 🚀\n\n` +
    `I'm your personal trading assistant. I'll help you:\n` +
    `• Get real-time trading signals\n` +
    `• Track your portfolio\n` +
    `• Stay updated with market movements\n\n` +
    `Use the menu below or open the web app to get started!`,
    Markup.keyboard([
      [Markup.button.webApp('🚀 Open Traderate', 'https://your-webapp-url.com')]
    ]).resize()
  );
};

const handleSignal = async (ctx, signal) => {
  const message = 
    `🎯 New Signal Alert!\n\n` +
    `Pair: ${signal.pair}\n` +
    `Type: ${signal.type}\n` +
    `Entry: $${signal.entry}\n` +
    `Target: $${signal.target}\n` +
    `Stop Loss: $${signal.stopLoss}\n\n` +
    `Community Consensus: ${signal.consensus}%\n` +
    `Time Left: ${signal.timeLeft}`;

  await ctx.reply(message, signalKeyboard(signal.id));
};

const handlePortfolio = async (ctx) => {
  await ctx.reply(
    '💼 Your Trading Portfolio\n\n' +
    'Track your positions, analyze performance, and manage your trades.',
    portfolioKeyboard
  );
};

module.exports = {
  handleStart,
  handleSignal,
  handlePortfolio
};