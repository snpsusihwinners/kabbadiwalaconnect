import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Smartphone,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RoleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useAppContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStart = (role: 'collector' | 'recycler') => {
    navigate(`/${role}`);
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const text = language === 'hi' 
        ? 'ECOSETU में आपका स्वागत है। कबाड़ीवाला या रीसाइक्लर चुनें।' 
        : language === 'mr'
          ? 'ECOSETU मध्ये आपले स्वागत आहे. कबाड़ीवाला किंवा रिसायकलर निवडा.'
          : 'Welcome to ECOSETU. Choose Collector or Recycler.';

      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-khata-paper text-khata-ink bg-ruled-pattern font-mono flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white border-4 border-khata-ink shadow-brutal p-6 relative">
        
        {/* Top Ledger Stamp */}
        <div className="absolute -top-4 -right-4 bg-khata-red text-khata-paper px-3 py-1 font-bold transform rotate-6 border-2 border-khata-ink shadow-brutal-sm text-xs">
          SIH 2026 PROTOTYPE
        </div>

        {/* Title */}
        <div className="border-b-4 border-khata-ink pb-6 mb-6 text-center">
          <h1 className="text-6xl font-vernacular font-black tracking-tight mb-2">
            ECOSETU
          </h1>
          <p className="font-bold text-khata-ink/80 text-sm">
            E-WASTE CIRCULATION NETWORK
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex border-4 border-khata-ink mb-6">
          {[
            { id: 'mr', label: 'मराठी' },
            { id: 'hi', label: 'हिंदी' },
            { id: 'en', label: 'ENG' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as any)}
              className={`flex-1 py-2 font-bold transition-colors ${
                language === lang.id
                  ? 'bg-khata-ink text-khata-paper'
                  : 'bg-white text-khata-ink hover:bg-khata-paper border-r-2 border-khata-ink last:border-r-0'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Voice assistance line */}
        <button 
          onClick={speak}
          className={`w-full p-3 mb-6 border-4 border-khata-ink font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all ${
            isPlayingAudio ? 'bg-khata-blue text-khata-paper' : 'bg-khata-paper text-khata-ink'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>{isPlayingAudio ? 'PLAYING AUDIO...' : 'LISTEN TO INSTRUCTIONS'}</span>
        </button>

        {/* Roles */}
        <div className="space-y-4">
          
          <button
            onClick={() => handleStart('collector')}
            className="w-full text-left bg-khata-red text-khata-paper border-4 border-khata-ink p-4 shadow-brutal active:shadow-none active:translate-y-1 active:translate-x-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-khata-paper text-khata-red px-1 font-bold mb-1 inline-block">
                  MOBILE / APP
                </span>
                <h3 className="text-2xl font-vernacular leading-none mb-1">
                  {language === 'mr' ? 'कलेक्टर' : language === 'hi' ? 'कलेक्टर' : 'COLLECTOR'}
                </h3>
                <p className="text-xs font-mono">
                  {language === 'en' ? 'Waste Pickers & Aggregators' : 'कचरा वेचक आणि संकलक'}
                </p>
              </div>
              <div className="w-12 h-12 bg-khata-paper text-khata-red border-2 border-khata-ink flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>
          </button>

          <button
            onClick={() => handleStart('recycler')}
            className="w-full text-left bg-khata-blue text-khata-paper border-4 border-khata-ink p-4 shadow-brutal active:shadow-none active:translate-y-1 active:translate-x-1 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-khata-paper text-khata-blue px-1 font-bold mb-1 inline-block">
                  DESKTOP / WEB
                </span>
                <h3 className="text-2xl font-vernacular leading-none mb-1">
                  {language === 'mr' ? 'रीसायकलर' : language === 'hi' ? 'रीसायकलर' : 'RECYCLER'}
                </h3>
                <p className="text-xs font-mono">
                  {language === 'en' ? 'CPCB Authorized Facilities' : 'अधिकृत प्रक्रिया केंद्रे'}
                </p>
              </div>
              <div className="w-12 h-12 bg-khata-paper text-khata-blue border-2 border-khata-ink flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </button>

        </div>

      </div>

    </div>
  );
};

export default RoleSelector;
