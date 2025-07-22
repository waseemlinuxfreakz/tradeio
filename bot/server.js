const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Parse JSON bodies
app.use(express.json());

// Bot middleware
app.use(bot.webhookCallback('/webhook'));

// Basic bot commands
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL;
  return ctx.reply(
    'Welcome to Traderate! 🚀',
    {
      reply_markup: {
        keyboard: [
          [{text: 'Open App', web_app: {url: webAppUrl}}]
        ],
        resize_keyboard: true
      }
    }
  );
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred');
});

// Set webhook
bot.telegram.setWebhook(`${process.env.WEBAPP_URL}/webhook`);

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});