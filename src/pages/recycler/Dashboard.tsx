import React from 'react';
import { Inbox, FileCheck, IndianRupee, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Dashboard: React.FC = () => {
  const { lots, transactions } = useAppContext();
  
  const pendingLotsCount = lots.filter(l => l.status !== 'Handover Completed').length;
  const completedLotsCount = lots.filter(l => l.status === 'Handover Completed').length;
  const totalValue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);

  const kpis = [
    { label: 'Incoming Lots', value: pendingLotsCount, icon: Inbox, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed Handovers', value: completedLotsCount, icon: FileCheck, color: 'bg-green-50 text-green-600' },
    { label: "Today's Material (kg)", value: '26', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
    { label: "Total Purchase Value", value: `₹${totalValue.toLocaleString()}`, icon: IndianRupee, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${kpi.color}`}>
              <kpi.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Collection Trend</h2>
        <div className="h-64 flex items-end justify-between space-x-2 pb-4 border-b border-gray-100">
          {[40, 60, 30, 80, 50, 90, 75].map((val, i) => (
            <div key={i} className="w-full bg-green-100 rounded-t-lg relative group transition-all hover:bg-green-200" style={{ height: `${val}%` }}>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                {val}kg
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
