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
      titleHi: 'तारांना कधीही जाळू नका', 
      descHi: 'तारा जाळल्याने विषारी धूर निघतो, ज्याने फुफ्फुसांना हानी पोहोचते. रिसायकलरला संपूर्ण केबल द्या.',
      speak: 'तारांना कधीही जाळू नका. केबल थेट रिसायकलरला द्या.'
    },
    { 
      icon: '☣️', 
      titleHi: 'अॅसिडने धातू काढू नका', 
      descHi: 'अॅसिडने सोने किंवा तांबे काढणे बेकायदेशीर व घातक आहे. त्वचा व डोळे जळू शकतात.',
      speak: 'अॅसिडचा वापर करू नका. हे अत्यंत धोकादायक आहे.'
    },
    { 
      icon: '🔋', 
      titleHi: 'बॅटरी तोडू किंवा कापू नका', 
      descHi: 'लिथियम व लेड बॅटरींना ठोकल्यास आग व स्फोट होऊ शकतो.',
      speak: 'बॅटरी कधीही तोडू नका. लिथियम बॅटरी पेट घेऊ शकते.'
    },
    { 
      icon: '🧤', 
      titleHi: 'नेहमी हातमोजे वापरा', 
      descHi: 'सर्किट बोर्ड व तुटलेली काच हाताळताना जाड रबर किंवा लेदर हातमोजे वापरा.',
      speak: 'हातात नेहमी जाड हातमोजे घाला.'
    },
  ];

  const playSafetyAudio = (index: number, text: string) => {
    if ('speechSynthesis' in window) {
      setPlayingItem(index);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'mr-IN';
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
              रा
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-slate-900">रामदास जाधव</h3>
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ID: COL-1028 • पुणे स्टेशन केंद्र
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            सक्रिय (Active)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">कार्यक्षेत्र:</span>
            <span className="font-bold text-slate-900">पुणे महानगर (Pune)</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">एकूण व्यवहार:</span>
            <span className="font-bold text-emerald-700">४२ यशस्वी लॉट ✓</span>
          </div>
        </div>
      </div>

      {/* Safety Education Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <ShieldAlert className="w-4 h-4 text-amber-600 mr-1.5" />
            <span>सुरक्षितता नियम (Safety Guidelines)</span>
          </h3>
          <span className="text-xs text-slate-400">ऐकण्यासाठी बटन दाबा</span>
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
                  {item.titleHi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.descHi}
                </p>
              </div>

              <button
                onClick={() => playSafetyAudio(idx, item.speak)}
                className={`absolute top-3.5 right-3.5 p-2 rounded-xl border transition-all ${
                  playingItem === idx 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                title="ऐका"
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
          <span>भूमिका बदला / बाहेर पडा (Switch Role)</span>
        </button>
      </div>

    </div>
  );
};

export default Profile;
