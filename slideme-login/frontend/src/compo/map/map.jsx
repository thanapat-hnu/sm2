import { useEffect, useRef, useState } from 'react';
import './map.css';

function Map() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [originMarker, setOriginMarker] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSearch, setActiveSearch] = useState(null); // 'origin' or 'destination'
  const [originText, setOriginText] = useState('');
  const [destText, setDestText] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      setIsApiLoaded(true); // Set API as loaded
    };

    // Check if API is already loaded
    if (window.longdo && window.longdo.Map) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `http://api.longdo.com/map/?key=${API_KEY}`;
      script.async = true;
      script.onload = () => {
        // Wait for the API to be fully initialized
        const checkAPI = setInterval(() => {
          if (window.longdo && window.longdo.Map) {
            clearInterval(checkAPI);
            loadMap();
          }
        }, 100);
      };
      document.body.appendChild(script);

      return () => {
        if (script && script.parentNode === document.body) {
          document.body.removeChild(script); // ✅ ป้องกัน error
        }
      };
    }
  }, []);

  const searchLocation = async (keyword) => {
    if (!keyword.trim()) return;

    try {
      const response = await fetch(`/api/map/search?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        const formattedResults = data.data.map(place => ({
          name: place.name,
          address: place.address,
          lon: place.lon,
          lat: place.lat
        }));
        setSuggestions(formattedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    }
  };

  // Update debounce function to handle async
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

    if (activeSearch === 'origin') {
      if (originMarker) {
        map.Overlays.remove(originMarker);
      }
      const marker = new window.longdo.Marker(location, {
        title: 'ต้นทาง (รอยืนยัน)',
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
        title: 'ปลายทาง (รอยืนยัน)',
        detail: place.name
      });
      map.Overlays.add(marker);
      setDestMarker(marker);
      setDestText(place.name);
    }

    map.location(location, true);
    setSearchQuery('');
    setSuggestions([]);
  };

  const confirmLocation = () => {
    if (activeSearch === 'origin' && originMarker) {
      const location = originMarker.location();
      map.Overlays.remove(originMarker);
      const confirmedMarker = new window.longdo.Marker(location, {
        title: 'ต้นทาง',
        detail: originText
      });
      map.Overlays.add(confirmedMarker);
      setOriginMarker(confirmedMarker);
      setActiveSearch(null);
    } else if (activeSearch === 'destination' && destMarker) {
      const location = destMarker.location();
      map.Overlays.remove(destMarker);
      const confirmedMarker = new window.longdo.Marker(location, {
        title: 'ปลายทาง',
        detail: destText
      });
      map.Overlays.add(confirmedMarker);
      setDestMarker(confirmedMarker);
      setActiveSearch(null);
    }
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounceSearch(value);
  };

  return (
    <div className="map-container">
      {/* Control Button */}
      <button 
        className="map-control-button"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <box-icon 
          name={isSearchOpen ? "x" : "search"} 
          color="#ffffff"
        ></box-icon>
        {isSearchOpen ? "ปิด" : "ค้นหาเส้นทาง"}
      </button>

      {/* Search Panel - show only when isSearchOpen is true */}
      {isSearchOpen && (
        <div className="search-panel">
          <div className="selected-locations">
            <div 
              className={`location-item ${activeSearch === 'origin' ? 'active' : ''}`}
              onClick={() => setActiveSearch('origin')}
            >
              <div className="location-header">
                <span className="location-label">ต้นทาง</span>
                {originMarker && activeSearch === 'origin' && (
                  <button className="confirm-button" onClick={confirmLocation}>
                    ยืนยัน
                  </button>
                )}
              </div>
              {activeSearch === 'origin' ? (
                <input
                  type="text"
                  placeholder="ค้นหาต้นทาง..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="location-text">{originText || 'กดเพื่อค้นหาต้นทาง'}</span>
              )}
            </div>

            <div 
              className={`location-item ${activeSearch === 'destination' ? 'active' : ''}`}
              onClick={() => setActiveSearch('destination')}
            >
              <div className="location-header">
                <span className="location-label">ปลายทาง</span>
                {destMarker && activeSearch === 'destination' && (
                  <button className="confirm-button" onClick={confirmLocation}>
                    ยืนยัน
                  </button>
                )}
              </div>
              {activeSearch === 'destination' ? (
                <input
                  type="text"
                  placeholder="ค้นหาปลายทาง..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="location-text">{destText || 'กดเพื่อค้นหาปลายทาง'}</span>
              )}
            </div>
          </div>

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

          {originMarker && destMarker && (
            <button className="route-button" onClick={showRoute}>
              แสดงเส้นทาง
            </button>
          )}
        </div>
      )}

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Map;