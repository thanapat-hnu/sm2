import "./register.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { RegistrationContext } from "../../context/RegistrationContext";
import PageTransition from "../../components/PageTransition";
import axios from "axios";

function RegisterVehicle() {
  const navigate = useNavigate();
  const { vehicleData, setVehicleData } = useContext(RegistrationContext);
  const { personalData, setPersonalData } = useContext(RegistrationContext);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const { name } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!vehicleData.licenseType) {
      newErrors.licenseType = "กรุณาเลือกประเภทใบขับขี่";
    }

    if (!vehicleData.licenseNumber.trim()) {
      newErrors.licenseNumber = "กรุณากรอกหมายเลขใบขับขี่";
    }

    if (!vehicleData.licenseExpiryDate) {
      newErrors.licenseExpiryDate = "กรุณาเลือกวันหมดอายุใบขับขี่";
    }

    // if (!vehicleData.licenseImage) {
    //   newErrors.licenseImage = "กรุณาอัพโหลดรูปใบขับขี่";
    // }

    if (!vehicleData.vehicleType) {
      newErrors.vehicleType = "กรุณาเลือกประเภทพาหนะ";
    }

    if (!vehicleData.vehicleBrand.trim()) {
      newErrors.vehicleBrand = "กรุณากรอกยี่ห้อรถ";
    }

    if (!vehicleData.vehicleModel.trim()) {
      newErrors.vehicleModel = "กรุณากรอกรุ่นรถ";
    }

    if (!vehicleData.plateNumber.trim()) {
      newErrors.plateNumber = "กรุณากรอกทะเบียนรถ";
    }

    // if (!vehicleData.vehicleImage) {
    //   newErrors.vehicleImage = "กรุณาอัพโหลดรูปถ่ายรถ";
    // }

    // if (!vehicleData.plateImage) {
    //   newErrors.plateImage = "กรุณาอัพโหลดรูปถ่ายทะเบียนรถ";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    try {
      // Step 1: ส่งข้อมูล personal
      const personalRes = await axios.post(
        "/api/drivers/register-personal",
        personalData
      );
      const personalId = personalRes.data.personalId;

      // Step 2: แนบ personalId ไปใน vehicleData แล้วส่งต่อ
      const fullVehicleData = {
        ...vehicleData,
        personalId,
      };

      const vehicleRes = await axios.post(
        "/api/vehicles/register-vehicle",
        fullVehicleData
      );

      alert("สมัครสำเร็จทั้งสองขั้นตอน!");
      console.log("ผลลัพธ์:", vehicleRes.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error.response?.data || error.message);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleBack = () => {
    const container = document.querySelector(".container-login");
    container.classList.add("slide-out");
    setTimeout(() => {
      navigate("/login");
    }, 280);
  };

  return (
    <PageTransition>
      <div className="container-login">
        <div className="formReg">
          <div className="header-container">
            <button className="btn-back" onClick={handleBack}>
              <b>＜ กลับ</b>
            </button>
            <h1>ข้อมูลพาหนะ</h1>
          </div>

          <div className="coolinput">
            <label className="text">ประเภทใบขับขี่: </label>
            <select
              name="licenseType"
              className={`input ${errors.licenseType ? "error" : ""}`}
              value={vehicleData.licenseType}
              onChange={handleInputChange}
            >
              <option value="">เลือกประเภทใบขับขี่</option>
              <option value="motorcycle">รถจักรยานยนต์</option>
              <option value="car">รถยนต์</option>
            </select>
            {errors.licenseType && (
              <span className="error-message">{errors.licenseType}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">หมายเลขใบขับขี่: </label>
            <input
              type="text"
              name="licenseNumber"
              placeholder="หมายเลขใบขับขี่..."
              className={`input ${errors.licenseNumber ? "error" : ""}`}
              value={vehicleData.licenseNumber}
              onChange={handleInputChange}
            />
            {errors.licenseNumber && (
              <span className="error-message">{errors.licenseNumber}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">วันหมดอายุใบขับขี่: </label>
            <input
              type="date"
              name="licenseExpiryDate"
              className={`input ${errors.licenseExpiryDate ? "error" : ""}`}
              value={vehicleData.licenseExpiryDate}
              onChange={handleInputChange}
            />
            {errors.licenseExpiryDate && (
              <span className="error-message">{errors.licenseExpiryDate}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">รูปใบขับขี่: </label>
            <input
              type="file"
              name="licenseImage"
              accept="image/*"
              className={`input ${errors.licenseImage ? "error" : ""}`}
              onChange={handleFileUpload}
            />
            {errors.licenseImage && (
              <span className="error-message">{errors.licenseImage}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">ประเภทพาหนะ: </label>
            <select
              name="vehicleType"
              className={`input ${errors.vehicleType ? "error" : ""}`}
              value={vehicleData.vehicleType}
              onChange={handleInputChange}
            >
              <option value="">เลือกประเภทพาหนะ</option>
              <option value="motorcycle">รถจักรยานยนต์</option>
              <option value="car">รถยนต์</option>
            </select>
            {errors.vehicleType && (
              <span className="error-message">{errors.vehicleType}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">ยี่ห้อรถ: </label>
            <input
              type="text"
              name="vehicleBrand"
              placeholder="ยี่ห้อรถ..."
              className={`input ${errors.vehicleBrand ? "error" : ""}`}
              value={vehicleData.vehicleBrand}
              onChange={handleInputChange}
            />
            {errors.vehicleBrand && (
              <span className="error-message">{errors.vehicleBrand}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">รุ่นรถ: </label>
            <input
              type="text"
              name="vehicleModel"
              placeholder="รุ่นรถ..."
              className={`input ${errors.vehicleModel ? "error" : ""}`}
              value={vehicleData.vehicleModel}
              onChange={handleInputChange}
            />
            {errors.vehicleModel && (
              <span className="error-message">{errors.vehicleModel}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">ทะเบียนรถ: </label>
            <input
              type="text"
              name="plateNumber"
              placeholder="ทะเบียนรถ..."
              className={`input ${errors.plateNumber ? "error" : ""}`}
              value={vehicleData.plateNumber}
              onChange={handleInputChange}
            />
            {errors.plateNumber && (
              <span className="error-message">{errors.plateNumber}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">รูปถ่ายรถ: </label>
            <input
              type="file"
              name="vehicleImage"
              accept="image/*"
              className={`input ${errors.vehicleImage ? "error" : ""}`}
              onChange={handleFileUpload}
            />
            {errors.vehicleImage && (
              <span className="error-message">{errors.vehicleImage}</span>
            )}
          </div>

          <div className="coolinput">
            <label className="text">รูปถ่ายทะเบียนรถ: </label>
            <input
              type="file"
              name="plateImage"
              accept="image/*"
              className={`input ${errors.plateImage ? "error" : ""}`}
              onChange={handleFileUpload}
            />
            {errors.plateImage && (
              <span className="error-message">{errors.plateImage}</span>
            )}
          </div>
        </div>

        <button
          className="btn-login"
          onClick={handleRegister}
          style={{ marginBottom: "10px" }}
        >
          <b>ลงทะเบียน</b>
        </button>
      </div>
    </PageTransition>
  );
}

export default RegisterVehicle;
