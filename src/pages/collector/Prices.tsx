import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Volume2,
  Share2,
  Check,
  Newspaper
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Prices: React.FC = () => {
  const { materials, language } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [copied, setCopied] = useState(false);

  const getTrend = (index: number) => {
    if (index % 3 === 0) return { icon: TrendingUp, label: '+₹15', color: 'text-khata-green' };
    if (index % 3 === 1) return { icon: TrendingDown, label: '-₹5', color: 'text-khata-red' };
    return { icon: Minus, label: 'STABLE', color: 'text-khata-ink' };
  };

  const listenToPrices = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const top3 = materials.slice(0, 4).map(m => `${m.name} ${m.basePrice} रुपये`).join(', ');
      const text = language === 'mr'
        ? `आजचे भाव: ${top3}.`
        : `Today's rates: ${top3}.`;

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
      `ECOSETU RATES (${selectedCity}):\n` +
      materials.map(m => `${m.name}: ₹${m.basePrice}/kg`).join('\n')
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-khata-paper text-khata-ink bg-grid-pattern pb-10">
      
      {/* Brutal Header */}
      <div className="bg-khata-ink text-khata-paper p-4 brutal-border-b border-b-4 border-khata-ink">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Newspaper className="w-5 h-5 text-khata-paper" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-khata-red px-1">
                MARKET RATES
              </span>
            </div>
            <h1 className="font-vernacular text-3xl font-black">
              {language === 'mr' ? 'बाजार भाव' : 'DAILY RATES'}
            </h1>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono mb-1">LOCATION</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-2 border-khata-paper text-khata-paper font-bold text-sm px-2 py-1 appearance-none rounded-none focus:outline-none"
            >
              <option value="Pune" className="bg-khata-ink">Pune (पुणे)</option>
              <option value="Mumbai" className="bg-khata-ink">Mumbai (मुंबई)</option>
              <option value="Nagpur" className="bg-khata-ink">Nagpur (नागपूर)</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-4 pt-4 border-t-2 border-khata-paper/20">
          <button
            onClick={listenToPrices}
            className={`flex-1 py-2 px-3 border-2 font-mono text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              isPlaying 
                ? 'bg-khata-red border-khata-red text-khata-paper animate-pulse' 
                : 'border-khata-paper hover:bg-khata-paper hover:text-khata-ink active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'PLAYING...' : 'LISTEN'}</span>
          </button>

          <button
            onClick={sharePrices}
            className="py-2 px-4 border-2 border-khata-paper font-mono text-sm font-bold hover:bg-khata-paper hover:text-khata-ink flex items-center space-x-1.5 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'COPIED' : 'SHARE'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1">
        
        {/* Trend Banner */}
        <div className="bg-khata-blue text-khata-paper p-3 mb-6 flex justify-between items-center border-2 border-khata-ink brutal-sm">
          <span className="font-mono text-xs font-bold">PCB INDEX: +4.8%</span>
          <div className="flex h-4 items-end space-x-1">
             {[3, 5, 4, 7, 6, 8, 10].map((v, i) => (
               <div key={i} style={{ height: `${v*10}%` }} className={`w-2 ${i === 6 ? 'bg-khata-red' : 'bg-khata-paper'}`}></div>
             ))}
          </div>
        </div>

        {/* Ledger Rows */}
        <div className="border-2 border-khata-ink bg-white shadow-brutal divide-y-2 divide-khata-ink">
          {materials.map((m, i) => {
            const trend = getTrend(i);
            const TrendIcon = trend.icon;

            return (
              <div 
                key={m.id}
                className="p-3 flex items-center justify-between hover:bg-khata-paper transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 border-2 border-khata-ink flex items-center justify-center text-xl bg-khata-paper">
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="font-vernacular text-lg leading-tight">{m.name}</h3>
                    <p className="text-[10px] font-mono font-bold text-khata-ink/60 mt-0.5">
                      REF: {m.id.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-end justify-end space-x-1">
                    <span className="text-2xl font-black font-mono">₹{m.basePrice}</span>
                    <span className="text-xs font-mono font-bold mb-1">/{m.unit}</span>
                  </div>
                  <span className={`inline-flex items-center text-[10px] font-mono font-bold ${trend.color}`}>
                    <TrendIcon className="w-3 h-3 mr-0.5" />
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
