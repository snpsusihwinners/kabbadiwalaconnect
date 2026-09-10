import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCcw, 
  Sparkles, 
  IndianRupee, 
  Scale, 
  Volume2, 
  ShieldCheck,
  ChevronLeft,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Material } from '../../data/mockData';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const { materials, addLot, isOnline, addToSyncQueue, language } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(
    materials.find(m => m.id === 'm3') || materials[0]
  );
  const [weight, setWeight] = useState<string>('8.2');
  const [condition, setCondition] = useState('Used');
  const [source, setSource] = useState('Shop Scrap');

  const handleTakePhoto = () => {
    setPhotoTaken(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setSelectedMaterial(materials.find(m => m.id === 'm3') || materials[0]);
      setStep(2);
    }, 1600);
  };

  const handleGetEstimate = () => {
    if (!selectedMaterial || !weight) return;
    setStep(3);
  };

  const handleViewOffers = () => {
    if (!selectedMaterial || !weight) return;
    
    const estValue = selectedMaterial.basePrice * parseFloat(weight);
    const newLot = {
      id: `l${Math.floor(100 + Math.random() * 900)}`,
      materialId: selectedMaterial.id,
      weight: parseFloat(weight),
      condition,
      source,
      estimatedValueRange: [Math.round(estValue * 0.95), Math.round(estValue * 1.05)] as [number, number],
      status: 'Created' as const,
      createdAt: new Date().toISOString(),
      collectorId: 'COL-1028'
    };

    if (isOnline) {
      addLot(newLot);
      navigate('/collector/recyclers', { state: { lotId: newLot.id } });
    } else {
      addToSyncQueue({ type: 'ADD_LOT', payload: newLot });
      alert('लॉट ऑफ़लाइन सेव हो गया! इंटरनेट मिलने पर सिंक होगा.');
      navigate('/collector');
    }
  };

  const addWeight = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const updated = Math.max(0.1, Math.round((current + delta) * 10) / 10);
    setWeight(updated.toString());
  };

  return (
    <div className="flex flex-col min-h-full bg-khata-paper text-khata-ink pb-10">
      
      {/* Top App Bar */}
      <div className="bg-khata-paper text-white px-4 py-3.5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/collector')}
            className="p-1.5 rounded-none bg-khata-green/60 hover:bg-khata-green text-khata-green transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black tracking-tight leading-tight">
              {step === 1 ? 'फोटो स्कैन • STEP 1/3' : step === 2 ? 'वजन व श्रेणी • STEP 2/3' : 'अनुमानित भाव • STEP 3/3'}
            </h1>
            <p className="text-[10px] font-mono text-khata-green/80">
              CREATE NEW E-WASTE LOT
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-khata-green text-khata-green font-bold border border-khata-green/50">
            AI-SCANNER v2.4
          </span>
        </div>
      </div>

      {/* Step Navigation Progress Bar */}
      <div className="bg-khata-paper px-4 py-1.5 flex space-x-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-khata-green' : 'bg-khata-green'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-khata-green' : 'bg-khata-green'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-khata-green' : 'bg-khata-green'}`} />
      </div>

      <div className="p-4 flex-1">
        
        {/* STEP 1: Industrial Camera Scanner Viewfinder */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-none p-4 border-2 border-khata-ink shadow-brutal space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-slate-900">ई-कचरे की फोटो लें</h2>
                <p className="text-xs text-slate-500 font-medium">
                  AI कैमरा अपने आप धातु और सर्किट बोर्ड पहचान लेगा
                </p>
              </div>

              {/* Viewfinder Frame */}
              <div className="relative aspect-[4/3] bg-khata-paper rounded-none overflow-hidden border-2 border-khata-green/40 shadow-inner flex flex-col items-center justify-center">
                {/* Circuit Grid pattern */}
                <div className="absolute inset-0 bg-circuit-pattern opacity-15 pointer-events-none" />
                
                {/* Viewfinder Corners */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-khata-green" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-khata-green" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-khata-green" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-khata-green" />

                {analyzing ? (
                  <div className="flex flex-col items-center space-y-3 z-10 text-khata-green">
                    <div className="w-14 h-14 border-4 border-khata-green border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-xs font-bold tracking-wider animate-pulse">
                      ANALYZING CIRCUIT SPECS...
                    </p>
                    <div className="absolute inset-0 bg-khata-green/20 animate-scan pointer-events-none h-1.5" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-6 space-y-2 z-10">
                    <div className="w-16 h-16 rounded-none bg-khata-green/10 border border-khata-green/30 flex items-center justify-center text-khata-green">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-mono text-khata-green font-bold">
                      OPTICAL SENSOR READY
                    </span>
                    <p className="text-[11px] text-slate-400 max-w-[200px]">
                      PCB, तांबे के तार, बैटरी या मोटर को कैमरे के सामने रखें
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button 
                  onClick={handleTakePhoto}
                  disabled={analyzing}
                  className="w-full bg-khata-ink hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg py-4 rounded-none shadow-brutal active:translate-y-1 transition-all flex items-center justify-center space-x-2"
                >
                  <Camera className="w-6 h-6" />
                  <span>{analyzing ? 'स्कैनिंग चालू है...' : 'कैमरा चालू करें / TAKE PHOTO'}</span>
                </button>

                <button 
                  onClick={handleTakePhoto}
                  className="w-full bg-khata-paper hover:bg-khata-paper text-slate-800 font-bold text-xs py-3 rounded-none border-2 border-khata-ink transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-khata-green" />
                  <span>डेमो फोटो इस्तेमाल करें (Sample PCB Board)</span>
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-khata-green/20 border border-khata-green/30 rounded-none p-3 flex items-start space-x-2.5 text-xs text-khata-green">
              <ShieldCheck className="w-4 h-4 text-khata-green shrink-0 mt-0.5" />
              <span>साफ रोशनी में फोटो लेने से AI 95% से अधिक शुद्धता से धातु पहचानता है।</span>
            </div>
          </div>
        )}

        {/* STEP 2: Weight and Category */}
        {step === 2 && (
          <div className="space-y-4">
            
            {/* AI Identification Banner */}
            <div className="bg-khata-ink text-white p-4 rounded-none border border-khata-green/40 shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl bg-khata-green/20 p-2 rounded-none border border-khata-green/30">
                  {selectedMaterial.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono font-bold bg-khata-green/20 text-khata-green px-2 py-0.5 rounded-full">
                      AI RECOGNIZED • 92%
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedMaterial.name}</h3>
                  <p className="text-[11px] font-mono text-khata-green">
                    MANDI AVG: ₹{selectedMaterial.basePrice}/kg
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setStep(1)}
                className="text-xs font-mono text-khata-green hover:text-white p-2 border border-khata-green/50 rounded-none"
              >
                बदलें ✎
              </button>
            </div>

            {/* Material Category Picker */}
            <div className="bg-white rounded-none p-4 border-2 border-khata-ink shadow-brutal space-y-2.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>सामग्री की श्रेणी (Category)</span>
                <span className="text-[10px] font-normal text-slate-500">चुनें</span>
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMaterial(m)}
                    className={`p-2 rounded-none border flex flex-col items-center justify-center transition-all ${
                      selectedMaterial.id === m.id
                        ? 'bg-khata-green border-khata-green text-khata-green font-bold shadow-sm scale-105'
                        : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{m.icon}</span>
                    <span className="text-[10px] truncate max-w-full text-center leading-tight">
                      {m.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Digital Weighbridge Weight Input */}
            <div className="bg-white rounded-none p-4 border-2 border-khata-ink shadow-brutal space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center">
                  <Scale className="w-3.5 h-3.5 mr-1 text-khata-green" />
                  अनुमानित वजन (Approx Weight)
                </label>
                <span className="text-[11px] font-mono text-slate-500">किलोग्राम (KG)</span>
              </div>

              {/* Digital Scale Readout Display */}
              <div className="flex items-center bg-khata-paper border-2 border-khata-green/40 rounded-none p-3 shadow-inner">
                <input 
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-transparent text-khata-green font-mono text-4xl font-black focus:outline-none tracking-tight"
                />
                <span className="text-khata-green font-mono text-xl font-bold px-3">
                  KG
                </span>
              </div>

              {/* Quick weight chips */}
              <div className="flex space-x-2">
                {[1, 5, 10, 20].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => addWeight(delta)}
                    className="flex-1 py-1.5 bg-khata-paper hover:bg-khata-paper border-2 border-khata-ink text-slate-800 font-mono text-xs font-bold rounded-none active:scale-95 transition-all"
                  >
                    +{delta} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Chips */}
            <div className="bg-white rounded-none p-4 border-2 border-khata-ink shadow-brutal space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                कंडीशन (Condition)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Used', 'Good', 'Damaged', 'Mixed'].map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`py-2 rounded-none text-xs font-bold border transition-all ${
                      condition === cond
                        ? 'bg-khata-green text-white border-khata-green shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <button 
              onClick={handleGetEstimate}
              disabled={!weight || parseFloat(weight) <= 0}
              className="w-full bg-khata-ink text-white font-black text-lg py-4 rounded-none shadow-brutal active:translate-y-1 transition-all flex items-center justify-center space-x-2"
            >
              <span>पक्का भाव निकालें (Get Fair Valuation)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: Valuation Certificate & Recycler Match */}
        {step === 3 && (
          <div className="space-y-4">
            
            {/* Scrap Mandi Valuation Certificate Card */}
            <div className="bg-white rounded-none border-2 border-2 border-khata-ink p-5 shadow-brutal relative overflow-hidden">
              <div className="text-center pb-4 border-b border-dashed border-2 border-khata-ink space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-khata-green bg-khata-green px-2.5 py-0.5 rounded-full border border-khata-green">
                  ECOSETU MANDI VALUATION
                </span>
                <p className="text-xs text-slate-500 font-medium">पुणे अधिकृत रीसाइक्लिंग दर सूची आधारित</p>
                
                <div className="pt-2">
                  <div className="text-4xl font-black text-slate-900 font-mono tracking-tight text-khata-green">
                    ₹{(selectedMaterial.basePrice * parseFloat(weight) * 0.95).toFixed(0)} – ₹{(selectedMaterial.basePrice * parseFloat(weight) * 1.05).toFixed(0)}
                  </div>
                  <p className="text-[11px] text-khata-green font-semibold mt-1">
                    ✓ न्यूनतम गारंटी दर: ₹{selectedMaterial.basePrice}/kg
                  </p>
                </div>
              </div>

              {/* Manifest Item Details */}
              <div className="py-4 space-y-2.5 text-xs font-mono border-b border-2 border-khata-ink">
                <div className="flex justify-between">
                  <span className="text-slate-500">पहचानी गई सामग्री:</span>
                  <span className="font-bold text-slate-900">{selectedMaterial.icon} {selectedMaterial.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">दर्ज वजन:</span>
                  <span className="font-bold text-slate-900">{weight} KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">स्थिति:</span>
                  <span className="font-bold text-slate-900">{condition} Scrap</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">सरकारी रीसाइक्लर रेट:</span>
                  <span className="font-bold text-khata-green">₹{selectedMaterial.basePrice} / KG</span>
                </div>
              </div>

              <div className="pt-3 flex items-center space-x-2 text-[11px] text-slate-500">
                <Info className="w-4 h-4 text-khata-green shrink-0" />
                <span>रीसाइक्लर सीधे आपके गोदाम से पिकअप भी दे सकते हैं।</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleViewOffers}
                className="w-full bg-khata-ink text-white font-black text-lg py-4 rounded-none shadow-brutal active:translate-y-1 transition-all flex items-center justify-center space-x-2"
              >
                <span>रीसाइक्लर ऑफर देखें (View Offers)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 text-center"
              >
                ← वजन या सामग्री बदलें
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CreateLot;
