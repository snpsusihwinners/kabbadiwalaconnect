import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Offers: React.FC = () => {
  const { lots, materials } = useAppContext();
  
  // Lots that are either offered or completed with this recycler
  const myOffers = lots.filter(l => l.status !== 'Created');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-paper-300 shadow-tactile flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-industrial-950">
            Active Bids & Procurement Contracts
          </h2>
          <p className="text-xs text-industrial-500 font-medium mt-0.5">
            Manage lots matched with GreenCycle Circular Technologies
          </p>
        </div>

        <div className="flex gap-2 text-xs font-mono">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
            {myOffers.filter(o => o.status === 'Handover Completed').length} Completed
          </span>
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl font-bold">
            {myOffers.filter(o => o.status === 'Offer Accepted').length} In Transit
          </span>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-2xl border border-paper-300 shadow-tactile overflow-hidden">
        <div className="p-4 border-b border-paper-200 flex justify-between items-center">
          <h3 className="font-display font-bold text-sm text-industrial-950">
            Current Procurement Commitments
          </h3>
          <span className="text-xs text-industrial-500 font-mono">
            {myOffers.length} Active Contracts
          </span>
        </div>

        <div className="divide-y divide-paper-200">
          {myOffers.map((lot) => {
            const material = materials.find(m => m.id === lot.materialId);
            const isCompleted = lot.status === 'Handover Completed';

            return (
              <div key={lot.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <MaterialBadge 
                    iconKey={material?.icon} 
                    category={material?.category} 
                    size="md" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-industrial-950">
                        {material?.name}
                      </h4>
                      <span className="text-[10px] font-mono text-industrial-500 bg-paper-200 px-1.5 py-0.2 rounded">
                        LOT #{lot.id.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-industrial-500 font-mono mt-0.5">
                      Collector: {lot.collectorName} ({lot.collectorId}) • Manifest {lot.manifestNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-industrial-500 font-mono uppercase block">Contract Net</span>
                    <span className="text-sm font-bold font-mono text-industrial-900">{lot.weight} kg</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-industrial-500 font-mono uppercase block">Agreed Value</span>
                    <span className="text-base font-black font-mono text-emerald-800">
                      ₹{lot.finalPrice || Math.round((lot.ratePerKg || material?.basePrice || 200) * lot.weight)}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block font-mono ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {isCompleted ? '✓ SETTLED' : '⏳ EN ROUTE'}
                    </span>
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

export default Offers;
