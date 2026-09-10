import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Truck, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Recycler } from '../../data/mockData';

const Recyclers: React.FC = () => {
  const { recyclers, lots, updateLot } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLotId = location.state?.lotId;
  const currentLot = lots.find(l => l.id === currentLotId);
  const materialId = currentLot?.materialId;

  // Removed selectedRecycler

  // Filter recyclers that accept the material, or show all if no lot
  const displayRecyclers = materialId 
    ? recyclers.filter(r => r.acceptedMaterials.includes(materialId)).sort((a, b) => b.offers[materialId] - a.offers[materialId])
    : recyclers;

  const handleAcceptOffer = (recycler: Recycler) => {
    if (currentLot) {
      updateLot(currentLot.id, { 
        recyclerId: recycler.id, 
        status: 'Offer Accepted',
        finalPrice: (recycler.offers[currentLot.materialId] || 0) * currentLot.weight
      });
      navigate(`/collector/handover/${currentLot.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 relative">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">{currentLot ? 'Match Found' : 'Nearby Recyclers'}</h1>
      </div>

      <div className="p-4 space-y-4">
        {currentLot && (
          <div className="bg-green-600 text-white p-4 rounded-2xl shadow-md mb-6">
            <p className="text-green-100 text-sm mb-1">Looking for offers for:</p>
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold">{currentLot.weight} kg E-Waste</h2>
              <div className="text-right">
                <p className="text-xs text-green-200">Est. Value</p>
                <p className="font-bold">₹{currentLot.estimatedValueRange[0]} - ₹{currentLot.estimatedValueRange[1]}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayRecyclers.map((r, i) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center">
                      {r.name}
                      {r.authorized && <ShieldCheck className="w-5 h-5 text-blue-500 ml-1" />}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {r.distance} km away
                    </div>
                  </div>
                  {i === 0 && currentLot && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Best Match</span>
                  )}
                </div>
                
                {r.pickup && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 inline-flex px-2 py-1 rounded-md mt-2 border border-gray-100">
                    <Truck className="w-4 h-4 mr-1 text-gray-400" />
                    Pickup Available
                  </div>
                )}
              </div>

              {currentLot && (
                <div className="bg-green-50 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-green-700 font-medium">Offered Rate</p>
                    <p className="text-xl font-black text-gray-900">₹{r.offers[currentLot.materialId]}/kg</p>
                  </div>
                  <button 
                    onClick={() => handleAcceptOffer(r)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-sm"
                  >
                    Accept
                  </button>
                </div>
              )}

              {!currentLot && (
                <button className="w-full p-3 text-center text-sm font-medium text-gray-600 flex justify-center items-center hover:bg-gray-50 transition-colors">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recyclers;
