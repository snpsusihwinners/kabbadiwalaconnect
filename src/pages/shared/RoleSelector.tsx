import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  Volume2, 
  Scale, 
  QrCode, 
  CheckCircle2, 
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MandiTicker } from '../../components/ui/MandiTicker';

const RoleSelector: React.FC = () => {
  const { setRole, setLanguage, language, speak, isSpeaking } = useAppContext();
  const navigate = useNavigate();

  const handleStart = (selectedRole: 'collector' | 'recycler') => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const handleAudioIntro = () => {
    const speechText = language === 'hi'
      ? 'इकोसेतु में आपका स्वागत है। कबाड़ी भाइयों के लिए सही भाव और डिजिटल कांटा पर्ची, और रिसाइक्लर्स के लिए प्रमाणित ई-वेस्ट सप्लाई चेन। अपनी भूमिका चुनें।'
      : language === 'mr'
      ? 'इकोसेतू मध्ये आपले स्वागत आहे. भंगार गोळा करणाऱ्यांसाठी योग्य भाव आणि डिजिटल काटा पावती, आणि रिसायकलरसाठी प्रमाणित सप्लाय चेन. तुमची भूमिका निवडा.'
      : 'Welcome to EcoSetu. Transparent market pricing and digital weighbridge slips for grassroots collectors, and certified CPCB traceability for industrial recyclers. Select your portal to continue.';
    speak(speechText);
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-between text-industrial-900 selection:bg-amber-200">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-paper-300 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center text-emerald-300 shadow-tactile border border-forest-700">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-tight text-forest-950">
                  ECOSETU
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                  इकोसेतु v2.4
                </span>
              </div>
              <p className="text-[11px] text-industrial-500 font-medium hidden sm:block">
                National Informal Waste Digitization & Reverse Logistics Architecture
              </p>
            </div>
          </div>

          {/* Language Selector & Audio Voice Prompt */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioIntro}
              aria-label="Listen portal introduction"
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isSpeaking 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300' 
                  : 'bg-paper-50 hover:bg-white text-industrial-700 border-paper-300 hover:border-paper-400'
              }`}
              title="Listen in chosen language"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              {isSpeaking && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-white sound-bar-1 rounded-full"></span>
                  <span className="w-1 bg-white sound-bar-2 rounded-full"></span>
                  <span className="w-1 bg-white sound-bar-3 rounded-full"></span>
                </div>
              )}
            </button>

            <div className="flex bg-paper-200 p-1 rounded-xl border border-paper-300 text-xs font-medium">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'hi' 
                    ? 'bg-white text-forest-900 font-bold shadow-tactile' 
                    : 'text-industrial-600 hover:text-industrial-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'mr' 
                    ? 'bg-white text-forest-900 font-bold shadow-tactile' 
                    : 'text-industrial-600 hover:text-industrial-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en' 
                    ? 'bg-white text-forest-900 font-bold shadow-tactile' 
                    : 'text-industrial-600 hover:text-industrial-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Mandi Benchmark Ticker */}
      <MandiTicker />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Govt. CPCB & E-Waste Management Rules 2022 Aligned</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-industrial-950 font-display tracking-tight leading-[1.15]">
            Bridging Grassroots Kabadiwalas to Certified Recyclers
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-industrial-600 font-medium">
            {language === 'hi' ? (
              'कबाड़ी भाइयों के लिए पारदर्शी भाव, कांटा पर्ची और त्वरित भुगतान — रिसाइक्लर्स के लिए पूर्ण CPCB ट्रैसेबिलिटी।'
            ) : language === 'mr' ? (
              'भंगार गोळा करणाऱ्यांसाठी योग्य भाव, डिजिटल काटा पावती आणि त्वरित पेमेंट — रिसायकलरसाठी पूर्ण ट्रॅसेबिलिटी.'
            ) : (
              'A unified circular network connecting India’s informal scrap workforce with industrial recovery facilities through digital weighbridge slips, live mandi pricing, and end-to-end material traceability.'
            )}
          </p>
        </div>

        {/* Dual Entrance Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full mb-12">
          
          {/* PORTAL 1: Collector / Kabadiwala Field Mobile App */}
          <div className="group relative bg-gradient-to-b from-white to-paper-50 rounded-3xl p-7 sm:p-8 border border-paper-300 shadow-tactile-md hover:shadow-tactile-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-200/60 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-tactile">
                  <Smartphone className="w-7 h-7" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === 'hi' ? 'कबाड़ीवाला ऐप' : language === 'mr' ? 'भंगार विक्रेता' : 'Field App'}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-industrial-950 mb-2">
                {language === 'hi' ? 'कबाड़ीवाला / स्क्रैप कलेक्टर' : language === 'mr' ? 'कचरा गोळा करणारे' : 'Grassroots Scrap Collector'}
              </h2>
              <p className="text-sm text-industrial-600 leading-relaxed mb-6 font-medium">
                {language === 'hi'
                  ? 'अपने जमा किए ई-कचरे और धातुओं के लॉट बनाएं, लाइव मंडी रेट चेक करें, अधिकृत खरीदार खोजें और डिजिटल कांटा पर्ची से नकद/UPI भुगतान पाएं।'
                  : language === 'mr'
                  ? 'जमा केलेल्या भंगाराचे लॉट तयार करा, थेट बाजारभाव पहा, अधिकृत खरेदीदार शोधा आणि डिजिटल काटा पावतीने त्वरित पैसे मिळवा.'
                  : 'Log scrap lots with smart tare/gross calculators, check real-time regional mandi rates, receive instant recycler bids, and collect payments via digital weighbridge tickets.'}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'लाइव मंडी स्क्रैप भाव (तांबा, पीसीबी, बैटरी)' : 'Live Mandi Scrap Rates & Voice Guidance'}</span>
                </div>
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'स्मार्ट कांटा कैलकुलेटर (सकल - बारदान = शुद्ध वजन)' : 'Smart Tare & Net Weighbridge Calculator'}</span>
                </div>
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'क्यूआर कोड से डिजिटल हैंडओवर व पक्की रसीद' : 'QR Handover Ticket & Instant Digital Passbook'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStart('collector')}
              className="w-full bg-forest-800 hover:bg-forest-900 active:scale-[0.98] text-white font-display font-bold text-base py-4 px-6 rounded-2xl shadow-tactile transition-all flex items-center justify-center gap-2 group-hover:bg-forest-900"
            >
              <span>{language === 'hi' ? 'कलेक्टर ऐप शुरू करें' : language === 'mr' ? 'कलेक्टर सुरू करा' : 'Open Collector Portal'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* PORTAL 2: Recycler / Industrial Operations Workstation */}
          <div className="group relative bg-gradient-to-b from-white to-industrial-50 rounded-3xl p-7 sm:p-8 border border-paper-300 shadow-tactile-md hover:shadow-tactile-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-200/60 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-900 shadow-tactile">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  CPCB Certified
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-industrial-950 mb-2">
                {language === 'hi' ? 'प्रमाणित औद्योगिक रिसाइक्लर' : language === 'mr' ? 'औद्योगिक रिसायकलर' : 'Certified Industrial Recycler'}
              </h2>
              <p className="text-sm text-industrial-600 leading-relaxed mb-6 font-medium">
                {language === 'hi'
                  ? 'कलेक्टरों से आने वाले स्क्रैप लॉट्स की डिजिटल बोली लगाएं, गेट-इन वे-ब्रिज पर वजन प्रमाणित करें, CPCB फॉर्म-6 ट्रैसेबिलिटी बनाए रखें और ईपीआर क्रेडिट प्राप्त करें।'
                  : language === 'mr'
                  ? 'येणाऱ्या स्क्रॅप लॉट्सचे परीक्षण करा, डिजिटल वे-ब्रिज स्कॅनरने पडताळणी करा आणि CPCB फॉर्म-६ चे नियम पाळा.'
                  : 'B2B procurement suite: inspect incoming collector scrap batches, manage gate-in weighbridge scales, configure rate masters, and issue CPCB Form-6 manifests.'}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>CPCB Form-6 Manifest & Chain of Custody</span>
                </div>
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Digital Gate-In Weighbridge Scale Verification</span>
                </div>
                <div className="flex items-center text-xs font-semibold text-industrial-700 gap-2.5">
                  <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dynamic Rate Master & Mass Balance Intake</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStart('recycler')}
              className="w-full bg-industrial-900 hover:bg-industrial-950 active:scale-[0.98] text-white font-display font-bold text-base py-4 px-6 rounded-2xl shadow-tactile transition-all flex items-center justify-center gap-2"
            >
              <span>{language === 'hi' ? 'रिसाइक्लर कंसोल खोलें' : language === 'mr' ? 'रिसायकलर पोर्टल' : 'Open Recycler Console'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

        {/* Real Ecosystem Verified Metrics */}
        <div className="bg-white rounded-2xl border border-paper-300 p-6 shadow-tactile grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-industrial-500 font-bold mb-1">Total E-Waste Diverted</p>
            <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">48,250 kg</p>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">From Landfills</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-industrial-500 font-bold mb-1">Direct Disbursed Payouts</p>
            <p className="text-2xl sm:text-3xl font-black font-mono text-amber-700">₹1.42 Cr</p>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">Via UPI & Cash</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-industrial-500 font-bold mb-1">Authorized Processors</p>
            <p className="text-2xl sm:text-3xl font-black font-mono text-industrial-900">312 Facilities</p>
            <p className="text-[11px] text-industrial-600 font-medium mt-0.5">CPCB / SPCB Validated</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-industrial-500 font-bold mb-1">Regulatory Traceability</p>
            <p className="text-2xl sm:text-3xl font-black font-mono text-forest-700">100% Audit</p>
            <p className="text-[11px] text-forest-800 font-medium mt-0.5">CPCB Form-6 Logged</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-paper-300 bg-white/50 py-6 text-center text-xs text-industrial-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EcoSetu (KabadiWala Connect) • Smart India Hackathon Winner Project</span>
          <span>Aligned with National Circular Economy Roadmap • Republic of India</span>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelector;

