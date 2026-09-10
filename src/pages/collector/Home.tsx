import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  TrendingUp, 
  Recycle, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  QrCode, 
  ArrowUpRight, 
  ChevronRight,
  BadgeCheck,
  Coins,
  History,
  Scale
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, lots, transactions, language } = useAppContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.amount, 0);
  const totalAmount = transactions.filter(t => t.status === 'Paid').reduce((acc, t) => acc + t.amount, 0);
  const recentLot = lots[0];

  const playVoiceAssistance = () => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const text = language === 'mr'
        ? "नमस्ते राजू दादा. ई-कचरा विकण्यासाठी मोठा हिरवा कॅमेरा बटन दाबा. चालू महिना कमाई बारा हजार चारशे पन्नास रुपये आहे."
        : language === 'hi'
        ? "नमस्ते राजू भाई. ई-वेस्ट बेचने के लिए बड़ा हरा कैमरा बटन दबाएं. चालू महीने की कमाई बारह हज़ार चार सौ पचास रुपये है."
        : "Hello Raju Bhai. Tap the large green camera button to sell e-waste. Your earnings this month are 12,450 rupees.";
      
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
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#14281f] pb-6">
      
      {/* Top Aggregator Profile Bar with Vernacular Identity */}
      <div className="bg-[#0b241a] text-white px-5 pt-4 pb-5 rounded-b-[32px] shadow-lg shadow-emerald-950/20 relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 bg-grain-pattern opacity-10 pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-900/30">
              <div className="w-full h-full bg-[#081b13] rounded-[14px] flex items-center justify-center text-amber-300 font-black text-lg font-mono">
                RB
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center">
                  <span>{language === 'mr' ? 'राजू दादा' : 'राजू भाई'}</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-400 ml-1 inline" />
                </h2>
              </div>
              <p className="text-[11px] font-mono text-emerald-300/80 tracking-wide">
                ID: COL-1028 • पुणे मंडी
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Voice Assistant Button */}
            <button
              onClick={playVoiceAssistance}
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-[#091f15] border-amber-400 animate-pulse' 
                  : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-300 hover:bg-emerald-800'
              }`}
              title="Listen in vernacular"
            >
              {isPlayingAudio ? (
                <div className="flex space-x-0.5 items-end h-4">
                  <span className="soundwave-bar w-1 bg-[#091f15] rounded-full" />
                  <span className="soundwave-bar w-1 bg-[#091f15] rounded-full" />
                  <span className="soundwave-bar w-1 bg-[#091f15] rounded-full" />
                </div>
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="text-[11px] font-bold">सुनो</span>
            </button>

            {/* Offline/Online hardware switch */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1 border transition-all ${
                isOnline 
                  ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' 
                  : 'bg-amber-950 border-amber-500/50 text-amber-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-ping'}`} />
              <span>{isOnline ? '4G' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Live Mandi Rate Ticker Ribbon */}
        <div className="mt-4 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center space-x-2 text-emerald-200">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              लाइव भाव
            </span>
            <span className="truncate">PCB ₹230/kg ↗ • तांबा ₹590/kg ↗</span>
          </div>
          <button 
            onClick={() => navigate('/collector/prices')} 
            className="text-amber-400 font-bold hover:underline flex items-center shrink-0 ml-2"
          >
            सभी <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 -mt-2">
        
        {/* HERO CTA: Tactile Scrap Selling Machine */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-500 rounded-[30px] blur opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />
          
          <button 
            onClick={() => navigate('/collector/create')}
            className="w-full relative bg-gradient-to-b from-[#0e4431] to-[#082b1e] text-white rounded-[28px] p-5 shadow-tactile-green border-2 border-emerald-400/40 hover:border-emerald-300 active:translate-y-1 active:shadow-tactile-pressed transition-all duration-150 text-left overflow-hidden"
          >
            {/* Background scanner line effect */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-radial from-emerald-400/10 to-transparent pointer-events-none" />
            <div className="absolute -right-6 -bottom-6 text-emerald-500/10 text-9xl font-mono font-black select-none pointer-events-none">
              RE
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>AI फोटो स्कैन • तुरंत पक्का भाव</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                  <span>ई-वेस्ट बेचें</span>
                  <span className="text-sm font-medium text-emerald-300 font-mono tracking-normal">/ SELL</span>
                </h3>
                <p className="text-xs text-emerald-200/80 font-medium">
                  फोटो खींचो • वजन डालो • अधिकृत रीसाइक्लर को दो
                </p>
              </div>

              {/* Optical Scanner Reticle Button */}
              <div className="relative shrink-0 ml-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 p-0.5 shadow-lg shadow-emerald-950/40">
                  <div className="w-full h-full bg-[#062419] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                    <Camera className="w-8 h-8 text-emerald-300" />
                    <div className="absolute inset-0 bg-emerald-400/20 animate-scan pointer-events-none h-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust bar at card bottom */}
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" /> 100% सरकारी मान्यता प्राप्त रीसाइक्लर
              </span>
              <span className="font-mono text-amber-300 font-bold flex items-center">
                शुरू करें <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Digital Bahi-Khata (डिजिटल बहीखाता) Summary Ledger */}
        <div className="bg-[#ffffff] rounded-[24px] p-4 border border-[#e6decb] shadow-card-elevated relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0e9dc]">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-900 tracking-wide uppercase font-mono">
                {language === 'mr' ? 'खातेवही / कमाई' : 'डिजिटल बहीखाता (EARNINGS)'}
              </span>
            </div>
            <button 
              onClick={() => navigate('/collector/earnings')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
            >
              पासबुक देखें <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Settled Cash */}
            <div 
              onClick={() => navigate('/collector/earnings')}
              className="bg-[#f8fbf9] p-3.5 rounded-2xl border border-emerald-100/80 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {language === 'mr' ? 'चालू महिना' : 'इस महीने मिला'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-900 font-mono tracking-tight">
                ₹{totalAmount.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold inline-block mt-0.5">
                ✓ नकद / UPI भुगतान पूरा
              </span>
            </div>

            {/* Pending Handover */}
            <div 
              onClick={() => navigate('/collector/earnings')}
              className="bg-[#fffbf5] p-3.5 rounded-2xl border border-amber-200/80 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  बाकी रकम
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-amber-900 font-mono tracking-tight">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold inline-block mt-0.5">
                ⏳ माल हैंडओवर पर मिलेगा
              </span>
            </div>
          </div>
        </div>

        {/* Essential Visual Action Cards (3 Pillars) */}
        <div className="grid grid-cols-3 gap-2.5">
          <button 
            onClick={() => navigate('/collector/prices')}
            className="bg-white p-3 rounded-2xl border border-[#e6decb] shadow-sm hover:border-emerald-500/50 active:scale-95 transition-all flex flex-col items-center text-center space-y-1.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-inner">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">आज का भाव</p>
              <p className="text-[10px] text-slate-500 font-mono">Live Rates</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/collector/recyclers')}
            className="bg-white p-3 rounded-2xl border border-[#e6decb] shadow-sm hover:border-emerald-500/50 active:scale-95 transition-all flex flex-col items-center text-center space-y-1.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg shadow-inner">
              <Recycle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">रीसाइक्लर</p>
              <p className="text-[10px] text-slate-500 font-mono">Top Matches</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/collector/profile')}
            className="bg-white p-3 rounded-2xl border border-[#e6decb] shadow-sm hover:border-emerald-500/50 active:scale-95 transition-all flex flex-col items-center text-center space-y-1.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg shadow-inner">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">सुरक्षा नियम</p>
              <p className="text-[10px] text-slate-500 font-mono">Safe Handling</p>
            </div>
          </button>
        </div>

        {/* Recent Handover Manifest Ticket */}
        {recentLot && (
          <div className="bg-white rounded-[24px] border border-[#e6decb] shadow-card-elevated p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#f3eee4]">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-black text-slate-800 tracking-wide font-mono uppercase">
                  हाल का लॉट / LAST LOT RECORD
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {new Date(recentLot.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-2xl shadow-inner">
                  {recentLot.materialId === 'm3' ? '🔌' : recentLot.materialId === 'm5' ? '🔗' : '🔋'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-black text-slate-900 text-base">
                      {recentLot.weight} KG • {recentLot.materialId === 'm3' ? 'PCB बोर्ड' : 'ई-स्क्रैप'}
                    </h4>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
                    LOT #{recentLot.id.toUpperCase()} • GreenCycle Facility
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-black text-slate-900 font-mono">
                  ₹{recentLot.finalPrice || '1,900'}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                  नकद प्राप्त ✓
                </span>
              </div>
            </div>

            {/* Handover action link */}
            <div className="mt-3 pt-3 border-t border-dashed border-[#e6decb] flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                📍 GPS Verified • 10 Sep 5:42 PM
              </span>
              <button 
                onClick={() => navigate(`/collector/handover/${recentLot.id}`)}
                className="text-emerald-700 font-bold hover:underline flex items-center"
              >
                रसीद देखें <QrCode className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CollectorHome;
