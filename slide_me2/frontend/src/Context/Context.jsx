import React, { createContext, useContext, useState } from 'react';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    idCard: "",
    birthDate: "",
    phone: "",
    email: "",
    address: "",
    idCardImage: null,
  });

  const [vehicleData, setVehicleData] = useState({
    vehicleType: "",
    licenseNumber: "",
    licenseExpiry: "",
    licenseImage: null,
    carBrand: "",
    carPlate: "",
    carImage: null,
    carRegistrationImage: null,
  });

  const updatePersonalData = (data) => {
    setPersonalData(data);
    // เก็บใน localStorage ด้วย
    localStorage.setItem('driverPersonalData', JSON.stringify(data));
  };

  const updateVehicleData = (data) => {
    setVehicleData(data);
    localStorage.setItem('driverVehicleData', JSON.stringify(data));
  };

  return (
    <RegisterContext.Provider value={{
      personalData,
      vehicleData,
      updatePersonalData,
      updateVehicleData
    }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => useContext(RegisterContext);