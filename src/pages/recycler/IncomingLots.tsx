import React, { useState } from 'react';
import { Search, Filter, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Lot } from '../../data/mockData';

const IncomingLots: React.FC = () => {
  const { lots, materials, updateLot } = useAppContext();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [offerPrice, setOfferPrice] = useState('');

  const handleMakeOffer = () => {
    if (selectedLot && offerPrice) {
      updateLot(selectedLot.id, { 
        status: 'Offer Accepted', // In a real app this would go to 'Offer Made' and collector accepts
        finalPrice: parseFloat(offerPrice) * selectedLot.weight 
      });
      setSelectedLot(null);
      alert('Offer submitted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search Lot ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lots.map(lot => {
              const material = materials.find(m => m.id === lot.materialId);
              return (
                <tr key={lot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{lot.id.toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{material?.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{material?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.weight} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.collectorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{lot.estimatedValueRange[0]} - ₹{lot.estimatedValueRange[1]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lot.status === 'Created' ? 'bg-yellow-100 text-yellow-800' :
                      lot.status === 'Offer Accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {lot.status === 'Created' ? (
                      <button onClick={() => setSelectedLot(lot)} className="text-green-600 hover:text-green-900 font-bold">Make Offer</button>
                    ) : (
                      <span className="text-gray-400">View</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Make Offer Modal */}
      {selectedLot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Make Offer for {selectedLot.id.toUpperCase()}</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Material</span>
                <span className="font-bold">{materials.find(m => m.id === selectedLot.materialId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Weight</span>
                <span className="font-bold">{selectedLot.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Suggested Range</span>
                <span className="font-bold">₹{selectedLot.estimatedValueRange[0]} - ₹{selectedLot.estimatedValueRange[1]}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer Price (per kg)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              {offerPrice && parseFloat(offerPrice) * selectedLot.weight < selectedLot.estimatedValueRange[0] && (
                <div className="flex items-start text-orange-600 bg-orange-50 p-3 rounded-lg text-sm">
                  <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                  <p>Offer is below suggested market range. Collector may reject.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMakeOffer}
                  disabled={!offerPrice}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  Submit Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingLots;
