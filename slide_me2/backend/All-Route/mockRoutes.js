import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนด path สำหรับแต่ละประเภทผู้ใช้
const USER_PATHS = {
  customer: path.join(__dirname, '../User/Customer/customers.json'),
  driverPersonal: path.join(__dirname, '../User/DriverPersonal/drivers.json'),
  driverVehicle: path.join(__dirname, '../User/DriverVehicle/vehicles.json')
};

// ฟังก์ชันตรวจสอบและสร้างไฟล์ JSON ถ้ายังไม่มี
const ensureJsonFile = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
};

// ฟังก์ชันอ่านข้อมูลจากไฟล์ JSON
const readJsonFile = (filePath) => {
  ensureJsonFile(filePath);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// ฟังก์ชันเขียนข้อมูลลงไฟล์ JSON
const writeJsonFile = (filePath, data) => {
  ensureJsonFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API endpoints สำหรับการลงทะเบียน
export const registerCustomer = (req, res) => {
  try {
    const customerData = req.body;
    const customers = readJsonFile(USER_PATHS.customer);
    
    // เพิ่ม ID ให้ลูกค้าใหม่
    customerData.id = customers.length + 1;
    customers.push(customerData);
    
    writeJsonFile(USER_PATHS.customer, customers);
    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", data: customerData });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
};

export const registerDriverPersonal = (req, res) => {
  try {
    const driverData = req.body;
    const drivers = readJsonFile(USER_PATHS.driverPersonal);
    
    // เพิ่ม ID ให้คนขับใหม่
    driverData.id = drivers.length + 1;
    drivers.push(driverData);
    
    writeJsonFile(USER_PATHS.driverPersonal, drivers);
    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", data: driverData });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
};

export const registerDriverVehicle = (req, res) => {
  try {
    const vehicleData = req.body;
    const vehicles = readJsonFile(USER_PATHS.driverVehicle);
    
    // เพิ่ม ID ให้ข้อมูลรถใหม่
    vehicleData.id = vehicles.length + 1;
    vehicles.push(vehicleData);
    
    writeJsonFile(USER_PATHS.driverVehicle, vehicles);
    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", data: vehicleData });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
};