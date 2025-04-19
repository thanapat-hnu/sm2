import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ 
    port: 8080,
    host: '26.151.30.37',
    verifyClient: (info, cb) => {
        cb(true, 200, 'Accepted');
    }
});

const clients = new Map();

server.on('connection', (ws) => {
    console.log('New customer connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Handle initial connection
            if (data.type === 'connection') {
                clients.set('Customer', ws); // Fixed username as Customer
                console.log('Customer connected');
                return;
            }

            // Handle chat messages
            if (data.type === 'chat') {
                const messageData = {
                    type: 'chat',
                    user: 'Customer', // Always send as Customer
                    message: data.message,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                // Broadcast message to all clients
                clients.forEach((client) => {
                    if (client.readyState === WebSocketServer.OPEN) {
                        client.send(JSON.stringify(messageData));
                    }
                });
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        if (clients.get('Customer') === ws) {
            clients.delete('Customer');
            console.log('Customer disconnected');
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server running at ws://26.151.30.37:8080');