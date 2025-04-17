import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import Start from './compo/start/start';
import Login from './compo/login/login';
import Register from './compo/register/registerPersonal';  // Updated import
import RegisterVehicle from './compo/register/registerVehicle';  // New import
import Profile from './compo/profile/profile';
import Main from './compo/main/main';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-vehicle" element={<RegisterVehicle />} />  {/* New route */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;