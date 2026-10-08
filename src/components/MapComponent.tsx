import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  latitude: number;
  longitude: number;
  darkMode?: boolean;
  className?: string;
  path?: [number, number][];
  target?: [number, number] | null;
  targetLabel?: string;
}

// Controller component to dynamically sync map center position and bounds
const MapController = ({ center, target }: { center: [number, number]; target?: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      if (target && target[0] && target[1]) {
        map.fitBounds([center, target], { padding: [50, 50] });
      } else {
        map.setView(center, 15);
      }
    }
  }, [center, target, map]);
  return null;
};

const MapComponent = ({ latitude, longitude, darkMode = false, className = '', path, target, targetLabel }: MapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !latitude || !longitude) {
    return (
      <div className={`flex items-center justify-center bg-gray-250 ${className}`}>
        <p className="text-xs font-semibold text-slate-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={[latitude, longitude]} target={target} />
        <TileLayer
          url={darkMode ? 
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution={
            darkMode 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        />
        {path && path.length > 1 && (
          <Polyline positions={path} pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.8 }} />
        )}
        <Marker position={[latitude, longitude]}>
          <Popup>Your Current Location</Popup>
        </Marker>
        {target && (
          <Marker position={target}>
            <Popup>{targetLabel || 'Emergency Destination'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;