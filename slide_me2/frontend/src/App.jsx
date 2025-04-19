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
import ChatList from './pages/chat/chatlist'; // ใช้ ChatList แทน Chat
import ChatRoom from './pages/chat/chatroom';
import Payment from './Payment/Payment';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className='container-app'>
      <BrowserRouter basename="/slide_me2">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profileedit />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/inputphone" element={<Inputphone />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/driver/personal" element={<RegisterDriverPersonal />} />
          <Route path="/register/driver/vehicle" element={<RegisterDriverVehicle />} />
          <Route path="/create" element={<Create />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/chatlist" element={<ChatList />} />
          <Route path="/chatroom" element={<ChatRoom />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
