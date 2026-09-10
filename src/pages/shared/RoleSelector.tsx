import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  Volume2, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Award
} from 'lucide-react';

const RoleSelector: React.FC = () => {
  const { setRole, setLanguage, language } = useAppContext();
  const navigate = useNavigate();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStart = (selectedRole: 'collector' | 'recycler') => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const speak = () => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const text = language === 'mr'
        ? "इकोसेतु मध्ये आपले स्वागत आहे. तुमचा ई-कचरा, योग्य किमतीत योग्य ठिकाणी. सुरू करण्यासाठी स्क्रॅप कलेक्टर किंवा रीसायकलर निवडा."
        : language === 'hi'
        ? "इकोसेतु में आपका स्वागत है. आपका ई-वेस्ट, सही कीमत पर सही जगह. शुरू करने के लिए स्क्रैप कलेक्टर या रीसाइक्लर चुनें."
        : "Welcome to ECOSETU. Your e-waste, right price, right place. Choose collector or recycler to begin.";

      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#06140e] bg-grain-pattern text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Stamp Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>सर्कुलर ई-वेस्ट सेतु • BHARAT</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
              <span>ECOSETU</span>
            </h1>
            <p className="text-lg font-bold text-amber-300 font-vernacular">
              इकोसेतु • डिजिटल रद्दी क्रांति
            </p>
          </div>

          <div className="bg-[#0b2117]/80 backdrop-blur-md border border-emerald-900/60 p-3.5 rounded-2xl mx-auto flex items-center justify-between text-left shadow-lg">
            <p className="text-xs text-slate-300 font-medium leading-relaxed pr-2">
              {language === 'hi' ? '“आपका ई-वेस्ट, सही कीमत पर सही जगह।”' : 
               language === 'mr' ? '“तुमचा ई-कचरा, योग्य किमतीत योग्य ठिकाणी.”' : 
               '“Fair market prices for scrap aggregators, verified traceability for recyclers.”'}
            </p>
            <button 
              onClick={speak}
              className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                  : 'bg-emerald-800/80 border-emerald-600 text-emerald-200 hover:bg-emerald-700'
              }`}
              title="Listen in Vernacular"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vernacular Language Selector Pills */}
        <div className="bg-[#0a1e15] p-1.5 rounded-2xl border border-emerald-900/60 flex space-x-1.5 shadow-inner">
          {[
            { id: 'hi', label: '🇮🇳 हिंदी', desc: 'Hindi' },
            { id: 'mr', label: '🇮🇳 मराठी', desc: 'Marathi' },
            { id: 'en', label: '🇬🇧 English', desc: 'Eng' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center ${
                language === lang.id
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-950 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <span className="font-semibold text-[13px]">{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Primary Role Selection Cards */}
        <div className="space-y-3.5">
          
          {/* Collector Card */}
          <button
            onClick={() => handleStart('collector')}
            className="w-full text-left bg-gradient-to-r from-[#0d3b2b] to-[#0a2e21] border-2 border-emerald-500/40 hover:border-emerald-400 p-5 rounded-[26px] shadow-tactile-green active:translate-y-1 transition-all duration-150 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1.5 pr-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  मोबाइल ऍप • MOBILE-FIRST
                </span>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>कलेक्टर / कबाड़ी भाई</span>
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                  {language === 'mr' 
                    ? 'फोटो काढून वजन टाका • चालू बाजारभाव जाणून थेट विका'
                    : 'फोटो खींचो, सही भाव जानो और अधिकृत रीसाइक्लर को बेचो'}
                </p>
              </div>

              <div className="w-13 h-13 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0 p-3 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                <Smartphone className="w-7 h-7" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-xs text-emerald-300 font-bold font-mono">
              <span>शुरू करें • START SELLING</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Recycler Card */}
          <button
            onClick={() => handleStart('recycler')}
            className="w-full text-left bg-[#0c1c15] border border-emerald-900/60 hover:border-amber-500/50 p-4.5 rounded-[24px] shadow-lg active:scale-98 transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center space-x-1.5">
                    <span>अधिकृत रीसाइक्लर पोर्टल</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Industrial Dashboard & CPCB Traceability
                  </p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* Footer Badge */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Smart India Hackathon • SIH 2026 Prototype</span>
        </div>

      </div>
    </div>
  );
};

export default RoleSelector;
