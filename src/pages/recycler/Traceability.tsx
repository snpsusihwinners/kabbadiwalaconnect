import React from 'react';
import { CheckCircle, Truck, Building2, MapPin, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Traceability: React.FC = () => {
  const { lots } = useAppContext();
  const activeLot = lots.find(l => l.status === 'Handover Completed') || lots[0];

  const timelineSteps = [
    { title: 'Collected', desc: 'Sourced from Household', time: activeLot?.createdAt, icon: MapPin, completed: true },
    { title: 'Lot Created', desc: `ID: ${activeLot?.id.toUpperCase()} • ${activeLot?.weight} kg`, time: activeLot?.createdAt, icon: CheckCircle, completed: true },
    { title: 'Price Quoted & Matched', desc: `GreenCycle Recycling • ₹${activeLot?.finalPrice}`, time: new Date().toISOString(), icon: CheckCircle, completed: activeLot?.status !== 'Created' },
    { title: 'Handover Confirmed', desc: 'GPS Verified • Paid Cash', time: new Date().toISOString(), icon: Truck, completed: activeLot?.status === 'Handover Completed' },
    { title: 'Recycling Processing', desc: 'Pending physical receipt at facility', time: null, icon: Building2, completed: false },
  ];

  return (
    <div className="flex space-x-6">
      <div className="w-1/3 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Track Lot</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Enter Lot ID..." 
              defaultValue={activeLot?.id.toUpperCase()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Recent Handovers</p>
            <div className="mt-2 space-y-2">
              {lots.filter(l => l.status === 'Handover Completed').map(l => (
                <div key={l.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200">
                  <span className="font-bold text-gray-700">{l.id.toUpperCase()}</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/3">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Traceability Report</h2>
              <p className="text-gray-500">Lot {activeLot?.id.toUpperCase()}</p>
            </div>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              Download Certificate
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8 relative">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shrink-0 z-10 ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-6 pt-3">
                    <h4 className={`text-lg font-bold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h4>
                    <p className="text-gray-500 mt-1">{step.desc}</p>
                    {step.time && (
                      <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(step.time).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Traceability;
