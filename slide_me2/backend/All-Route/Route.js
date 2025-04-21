import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserByPhone, addUser, updateUser, readUsers } from '../All-Server/UserServer.js';
import { createToken } from '../middleware/auth.js';

const router = express.Router();

// สร้าง object เก็บ OTP ชั่วคราว
const otpStore = {};

// สร้างฟังก์ชันสำหรับสร้าง OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// เพิ่ม middleware ตรวจสอบ token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not found'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }
    req.user = user;
    next();
  });
};

// ตรวจสอบเบอร์โทรศัพท์
router.post('/check-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = findUserByPhone(phoneNumber);
    
    if (user) {
      // สร้าง token และข้อมูลที่จำเป็น
      const token = createToken({
        phoneNumber: user.phoneNumber,
        role: user.role,
        id: user.id
      });

      // แยกข้อมูลตาม role
      const userData = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        ...(user.role === 'driver' && {
          idCard: user.idCard || '',
          birthDate: user.birthDate || '',
          address: user.address || '',
        })
      };

      res.json({
        success: true,
        exists: true,
        message: 'เบอร์โทรศัพท์นี้มีในระบบ',
        token,
        role: user.role,
        userData,
        redirectTo: user.role === 'driver' ? '/driver/home' : '/home'
      });
    } else {
      res.json({
        success: true,
        exists: false,
        message: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์'
    });
  }
});

// ลงทะเบียนผู้ใช้ใหม่
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = addUser({
      ...userData,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      data: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// อัพเดทโปรไฟล์
router.post('/update-profile', async (req, res) => {
  try {
    const { phoneNumber, ...updateData } = req.body;
    const updatedUser = updateUser(phoneNumber, updateData);

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    });
  }
});

// เพิ่ม endpoint สำหรับ insert-phone
router.post('/insert-phone', async (req, res) => {
  try {
    const { phoneNumber, role } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุเบอร์โทรศัพท์และบทบาท'
      });
    }

    // ตรวจสอบเบอร์ซ้ำ
    const existingUser = findUserByPhone(phoneNumber);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'เบอร์โทรศัพท์นี้มีในระบบแล้ว'
      });
    }

    // เพิ่มผู้ใช้ใหม่
    const newUser = addUser({
      phoneNumber,
      role,
      status: 'pending'
    });

    // สร้าง token
    const token = createToken({
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      id: newUser.id
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      token,
      data: newUser
    });

  } catch (error) {
    console.error('Error inserting phone:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// เพิ่ม endpoint สำหรับ register driver personal
router.post('/register/driver/personal', async (req, res) => {
  try {
    const userData = req.body;
    const phoneNumber = userData.phone;

    // ตรวจสอบเบอร์โทรในระบบ
    const existingUser = findUserByPhone(phoneNumber);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // อัพเดทข้อมูลส่วนตัวของคนขับ
    const updatedUser = updateUser(phoneNumber, {
      ...userData,
      role: 'driver',
      status: 'pending'
    });

    res.json({
      success: true,
      message: 'บันทึกข้อมูลส่วนตัวสำเร็จ',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error registering driver personal:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    });
  }
});

// เพิ่ม endpoint get-user
router.get('/get-user', async (req, res) => {
  try {
    const { phone } = req.query;
    const user = findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || '',
        status: user.status || 'active',
        // เพิ่มข้อมูลสำหรับ driver
        ...(user.role === 'driver' && {
          idCard: user.idCard || '',
          birthDate: user.birthDate || '',
          address: user.address || ''
        })
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// เพิ่ม endpoint สำหรับดึงข้อมูล driver profile
router.get('/driver/profile', authenticateToken, async (req, res) => {
  try {
    const { phone } = req.query;
    const user = findUserByPhone(phone);

    if (!user || user.role !== 'driver') {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลคนขับ'
      });
    }

    res.json({
      success: true,
      driver: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        status: user.status || 'pending',
        email: user.email || '',
        idCard: user.idCard || '',
        birthDate: user.birthDate || '',
        address: user.address || ''
      }
    });

  } catch (error) {
    console.error('Error fetching driver profile:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคนขับ'
    });
  }
});

// เพิ่ม endpoint สำหรับสร้าง OTP
router.post('/generate-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    
    // เก็บ OTP ไว้ใน store พร้อมเวลาหมดอายุ (5 นาที)
    otpStore[phoneNumber] = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    res.json({
      success: true,
      otp // ในระบบจริงควรส่ง SMS แทน
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้าง OTP'
    });
  }
});

// เพิ่ม endpoint สำหรับตรวจสอบ OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const storedOTP = otpStore[phoneNumber];
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP ไม่ถูกต้องหรือหมดอายุ'
      });
    }

    // ตรวจสอบการหมดอายุ
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[phoneNumber];
      return res.status(400).json({
        success: false,
        message: 'OTP หมดอายุ'
      });
    }

    // ตรวจสอบ OTP
    if (storedOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'รหัส OTP ไม่ถูกต้อง'
      });
    }

    // ลบ OTP ที่ใช้แล้ว
    delete otpStore[phoneNumber];

    res.json({
      success: true,
      message: 'ยืนยัน OTP สำเร็จ'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบ OTP'
    });
  }
});

export default router;