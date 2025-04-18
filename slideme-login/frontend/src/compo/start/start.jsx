import { use } from "react";
import "./start.css";
import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';

function Start() {
  const navigate = useNavigate();
  return (
    <div className="container-home">
      <div className="title">
        <h2 style={{ margin: "0" }}>พาร์ทเนอร์คนขับ Grab</h2>
        <h1 style={{ margin: "0" }}>ขับขี่และรับรายได้</h1>
        <h1 style={{ margin: "0" }}>กับ Grab</h1>
      </div>

      <div className="reg-log">
        <h3>ลงทะเบียนหรือเข้าสู่ระบบด้วย</h3>
        <button
          className="btn"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate("/login")}
        >
          <b>เข้าสู่ระบบ</b>
        </button>
        <button
          className="btn"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate("/register")}
        >
          <b>ลงชื่อเข้าใช้</b>
        </button>
      </div>
    </div>
  );
}

export default Start;
