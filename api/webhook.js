const { createServer } = require('http');
const bot = require('../bot');

// Create server to handle webhook requests
const server = createServer(async (req, res) => {
  if (req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    
    req.on('end', async () => {
      try {
        const update = JSON.parse(Buffer.concat(chunks).toString());
        await bot.handleUpdate(update);
        res.end('OK');
      } catch (error) {
        console.error('Webhook error:', error);
        res.statusCode = 500;
        res.end('Error');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

module.exports = server;