import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, BookOpen, Star, Clock, X, Lock, 
  Play, FileText, CheckSquare, Sparkles, AlertCircle, ShoppingBag, 
  Award, Users, Heart 
} from 'lucide-react';
import { Course, Teacher } from '../types';
import { CourseCard } from './CourseCard';
import { translations } from '../data';
import { generateMockModules } from '../utils/coursePreview';

interface TeacherProfilePageProps {
  teacher: Teacher;
  courses: Course[];
  lang: 'ar' | 'en';
  onBack: () => void;
  onGetStarted: () => void;
}

export default function TeacherProfilePage({ teacher, courses, lang, onBack, onGetStarted }: TeacherProfilePageProps) {
  const [activeCourseDetails, setActiveCourseDetails] = useState<Course | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [previewVideoItem, setPreviewVideoItem] = useState<any | null>(null);
  const [lockAlert, setLockAlert] = useState<string | null>(null);

  const t = translations[lang];

  // Filter courses taught by this teacher only!
  const teacherCourses = courses.filter(
    (course) => course.teacher.trim() === teacher.name.trim()
  );

  const getCourseImageSrc = (course: Course) => {
    if (course.courseImage && (course.courseImage.startsWith('http') || course.courseImage.startsWith('data:image') || course.courseImage.includes('/'))) {
      return course.courseImage;
    }
    const categoryImages: Record<string, string> = {
      physics: 'https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80',
      math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      chemistry: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80',
      languages: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      biology: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80'
    };
    return categoryImages[course.category] || categoryImages['physics'];
  };

  const handleEnrollMock = () => {
    setEnrollSuccess(true);
    setTimeout(() => {
      setEnrollSuccess(false);
      setActiveCourseDetails(null);
      onGetStarted(); // Trigger signup/login modal
    }, 2000);
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Master Teacher Profile Header Card */}
        <div className="relative overflow-hidden bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150/80 dark:border-neutral-800 shadow-xl p-6 md:p-10 mb-12">
          {/* Subtle Abstract Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 relative z-10">
            {/* Teacher Image Avatar Frame - SPECTACULARLY LARGE */}
            <div className="relative shrink-0 select-none group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[64px] blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative h-80 w-80 md:h-[400px] md:w-[400px] rounded-[60px] overflow-hidden bg-white dark:bg-neutral-900 border-4 border-white/50 dark:border-neutral-800 flex items-center justify-center shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                {teacher.avatar && teacher.avatar.length <= 4 ? (
                  <span className="text-[200px] md:text-[280px] select-none leading-none pt-4" role="img" aria-label={teacher.name}>
                    {teacher.avatar}
                  </span>
                ) : (
                  <img 
                    src={teacher.avatar} 
                    alt={teacher.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
            </div>

            {/* Teacher Details */}
            <div className="flex-1 text-center lg:text-right space-y-6 pt-4 lg:pt-10">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mt-1 leading-tight">
                  {teacher.name}
                </h1>
                
                {/* Multiple Academic Grades (الصفوف الدراسية) list display */}
                <div className="pt-4">
                  <span className="text-sm font-black uppercase text-neutral-450 dark:text-neutral-500 block mb-3">
                    {lang === 'ar' ? 'الصفوف الدراسية المعتمدة للمعلّم:' : 'Accredited Class Grades for Students:'}
                  </span>
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    {((teacher as any).grades || ['1', '2', '3']).map((g: string) => {
                      const getGradeFullLabel = (gradeKey: string) => {
                        if (lang === 'ar') {
                          if (gradeKey === '1') return 'الأول الثانوي';
                          if (gradeKey === '2') return 'الثاني الثانوي';
                          if (gradeKey === '3') return 'الثالث الثانوي (شهادة عامة/مسارات)';
                          return gradeKey;
                        } else {
                          if (gradeKey === '1') return '1st Grade Secondary';
                          if (gradeKey === '2') return '2nd Grade Secondary';
                          if (gradeKey === '3') return '3rd Grade (Thanaweya / Tracks)';
                          return `Grade ${gradeKey}`;
                        }
                      };
                      return (
                        <span 
                          key={g} 
                          className="text-sm md:text-base font-black px-5 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 text-neutral-800 dark:text-neutral-250 rounded-2xl transition border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm"
                        >
                          🎓 {getGradeFullLabel(g)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Segment for this specific instructor */}
        <div className="space-y-8">
          <div className="border-r-4 border-indigo-500 pr-3">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              {lang === 'ar' ? `كورسات الأستاذ ${teacher.name}` : `Courses by Prof. ${teacher.name}`}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-1">
              {lang === 'ar' ? 'انقر على تفاصيل أي كورس لتصفح المحتوى والمذكرات ومشاهدة الشروحات المجانية' : 'Explore detailed module syllabus, download handouts and watch free trial video previews'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {teacherCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <CourseCard 
                    course={course} 
                    isAr={lang === 'ar'} 
                    role="student" 
                    onActionClick={() => setActiveCourseDetails(course)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty courses state */}
            {teacherCourses.length === 0 && (
              <div className="col-span-full text-center py-12 rounded-3xl bg-neutral-100/50 dark:bg-neutral-850/25 border border-dashed border-neutral-200 dark:border-neutral-800/80">
                <span className="text-3xl block">📚</span>
                <h3 className="text-base font-extrabold text-neutral-750 dark:text-neutral-300 mt-3">
                  {lang === 'ar' ? 'لا يوجد كورسات معلنة حالياً' : 'No public courses yet.'}
                </h3>
                <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1">
                  {lang === 'ar' ? 'سيتم الإعلان عن المناهج والحصص الخاصة بالأستاذ قريباً جداً.' : 'Courses and schedules are currently being organized.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Course Detailed Syllabus Accordion Modal Popup */}
      <AnimatePresence>
        {activeCourseDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveCourseDetails(null);
                setPreviewVideoItem(null);
                setLockAlert(null);
                setExpandedModuleId(null);
              }}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl overflow-y-auto max-h-[90vh] rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-neutral-850 border border-neutral-150 dark:border-neutral-750 z-10"
            >
              {/* Close card button */}
              <button
                onClick={() => {
                  setActiveCourseDetails(null);
                  setPreviewVideoItem(null);
                  setLockAlert(null);
                  setExpandedModuleId(null);
                }}
                className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} p-2 rounded-full text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-800 transition z-20`}
              >
                <X className="h-5 w-5" />
              </button>

              {enrollSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-500 dark:bg-indigo-950/40"
                  >
                    <ShoppingBag className="h-10 w-10" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                    {lang === 'ar' ? 'جاري توجيهك تفعيل الاشتراك...' : 'Redirecting to payment activation...'}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-450 dark:text-neutral-500">
                    {lang === 'ar' ? 'سيتم نقلك لحجز واقتطاع المنهج لحظياً.' : 'Customizing study dashboard instantly.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 mt-2">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Course details & Instructor references */}
                    <div className="flex-1 space-y-3_rtl">
                      <span className="inline-flex rounded bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 text-[10px] font-bold">
                        {activeCourseDetails.level}
                      </span>
                      <h3 className="text-xl font-black text-neutral-850 dark:text-neutral-100 leading-snug">
                        {activeCourseDetails.title}
                      </h3>

                      {/* Tutor info */}
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl">
                        <span className="text-3xl flex items-center justify-center">
                          {teacher.avatar?.startsWith('data:') || teacher.avatar?.startsWith('http') || teacher.avatar?.includes('/') ? (
                            <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800" referrerPolicy="no-referrer" />
                          ) : (
                            teacher.avatar || '👨‍🏫'
                          )}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-150">
                            {activeCourseDetails.teacher}
                          </h4>
                        </div>
                      </div>

                      {/* Course statistics */}
                      <div className="grid grid-cols-3 gap-2 text-center bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl p-3 text-xs">
                        <div>
                          <p className="text-neutral-450 dark:text-neutral-550 font-bold text-[9px]">{lang === 'ar' ? 'الحصص' : 'Lectures'}</p>
                          <p className="text-neutral-800 dark:text-neutral-200 font-black mt-0.5">{activeCourseDetails.lessons}</p>
                        </div>
                        <div>
                          <p className="text-neutral-450 dark:text-neutral-550 font-bold text-[9px]">{lang === 'ar' ? 'إجمالي الساعات' : 'Duration'}</p>
                          <p className="text-neutral-800 dark:text-neutral-200 font-black mt-0.5">{activeCourseDetails.duration}</p>
                        </div>
                        <div>
                          <p className="text-neutral-450 dark:text-neutral-550 font-bold text-[9px]">{lang === 'ar' ? 'التقييم الكلي' : 'Syllabus Score'}</p>
                          <p className="text-amber-500 font-black mt-0.5 flex justify-center items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {activeCourseDetails.rating}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Standard details lists */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xs font-black uppercase text-neutral-400 dark:text-neutral-550">
                        {lang === 'ar' ? 'محتويات المنهج والدراسة العامة:' : 'Curriculum Contents include:'}
                      </h4>
                      <div className="space-y-1.5 p-3 bg-neutral-50/30 dark:bg-neutral-900/10 rounded-2xl border border-neutral-150 dark:border-neutral-800/45">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          📚 {lang === 'ar' ? 'دروس تفصيلية تدريجية بالفيديو' : 'Detailed multi-sequence video lectures'}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          📄 {lang === 'ar' ? 'مذكرات وافية ملخصة بصيغة PDF' : 'Fully localized summaries in high-quality PDF format'}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          📝 {lang === 'ar' ? 'واجب واختبارات دورية لقياس المستويات' : 'Frequent assignments & quiz assessments to verify retention'}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          ⚡ {lang === 'ar' ? 'تجهيز للامتحانات النهائية على أيدي مدرسينا الأكفأ' : 'Exhaustive exam preparation curated by verified experts'}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block mb-1">
                          {lang === 'ar' ? 'خيارات الاشتراك وتفعيل الكورس' : 'Enrollment Value'}
                        </span>
                        <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/60 dark:border-indigo-900/30 rounded-2xl">
                          <div>
                            {activeCourseDetails.discountPrice && Number(activeCourseDetails.discountPrice) < activeCourseDetails.price ? (
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-xl font-black text-indigo-700 dark:text-indigo-350 font-mono">
                                  {activeCourseDetails.discountPrice} {lang === 'ar' ? 'ريال/جنيه' : 'credits'}
                                </span>
                                <span className="text-xs text-neutral-450 line-through font-mono">
                                  {activeCourseDetails.price}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-black text-indigo-700 dark:text-indigo-350 font-mono">
                                {activeCourseDetails.price} {lang === 'ar' ? 'ريال/جنيه' : 'credits'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handleEnrollMock}
                            className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition"
                          >
                            💳 {lang === 'ar' ? 'الاشتراك في الكورس' : 'Subscribe Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Modules breakdown explorer list */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/40">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-100">
                        📚 {lang === 'ar' ? 'الخطة الزمنية ومفردات المنهج الدراسي' : 'Detailed Academic Syllabus & Modules'}
                      </h4>
                      <span className="text-[10px] text-neutral-450 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                        {lang === 'ar' ? 'المعاينة والملخصات' : 'Course Previews Allowed'}
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin">
                      {generateMockModules(activeCourseDetails.id).map((mod, mIdx) => {
                        const isExpanded = expandedModuleId === mod.id;
                        return (
                          <div 
                            key={mod.id}
                            className="rounded-xl border border-neutral-150/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/35 overflow-hidden"
                          >
                            <button
                              onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                              className="w-full flex items-center justify-between p-3.5 hover:bg-neutral-100/55 dark:hover:bg-neutral-800/60 transition text-right"
                            >
                              <span className="text-xs md:text-sm font-black text-neutral-800 dark:text-indigo-300">
                                {lang === 'ar' ? mod.titleAr : mod.titleEn}
                              </span>
                              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-lg font-mono">
                                {mod.items.length} {lang === 'ar' ? 'مواد' : 'assets'}
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-neutral-850/15 p-3 space-y-1.5"
                                >
                                  {mod.items.map((item) => (
                                    <div 
                                      key={item.id}
                                      className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        {item.type === 'video' ? (
                                          <span className="text-neutral-500">🎥</span>
                                        ) : item.type === 'file' ? (
                                          <span className="text-neutral-500">📄</span>
                                        ) : (
                                          <span className="text-indigo-500">🧪</span>
                                        )}
                                        <span className="font-bold text-neutral-750 dark:text-neutral-300">
                                          {lang === 'ar' ? item.titleAr : item.titleEn}
                                        </span>
                                      </div>

                                      {/* Lock vs Free Play interaction states */}
                                      {item.type === 'video' && item.isFree ? (
                                        <button
                                          onClick={() => {
                                            setPreviewVideoItem(item);
                                            setLockAlert(null);
                                          }}
                                          className="text-[10px] font-black text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-500 px-2.5 py-1 rounded-lg transition shrink-0 uppercase tracking-widest leading-none"
                                        >
                                          ▶ {lang === 'ar' ? 'تشغيل مجاني' : 'Free Trial'}
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setLockAlert(lang === 'ar' ? `هذا المرفق (${item.type === 'video' ? 'شرح فيديو' : item.type === 'file' ? 'مذكرة شرح' : 'اختبار وتقييم للدرس'}) متاح فقط للطلاب المشتركين في هذه المادة.` : `This item is premium material. Please subscribe or log in to unlock.`);
                                            setPreviewVideoItem(null);
                                          }}
                                          className="text-[10px] font-bold text-neutral-400 hover:text-rose-500 flex items-center gap-1 transition"
                                        >
                                          <Lock className="h-3 w-3" />
                                          <span>{lang === 'ar' ? 'مغلق' : 'Locked'}</span>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Video Preview Player OR Locked Warning alerts */}
                  <AnimatePresence>
                    {previewVideoItem && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl relative"
                      >
                        <button
                          onClick={() => setPreviewVideoItem(null)}
                          className="absolute top-2 left-2 p-1.5 text-neutral-400 hover:text-rose-500 rounded-full transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 block mb-1">
                          🎬 {lang === 'ar' ? 'تشغيل معاينة المحاضرة المفتوحة' : 'Playing Free Academic Lecture'}
                        </span>
                        <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 mb-2">
                          {lang === 'ar' ? previewVideoItem.titleAr : previewVideoItem.titleEn}
                        </h4>
                        
                        {/* Interactive Responsive Aspect Video Canvas */}
                        <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-neutral-950 flex flex-col items-center justify-center relative overflow-hidden group select-none">
                          <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=85')` }} />
                          <div className="text-center p-4 relative z-10 space-y-2_rtl">
                            <span className="inline-block animate-ping rounded-full bg-emerald-500 p-2 text-white">
                              <Play className="h-4 w-4 fill-emerald-500" />
                            </span>
                            <p className="text-xs font-black text-white mt-3">
                              {lang === 'ar' ? 'جاري محاكاة البث المباشر الآمن ومكافحة القرصنة...' : 'Simulating secure video streaming delivery...'}
                            </p>
                            <p className="text-[10px] text-emerald-400 font-bold font-mono">
                              (Referrer: Sanad Sandbox API DRM v2)
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {lockAlert && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/35 rounded-2xl relative flex items-start gap-2.5"
                      >
                        <button
                          onClick={() => setLockAlert(null)}
                          className="absolute top-2 left-2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black text-rose-800 dark:text-rose-450">
                            {lang === 'ar' ? 'المحتوى مغلق 🔒' : 'Premium Content Locked 🔒'}
                          </h4>
                          <p className="text-xs text-rose-700/90 dark:text-rose-350 font-medium mt-1 leading-relaxed">
                            {lockAlert}
                          </p>
                          <button
                            onClick={handleEnrollMock}
                            className="mt-2.5 text-[10px] font-black text-rose-800 hover:text-white hover:bg-rose-600 border border-rose-500 px-3 py-1 rounded-lg transition"
                          >
                            💳 {lang === 'ar' ? 'تفعيل الكورس والاشتراك الآن' : 'Unlock Course Entirely'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
