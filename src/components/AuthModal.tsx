import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, User, GraduationCap, MapPin, CheckCircle, Eye, EyeOff, 
  Phone, Users, ShieldAlert, ArrowLeft, ShieldCheck, Key
} from 'lucide-react';
import { translations } from '../data';
import { hashPassword } from '../utils/crypto';
import { registerStudent, getAllUsers, addSecurityLog, seedDatabaseIfNeeded } from '../utils/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  initialTab?: 'login' | 'signup';
  onLoginSuccess: (user: {
    name: string;
    phone: string;
    role: 'student' | 'teacher' | 'admin';
    country?: 'EG' | 'SA';
    grade?: string;
    location?: string;
  }) => void;
}

const egyptGovernorates = [
  { ar: 'القاهرة', en: 'Cairo' },
  { ar: 'الإسكندرية', en: 'Alexandria' },
  { ar: 'الجيزة', en: 'Giza' },
  { ar: 'القليوبية', en: 'Qalyubia' },
  { ar: 'البحيرة', en: 'Beheira' },
  { ar: 'الدقهلية', en: 'Dakahlia' },
  { ar: 'الشرقية', en: 'Sharqia' },
  { ar: 'المنوفية', en: 'Monufia' },
  { ar: 'الغربية', en: 'Gharbia' },
  { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  { ar: 'دمياط', en: 'Damietta' },
  { ar: 'الرياض/السعودية', en: 'Gulf Region' }
];

const saudiRegions = [
  { ar: 'الرياض', en: 'Riyadh' },
  { ar: 'مكة المكرمة', en: 'Makkah' },
  { ar: 'المدينة المنورة', en: 'Madinah' },
  { ar: 'المنطقة الشرقية', en: 'Eastern Province' },
  { ar: 'عسير', en: 'Asir' },
  { ar: 'تبوك', en: 'Tabuk' },
  { ar: 'حائل', en: 'Hail' },
  { ar: 'المنطقة الشمالية', en: 'Northern Borders' }
];

export default function AuthModal({ isOpen, onClose, lang, initialTab = 'login', onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Egypt or Saudi Selection
  const [selectedCountry, setSelectedCountry] = useState<'EG' | 'SA' | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [stage, setStage] = useState<'middle' | 'high'>('high');
  const [grade, setGrade] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login inputs
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Security controls
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // General state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loggedInUserMeta, setLoggedInUserMeta] = useState<{ name: string; role: string }>({ name: '', role: 'student' });

  const t = translations[lang];

  // Sync initial tab
  useEffect(() => {
    setActiveTab(initialTab);
    setError('');
  }, [initialTab, isOpen]);

  // Sync default grade option when stage or country changes
  useEffect(() => {
    if (selectedCountry === 'EG') {
      if (stage === 'middle') {
        setGrade('الصف الأول الإعدادي');
      } else {
        setGrade('الصف الثالث الثانوي');
      }
    } else if (selectedCountry === 'SA') {
      if (stage === 'middle') {
        setGrade('الصف الأول المتوسط');
      } else {
        setGrade('الصف الثالث الثانوي - مسارات');
      }
    }
  }, [selectedCountry, stage]);

  if (!isOpen) return null;

  const validateQuadName = (nameInput: string): boolean => {
    const words = nameInput.trim().split(/\s+/).filter(Boolean);
    return words.length === 4;
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCountry) {
      setError(lang === 'ar' ? 'الرجاء اختيار الدولة أولاً' : 'Please select country first');
      return;
    }

    // 1. Quad Name Validation
    if (!fullName.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال اسم الطالب بالكامل رباعياً' : 'Please enter student full quad name');
      return;
    }
    if (!validateQuadName(fullName)) {
      setError(lang === 'ar' ? 'رقم التحقق: يجب أن يكون اسم الطالب رباعياً (4 كلمات بالضبط للتحقق)' : 'Name must consist of exactly 4 words (Quad-name mandatory)');
      return;
    }

    // Phone checks
    const targetLength = selectedCountry === 'EG' ? 11 : 10;
    const phoneRegex = /^\d+$/;

    // Student Phone Validation
    if (!studentPhone.trim() || !phoneRegex.test(studentPhone) || studentPhone.length !== targetLength) {
      setError(
        lang === 'ar'
          ? `رقم هاتف الطالب يجب أن يتكون من ${targetLength} أرقام فقط`
          : `Student phone must design exactly ${targetLength} digits`
      );
      return;
    }

    // Parent Phone Validation
    if (!parentPhone.trim() || !phoneRegex.test(parentPhone) || parentPhone.length !== targetLength) {
      setError(
        lang === 'ar'
          ? `رقم هاتف ولي الأمر يجب أن يتكون من ${targetLength} أرقام فقط`
          : `Parent phone must design exactly ${targetLength} digits`
      );
      return;
    }

    if (studentPhone === parentPhone) {
      setError(lang === 'ar' ? 'رقم هاتف الطالب لا يمكن أن يتطابق مع رقم ولي الأمر' : 'Student phone cannot be identical to parent phone');
      return;
    }

    if (!location) {
      setError(lang === 'ar' ? 'الرجاء اختيار المحافظة أو المنطقة الجغرافية' : 'Please select location area');
      return;
    }

    if (password.length < 6) {
      setError(lang === 'ar' ? 'كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام' : 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    const res = await registerStudent({
      name: fullName.trim(),
      phone: studentPhone,
      parentPhone: parentPhone,
      country: selectedCountry,
      location: location,
      gender: gender,
      stage: stage,
      grade: grade,
      passwordPlane: password
    });

    if (!res.success) {
      setError(res.error || 'Registration failed');
      return;
    }

    // Automatically set a temporary session
    sessionStorage.setItem('sanad_user_session_temp', studentPhone);

    setLoggedInUserMeta({ name: fullName.trim(), role: 'student' });
    setSuccess(true);
    addSecurityLog({ phone: studentPhone, event: 'login_success', role: 'student' });

    setTimeout(() => {
      onLoginSuccess({
        name: fullName.trim(),
        phone: studentPhone,
        role: 'student',
        country: selectedCountry,
        grade: grade,
        location: location
      });
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isBlocked) {
      setError(lang === 'ar' ? '⚠️ تم حظر محاولات الدخول مؤقتاً لحماية الحساب من الهجمات المتكررة!' : '⚠️ Too many attempts! Device briefly locked.');
      return;
    }

    const cleanedPhone = loginPhone.trim();
    if (!cleanedPhone) {
      setError(lang === 'ar' ? 'يرجى إدخال اسم المستخدم (رقم هاتف الطالب)' : 'Please enter your username (Student phone)');
      return;
    }

    if (!loginPassword) {
      setError(lang === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    // Hash the login password input to verify against DB
    const hashIn = await hashPassword(loginPassword);
    
    // Seed DB dynamic accounts if they are not pre-entered
    await seedDatabaseIfNeeded();

    const allUsers = getAllUsers();
    const found = allUsers.find(u => u.phone === cleanedPhone && u.passwordHash === hashIn);

    if (found && (found as any).isBanned) {
      setError(lang === 'ar' 
        ? `🚨 تم حظر حسابك بقرار من إدارة المنصة! السبب: ${(found as any).banReason || 'مخالفة سلوكية أو تعليمية'}`
        : `🚨 This student account has been banned! Reason: ${(found as any).banReason || 'Policy violation'}`
      );
      return;
    }

    if (!found) {
      // Increment failures
      const currentFailures = consecutiveFailures + 1;
      setConsecutiveFailures(currentFailures);
      addSecurityLog({ phone: cleanedPhone, event: 'login_failed', ip: '197.31.25.101' });

      if (currentFailures >= 3) {
        setIsBlocked(true);
        setError(lang === 'ar' ? '⚠️ لقد تجاوزت الحد المسموح به من المحاولات الخاطئة (٣ محاولات)! تم قفل تسجيل الدخول مؤقتاً.' : '⚠️ Bruteforce protection active! Too many incorrect password retries.');
        addSecurityLog({ phone: cleanedPhone, event: 'ip_blocked', ip: '197.31.25.101' });
        setTimeout(() => {
          setIsBlocked(false);
          setConsecutiveFailures(0);
        }, 60000); // lockout for 1 minute in demo environment
      } else {
        setError(lang === 'ar' ? `⚠️ خطأ في رقم الهاتف أو كلمة المرور! (المحاولة المتبقية: ${3 - currentFailures})` : `⚠️ Invalid Username or Password! (Retries remaining: ${3 - currentFailures})`);
      }
      return;
    }

    // Success login!
    setConsecutiveFailures(0);
    setIsBlocked(false);

    // Save tokens based on user preferences "Remember Me"
    if (rememberMe) {
      localStorage.setItem('sanad_user_session_persistent', found.phone);
      sessionStorage.removeItem('sanad_user_session_temp');
    } else {
      sessionStorage.setItem('sanad_user_session_temp', found.phone);
      localStorage.removeItem('sanad_user_session_persistent');
    }

    setLoggedInUserMeta({ name: found.name, role: found.role });
    setSuccess(true);
    addSecurityLog({ phone: found.phone, event: 'login_success', role: found.role });

    setTimeout(() => {
      onLoginSuccess({
        name: found.name,
        phone: found.phone,
        role: found.role,
        country: found.country,
        grade: found.grade,
        location: found.location
      });
      setSuccess(false);
      setLoginPhone('');
      setLoginPassword('');
      onClose();
    }, 1500);
  };

  const fillDemoAccount = async (role: 'student_eg' | 'student_sa' | 'teacher_eg' | 'teacher_sa' | 'admin') => {
    setActiveTab('login');
    setError('');

    if (role === 'student_eg') {
      setLoginPhone('01111111111');
      setLoginPassword('123456');
    } else if (role === 'student_sa') {
      setLoginPhone('0512345678');
      setLoginPassword('123456');
    } else if (role === 'teacher_eg') {
      setLoginPhone('01234567890');
      setLoginPassword('teacher');
    } else if (role === 'teacher_sa') {
      setLoginPhone('0555555555');
      setLoginPassword('teacher');
    } else if (role === 'admin') {
      setLoginPhone('01010101010');
      setLoginPassword('admin');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 z-10 my-8 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} p-1.5 rounded-full text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 p-4 text-indigo-500 dark:text-indigo-400"
              >
                <CheckCircle className="h-12 w-12" />
              </motion.div>
              <h3 className="text-xl font-extrabold text-neutral-800 dark:text-neutral-100">
                {loggedInUserMeta.role === 'admin' 
                  ? (lang === 'ar' ? 'أهلاً بك حضرة المدير!' : 'Welcome Administrator!')
                  : loggedInUserMeta.role === 'teacher'
                  ? (lang === 'ar' ? 'أهلاً بك أستاذنا الفاضل!' : 'Welcome Respected Teacher!')
                  : (lang === 'ar' ? 'تم الدخول بنجاح!' : 'Login Successful!')}
              </h3>
              <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {loggedInUserMeta.name}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {lang === 'ar' ? 'جاري تحويلك لمساحة العمل المعتمدة...' : 'Directing you to your workspaces...'}
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6 mt-2 flex border-b border-neutral-100 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`flex-1 py-3 text-center text-sm font-extrabold border-b-2 transition ${
                    activeTab === 'login'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-neutral-400 dark:text-neutral-550 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  {t.navLogin}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`flex-1 py-3 text-center text-sm font-extrabold border-b-2 transition ${
                    activeTab === 'signup'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-neutral-400 dark:text-neutral-550 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  {t.navRegister}
                </button>
              </div>

              {error && (
                <div className="mb-4 flex gap-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 p-3.5 text-xs text-rose-600 dark:text-rose-400 font-bold border border-rose-100 dark:border-rose-900/30">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeTab === 'signup' && (
                <div>
                  {!selectedCountry ? (
                    <div className="space-y-4">
                      <div className="text-center py-2">
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full font-bold">
                          {lang === 'ar' ? 'الخطوة الأولى إلزامية' : 'Step 1 Mandatory'}
                        </span>
                        <h4 className="mt-3 text-base font-extrabold text-neutral-850 dark:text-white">
                          {lang === 'ar' ? 'يرجى اختيار دولة الدراسة للمنهج أولاً:' : 'Please select your study curriculum first:'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => { setSelectedCountry('EG'); setLocation(''); }}
                          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 hover:bg-indigo-50/30 hover:border-indigo-500 dark:bg-neutral-900/40 dark:hover:bg-indigo-950/20 dark:hover:border-indigo-400 transition group text-center"
                        >
                          <span className="text-4xl mb-3 duration-300 group-hover:scale-110">🇪🇬</span>
                          <span className="text-xs font-black text-neutral-800 dark:text-white">{lang === 'ar' ? 'جمهورية مصر' : 'Egypt'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setSelectedCountry('SA'); setLocation(''); }}
                          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 hover:bg-indigo-50/30 hover:border-indigo-500 dark:bg-neutral-900/40 dark:hover:bg-indigo-950/20 dark:hover:border-indigo-400 transition group text-center"
                        >
                          <span className="text-4xl mb-3 duration-300 group-hover:scale-110">🇸🇦</span>
                          <span className="text-xs font-black text-neutral-800 dark:text-white">{lang === 'ar' ? 'المملكة السعودية' : 'Saudi Arabia'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700">
                        <span className="text-xs font-bold">
                          {selectedCountry === 'EG' ? '🇪🇬 المنهج المصري المختار' : '🇸🇦 المنهج السعودي المختار'}
                        </span>
                        <button type="button" onClick={() => setSelectedCountry(null)} className="text-[10px] text-indigo-600 hover:underline">
                          {lang === 'ar' ? 'تغيير المنهج' : 'Change'}
                        </button>
                      </div>

                      {/* Quad name input */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                          {lang === 'ar' ? 'اسم الطالب رباعي (إلزامي)' : 'Student Full Name (Quad segment)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثال: يوسف فهد سليمان العتيبي"
                          className="w-full text-xs rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 px-4 py-2outline-none focus:border-indigo-500 transition py-2.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Student phone */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'رقم هاتف الطالب' : 'Student Mobile'}
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={selectedCountry === 'EG' ? 11 : 10}
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder={selectedCountry === 'EG' ? '011xxxxxxxx' : '05xxxxxxxx'}
                            className="w-full font-mono text-center rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs"
                          />
                        </div>

                        {/* Parent phone */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'رقم هاتف ولي الأمر' : 'Parent Mobile'}
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={selectedCountry === 'EG' ? 11 : 10}
                            value={parentPhone}
                            onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder={selectedCountry === 'EG' ? '012xxxxxxxx' : '05xxxxxxxx'}
                            className="w-full font-mono text-center rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Location */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'المحافظة / المنطقة' : 'Location Area'}
                          </label>
                          <select
                            value={location}
                            required
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 text-xs py-2 px-3 outline-none"
                          >
                            <option value="">{lang === 'ar' ? '-- اختر --' : '-- Choose --'}</option>
                            {(selectedCountry === 'EG' ? egyptGovernorates : saudiRegions).map(g => (
                              <option key={g.ar} value={g.ar}>{lang === 'ar' ? g.ar : g.en}</option>
                            ))}
                          </select>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'الجنس' : 'Gender'}
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as any)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 text-xs py-2 px-3 outline-none"
                          >
                            <option value="male">{lang === 'ar' ? 'ذكر' : 'Male'}</option>
                            <option value="female">{lang === 'ar' ? 'أنثى' : 'Female'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Stage */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'المرحلة الدراسية' : 'Grade stage'}
                          </label>
                          <select
                            value={stage}
                            onChange={(e) => setStage(e.target.value as any)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 text-xs py-2 px-3 outline-none"
                          >
                            <option value="high">{lang === 'ar' ? 'المرحلة الثانوية' : 'Secondary'}</option>
                            <option value="middle">{lang === 'ar' ? 'المرحلة الإعدادية / المتوسطة' : 'Middle'}</option>
                          </select>
                        </div>

                        {/* Grade selection */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'الصف الدراسي' : 'Grade Level'}
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={grade}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-100 dark:bg-neutral-900 text-xs py-2 px-3 text-neutral-500 font-bold"
                          />
                        </div>
                      </div>

                      {/* Passwords */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                          </label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                            {lang === 'ar' ? 'تأكيد الرمز' : 'Confirm'}
                          </label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 rounded-xl py-2.5 text-center text-sm font-black bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      >
                        {lang === 'ar' ? 'إنشاء حساب طالب جديد 🚀' : 'Create Student Account 🚀'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 matches-guide">
                      <span>{lang === 'ar' ? 'اسم المستخدم (رقم هاتف الطالب)' : 'Username (Mobile)'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 font-mono"
                      placeholder={lang === 'ar' ? 'أدخل رقم هاتف الطالب أو كود الدخول' : 'e.g. 01111111111'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex justify-between">
                      <span>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</span>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] text-indigo-600">
                        {showPassword ? <EyeOff className="h-3 w-3 inline" /> : <Eye className="h-3 w-3 inline" />}
                      </button>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-indigo-650 accent-indigo-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-neutral-500 hover:text-neutral-700">
                        {lang === 'ar' ? 'تذكرني على هذا الجهاز' : 'Remember me'}
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-xl py-3 text-center text-sm font-black bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    {lang === 'ar' ? 'تسجيل الدخول الآمن 🔐' : 'Secure Login 🔐'}
                  </button>
                </form>
              )}

              {/* Rich Seeding helper drawer */}
              <div className="mt-5 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900 border border-neutral-154 dark:border-neutral-800">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-450 dark:text-neutral-505 mb-2 text-center">
                  💡 {lang === 'ar' ? 'حسابات المحاكاة والتحصيل السريع المعتمدة للـ Sandbox' : 'Sandbox Demo quick-access accounts'}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-center select-none">
                  <button type="button" onClick={() => fillDemoAccount('student_eg')} className="p-1.5 bg-white dark:bg-neutral-800 border rounded-xl hover:border-indigo-500">
                    <p className="font-bold flex items-center gap-0.5 justify-center"><span>🇪🇬</span><span>طالب مصر</span></p>
                    <p className="font-mono text-[8px] text-neutral-400 font-bold">01111111111 / 123456</p>
                  </button>
                  <button type="button" onClick={() => fillDemoAccount('student_sa')} className="p-1.5 bg-white dark:bg-neutral-800 border rounded-xl hover:border-indigo-500">
                    <p className="font-bold flex items-center gap-0.5 justify-center"><span>🇸🇦</span><span>طالب سعودي</span></p>
                    <p className="font-mono text-[8px] text-neutral-400 font-bold">0512345678 / 123456</p>
                  </button>
                  <button type="button" onClick={() => fillDemoAccount('teacher_eg')} className="p-1.5 bg-white dark:bg-neutral-800 border rounded-xl hover:border-indigo-500">
                    <p className="font-bold flex items-center gap-0.5 justify-center"><span>👨🏫</span><span>أحمد سامي</span></p>
                    <p className="font-mono text-[8px] text-neutral-400 font-bold">01234567890 / teacher</p>
                  </button>
                  <button type="button" onClick={() => fillDemoAccount('admin')} className="p-1.5 bg-white dark:bg-neutral-800 border rounded-xl hover:border-orange-500col-span-2">
                    <p className="font-bold flex items-center gap-0.5 justify-center text-orange-605"><span>🧑💼</span><span>سوبر أدمن المنصة</span></p>
                    <p className="font-mono text-[8px] text-neutral-400 font-bold">01010101010 / admin</p>
                  </button>
                </div>
              </div>

              <div className="mt-5 text-center text-xs text-neutral-400 font-semibold">
                {activeTab === 'login' ? (
                  <p>
                    {lang === 'ar' ? 'ليس لديك حساب مسبق؟' : "Don't have an account?"}
                    <button type="button" onClick={() => { setActiveTab('signup'); setSelectedCountry(null); }} className="text-indigo-600 font-bold hover:underline mx-1">
                      {t.navRegister}
                    </button>
                  </p>
                ) : (
                  <p>
                    {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                    <button type="button" onClick={() => setActiveTab('login')} className="text-indigo-600 font-bold hover:underline mx-1">
                      {t.navLogin}
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
