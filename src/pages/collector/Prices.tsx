import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Volume2,
  Share2,
  Check,
  Search
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import type { Material } from '../../data/mockData';

const Prices: React.FC = () => {
  const { materials, language } = useAppContext();
  const t = translations[language] || translations.en;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getMaterialName = (m: Material) => {
    return (t.materials as Record<string, string>)[m.id] || m.name;
  };

  const getTrend = (index: number) => {
    if (index % 3 === 0) return { icon: TrendingUp, label: '+₹15/kg', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (index % 3 === 1) return { icon: TrendingDown, label: '-₹5/kg', color: 'text-red-700 bg-red-50 border-red-200' };
    return { icon: Minus, label: t.stableTrend, color: 'text-slate-600 bg-slate-100 border-slate-200' };
  };

  const listenToPrices = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const top3 = materials.slice(0, 4).map(m => `${getMaterialName(m)} ₹${m.basePrice} per ${m.unit}`).join(', ');
      const text = t.speakMandiIntro(top3);

      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'mr') utterance.lang = 'mr-IN';
      else if (language === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sharePrices = () => {
    navigator.clipboard.writeText(
      `♻️ ReGain E-Waste Mandi Rates (${selectedCity}):\n` +
      materials.map(m => `• ${getMaterialName(m)}: ₹${m.basePrice}/${m.unit}`).join('\n') +
      `\nVerified by CPCB Recyclers.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMaterials = materials.filter(m => 
    getMaterialName(m).toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Header with City Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.liveMandiBadge}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              {t.todaysRatesTitle}
            </h2>
          </div>

          <div className="flex items-center bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200 text-xs font-medium text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-900"
            >
              <option value="Pune">Pune (पुणे)</option>
              <option value="Mumbai">Mumbai (मुंबई)</option>
              <option value="Nagpur">Nagpur (नागपूर)</option>
              <option value="Nashik">Nashik (नाशिक)</option>
            </select>
          </div>
        </div>

        {/* Listen & Share Actions */}
        <div className="flex space-x-2 pt-1 border-t border-slate-100">
          <button
            onClick={listenToPrices}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all border ${
              isPlaying 
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{isPlaying ? t.playingRatesBtn : t.listenRatesBtn}</span>
          </button>

          <button
            onClick={sharePrices}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
            <span>{copied ? t.copiedBtn : t.shareBtn}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder={t.searchMaterialPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
        />
      </div>

      {/* Price Cards List */}
      <div className="space-y-2.5">
        {filteredMaterials.map((m, i) => {
          const trend = getTrend(i);
          const TrendIcon = trend.icon;

          return (
            <div 
              key={m.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{getMaterialName(m)}</h3>
                  <p className="text-xs text-slate-500">
                    {t.estRangeLabel} ₹{Math.round(m.basePrice * 0.95)} - ₹{Math.round(m.basePrice * 1.05)}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end space-y-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-black text-slate-900">
                    ₹{m.basePrice}
                  </span>
                  <span className="text-xs text-slate-500">/{m.unit}</span>
                </div>

                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${trend.color}`}>
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {trend.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Prices;
