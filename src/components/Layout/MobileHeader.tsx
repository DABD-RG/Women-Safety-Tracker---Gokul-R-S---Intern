import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Compass, History, PhoneCall, Map, HeartPulse, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stealthMode: boolean;
  onToggleStealth: () => void;
  sosActive: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  onTabChange,
  sosActive
}) => {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Map / Dashboard', icon: LayoutDashboard },
    { id: 'active_journey', label: 'Active Journey', icon: Compass },
    { id: 'history', label: 'History', icon: History },
    { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'map_hotspots', label: 'Location Hub', icon: Map },
  ];

  const handleLinkClick = (tabId: string) => {
    onTabChange(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 border-b border-slate-200 flex items-center justify-between px-4 bg-white/90 backdrop-blur-md text-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95"
            aria-label="Toggle menu"
          >
            {drawerOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-black">
              <HeartPulse className="w-4 h-4 text-black" />
            </div>
            <span className="font-extrabold text-sm text-slate-800 tracking-tight">
              Woman Safety Tracker
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {sosActive && (
            <span className="flex h-2.5 w-2.5 mr-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </div>
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 z-45 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div className={`fixed top-0 bottom-0 left-0 w-72 max-w-[80vw] z-50 md:hidden flex flex-col transition-transform duration-300 ease-out border-r border-slate-200 bg-white text-slate-800 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-black">
              <HeartPulse className="w-4 h-4 text-black" />
            </div>
            <span className="font-extrabold text-base text-slate-800 tracking-tight">
              Woman Safety Tracker
            </span>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto bg-white">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-extrabold text-xs transition-all border ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-white text-center flex justify-around text-[10px] font-bold text-slate-400">
          <button 
            onClick={() => { logout(); setDrawerOpen(false); }} 
            className="flex items-center text-red-500"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
