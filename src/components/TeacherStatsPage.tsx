import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, Users, Award, Eye, ClipboardList, CheckCircle2, 
  XCircle, ArrowUpRight, TrendingUp, Calendar, Filter, MapPin
} from 'lucide-react';
import { Course } from '../types';
import { UserProfile } from '../utils/db';

interface TeacherStatsPageProps {
  lang: 'ar' | 'en';
  allCourses: Course[];
  teacherCourses: Course[];
  students: UserProfile[];
  initialSubTab?: 'general' | 'quizzes' | 'views';
}

export default function TeacherStatsPage({ lang, allCourses, teacherCourses, students, initialSubTab }: TeacherStatsPageProps) {
  const isAr = lang === 'ar';
  const [subTab, setSubTab] = useState<'general' | 'quizzes' | 'views'>(initialSubTab || 'general');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Hardcoded premium mock statistics data for realistic visual look
  const totalSubscribers = students.length * 15 + 140;
  const newSubsThisMonth = students.length * 4 + 25;
  const billingTotal = students.length * 450 + 4120;

  // Best seller metrics
  const bestSellers = teacherCourses.map((c, index) => {
    const saleMultiplier = 120 - index * 25 > 20 ? 120 - index * 25 : 24;
    return {
      id: c.id,
      title: c.title,
      salesCount: students.length * 2 + saleMultiplier,
      revenue: (students.length * 2 + saleMultiplier) * c.price,
      completionRate: 85 - index * 4,
      level: c.level
    };
  }).sort((a, b) => b.salesCount - a.salesCount);

  // Governorate/Region data for the Pie Chart Comparison (Cairo, Alexandria, Giza, Riyadh, Jeddah, Eastern Region)
  const regionStats = [
    { nameAr: 'القاهرة', nameEn: 'Cairo', value: 38, color: '#6366F1' },
    { nameAr: 'مسارات الرياض', nameEn: 'Riyadh', value: 24, color: '#10B981' },
    { nameAr: 'الإسكندرية', nameEn: 'Alexandria', value: 16, color: '#F59E0B' },
    { nameAr: 'مسارات جدة', nameEn: 'Jeddah', value: 12, color: '#EC4899' },
    { nameAr: 'الجيزة', nameEn: 'Giza', value: 10, color: '#8B5CF6' },
  ];

  // Solved assessments details
  const solvableAssessmentsList = [
    { studentName: 'يوسف العثمان', taskTitle: 'الامتحان التقييمي الأول: قوانين كيرشوف', type: 'exam', score: '18/20', solved: true, date: '2026-06-05', performance: 'ممتاز' },
    { studentName: 'مريم الشاذلي', taskTitle: 'الواجب المنزلي: دوائر الحث والمقاومة', type: 'homework', score: '9/10', solved: true, date: '2026-06-06', performance: 'ممتاز' },
    { studentName: 'أحمد بن محمد الرجب', taskTitle: 'الامتحان التقييمي الأول: قوانين كيرشوف', type: 'exam', score: '15/20', solved: true, date: '2026-06-07', performance: 'جيد جداً' },
    { studentName: 'عبد الله الشهري', taskTitle: 'الامتحان التقييمي الأول: قوانين كيرشوف', type: 'exam', score: '—', solved: false, date: '—', performance: 'لم يحل' },
    { studentName: 'فاطمة الزهراني', taskTitle: 'الواجب المنزلي: دوائر الحث والمقاومة', type: 'homework', score: '10/10', solved: true, date: '2026-06-06', performance: 'ممتاز' },
    { studentName: 'سارة عبد الرحمن', taskTitle: 'الواجب المنزلي: دوائر الحث والمقاومة', type: 'homework', score: '—', solved: false, date: '—', performance: 'لم يحل' },
  ];

  // Video watch list breakdown
  const mockVideoViews = [
    { studentName: 'أحمد بن محمد الرجب', videoTitle: 'شرح المقاومة المكافئة وقانون هرتز البصري', watchedPercent: 100, lastDate: '2026-06-07', status: 'completed' },
    { studentName: 'مريم الشاذلي', videoTitle: 'شرح المقاومة المكافئة وقانون هرتز البصري', watchedPercent: 92, lastDate: '2026-06-06', status: 'completed' },
    { studentName: 'يوسف العثمان', videoTitle: 'تفكيك عقد مسائل التوازي والتقاطعات المائلة', watchedPercent: 75, lastDate: '2026-06-05', status: 'progress' },
    { studentName: 'عبد الله الشهري', videoTitle: 'شرح المقاومة المكافئة وقانون هرتز البصري', watchedPercent: 12, lastDate: '2026-06-04', status: 'progress' },
    { studentName: 'فاطمة الزهراني', videoTitle: 'تفكيك عقد مسائل التوازي والتقاطعات المائلة', watchedPercent: 0, lastDate: '—', status: 'unwatched' },
  ];

  return (
    <div className="space-y-6 text-right">
      
      {subTab === 'general' && (
        <div className="space-y-6">
          {/* Unified Page Header with interactive date selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">📊</span>
                <span>{isAr ? 'الإحصائيات والأعمال المالية والبيعية' : 'Billing & Operations Stats'}</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
                {isAr ? 'نظرة واقعية مدعومة بمجال الفلترة التاريخية' : 'Comprehensive performance analytics.'}
              </p>
            </div>

            <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {[
                { id: 'week', ar: 'أسبوع', en: 'Week' },
                { id: 'month', ar: 'شهر', en: 'Month' },
                { id: 'year', ar: 'سنة', en: 'Year' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTimeFilter(f.id as any)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all active:scale-95 cursor-pointer select-none ${
                    timeFilter === f.id
                      ? 'bg-indigo-650 text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-450 dark:hover:text-neutral-200'
                  }`}
                >
                  {isAr ? f.ar : f.en}
                </button>
              ))}
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'إجمالي الاشتراكات والتلاميذ' : 'Total Students Enrolled'}</p>
                <p className="text-xl font-black font-mono text-neutral-900 dark:text-white">{totalSubscribers} {isAr ? 'عضو' : 'Subs'}</p>
                <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>+18% {isAr ? 'معدل نمو أسبوعي' : 'Weekly Growth'}</span>
                </span>
              </div>
              <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 rounded-2xl text-xl">👥</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'إجمالي المحاضرات والكورسات الفعالة' : 'Total Active Courses'}</p>
                <p className="text-xl font-black font-mono text-neutral-900 dark:text-white">{teacherCourses.length} {isAr ? 'مناهج' : 'Courses'}</p>
                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5 mt-2">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{isAr ? 'تغطية المسارات الشاملة' : 'Full curriculum covers'}</span>
                </span>
              </div>
              <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 rounded-2xl text-xl">📚</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'أرباح واشتراكات الطلاب' : 'Gross Sales Volume'}</p>
                <p className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {billingTotal} {isAr ? 'جنيه / ريال' : 'EGP/SAR'}
                </p>
                <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5 mt-2">
                  ★ {isAr ? 'عبر فودافون كاش ومسارات الشحن' : 'Processed securely via wallet'}
                </span>
              </div>
              <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-2xl text-xl">💰</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart / Governorate list breakdown represented natively in SVG & progress bars */}
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
              <div className="border-b border-neutral-100 dark:border-neutral-750 pb-2">
                <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                  {isAr ? 'مقارنة الطلاب جغرافياً حسب المحافظات والمشارب' : 'Geographical Comparison (Governorates)'}
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Custom drew stunning interactive SVG donut donut chart */}
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e6e6e6" strokeWidth="4" />
                    
                    {/* Ring segment 1 (Cairo): 38% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6366F1" strokeWidth="4.5"
                      strokeDasharray="38 62" strokeDashoffset="0" />
                    
                    {/* Ring segment 2 (Riyadh): 24% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5"
                      strokeDasharray="24 76" strokeDashoffset="-38" />
                    
                    {/* Ring segment 3 (Alexandria): 16% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4.5"
                      strokeDasharray="16 84" strokeDashoffset="-62" />
                    
                    {/* Ring segment 4 (Jeddah): 12% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EC4899" strokeWidth="4.5"
                      strokeDasharray="12 88" strokeDashoffset="-78" />

                    {/* Ring segment 5 (Giza): 10% */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8B5CF6" strokeWidth="4.5"
                      strokeDasharray="10 90" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">100%</span>
                    <span className="text-[8px] text-neutral-400 font-bold">{isAr ? 'التوزيع الإقليمي' : 'Regional Share'}</span>
                  </div>
                </div>

                <div className="w-full space-y-2 text-right">
                  {regionStats.map((reg) => (
                    <div key={reg.nameEn} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-black">
                        <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-350">
                          <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: reg.color }} />
                          <span>{isAr ? reg.nameAr : reg.nameEn}</span>
                        </span>
                        <span className="font-mono">{reg.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-850 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${reg.value}%`, backgroundColor: reg.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Most selling courses list and grades distribution */}
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
              <div className="border-b border-neutral-100 dark:border-neutral-750 pb-2">
                <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                  {isAr ? 'الكورسات الأكثر مبيعاً ونسب الإقبال' : 'Best Selling Premium Courses'}
                </h4>
              </div>

              <div className="space-y-3">
                {bestSellers.map((item, id) => (
                  <div key={item.id} className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-neutral-905 dark:text-white leading-tight line-clamp-1">{item.title}</p>
                      <span className="inline-block bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                        {item.level}
                      </span>
                    </div>

                    <div className="text-left shrink-0">
                      <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{item.salesCount} {isAr ? 'تفعيل' : 'sales'}</p>
                      <p className="text-[9px] text-neutral-400 font-mono font-bold">{item.revenue} EGP/SAR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'quizzes' && (
        <div className="space-y-6">
          {/* Dynamic Unified Header Component */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">📝</span>
                <span>{isAr ? 'كشف حلول نتائج الامتحانات والواجبات' : 'Assignment & Exams Solve Records'}</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
                {isAr ? 'إحصاء مفصل للطلاب الذين أنجزوا الاختبارات والواجبات الإلكترونية والتقييم الحاسم.' : 'Track solved activities.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-150 dark:border-neutral-800 font-black text-neutral-450">
                  <tr>
                    <th className="p-4">{isAr ? 'الطالب' : 'Student'}</th>
                    <th className="p-4">{isAr ? 'التصنيف والمهمة' : 'Assessment Task'}</th>
                    <th className="p-4">{isAr ? 'حالة الحل' : 'Solve Status'}</th>
                    <th className="p-4 font-mono">{isAr ? 'الدرجة المحققة' : 'Mark'}</th>
                    <th className="p-4 font-mono">{isAr ? 'تاريخ الإرسال' : 'Submit Date'}</th>
                    <th className="p-4">{isAr ? 'مستوى الأداء' : 'Compliance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-750 font-semibold text-neutral-700 dark:text-neutral-300">
                  {solvableAssessmentsList.map((st, i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition">
                      <td className="p-4 font-bold text-neutral-900 dark:text-white">{st.studentName}</td>
                      <td className="p-4">
                        <span className="font-bold block text-neutral-800 dark:text-neutral-200">{st.taskTitle}</span>
                        <span className="text-[9px] text-neutral-400 uppercase font-black">{st.type}</span>
                      </td>
                      <td className="p-4">
                        {st.solved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{isAr ? 'تم الحل بنجاح' : 'Solved'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                            <XCircle className="h-3 w-3" />
                            <span>{isAr ? 'لم يحل بعد' : 'Unsolved'}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-black">{st.score}</td>
                      <td className="p-4 font-mono">{st.date}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          st.performance === 'ممتاز' || st.performance === 'جيد جداً'
                            ? 'bg-indigo-500/10 text-indigo-600'
                            : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                        }`}>
                          {st.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'views' && (
        <div className="space-y-6">
          {/* Dynamic Unified Header Component */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">👀</span>
                <span>{isAr ? 'إحصائيات ومعدلات تفاعل المشاهدة' : 'Video Lectures Watch Compliances'}</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
                {isAr ? 'قائمة تتبع تفصيلية تتيح معرفة من شاهد الدروس التعليمية ومن تخلف عن مواكبتها بدقة.' : 'Track video watching data.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-150 dark:border-neutral-800 font-black text-neutral-450">
                  <tr>
                    <th className="p-4">{isAr ? 'الطالب' : 'Student'}</th>
                    <th className="p-4">{isAr ? 'عنوان المحاضرة' : 'Lecture Title'}</th>
                    <th className="p-4 text-center">{isAr ? 'نسبة مشاهدة الفيديو' : 'Watched Progress'}</th>
                    <th className="p-4 font-mono text-center">{isAr ? 'تاريخ آخر مشاهدة' : 'Last Access'}</th>
                    <th className="p-4 text-left">{isAr ? 'حالة التفاعل' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-750 font-semibold text-neutral-700 dark:text-neutral-300">
                  {mockVideoViews.map((item, i) => (
                    <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition">
                      <td className="p-4 font-bold text-neutral-900 dark:text-white">{item.studentName}</td>
                      <td className="p-4 text-neutral-800 dark:text-neutral-200 font-bold">{item.videoTitle}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-[150px] mr-auto ml-auto">
                          <span className="font-mono text-[10px] text-neutral-450 w-8 shrink-0">{item.watchedPercent}%</span>
                          <div className="h-1.5 w-full bg-neutral-150 dark:bg-neutral-750 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.watchedPercent === 100 
                                  ? 'bg-indigo-500' 
                                  : item.watchedPercent > 50 
                                  ? 'bg-amber-500' 
                                  : 'bg-rose-500'
                              }`} 
                              style={{ width: `${item.watchedPercent}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-center">{item.lastDate}</td>
                      <td className="p-4 text-left">
                        {item.status === 'completed' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-[10px] font-black">
                            {isAr ? 'مكتمل المشاهدة' : 'Fully Watched'}
                          </span>
                        ) : item.status === 'progress' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black">
                            {isAr ? 'جاري المتابعة' : 'In Progress'}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-black">
                            {isAr ? 'لم يفتح المحاضرة' : 'Not Watched'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
