import "./register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licenseType: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    licenseImage: null,
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    plateNumber: "",
    vehicleImage: null,
    plateImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const { name } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.files[0]
    }));
  };

  const handleSubmit = () => {
    // Add validation and API call here
    console.log(formData);
  };

  const handleBack = () => {
    const container = document.querySelector('.container-login');
    container.classList.add('slide-out');
    setTimeout(() => {
      navigate('/register');
    }, 280);
  };

  return (
    <div className="container-login">
      <div className="formReg">
        <div className="header-container">
          <button className="btn-back" onClick={handleBack}>
            <b>＜ กลับ</b>
          </button>
          <h1>ข้อมูลพาหนะ</h1>
        </div>
        
        <div className="coolinput">
          <label className="text">ประเภทใบขับขี่: </label>
          <select
            name="licenseType"
            className="input"
            value={formData.licenseType}
            onChange={handleInputChange}
          >
            <option value="">เลือกประเภทใบขับขี่</option>
            <option value="motorcycle">รถจักรยานยนต์</option>
            <option value="car">รถยนต์</option>
          </select>
        </div>

        <div className="coolinput">
          <label className="text">หมายเลขใบขับขี่: </label>
          <input
            type="text"
            name="licenseNumber"
            placeholder="หมายเลขใบขับขี่..."
            className="input"
            value={formData.licenseNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">วันหมดอายุใบขับขี่: </label>
          <input
            type="date"
            name="licenseExpiryDate"
            className="input"
            value={formData.licenseExpiryDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">รูปใบขับขี่: </label>
          <input
            type="file"
            name="licenseImage"
            accept="image/*"
            className="input"
            onChange={handleFileUpload}
          />
        </div>

        <div className="coolinput">
          <label className="text">ประเภทพาหนะ: </label>
          <select
            name="vehicleType"
            className="input"
            value={formData.vehicleType}
            onChange={handleInputChange}
          >
            <option value="">เลือกประเภทพาหนะ</option>
            <option value="motorcycle">รถจักรยานยนต์</option>
            <option value="car">รถยนต์</option>
          </select>
        </div>

        <div className="coolinput">
          <label className="text">ยี่ห้อรถ: </label>
          <input
            type="text"
            name="vehicleBrand"
            placeholder="ยี่ห้อรถ..."
            className="input"
            value={formData.vehicleBrand}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">รุ่นรถ: </label>
          <input
            type="text"
            name="vehicleModel"
            placeholder="รุ่นรถ..."
            className="input"
            value={formData.vehicleModel}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">ทะเบียนรถ: </label>
          <input
            type="text"
            name="plateNumber"
            placeholder="ทะเบียนรถ..."
            className="input"
            value={formData.plateNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="coolinput">
          <label className="text">รูปถ่ายรถ: </label>
          <input
            type="file"
            name="vehicleImage"
            accept="image/*"
            className="input"
            onChange={handleFileUpload}
          />
        </div>

        <div className="coolinput">
          <label className="text">รูปถ่ายทะเบียนรถ: </label>
          <input
            type="file"
            name="plateImage"
            accept="image/*"
            className="input"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      <button className="btn-login" onClick={handleSubmit} style={{ marginBottom: "10px" }}>
        <b>ลงทะเบียน</b>
      </button>
    </div>
  );
}

export default RegisterVehicle;