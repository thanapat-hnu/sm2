import { useEffect, useRef, useState } from 'react';
import './map.css';

function Map() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [originMarker, setOriginMarker] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSelectingOrigin, setIsSelectingOrigin] = useState(true);
  const [originText, setOriginText] = useState('');
  const [destText, setDestText] = useState('');
  const API_KEY = '1b4327452cc20e14a37e40cc130bd03a';

  // Load Longdo Map script + init
  useEffect(() => {
    const loadMap = () => {
      const mapInstance = new window.longdo.Map({
        placeholder: mapRef.current,
        language: 'th',
        zoom: 15
      });
      setMap(mapInstance);
    };

    if (window.longdo && window.longdo.Map) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `http://api.longdo.com/map/?key=${API_KEY}`;
      script.async = true;
      script.onload = () => {
        if (window.longdo && window.longdo.Map) {
          loadMap();
        }
      };
      document.body.appendChild(script);

      return () => {
        if (script && script.parentNode === document.body) {
          document.body.removeChild(script); // ✅ ป้องกัน error
        }
      };
    }
  }, []);

  const searchLocation = (keyword) => {
    if (!keyword.trim() || !map) return;

    // ใช้ Promise เพื่อให้แน่ใจว่า API พร้อมใช้งาน
    const checkAPI = () => {
      return new Promise((resolve) => {
        const check = () => {
          if (window.longdo && window.longdo.Map) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    };

    checkAPI().then(() => {
      // ใช้ Search Service แทน Location API
      const search = new window.longdo.SearchService();
      search.search(keyword, {
        area: true, // ค้นหาสถานที่
        address: true, // ค้นหาที่อยู่
        locality: true, // ค้นหาตำบล/อำเภอ/จังหวัด
        limit: 5, // จำกัดผลลัพธ์
      }, (result) => {
        if (result && result.data) {
          // จัดรูปแบบผลลัพธ์
          const formattedResults = result.data.map(place => ({
            name: place.name,
            address: place.address,
            lon: place.lon,
            lat: place.lat
          }));
          setSuggestions(formattedResults);
        }
      });
    });
  };

  // ปรับปรุง handle input change ด้วย debounce
  const debounceSearch = (value) => {
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    window.searchTimeout = setTimeout(() => {
      searchLocation(value);
    }, 300);
  };

  const handleSuggestionClick = (place) => {
    const location = {
      lon: place.lon,
      lat: place.lat
    };

    if (isSelectingOrigin) {
      if (originMarker) {
        map.Overlays.remove(originMarker);
      }
      const marker = new window.longdo.Marker(location, {
        title: 'ต้นทาง',
        detail: place.name
      });
      map.Overlays.add(marker);
      setOriginMarker(marker);
      setOriginText(place.name);
    } else {
      if (destMarker) {
        map.Overlays.remove(destMarker);
      }
      const marker = new window.longdo.Marker(location, {
        title: 'ปลายทาง',
        detail: place.name
      });
      map.Overlays.add(marker);
      setDestMarker(marker);
      setDestText(place.name);
    }

    setSearchQuery('');
    setSuggestions([]);
    map.location(location, true);
  };

  const showRoute = () => {
    if (!originMarker || !destMarker) {
      alert('กรุณาเลือกจุดต้นทางและปลายทาง');
      return;
    }

    map.Route.clear();
    map.Route.add(originMarker.location());
    map.Route.add(destMarker.location());
    map.Route.search();
  };

  return (
    <div className="map-container">
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder={isSelectingOrigin ? "ค้นหาต้นทาง" : "ค้นหาปลายทาง"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debounceSearch(e.target.value);
            }}
          />
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((place, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(place)}
                >
                  <div className="suggestion-title">{place.name}</div>
                  <div className="suggestion-address">{place.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="selected-locations">
          <div className="location-item" onClick={() => setIsSelectingOrigin(true)}>
            <span className="location-label">ต้นทาง:</span>
            <span className="location-text">{originText || 'กรุณาเลือกต้นทาง'}</span>
          </div>
          <div className="location-item" onClick={() => setIsSelectingOrigin(false)}>
            <span className="location-label">ปลายทาง:</span>
            <span className="location-text">{destText || 'กรุณาเลือกปลายทาง'}</span>
          </div>
        </div>

        {originMarker && destMarker && (
          <button className="route-button" onClick={showRoute}>
            แสดงเส้นทาง
          </button>
        )}
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Map;