import { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const connectWebSocket = () => {
    const wsClient = new WebSocket('ws://localhost:3000/chat');
    
    wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      } else if (data.type === 'history') {
        setMessages(data.messages);
      }
    };

    setWs(wsClient);
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/chat/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const response = await fetch(`/api/chat/history/${customer.id}`);
      const history = await response.json();
      setMessages(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer || !ws) return;

    const message = {
      customerId: selectedCustomer.id,
      sender: 'driver',
      content: newMessage
    };

    ws.send(JSON.stringify(message));
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-container">
      <div className="customers-list">
        <div className="customers-header">
          <h2>แชท</h2>
        </div>
        {customers.map(customer => (
          <div
            key={customer.id}
            className={`customer-item ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
            onClick={() => selectCustomer(customer)}
          >
            <div className="customer-avatar">{customer.name[0]}</div>
            <div className="customer-info">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-last-message">{customer.lastMessage}</div>
            </div>
            {customer.unread > 0 && (
              <div className="unread-badge">{customer.unread}</div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-content">
        {selectedCustomer ? (
          <>
            <div className="chat-header">
              <h3>{selectedCustomer.name}</h3>
            </div>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === 'driver' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
              />
              <button type="submit">ส่ง</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            เลือกลูกค้าเพื่อเริ่มแชท
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;