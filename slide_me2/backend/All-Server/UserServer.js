import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนด paths สำหรับไฟล์ JSON
const PATHS = {
  users: path.join(__dirname, '../User/User/Users.json')
};

// สร้างไฟล์ถ้ายังไม่มี
const ensureFile = () => {
  const dir = path.dirname(PATHS.users);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PATHS.users)) {
    fs.writeFileSync(PATHS.users, JSON.stringify([]));
  }
};

// อ่านข้อมูลผู้ใช้
export const readUsers = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(PATHS.users, 'utf8'));
};

// เขียนข้อมูลผู้ใช้
export const writeUsers = (users) => {
  fs.writeFileSync(PATHS.users, JSON.stringify(users, null, 2));
};

// เพิ่มผู้ใช้ใหม่
export const addUser = (userData) => {
  const users = readUsers();
  const newUser = {
    id: users.length + 1,
    ...userData,
    registeredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // ลบ status ออกจาก newUser ถ้ามี
  delete newUser.status;
  
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

// อัพเดทข้อมูลผู้ใช้
export const updateUser = (phoneNumber, userData) => {
  const users = readUsers();
  const index = users.findIndex(user => user.phoneNumber === phoneNumber);
  
  if (index === -1) throw new Error('ไม่พบผู้ใช้');

  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };

  writeUsers(users);
  return users[index];
};

// ค้นหาผู้ใช้ด้วยเบอร์โทร
export const findUserByPhone = (phoneNumber) => {
  const users = readUsers();
  return users.find(user => user.phoneNumber === phoneNumber);
};

// ลบผู้ใช้
export const deleteUser = (phoneNumber) => {
  const users = readUsers();
  const filteredUsers = users.filter(user => user.phoneNumber !== phoneNumber);
  writeUsers(filteredUsers);
  return true;
};

// Customer Methods
export const registerCustomer = (customerData) => {
  return addUser({
    ...customerData,
    role: 'customer',
    status: 'active'
  });
};

export const updateCustomerProfile = (phoneNumber, profileData) => {
  return updateUser(phoneNumber, {
    ...profileData,
    role: 'customer'
  });
};

// Driver Methods
export const registerDriver = (driverData) => {
  return addUser({
    ...driverData,
    role: 'driver',
    status: 'pending'
  });
};

export const updateDriverProfile = (phoneNumber, profileData) => {
  return updateUser(phoneNumber, {
    ...profileData,
    role: 'driver'
  });
};

export const getDriversByStatus = (status) => {
  const users = readUsers();
  return users.filter(user => user.role === 'driver' && user.status === status);
};

export const updateDriverStatus = (phoneNumber, status) => {
  return updateUser(phoneNumber, { status });
};

// Shared Methods
export const validateUser = (phoneNumber) => {
  const user = findUserByPhone(phoneNumber);
  return {
    exists: !!user,
    role: user?.role,
    status: user?.status
  };
};