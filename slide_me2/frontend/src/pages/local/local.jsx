import React, { useState, useEffect } from "react";
import Calendars from "../calendar/calendar";
import "./local.css";
import axios from "axios";

function Locat({
    button,
    setButton,
    readLocal,
    readLocalB,
    options,
    service,
    setService,
    showData,
    setShowData,
    getData,
    setGetData,
    formatDate,
    showService,
    setShowService,
    buttonText,
    showMenu,
    setShowMenu,

}) {
    const [locationDetails, setLocationDetails] = useState({
        name: "ตำแหน่งต้นทาง",
        road: "",
        soi: "",
    });
    const [locationDetailsB, setLocationDetailsB] = useState({
        name: "ตำแหน่งปลายทาง",
        road: "",
        soi: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingB, setIsLoadingB] = useState(false);


    // ฟังก์ชันดึงข้อมูลตำแหน่ง
    const getLocationDetails = async (lat, lng) => {
        try {
            if (isNaN(lat) || isNaN(lng)) {
                return {
                    name: "พิกัดไม่ถูกต้อง",
                    road: "พิกัดไม่ถูกต้อง",
                    soi: "พิกัดไม่ถูกต้อง",
                };
            }

            const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: {
                    format: "json",
                    lat: lat,
                    lon: lng,
                    "accept-language": "th", // ขอข้อมูลภาษาไทย
                },
            });

            const address = response.data.address || {};
            return {
                name: address.neighbourhood || address.suburb || address.city || "ไม่ทราบพื้นที่",
                road: address.road || "ไม่ทราบถนน",
                soi: address.suburb || address.neighbourhood || "ไม่ทราบซอย",
            };
        } catch (error) {
            console.error("Error fetching location:", error);
            return {
                name: "ไม่สามารถดึงข้อมูลได้",
                road: "ไม่ทราบถนน",
                soi: "ไม่ทราบซอย",
            };
        }
    };

    // โหลดข้อมูลตำแหน่งต้นทางเมื่อ readLocal เปลี่ยนแปลง
    useEffect(() => {
        const fetchData = async () => {
            if (readLocal.lat !== 0 && readLocal.lng !== 0) {
                setIsLoading(true);
                const details = await getLocationDetails(readLocal.lat, readLocal.lng);
                setLocationDetails(details);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [readLocal.lat, readLocal.lng]);

    // โหลดข้อมูลตำแหน่งปลายทางเมื่อ readLocalB เปลี่ยนแปลง
    useEffect(() => {
        const fetchData = async () => {
            if (readLocalB.lat !== 0 && readLocalB.lng !== 0) {
                setIsLoadingB(true);
                const details = await getLocationDetails(readLocalB.lat, readLocalB.lng);
                setLocationDetailsB(details);
                setIsLoadingB(false);
            }
        };

        fetchData();
    }, [readLocalB.lat, readLocalB.lng]);

    const [showDev, setShowDev] = useState(true);


    return (
        <div
            style={showMenu ? { display: "grid" } : { display: "none" }}
            className="container-locat"
        >
            {/* ตำแหน่งต้นทาง */}
            <button
                onClick={() => {
                    setButton(button === "a" ? "" : "a")
                }}
                className="button"
                style={
                    button === "a"
                        ? { border: "1px solid #14BF61" }
                        : { border: "none" }
                }
                disabled={buttonText === "..."}
            >
                <div className="bg-i bg-red">
                    <i className="bi bi-geo-alt-fill red"></i>
                </div>
                <h4 className="h4">
                    {readLocal.lat === 0 && readLocal.lng === 0
                        ? "ตำแหน่งต้นทาง"
                        : isLoading
                            ? "กำลังโหลดข้อมูล..."
                            : `${locationDetails.name}, ถนน: ${locationDetails.road}`}
                </h4>
            </button>

            {/* ตำแหน่งปลายทาง */}
            <button
                onClick={() => {
                    setButton(button === "b" ? "" : "b")
                }}
                className="button"
                style={
                    button === "b"
                        ? { border: "1px solid #14BF61" }
                        : { border: "none" }
                }
                disabled={buttonText === "..."}
            >
                <div className="bg-i bg-green">
                    <i className="bi bi-geo-alt-fill green"></i>
                </div>
                <h4 className="h4">
                    {readLocalB.lat === 0 && readLocalB.lng === 0
                        ? "ตำแหน่งปลายทาง"
                        : isLoadingB
                            ? "กำลังโหลดข้อมูล..."
                            : `${locationDetailsB.name}, ถนน: ${locationDetailsB.road}`}
                </h4>
            </button>

            {/* ประเภทรถ */}
            <div className="sub-container-box">
                <button
                    className="button-b"
                    onClick={() => setButton(button === "c" ? "" : "c")}
                    disabled={buttonText === "..."}
                >
                    <div className="bg-i bg-green">
                        <i className="bi bi-car-front-fill green"></i>
                    </div>
                    <h4 className="h4">{options === "" ? "เลือกประเภทรถ" : options}</h4>
                </button>

                {/* เวลาที่ให้บริการ */}
                <button
                    className="button-c"
                    onClick={() => {
                        if (service === true) {
                            setService(!service);
                        } else {
                            setShowService(!showService);
                            setService(!service);
                        }
                    }}
                    disabled={buttonText === "..."}
                >
                    {service ? formatDate(showData) : "ตอนนี้"}
                    <i className="bi bi-chevron-compact-down"></i>
                </button>
            </div>

            <button
                style={showDev ? { display: "block" } : { display: "none" }}
                onClick={() => setShowDev(false)}
                type="button"
                className="btn btn-primary"
            >
                Developer
            </button>

            <div
                style={showDev === false ? { display: "flex" } : { display: "none" }}
                className="bbbb"
            >
                <button
                    onClick={() => setShowDev(true)}
                >X</button>
                <img src="../public/b.png" alt="" />
                <h4>66031036</h4>
                <h4>นาย ธนภัทร หนูบุญมี</h4>
                <p>home, map(leaflet), calender,<br /> ค้นหาเส้นทาง (react leaflet routing machine)<hr /></p>
                <img src="../public/m.png" alt="" />
                <h4>66002022</h4>
                <h4>นายคฑาวุธ เมืองพรหม</h4>
                <p>Login, Register, Profile<hr /></p>
                <img src="../public/k.png" alt="" />
                <h4>66073816</h4>
                <h4>นายอภิวิชญ์ สายแสน</h4>
                <p>List, History, Chat<hr /></p>
                <img src="../public/g.png" alt="" />
                <h4>66080435</h4>
                <h4>นายศุภวิช​ญ์ ขะจัดโรคา</h4>
                <p>Payment ทั้งหมด</p>
            </div>

            {/* ปฏิทิน */}
            <div>
                <Calendars
                    service={service}
                    setService={setService}
                    showData={showData}
                    setShowData={setShowData}
                    formatDate={formatDate}
                    showService={showService}
                    setShowService={setShowService}
                />
            </div>
        </div>
    );
}

export default Locat;
