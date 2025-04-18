import { useState, useEffect } from 'react';
import NavOrder from './NavOrder';
import './Order.css';

function OrderProcess() {
  const [activeTab, setActiveTab] = useState('process');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const fetchOrders = async (status) => {
    try {
      const response = await fetch(`/api/orders?status=${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setLoading(true);
  };

  const handleOrderAction = (orderId, action) => {
    console.log(`Order ${orderId} action: ${action}`);
    // Implement action handling logic here
  };

  return (
    <div className="orders-container">
      <NavOrder activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Add padding-top to account for fixed NavOrder */}
      <div className="orders-content">
        {loading ? (
          <div className="loading-indicator">กำลังโหลด...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-orders">ไม่มีงานที่รับในขณะนี้</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">คำสั่งที่ #{order.id}</span>
                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <div className="location-info">
                      <div className="pickup">
                        <label>จุดรับ:</label>
                        <p>{order.pickupLocation}</p>
                      </div>
                      <div className="delivery">
                        <label>จุดส่ง:</label>
                        <p>{order.deliveryLocation}</p>
                      </div>
                    </div>
                    
                    <div className="customer-info">
                      <label>ลูกค้า:</label>
                      <p>{order.customerName}</p>
                      <p>{order.customerPhone}</p>
                    </div>

                    <div className="price-info">
                      <span className="price">{order.price} บาท</span>
                      <span className="distance">{order.distance} กม.</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button 
                      className="action-button primary"
                      onClick={() => handleOrderAction(order.id, 'accept')}
                    >
                      ยอมรับงาน
                    </button>
                    <button 
                      className="action-button secondary"
                      onClick={() => handleOrderAction(order.id, 'reject')}
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderProcess;