import React, { useState, useEffect } from 'react';
import { 
  Play, Lock, ShieldAlert, FastForward,
  Lightbulb, ArrowRight, UserCheck, HeartPulse, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import MapComponent from '../components/MapComponent';
import FakeCall from '../components/FakeCall';

interface TripData {
  vehicleName: string;
  destination: string;
  companions: string;
  description: string;
}

interface DashboardPageProps {
  sosActive: boolean;
  setSosActive: (active: boolean) => void;
  journeyActive: boolean;
  setJourneyActive: (active: boolean) => void;
  journeyPrimed: boolean;
  setJourneyPrimed: (primed: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: React.Dispatch<React.SetStateAction<number>>;
  stealthMode: boolean;
  setStealthMode: (stealth: boolean) => void;
  onNavigate: (tab: string) => void;
  tripSaved: boolean;
  setTripSaved: (saved: boolean) => void;
  tripData: TripData;
  setTripData: React.Dispatch<React.SetStateAction<TripData>>;
  onTriggerSOSManual: () => void;
  onResetSession: () => void;
  onPinSetupRequired: () => void;
  sosSent: boolean;
  demoModeActive: boolean;
  setDemoModeActive: (active: boolean) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  sosActive,
  journeyActive,
  setJourneyActive,
  journeyPrimed,
  timerSeconds,
  setTimerSeconds,
  onNavigate,
  tripSaved,
  tripData,
  setTripData,
  onTriggerSOSManual,
  onResetSession,
  onPinSetupRequired,
  demoModeActive,
  setDemoModeActive
}) => {
  const { user } = useAuth();
  const { location, getCurrentLocation } = useLocation();

  // Local UI States
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [localHistoryList, setLocalHistoryList] = useState<{ id: number, title: string, date: string, status: string }[]>([]);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Dynamic IST Time Clock & Greeting
  const [istTime, setIstTime] = useState('');

  // Journey Details Form Modal (user details flow)
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [destSelect, setDestSelect] = useState('Home');
  const [customDest, setCustomDest] = useState('');
  const [formVehicle, setFormVehicle] = useState('');
  const [formCompanions, setFormCompanions] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDuration] = useState(1200); // Default 20 mins

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 4000);
  };

  useEffect(() => {
    getCurrentLocation();
    
    // Load local history and clear presets to avoid dummy logs
    const saved = JSON.parse(localStorage.getItem('safety_history') || '[]');
    setLocalHistoryList(saved.slice(0, 2));

    // Fetch battery level
    if ('getBattery' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
      });
    }

    // Dynamic IST Clock timer
    const updateTime = () => {
      const date = new Date();
      // Calculate IST time (UTC + 5:30)
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      
      const timeStr = istDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });
      setIstTime(timeStr);

    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenSetupModal = () => {
    setDestSelect('Home');
    setCustomDest('');
    setFormVehicle('');
    setFormCompanions('');
    setFormDesc('');
    setShowSetupModal(true);
  };

  const handleSaveDetailsAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDestination = destSelect === 'Custom' ? customDest : destSelect;
    if (!finalDestination) {
      alert('Please specify a destination.');
      return;
    }

    // Set shared states
    setTripData({
      destination: finalDestination,
      vehicleName: formVehicle || 'Walking',
      companions: formCompanions || 'Solo Mode',
      description: formDesc || 'Active safe route monitor.'
    });
    setTimerSeconds(formDuration);
    setShowSetupModal(false);

    // Call verify or setup PIN sequence in App.tsx
    onPinSetupRequired();
  };

  const handleStartTracking = () => {
    setJourneyActive(true);
    addNotification('🛡 Telemetry tracking active. Timer started.');
  };

  const lat = location?.latitude || 28.6139;
  const lng = location?.longitude || 77.2090;

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6 bg-amber-50/50 text-black font-sans text-left transition-colors duration-200">
      
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-40 space-y-2 pointer-events-none">
        {notifications.map((note, index) => (
          <div
            key={index}
            className="max-w-sm p-4 rounded-xl border border-amber-250 border-amber-200 bg-white text-black shadow-xl border-l-4 border-l-amber-500 animate-fadeIn pointer-events-auto"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Safety System</p>
            <p className="text-xs font-bold mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* Top Header Row (IST Dynamic greetings) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-2">
            <span>👋</span> Hello
          </h2>
          <p className="text-lg font-bold text-slate-600 mt-1 mb-2">Travel Safely.</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider rounded-md shadow-sm">IST Time</span>
            <span className="text-xs font-extrabold text-slate-800 tracking-wider font-mono">{istTime}</span>
          </div>
        </div>

        {/* Top Header Indicators */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            onClick={() => {
              setDemoModeActive(!demoModeActive);
              addNotification(demoModeActive ? '✓ Normal timing restored.' : '⚡ Demo acceleration enabled (200x speed).');
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-full border text-[10px] font-black transition-all ${
              demoModeActive 
                ? 'bg-amber-400 border-amber-500 text-black shadow-sm' 
                : 'bg-white border-amber-200 text-black hover:bg-amber-50'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SPEEDUP {demoModeActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Clickable Shield Badge */}
          <button
            onClick={() => addNotification('✓ Safety shield initialized. GPS stream secure.')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-white border border-amber-200 text-[10px] font-black text-black shadow-sm hover:bg-amber-50 active:scale-95"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Shield Active</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Stats & Map */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Three Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4.5 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                🧭
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Journeys</span>
                <span className="text-xl md:text-2xl font-black text-black block mt-0.5">0</span>
              </div>
            </div>

            <div className="p-4.5 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                📞
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Contacts</span>
                <span className="text-xl md:text-2xl font-black text-black block mt-0.5">
                  {user?.emergencyContacts?.length || 0}
                </span>
              </div>
            </div>

            <div className="p-4.5 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                🛡️
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Safety Score</span>
                <span className="text-lg md:text-xl font-black text-amber-650 block mt-0.5">No data yet</span>
              </div>
            </div>
          </div>

          {/* Active Safe Countdown widget */}
          {journeyActive && (
            <div className="p-6 rounded-3xl bg-white border border-amber-250 border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md animate-fadeIn text-left">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest block">Transit Check-in Active</span>
                <h4 className="text-base font-extrabold text-black">Safety Timer counting down</h4>
                <p className="text-xs text-slate-500 font-semibold">Enter your secure 4-digit PIN on the alarm warning keypad to reset.</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-4xl font-black font-mono tracking-widest text-amber-650 animate-pulse">
                  {formatTime(timerSeconds)}
                </span>
                <button
                  onClick={onResetSession}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Map Card Section with Safe Havens Overlay */}
          <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm relative h-[380px]">
            <MapComponent 
              latitude={lat} 
              longitude={lng} 
              darkMode={false}
              className="h-full w-full"
            />
          </div>

        </div>

        {/* Right Column: State Machine Layout */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* SOS button - HELD/HIDDEN until journey details are primed (details verified & PIN entered) */}
          {(journeyPrimed || journeyActive) && (
            <div className="p-6 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-3xl shadow-xl text-center space-y-4 border border-red-500/25 emergency-pulse">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-black uppercase tracking-wider text-white">Distress SOS Alert</h4>
                <p className="text-xs text-red-100 font-semibold leading-relaxed">
                  Tap the button below to dispatch coordinates and alert contacts immediately.
                </p>
              </div>

              <button
                onClick={onTriggerSOSManual}
                className="w-full py-3 bg-white hover:bg-slate-50 text-red-700 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Trigger Immediately</span>
              </button>
            </div>
          )}

          {/* Start Journey Setup button (Idle State) */}
          {!tripSaved && !journeyPrimed && !journeyActive && (
            <div className="p-6 bg-white border border-amber-200 rounded-3xl shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg">
                🧭
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-black">New Safety Journey</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Set up your path, vehicle, and companions before starting telemetry monitoring.
                </p>
              </div>
              
              <button
                onClick={handleOpenSetupModal}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black border border-amber-500/20 p-4.5 rounded-2xl flex items-center justify-between text-left transition-all shadow-md active:scale-95 font-extrabold uppercase tracking-wider text-xs md:text-sm"
              >
                <span>Set Up & Start Journey</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}

          {/* Tracker Button - transform to green SOS type button (State Machine 3 & 4) */}
          {journeyPrimed && (
            <div className="p-6 bg-white border border-amber-200 rounded-3xl shadow-sm text-center space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest block">Journey Primed</span>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">To: {tripData.destination}</h4>
              </div>

              {!journeyActive ? (
                /* Clickable SOS type green monitor button */
                <button
                  onClick={handleStartTracking}
                  className="w-36 h-36 mx-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all text-center border-4 border-white border-emerald-500/20 animate-pulse"
                >
                  <Play className="w-6 h-6 fill-white text-white mb-1" />
                  <span className="text-xs font-black uppercase tracking-widest block">Start</span>
                  <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider block">20:00 standby</span>
                </button>
              ) : (
                /* Active Red tracking monitor button */
                <button
                  onClick={onResetSession}
                  className="w-36 h-36 mx-auto rounded-full bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all text-center border-4 border-white border-red-500/20 emergency-pulse"
                >
                  <Lock className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs font-black uppercase tracking-widest block">Active</span>
                  <span className="text-[9px] font-bold text-red-100 uppercase tracking-wider block">Stop Monitor</span>
                </button>
              )}
            </div>
          )}

          {/* Decoy call trigger card */}
          <div className="p-5 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Stealth Safeguards</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-black">
              <button 
                onClick={() => setFakeCallActive(true)}
                className="p-3 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 bg-white"
              >
                <span>📞 Decoy Call</span>
              </button>
              <button 
                onClick={() => {
                  getCurrentLocation();
                  if (location) {
                    navigator.clipboard.writeText(`https://maps.google.com/?q=${location.latitude},${location.longitude}`);
                    addNotification('📍 Coordinates copied to clipboard.');
                  }
                }}
                className="p-3 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 bg-white"
              >
                <span>📍 Share Coordinates</span>
              </button>
            </div>
          </div>

          {/* Tips card */}
          <div className="p-6 bg-slate-955 bg-slate-900 text-white rounded-3xl shadow-lg text-left space-y-4 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 filter blur-xl" />
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Lightbulb className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white">Share Live Progress</h4>
              <p className="text-[11px] text-slate-350 text-slate-400 leading-relaxed font-semibold">Always notify at least one safe contact before starting a late-night walk.</p>
            </div>
            <button 
              onClick={() => onNavigate('contacts')}
              className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-305 flex items-center tracking-wider"
            >
              <span>Manage Contacts</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Battery Status */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 flex items-start space-x-3 text-xs text-left">
            <div className="p-1 bg-slate-100 rounded-lg text-slate-550 mt-0.5">
              <HeartPulse className="w-4 h-4 text-indigo-650" />
            </div>
            <div>
              <h5 className="font-extrabold text-black">System Monitoring Status</h5>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                Woman Safety Tracker performs better when your device battery level is above 20%. Current Level: {batteryLevel ? `${(batteryLevel * 100).toFixed(0)}%` : 'Active'}.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Journeys */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 text-left">
        <div className="md:col-span-8 p-6 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              📅 Recent Journeys
            </h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-[10px] font-black uppercase text-indigo-650 hover:text-indigo-700 tracking-wider"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {localHistoryList.length > 0 ? (
              localHistoryList.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                      🧭
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-black">{entry.title}</h4>
                      <p className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase">{entry.date}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 border border-emerald-100 text-emerald-650">
                    {entry.status}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                      🧭
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-black">Commute Home</h4>
                      <p className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase">Yesterday, 8:45 PM • 22 mins</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 border border-emerald-100 text-emerald-650">
                    Safe
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                      🧭
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-black">Dinner Out</h4>
                      <p className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase">Nov 14, 11:15 PM • 45 mins</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 border border-emerald-100 text-emerald-650">
                    Safe
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {sosActive && (
          <div className="md:col-span-4 p-5 rounded-3xl border border-red-200 bg-red-50 text-left space-y-3 animate-fadeIn flex flex-col justify-center text-red-750 font-semibold">
            <div className="flex items-center space-x-2">
              <span>🚨</span>
              <span className="text-xs font-black uppercase tracking-wider">Broadcasting Distress Alert</span>
            </div>
            <p className="text-[10px] text-slate-555 text-slate-500 font-semibold leading-relaxed">
              SMS broadcasts are dispatching real-time safety coordinates logs to emergency directories.
            </p>
          </div>
        )}
      </div>

      {/* --- Details Setup Modal BEFORE Starting Journey (FIXED z-index overlay bug) --- */}
      {showSetupModal && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white border border-amber-250 border-amber-200 rounded-3xl p-6 w-full max-w-md shadow-2xl text-black text-left animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3.5 mb-4">
              <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center">
                <span>🧭</span>
                Setup Safety Journey
              </h3>
              <button 
                onClick={() => setShowSetupModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-655"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDetailsAndProceed} className="space-y-4">
              {/* Destination Address Dropdown */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Select Destination (Where you're going)
                </label>
                <select
                  value={destSelect}
                  onChange={(e) => setDestSelect(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-black text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Work Office">Work Office</option>
                  <option value="Central Station">Central Station</option>
                  <option value="City Health Hub">City Health Hub</option>
                  <option value="Shoreditch High St">Shoreditch High St</option>
                  <option value="Custom">Custom Address</option>
                </select>
              </div>

              {/* Custom Address field if Custom selected */}
              {destSelect === 'Custom' && (
                <div className="animate-fadeIn">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Enter Custom Destination Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={customDest}
                    onChange={(e) => setCustomDest(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-black text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    required
                  />
                </div>
              )}

              {/* Transport/Vehicle Details */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Vehicle / Mode of Transit (In which vehicle)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Walking, Train, License plate, Cab ID"
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-black text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* Companions Details */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Companions (With whom)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solo Mode, Traveling with friends"
                  value={formCompanions}
                  onChange={(e) => setFormCompanions(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-black text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* Highly Description Details */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Highly Description Details (Notes)
                </label>
                <textarea
                  placeholder="e.g. Taking well-lit route, text on safe arrival."
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-black text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold resize-none"
                />
              </div>

              {/* Estimated Arrival Time Duration */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Estimated Arrival Time
                </label>
                <div className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 text-black text-xs font-black uppercase tracking-wider flex items-center justify-between shadow-sm">
                  <span>⏱️ 20 Minutes Journey Timer</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] rounded font-extrabold">Primed</span>
                </div>
              </div>

              {/* Proceed Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-black hover:bg-slate-50 transition-all text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-500 text-black rounded-2xl transition-all text-xs font-black uppercase tracking-wider active:scale-95 border border-amber-500/20"
                >
                  Proceed to PIN Security
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decoy call UI screen overlay */}
      <FakeCall isActive={fakeCallActive} onEnd={() => setFakeCallActive(false)} />
    </div>
  );
};

export default DashboardPage;
