import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  User,
  X,
  Sparkles
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
      setOfferPrice('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-paper-300 shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Lot ID, Manifest, Material or Collector..." 
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-industrial-400"
          />
          <Search className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3" />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 text-xs">
          {(['All', 'Created', 'Offer Accepted', 'Handover Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all whitespace-nowrap ${
                statusFilter === tab 
                  ? 'bg-forest-800 text-white border-forest-700 shadow-sm' 
                  : 'bg-paper-100 text-industrial-600 border-paper-300 hover:bg-paper-200'
              }`}
            >
              {tab === 'Created' ? 'Awaiting Bids' : tab === 'Offer Accepted' ? 'In Transit' : tab === 'Handover Completed' ? 'Settled' : 'All Lots'}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Lots Table */}
      <div className="bg-white rounded-2xl border border-paper-300 shadow-tactile overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-paper-200">
            <thead className="bg-paper-100 text-industrial-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 text-left font-bold">Lot ID & Manifest</th>
                <th className="px-6 py-3.5 text-left font-bold">Material Grade</th>
                <th className="px-6 py-3.5 text-left font-bold">Net Weight</th>
                <th className="px-6 py-3.5 text-left font-bold">Collector & Origin</th>
                <th className="px-6 py-3.5 text-left font-bold">Mandi MSP Range</th>
                <th className="px-6 py-3.5 text-left font-bold">Current Status</th>
                <th className="px-6 py-3.5 text-right font-bold">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-paper-200 text-xs font-sans">
              {filteredLots.map(lot => {
                const material = materials.find(m => m.id === lot.materialId);

                return (
                  <tr key={lot.id} className="hover:bg-paper-50/80 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      <span className="font-bold text-industrial-950 block">{lot.id.toUpperCase()}</span>
                      <span className="text-[10px] text-industrial-500">{lot.manifestNo}</span>
                    </td>

                    {/* Material */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <MaterialBadge iconKey={material?.icon} category={material?.category} size="sm" />
                        <div>
                          <span className="font-bold text-industrial-950 block">{material?.name}</span>
                          <span className="text-[11px] text-industrial-500 font-mono">{material?.grade}</span>
                        </div>
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      <span className="font-bold text-industrial-950 block">{lot.weight} kg</span>
                      <span className="text-[10px] text-industrial-500">Grade: {lot.condition}</span>
                    </td>

                    {/* Collector */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-industrial-800 block">{lot.collectorName}</span>
                      <span className="text-[11px] text-industrial-500 font-mono">{lot.collectorId}</span>
                    </td>

                    {/* Mandi MSP */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      <span className="font-bold text-emerald-800 block">
                        ₹{lot.estimatedValueRange[0]} - ₹{lot.estimatedValueRange[1]}
                      </span>
                      <span className="text-[10px] text-industrial-500">
                        ₹{material?.basePrice}/kg index
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
                            setOfferPrice((material?.basePrice || 200).toString());
                          }} 
                          className="bg-forest-800 hover:bg-forest-900 active:scale-95 text-white px-3.5 py-1.5 rounded-xl shadow-tactile text-xs inline-flex items-center gap-1 transition-all"
                        >
                          <span>Place B2B Bid</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-industrial-500 font-mono text-xs">
                          {lot.finalPrice ? `₹${lot.finalPrice}` : 'View'}
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

      {/* B2B Make Offer Modal */}
      {selectedLot && (
        <div className="fixed inset-0 bg-industrial-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-paper-300 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-industrial-950">
                  Submit Procurement Bid for {selectedLot.id.toUpperCase()}
                </h3>
                <p className="text-[11px] text-industrial-500 font-mono">
                  Manifest: {selectedLot.manifestNo}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLot(null)}
                className="p-1 rounded-lg hover:bg-paper-100 text-industrial-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-paper-50 p-4 rounded-2xl border border-paper-300 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-industrial-500 font-sans">Commodity</span>
                <span className="font-bold text-industrial-900">{materials.find(m => m.id === selectedLot.materialId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-industrial-500 font-sans">Net Declared Weight</span>
                <span className="font-bold text-industrial-900">{selectedLot.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-industrial-500 font-sans">Mandi Market Range</span>
                <span className="font-bold text-emerald-800">₹{selectedLot.estimatedValueRange[0]} - ₹{selectedLot.estimatedValueRange[1]}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-industrial-700 block mb-1">
                Your Procurement Buying Rate (₹ per kg)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 font-mono font-bold text-industrial-500">₹</span>
                <input 
                  type="number" 
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-mono font-bold border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter per kg rate"
                />
              </div>
            </div>

            {offerPrice && (
              <div className="bg-forest-900 text-white p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                <span>TOTAL COMMITMENT PAYOUT:</span>
                <span className="text-base font-black text-amber-300">
                  ₹{Math.round(parseFloat(offerPrice || '0') * selectedLot.weight).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setSelectedLot(null)}
                className="px-4 py-2.5 text-xs font-bold text-industrial-600 bg-paper-100 hover:bg-paper-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMakeOffer}
                disabled={!offerPrice || parseFloat(offerPrice) <= 0}
                className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white rounded-xl text-xs font-display font-bold shadow-tactile flex items-center gap-1.5 transition-all"
              >
                <span>Transmit Offer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingLots;

