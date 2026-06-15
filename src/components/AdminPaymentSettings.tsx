import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, Banknote, ShieldAlert, Save, Plus, Trash2, 
  Settings, Globe, GraduationCap, RefreshCw, CheckCircle, Info
} from 'lucide-react';

export interface PaymentSettingsData {
  walletEnabled: boolean;
  directEnabled: boolean;
  fawryEnabled: boolean;
  visibility: {
    EG: { wallet: boolean; direct: boolean; fawry: boolean };
    SA: { wallet: boolean; direct: boolean; fawry: boolean };
  };
  quickTopupsEG: number[];
  quickTopupsSA: number[];
}

export const defaultPaymentSettings: PaymentSettingsData = {
  walletEnabled: true,
  directEnabled: true,
  fawryEnabled: true,
  visibility: {
    EG: { wallet: true, direct: true, fawry: true },
    SA: { wallet: true, direct: true, fawry: false } // No Fawry in Saudi
  },
  quickTopupsEG: [100, 200, 500, 1000],
  quickTopupsSA: [50, 100, 200, 500]
};

export const getPaymentSettings = (): PaymentSettingsData => {
  try {
    const raw = localStorage.getItem('sanad_payment_settings_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultPaymentSettings;
};

export const setPaymentSettings = (data: PaymentSettingsData) => {
  localStorage.setItem('sanad_payment_settings_v1', JSON.stringify(data));
};

interface AdminPaymentSettingsProps {
  lang: 'ar' | 'en';
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
}

export default function AdminPaymentSettings({ lang, showToastSuccess, showToastError }: AdminPaymentSettingsProps) {
  const isAr = lang === 'ar';
  const [data, setData] = useState<PaymentSettingsData>(defaultPaymentSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [newAmountEG, setNewAmountEG] = useState('');
  const [newAmountSA, setNewAmountSA] = useState('');

  useEffect(() => {
    setData(getPaymentSettings());
  }, []);

  const handleToggle = (field: 'walletEnabled' | 'directEnabled' | 'fawryEnabled') => {
    setData(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      // Extra validation warning logic if both critical systems are disabled
      return updated;
    });
    setIsDirty(true);
  };

  const handleVisibilityToggle = (country: 'EG' | 'SA', method: 'wallet' | 'direct' | 'fawry') => {
    setData(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [country]: {
          ...prev.visibility[country],
          [method]: !prev.visibility[country][method]
        }
      }
    }));
    setIsDirty(true);
  };

  const handleAddAmount = (country: 'EG' | 'SA') => {
    const amountVal = country === 'EG' ? newAmountEG : newAmountSA;
    const amount = parseInt(amountVal);
    if (isNaN(amount) || amount <= 0) {
      showToastError?.(isAr ? '⚠️ الرجاء إدخال مبلغ شحن صحيح أكبر من صفر.' : '⚠️ Please enter a valid recharge amount greater than zero.');
      return;
    }

    setData(prev => {
      const arrField = country === 'EG' ? 'quickTopupsEG' : 'quickTopupsSA';
      if (prev[arrField].includes(amount)) {
        showToastError?.(isAr ? '⚠️ هذا المبلغ موجود بالفعل مسبقاً.' : '⚠️ This amount is already exist.');
        return prev;
      }
      const updatedArr = [...prev[arrField], amount].sort((a, b) => a - b);
      return {
        ...prev,
        [arrField]: updatedArr
      };
    });

    if (country === 'EG') setNewAmountEG('');
    else setNewAmountSA('');
    setIsDirty(true);
    showToastSuccess?.(isAr ? '✅ تمت إضافة القيمة السريعة الجديدة.' : '✅ New quick amount value added.');
  };

  const handleRemoveAmount = (country: 'EG' | 'SA', amount: number) => {
    setData(prev => {
      const arrField = country === 'EG' ? 'quickTopupsEG' : 'quickTopupsSA';
      return {
        ...prev,
        [arrField]: prev[arrField].filter(x => x !== amount)
      };
    });
    setIsDirty(true);
    showToastSuccess?.(isAr ? '🗑️ تم حذف القيمة المحددة.' : '🗑️ Selected value removed.');
  };

  const handleSave = () => {
    // Save to localStorage
    setPaymentSettings(data);
    setIsDirty(false);
    showToastSuccess?.(isAr ? '✅ تم حفظ جميع إعدادات الدفع والنظام المالي بنجاح وبثها للمستخدمين!' : '✅ Payment settings saved & successfully broadcasted to users!');
  };

  const bothDisabledWarning = !data.walletEnabled && !data.directEnabled;
  const fawryDirectWarning = data.fawryEnabled && !data.walletEnabled && !data.directEnabled;

  return (
    <div id="admin-payment-settings-root" className="space-y-6 animate-fade-in text-right">
      
      {/* Sticky Header Actions */}
      <div id="admin-payment-header" className="sticky top-[4rem] z-20 bg-neutral-50/85 dark:bg-neutral-900/85 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 pb-4 pt-2 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            {isAr ? 'إعدادات الدفع والنظام المالي' : 'Payment & Finance Settings'}
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-bold mt-1 leading-relaxed">
            {isAr 
              ? 'العقل المدبر لتهيئة وتفعيل بوابات الدفع وشحن المحفظة بالمنصة وقواعد ظهورها حسب الدولة والمنهج.' 
              : 'The centralized system brain to configure gateway toggles, wallet charges and targeted country policies.'}
          </p>
        </div>

        <button 
          id="btn-save-payment-settings"
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-sm ${
            isDirty 
              ? 'bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white cursor-pointer active:scale-95' 
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {isAr ? 'حفظ إعدادات الأمان المالي 💾' : 'Save Financial Rules 💾'}
        </button>
      </div>

      {/* WARNING NOTIFICATION AREA */}
      {(bothDisabledWarning || fawryDirectWarning) && (
        <div id="payment-critical-warning" className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 flex gap-3 items-start animate-pulse">
          <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black">{isAr ? '⚠️ تنبيه مالي حرج للمشرفين' : '⚠️ Critical Financial Alert'}</h4>
            <p className="text-xs font-bold leading-relaxed">
              {isAr 
                ? 'لقد قمت بإيقاف تفعيل كل من نظام المحفظة الإلكترونية والدفع المباشر معاً! هذا الإجراء سيجعل الطلاب غير قادرين تماماً على الاشتراك أو تفعيل المقررات بأي طريقة من داخل المنصة.'
                : 'You have disabled both the electronic wallet system and direct course payments. Students will be completely locked from activating subscription classes/courses.'}
            </p>
          </div>
        </div>
      )}

      {/* CORE TOGGLES SECTION */}
      <div id="payment-core-settings-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* LEFT COMPONENT: Core on/off gates */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Gateways Activator */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Wallet className="w-4 h-4 text-neutral-450" />
              {isAr ? 'أدوات ونظام الدفع الرئيسي بالمنصة' : 'Core Platform Payment Engines'}
            </h3>

            <p className="text-xs text-neutral-500 font-bold leading-relaxed">
              {isAr 
                ? 'قم بالتحكم العام في التفعيل أو التشغيل الفوري لمحركات السداد بالمنصة بدون الحاجة لتطبيق أي تعديلات على الكود البرمجي.' 
                : 'Instantly toggle finance channels platform-wide for secure transaction routing.'}
            </p>

            <div className="space-y-4">
              
              {/* Toggle 1: Electronic Wallet */}
              <div id="toggle-wallet-block" className={`p-4 rounded-2xl border transition-all ${data.walletEnabled ? 'bg-indigo-50/20 border-indigo-100 dark:bg-indigo-950/5 dark:border-indigo-900/30' : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900/30 dark:border-neutral-800'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white">{isAr ? 'نظام المحفظة الإلكترونية لطلب المسبق' : 'Prepaid Student Electronic Wallet'}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-450 dark:text-neutral-400 leading-normal">
                      {isAr 
                        ? 'تفعيل المحفظة يتيح للطلاب شحن نقاط ورصيد في حساباتهم عبر الكروت وتطبيق الأكواد واستخدامها لاحقاً لفتح المقررات الدراسية.' 
                        : 'Enables students to hold credits, use prepay vouchers, and purchase courses later via virtual coin balances.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.walletEnabled}
                      onChange={() => handleToggle('walletEnabled')}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-indigo-650"></div>
                  </label>
                </div>
                {!data.walletEnabled && (
                  <div className="mt-3 p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-600 dark:text-orange-400 flex gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{isAr ? 'تنبيه: سيتم إخفاء تبويب المحفظة والشحن التعليمي بالكامل من أمام جميع لوحات شاشات الطلاب.' : 'Warning: Wallet navigation tab and promo voucher forms will be completely hidden from all student interfaces.'}</span>
                  </div>
                )}
              </div>

              {/* Toggle 2: Direct Payment */}
              <div id="toggle-direct-block" className={`p-4 rounded-2xl border transition-all ${data.directEnabled ? 'bg-indigo-50/20 border-indigo-100 dark:bg-indigo-950/5 dark:border-indigo-900/30' : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900/30 dark:border-neutral-800'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white">{isAr ? 'الدفع المباشر الفوري للكورسات وتفعيلها' : 'Instant Direct Course Activation'}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-455 dark:text-neutral-400 leading-normal">
                      {isAr 
                        ? 'تفعيل خيار الدفع كاش للمدرس أو التحصيل اليدوي الخارجي وفتح الكورسات مباشرة من المشرفين في ثوانٍ.' 
                        : 'Permits immediate administrative manual approvals or on-demand course unlocking bypassing default wallet balances.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.directEnabled}
                      onChange={() => handleToggle('directEnabled')}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-indigo-650"></div>
                  </label>
                </div>
              </div>

              {/* Toggle 3: Fawry Payment Gateway (Egypt Curriculum-specific) */}
              <div id="toggle-fawry-block" className={`p-4 rounded-2xl border transition-all ${data.fawryEnabled ? 'bg-cyan-50/20 border-cyan-100 dark:bg-cyan-950/5 dark:border-cyan-900/30' : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900/30 dark:border-neutral-800'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-1.5 bg-cyan-600 text-white rounded text-[10px] font-black tracking-widest">FAWRY</span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white">{isAr ? 'وسيلة الدفع كاش "فوري" (خاص بالمنهج المصري)' : 'Fawry Cash Payment Option (Egypt Exclusive)'}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-455 dark:text-neutral-400 leading-normal">
                      {isAr 
                        ? 'توفير خيار توليد أكواد دفع فوري المرجعية لتسهيل الدفع لجميع فروع المتاجر والطلبة بجمهورية مصر العربية.' 
                        : 'Enables Fawry payment generation tags, ideal for offline outlets and local retail checkout streams within Egyptian schools.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.fawryEnabled}
                      onChange={() => handleToggle('fawryEnabled')}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-cyan-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* TARGET VISIBILITY BY COUNTRY / SYLLABUS SECTION */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Globe className="w-4 h-4 text-neutral-450" />
              <h3 className="text-sm font-black text-neutral-900 dark:text-white">
                {isAr ? 'ظهور وسائل الدفع بحسب المناهج والدول الكونية' : 'Payment Method Visibility by Country & Syllabus'}
              </h3>
            </div>

            <p className="text-xs text-neutral-500 font-bold leading-normal">
              {isAr 
                ? 'تحكم بشكل ديناميكي دقيق في أي من وسائل الدفع تظهر للطلبة والمدرسين داخل كل دولة وبحسب انتمائهم الدراسي.' 
                : 'Target and restrict available payout/recharge gateways specifically for each country scope.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Egypt country block */}
              <div id="v-eg-country" className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 border-b pb-2">
                  <span className="text-lg">🇪🇬</span>
                  <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'البلد والمنهج الدراسي: مصر 🇪🇬' : 'Country & Syllabus: Egypt 🇪🇬'}</span>
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'wallet', labelAr: 'المحفظة الإلكترونية', labelEn: 'E-Wallet' },
                    { key: 'direct', labelAr: 'الدفع المباشر الفوري', labelEn: 'Direct Activation' },
                    { key: 'fawry', labelAr: 'تحصيل كاش فوري', labelEn: 'Fawry Cash Gateway' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between text-xs font-bold leading-none p-1.5 bg-white dark:bg-neutral-850 rounded-lg">
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                      <button
                        type="button"
                        onClick={() => handleVisibilityToggle('EG', item.key as any)}
                        className={`px-2.5 py-1 text-[9px] font-black rounded-md border transition-all ${
                          data.visibility.EG[item.key as 'wallet'|'direct'|'fawry']
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-500'
                        }`}
                      >
                        {data.visibility.EG[item.key as 'wallet'|'direct'|'fawry'] ? (isAr ? 'نشط ومفعل ✓' : 'Visible ✓') : (isAr ? 'مخفي' : 'Hidden')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saudi country block */}
              <div id="v-sa-country" className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 border-b pb-2">
                  <span className="text-lg">🇸🇦</span>
                  <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'البلد والمنهج الدراسي: السعودية 🇸🇦' : 'Country & Syllabus: Saudi Arabia 🇸🇦'}</span>
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'wallet', labelAr: 'المحفظة الإلكترونية', labelEn: 'E-Wallet' },
                    { key: 'direct', labelAr: 'الدفع المباشر الفوري', labelEn: 'Direct Activation' },
                    { key: 'fawry', labelAr: 'تحصيل كاش فوري', labelEn: 'Fawry Cash Gateway' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between text-xs font-bold leading-none p-1.5 bg-white dark:bg-neutral-850 rounded-lg">
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                      <button
                        type="button"
                        onClick={() => handleVisibilityToggle('SA', item.key as any)}
                        className={`px-2.5 py-1 text-[9px] font-black rounded-md border transition-all ${
                          data.visibility.SA[item.key as 'wallet'|'direct'|'fawry']
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-500'
                        }`}
                      >
                        {data.visibility.SA[item.key as 'wallet'|'direct'|'fawry'] ? (isAr ? 'نشط ومفعل ✓' : 'Visible ✓') : (isAr ? 'مخفي' : 'Hidden')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT: Quick Top-up amounts manager */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Egyptian Quick topups */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xl">🇪🇬</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                  {isAr ? 'قيم الشحن السريعة بمصر (جنيه مصري)' : 'Egypt Quick Top-up Values (EGP)'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-bold">
                  {isAr ? 'مبالغ شحن المحفظة الجاهزة للطلاب المصريين' : 'Preset values displayed in students wallet recharge tile'}
                </p>
              </div>
            </div>

            {/* List current amounts */}
            <div className="flex flex-wrap gap-2">
              {data.quickTopupsEG.map(amount => (
                <div key={amount} className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 text-xs font-black text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-2xl relative group">
                  <span>{amount} EGP</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveAmount('EG', amount)}
                    className="p-0.5 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                    title={isAr ? 'حذف القيمة' : 'Delete value'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {data.quickTopupsEG.length === 0 && (
                <p className="text-[11px] text-neutral-400 italic py-2">{isAr ? 'لا توجد مبالغ شحن مضافة' : 'No quick topups presets configured.'}</p>
              )}
            </div>

            {/* Field additions */}
            <div className="flex gap-2 items-center pt-2">
              <input 
                type="number"
                placeholder="150"
                value={newAmountEG}
                onChange={e => setNewAmountEG(e.target.value)}
                className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
              />
              <button 
                type="button"
                onClick={() => handleAddAmount('EG')}
                className="p-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

          {/* Section: Saudi Quick topups */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xl">🇸🇦</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                  {isAr ? 'قيم الشحن السريعة بالسعودية (ريال سعودي)' : 'Saudi Quick Top-up Values (SAR)'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-bold">
                  {isAr ? 'مبالغ شحن المحفظة الجاهزة للطلاب السعوديين' : 'Preset values displayed in students wallet recharge tile'}
                </p>
              </div>
            </div>

            {/* List current amounts */}
            <div className="flex flex-wrap gap-2">
              {data.quickTopupsSA.map(amount => (
                <div key={amount} className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-xs font-black text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-2xl relative group">
                  <span>{amount} SAR</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveAmount('SA', amount)}
                    className="p-0.5 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                    title={isAr ? 'حذف القيمة' : 'Delete value'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {data.quickTopupsSA.length === 0 && (
                <p className="text-[11px] text-neutral-400 italic py-2">{isAr ? 'لا توجد مبالغ شحن مضافة' : 'No quick topups presets configured.'}</p>
              )}
            </div>

            {/* Field additions */}
            <div className="flex gap-2 items-center pt-2">
              <input 
                type="number"
                placeholder="40"
                value={newAmountSA}
                onChange={e => setNewAmountSA(e.target.value)}
                className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
              />
              <button 
                type="button"
                onClick={() => handleAddAmount('SA')}
                className="p-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
