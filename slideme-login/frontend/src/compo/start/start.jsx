import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './start.css';

const Start = () => {
  const navigate = useNavigate();

  const pageTransition = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  };

  return (
    <motion.div
      className="start-container-STT"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div 
        className="logo-container-STT"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="logo-text-STT">LOGO</span>
      </motion.div>
      
      <motion.div 
        className="card-container-STT"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-header-STT">
          <h1 className="card-title-STT">Welcome</h1>
          <p className="card-subtitle-STT">Please choose an option to continue</p>
        </div>

        <div className="button-container-STT">
          <button
            onClick={() => navigate('/login')}
            className="login-button-STT"
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="register-button-STT"
          >
            Register
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Start;