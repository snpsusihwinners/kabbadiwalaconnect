import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Map, 
  LogOut, 
  ShieldCheck,
  Building2,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { InstallAppButton } from '../../components/ui/AddToHomeScreenPrompt';
import { Logo } from '../../components/ui/Logo';

const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview Dashboard', path: '/recycler' },
    { id: 'lots', icon: Inbox, label: 'Incoming Scrap Lots', path: '/recycler/lots' },
    { id: 'traceability', icon: Map, label: 'Traceability & EPR', path: '/recycler/traceability' },
  ];

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Sleek Modern Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <Logo light={true} subtitle="Recycler Operations" />
        </div>
        
        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/recycler' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('/collector')}
              className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-700/60"
            >
              <span className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Collector View</span>
              </span>
              <span>→</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">CPCB: #EW-MH-089</span>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Overview Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">Facility Node: Hinjewadi Phase 2, Pune</p>
          </div>

          <div className="flex items-center space-x-3">
            <InstallAppButton variant="button" />

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">GreenCycle Recycling Solutions</p>
              <span className="inline-flex items-center text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                CPCB R-Category Partner
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
              GC
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecyclerLayout;
