import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    console.log('Login data:', formData);
    setFormData({
      email: '',
      password: ''
    });
    setError('');
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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