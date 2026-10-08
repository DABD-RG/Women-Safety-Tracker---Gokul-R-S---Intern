import React from 'react';
import { 
  LayoutDashboard, Compass, History, PhoneCall, Map, HeartPulse, 
  HelpCircle, LogOut, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stealthMode: boolean;
  onToggleStealth: () => void;
  sosActive: boolean;
  onTriggerSOS?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  sosActive,
  onTriggerSOS
}) => {

  const { logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Map / Dashboard', icon: LayoutDashboard },
    { id: 'active_journey', label: 'Active Journey', icon: Compass },
    { id: 'history', label: 'History', icon: History },
    { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'map_hotspots', label: 'Location Hub', icon: Map },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200 bg-white text-slate-800 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3 bg-white">
        <div className={`p-2 rounded-xl bg-amber-400 text-black ${sosActive ? 'animate-pulse' : ''}`}>
          <HeartPulse className="w-5 h-5 text-black" />
        </div>
        <div className="text-left">
          <span className="font-extrabold text-base text-slate-800 tracking-tight block">
            Woman Safety Tracker
          </span>
          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            Safe Journey Protection
          </span>
        </div>
      </div>

      {/* Navigation links with Cobalt/Indigo theme */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto bg-white">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-extrabold text-xs group border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-105 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-650'
              }`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Red Emergency Button at Sidebar Bottom (Image 3) */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white space-y-2">
        <button
          type="button"
          onClick={onTriggerSOS}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-red-650 hover:bg-red-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-red-500/10 border border-red-500/20"
        >
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>SOS Emergency</span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-455 text-slate-400">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center justify-center py-2 hover:bg-slate-50 rounded-xl"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Help
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center py-2 hover:bg-slate-50 rounded-xl text-red-500"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
