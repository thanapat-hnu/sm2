import express from 'express';
import { addDriverPersonal, addDriverVehicle } from '../All-Server/DriverServer.js';

const router = express.Router();

// ลงทะเบียนข้อมูลส่วนตัวคนขับ
router.post('/register/driver/personal', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      idCard,
      birthDate,
      phone,
      email,
      address
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!firstName || !lastName || !idCard || !phone) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const newDriver = addDriverPersonal({
      firstName,
      lastName,
      idCard,
      birthDate,
      phone,
      email,
      address,
      registeredAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนข้อมูลส่วนตัวสำเร็จ',
      data: newDriver
    });

  } catch (error) {
    console.error('Error registering driver personal:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// ลงทะเบียนข้อมูลรถคนขับ
router.post('/register/driver/vehicle', async (req, res) => {
  try {
    const {
      vehicleType,
      licenseNumber,
      licenseExpiry,
      carBrand,
      carPlate
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!vehicleType || !licenseNumber || !carPlate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const newVehicle = addDriverVehicle({
      vehicleType,
      licenseNumber,
      licenseExpiry,
      carBrand,
      carPlate,
      registeredAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนข้อมูลรถสำเร็จ',
      data: newVehicle
    });

  } catch (error) {
    console.error('Error registering driver vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

export default router;