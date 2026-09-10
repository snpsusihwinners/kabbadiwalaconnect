import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Volume2, 
  Search, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Prices: React.FC = () => {
  const navigate = useNavigate();
  const { materials, language, speak, isSpeaking } = useAppContext();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'e-waste' | 'metals' | 'batteries' | 'plastics'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी' : language === 'mr' ? 'सर्व' : 'All' },
    { id: 'metals', label: language === 'hi' ? 'धातुएं' : language === 'mr' ? 'धातू' : 'Metals' },
    { id: 'e-waste', label: language === 'hi' ? 'ई-कचरा' : language === 'mr' ? 'ई-कचरा' : 'E-Waste' },
    { id: 'batteries', label: language === 'hi' ? 'बैटरी' : language === 'mr' ? 'बॅटरी' : 'Batteries' },
    { id: 'plastics', label: language === 'hi' ? 'प्लास्टिक' : language === 'mr' ? 'प्लास्टिक' : 'Plastics' },
  ];

  const filteredMaterials = materials.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.tagHindi.includes(searchQuery) ||
      m.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleListenAllPrices = () => {
    const priceList = filteredMaterials
      .slice(0, 5)
      .map(m => `${language === 'hi' ? m.tagHindi : m.name}: ${m.basePrice} रुपये प्रति किलो`)
      .join(', ');
    const speech = language === 'hi' 
      ? `आज के पुणे मंडी भाव: ${priceList}`
      : `Today's Pune Mandi Scrap Rates: ${priceList}`;
    speak(speech);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="font-display font-bold text-base text-industrial-950">
              {language === 'hi' ? 'दैनिक पुणे मंडी भाव फलक' : language === 'mr' ? 'पुणे बाजार भाव फलक' : "Today's Mandi Price Index"}
            </h1>
          </div>
          <p className="text-xs text-industrial-500 font-medium">
            Official benchmark rates updated 20 mins ago
          </p>
        </div>

        <div className="flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
          <MapPin className="w-3.5 h-3.5 mr-1 text-amber-600" />
          Pune Yard
        </div>
      </div>

      {/* Voice Assistant Audio Announcement Banner */}
      <button
        onClick={handleListenAllPrices}
        className={`w-full py-3 px-4 rounded-2xl border transition-all flex items-center justify-between shadow-tactile ${
          isSpeaking 
            ? 'bg-amber-500 text-industrial-950 border-amber-400 font-bold' 
            : 'bg-forest-900 hover:bg-forest-850 text-white border-forest-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span className="font-display font-bold text-xs">
            {isSpeaking 
              ? (language === 'hi' ? 'भाव बोले जा रहे हैं...' : 'Speaking Mandi Rates...') 
              : (language === 'hi' ? 'आज के सभी भाव ऑडियो में सुनें' : 'Listen to Scrap Rates Aloud')}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded">
          {language === 'hi' ? 'आवाज़' : 'AUDIO'}
        </span>
      </button>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'hi' ? 'सामग्री खोजें (जैसे तांबा, पीसीबी)...' : 'Search material, grade or HSN...'}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-industrial-400 shadow-sm"
        />
        <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-3" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id 
                ? 'bg-forest-800 text-white border-forest-700 shadow-sm' 
                : 'bg-white text-industrial-600 border-paper-300 hover:bg-paper-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Material Rates List */}
      <div className="space-y-3">
        {filteredMaterials.map((m) => {
          const isPositive = m.trend > 0;
          const isNegative = m.trend < 0;

          return (
            <div 
              key={m.id} 
              className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile space-y-2.5 transition-all hover:border-paper-400"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MaterialBadge iconKey={m.icon} category={m.category} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-industrial-950">
                        {language === 'hi' ? m.tagHindi : m.name}
                      </h3>
                      <span className="text-[10px] font-mono text-industrial-500 bg-paper-200 px-1.5 py-0.2 rounded">
                        HSN {m.hsnCode}
                      </span>
                    </div>
                    <p className="text-xs text-industrial-600 font-medium">
                      {m.grade}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-lg font-black font-mono text-industrial-950">
                      ₹{m.basePrice}
                    </span>
                    <span className="text-[10px] text-industrial-500 font-normal">
                      /{m.unit}
                    </span>
                  </div>

                  <span className={`inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isPositive ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                    isNegative ? 'text-rose-700 bg-rose-50 border border-rose-200' :
                    'text-industrial-600 bg-paper-200'
                  }`}>
                    {isPositive && <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isNegative && <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {m.trend >= 0 ? `+${m.trend}%` : `${m.trend}%`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-paper-200 text-xs">
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{m.purityBenchmark}</span>
                </div>

                <button
                  onClick={() => navigate('/collector/create')}
                  className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 bg-paper-100 hover:bg-paper-200 px-3 py-1 rounded-lg transition-colors border border-paper-300"
                >
                  <span>{language === 'hi' ? 'यह बेचें' : 'Sell Lot'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Prices;

