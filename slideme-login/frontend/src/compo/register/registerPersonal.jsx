import "./register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idCardNumber: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    address: "",
    idCardImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      idCardImage: e.target.files[0]
    }));
  };

  const handleNext = () => {
    // Add validation here
    navigate("/register-vehicle");
  };

  const handleBack = () => {
    const container = document.querySelector('.container-login');
    container.classList.add('slide-out');
    setTimeout(() => {
      navigate('/');
    }, 280);
  };

  return (
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
            className="input"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">นามสกุล: </label>
          <input
            type="text"
            name="lastName"
            placeholder="นามสกุล..."
            className="input"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">เลขบัตรประชาชน: </label>
          <input
            type="text"
            name="idCardNumber"
            placeholder="เลขบัตรประชาชน..."
            className="input"
            value={formData.idCardNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">วันเดือนปีเกิด: </label>
          <input
            type="date"
            name="birthDate"
            className="input"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">เบอร์โทรศัพท์: </label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="เบอร์โทรศัพท์..."
            className="input"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">อีเมล: </label>
          <input
            type="email"
            name="email"
            placeholder="อีเมล..."
            className="input"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">ที่อยู่ปัจจุบัน: </label>
          <textarea
            name="address"
            placeholder="ที่อยู่..."
            className="input"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">รูปถ่ายหน้าตรงพร้อมบัตรประชาชน: </label>
          <input
            type="file"
            name="idCardImage"
            accept="image/*"
            className="input"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      <button className="btn-login" onClick={handleNext} style={{ marginBottom: "10px" }}>
        <b>ถัดไป</b>
      </button>
    </div>
  );
}

export default Register;
