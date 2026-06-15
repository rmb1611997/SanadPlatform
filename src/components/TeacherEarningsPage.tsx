import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, TrendingUp, Wallet, ArrowDownCircle, 
  Send, CheckCircle, FileText, Filter, Calendar, CreditCard, Clock,
  AlertCircle, ChevronDown, Check, X, Search, FileSpreadsheet, Download
} from 'lucide-react';
import { Course } from '../types';
import { getAllUsers } from '../utils/db';

interface TeacherEarningsPageProps {
  lang: 'ar' | 'en';
  teacherName: string;
  teacherCourses: Course[];
}

export default function TeacherEarningsPage({ lang, teacherName, teacherCourses }: TeacherEarningsPageProps) {
  const isAr = lang === 'ar';

  const getTeacherCurrency = (): 'EGP' | 'SAR' => {
    try {
      const users = getAllUsers();
      const found = users.find(u => 
        u.role === 'teacher' && 
        (u.name.toLowerCase() === teacherName.toLowerCase() || 
         teacherName.toLowerCase().includes(u.name.toLowerCase()) || 
         u.name.toLowerCase().includes(teacherName.toLowerCase()))
      );
      if (found && found.currency) {
        return found.currency;
      }
    } catch {}
    return 'EGP'; // default fallback
  };

  const teacherCurr = getTeacherCurrency();
  const currencyLabel = teacherCurr === 'EGP' ? (isAr ? 'جنيه مصري' : 'EGP') : (isAr ? 'ريال سعودي' : 'SAR');
  const currencySymbol = teacherCurr === 'EGP' ? (isAr ? 'ج.م' : 'EGP') : (isAr ? 'ر.س' : 'SAR');
  
  // States
  const [salesData, setSalesData] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [teacherRates, setTeacherRates] = useState<Record<string, number>>({});
  const [courseRates, setCourseRates] = useState<Record<string, number>>({});
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState<boolean>(true);
  
  // Form inputs
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'vodafone' | 'egypt_post' | 'bank' | 'stc'>( 'vodafone' );
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  
  // Filter variables
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'year'>('all');

  // Modals for buttons
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showWithdrawalsModal, setShowWithdrawalsModal] = useState(false);

  // Load configuration and data from localStorage
  useEffect(() => {
    // 1. Sales Data
    const storedSales = localStorage.getItem('sanad_sales_v4');
    if (storedSales) {
      try {
        setSalesData(JSON.parse(storedSales));
      } catch (e) {
        console.error('Error parsing sales logs:', e);
      }
    }

    // 2. Withdrawal Requests
    const storedWithdrawals = localStorage.getItem('sanad_withdrawals');
    if (storedWithdrawals) {
      try {
        setWithdrawalRequests(JSON.parse(storedWithdrawals));
      } catch (e) {
        console.error('Error parsing withdrawal requests:', e);
      }
    } else {
      // Seed some dummy past withdrawals for visuals
      const dummyWithdrawals = [
        {
          id: `WD-${84100 + 1}`,
          teacherName: teacherName,
          amount: 1500,
          method: 'vodafone',
          details: '01012345678',
          status: 'completed',
          timestamp: new Date(Date.now() - 15 * 86400000).toISOString()
        },
        {
          id: `WD-${84100 + 2}`,
          teacherName: teacherName,
          amount: 800,
          method: 'egypt_post',
          details: 'الرقم القومي: 29512345678901',
          status: 'completed',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
        }
      ];
      localStorage.setItem('sanad_withdrawals', JSON.stringify(dummyWithdrawals));
      setWithdrawalRequests(dummyWithdrawals);
    }

    // 3. Teacher rates
    const savedRates = localStorage.getItem('sanad_teacher_share_rates');
    if (savedRates) {
      try {
        setTeacherRates(JSON.parse(savedRates));
      } catch (e) {}
    }

    // 4. Course ratios
    const savedCourseRatios = localStorage.getItem('sanad_course_rates');
    if (savedCourseRatios) {
      try {
        setCourseRates(JSON.parse(savedCourseRatios));
      } catch (e) {}
    }

    // 5. Withdrawals enabled state
    const enabled = localStorage.getItem('sanad_withdrawals_enabled_v1') !== 'false';
    setWithdrawalsEnabled(enabled);
  }, [teacherName]);

  // Sync wallet balance to and from localStorage dynamically
  const getTeacherWalletBalance = (): number => {
    const key = `sanad_teacher_wallet_${teacherName}`;
    const stored = localStorage.getItem(key);
    if (stored) return Number(stored);

    // If not found, compute it as total past earnings minus completed withdrawals
    const totalEarningsVal = myCourseSales.reduce((sum, sale) => {
      const rate = courseRates[sale.courseId] !== undefined 
        ? courseRates[sale.courseId] 
        : (teacherRates[teacherName] !== undefined ? teacherRates[teacherName] : 70);
      return sum + (sale.price * rate) / 100;
    }, 0);

    const completedWithdrawalsVal = withdrawalRequests
      .filter(w => w.teacherName === teacherName && w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);

    const balance = Math.max(0, totalEarningsVal - completedWithdrawalsVal);
    localStorage.setItem(key, balance.toString());
    return balance;
  };

  const walletBalance = getTeacherWalletBalance();

  // Filter sales that belong to this teacher's courses
  const myCourseSales = salesData.filter((s: any) => s.teacherName === teacherName);

  // Apply filters
  const filteredSales = myCourseSales.filter((s: any) => {
    // Course filter
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;

    // Date filter
    if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(s.timestamp) >= oneMonthAgo;
    }
    if (dateFilter === 'year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return new Date(s.timestamp) >= oneYearAgo;
    }
    return true;
  });

  // Calculate stats based on ALL myCourseSales (accumulative statistics)
  const totalSubscribersCount = myCourseSales.length;
  
  const totalCumulativeEarnings = myCourseSales.reduce((sum, sale) => {
    const rate = courseRates[sale.courseId] !== undefined 
      ? courseRates[sale.courseId] 
      : (teacherRates[teacherName] !== undefined ? teacherRates[teacherName] : 70);
    return sum + (sale.price * rate) / 100;
  }, 0);

  const totalCourseSalesSumPrice = myCourseSales.reduce((sum, sale) => sum + sale.price, 0);
  const platformEarningsShare = totalCourseSalesSumPrice - totalCumulativeEarnings;

  // Educator rate description
  const defaultDiscountPercentage = teacherRates[teacherName] !== undefined ? teacherRates[teacherName] : 70;

  // Earning Breakdown by Course Name
  const courseBreakdown = teacherCourses.map(course => {
    const courseSales = myCourseSales.filter(s => s.courseId === course.id);
    const grossPrice = courseSales.reduce((sum, s) => sum + s.price, 0);
    
    const rate = courseRates[course.id] !== undefined 
      ? courseRates[course.id] 
      : defaultDiscountPercentage;
      
    const teacherPercentNet = (grossPrice * rate) / 100;
    const platformPercentNet = grossPrice - teacherPercentNet;

    return {
      id: course.id,
      title: course.title,
      level: course.level,
      salesCount: courseSales.length,
      gross: grossPrice,
      rate: rate,
      tNet: teacherPercentNet,
      pNet: platformPercentNet
    };
  }).sort((a, b) => b.tNet - a.tNet);

  // Handle requesting a new withdrawal
  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess('');
    setWithdrawError('');

    const parsedAmount = Number(withdrawAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      setWithdrawError(isAr ? '⚠️ الرجاء إدخال مبلغ صحيح!' : '⚠️ Please type a valid payout amount!');
      return;
    }

    if (parsedAmount > walletBalance) {
      setWithdrawError(isAr ? '⚠️ رصيدك المتاح غير كافٍ لسحب هذا المبلغ!' : '⚠️ Insufficient wallet Balance!');
      return;
    }

    if (!withdrawDetails.trim()) {
      setWithdrawError(isAr ? '⚠️ الرجاء تعبئة بيانات استلام الأرباح لتمكين الصرف!' : '⚠️ Payout details/identifier is required!');
      return;
    }

    const newWithdrawal = {
      id: `WD-${Math.floor(84100 + Math.random() * 10000)}`,
      teacherName: teacherName,
      amount: parsedAmount,
      method: withdrawMethod,
      details: withdrawDetails,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    const updatedWithdrawals = [newWithdrawal, ...withdrawalRequests];
    localStorage.setItem('sanad_withdrawals', JSON.stringify(updatedWithdrawals));
    setWithdrawalRequests(updatedWithdrawals);

    // Deduct from teacher's wallet balance
    const teacherWalletKey = `sanad_teacher_wallet_${teacherName}`;
    localStorage.setItem(teacherWalletKey, (walletBalance - parsedAmount).toString());

    setWithdrawAmount('');
    setWithdrawDetails('');
    setWithdrawSuccess(isAr ? '🚀 تم إرسال طلب السحب بنجاح! سيقوم المشرف المالي بمراجعة الطلب وتحويله خلال 24 ساعة.' : '🚀 Withdrawal request submitted successfully! Funds will be reviewed in 24 hours.');
    
    // Auto clear success
    setTimeout(() => setWithdrawSuccess(''), 5000);
  };

  const handleExportLedger = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [
          [isAr ? 'رقم الحركة' : 'ID', isAr ? 'الطالب' : 'Student', isAr ? 'هاتف الطالب' : 'Student Phone', isAr ? 'الكورس المستهدف' : 'Target Course', isAr ? 'قيمة الاشتراك' : 'Price', isAr ? 'حصتك' : 'Rate', isAr ? 'صافي ربحك' : 'Teacher Payout', isAr ? 'التاريخ والوقت' : 'Timestamp'].join(','),
          ...filteredSales.map((sale: any) => {
            const rate = courseRates[sale.courseId] !== undefined ? courseRates[sale.courseId] : (teacherRates[teacherName] !== undefined ? teacherRates[teacherName] : 70);
            const payout = (sale.price * rate) / 100;
            return [
              sale.id, 
              `"${sale.studentName}"`, 
              sale.studentPhone, 
              `"${sale.courseTitle}"`, 
              sale.price, 
              `${rate}%`, 
              payout, 
              `"${new Date(sale.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}"`
            ].join(',');
          })
        ].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ledger_${teacherName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWithdrawals = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [
          [isAr ? 'رقم الطلب' : 'ID', isAr ? 'القناة' : 'Method', isAr ? 'البيانات' : 'Details', isAr ? 'المبلغ' : 'Amount', isAr ? 'الحالة' : 'Status', isAr ? 'التاريخ والوقت' : 'Timestamp'].join(','),
          ...withdrawalRequests.filter(w => w.teacherName === teacherName).map((req: any) => {
            return [
              req.id, 
              `"${methodNamesMap[req.method]?.[lang] || req.method}"`,
              `"${req.details || ''}"`,
              req.amount,
              req.status === 'completed' ? (isAr ? 'اكتملت التحويل' : 'Completed') : (isAr ? 'قيد المراجعة' : 'Pending'),
              `"${new Date(req.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}"`
            ].join(',');
          })
        ].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `withdrawals_${teacherName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Static list for methods translations
  const methodNamesMap: Record<string, { ar: string, en: string }> = {
    vodafone: { ar: 'فودافون كاش', en: 'Vodafone Cash Wallet' },
    egypt_post: { ar: 'الحساب البريدي المصري', en: 'Egypt Post Account' },
    bank: { ar: 'التحويل الإلكتروني البنكي', en: 'Bank Wire Transfer' },
    stc: { ar: 'STC Pay (المملكة العربية السعودية)', en: 'STC Pay Wallet KSA' }
  };

  return (
    <div className="space-y-8 text-right">
      
      {/* Dynamic Notifications / Toasts Alerts */}
      <AnimatePresence>
        {withdrawSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300 text-xs font-black flex gap-2 shadow-md"
          >
            <CheckCircle2Icon className="h-5 w-5 shrink-0" />
            <span>{withdrawSuccess}</span>
          </motion.div>
        )}
        {withdrawError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300 text-xs font-black flex gap-2 shadow-md"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{withdrawError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title & Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <span className="p-2 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </span>
          <span>{isAr ? 'محرك تتبع الأرباح والحصص المالية للمدرس' : 'My Financial Shares & Profits Engine'}</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button 
            onClick={() => setShowLedgerModal(true)}
            className="px-5 py-2.5 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold rounded-xl text-xs transition shadow-sm"
          >
            📋 {isAr ? 'عرض دفتر الأستاذ المالي المباشر للاشتراكات' : 'View Financial Ledger'}
          </button>
          <button 
            onClick={() => setShowWithdrawalsModal(true)}
            className="px-5 py-2.5 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold rounded-xl text-xs transition shadow-sm"
          >
            🕒 {isAr ? 'عرض سجل عمليات التحويل والمستحقات المرفوعة' : 'View Payout Claims History'}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Balance (Current withdrawable) */}
        <div className="p-6 rounded-3xl bg-emerald-660 border-2 border-emerald-500/20 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700">
          <div className="absolute top-0 right-0 p-8 opacity-10 font-mono text-8xl shrink-0 pointer-events-none">WAL</div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] text-emerald-100 font-extrabold uppercase tracking-wider">{isAr ? 'الرصيد المتاح للسحب الجاري' : 'Withdrawable Wallet Balance'}</p>
            <p className="text-3xl font-black font-mono">
              {walletBalance.toLocaleString('en-US')}
              <span className="text-xs font-black mr-1">{currencySymbol}</span>
            </p>
            <div className="p-1 px-2.5 rounded-xl bg-white/10 border border-white/10 w-max text-[9px] font-bold flex items-center gap-1 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-405 animate-pulse bg-yellow-400" />
              <span>{isAr ? 'محدث لحظياً بعد كل اشتراك' : 'Updated Live'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cumulative Total Profits */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'إجمالي الأرباح المتراكمة (التاريخية)' : 'Total Cumulative Revenue'}</p>
              <p className="text-2xl font-black font-mono text-neutral-900 dark:text-white">
                {totalCumulativeEarnings.toLocaleString('en-US')}
                <span className="text-xs font-bold mr-1">{currencySymbol}</span>
              </p>
            </div>
            <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 rounded-2xl text-xl">📈</span>
          </div>
          <p className="text-[9px] text-neutral-400 font-bold border-t pt-2 mt-4">{isAr ? 'الحصيلة الكلية للاشتراكات المقيدة' : 'All time educator earnings accumulated'}</p>
        </div>

        {/* Card 3: Platform Share split */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'حصة ومشاركة المنصة التراكمية' : 'Platform share accumulated'}</p>
              <p className="text-2xl font-black font-mono text-neutral-600 dark:text-neutral-350">
                {platformEarningsShare.toLocaleString('en-US')}
                <span className="text-xs font-bold mr-1">{currencySymbol}</span>
              </p>
            </div>
            <span className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded-2xl text-xl">🏢</span>
          </div>
          <p className="text-[9px] text-neutral-400 font-bold border-t pt-2 mt-4">{isAr ? 'إجمالي ما آل للمنصة من عمولات تشغيل' : 'Platform operating margins'}</p>
        </div>

        {/* Card 4: Total subscriptions rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'النسبة الأساسية لأرباحك بالمنصة' : 'My Default Split Rate'}</p>
              <p className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {defaultDiscountPercentage}%
              </p>
            </div>
            <span className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-2xl text-xl">🏷️</span>
          </div>
          <p className="text-[9px] text-neutral-400 font-bold border-t pt-2 mt-4">{isAr ? 'منحك النظام نسبة متميزة وعالية' : 'Tutors rate of standard subscription price'}</p>
        </div>

      </div>

      {/* Main Sections: Course breakdown & Interactive withdrawals center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8 cols): Course Breakdowns & Ledger */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section A: Course breakdown detail */}
          <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'مستحقات وأرباح الكورسات التعليمية بالتفصيل' : 'Earnings Breakdown per Course'}</h4>
                <p className="text-[10px] text-neutral-450 mt-1">{isAr ? 'أداء كل كورس تملكه والمبيعات ومقارنة نسبة الأرباح الخاصة بك للتحقق من العوائد.' : 'Detailed metrics showing educator vs platform split ratios.'}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right whitespace-nowrap">
                <thead className="bg-neutral-55 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 font-black border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="p-3">{isAr ? 'عنوان الكورس ومناهجه الدراسية' : 'Course Details'}</th>
                    <th className="p-3">{isAr ? 'الاشتراكات' : 'Sales'}</th>
                    <th className="p-3 font-mono">{isAr ? `الافتتاحي الخام (${currencySymbol})` : `Gross (${currencySymbol})`}</th>
                    <th className="p-3 text-center">{isAr ? 'النسبة ماليًا' : 'Commission'}</th>
                    <th className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{isAr ? `أرباحك صافي (${currencySymbol})` : `Your Net Payout (${currencySymbol})`}</th>
                    <th className="p-3 font-mono text-neutral-450">{isAr ? `حصة المنصة (${currencySymbol})` : `Platform Cut (${currencySymbol})`}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-bold text-neutral-800 dark:text-neutral-250">
                  {courseBreakdown.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                      <td className="p-3 font-black">
                        <p className="text-xs text-neutral-900 dark:text-white max-w-xs truncate">{c.title}</p>
                        <span className="text-[8px] bg-indigo-100 text-indigo-805 px-1.5 py-0.5 rounded-md dark:bg-indigo-950/40 text-indigo-300 font-black">{c.level}</span>
                      </td>
                      <td className="p-3 font-mono font-black">{c.salesCount} {isAr ? 'طالب' : 'subs'}</td>
                      <td className="p-3 font-mono">{c.gross.toLocaleString('en-US')} ({currencySymbol})</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-[10px] font-black">
                          {c.rate}%
                        </span>
                      </td>
                      <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-black">{(c.tNet).toLocaleString('en-US')} {currencySymbol}</td>
                      <td className="p-3 font-mono text-neutral-450">{(c.pNet).toLocaleString('en-US')} {currencySymbol}</td>
                    </tr>
                  ))}
                  {courseBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center italic text-neutral-400">{isAr ? 'لم يتم العثور على أية كورسات مسجلة لك حالياً.' : 'No course data registered'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Interactive withdrawals center */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section C: Withdraw request center */}
          <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4 text-right">
            <h4 className="text-xs font-black text-neutral-900 dark:text-white pb-3 border-b flex items-center gap-1.5">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <span>{isAr ? 'طلب سحب رصيد الأرباح' : 'Request Earnings Payout'}</span>
            </h4>

            {withdrawalsEnabled ? (
              <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400">{isAr ? 'المبلغ المراد تحويله وصرفه' : 'Amount to withdraw'}</label>
                  <div className="relative">
                    <span className="absolute top-1/2 -translate-y-1/2 left-3 font-mono text-xs text-neutral-400 font-black">{currencySymbol}</span>
                    <input
                      type="number"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={isAr ? `الحد الأقصى: ${walletBalance}` : `Max: ${walletBalance}`}
                      className="w-full text-xs font-black py-2.5 pl-14 pr-3.5 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none text-left font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400">{isAr ? 'قناة أو حساب استلام الأرباح' : 'Payout channel'}</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e: any) => setWithdrawMethod(e.target.value)}
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none"
                  >
                    <option value="vodafone">{isAr ? 'محفظة فودافون كاش' : 'Vodafone Cash'}</option>
                    <option value="egypt_post">{isAr ? 'حساب البريد المصري' : 'Egypt Post Account'}</option>
                    <option value="bank">{isAr ? 'تحويل حساب بنكي إلكتروني' : 'Bank Transfer'}</option>
                    <option value="stc">{isAr ? 'محفظة STC Pay (السعودية)' : 'STC Pay (KSA)'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400">{isAr ? 'بيانات التحويل ومعلومات الاتصال' : 'Payout details / identifier'}</label>
                  <textarea
                    required
                    rows={2}
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder={
                      withdrawMethod === 'vodafone' 
                        ? (isAr ? 'اكتب رقم فودافون كاش (مثال: 01012345678)' : 'Vodafone Cash phone number')
                        : (isAr ? 'اكتب الاسم الرباعي ورقم التحويل بالتفصيل' : 'Enter billing details & credentials')
                    }
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={walletBalance <= 0}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black rounded-xl transition shadow-md shadow-indigo-600/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 leading-none cursor-pointer"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>{isAr ? 'تأكيد وإرسال طلب التحويل فوراً' : 'Submit Payout Transfer Request'}</span>
                </button>
              </form>
            ) : (
              <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900 text-center space-y-2">
                <div className="text-xl">🔒</div>
                <h5 className="text-[11px] font-black text-red-700 dark:text-red-400">
                  {isAr ? 'إجراءات سحب الأرباح معطلة مؤقتاً' : 'Payout Requests Temporarily Disabled'}
                </h5>
                <p className="text-[10px] text-red-650 dark:text-red-300 font-bold">
                  {isAr 
                    ? 'عذراً، تم إيقاف ميزة طلبات السحب في هذا الوقت من قبل المشرف العام لتسوية الحسابات اليدوية.' 
                    : 'Withdrawal submissions are locked at this period for administrator clearing audits.'
                  }
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Ledger Modal */}
      {showLedgerModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/60 dark:bg-neutral-950/80 backdrop-blur-xs" onClick={() => setShowLedgerModal(false)} />
          <div className="bg-white dark:bg-neutral-850 w-full max-w-5xl max-h-[90vh] rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-2xl relative z-10 flex flex-col animate-scale-up">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-right">
              <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white">{isAr ? 'دفتر الأستاذ المالي المباشر للاشتراكات' : 'Financial Ledger'}</h3>
                <p className="text-xs text-neutral-450 mt-1">{isAr ? 'أرشيف جميع عمليات الاشتراك لكورساتك الخاصة.' : 'Archive of all subscriptions.'}</p>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={handleExportLedger}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'تصدير (CSV)' : 'Export'}
                </button>
                <button
                  onClick={() => setShowLedgerModal(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-hidden flex-1 flex flex-col">
               {/* Filtering Controls */}
               <div className="flex flex-wrap gap-2 mb-4">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[10px] font-bold outline-none"
                  >
                    <option value="all">{isAr ? 'كل الكورسات' : 'All Courses'}</option>
                    {teacherCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e: any) => setDateFilter(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[10px] font-bold outline-none"
                  >
                    <option value="all">{isAr ? 'كل الفترات' : 'All periods'}</option>
                    <option value="month">{isAr ? 'الشهر الأخير' : 'Last 30 days'}</option>
                    <option value="year">{isAr ? 'العام الأخير' : 'Last Year'}</option>
                  </select>
                </div>

              <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin">
                <table className="w-full text-xs text-right whitespace-nowrap">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-400 font-extrabold border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 bg-neutral-50 dark:bg-neutral-900">{isAr ? 'رقم الحركة' : 'ID'}</th>
                      <th className="p-3 bg-neutral-50 dark:bg-neutral-900">{isAr ? 'الطالب' : 'Student'}</th>
                      <th className="p-3 bg-neutral-50 dark:bg-neutral-900">{isAr ? 'الكورس المستهدف' : 'Target Course'}</th>
                      <th className="p-3 font-mono bg-neutral-50 dark:bg-neutral-900">{isAr ? 'قيمة الاشتراك' : 'Price (Gross)'}</th>
                      <th className="p-3 text-center bg-neutral-50 dark:bg-neutral-900">{isAr ? 'حصتك' : 'Split Ratio'}</th>
                      <th className="p-3 font-mono text-emerald-600 dark:text-emerald-400 bg-neutral-50 dark:bg-neutral-900">{isAr ? 'صافي ربحك' : 'Teacher share'}</th>
                      <th className="p-3 font-mono text-neutral-450 bg-neutral-50 dark:bg-neutral-900">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-bold text-neutral-800 dark:text-neutral-250">
                    {filteredSales.map((sale: any) => {
                      const rate = courseRates[sale.courseId] !== undefined 
                        ? courseRates[sale.courseId] 
                        : (teacherRates[teacherName] !== undefined ? teacherRates[teacherName] : 70);
                      const payout = (sale.price * rate) / 100;
                      return (
                        <tr key={sale.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                          <td className="p-3 font-mono text-[9px] text-neutral-450">{sale.id}</td>
                          <td className="p-3 font-black text-neutral-900 dark:text-white">
                            <p>{sale.studentName}</p>
                            <span className="text-[8px] text-neutral-400 inline-block font-mono font-bold mt-0.5">{sale.studentPhone}</span>
                          </td>
                          <td className="p-3 max-w-xs truncate" title={sale.courseTitle}>📘 {sale.courseTitle}</td>
                          <td className="p-3 font-mono">{sale.price} {currencySymbol}</td>
                          <td className="p-3 text-center">
                            <span className="p-1 px-2.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 text-[9px] font-black">
                              {rate}%
                            </span>
                          </td>
                          <td className="p-3 font-mono text-emerald-650 dark:text-emerald-405 font-black">{payout} {currencySymbol}</td>
                          <td className="p-3 text-neutral-400 font-mono text-[9px]">
                            {new Date(sale.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-10 text-center italic text-neutral-400">
                          {isAr ? 'لا توجد أية اشتراكات مطابقة للفرز المحدد حالياً.' : 'No transactions matching filters'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawals History Modal */}
      {showWithdrawalsModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/60 dark:bg-neutral-950/80 backdrop-blur-xs" onClick={() => setShowWithdrawalsModal(false)} />
          <div className="bg-white dark:bg-neutral-850 w-full max-w-2xl max-h-[90vh] rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-2xl relative z-10 flex flex-col animate-scale-up">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-right">
               <div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white">{isAr ? 'سجل التحويلات والمستحقات المرفوعة' : 'Withdrawals History'}</h3>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={handleExportWithdrawals}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'تصدير (CSV)' : 'Export'}
                </button>
                <button
                  onClick={() => setShowWithdrawalsModal(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-right">
              <div className="space-y-3">
                {withdrawalRequests
                  .filter(w => w.teacherName === teacherName)
                  .map((req: any) => (
                    <div key={req.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="font-mono text-neutral-450">{req.id}</span>
                        {req.status === 'completed' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold">✓ {isAr ? 'تم التحويل وصرف المبلغ' : 'Transfer Completed'}</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-extrabold">⏱️ {isAr ? 'قيد التدقيق والتحقق' : 'Under Review'}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end text-sm font-black">
                        <span className="text-neutral-900 dark:text-white flex flex-col">
                          <span>{methodNamesMap[req.method]?.[lang] || req.method}</span>
                          <span className="text-[10px] text-neutral-400 font-mono mt-1 font-bold bg-neutral-200 dark:bg-neutral-800 p-1.5 rounded">{req.details}</span>
                        </span>
                        <span className="font-mono text-indigo-650 dark:text-indigo-400 text-lg">
                          {req.amount} {currencySymbol}
                        </span>
                      </div>

                      <p className="text-[10px] text-neutral-400 font-mono pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        📅 {new Date(req.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                  ))}
                {withdrawalRequests.filter(w => w.teacherName === teacherName).length === 0 && (
                  <p className="text-center italic text-neutral-400 text-sm py-12">{isAr ? 'لا توجد أية طلبات سحب مرفوعة مسبقاً.' : 'No payout requests initiated.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icon fallbacks inside the file to avoid import problems
function CheckCircle2Icon(props: any) {
  return <CheckCircle {...props} />;
}
