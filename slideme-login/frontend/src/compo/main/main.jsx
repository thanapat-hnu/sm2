import "boxicons";
import "./main.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from '../map/map';
import PageTransition from '../../components/PageTransition';

function Main() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [income, setIncome] = useState(false);
  const [isRoutePopupOpen, setIsRoutePopupOpen] = useState(false);

  return (
    <PageTransition>
      <div className="main-container">
        <div className="container-main">
          {/* รายได้,โปรไฟล์ */}
          <div className="btn-top">
            {/* รายได้ */}
            <button
              className="btn-income"
              onClick={() => {
                setIncome(!income);
              }}
            >
              <box-icon
                type={income ? "" : "solid"}
                name={income ? "x" : "bar-chart-alt-2"}
                color="#fff"
              ></box-icon>
              &nbsp;{income ? "" : "รายได้"}
            </button>
            {income ? (
              <>
                <button className="btn-income-value">
                  <label htmlFor="" className="label-income">รายได้</label><br />
                  <label htmlFor="" className="label-value">1,000</label>
                  <label htmlFor="" className="label-icon">฿</label>
                </button>
              </>
            ) : (
              ""
            )}
            {/* โปรไฟล์ */}
            <label className="profile-img" />
          </div>
          {/* ปุ่มออนไลน์ */}
          <button
            className="btn-online"
            onClick={() => setStatus(!status)}
            style={{
              backgroundColor: status ? "#14BF61" : "#232323"
            }}
          >
            <box-icon name="power-off" color="#ffffff"></box-icon>&nbsp;ออนไลน์
          </button>
          {/* ปุ่มด้านล่าง */}
          <div className="btn-bottom">
            {/* หน้าหลัก */}
            <div className="btn-bottom-item1" onClick={() => setIsRoutePopupOpen(true)}>
              <div className="btn-bottom-icon">
                <box-icon name="map-alt" color="#fff"></box-icon>
              </div>
              <label>หน้าหลัก</label>
            </div>

            {/* งานที่รับ */}
            <div className="btn-bottom-item2" onClick={() => navigate('/orders')}>
              <div className="btn-bottom-icon">
                <box-icon name="package" color="#fff"></box-icon>
              </div>
              <label>งานที่รับ</label>
            </div>

            {/* แชท */}
            <div className="btn-bottom-item3" onClick={() => navigate('/chat')}>
              <div className="btn-bottom-icon">
                <box-icon name="message-rounded-dots" color="#fff"></box-icon>
              </div>
              <label>แชท</label>
            </div>

            {/* โปรไฟล์ */}
            <div className="btn-bottom-item4" onClick={() => navigate('/profile')}>
              <div className="btn-bottom-icon">
                <box-icon name="user" color="#fff"></box-icon>
              </div>
              <label>โปรไฟล์</label>
            </div>
          </div>
          {/* Popup for route selection */}
          {isRoutePopupOpen && (
            <div className="route-popup">
              <div className="route-popup-content">
                <div className="route-popup-header">
                  <h3>เลือกเส้นทาง</h3>
                  <button 
                    className="close-button"
                    onClick={() => setIsRoutePopupOpen(false)}
                  >
                    <box-icon name="x" color="#333"></box-icon>
                  </button>
                </div>
                <Map />
              </div>
            </div>
          )}
          {/* แผนที่หลัก */}
          <div id="map">
            <Map />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Main;
