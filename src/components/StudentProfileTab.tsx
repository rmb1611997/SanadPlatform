import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, ShieldAlert, Key, Phone, CheckCircle, 
  TrendingUp, Award, Clock, BookOpen, Layers
} from 'lucide-react';
import { hashPassword } from '../utils/crypto';
import { getAllUsers, UserProfile } from '../utils/db';

interface StudentProfileTabProps {
  user: {
    name: string;
    phone: string;
    role?: 'student' | 'teacher' | 'admin';
    country?: 'EG' | 'SA';
    grade?: string;
    location?: string;
    parentPhone?: string;
  };
  lang: 'ar' | 'en';
}

export default function StudentProfileTab({ user, lang }: StudentProfileTabProps) {
  const isAr = lang === 'ar';

  const dbUsers = getAllUsers();
  const currentUserProfile = dbUsers.find(u => u.phone === user.phone);
  const liveStudentCode = currentUserProfile?.studentCode || '';

  // State fields for change password
  const [oldPassword, setOldPassword] = useState('');
  const [parentPhoneInput, setParentPhoneInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Loaded stats from localStorage (matching StudentCoursesTab IDs)
  const watchProgress = (() => {
    try {
      const saved = localStorage.getItem(`sanad_student_watch_${user.name}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const completedScores = (() => {
    try {
      const saved = localStorage.getItem(`sanad_student_scores_${user.name}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  // Define course modules keys for evaluating metrics are listed:
  // courses ids matching data.ts
  const activeCourseIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  const allCoursesArNames: Record<string, string> = {
    c1: 'الفيزياء الكهربية والحديثة - الثالث الثانوي',
    c2: 'الرياضيات البحتة (التفاضل والتكامل) - مصر',
    c3: 'رياضيات ٥ - مسار العلوم الطبيعية - السعودية',
    c4: 'دورة القدرات العامة والتأسيس - السعودية',
    c5: 'الكيمياء العضوية المتقدمة والتجريبية',
    c6: 'شرح النحو والبلاغة بالخرائط الذهنية',
    c7: 'الأحياء - الوراثة والبيولوجيا الجزيئية - مصر',
  };

  const allCoursesEnNames: Record<string, string> = {
    c1: 'Electrodynamics & Modern Physics',
    c2: 'Pure Mathematics (Calculus)',
    c3: 'Mathematics 5 - Natural Sciences',
    c4: 'General Qudrat Prep Course',
    c5: 'Advanced Organic Chemistry',
    c6: 'Arabic Grammar & Rhetoric Maps',
    c7: 'Biology - Genetics & DNA',
  };

  // Check which courses are currently subscribed by checking is student owned
  const purchasedCourseIds: string[] = (() => {
    try {
      const saved = localStorage.getItem(`sanad_purchased_${user.name}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  // Let's calculate the stats for each course individually
  const coursesStatsList = purchasedCourseIds.map(courseId => {
    const name = isAr ? allCoursesArNames[courseId] || courseId : allCoursesEnNames[courseId] || courseId;
    
    // Hardcoded total elements inside mock modules:
    // our modules generator has 2 videos, 2 homeworks, 2 quizzes per course
    // Watch Rate: Based on how many are checked as true in watchProgress
    const v1 = `${courseId}_mod1_v1`;
    const v2 = `${courseId}_mod1_v2`;
    const v3 = `${courseId}_mod2_v1`;
    
    let watchedCount = 0;
    if (watchProgress[v1]) watchedCount++;
    if (watchProgress[v2]) watchedCount++;
    if (watchProgress[v3]) watchedCount++;
    const watchRate = Math.round((watchedCount / 3) * 100);

    // Homework Score
    const hw1 = `${courseId}_mod1_h1`;
    const hw2 = `${courseId}_mod2_h1`;
    const h1Score = completedScores[hw1]?.score ?? 0;
    const h2Score = completedScores[hw2]?.score ?? 0;
    const hwSubmittedCount = (completedScores[hw1] ? 1 : 0) + (completedScores[hw2] ? 1 : 0);
    const avgHomework = hwSubmittedCount > 0 ? Math.round((h1Score + h2Score) / hwSubmittedCount) : 0;

    // Test Score
    const q1 = `${courseId}_mod1_q1`;
    const q2 = `${courseId}_mod2_q1`;
    const q1Score = completedScores[q1]?.score ?? 0;
    const q2Score = completedScores[q2]?.score ?? 0;
    const qSubmittedCount = (completedScores[q1] ? 1 : 0) + (completedScores[q2] ? 1 : 0);
    const avgQuiz = qSubmittedCount > 0 ? Math.round((q1Score + q2Score) / qSubmittedCount) : 0;

    // Student Rating index (based on performance, or simple simulation)
    const avgScore = (watchRate + avgHomework + avgQuiz) / 3;
    let rankLabel = isAr ? 'ضعيف' : 'Poor';
    let rankColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';

    if (avgScore >= 85) {
      rankLabel = isAr ? 'ممتاز ⭐⭐⭐' : 'Excellent ⭐⭐⭐';
      rankColor = 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20';
    } else if (avgScore >= 50) {
      rankLabel = isAr ? 'متوسط ⭐⭐' : 'Medium ⭐⭐';
      rankColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';
    }

    return {
      courseId,
      name,
      watchRate,
      avgHomework,
      avgQuiz,
      avgScore: Math.round(avgScore),
      rankLabel,
      rankColor
    };
  });

  // Calculate Overall generalized rating metrics across ALL courses
  const totalSubscribed = coursesStatsList.length;
  let overallPercent = 0;
  let overallLevel = isAr ? 'ضعيف' : 'Poor';
  let overallColorClass = 'text-rose-500';

  if (totalSubscribed > 0) {
    const sum = coursesStatsList.reduce((acc, curr) => acc + curr.avgScore, 0);
    overallPercent = Math.round(sum / totalSubscribed);
    if (overallPercent >= 85) {
      overallLevel = isAr ? 'ممتاز' : 'Excellent';
      overallColorClass = 'text-indigo-500';
    } else if (overallPercent >= 50) {
      overallLevel = isAr ? 'متوسط' : 'Medium';
      overallColorClass = 'text-amber-500';
    }
  }

  // Password Update Security Rule:
  // Checks if old password is correct and parent's phone is matching what is registered.
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    // Field integrity verification
    if (newPassword !== confirmPassword) {
      setPwError(isAr ? '⚠️ عذراً! كلمتا المرور الجديدتان غير متطابقتين.' : '⚠️ Password confirmation mismatch.');
      return;
    }

    if (newPassword.length < 4) {
      setPwError(isAr ? '⚠️ يجب أن تكون كلمة المرور الجديدة مكونة من 4 أحرف وأرقام على الأقل.' : '⚠️ Password word must be at least 4 characters long.');
      return;
    }

    // Load registered database profiles to search
    const dbUsers = getAllUsers();
    const currentUserProfile = dbUsers.find(u => u.phone === user.phone);

    if (!currentUserProfile) {
      setPwError(isAr ? '⚠️ خطأ غامض: واجهنا فشل في تصفية الملف الشخصي الجاري.' : '⚠️ Current file target pointer not found.');
      return;
    }

    // Verify parent phone matching
    const currentParentPhone = currentUserProfile.parentPhone ? currentUserProfile.parentPhone.trim() : '';
    const inputParentPhone = parentPhoneInput.trim();

    if (currentParentPhone && currentParentPhone !== inputParentPhone) {
      setPwError(
        isAr
          ? `⚠️ عذراً! رقم هاتف ولي الأمر الذي أدخلته (${parentPhoneInput}) غير مطابق للرقم المسجل في قاعدة البيانات.`
          : `⚠️ Parent phone number mismatch with records.`
      );
      return;
    }

    // Verify old password hash
    const oldPassHash = await hashPassword(oldPassword);
    if (currentUserProfile.passwordHash !== oldPassHash) {
      setPwError(isAr ? '⚠️ عذراً! كلمة المرور القديمة التي أدخلتها غير صحيحة.' : '⚠️ Invalid current (old) password payload.');
      return;
    }

    // Everything is verified successfully! Update the DB
    const newPassHash = await hashPassword(newPassword);
    
    // Update matching index inside global database
    const profileIdx = dbUsers.findIndex(u => u.phone === user.phone);
    if (profileIdx !== -1) {
      dbUsers[profileIdx].passwordHash = newPassHash;
      localStorage.setItem('sanad_users_db', JSON.stringify(dbUsers));
      
      setPwSuccess(
        isAr
          ? '🎉 رائع جداً! تم تغيير وتحديث كلمة المرور بنجاح في المنظومة وبشكل آمن.'
          : '🎉 Success! Your access password was upgraded securely.'
      );
      
      // Reset form variables
      setOldPassword('');
      setParentPhoneInput('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwError(isAr ? '⚠️ حدث خلل تقني أثناء حفظ التغييرات.' : '⚠️ Write failure on database level.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT BLOCK: General Student Profile Metadata & Global Rating Card */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 rounded-3xl text-center space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-linear-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-md shadow-indigo-500/10">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-black text-neutral-900 dark:text-white truncate">
              {user.name}
            </h4>
            <p className="text-xs text-neutral-400 font-bold">
              👤 {isAr ? 'طالب متميز' : 'Verified Premium Student'}
            </p>
            <p className="text-[11px] text-neutral-400 font-mono">
              📱 {user.phone}
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-750 text-right space-y-2 text-xs font-bold text-neutral-550 dark:text-neutral-305">
            {liveStudentCode && (
              <div className="bg-indigo-500/5 dark:bg-indigo-400/5 p-3 rounded-2xl border border-indigo-500/10 dark:border-indigo-400/10 mb-4 flex items-center justify-between">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">🔢 {isAr ? 'كود الطالب الموحد' : 'Unique Student Code'}</span>
                <span className="font-mono text-sm font-black tracking-widest text-[#10B981] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20 px-3 py-1 rounded-xl">
                  {liveStudentCode}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>📍 {isAr ? 'المنطقة:' : 'Region:'}</span>
              <span className="text-neutral-800 dark:text-white">{user.location}</span>
            </div>
            <div className="flex justify-between">
              <span>🎓 {isAr ? 'الصف الدراسي:' : 'Academic Grade:'}</span>
              <span className="text-neutral-800 dark:text-white">{user.grade}</span>
            </div>
            <div className="flex justify-between">
              <span>👨‍👩‍👦 {isAr ? 'هاتف ولي الأمر:' : 'Parent Account:'}</span>
              <span className="text-neutral-850 dark:text-white font-mono">{user.parentPhone}</span>
            </div>
          </div>
        </div>

        {/* Global Progress Index Card */}
        <div className="bg-linear-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-neutral-850">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 z-10 relative">
            <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full">
              ⚡ {isAr ? 'مؤشر الأداء العام للمنصة' : 'Overall Platform Efficiency'}
            </span>
            
            <div className="space-y-1 pt-2">
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'المستوى العام لجميع الكورسات' : 'Aggregate score calculated across everything:'}</p>
              <div className="flex items-baseline justify-between">
                <span className={`text-4xl font-extrabold font-mono ${overallColorClass}`}>
                  {overallPercent}%
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-[#10B981] bg-indigo-950/40 border border-indigo-900 px-2.5 py-0.5 rounded-full">
                  {overallLevel}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed font-semibold">
              {totalSubscribed > 0 
                ? (isAr ? 'يقيس هذا المؤشر مجمل تفاعلك وحضورك ومشاهدتك للشروح إلى جانب درجاتك المسجلة بالواجب والامتحانات التمهيدية تلقائياً.' : 'Calculated sequentially across video views, assignments results, and exams.')
                : (isAr ? 'اشترك في الكورسات وتابع المناهج لعرض التقارير التفصيلية الموجهة لأولياء الأمور.' : 'Please enroll in active courses to populate performance metrics.')}
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT BLOCK: Enrolled Courses Metrics & Change Password Security Forms */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 📈 INDIVIDUAL COURSES METRICS PANEL */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 rounded-3xl space-y-4">
          <div className="space-y-1 pb-2 border-b border-neutral-100 dark:border-neutral-700">
            <h4 className="text-sm font-black text-neutral-900 dark:text-white">
              📊 {isAr ? 'تقارير أداء الكورسات المشترك بها الطالب' : 'Performance Breakdown per Enrolled Subject'}
            </h4>
            <p className="text-xs text-neutral-400 font-medium">
              {isAr ? 'تتبع معدل تقدمك الدراسي في كل مادة بشكل مستقل بمؤشرات ذكاء المنصة لتحديد جوانب الضعف والقوة.' : 'Compare test metrics, lesson compliance rate, and assignment grades.'}
            </p>
          </div>

          {coursesStatsList.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-150 border-dashed">
              <BookOpen className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-450">
                {isAr ? 'لم تشترك في أي كورس بعد لعرض إحصائيات الأداء ودقة الفهم.' : 'Subscribe to view in-depth metric comparisons.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursesStatsList.map((stat) => (
                <div 
                  key={stat.courseId} 
                  className="p-4 rounded-2xl border border-neutral-150 dark:border-neutral-750 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-black text-neutral-900 dark:text-white line-clamp-1">{stat.name}</h5>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${stat.rankColor}`}>
                      {stat.rankLabel}
                    </span>
                  </div>

                  {/* Watch rate progress, homework score, test results */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    
                    {/* Watch metrics */}
                    <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                        <span>🎥 {isAr ? 'نسبة المشاهدة:' : 'Watch scale:'}</span>
                        <span className="font-mono text-indigo-500">{stat.watchRate}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${stat.watchRate}%` }} />
                      </div>
                    </div>

                    {/* Homework score */}
                    <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                        <span>📝 {isAr ? 'أداء الواجبات:' : 'Homework grade:'}</span>
                        <span className="font-mono text-indigo-500">{stat.avgHomework}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${stat.avgHomework}%` }} />
                      </div>
                    </div>

                    {/* Quiz score */}
                    <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                        <span>🧪 {isAr ? 'نتائج الاختبارات:' : 'Quiz average:'}</span>
                        <span className="font-mono text-blue-500">{stat.avgQuiz}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${stat.avgQuiz}%` }} />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* 🔐 CHANGE PASSWORD SECURITY SYSTEM */}
        <div className="bg-white dark:bg-neutral-800 border-2 border-rose-500/10 dark:border-rose-400/10 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="space-y-1 pb-2 border-b border-rose-500/10">
            <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1.5 text-rose-600 dark:text-rose-450">
              <Key className="h-4.5 w-4.5 shrink-0" />
              <span>{isAr ? 'نظام الأمان وتغيير كود المرور' : 'Security Settings & Password Change'}</span>
            </h4>
            <p className="text-xs text-neutral-400 font-medium">
              {isAr ? 'شرط الأمان: من أجل تفعيل الرمز الجديد يجب مطابقة كود الأمان القديم ورقم هاتف ولي الأمر المسجل مسبقاً.' : 'Validation required: verify parent contact number matched in the database.'}
            </p>
          </div>

          {/* Validation Alert */}
          {pwError && (
            <div className="p-3 bg-rose-50/80 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs text-rose-600 dark:text-rose-400 font-black rounded-xl flex gap-1.5">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{pwError}</span>
            </div>
          )}

          {pwSuccess && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-700 dark:text-indigo-300 font-black rounded-xl flex gap-1.5">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-black text-neutral-500 flex items-center gap-1">
                  <span>🔑 {isAr ? 'كلمة المرور القديمة' : 'Current Old Password'}</span>
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-rose-500"
                  placeholder="••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-neutral-500 flex items-center gap-1">
                  <span>👨‍👩‍👦 {isAr ? 'رقم ولي الأمر الحقيقي' : 'Parent phone registered'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={parentPhoneInput}
                  onChange={(e) => setParentPhoneInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-rose-500 font-mono"
                  placeholder={isAr ? 'مثال: 01222222222' : 'e.g. 01222222222'}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-neutral-500 flex items-center gap-1">
                  <span>🆕 {isAr ? 'كلمة المرور الجديدة' : 'New Password Proposed'}</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-rose-500"
                  placeholder="••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-neutral-500 flex items-center gap-1">
                  <span>🔒 {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-rose-500"
                  placeholder="••••••"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Key className="h-4 w-4" />
              <span>{isAr ? 'تغيير وتأكيد كلمة المرور المحدثة' : 'Update Password Securely'}</span>
            </button>
          </form>
        </div>


      </div>

    </div>
  );
}
