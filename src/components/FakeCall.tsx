import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Volume2, Mic, MessageSquare } from 'lucide-react';


interface FakeCallProps {
  isActive: boolean;
  onEnd: () => void;
}

const FakeCall: React.FC<FakeCallProps> = ({ isActive, onEnd }) => {

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [contactName] = useState('Mom');
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');

  // Ringing/duration effects
  useEffect(() => {
    if (isActive) {
      setCallStatus('ringing');
      setCallDuration(0);
    }
  }, [isActive]);

  useEffect(() => {
    let durationTimer: ReturnType<typeof setInterval> | null = null;
    if (isActive && callStatus === 'connected') {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [isActive, callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 text-white font-sans overflow-hidden select-none">
      <div className="flex flex-col items-center justify-between h-full px-8 py-16">
        
        {/* Contact Info Header */}
        <div className="text-center mt-8 space-y-3">
          <div className="relative">
            <div className="w-28 h-28 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700 shadow-md">
              <User className="w-14 h-14 text-slate-300" />
            </div>
            
            {callStatus === 'ringing' && (
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-ping" />
            )}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">{contactName}</h2>
            <p className="text-sm font-extrabold tracking-wider uppercase text-slate-400">
              {callStatus === 'ringing' ? 'Incoming Mobile Call...' : 'Connected'}
            </p>
          </div>

          {callStatus === 'connected' && (
            <div className="space-y-1 pt-1">
              <div className="text-3xl font-mono tracking-widest text-emerald-400 font-bold">
                {formatDuration(callDuration)}
              </div>
              <div className="flex items-center justify-center space-x-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Secure Audio Line</span>
              </div>
            </div>
          )}
        </div>

        {/* Call Actions Panel */}
        <div className="w-full max-w-sm space-y-10">
          
          {/* Mute, Keypad, Speaker Controls (Connected State only) */}
          {callStatus === 'connected' && (
            <div className="grid grid-cols-3 gap-6 text-center">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`flex flex-col items-center p-3 rounded-full transition-all active:scale-90 ${
                  isMuted ? 'bg-white text-slate-950' : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Mic className="w-5.5 h-5.5 mb-1" />
                <span className="text-[10px] font-extrabold uppercase tracking-wide">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`flex flex-col items-center p-3 rounded-full transition-all active:scale-90 ${
                  isSpeaker ? 'bg-white text-slate-950' : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Volume2 className="w-5.5 h-5.5 mb-1" />
                <span className="text-[10px] font-extrabold uppercase tracking-wide">{isSpeaker ? 'Speaker On' : 'Speaker'}</span>
              </button>

              <button 
                type="button"
                className="flex flex-col items-center p-3 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all active:scale-90"
              >
                <MessageSquare className="w-5.5 h-5.5 mb-1" />
                <span className="text-[10px] font-extrabold uppercase tracking-wide">Keypad</span>
              </button>
            </div>
          )}

          {/* Call Decline/Accept Triggers */}
          <div className="flex justify-around items-center gap-6">
            {callStatus === 'ringing' ? (
              <>
                {/* Ringing Decline Button */}
                <button
                  type="button"
                  onClick={onEnd}
                  className="w-16 h-16 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full flex flex-col items-center justify-center shadow-lg transition-all"
                  title="Decline Call"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>

                {/* Ringing Accept Button */}
                <button
                  type="button"
                  onClick={() => setCallStatus('connected')}
                  className="w-16 h-16 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full flex flex-col items-center justify-center shadow-lg transition-all"
                  title="Accept Call"
                >
                  <Phone className="w-6 h-6 text-white" />
                </button>
              </>
            ) : (
              /* Connected End Call Button */
              <button
                type="button"
                onClick={onEnd}
                className="w-full py-4.5 bg-red-600 hover:bg-red-700 active:scale-95 rounded-2xl flex items-center justify-center transition-all shadow-lg border border-red-500/20 font-black text-xs uppercase tracking-widest"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                <span>End Call</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeCall;