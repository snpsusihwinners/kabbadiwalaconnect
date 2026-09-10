import React from 'react';
import { 
  User, 
  LogOut, 
  ShieldAlert, 
  Volume2, 
  ShieldCheck, 
  MapPin, 
  Flame, 
  AlertTriangle, 
  BatteryWarning, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { setRole, language, speak } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const safetyItems = [
    { 
      id: 'wires',
      icon: Flame, 
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      title: language === 'hi' ? 'तारों को कभी न जलाएं' : 'Zero Open Wire Burning', 
      desc: language === 'hi' 
        ? 'प्लास्टिक जलाने से जहरीला धुआं और डायोक्सिन निकलता है। यह कानूनन अपराध है। स्वचालित वायर स्ट्रिपर का उपयोग करें।' 
        : 'Burning PVC releases toxic dioxins and carries heavy CPCB penalties. Handover unstripped cable intact.',
      speech: language === 'hi' ? 'तारों को कभी न जलाएं। जहरीला धुआं स्वास्थ्य के लिए खतरनाक है।' : 'Never burn insulated copper cables.'
    },
    { 
      id: 'acid',
      icon: AlertTriangle, 
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      title: language === 'hi' ? 'तेज़ाब (एसिड) रिकवरी निषेध' : 'No Chemical / Acid Leaching', 
      desc: language === 'hi' 
        ? 'मदरबोर्ड से सोना निकालने के लिए एसिड का प्रयोग जानलेवा है। बोर्ड सीधा अधिकृत रिसाइक्लर को दें।' 
        : 'Acid recovery at informal yards causes groundwater poisoning. Deliver PCB batches directly to refiners.',
      speech: language === 'hi' ? 'तेज़ाब से धातु न निकालें। यह कानूनन प्रतिबंधित है।' : 'Do not use acid leaching for metal recovery.'
    },
    { 
      id: 'battery',
      icon: BatteryWarning, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      title: language === 'hi' ? 'बैटरी कभी न तोड़ें' : 'Intact Battery Handling', 
      desc: language === 'hi' 
        ? 'लिथियम और लेड एसिड बैटरियों में आग और विस्फोट का खतरा होता है। इन्हें सूखे बक्से में सुरक्षित रखें।' 
        : 'Li-ion and Lead-Acid cells can undergo thermal runaway. Store in dry, insulated bins.',
      speech: language === 'hi' ? 'बैटरी कभी न तोड़ें। इसमें आग और विस्फोट का खतरा रहता है।' : 'Never puncture or break battery casings.'
    },
    { 
      id: 'gear',
      icon: ShieldCheck, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: language === 'hi' ? 'सुरक्षा दस्ताने व जूते' : 'Certified Protective PPE', 
      desc: language === 'hi' 
        ? 'कांच, धातु और नुकीले स्क्रैप से हाथ कटने से बचने के लिए मोटे रबर दस्ताने और सेफ्टी जूते पहनें।' 
        : 'Always wear puncture-proof gloves and heavy-soled boots when handling CRT glass and sharp motors.',
      speech: language === 'hi' ? 'स्क्रैप उठाते समय हमेशा मजबूत दस्ताने पहनें।' : 'Always use protective heavy gloves.'
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Aggregator ID Badge Card */}
      <div className="bg-white rounded-3xl p-5 border border-paper-300 shadow-tactile space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-forest-900 text-emerald-300 border border-forest-800 flex items-center justify-center font-display font-extrabold text-xl shadow-tactile">
              RS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display font-bold text-base text-industrial-950">
                  Raju Scrap Co.
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              </div>
              <p className="text-xs text-industrial-500 font-mono">
                CPCB ID: MH-PUN-COL-1028
              </p>
              <div className="flex items-center gap-1 text-[11px] text-industrial-600 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Pune Market Yard (Zone 4)</span>
              </div>
            </div>
          </div>

          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
            ACTIVE
          </span>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-paper-200 text-center">
          <div className="bg-paper-100 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-industrial-500 uppercase block">Completed</span>
            <span className="text-base font-black font-mono text-industrial-950">42 Lots</span>
          </div>
          <div className="bg-paper-100 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-industrial-500 uppercase block">Disbursed</span>
            <span className="text-base font-black font-mono text-emerald-800">₹28.4k</span>
          </div>
          <div className="bg-paper-100 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-industrial-500 uppercase block">Rating</span>
            <span className="text-base font-black font-mono text-amber-800">4.9 ★</span>
          </div>
        </div>
      </div>

      {/* Hazardous Scrap Safety Directives */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-display font-bold text-sm text-industrial-950">
              {language === 'hi' ? 'सुरक्षा नियम व मार्गदर्शन' : 'CPCB Hazardous Waste Safety Directives'}
            </h3>
          </div>
          <span className="text-[10px] text-industrial-500 font-mono">Tap speaker to hear</span>
        </div>

        <div className="space-y-2.5">
          {safetyItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-paper-300 shadow-tactile flex items-start gap-3 relative"
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 pr-6">
                  <h4 className="font-display font-bold text-xs text-industrial-950">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-industrial-600 leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={() => speak(item.speech)}
                  className="absolute top-3 right-3 text-industrial-400 hover:text-emerald-700 p-1"
                  title="Listen in chosen language"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign Out / Portal Switch */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white hover:bg-rose-50 text-rose-700 font-display font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-paper-300 shadow-tactile transition-all active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        <span>{language === 'hi' ? 'पोर्टल से बाहर निकलें / स्विच करें' : 'Switch Portal / Sign Out'}</span>
      </button>
    </div>
  );
};

export default Profile;

