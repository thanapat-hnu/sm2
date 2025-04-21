import express from 'express';
import cors from 'cors';
import { addCustomer, findCustomerByPhone, readCustomers, writeCustomers } from '../All-Server/Customor.js';

const router = express.Router();

// Middleware
router.use(cors());

// Check phone number
router.post('/check-phone', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const customer = findCustomerByPhone(phoneNumber);
    
    res.json({
      success: true,
      exists: !!customer,
      message: customer ? 'Phone number exists' : 'Phone number not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking phone number'
    });
  }
});

// Register new customer
router.post('/register', (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const customer = findCustomerByPhone(phoneNumber);
    
    if (customer) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    const newCustomer = addCustomer({ phoneNumber });
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: newCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering customer'
    });
  }
});

// Add profile update endpoint
router.post('/update-profile', async (req, res) => {
  try {
    const { phone, email, firstname, lastname, gender } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const customer = findCustomerByPhone(phone);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update customer profile
    customer.email = email;
    customer.firstname = firstname;
    customer.lastname = lastname;
    customer.gender = gender;
    customer.updatedAt = new Date().toISOString();

    // Save updated customers data
    const customers = readCustomers();
    const index = customers.findIndex(c => c.phoneNumber === phone);
    customers[index] = customer;
    writeCustomers(customers);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Add endpoint for fetching user data
router.get('/get-user', (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const customer = findCustomerByPhone(phone);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User found',
      user: customer
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});

export default router;