import React from 'react';
import { 
  Inbox, 
  Scale, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  TrendingUp,
  Building2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const Dashboard: React.FC = () => {
  const { lots, transactions, materials } = useAppContext();
  
  const pendingLots = lots.filter(l => l.status !== 'Handover Completed');
  const completedLots = lots.filter(l => l.status === 'Handover Completed');
  const totalValue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalKg = transactions.reduce((sum, t) => sum + t.weight, 0);

  const kpis = [
    { 
      label: 'INCOMING LOTS', 
      value: pendingLotsCount, 
      sub: 'Pending verification', 
      icon: Inbox, 
      color: 'text-amber-700 bg-amber-50 border-amber-200' 
    },
    { 
      label: 'RECYCLED TONNAGE', 
      value: '182.4 KG', 
      sub: 'Today intake volume', 
      icon: Scale, 
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    },
    { 
      label: 'CAPITAL DISBURSED', 
      value: `₹${(totalValue + 42000).toLocaleString()}`, 
      sub: 'Direct to Aggregators', 
      icon: TrendingUp, 
      color: 'text-blue-700 bg-blue-50 border-blue-200' 
    },
    { 
      label: 'EPR CARBON SAVINGS', 
      value: '348 kg CO₂e', 
      sub: 'Audited avoided emissions', 
      icon: Leaf, 
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    },
  ];

  const materialBreakdown = [
    { name: 'Printed Circuit Boards (PCB)', percent: 45, color: 'bg-emerald-600' },
    { name: 'Copper Cables & Wires', percent: 28, color: 'bg-amber-500' },
    { name: 'Lithium & Lead Batteries', percent: 17, color: 'bg-sky-500' },
    { name: 'Display Glass & CRTs', percent: 10, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>FACILITY OPERATIONAL</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Pune Central Recycling Yard #04</h2>
          <p className="text-xs text-slate-500">
            Connected to 142 registered scrap collectors across Pune & Pimpri Chinchwad.
          </p>
        </div>

        <button 
          onClick={() => navigate('/recycler/lots')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-2"
        >
          <Inbox className="w-4 h-4" />
          <span>INCOMING LOTS ({pendingLotsCount})</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-xl border ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2 Columns: Intake Volume Chart & Material Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Volume Graph */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                7-Day Inbound Volume (KG)
              </h3>
              <p className="text-xs text-slate-500">Verified scrap handovers through ECOSETU tokens</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +18.4% WoW
            </span>
          </div>

          <div className="h-56 flex items-end justify-between space-x-3 pt-6 pb-2 border-b border-slate-100">
            {[
              { day: 'Mon', val: 120 },
              { day: 'Tue', val: 145 },
              { day: 'Wed', val: 98 },
              { day: 'Thu', val: 210 },
              { day: 'Fri', val: 165 },
              { day: 'Sat', val: 240 },
              { day: 'Sun', val: 182 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end">
                <span className="text-[10px] font-semibold text-slate-400">{d.val} kg</span>
                <div 
                  style={{ height: `${(d.val / 260) * 100}%` }}
                  className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                    i === 6 ? 'bg-emerald-600' : 'bg-slate-200 hover:bg-emerald-200'
                  }`}
                />
                <span className="text-xs font-medium text-slate-600">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Material Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Scrap Material Distribution
            </h3>
            <p className="text-xs text-slate-500">Breakdown of current yard inventory</p>
          </div>

          <div className="space-y-3 pt-2">
            {materialBreakdown.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{m.name}</span>
                  <span className="font-bold text-slate-900">{m.percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${m.percent}%` }}
                    className={`h-full rounded-full ${m.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> CPCB Traceable
            </span>
            <span className="text-slate-400">Target: 2,500 KG / Mo</span>
          </div>
        </div>
      </div>

      {/* Hourly Intake Volume Chart */}
      <div className="bg-white rounded-2xl border border-paper-300 p-6 shadow-tactile space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-base text-industrial-950">
            Today's Weighbridge Intake Volume (kg)
          </h3>
          <span className="text-xs font-mono text-industrial-500">
            Scale 01 Live Feed
          </span>
        </div>

        <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-paper-200">
          {[
            { hour: '08:00', val: 30, kg: '18kg' },
            { hour: '10:00', val: 65, kg: '42kg' },
            { hour: '12:00', val: 88, kg: '64kg' },
            { hour: '14:00', val: 45, kg: '28kg' },
            { hour: '16:00', val: 95, kg: '72kg' },
            { hour: '18:00', val: 70, kg: '50kg' },
            { hour: '20:00', val: 40, kg: '25kg' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-emerald-800 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.kg}
              </span>
              <div 
                className="w-full bg-forest-800 group-hover:bg-emerald-600 rounded-t-xl transition-all shadow-sm"
                style={{ height: `${bar.val}%` }}
              ></div>
              <span className="text-[10px] font-mono text-industrial-500 mt-2">
                {bar.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Gate-In Handovers */}
      <div className="bg-white rounded-2xl border border-paper-300 shadow-tactile overflow-hidden">
        <div className="p-4 border-b border-paper-200 flex justify-between items-center">
          <h3 className="font-display font-bold text-sm text-industrial-950">
            Recent Gate-In Transactions
          </h3>
          <span className="text-xs text-industrial-500 font-mono">
            {transactions.length} Total Settlements
          </span>
        </div>

        <div className="divide-y divide-paper-200">
          {transactions.map(t => {
            const material = materials.find(m => m.id === t.materialId);

            return (
              <div key={t.id} className="p-4 flex items-center justify-between text-xs hover:bg-paper-50 transition-colors">
                <div className="flex items-center gap-3">
                  <MaterialBadge iconKey={material?.icon} category={material?.category} size="sm" />
                  <div>
                    <span className="font-bold text-industrial-950 block">{material?.name}</span>
                    <span className="text-industrial-500 font-mono text-[11px]">Slip #{t.ticketNo}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-industrial-900 block">
                    {t.weight} kg Net (₹{t.amount})
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono font-semibold">
                    {t.method} Settled ✓
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

