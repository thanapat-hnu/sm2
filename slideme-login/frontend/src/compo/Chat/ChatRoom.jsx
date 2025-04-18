import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatRoom.css';

function ChatRoom() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [customer, setCustomer] = useState(null);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCustomerDetails();
    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [customerId]);

  const connectWebSocket = () => {
    const wsClient = new WebSocket(`ws://localhost:3000/chat/${customerId}`);
    
    wsClient.onopen = () => {
      console.log('WebSocket Connected');
    };

    wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prevMessages => [...prevMessages, data.message]);
        scrollToBottom();
      } else if (data.type === 'history') {
        setMessages(data.messages);
        scrollToBottom();
      }
    };

    wsClient.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    wsClient.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    setWs(wsClient);
  };

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/chat/customers/${customerId}`);
      const data = await response.json();
      setCustomer(data);
      
      const historyResponse = await fetch(`/api/chat/history/${customerId}`);
      const history = await historyResponse.json();
      setMessages(history);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws) return;

    const message = {
      customerId,
      sender: 'driver',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      ws.send(JSON.stringify(message));
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      connectWebSocket();
    }
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  if (!customer) return null;

  return (
    <div className="chat-room-container">
      <div className="chat-room-header">
        <button className="back-button" onClick={() => navigate('/chat')}>
          <box-icon name='arrow-back' color="#333"></box-icon>
        </button>
        <div className="chat-room-customer">
          <div className="chat-room-avatar">
            <span>{customer.name[0]}</span>
          </div>
          <div className="chat-room-info">
            <h3>{customer.name}</h3>
            <span className="chat-room-status">ออนไลน์</span>
          </div>
        </div>
      </div>

      <div className="messages-wrapper">
        <div className="chat-room-messages">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`chat-message ${message.sender === 'driver' ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={sendMessage} className="chat-room-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            disabled={!ws || ws.readyState !== WebSocket.OPEN}
          />
          <button 
            type="submit"
            disabled={!ws || ws.readyState !== WebSocket.OPEN}
          >
            <box-icon name='send' color="#fff"></box-icon>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;