import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OTP.css";

function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [animateClass, setAnimateClass] = useState("OTP-fadeIn");
  const phoneNumber = location.state?.phoneNumber;

  // สร้าง OTP เมื่อโหลดหน้า
  useEffect(() => {
    const generateNewOTP = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/generate-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phoneNumber })
        });

        if (!response.ok) {
          throw new Error('Failed to generate OTP');
        }

        const data = await response.json();
        if (data.success) {
          setGeneratedOTP(data.otp);
          setShowPopup(true);
          // ซ่อน popup หลังจาก 5 วินาที
          setTimeout(() => {
            setShowPopup(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error generating OTP:', error);
        setError('เกิดข้อผิดพลาดในการสร้าง OTP');
      }
    };

    generateNewOTP();
  }, [phoneNumber]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };

  const handleVerify = async () => {
    try {
      if (otp.length !== 6) {
        setError("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
        return;
      }

      const response = await fetch('http://localhost:3000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          otp
        })
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('isVerified', 'true');
        setAnimateClass("OTP-fadeOut");
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 500);
      } else {
        setError(result.message || 'รหัส OTP ไม่ถูกต้อง');
      }

    } catch (error) {
      console.error("Verification error:", error);
      setError("เกิดข้อผิดพลาดในการยืนยัน OTP");
    }
  };

  const handleBack = () => {
    setAnimateClass("OTP-fadeOut");
    setTimeout(() => {
      navigate("/inputphone");
    }, 500);
  };

  return (
    <div className={`otp-container ${animateClass}`}>
      {showPopup && (
        <div className="otp-popup">
          รหัส OTP คือ: {generatedOTP}
        </div>
      )}

      <button className="back-btn-OTP" onClick={handleBack}>⭠</button>
      
      <div className="otp-text">
        <h2>รหัส OTP</h2>
        <p>กรอกรหัส OTP ที่ส่งไปที่เบอร์ {phoneNumber}</p>
      </div>

      <div className="input-OTP">
        <input
          type="text"
          className="otp-input"
          value={otp}
          onChange={handleInputChange}
          maxLength="6"
          placeholder="กรอกรหัส OTP 6 หลัก"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="otp-next">
        <button className="otp-next-btn" onClick={handleVerify}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
}

export default OTP;
