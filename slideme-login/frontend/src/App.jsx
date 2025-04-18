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

function App() {
  const location = useLocation();
  
  const hideNavbarRoutes = ['/', '/login', '/register', '/register-vehicle'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <RegistrationProvider>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-vehicle" element={<RegisterVehicle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/main" element={<Main />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:customerId" element={<ChatRoom />} />
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