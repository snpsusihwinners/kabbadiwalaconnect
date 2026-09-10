import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  FileCheck, 
  IndianRupee, 
  Map, 
  Settings, 
  LogOut, 
  Scale, 
  QrCode
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GateInModal } from './GateInModal';

const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();

  const [gateInOpen, setGateInOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Operations Dashboard', path: '/recycler' },
    { id: 'lots', icon: Inbox, label: 'Incoming Lots & Bids', path: '/recycler/lots' },
    { id: 'offers', icon: FileCheck, label: 'Procurement Contracts', path: '/recycler/offers' },
    { id: 'traceability', icon: Map, label: 'Chain of Custody (Form-6)', path: '/recycler/traceability' },
    { id: 'prices', icon: IndianRupee, label: 'Procurement Rate Master', path: '/recycler/prices' },
    { id: 'settings', icon: Settings, label: 'Facility & CPCB License', path: '/recycler/settings' },
  ];

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-paper-100 font-sans text-industrial-900 selection:bg-amber-200 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-industrial-950 text-white flex flex-col border-r border-industrial-900 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-industrial-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-emerald-300 border border-forest-700 flex items-center justify-center font-display font-black text-base shadow-tactile">
              GC
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-tight text-white block">
                ECOSETU
              </span>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                Recycler Enterprise
              </span>
            </div>
          </div>

          <div className="mt-4 bg-industrial-900/80 p-2.5 rounded-xl border border-industrial-800 text-[11px]">
            <p className="font-bold text-white">GreenCycle Technologies</p>
            <p className="text-[10px] font-mono text-emerald-400 mt-0.5">CPCB/E-WASTE/2024/MH-0814</p>
          </div>
        </div>
        
        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-forest-800 text-white shadow-tactile border border-forest-700' 
                    : 'text-industrial-400 hover:bg-industrial-900 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-industrial-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Weighbridge Trigger & Sign Out */}
        <div className="p-4 border-t border-industrial-900 space-y-2">
          <button
            onClick={() => setGateInOpen(true)}
            className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-display font-bold py-2.5 px-3 rounded-xl shadow-tactile flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Weighbridge Gate-In</span>
          </button>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out to Home
          </button>
        </div>
      </aside>

      {/* Main Workstation Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Telemetry Header */}
        <header className="bg-white border-b border-paper-300 px-8 py-3 flex justify-between items-center shrink-0 shadow-sm">
          <div>
            <h1 className="text-base font-bold font-display text-industrial-950">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Operations Console'}
            </h1>
            <p className="text-[11px] text-industrial-500 font-medium">
              Bhosari MIDC Processing Plant • Scale #01 Calibrated
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Scale Telemetry Pill */}
            <div className="flex items-center gap-2 bg-paper-100 border border-paper-300 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-industrial-700 font-bold">SCALE 01 ONLINE</span>
              <span className="text-industrial-400">|</span>
              <span className="text-industrial-500">±0.05kg</span>
            </div>

            <button
              onClick={() => setGateInOpen(true)}
              className="bg-forest-800 hover:bg-forest-900 text-white px-4 py-2 rounded-xl text-xs font-display font-bold shadow-tactile flex items-center gap-1.5 transition-all"
            >
              <Scale className="w-4 h-4 text-emerald-300" />
              <span>Scan Lot QR</span>
            </button>
          </div>
        </header>

        {/* Scrollable Workstation Canvas */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Gate-In Weighbridge Modal */}
      <GateInModal 
        isOpen={gateInOpen} 
        onClose={() => setGateInOpen(false)} 
      />
    </div>
  );
};

export default RecyclerLayout;

