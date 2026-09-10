import React, { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Earnings: React.FC = () => {
  const { transactions, materials } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.status === filter);
  
  const totalEarned = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">My Earnings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg shadow-green-200">
          <p className="text-green-100 font-medium mb-1">Total Earned</p>
          <h2 className="text-4xl font-black mb-4">₹{totalEarned.toLocaleString()}</h2>
          <div className="bg-white/20 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
            <span className="text-sm font-medium">Pending Handover</span>
            <span className="font-bold">₹{totalPending.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {['All', 'Paid', 'Pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTransactions.map(t => {
            const material = materials.find(m => m.id === t.materialId);
            const isPaid = t.status === 'Paid';
            return (
              <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {isPaid ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{material?.name}</h3>
                    <p className="text-xs text-gray-500">{t.weight} kg • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{t.amount.toLocaleString()}</p>
                  <p className={`text-xs font-bold ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                    {t.status} {t.method && `(${t.method})`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
