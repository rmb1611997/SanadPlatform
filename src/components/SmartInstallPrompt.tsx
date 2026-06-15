import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, PlusSquare, ArrowUp, Star, Sparkles, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';

interface LoggedUser {
  name: string;
  phone: string;
  role: 'student' | 'teacher' | 'admin';
  country?: 'EG' | 'SA';
  grade?: string;
  location?: string;
  parentPhone?: string;
  isGuest?: boolean;
}

interface SmartInstallPromptProps {
  lang: 'ar' | 'en';
  loggedInUser: LoggedUser | null;
}

export default function SmartInstallPrompt({ lang, loggedInUser }: SmartInstallPromptProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only show to logged-in real users
    if (!loggedInUser || loggedInUser.isGuest) {
      setIsMobile(false);
      return;
    }

    // 1. Detect if small screen / mobile / tablet
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileDevice = mobileRegex.test(userAgent) || (window.innerWidth < 1024);

    if (!isMobileDevice) {
      setIsMobile(false);
      return;
    }

    setIsMobile(true);

    // 2. Load minimized state preference from localStorage for this user
    const minimizeKey = `sanad_install_minimized_${loggedInUser.phone}`;
    const wasMinimized = localStorage.getItem(minimizeKey) === 'true';
    setIsMinimized(wasMinimized);

    // 3. Detect iOS for specific instructions
    const iosDevice = /iPhone|iPad|iPod/i.test(userAgent);
    setIsIOS(iosDevice);

    // 4. Capture native install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [loggedInUser]);

  // If not logged-in or not on mobile device, render nothing
  if (!loggedInUser || loggedInUser.isGuest || !isMobile) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install option picked: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      // Browser fallback
      alert(
        lang === 'ar'
          ? 'لتنزيل التطبيق:\n١. اضغط على زر المتصفح (⋮)\n٢. اختر "إضافة للشاشة الرئيسية" أو "تثبيت التطبيق".'
          : 'To download the app:\n1. Tap the browser options icon (⋮)\n2. Tap "Add to Home Screen" or "Install App".'
      );
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
    localStorage.setItem(`sanad_install_minimized_${loggedInUser.phone}`, 'true');
  };

  const handleExpand = () => {
    setIsMinimized(false);
    localStorage.removeItem(`sanad_install_minimized_${loggedInUser.phone}`);
  };

  const isAr = lang === 'ar';

  return (
    <>
      <AnimatePresence mode="wait">
        {/* State 1: Active Ultra-Thin Banner beneath header */}
        {!isMinimized && !showIOSInstructions && (
          <motion.div
            key="expanded-ribbon"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="fixed top-16 left-0 right-0 z-35 bg-indigo-950/90 dark:bg-neutral-900/95 border-b border-indigo-500/30 dark:border-neutral-800/80 shadow-lg backdrop-blur-md text-white py-1.5 px-4 md:px-6"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
              
              {/* Branding and micro text details */}
              <div className="flex items-center gap-2 min-w-0">
                {/* Visual Circle Indicator */}
                <div className="relative shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
                  <Download className="h-3.5 w-3.5 text-white animate-pulse" />
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-[10.5px] xs:text-xs">
                      {isAr ? 'تطبيق سند الذكي' : 'Sanad Smart App'}
                    </span>
                    <Sparkles className="h-2.5 w-2.5 text-amber-450 fill-amber-450 shrink-0" />
                  </div>
                  <p className="text-[9px] xs:text-[10px] text-neutral-300 truncate max-w-[170px] xs:max-w-xs sm:max-w-lg">
                    {isAr ? 'أداء أفضل واستهلاك شبه منعدم للبيانات' : 'Faster navigation with minimal data use'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-[9.5px] xs:text-[10.5px] px-3 py-1 rounded-lg shadow-lg shadow-indigo-600/30 transition duration-150 cursor-pointer flex items-center gap-1 hover:brightness-110"
                >
                  <Download className="h-2.5 w-2.5" />
                  <span>{isAr ? 'تثبيت' : 'Install'}</span>
                </button>
                
                <button
                  onClick={handleMinimize}
                  className="text-neutral-400 hover:text-white transition duration-150 p-1 rounded-md hover:bg-white/10 cursor-pointer text-[10px] flex items-center gap-0.5"
                  title={isAr ? 'تصغير' : 'Minimize'}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 2: Highly Professional, Floating Minimalist Glassmorphic Pill */}
        {isMinimized && !showIOSInstructions && (
          <motion.div
            key="minimized-pill"
            initial={{ opacity: 0, scale: 0.8, x: isAr ? -40 : 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: isAr ? -40 : 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={handleExpand}
            className={`fixed top-[70px] ${
              isAr ? 'left-2.5' : 'right-2.5'
            } z-35 bg-gradient-to-r from-indigo-900/90 to-blue-900/90 dark:from-neutral-900/95 dark:to-neutral-850/95 border border-indigo-500/30 dark:border-neutral-850 shadow-xl backdrop-blur-md text-white py-1 px-2.5 rounded-full cursor-pointer flex items-center gap-1.5 active:scale-95 hover:brightness-110 select-none`}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Live pulsing glowing dot */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            
            <Smartphone className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            
            <span className="text-[9.5px] xs:text-[10px] font-black tracking-tight text-neutral-100">
              {isAr ? 'تثبيت المنصة' : 'Install App'}
            </span>
            
            <ChevronDown className="h-3 w-3 text-indigo-400/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium iOS Installation Guide Overlay */}
      <AnimatePresence>
        {showIOSInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSInstructions(false)}
              className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md"
            />

            {/* Modal sheet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`relative w-full max-w-sm rounded-3xl bg-neutral-900/95 border border-neutral-800 text-white p-6 shadow-2xl z-10 overflow-hidden ${
                isAr ? 'text-right font-sans' : 'text-left font-sans'
              }`}
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Close standard */}
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition duration-200 cursor-pointer p-1.5 hover:bg-neutral-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-5 pt-2">
                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center h-14 w-14 bg-neutral-850 rounded-2xl border border-neutral-750">
                    <Share className="h-6 w-6 text-indigo-400 animate-pulse" />
                  </div>
                </div>

                <div className="text-center space-y-1.5">
                  <h3 className="text-lg font-bold tracking-tight">
                    {isAr ? 'التثبيت على نظام iOS' : 'Install on iOS / Safari'}
                  </h3>
                  <p className="text-xs text-neutral-450 leading-relaxed font-semibold">
                    {isAr
                      ? 'خطوات بسيطة لإضافة تطبيق سند لشاشتك الرئيسية باستخدام متصفح سفاري:'
                      : 'Follow these quick steps to add Sanad to your Home Screen utilizing Safari:'}
                  </p>
                </div>

                {/* Step indicators */}
                <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-4 space-y-3.5 text-xs font-semibold leading-relaxed text-neutral-200">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black">
                      ١
                    </div>
                    <div>
                      {isAr ? (
                        <span>
                          اضغط على زر المشاركة <Share className="inline-block mx-1 h-3.5 w-3.5 text-indigo-400" /> في شريط متصفح سفاري بالأسفل.
                        </span>
                      ) : (
                        <span>
                          Tap the Share button <Share className="inline-block mx-1 h-3.5 w-3.5 text-indigo-400" /> in the Safari toolbar.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black">
                      ٢
                    </div>
                    <div>
                      {isAr ? (
                        <span>
                          قم بالتمرير للأسفل واختر <span className="font-bold text-white">"إضافة إلى الشاشة الرئيسية"</span> (<PlusSquare className="inline-block mx-1 h-3.5 w-3.5 text-white" />).
                        </span>
                      ) : (
                        <span>
                          Scroll down and tap <span className="font-bold text-white">"Add to Home Screen"</span> (<PlusSquare className="inline-block mx-1 h-3.5 w-3.5 text-white" />).
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black">
                      ٣
                    </div>
                    <div>
                      {isAr ? (
                        <span>ثم اضغط على كلمة <span className="font-bold text-indigo-400">"إضافة"</span> في أعلى الزاوية.</span>
                      ) : (
                        <span>Then tap <span className="font-bold text-indigo-400">"Add"</span> in the top-right corner.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-[11px] rounded-xl transition duration-155 cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  {isAr ? 'فهمت، شكرًا لك' : 'I Understood, Thanks'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
