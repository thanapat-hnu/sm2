const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Mock data for testing
const mockCustomers = [
  { 
    id: 1, 
    name: 'คุณสมชาย', 
    lastMessage: 'สวัสดีครับ ผมต้องการความช่วยเหลือ', 
    unread: 2,
    status: 'online',
    timestamp: new Date()
  },
  { 
    id: 2, 
    name: 'คุณสมหญิง', 
    lastMessage: 'รบกวนช่วยรับของด้วยค่ะ', 
    unread: 0,
    status: 'offline',
    timestamp: new Date()
  }
];

const mockChatHistory = {
  1: [
    {
      sender: 'customer',
      content: 'สวัสดีครับ ผมต้องการความช่วยเหลือ',
      timestamp: new Date()
    }
  ],
  2: [
    {
      sender: 'customer',
      content: 'รบกวนช่วยรับของด้วยค่ะ',
      timestamp: new Date()
    }
  ]
};

// Store active connections
const clients = new Map();

// Handle WebSocket connection
wss.on('connection', (ws, customerId) => {
  // Store the connection with customer ID
  clients.set(customerId, ws);

  // Send chat history to client when connected
  if (mockChatHistory[customerId]) {
    ws.send(JSON.stringify({
      type: 'history',
      messages: mockChatHistory[customerId]
    }));
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Store message in history
    if (!mockChatHistory[data.customerId]) {
      mockChatHistory[data.customerId] = [];
    }
    mockChatHistory[data.customerId].push({
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

// API endpoints
router.get('/customers', (req, res) => {
  res.json(mockCustomers);
});

router.get('/customers/:customerId', (req, res) => {
  const customer = mockCustomers.find(c => c.id === parseInt(req.params.customerId));
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

router.get('/history/:customerId', (req, res) => {
  const history = mockChatHistory[req.params.customerId] || [];
  res.json(history);
});

module.exports = { router, wss };