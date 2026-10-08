import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ActiveJourneyPage from './pages/ActiveJourneyPage';
import HistoryPage from './pages/HistoryPage';
import ContactsPage from './pages/ContactsPage';
import LocationPage from './pages/LocationPage';
import Sidebar from './components/Layout/Sidebar';
import MobileHeader from './components/Layout/MobileHeader';
import BottomNavigation from './components/Layout/BottomNavigation';
import { AlertTriangle, CheckCircle2, Lock, Delete } from 'lucide-react';

interface TripData {
  vehicleName: string;
  destination: string;
  companions: string;
  description: string;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  useTheme();
  
  // Navigation & UI States
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stealthMode, setStealthMode] = useState(false);
  const [journeyPrimed, setJourneyPrimed] = useState(false);

  // Form Configuration States
  const [tripSaved, setTripSaved] = useState(false);
  const [tripData, setTripData] = useState<TripData>({
    vehicleName: '',
    destination: '',
    companions: '',
    description: ''
  });

  // State Machine States
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyPaused, setJourneyPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1200); // Phase 1: 20 minutes (1200s)
  const [graceActive, setGraceActive] = useState(false);
  const [graceSeconds, setGraceSeconds] = useState(30);   // Phase 2: 30 seconds
  const [sosActive, setSosActive] = useState(false);       // Phase 4: SOS Alert Active
  const [sosSent, setSosSent] = useState(false);           // SOS SMS is fully dispatched
  const [fakeStopped, setFakeStopped] = useState(false);   // Stealth duress mock-success flag

  // Demo speed-up
  const [demoModeActive, setDemoModeActive] = useState(false);

  // 4-Digit PIN Security States
  const [userPin, setUserPin] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinPromptMode, setPinPromptMode] = useState<'setup' | 'verify'>('setup');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);

  // Battery Feature States
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [demoBatteryOverride, setDemoBatteryOverride] = useState<number | null>(null);
  const [showBatteryWarning, setShowBatteryWarning] = useState(false);
  const [showBatteryCritical, setShowBatteryCritical] = useState(false);
  const [batteryWarningTriggered, setBatteryWarningTriggered] = useState(false);
  const [batteryCriticalTriggered, setBatteryCriticalTriggered] = useState(false);

  // Geolocation cache


  // Timer reference intervals
  const mainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const graceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audio Context Ref & Vibration Intervals
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vibrationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Web Audio Siren Synthesizer
  const startAudioAlarm = () => {
    try {
      if (!audioCtxRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      stopAudioAlarm();

      oscillatorRef.current = audioCtxRef.current.createOscillator();
      gainNodeRef.current = audioCtxRef.current.createGain();

      oscillatorRef.current.type = 'sawtooth';
      oscillatorRef.current.frequency.setValueAtTime(520, audioCtxRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(0.35, audioCtxRef.current.currentTime);

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      oscillatorRef.current.start();

      let toggle = false;
      alarmIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || !oscillatorRef.current) return;
        oscillatorRef.current.frequency.setValueAtTime(toggle ? 780 : 400, audioCtxRef.current.currentTime);
        toggle = !toggle;
      }, 300);
    } catch (e) {
      console.error('Audio Context siren error:', e);
    }
  };

  const stopAudioAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    } catch (e) {
      console.error('Terminating audio nodes failed:', e);
    }
  };

  const startVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate([400, 300, 400]);
      vibrationIntervalRef.current = setInterval(() => {
        navigator.vibrate([400, 300, 400]);
      }, 1100);
    }
  };

  const stopVibration = () => {
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  // Battery Monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(battery.level * 100);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }
  }, []);

  useEffect(() => {
    const currentBattery = demoBatteryOverride !== null ? demoBatteryOverride : batteryLevel;
    if (currentBattery === null) return;

    // For testing purposes, reset triggers if battery goes back above thresholds
    if (currentBattery > 15) {
      setBatteryWarningTriggered(false);
    }
    if (currentBattery >= 5) {
      setBatteryCriticalTriggered(false);
    }
    
    // Normal <= 15% check
    if (currentBattery <= 15 && currentBattery >= 5 && !batteryWarningTriggered) {
      setBatteryWarningTriggered(true);
      setShowBatteryWarning(true);
    }

    // Critical < 5% and journeyActive check
    if (currentBattery < 5 && journeyActive && !batteryCriticalTriggered) {
      setBatteryCriticalTriggered(true);
      setShowBatteryCritical(true);
      triggerSOSTransmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batteryLevel, demoBatteryOverride, journeyActive, batteryWarningTriggered, batteryCriticalTriggered]);

  // Phase 1 (Main Timer) loop
  useEffect(() => {
    if (journeyActive && !journeyPaused && !graceActive && !sosActive) {
      mainIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          const tickAmount = demoModeActive ? 200 : 1;
          if (prev <= tickAmount) {
            clearInterval(mainIntervalRef.current);
            setJourneyActive(false);
            setGraceActive(true);
            setGraceSeconds(30);
            setPinPromptMode('verify');
            setPinInput('');
            setPinError('');
            return 0;
          }
          return prev - tickAmount;
        });
      }, 1000);
    } else {
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
      }
    }
    return () => {
      if (mainIntervalRef.current) clearInterval(mainIntervalRef.current);
    };
  }, [journeyActive, journeyPaused, graceActive, sosActive, demoModeActive]);

  // Phase 2 (Grace Timer) loop
  useEffect(() => {
    if (graceActive && !sosActive) {
      graceIntervalRef.current = setInterval(() => {
        setGraceSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(graceIntervalRef.current);
            setGraceActive(false);
            triggerSOSTransmission();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (graceIntervalRef.current) {
        clearInterval(graceIntervalRef.current);
      }
    }
    return () => {
      if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graceActive, sosActive]);

  // Trigger alarms on Grace period transition
  useEffect(() => {
    if (graceActive) {
      startAudioAlarm();
      startVibration();
    } else {
      stopAudioAlarm();
      stopVibration();
    }
    return () => {
      stopAudioAlarm();
      stopVibration();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graceActive]);

  // SOS SMS transmission
  const triggerSOSTransmission = async () => {
    // Save emergency trigger to history log
    const newEntry = {
      id: Date.now(),
      type: 'alert',
      title: 'Emergency SOS Transmission',
      date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      duration: 'Active',
      status: 'SOS Sent',
      checkins: 0,
      routeSafety: 'Critical'
    };
    try {
      const historyList = JSON.parse(localStorage.getItem('safety_history') || '[]');
      localStorage.setItem('safety_history', JSON.stringify([newEntry, ...historyList]));
    } catch (e) {
      console.error('Error saving SOS history log:', e);
    }

    setGraceActive(false);
    setJourneyActive(false);
    setSosActive(true);
    setSosSent(false);

    let lat: number | null = null;
    let lng: number | null = null;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000
          });
        }
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      setLastCoords({ latitude: lat, longitude: lng });
    } catch (err) {
      console.warn('Geolocation failed or blocked:', err);
    }

    // Extract emergency contact numbers from preloaded list
    const contactPhones = user?.emergencyContacts?.map(c => c.phone) || [];

    try {
      // In dev, Vite proxies '/api' to the local Express server (see /server).
      // In production, point VITE_API_URL at your deployed server (e.g. Render/Railway).
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicleName: tripData.vehicleName,
          destination: tripData.destination,
          companions: tripData.companions,
          description: tripData.description || 'Emergency SOS Triggered',
          latitude: lat,
          longitude: lng,
          to: contactPhones
        })
      });
      const result = await response.json();
      if (result.success) {
        setSosSent(true);
      }
    } catch (err) {
      console.error('Distress dispatch error:', err);
    }
  };

  // PIN verification dialog triggers
  const promptPinSetup = () => {
    setPinPromptMode('setup');
    setPinInput('');
    setPinError('');
    setPinModalOpen(true);
  };

  const promptPinVerify = () => {
    setPinPromptMode('verify');
    setPinInput('');
    setPinError('');
    setPinModalOpen(true);
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length >= 4) return;
    const nextInput = pinInput + val;
    setPinInput(nextInput);

    if (nextInput.length === 4) {
      // Process 4-digit input completion
      setTimeout(() => {
        handlePinSubmit(nextInput);
      }, 250);
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handlePinSubmit = (enteredPin: string) => {
    if (pinPromptMode === 'setup') {
      setUserPin(enteredPin);
      setPinModalOpen(false);
      setTripSaved(true);
      setJourneyPrimed(true);
      setPinAttempts(0);
      setPinInput('');
      setPinError('');
    } else {
      // Verify Check Stop / Pause Reset
      if (enteredPin === '9999') {
        // Duress code bypass
        setPinModalOpen(false);
        triggerSOSTransmission();
        setFakeStopped(true); // Deceive UI
      } else if (enteredPin === userPin) {
        // Success check-in stop
        setPinModalOpen(false);
        if (graceActive) {
          // Reset 20-minute timer and restart monitoring session!
          setTimerSeconds(1200);
          setGraceActive(false);
          setGraceSeconds(30);
          setPinAttempts(0);
          setPinInput('');
          setPinError('');
          stopAudioAlarm();
          stopVibration();
        } else {
          handleResetAppToForm();
        }
      } else {
        // Failed entry
        const nextAttempts = pinAttempts + 1;
        setPinAttempts(nextAttempts);
        setPinInput('');

        if (nextAttempts >= 3) {
          setPinModalOpen(false);
          triggerSOSTransmission(); // Send SOS on 3rd fail
        } else {
          setPinError(`Incorrect PIN. ${3 - nextAttempts} attempts remaining.`);
        }
      }
    }
  };

  const handleResetAppToForm = () => {
    if (journeyActive) {
      const elapsedMins = Math.floor((1200 - timerSeconds) / 60);
      const elapsedSecs = (1200 - timerSeconds) % 60;
      const durationStr = elapsedMins > 0 ? `${elapsedMins}m ${elapsedSecs}s` : `${elapsedSecs}s`;
      
      const newEntry = {
        id: Date.now(),
        type: 'journey',
        title: `Journey to ${tripData.destination || 'Destination'}`,
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        duration: durationStr,
        status: 'Safe Arrival',
        checkins: 1,
        routeSafety: '99%'
      };
      try {
        const historyList = JSON.parse(localStorage.getItem('safety_history') || '[]');
        localStorage.setItem('safety_history', JSON.stringify([newEntry, ...historyList]));
      } catch (e) {
        console.error('Error saving history log:', e);
      }
    }

    setJourneyActive(false);
    setJourneyPaused(false);
    setGraceActive(false);
    setSosActive(false);
    setSosSent(false);
    setTripSaved(false);
    setJourneyPrimed(false);
    setFakeStopped(false);
    setUserPin('');
    setPinAttempts(0);
    setTimerSeconds(1200);
    setGraceSeconds(30);
    setTripData({
      vehicleName: '',
      destination: '',
      companions: '',
      description: ''
    });
    stopAudioAlarm();
    stopVibration();
  };

  // Resume Web Audio Context if user interacts
  const handleUserGesture = () => {
    try {
      if (typeof audioCtxRef !== 'undefined' && audioCtxRef?.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext resume failed:', e);
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => { handleUserGesture(); setShowLanding(false); }} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            sosActive={sosActive}
            setSosActive={setSosActive}
            journeyActive={journeyActive}
            setJourneyActive={setJourneyActive}
            journeyPrimed={journeyPrimed}
            setJourneyPrimed={setJourneyPrimed}
            timerSeconds={timerSeconds}
            setTimerSeconds={setTimerSeconds}
            stealthMode={stealthMode}
            setStealthMode={setStealthMode}
            onNavigate={setActiveTab}
            tripSaved={tripSaved}
            setTripSaved={setTripSaved}
            tripData={tripData}
            setTripData={setTripData}
            onTriggerSOSManual={triggerSOSTransmission}
            onResetSession={promptPinVerify} // Stopping requires PIN verification
            onPinSetupRequired={promptPinSetup}
            sosSent={sosSent}
            demoModeActive={demoModeActive}
            setDemoModeActive={setDemoModeActive}
          />
        );
      case 'active_journey':
        return (
          <ActiveJourneyPage
            journeyActive={journeyActive}
            setJourneyActive={setJourneyActive}
            timerSeconds={timerSeconds}
            setTimerSeconds={setTimerSeconds}
            setSosActive={setSosActive}
            tripData={tripData}
            setTripData={setTripData}
            tripSaved={tripSaved}
            setTripSaved={setTripSaved}
            onPinSetupRequired={promptPinSetup}
            onResetSession={promptPinVerify}
            journeyPaused={journeyPaused}
            setJourneyPaused={setJourneyPaused}
            sosActive={sosActive}
            onTriggerSOSManual={triggerSOSTransmission}
          />
        );
      case 'history':
        return <HistoryPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'map_hotspots':
        return <LocationPage />;
      default:
        return (
          <DashboardPage
            sosActive={sosActive}
            setSosActive={setSosActive}
            journeyActive={journeyActive}
            setJourneyActive={setJourneyActive}
            timerSeconds={timerSeconds}
            setTimerSeconds={setTimerSeconds}
            stealthMode={stealthMode}
            setStealthMode={setStealthMode}
            onNavigate={setActiveTab}
            tripSaved={tripSaved}
            setTripSaved={setTripSaved}
            tripData={tripData}
            setTripData={setTripData}
            onTriggerSOSManual={triggerSOSTransmission}
            onResetSession={promptPinVerify}
            onPinSetupRequired={promptPinSetup}
            sosSent={sosSent}
            demoModeActive={demoModeActive}
            setDemoModeActive={setDemoModeActive}
          />
        );
    }
  };

  return (
    <div 
      onClick={handleUserGesture} 
      className="min-h-screen bg-[#fdf6e2] text-black flex flex-col md:flex-row transition-colors duration-200"
    >
      {/* Sidebar for Desktop */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stealthMode={stealthMode}
        onToggleStealth={() => setStealthMode(!stealthMode)}
        sosActive={sosActive}
        onTriggerSOS={triggerSOSTransmission}
      />

      {/* Mobile Top Header */}
      <MobileHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stealthMode={stealthMode}
        onToggleStealth={() => setStealthMode(!stealthMode)}
        sosActive={sosActive}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto md:h-screen md:pb-0 pb-16 pt-16 md:pt-0 bg-[#fdf6e2]">
        {fakeStopped ? (
          /* Duress Fake Completed Screen (Deceive Threat) */
          <div className="p-8 md:p-16 text-center max-w-xl mx-auto space-y-6 animate-fadeIn min-h-[400px] flex flex-col justify-center items-center bg-slate-900 text-slate-100">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h2 className="text-2xl font-bold">Tracker is disabled</h2>
            <p className="text-sm text-slate-400">Tracking telemetry has been stopped successfully. PIN verified.</p>
            <button 
              onClick={() => {
                setFakeStopped(false);
                handleResetAppToForm();
              }}
              className="py-3 px-6 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          renderPage()
        )}
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Demo Battery Simulator Widget */}
      <div 
        className="fixed top-4 right-4 z-[99999] bg-white border border-slate-300 shadow-xl rounded-xl p-2.5 flex items-center space-x-2 cursor-pointer hover:bg-slate-50 transition-all group"
        onClick={() => {
          const val = prompt('Enter demo battery percentage (0 - 100). Cancel or empty to restore real battery level.', demoBatteryOverride?.toString() || '');
          if (val === null) return; // cancelled
          if (val.trim() === '') {
            setDemoBatteryOverride(null);
          } else {
            const num = parseInt(val, 10);
            if (!isNaN(num) && num >= 0 && num <= 100) {
              setDemoBatteryOverride(num);
            } else {
              alert('Please enter a valid number between 0 and 100.');
            }
          }
        }}
      >
        <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
            Demo Battery
          </span>
          <span className="text-xs font-black text-slate-800 -mt-0.5">
            {demoBatteryOverride !== null ? `${demoBatteryOverride}% (Simulated)` : `${batteryLevel !== null ? batteryLevel.toFixed(0) : 100}% (Real)`}
          </span>
        </div>
      </div>

      {/* 30-Second Warning Grace Overlay Modal (UNMISSABLE FULLSCREEN OVERLAY - Image 4) */}
      {graceActive && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center p-6 text-slate-100 overflow-y-auto">
          <div className="max-w-md w-full text-center space-y-6 animate-fadeIn">
            
            {/* Active SOS Link top tag */}
            <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Alarm Activated • Warning state</span>
            </div>

            {/* Pulsing Red Circle (Seconds counter) */}
            <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-2 border-2 border-red-500/20 rounded-full animate-ping duration-1500" />
              
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-700 to-rose-900 border-4 border-red-500 flex flex-col items-center justify-center text-white shadow-2xl">
                <span className="text-xl font-black tracking-widest text-white block">SOS</span>
                <span className="text-[7px] text-red-200 tracking-wider font-bold uppercase block">Sec to Send</span>
                <span className="text-2xl font-extrabold font-mono tracking-widest text-white mt-0.5 block">
                  00:{graceSeconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white uppercase tracking-wide">Enter PIN to Reset Timer</h2>
              <p className="text-[11px] text-slate-400 font-semibold max-w-sm mx-auto">
                Siren activated. Enter your 4-digit PIN immediately to reset the 20-minute safety timer.
              </p>
            </div>

            {/* Keypad entry status dots */}
            <div className="flex justify-center space-x-4 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    pinInput.length > idx
                      ? 'bg-amber-400 border-amber-400 scale-110 shadow-neon-amber'
                      : 'border-slate-600 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {pinError && (
              <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-bold text-[10px] uppercase tracking-wider">
                {pinError}
              </div>
            )}

            {/* Numeric Keypad Panel */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleKeypadPress(val)}
                  className="w-14 h-14 bg-slate-900 border border-slate-800 text-white font-black text-lg rounded-full flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all"
                >
                  {val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPinInput('');
                  setPinError('');
                }}
                className="w-14 h-14 text-red-500 font-black text-[10px] uppercase tracking-wider flex items-center justify-center hover:bg-slate-900/40 rounded-full"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="w-14 h-14 bg-slate-900 border border-slate-800 text-white font-black text-lg rounded-full flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="w-14 h-14 text-slate-400 font-black text-xs uppercase tracking-wider flex items-center justify-center hover:bg-slate-900/40 rounded-full"
              >
                Del
              </button>
            </div>

            <p className="text-[8px] text-slate-550 text-slate-500 font-bold uppercase tracking-wider">
              Woman Safety Tracker verified protection system.
            </p>

          </div>
        </div>
      )}

      {/* ========================================================
          4-DIGIT SAFETY PIN ENTRY OVERLAY MODAL (KEYPAD DIALOG)
          ======================================================== */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xs w-full shadow-2xl flex flex-col items-center space-y-6 animate-fadeIn relative">
            
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1 w-full">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">
                {pinPromptMode === 'setup' ? 'Configure Security PIN' : 'Verify Security PIN'}
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                {pinPromptMode === 'setup' ? 'Create a 4-digit code' : 'Enter PIN to stop/pause timer'}
              </p>
            </div>

            {/* Verification Warnings */}
            {pinError && (
              <div className="w-full text-center text-red-400 font-bold text-[10px] uppercase bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 animate-shake">
                {pinError}
              </div>
            )}

            {/* Digit Visualizer */}
            <div className="flex space-x-4 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    idx < pinInput.length 
                      ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-[0_0_6px_rgba(99,102,241,0.6)]' 
                      : 'bg-transparent border-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleKeypadPress(val)}
                  className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-200 font-black text-lg transition-all active:scale-90 flex items-center justify-center shadow-sm"
                >
                  {val}
                </button>
              ))}
              
              {/* Backspace */}
              <button
                type="button"
                onClick={handleBackspace}
                className="w-16 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 transition-all active:scale-90 flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>

              {/* 0 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-200 font-black text-lg transition-all active:scale-90 flex items-center justify-center shadow-sm"
              >
                0
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  // Only allow cancellation of Verify PIN prompts, Setup is mandatory
                  if (pinPromptMode === 'verify') {
                    setPinModalOpen(false);
                    setPinInput('');
                    setPinError('');
                  }
                }}
                className={`w-16 h-16 rounded-2xl bg-slate-905 hover:bg-slate-800 transition-all flex items-center justify-center text-[10px] font-black uppercase tracking-wider ${
                  pinPromptMode === 'setup' ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200'
                }`}
                disabled={pinPromptMode === 'setup'}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Battery Warning Modal */}
      {showBatteryWarning && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4">
          <div className="bg-white border-4 border-yellow-400 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center space-y-4 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-widest">Battery Low</h3>
            <p className="text-sm text-slate-600 font-bold">
              Your device’s battery is 15% or lower. Please charge.
            </p>
            <button
              onClick={() => setShowBatteryWarning(false)}
              className="mt-4 w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Battery Critical Modal */}
      {showBatteryCritical && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-red-500 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center space-y-4 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Battery Critical</h3>
            <p className="text-sm text-red-400 font-bold">
              Battery very critically low. Please charge. Automatic message sent.
            </p>
            <button
              onClick={() => setShowBatteryCritical(false)}
              className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;