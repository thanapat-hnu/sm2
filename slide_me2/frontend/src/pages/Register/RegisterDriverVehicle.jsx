import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../Context/Context";
import "./Vehicle.css";

function RegisterDriverVehicle() {
  const { vehicleData, updateVehicleData } = useRegister();
  const [formData, setFormData] = useState(vehicleData);
  const navigate = useNavigate();

  useEffect(() => {
    // โหลดข้อมูลจาก localStorage
    const savedVehicleData = localStorage.getItem('driverVehicleData');
    const driverData = localStorage.getItem('driverData');

    if (!driverData) {
      alert('กรุณาลงทะเบียนข้อมูลส่วนตัวก่อน');
      navigate('/register/driver/personal');
      return;
    }

    if (savedVehicleData) {
      setFormData(JSON.parse(savedVehicleData));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    updateVehicleData(newData);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleType || !formData.licenseNumber || !formData.carPlate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const driverData = JSON.parse(localStorage.getItem('driverData'));
      
      const response = await fetch('http://localhost:3000/api/register/driver/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          driverPersonalId: driverData.id,
          submitDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('vehicleData', JSON.stringify(result.data));
        navigate("/driver/home");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  return (
    <div className="Register-container">
      <div className="Register-title">
        <button className="back-btn" onClick={() => navigate(-1)}>⭠</button>
        สมัครสมาชิก (ข้อมูลรถ)
      </div>
      <form className="Register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="vehicleType"
          placeholder="ประเภทรถ"
          value={formData.vehicleType}
          onChange={handleChange}
        />
        <input
          type="text"
          name="licenseNumber"
          placeholder="ใบขับขี่"
          value={formData.licenseNumber}
          onChange={handleChange}
        />
        <input
          type="date"
          name="licenseExpiry"
          placeholder="วันหมดอายุ"
          value={formData.licenseExpiry}
          onChange={handleChange}
        />
        <input
          type="text"
          name="carBrand"
          placeholder="ยี่ห้อรถ"
          value={formData.carBrand}
          onChange={handleChange}
        />
        <input
          type="text"
          name="carPlate"
          placeholder="ทะเบียนรถ"
          value={formData.carPlate}
          onChange={handleChange}
        />
        <div className="Register-next">
          <button type="submit" className="btn-next">ลงทะเบียน</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterDriverVehicle;