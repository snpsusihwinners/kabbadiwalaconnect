import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowRight, CheckCircle, RefreshCcw, Image as ImageIcon, IndianRupee } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Material } from '../../data/mockData';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const { materials, addLot, isOnline, addToSyncQueue } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [condition, setCondition] = useState('Used');

  const handleTakePhoto = () => {
    setPhotoTaken(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      // Mock AI Result
      setSelectedMaterial(materials.find(m => m.id === 'm3') || materials[0]);
      setStep(2);
    }, 2000);
  };

  const handleGetEstimate = () => {
    if (!selectedMaterial || !weight) return;
    setStep(3);
  };

  const handleViewOffers = () => {
    if (!selectedMaterial || !weight) return;
    
    const estValue = selectedMaterial.basePrice * parseFloat(weight);
    const newLot = {
      id: `l${Math.floor(Math.random() * 1000)}`,
      materialId: selectedMaterial.id,
      weight: parseFloat(weight),
      condition,
      source: 'Collection',
      estimatedValueRange: [estValue * 0.9, estValue * 1.1] as [number, number],
      status: 'Created' as const,
      createdAt: new Date().toISOString(),
      collectorId: 'COL-1028'
    };

    if (isOnline) {
      addLot(newLot);
      navigate('/collector/recyclers', { state: { lotId: newLot.id } });
    } else {
      addToSyncQueue({ type: 'ADD_LOT', payload: newLot });
      // In offline mode, just go back home or show saved message
      alert('Lot saved offline. It will be synced when you have internet.');
      navigate('/collector');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/collector')} className="mr-4 text-gray-500 font-bold text-xl">
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-900">Create New Lot</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 && (
          <div className="space-y-6 flex flex-col items-center justify-center h-full mt-10">
            {!photoTaken ? (
              <>
                <div className="w-full max-w-sm aspect-[4/3] bg-gray-200 rounded-3xl flex items-center justify-center border-4 border-dashed border-gray-300">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
                <button 
                  onClick={handleTakePhoto}
                  className="w-full max-w-sm bg-green-600 text-white rounded-full py-4 text-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-200 active:scale-95 transition-transform"
                >
                  <Camera className="w-6 h-6" />
                  <span>Take Photo</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-gray-700">AI Analyzing Image...</h2>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedMaterial && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-green-700 font-bold mb-1">AI Detected</p>
              <div className="text-4xl mb-2">{selectedMaterial.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedMaterial.name}</h2>
              <p className="text-green-600 font-medium mt-1">Confidence: 92%</p>
              
              <div className="flex justify-center space-x-4 mt-4">
                <button className="flex items-center space-x-1 px-4 py-2 bg-white rounded-full text-sm font-medium border border-gray-200 shadow-sm">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Change</span>
                </button>
                <button className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Approximate Weight</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full text-3xl font-bold p-4 bg-white border border-gray-200 rounded-l-2xl focus:outline-none focus:border-green-500"
                />
                <div className="bg-gray-100 p-4 border border-l-0 border-gray-200 rounded-r-2xl">
                  <span className="text-xl font-bold text-gray-500">KG</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {['Good', 'Used', 'Damaged', 'Mixed'].map(cond => (
                  <button 
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`py-3 rounded-xl font-medium border-2 transition-colors ${condition === cond ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600'}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGetEstimate}
              disabled={!weight}
              className={`w-full py-4 rounded-2xl text-lg font-bold text-white transition-colors ${weight ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-gray-300'}`}
            >
              Get Estimated Value
            </button>
          </div>
        )}

        {step === 3 && selectedMaterial && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mt-4">
            <div className="text-center space-y-2">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-2">
                <IndianRupee className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-gray-500 font-medium">Estimated Local Value</h2>
              <div className="text-4xl font-black text-gray-900">
                ₹{(selectedMaterial.basePrice * parseFloat(weight) * 0.9).toFixed(0)} - ₹{(selectedMaterial.basePrice * parseFloat(weight) * 1.1).toFixed(0)}
              </div>
              <p className="text-sm text-gray-400">Based on current local buying prices.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">Material</span>
                <span className="font-bold text-gray-900">{selectedMaterial.name} {selectedMaterial.icon}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500">Weight</span>
                <span className="font-bold text-gray-900">{weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg. Rate</span>
                <span className="font-bold text-gray-900">₹{selectedMaterial.basePrice}/kg</span>
              </div>
            </div>

            <button 
              onClick={handleViewOffers}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 text-xl font-bold flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform mt-8"
            >
              <span>View Recycler Offers</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLot;
