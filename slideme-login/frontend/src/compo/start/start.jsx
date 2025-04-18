import { useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import "./start.css";

function Start() {
  const navigate = useNavigate();
  
  return (
    <PageTransition>
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
    </PageTransition>
  );
}

export default Start;
