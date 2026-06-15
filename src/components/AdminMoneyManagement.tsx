import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, Banknote, ShieldAlert, Save, Plus, Trash2, 
  Settings, Globe, Search, Filter, ArrowUpRight, ArrowDownLeft, X, 
  Check, Clock, User, Phone, MapPin, Tag, RefreshCw, Calendar, Info, ChevronLeft, ArrowRightLeft, Download
} from 'lucide-react';
import { UserProfile } from '../utils/db';
import { exportToExcel } from '../utils/excelExport';

export interface FinancialTransaction {
  id: string;
  studentName: string;
  studentPhone: string;
  type: 'recharge' | 'purchase' | 'discount' | 'chargeback' | 'manual_adjustment';
  amount: number;
  currency: 'EGP' | 'SAR';
  courseTitle?: string;
  status: 'success' | 'failed' | 'pending';
  date: string; // ISO format
  method?: string; // Card / Fawry / Vodafone Cash / Admin / Voucher Code
  reference?: string;
  notes?: string;
}

interface AdminMoneyManagementProps {
  lang: 'ar' | 'en';
  users: UserProfile[]; // All users to extract students
  courses?: any[]; // Courses list for labels/prices
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
}

export default function AdminMoneyManagement({ 
  lang, 
  users, 
  courses = [],
  showToastSuccess, 
  showToastError 
}: AdminMoneyManagementProps) {
  const isAr = lang === 'ar';
  
  // State variables
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [activeTabSub, setActiveTabSub] = useState<'roster' | 'transactions'>('roster');

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<'all' | 'EG' | 'SA'>('all');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'recharge' | 'purchase' | 'discount' | 'manual_adjustment'>('all');
  const [txStatusFilter, setTxStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  
  // Loaded wallets registry mapping Name -> Bal (to avoid reading localStorage in loop)
  const [wallets, setWallets] = useState<Record<string, number>>({});

  // Get current date string for seed
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  // Load and seed initial states
  useEffect(() => {
    // 1. Get students list from component props
    const studentsOnly = users.filter(usr => usr.role === 'student');
    setStudents(studentsOnly);

    // 2. Fetch or seed wallet balances
    const tempWallets: Record<string, number> = {};
    studentsOnly.forEach((st, index) => {
      const storageKey = `sanad_wallet_${st.name}`;
      const savedBal = localStorage.getItem(storageKey);
      
      if (savedBal !== null) {
        tempWallets[st.name] = Number(savedBal);
      } else {
        // Seed realistic values for newly loaded students
        let seedVal = 0;
        if (index % 5 === 0) seedVal = 350;
        else if (index % 3 === 0) seedVal = 120;
        else if (index % 4 === 0) seedVal = 600;
        else if (index % 7 === 0) seedVal = 50;

        localStorage.setItem(storageKey, seedVal.toString());
        tempWallets[st.name] = seedVal;
      }
    });
    setWallets(tempWallets);

    // 3. Load or seed financial transactions ledger
    const rawTx = localStorage.getItem('sanad_financial_transactions_v1');
    if (rawTx) {
      try {
        setTransactions(JSON.parse(rawTx));
      } catch (e) {
         seedTransactions(studentsOnly);
      }
    } else {
      seedTransactions(studentsOnly);
    }
  }, [users]);

  // Seed Helper
  const seedTransactions = (studentList: UserProfile[]) => {
    if (studentList.length === 0) return;

    // Seed realistic audit entries
    const sampleTxs: FinancialTransaction[] = [
      {
        id: 'TX-88291',
        studentName: studentList[0]?.name || 'محمد صلاح عبد الحميد',
        studentPhone: studentList[0]?.phone || '01019283746',
        type: 'recharge',
        amount: 250,
        currency: studentList[0]?.country === 'SA' ? 'SAR' : 'EGP',
        status: 'success',
        date: getPastDateStr(0),
        method: 'Voucher (كارت شحن)',
        reference: 'SANAD250-XJ9W',
        notes: isAr ? 'شحن فوري عبر الكود الترويجي' : 'Prepaid Voucher top-up'
      },
      {
        id: 'TX-72121',
        studentName: studentList[1 % studentList.length]?.name || 'عبد الرحمن ناصر',
        studentPhone: studentList[1 % studentList.length]?.phone || '01128374950',
        type: 'purchase',
        amount: 150,
        currency: studentList[1 % studentList.length]?.country === 'SA' ? 'SAR' : 'EGP',
        courseTitle: isAr ? 'كورس الفيزياء التفاعلي - الصف الثالث الثانوي' : 'Interactive Physics Masterclass',
        status: 'success',
        date: getPastDateStr(1),
        method: 'Wallet (المحفظة)',
        reference: 'ACT-9302-PS',
        notes: isAr ? 'تفعيل تلقائي للمقرر الدراسي' : 'E-learning syllabus checkout auto'
      },
      {
        id: 'TX-55120',
        studentName: studentList[2 % studentList.length]?.name || 'سارة الأحمدي',
        studentPhone: studentList[2 % studentList.length]?.phone || '01299384756',
        type: 'recharge',
        amount: 500,
        currency: studentList[2 % studentList.length]?.country === 'SA' ? 'SAR' : 'EGP',
        status: 'success',
        date: getPastDateStr(2),
        method: 'Fawry كاش',
        reference: 'FW-82910774',
        notes: isAr ? 'مدفوع بـ فرع فوري' : 'Fawry cash payment'
      },
      {
        id: 'TX-33012',
        studentName: studentList[3 % studentList.length]?.name || 'خالد الحربي',
        studentPhone: studentList[3 % studentList.length]?.phone || '0558392182',
        type: 'discount',
        amount: 50,
        currency: studentList[3 % studentList.length]?.country === 'SA' ? 'SAR' : 'EGP',
        status: 'success',
        date: getPastDateStr(3),
        method: 'System (خصم ترويجي)',
        reference: 'DISC-WELCOME',
        notes: isAr ? 'رصيد ترحيبي للشحن الأول' : 'Welcome platform credit'
      },
      {
        id: 'TX-10931',
        studentName: studentList[4 % studentList.length]?.name || 'مريم عبد العزيز',
        studentPhone: studentList[4 % studentList.length]?.phone || '01538392104',
        type: 'recharge',
        amount: 100,
        currency: studentList[4 % studentList.length]?.country === 'SA' ? 'SAR' : 'EGP',
        status: 'pending',
        date: getPastDateStr(1),
        method: 'Vodafone Cash',
        reference: 'VC-3849102-PEND',
        notes: isAr ? 'بانتظار تأكيد إيصال المساعد' : 'Reviewing payment proof slip'
      },
      {
        id: 'TX-44021',
        studentName: studentList[0]?.name || 'محمد صلاح عبد الحميد',
        studentPhone: studentList[0]?.phone || '01019283746',
        type: 'recharge',
        amount: 300,
        currency: studentList[0]?.country === 'SA' ? 'SAR' : 'EGP',
        status: 'failed',
        date: getPastDateStr(4),
        method: 'كارت فيزا / ميزة',
        reference: 'ERR-66728-CARD',
        notes: isAr ? 'رصيد غير كافٍ بالبطاقة الائتمانية للدارس' : 'Card provider balance issues'
      },
    ];

    localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify(sampleTxs));
    setTransactions(sampleTxs);
  };

  // KPI Calculations
  const calculateTotalTrustFunds = () => {
    // Total prepaid wallet student custody
    return (Object.values(wallets) as number[]).reduce((a: number, b: number) => a + b, 0);
  };

  const calculateTotalEGTrust = () => {
    return students.filter(s => s.country === 'EG')
      .reduce((sum, s) => sum + (wallets[s.name] || 0), 0);
  };

  const calculateTotalSATrust = () => {
    return students.filter(s => s.country !== 'EG')
      .reduce((sum, s) => sum + (wallets[s.name] || 0), 0);
  };

  const calculateRechargesToday = () => {
    const todayStr = new Date().toISOString().substring(0, 10);
    return transactions
      .filter(t => t.type === 'recharge' && t.status === 'success' && t.date.startsWith(todayStr))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateCoursePurchasesTotal = () => {
    return transactions
      .filter(t => t.type === 'purchase' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleUpdateTransactionStatus = (txId: string, newStatus: 'success' | 'failed') => {
    const updated = transactions.map(tx => {
      if (tx.id === txId) {
        // If it was pending and now success, we MUST update the student's wallet balance
        if (tx.status === 'pending' && newStatus === 'success' && tx.type === 'recharge') {
          const storageKey = `sanad_wallet_${tx.studentName}`;
          const currentBal = Number(localStorage.getItem(storageKey) || '0');
          const newBal = currentBal + tx.amount;
          localStorage.setItem(storageKey, newBal.toString());
          
          // Update wallets local state for UI sync
          setWallets(prev => ({ ...prev, [tx.studentName]: newBal }));
        }
        return { ...tx, status: newStatus as any, notes: isAr ? `${tx.notes} (تم التحديث يدوياً من الأدمن)` : `${tx.notes} (Manually updated by admin)` };
      }
      return tx;
    });
    
    setTransactions(updated);
    localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify(updated));
    showToastSuccess?.(isAr ? '✅ تم تحديث حالة المعاملة المالية ومزامنة رصيد المحفظة بنجاح.' : '✅ Financial transaction status updated and wallet synced successfully.');
  };

  // Filtered Students list
  const filteredStudents = students.filter(st => {
    // Search Name or phone
    const matchSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        st.phone.includes(searchQuery) ||
                        (st.studentCode && st.studentCode.includes(searchQuery));
    
    // Country Filter
    const matchCountry = countryFilter === 'all' || st.country === countryFilter;
    
    return matchSearch && matchCountry;
  });

  // Filtered Transactions list
  const filteredTransactions = transactions.filter(tx => {
    // Search student name/phone/reference
    const matchSearch = tx.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.studentPhone.includes(searchQuery) ||
                        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
                        
    // Type Filter
    const matchType = txTypeFilter === 'all' || tx.type === txTypeFilter;
    
    // Status Filter
    const matchStatus = txStatusFilter === 'all' || tx.status === txStatusFilter;

    // Student specific list if selected student exists in details panel, we can focus too
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div id="admin-money-management-root" className="space-y-6 text-right font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-black font-sans">💼</span>
            <span>{isAr ? 'إدارة أموال وأرصدة الطلاب الكلية' : 'Student Ledger & Trust Fund Management'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-bold">
            {isAr 
              ? 'مراقبة مركزية آمنة لأرصدة شحن الطلاب والتتبع المالي المتكامل لجميع حركات المحفظة.' 
              : 'Detailed operational overview, trust balances tracking and quick adjustment center for admin desks.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              seedTransactions(students);
              showToastSuccess?.(isAr ? '🔄 تم تصفير وإعادة تعبئة سجل المعاملات الديمو لأغراض التوضيح والتدريب.' : '🔄 Sample ledger reseeded for demo.');
            }}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title={isAr ? 'إعادة ضبط العمليات' : 'Reset ledger entries'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة توليد العمليات' : 'Reseed Ledger'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: E-Wallet Total Prepaid Trust Custody */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 dark:from-indigo-950/20 dark:to-transparent border border-indigo-200 dark:border-indigo-900/40 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-black flex items-center gap-1">
                🛡️ {isAr ? 'إجمالي أرصدة الأمانات الكونية' : 'Total Custody / Trust Funds'}
              </span>
              <p className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white mt-1.5 font-sans">
                {calculateTotalTrustFunds().toLocaleString()} 
                <span className="text-xs font-semibold text-neutral-500 mr-1">{isAr ? 'وحدة رصيد' : 'Credits'}</span>
              </p>
            </div>
            <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-neutral-850 p-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 shadow-xs" />
          </div>
          <div className="border-t border-indigo-100/40 dark:border-indigo-900/20 pt-2.5 mt-4 flex items-center justify-between text-[10px] font-bold text-neutral-450 leading-relaxed">
            <span>{isAr ? 'مصر: ' : 'EG: '}{calculateTotalEGTrust()} ج.م</span>
            <span>{isAr ? 'السعودية: ' : 'SA: '}{calculateTotalSATrust()} ر.س</span>
          </div>
        </div>

        {/* KPI 2: Recharges Today */}
        <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                🟢 {isAr ? 'شحن المحفظة (اليوم)' : 'Wallet Recharged Today'}
              </span>
              <p className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white mt-1.5 font-sans">
                +{calculateRechargesToday().toLocaleString()}
                <span className="text-xs font-semibold text-neutral-500 mr-1">{isAr ? 'ج.م / ر.س' : 'Units'}</span>
              </p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-xl" />
          </div>
          <p className="text-[9px] text-neutral-400 font-semibold mt-3">
            {isAr ? '✓ يشمل شحن البطاقات والتحصيل بفروع المتاجر' : '✓ Includes coupon recharges and manual credits.'}
          </p>
        </div>

        {/* KPI 3: Course Purchases Spent */}
        <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-black">
                ⚡ {isAr ? 'إنفاق ومبيعات الكورسات' : 'Total Course Purchases'}
              </span>
              <p className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white mt-1.5 font-sans">
                {calculateCoursePurchasesTotal().toLocaleString()}
                <span className="text-xs font-semibold text-neutral-500 mr-1">{isAr ? 'ج.م / ر.س' : 'Units'}</span>
              </p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 p-1.5 rounded-xl" />
          </div>
          <p className="text-[9px] text-neutral-400 font-semibold mt-3">
            {isAr ? '✓ هنا تتحول الأمانات لأرباح فعلية بالمنصة' : '✓ When funds transition to platform/teachers real earnings.'}
          </p>
        </div>

        {/* KPI 4: Financial Principle Alert */}
        <div className="bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex gap-2 text-right">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-amber-800 dark:text-amber-400">{isAr ? 'عقيدة الصندوق المالي والأمانات' : 'E-Wallet Trust Custody Policy'}</h4>
              <p className="text-[9px] text-amber-900/80 dark:text-amber-300 leading-normal font-medium">
                {isAr 
                  ? 'رصيد المحفظة هو مال أمانة تملكه عائلة الطالب طالما لم يُنفق على الكورسات، ولا يظهر بكشوف الأرباح والمستحقات المباشرة.' 
                  : 'Prepaid credits remain student asset trust guarantees on-hold, they only register as revenue when course sales unlock.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* TABS SELECTOR & FILTERS SECTION */}
      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-xs space-y-4">
        
        {/* TABS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-150 dark:border-neutral-800 pb-4">
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTabSub('roster');
                setSearchQuery('');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTabSub === 'roster'
                  ? 'bg-indigo-650 text-white dark:bg-indigo-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              👥 {isAr ? 'أرصدة ومحافظ الطلاب الكلية' : 'Students Wallets'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTabSub('transactions');
                setSearchQuery('');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTabSub === 'transactions'
                  ? 'bg-indigo-650 text-white dark:bg-indigo-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              📋 {isAr ? 'سجل العمليات المالية الشامل' : 'Universal Operations Ledger'}
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => {
              if (activeTabSub === 'roster') {
                exportToExcel(
                  filteredStudents,
                  [
                    { header: isAr ? 'اسم الطالب': 'Student Name', key: 'name' },
                    { header: isAr ? 'رقم الهاتف': 'Phone', key: 'phone' },
                    { header: isAr ? 'الدولة': 'Country', key: 'country' },
                    { header: isAr ? 'المرحلة': 'Stage', key: 'stage' },
                    { header: isAr ? 'الصف': 'Grade', key: 'grade' },
                    { header: isAr ? 'الرصيد': 'Balance', key: (st) => wallets[st.name] || 0 }
                  ],
                  isAr ? 'كشف_رصيد_الطلاب' : 'Students_Balances_Report'
                );
              } else {
                exportToExcel(
                  filteredTransactions,
                  [
                    { header: isAr ? 'رمز العملية' : 'Transaction ID', key: 'id' },
                    { header: isAr ? 'اسم الطالب' : 'Student Name', key: 'studentName' },
                    { header: isAr ? 'رقم الهاتف' : 'Phone', key: 'studentPhone' },
                    { header: isAr ? 'نوع العملية' : 'Type', key: 'type' },
                    { header: isAr ? 'المبلغ' : 'Amount', key: 'amount' },
                    { header: isAr ? 'العملة' : 'Currency', key: 'currency' },
                    { header: isAr ? 'طريقة السداد' : 'Method', key: 'method' },
                    { header: isAr ? 'تاريخ المعاملة' : 'Date', key: 'date' },
                    { header: isAr ? 'الحالة' : 'Status', key: 'status' },
                    { header: isAr ? 'ملاحظات' : 'Notes', key: 'notes' }
                  ],
                  isAr ? 'سجل_العمليات_المالية' : 'Financial_Transactions_Report'
                );
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            {isAr ? 'تصدير Excel' : 'Export Excel'}
          </button>

          <div className="text-[11px] font-bold text-neutral-450 dark:text-neutral-400">
            {isAr ? 'تأتي الأرقام مباشرة وتتزامن فوراً مع العمليات' : 'Data pulls and synchronizes automatically on student activities'}
          </div>
        </div>

        {/* CONTROLS (SEARCH & FILTER DROPDOWNS) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Query search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-neutral-405 dark:text-neutral-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTabSub === 'roster' 
                  ? (isAr ? 'ابحث عن طالب بالاسم، الجوال أو الكود...' : 'Search student name, phone or registration code...')
                  : (isAr ? 'ابحث في السجلات بـالاسم، الرقم، أو رمز العملية...' : 'Search tx database by user, phone or transaction ID...')
              }
              className="w-full text-xs py-2.5 pr-9 pl-3 border rounded-xl outline-none dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-indigo-500 text-right font-bold"
            />
          </div>

          {/* Filters blocks */}
          <div className="md:col-span-7 flex flex-wrap gap-2 justify-end">
            
            {/* Country Selector (Applies on both tabs) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-0.5"><Globe className="w-3.5 h-3.5"/> {isAr ? 'الدولة:' : 'Country:'}</span>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value as any)}
                className="text-[11px] font-bold py-1.5 px-3 rounded-lg border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white cursor-pointer"
              >
                <option value="all">{isAr ? 'جميع الدول 🌍' : 'All countries 🌍'}</option>
                <option value="EG">{isAr ? 'مصر 🇪🇬' : 'Egypt 🇪🇬'}</option>
                <option value="SA">{isAr ? 'السعودية 🇸🇦' : 'Saudi 🇸🇦'}</option>
              </select>
            </div>

            {/* Custom filters specifically for transactions tab */}
            {activeTabSub === 'transactions' && (
              <>
                {/* Transaction Type */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-0.5"><Filter className="w-3.5 h-3.5"/> {isAr ? 'النوع:' : 'Type:'}</span>
                  <select
                    value={txTypeFilter}
                    onChange={(e) => setTxTypeFilter(e.target.value as any)}
                    className="text-[11px] font-bold py-1.5 px-3 rounded-lg border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white cursor-pointer"
                  >
                    <option value="all">{isAr ? 'كل العمليات 🔄' : 'All types 🔄'}</option>
                    <option value="recharge">{isAr ? 'شحن المحفظة 💰' : 'Voucher Top-up 💰'}</option>
                    <option value="purchase">{isAr ? 'شراء كورسات 🎓' : 'Course Purchases 🎓'}</option>
                    <option value="discount">{isAr ? 'خصم مالي ترويجي 🎁' : 'Syllabus Discount 🎁'}</option>
                    <option value="manual_adjustment">{isAr ? 'تعديل إداري ⚙️' : 'Admin custom ⚙️'}</option>
                  </select>
                </div>

                {/* Transaction Status */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-0.5">⏱️ {isAr ? 'حالة الدفع:' : 'Status:'}</span>
                  <select
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value as any)}
                    className="text-[11px] font-bold py-1.5 px-3 rounded-lg border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white cursor-pointer"
                  >
                    <option value="all">{isAr ? 'جميع الحالات الكونية' : 'All status'}</option>
                    <option value="success">{isAr ? 'ناجحة المقاصة 🟢' : 'Completed 🟢'}</option>
                    <option value="pending">{isAr ? 'بانتظار المراجعة ⏳' : 'Pending review ⏳'}</option>
                    <option value="failed">{isAr ? 'مرفوضة / فشلت 🛑' : 'Failed purchase 🛑'}</option>
                  </select>
                </div>
              </>
            )}

          </div>

        </div>

        {/* WORKSTAGE DIRECTORY TABLES */}
        <div className="border border-neutral-150 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
          
          {/* TAB 1: STUDENTS ROSTER */}
          {activeTabSub === 'roster' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-extrabold border-b border-neutral-200 dark:border-neutral-850 select-none">
                    <th className="p-3.5 pr-5 font-black">{isAr ? 'الدارس' : 'Student info'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'رقم الجوال' : 'Phone'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'الدولة والمنهج الدراسي' : 'Syllabus territory'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'المرحلة والصف' : 'Education details'}</th>
                    <th className="p-3.5 text-center font-black">{isAr ? 'رصيد أمانة المحفظة' : 'Primary Wallet custody'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                  {filteredStudents.map((st) => {
                    const balance = wallets[st.name] || 0;
                    return (
                      <tr 
                        key={st.name}
                        className="hover:bg-indigo-50/20 dark:hover:bg-neutral-800/40 duration-100"
                      >
                        {/* Student Name */}
                        <td className="p-3.5 pr-5">
                          <div className="flex items-center gap-2.5">
                            <span className="p-1 px-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg text-xs font-bold">👤</span>
                            <div>
                              <p className="font-extrabold text-neutral-950 dark:text-white">{st.name}</p>
                              {st.studentCode ? (
                                <p className="text-[10px] text-neutral-405 font-mono">Code: {st.studentCode}</p>
                              ) : (
                                <p className="text-[10px] text-neutral-400 italic font-mono">No code registered</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="p-3.5 font-mono text-neutral-700 dark:text-neutral-300">
                          {st.phone}
                        </td>

                        {/* Location / Country */}
                        <td className="p-3.5">
                          <span className="flex items-center gap-1.5">
                            <span>{st.country === 'EG' ? '🇪🇬' : '🇸🇦'}</span>
                            <span className="font-bold text-neutral-700 dark:text-neutral-300">
                              {st.country === 'EG' ? (isAr ? 'جمهورية مصر العربية' : 'Egypt') : (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia')}
                            </span>
                          </span>
                        </td>

                        {/* Stage Details */}
                        <td className="p-3.5">
                          <div>
                            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                              {st.stage === 'high' ? (isAr ? 'المرحلة الثانوية' : 'High school') : (isAr ? 'المرحلة الإعدادية' : 'Middle school')}
                            </p>
                            <p className="text-[10px] font-black text-neutral-450">{st.grade}</p>
                          </div>
                        </td>

                        {/* Balance */}
                        <td className="p-3.5 text-center">
                          <div className={`inline-block px-3 py-1.5 rounded-full font-mono text-xs font-extrabold shadow-sm ${
                            balance > 0 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60' 
                              : 'bg-neutral-100 text-neutral-450 dark:bg-neutral-800 dark:text-neutral-500'
                          }`}>
                            {balance.toLocaleString()} {st.country === 'SA' ? (isAr ? 'ريال' : 'SAR') : (isAr ? 'جنيه' : 'EGP')}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-neutral-400 italic">
                        {isAr ? 'لم يعثر النظام على أي حسابات طلاب مطابقة لمعايير البحث المعطاة.' : 'No students found matching current query.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS LIST */}
          {activeTabSub === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-extrabold border-b border-neutral-200 dark:border-neutral-850 select-none">
                    <th className="p-3.5 pr-5 font-black">{isAr ? 'رمز العملية' : 'Transaction Rec ID'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'الدارس' : 'Student name'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'النوع والمحتوى' : 'Type & Description'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'المقدار والعملة' : 'Subtotal cost'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'طريقة السداد / الكود المرجعي' : 'Channel & Coupon ref'}</th>
                    <th className="p-3.5 font-black">{isAr ? 'تاريخ المعاملة' : 'Timestamp'}</th>
                    <th className="p-3.5 text-center font-black">{isAr ? 'الحالة' : 'Gate status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                  {filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id}
                      className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 text-[11px]"
                    >
                      {/* ID */}
                      <td className="p-3.5 pr-5 font-mono font-extrabold text-neutral-400 select-all">
                        {tx.id}
                      </td>

                      {/* Student info */}
                      <td className="p-3.5">
                        <p className="font-extrabold text-neutral-900 dark:text-white">{tx.studentName}</p>
                        <p className="text-[10px] text-neutral-450 font-mono">{tx.studentPhone}</p>
                      </td>

                      {/* Type */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-md ${
                            tx.type === 'recharge' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : tx.type === 'purchase'
                              ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                              : tx.type === 'discount'
                              ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-805 dark:text-neutral-400'
                          }`}>
                            {tx.type === 'recharge' && (isAr ? 'شحن رصيد 💰' : 'Top-up 💰')}
                            {tx.type === 'purchase' && (isAr ? 'شراء مقرر 🎓' : 'Course activation 🎓')}
                            {tx.type === 'discount' && (isAr ? 'خصم مالي ترويجي 🎁' : 'Syllabus promo coupon 🎁')}
                            {tx.type === 'manual_adjustment' && (isAr ? 'تعديل إداري ⚙️' : 'Administrative change ⚙️')}
                            {tx.type === 'chargeback' && (isAr ? 'مسترجع مالي 📝' : 'Refund voucher 📝')}
                          </span>
                          <p className="text-[10px] text-neutral-700 dark:text-neutral-300 font-bold max-w-xs truncate">
                            {tx.courseTitle || tx.notes}
                          </p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className={`p-3.5 font-mono text-xs font-black ${
                        tx.type === 'recharge' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'
                      }`}>
                        {tx.type === 'recharge' ? '+' : '-'}{tx.amount} {tx.currency === 'SAR' ? 'SAR' : 'EGP'}
                      </td>

                      {/* Method Reference */}
                      <td className="p-3.5">
                        <p className="font-semibold text-neutral-800 dark:text-neutral-300">{tx.method || '-'}</p>
                        {tx.reference && (
                          <p className="text-[10px] font-bold text-neutral-400 font-mono select-all">Ref: {tx.reference}</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-3.5 font-mono text-neutral-500 text-[10px]">
                        {new Date(tx.date).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[9px] ${
                            tx.status === 'success'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300/30'
                              : tx.status === 'failed'
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-300/30'
                              : 'bg-amber-500/15 text-amber-600 border border-amber-300/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === 'success' ? 'bg-emerald-500' : tx.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            <span>{
                              tx.status === 'success' ? (isAr ? 'مقبول ومؤكد' : 'Success') :
                              tx.status === 'failed' ? (isAr ? 'فشلت العملية' : 'Failed') :
                              (isAr ? 'تحت المراجعة' : 'Pending')
                            }</span>
                          </span>

                          {tx.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdateTransactionStatus(tx.id, 'success')}
                                className="p-1 px-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                title={isAr ? 'تأكيد السداد' : 'Confirm Payment'}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleUpdateTransactionStatus(tx.id, 'failed')}
                                className="p-1 px-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                                title={isAr ? 'رفض العملية' : 'Reject Operation'}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-neutral-400 italic">
                        {isAr ? 'لا توجد أي معاملات مسجلة في كشف الحساب الموحد مطابقة لشروط الفرز.' : 'No financial transaction logs found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
