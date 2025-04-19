import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const wsRef = useRef(null);

    // เชื่อมต่อ WebSocket เมื่อ component mount
    useEffect(() => {
        try {
            wsRef.current = new WebSocket('ws://26.151.30.37:8080');

            wsRef.current.onopen = () => {
                console.log('Connected to chat server');
                // ส่งข้อมูลเริ่มต้นระบุว่าเป็น Customer
                const connectionMessage = {
                    type: 'connection',
                    user: 'Customer'
                };
                wsRef.current.send(JSON.stringify(connectionMessage));
            };

            wsRef.current.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.type === 'chat') {
                    setMessages(prev => [...prev, {
                        sender: receivedMessage.user === 'Customer' ? 'You' : receivedMessage.user,
                        text: receivedMessage.message,
                        timestamp: receivedMessage.timestamp
                    }]);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            wsRef.current.onclose = () => {
                console.log('Disconnected from chat server');
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // ส่งข้อความ
    const handleSendMessage = () => {
        if (message.trim() && wsRef.current) {
            const messageData = {
                type: 'chat',
                user: 'Customer',
                message: message.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            wsRef.current.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    // จัดการกด Enter เพื่อส่งข้อความ
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-title">
                <strong>Live Chat Support</strong>
            </div>

            <div className="chat-popup">
                <div className="chat-popup-header">
                    <span className="chat-name">Customer Support</span>
                </div>
                <div className="chat-popup-body">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender === 'You' ? 'chat-message-you' : 'chat-message'}>
                            <span className="message-time">{msg.timestamp}</span>
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-popup-footer">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="พิมพ์ข้อความของคุณ..."
                        className="chat-input"
                    />
                    <button onClick={handleSendMessage} className="send-button">
                        ส่ง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
