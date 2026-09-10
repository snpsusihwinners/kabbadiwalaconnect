import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  IndianRupee, 
  Recycle, 
  FileText, 
  User, 
  WifiOff, 
  Wifi, 
  ShieldCheck, 
  ArrowLeftRight, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, setIsOnline, syncQueue, language, setLanguage } = useAppContext();

  const navItems = [
    { id: 'home', icon: Home, labelEn: 'Home', labelHi: 'होम', path: '/collector' },
    { id: 'prices', icon: IndianRupee, labelEn: 'Prices', labelHi: 'दाम', path: '/collector/prices' },
    { id: 'recyclers', icon: Recycle, labelEn: 'Recyclers', labelHi: 'रीसाइक्लर', path: '/collector/recyclers' },
    { id: 'earnings', icon: FileText, labelEn: 'Khata', labelHi: 'खाता', path: '/collector/earnings' },
    { id: 'profile', icon: User, labelEn: 'Profile', labelHi: 'प्रोफाइल', path: '/collector/profile' },
  ];

  const toggleLanguage = () => {
    if (language === 'hi') setLanguage('mr');
    else if (language === 'mr') setLanguage('en');
    else setLanguage('hi');
  };

  const getLangBadge = () => {
    if (language === 'hi') return '🇮🇳 हिंदी';
    if (language === 'mr') return '🇮🇳 मराठी';
    return '🇬🇧 English';
  };

  return (
    <div className="min-h-screen bg-[#07130e] bg-grain-pattern text-slate-100 flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glows for desktop presentation */}
      <div className="hidden md:block absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Desktop Presentation Companion Sidebar (Left) */}
      <div className="hidden xl:flex flex-col justify-between w-80 mr-8 py-6 text-slate-300 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>KABADDIWALA CONNECT • PROTOTYPE</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">
            ECOSETU <span className="text-emerald-400 text-xl font-normal block mt-1 font-mono">सेतु सर्कुलर नेटवर्क</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vernacular offline-first digital bridge connecting informal waste pickers with certified authorized recyclers.
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="bg-[#0e2118]/90 border border-emerald-900/50 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">Demo Controls</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Network Condition:</span>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
                  isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'Online 4G' : 'Offline Mode'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Active Language:</span>
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 transition-all"
              >
                {getLangBadge()}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/recycler')}
              className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch to Recycler Portal 🖥️</span>
            </button>
          </div>
        </div>

        {/* Verification stamp */}
        <div className="flex items-center space-x-3 text-xs text-slate-400 bg-[#0c1a14]/60 p-3 rounded-xl border border-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>CPCB & MPCB Digital Traceability Mandate compliant.</span>
        </div>
      </div>

      {/* Flagship Mobile Handset Frame */}
      <div className="w-full md:max-w-[420px] h-screen md:h-[860px] bg-[#fbf8f1] text-[#0f241a] md:rounded-[44px] shadow-2xl md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden relative md:border-[10px] md:border-[#1a2e24] transition-all">
        
        {/* Smartphone Speaker/Camera Bar (Desktop presentation) */}
        <div className="hidden md:flex justify-between items-center px-8 pt-3 pb-1 bg-[#fbf8f1] z-50 text-[11px] font-mono font-bold text-slate-500">
          <span>12:45</span>
          <div className="w-20 h-4 bg-[#1a2e24] rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-600 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Offline notification banner */}
        {!isOnline && (
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold tracking-wide shadow-md z-50 animate-pulse">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-amber-200" />
              <span>ऑफ़लाइन मोड • बिना इंटरनेट डेटा सेव होगा</span>
            </div>
            {syncQueue.length > 0 && (
              <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-amber-200">
                {syncQueue.length} कतार में
              </span>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 relative bg-[#fbf8f1]">
          <Outlet />
        </main>

        {/* Tactile Bottom Navigation with Haptic Glow */}
        <nav className="absolute bottom-0 left-0 right-0 bg-[#ffffff]/95 backdrop-blur-lg border-t border-[#e6decb] px-3 py-2 flex justify-between items-center z-40 shadow-[0_-8px_20px_rgba(12,46,34,0.06)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/collector' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 min-w-[58px] relative ${
                  isActive 
                    ? 'text-emerald-800 scale-105 font-bold' 
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-emerald-600" />
                )}
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-100 text-emerald-800 shadow-sm' 
                    : 'bg-transparent text-slate-500'
                }`}>
                  <item.icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">
                  {language === 'en' ? item.labelEn : item.labelHi}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Quick Switcher (Right) */}
      <div className="hidden xl:flex flex-col justify-center w-72 ml-8 space-y-4 text-xs text-slate-400">
        <div className="bg-[#0b1b14] border border-emerald-900/40 p-4 rounded-2xl space-y-3">
          <p className="font-bold text-white text-sm flex items-center space-x-2">
            <span>🇮🇳</span>
            <span>Made for Bharat's Scrap Economy</span>
          </p>
          <p className="leading-relaxed">
            Engineered with high contrast typography, voice guidance, and instant visual validation for aggregators with basic smartphones.
          </p>
          <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
            <span>NODE: PUNE_MANDI</span>
            <span>VER: 2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorLayout;
