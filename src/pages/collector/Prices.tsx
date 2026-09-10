import React from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Volume2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Prices: React.FC = () => {
  const { materials } = useAppContext();

  // Mock trends
  const getTrend = (index: number) => {
    if (index % 3 === 0) return { icon: TrendingUp, color: 'text-green-500' };
    if (index % 3 === 1) return { icon: TrendingDown, color: 'text-red-500' };
    return { icon: Minus, color: 'text-gray-400' };
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Today's Prices</h1>
        <div className="flex items-center text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
          <MapPin className="w-4 h-4 mr-1" />
          Pune
        </div>
      </div>

      <div className="p-4 space-y-4">
        <button className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 border border-blue-100">
          <Volume2 className="w-5 h-5" />
          <span>Listen to Prices</span>
        </button>

        <div className="space-y-3">
          {materials.map((m, i) => {
            const TrendIcon = getTrend(i).icon;
            const trendColor = getTrend(i).color;
            
            return (
              <div key={m.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl bg-gray-50 p-2 rounded-xl">{m.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{m.name}</h3>
                    <p className="text-xs text-gray-500">Updated 2h ago</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className="text-xl font-black text-gray-900">₹{m.basePrice}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">per {m.unit}</span>
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
