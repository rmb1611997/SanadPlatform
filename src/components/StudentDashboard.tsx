import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Wallet, Scroll,
  Play, CheckCircle2, AlertCircle, ShieldAlert, BadgeHelp, 
  Sparkles, MapPin, Calendar, Clock, RefreshCw, X,
  Bell, Link as LinkIcon, Copy, BarChart3, Check, Key
} from 'lucide-react';
import { coursesData, translations } from '../data';
import { UserProfile } from '../utils/db';
import StudentCoursesTab from './StudentCoursesTab';
import StudentRefundsTab from './StudentRefundsTab';
import StudentStatsTab from './StudentStatsTab';
import { getPlatformSettings } from './AdminPlatformSettings';

interface StudentDashboardProps {
  user: {
    name: string;
    phone: string;
    role?: 'student' | 'teacher' | 'admin';
    country?: 'EG' | 'SA';
    grade?: string;
    location?: string;
    parentPhone?: string;
    isGuest?: boolean;
  };
  lang: 'ar' | 'en';
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  initialCourseId?: string | null;
  initialCourseAction?: 'view' | 'subscribe' | null;
  onClearInitialCourse?: () => void;
  onRequireAuth?: (tab: 'login' | 'signup', courseId?: string) => void;
  onTeacherSelect?: (teacherId: string) => void;
}

// Interactive Mock Quizzes removed as the tab was requested for removal
export default function StudentDashboard({ 
  user, 
  lang, 
  onLogout, 
  darkMode, 
  setDarkMode,
  initialCourseId = null,
  initialCourseAction = null,
  onClearInitialCourse,
  onRequireAuth,
  onTeacherSelect
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'courses' | 'wallet' | 'refunds'>(() => {
    return user.isGuest ? 'courses' : 'stats';
  });

  useEffect(() => {
    if (user.isGuest) {
      setActiveTab('courses');
    } else if (initialCourseId) {
      setActiveTab('courses');
    }
  }, [initialCourseId, user.isGuest]);
  
  // Wallet Balance simulator
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`sanad_wallet_${user.name}`);
    return saved ? Number(saved) : 150; // default 150 credits
  });

  // Fawry Wallet Recharge States
  const [selectedTopupAmount, setSelectedTopupAmount] = useState<number | null>(100);
  const [customTopupAmount, setCustomTopupAmount] = useState('');
  const [fawryOrder, setFawryOrder] = useState<{ referenceNumber: string; amount: number; status: 'pending' | 'paid' | 'expired'; createdAt: string } | null>(() => {
    const saved = localStorage.getItem(`sanad_active_fawry_${user.name}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load Egypt quick recharge presets from localStorage
  const quickTopupPresets = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('sanad_payment_settings_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.quickTopupsEG && Array.isArray(parsed.quickTopupsEG)) {
          return parsed.quickTopupsEG;
        }
      }
    } catch (e) {}
    return [100, 200, 500, 1000]; // Default presets
  }, []);

  const handleCreateFawryRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');
    setWalletSuccess('');
    
    // Determine target amount
    let targetAmount = 0;
    if (selectedTopupAmount !== null) {
      targetAmount = selectedTopupAmount;
    } else {
      const parsed = parseFloat(customTopupAmount);
      if (isNaN(parsed) || parsed <= 0) {
        setWalletError(lang === 'ar' ? '⚠️ يرجى إدخال قيمة شحن صحيحة أكبر من صفر.' : '⚠️ Please enter a valid recharge amount greater than zero.');
        return;
      }
      targetAmount = parsed;
    }

    // Generate random 10-digit number
    const randomPayCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Create Fawry Order
    const newOrder = {
      referenceNumber: randomPayCode,
      amount: targetAmount,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    setFawryOrder(newOrder);
    localStorage.setItem(`sanad_active_fawry_${user.name}`, JSON.stringify(newOrder));

    // Register a pending transaction in the ledger
    try {
      const rawTxs = localStorage.getItem('sanad_financial_transactions_v1');
      let txsList: any[] = [];
      if (rawTxs) {
        try { txsList = JSON.parse(rawTxs); } catch (e) {}
      }

      const pendingTx = {
        id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
        studentName: user.name,
        studentPhone: user.phone,
        type: 'recharge',
        amount: targetAmount,
        currency: 'EGP',
        status: 'pending',
        date: new Date().toISOString(),
        method: lang === 'ar' ? 'فوري (Fawry)' : 'Fawry Cash Payment',
        reference: randomPayCode,
        notes: lang === 'ar' ? `إنشاء كود دفع فوري - بانتظار السداد` : `Fawry code generated - Awaiting payment`
      };

      localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify([pendingTx, ...txsList]));
    } catch (e) {}

    setWalletSuccess(lang === 'ar' ? '⚡ تم إنشاء كود الدفع فوري بنجاح! يرجى سداده لتفعيل الرصيد.' : '⚡ Fawry billing reference generated successfully! Pay to complete.');
  };

  const handleVerifyFawryPayment = () => {
    if (!fawryOrder) return;
    setIsVerifying(true);

    // Simulate API Check Delay
    setTimeout(() => {
      setIsVerifying(false);
      // For demo purposes, we automatically "pay" it if user clicks verify
      // In real world, this would call a backend checking Fawry API Status
      handleSimulateFawryPaymentCompletion();
    }, 2000);
  };

  const handleSimulateFawryPaymentCompletion = () => {
    if (!fawryOrder) return;

    const amount = fawryOrder.amount;
    const newBal = walletBalance + amount;
    
    // Step 1: Update local balances
    setWalletBalance(newBal);
    localStorage.setItem(`sanad_wallet_${user.name}`, newBal.toString());

    // Step 2: Update transaction status in matching ref in sanad_financial_transactions_v1
    try {
      const rawTxs = localStorage.getItem('sanad_financial_transactions_v1');
      if (rawTxs) {
        let txsList = JSON.parse(rawTxs);
        const index = txsList.findIndex((t: any) => t.reference === fawryOrder.referenceNumber);
        if (index !== -1) {
          txsList[index].status = 'success';
          txsList[index].notes = lang === 'ar' ? `تم تأكيد السداد عبر فوري بنجاح` : `Payment confirmed via Fawry successfully`;
          txsList[index].date = new Date().toISOString();
          localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify(txsList));
        }
      }
    } catch (e) {}

    // Step 3: Success state
    setWalletSuccess(lang === 'ar' ? `🎉 تم استلام عملية السداد بنجاح وإضافة ${amount} جنيه لمحفظتك! رصيدك المحدث: ${newBal} جنيه.` : `🎉 Payment of ${amount} EGP confirmed! Your wallet is updated with ${newBal} EGP.`);
    setFawryOrder(null);
    localStorage.removeItem(`sanad_active_fawry_${user.name}`);
    setSelectedTopupAmount(100);
    setCustomTopupAmount('');
  };

  // Purchased courses simulator
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`sanad_purchased_${user.name}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Recharge state
  const [couponCode, setCouponCode] = useState('');
  const [walletSuccess, setWalletSuccess] = useState('');
  const [walletError, setWalletError] = useState('');

  // Schedulers for active teacher notification dynamically reflecting target times
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    link?: string;
    startDate: string;
    endDate?: string;
    isPermanent: boolean;
  } | null>(null);

  // Platform settings to check features
  const platformSettings = getPlatformSettings();
  const refundsEnabled = platformSettings.financial.refundsEnabled;

  useEffect(() => {
    const handleOpenStats = () => {
      setActiveTab('stats');
      window.scrollTo(0, 0);
    };
    const handleOpenCourses = () => {
      setActiveTab('courses');
      window.scrollTo(0, 0);
    };
    const handleOpenWallet = () => {
      setActiveTab('wallet');
      window.scrollTo(0, 0);
    };
    const handleOpenRefunds = () => {
      if (refundsEnabled) {
        setActiveTab('refunds');
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('open-stats-tab', handleOpenStats);
    window.addEventListener('open-courses-tab', handleOpenCourses);
    window.addEventListener('open-wallet-tab', handleOpenWallet);
    window.addEventListener('open-refunds-tab', handleOpenRefunds);
    return () => {
      window.removeEventListener('open-stats-tab', handleOpenStats);
      window.removeEventListener('open-courses-tab', handleOpenCourses);
      window.removeEventListener('open-wallet-tab', handleOpenWallet);
      window.removeEventListener('open-refunds-tab', handleOpenRefunds);
    };
  }, []);

  useEffect(() => {
    const checkNotificationVisibility = () => {
      const stored = localStorage.getItem('sanad_notifications');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) {
            const now = new Date().getTime();
            
            // Find the first notification that qualifies for this specific student
            const matchedNotif = list.find((notif: any) => {
              if (notif.isActive === false) return false;

              // Check time bounds
              const startStr = notif.startDate;
              const endStr = notif.endDate;
              const startMs = startStr ? new Date(startStr).getTime() : 0;
              const isVisibleStart = now >= startMs;

              let isVisibleEnd = true;
              if (!notif.isPermanent && endStr) {
                const endMs = new Date(endStr).getTime();
                isVisibleEnd = now <= endMs;
              }

              if (!isVisibleStart || !isVisibleEnd) return false;

              // Check target audience
              const targetType = notif.targetType || 'all_users';
              const targetDetails = notif.targetDetails || [];

              if (targetType === 'all_users' || targetType === 'all_students') {
                return true;
              }

              if (targetType === 'specific_user') {
                const matchesName = targetDetails.includes(user.name);
                const matchesPhone = user.phone && targetDetails.includes(user.phone);
                return matchesName || matchesPhone;
              }

              return false;
            });

            if (matchedNotif) {
              setActiveNotification(matchedNotif);
              return;
            }
          }
        } catch (e) {
          console.error('Error parsing notifications in student dashboard', e);
        }
      }
      setActiveNotification(null);
    };

    checkNotificationVisibility();
    const intervalId = setInterval(checkNotificationVisibility, 4000); // Check every 4 seconds for real-time compliance
    return () => clearInterval(intervalId);
  }, []);

  // Sync wallet & courses to localstorage
  useEffect(() => {
    localStorage.setItem(`sanad_wallet_${user.name}`, walletBalance.toString());
  }, [walletBalance, user.name]);

  useEffect(() => {
    localStorage.setItem(`sanad_purchased_${user.name}`, JSON.stringify(purchasedCourseIds));
  }, [purchasedCourseIds, user.name]);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletSuccess('');
    setWalletError('');

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    let amount = 0;
    let foundAndRedeemed = false;

    // Check dynamic coupons generated by Super Admin
    const localCouponsRaw = localStorage.getItem('sanad_vouchers');
    if (localCouponsRaw) {
      try {
        const couponsList = JSON.parse(localCouponsRaw);
        if (Array.isArray(couponsList)) {
          const matchIndex = couponsList.findIndex(
            (item: any) => item.code.toUpperCase() === cleanCode && !item.isUsed
          );
          if (matchIndex !== -1) {
            amount = couponsList[matchIndex].amount;
            couponsList[matchIndex].isUsed = true;
            couponsList[matchIndex].usedBy = user.phone || 'Unknown';
            couponsList[matchIndex].usedAt = new Date().toISOString();
            localStorage.setItem('sanad_vouchers', JSON.stringify(couponsList));
            foundAndRedeemed = true;
          }
        }
      } catch (err) {
        console.error("Error parsing sanad_vouchers", err);
      }
    }

    if (!foundAndRedeemed) {
      // Fallback fallback to legacy presets
      if (cleanCode === 'SANAD50') {
        amount = 50;
      } else if (cleanCode === 'SANAD100') {
        amount = 100;
      } else if (cleanCode === 'VIP500') {
        amount = 500;
      } else {
        setWalletError(lang === 'ar' ? '⚠️ رمز كرت شحن غير صالح أو تم استخدامه مسبقاً! جرب الرموز المسبقة: SANAD100 أو VIP500 أو الرموز الصادرة عن السوبر أدمن' : '⚠️ Invalid coupon reference or already claimed! Try preset codes: SANAD100, VIP500 or active keys issued by Super Admin');
        return;
      }
    }

    setWalletBalance(prev => prev + amount);
    setWalletSuccess(lang === 'ar' ? `🎉 تم شحن رصيد محفظتك بمبلغ ${amount} ${user.country === 'EG' ? 'جنيه' : 'ريال'} بنجاح!` : `🎉 Successfully recharged ${amount} credits to your student wallet!`);
    
    // Save new student wallet balance in localStorage too
    localStorage.setItem(`sanad_wallet_${user.name}`, (walletBalance + amount).toString());

    setCouponCode('');
  };

  const handleBuyCourse = (courseId: string, price: number) => {
    if (purchasedCourseIds.includes(courseId)) return;
    
    if (walletBalance < price) {
      // Prompt wallet activation tab
      setWalletError(lang === 'ar' ? '⚠️ عذراً! رصيد محفظتك غير كافٍ لتفعيل هذا الكورس. يرجى شحن الرصيد أولاً في تبويب المحفظة.' : '⚠️ Insufficient credits to unlock this course. Please recharge in the wallet tab.');
      setActiveTab('wallet');
      return;
    }

    setWalletBalance(prev => prev - price);
    setPurchasedCourseIds(prev => [...prev, courseId]);

    // Record transaction detail globally in sanad_sales_v4 and split the profits
    try {
      // Retrieve course meta
      let matchedCourse: any = null;
      try {
        const customCoursesRaw = localStorage.getItem('sanad_custom_courses_db');
        if (customCoursesRaw) {
          const list = JSON.parse(customCoursesRaw);
          matchedCourse = list.find((c: any) => c.id === courseId);
        }
      } catch (e) {}

      if (!matchedCourse) {
        matchedCourse = coursesData[lang].find(c => c.id === courseId);
      }

      if (matchedCourse) {
        const salesKey = 'sanad_sales_v4';
        let currentSales: any[] = [];
        const stored = localStorage.getItem(salesKey);
        if (stored) {
          try { currentSales = JSON.parse(stored); } catch (e) {}
        }

        const newSale = {
          id: `TXN-${Math.floor(95100 + Math.random() * 10000)}`,
          courseId: courseId,
          courseTitle: matchedCourse.title,
          teacherName: matchedCourse.teacher,
          price: price,
          studentName: user.name,
          studentPhone: user.phone,
          studentCountry: user.country || 'EG',
          timestamp: new Date().toISOString(),
          subject: matchedCourse.category === 'physics' ? 'الفيزياء' : (matchedCourse.category === 'math' ? 'الرياضيات' : (matchedCourse.category === 'chemistry' ? 'الكيمياء' : (matchedCourse.category === 'biology' ? 'علم الأحياء' : 'اللغة العربية'))),
          grade: matchedCourse.level || 'الصف الثالث الثانوي'
        };

        currentSales = [newSale, ...currentSales];
        localStorage.setItem(salesKey, JSON.stringify(currentSales));

        // Fetch rates to update teacher's individual balance
        const courseRatesSaved = localStorage.getItem('sanad_course_rates');
        let crRates: any = {};
        if (courseRatesSaved) crRates = JSON.parse(courseRatesSaved);

        const teacherRatesSaved = localStorage.getItem('sanad_teacher_share_rates');
        let tRates: any = {};
        if (teacherRatesSaved) tRates = JSON.parse(teacherRatesSaved);

        const rate = crRates[courseId] !== undefined 
          ? crRates[courseId] 
          : (tRates[matchedCourse.teacher] !== undefined ? tRates[matchedCourse.teacher] : 70);

        const tEarn = (price * rate) / 100;
        
        const teacherWalletKey = `sanad_teacher_wallet_${matchedCourse.teacher}`;
        const oldBal = Number(localStorage.getItem(teacherWalletKey) || '0');
        localStorage.setItem(teacherWalletKey, (oldBal + tEarn).toString());
      }
    } catch (err) {
      console.error('Error logging real-time profit split in StudentDashboard:', err);
    }

    setWalletSuccess(lang === 'ar' ? '✨ تم تفعيل الكورس بنجاح وفتحه لك مدى الحياة! ابدأ المشاهدة الآن.' : '✨ Course activated and unlocked successfully! Happy learning!');
    setActiveTab('courses');
    setTimeout(() => setWalletSuccess(''), 4000);
  };

  // Filter study catalog matching student's selected curriculum
  const myCountryCourses = coursesData[lang].filter(c => c.country === 'both' || c.country === user.country);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic validation alerts */}
        {walletSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300 text-sm font-bold flex gap-2"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{walletSuccess}</span>
          </motion.div>
        )}

        {/* Global Active Notification from Teacher (if scheduled & active) */}
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-6 p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 border-2 border-indigo-500/10 dark:border-indigo-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-indigo-600" />
            <div className="flex items-start gap-3.5 pr-2.5">
              <span className="p-3 bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap justify-start">
                  <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === 'ar' ? 'أحدث تنبيه هام من المدرس 📢' : 'URGENT NOTICE FROM TEACHER 📢'}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black">
                    ⏱️ {lang === 'ar' ? 'بدء الظهور:' : 'Published:'} {new Date(activeNotification.startDate).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs md:text-sm font-black text-neutral-800 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap mt-1">
                  {activeNotification.title}
                </p>
              </div>
            </div>

            {activeNotification.link && (
              <a
                href={activeNotification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto py-2.5 px-6 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-650/15 transition flex items-center justify-center gap-2 shrink-0 md:ml-2"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>{lang === 'ar' ? 'اضغط هنا للدخول المباشر للرابط المرفق 🔗' : 'Tap to Join Link Action 🔗'}</span>
              </a>
            )}
          </motion.div>
        )}

        {/* Dashboard Menu Buttons Removed as navigation is now in the avatar menu */}


        {/* OVERVIEW / STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Immersive Welcome banner */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
              
              <div className="relative z-10 space-y-4 max-w-3xl">
                <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  🎓 {lang === 'ar' ? 'سندك التعليمي المعتمد' : 'Your Professional Academy Path'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {lang === 'ar' ? `أهلاً بك يا بطل، ${user.name} 👋` : `Welcome, Student ${user.name} 👋`}
                </h2>
                <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                  {lang === 'ar' 
                    ? `أنت الآن تتابع المنهج الدراسي المخصص لـ (${user.grade}) في ${user.country === 'EG' ? 'جمهورية مصر العربية 🇪🇬' : 'المملكة العربية السعودية 🇸🇦'}. بوابتك الذكية مستعدة لحضور الدروس، الإجابة على الامتحانات، وطرح تساؤلاتك.`
                    : `You are studying the tailored curriculum for (${user.grade}) in ${user.country === 'EG' ? 'Egypt 🇪🇬' : 'Saudi Arabia 🇸🇦'}.`}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-indigo-100">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{user.country === 'EG' ? 'المحافظة' : 'المنطقة'}: {user.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Statistics Dashboard Component */}
            <StudentStatsTab 
              user={user} 
              lang={lang} 
              walletBalance={walletBalance} 
              purchasedCourseIds={purchasedCourseIds} 
            />
          </div>
        )}

        {/* STUDY CURRICULUMS / COURSES TAB */}
        {activeTab === 'courses' && (
          <StudentCoursesTab
            user={user}
            lang={lang}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            purchasedCourseIds={purchasedCourseIds}
            setPurchasedCourseIds={setPurchasedCourseIds}
            initialCourseId={initialCourseId}
            initialCourseAction={initialCourseAction}
            onClearInitialCourse={onClearInitialCourse}
            onRequireAuth={onRequireAuth}
            onTeacherSelect={onTeacherSelect}
          />
        )}

        {/* REFUNDS TAB */}
        {activeTab === 'refunds' && refundsEnabled && (
          <StudentRefundsTab user={user} lang={lang} />
        )}

        {/* WALLET & DIGITAL VOUCHERS TAB */}
        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Wallet Balance Header */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full inline-block">
                  {lang === 'ar' ? 'رصيد محفظة الطالب في منصة سند' : 'Active Student Wallet Balance'}
                </span>
                <div>
                  <p className="text-[10px] text-neutral-400 font-extrabold">{lang === 'ar' ? 'الرصيد الفعلي الحالي بالمحفظة (أمانات الطالب)' : 'Available Wallet Balance'}</p>
                  <div className="text-4xl font-extrabold font-mono text-indigo-450 mt-1 flex items-baseline justify-center gap-1.5">
                    <span>{walletBalance}</span>
                    <span className="text-sm font-black">
                      {user.country === 'EG' ? (lang === 'ar' ? 'جنيه مصرى' : 'EGP') : (lang === 'ar' ? 'ريال سعودى' : 'SAR')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-450 border-t border-neutral-800 pt-4 font-semibold">
                  {lang === 'ar' 
                    ? `رقم هاتف الطالب للحساب: ${user.phone}`
                    : `Student phone account: ${user.phone}`}
                </div>
              </div>
            </div>

            {/* Error and Success Alert Banners */}
            {walletError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-450 font-bold rounded-2xl flex gap-2 align-middle">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{walletError}</span>
              </div>
            )}

            {walletSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-600 dark:text-emerald-450 font-bold rounded-2xl flex gap-2 align-middle">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{walletSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Fawry Recharging Method */}
              <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-neutral-900 font-sans shadow-xs">
                      FAWRY فوري
                    </span>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {lang === 'ar' ? 'شحن المحفظة عبر خدمة فوري' : 'Fawry Cash Recharge Hub'}
                    </h4>
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium leading-relaxed">
                    {lang === 'ar'
                      ? 'حدد أو اكتب أي قيمة شحن، ثم أنشئ رقم المعاملة للسداد في أي منفذ فوري نقداً.'
                      : 'Choose amount or enter custom value to acquire your instant Fawry POS cash pay code.'}
                  </p>
                </div>

                {!fawryOrder ? (
                  <form onSubmit={handleCreateFawryRecharge} className="space-y-4 pt-1">
                    {/* Amount select buttons */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-450 dark:text-neutral-400 block">
                        {lang === 'ar' ? 'اختر مبلغ الشحن السريع:' : 'Select quick topup amount:'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {quickTopupPresets.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setSelectedTopupAmount(amt);
                              setCustomTopupAmount('');
                            }}
                            className={`py-2 px-3 text-xs font-mono font-black rounded-xl border transition-all duration-200 ${
                              selectedTopupAmount === amt
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-300 hover:border-indigo-400'
                            }`}
                          >
                            {amt} {lang === 'ar' ? 'جنيه' : 'EGP'}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSelectedTopupAmount(null)}
                          className={`col-span-2 py-2 px-3 text-xs font-black rounded-xl border transition-all duration-200 ${
                            selectedTopupAmount === null
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-300 hover:border-indigo-400'
                          }`}
                        >
                          ✏️ {lang === 'ar' ? 'مبلغ آخر (كتابة يدوية)' : 'Other Custom Amount'}
                        </button>
                      </div>
                    </div>

                    {/* Custom Amount inputs */}
                    {selectedTopupAmount === null && (
                      <div className="space-y-1">
                        <input
                          type="number"
                          min="10"
                          max="20000"
                          required
                          value={customTopupAmount}
                          onChange={(e) => setCustomTopupAmount(e.target.value)}
                          className="w-full text-center font-bold px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none focus:border-indigo-500 transition"
                          placeholder={lang === 'ar' ? 'اكتب قيمة الشحن بالجنيه (مثال: 350)' : 'Enter amount in EGP (e.g. 350)'}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-black rounded-xl transition duration-300 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ {lang === 'ar' ? 'شحن المحفظة فوري' : 'Get Fawry Pay Code'}</span>
                    </button>
                  </form>
                ) : (
                  /* Fawry Invoice unpaid details card */
                  <div className="space-y-4 pt-1">
                    <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-amber-500 text-neutral-900 text-[10px] font-black rounded-lg shadow-sm">
                          FAWRY CASH
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border flex items-center gap-1 animate-pulse
                          ${fawryOrder.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}
                        `}>
                          <Clock className="h-3 w-3" />
                          {lang === 'ar' ? 'بانتظار السداد' : 'PENDING PAYMENT'}
                        </span>
                      </div>

                      <div className="space-y-1 border-y border-neutral-800 py-4">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          {lang === 'ar' ? 'رقم مرجع الدفع (فوري)' : 'Fawry Reference Number'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-[0.2em] drop-shadow-sm">
                            {fawryOrder.referenceNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(fawryOrder.referenceNumber);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                              } catch (err) {}
                            }}
                            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all active:scale-90"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                               <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs font-black px-1">
                        <div className="text-right">
                          <p className="text-neutral-500 text-[9px]">{lang === 'ar' ? 'قيمة الشحن:' : 'Recharge Amount:'}</p>
                          <p className="text-white text-sm font-mono">{fawryOrder.amount} EGP</p>
                        </div>
                        <div className="text-left">
                          <p className="text-neutral-500 text-[9px]">{lang === 'ar' ? 'اسم الخدمة:' : 'Service Name:'}</p>
                          <p className="text-white text-[10px]">{lang === 'ar' ? 'سند التعليمية' : 'Sanad Educational'}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center justify-between">
                         <span className="text-[10px] font-black text-amber-500">{lang === 'ar' ? 'كود الخدمة فوري:' : 'Fawry Service Code:'}</span>
                         <span className="text-sm font-black text-white font-mono bg-neutral-800 px-3 py-0.5 rounded-lg border border-neutral-700">789</span>
                      </div>
                    </div>

                    {/* Step of procedures instruction */}
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 leading-relaxed">
                      <p className="text-[10px] text-neutral-800 dark:text-white font-black">🛠️ {lang === 'ar' ? 'خطوات السداد عند البقالة / المنفذ:' : 'Steps to pay at any retail outlet:'}</p>
                      <div className="space-y-1.5">
                        <div className="flex gap-2 text-[10px] font-bold text-neutral-500">
                          <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-400">1</span>
                          <span>{lang === 'ar' ? 'اطلب خدمة مدفوعات فوري كاش باسم (سند التعليمية).' : 'Ask for Fawry Cash payments named (Sanad Educational).'}</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold text-neutral-500">
                          <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-400">2</span>
                          <span>{lang === 'ar' ? 'استخدم كود الخدمة (789) للوصول السريع للمنصة.' : 'Use service code (789) for quick access.'}</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold text-neutral-500">
                          <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-400">3</span>
                          <span>{lang === 'ar' ? `قدم رقم المرجع ${fawryOrder.referenceNumber} وادفع المبلغ نفعداً.` : `Provide Ref ${fawryOrder.referenceNumber} and pay cash.`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={handleVerifyFawryPayment}
                        className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2
                          ${isVerifying 
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'}
                        `}
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>{lang === 'ar' ? 'جاري التحقق من فوري...' : 'Verifying via Fawry API...'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{lang === 'ar' ? 'تحديث ومزامنة حالة الدفع ⚡' : 'Check & Sync Payment Status ⚡'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(lang === 'ar' ? 'هل أنت متأكد من إلغاء عملية الشحن الحالية؟' : 'Are you sure you want to cancel this recharge?')) {
                            setFawryOrder(null);
                            localStorage.removeItem(`sanad_active_fawry_${user.name}`);
                          }
                        }}
                        className="w-full py-2.5 text-[10px] font-bold text-neutral-400 hover:text-rose-500 transition flex items-center justify-center gap-1.5"
                      >
                        <X className="h-3 w-3" />
                        <span>{lang === 'ar' ? 'إلغاء الطلب وبدء من جديد' : 'Cancel request and restart'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Prepaid Vouchers Method */}
              <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-sans shadow-xs">
                      VOUCHER سند
                    </span>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {lang === 'ar' ? 'شحن عن طريق كروت منصة سند' : 'Load Prepaid Voucher Card'}
                    </h4>
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium leading-relaxed">
                    {lang === 'ar'
                      ? 'اكتب الرمز المطبوع على كرت شحن سند المسبق الصادر من المنظومة للشحن المباشر.'
                      : 'Input scratch voucher coupons produced by administrator or publishers for instant credit credit.'}
                  </p>
                </div>

                <form onSubmit={handleRecharge} className="space-y-3 pt-1">
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-center tracking-widest uppercase font-mono py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none focus:border-indigo-500 duration-200"
                    placeholder="SANAD100 / VIP500"
                  />
                  
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-black rounded-xl transition"
                  >
                    {lang === 'ar' ? 'تأكيد وشحن الكرت الآن ⚡' : 'Confirm & Load Voucher ⚡'}
                  </button>
                </form>

                {/* Sand demo hint codes to test */}
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150/40 rounded-2xl">
                  <p className="text-[10px] font-black text-indigo-855 dark:text-indigo-400 text-center mb-1">
                    💡 {lang === 'ar' ? 'رمز الكرت هو كود تجاري تجريبي:' : 'Demo Vouchers for Testing:'}
                  </p>
                  <div className="flex justify-around text-[10.5px] font-mono text-neutral-550 dark:text-neutral-400 font-bold">
                    <span>SANAD100 (+100)</span>
                    <span>VIP500 (+500)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SETTINGS REMOVED */}
        <div className="pt-2" />

        {/* PROFILE REMOVED */}


      </div>
    </div>
  );
}
