import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// เปลี่ยนตำแหน่งไฟล์ไปที่โฟลเดอร์ User/Customer
const CUSTOMER_FILE = path.join(__dirname, '../User/Customer/customers.json');

// สร้างไฟล์และโฟลเดอร์ JSON ถ้ายังไม่มี
const ensureCustomerFile = () => {
  const dir = path.dirname(CUSTOMER_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CUSTOMER_FILE)) {
    fs.writeFileSync(CUSTOMER_FILE, JSON.stringify([]));
  }
};

// อ่านข้อมูลลูกค้าทั้งหมด
export const readCustomers = () => {
  ensureCustomerFile();
  return JSON.parse(fs.readFileSync(CUSTOMER_FILE, 'utf8'));
};

// เขียนข้อมูลลูกค้า
export const writeCustomers = (customers) => {
  fs.writeFileSync(CUSTOMER_FILE, JSON.stringify(customers, null, 2));
};

// เพิ่มลูกค้าใหม่
export const addCustomer = (customerData) => {
  const customers = readCustomers();
  const newCustomer = {
    id: customers.length + 1,
    ...customerData,
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  writeCustomers(customers);
  return newCustomer;
};

// ค้นหาลูกค้าด้วยเบอร์โทร
export const findCustomerByPhone = (phoneNumber) => {
  const customers = readCustomers();
  return customers.find(customer => customer.phoneNumber === phoneNumber);
};