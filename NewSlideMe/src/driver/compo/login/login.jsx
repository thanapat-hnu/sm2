import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCardNumber: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      // ตรวจสอบถ้าผลลัพธ์จาก API ถูกต้อง
      if (response.status !== 200) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(`เข้าสู่ระบบล้มเหลว: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="เลขบัตรประชาชน"
          value={formData.idCardNumber}
          onChange={(e) =>
            setFormData({ ...formData, idCardNumber: e.target.value })
          }
        />
        <input
          type="tel"
          placeholder="เบอร์โทรศัพท์"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
      <button onClick={() => navigate("/")}>กลับ</button>
    </div>
  );
}

export default Login;
