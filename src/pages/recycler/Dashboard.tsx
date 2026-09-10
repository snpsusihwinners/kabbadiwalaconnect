import React from 'react';
import { 
  Inbox, 
  FileCheck, 
  IndianRupee, 
  TrendingUp, 
  Scale, 
  Leaf, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { lots, transactions } = useAppContext();
  const navigate = useNavigate();
  
  const pendingLotsCount = lots.filter(l => l.status !== 'Handover Completed').length;
  const completedLotsCount = lots.filter(l => l.status === 'Handover Completed').length;
  const totalValue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);

  const kpis = [
    { 
      label: 'INCOMING LOT RADAR', 
      value: pendingLotsCount, 
      sub: 'Pending Collector Offers', 
      icon: Inbox, 
      color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' 
    },
    { 
      label: 'RECYCLED TONNAGE', 
      value: '182.4 KG', 
      sub: 'Today intake volume', 
      icon: Scale, 
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' 
    },
    { 
      label: 'CAPITAL DISBURSED', 
      value: `₹${(totalValue + 42000).toLocaleString()}`, 
      sub: '100% Direct to Aggregators', 
      icon: IndianRupee, 
      color: 'text-teal-400 bg-teal-950/40 border-teal-500/30' 
    },
    { 
      label: 'EPR CARBON CREDITS', 
      value: '348 kg CO₂e', 
      sub: 'Audited avoided emissions', 
      icon: Leaf, 
      color: 'text-green-400 bg-green-950/40 border-green-500/30' 
    },
  ];

  const materialBreakdown = [
    { name: 'Printed Circuit Boards (PCB)', percent: 45, color: 'bg-emerald-500' },
    { name: 'Copper Cables & Wires', percent: 28, color: 'bg-amber-500' },
    { name: 'Lithium & Lead Batteries', percent: 17, color: 'bg-teal-400' },
    { name: 'CRTs & Display Glass', percent: 10, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0d2a1f] to-[#071a13] border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FACILITY STATUS: OPERATIONAL</span>
          </div>
          <h2 className="text-2xl font-black text-white">Pune Central Recycling Yard #04</h2>
          <p className="text-xs text-slate-400 font-mono">
            Directly connected to 142 registered scrap collectors across Pune, Pimpri & Chakan.
          </p>
        </div>

        <button 
          onClick={() => navigate('/recycler/lots')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs px-5 py-3 rounded-xl shadow-tactile-green active:translate-y-0.5 transition-all flex items-center space-x-2"
        >
          <Inbox className="w-4 h-4" />
          <span>INCOMING SCRAP LOTS ({pendingLotsCount})</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            className="bg-[#0b2118]/80 border border-emerald-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-xl border ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-black text-white font-mono tracking-tight mb-1">
              {kpi.value}
            </div>
            
            <p className="text-[11px] text-slate-400 font-mono">
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Intake Volume Graph & Material Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Volume Graph */}
        <div className="lg:col-span-2 bg-[#0b2118]/80 border border-emerald-900/50 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                7-Day Intake Volume (Kilograms)
              </h3>
              <p className="text-xs text-slate-400 font-mono">Formal handovers through ECOSETU verification</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800/60">
              +18.4% WoW
            </span>
          </div>

          <div className="h-56 flex items-end justify-between space-x-3 pt-6 pb-2 border-b border-emerald-900/40">
            {[
              { day: 'Mon', val: 120 },
              { day: 'Tue', val: 145 },
              { day: 'Wed', val: 98 },
              { day: 'Thu', val: 210 },
              { day: 'Fri', val: 165 },
              { day: 'Sat', val: 240 },
              { day: 'Sun', val: 182 },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <span className="text-[10px] font-mono text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.val}kg
                </span>
                <div 
                  className="w-full bg-gradient-to-t from-emerald-800 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover:from-emerald-700 group-hover:to-teal-300"
                  style={{ height: `${(item.val / 250) * 160}px` }}
                />
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Minimum Mandi Floor Enforced: ₹220/kg</span>
            <span className="text-emerald-400">CPCB Batch ID #MH-26-09</span>
          </div>
        </div>

        {/* Material Stream Share */}
        <div className="bg-[#0b2118]/80 border border-emerald-900/50 rounded-3xl p-6 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Scrap Feedstock Mix
            </h3>
            <p className="text-xs text-slate-400 font-mono">Current warehouse sorting distribution</p>
          </div>

          <div className="space-y-3 pt-2">
            {materialBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 truncate pr-2">{item.name}</span>
                  <span className="font-bold text-white">{item.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-emerald-900/40 text-xs text-slate-400">
            <span className="text-amber-400 font-bold font-mono">High Demand:</span>
            <p className="text-[11px] mt-0.5">High-grade telecoms PCB and copper wire offer maximum recovery margins this quarter.</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
