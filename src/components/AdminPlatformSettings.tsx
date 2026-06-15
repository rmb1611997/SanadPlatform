import React, { useState, useEffect } from 'react';
import { 
  Save, AlertTriangle, Settings as SettingsIcon, Globe, MapPin, 
  Book, BookOpen, Banknote, Users, Wrench, Shield, CheckCircle, Upload, Trash2, Plus, Edit2, X
} from 'lucide-react';

export interface PlatformSettingsData {
  platform: {
    name: string;
    logoUrl: string;
    faviconUrl: string;
    description: string;
    url: string;
    email: string;
    supportPhone: string;
  };
  syllabus: {
    egyptian: boolean;
    saudi: boolean;
    joint: boolean;
  };
  countries: {
    id: string;
    nameAr: string;
    nameEn: string;
    code: string;
    flag: string;
    active: boolean;
  }[];
  financial: {
    withdrawalsEnabled: boolean;
    minWithdrawalAmount: number;
    refundsEnabled: boolean;
  };
  staff: {
    enabled: boolean;
  };
  maintenance: {
    enabled: boolean;
  };
}

export const defaultPlatformSettings: PlatformSettingsData = {
  platform: {
    name: 'منصة سند التعليمية',
    logoUrl: '',
    faviconUrl: '',
    description: 'منصة تعليمية متكاملة لجميع المراحل',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://sanad.com',
    email: 'support@sanad.com',
    supportPhone: '+201000000000',
  },
  syllabus: {
    egyptian: true,
    saudi: true,
    joint: true,
  },
  countries: [
    { id: 'c_eg', nameAr: 'مصر', nameEn: 'Egypt', code: 'EG', flag: '🇪🇬', active: true },
    { id: 'c_sa', nameAr: 'السعودية', nameEn: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', active: true },
  ],
  financial: {
    withdrawalsEnabled: true,
    minWithdrawalAmount: 100,
    refundsEnabled: true,
  },
  staff: {
    enabled: true,
  },
  maintenance: {
    enabled: false,
  }
};

export const getPlatformSettings = (): PlatformSettingsData => {
  try {
    const raw = localStorage.getItem('sanad_platform_settings_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultPlatformSettings;
};

export const setPlatformSettings = (data: PlatformSettingsData) => {
  localStorage.setItem('sanad_platform_settings_v1', JSON.stringify(data));
};

interface AdminPlatformSettingsProps {
  lang: 'ar' | 'en';
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
}

export default function AdminPlatformSettings({ lang, showToastSuccess, showToastError }: AdminPlatformSettingsProps) {
  const isAr = lang === 'ar';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PlatformSettingsData>(defaultPlatformSettings);
  const [isDirty, setIsDirty] = useState(false);

  // States for Country Modals
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [countryForm, setCountryForm] = useState({ nameAr: '', nameEn: '', code: '', flag: '', active: true });

  useEffect(() => {
    setData(getPlatformSettings());
    setLoading(false);
  }, []);

  const handleChange = (section: keyof PlatformSettingsData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setPlatformSettings(data);
    
    // Also sync backwards compatibility with older keys (optional)
    localStorage.setItem('sanad_maintenance_mode', String(data.maintenance.enabled));
    localStorage.setItem('sanad_withdrawals_enabled_v1', String(data.financial.withdrawalsEnabled));
    localStorage.setItem('sanad_withdrawals_enabled', String(data.financial.withdrawalsEnabled));

    setIsDirty(false);
    showToastSuccess?.(isAr ? '✅ تم حفظ جميع إعدادات المنصة بنجاح وتطبيقها على الفور.' : '✅ Platform settings saved successfully.');
  };

  const openCountryModal = (country?: any) => {
    if (country) {
      setEditingCountry(country);
      setCountryForm(country);
    } else {
      setEditingCountry(null);
      setCountryForm({ nameAr: '', nameEn: '', code: '', flag: '', active: true });
    }
    setCountryModalOpen(true);
  };

  const saveCountry = () => {
    if (!countryForm.nameAr || !countryForm.code) {
       return showToastError?.(isAr ? 'يرجى ملء البيانات الأساسية' : 'Please fill required fields');
    }
    
    setData(prev => {
      let newCountries = [...prev.countries];
      if (editingCountry) {
        newCountries = newCountries.map(c => c.id === editingCountry.id ? { ...c, ...countryForm } : c);
      } else {
        newCountries.push({ ...countryForm, id: 'c_' + Date.now().toString() } as any);
      }
      return { ...prev, countries: newCountries };
    });
    
    setIsDirty(true);
    setCountryModalOpen(false);
  };

  const removeCountry = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الدولة تماماً؟' : 'Are you sure you want to delete this country?')) {
      setData(prev => ({
        ...prev,
        countries: prev.countries.filter(c => c.id !== id)
      }));
      setIsDirty(true);
    }
  };

  const toggleCountryActive = (id: string, active: boolean) => {
    setData(prev => ({
      ...prev,
      countries: prev.countries.map(c => c.id === id ? { ...c, active } : c)
    }));
    setIsDirty(true);
  };

  if (loading) return null;

  return (
    <div className="space-y-6 animate-fade-in relative text-right">
      
      {/* Sticky Header Actions */}
      <div className="sticky top-[4rem] z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 pb-4 pt-2 mb-6 rtl:pl-4 ltr:pr-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <SettingsIcon className="w-5 h-5" />
            </span>
            {isAr ? 'إعدادات المنصة' : 'Platform Settings'}
          </h2>
          <p className="text-sm text-neutral-500 font-bold mt-1">
            {isAr ? 'التحكم العام في جميع خيارات المنصة والعمليات. جميع التعديلات هنا تطبق فوراً.' : 'Global platform controls. All changes applied immediately.'}
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-sm ${
            isDirty 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95' 
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {isAr ? 'حفظ التغييرات' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* Left Column (Main Data & Financial & Maint) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION: Platform Info */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-500" />
              {isAr ? 'البيانات الأساسية للمنصة' : 'Platform Identity Data'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'اسم المنصة' : 'Platform Name'}</label>
                <input 
                  type="text" 
                  value={data.platform.name}
                  onChange={e => handleChange('platform', 'name', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>
                <input 
                  type="email" 
                  value={data.platform.email}
                  onChange={e => handleChange('platform', 'email', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none dir-ltr text-left"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'رقم هاتف الدعم' : 'Support Phone'}</label>
                <input 
                  type="text" 
                  value={data.platform.supportPhone}
                  onChange={e => handleChange('platform', 'supportPhone', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none dir-ltr text-left"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'وصف المنصة' : 'Description'}</label>
                <textarea 
                  value={data.platform.description}
                  onChange={e => handleChange('platform', 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'رابط الموقع (للقراءة فقط)' : 'Website URL'}</label>
                <input 
                  type="text" 
                  value={data.platform.url}
                  readOnly
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-500 cursor-not-allowed dir-ltr text-left"
                />
              </div>

              {/* Logo / Favicon Visual Placeholders */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'رابط شعار المنصة' : 'Logo URL'}</label>
                <input 
                  type="text" 
                  value={data.platform.logoUrl}
                  placeholder="https://..."
                  onChange={e => handleChange('platform', 'logoUrl', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-[11px] font-mono focus:ring-2 focus:ring-indigo-500 outline-none dir-ltr xl:text-left text-left"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'رابط أيقونة الموقع (Favicon)' : 'Favicon URL'}</label>
                <input 
                  type="text" 
                  value={data.platform.faviconUrl}
                  placeholder="https://..."
                  onChange={e => handleChange('platform', 'faviconUrl', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-[11px] font-mono focus:ring-2 focus:ring-indigo-500 outline-none dir-ltr lg:text-left text-left"
                />
              </div>
            </div>
          </div>

          {/* SECTION: Syllabus settings */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-500" />
              {isAr ? 'إعدادات المناهج التعليمية' : 'Syllabus Settings'}
            </h3>
            
            <p className="text-xs text-neutral-500 font-bold mb-4">
              {isAr 
                ? 'إيقاف المنهج سيؤدي إلى إخفائه وعناصره تماماً من أمام الطلاب والمعلمين والزوار.'
                : 'Disabling a syllabus hides all its content platform-wide.'}
            </p>

            <div className="space-y-3">
              {[
                { id: 'egyptian', titleAr: 'المنهج المصري', titleEn: 'Egyptian Syllabus', icon: '🇪🇬' },
                { id: 'saudi', titleAr: 'المنهج السعودي', titleEn: 'Saudi Syllabus', icon: '🇸🇦' },
                { id: 'joint', titleAr: 'المناهج المشتركة واللغات', titleEn: 'Joint / Custom Syllabus', icon: '🌍' }
              ].map(syl => (
                <div key={syl.id} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{syl.icon}</span>
                    <span className="text-sm font-black text-neutral-800 dark:text-neutral-200">{isAr ? syl.titleAr : syl.titleEn}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={(data.syllabus as any)[syl.id]}
                      onChange={(e) => handleChange('syllabus', syl.id, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Countries & Risk) */}
        <div className="lg:col-span-5 space-y-6">

          {/* SECTION: Maintenance & Access Controls */}
          <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="w-32 h-32 text-rose-500" />
            </div>
            
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-400 mb-5 flex items-center gap-2 relative z-10">
              <Wrench className="w-4 h-4" />
              {isAr ? 'عناصر التحكم الحرجة (حالة المنصة)' : 'Critical Access Controls'}
            </h3>

            <div className="space-y-4 relative z-10">
              {/* Maintenance Toggle */}
              <div className="bg-white/60 dark:bg-neutral-900/60 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'وضع الصيانة الشاملة' : 'Global Maintenance Mode'}</h4>
                    <p className="text-[10px] font-bold text-neutral-500 mt-1 leading-snug">
                      {isAr ? 'عند التفعيل، لا أحد يستطيع الدخول غير السوبر أدمن، وتظهر شريحة الصيانة المخصصة لجميع الزوار والمستخدمين.' : 'Blocks all users except Super Admins. Shows maintenance page to visitors.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.maintenance.enabled}
                      onChange={(e) => handleChange('maintenance', 'enabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Staff Toggle */}
              <div className="bg-white/60 dark:bg-neutral-900/60 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'نظام وصول الموظفين' : 'Staff Accounts Access'}</h4>
                    <p className="text-[10px] font-bold text-neutral-500 mt-1 leading-snug">
                      {isAr ? 'إيقاف حسابات وصلاحيات دخول جميع الموظفين مؤقتاً.' : 'Suspend all staff logins temporarily.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.staff.enabled}
                      onChange={(e) => handleChange('staff', 'enabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: Countries List */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-sm flex flex-col h-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500" />
                {isAr ? 'إدارة الدول' : 'Countries & Regions'}
              </h3>
              <button 
                onClick={() => openCountryModal()}
                className="p-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-lg text-xs font-black text-neutral-700 dark:text-neutral-300 flex items-center gap-1 transition-colors"
                title={isAr ? 'إضافة دولة جديدة' : 'Add new country'}
              >
                <Plus className="w-3 h-3" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.countries.map(c => (
                <div key={c.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${c.active ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800' : 'bg-neutral-100 dark:bg-neutral-900/20 border-transparent opacity-70'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? c.nameAr : c.nameEn}</span>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 mt-0.5">{c.code}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer ml-1">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={c.active}
                        onChange={(e) => toggleCountryActive(c.id, e.target.checked)}
                      />
                      <div className="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-neutral-600 peer-checked:bg-emerald-500"></div>
                    </label>

                    <button 
                      onClick={() => openCountryModal(c)}
                      className="p-1.5 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {(c.code !== 'EG' && c.code !== 'SA') && (
                      <button 
                        onClick={() => removeCountry(c.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {data.countries.length === 0 && (
                <div className="text-center py-6 text-neutral-400 text-xs font-bold bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  {isAr ? 'لا توجد دول مضافة.' : 'No countries added.'}
                </div>
              )}
            </div>
          </div>

          {/* SECTION: Financials */}
          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-neutral-500" />
              {isAr ? 'الإعدادات المالية وسحب الرصيد' : 'Financials & Payouts Settings'}
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'نظام سحب الأرباح' : 'Payout Requests Engine'}</h4>
                  <p className="text-[10px] text-neutral-500 font-bold mt-0.5">{isAr ? 'تفعيل أو إخفاء خيار سحب الأرباح للمدرسين.' : 'Allow tutors to request withdrawals.'}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={data.financial.withdrawalsEnabled}
                    onChange={(e) => handleChange('financial', 'withdrawalsEnabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'نظام استرداد الأموال' : 'Refund System'}</h4>
                  <p className="text-[10px] text-neutral-500 font-bold mt-0.5">{isAr ? 'إظهار أو إخفاء ميزة طلب استرداد مبالغ من الكورسات للطلاب.' : 'Show or hide course refund request feature for students.'}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={data.financial.refundsEnabled}
                    onChange={(e) => handleChange('financial', 'refundsEnabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{isAr ? 'الحد الأدنى لطلب السحب' : 'Minimum Withdrawal Limit'}</label>
                <input 
                  type="number" 
                  value={data.financial.minWithdrawalAmount || ''}
                  onChange={e => handleChange('financial', 'minWithdrawalAmount', Number(e.target.value) || 0)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Country Edit Modal */}
      {countryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setCountryModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 shadow-2xl rounded-3xl w-full max-w-sm p-6 animate-scale-in text-right">
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-5">
              {editingCountry ? (isAr ? 'تعديل الدولة' : 'Edit Country') : (isAr ? 'إضافة دولة جديدة' : 'Add New Country')}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600">{isAr ? 'اسم الدولة (عربي)' : 'Name (Ar)'}</label>
                <input 
                  type="text" 
                  value={countryForm.nameAr}
                  onChange={e => setCountryForm({...countryForm, nameAr: e.target.value})}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600">{isAr ? 'اسم الدولة (إنجليزي)' : 'Name (En)'}</label>
                <input 
                  type="text" 
                  value={countryForm.nameEn}
                  onChange={e => setCountryForm({...countryForm, nameEn: e.target.value})}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none dir-ltr text-left"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-600">{isAr ? 'الكود (أحرف)' : 'Code'}</label>
                  <input 
                    type="text" 
                    placeholder="EGP / EG..."
                    value={countryForm.code}
                    onChange={e => setCountryForm({...countryForm, code: e.target.value})}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none font-mono dir-ltr uppercase text-left"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-600">{isAr ? 'علم العرض (ايموجي)' : 'Flag (Emoji)'}</label>
                  <input 
                    type="text" 
                    value={countryForm.flag}
                    onChange={e => setCountryForm({...countryForm, flag: e.target.value})}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none text-center"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="act_cb"
                  checked={countryForm.active}
                  onChange={e => setCountryForm({...countryForm, active: e.target.checked})}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="act_cb" className="text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  {isAr ? 'مفعلة ونشطة' : 'Active & Enabled'}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button 
                onClick={() => setCountryModalOpen(false)}
                className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-sm transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={saveCountry}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                {isAr ? 'اعتماد وحفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
