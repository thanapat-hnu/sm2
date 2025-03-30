import express from 'express';
import pool from './db.js';

const router = express.Router();

// ✅ เพิ่มเบอร์โทรลง MySQL
router.post('/insert-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phoneNumber]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: "เบอร์นี้มีอยู่ในระบบแล้ว" });
    }

    await pool.query("INSERT INTO users (phone) VALUES (?)", [phoneNumber]);
    return res.json({ success: true, message: "บันทึกเบอร์โทรศัพท์เรียบร้อย" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

// ✅ อัปเดตรายละเอียดผู้ใช้ตามเบอร์
router.post('/update-profile', async (req, res) => {
  const { phone, email, firstname, lastname, gender } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบเบอร์โทรนี้ในระบบ" });
    }

    await pool.query(
      "UPDATE users SET email = ?, firstname = ?, lastname = ?, gender = ? WHERE phone = ?",
      [email, firstname, lastname, gender, phone]
    );

    return res.json({ success: true, message: "อัปเดตข้อมูลโปรไฟล์เรียบร้อย" });

  } catch (err) {
    console.error("DB Update Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

// ✅ ตรวจสอบว่าเบอร์มีอยู่ในระบบหรือไม่
router.post('/check-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phoneNumber]);
    return res.json({ success: true, exists: rows.length > 0 });
  } catch (err) {
    console.error("Check Phone Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});


router.get('/get-user', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Get User Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

export default router;
