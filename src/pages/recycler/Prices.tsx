import React, { useState } from 'react';
import { 
  IndianRupee, 
  Save, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const RecyclerPrices: React.FC = () => {
  const { materials, updateMaterialPrice } = useAppContext();
  
  const [rates, setRates] = useState<Record<string, number>>(
    materials.reduce((acc, m) => ({ ...acc, [m.id]: m.basePrice }), {})
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRateChange = (materialId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setRates(prev => ({ ...prev, [materialId]: num }));
  };

  const handleSaveAll = () => {
    Object.entries(rates).forEach(([id, price]) => {
      updateMaterialPrice(id, price);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-industrial-950">
            Procurement Rate Master
          </h2>
          <p className="text-xs text-industrial-500 font-medium mt-0.5">
            Set real-time buying rates broadcasted to scrap collectors across Pune
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-display font-bold text-xs px-5 py-2.5 rounded-xl shadow-tactile flex items-center gap-1.5 transition-all"
        >
          <Save className="w-4 h-4 text-emerald-300" />
          <span>Save & Broadcast Rates</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Procurement price master updated and broadcasted to collector field apps!</span>
        </div>
      )}

      {/* Material Rates Table */}
      <div className="bg-white rounded-2xl border border-paper-300 shadow-tactile overflow-hidden">
        <div className="p-4 border-b border-paper-200 flex justify-between items-center">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-industrial-700">
            Material Grades & Procurement Rates
          </span>
          <span className="text-xs text-industrial-500 font-mono">
            {materials.length} Commodities
          </span>
        </div>

        <div className="divide-y divide-paper-200">
          {materials.map((m) => {
            const currentPrice = rates[m.id] ?? m.basePrice;

            return (
              <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <MaterialBadge iconKey={m.icon} category={m.category} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-industrial-950">
                        {m.name}
                      </h4>
                      <span className="text-[10px] font-mono text-industrial-500 bg-paper-200 px-2 py-0.5 rounded">
                        HSN {m.hsnCode}
                      </span>
                    </div>
                    <p className="text-xs text-industrial-500 font-medium">
                      {m.grade} • {m.purityBenchmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-industrial-500 font-mono uppercase block">Buying Rate (per {m.unit})</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-industrial-500">₹</span>
                      <input
                        type="number"
                        value={currentPrice}
                        onChange={(e) => handleRateChange(m.id, e.target.value)}
                        className="w-24 text-right font-mono font-bold text-sm bg-paper-100 border border-paper-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecyclerPrices;
