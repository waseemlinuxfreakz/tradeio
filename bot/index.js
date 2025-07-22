const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Basic commands
bot.command('start', async (ctx) => {
  try {
    const webAppUrl = process.env.WEBAPP_URL || 'https://glistening-monstera-1375eb.netlify.app';
    await ctx.reply(
      '🚀 Welcome to Traderate!\n\nStart trading smarter with community-verified signals.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📱 Open Traderate', web_app: { url: webAppUrl } }],
            [{ text: '📊 View Signals', callback_data: 'signals' }],
            [{ text: '💼 Portfolio', callback_data: 'portfolio' }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Start command error:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'https://glistening-monstera-1375eb.netlify.app';
  const action = ctx.callbackQuery.data;
  
  try {
    switch (action) {
      case 'signals':
        await ctx.reply('View latest trading signals:', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Open Signals', web_app: { url: `${webAppUrl}/signals` } }
            ]]
          }
        });
        break;
      case 'portfolio':
        await ctx.reply('Check your portfolio:', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Open Portfolio', web_app: { url: `${webAppUrl}/portfolio` } }
            ]]
          }
        });
        break;
    }
  } catch (error) {
    console.error('Callback error:', error);
    ctx.reply('Sorry, something went wrong');
  }
});

// Handle web app data
bot.on('web_app_data', (ctx) => {
  console.log('Received web app data:', ctx.webAppData);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred');
});

// Start bot with long polling
bot.launch({
  dropPendingUpdates: true
}).then(() => {
  console.log('Bot started successfully');
}).catch((err) => {
  console.error('Failed to start bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));