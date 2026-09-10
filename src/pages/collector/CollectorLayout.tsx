import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  IndianRupee, 
  Building2, 
  FileSpreadsheet, 
  User, 
  WifiOff, 
  RefreshCw, 
  MapPin, 
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isOnline, 
    setIsOnline, 
    syncQueue, 
    processSyncQueue, 
    language, 
    setLanguage, 
    speak, 
    isSpeaking 
  } = useAppContext();

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: language === 'hi' ? 'होम' : language === 'mr' ? 'होम' : 'Home', 
      path: '/collector' 
    },
    { 
      id: 'prices', 
      icon: IndianRupee, 
      label: language === 'hi' ? 'मंडी भाव' : language === 'mr' ? 'बाजार भाव' : 'Mandi Rates', 
      path: '/collector/prices' 
    },
    { 
      id: 'recyclers', 
      icon: Building2, 
      label: language === 'hi' ? 'खरीदार' : language === 'mr' ? 'खरेदीदार' : 'Recyclers', 
      path: '/collector/recyclers' 
    },
    { 
      id: 'earnings', 
      icon: FileSpreadsheet, 
      label: language === 'hi' ? 'खाता बही' : language === 'mr' ? 'खातावही' : 'Passbook', 
      path: '/collector/earnings' 
    },
    { 
      id: 'profile', 
      icon: User, 
      label: language === 'hi' ? 'प्रोफ़ाइल' : language === 'mr' ? 'प्रोफाइल' : 'Profile', 
      path: '/collector/profile' 
    },
  ];

  const handleAudioGuide = () => {
    let guide = '';
    if (location.pathname === '/collector') {
      guide = language === 'hi' 
        ? 'कलेक्टर होमपेज। नया स्क्रैप लॉट बनाने के लिए कैमरा बटन दबाएं, या आज के ताज़ा मंडी भाव देखें।'
        : language === 'mr'
        ? 'कलेक्टर मुख्य पृष्ठ. नवीन स्क्रॅप लॉट तयार करण्यासाठी कॅमेरा बटण दाबा, किंवा आजचे बाजार भाव पहा.'
        : 'Collector Home. Tap Create Lot to weigh and sell scrap, or check live Mandi rates.';
    } else if (location.pathname.includes('/prices')) {
      guide = language === 'hi'
        ? 'आज के पुणे मंडी स्क्रैप भाव। तांबा 620, पीसीबी 240, और लिथियम बैटरी 110 रुपये प्रति किलो।'
        : 'Today\'s Pune Mandi benchmark scrap prices.';
    } else {
      guide = language === 'hi' ? 'इकोसेतु कलेक्टर सेवा में आपका स्वागत है।' : 'EcoSetu Collector Field Service.';
    }
    speak(guide);
  };

  return (
    <div className="min-h-screen bg-industrial-950/20 sm:py-6 flex items-center justify-center font-sans antialiased selection:bg-amber-200">
      {/* Mobile Device Container Frame */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[880px] bg-paper-50 sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-industrial-900 flex flex-col overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="bg-forest-900 text-white px-4 py-3 shrink-0 flex items-center justify-between border-b border-forest-800 shadow-sm z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-800 border border-forest-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-300 shadow-inner">
              RS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">Raju Scrap Co.</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                  COL-1028
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-forest-300">
                <MapPin className="w-2.5 h-2.5 text-amber-400" />
                <span>Pune Market Yard (Zone 4)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Guide Button */}
            <button
              onClick={handleAudioGuide}
              className={`p-1.5 rounded-lg border transition-all ${
                isSpeaking 
                  ? 'bg-amber-500 text-industrial-950 border-amber-400 animate-pulse'
                  : 'bg-forest-800 hover:bg-forest-700 text-forest-200 border-forest-700'
              }`}
              title="Voice Assistance"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Offline/Online Toggle Simulator */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all flex items-center gap-1 ${
                isOnline 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                  : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              }`}
              title="Toggle Online/Offline for Field Simulation"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Language Pill */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'mr' : language === 'mr' ? 'en' : 'hi')}
              className="bg-forest-800 hover:bg-forest-700 text-forest-100 text-[11px] font-bold px-2 py-1 rounded-lg border border-forest-700"
              title="Switch Language"
            >
              {language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'EN'}
            </button>
          </div>
        </header>

        {/* Offline Banner & Sync Status */}
        {!isOnline && (
          <div className="bg-amber-600 text-industrial-950 px-4 py-2 flex items-center justify-between text-xs font-bold shrink-0 shadow-md">
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Field Mode (Lots save locally)</span>
            </div>
            {syncQueue.length > 0 && (
              <span className="bg-amber-800 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                {syncQueue.length} Queued
              </span>
            )}
          </div>
        )}

        {/* Online Sync Pending Alert */}
        {isOnline && syncQueue.length > 0 && (
          <div className="bg-emerald-700 text-white px-4 py-1.5 flex items-center justify-between text-xs font-semibold shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Back online! Syncing {syncQueue.length} offline transactions...</span>
            </div>
            <button 
              onClick={processSyncQueue}
              className="bg-emerald-900 hover:bg-emerald-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Sync</span>
            </button>
          </div>
        )}

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-paper-100 pb-20 no-scrollbar">
          <Outlet />
        </div>

        {/* Bottom Tactile Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-paper-300 px-2 py-1.5 flex justify-around items-center z-40 shadow-tactile-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/collector' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[58px] ${
                  isActive 
                    ? 'text-forest-900 font-bold bg-forest-50 border border-forest-200 shadow-sm' 
                    : 'text-industrial-500 hover:text-industrial-800'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 text-forest-800' : ''}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CollectorLayout;

