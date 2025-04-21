import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../Context/Context";
import "./Personal.css";

function RegisterDriverPersonal() {
  const { personalData, updatePersonalData } = useRegister();
  const [formData, setFormData] = useState(personalData);
  const navigate = useNavigate();

  useEffect(() => {
    // โหลดข้อมูลจาก localStorage ถ้ามี
    const savedData = localStorage.getItem('driverPersonalData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    updatePersonalData(newData); // อัพเดท context ทันที
  };

  const handleNext = async (e) => {
    e.preventDefault();
    
    try {
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
        const driverResponse = await fetch("http://localhost:3000/api/register/driver/personal", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!driverResponse.ok) {
          throw new Error(`HTTP error! status: ${driverResponse.status}`);
        }

        const driverResult = await driverResponse.json();

        if (driverResult.success) {
          localStorage.setItem('driverData', JSON.stringify(driverResult.data));
          localStorage.setItem('userToken', phoneResult.token);
          localStorage.setItem('userRole', 'driver');
          
          navigate("/register/driver/vehicle");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
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