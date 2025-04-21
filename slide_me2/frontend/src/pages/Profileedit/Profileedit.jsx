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
    name: "",
    lastname: "",
    sex: "",
    email: "",
    number: "",
    role: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const phoneNumber =
    location.state?.phoneNumber || localStorage.getItem("phoneNumber");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/get-user?phone=${phoneNumber}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.success && data.user) {
          const user = data.user;
          const gender =
            user.gender === "หญิง"
              ? "female"
              : user.gender === "ชาย"
              ? "male"
              : "";

          setFormData({
            name: user.firstname || "",
            lastname: user.lastname || "",
            sex: gender,
            email: user.email || "",
            number: user.phoneNumber || "",
            role: user.role || "customer"
          });

          if (user.profileImage) {
            setProfileImage(user.profileImage);
          }
        } else {
          setError("ไม่พบข้อมูลผู้ใช้");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (phoneNumber) {
      fetchUserData();
    } else {
      setError("ไม่พบเบอร์โทรศัพท์");
      setLoading(false);
    }
  }, [phoneNumber]);

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
    setIsEditing(false);

    const translatedGender = formData.sex === "male" ? "ชาย" : "หญิง";

    const updatedProfileData = {
      email: formData.email,
      firstname: formData.name,
      lastname: formData.lastname,
      gender: translatedGender,
      phone: formData.number,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/update-profile",
        updatedProfileData
      );
      if (res.data.success) {
        alert("อัปเดตข้อมูลสำเร็จ");
      } else {
        alert("ไม่สามารถอัปเดตข้อมูลได้");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("เกิดข้อผิดพลาด");
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
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?");
    if (!confirmDelete) return;

    try {
      const res = await axios.post("http://localhost:3000/api/delete-user", {
        phone: formData.number,
      });

      if (res.data.success) {
        alert("ลบบัญชีเรียบร้อยแล้ว");
        localStorage.removeItem("phoneNumber");
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
        <div className="profileedit-welcome">สวัสดี คุณ {formData.name}</div>

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
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="form-lastname">
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="form-numbercountry">
          <input type="text" id="country" value="+66" readOnly />
          <input
            type="text"
            name="number"
            value={formData.number}
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
          />
        </div>

        <div className="form-sex">
          <select
            className="form-selects"
            name="sex"
            value={formData.sex}
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

        <div className="profileedit-role">
          สถานะ: {formData.role === "driver" ? "คนขับ" : "ผู้ใช้บริการ"}
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
