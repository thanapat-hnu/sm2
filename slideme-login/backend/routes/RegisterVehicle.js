import express from 'express';
import { pool } from '../db.js'; // Use ESM import for pool

const router = express.Router();

router.post("/register-vehicle", async (req, res) => {
    try {
        const {
            personalId,
            licenseType,
            licenseNumber,
            licenseExpiryDate,
            licenseImage,
            vehicleType,
            vehicleBrand,
            vehicleModel,
            plateNumber,
            vehicleImage,
            plateImage
        } = req.body;

        // Validate required fields
        if (!licenseType || !licenseNumber || !licenseExpiryDate || !vehicleType || 
            !vehicleBrand || !vehicleModel || !plateNumber) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        // Check for existing license or plate number
        const [existingVehicle] = await pool.query(
            "SELECT * FROM vehicle_info WHERE license_number = ? OR plate_number = ?",
            [licenseNumber, plateNumber]
        );

        if (existingVehicle.length > 0) {
            if (existingVehicle[0].license_number === licenseNumber) {
                return res.status(400).json({ message: "หมายเลขใบขับขี่นี้ถูกใช้งานแล้ว" });
            }
            if (existingVehicle[0].plate_number === plateNumber) {
                return res.status(400).json({ message: "ทะเบียนรถนี้ถูกใช้งานแล้ว" });
            }
        }

        // Insert vehicle info
        const [result] = await pool.query(
            `INSERT INTO vehicle_info (
                personal_id,
                license_type,
                license_number,
                license_expiry_date,
                license_image,
                vehicle_type,
                vehicle_brand,
                vehicle_model,
                plate_number,
                vehicle_image,
                plate_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [personalId, licenseType, licenseNumber, licenseExpiryDate, licenseImage,
             vehicleType, vehicleBrand, vehicleModel, plateNumber, vehicleImage, plateImage]
        );

        return res.status(201).json({ 
            message: "บันทึกข้อมูลพาหนะสำเร็จ",
            vehicleId: result.insertId 
        });

    } catch (error) {
        console.error("Vehicle registration error:", error);
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลพาหนะ",
            error: error.message
        });
    }
});

export default router; // Export router using ESM syntax
