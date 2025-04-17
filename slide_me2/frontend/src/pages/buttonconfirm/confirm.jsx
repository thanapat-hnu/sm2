import { useState } from 'react';
import './confirm.css';

function Confirm({
  button,
  setButton,
  local,
  readLocal,
  setReadLocal,
  readLocalB,
  setReadLocal2,
  options,
  setOptions,
  service,
  setService,
  showService,
  setShowService,
  buttonText,
  setButtonText,
  showMarker,
  setShowMarker,
  setShowfinish,
  showButton,
  setShowButton,
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const isButtonVisible =
    button === 'a' || button === 'b' || (showService && service);

  const isDataValid =
    readLocal.lat !== 0 &&
    readLocal.lng !== 0 &&
    readLocalB.lat !== 0 &&
    readLocalB.lng !== 0 &&
    options !== '' &&
    showButton;

  const shouldDisplay = isButtonVisible || isDataValid;

  const handleConfirm = () => {
    if (button === 'a') {
      setReadLocal(local);
      console.log('✅ ตำแหน่งต้นทาง:', local);
      setButton('');
    } else if (button === 'b') {
      setReadLocal2(local);
      console.log('✅ ตำแหน่งปลายทาง:', local);
      setButton('');
    } else if (showService) {
      setShowService(false);
    }

    if (isDataValid && !showService && button !== 'a' && button !== 'b') {
      setButtonText('...');
    }

    if (buttonText === '...') {
      setShowMarker(true);
    }
  };

  const handleCancel = () => {
    setButtonText('ค้นหาผู้ให้บริการ');
    setShowMarker(false);
    setShowfinish(false);
    setShowCancelPopup(false);
  };

  return (
    <div className="container-button">
      {/* ปุ่มยืนยัน */}
      <button
        className="button-d"
        onClick={handleConfirm}
        style={shouldDisplay ? { display: 'flex' } : { display: 'none' }}
      >
        {isDataValid && !showService && button !== 'a' && button !== 'b'
          ? buttonText
          : 'ยืนยัน'}
      </button>

      {/* ปุ่มแสดงป๊อปอัพ "ยกเลิก" */}
      <button
        className="button-e"
        onClick={() => setShowCancelPopup(!showCancelPopup)}
        style={
          buttonText === '...' && isDataValid
            ? { display: 'flex' }
            : { display: 'none' }
        }
      >
        <i className="bi bi-exclamation-circle"></i>
      </button>

      {/* ป๊อปอัพยืนยันการยกเลิก */}
      <div
        className="container-i"
        style={{ display: showCancelPopup ? 'flex' : 'none' }}
      >
        <button className="i1" onClick={() => setShowCancelPopup(false)} />
        <div className="i2">
          <div className="i3">
            <button className="b2" onClick={handleCancel}>
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
