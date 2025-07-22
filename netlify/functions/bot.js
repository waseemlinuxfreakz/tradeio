const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Create keyboard markup
const getMainKeyboard = (webAppUrl) => {
  return Markup.keyboard([
    [Markup.button.webApp('🚀 Open Traderate', webAppUrl)],
    ['📊 View Signals', '💼 Portfolio'],
    ['⚙️ Settings', '📈 Statistics']
  ]).resize();
};

const getSignalsKeyboard = (webAppUrl) => {
  return Markup.inlineKeyboard([
    [Markup.button.webApp('View All Signals', `${webAppUrl}/signals`)],
    [Markup.button.callback('Latest Signals', 'latest_signals')]
  ]);
};

// Command handlers
bot.command('start', async (ctx) => {
  try {
    const webAppUrl = process.env.WEBAPP_URL;
    await ctx.reply(
      '🚀 *Welcome to Traderate!*\n\n' +
      'Your smart trading companion is here.\n\n' +
      '• Get verified trading signals\n' +
      '• Track your portfolio\n' +
      '• Join our trading community',
      {
        parse_mode: 'Markdown',
        ...getMainKeyboard(webAppUrl)
      }
    );
  } catch (error) {
    console.error('Start command error:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Handle text messages
bot.on('text', async (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL;
  const text = ctx.message.text;

  try {
    switch (text) {
      case '📊 View Signals':
        await ctx.reply('Choose an option:', getSignalsKeyboard(webAppUrl));
        break;
        
      case '💼 Portfolio':
        await ctx.reply(
          '📊 Your Portfolio Dashboard',
          Markup.inlineKeyboard([
            [Markup.button.webApp('Open Portfolio', `${webAppUrl}/portfolio`)]
          ])
        );
        break;

      case '⚙️ Settings':
        await ctx.reply(
          '⚙️ Account Settings',
          Markup.inlineKeyboard([
            [Markup.button.webApp('Open Settings', `${webAppUrl}/settings`)]
          ])
        );
        break;

      case '📈 Statistics':
        await ctx.reply(
          '📈 Your Trading Statistics',
          Markup.inlineKeyboard([
            [Markup.button.webApp('View Stats', `${webAppUrl}/stats`)]
          ])
        );
        break;
    }
  } catch (error) {
    console.error('Message handling error:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  try {
    const action = ctx.callbackQuery.data;

    switch (action) {
      case 'latest_signals':
        await ctx.answerCallbackQuery();
        await ctx.reply(
          '🎯 Latest Trading Signals:\n\n' +
          '1. BTC/USDT: Long @ $43,250\n' +
          '2. ETH/USDT: Short @ $2,280\n' +
          '3. TON/USDT: Long @ $2.15'
        );
        break;
    }
  } catch (error) {
    console.error('Callback query error:', error);
    ctx.answerCallbackQuery('Sorry, something went wrong');
  }
});

// Handle web app data
bot.on('web_app_data', async (ctx) => {
  try {
    console.log('Received web app data:', ctx.webAppData);
    await ctx.reply('Data received from web app');
  } catch (error) {
    console.error('Web app data error:', error);
    ctx.reply('Error processing web app data');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred');
});

// Netlify function handler
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: 'Method Not Allowed'
    };
  }

  try {
    const update = JSON.parse(event.body);
    await bot.handleUpdate(update);
    
    return { 
      statusCode: 200,
      body: JSON.stringify({ message: 'OK' })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};