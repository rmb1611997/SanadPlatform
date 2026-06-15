import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Clock, CheckCircle2, XCircle, AlertCircle, Coins, 
  FileText, ArrowRight, ShieldCheck, HelpCircle, ChevronRight,
  TrendingDown, History, Check, Sparkles
} from 'lucide-react';

interface RefundRequest {
  id: string;
  studentName: string;
  studentPhone: string;
  courseId?: string;
  courseTitle: string;
  teacherName: string;
  amount: number;
  currency: 'EGP' | 'SAR';
  reason: string;
  notes?: string;
  type: 'course' | 'wallet';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
  timeline: { title: string; date: string; user: string }[];
}

interface StudentRefundsTabProps {
  user: any;
  lang: 'ar' | 'en';
}

export default function StudentRefundsTab({ user, lang }: StudentRefundsTabProps) {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState<'request' | 'history'>('request');
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  
  // Refund Flow States
  const [refundableCourses, setRefundableCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Wallet Refund States
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load student's requests
    const rawReqs = localStorage.getItem('sanad_refund_requests_v1');
    if (rawReqs) {
      try {
        const all = JSON.parse(rawReqs);
        const mine = all.filter((r: any) => r.studentPhone === user.phone || r.studentName === user.name);
        setRequests(mine);
      } catch (e) {}
    }

    // Load wallet balance
    const bal = localStorage.getItem(`sanad_wallet_${user.name}`);
    setWalletBalance(bal ? Number(bal) : 0);

    // Load refundable courses
    // Logic: Subscribed courses + purchased within last 7 days + no pending/completed refund request
    const purchasedIdsKey = `sanad_purchased_${user.name}`;
    const purchasedIdsRaw = localStorage.getItem(purchasedIdsKey);
    let purchasedIds: string[] = [];
    if (purchasedIdsRaw) {
      try { purchasedIds = JSON.parse(purchasedIdsRaw); } catch (e) {}
    }

    const salesRaw = localStorage.getItem('sanad_sales_v4');
    let mySales: any[] = [];
    if (salesRaw) {
      try {
        const allSales = JSON.parse(salesRaw);
        mySales = allSales.filter((s: any) => s.studentPhone === user.phone || s.studentName === user.name);
      } catch (e) {}
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const available = mySales.filter(sale => {
      // Must be in purchasedIds
      if (!purchasedIds.includes(sale.courseId)) return false;
      
      // Must be within 7 days
      const purchaseDate = new Date(sale.timestamp);
      if (purchaseDate < sevenDaysAgo) return false;

      // Must not have an active refund request for this specific course
      const rawAllReqs = localStorage.getItem('sanad_refund_requests_v1');
      if (rawAllReqs) {
        try {
          const allR = JSON.parse(rawAllReqs);
          const hasRequest = allR.some((r: any) => 
            (r.studentPhone === user.phone || r.studentName === user.name) && 
            r.courseId === sale.courseId && 
            (r.status === 'pending' || r.status === 'approved' || r.status === 'completed')
          );
          if (hasRequest) return false;
        } catch (e) {}
      }

      return true;
    });

    setRefundableCourses(available);
  };

  const handleCourseRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !refundReason) return;

    setIsSubmitting(true);
    
    const newRequest: RefundRequest = {
      id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName: user.name,
      studentPhone: user.phone,
      courseId: selectedCourse.courseId,
      courseTitle: selectedCourse.courseTitle,
      teacherName: selectedCourse.teacherName,
      amount: selectedCourse.price,
      currency: selectedCourse.studentCountry === 'SA' ? 'SAR' : 'EGP',
      reason: refundReason,
      type: 'course',
      status: 'pending',
      date: new Date().toISOString(),
      timeline: [
        { title: isAr ? 'تم تقديم طلب الاسترداد من قبل الطالب' : 'Refund request submitted by student', date: new Date().toISOString(), user: user.name }
      ]
    };

    saveRequest(newRequest);
  };

  const handleWalletRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAmount <= 0 || walletAmount > walletBalance || !refundReason) return;

    setIsSubmitting(true);

    const newRequest: RefundRequest = {
      id: `REF-W-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName: user.name,
      studentPhone: user.phone,
      courseTitle: isAr ? 'استرداد رصيد محفظة' : 'Wallet Balance Refund',
      teacherName: 'Sanad Platform',
      amount: walletAmount,
      currency: user.country === 'SA' ? 'SAR' : 'EGP',
      reason: refundReason,
      type: 'wallet',
      status: 'pending',
      date: new Date().toISOString(),
      timeline: [
        { title: isAr ? 'تم تقديم طلب استرداد رصيد المحفظة' : 'Wallet refund request submitted', date: new Date().toISOString(), user: user.name }
      ]
    };

    saveRequest(newRequest);
  };

  const saveRequest = (req: RefundRequest) => {
    const raw = localStorage.getItem('sanad_refund_requests_v1');
    let all: RefundRequest[] = [];
    if (raw) {
      try { all = JSON.parse(raw); } catch (e) {}
    }

    const updated = [req, ...all];
    localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(updated));
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(isAr ? '✅ تم إرسال طلبك بنجاح! سيتم مراجعته من قبل الإدارة.' : '✅ Request submitted successfully! Our team will review it shortly.');
      setRefundReason('');
      setSelectedCourse(null);
      setWalletAmount(0);
      loadData();
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-rose-500" />
              {isAr ? 'مركز طلبات الاسترداد' : 'Refund Support Desk'}
            </h2>
            <p className="text-xs text-neutral-500 font-bold max-w-lg">
              {isAr 
                ? 'نحن هنا لضمان حقك. يمكنك طلب استرداد قيمة الكورس خلال ٧ أيام من الاشتراك، أو سحب رصيد المحفظة التعليمية.' 
                : 'We ensure your satisfaction. Request a course refund within 7 days of purchase or withdraw your wallet credits.'}
            </p>
          </div>
          
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{isAr ? 'رصيد المحفظة الحالي' : 'Current Wallet'}</p>
              <p className="text-sm font-black text-indigo-650 dark:text-indigo-400 font-mono">
                {walletBalance} {user.country === 'SA' ? 'SAR' : 'EGP'}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-2 mt-8 p-1 bg-neutral-100 dark:bg-neutral-900 w-fit rounded-xl">
          <button 
            onClick={() => setActiveSubTab('request')} 
            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
              activeSubTab === 'request' 
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-200 dark:border-neutral-700' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'تقديم طلب جديد' : 'New Request'}
          </button>
          <button 
            onClick={() => setActiveSubTab('history')} 
            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
              activeSubTab === 'history' 
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-200 dark:border-neutral-700' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'سجل تذاكر الدعم' : 'Request History'}
            {requests.length > 0 && <span className="mr-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] rounded-full">{requests.length}</span>}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-400 text-xs font-bold animate-fade-in">
          <Check className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {activeSubTab === 'history' ? (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-50 dark:border-neutral-700 flex justify-between items-center">
            <h3 className="text-sm font-black flex items-center gap-2">
              <History className="h-4 w-4 text-neutral-400" />
              {isAr ? 'تتبع حالات الاسترداد المالي' : 'Track Cash-back Status'}
            </h3>
            <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full uppercase tracking-tighter shadow-inner">
              {isAr ? 'نظام المحاسبة المركزي' : 'Core Billing Audit'}
            </span>
          </div>

          <div className="p-6 space-y-4">
            {requests.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-neutral-300">
                  <FileText size={24} />
                </div>
                <p className="text-xs text-neutral-400 font-bold">{isAr ? 'لا توجد طلبات سابقة في سجلاتك.' : 'No previous refund tickets found.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-[10px] text-neutral-400 font-black uppercase tracking-wider border-b border-neutral-50 dark:border-neutral-700">
                      <th className="pb-4 pr-2">{isAr ? 'تاريخ التذكرة' : 'Ticket Date'}</th>
                      <th className="pb-4">{isAr ? 'الوصف / النوع' : 'Description'}</th>
                      <th className="pb-4">{isAr ? 'المبلغ' : 'Amount'}</th>
                      <th className="pb-4">{isAr ? 'حالة المراجعة' : 'Audit Status'}</th>
                      <th className="pb-4 text-center">{isAr ? 'التفاصيل' : 'Details'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-700">
                    {requests.map(req => (
                      <tr key={req.id} className="group">
                        <td className="py-4 pr-2">
                          <p className="text-[11px] font-black">{new Date(req.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</p>
                          <p className="text-[9px] text-neutral-400 font-mono">{req.id}</p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${req.type === 'course' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'}`}>
                              {req.type === 'course' ? <FileText size={14} /> : <Coins size={14} />}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">{req.courseTitle}</p>
                              <p className="text-[9px] text-neutral-400 font-medium">{req.teacherName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-xs font-black font-mono">{req.amount} {req.currency}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1 ${
                            req.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            req.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                            req.status === 'rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                            'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                               req.status === 'completed' ? 'bg-emerald-600' :
                               req.status === 'pending' ? 'bg-amber-600' : 'bg-rose-600'
                            }`} />
                            {isAr ? (
                              req.status === 'pending' ? 'قيد المراجعة' : 
                              req.status === 'approved' ? 'بانتظار التنفيذ' :
                              req.status === 'completed' ? 'تم التنفيذ' : 'مرفوض'
                            ) : req.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-all text-neutral-400 pointer-events-auto cursor-pointer">
                            <ChevronRight size={14} className={isAr ? 'rotate-180' : ''} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* COURSE REFUND FORM */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-2xl">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">{isAr ? 'استرداد قيمة كورس' : 'Syllabus Course Refund'}</h3>
                  <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'يمكنك استرداد الاشتراك خلال أول ٧ أيام.' : 'Valid for 7 days post-enrollment.'}</p>
                </div>
              </div>

              {refundableCourses.length > 0 ? (
                <form onSubmit={handleCourseRefundSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2 text-right">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">{isAr ? 'اختر الكورس المطلوب استرداده:' : 'Select Target Course:'}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {refundableCourses.map(sale => (
                        <button
                          key={sale.id}
                          type="button"
                          onClick={() => setSelectedCourse(sale)}
                          className={`p-3 rounded-2xl text-right border-2 transition-all flex items-center justify-between gap-3 ${
                            selectedCourse?.id === sale.id 
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20' 
                              : 'border-neutral-50 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-right">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                              <Sparkles className="h-5 w-5 text-indigo-200" />
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-black text-neutral-900 dark:text-neutral-100">{sale.courseTitle}</p>
                              <p className="text-[9px] text-neutral-400 font-bold">{sale.teacherName}</p>
                            </div>
                          </div>
                          <div className="text-left font-mono">
                            <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 leading-none">{sale.price} {sale.studentCountry === 'SA' ? 'SAR' : 'EGP'}</p>
                            <p className="text-[8px] text-neutral-400 mt-1">{new Date(sale.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedCourse && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                      <div className="space-y-1.5 text-right">
                        <label className="text-[10px] font-black text-neutral-400 block">{isAr ? 'سبب طلب الاسترداد (إلزامي):' : 'Reason for refund (Mandatory):'}</label>
                        <textarea
                          required
                          value={refundReason}
                          onChange={e => setRefundReason(e.target.value)}
                          placeholder={isAr ? 'مثلاً: خطأ في اختيار المادة، مشاكل تقنية...' : 'e.g. Purchased error, technical issue...'}
                          className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:border-indigo-600 outline-none min-h-[80px]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin text-white" /> : <ShieldCheck className="h-4 w-4" />}
                        {isAr ? 'تأكيد إرسال طلب تصفير الاشتراك' : 'Submit Enrollment Cancellation'}
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="py-10 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-700 text-center px-6">
                  <div className="mx-auto w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 mb-3">
                    <HelpCircle size={20} />
                  </div>
                  <p className="text-xs text-neutral-500 font-bold leading-relaxed">
                    {isAr 
                      ? 'عذراً، لا تمتلك حالياً أي اشتراكات قابلة للاسترداد. الشروط: أن يكون الاشتراك خلال آخر ٧ أيام، ولم يتم استرداده مسبقاً.' 
                      : 'You currently have no refundable courses. Requirements: Purchased within the last 7 days and no previous requests.'}
                  </p>
                </div>
              )}
            </div>

            {/* Refund Info Protocol */}
            <div className="mt-8 p-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-10 h-full bg-rose-500/5" />
               <h4 className="text-[10px] font-black text-rose-800 dark:text-rose-400 flex items-center gap-1.5 mb-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {isAr ? 'سياسة الاسترداد الفوري' : 'Automated Refund Policy'}
               </h4>
               <p className="text-[9px] text-neutral-500 dark:text-neutral-450 leading-relaxed font-bold">
                 {isAr 
                   ? 'بمجرد الموافقة على طلبك وتنفيذه: سيتم إلغاء وصولك للكورس ودروسه فوراً، وسيتم إعادة المبلغ كاملاً إلى محفظتك التعليمية لاستخدامه في مواد أخرى.' 
                   : 'Upon approval: Course access will be revoked immediately, and the full value will be credited back to your student wallet.'}
               </p>
            </div>
          </div>

          {/* WALLET WITHDRAWAL FORM */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-2xl">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">{isAr ? 'سحب رصيد المحفظة' : 'Wallet Credit Withdrawal'}</h3>
                  <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'سحب المبالغ المتاحة إلى وسيلة استلام نقدية.' : 'Withdraw funds to an external payout method.'}</p>
                </div>
              </div>

              {walletBalance > 0 ? (
                <form onSubmit={handleWalletRefundSubmit} className="space-y-5 pt-4">
                  <div className="space-y-2 text-right">
                    <label className="text-[10px] font-black text-neutral-400 block">{isAr ? 'حدد المبلغ المطلوب سحبه:' : 'Amount to withdraw:'}</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={walletBalance}
                        required
                        value={walletAmount || ''}
                        onChange={e => setWalletAmount(Number(e.target.value))}
                        placeholder={isAr ? 'أدخل المبلغ هنا...' : 'Enter amount...'}
                        className="w-full p-4 pl-12 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm font-black outline-none focus:border-amber-500"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400">
                        {user.country === 'SA' ? 'SAR' : 'EGP'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                       <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'الرصيد المتاح حالياً' : 'Current Balance'}</p>
                       <p className="text-[10px] font-black text-neutral-800 dark:text-neutral-200 font-mono">{walletBalance} {user.country === 'SA' ? 'SAR' : 'EGP'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-[10px] font-black text-neutral-400 block">{isAr ? 'وسيلة الاستلام المفضلة وملاحظات إضافية:' : 'Payout Method & Additional Notes:'}</label>
                    <textarea
                      required
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      placeholder={isAr ? 'مثلاً: فودافون كاش على رقم 01xx، أو STC Pay...' : 'e.g. Vodafone Cash to 01xx, or STC Pay...'}
                      className="w-full p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:border-amber-500 outline-none min-h-[100px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || walletAmount <= 0 || walletAmount > walletBalance}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
                    {isAr ? 'طلب سحب رصيد نقدي' : 'Request Cash Withdrawal'}
                  </button>
                </form>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-neutral-200">
                    <Coins size={32} />
                  </div>
                  <p className="text-xs text-neutral-400 font-bold px-10">
                    {isAr 
                      ? 'رصيدك الحالي صفر. اشحن محفظتك أو ابدأ التعلم لتتمكن من إجراء العمليات المالية.' 
                      : 'Your wallet is empty. Top up or start learning to process finances.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-700/50 rounded-2xl flex items-start gap-3">
              <div className="p-1.5 bg-white dark:bg-neutral-800 rounded-lg text-neutral-400 shadow-xs">
                <HelpCircle size={14} />
              </div>
              <p className="text-[9px] text-neutral-400 leading-normal font-bold">
                {isAr 
                  ? 'يتم تحويل المبالغ النقدية يدوياً من خلال قسم المحاسبة خلال ٢٤-٤٨ ساعة عمل بعد التأكد من بيانات التحويل المرسلة.' 
                  : 'Withdrawals are processed manually by our finance team within 24-48 working hours after data verification.'}
              </p>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
