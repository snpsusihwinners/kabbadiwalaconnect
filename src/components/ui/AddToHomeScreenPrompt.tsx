import React, { useState } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAddToHomeScreen } from '../../hooks/useAddToHomeScreen';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../utils/translations';

interface AddToHomeScreenPromptProps {
  /** Optional custom position style (default bottom-fixed) */
  className?: string;
}

export const AddToHomeScreenPrompt: React.FC<AddToHomeScreenPromptProps> = ({ className = '' }) => {
  const { language } = useAppContext();
  const t = translations[language] || translations.en;
  
  const { 
    canInstall, 
    isInstalled, 
    isIOS, 
    isDismissed, 
    promptToInstall, 
    dismissPrompt 
  } = useAddToHomeScreen();

  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed and not just installed, or cannot install, or user dismissed: hide banner
  if (isInstalled && !justInstalled) return null;
  if (!canInstall && !justInstalled) return null;
  if (isDismissed && !justInstalled && !showIOSModal) return null;

  const handleInstallClick = async () => {
    const result = await promptToInstall();
    if (result === 'manual-ios') {
      setShowIOSModal(true);
    } else if (result === 'accepted') {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 5000);
    }
  };

  return (
    <>
      {/* Floating Banner */}
      <aside 
        role="region"
        aria-label="App installation prompt"
        className={`fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}
      >
        <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-[0_12px_32px_rgba(0,0,0,0.4)] text-white relative overflow-hidden">
          {/* Subtle emerald top glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

          {justInstalled ? (
            <div className="flex items-center space-x-3 py-1 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 animate-bounce" />
              <div>
                <p className="text-sm font-bold text-white">{t.a2hsInstalled}</p>
                <p className="text-xs text-slate-300">You can now open ReGain directly from your home screen.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              {/* App Icon */}
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-md bg-emerald-950 border border-emerald-500/20">
                <img 
                  src="/logo.png" 
                  alt="ReGain Icon" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-sm text-white tracking-tight leading-snug">
                    {t.a2hsTitle}
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" /> PWA
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-tight mt-0.5">
                  {t.a2hsSubtitle}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
                  >
                    {isIOS ? <Smartphone className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{t.a2hsInstallBtn}</span>
                  </button>

                  <button
                    onClick={dismissPrompt}
                    className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {t.a2hsLaterBtn}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={dismissPrompt}
                aria-label="Dismiss install prompt"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* iOS Step-by-Step Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 text-white shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-white">{t.a2hsIosTitle}</h3>
                  <p className="text-[11px] text-slate-400">Apple Safari Instructions</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3.5 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <div className="flex-1">
                  <span className="text-slate-200">{t.a2hsIosStep1}</span>
                  <div className="mt-1 inline-flex items-center space-x-1 text-blue-400 font-semibold text-[11px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    <Share2 className="w-3 h-3" />
                    <span>Share Icon</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <div className="flex-1">
                  <span className="text-slate-200">{t.a2hsIosStep2}</span>
                  <div className="mt-1 inline-flex items-center space-x-1 text-slate-200 font-semibold text-[11px] bg-white/10 px-2 py-0.5 rounded border border-white/20">
                    <PlusSquare className="w-3 h-3 text-emerald-400" />
                    <span>Add to Home Screen</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div className="flex-1">
                  <span className="text-slate-200">{t.a2hsIosStep3}</span>
                  <div className="mt-1 inline-flex items-center space-x-1 text-emerald-300 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>"Add" Button</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 rounded-xl transition-colors shadow"
            >
              {t.a2hsGotIt}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Compact Install App Button for headers, profile, or settings
 */
export const InstallAppButton: React.FC<{
  variant?: 'badge' | 'button' | 'menu-item';
  className?: string;
}> = ({ variant = 'badge', className = '' }) => {
  const { language } = useAppContext();
  const t = translations[language] || translations.en;
  const { canInstall, isInstalled, isIOS, promptToInstall, resetDismissed } = useAddToHomeScreen();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleClick = async () => {
    resetDismissed();
    const res = await promptToInstall();
    if (res === 'manual-ios') {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <CheckCircle2 className="w-3 h-3" />
          <span>{t.a2hsInstalled}</span>
        </span>
      );
    }
    return null;
  }

  if (!canInstall && !isIOS) {
    // If not in a browser where prompt is ready, show a helpful fallback click
    return (
      <button
        onClick={() => alert(t.a2hsSubtitle)}
        className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors ${className}`}
        title="Add to Home Screen"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>{t.a2hsInstallBtn}</span>
      </button>
    );
  }

  if (variant === 'menu-item') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-all text-xs font-semibold ${className}`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="font-bold">{t.a2hsTitle}</div>
              <div className="text-[11px] text-emerald-700 font-normal">{t.a2hsSubtitle}</div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 ml-2" />
        </button>

        {showIOSModal && (
          <AddToHomeScreenPrompt className="hidden" />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition-all ${className}`}
        title="Add to Home Screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.a2hsInstallBtn}</span>
      </button>

      {showIOSModal && (
        <AddToHomeScreenPrompt className="hidden" />
      )}
    </>
  );
};
