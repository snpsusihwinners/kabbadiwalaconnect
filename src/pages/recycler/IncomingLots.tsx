import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Lot } from '../../data/mockData';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const IncomingLots: React.FC = () => {
  const { lots, materials, updateLot } = useAppContext();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Created' | 'Offer Accepted' | 'Handover Completed'>('All');

  const filteredLots = lots.filter(lot => {
    const matchesStatus = statusFilter === 'All' || lot.status === statusFilter;
    const material = materials.find(m => m.id === lot.materialId);
    const matchesSearch = searchQuery === '' ||
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.manifestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material && material.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lot.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleMakeOffer = () => {
    if (selectedLot && offerPrice) {
      const rate = parseFloat(offerPrice);
      updateLot(selectedLot.id, { 
        status: 'Offer Accepted',
        finalPrice: Math.round(rate * selectedLot.weight),
        ratePerKg: rate,
        recyclerId: 'r1'
      });
      setSelectedLot(null);
      alert('ऑफर यशस्वीरित्या सबमिट केली! कलेक्टरला त्वरित संदेश पाठवला आहे.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Lot ID or Collector (e.g. L1, COL-1028)..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Lots Queued: <strong className="text-slate-900">{lots.length} Lots</strong>
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Lot ID</th>
                <th className="px-6 py-3.5">Material</th>
                <th className="px-6 py-3.5">Weight</th>
                <th className="px-6 py-3.5">Collector</th>
                <th className="px-6 py-3.5">Est. Valuation</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLots.map((lot) => {
                const material = materials.find(m => m.id === lot.materialId);

                return (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      #{lot.id.toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{material?.icon}</span>
                        <span className="font-semibold text-slate-900">{material?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {lot.weight} KG
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {lot.collectorId} (Pune)
                    </td>
                    <td className="px-6 py-4 text-emerald-700 font-bold">
                      ₹{lot.estimatedValueRange[0]} – ₹{lot.estimatedValueRange[1]}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center space-x-1 border ${
                        lot.status === 'Handover Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lot.status === 'Offer Accepted'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        <span>{lot.status}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      <span className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-bold rounded-full border ${
                        lot.status === 'Created' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        lot.status === 'Offer Accepted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {lot.status === 'Created' ? 'AWAITING BID' :
                         lot.status === 'Offer Accepted' ? 'EN ROUTE' :
                         'GATE-IN SETTLED'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right font-display font-bold">
                      {lot.status === 'Created' ? (
                        <button 
                          onClick={() => {
                            setSelectedLot(lot);
                            setOfferPrice(material?.basePrice.toString() || '230');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
                        >
                          <span>Place B2B Bid</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
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

      {/* Offer Modal */}
      {selectedLot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Submit Buying Offer for Lot #{selectedLot.id.toUpperCase()}
              </h3>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Material:</span>
                <span className="font-bold text-slate-900">
                  {materials.find(m => m.id === selectedLot.materialId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certified Weight:</span>
                <span className="font-bold text-slate-900">{selectedLot.weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Mandi Floor:</span>
                <span className="font-bold text-emerald-700">
                  ₹{selectedLot.estimatedValueRange[0]} – ₹{selectedLot.estimatedValueRange[1]}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 font-bold block">
                Offer Rate (₹ per KG):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input 
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Total Payout: <strong className="text-slate-900 font-bold">₹{Math.round((parseFloat(offerPrice) || 0) * selectedLot.weight)}</strong>
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setSelectedLot(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMakeOffer}
                disabled={!offerPrice}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingLots;

