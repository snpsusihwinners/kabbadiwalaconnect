import React, { useState } from 'react';
import { 
  LogOut, 
  ShieldAlert, 
  Volume2, 
  BadgeCheck
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { useNavigate } from 'react-router-dom';
import { InstallAppButton } from '../../components/ui/AddToHomeScreenPrompt';

const Profile: React.FC = () => {
  const { setRole, language } = useAppContext();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [playingItem, setPlayingItem] = useState<number | null>(null);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const safetyItems = [
    { 
      icon: '🔥', 
      title: language === 'en' ? 'Never Burn Cables' : (language === 'mr' ? 'तारांना कधीही जाळू नका' : 'तारों को कभी न जलाएं'), 
      desc: language === 'en' ? 'Burning cables releases toxic fumes that severely damage lungs. Deliver intact cables to authorized recyclers.' : (language === 'mr' ? 'तारा जाळल्याने विषारी धूर निघतो, ज्याने फुफ्फुसांना हानी पोहोचते. रिसायकलरला संपूर्ण केबल द्या.' : 'तार जलाने से जहरीला धुआं निकलता है जो फेफड़ों को नुकसान पहुंचाता है। रीसाइक्लर को पूरा केबल दें।'),
      speak: language === 'en' ? 'Never burn cables. Deliver intact wires directly to recyclers.' : (language === 'mr' ? 'तारांना कधीही जाळू नका. केबल थेट रिसायकलरला द्या.' : 'तारों को कभी न जलाएं. तार सीधे रीसाइक्लर को दें.')
    },
    { 
      icon: '☣️', 
      title: language === 'en' ? 'Avoid Acid Extraction' : (language === 'mr' ? 'अॅसिडने धातू काढू नका' : 'एसिड से धातु न निकालें'), 
      desc: language === 'en' ? 'Extracting precious metals using crude acid is illegal, dangerous, and causes severe chemical burns.' : (language === 'mr' ? 'अॅसिडने सोने किंवा तांबे काढणे बेकायदेशीर व घातक आहे. त्वचा व डोळे जळू शकतात.' : 'तेज़ाब से धातु निकालना गैरकानूनी और जानलेवा है। फेफड़े और त्वचा झुलस सकती है।'),
      speak: language === 'en' ? 'Avoid crude acid extraction. It is dangerous and harmful.' : (language === 'mr' ? 'अॅसिडचा वापर करू नका. हे अत्यंत धोकादायक आहे.' : 'एसिड से धातु कभी न निकालें. यह खतरनाक है.')
    },
    { 
      icon: '🔋', 
      title: language === 'en' ? 'Do Not Puncture Batteries' : (language === 'mr' ? 'बॅटरी तोडू किंवा कापू नका' : 'बैटरी को कभी न तोड़ें'), 
      desc: language === 'en' ? 'Puncturing or crushing lithium or lead batteries can cause intense fires and chemical explosions.' : (language === 'mr' ? 'लिथियम व लेड बॅटरींना ठोकल्यास आग व स्फोट होऊ शकतो.' : 'लिथियम और लेड एसिड बैटरी को ठोकने या छेदने से आग और विस्फोट हो सकता है।'),
      speak: language === 'en' ? 'Do not break batteries. Lithium batteries can explode or catch fire.' : (language === 'mr' ? 'बॅटरी कधीही तोडू नका. लिथियम बॅटरी पेट घेऊ शकते.' : 'बैटरी को कभी न तोड़ें. लिथियम बैटरी फटने से आग लग सकती है.')
    },
    { 
      icon: '🧤', 
      title: language === 'en' ? 'Always Wear Protective Gloves' : (language === 'mr' ? 'नेहमी हातमोजे वापरा' : 'हमेशा दस्ताने पहनें'), 
      desc: language === 'en' ? 'Use heavy-duty rubber or leather gloves when sorting circuit boards, sharp copper edges, and broken glass.' : (language === 'mr' ? 'सर्किट बोर्ड व तुटलेली काच हाताळताना जाड रबर किंवा लेदर हातमोजे वापरा.' : 'सर्किट बोर्ड और टूटे कांच को छूते समय मोटे दस्तानों का अनिवार्य प्रयोग करें।'),
      speak: language === 'en' ? 'Always wear protective gloves when handling e-waste.' : (language === 'mr' ? 'हातात नेहमी जाड हातमोजे घाला.' : 'हमेशा दस्ताने पहनें. चोट से बचें.')
    },
  ];

  const playSafetyAudio = (index: number, text: string) => {
    if ('speechSynthesis' in window) {
      setPlayingItem(index);
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'en') utterance.lang = 'en-IN';
      else if (language === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'mr-IN';
      utterance.onend = () => setPlayingItem(null);
      utterance.onerror = () => setPlayingItem(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Identity Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              RJ
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-slate-900">Ramdas Jadhav</h3>
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                COL-1028 • Pune Station Hub
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t.activeStatusBadge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">{t.serviceAreaLabel}</span>
            <span className="font-bold text-slate-900">{t.serviceAreaValue}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">{t.totalHandoversLabel}</span>
            <span className="font-bold text-emerald-700">{t.handoversCountValue}</span>
          </div>
        </div>
      </div>

      {/* Add to Home Screen Option */}
      <InstallAppButton variant="menu-item" />

      {/* Safety Education Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <ShieldAlert className="w-4 h-4 text-amber-600 mr-1.5" />
            <span>{t.safetyRulesTitle}</span>
          </h3>
          <span className="text-xs text-slate-400">{t.tapToListenSub}</span>
        </div>

        <div className="space-y-2.5">
          {safetyItems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-start space-x-3 relative"
            >
              <div className="text-2xl p-2 bg-slate-100 rounded-xl shrink-0">
                {item.icon}
              </div>

              <div className="flex-1 space-y-0.5 pr-8">
                <h4 className="font-bold text-slate-900 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => playSafetyAudio(idx, item.speak)}
                className={`absolute top-3.5 right-3.5 p-2 rounded-xl border transition-all ${
                  playingItem === idx 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button 
          onClick={handleLogout}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>{t.switchRoleBtn}</span>
        </button>
      </div>

    </div>
  );
};

export default Profile;
