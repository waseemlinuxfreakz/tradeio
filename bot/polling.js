const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Configure commands
bot.command('start', async (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL;
  const keyboard = {
    reply_markup: {
      keyboard: [
        [{text: '📊 Signals', web_app: {url: `${webAppUrl}/signals`}}],
        [{text: '💼 Portfolio', web_app: {url: `${webAppUrl}/portfolio`}}],
        [{text: '⚙️ Settings', web_app: {url: `${webAppUrl}/settings`}}]
      ],
      resize_keyboard: true
    }
  };
  
  await ctx.reply('Welcome to Traderate! Choose an option:', keyboard);
});

// Handle web app data
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.webAppData.data);
    await ctx.reply(`Received: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.error('Web app data error:', error);
    ctx.reply('Error processing data');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred');
});

// Start bot with long polling
bot.launch({
  dropPendingUpdates: true,
  polling: {
    timeout: 50,
    limit: 100
  }
}).then(() => {
  console.log('Bot started with long polling');
}).catch((err) => {
  console.error('Failed to start bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));