import { useEffect, useRef } from 'react';

function LongdoMap({
  readLocal,
  readLocalB,
  showMarker,
  setLocal,
  mapHeight,
  towTruckData,
  name,
  carType,
  carNumber,
  price,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    const checkAndCreateMap = () => {
      if (window.longdo && window.longdo.Map) {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const map = new window.longdo.Map({
          placeholder: mapElement,
          language: 'th',
        });

        // ✅ ซ่อนหมุดเล็งตรงกลาง
        map.Ui.Crosshair.visible(false);

        map.location({ lat: 13.85474203031968, lon: 100.58533787727356 });

        map.Event.bind('ready', () => {
          console.log('✅ Longdo Map Ready');

          map.Event.bind('location', () => {
            const loc = map.location();
            setLocal?.({ lat: loc.lat, lng: loc.lon });
          });

          if (readLocal?.lat) {
            const markerA = new window.longdo.Marker({
              lat: readLocal.lat,
              lon: readLocal.lng,
            });
            map.Overlays.add(markerA);
          }

          if (readLocalB?.lat) {
            const markerB = new window.longdo.Marker({
              lat: readLocalB.lat,
              lon: readLocalB.lng,
            });
            map.Overlays.add(markerB);
          }

          if (readLocal?.lat && readLocalB?.lat) {
            map.Route.add({ lat: readLocal.lat, lon: readLocal.lng });
            map.Route.add({ lat: readLocalB.lat, lon: readLocalB.lng });
            map.Route.search();
          }
        });

        mapRef.current = map;
      } else {
        setTimeout(checkAndCreateMap, 200);
      }
    };

    checkAndCreateMap();
  }, [readLocal, readLocalB, showMarker]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: mapHeight || '100vh',
        border: '1px solid #ccc',
        zIndex: 1,
      }}
    />
  );
}

export default LongdoMap;
