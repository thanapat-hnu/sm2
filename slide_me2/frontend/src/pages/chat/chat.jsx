import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

const Chat = () => {
    const [activeTab, setActiveTab] = useState('chat');
    const [data, setData] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [notification, setNotification] = useState(null);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const wsRef = useRef(null);

    const notificationSound = new Audio('public/livechat-129007.mp3');

    const handleTabClick = (tab) => {
        setActiveTab(tab);

        if (tab === 'notification') {
            const notificationMessage = data.length > 0 ? `${data[0].providerName} has a new update!` : "No new notifications";
            setNotification(notificationMessage);

            notificationSound.play();

            setIsNotificationVisible(true);

            setTimeout(() => {
                setIsNotificationVisible(false);
                setNotification(null);
                setActiveTab('chat');
            }, 3000);
        } else {
            setNotification(null);
        }
    };

    useEffect(() => {
        // Change the fetch path to use the correct public URL
        fetch('/slide_me2/data.json')  // Updated to match your basename
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.error('Error loading JSON:', error);
                // Provide fallback data if JSON fails to load
                setData([{
                    providerName: "Default User",
                    lastMessage: "No messages yet",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            });
    }, []);

    useEffect(() => {
        // Add error handling for WebSocket connection
        try {
            wsRef.current = new WebSocket('ws://26.151.30.37:8080');

            wsRef.current.onopen = () => {
                console.log('Connected to WebSocket');
                const connectionMessage = {
                    type: 'connection',
                    user: 'admin'
                };
                wsRef.current.send(JSON.stringify(connectionMessage));
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                // Optionally show an error message to the user
            };

            wsRef.current.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.type === 'chat') {
                    setMessages(prev => [...prev, {
                        sender: receivedMessage.user,
                        text: receivedMessage.message,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                }
            };

            wsRef.current.onclose = () => {
                console.log('Disconnected from WebSocket');
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

    const handleSendMessage = () => {
        if (message.trim() && wsRef.current) {
            const messageData = {
                type: 'chat',
                user: 'admin',
                message: message.trim(),
                recipient: activeChat?.providerName || 'all',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            wsRef.current.send(JSON.stringify(messageData));

            setMessages(prev => [...prev, {
                sender: 'You',
                text: message.trim(),
                timestamp: messageData.timestamp
            }]);

            if (data) {
                const updatedData = data.map((chatItem) => {
                    if (chatItem.providerName === activeChat?.providerName) {
                        return {
                            ...chatItem,
                            lastMessage: message.trim(),
                            time: messageData.timestamp
                        };
                    }
                    return chatItem;
                });
                setData(updatedData);
            }

            setMessage('');
        }
    };

    const handleChatClick = (chatItem) => {
        setActiveChat(chatItem);
        setMessages([]);
    };

    const closePopup = () => {
        setActiveChat(null);
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-title">
                <strong>ข้อความ</strong>
            </div>

            <div className="chat-tabs">
                <button
                    className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => handleTabClick('chat')}
                >
                    แชท
                </button>
                <button
                    className={`tab-button ${activeTab === 'notification' ? 'active' : ''}`}
                    onClick={() => handleTabClick('notification')}
                >
                    การแจ้งเตือน
                </button>
            </div>

            {activeTab === 'notification' && isNotificationVisible && notification && (
                <div className="notification1-popup show">
                    <div className="notification1-header">
                        <img src="public/LOGO_main.png" alt="Logo" className="notification1-logo" />
                        <strong>การแจ้งเตือน</strong>
                        <button className="close-button" onClick={() => setNotification(null)}>X</button>
                    </div>
                    <div className="notification1-body">
                        <p>{notification}</p>
                    </div>
                </div>
            )}

            <div className="chat-list">
                {data.map((chatItem, index) => (
                    <div
                        key={index}
                        className="chat-box"
                        onClick={() => handleChatClick(chatItem)}
                    >
                        <div className="chat-avatar">
                            <img src='https://www.thaimediafund.or.th/wp-content/uploads/2024/04/blank-profile-picture-973460_1280.png' alt="avatar" className="avatar-icon" />
                        </div>
                        <div className="chat-details">
                            <div className="chat-header">
                                <span className="chat-name">{chatItem.providerName}</span>
                                <span className="chat-time">{chatItem.time}</span>
                            </div>
                            <div className="chat-message">{chatItem.lastMessage}</div>
                        </div>
                    </div>
                ))}
            </div>

            {activeChat && (
                <div className="chat-overlay">
                    <div className="chat-popup">
                        <div className="chat-popup-header">
                            <span className="chat-name">{activeChat.providerName}</span>
                            <button className="close-button" onClick={closePopup}>X</button>
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
                                placeholder="Type a message..."
                                className="chat-input"
                            />
                            <button onClick={handleSendMessage} className="send-button">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
