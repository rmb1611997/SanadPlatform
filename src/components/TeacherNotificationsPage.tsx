import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Trash2, Calendar, Link as LinkIcon, Check, AlertCircle, Sparkles, Clock } from 'lucide-react';

interface NotificationObj {
  id: string;
  title: string;
  link: string;
  startDate: string; // ISO / datetime string "YYYY-MM-DDTHH:mm"
  endDate?: string;   // ISO / datetime string "YYYY-MM-DDTHH:mm"
  isPermanent: boolean;
  createdAt: string;
}

interface TeacherNotificationsPageProps {
  lang: 'ar' | 'en';
}

export default function TeacherNotificationsPage({ lang }: TeacherNotificationsPageProps) {
  const isAr = lang === 'ar';

  // State loaded from localStorage
  const [notifications, setNotifications] = useState<NotificationObj[]>(() => {
    const raw = localStorage.getItem('sanad_notifications');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.slice(0, 1); // Respect the "Max 1" constraint
      } catch {}
    }
    // Default initial notification
    return [
      {
        id: 'init_n_1',
        title: '🚨 هام لجميع طلاب الثانوية: مراجعة الدوائر المعقدة وقانوني كيرشوف البث القادم!',
        link: 'https://youtube.com',
        startDate: new Date().toISOString().substring(0, 16), // Now
        isPermanent: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Sync back to local storage
  useEffect(() => {
    // Keep at most 1 item
    const cleanList = notifications.slice(0, 1);
    localStorage.setItem('sanad_notifications', JSON.stringify(cleanList));
  }, [notifications]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().substring(0, 16);
  });
  const [endDate, setEndDate] = useState('');
  const [isPermanent, setIsPermanent] = useState(true);

  // Success message and UI state
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showInlineConfirm, setShowInlineConfirm] = useState(false);

  const currentNotification = notifications[0] || null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (notifications.length > 0) {
      setValidationError(
        isAr 
          ? '⚠️ يوجد إشعار نشط بالفعل بالمخزن! لا يمكن إضافة أكثر من إشعار واحد في نفس الوقت. يرجى حذف الإشعار القديم أولاً.' 
          : '⚠️ An active notification already exists! You cannot publish more than one. Delete the current one first.'
      );
      return;
    }

    if (!title.trim()) {
      setValidationError(isAr ? '⚠️ الرجاء كتابة عنوان الإشعار.' : '⚠️ Title is required.');
      return;
    }

    // Verify times
    if (!isPermanent && endDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      if (endMs <= startMs) {
        setValidationError(
          isAr 
            ? '⚠️ تاريخ الانتهاء يجب أن يكون تالياً لوقت البدء والظهور!' 
            : '⚠️ Expiration date must be after start date!'
        );
        return;
      }
    }

    const newNotification: NotificationObj = {
      id: 'notif_' + Date.now(),
      title: title.trim(),
      link: link.trim(),
      startDate,
      endDate: isPermanent ? undefined : (endDate || undefined),
      isPermanent,
      createdAt: new Date().toISOString()
    };

    setNotifications([newNotification]);
    setSuccess(
      isAr 
        ? '🎉 تم صياغة ونشر التنبيه الجديد لغرف الطلاب بنجاح وبدء الميقات الكوني!' 
        : '🎉 New academic notice launched to all student screens successfully!'
    );

    // Reset Form
    setTitle('');
    setLink('');
    setIsPermanent(true);
    setEndDate('');

    setTimeout(() => setSuccess(''), 5000);
  };

  const handleDelete = () => {
    setShowInlineConfirm(true);
    setShowConfirmDelete(true);
  };

  const confirmActualDelete = () => {
    setNotifications([]);
    localStorage.removeItem('sanad_notifications');
    setSuccess(isAr ? '🗑️ تم إخلاء لوحة الإشعارات بنجاح! المساحة شاغرة الآن لكتابة أي تنبيه جديد.' : '🗑️ Notification board cleared successfully!');
    setShowConfirmDelete(false);
    setShowInlineConfirm(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Dynamic Unified Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">📢</span>
            <span>{isAr ? 'إعداد وصياغة الإشعار النشط العام' : 'Global Student Broadcasts & Notices'}</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
            {isAr ? 'أداة فورية لبث ووضع لوحات أخبار تفاعلية تظهر مباشرة بجميع غرف ومقررات الطلاب' : 'Broadcast immediate news cards across all registered students platforms'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 rounded-2xl shadow-sm select-none">
            🔔 {currentNotification ? (isAr ? 'إشعار نشط حالياً' : 'Current Active Notice') : (isAr ? 'لوحة التنبيه فارغة' : 'Empty Board')}
          </span>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-500/15 text-xs font-black flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-500/15 text-xs font-black flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Creation section form - Col 5 */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-black text-neutral-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>{isAr ? 'إنشاء الإشعار الجديد' : 'Draft New Broadcast Announcement'}</span>
              </h4>
              <span className="text-[9px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 px-2 py-0.5 rounded-full">
                {isAr ? 'الحد الأقصى: إشعار واحد' : 'Max 1 item limit'}
              </span>
            </div>

            {currentNotification ? (
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 text-right space-y-3.5">
                <p className="text-xs font-black text-amber-700 dark:text-amber-400 leading-relaxed">
                  {isAr 
                    ? '⚠️ هناك إشعار نشط بالفعل حالياً على لوحات الطلاب! يجب حذف هذا الإشعار القديم وتصفية المساحة لتتمكن من كتابة ونشر إعلان جديد.'
                    : '⚠️ An active notice is already live in the student feeds! You must check or delete the existing alert to publish a new one.'}
                </p>
                {!showInlineConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowInlineConfirm(true)}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isAr ? '🗑️ حذف وتطهير الإشعار القديم الآن' : 'Clear Existing Notification'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-right space-y-3">
                    <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 leading-relaxed">
                      {isAr 
                        ? '⚠️ هل أنت متأكد من شطب هذا الإشعار؟ الإجراء غير قابل للتراجع وسيتم لإخلاء المساحة ونشره فوراً من كافة الأجهزة!' 
                        : '⚠️ Confirm permanent notice deletion to empty space and release student feeds immediately.'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setShowInlineConfirm(false)}
                        className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold rounded-lg transition cursor-pointer"
                      >
                        {isAr ? 'إلغاء التراجع' : 'No, Keep'}
                      </button>
                      <button
                        type="button"
                        onClick={confirmActualDelete}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg transition shadow-md cursor-pointer"
                      >
                        {isAr ? 'تأكيد تطهير الإشعار 🗑️' : 'Yes, Deep Clear 🗑️'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                
                {/* 1. Notification core title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-450 block">
                    {isAr ? '📝 عنوان الإشعار وتفاصيله الموجهة للطلاب *' : 'Notification Title (Visible to Students) *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={
                      isAr 
                        ? 'مثال: 🚨 بدأ الحجز للمراجعة الشاملة لليلة الامتحان الكبرى لمادة الفيزياء بمدرجات القصر.. سارع بالحصول على كودك!' 
                        : 'Write the announcement text here...'
                    }
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500 transition leading-relaxed resize-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400"
                  />
                </div>

                {/* 2. Optional Redirect Link */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-450 block">
                    {isAr ? '🔗 رابط إضافي للدخول السريع ومكابس الطلاب (اختياري)' : 'Redirect Action Link URL (Optional)'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-3 flex items-center justify-center text-neutral-400">
                      <LinkIcon className="h-3 w-3" />
                    </span>
                    <input
                      type="url"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      placeholder="https://example.com/lecture-pdf"
                      className="w-full text-xs font-semibold py-2.5 pr-8 pl-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 font-mono text-left"
                    />
                  </div>
                  <p className="text-[9px] text-neutral-400 font-bold mt-1">
                    {isAr ? 'يفيد لتوجيه الطلاب لفيديو يوتيوب خارجي، تحميل مذكرة من درايف، أو مراجعة امتحان محدد.' : 'Redirects students instantly upon tapping the banner action.'}
                  </p>
                </div>

                {/* 3. Notification Time configurations */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/60 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-450 block">
                      {isAr ? '⚙️ خيارات الجدولة والنشر للتحكم بالظهور' : 'Publish & Scheduling Options'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-neutral-105 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPermanent(true);
                          setStartDate(new Date().toISOString().substring(0, 16));
                        }}
                        className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                          isPermanent
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                        }`}
                      >
                        ⚡ {isAr ? 'نشر فوري الآن' : 'Publish Now'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPermanent(false)}
                        className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                          !isPermanent
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                        }`}
                      >
                        ⏱️ {isAr ? 'وقت البدء والاختفاء' : 'Schedule Custom Times'}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {!isPermanent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{isAr ? '⏱️ حدد وقت بدء الظهور ووقت الاختفاء تلقائياً' : 'Timing & Visibility controls'}</span>
                        </span>

                        {/* Start Date & Time */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-400 block">{isAr ? 'تاريخ ووقت بدء ظهور الإشعار للطلاب' : 'Start Date & Time (Appear)'}</label>
                          <input
                            type="datetime-local"
                            required={!isPermanent}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none font-mono text-neutral-800 dark:text-neutral-100"
                          />
                        </div>

                        {/* End Date & Time */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-400 block">{isAr ? 'تاريخ ووقت انتهاء واختفاء الإشعار تلقائياً' : 'Expiry Date & Time (Auto-Remove)'}</label>
                          <input
                            type="datetime-local"
                            required={!isPermanent}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none font-mono text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isAr ? 'حفظ ونشر التنبيه الفوري للطلاب ⚡' : 'Publish and Save Notice ⚡'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Live Preview / Active Notification display area - Col 7 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
              {isAr ? 'قرب النظر: الإشعار النشط المنشور بالمنصة حالياً' : 'Active Broadcast Preview'}
            </h4>
            <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-full">
              {currentNotification ? (isAr ? '١ إشعار نشط' : '1 Active Alert') : (isAr ? 'فارغ' : 'Cleared')}
            </span>
          </div>

          {currentNotification ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border-2 border-indigo-500/10 dark:border-indigo-505/20 shadow-lg space-y-4 relative overflow-hidden text-right">
              {/* Subtle top decoration */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-indigo-500 to-indigo-650" />

              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                    <Bell className="h-5 w-5 animate-bounce" />
                  </span>
                  <div>
                    <span className="inline-block bg-indigo-500/10 text-indigo-650 dark:bg-indigo-955/20 dark:text-indigo-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-indigo-500/15 mb-1 text-right">
                      📢 {isAr ? 'إشهار موقت معتمد' : 'Verified Counselor Notice'}
                    </span>
                    <h5 className="text-[11px] text-neutral-400 dark:text-neutral-500 font-extrabold flex items-center gap-1 mt-0.5 text-right">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      <span>{isAr ? `تاريخ ووقت الفعالية والخدمة: ` : `Scheduled event point: `}</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{currentNotification.startDate}</span>
                    </h5>
                  </div>
                </div>

                <button
                  onClick={() => setShowInlineConfirm(prev => !prev)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer"
                  title={isAr ? 'حذف هذا الإشعار تماماً لإفراغ المساحة' : 'Remove notification'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {showInlineConfirm && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-3 text-right">
                  <p className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1 justify-end">
                    <span>{isAr ? '⚠️ تأكيد إزالة هذا الإشعار نهائياً من كافة لوحات الطلاب؟' : '⚠️ Confirm total deletion from student feeds?'}</span>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  </p>
                  <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
                    {isAr ? 'سيختفي الإشعار من الصفحة الرئيسية لديهم على الفور.' : 'It will disappear from student dashboard instantly.'}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowInlineConfirm(false)}
                      className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {isAr ? 'تراجع وإلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={confirmActualDelete}
                      className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer"
                    >
                      {isAr ? 'تأكيد الحذف النهائي' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              )}

              {/* Main announcement card box */}
              <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-2xl text-right border-none">
                <p className="text-sm font-black text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {currentNotification.title}
                </p>
              </div>

              {/* Links and expiry status detail lines */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-right">
                <div>
                  {currentNotification.link ? (
                    <a
                      href={currentNotification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>{isAr ? 'زيارة الرابط المرفق بالإشعار ⚡' : 'Visit Attached Action Link ⚡'}</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-bold italic">
                      {isAr ? '🔗 لم يقرن المعلم رابطاً إضافياً.' : '🔗 No hyperlink attached.'}
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full select-none">
                  <span>⏱️</span>
                  <span>
                    {currentNotification.isPermanent
                      ? (isAr ? 'الإشعار دائم ولا ينتهي تلقائياً' : 'No expiration date (permanent)')
                      : (isAr ? `تاريخ الانتهاء التلقائي: ${currentNotification.endDate}` : `Auto expires at: ${currentNotification.endDate}`)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-neutral-850 border border-dashed border-neutral-200 dark:border-neutral-750 flex flex-col items-center justify-center text-center space-y-4">
              <span className="p-5 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 rounded-full text-3xl">
                📭
              </span>
              <div className="space-y-1">
                <h5 className="text-xs font-black text-neutral-800 dark:text-white">
                  {isAr ? 'عذراً، لوحة الإعلانات خالية تماماً حالياً' : 'Announcement list is empty!'}
                </h5>
                <p className="text-[10px] text-neutral-450 dark:text-neutral-500 font-bold max-w-sm">
                  {isAr 
                    ? 'لم يتم نشر أي إشعار موجه للطلاب في هذه اللحظة. اكتب تفاصيل إعلانك الآن واضغط نشر بالاستمارة المجاورة لبدء البث الفوري.'
                    : 'Compile an alert or update and schedule it. Students will receive immediately.'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-850 rounded-3xl p-6 max-w-sm w-full border border-neutral-200 dark:border-neutral-750 shadow-2xl text-right space-y-4"
            >
              <div className="flex items-center gap-3 justify-end border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h4 className="text-sm font-black text-neutral-900 dark:text-white">
                  {isAr ? '⚠️ تأكيد الحذف النهائي' : 'Confirm Deletion'}
                </h4>
                <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl" style={{ direction: 'rtl' }}>
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>

              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed text-right">
                {isAr 
                  ? 'هل أنت متأكد من شطب هذا الإشعار تماماً وحذفه لتتمكن من إنشاء إشعار جديد؟ سيختفي هذا الإشعار من لوحات جميع الطلاب فوراً.'
                  : 'Are you sure you want to permanently delete this notification? It will instantly disappear from all student dashboards.'}
              </p>

              <div className="flex gap-2 justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-xl transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={confirmActualDelete}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-600/15 transition"
                >
                  {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
