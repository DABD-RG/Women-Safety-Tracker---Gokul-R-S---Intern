import React, { useState, useEffect } from 'react';
import { MapPin, Share, Navigation, AlertCircle, RefreshCw, Copy, History, Trash2 } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import MapComponent from '../components/MapComponent';

interface LocationHistoryEntry {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const LocationPage: React.FC = () => {
  const { location, error, loading, getCurrentLocation, startWatching, stopWatching } = useLocation();
  const [isWatching, setIsWatching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryEntry[]>([]);
  const [batteryWarning, setBatteryWarning] = useState('');

  // Load persistent location history
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('location_history') || '[]');
    setLocationHistory(savedLogs);
  }, []);

  // Update history logs dynamically
  useEffect(() => {
    if (location) {
      setLastUpdate(new Date());
      
      const newEntry: LocationHistoryEntry = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: Date.now()
      };

      setLocationHistory(prev => {
        const latest = prev[0];
        if (latest && latest.latitude === newEntry.latitude && latest.longitude === newEntry.longitude) {
          return prev;
        }
        const updated = [newEntry, ...prev.slice(0, 19)];
        localStorage.setItem('location_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [location]);

  useEffect(() => {
    if ('getBattery' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery().then((battery: { level: number }) => {
        if (battery.level < 0.2) {
          setBatteryWarning('Low battery may affect GPS accuracy');
        }
      });
    }
  }, []);

  const handleStartWatching = () => {
    startWatching();
    setIsWatching(true);
  };

  const handleStopWatching = () => {
    stopWatching();
    setIsWatching(false);
  };

  const handleClearLocationHistory = () => {
    if (window.confirm('Are you sure you want to clear your coordinate broadcast history?')) {
      localStorage.removeItem('location_history');
      setLocationHistory([]);
    }
  };

  const shareLocation = () => {
    if (location) {
      const locationUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      const message = `My current location: ${locationUrl}\nShared at: ${new Date().toLocaleString()}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Current Location',
          text: message,
          url: locationUrl
        }).catch(() => {
          navigator.clipboard.writeText(message);
          alert('Location copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(message);
        alert('Location copied to clipboard!');
      }
    }
  };

  const shareRoute = async () => {
    if (!location) return;
    
    try {
      const destination = prompt("Enter destination address:");
      if (!destination) return;
      
      const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Safety Route',
          text: `I'm going from my current location to ${destination}`,
          url: routeUrl
        });
      } else {
        await navigator.clipboard.writeText(routeUrl);
        alert('Route copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing route:', err);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'text-emerald-600';
    if (accuracy <= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6 bg-amber-50/50 text-black font-sans transition-colors duration-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-6 text-left">
        <div>
          <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-600" />
            Location & Safe Route Hub
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Track GPS coordinates, watch security paths, and audit location broadcast logs.
          </p>
        </div>

        {locationHistory.length > 0 && (
          <button
            onClick={handleClearLocationHistory}
            className="flex items-center px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 hover:text-red-700 text-xs font-black rounded-2xl transition-all active:scale-95 shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            CLEAR PATH LOGS
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Location Services controller */}
        <div className="lg:col-span-8 p-6 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Location Services
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isWatching ? 'bg-green-500 animate-pulse' : 'bg-slate-350 bg-slate-300'}`} />
              <span className="text-xs font-black text-slate-400">
                {isWatching ? 'GPS ACTIVE' : 'GPS STANDBY'}
              </span>
            </div>
          </div>

          {batteryWarning && (
            <div className="flex items-center p-3.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl text-xs font-semibold">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{batteryWarning}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center p-3.5 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-xs font-semibold">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`flex items-center justify-center p-3.5 rounded-2xl text-xs font-black transition-all active:scale-95 border ${
                loading
                  ? 'bg-slate-200 text-slate-450 text-slate-400 border-slate-300 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 text-black border-amber-500/25 shadow-md'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span className="ml-2 uppercase tracking-wider">Get GPS Location</span>
            </button>

            <button
              onClick={isWatching ? handleStopWatching : handleStartWatching}
              className={`flex items-center justify-center p-3.5 rounded-2xl text-xs font-black transition-all active:scale-95 text-white border ${
                isWatching
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 border-red-500/20 shadow-md'
                  : 'bg-gradient-to-r from-emerald-600 to-green-700 border-emerald-500/20 shadow-md'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="ml-2 uppercase tracking-wider">
                {isWatching ? 'Stop Sharing' : 'Share Live Position'}
              </span>
            </button>
          </div>

          {location && (
            <div className="space-y-6 pt-2">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left">
                  Live Location Map
                </h4>
                <div className="h-[250px] rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-100">
                  <MapComponent 
                    latitude={location.latitude} 
                    longitude={location.longitude}
                    darkMode={false}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400 font-semibold">
                    {isWatching ? '✓ Location stream live' : 'Showing last known position'}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${location.latitude},${location.longitude}`);
                      alert('Coordinates copied to clipboard.');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Coordinates
                  </button>
                </div>
              </div>

              {/* Share actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={shareLocation}
                  className="flex items-center justify-center p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-2xl transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                >
                  <Share className="w-4 h-4 mr-2 text-indigo-600" />
                  Broadcast Coordinates
                </button>
                <button
                  onClick={shareRoute}
                  className="flex items-center justify-center p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-2xl transition-all active:scale-95 shadow-sm uppercase tracking-wider"
                >
                  <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                  Map Safety Walking Route
                </button>
              </div>
            </div>
          )}
        </div>

        {/* GPS accuracy and History column */}
        <div className="lg:col-span-4 space-y-6">
          {location && (
            <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3 text-left">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Telemetry Diagnostics
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-455 text-slate-550 text-slate-500 font-bold">Accuracy Range</span>
                  <span className={`font-black ${getAccuracyColor(location.accuracy)}`}>
                    ±{location.accuracy.toFixed(1)}m
                  </span>
                </div>
                <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2">
                  <div 
                    className={`h-1.5 rounded-full ${
                      location.accuracy < 20 ? 'bg-emerald-500' :
                      location.accuracy < 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, 500/location.accuracy)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-bold">Last Update</span>
                  <span className="font-extrabold text-slate-700">
                    {lastUpdate?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center border-b border-slate-100 pb-2">
              <History className="w-4 h-4 mr-1.5 text-amber-600" /> Location History
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {locationHistory.length > 0 ? (
                locationHistory.map((loc, index) => (
                  <div key={index} className="flex items-start text-xs p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className={`w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ${
                      index === 0 ? 'bg-emerald-555 bg-emerald-500' : 'bg-slate-300'
                    }`} />
                    <div className="ml-2.5 flex-1 min-w-0">
                      <p className="font-mono text-slate-800 font-semibold truncate">
                        {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
                        {new Date(loc.timestamp).toLocaleTimeString()}
                        {index === 0 && <span className="ml-2 text-emerald-600 font-black">• Active</span>}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <MapPin className="w-10 h-10 mx-auto mb-2 opacity-20 text-indigo-600" />
                  <p className="text-xs font-semibold">No location logs active.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocationPage;