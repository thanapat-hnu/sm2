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
    firstname: '',
    lastname: '',
    gender: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.phoneNumber ||
        !formData.firstname || !formData.lastname || !formData.gender) {
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

    try {
      const response = await fetch('http://localhost:3000/drivers/register', {  // เปลี่ยนจาก 5000 เป็น 3000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phoneNumber,
          gender: formData.gender
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Registration successful
        navigate('/login'); // หรือไปยังหน้าที่ต้องการ
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
    }
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

          <div className="form-group-RGT">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="input-field-RGT"
            />
          </div>

          <div className="form-group-RGT">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field-RGT"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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