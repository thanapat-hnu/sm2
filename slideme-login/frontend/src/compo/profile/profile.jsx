import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+66 123456789',
    address: '123 Bangkok Street',
    profileImage: null
  });

  const [orderHistory] = useState([
    { id: '1', date: '2024-03-29', status: 'Delivered', total: '฿250' },
    { id: '2', date: '2024-03-28', status: 'In Transit', total: '฿180' },
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({...prev, profileImage: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="profile-container-PRF"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-wrapper-PRF">
        <div className="profile-header-PRF">
          <div className="profile-image-container-PRF">
            <img 
              src={userData.profileImage || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image-PRF"
            />
            <label className="image-upload-label-PRF">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="image-upload-input-PRF"
              />
              <span>Edit</span>
            </label>
          </div>
          <h1 className="profile-name-PRF">{userData.name}</h1>
        </div>

        <div className="profile-content-PRF">
          <section className="profile-section-PRF">
            <h2 className="section-title-PRF">Personal Information</h2>
            <div className="info-list-PRF">
              <div className="info-item-PRF">
                <span className="info-label-PRF">Email</span>
                <span className="info-value-PRF">{userData.email}</span>
              </div>
              <div className="info-item-PRF">
                <span className="info-label-PRF">Phone</span>
                <span className="info-value-PRF">{userData.phone}</span>
              </div>
              <div className="info-item-PRF">
                <span className="info-label-PRF">Delivery Address</span>
                <span className="info-value-PRF">{userData.address}</span>
              </div>
            </div>
          </section>

          <section className="profile-section-PRF">
            <h2 className="section-title-PRF">Recent Orders</h2>
            <div className="orders-list-PRF">
              {orderHistory.map(order => (
                <div key={order.id} className="order-item-PRF">
                  <div className="order-header-PRF">
                    <span className="order-id-PRF">Order #{order.id}</span>
                    <span className="order-status-PRF">{order.status}</span>
                  </div>
                  <div className="order-details-PRF">
                    <span className="order-date-PRF">{order.date}</span>
                    <span className="order-total-PRF">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={() => navigate('/')} 
            className="logout-button-PRF"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;