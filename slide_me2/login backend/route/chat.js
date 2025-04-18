const WebSocket = require('ws');
const server = new WebSocket.Server({ 
    port: 8080,
    // Add CORS headers
    verifyClient: (info, cb) => {
        cb(true, 200, 'Accepted');
    }
});

const clients = new Map();

server.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Handle initial connection
        if (data.type === 'connection') {
            clients.set(data.user, ws);
            console.log(`${data.user} connected`);
            return;
        }

        // Handle chat messages
        if (data.type === 'chat') {
            // Broadcast message to all clients
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'chat',
                        user: data.user,
                        message: data.message,
                        timestamp: data.timestamp
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        // Remove client from clients map
        for (const [user, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(user);
                console.log(`${user} disconnected`);
                break;
            }
        }
    });
});

console.log('WebSocket server is running on port 8080');