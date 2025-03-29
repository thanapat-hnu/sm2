import express from "express";
import { pool } from "../db.js";

const routes = express.Router();

//API
routes.get("/select", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM drivers");
        return res.json(rows); // ส่งผลลัพธ์ที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
    }
});


routes.post("/register", async (req, res) => {
    try {
        const { username, password, email, firstname, lastname, phone, gender } = req.body;
        
        console.log("Received registration data:", {
            username, email, firstname, lastname, phone, gender
        });

        if (!username || !password || !email || !firstname || !lastname || !phone || !gender) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const [drivers] = await pool.query(
            "SELECT * FROM drivers WHERE username = ? or email = ? or phone = ?",
            [username, email, phone]
        );

        if (drivers.length > 0) {
            if (drivers[0].username === username) {
                return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
            }
            if (drivers[0].email === email) {
                return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
            }
            if (drivers[0].phone === phone) {
                return res.status(400).json({ message: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
            }
        }

        const result = await pool.query(
            "INSERT INTO drivers (username, password, email, firstname, lastname, phone, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, password, email, firstname, lastname, phone, gender])
        return res.status(201).json({ message: "ลงทะเบียนสําเร็จ" });

    } catch (error) {
        console.error("Registration error details:", error);
        return res.status(500).json({ 
            message: "เกิดข้อผิดพลาดในการลงทะเบียน",
            error: error.message 
        });
    }

});

routes.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    try {
        const [drivers] = await pool.query(
            "SELECT * FROM drivers WHERE username = ? and password = ?",
            [username, password]
        )
        console.log(drivers);

        if (drivers.length > 0) {
            if (drivers[0].username === username && drivers[0].password === password) {
                return res.status(200).json({ message: "เข้าสู่ระบบสําเร็จ" });
            }
        }
        return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    } catch (err) {
        console.log('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', err.message);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    }
})



export default routes;