import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนด paths สำหรับไฟล์ JSON
const PATHS = {
  personal: path.join(__dirname, '../User/DriverPersonal/Personal.json'),
  vehicle: path.join(__dirname, '../User/DriverVehicle/Vehicle.json')
};

// สร้างไฟล์ JSON ถ้ายังไม่มี
const ensureJsonFile = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
};

// อ่านข้อมูลจากไฟล์ JSON
export const readDriverData = (type) => {
  ensureJsonFile(PATHS[type]);
  return JSON.parse(fs.readFileSync(PATHS[type], 'utf8'));
};

// เขียนข้อมูลลงไฟล์ JSON
export const writeDriverData = (type, data) => {
  ensureJsonFile(PATHS[type]);
  fs.writeFileSync(PATHS[type], JSON.stringify(data, null, 2));
};

// เพิ่มข้อมูลส่วนตัวคนขับ
export const addDriverPersonal = (data) => {
  const drivers = readDriverData('personal');
  const newDriver = {
    id: drivers.length + 1,
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  drivers.push(newDriver);
  writeDriverData('personal', drivers);
  return newDriver;
};

// เพิ่มข้อมูลรถคนขับ
export const addDriverVehicle = (data) => {
  const vehicles = readDriverData('vehicle');
  const newVehicle = {
    id: vehicles.length + 1,
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  vehicles.push(newVehicle);
  writeDriverData('vehicle', vehicles);
  return newVehicle;
};