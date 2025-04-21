import express from 'express';
import { 
  registerCustomer, 
  updateCustomerProfile, 
  findUserByPhone,
  validateUser 
} from '../All-Server/UserServer.js';
import { createToken } from '../middleware/auth.js';

const router = express.Router();

// ลงทะเบียนลูกค้าใหม่
router.post('/register/customer', async (req, res) => {
  try {
    const { phoneNumber, ...customerData } = req.body;
    
    // ตรวจสอบเบอร์โทรซ้ำ
    const existing = findUserByPhone(phoneNumber);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'เบอร์โทรศัพท์นี้มีในระบบแล้ว'
      });
    }

    const newCustomer = registerCustomer({ phoneNumber, ...customerData });
    const token = createToken({
      phoneNumber: newCustomer.phoneNumber,
      role: 'customer',
      id: newCustomer.id
    });

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      token,
      data: newCustomer
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// อัพเดทโปรไฟล์ลูกค้า
router.post('/update/customer', async (req, res) => {
  try {
    const { phoneNumber, ...profileData } = req.body;
    const updatedCustomer = updateCustomerProfile(phoneNumber, profileData);

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ',
      data: updatedCustomer
    });
    
  } catch (error) {
    console.error('Customer update error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    });
  }
});

// ตรวจสอบเบอร์โทรลูกค้า
router.post('/check-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const validation = validateUser(phoneNumber);
    
    if (validation.exists) {
      const user = findUserByPhone(phoneNumber);
      const token = createToken({
        phoneNumber: user.phoneNumber,
        role: user.role,
        id: user.id
      });

      res.json({
        success: true,
        exists: true,
        message: 'เบอร์โทรศัพท์นี้มีในระบบ',
        token,
        role: user.role,
        userData: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          role: user.role,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          status: user.status || 'active'
        }
      });
    } else {
      res.json({
        success: true,
        exists: false,
        message: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ'
      });
    }
  } catch (error) {
    console.error('Phone check error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์'
    });
  }
});

export default router;