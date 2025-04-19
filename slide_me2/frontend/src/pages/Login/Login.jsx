import React from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate
import './Login.css';

function Login() {
    const navigate = useNavigate(); // สร้างตัวแปร navigate

    // ฟังก์ชันเมื่อกดปุ่มเข้าสู่ระบบด้วยเบอร์มือถือ
    const handlePhoneLogin = () => {
        document.querySelector('.Login-container').classList.add('fade-out');
        setTimeout(() => {
            navigate('/inputphone');
        }, 500);
    };

    // ฟังก์ชันเมื่อกดปุ่มสร้างบัญชีใหม่
    const handleRegister = () => {
        document.querySelector('.Login-container').classList.add('fade-out');
        setTimeout(() => {
            navigate('/register/customer');
        }, 500);
    };

    // ฟังก์ชันเมื่อกดปุ่ม "ร่วมงานกับเรา ?"
    const handleJoinUs = () => {
        document.querySelector('.Login-container').classList.add('fade-out');
        setTimeout(() => {
            navigate('/register/driver/personal'); // เปลี่ยนเส้นทางไปหน้า RegisterDriverPersonal
        }, 500);
    };

    return (
        <div className="Login-container">
            <img className="logo" src="./img/slide me logo.png" alt="Logo" />
            <div className="login-form">
                <button className="btn-login" onClick={handlePhoneLogin}>
                    <img className="phone" src="./img/phone.png" alt="Phone" />
                    เข้าสู่ระบบด้วยเบอร์มือถือ
                </button>
            </div>
            <div>
                <button className="btn-register" onClick={handleRegister}>
                    สร้างบัญชีใหม่
                </button>
            </div>
            <div className="join-us">
                <button className="btn-join-us" onClick={handleJoinUs}>
                    ร่วมงานกับเรา ?
                </button>
            </div>
        </div>
    );
}

export default Login;
