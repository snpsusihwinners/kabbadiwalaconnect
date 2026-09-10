import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Truck,
  IndianRupee
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Lot } from '../../data/mockData';

const IncomingLots: React.FC = () => {
  const { lots, materials, updateLot } = useAppContext();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLots = lots.filter(l => 
    l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.collectorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMakeOffer = () => {
    if (selectedLot && offerPrice) {
      updateLot(selectedLot.id, { 
        status: 'Offer Accepted',
        finalPrice: Math.round(parseFloat(offerPrice) * selectedLot.weight)
      });
      setSelectedLot(null);
      alert('ऑफर सफलता पूर्वक सबमिट किया गया! कलेक्टर को तुरंत नोटिफिकेशन भेजा गया.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header & Search */}
      <div className="bg-[#0b2118]/80 border border-emerald-900/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Lot ID or Collector (e.g. L1, COL-1028)..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#061710] border border-emerald-900/80 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">
            Total Intake Queued: <strong className="text-emerald-400">{lots.length} Lots</strong>
          </span>
        </div>
      </div>

      {/* Modern Technical Grid/Table */}
      <div className="bg-[#0b2118]/80 border border-emerald-900/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-950/80 text-left font-mono">
            <thead className="bg-[#071912] text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Lot ID</th>
                <th className="px-6 py-4">Material Stream</th>
                <th className="px-6 py-4">Weighed Mass</th>
                <th className="px-6 py-4">Origin Hub</th>
                <th className="px-6 py-4">Suggested Range</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 text-xs">
              {filteredLots.map((lot) => {
                const material = materials.find(m => m.id === lot.materialId);
                const isPending = lot.status === 'Created';

                return (
                  <tr key={lot.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      #{lot.id.toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{material?.icon}</span>
                        <span className="text-slate-200 font-bold">{material?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-bold">
                      {lot.weight} KG
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {lot.collectorId} (Pune)
                    </td>
                    <td className="px-6 py-4 text-amber-300 font-bold">
                      ₹{lot.estimatedValueRange[0]} – ₹{lot.estimatedValueRange[1]}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                        lot.status === 'Handover Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : lot.status === 'Offer Accepted'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span>{lot.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isPending ? (
                        <button 
                          onClick={() => {
                            setSelectedLot(lot);
                            setOfferPrice(material?.basePrice.toString() || '230');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-sm active:scale-95"
                        >
                          Make Offer
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          {lot.finalPrice ? `₹${lot.finalPrice} Locked` : 'Matched'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Make Offer Modal */}
      {selectedLot && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b241a] border-2 border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-100 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <h3 className="text-lg font-black text-white font-mono uppercase">
                Submit Offer for Lot #{selectedLot.id.toUpperCase()}
              </h3>
              <span className="text-xs font-mono text-emerald-400">COLLECTOR DIRECT</span>
            </div>
            
            <div className="bg-[#061710] p-4 rounded-2xl border border-emerald-950 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Material Stream:</span>
                <span className="font-bold text-white">
                  {materials.find(m => m.id === selectedLot.materialId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certified Weight:</span>
                <span className="font-bold text-white">{selectedLot.weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fair Mandi Floor:</span>
                <span className="font-bold text-amber-300">
                  ₹{selectedLot.estimatedValueRange[0]} – ₹{selectedLot.estimatedValueRange[1]}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 font-bold block">
                Offered Buying Rate (₹ per KG):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-emerald-400 font-mono font-bold">₹</span>
                <input 
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-[#061710] border border-emerald-500/40 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Total Lot Payout: <strong className="text-emerald-300">₹{Math.round((parseFloat(offerPrice) || 0) * selectedLot.weight)}</strong> (Cash on Handover)
              </p>
            </div>

            <div className="flex space-x-3 pt-3">
              <button 
                onClick={() => setSelectedLot(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleMakeOffer}
                disabled={!offerPrice}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs rounded-xl shadow-tactile-green active:translate-y-0.5 transition-all"
              >
                Dispatch Offer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default IncomingLots;
