import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Map, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Smartphone, 
  Activity,
  Award,
  Bell
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Overview', path: '/recycler' },
    { id: 'lots', icon: Inbox, label: 'Incoming Scrap Lots', path: '/recycler/lots' },
    { id: 'traceability', icon: Map, label: 'Traceability & EPR', path: '/recycler/traceability' },
  ];

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#07130e] text-slate-100 font-sans overflow-hidden">
      
      {/* Dark Industrial Sidebar */}
      <aside className="w-68 bg-[#0a1c14] border-r border-emerald-950 flex flex-col shrink-0">
        <div className="p-6 border-b border-emerald-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#071710] rounded-[10px] flex items-center justify-center font-mono font-black text-emerald-300">
                ES
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-none">ECOSETU</h2>
              <p className="text-[10px] font-mono text-emerald-400 mt-0.5 tracking-wider uppercase">
                RECYCLER TERMINAL
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Circular Operations
          </div>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/recycler' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3.5 py-3 text-xs font-mono font-bold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-inner' 
                    : 'text-slate-400 hover:bg-emerald-950/40 hover:text-slate-200'
                }`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}

          {/* Quick toggle to Mobile Collector View */}
          <div className="pt-4 px-1">
            <button
              onClick={() => navigate('/collector')}
              className="w-full p-3 rounded-xl bg-[#0e271c] hover:bg-[#123325] border border-emerald-800/40 text-left text-xs text-emerald-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold font-mono">📱 Mobile View</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">
                  Switch
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Preview scrap collector interface
              </p>
            </button>
          </div>
        </nav>

        {/* Facility Credentials Footer */}
        <div className="p-4 border-t border-emerald-950/60 bg-[#081711] space-y-3">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate font-mono">CPCB: #EW-MH-PUN-089</span>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-mono font-bold text-red-400 rounded-lg hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a1812] bg-grain-pattern">
        
        {/* Top Header */}
        <header className="bg-[#0c1f17]/90 backdrop-blur-md border-b border-emerald-950/80 px-8 py-4 flex justify-between items-center z-10 shrink-0">
          <div>
            <h1 className="text-lg font-black text-white font-mono uppercase tracking-wider">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Recycler Command Center'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">Facility Node: Hinjewadi Phase 2, Pune</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">GreenCycle Recycling Solutions Ltd.</p>
              <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                Authorized R-Category Partner ✓
              </span>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#091a13] rounded-[10px] flex items-center justify-center font-mono font-black text-amber-300 text-sm">
                GC
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecyclerLayout;
