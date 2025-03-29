import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profileedit.css';

function Profileedit() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState('./img/profile.png');
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        sex: '',
        email: '',
        number: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // โหลดข้อมูลจาก API แทน localStorage
    useEffect(() => {
        const fetchData = async () => {
            try {
              
                

                const response = await axios.get(`http://localhost:3000/api/get-user-data?phoneNumber=${phoneNumber}`);
                if (response.data.success) {
                    const userData = response.data.userData;
                    setProfileImage(userData.profileImage);
                    setFormData({
                        name: userData.name,
                        lastname: userData.lastname,
                        sex: userData.sex,
                        email: userData.email,
                        number: userData.number,
                    });
                } else {
                    alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
            }
        };

        fetchData();
    }, [navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsEditing(false);

        const phoneNumber = localStorage.getItem('phoneNumber');
        if (!phoneNumber) {
            return alert('ไม่พบเบอร์โทรศัพท์');
        }

        const updatedProfileData = {
            name: formData.name,
            lastname: formData.lastname,
            sex: formData.sex,
            email: formData.email,
            profileImage,
        };

        const actionType = "EDIT";
        try {
            const response = await axios.post('http://localhost:3000/api/update-profile', {
                phoneNumber,
                profileData: updatedProfileData,
                actionType,
            });

            if (response.data.success) {
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="profileedit-container">
            <div className="profileedit-banner">
                <div className="profileedit-welcome">สวัสดี คุณ {formData.name}</div>

                <div className="profile-containers">
                    <label htmlFor="uploadImage">
                        <img src={profileImage} alt="Profile" className="profile-button" />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="uploadImage"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="profileedit-edit">
                    <button className='profileedit-button' onClick={handleEdit}>
                        <img src="./img/pencil.png" alt="" />
                    </button>
                </div>
            </div>

            <div className="form-containers">
                <div className="form-name">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>

                <div className="form-lastname">
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>

                <div className="form-numbercountry">
                    <input
                        type="text"
                        id="country"
                        placeholder="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+66"
                        value={formData.country}
                        readOnly
                    />
                    <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>

                <div className="form-email">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>

                <div className="form-sex">
                    <select
                        className="form-selects"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    >
                        <option value="" disabled >
                            เลือกเพศ
                        </option>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                    </select>
                </div>

                {isEditing && (
                    <div className="form-summit">
                        <button className='btn-summit' onClick={handleSave}>บันทึก</button>
                    </div>
                )}

                <div className="form-logout">
                    <button onClick={handleLogout}>ออกจากระบบ</button>
                </div>
            </div>
        </div>
    );
}

export default Profileedit;