import express from "express";
import { pool } from "../db.js";

const routes = express.Router();

// API สำหรับดึงข้อมูลจากฐานข้อมูล
routes.get("/select", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM drivers");
        return res.json(rows); // ส่งผลลัพธ์ที่ได้จากฐานข้อมูล
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
    }
});

// API สำหรับการลงทะเบียนผู้ใช้ใหม่
routes.post("/register", async (req, res) => {
    try {
        const { username, password, email, firstname, lastname, phone, gender } = req.body;

        console.log("Received registration data:", {
            username, email, firstname, lastname, phone, gender
        });

        // ตรวจสอบว่ามีข้อมูลที่ขาดหายไปหรือไม่
        if (!username || !password || !email || !firstname || !lastname || !phone || !gender) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        // ตรวจสอบว่ามีชื่อผู้ใช้, อีเมล หรือเบอร์โทรนี้ในระบบหรือยัง
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
        // ทำการบันทึกข้อมูลผู้ใช้ใหม่
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

// API สำหรับการเข้าสู่ระบบ
routes.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็นว่ามีการส่งมาหรือไม่
    if (!username || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    try {
        // ตรวจสอบข้อมูลการเข้าสู่ระบบ
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

// API สำหรับอัปเดตข้อมูลของผู้ใช้
routes.put('/update/:username', async (req, res) => {
    const { username } = req.params;
    const { password, email, firstname, lastname, phone, gender } = req.body;

    try {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const [driver] = await pool.query(
            "SELECT * FROM drivers WHERE username = ?",
            [username]
        )

        // อัปเดตข้อมูลที่ส่งมา หากไม่มีการส่งข้อมูลมา จะใช้ค่าที่มีอยู่เดิม
        const updateDriver = {
            password: password || driver[0].password,
            email: email || driver[0].email,
            firstname: firstname || driver[0].firstname,
            lastname: lastname || driver[0].lastname,
            phone: phone || driver[0].phone,
            gender: gender || driver[0].gender
        }

        // ทำการอัปเดตข้อมูลในฐานข้อมูล
        const [newDriver] = await pool.query(
            "UPDATE drivers SET password = ?, email = ?, firstname = ?, lastname = ?, phone = ?, gender = ? WHERE username = ?",
            [updateDriver.password, updateDriver.email, updateDriver.firstname, updateDriver.lastname, updateDriver.phone, updateDriver.gender, username]
        )

        //ตรวจสอบว่าอัปเดตข้อมูลสำเร็จหรือไม่ (ทำความเข้าใจเพิ่ม)
        if (newDriver.affectedRows > 0) {
            return res.status(200).json({ message: "อัปเดตข้อมูลสําเร็จ" });
        }

        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });

    } catch (err) {
        console.log('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', err.message);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    }

});
// API สำหรับการลบข้อมูล
routes.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // ลบข้อมูลผู้ใช้จากฐานข้อมูล
        const [driver] = await pool.query(
            "DELETE FROM drivers WHERE username = ?",
            [username]
        )

        if(driver.affectedRows > 0){
            return res.status(200).json({ message: "ลบข้อมูลสําเร็จ" });
        }

        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });

    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
})

export default routes;