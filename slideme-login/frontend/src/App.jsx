import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import Start from './compo/start/start.jsx';
import Login from './compo/login/login.jsx';
import Register from './compo/register/registerPersonal.jsx';
import RegisterVehicle from './compo/register/registerVehicle.jsx';
import Profile from './compo/profile/profile.jsx';
import Main from './compo/main/main.jsx';
import Order from './compo/Order/OrderProcess.jsx';
import Chat from './compo/Chat/Chat.jsx'; // Add Chat import
import { RegistrationProvider } from './context/RegistrationContext.jsx';
import Navbar from './compo/Navbar/Navbar.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-vehicle" element={<RegisterVehicle />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/main" element={<Main />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/chat" element={<Chat />} /> {/* Add Chat route */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();
  
  // Update hideNavbarRoutes to include login
  const hideNavbarRoutes = ['/', '/login', '/register', '/register-vehicle'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <RegistrationProvider>
      <div className="App">
        <AnimatedRoutes />
        {shouldShowNavbar && <Navbar />}
      </div>
    </RegistrationProvider>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}