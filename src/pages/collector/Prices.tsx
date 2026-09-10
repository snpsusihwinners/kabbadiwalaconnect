import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Volume2, 
  Share2, 
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Prices: React.FC = () => {
  const { materials, language } = useAppContext();
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTrend = (index: number) => {
    if (index % 3 === 0) return { icon: TrendingUp, label: '+₹15/kg', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (index % 3 === 1) return { icon: TrendingDown, label: '-₹5/kg', color: 'text-red-700 bg-red-50 border-red-200' };
    return { icon: Minus, label: 'स्थिर', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  };

  const listenToPrices = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const top3 = materials.slice(0, 4).map(m => `${m.name} ${m.basePrice} रुपये किलो`).join(', ');
      const text = language === 'mr'
        ? `पुणे बाजारभाव: ${top3}. रीसायकलर कडून आज पक्के दर उपलब्ध आहेत.`
        : `पुणे मंडी आज का भाव: ${top3}. अधिकृत रीसाइक्लर से आज पक्का भाव प्राप्त करें.`;

      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'hi-IN';

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sharePrices = () => {
    navigator.clipboard.writeText(
      `♻️ ECOSETU आज का ई-वेस्ट भाव (${selectedCity}):\n` +
      materials.map(m => `• ${m.name}: ₹${m.basePrice}/kg`).join('\n')
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fbf8f1] text-[#13261e] pb-10">
      
      {/* Header with City Mandi Selector */}
      <div className="bg-[#0b241a] text-white px-5 pt-4 pb-5 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                MANDI PRICE BOARD
              </span>
            </div>
            <h1 className="text-xl font-black text-white">आज का स्क्रैप भाव</h1>
          </div>

          <div className="flex items-center bg-emerald-950 border border-emerald-700/50 rounded-xl p-1 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1" />
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-white font-bold pr-2 focus:outline-none cursor-pointer"
            >
              <option value="Pune" className="text-slate-900">पुणे (Pune)</option>
              <option value="Mumbai" className="text-slate-900">मुंबई (Mumbai)</option>
              <option value="Nagpur" className="text-slate-900">नागपुर (Nagpur)</option>
            </select>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex space-x-2 mt-4 pt-3 border-t border-emerald-900/60">
          <button
            onClick={listenToPrices}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-2 transition-all ${
              isPlaying 
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'भाव बोल रहा है...' : '🔊 भाव सुनें (Listen)'}</span>
          </button>

          <button
            onClick={sharePrices}
            className="py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono hover:bg-emerald-500/30 flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हुआ!' : 'शेयर'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3.5 flex-1">
        
        {/* 7-Day Trend Visual Micro-Widget */}
        <div className="bg-white rounded-2xl p-4 border border-[#e6decb] shadow-card-elevated flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              7-DAY COPPER & PCB INDEX
            </span>
            <div className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
              <span>तांबा + PCB दर +4.8% तेज</span>
              <TrendingUp className="w-4 h-4 text-emerald-700 inline" />
            </div>
          </div>
          {/* Sparkline simulation */}
          <div className="flex items-end space-x-1 h-8">
            {[45, 52, 48, 65, 58, 72, 85].map((val, idx) => (
              <div 
                key={idx} 
                style={{ height: `${val}%` }} 
                className={`w-2 rounded-t-sm ${idx === 6 ? 'bg-emerald-700' : 'bg-emerald-200'}`} 
              />
            ))}
          </div>
        </div>

        {/* Material Price Cards */}
        <div className="space-y-2.5">
          {materials.map((m, i) => {
            const trend = getTrend(i);
            const TrendIcon = trend.icon;

            return (
              <div 
                key={m.id}
                className="bg-white rounded-[22px] p-4 border border-[#e6decb] shadow-sm hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{m.name}</h3>
                    <p className="text-[11px] font-mono text-slate-500">
                      न्यूनतम दर: ₹{(m.basePrice * 0.95).toFixed(0)} - ₹{(m.basePrice * 1.05).toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      ₹{m.basePrice}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ {m.unit}</span>
                  </div>

                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${trend.color}`}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {trend.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Prices;
