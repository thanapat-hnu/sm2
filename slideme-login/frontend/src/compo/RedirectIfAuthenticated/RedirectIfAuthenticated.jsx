import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectIfAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/main'); // ถ้ามีข้อมูลผู้ใช้ใน localStorage ให้เปลี่ยนเส้นทางไปหน้า main
    }
  }, [navigate]);

  return null; // ไม่ต้อง render อะไร
}

export default RedirectIfAuthenticated;
