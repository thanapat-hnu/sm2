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

  const handleNext = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.firstName || !formData.lastName || !formData.idCard || !formData.phone) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      // Step 1: ลงทะเบียนข้อมูลส่วนตัว
      const personalResponse = await fetch("http://localhost:3000/api/register/driver/personal", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!personalResponse.ok) {
        throw new Error(`HTTP error! status: ${personalResponse.status}`);
      }

      const personalResult = await personalResponse.json();

      if (personalResult.success) {
        // Step 2: ลงทะเบียนเบอร์โทรและ role
        const phoneResponse = await fetch("http://localhost:3000/api/insert-phone", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: formData.phone,
            role: 'driver'
          }),
        });

        if (!phoneResponse.ok) {
          throw new Error(`HTTP error! status: ${phoneResponse.status}`);
        }

        const phoneResult = await phoneResponse.json();
        
        if (phoneResult.success) {
          // บันทึกข้อมูลใน localStorage
          localStorage.setItem('driverData', JSON.stringify({
            ...formData,
            role: 'driver',
            personalId: personalResult.data.id
          }));
          
          navigate("/register/driver/vehicle");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    }
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