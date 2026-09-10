import React from 'react';
import { TrendingUp, TrendingDown, Volume2, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const MandiTicker: React.FC = () => {
  const { materials, language, speak, isSpeaking } = useAppContext();

  const handleListenMandi = () => {
    const text = language === 'hi' 
      ? 'आज के पुणे मंडी स्क्रैप भाव: तांबा 620 रुपये, मदरबोर्ड 240 रुपये, मोटर 165 रुपये, लिथियम बैटरी 110 रुपये प्रति किलो।'
      : language === 'mr'
      ? 'आजचे पुणे मार्केट स्क्रॅप दर: तांबे 620 रुपये, मदरबोर्ड 240 रुपये, मोटर 165 रुपये, लिथियम बॅटरी 110 रुपये प्रति किलो.'
      : "Today's Pune Mandi Scrap Benchmark: Bright Copper ₹620/kg, Class-A PCB ₹240/kg, Motor Scrap ₹165/kg, Li-Ion Battery ₹110/kg.";
    speak(text);
  };

  return (
    <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white border-y border-forest-800/80 shadow-inner overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Mandi Tag */}
        <div className="flex items-center gap-2 shrink-0 border-r border-forest-800 pr-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold tracking-widest text-emerald-300 uppercase font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            MANDI LIVE
          </span>
          <span className="hidden sm:inline-block text-[10px] text-forest-300 font-mono bg-forest-800/80 px-1.5 py-0.5 rounded">
            PUNE YARD
          </span>
        </div>

        {/* Ticker Stream */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs whitespace-nowrap">
          {materials.map((m) => {
            const isPositive = m.trend > 0;
            const isNegative = m.trend < 0;

            return (
              <div key={m.id} className="flex items-center gap-2 py-0.5">
                <span className="text-forest-200 font-medium">
                  {language === 'hi' ? m.tagHindi : language === 'mr' ? m.tagMarathi : m.name}
                </span>
                <span className="font-mono font-bold text-white">
                  ₹{m.basePrice}
                  <span className="text-[10px] font-normal text-forest-300">/{m.unit}</span>
                </span>
                <span className={`inline-flex items-center text-[10px] font-bold font-mono px-1 rounded ${
                  isPositive ? 'text-emerald-400 bg-emerald-950/60' : isNegative ? 'text-rose-400 bg-rose-950/60' : 'text-forest-400'
                }`}>
                  {isPositive && <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />}
                  {isNegative && <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                  {isPositive ? `+${m.trend}%` : isNegative ? `${m.trend}%` : '0.0%'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Voice Announcement Action */}
        <button
          onClick={handleListenMandi}
          title="Listen to Live Mandi Prices"
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
            isSpeaking 
              ? 'bg-amber-500 text-industrial-950 border-amber-400 shadow-md animate-pulse'
              : 'bg-forest-850 hover:bg-forest-800 text-forest-200 hover:text-white border-forest-700/80'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-sans text-[11px]">
            {language === 'hi' ? 'भाव सुनें' : language === 'mr' ? 'दर ऐका' : 'Listen Rates'}
          </span>
        </button>
      </div>
    </div>
  );
};
