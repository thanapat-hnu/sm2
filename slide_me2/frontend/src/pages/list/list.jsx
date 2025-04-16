import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';

const List = () => {
    const navigate = useNavigate();
    const [slidePage, setSlidePage] = useState(false);
    const [towingData, setTowingData] = useState([]); // เก็บข้อมูล JSON

    // ฟังก์ชันสุ่มวันที่, เดือน, ปี และเวลา
    const getRandomDateTime = () => {
        const startDate = new Date(2023, 0, 1); // วันที่เริ่มต้น (1 ม.ค. 2023)
        const endDate = new Date(2023, 11, 31); // วันที่สิ้นสุด (31 ธ.ค. 2023)
        const randomDate = new Date(
            startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
        );

        const day = randomDate.getDate().toString().padStart(2, '0');
        const month = (randomDate.getMonth() + 1).toString().padStart(2, '0'); // เดือนเริ่มต้นที่ 0
        const year = randomDate.getFullYear();

        const hour = Math.floor(Math.random() * 24); // สุ่มชั่วโมง 0-23
        const minute = Math.floor(Math.random() * 60); // สุ่มนาที 0-59

        return `${day}/${month}/${year} ${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`; // รูปแบบ DD/MM/YYYY HH:MM
    };

    // โหลดข้อมูลจากไฟล์ data.json
    useEffect(() => {
        fetch('./data.json')
            .then((response) => response.json())
            .then((data) => {
                // เพิ่มวันที่และเวลาแบบสุ่มให้แต่ละรายการ
                const updatedData = data.map((item) => ({
                    ...item,
                    randomDateTime: getRandomDateTime(),
                }));
                setTowingData(updatedData);
            })
            .catch((error) => console.error('Error loading data:', error));
    }, []);

    const handleHistoryClick = () => {
        setSlidePage(true);
        setTimeout(() => {
            navigate('/history');
        }, 500);
    };

    return (
        <div className={`list-container ${slidePage ? 'slide-in-left' : ''}`}>
            <header className="list-header">
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>
                    รายการ
                    <i className="bi bi-file-earmark-text" style={{ fontSize: '24px', marginLeft: '8px' }}></i>
                </span>

                <button
                    className="history-btn"
                    onClick={handleHistoryClick}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <i className="bi bi-clock" style={{ marginRight: '8px', fontSize: '16px' }}></i>
                    ประวัติ
                </button>
            </header>

            <span style={{ fontSize: '18px' }}>รายการล่าสุด</span>
            {/* แสดงรายการข้อมูล */}
            <section className="latest-section">
                {towingData.slice(0, 2).map((item) => (
                    <div className="card" key={item.providerId}>
                        <div className="card-row">
                            <div className="card-icon green-bg">
                                <i className="bi bi-truck"></i>
                            </div>
                            <div className="card-info">
                                <p className="card-date">{item.randomDateTime || 'ไม่ระบุวันที่'}</p>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.providerName}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-geo-alt-fill red" style={{ fontSize: '14px' }}></i>
                                    <p>ต้นทาง: {item.locations.origin.address}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-geo-alt-fill green" style={{ fontSize: '14px' }}></i>
                                    <p>ปลายทาง: {item.locations.destination.address}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-car-front" style={{ fontSize: '14px' }}></i>
                                    <p>ประเภท: {item.towTruckType}</p>
                                </div>

                                <p className={`card-status green-text`}>กำลังดำเนินการ...</p>
                            </div>
                            <div className="card-price">฿ {item.price}</div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default List;
