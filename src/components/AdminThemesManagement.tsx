import React, { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Sparkles } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
  showToastSuccess: (msg: string) => void;
}

export default function AdminThemesManagement({ lang, showToastSuccess }: Props) {
  const isAr = lang === 'ar';
  
  // States
  const [ramadanTheme, setRamadanTheme] = useState(false);
  const [greetingText, setGreetingText] = useState('رمضان كريم ومبارك، تقبل الله صالح الأعمال 🌙');

  useEffect(() => {
    const isEnabled = localStorage.getItem('sanad_ramadan_theme') === 'true';
    setRamadanTheme(isEnabled);
    const savedGreeting = localStorage.getItem('sanad_ramadan_greeting');
    if (savedGreeting) setGreetingText(savedGreeting);
  }, []);

  const handleToggleRamadan = () => {
    const newValue = !ramadanTheme;
    setRamadanTheme(newValue);
    localStorage.setItem('sanad_ramadan_theme', newValue.toString());
    
    // Dispatch event to update App immediately
    window.dispatchEvent(new Event('ramadan_theme_toggle'));
    
    if (newValue) {
      showToastSuccess(isAr ? 'تم تفعيل ثيم رمضان بنجاح 🎉' : 'Ramadan Theme enabled 🎉');
    } else {
      showToastSuccess(isAr ? 'تم إيقاف ثيم رمضان' : 'Ramadan Theme disabled');
    }
  };

  const handleSaveGreeting = () => {
    localStorage.setItem('sanad_ramadan_greeting', greetingText);
    window.dispatchEvent(new Event('ramadan_theme_toggle'));
    showToastSuccess(isAr ? 'تم حفظ نص التهنئة بنجاح' : 'Greeting saved successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-4xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Palette className="w-7 h-7" />
              </span>
              {isAr ? 'إدارة الثيمات والمناسبات' : 'Theme & Events Management'}
            </h2>
            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 pr-2">
              {isAr ? 'التحكم في المظهر العام والمؤثرات البصرية الموسمية للمنصة.' : 'Manage platform appearance and seasonal visual effects.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Ramadan Theme Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all relative overflow-hidden ${
          ramadanTheme 
            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-500/50 shadow-lg shadow-amber-500/10' 
            : 'bg-white dark:bg-neutral-850 border-neutral-150 dark:border-neutral-750'
        }`}>
          
          {ramadanTheme && (
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className={`p-3 sm:p-4 rounded-2xl flex items-center justify-center ${ramadanTheme ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}>
                <Moon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  {isAr ? 'ثيم شهر رمضان المبارك' : 'Ramadan Blessed Theme'}
                  {ramadanTheme && <span className="flex w-3 h-3 rounded-full bg-amber-500 animate-pulse" />}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-450 leading-relaxed max-w-xl">
                  {isAr 
                    ? 'عند تفعيل هذا الثيم ستظهر مؤثرات رمضانية راقية (هلال، فوانيس، نجوم) في المنصة مع الحفاظ التام على ألوان المنصة الأساسية وسرعتها الفائقة.' 
                    : 'When enabled, elegant Ramadan effects (crescent, lanterns) will appear while preserving the platform colors and speed.'}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    ✨ {isAr ? 'أنيميشن احترافي هادئ' : 'Professional calm animation'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    ⚡ {isAr ? 'لا يؤثر على الأداء' : 'No performance impact'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    📱 {isAr ? 'متوافق مع الهواتف' : 'Mobile friendly'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleRamadan}
              className={`shrink-0 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-black transition-all flex items-center justify-center gap-3 outline-none ${
                ramadanTheme
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {ramadanTheme ? (isAr ? 'إيقاف الثيم' : 'Disable Theme') : (isAr ? 'تفعيل ثيم رمضان' : 'Enable Ramadan Theme')}
              {ramadanTheme ? null : <Sparkles className="w-5 h-5" />}
            </button>
          </div>

          {/* Conditional Greeting Settings */}
          {ramadanTheme && (
            <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800/30 relative z-10 animate-fade-in space-y-4">
              <label className="block text-sm font-bold text-amber-900 dark:text-amber-100">
                {isAr ? 'نص التهنئة الرمضانية (يظهر أعلى المنصة)' : 'Ramadan Greeting Text (Header Bar)'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-white dark:bg-amber-950/20 text-neutral-900 dark:text-white font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={handleSaveGreeting}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
                >
                  {isAr ? 'حفظ النص' : 'Save Text'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
