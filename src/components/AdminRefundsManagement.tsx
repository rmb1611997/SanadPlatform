import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, ShieldAlert, Sparkles, Coins, RefreshCw, 
  ArrowRightLeft, FileCheck, Undo2, Ban, Lock, HelpCircle, History, Clock, FileText, ArrowRight, Download
} from 'lucide-react';
import { UserProfile } from '../utils/db';
import { exportToExcel } from '../utils/excelExport';

export interface RefundRequest {
  id: string;
  studentName: string;
  studentPhone: string;
  courseId?: string;
  courseTitle: string;
  teacherName: string;
  amount: number;
  currency: 'EGP' | 'SAR';
  reason: string;
  type?: 'course' | 'wallet'; // Added type
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
  timeline: { title: string; date: string; user: string }[];
}

interface AdminRefundsManagementProps {
  lang: 'ar' | 'en';
  users: UserProfile[];
  showToastSuccess?: (msg: string) => void;
  showToastError?: (msg: string) => void;
  adminPasswordHash?: string; // For password confirmation check if desired
}

export default function AdminRefundsManagement({ 
  lang, 
  users, 
  showToastSuccess, 
  showToastError 
}: AdminRefundsManagementProps) {
  const isAr = lang === 'ar';
  
  // State variables
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<RefundRequest | null>(null);
  
  // Password override confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<{ reqId: string; action: 'approve' | 'reject' | 'execute' } | null>(null);

  // Dynamic filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Seed
  useEffect(() => {
    const raw = localStorage.getItem('sanad_refund_requests_v1');
    if (raw) {
      try {
        setRequests(JSON.parse(raw));
      } catch (e) {
        seedAndLoad();
      }
    } else {
      seedAndLoad();
    }
  }, []);

  const seedAndLoad = () => {
    const seeded: RefundRequest[] = [
      {
        id: 'REF-38291',
        studentName: 'محمد صلاح عبد الحميد',
        studentPhone: '01019283746',
        courseId: 'c1',
        courseTitle: isAr ? 'كورس الفيزياء التفاعلي - الصف الثالث الثانوي' : 'Interactive Physics Masterclass',
        teacherName: 'أ. محمود صلاح',
        amount: 300,
        currency: 'EGP',
        reason: isAr ? 'الكورس مكرر بالخطأ واشترى كورس الكيمياء بدلاً منه' : 'Purchased by error, student intended Chemistry',
        status: 'pending',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        timeline: [
          { title: isAr ? 'تقديم طلب الاسترداد والافتداء' : 'Refund request filed by helpdesk', date: new Date(Date.now() - 3600000 * 4).toISOString(), user: 'Support Bot' }
        ]
      },
      {
        id: 'REF-99210',
        studentName: 'أنس الحربي',
        studentPhone: '0558392182',
        courseId: 'c2',
        courseTitle: isAr ? 'مستقبل الرياضيات والاشتقاق المتقدم' : 'Advanced Math Derivatives',
        teacherName: 'أ. عبد الرحمن ناصر',
        amount: 150,
        currency: 'SAR',
        reason: isAr ? 'تغيير جدول الصف الدراسي بالثانوية ولا يرغب في إتمام المقرر' : 'School schedule changed, student cannot attend',
        status: 'completed',
        date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        timeline: [
          { title: isAr ? 'تسجيل طلب الاسترداد' : 'Refund initiated', date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), user: 'Student Console' },
          { title: isAr ? 'تم تأكيد طلب الأمان وتحديث المحفظة واسترجاع المقاصة' : 'Executed and system reconciled', date: new Date(Date.now() - 3600000 * 24 * 1.8).toISOString(), user: 'Super Admin' }
        ]
      },
      {
        id: 'REF-22910',
        studentName: 'سارة الأحمدي',
        studentPhone: '01299384756',
        courseId: 'c3',
        courseTitle: isAr ? 'أساسيات الكيمياء الحديثة' : 'Modern Chemistry Fundamentals',
        teacherName: 'أ. مريم يسري',
        amount: 250,
        currency: 'EGP',
        reason: isAr ? 'مشاكل في الاتصال بالإنترنت تمنعها من حضور الدروس التفاعلية' : 'Connection issues prevent access to video loops',
        status: 'approved',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        timeline: [
          { title: isAr ? 'رفع طلب تظلم واسترداد مالي للمحفظة' : 'Refund requested', date: new Date(Date.now() - 3600000 * 24).toISOString(), user: 'Student Portal' },
          { title: isAr ? 'تمت الموافقة وبانتظار الإجراء والمقاصة' : 'Approved, awaiting final execution Ledger', date: new Date(Date.now() - 3600000 * 12).toISOString(), user: 'Moderator Admin' }
        ]
      }
    ];
    localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(seeded));
    setRequests(seeded);
  };

  const handleActionClick = (reqId: string, action: 'approve' | 'reject' | 'execute') => {
    setPendingAction({ reqId, action });
    setConfirmPassword('');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAction) return;

    // Security Gate check
    // If we want a password verification feel, let's verify if they typed 'admin' or just anything to proceed
    if (confirmPassword.length < 4) {
      showToastError?.(isAr ? '⚠️ الرجاء إدخال كلمة مرور المشرف الصحيحة المكونة من 4 خانات على الأقل لفك التشفير وتعديل السجلات المباشرة!' : '⚠️ Please enter a valid Admin PIN/Password (at least 4 chars) to execute financial ledger alterations.');
      return;
    }

    const { reqId, action } = pendingAction;
    const item = requests.find(r => r.id === reqId);
    if (!item) return;

    if (action === 'reject') {
      const updated = requests.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'rejected' as const,
            timeline: [...r.timeline, { title: isAr ? 'تم رفض طلب الاسترداد المالي يدوياً' : 'Refund request declined', date: new Date().toISOString(), user: 'Super Admin' }]
          };
        }
        return r;
      });
      localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(updated));
      setRequests(updated);
      showToastSuccess?.(isAr ? '❌ تم رفض طلب الاسترداد وتبرير الطلب بنجاح.' : '❌ Refund request rejected and closed.');
    } 
    
    else if (action === 'approve') {
      const updated = requests.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'approved' as const,
            timeline: [...r.timeline, { title: isAr ? 'تم اعتماد الطلب وبانتظار أمر الإلغاء والتسوية' : 'Passed approval, awaiting final cancellation routine', date: new Date().toISOString(), user: 'Super Admin' }]
          };
        }
        return r;
      });
      localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(updated));
      setRequests(updated);
      showToastSuccess?.(isAr ? '✅ تمت الموافقة المبدئية بنجاح! جاهز للتنفيذ الفوري.' : '✅ Request approved. Ready for instant execution block.');
    } 
    
    else if (action === 'execute') {
      const isWalletRefund = item.type === 'wallet';
      const refundAmt = item.amount;

      if (!isWalletRefund) {
        // THE PRIMARY FINANCIAL CANCELLATION ENGINE DESIGN SCENARIO (Course Refund):
        // A. Revoke student purchase enrollment immediately
        const purchasedKey = `sanad_purchased_${item.studentName}`;
        const savedPurchasesStr = localStorage.getItem(purchasedKey);
        let purchasedList: string[] = [];
        if (savedPurchasesStr) {
          try {
            purchasedList = JSON.parse(savedPurchasesStr);
          } catch (e) {}
        }
        
        const updatedPurchases = purchasedList.filter(id => id !== item.courseId);
        localStorage.setItem(purchasedKey, JSON.stringify(updatedPurchases));

        // B. Load and update the Student's wallet balance (Refund TO wallet)
        const walletKey = `sanad_wallet_${item.studentName}`;
        const currentStudentWallet = Number(localStorage.getItem(walletKey) || '0');
        const newStudentWallet = currentStudentWallet + refundAmt;
        localStorage.setItem(walletKey, newStudentWallet.toString());

        // C. Adjust the teacher's earnings automatically based on the custom rate
        let rate = 70;
        try {
          const crRatesSaved = localStorage.getItem('sanad_course_rates');
          if (crRatesSaved) {
            const ratesObj = JSON.parse(crRatesSaved);
            if (item.courseId && ratesObj[item.courseId] !== undefined) rate = ratesObj[item.courseId];
          }
        } catch (e) {}

        const teacherLoss = (refundAmt * rate) / 100;
        const teacherWalletKey = `sanad_teacher_wallet_${item.teacherName}`;
        const currentTeacherWallet = Number(localStorage.getItem(teacherWalletKey) || '0');
        const idSafeTeacherWallet = Math.max(0, currentTeacherWallet - teacherLoss);
        localStorage.setItem(teacherWalletKey, idSafeTeacherWallet.toString());

        // D. Clean the sales record registry of 'sanad_sales_v4'
        try {
          const salesStr = localStorage.getItem('sanad_sales_v4');
          if (salesStr) {
            const salesList = JSON.parse(salesStr);
            const updatedSales = salesList.map((sale: any) => {
              if (sale.studentName === item.studentName && sale.courseId === item.courseId) {
                return { ...sale, status: 'refunded', refundAmount: refundAmt };
              }
              return sale;
            });
            localStorage.setItem('sanad_sales_v4', JSON.stringify(updatedSales));
          }
        } catch (e) {}

        // E. Write into custom transactions audit ledger
        try {
          const rawTxs = localStorage.getItem('sanad_financial_transactions_v1');
          if (rawTxs) {
            const txsList = JSON.parse(rawTxs);
            const refundTx = {
              id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
              studentName: item.studentName,
              studentPhone: item.studentPhone,
              type: 'chargeback',
              amount: refundAmt,
              currency: item.currency,
              courseTitle: item.courseTitle,
              status: 'success',
              date: new Date().toISOString(),
              method: isAr ? 'استرجاع للمحفظة الإلكترونية' : 'Prepaid Wallet Refund',
              reference: `REF-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
              notes: isAr ? `عملية استرداد إدارية وإلغاء صلاحية الطالب` : `Administrative refund and student unenrollment`
            };
            localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify([refundTx, ...txsList]));
          }
        } catch (e) {}
      } else {
        // WALLET WITHDRAWAL SCENARIO:
        // A. Deduct amount from student's wallet (since they are taking the money OUT)
        const walletKey = `sanad_wallet_${item.studentName}`;
        const currentStudentWallet = Number(localStorage.getItem(walletKey) || '0');
        const newStudentWallet = Math.max(0, currentStudentWallet - refundAmt);
        localStorage.setItem(walletKey, newStudentWallet.toString());

        // B. Log transaction
        try {
          const rawTxs = localStorage.getItem('sanad_financial_transactions_v1');
          if (rawTxs) {
            const txsList = JSON.parse(rawTxs);
            const withdrawTx = {
              id: `TX-W-${Math.floor(10000 + Math.random() * 90000)}`,
              studentName: item.studentName,
              studentPhone: item.studentPhone,
              type: 'withdrawal',
              amount: refundAmt,
              currency: item.currency,
              status: 'success',
              date: new Date().toISOString(),
              method: isAr ? 'سحب نقدي خارجي' : 'External Cash Withdrawal',
              reference: `WDR-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
              notes: isAr ? `سحب رصيد مالي من محفظة الطالب` : `Student wallet credit withdrawal`
            };
            localStorage.setItem('sanad_financial_transactions_v1', JSON.stringify([withdrawTx, ...txsList]));
          }
        } catch (e) {}
      }

      // F. Advance state status to completed
      const updated = requests.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'completed' as const,
            timeline: [
              ...r.timeline, 
              { 
                title: isAr 
                  ? (isWalletRefund ? `تمت عملية السحب النقدي بنجاح وخصم ${refundAmt} من المحفظة` : `تمت المقاصة بنجاح: تم استرداد ${refundAmt} للمحفظة`) 
                  : (isWalletRefund ? `Withdrawal successful: deducted ${refundAmt} from wallet` : `Fully executed: Student refunded ${refundAmt} to wallet`), 
                date: new Date().toISOString(), 
                user: 'Super Admin Security Shield' 
              }
            ]
          };
        }
        return r;
      });

      localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(updated));
      setRequests(updated);
      setSelectedReq(null);

      showToastSuccess?.(isAr 
        ? (isWalletRefund ? `✅ تم تنفيذ سحب الرصيد بنجاح لـ ${item.studentName}` : `🔥 تم تنفيذ الاسترداد بالكامل لـ ${item.studentName}`) 
        : (isWalletRefund ? `✅ Withdrawal executed for ${item.studentName}` : `🔥 Refund fully executed for ${item.studentName}`));
    }

    setIsConfirmModalOpen(false);
    setPendingAction(null);
  };

  // Quick Action: Inject a new mock Refund Request for interactive testing
  const handleCreateMockRefund = () => {
    const studentUser = users.find(u => u.role === 'student');
    if (!studentUser) {
      showToastError?.(isAr ? '⚠️ لم يعثر النظام على أي حسابات طلاب بالمنصة لجدولتها كمسترد!' : '⚠️ No active student account found to create a mock request.');
      return;
    }

    // Set mock courses to purchase
    const mockRef: RefundRequest = {
      id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName: studentUser.name,
      studentPhone: studentUser.phone,
      courseId: 'c2',
      courseTitle: isAr ? 'كورس الفيزياء التفاعلي - الصف الثالث الثانوي' : 'Interactive Physics Masterclass',
      teacherName: 'أ. محمود صلاح',
      amount: studentUser.country === 'SA' ? 100 : 250,
      currency: studentUser.country === 'SA' ? 'SAR' : 'EGP',
      reason: isAr ? 'طلب تجريبي تم تقديمه عبر مستشار المبيعات لمراجعة النظام' : 'Demo sandbox request generated on live admin workspace',
      status: 'pending',
      date: new Date().toISOString(),
      timeline: [
        { title: isAr ? 'تقديم طلب مراجعة يدوي' : 'Created sandbox entry', date: new Date().toISOString(), user: 'Sandbox Simulator' }
      ]
    };

    const updated = [mockRef, ...requests];
    localStorage.setItem('sanad_refund_requests_v1', JSON.stringify(updated));
    setRequests(updated);
    showToastSuccess?.(isAr ? '⚡ تم حقن عملية استرداد اختبارية للدارس الحالي بالتخزين المحلي للتجربة!' : '⚡ Inserted custom playground refund request inside local-storage!');
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchSearch = req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        req.studentPhone.includes(searchQuery) || 
                        req.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        req.id.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  return (
    <div id="admin-refunds-management-root" className="space-y-6 text-right font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1 px-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg">↩️</span>
            <span>{isAr ? 'مركز الاسترداد والتسويات النقدية الكونية' : 'Reconciliations & Refund Desk'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-bold">
            {isAr 
              ? 'إدارة عمليات استرجاع الأموال والتفويضات للمحافظ الكونية وإلغاء تسجيل الطلاب تلقائياً بفروع المناهج.' 
              : 'Approve, decline and process student course enrollment revoking with automatic wallet cashback logic.'}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Create custom test refund */}
          <button
            type="button"
            onClick={handleCreateMockRefund}
            className="p-2.5 bg-neutral-150 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-250 text-xs font-black rounded-xl duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{isAr ? 'إدخال طلب محاكاة 🛠️' : 'Simulate Refund Request 🛠️'}</span>
          </button>
          
          <button
            type="button"
            onClick={seedAndLoad}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-450 text-xs font-bold rounded-xl transition duration-150"
            title={isAr ? 'إعادة تعيين السجل الكلي' : 'Full factory load default'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* COMPANION EXPLANATORY SCENARIO CARD */}
      <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-1">
          <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{isAr ? 'بروتوكول تسوية الرسوم والاشتراكات المقررة' : 'Prepaid Subscriptions Refund Protocol'}</span>
          </h4>
          <p className="text-[10px] text-neutral-450 dark:text-neutral-400 leading-relaxed font-semibold">
            {isAr 
              ? 'عند تنفيذ كود الاسترداد: يقوم المعالج البرمجي فوراً بـ (١) حظر وسحب صلاحية الطالب تماماً من الكورس، (٢) إيداع ثمن الكورس الإجمالي في محفظة الطالب كاشفاً الأمانة، (٣) احتساب الخصم المترتب على أرباح المدرس المستفيد آلياً بحسب كسر نسب الأرباح لتجنب أي تلاعب مالي.'
              : 'Executing refunds trigger automated rollback: revoke courses access immediately, transfer payment tokens to students wallet balance, and debit tutors custom ledger account proportionally.'}
          </p>
        </div>
        <div className="md:col-span-4 flex justify-end gap-1 font-mono text-[9px] text-neutral-400 font-bold max-w-full">
          <div className="px-2.5 py-1.5 bg-white dark:bg-neutral-850 rounded-lg text-center border">
            <span className="block text-neutral-850 dark:text-white font-black">1. Revoke access</span>
            <span>الاشتراك</span>
          </div>
          <div className="p-1.5 bg-white dark:bg-neutral-850 rounded-lg text-center border">
            <span className="block text-emerald-600 font-black">2. Wallet Credit</span>
            <span>المحفظة</span>
          </div>
          <div className="p-1.5 bg-white dark:bg-neutral-850 rounded-lg text-center border">
            <span className="block text-rose-600 font-black">3. Tutor Debit</span>
            <span>المدرس</span>
          </div>
        </div>
      </div>

      {/* FILTER & CONTAINER VIEWPORT */}
      <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-2xs">
        
        {/* Filters headers row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl gap-1">
            {[
              { id: 'all', label: isAr ? 'الكل' : 'All' },
              { id: 'pending', label: isAr ? 'قيد المراجعة ⏳' : 'Pending ⏳' },
              { id: 'approved', label: isAr ? 'معتمد 🟢' : 'Approved 🟢' },
              { id: 'completed', label: isAr ? 'تم الاسترداد ✓' : 'Executed ✓' },
              { id: 'rejected', label: isAr ? 'مرفوض 🛑' : 'Rejected' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                  statusFilter === tab.id
                    ? 'bg-indigo-650 text-white dark:bg-indigo-600'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder={isAr ? 'ابحث بأرقام التذاكر، طالب أو أستاذ ...' : 'Filter by student name, refund token...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="p-2 border dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-xs font-bold w-full sm:w-64 text-right outline-none text-neutral-900 dark:text-white"
          />

          <button
            type="button"
            onClick={() => {
              exportToExcel(
                filteredRequests,
                [
                  { header: isAr ? 'رقم التذكرة' : 'Ticket ID', key: 'id' },
                  { header: isAr ? 'اسم الطالب' : 'Student Name', key: 'studentName' },
                  { header: isAr ? 'رقم الهاتف' : 'Phone', key: 'studentPhone' },
                  { header: isAr ? 'عنوان الكورس' : 'Course', key: 'courseTitle' },
                  { header: isAr ? 'المبلغ' : 'Amount', key: 'amount' },
                  { header: isAr ? 'العملة' : 'Currency', key: 'currency' },
                  { header: isAr ? 'السبب' : 'Reason', key: 'reason' },
                  { header: isAr ? 'الحالة' : 'Status', key: 'status' },
                  { header: isAr ? 'التاريخ' : 'Date', key: 'date' }
                ],
                isAr ? 'كشف_طلبات_الاسترداد' : 'Refund_Requests_Report'
              );
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            {isAr ? 'تصدير Excel' : 'Export Excel'}
          </button>

        </div>

        {/* REFUNDS CARDS SCROLLER BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <div 
              key={req.id}
              className={`bg-neutral-50 dark:bg-neutral-900 border rounded-3xl p-5 space-y-4 relative overflow-hidden transition hover:shadow-xs flex flex-col justify-between ${
                req.status === 'pending' ? 'border-amber-200 dark:border-amber-950/40 bg-amber-500/2' :
                req.status === 'approved' ? 'border-indigo-200 dark:border-indigo-950/20' :
                req.status === 'completed' ? 'border-neutral-200 dark:border-neutral-800' :
                'border-neutral-200 dark:border-neutral-800 opacity-60'
              }`}
            >
              
              {/* Card Title Header badges */}
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                <span className="text-[10px] font-mono font-black text-neutral-400 select-all">
                  🎫 {req.id}
                </span>

                <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase ${
                  req.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                  req.status === 'approved' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
                  req.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                  'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                  {req.status === 'pending' && (isAr ? 'قيد المراجعة ⏳' : 'Awaiting admin')}
                  {req.status === 'approved' && (isAr ? 'معتمد وبانتظار التنفيذ 🟢' : 'Passed security')}
                  {req.status === 'completed' && (isAr ? 'تمت المقاصة بنجاح ✓' : 'Settled & Revoked ✓')}
                  {req.status === 'rejected' && (isAr ? 'مرفوض 🛑' : 'Rejected')}
                </span>
              </div>

              {/* Course & Student Identity info */}
              <div className="space-y-2.5">
                
                {/* Course Name */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-400 font-extrabold block">📖 {isAr ? 'المقرر والدرس المطلوب تصفير صلاحتيه:' : 'Target Syllabus Course:'}</span>
                  <p className="text-xs font-black text-neutral-900 dark:text-white leading-normal truncate" title={req.courseTitle}>
                    {req.courseTitle}
                  </p>
                  <p className="text-[9px] text-neutral-450 font-bold">{isAr ? 'تحت توقيع المدرس: ' : 'Instructor: '}{req.teacherName}</p>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-850 border dark:border-neutral-800 rounded-xl">
                  <span className="text-base">👤</span>
                  <div>
                    <h5 className="text-[11px] font-extrabold text-neutral-850 dark:text-white leading-none">{req.studentName}</h5>
                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5">{req.studentPhone}</p>
                  </div>
                </div>

                {/* Amount to refund */}
                <div className="flex justify-between items-center text-xs font-bold pt-1">
                  <span className="text-neutral-450">{isAr ? 'مبلغ الاسترجاع الكلي:' : 'Total Refund Amount:'}</span>
                  <span className="text-[13px] font-black font-mono text-rose-600 dark:text-rose-400">
                    {req.amount} {req.currency === 'SAR' ? 'SAR' : 'EGP'}
                  </span>
                </div>

                {/* Reason explanation text */}
                <div className="p-2 bg-neutral-100/50 dark:bg-neutral-800/40 rounded-lg text-[10px] text-neutral-500 dark:text-neutral-450 leading-relaxed font-semibold">
                  <span className="font-extrabold block text-neutral-400 mb-0.5">{isAr ? 'السبب المسجل:' : 'Filing cause:'}</span>
                  {req.reason}
                </div>

              </div>

              {/* ACTIONS AREA FOR PENDING CORES */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                
                <div className="flex gap-1">
                  
                  {/* Action 1: Approve trigger */}
                  {req.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleActionClick(req.id, 'approve')}
                        className="flex-1 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-[10px] rounded-lg transition duration-150 cursor-pointer text-center"
                      >
                        {isAr ? 'اعتماد الطلب ✓' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionClick(req.id, 'reject')}
                        className="p-1.5 bg-neutral-200 hover:bg-rose-50 hover:text-rose-600 dark:bg-neutral-800 dark:hover:bg-rose-950 text-neutral-500 rounded-lg transition duration-150 cursor-pointer"
                        title={isAr ? 'رفض الطلب وإغلاقه' : 'Reject Request'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Action 2: Trigger the complete revoke cancellation routine */}
                  {req.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(req.id, 'execute')}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] rounded-xl transition duration-150 cursor-pointer animate-pulse text-center"
                    >
                      🔥 {isAr ? 'تنفيذ الإلغاء الفوري للمشترك وإعادة الأموال' : 'Execute Sub Cancellation & Wallet Credit'}
                    </button>
                  )}

                  {/* Complete states info message */}
                  {req.status === 'completed' && (
                    <div className="w-full text-center py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black select-none">
                      🔒 {isAr ? 'المقاصة منتهية السجل - الاشتراك ملغي حالياً' : 'Ledger Locked - Subscription Revoked'}
                    </div>
                  )}

                  {/* Rejected state */}
                  {req.status === 'rejected' && (
                    <div className="w-full text-center py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded-lg text-[9px] font-semibold select-none">
                      {isAr ? 'تم رفض تذكرة التعاقد المالي' : 'Declined Transaction'}
                    </div>
                  )}

                </div>

                {/* Show Timeline History link */}
                <button
                  type="button"
                  onClick={() => setSelectedReq(req)}
                  className="w-full py-1 text-center text-[10px] font-black text-indigo-650 dark:text-indigo-400 hover:underline flex justify-center items-center gap-1 cursor-pointer"
                >
                  <History className="w-3 h-3" />
                  <span>{isAr ? 'عرض جدول الخط الزمني التاريخي للتسوية' : 'View Settlement Lifecycle'}</span>
                </button>

              </div>

            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 italic">
              {isAr ? 'لا توجد أي معاملات استرداد مدرجة تحت شروط الفلترة الحالية.' : 'No refund tickets matching filter query.'}
            </div>
          )}
        </div>

      </div>

      {/* COMPACT DETAILED TIMELINE MODAL DIALOG */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            
            {/* Backdrop overlay */}
            <div 
              onClick={() => setSelectedReq(null)}
              className="fixed inset-0 bg-neutral-900/60 dark:bg-neutral-950/80 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto" 
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            {/* Modal Body panel */}
            <div className="inline-block transform overflow-hidden rounded-3xl bg-white dark:bg-neutral-850 px-6 pt-5 pb-6 text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle text-neutral-900 dark:text-white animate-fade-in">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="p-1 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إغلاق ✕' : 'Close ✕'}
                </button>
                <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-450" />
                  <span>{isAr ? 'تتبع الخط الزمني لعملية التسوية' : 'Audit Timeline Settlement Log'}</span>
                </h4>
              </div>

              {/* Timeline list info */}
              <div className="mt-5 space-y-4">
                
                {/* Specific ticket id info */}
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-905 border dark:border-neutral-800 rounded-2xl flex items-center justify-between text-xs font-bold leading-none">
                  <div>
                    <span className="block text-[10px] text-neutral-400 mb-1">{isAr ? 'رقم التذكرة المالية:' : 'Transaction ID:'}</span>
                    <span className="font-mono font-black">{selectedReq.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400 mb-1">{isAr ? 'المقدار المسترد:' : 'Custody Credits:'}</span>
                    <span className="text-rose-600 font-mono font-black">{selectedReq.amount} {selectedReq.currency}</span>
                  </div>
                </div>

                {/* Simulated vertical timeline items */}
                <div className="relative pr-4 border-r-2 border-neutral-200 dark:border-neutral-800 space-y-5 py-2 mr-3 text-[11px] font-bold text-right">
                  {selectedReq.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      
                      {/* Active indicator bullet */}
                      <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-900 dark:text-white font-extrabold">{item.title}</span>
                          <span className="text-[10px] p-0.5 px-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-450 rounded-md font-extrabold">{item.user}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {new Date(item.date).toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/20 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-900/10 text-[10px] text-neutral-500 leading-normal font-semibold">
                  {isAr 
                    ? '✓ تُحفظ وتُسجل السجلات المالية بالمنصة آلياً تماشياً مع معايير التدقيق المحاسبي المبرمج لمنصتنا التعليمية.' 
                    : '✓ This timeline record represents real-time system synchronization across support desk logs and local security states.'}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* SUPER-ADMIN SECURITY OVERRIDE PIN CONFIRMATION MODAL */}
      {isConfirmModalOpen && pendingAction && (
        <div className="fixed inset-0 z-[100] overflow-y-auto font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            
            <div 
              onClick={() => {
                setIsConfirmModalOpen(false);
                setPendingAction(null);
              }}
              className="fixed inset-0 bg-neutral-900/70 dark:bg-neutral-950/90 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto" 
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <form onSubmit={handleConfirmAction} className="inline-block transform overflow-hidden rounded-3xl bg-white dark:bg-neutral-850 px-6 pt-5 pb-6 text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle text-neutral-900 dark:text-white animate-fade-in">
              
              <div className="text-center space-y-4">
                
                {/* Visual Icon Alert wrapper */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 shrink-0 text-rose-600 dark:text-rose-400">
                  <Lock className="w-5 h-5 animate-bounce" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-rose-800 dark:text-rose-400">
                    {isAr ? 'تأكيد الهوية وتطبيق تسوية السجلات الحالية' : 'Financial Ledger Security Override'}
                  </h3>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-400 font-bold leading-normal mt-1 max-w-sm mx-auto">
                    {isAr 
                      ? 'مرحباً، أنت توشك على تنفيذ أمر مالي حرج يؤثر على أرباح المدرس المستفيد وأرصدة ومحتوى الطلاب. يرجى إدخال كلمة المرور الخاصة بالسوبر أدمن للتأكيد والتحقق.'
                      : 'You are applying a hard rollback database alter. Type your administrator credential keys to authorize.'}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="text-right space-y-1">
                    <label className="text-[10px] font-bold text-neutral-450 block">{isAr ? 'التحقق الأمن الفدرالي (أدخل كلمة السر):' : 'Enter Admin Password / Passcode:'}</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-700 rounded-xl text-center font-mono font-bold tracking-widest outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="p-2 p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-[10px] text-neutral-405 font-mono">
                    💡 Hint for demo test: <span className="font-extrabold text-neutral-950 dark:text-white">admin</span> or any word &gt; 4 letters
                  </div>

                  {/* Buttons line */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsConfirmModalOpen(false);
                        setPendingAction(null);
                      }}
                      className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-500 rounded-xl label-none text-xs font-black transition duration-150 cursor-pointer text-center"
                    >
                      {isAr ? 'إلغاء الأمر الكلي' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition duration-150 cursor-pointer shadow-sm text-center"
                    >
                      🛡️ {isAr ? 'فك التواقيع والتنفيذ' : 'Confirm & Reconcile'}
                    </button>
                  </div>

                </div>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
