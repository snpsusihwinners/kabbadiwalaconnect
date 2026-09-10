import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Map, 
  LogOut, 
  ShieldCheck,
  Building2,
  Terminal
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'CONTROL DESK', path: '/recycler' },
    { id: 'lots', icon: Inbox, label: 'INBOUND SCRAP', path: '/recycler/lots' },
    { id: 'traceability', icon: Map, label: 'TRACEABILITY', path: '/recycler/traceability' },
  ];

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-khata-paper text-khata-ink font-mono overflow-hidden bg-grid-pattern">
      
      {/* Brutalist Sidebar */}
      <aside className="w-72 bg-khata-blue text-khata-paper border-r-4 border-khata-ink flex flex-col shrink-0">
        
        <div className="p-6 border-b-4 border-khata-ink bg-khata-ink">
          <div className="flex items-center space-x-3">
            <Terminal className="w-8 h-8 text-khata-paper" />
            <div>
              <h2 className="text-3xl font-black font-vernacular leading-none text-khata-paper">ECOSETU</h2>
              <p className="text-[10px] font-bold text-khata-paper/80 mt-1 tracking-widest uppercase">
                BUYER TERMINAL
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/recycler' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold border-2 transition-all ${
                  isActive 
                    ? 'bg-khata-paper text-khata-ink border-khata-paper shadow-brutal' 
                    : 'bg-transparent text-khata-paper border-transparent hover:border-khata-paper/50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t-2 border-khata-paper/20">
            <button
              onClick={() => navigate('/collector')}
              className="w-full p-3 border-2 border-khata-paper font-bold text-xs flex items-center justify-between hover:bg-khata-paper hover:text-khata-ink transition-colors"
            >
              <span>SWITCH TO MOBILE</span>
              <span>→</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t-4 border-khata-ink bg-khata-ink">
          <div className="flex items-center space-x-2 text-xs font-bold text-khata-paper mb-4">
            <ShieldCheck className="w-4 h-4 text-khata-green" />
            <span>CPCB: #EW-MH-089</span>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-bold border-2 border-khata-red text-khata-red hover:bg-khata-red hover:text-khata-paper transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            EXIT SYSTEM
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="bg-white border-b-4 border-khata-ink px-8 py-4 flex justify-between items-center z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-black font-vernacular uppercase tracking-widest">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'DASHBOARD'}
            </h1>
            <p className="text-xs font-bold mt-1 text-khata-ink/60">NODE: HINJEWADI, PUNE</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold">GreenCycle Solutions</p>
              <span className="inline-block bg-khata-ink text-khata-paper text-[10px] px-2 py-0.5 mt-1 font-bold">
                AUTHORIZED FACILITY
              </span>
            </div>
            <div className="w-12 h-12 border-4 border-khata-ink bg-khata-paper flex items-center justify-center shadow-brutal">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecyclerLayout;
