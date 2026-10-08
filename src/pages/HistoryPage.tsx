import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, AlertTriangle, Clock, ChevronRight, Trash2, Compass } from 'lucide-react';

interface HistoryEntry {
  id: number;
  type: 'journey' | 'alert';
  title: string;
  date: string;
  duration: string;
  status: string;
  checkins: number;
  routeSafety: string;
}

const HistoryPage: React.FC = () => {

  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  // Load history logs on mount
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('safety_history') || '[]');
    setHistoryEntries(list);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently clear all safety logs?')) {
      localStorage.removeItem('safety_history');
      setHistoryEntries([]);
    }
  };

  // Compute stats dynamically
  const totalJourneys = historyEntries.filter(e => e.type === 'journey').length;
  const totalAlerts = historyEntries.filter(e => e.type === 'alert').length;
  const totalCheckins = historyEntries.reduce((sum, entry) => sum + (entry.checkins || 0), 0);

  const activeDays = historyEntries.length > 0 ? 
    Math.max(1, Math.ceil((Date.now() - historyEntries[historyEntries.length - 1].id) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6 bg-amber-50/50 text-black font-sans transition-colors duration-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-6 text-left">
        <div>
          <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-amber-600" />
            Safety Log & Audit History
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            Audit trailing of safety logs, telemetry coordinates, and check-ins.
          </p>
        </div>

        {historyEntries.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 hover:text-red-700 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            CLEAR ALL LOGS
          </button>
        )}
      </div>

      {/* Dynamic Security Health Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Total Journeys</span>
          <span className="text-base font-extrabold text-slate-800">{totalJourneys} Secure</span>
        </div>
        
        <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Alerts Dispatched</span>
          <span className="text-base font-extrabold text-red-500">{totalAlerts} Sent</span>
        </div>

        <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Active Days</span>
          <span className="text-base font-extrabold text-indigo-600">{activeDays} {activeDays === 1 ? 'Day' : 'Days'}</span>
        </div>

        <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Check-ins Dispatched</span>
          <span className="text-base font-extrabold text-slate-800">{totalCheckins} Sent</span>
        </div>
      </div>

      {/* History Timeline */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-sm text-left">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center border-b border-slate-100 pb-3.5">
          <History className="w-4 h-4 mr-2 text-indigo-655 text-indigo-600" />
          Recent Activity Logs
        </h3>

        <div className="space-y-4">
          {historyEntries.length > 0 ? (
            historyEntries.map((entry) => (
              <div 
                key={entry.id}
                className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    entry.type === 'alert' 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {entry.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">{entry.title}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{entry.date}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{entry.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Safety: {entry.routeSafety}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    entry.type === 'alert' 
                      ? 'bg-red-50 border border-red-100 text-red-600' 
                      : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                  }`}>
                    {entry.status}
                  </span>

                  <ChevronRight className="hidden sm:block w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-20 text-indigo-600" />
              <p className="text-xs font-semibold">No safety log entries recorded yet</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">Safe transits and SOS alerts will automatically compile here.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HistoryPage;
