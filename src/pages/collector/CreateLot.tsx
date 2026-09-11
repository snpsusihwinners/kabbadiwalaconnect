import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  ShieldCheck,
  ChevronLeft,
  Info,
  Zap,
  CircleDot
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import type { Material } from '../../data/mockData';

type ScanPhase = 'idle' | 'capturing' | 'detecting' | 'analyzing' | 'identified';

const CreateLot: React.FC = () => {
  const navigate = useNavigate();
  const { materials, addLot, isOnline, addToSyncQueue, language } = useAppContext();
  const t = translations[language] || translations.en;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  const [step, setStep] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{x: number; y: number; w: number; h: number; label: string; confidence: number}>>([]);
  const [scanLineY, setScanLineY] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(
    materials.find(m => m.id === 'm3') || materials[0]
  );
  const [weight, setWeight] = useState<string>('8.2');
  const [condition, setCondition] = useState('Used');
  const [source] = useState('Shop Scrap');

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access denied:', err);
      setCameraError(err.name === 'NotAllowedError' 
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : err.name === 'NotFoundError'
        ? 'No camera found on this device.'
        : 'Unable to access camera. Using demo mode.');
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (step === 1) {
      startCamera();
    }
    return () => stopCamera();
  }, [step, startCamera, stopCamera]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  const runScanAnimation = useCallback(() => {
    setScanPhase('capturing');
    setScanProgress(0);
    setDetectionBoxes([]);

    // Phase 1: Capture flash
    setTimeout(() => {
      setScanPhase('detecting');
    }, 400);

    // Phase 2: Scanning line sweeps
    let frame = 0;
    const totalFrames = 90; // ~1.5s at 60fps

    const animate = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      setScanProgress(progress);

      // Scanning line bounces up and down
      const lineY = Math.abs(Math.sin(frame * 0.06)) * 100;
      setScanLineY(lineY);

      // Show detection boxes at different progress thresholds
      if (progress > 0.2 && detectionBoxes.length === 0) {
        setDetectionBoxes([{
          x: 15 + Math.random() * 10,
          y: 20 + Math.random() * 10,
          w: 50 + Math.random() * 20,
          h: 40 + Math.random() * 15,
          label: 'PCB Board',
          confidence: 0
        }]);
      }

      if (progress > 0.5 && detectionBoxes.length === 1) {
        setDetectionBoxes(prev => [{
          ...prev[0],
          confidence: Math.round(progress * 95),
          label: 'Printed Circuit Board'
        }]);
      }

      if (progress > 0.75) {
        setScanPhase('analyzing');
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Scan complete
        setDetectionBoxes(prev => prev.length > 0 ? [{
          ...prev[0],
          confidence: 95
        }] : prev);
        setScanPhase('identified');
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [detectionBoxes.length]);

  const handleTakePhoto = useCallback(() => {
    const imageData = captureFrame();
    setCapturedImage(imageData);
    stopCamera();
    runScanAnimation();
  }, [captureFrame, stopCamera, runScanAnimation]);

  const handleDemoPhoto = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    runScanAnimation();
  }, [stopCamera, runScanAnimation]);

  const handleProceedToStep2 = useCallback(() => {
    setSelectedMaterial(materials.find(m => m.id === 'm3') || materials[0]);
    setStep(2);
  }, [materials]);

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
      alert(language === 'mr' 
        ? 'लॉट ऑफलाईन सेव्ह झाला! इंटरनेट आल्यावर आपोआप सिंक होईल.'
        : language === 'hi'
        ? 'लॉट ऑफ़लाइन सेव हो गया! इंटरनेट मिलने पर अपने आप सिंक होगा।'
        : 'Lot saved offline! Will automatically sync when reconnected.');
      navigate('/collector');
    }
  };

  const addWeight = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const updated = Math.max(0.1, Math.round((current + delta) * 10) / 10);
    setWeight(updated.toString());
  };

  const getMaterialName = (m: Material) => {
    return (t.materials as Record<string, string>)[m.id] || m.name;
  };

  const isScanning = scanPhase !== 'idle' && scanPhase !== 'identified';

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={() => {
              if (scanPhase === 'identified') {
                setScanPhase('idle');
                setCapturedImage(null);
                setDetectionBoxes([]);
                setScanProgress(0);
                startCamera();
              } else if (step > 1) {
                setStep(step - 1);
                if (step === 2) {
                  setScanPhase('idle');
                  setCapturedImage(null);
                  setDetectionBoxes([]);
                  setScanProgress(0);
                  startCamera();
                }
              } else {
                stopCamera();
                navigate('/collector');
              }
            }}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              {step === 1 ? t.step1Title : 
               step === 2 ? t.step2Title : 
               t.step3Title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {t.createLotHeaderSub}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {t.smartValuationBadge}
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
                {t.capturePhotoTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.capturePhotoSubtitle}
              </p>
            </div>

            {/* Camera Viewfinder */}
            <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
              {/* Live Camera Feed */}
              {!capturedImage && !isScanning && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Camera viewfinder overlay */}
                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Corner brackets */}
                      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                      {/* Center crosshair */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <CircleDot className="w-8 h-8 text-emerald-400/50" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Captured image (shown during scanning) */}
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* AI Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 z-20">
                  {/* Dimming overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${
                    scanPhase === 'detecting' || scanPhase === 'analyzing' ? 'bg-black/30' : 'bg-black/50'
                  }`} />

                  {/* Scanning line */}
                  {(scanPhase === 'detecting' || scanPhase === 'analyzing') && (
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]"
                      style={{ top: `${scanLineY}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_4px_rgba(52,211,153,0.5)]" />
                    </div>
                  )}

                  {/* Detection boxes */}
                  {detectionBoxes.map((box, i) => (
                    <div
                      key={i}
                      className={`absolute border-2 rounded-lg transition-all duration-500 ${
                        scanPhase === 'identified' 
                          ? 'border-emerald-400 shadow-[0_0_16px_4px_rgba(52,211,153,0.4)]' 
                          : 'border-emerald-400/70'
                      }`}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`
                      }}
                    >
                      {/* Corner dots */}
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />

                      {/* Label */}
                      {scanPhase !== 'capturing' && (
                        <div className="absolute -bottom-7 left-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                          {box.label} {box.confidence > 0 && `• ${box.confidence}%`}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Center status display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-5 py-3 flex flex-col items-center space-y-2">
                      {scanPhase === 'capturing' && (
                        <>
                          <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-bold text-white tracking-wide">CAPTURING</span>
                        </>
                      )}
                      {scanPhase === 'detecting' && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400 tracking-widest">SCANNING</span>
                          </div>
                          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-400 rounded-full transition-all duration-100"
                              style={{ width: `${scanProgress * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/70">{Math.round(scanProgress * 100)}%</span>
                        </>
                      )}
                      {scanPhase === 'analyzing' && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span className="text-xs font-bold text-amber-400 tracking-widest">ANALYZING</span>
                          </div>
                          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full transition-all duration-100"
                              style={{ width: `${scanProgress * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/70">AI Classification in progress...</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Floating particles during scan */}
                  {(scanPhase === 'detecting' || scanPhase === 'analyzing') && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full animate-ping"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: `${0.8 + Math.random() * 0.5}s`
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Identification complete overlay */}
              {scanPhase === 'identified' && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="bg-emerald-600/90 backdrop-blur-sm rounded-2xl px-6 py-4 flex flex-col items-center space-y-2 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                    <span className="text-sm font-bold text-white">AI Identified</span>
                    <span className="text-xs text-emerald-100">95% Match • PCB Board</span>
                    <button
                      onClick={handleProceedToStep2}
                      className="mt-2 bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Camera error / fallback */}
              {!cameraActive && !isScanning && !capturedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {cameraError ? 'Demo Mode' : t.cameraReady}
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-[220px]">
                    {cameraError || t.cameraHint}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {scanPhase === 'idle' && (
                <>
                  <button 
                    onClick={handleTakePhoto}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                  >
                    <Camera className="w-5 h-5" />
                    <span>{t.takePhotoBtn}</span>
                  </button>

                  <button 
                    onClick={handleDemoPhoto}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.samplePhotoBtn}</span>
                  </button>
                </>
              )}

              {isScanning && (
                <div className="flex items-center justify-center space-x-2 py-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-slate-500">
                    {scanPhase === 'capturing' ? 'Capturing frame...' :
                     scanPhase === 'detecting' ? 'Scanning material...' :
                     'AI analyzing composition...'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.goodLightingTip}</span>
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
                  {t.aiIdentifiedBadge}
                </span>
                <h3 className="text-lg font-bold leading-tight mt-0.5">{getMaterialName(selectedMaterial)}</h3>
                <p className="text-xs text-emerald-100">
                  {t.mandiRateLabel} ₹{selectedMaterial.basePrice}/kg
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setStep(1);
                setScanPhase('idle');
                setCapturedImage(null);
                setDetectionBoxes([]);
                setScanProgress(0);
                startCamera();
              }}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {t.changeBtn}
            </button>
          </div>

          {/* Material Category Picker */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>{t.selectScrapCategory}</span>
              <span className="text-[11px] font-normal text-slate-400">{t.scrapTypesCount}</span>
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
                    {getMaterialName(m)}
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
                <span>{t.approxWeightLabel}</span>
              </label>
              <span className="text-xs font-semibold text-emerald-700">{t.kilogramsUnit}</span>
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
              {t.conditionLabel}
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
            <span>{t.calculateValuationBtn}</span>
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
                {t.mandiValuationHeader}
              </span>
              <p className="text-xs text-slate-500">{t.mandiValuationSub}</p>
              
              <div className="pt-2">
                <div className="text-3xl font-black text-emerald-700">
                  ₹{Math.round(selectedMaterial.basePrice * parseFloat(weight) * 0.95).toLocaleString()} – ₹{Math.round(selectedMaterial.basePrice * parseFloat(weight) * 1.05).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t.guaranteedFloorRate} ₹{selectedMaterial.basePrice}/kg
                </p>
              </div>
            </div>

            {/* Manifest Summary */}
            <div className="py-2 space-y-2 text-xs border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.materialSummaryLabel}</span>
                <span className="font-bold text-slate-900">{selectedMaterial.icon} {getMaterialName(selectedMaterial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.recordedWeightLabel}</span>
                <span className="font-bold text-slate-900">{weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.conditionSummaryLabel}</span>
                <span className="font-bold text-slate-900">{condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.authorizedRateLabel}</span>
                <span className="font-bold text-emerald-700">₹{selectedMaterial.basePrice} / KG</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.pickupNotice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button 
              onClick={handleViewOffers}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>{t.viewBuyersBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
            >
              {t.editWeightCategoryBtn}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default CreateLot;
