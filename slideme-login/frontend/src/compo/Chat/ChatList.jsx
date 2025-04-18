import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatList.css';

function ChatList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch mock data
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/chat/customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="chat-list-loading">กำลังโหลด...</div>;
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>การสนทนา</h2>
      </div>
      <div className="chat-list-content">
        {customers.length === 0 ? (
          <div className="chat-list-empty">ไม่มีการสนทนา</div>
        ) : (
          customers.map(customer => (
            <div
              key={customer.id}
              className="chat-list-item"
              onClick={() => navigate(`/chat/${customer.id}`)}
            >
              <div className="chat-list-avatar">
                <span>{customer.name[0]}</span>
              </div>
              <div className="chat-list-info">
                <div className="chat-list-primary">
                  <span className="chat-list-name">{customer.name}</span>
                  <span className="chat-list-time">
                    {new Date(customer.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="chat-list-secondary">
                  <span className="chat-list-message">{customer.lastMessage}</span>
                  {customer.unread > 0 && (
                    <span className="chat-list-badge">{customer.unread}</span>
                  )}
                </div>
                <span className={`chat-list-status ${customer.status}`}>
                  {customer.status === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList;