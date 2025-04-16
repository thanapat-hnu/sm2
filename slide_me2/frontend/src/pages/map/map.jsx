import { useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";

import './map.css';
import Markers from '../markers/markers';

function Map({ MapEvents, readLocal,
    readLocalB, showMarker, setShowMarker, showfinish,
    setShowFinish, showMenu, setShowMenu, setShowButton,
    mapHeight, setMapHeight, towTruckData, setTowTruckData,
    name, carType, carNumber, price
}) {

    const [center, setCenter] = useState({
        lat: 13.85474203031968,
        lng: 100.58533787727356
    });

    const [isMoving, setIsMoving] = useState(false); // สถานะการเคลื่อนที่ของ marker
    const markerRef = useRef(null); // ใช้ useRef เพื่อเก็บ marker ที่สร้าง

    const Line = () => {
        const map = useMap();

        // ตรวจสอบค่าของ startLatLng และ endLatLng
        const startLatLng =
            readLocal && readLocal.lat !== 0 && readLocal.lng !== 0
                ? L.latLng(readLocal.lat, readLocal.lng)
                : null;
        const endLatLng =
            readLocalB && readLocalB.lat !== 0 && readLocalB.lng !== 0
                ? L.latLng(readLocalB.lat, readLocalB.lng)
                : null;

        // if (startLatLng) {
        //     if (markerRef.current) {
        //         // ถ้ามี marker อยู่แล้ว ให้เปลี่ยนตำแหน่ง
        //         markerRef.current.setLatLng(startLatLng);
        //     } else {
        //         // ถ้ายังไม่มี marker ให้สร้างใหม่
        //         markerRef.current = L.marker(startLatLng).addTo(map);
        //     }
        // }

        // ถ้ามีทั้ง start และ end จะเพิ่มเส้นทาง
        if (startLatLng && endLatLng) {
            L.Routing.control({
                waypoints: [startLatLng, endLatLng],
                lineOptions: { styles: [{ color: '#14BF61', opacity: 0.7, weight: 5 }] },
                createMarker: () => null, // ไม่สร้าง marker จาก Routing
            })
                // .on('routesfound', function (e) {
                //     console.log('Routes found:', e);

                //     // ถ้ามี marker และปุ่มถูกกด (isMoving = true) ให้ทำการเคลื่อนที่ marker
                //     if (markerRef.current && isMoving) {
                //         e.routes[0].coordinates.forEach((coord, index) => {
                //             setTimeout(() => {
                //                 markerRef.current.setLatLng([coord.lat, coord.lng]);
                //             }, 100 * index);
                //         });
                //     }
                // })
                .addTo(map);
        }

        return null;
    };

    const handleMoveButtonClick = () => {
        setIsMoving(true); // เริ่มต้นการเคลื่อนที่ของ marker
    };

    return (
        <div>
            {/* <button style={{ position: 'absolute', top: '0', right: '0', zIndex: '1001' }} onClick={handleMoveButtonClick}>Start Moving</button> */}
            <MapContainer
                key={mapHeight}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '390px',
                    height: mapHeight
                }}
                center={[center.lat, center.lng]}
                zoom={17}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
                <Markers
                    readLocal={readLocal}
                    readLocalB={readLocalB}
                    showMarker={showMarker}
                    setShowMarker={setShowMarker}
                    showfinish={showfinish}
                    setShowFinish={setShowFinish}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    setShowButton={setShowButton}
                    setMapHeight={setMapHeight}

                    towTruckData={towTruckData}
                    setTowTruckData={setTowTruckData}

                    name={name}
                    carType={carType}
                    carNumber={carNumber}
                    price={price}
                />
                <Line />
            </MapContainer>
        </div>
    );
}

export default Map;
