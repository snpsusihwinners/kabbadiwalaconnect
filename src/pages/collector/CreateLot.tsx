import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCcw, 
  Sparkles, 
  Scale, 
  ShieldCheck,
  ChevronLeft,
  Info
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Material } from '../../data/mockData';
import { MaterialBadge } from '../../components/ui/MaterialBadge';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const { materials, recyclers, addLot, isOnline, addToSyncQueue, language } = useAppContext();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[0]);
  
  // Scale weights
  const [grossWeight, setGrossWeight] = useState<string>('12.5');
  const [tarePreset, setTarePreset] = useState<number>(0.6); // 0.6 kg gunny bag
  const [customTare, setCustomTare] = useState<string>('');
  const [condition, setCondition] = useState<'Good' | 'Used' | 'Damaged' | 'Mixed'>('Good');
  const [source, setSource] = useState<'Household' | 'Commercial' | 'Industrial' | 'Mandi Collection'>('Commercial');

  // Compute weights
  const grossNum = parseFloat(grossWeight) || 0;
  const tareNum = customTare !== '' ? parseFloat(customTare) || 0 : tarePreset;
  const netWeight = Math.max(0, parseFloat((grossNum - tareNum).toFixed(2)));

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSelectedMaterial(materials[1]); // e.g. Copper
      setStep(2);
    }, 1400);
  };

  const handleCreateAndMatch = (chosenRecyclerId?: string) => {
    if (!selectedMaterial || netWeight <= 0) return;
    
    const recycler = recyclers.find(r => r.id === chosenRecyclerId) || recyclers[0];
    const offeredRate = recycler.offers[selectedMaterial.id] || selectedMaterial.basePrice;
    const finalAmount = Math.round(offeredRate * netWeight);
    const estMin = Math.round(selectedMaterial.basePrice * netWeight * 0.95);
    const estMax = Math.round(selectedMaterial.basePrice * netWeight * 1.05);

    const newLot = {
      id: `l${Math.floor(100 + Math.random() * 900)}`,
      manifestNo: `FORM-6/MH/2026/${Math.floor(8000 + Math.random() * 1000)}`,
      materialId: selectedMaterial.id,
      grossWeight: grossNum,
      tareWeight: tareNum,
      weight: netWeight,
      condition,
      source,
      estimatedValueRange: [estMin, estMax] as [number, number],
      status: 'Offer Accepted' as const,
      createdAt: new Date().toISOString(),
      collectorId: 'COL-1028',
      collectorName: 'Raju Scrap Co.',
      recyclerId: recycler.id,
      finalPrice: finalAmount,
      ratePerKg: offeredRate,
      gpsLocation: '18.5204° N, 73.8567° E (Pune Central)',
    };

    if (isOnline) {
      addLot(newLot);
      navigate(`/collector/handover/${newLot.id}`);
    } else {
      addToSyncQueue({ type: 'ADD_LOT', payload: newLot });
      alert('लॉट ऑफलाईन सेव्ह झाला! इंटरनेट आल्यावर आपोआप सिंक होईल.');
      navigate('/collector');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8">
      
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/collector')}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              {step === 1 ? 'फोटो स्कॅन • पायरी १/३' : 
               step === 2 ? 'वजन व श्रेणी • पायरी २/३' : 
               'मूल्यांकन पावती • पायरी ३/३'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Create New Scrap Lot
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Smart Valuation
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex space-x-1.5">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
      </div>

      {/* STEP 1: Camera Scanner */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                ई-कचऱ्याचा फोटो घ्या (Capture Photo)
              </h3>
              <p className="text-xs text-slate-500">
                कॅमेरा PCB, बॅटरी किंवा तांबे आपोआप ओळखेल
              </p>
            </div>

            {/* Camera Viewfinder */}
            <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
              {analyzing ? (
                <div className="flex flex-col items-center space-y-3 z-10 text-white">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold tracking-wider text-emerald-300">
                    माल तपासणी सुरू आहे (Analyzing)...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6 space-y-2 z-10 text-white">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    कॅमेरा तयार आहे
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-[220px]">
                    स्क्रीनच्या मध्यभागी ई-कचरा ठेवा
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={handleTakePhoto}
                disabled={analyzing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
              >
                <Camera className="w-5 h-5" />
                <span>{analyzing ? 'तपासणी सुरू...' : 'फोटो घ्या (Take Photo)'}</span>
              </button>

              <button 
                onClick={handleTakePhoto}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>डेमो फोटो वापरा (Sample PCB Board)</span>
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>चांगल्या प्रकाशात फोटो घेतल्यास अचूक भाव ठरवणे सोपे जाते.</span>
          </div>
        </div>
      )}

      {/* STEP 2: Category & Weight */}
      {step === 2 && (
        <div className="space-y-4">
          
          {/* Recognized Banner */}
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl bg-white/20 p-2 rounded-xl">
                {selectedMaterial.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  AI ओळखले • 95% Match
                </span>
                <h3 className="text-lg font-bold leading-tight mt-0.5">{selectedMaterial.name}</h3>
                <p className="text-xs text-emerald-100">
                  मंडी दर: ₹{selectedMaterial.basePrice}/kg
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setStep(1)}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg transition-colors"
            >
              बदला
            </button>
          </div>

          {/* Material Category Picker */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>सामग्री निवडा (Scrap Type)</span>
              <span className="text-[11px] font-normal text-slate-400">८ प्रकार</span>
            </label>
            
            <div className="grid grid-cols-4 gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedMaterial.id === m.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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

          {/* Digital Weight Input */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center">
                <Scale className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>अंदाजे वजन (Weight in KG)</span>
              </label>
              <span className="text-xs font-semibold text-emerald-700">किलो (KG)</span>
            </div>

            {/* Readout Display */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
              <input 
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-transparent text-slate-900 text-3xl font-black focus:outline-none tracking-tight"
              />
              <span className="text-slate-500 font-bold text-lg px-2">
                KG
              </span>
            </div>

            {/* Quick Weight Chips */}
            <div className="flex space-x-2">
              {[1, 5, 10, 20].map((delta) => (
                <button
                  key={delta}
                  onClick={() => addWeight(delta)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all"
                >
                  +{delta} kg
                </button>
              ))}
            </div>
          </div>

          {/* Condition Selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              स्थिती (Condition)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Used', 'Good', 'Damaged', 'Mixed'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    condition === cond
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>खरा भाव काढा (Get Valuation)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 3: Valuation Certificate */}
      {step === 3 && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="text-center pb-4 border-b border-dashed border-slate-200 space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ECOSETU MANDI VALUATION
              </span>
              <p className="text-xs text-slate-500">पुणे अधिकृत दरसूचीनुसार अंदाजित किंमत</p>
              
              <div className="pt-2">
                <div className="text-3xl font-black text-emerald-700">
                  ₹{Math.round(selectedMaterial.basePrice * parseFloat(weight) * 0.95).toLocaleString()} – ₹{Math.round(selectedMaterial.basePrice * parseFloat(weight) * 1.05).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  किमान हमी भाव: ₹{selectedMaterial.basePrice}/kg
                </p>
              </div>
            </div>

            {/* Manifest Summary */}
            <div className="py-2 space-y-2 text-xs border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">सामग्री:</span>
                <span className="font-bold text-slate-900">{selectedMaterial.icon} {selectedMaterial.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">वजन:</span>
                <span className="font-bold text-slate-900">{weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">स्थिती:</span>
                <span className="font-bold text-slate-900">{condition} Scrap</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">सरकारी हमी दर:</span>
                <span className="font-bold text-emerald-700">₹{selectedMaterial.basePrice} / KG</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>खरेदीदार थेट आपल्या दुकानातून पिकअप देऊ शकतात.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button 
              onClick={handleViewOffers}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>खरेदीदार शोधा (View Buyers)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
            >
              ← वजन किंवा श्रेणी बदला
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default CreateLot;

