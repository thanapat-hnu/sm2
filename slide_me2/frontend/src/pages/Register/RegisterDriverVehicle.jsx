import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vehicle.css";

function RegisterDriverVehicle() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    licenseNumber: "",
    licenseExpiry: "",
    licenseImage: null,
    carBrand: "",
    carPlate: "",
    carImage: null,
    carRegistrationImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.vehicleType || !formData.licenseNumber || !formData.carPlate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // ดึงข้อมูล driver จาก localStorage
      const driverData = JSON.parse(localStorage.getItem('driverData'));
      
      if (!driverData || !driverData.personalId) {
        throw new Error('ไม่พบข้อมูลคนขับ กรุณาลงทะเบียนข้อมูลส่วนตัวก่อน');
      }

      const response = await fetch('http://localhost:3000/api/register/driver/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          driverPersonalId: driverData.personalId, // เชื่อมโยงกับข้อมูลส่วนตัว
          submitDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('ลงทะเบียนสำเร็จ');
        // อัพเดทข้อมูลใน localStorage
        localStorage.setItem('vehicleData', JSON.stringify({
          ...result.data,
          driverPersonalId: driverData.personalId
        }));
        navigate("/driver/home"); // นำทางไปหน้า driver
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