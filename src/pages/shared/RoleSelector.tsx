import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Smartphone,
  ShieldCheck,
  Volume2,
  Recycle,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RoleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setRole } = useAppContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStart = (role: 'collector' | 'recycler') => {
    setRole(role);
    navigate(`/${role}`);
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const text = language === 'hi' 
        ? 'ReGain में आपका स्वागत है। कबाड़ीवाला या अधिकृत रीसाइक्लर विकल्प चुनें।' 
        : language === 'mr'
          ? 'ReGain मध्ये आपले स्वागत आहे. कबाड़ीवाला किंवा अधिकृत रिसायकलर निवडा.'
          : 'Welcome to ReGain. Choose Collector or Authorized Recycler to continue.';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-md bg-emerald-900 border-2 border-emerald-500/20">
              <img src="/logo.png" alt="ReGain Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <Recycle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Bridge for E-Waste</span>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center justify-center">
              <span className="text-emerald-600">Re</span><span>Gain</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {language === 'mr' ? 'कचरा वेचक व अधिकृत रिसायकलर जोडणी' : 
               language === 'hi' ? 'कबाड़ीवाले और अधिकृत रीसाइक्लर का डिजिटल सेतु' : 
               'Connecting scrap aggregators with authorized recyclers'}
            </p>
          </div>
        </div>

        {/* Language Selection & Audio Helper */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>भाषा निवडा / Choose Language</span>
            </span>
            <button 
              onClick={speak}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1 transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Listen to instructions"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>{isPlayingAudio ? 'बोलत आहे...' : 'ऐका (Listen)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mr', label: 'मराठी' },
              { id: 'hi', label: 'हिंदी' },
              { id: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  language === lang.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Selection Options */}
        <div className="space-y-3.5">
          
          {/* Collector Card */}
          <button
            onClick={() => handleStart('collector')}
            className="w-full text-left bg-white border-2 border-emerald-500 hover:border-emerald-600 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 pr-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wide">
                  {language === 'mr' ? 'कलेक्टर' : language === 'hi' ? 'कलेक्टर' : 'COLLECTOR'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {language === 'mr' ? 'कबाड़ीवाला / कचरा संकलक' : 
                   language === 'hi' ? 'कबाड़ीवाला / कचरा संकलक' : 
                   'Scrap Collector & Aggregator'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'mr' 
                    ? 'रोजचे बाजार भाव पहा, योग्य भाव मिळवा आणि त्वरित पेमेंट मिळवा.' 
                    : language === 'hi'
                    ? 'दैनिक मंडी रेट देखें, सही कीमत पर बेचें और तुरंत नकद/UPI पाएं.'
                    : 'Check daily rates, create scrap lots, and get verified instant payouts.'}
                </p>

                <div className="pt-2 flex items-center space-x-3 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {language === 'mr' ? 'खरा भाव' : 'Fair Rates'}
                  </span>
                  <span className="flex items-center text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {language === 'mr' ? 'त्वरित पैसे' : 'Fast Payouts'}
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{language === 'mr' ? 'सुरू करा (Start)' : 'Enter Collector App'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Recycler Card */}
          <button
            onClick={() => handleStart('recycler')}
            className="w-full text-left bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 pr-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wide">
                  {language === 'mr' ? 'रिसायकलर' : language === 'hi' ? 'रीसाइक्लर' : 'RECYCLER'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                  {language === 'mr' ? 'अधिकृत रिसायकलिंग केंद्र' : 
                   language === 'hi' ? 'अधिकृत रीसाइक्लिंग केंद्र' : 
                   'Authorized Recycler Facility'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'mr' 
                    ? 'डिजिटल लॉट पावती, CPCB ट्रेसिबिलिटी आणि EPR अनुपालन.' 
                    : language === 'hi'
                    ? 'डिजिटल लॉट पावती, CPCB ट्रेसिबिलिटी और EPR कंप्लायंस.'
                    : 'Industrial dashboard for inbound verified e-waste and digital EPR traceability.'}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{language === 'mr' ? 'प्रक्रिया केंद्र डॅशबोर्ड' : 'Enter Recycler Portal'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Footer Verification Badge */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Smart India Hackathon • SIH 2026 Prototype</span>
        </div>

      </div>
    </div>
  );
};

export default RoleSelector;
