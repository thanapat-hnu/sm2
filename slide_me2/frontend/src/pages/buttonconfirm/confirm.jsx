import { useState } from 'react';

import './confirm.css'

function Confirm({ button, setButton, local, readLocal, setReadLocal,
    readLocalB, setReadLocal2, options, setOptions, service, setService, showService, setShowService,
    buttonText, setButtonText, showMarker, setShowMarker, setShowfinish, showButton, setShowButton,
}) {

    const [i, setI] = useState(false)

    const isButtonVisible = button === 'a' || button === 'b' || (showService === true && service === true);

    const isDataValid =
        (
            readLocal.lat !== 0 &&
            readLocal.lng !== 0 &&
            readLocalB.lat !== 0 &&
            readLocalB.lng !== 0 &&
            options !== '' &&
            showButton === true
        )

    const shouldDisplay = isButtonVisible || isDataValid;

    return (
        <div className='container-button'>

            <button className='button-d'
                onClick={() => {
                    if (button === 'a') {
                        setReadLocal(local)
                        console.log('readLocal = ' + 'lat : ' + readLocal.lat + ' |' + ' lng : ' + readLocal.lng);
                        setButton('');

                    } else if (button === 'b') {
                        setReadLocal2(local)
                        console.log('readLocal2 = ' + 'lat : ' + readLocalB.lat + ' |' + ' lng : ' + readLocalB.lng);
                        setButton('');

                    } else if (showService === true) {
                        setShowService(false)
                    }

                    if (isDataValid && showService === false && button !== 'a' && button !== 'b') {
                        setButtonText('...')
                    }

                    if (buttonText === '...') {
                        setShowMarker(true)
                    }

                    // console.log('local = ' + 'lat : ' + local.lat + ' |' + ' lng : ' + local.lng);


                }
                }
                style={shouldDisplay ? { display: 'flex' } : { display: 'none' }}
            >
                {isDataValid && showService === false && button !== 'a' && button !== 'b' ? buttonText : 'ยืนยัน'}
            </button>

            <button
                onClick={() => {
                    setI(!i)
                }}
                style={buttonText === '...' && isDataValid ? { display: 'flex' } : { display: 'none' }}
                className='button-e'
            >
                <i className='bi bi-exclamation-circle'></i>
            </button>


            <div
                className='container-i'
                style={i ? { display: 'flex' } : { display: 'none' }}
            >
                <button
                    onClick={() => {
                        setI(!i)
                    }}
                    className='i1'
                >

                </button>
                <div className='i2'>
                    <div className='i3'>
                        <button
                            onClick={() => {
                                setButtonText('ค้นหาผู้ให้บริการ')
                                setI(!i)
                                setShowMarker(false)
                                setShowfinish(false)

                            }}
                            className='b2'

                        >ยกเลิก</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirm;