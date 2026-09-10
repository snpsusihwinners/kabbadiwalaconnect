import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  ShieldAlert, 
  Volume2, 
  BadgeCheck, 
  MapPin, 
  Calendar, 
  Award,
  Globe,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { setRole, language, setLanguage } = useAppContext();
  const navigate = useNavigate();
  const [playingItem, setPlayingItem] = useState<number | null>(null);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const safetyItems = [
    { 
      icon: '🔥', 
      titleHi: 'तारों को कभी न जलाएं', 
      descHi: 'तार जलाने से जहरीला धुआं निकलता है जो फेफड़ों को गंभीर नुकसान पहुंचाता है। रीसाइक्लर को पूरा केबल दें।',
      speak: 'तारों को कभी न जलाएं. तार जलाने से जहरीला धुआं निकलता है. रीसाइक्लर को पूरा केबल सीधे दें.'
    },
    { 
      icon: '☣️', 
      titleHi: 'एसिड से धातु न निकालें', 
      descHi: 'तेज़ाब से सोना या तांबा निकालना गैरकानूनी और जानलेवा है। फेफड़े और त्वचा झुलस सकती है।',
      speak: 'एसिड से धातु कभी न निकालें. तेज़ाब से धातु निकालना गैरकानूनी और जानलेवा है.'
    },
    { 
      icon: '🔋', 
      titleHi: 'बैटरी को कभी न तोड़ें', 
      descHi: 'लिथियम और लेड एसिड बैटरी को ठोकने या छेदने से आग और भयंकर विस्फोट हो सकता है।',
      speak: 'बैटरी को कभी न तोड़ें. लिथियम बैटरी फटने से आग लग सकती है.'
    },
    { 
      icon: '🧤', 
      titleHi: 'हमेशा दस्ताने पहनें', 
      descHi: 'सर्किट बोर्ड और टूटे कांच को छूते समय मोटे रबर या लेदर दस्तानों का अनिवार्य प्रयोग करें।',
      speak: 'हमेशा दस्ताने पहनें. सर्किट बोर्ड और कांच से हाथों को चोट से बचाएं.'
    },
  ];

  const playSafetyAudio = (index: number, text: string) => {
    if ('speechSynthesis' in window) {
      setPlayingItem(index);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setPlayingItem(null);
      utterance.onerror = () => setPlayingItem(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#13261e] pb-10">
      
      {/* Header */}
      <div className="bg-[#0b241a] text-white px-5 pt-4 pb-5 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              AGGREGATOR REGISTRY
            </span>
          </div>
          <h1 className="text-xl font-black text-white">कलेक्टर पहचान व सुरक्षा</h1>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            डिजिटल पहचान पत्र व अनौपचारिक स्क्रैप सुरक्षा नियम
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* Digital Identity Smart Card */}
        <div className="bg-gradient-to-br from-[#0c2e22] via-[#092218] to-[#05160f] text-white rounded-[28px] p-5 border-2 border-emerald-500/30 shadow-tactile-green relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#081a13] rounded-[14px] flex items-center justify-center text-amber-300 font-black text-xl font-mono">
                  RB
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-1">
                  <span>राजू भाई स्क्रैप</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-400 inline" />
                </h3>
                <p className="text-xs text-emerald-300 font-mono">
                  ID: COL-1028 • PUNE HUB
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
            <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-950">
              <span className="text-[10px] text-slate-400 block">कार्य क्षेत्र (Area):</span>
              <span className="font-bold text-white">पुणे शहर (Shivaji Nagar)</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-950">
              <span className="text-[10px] text-slate-400 block">कुल लेनदेन (Handovers):</span>
              <span className="font-bold text-emerald-300">42 पूर्ण लॉट ✓</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-950">
              <span className="text-[10px] text-slate-400 block">सक्रिय भाषा:</span>
              <span className="font-bold text-amber-300">
                {language === 'hi' ? 'हिंदी (Hindi)' : language === 'mr' ? 'मराठी (Marathi)' : 'English'}
              </span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-950">
              <span className="text-[10px] text-slate-400 block">रजिस्ट्रेशन स्थिति:</span>
              <span className="font-bold text-emerald-400">सक्रिय (Active)</span>
            </div>
          </div>
        </div>

        {/* Safety Education Section (Vernacular Audio Enabled) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center uppercase tracking-wide font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-600 mr-1.5" />
              सुरक्षा नियम • ऑडियो सुनें (Safety Rules)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">अनिवार्य दिशानिर्देश</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {safetyItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-3.5 border border-[#e6decb] shadow-sm hover:border-emerald-500/40 transition-all flex items-start space-x-3 relative"
              >
                <div className="text-3xl p-1.5 bg-[#fbf8f1] rounded-xl shrink-0">
                  {item.icon}
                </div>

                <div className="flex-1 space-y-1 pr-8">
                  <h4 className="font-black text-slate-900 text-sm">
                    {item.titleHi}
                  </h4>
                  <p className="text-xs text-slate-600 leading-snug">
                    {item.descHi}
                  </p>
                </div>

                <button
                  onClick={() => playSafetyAudio(idx, item.speak)}
                  className={`absolute top-3.5 right-3.5 p-2 rounded-xl border transition-all ${
                    playingItem === idx 
                      ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  title="ऑडियो सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          <button 
            onClick={handleLogout}
            className="w-full bg-white hover:bg-red-50 text-red-700 font-bold text-xs font-mono py-3.5 rounded-2xl border border-red-200 shadow-sm active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट / भूमिका बदलें (Switch Role)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
