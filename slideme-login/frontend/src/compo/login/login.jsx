import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would normally make an API call to verify credentials
      // For now, just navigate to main page
      localStorage.setItem('user', JSON.stringify({ username: formData.username }));
      navigate('/main');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
      <button onClick={() => navigate('/')}>กลับ</button>
    </div>
  );
}

export default Login;