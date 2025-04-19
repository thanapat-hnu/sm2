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
import ChatList from './compo/Chat/ChatList';
import ChatRoom from './compo/Chat/ChatRoom';
import { RegistrationProvider } from './context/RegistrationContext.jsx';
import Navbar from './compo/Navbar/Navbar.jsx';
import ProtectedRoute from './compo/ProtectedRoute/ProtectedRoute.jsx'; // นำเข้า ProtectedRoute
import RedirectIfAuthenticated from './compo/RedirectIfAuthenticated/RedirectIfAuthenticated.jsx'; // นำเข้า RedirectIfAuthenticated

function App() {
  const location = useLocation();
  
  const hideNavbarRoutes = ['/', '/login', '/register', '/register-vehicle'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <RegistrationProvider>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<><RedirectIfAuthenticated /><Start /></>} />
            <Route path="/login" element={<><RedirectIfAuthenticated /><Login /></>} />
            <Route path="/register" element={<><RedirectIfAuthenticated /><Register /></>} />
            <Route path="/register-vehicle" element={<><RedirectIfAuthenticated /><RegisterVehicle /></>} />
            
            {/* ใช้ ProtectedRoute เพื่อป้องกันการเข้าถึงหน้าเหล่านี้ */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
            <Route path="/chat/:customerId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
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
