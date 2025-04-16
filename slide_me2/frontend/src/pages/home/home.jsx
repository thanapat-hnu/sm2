import { useState } from 'react';

import Map from '../map/map';
import Locat from '../local/local';
import Confirm from '../buttonconfirm/confirm';
import Options from '../options/options';
import Pin from '../pin/pin';

import { useMapEvent } from 'react-leaflet'


import './home.css'
import Finish from '../Finish/Finish';

function Home() {

    const [button, setButton] = useState('');
    const [local, setLocal] = useState({
        lat: 13.85474203031968,
        lng: 100.58533787727356
    });
    // จุดรับงาน
    const [readLocal, setReadLocal] = useState({
        lat: 0,
        lng: 0
    });
    // จุดส่งงาน
    const [readLocalB, setReadLocalB] = useState({
        lat: 0,
        lng: 0
    });

    // ประเภทรถ
    const [options, setOptions] = useState('');
    // ประเภทบริการ
    const [service, setService] = useState(false);
    const [showService, setShowService] = useState(false);
    console.log(local.lat, local.lng);

    const [showData, setShowData] = useState(new Date());
    const [getData, setGetData] = useState('');

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const MapEvents = () => {

        const map = useMapEvent('move', () => {
            const newCenter = map.getCenter();
            setLocal({
                lat: newCenter.lat,
                lng: newCenter.lng
            })
            console.log(local.lat, local.lng);
        })
        return null;
    }

    const [buttonText, setButtonText] = useState('ค้นหาผู้ให้บริการ')

    const [showMarker, setShowMarker] = useState(null);

    const [showfinish, setShowFinish] = useState(null);

    const [showMenu, setShowMenu] = useState(true);

    const [showButton, setShowButton] = useState(true);

    const [showDiv, setShowDiv] = useState(false);

    const [mapHeight, setMapHeight] = useState('774px');

    const [payment, setPayment] = useState(false);

    const [towTruckData, setTowTruckData] = useState([]);

    const [name, setName] = useState('บริการลากจูดเร็วทันใจ');
    const [carType, setCarType] = useState('Flatbed');
    const [carNumber, setCarNumber] = useState(555);
    const [price, setPrice] = useState(1500);

    const [mid,setMid] = useState(``);
    const [mid2,setMid2] = useState(``);




    return (
        <div className='container-home'>
            <Map
                MapEvents={MapEvents}

                readLocal={readLocal}

                readLocalB={readLocalB}

                showMarker={showMarker}
                setShowMarker={setShowMarker}

                showfinish={showfinish}
                setShowFinish={setShowFinish}

                showMenu={showMenu}
                setShowMenu={setShowMenu}

                setShowButton={setShowButton}

                mapHeight={mapHeight}
                setMapHeight={setMapHeight}

                towTruckData={towTruckData}
                setTowTruckData={setTowTruckData}

                name={name}
                carType={carType}
                carNumber={carNumber}
                price={price}

            />
            <Locat
                button={button}
                setButton={setButton}

                readLocal={readLocal}

                readLocalB={readLocalB}

                options={options}

                service={service}
                setService={setService}

                showData={showData}
                setShowData={setShowData}

                getData={getData}
                setGetData={setGetData}

                formatDate={formatDate}

                showService={showService}
                setShowService={setShowService}

                buttonText={buttonText}

                showMenu={showMenu}
                setShowMenu={setShowMenu}

                setMid={setMid}
                setMid2={setMid2}
            />
            {/* <Calendars

            /> */}
            <Options
                button={button}
                setButton={setButton}
                setOptions={setOptions}

                towTruckData={towTruckData}
                setTowTruckData={setTowTruckData}
            />
            <Confirm
                local={local}

                button={button}
                setButton={setButton}

                readLocal={readLocal}
                setReadLocal={setReadLocal}

                readLocalB={readLocalB}
                setReadLocal2={setReadLocalB}

                options={options}
                setOptions={setOptions}

                service={service}
                setService={setService}

                getData={getData}
                setGetData={setGetData}

                showData={showData}

                showService={showService}
                setShowService={setShowService}

                buttonText={buttonText}
                setButtonText={setButtonText}

                showMarker={showMarker}
                setShowMarker={setShowMarker}

                setShowFinish={setShowFinish}

                showButton={showButton}
                setShowButton={setShowButton}
            />

            <Pin
                button={button}
                setButton={setButton}
            />
            <Finish
                showfinish={showfinish}
                setShowFinish={setShowFinish}

                mapHeight={mapHeight}
                setMapHeight={setMapHeight}

                payment={payment}
                setPayment={setPayment}

                name={name}
                carType={carType}
                carNumber={carNumber}
                price={price}
                setPrice={setPrice}
                
                mid={mid}
                mid2={mid2}
            />
        </div >
    );
}

export default Home;
