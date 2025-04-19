import React, { useState } from 'react';
import './chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // ส่งข้อความ (local)
    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                sender: 'You',
                text: message.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, messageData]);
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
