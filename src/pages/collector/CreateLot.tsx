import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  RefreshCw, 
  Flashlight, 
  Scale, 
  IndianRupee, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Truck
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
      navigate('/collector');
    }
  };

  return (
    <div className="flex flex-col h-full bg-paper-100">
      {/* Step Header */}
      <div className="bg-white px-4 py-3 border-b border-paper-300 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => step > 1 ? setStep((step - 1) as any) : navigate('/collector')}
            className="p-1.5 rounded-lg hover:bg-paper-100 text-industrial-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-industrial-950">
              {step === 1 ? '1. Material & Camera' : step === 2 ? '2. Scale & Tare Weight' : '3. Mandi Bids & Recyclers'}
            </h1>
            <p className="text-[10px] text-industrial-500 font-mono">
              Step {step} of 3 • {step === 1 ? 'AI Identification' : step === 2 ? 'Weighbridge Net' : 'Offer Finalization'}
            </p>
          </div>
        </div>

        {/* Mini Stepper Dots */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-emerald-600' : 'bg-paper-300'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-paper-300'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-emerald-600' : 'bg-paper-300'}`}></span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* STEP 1: Material Grade & Camera Ingestion */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Viewfinder Camera Simulation */}
            <div className="relative aspect-[4/3] rounded-3xl bg-industrial-950 overflow-hidden border-2 border-forest-800 shadow-tactile-md flex flex-col justify-between p-4 text-white">
              <div className="flex justify-between items-center z-10">
                <span className="bg-industrial-900/80 backdrop-blur-sm text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  CAMERA SCANNER
                </span>
                <button
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`p-2 rounded-full backdrop-blur-sm border transition-all ${
                    flashlightOn ? 'bg-amber-500 text-industrial-950 border-amber-400' : 'bg-white/10 text-white border-white/20'
                  }`}
                  title="Toggle Flashlight"
                >
                  <Flashlight className="w-4 h-4" />
                </button>
              </div>

              {/* Viewfinder Reticle Framing */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <div className="w-48 h-36 border-2 border-dashed border-emerald-400/70 rounded-2xl relative flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                  
                  {isScanning && (
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34D399] animate-scanline"></div>
                  )}

                  <div className="text-center p-2">
                    <MaterialBadge 
                      iconKey={selectedMaterial.icon} 
                      category={selectedMaterial.category} 
                      size="lg" 
                      className="mx-auto mb-1 bg-white/90"
                    />
                    <p className="text-[11px] font-mono text-emerald-200">
                      {isScanning ? 'Analyzing Scrap Density...' : 'Align scrap in frame'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="z-10 flex gap-2">
                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-3 rounded-2xl font-display font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanning ? 'AI Identifying Grade...' : 'Scan / Snap Photo'}</span>
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl font-display font-semibold text-xs border border-white/20"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Quick Material Category Chips */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-display font-bold text-xs text-industrial-900 uppercase tracking-wider">
                  Select Material Grade
                </label>
                <span className="text-[10px] text-industrial-500 font-mono">Pune Mandi Indexed</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {materials.map((m) => {
                  const isSelected = selectedMaterial.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected 
                          ? 'bg-forest-50/80 border-forest-600 ring-1 ring-forest-500 shadow-tactile' 
                          : 'bg-white border-paper-300 hover:border-paper-400'
                      }`}
                    >
                      <MaterialBadge iconKey={m.icon} category={m.category} size="md" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-industrial-900 truncate">
                          {language === 'hi' ? m.tagHindi : m.name}
                        </p>
                        <p className="text-[10px] text-industrial-500 font-mono">
                          ₹{m.basePrice}/{m.unit} • {m.grade.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-forest-800 hover:bg-forest-900 active:scale-[0.98] text-white py-3.5 rounded-2xl font-display font-bold text-sm shadow-tactile transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm Material & Proceed to Weigh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Digital Scale & Tare Weight Calculator */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Selected Material Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-paper-300 shadow-tactile flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MaterialBadge iconKey={selectedMaterial.icon} category={selectedMaterial.category} size="md" />
                <div>
                  <h3 className="font-bold text-sm text-industrial-950">{selectedMaterial.name}</h3>
                  <p className="text-[11px] text-emerald-800 font-medium">{selectedMaterial.grade}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="text-xs font-bold text-industrial-500 hover:text-industrial-900 underline"
              >
                Change
              </button>
            </div>

            {/* Smart Weighbridge Calculator Card */}
            <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span className="font-display font-bold text-sm text-industrial-950">
                    Weighbridge & Tare Calculation
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  कांटा पर्ची
                </span>
              </div>

              {/* Gross Weight Input */}
              <div>
                <label className="text-xs font-bold text-industrial-700 block mb-1">
                  Gross Weight (कुल सकल वजन)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="w-full text-2xl font-black font-mono p-3 bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 font-mono font-bold text-sm text-industrial-500">
                    KG
                  </span>
                </div>
              </div>

              {/* Tare Container Deduction */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-industrial-700">
                    Container / Bag Tare (बारदान / खाली वजन)
                  </label>
                  <span className="text-[11px] font-mono font-bold text-amber-700">
                    - {tareNum} kg
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {[
                    { label: 'None', val: 0 },
                    { label: 'Bori 0.6kg', val: 0.6 },
                    { label: 'Crate 1.2kg', val: 1.2 },
                    { label: 'Drum 2.5kg', val: 2.5 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => { setTarePreset(p.val); setCustomTare(''); }}
                      className={`py-1.5 px-2 rounded-lg font-mono font-medium border transition-all ${
                        tarePreset === p.val && customTare === ''
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-paper-50 text-industrial-600 border-paper-300 hover:bg-paper-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Net Billable Weight Display */}
              <div className="bg-forest-900 text-white rounded-xl p-3 flex items-center justify-between border border-forest-800 shadow-inner">
                <div>
                  <p className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                    NET BILLABLE WEIGHT (शुद्ध वजन)
                  </p>
                  <p className="text-xs text-forest-200">
                    {grossNum} kg Gross - {tareNum} kg Tare
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black font-mono text-white">
                    {netWeight} <span className="text-sm font-normal text-emerald-300">kg</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Condition & Source Grade */}
            <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-tactile space-y-3">
              <div>
                <label className="text-xs font-bold text-industrial-700 block mb-1.5">
                  Lot Condition Grade
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['Good', 'Used', 'Damaged', 'Mixed'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        condition === cond 
                          ? 'bg-forest-50 text-forest-900 border-forest-500 shadow-sm' 
                          : 'bg-paper-50 text-industrial-600 border-paper-300'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-industrial-700 block mb-1.5">
                  Source Channel
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Household', 'Commercial', 'Industrial', 'Mandi Collection'] as const).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSource(src)}
                      className={`py-2 px-3 rounded-xl text-left font-medium border transition-all ${
                        source === src 
                          ? 'bg-amber-50 text-amber-900 border-amber-400 font-bold shadow-sm' 
                          : 'bg-paper-50 text-industrial-600 border-paper-300'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={netWeight <= 0}
              className="w-full bg-forest-800 hover:bg-forest-900 disabled:opacity-50 active:scale-[0.98] text-white py-3.5 rounded-2xl font-display font-bold text-sm shadow-tactile transition-all flex items-center justify-center gap-2"
            >
              <span>Get Recycler Bids for {netWeight} kg</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Mandi Valuation & Direct Recycler Bidding */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Valuation Header Card */}
            <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white rounded-3xl p-5 border border-forest-800 shadow-tactile text-center space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 bg-forest-800 px-2.5 py-1 rounded-full border border-forest-700">
                PUNE MANDI MSP BENCHMARK
              </span>
              <h2 className="text-3xl font-black font-mono text-white">
                ₹{Math.round(selectedMaterial.basePrice * netWeight * 0.95)} - ₹{Math.round(selectedMaterial.basePrice * netWeight * 1.05)}
              </h2>
              <p className="text-xs text-forest-200">
                Calculated at ₹{selectedMaterial.basePrice}/kg for {netWeight} kg net {selectedMaterial.name}
              </p>
            </div>

            {/* Recycler Bids List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="font-display font-bold text-xs text-industrial-900 uppercase tracking-wider">
                  Live Offers from Licensed Recyclers
                </span>
                <span className="text-[10px] text-emerald-800 font-mono font-bold">
                  {recyclers.length} Available
                </span>
              </div>

              {recyclers.map((r, i) => {
                const offerRate = r.offers[selectedMaterial.id] || selectedMaterial.basePrice;
                const totalPayout = Math.round(offerRate * netWeight);
                const isBest = i === 0;

                return (
                  <div 
                    key={r.id} 
                    className="bg-white rounded-2xl border border-paper-300 p-4 shadow-tactile space-y-3 relative overflow-hidden"
                  >
                    {isBest && (
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold font-mono px-3 py-0.5 rounded-bl-lg">
                        HIGHEST BID
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-industrial-950">{r.name}</h4>
                          {r.authorized && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-industrial-500 font-mono mt-0.5">
                          {r.distance} km • {r.city} • CPCB Licensed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-paper-200">
                      <div>
                        <span className="text-[10px] text-industrial-500 font-mono uppercase">Offered Rate</span>
                        <p className="text-base font-black font-mono text-emerald-800">
                          ₹{offerRate}<span className="text-[10px] font-normal text-industrial-500">/kg</span>
                          <span className="ml-2 text-xs font-bold text-industrial-900">(₹{totalPayout})</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleCreateAndMatch(r.id)}
                        className="bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <span>Accept Offer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {r.pickup && (
                      <div className="flex items-center gap-1 text-[10px] text-industrial-600 bg-paper-100 px-2 py-1 rounded-lg">
                        <Truck className="w-3 h-3 text-amber-600" />
                        <span>Pickup truck dispatch available for this lot</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLot;

