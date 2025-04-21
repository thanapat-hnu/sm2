// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import './App.css';

import Layout from './layouts/layout/layout';
import Home from './pages/home/home';
import Profileedit from './pages/Profileedit/Profileedit';
import Login from './pages/Login/Login';
import Inputphone from './pages/Inputphone/Inputphone';
import OTP from './pages/OTP/OTP';
import RegisterCustomer from './pages/Register/RegisterCustomer';
import RegisterDriverPersonal from './pages/Register/RegisterDriverPersonal';
import RegisterDriverVehicle from './pages/Register/RegisterDriverVehicle';
import Create from './pages/Create/Create';
import List from './pages/list/list';
import History from './pages/history/history';
import ChatList from './pages/chat/chatlist';
import ChatRoom from './pages/chat/chatroom';

import { RegisterProvider } from './Context/Context';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');
  const isVerified = localStorage.getItem('isVerified');

  console.log('ProtectedRoute check:', { token, role, isVerified });

  // แก้ไขเงื่อนไขการตรวจสอบ role
  if (role === 'driver' && !allowedRoles?.includes('driver')) {
    console.log('Driver attempting to access unauthorized route');
    return <Navigate to="/driver/home" />;
  }

  // คงเงื่อนไขการตรวจสอบ token และ verification ไว้
  if (!token || !isVerified) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <RegisterProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/inputphone" element={<Inputphone />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/driver/personal" element={<RegisterDriverPersonal />} />
          <Route path="/register/driver/vehicle" element={<RegisterDriverVehicle />} />

          {/* Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']}><Layout /></ProtectedRoute>}>
            <Route path="/home" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profileedit />} />
            <Route path="/chatlist" element={<ChatList />} />
            <Route path="/chatroom" element={<ChatRoom />} />
          </Route>

          {/* Driver routes */}
          <Route element={<ProtectedRoute allowedRoles={['driver']}><Layout /></ProtectedRoute>}>
            <Route path="/driver/home" element={<Home />} />
            <Route path="/driver/create" element={<Create />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </RegisterProvider>
  );
}

export default App;
