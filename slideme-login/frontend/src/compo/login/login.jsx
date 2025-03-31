import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  // เปลี่ยนจาก email เป็น username
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {  // เปลี่ยนเงื่อนไขการตรวจสอบ
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/drivers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,  // ใช้ username แทน email
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          username: formData.username  // เก็บ username ลง localStorage
        }));
        navigate('/profile');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  };

  return (
    <motion.div
      className="login-container-LOG"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div 
        className="logo-container-LOG"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="logo-text-LOG">LOGO</span>
      </motion.div>

      <motion.div 
        className="login-card-LOG"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="login-title-LOG">Login</h2>
        <p className="login-subtitle-LOG">Welcome back!</p>

        <form onSubmit={handleSubmit} className="login-form-LOG">
          {error && <div className="error-message-LOG">{error}</div>}
          
          <div className="form-group-LOG">
            <input
              type="text" // เปลี่ยนจาก email เป็น text
              name="username" // เปลี่ยนชื่อ field
              placeholder="Username" // เปลี่ยน placeholder
              value={formData.username} // เปลี่ยนตัวแปรที่ใช้
              onChange={handleChange}
              className="input-field-LOG"
            />
          </div>

          <div className="form-group-LOG">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field-LOG"
            />
          </div>

          <button type="submit" className="login-button-LOG">
            Login
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="back-button-LOG"
          >
            Back to Start
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;