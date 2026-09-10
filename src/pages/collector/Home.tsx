import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, IndianRupee, Recycle, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, lots, transactions } = useAppContext();
  
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.amount, 0);
  const totalAmount = transactions.filter(t => t.status === 'Paid').reduce((acc, t) => acc + t.amount, 0);
  
  const recentLot = lots[0];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 rounded-b-3xl shadow-sm border-b border-gray-100 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">नमस्ते 👋</h2>
          <p className="text-sm text-gray-500">Raju Scrap Co.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`p-2 rounded-full ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
          >
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </button>
          <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <span className="font-bold text-green-800">RS</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Main Action */}
        <button 
          onClick={() => navigate('/collector/create')}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white rounded-3xl p-6 shadow-xl shadow-green-200 flex flex-col items-center justify-center space-y-3"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <span className="text-2xl font-bold">Sell E-Waste</span>
        </button>

        {/* Earnings Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/collector/earnings')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">This Month</p>
            <p className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl shadow-sm border border-orange-100">
            <p className="text-xs text-orange-600 font-medium uppercase tracking-wider mb-1">Pending</p>
            <p className="text-xl font-bold text-orange-700">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/collector/prices')} className="bg-white flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95">
            <IndianRupee className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-xs font-medium text-gray-700">Prices</span>
          </button>
          <button onClick={() => navigate('/collector/recyclers')} className="bg-white flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95">
            <Recycle className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-xs font-medium text-gray-700">Recyclers</span>
          </button>
          <button className="bg-white flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95">
            <ShieldCheck className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-xs font-medium text-gray-700">Safety</span>
          </button>
        </div>

        {/* Recent Activity */}
        {recentLot && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Recent Lot</h3>
              <span className="text-xs text-gray-500">{new Date(recentLot.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                  {recentLot.materialId === 'm3' ? '🔌' : '📦'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{recentLot.weight} kg</p>
                  <p className="text-xs text-gray-500">ID: {recentLot.id.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{recentLot.finalPrice || '---'}</p>
                <p className={`text-xs font-medium ${recentLot.status.includes('Completed') ? 'text-green-600' : 'text-orange-500'}`}>
                  {recentLot.status} {recentLot.status.includes('Completed') && '✓'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorHome;
