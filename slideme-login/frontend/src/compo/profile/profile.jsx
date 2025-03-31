import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',  // เพิ่ม username เพื่อใช้ในการอ้างอิง
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    profileImage: null
  });

  const [orderHistory] = useState([
    { id: '1', date: '2024-03-29', status: 'Delivered', total: '฿250' },
    { id: '2', date: '2024-03-28', status: 'In Transit', total: '฿180' },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:3000/drivers/select`);
        const data = await response.json();
        
        // หาข้อมูล user ที่ตรงกับ username ที่ login
        const userData = data.find(driver => driver.username === user.username);
        
        if (userData) {
          setUserData({
            username: userData.username,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone,
            gender: userData.gender,
            profileImage: null
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.profile-header-PRF');
      const scrollPosition = window.scrollY;
      const triggerPoint = 100; // จุดที่จะเริ่ม animation

      if (scrollPosition > triggerPoint) {
        const opacity = Math.max(0, 1 - ((scrollPosition - triggerPoint) / 100));
        const scale = Math.max(0.7, 1 - ((scrollPosition - triggerPoint) / 200));
        
        header.style.opacity = opacity;
        header.style.transform = `scaleY(${scale}) translateY(${-20 * (1-scale)}px)`;
        
        if (opacity < 0.1) {
          header.classList.add('shrink');
        }
      } else {
        header.style.opacity = 1;
        header.style.transform = 'scaleY(1) translateY(0)';
        header.classList.remove('shrink');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const handleUpdate = async () => {
    try {
      // เพิ่ม validation
      if (!userData.firstname || !userData.lastname || !userData.email || 
          !userData.phone || !userData.gender) {
        alert('Please fill in all fields');
        return;
      }

      const response = await fetch(`http://localhost:3000/drivers/update/${userData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          phone: userData.phone,
          gender: userData.gender
        })
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-container-PRF">
        <motion.div 
            className="profile-header-PRF"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <motion.div 
            className="profile-content-PRF"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="profile-wrapper-PRF">
              <section className="profile-section-PRF">
                <h2 className="section-title-PRF">Personal Information</h2>
                <div className="info-list-PRF">
                  {/* Username field - read only */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">Username</span>
                    <span className="info-value-PRF">{userData.username}</span>
                  </div>

                  {/* First Name field */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">First Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.firstname}
                        onChange={(e) => setUserData({...userData, firstname: e.target.value})}
                        className="info-input-PRF"
                      />
                    ) : (
                      <span className="info-value-PRF">{userData.firstname}</span>
                    )}
                  </div>

                  {/* Last Name field */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">Last Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.lastname}
                        onChange={(e) => setUserData({...userData, lastname: e.target.value})}
                        className="info-input-PRF"
                      />
                    ) : (
                      <span className="info-value-PRF">{userData.lastname}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">Email</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="info-input-PRF"
                      />
                    ) : (
                      <span className="info-value-PRF">{userData.email}</span>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">Phone</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="info-input-PRF"
                      />
                    ) : (
                      <span className="info-value-PRF">{userData.phone}</span>
                    )}
                  </div>

                  {/* Gender field */}
                  <div className="info-item-PRF">
                    <span className="info-label-PRF">Gender</span>
                    {isEditing ? (
                      <select
                        value={userData.gender}
                        onChange={(e) => setUserData({...userData, gender: e.target.value})}
                        className="info-input-PRF"
                      >
                        <option value="">Select Gender</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    ) : (
                      <span className="info-value-PRF">{userData.gender}</span>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="edit-buttons-PRF">
                    <button onClick={handleUpdate} className="save-button-PRF">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-button-PRF">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="edit-button-PRF">Edit Profile</button>
                )}
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
        </motion.div>
    </div>
  );
};

export default Profile;