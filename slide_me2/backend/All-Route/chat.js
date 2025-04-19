import WebSocket, { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();
const chatflowPath = path.join(__dirname, '../chatflow.json');

// อ่านข้อความทั้งหมด
const readChatFlow = () => {
  if (!fs.existsSync(chatflowPath)) {
    fs.writeFileSync(chatflowPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(chatflowPath, 'utf-8'));
};

// เขียนข้อความใหม่
const writeChatFlow = (messages) => {
  fs.writeFileSync(chatflowPath, JSON.stringify(messages, null, 2));
};

// ส่งข้อความให้ทุก client
const broadcastMessage = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // ลงทะเบียน client
      if (data.type === 'register') {
        clients.set(data.username, ws);
        console.log(`${data.username} registered`);
        
        // ส่งประวัติข้อความให้ client ใหม่
        const chatHistory = readChatFlow();
        ws.send(JSON.stringify({
          type: 'history',
          messages: chatHistory
        }));
        return;
      }

      // จัดการข้อความแชท
      if (data.type === 'message') {
        const chatMessage = {
          sender: data.from,
          recipient: data.to,
          message: data.message,
          timestamp: new Date().toLocaleTimeString()
        };

        // บันทึกข้อความใหม่
        const messages = readChatFlow();
        messages.push(chatMessage);
        writeChatFlow(messages);

        // ส่งข้อความให้ทุก client
        broadcastMessage({
          type: 'newMessage',
          message: chatMessage
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    [...clients.entries()].forEach(([username, client]) => {
      if (client === ws) {
        clients.delete(username);
      }
    });
  });
});

console.log('WebSocket server running on ws://localhost:8080');