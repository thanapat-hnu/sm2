import express from 'express';
import { addCustomer, findCustomerByPhone } from '../All-Server/Customor.js';
import { createToken } from '../middleware/auth.js';

const router = express.Router();

// ตรวจสอบเบอร์โทรศัพท์
router.post('/check-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const customer = findCustomerByPhone(phoneNumber);
    
    if (customer) {
      // สร้าง token และส่งกลับพร้อม role
      const token = createToken(customer);
      res.json({
        success: true,
        exists: true,
        message: 'เบอร์โทรศัพท์นี้มีในระบบ',
        token,
        role: customer.role // ส่ง role กลับไป
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

// ลงทะเบียนเบอร์โทรศัพท์
router.post('/insert-phone', async (req, res) => {
  try {
    const { phoneNumber, role = 'customer' } = req.body; // เพิ่ม role parameter
    console.log('Received data:', { phoneNumber, role });

    if (!phoneNumber || phoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
      });
    }

    // ตรวจสอบว่าเบอร์โทรซ้ำหรือไม่
    const existing = findCustomerByPhone(phoneNumber);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'เบอร์โทรศัพท์นี้ถูกลงทะเบียนแล้ว'
      });
    }

    // เพิ่มลูกค้าใหม่
    const newCustomer = addCustomer({
      phoneNumber,
      role, // เพิ่ม role
      status: 'active',
      registeredAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      data: newCustomer
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      error: error.message
    });
  }
});

export default router;