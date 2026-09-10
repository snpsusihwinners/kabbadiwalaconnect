import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet,
  Building2, 
  TrendingUp, 
  WifiOff,
  Wifi,
  Languages,
  ArrowLeftRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorLayout: React.FC = () => {
  const { language, setLanguage, isOnline, setIsOnline, syncQueue } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', path: '/collector', icon: Home, labelEn: 'Home', labelHi: 'मुख्य' },
    { id: 'prices', path: '/collector/prices', icon: TrendingUp, labelEn: 'Rates', labelHi: 'भाव' },
    { id: 'recyclers', path: '/collector/recyclers', icon: Building2, labelEn: 'Buyers', labelHi: 'खरेदीदार' },
    { id: 'earnings', path: '/collector/earnings', icon: Wallet, labelEn: 'Passbook', labelHi: 'खाते' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'hi' : (language === 'hi' ? 'en' : 'mr'));
  };

  const getLangName = () => {
    if (language === 'mr') return 'मराठी';
    if (language === 'hi') return 'हिंदी';
    return 'English';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row items-center justify-center md:p-6 lg:p-8">
      
      {/* Desktop Demonstration Panel */}
      <div className="hidden lg:flex flex-col w-80 mr-8 shrink-0 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              ES
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">ECOSETU</h2>
              <p className="text-xs text-slate-500">Collector Mobile App</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed">
            Vernacular, offline-first mobile interface designed for scrap aggregators and informal waste pickers.
          </p>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-semibold text-slate-700">Prototype Controls:</div>
            
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOnline ? 'Online (4G)' : 'Offline Simulation'}</span>
              </span>
              <span className="text-[10px] uppercase font-bold underline">Toggle</span>
            </button>

            <button 
              onClick={toggleLanguage}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-between transition-all"
            >
              <span className="flex items-center space-x-2">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                <span>Language: {getLangName()}</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Switch</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/recycler')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch to Recycler View</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-slate-600 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>CPCB authorized digital workflow with zero paperwork.</span>
        </div>
      </div>

      {/* Main Mobile App Frame */}
      <div className="w-full md:max-w-[430px] h-screen md:h-[860px] bg-white md:rounded-3xl shadow-lg md:border md:border-slate-300 flex flex-col overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ES
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-slate-900 text-base leading-tight">ECOSETU</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {language === 'mr' ? 'कचरा संकलन केंद्र' : 'Scrap Collector'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Language Chip */}
            <button 
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1"
            >
              <Languages className="w-3 h-3 text-slate-500" />
              <span>{getLangName()}</span>
            </button>

            {/* Offline Chip */}
            {!isOnline && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center space-x-1">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </span>
            )}
          </div>
        </header>

        {/* Offline Banner if disconnected */}
        {!isOnline && (
          <div className="bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between z-30">
            <div className="flex items-center space-x-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>ऑफलाईन मोड (Offline Mode active)</span>
            </div>
            {syncQueue.length > 0 && (
              <span className="bg-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">
                {syncQueue.length} Pending
              </span>
            )}
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-20 bg-slate-50">
          <Outlet />
        </main>

        {/* Clean, Modern Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center z-40">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/collector' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-150 min-w-[64px] ${
                  isActive 
                    ? 'text-emerald-700 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[11px] font-medium tracking-tight">
                  {language === 'en' ? item.labelEn : item.labelHi}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};

export default CollectorLayout;
