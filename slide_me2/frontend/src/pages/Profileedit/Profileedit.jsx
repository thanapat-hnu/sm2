import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Profileedit.css";

function Profileedit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileImage, setProfileImage] = useState("./img/profile.png");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    role: "",
    status: "",
    idCard: "",
    birthDate: "",
    address: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem('userData');
        if (!savedUserData) {
          throw new Error('ไม่พบข้อมูลผู้ใช้');
        }

        const userData = JSON.parse(savedUserData);
        setFormData(userData);
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
        setLoading(false);

      } catch (err) {
        console.error("Error loading user data:", err);
        setError(err.message);
        localStorage.clear();
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phoneNumber: formData.phoneNumber,
          updatedAt: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        // อัพเดท localStorage ด้วยข้อมูลใหม่
        localStorage.setItem('userData', JSON.stringify({
          ...result.user,
          token: localStorage.getItem('userToken'),
          role: formData.role
        }));
        alert("อัพเดทข้อมูลสำเร็จ");
      } else {
        alert(result.message || "ไม่สามารถอัพเดทข้อมูลได้");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?");
    if (!confirmDelete) return;

    try {
      const res = await axios.post("http://localhost:3000/api/delete-user", {
        phone: formData.phoneNumber,
      });

      if (res.data.success) {
        alert("ลบบัญชีเรียบร้อยแล้ว");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(res.data.message || "ไม่สามารถลบบัญชีได้");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("เกิดข้อผิดพลาดขณะลบบัญชี");
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profileedit-container">
      <div className="profileedit-banner">
        <div className="profileedit-welcome">สวัสดี คุณ {formData.firstName}</div>

        <div className="profile-containers">
          <label htmlFor="uploadImage">
            <img src={profileImage} alt="Profile" className="profile-button" />
          </label>
          <input
            type="file"
            accept="image/*"
            id="uploadImage"
            style={{ display: "none" }}
            onChange={handleImageChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profileedit-edit">
          <button className="profileedit-button" onClick={handleEdit}>
            <img src="./img/pencil.png" alt="" />
          </button>
        </div>
      </div>

      <div className="form-containers">
        <div className="form-name">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="ชื่อ"
          />
        </div>

        <div className="form-lastname">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="นามสกุล"
          />
        </div>

        <div className="form-numbercountry">
          <input type="text" id="country" value="+66" readOnly />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div className="form-email">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
            placeholder="อีเมล"
          />
        </div>

        <div className="form-sex">
          <select
            className="form-selects"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="" disabled>
              เลือกเพศ
            </option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
        </div>

        {formData.role === "driver" && (
          <>
            <div className="form-idcard">
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="เลขบัตรประชาชน"
              />
            </div>

            <div className="form-birthdate">
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-address">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="ที่อยู่"
              />
            </div>
          </>
        )}

        <div className="profileedit-role">
          สถานะ: {formData.role === "driver" ? "ผู้ให้บริการ" : "ผู้ใช้บริการ"}
        </div>

        {isEditing && (
          <div className="form-summit">
            <button className="btn-summit" onClick={handleSave}>
              บันทึก
            </button>
          </div>
        )}

        <div className="form-logout">
          <button onClick={handleLogout}>ออกจากระบบ</button>
        </div>

        <div className="form-delete">
          <button className="btn-delete" onClick={handleDelete}>
            ลบบัญชี
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profileedit;
