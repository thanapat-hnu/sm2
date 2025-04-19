// routes/Login.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { idCardNumber, phoneNumber } = req.body;

    if (!idCardNumber || !phoneNumber) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM personal_info WHERE id_card_number = ? AND phone_number = ?`,
      [idCardNumber, phoneNumber]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }

    const user = rows[0];
    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error: error.message });
  }
});

export default router;
