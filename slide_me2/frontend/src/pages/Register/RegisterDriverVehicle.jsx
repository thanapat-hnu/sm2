import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vehicle.css"; // ใช้ Vehicle.css

function RegisterDriverVehicle() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    licenseNumber: "",
    licenseExpiry: "",
    licenseImage: null, // รูปใบขับขี่ (null)
    carBrand: "",
    carPlate: "",
    carImage: null, // รูปรถ (null)
    carRegistrationImage: null, // รูปทะเบียนรถ (null)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Driver Vehicle Data:", formData);
    navigate("/home"); // เปลี่ยนเส้นทางไปหน้า home หลังลงทะเบียนเสร็จ
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