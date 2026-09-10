import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet,
  Building2, 
  LineChart, 
  WifiOff,
  Wifi,
  Languages,
  ArrowLeftRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorLayout: React.FC = () => {
  const { language, setLanguage, isOnline, setIsOnline, syncQueue } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', path: '/collector', icon: Home, labelEn: 'HOME', labelHi: 'मुख्य' },
    { id: 'prices', path: '/collector/prices', icon: LineChart, labelEn: 'RATES', labelHi: 'भाव' },
    { id: 'recyclers', path: '/collector/recyclers', icon: Building2, labelEn: 'BUYERS', labelHi: 'खरेदीदार' },
    { id: 'earnings', path: '/collector/earnings', icon: BookOpen, labelEn: 'LEDGER', labelHi: 'खाते' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : (language === 'hi' ? 'mr' : 'en'));
  };

  const getLangBadge = () => {
    if (language === 'en') return 'EN (English)';
    if (language === 'hi') return 'HI (हिंदी)';
    return 'MR (मराठी)';
  };

  return (
    <div className="min-h-screen bg-khata-paper text-khata-ink bg-grid-pattern font-mono flex flex-col md:flex-row items-center justify-center p-0 md:p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Graphic elements */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
        <h2 className="text-9xl font-vernacular">ECOSETU</h2>
      </div>

      {/* Presentation/Debug Panel (Desktop Only) */}
      <div className="hidden md:flex flex-col w-[360px] mr-12 shrink-0 z-10 space-y-6">
        
        {/* Title */}
        <div className="brutal-card p-6 bg-khata-blue text-khata-paper border-4 border-khata-ink shadow-brutal text-left">
          <div className="inline-block px-2 py-1 bg-khata-red text-khata-paper text-xs font-bold font-mono border-2 border-khata-ink mb-4 transform -rotate-2">
            OFFICIAL DIGITAL LEDGER
          </div>
          <h1 className="text-5xl font-vernacular font-black tracking-tight leading-none mb-4">
            ECOSETU
          </h1>
          <p className="text-sm font-mono border-l-4 border-khata-red pl-3 leading-tight opacity-90">
            A digital Bahi-Khata replacing traditional paper ledgers for informal waste aggregators.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="brutal-card p-4 border-4 border-khata-ink bg-white shadow-brutal space-y-4">
          <div className="flex items-center space-x-2 border-b-4 border-khata-ink pb-2">
            <span className="font-bold text-lg">PROTOTYPE CONTROLS</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <p className="text-xs font-bold mb-1">NETWORK STATE:</p>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-full p-2 border-4 text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform ${
                  isOnline 
                    ? 'border-khata-green text-khata-green bg-khata-green/10' 
                    : 'border-khata-red text-khata-red bg-khata-red/10'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
              </button>
            </div>

            <div>
              <p className="text-xs font-bold mb-1">LANGUAGE:</p>
              <button 
                onClick={toggleLanguage}
                className="w-full p-2 border-4 border-khata-ink hover:bg-khata-ink hover:text-khata-paper text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-colors"
              >
                <Languages className="w-4 h-4" />
                <span>{getLangBadge()}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/recycler')}
                className="w-full p-2 bg-khata-ink text-khata-paper font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>SWITCH TO BUYER</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Mobile Handset Frame */}
      <div className="w-full md:w-[400px] h-[100dvh] md:h-[820px] bg-khata-paper md:border-4 md:border-khata-ink md:shadow-brutal shrink-0 flex flex-col relative overflow-hidden transition-all">
        
        {/* Top Speaker notch (Desktop) */}
        <div className="hidden md:flex justify-center bg-khata-ink h-6 items-end pb-1 border-b-4 border-khata-ink shrink-0">
           <div className="w-24 h-2 bg-khata-paper/20 rounded-full"></div>
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-khata-red text-khata-paper px-4 py-2 flex items-center justify-between text-xs font-bold font-mono border-b-4 border-khata-ink z-50">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span>OFFLINE: SYNC PAUSED</span>
            </div>
            {syncQueue.length > 0 && (
              <span className="bg-khata-ink text-khata-paper px-2 py-0.5 border border-khata-paper">
                {syncQueue.length} PENDING
              </span>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 relative bg-transparent scrollbar-hide">
          <Outlet />
        </main>

        {/* Brutalist Bottom Nav */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-khata-ink flex z-40 h-[72px]">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path !== '/collector' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center border-r-4 border-khata-ink last:border-r-0 transition-colors ${
                  isActive 
                    ? 'bg-khata-ink text-khata-paper' 
                    : 'bg-white text-khata-ink hover:bg-khata-paper'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-khata-paper' : ''}`} strokeWidth={isActive ? 2 : 2.5} />
                <span className="text-[10px] font-bold tracking-tight">
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
