import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OTP.css";

function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [animateClass, setAnimateClass] = useState("");
  const phoneNumber = location.state?.phoneNumber;

  const handleVerify = async () => {
    try {
      // จำลองการตรวจสอบ OTP
      const isValid = otp.join("") === "111111";

      if (isValid) {
        // ตรวจสอบ role จาก localStorage
        const userRole = localStorage.getItem('userRole');
        
        // กำหนดเส้นทางตาม role
        let nextPath = '/home'; // default path
        
        if (userRole === 'driver') {
          nextPath = '/driver/home';
        }

        // Set animation before navigation
        setAnimateClass('OTP-fadeOut');
        setTimeout(() => {
          navigate(nextPath, { 
            state: { phoneNumber },
            replace: true // ใช้ replace เพื่อป้องกันการกด back กลับมาหน้า OTP
          });
        }, 500);
      } else {
        setError("รหัส OTP ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("เกิดข้อผิดพลาดในการยืนยัน OTP");
    }
  };

  const handleBack = () => {
    const fromPath = location.state?.from || "/inputphone";
    navigate(fromPath);
  };

  return (
    <div className={`otp-container ${animateClass}`}>
      <div className="otp-title">
        <button className="back-btn-OTP" onClick={handleBack}>
          ⭠
        </button>
        <p className="otp-text">กรอกรหัส 6 หลักที่ส่งไปให้เบอร์ +66</p>
        <p className="otp-number">{phoneNumber}</p>
      </div>

      <div className="input-OTP">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => {
              const value = e.target.value.slice(0, 1);
              const newOtp = [...otp];
              newOtp[index] = value;
              setOtp(newOtp);
              setError("");
            }}
          />
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="otp-footer">
        <p>ยังไม่ได้รับ OTP ใช่หรือไม่?</p>
        <button
          className="otp-btn"
          onClick={() => {
            window.location.reload();
          }}
        >
          ขอรหัสใหม่
        </button>
      </div>

      <div className="otp-next">
        <button className="otp-next-btn" onClick={handleVerify}>
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default OTP;
