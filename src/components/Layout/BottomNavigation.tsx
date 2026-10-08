import React from 'react';
import { LayoutDashboard, Compass, History, PhoneCall, Map } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'active_journey', icon: Compass, label: 'Journey' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'contacts', icon: PhoneCall, label: 'Contacts' },
    { id: 'map_hotspots', icon: Map, label: 'Hotspots' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 border-slate-200 backdrop-blur-md text-slate-800">
      <div className="flex justify-around items-center py-2 px-1">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center py-1.5 px-3.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50 font-black'
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;