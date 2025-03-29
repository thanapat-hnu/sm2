import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './page/Login/Login'
import OTP from './page/OTP/OTP';
import Inputphone from './page/inputphone/Inputphone';
import Register from './page/Register/Register';
import Create from './page/Create/Create';
import Profileedit from './page/Profileedit/Profileedit';

function App() {
  return (
    <div className="App-container">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inputphone" element={<Inputphone />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profileedit" element={<Profileedit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
