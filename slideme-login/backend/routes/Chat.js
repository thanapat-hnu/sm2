const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Store active connections
const clients = new Map();
const chatHistory = new Map();

// Handle WebSocket connection
wss.on('connection', (ws, customerId) => {
  // Store the connection with customer ID
  clients.set(customerId, ws);

  // Send chat history to client when connected
  if (chatHistory.has(customerId)) {
    ws.send(JSON.stringify({
      type: 'history',
      messages: chatHistory.get(customerId)
    }));
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Store message in history
    if (!chatHistory.has(data.customerId)) {
      chatHistory.set(data.customerId, []);
    }
    chatHistory.get(data.customerId).push({
      sender: data.sender,
      content: data.content,
      timestamp: new Date()
    });

    // Send to specific customer
    const customerWs = clients.get(data.customerId);
    if (customerWs) {
      customerWs.send(JSON.stringify({
        type: 'message',
        message: {
          sender: data.sender,
          content: data.content,
          timestamp: new Date()
        }
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(customerId);
  });
});

// REST endpoints for chat management
router.get('/customers', async (req, res) => {
  try {
    // Mock data - replace with database query
    const customers = [
      { id: 1, name: 'คุณสมชาย', lastMessage: 'สวัสดีครับ', unread: 2 },
      { id: 2, name: 'คุณสมหญิง', lastMessage: 'รบกวนด้วยค่ะ', unread: 0 },
    ];
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.get('/history/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const history = chatHistory.get(parseInt(customerId)) || [];
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = { router, wss };