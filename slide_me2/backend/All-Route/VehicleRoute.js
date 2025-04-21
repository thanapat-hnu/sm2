import express from 'express';
import { addVehicle } from '../All-Server/VehicleServer.js';

const router = express.Router();

// Register vehicle endpoint
router.post('/register/driver/vehicle', async (req, res) => {
  try {
    const {
      vehicleType,
      licenseNumber,
      licenseExpiry,
      carBrand,
      carPlate,
      submitDate
    } = req.body;

    // Validate required fields
    if (!vehicleType || !licenseNumber || !carPlate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // Add new vehicle
    const newVehicle = addVehicle({
      vehicleType,
      licenseNumber,
      licenseExpiry,
      carBrand,
      carPlate,
      submitDate,
      registeredAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      data: newVehicle
    });

  } catch (error) {
    console.error('Vehicle registration error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

export default router;