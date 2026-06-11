import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, KeyRound, MapPin, Check, Edit2, ShieldAlert, 
  Trash2, Lock, Unlock, HelpCircle, Eye, ClipboardList, BookOpen, AlertCircle, Save
} from 'lucide-react';
import { UserProfile } from '../utils/db';

interface TeacherStudentsPageProps {
  lang: 'ar' | 'en';
  students: UserProfile[];
  onUpdateStudent: (updated: UserProfile) => void;
  onDeleteStudent?: (phone: string) => void;
  initialPanelTab?: 'roster' | 'code_checker';
  activeTeacherName?: string;
  allCourses?: any[];
}

export default function TeacherStudentsPage({ 
  lang, 
  students, 
  onUpdateStudent,
  onDeleteStudent,
  initialPanelTab,
  activeTeacherName,
  allCourses
}: TeacherStudentsPageProps) {
  const isAr = lang === 'ar';
  const [panelTab, setPanelTab] = useState<'roster' | 'code_checker'>(initialPanelTab || 'roster');

  useEffect(() => {
    if (initialPanelTab) {
      setPanelTab(initialPanelTab);
    }
  }, [initialPanelTab]);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<'all' | 'EG' | 'SA'>('all');
  
  // Student Code Checker state
  const [codeQuery, setCodeQuery] = useState('');
  const [codeSearchResult, setCodeSearchResult] = useState<UserProfile | null>(null);
  const [codeChecked, setCodeChecked] = useState(false);
  const [expandedSearchResultDetails, setExpandedSearchResultDetails] = useState(false);

  // Success Notification state
  const [success, setSuccess] = useState('');

  // Editing state
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCountry, setEditCountry] = useState<'EG' | 'SA'>('EG');
  const [newPassword, setNewPassword] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  
  // Academic stats simulation states for the selected student
  const [mockStats, setMockStats] = useState({
    watchProgress: 72,
    videoCoverage: '٢٤ فيديو من أصل ٣٢ حلقة',
    homeworkScore: '٨٥٪ (متوسط التقييمات)',
    examScore: '٧٨٪ (متوسط الامتحانات التراكمية)',
    overallGrade: 'جيد جداً مرتفع'
  });

  const getStudentCoursesForCurrentTeacher = (studentName: string) => {
    let purchasedIds: string[] = [];
    try {
      const stored = localStorage.getItem(`sanad_purchased_${studentName}`);
      if (stored) {
        purchasedIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    const teacherName = activeTeacherName || 'أ. أحمد سامي';
    const coursesPool = allCourses || [];
    
    return coursesPool.filter(c => 
      purchasedIds.includes(c.id) && 
      (c.teacher.includes(teacherName) || teacherName.includes(c.teacher) || c.teacher === 'أ. أحمد سامي' || c.teacher.includes('سامي'))
    ).map(c => {
      let subDate = localStorage.getItem(`sanad_purchased_date_${studentName}_${c.id}`);
      if (!subDate) {
        const month = 4 + (c.title.length % 3);
        const day = 1 + (studentName.length % 27);
        subDate = `2026-0${month}-${day < 10 ? '0' + day : day} 14:30`;
        localStorage.setItem(`sanad_purchased_date_${studentName}_${c.id}`, subDate);
      }
      return {
        ...c,
        subscriptionDate: subDate
      };
    });
  };

  const handleEditInit = (student: UserProfile) => {
    setSelectedStudent(student);
    setEditName(student.name);
    setEditPhone(student.phone);
    setEditGrade(student.grade || '');
    setEditLocation(student.location || '');
    setEditCountry(student.country || 'EG');
    setNewPassword('');
    setIsBanned((student as any).isBanned || false);
    setBanReason((student as any).banReason || '');
    setInternalNote((student as any).internalNote || '');

    const firstDigit = parseInt(student.studentCode?.[0] || '5');
    setMockStats({
      watchProgress: 60 + firstDigit * 4,
      videoCoverage: `${12 + firstDigit} فيديو من أصل ٣٢ حلقة`,
      homeworkScore: `${75 + firstDigit * 2}% (متوسط التقييمات)`,
      examScore: `${70 + firstDigit * 3}% (متوسط الامتحانات التراكمية)`,
      overallGrade: firstDigit > 7 ? 'ممتاز مرتفع' : firstDigit > 4 ? 'جيد جداً' : 'مقبول مغلظ'
    });
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Use current country - blocked as disabled select
    const updated: UserProfile = {
      ...selectedStudent,
      name: editName,
      grade: editGrade,
      location: editLocation,
      country: editCountry,
    };

    (updated as any).isBanned = isBanned;
    (updated as any).banReason = banReason;
    (updated as any).internalNote = internalNote;

    if (newPassword.trim()) {
      updated.passwordHash = newPassword.trim(); 
    }

    onUpdateStudent(updated);
    setSelectedStudent(null);
    setCodeSearchResult(null);
    setCodeChecked(false);
    setCodeQuery('');
    setExpandedSearchResultDetails(false);
    setSuccess(isAr ? '🎉 تم حفظ وتحديث بيانات الطالب ومزامنتها بنجاح!' : '🎉 Student records updated and synchronized!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleCheckCode = () => {
    const cleaned = codeQuery.trim();
    if (!cleaned) return;

    const found = students.find(s => s.studentCode === cleaned);
    setCodeSearchResult(found || null);
    setCodeChecked(true);
    setExpandedSearchResultDetails(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.phone.includes(searchTerm) ||
                          (student.studentCode && student.studentCode.includes(searchTerm));
    const matchesCountry = countryFilter === 'all' || student.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const egCount = students.filter(s => s.country === 'EG').length;
  const saCount = students.filter(s => s.country === 'SA').length;

  if (selectedStudent) {
    return (
      <div className="space-y-6 text-right font-sans animate-fadeIn">
        {/* Back Button / Navigation Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedStudent(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-750 dark:text-neutral-350 text-xs font-black transition-all cursor-pointer select-none"
            >
              <span>{isAr ? '← العودة لسجلات الطلاب' : '← Back to Students'}</span>
            </button>
            <div>
              <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white">
                {isAr ? `تعديل ومراجعة بيانات: ${selectedStudent.name}` : `Edit Student Profile: ${selectedStudent.name}`}
              </h3>
              <p className="text-xs text-neutral-550 dark:text-neutral-400 font-bold">
                {isAr ? 'التحكم في العضوية والمنهج والاتصال بقفل أو فك الحساب المباشر' : 'Modify curriculum, contact data or toggle freeze status'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column: Profile stats and Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4 text-center">
              <span className="text-5xl p-4 bg-neutral-105 dark:bg-neutral-905 rounded-2xl inline-block shadow-inner select-none">
                {selectedStudent.gender === 'male' ? '👨‍🎓' : '👩‍🎓'}
              </span>
              <div>
                <h4 className="text-sm font-black text-neutral-900 dark:text-white">{editName || selectedStudent.name}</h4>
                <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold mt-1">
                  {selectedStudent.studentCode || '—'}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800/40 text-right space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-450 font-bold">{isAr ? 'رقم الهاتف:' : 'Phone:'}</span>
                  <span className="font-mono font-black text-neutral-800 dark:text-neutral-200">{editPhone || selectedStudent.phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-450 font-bold">{isAr ? 'الموقع الأساسي:' : 'Location:'}</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{editLocation || selectedStudent.location || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-450 font-bold">{isAr ? 'بلد العضوية:' : 'Country:'}</span>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{selectedStudent.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}</span>
                </div>
              </div>
            </div>

            {/* Academic stats card */}
            <div className="p-5 bg-gradient-to-r from-indigo-50/40 to-indigo-100/10 dark:from-neutral-900 dark:to-neutral-850/40 border border-indigo-200/20 dark:border-neutral-800/60 rounded-3xl space-y-4">
              <h5 className="text-xs font-black text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                <span>📈</span>
                <span>{isAr ? 'تقرير الكفاءة الأكاديمية بالبوابة' : 'Academic Compliance Report'}</span>
              </h5>

              <div className="space-y-3.5 text-right">
                <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/40 rounded-2xl shadow-xs">
                  <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'معدل التقدم والمشاهدة' : 'View watch progress'}</p>
                  <p className="text-sm font-black font-mono text-neutral-900 dark:text-white">{mockStats.watchProgress}%</p>
                  <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">{mockStats.videoCoverage}</p>
                </div>

                <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/40 rounded-2xl shadow-xs">
                  <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'متوسط درجات الواجبات' : 'Avg homework marks'}</p>
                  <p className="text-sm font-black text-neutral-900 dark:text-white">{mockStats.homeworkScore}</p>
                </div>

                <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/40 rounded-2xl shadow-xs">
                  <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'الأداء العام والتقدير' : 'Overall rating'}</p>
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{mockStats.overallGrade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Columns: Modify Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSaveStudent} className="bg-white dark:bg-neutral-855 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-6 animate-fadeIn">
              <h4 className="text-sm font-black text-neutral-850 dark:text-white flex items-center gap-1.5 border-b border-neutral-150 dark:border-neutral-800 pb-3">
                <span>⚙️</span>
                <span>{isAr ? 'البيانات الشخصية والتعليمية للمشترك' : 'Personal & Academic Settings'}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                {/* Student Name */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black text-neutral-450">{isAr ? 'اسم الطالب الكامل' : 'Student Full Name'}</label>
                  <input
                    required
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-indigo-505/20 text-neutral-850 dark:text-white"
                  />
                </div>

                {/* Student Grade */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black text-neutral-450">{isAr ? 'الصف الدراسي والمنهج المعتمد' : 'Grade / Curriculum'}</label>
                  <input
                    required
                    type="text"
                    value={editGrade}
                    onChange={e => setEditGrade(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-indigo-505/20 text-neutral-855 dark:text-white"
                  />
                </div>

                {/* Country (DISABLED - CRITICAL OPTION) */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black text-neutral-450">
                    {isAr ? 'الدولة (لا يمكن تعديلها 🔒)' : 'Country (Locked 🔒)'}
                  </label>
                  <select
                    disabled
                    value={editCountry}
                    className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-105 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-450 outline-none cursor-not-allowed"
                  >
                    <option value="EG">🇪🇬 {isAr ? 'جمهورية مصر العربية' : 'Egypt'}</option>
                    <option value="SA">🇸🇦 {isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black text-neutral-450">{isAr ? 'المحافظة / الإقليم المستقر' : 'Governorate / Region'}</label>
                  <input
                    required
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-indigo-505/20 text-neutral-850 dark:text-white"
                  />
                </div>
              </div>

              {/* Password resetting */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2 text-right">
                <h6 className="text-[11px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
                  <Lock className="h-3 w-3" />
                  <span>{isAr ? 'إعادة تعيين كلمة مرور الطالب' : 'Reset Student Password'}</span>
                </h6>
                <p className="text-[9px] text-neutral-450 leading-relaxed text-right">
                  {isAr ? 'اترك الحقل فارغاً إذا كنت لا تود التغيير. وإذا كتبت كلمة مرور جديدة ستعتمد مباشرة للطالب.' : 'Leave empty if you do not want to force override student credentials.'}
                </p>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور الجديدة للطالب المبرمة...' : 'Enter new raw password...'}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-850 dark:text-white outline-none focus:ring-2 focus:ring-indigo-505/10"
                />
              </div>

              {/* Ban control */}
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-3 text-right">
                <div className="flex justify-between items-center text-right">
                  <div className="space-y-0.5">
                    <h6 className="text-[11px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1 justify-end">
                      <ShieldAlert className="h-3 w-3" />
                      <span>{isAr ? 'بروتوكول تجميد وحظر الحساب المباشر' : 'Banning Control'}</span>
                    </h6>
                    <p className="text-[9px] text-neutral-450">{isAr ? 'سيتم قفل الحساب فوراً ولن يتمكن من فك التجميد إلا برفعك لعلامة الحظر.' : 'Student will be immediately barred from entering the educational space.'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBanned(!isBanned)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${
                      isBanned ? 'bg-rose-600 text-white' : 'bg-neutral-105 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-300'
                    }`}
                  >
                    {isBanned ? (isAr ? 'الحساب محظور حالياً 🚫' : 'Banned') : (isAr ? 'تفعيل الحظر 🚫' : 'Block Access 🚫')}
                  </button>
                </div>

                {isBanned && (
                  <div className="space-y-1.5 text-right">
                    <label className="text-[9px] font-black text-rose-500">{isAr ? 'رسالة حظر الحساب (تظهر للطالب عند تسجيل الدخول)' : 'Ban Statement / Block Message'}</label>
                    <input
                      required={isBanned}
                      type="text"
                      value={banReason}
                      onChange={e => setBanReason(e.target.value)}
                      placeholder={isAr ? 'مثال: يرجى التواصل مع السكرتارية لسداد اشتراك الشهر...' : 'Terms violation or contact teaching staff...'}
                      className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-rose-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-850 dark:text-white outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Private Notes */}
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-neutral-450">{isAr ? 'ملاحظات المعلم الداخلية الخاصة (سرية ولا تظهر للطالب 🤫)' : 'Private Admin Notes (NOT visible to student)'}</label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  placeholder={isAr ? 'اكتب تذكيراً سلوكياً لمساعدي المدرس كـ "يحتاج لدعم حسي بالتوالي" ...' : 'Internal annotations for teaching assistants...'}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-850 dark:text-white outline-none resize-none italic"
                />
              </div>

              {/* Save Button with Platform Color Accent */}
              <div className="flex gap-2.5 pt-2 justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-650 hover:bg-indigo-750 focus:ring-4 focus:ring-indigo-650/20 text-white text-xs font-black rounded-xl transition duration-150 shadow-md shadow-indigo-600/20 hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{isAr ? 'حفظ وتطبيق التغييرات ⚡' : 'Apply & Save Live'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-550 dark:text-neutral-300 text-xs font-black rounded-xl transition cursor-pointer"
                >
                  {isAr ? 'إلغاء والعودة' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">👨‍🎓</span>
            <span>{isAr ? 'إدارة وسجلات الطلاب المشتركين' : 'Students Roster & Enrollment'}</span>
          </h3>
          <p className="text-xs text-neutral-550 dark:text-neutral-400 font-bold">
            {isAr ? 'مستند تفاعلي للتحقق من الأكواد واستخراج بيانات تفعيل المنصة وحظر المستخدمين' : 'View registered roster of Egypt & Saudi students'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 rounded-2xl shadow-sm select-none">
            🇪🇬 {egCount} {isAr ? 'طالب بمصر' : 'Egypt Students'}
          </span>
          <span className="text-xs font-black px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 rounded-2xl shadow-sm select-none">
            🇸🇦 {saCount} {isAr ? 'طالب بالسعودية' : 'KSA Students'}
          </span>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/25 dark:text-indigo-400 border border-indigo-500/15 text-xs font-black flex items-center gap-2 shadow-xs">
          <Check className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {panelTab === 'roster' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'البحث بالاسم، المحمول، أو كود الطالب الفريد...' : 'Search student by name, phone, code...'}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-850 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
              />
            </div>

            {/* Country filter selectors */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
              <Filter className="h-4 w-4 text-neutral-400 shrink-0" />
              <button
                onClick={() => setCountryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all active:scale-95 cursor-pointer select-none ${
                  countryFilter === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-neutral-650 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setCountryFilter('EG')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all active:scale-95 cursor-pointer select-none flex items-center gap-1 ${
                  countryFilter === 'EG'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-neutral-650 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                }`}
              >
                <span>🇪🇬 مصر</span>
              </button>
              <button
                onClick={() => setCountryFilter('SA')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all active:scale-95 cursor-pointer select-none flex items-center gap-1 ${
                  countryFilter === 'SA'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-neutral-650 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                }`}
              >
                <span>🇸🇦 السعودية</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-750 font-black text-neutral-450 dark:text-neutral-550">
                  <tr>
                    <th className="p-4">{isAr ? 'اسم الطالب' : 'Student Name'}</th>
                    <th className="p-4">{isAr ? 'كود الطالب' : 'Student Code'}</th>
                    <th className="p-4">{isAr ? 'المستوى التعليمي والمسار' : 'Grade / Track'}</th>
                    <th className="p-4">{isAr ? 'رقم الهاتف' : 'Contact Phone'}</th>
                    <th className="p-4">{isAr ? 'رقم هاتف ولي الأمر' : 'Parent Phone'}</th>
                    <th className="p-4">{isAr ? 'الموقع الجغرافي والبلد' : 'Region & State'}</th>
                    <th className="p-4">{isAr ? 'الحالة والملاحظة' : 'Status & Notes'}</th>
                    <th className="p-4 text-left">{isAr ? 'الإجراءات والتحكم' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-750 font-semibold text-neutral-800 dark:text-neutral-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st.phone} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-all ${
                        (st as any).isBanned ? 'bg-rose-50/15 dark:bg-rose-950/10' : ''
                      }`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-right">
                            <span className="p-1.5 bg-neutral-101 dark:bg-neutral-900 rounded-lg text-sm select-none">
                              {st.gender === 'male' ? '👨‍🎓' : '👩‍🎓'}
                            </span>
                            <div>
                              <p className="font-extrabold text-neutral-900 dark:text-white leading-tight">{st.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs font-black bg-indigo-500/5 text-indigo-650 dark:bg-indigo-410/10 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30 select-all tracking-wider">
                            {st.studentCode || '—'}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-neutral-800 dark:text-neutral-200">{st.grade || 'غير محدد'}</td>
                        <td className="p-4 font-mono select-all text-neutral-550 dark:text-neutral-400">{st.phone}</td>
                        <td className="p-4 font-mono select-all text-neutral-550 dark:text-neutral-400">{st.parentPhone || '—'}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-350">
                            <span>{st.country === 'EG' ? '🇪🇬' : '🇸🇦'}</span>
                            <span>{st.location}</span>
                          </span>
                        </td>
                        <td className="p-4 mr-auto pr-4">
                          {(st as any).isBanned ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                              <ShieldAlert className="h-3 w-3" />
                              <span>{isAr ? 'الحساب محظور' : 'Banned'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                              <span>✓ {isAr ? 'نشط ومستمر' : 'Active'}</span>
                            </span>
                          )}
                          {(st as any).internalNote && (
                            <p className="text-[9px] text-neutral-400 truncate max-w-[120px] mt-1 italic leading-tight">
                              📝 {(st as any).internalNote}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-left">
                          <button
                            onClick={() => handleEditInit(st)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-755 text-white text-[10px] font-black transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>{isAr ? 'تعديل ومراجعة ⚙️' : 'Edit & Review ⚙️'}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-neutral-400 font-bold">
                        {isAr ? 'لا يوجد طلاب يطابقون خيارات البحث والفلترة حالياً.' : 'No students found matching current filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {panelTab === 'code_checker' && (
        <div className="max-w-2xl mx-auto space-y-6 text-right animate-fadeIn">
          <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-neutral-850 dark:text-white flex items-center gap-1.5">
              <span>🔢</span>
              <span>{isAr ? 'مدقق واستخراج أكواد الطلاب الثنائية' : '8-Digit Student Registration Code Audit'}</span>
            </h4>
            <p className="text-xs text-neutral-400 font-bold leading-relaxed">
              {isAr 
                ? 'أدخل كود الطالب المكون من ٨ أرقام للتحقق من المالك الحالي للكود واستخراج بياناته بشكل آمن فوري.' 
                : 'Input any candidate 8-digit student code below to instantly inspect status, check link eligibility or extract profile stats.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                maxLength={8}
                placeholder={isAr ? 'مثال: 54932014' : 'e.g., 54932014'}
                value={codeQuery}
                onChange={e => setCodeQuery(e.target.value)}
                className="flex-1 text-center font-mono py-3 px-4 text-sm font-black bg-neutral-105 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-505/20 uppercase text-indigo-650 dark:text-indigo-400 font-extrabold"
              />
              <button
                onClick={handleCheckCode}
                className="px-8 py-3 bg-indigo-650 hover:bg-indigo-750 active:scale-95 text-white text-xs font-black rounded-2xl transition duration-150 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'تحقق واستخرج 🔎' : 'Verify & Audit 🔎'}</span>
              </button>
            </div>
          </div>

          {codeChecked && (
            <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
              {codeSearchResult ? (
                <div className="space-y-4 text-right">
                  <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 rounded-2xl text-xs font-black text-center">
                    ✓ {isAr ? 'الكود مستخدم ومرتبط بالملف الشخصي التالي:' : 'Code is in-use, attached to student profile below:'}
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="text-3xl p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                        {codeSearchResult.gender === 'male' ? '👨‍🎓' : '👩‍🎓'}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-neutral-900 dark:text-white">{codeSearchResult.name}</p>
                        <p className="text-[10px] text-neutral-400 font-bold">
                          {codeSearchResult.grade} • {codeSearchResult.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedSearchResultDetails(!expandedSearchResultDetails)}
                      className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-750 active:scale-95 text-white text-xs font-black rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      {expandedSearchResultDetails ? (isAr ? 'إخفاء تفاصيل البيانات ☝️' : 'Hide Details ☝️') : (isAr ? 'عرض بيانات الطالب ⚡' : 'View Student Details ⚡')}
                    </button>
                  </div>

                  {/* SUB-SECTION REQUESTED FOR DETAILED VIEW FOR STUDENT CODE SEARCH */}
                  <AnimatePresence>
                    {expandedSearchResultDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-4 pt-4 border-t border-neutral-150 dark:border-neutral-800"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/60 border border-neutral-100/35 dark:border-neutral-800 text-right">
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-black block">{isAr ? 'اسم الطالب الكامل' : 'Student Full Name'}</span>
                            <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-100">{codeSearchResult.name}</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-neutral-105/50 dark:bg-neutral-900/60 border border-neutral-100/35 dark:border-neutral-800 text-right">
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-black block">{isAr ? 'الصف الدراسي والمنهج الدراسي' : 'Grade / Course Level'}</span>
                            <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-100">{codeSearchResult.grade || '—'}</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-neutral-105/50 dark:bg-neutral-900/60 border border-neutral-100/35 dark:border-neutral-800 text-right">
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-black block">{isAr ? 'رقم الهاتف المحمول' : 'Contact Phone'}</span>
                            <span className="text-xs font-mono font-black text-neutral-800 dark:text-neutral-100">{codeSearchResult.phone}</span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-neutral-105/50 dark:bg-neutral-900/60 border border-neutral-105/35 dark:border-neutral-800 text-right">
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-black block">{isAr ? 'رقم هاتف ولي الأمر' : 'Parent Contact Phone'}</span>
                            <span className="text-xs font-mono font-black text-neutral-800 dark:text-neutral-100">{codeSearchResult.parentPhone || '—'}</span>
                          </div>
                        </div>

                        {/* List of Subscribed Courses for currently logged-in teacher ONLY */}
                        <div className="p-4 rounded-2xl bg-indigo-50/20 dark:bg-neutral-900/40 border border-indigo-150/35 dark:border-neutral-800 space-y-3 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
                          <h5 className="text-[11px] font-black text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5 justify-end">
                            <BookOpen className="h-4 w-4" />
                            <span>{isAr ? `المواد الكورسية المشترك بها مع معلم المادة (${activeTeacherName || 'أ. أحمد سامي'})` : `Subscribed Courses with (${activeTeacherName || 'Ahmed Samy'})`}</span>
                          </h5>

                          <div className="space-y-2">
                            {getStudentCoursesForCurrentTeacher(codeSearchResult.name).length > 0 ? (
                              getStudentCoursesForCurrentTeacher(codeSearchResult.name).map((crs: any) => (
                                <div key={crs.id} className="p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-101 dark:border-neutral-850 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-extrabold text-neutral-850 dark:text-neutral-150">{crs.title}</p>
                                    <p className="text-[9px] text-neutral-450 dark:text-neutral-500 font-semibold">{crs.grade}</p>
                                  </div>
                                  <div className="text-left font-sans">
                                    <span className="text-[9px] text-neutral-400 dark:text-neutral-550 block font-black">{isAr ? 'تاريخ ووقت الاشتراك' : 'Subscription Date'}</span>
                                    <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">{crs.subscriptionDate}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center p-4 text-[11px] text-neutral-450 dark:text-neutral-500 font-bold italic">
                                ⚠️ {isAr ? 'لا توجد كورسات مفعلة للطالب تحت هذا المدرس حالياً.' : 'No active subscribed courses for this teacher.'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleEditInit(codeSearchResult)}
                            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
                          >
                            <span>⚙️</span>
                            <span>{isAr ? 'تعديل ومراجعة الطالب الكامل' : 'Full Edit & Review Student'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-5 bg-rose-500/5 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-2xl text-xs font-black text-center space-y-1">
                  <p>⚠️ {isAr ? 'كود الطالب غير مخصص أو مستخدم حالياً!' : 'Code is unused or invalid!'}</p>
                  <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'هذا الكود شاغر ويمكن منحه لأي طالب مسجل جديد.' : 'This registration code is free.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
