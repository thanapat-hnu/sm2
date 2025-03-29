import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    acceptTerms: false
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.username || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.phoneNumber) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    // Here you would typically make an API call to register the user
    console.log('Registration data:', formData);
    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      acceptTerms: false
    });
    setError('');
  };

  return (
    <motion.div
      className="register-container-RGT"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="register-card-RGT">
        <h2 className="register-title-RGT">Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form-RGT">
          {error && <div className="error-message-RGT">{error}</div>}
          
          <div className="form-group-RGT">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="terms-group-RGT">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              id="terms"
              className="checkbox-RGT"
            />
            <label htmlFor="terms" className="terms-label-RGT">
              I accept the terms and conditions
            </label>
          </div>

          <button type="submit" className="register-button-RGT">
            Register
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="back-button-RGT"
          >
            Back to Start
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;