import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';

const Handover: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lots, recyclers, materials, updateLot, addTransaction } = useAppContext();
  
  const lot = lots.find(l => l.id === id);
  const recycler = recyclers.find(r => r.id === lot?.recyclerId);
  const material = materials.find(m => m.id === lot?.materialId);

  const [step, setStep] = useState<'qr' | 'success'>('qr');

  if (!lot || !recycler || !material) {
    return <div className="p-8 text-center text-gray-500">Lot not found</div>;
  }

  const handleConfirmHandover = () => {
    updateLot(lot.id, { status: 'Handover Completed' });
    addTransaction({
      id: `t${Math.floor(Math.random() * 1000)}`,
      lotId: lot.id,
      materialId: material.id,
      weight: lot.weight,
      amount: lot.finalPrice || 0,
      date: new Date().toISOString(),
      status: 'Paid',
      method: 'Cash'
    });
    setStep('success');
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 font-bold text-xl">←</button>
        <h1 className="text-xl font-bold text-gray-900">{step === 'qr' ? 'Handover' : 'Receipt'}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 'qr' ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Show to Recycler</h2>
              <p className="text-gray-500">They will scan this to confirm.</p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 flex items-center justify-center">
              <QRCodeSVG value={JSON.stringify({ lotId: lot.id, recyclerId: recycler.id })} size={200} />
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Lot ID</span>
                <span className="font-bold text-gray-900">{lot.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Material</span>
                <span className="font-bold text-gray-900">{material.name} - {lot.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Final Price</span>
                <span className="font-bold text-gray-900 text-lg text-green-600">₹{lot.finalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Recycler</span>
                <span className="font-bold text-gray-900">{recycler.name}</span>
              </div>
              <div className="flex items-center text-sm text-blue-600 font-medium">
                <MapPin className="w-4 h-4 mr-1" /> GPS location captured ✓
              </div>
            </div>

            <button 
              onClick={handleConfirmHandover}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Simulate Recycler Scan
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-green-100 p-6 rounded-full mt-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900">Handover Complete</h2>
              <p className="text-gray-500 mt-2">Payment received successfully.</p>
            </div>

            <div className="w-full bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 space-y-4">
              <div className="text-center border-b border-gray-100 pb-4 mb-4">
                <h3 className="font-black text-gray-400 tracking-widest text-sm">DIGITAL RECEIPT</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-black text-xl text-gray-900">₹{lot.finalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-bold text-gray-900">💵 Cash</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lot ID</span>
                  <span className="font-medium text-gray-900">{lot.id.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex space-x-3">
              <button onClick={() => navigate('/collector')} className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl active:scale-95 transition-transform">
                Go Home
              </button>
              <button className="flex-[0.5] bg-green-50 text-green-700 font-bold py-4 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Handover;
