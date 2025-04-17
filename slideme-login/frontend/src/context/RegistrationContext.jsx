import { createContext, useState } from 'react';

export const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    idCardNumber: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    address: "",
    idCardImage: null
  });

  const [vehicleData, setVehicleData] = useState({
    licenseType: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    licenseImage: null,
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    plateNumber: "",
    vehicleImage: null,
    plateImage: null
  });

  return (
    <RegistrationContext.Provider 
      value={{ 
        personalData, 
        setPersonalData, 
        vehicleData, 
        setVehicleData 
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}