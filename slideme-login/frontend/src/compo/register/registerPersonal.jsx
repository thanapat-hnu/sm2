import "./register.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RegistrationContext } from "../../context/RegistrationContext";
import { useState } from "react";
import PageTransition from "../../components/PageTransition";

function Register() {
  const navigate = useNavigate();
  const { personalData, setPersonalData } = useContext(RegistrationContext);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setPersonalData(prev => ({
      ...prev,
      idCardImage: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!personalData.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อจริง";
    }
    
    if (!personalData.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    }
    
    if (!personalData.idCardNumber.trim()) {
      newErrors.idCardNumber = "กรุณากรอกเลขบัตรประชาชน";
    } else if (!/^\d{13}$/.test(personalData.idCardNumber)) {
      newErrors.idCardNumber = "เลขบัตรประชาชนต้องมี 13 หลัก";
    }
    
    if (!personalData.birthDate) {
      newErrors.birthDate = "กรุณาเลือกวันเกิด";
    }
    
    if (!personalData.phoneNumber.trim()) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(personalData.phoneNumber)) {
      newErrors.phoneNumber = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }
    
    if (!personalData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(personalData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    
    if (!personalData.address.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่";
    }
    
    if (!personalData.idCardImage) {
      newErrors.idCardImage = "กรุณาอัพโหลดรูปบัตรประชาชน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const container = document.querySelector('.container-login');
      container.classList.add('slide-out');
      setTimeout(() => {
        navigate('/register-vehicle');
      }, 280);
    } else {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    const container = document.querySelector('.container-login');
    container.classList.add('slide-out');
    setTimeout(() => {
      navigate('/');
    }, 280);
  };

  return (
    <PageTransition>
      <div className="container-login">
        <div className="formReg">
          <div className="header-container">
            <button className="btn-back" onClick={handleBack}>
              <b>＜ กลับ</b>
            </button>
            <h1>สมัครสมาชิก</h1>
          </div>
          
          <div className="coolinput">
            <label className="text">ชื่อจริง: </label>
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อจริง..."
              className={`input ${errors.firstName ? 'error' : ''}`}
              value={personalData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="coolinput">
            <label className="text">นามสกุล: </label>
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล..."
              className={`input ${errors.lastName ? 'error' : ''}`}
              value={personalData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          <div className="coolinput">
            <label className="text">เลขบัตรประชาชน: </label>
            <input
              type="text"
              name="idCardNumber"
              placeholder="เลขบัตรประชาชน..."
              className={`input ${errors.idCardNumber ? 'error' : ''}`}
              value={personalData.idCardNumber}
              onChange={handleInputChange}
            />
            {errors.idCardNumber && <span className="error-message">{errors.idCardNumber}</span>}
          </div>

          <div className="coolinput">
            <label className="text">วันเดือนปีเกิด: </label>
            <input
              type="date"
              name="birthDate"
              className={`input ${errors.birthDate ? 'error' : ''}`}
              value={personalData.birthDate}
              onChange={handleInputChange}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="coolinput">
            <label className="text">เบอร์โทรศัพท์: </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="เบอร์โทรศัพท์..."
              className={`input ${errors.phoneNumber ? 'error' : ''}`}
              value={personalData.phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <div className="coolinput">
            <label className="text">อีเมล: </label>
            <input
              type="email"
              name="email"
              placeholder="อีเมล..."
              className={`input ${errors.email ? 'error' : ''}`}
              value={personalData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="coolinput">
            <label className="text">ที่อยู่ปัจจุบัน: </label>
            <textarea
              name="address"
              placeholder="ที่อยู่..."
              className={`input ${errors.address ? 'error' : ''}`}
              value={personalData.address}
              onChange={handleInputChange}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="coolinput">
            <label className="text">รูปถ่ายหน้าตรงพร้อมบัตรประชาชน: </label>
            <input
              type="file"
              name="idCardImage"
              accept="image/*"
              className={`input ${errors.idCardImage ? 'error' : ''}`}
              onChange={handleFileUpload}
            />
            {errors.idCardImage && <span className="error-message">{errors.idCardImage}</span>}
          </div>
        </div>
        
        <button className="btn-login" onClick={handleNext} style={{ marginBottom: "10px" }}>
          <b>ถัดไป</b>
        </button>
      </div>
    </PageTransition>
  );
}

export default Register;
