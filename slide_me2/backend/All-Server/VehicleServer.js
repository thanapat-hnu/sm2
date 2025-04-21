import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define JSON file path
const VEHICLE_FILE = path.join(__dirname, '../User/DriverVehicle/Vehicle.json');

// Ensure JSON file exists
const ensureVehicleFile = () => {
  const dir = path.dirname(VEHICLE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(VEHICLE_FILE)) {
    fs.writeFileSync(VEHICLE_FILE, JSON.stringify([]));
  }
};

// Read vehicle data
export const readVehicles = () => {
  ensureVehicleFile();
  return JSON.parse(fs.readFileSync(VEHICLE_FILE, 'utf8'));
};

// Write vehicle data
export const writeVehicles = (vehicles) => {
  fs.writeFileSync(VEHICLE_FILE, JSON.stringify(vehicles, null, 2));
};

// Add new vehicle
export const addVehicle = (vehicleData) => {
  const vehicles = readVehicles();
  const newVehicle = {
    id: vehicles.length + 1,
    ...vehicleData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  vehicles.push(newVehicle);
  writeVehicles(vehicles);
  return newVehicle;
};