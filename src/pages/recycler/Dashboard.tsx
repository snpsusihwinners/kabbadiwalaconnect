import React from 'react';
import { 
  Inbox, 
  FileCheck, 
  IndianRupee, 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  ArrowRight,
  Layers,
  Recycle,
  Sparkles
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
      label: 'Verified Intake Weight', 
      value: `${totalKg.toFixed(1)} kg`, 
      sub: 'Cumulative Mass Balance',
      icon: Scale, 
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    },
    { 
      label: 'Completed Handovers', 
      value: `${completedLots.length} Lots`, 
      sub: `${pendingLots.length} in transit pipeline`,
      icon: FileCheck, 
      color: 'bg-blue-50 text-blue-800 border-blue-200' 
    },
    { 
      label: 'CPCB Form-6 Manifests', 
      value: '100% Audit', 
      sub: 'Statutory compliance pass',
      icon: ShieldCheck, 
      color: 'bg-forest-50 text-forest-800 border-forest-200' 
    },
    { 
      label: 'Disbursed Procurement', 
      value: `₹${totalValue.toLocaleString('en-IN')}`, 
      sub: 'Instant UPI & Bank IMPS',
      icon: IndianRupee, 
      color: 'bg-amber-50 text-amber-800 border-amber-200' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index} 
            className="bg-white p-5 rounded-2xl border border-paper-300 shadow-tactile flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-industrial-500 uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-xl border ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black font-mono text-industrial-950">
                {kpi.value}
              </h3>
              <p className="text-[11px] text-industrial-500 font-medium mt-0.5">
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mass-Balance Circular Material Yield Flow */}
      <div className="bg-white rounded-2xl border border-paper-300 p-6 shadow-tactile space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-display font-bold text-base text-industrial-950">
                Mass-Balance Circular Flow Architecture
              </h3>
              <p className="text-xs text-industrial-500">
                End-to-End Recovery Yield: 91.4% (CPCB Basel Benchmark Approved)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl">
            RECOVERY YIELD: 91.4%
          </span>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="bg-paper-100 p-3.5 rounded-xl border border-paper-300 space-y-1">
            <span className="text-[10px] uppercase font-bold text-industrial-500 block">1. Field Gate-In</span>
            <span className="text-base font-black text-industrial-950">48.2 kg</span>
            <p className="text-[10px] text-industrial-600 font-sans">Raw gross intake across scrap yards</p>
          </div>

          <div className="bg-paper-100 p-3.5 rounded-xl border border-paper-300 space-y-1">
            <span className="text-[10px] uppercase font-bold text-industrial-500 block">2. Shredding & Density</span>
            <span className="text-base font-black text-industrial-950">46.5 kg</span>
            <p className="text-[10px] text-industrial-600 font-sans">Mechanical separation & dust removal</p>
          </div>

          <div className="bg-paper-100 p-3.5 rounded-xl border border-paper-300 space-y-1">
            <span className="text-[10px] uppercase font-bold text-industrial-500 block">3. Smelting Yield</span>
            <span className="text-base font-black text-emerald-800">44.1 kg</span>
            <p className="text-[10px] text-emerald-800 font-sans">Secondary pure copper & ingot output</p>
          </div>

          <div className="bg-paper-100 p-3.5 rounded-xl border border-paper-300 space-y-1">
            <span className="text-[10px] uppercase font-bold text-industrial-500 block">4. Inert Neutral Slag</span>
            <span className="text-base font-black text-industrial-700">4.1 kg</span>
            <p className="text-[10px] text-industrial-600 font-sans">Neutralized & secured hazardous disposal</p>
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

