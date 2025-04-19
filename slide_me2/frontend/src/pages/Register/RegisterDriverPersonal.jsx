import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Personal.css"; // ใช้ Personal.css

function RegisterDriverPersonal() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idCard: "",
    birthDate: "",
    phone: "",
    email: "",
    address: "",
    idCardImage: null, // รูปบัตรประชาชน (null)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log("Driver Personal Data:", formData);
    navigate("/register/driver/vehicle"); // เปลี่ยนเส้นทางไปหน้า vehicle
  };

  return (
    <div className="Register-container">
      <div className="Register-title">
        <button className="back-btn" onClick={() => navigate(-1)}>⭠</button>
        สมัครสมาชิก (ข้อมูลส่วนตัว)
      </div>
      <form className="Register-form" onSubmit={handleNext}>
        <input
          type="text"
          name="firstName"
          placeholder="ชื่อ"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="นามสกุล"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="idCard"
          placeholder="รหัสบัตรประชาชน"
          value={formData.idCard}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthDate"
          placeholder="วันเกิด"
          value={formData.birthDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="เบอร์โทร"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="อีเมล"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="ที่อยู่"
          value={formData.address}
          onChange={handleChange}
        />
        <div className="Register-next">
          <button type="submit" className="btn-next">ถัดไป</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterDriverPersonal;