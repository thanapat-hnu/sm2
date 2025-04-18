import { useNavigate, useLocation } from 'react-router-dom';
import "boxicons";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-item" onClick={() => navigate('/main')}>
        <div className={`nav-icon ${location.pathname === '/main' ? 'active' : ''}`}>
          <box-icon name="map-alt" color="#fff"></box-icon>
        </div>
        <span>หน้าหลัก</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/orders')}>
        <div className={`nav-icon ${location.pathname === '/orders' ? 'active' : ''}`}>
          <box-icon name="package" color="#fff"></box-icon>
        </div>
        <span>งานที่รับ</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/chat')}>
        <div className={`nav-icon ${location.pathname === '/chat' ? 'active' : ''}`}>
          <box-icon name="message-rounded-dots" color="#fff"></box-icon>
        </div>
        <span>แชท</span>
      </div>

      <div className="nav-item" onClick={() => navigate('/profile')}>
        <div className={`nav-icon ${location.pathname === '/profile' ? 'active' : ''}`}>
          <box-icon name="user" color="#fff"></box-icon>
        </div>
        <span>โปรไฟล์</span>
      </div>
    </nav>
  );
}

export default Navbar;