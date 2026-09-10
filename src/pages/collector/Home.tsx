import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  Menu, Bell, Plus, QrCode, Battery, AlertCircle, 
  Banknote, History, ChevronRight
} from 'lucide-react';

const CollectorHome: React.FC = () => {
  const navigate = useNavigate();
  const { language, transactions } = useAppContext();

  const totalAmount = 14500;
  const pendingAmount = 3200;
  
  // get most recent unpaid or recent transaction
  const recentLot = transactions.length > 0 ? transactions[0] : null;

  return (
    <div className="min-h-screen bg-khata-paper bg-grid-pattern pb-24 text-khata-ink">
      
      {/* Header - Brutalist & Striking */}
      <div className="bg-khata-ink text-khata-paper p-4 brutal-border-b sticky top-0 z-20 flex justify-between items-center shadow-brutal-sm border-b-2 border-khata-ink">
        <div className="flex items-center space-x-3">
          <button className="p-1 border border-khata-paper active:scale-95 transition-transform">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-vernacular text-2xl tracking-wide leading-none">
              {language === 'mr' ? 'ECOSETU' : 'ECOSETU'}
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-khata-paper/70 uppercase">
              {language === 'mr' ? 'कलेक्टर' : 'COLLECTOR_ID: CX-9281'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-khata-green bg-khata-paper px-1 mb-0.5">ONLINE</span>
            <span className="text-[10px] font-mono">Sync: 0ms</span>
          </div>
          <button className="relative p-1 border border-khata-paper active:scale-95 transition-transform">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-khata-red rounded-full border border-khata-ink"></span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Main Action - Huge Brutal Button */}
        <button 
          onClick={() => navigate('/collector/lot/new')}
          className="w-full brutal-card p-6 flex flex-col items-center justify-center space-y-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-2 text-khata-ink/10 group-hover:scale-110 transition-transform">
            <QrCode className="w-24 h-24" />
          </div>
          
          <div className="relative z-10 w-16 h-16 border-2 border-khata-ink rounded-full flex items-center justify-center bg-khata-red text-khata-paper shadow-brutal-sm">
            <Plus className="w-8 h-8" />
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="font-vernacular text-3xl font-black tracking-tight">
              {language === 'mr' ? 'नवीन लॉट नोंदवा' : 'NEW ENTRY'}
            </h2>
            <p className="text-xs font-mono font-bold mt-1 bg-khata-ink text-khata-paper px-2 py-0.5 inline-block">
              {language === 'mr' ? 'माल जोडा आणि स्कॅन करा' : 'ADD SCRAP & SCAN'}
            </p>
          </div>
        </button>

        {/* Ledger Summary / Bahi Khata */}
        <div className="border-t-2 border-b-2 border-khata-ink py-4">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-vernacular text-xl uppercase tracking-wide">
              {language === 'mr' ? 'खाते' : 'LEDGER'}
            </h3>
            <span className="text-xs font-mono font-bold">SEP 2026</span>
          </div>

          <div className="grid grid-cols-2 gap-0 border-2 border-khata-ink">
            {/* Settled */}
            <div 
              onClick={() => navigate('/collector/earnings')}
              className="p-3 border-r-2 border-khata-ink active:bg-khata-ink active:text-khata-paper cursor-pointer transition-colors"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1">
                {language === 'mr' ? 'जमा' : 'SETTLED'}
              </p>
              <p className="text-2xl font-black font-mono">₹{totalAmount.toLocaleString()}</p>
            </div>
            
            {/* Pending */}
            <div 
              onClick={() => navigate('/collector/earnings')}
              className="p-3 active:bg-khata-ink active:text-khata-paper cursor-pointer transition-colors relative"
            >
              <div className="absolute top-2 right-2 w-2 h-2 bg-khata-red rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-khata-red">
                {language === 'mr' ? 'बाकी' : 'PENDING'}
              </p>
              <p className="text-2xl font-black font-mono">₹{pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/collector/prices')}
            className="brutal-card p-4 flex flex-col justify-between h-28 text-left"
          >
            <Banknote className="w-6 h-6 text-khata-green" />
            <div>
              <p className="font-vernacular text-lg leading-tight">
                {language === 'mr' ? 'बाजार भाव' : 'RATES'}
              </p>
              <p className="text-[10px] font-mono underline">VIEW LIVE</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/collector/recyclers')}
            className="brutal-card p-4 flex flex-col justify-between h-28 text-left bg-khata-blue text-khata-paper"
          >
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-vernacular text-lg leading-tight">
                {language === 'mr' ? 'रिसर्च सेंटर' : 'RECYCLERS'}
              </p>
              <p className="text-[10px] font-mono underline">FIND BUYERS</p>
            </div>
          </button>
        </div>

        {/* Recent Handover Manifest Ticket */}
        {recentLot && (
          <div className="mt-6">
            <h3 className="font-vernacular text-xl uppercase tracking-wide mb-3">
              {language === 'mr' ? 'शेवटचा लॉट' : 'LATEST RECORD'}
            </h3>
            
            <div className="brutal-card p-0 relative overflow-hidden bg-white">
              {/* Top dashed line like a receipt */}
              <div className="h-2 w-full border-b-2 border-dashed border-khata-ink opacity-30"></div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-xl">
                      {recentLot.weight} KG
                    </h4>
                    <p className="font-vernacular text-lg text-khata-ink/80">
                      {recentLot.materialId === 'm3' ? 'PCB BOARD' : 'MIXED E-WASTE'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-black font-mono">
                      ₹{recentLot.finalPrice || '1,900'}
                    </p>
                    {/* Stamp effect */}
                    <div className="mt-1">
                      <span className="khata-stamp text-xs">UNPAID</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-khata-ink pt-3 mt-2">
                  <p className="text-xs font-mono">
                    ID: {recentLot.id.toUpperCase().slice(0,8)}
                  </p>
                  <button 
                    onClick={() => navigate(`/collector/handover/${recentLot.id}`)}
                    className="flex items-center text-xs font-bold font-mono bg-khata-ink text-khata-paper px-3 py-1 hover:bg-khata-blue transition-colors active:scale-95"
                  >
                    HANDOVER <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CollectorHome;
