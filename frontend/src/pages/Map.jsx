import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, MapPin, Navigation, Map as MapIcon, Compass, Utensils, Coffee, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.9629); // India center
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);
  const [activeCategory, setActiveCategory] = useState('All Places');
  const navigate = useNavigate();

  const categories = [
    { name: 'All Places', icon: <MapIcon size={16} /> },
    { name: 'Monuments', icon: <MapPin size={16} /> },
    { name: 'Nature', icon: <Compass size={16} /> },
    { name: 'Temples', icon: <MapIcon size={16} /> },
    { name: 'Restaurants', icon: <Utensils size={16} /> }
  ];

  // Dummy places
  const places = [
    { id: 1, name: "Taj Mahal", coordinates: [78.0421, 27.1751], category: "Monuments", rating: 4.9, image: "https://source.unsplash.com/100x100/?taj-mahal" },
    { id: 2, name: "Gateway of India", coordinates: [72.8347, 18.9220], category: "Monuments", rating: 4.7, image: "https://source.unsplash.com/100x100/?gateway-of-india" },
    { id: 3, name: "Meenakshi Temple", coordinates: [78.1198, 9.9195], category: "Temples", rating: 4.8, image: "https://source.unsplash.com/100x100/?temple,india" },
    { id: 4, name: "Munnar Tea Gardens", coordinates: [77.0602, 10.0889], category: "Nature", rating: 4.9, image: "https://source.unsplash.com/100x100/?munnar" }
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    // In a real app, you would get this from env
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'bottom-right'
    );

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.current.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 12
          });
        },
        () => {
          console.log("Geolocation denied or failed. Defaulting to India center.");
        }
      );
    }

    places.forEach(place => {
      // Custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `<div style="width: 32px; height: 32px; background-color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: var(--shadow-md); border: 2px solid white; cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </div>`;

      // Popup
      const popupHTML = `
        <div style="padding: 12px; min-width: 200px;">
          <img src="${place.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 12px;" />
          <h3 style="margin: 0 0 4px 0; font-size: 16px;">${place.name}</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 12px; color: var(--text-2);">${place.category}</span>
            <span style="font-size: 12px; font-weight: bold; color: #F59E0B;">★ ${place.rating}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[1]},${place.coordinates[0]}" target="_blank" style="flex: 1; padding: 8px; text-align: center; background-color: var(--primary); color: white; border-radius: var(--radius-sm); text-decoration: none; font-size: 12px; font-weight: 500;">Directions</a>
            <button id="chat-btn-${place.id}" style="flex: 1; padding: 8px; text-align: center; background-color: var(--surface-2); color: var(--text-1); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; font-size: 12px; font-weight: 500;">Chat</button>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML);

      popup.on('open', () => {
        document.getElementById(`chat-btn-${place.id}`)?.addEventListener('click', () => {
          navigate('/chat');
        });
      });

      new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [navigate]);

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 120px)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      {/* Map Container */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Top Search Bar */}
      <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1, width: '100%', maxWidth: '600px', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 'var(--radius-xl)', padding: '12px 24px', boxShadow: 'var(--shadow-md)' }}>
          <Search size={20} color="var(--text-3)" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Search places, monuments, restaurants..." 
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
          />
        </div>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                padding: '8px 16px', borderRadius: 'var(--radius-xl)', border: 'none', cursor: 'pointer',
                backgroundColor: activeCategory === cat.name ? 'var(--primary)' : 'white',
                color: activeCategory === cat.name ? 'white' : 'var(--text-1)',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', fontWeight: 500, fontSize: '14px'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', bottom: '32px', right: '32px', zIndex: 1,
        width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white',
        border: 'none', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: 'transform 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      title="Add Place"
      >
        <MapPin size={24} />
      </button>

      <style>{`
        .mapboxgl-popup-content { padding: 0 !important; border-radius: var(--radius-md) !important; overflow: hidden; box-shadow: var(--shadow-lg) !important; }
        .mapboxgl-popup-close-button { width: 24px; height: 24px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; margin: 8px; right: 0; }
        .mapboxgl-popup-close-button:hover { background: rgba(0,0,0,0.8); }
        .custom-marker { transition: transform 0.2s; }
        .custom-marker:hover { transform: scale(1.1); z-index: 10; }
      `}</style>
    </div>
  );
};

export default MapView;
