import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { findUserByPhone } from './All-Server/UserServer.js';
import routes from './All-Route/Route.js';
import vehicleRoutes from './All-Route/VehicleRoute.js';
import HomeRoutes from './Homeroutes.js';
import bookingRoutes from './bookingRoutes.js';
import locationRoutes from './locationRoutes.js';
import mapRoutes from './mapRoutes.js';

const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);
app.use('/api', vehicleRoutes);
app.use('/api', HomeRoutes);
app.use('/api', bookingRoutes);
app.use('/api', locationRoutes);
app.use('/api', mapRoutes);

// ✅ In-memory store สำหรับ OTP เท่านั้น
const otps = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateOTP(phoneNumber, otp) {
  return otps[phoneNumber] === otp;
}

// ✅ ส่ง OTP
app.post('/api/generate-otp', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }
  const otp = generateOTP();
  otps[phoneNumber] = otp;
  console.log(`OTP สำหรับ ${phoneNumber}: ${otp}`);
  return res.json({ success: true, message: "ส่ง OTP สำเร็จ", otp });
});

// ✅ ตรวจสอบ OTP และอัพเดทสถานะผู้ใช้
app.post('/api/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "ต้องระบุเบอร์โทรศัพท์และ OTP" 
    });
  }

  try {
    if (validateOTP(phoneNumber, otp)) {
      delete otps[phoneNumber];
      
      // ตรวจสอบผู้ใช้ในระบบ
      const user = findUserByPhone(phoneNumber);
      
      return res.json({ 
        success: true, 
        message: "ยืนยัน OTP สำเร็จ",
        userData: user || null
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "OTP ไม่ถูกต้อง" 
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการตรวจสอบ OTP" 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
