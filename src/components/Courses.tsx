import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Star, Clock, Filter, Layers, X, CheckSquare, Sparkles, ShoppingBag, Play, Lock, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react';
import { Course } from '../types';
import { CourseCard } from './CourseCard';
import { translations, teachersData } from '../data';
import { generateMockModules } from '../utils/coursePreview';

interface CoursesProps {
  courses: Course[];
  lang: 'ar' | 'en';
  onGetStarted: () => void;
  selectedCountry: 'all' | 'EG' | 'SA';
  setSelectedCountry: (country: 'all' | 'EG' | 'SA') => void;
  suggestedOnly?: boolean;
  isLoggedIn?: boolean;
  onSubscribeClick?: (course: Course) => void;
  onViewCourseClick?: (course: Course) => void;
  purchasedCourseIds?: string[];
}

export default function Courses({ 
  courses, 
  lang, 
  onGetStarted, 
  selectedCountry, 
  setSelectedCountry, 
  suggestedOnly = false,
  isLoggedIn = false,
  onSubscribeClick,
  onViewCourseClick,
  purchasedCourseIds = []
}: CoursesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localCountryFilter, setLocalCountryFilter] = useState<'all' | 'EG' | 'SA'>('all');
  const [activeCourseDetails, setActiveCourseDetails] = useState<Course | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [previewVideoItem, setPreviewVideoItem] = useState<any | null>(null);
  const [lockAlert, setLockAlert] = useState<string | null>(null);

  const t = translations[lang];

  // Derive country filter: respect the country selector directly
  const activeCountry = selectedCountry;

  // Filter courses based on active filters
  const filteredCourses = courses.filter((course) => {
    // 1. Filter by country
    const matchesCountry = 
      activeCountry === 'all' || 
      course.country === 'both' || 
      course.country === activeCountry;

    // 2. Filter by category
    const matchesCategory = 
      selectedCategory === 'all' || 
      course.category === selectedCategory;

    return matchesCountry && matchesCategory;
  });

  // Since we want to display all courses in the pool, display filteredCourses
  const displayCourses = filteredCourses;

  const categories = [
    { key: 'all', label: t.coursesFilterAll },
    { key: 'math', label: t.coursesFilterMath },
    { key: 'physics', label: t.coursesFilterPhysics },
    { key: 'chemistry', label: t.coursesFilterChemistry },
    { key: 'biology', label: t.coursesFilterBiology },
    { key: 'languages', label: t.coursesFilterLanguages }
  ];

  // Helper to render appropriate background gradients for courses depending on category
  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case 'math':
        return 'from-blue-600 to-cyan-500';
      case 'physics':
        return 'from-purple-600 to-indigo-500';
      case 'chemistry':
        return 'from-indigo-600 to-blue-500';
      case 'biology':
        return 'from-rose-600 to-orange-500';
      case 'languages':
        return 'from-amber-600 to-orange-500';
      default:
        return 'from-indigo-600 to-blue-500';
    }
  };

  const handleEnrollMock = () => {
    if (onSubscribeClick && activeCourseDetails) {
      onSubscribeClick(activeCourseDetails);
      setActiveCourseDetails(null);
    } else {
      setEnrollSuccess(true);
      setTimeout(() => {
        setEnrollSuccess(false);
        setActiveCourseDetails(null);
        onGetStarted(); // Shows auth signup if visitor is unsubscribed
      }, 2000);
    }
  };

  return (
    <section 
      id="courses"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-20 bg-neutral-50/30 dark:bg-neutral-900/40 relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 text-xs font-bold leading-relaxed">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{suggestedOnly ? (lang === 'ar' ? '  الكورسات المقترحة ' : 'Suggested Courses') : (lang === 'ar' ? 'رحلة تفوقك تبدأ من هنا' : 'Your Road to Perfection Starts Here')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white">
            {suggestedOnly ? (lang === 'ar' ? 'الكورسات المقترحة' : 'Suggested Courses') : t.coursesTitle}
          </h2>
          {suggestedOnly && (
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-medium">
              {lang === 'ar' ? 'باقة منتقاة من أفضل المناهج الدراسية الأكثر تقييماً لمساعدتك على البدء في ثوانٍ' : 'A handpicked selection of top-rated learning paths to fast-track your academic journey'}
            </p>
          )}
        </div>

        {/* Filters Panel Container - Hidden in suggested only mode */}
        {!suggestedOnly && (
          <div className="space-y-6 mb-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full p-1 rounded-2xl bg-neutral-150/50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700 max-w-lg shadow-sm">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`py-2 px-3 text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
                    selectedCountry === 'all'
                      ? 'bg-white text-neutral-900 shadow-md dark:bg-neutral-750 dark:text-white'
                      : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  🌐 {lang === 'ar' ? 'جميع الكورسات' : 'All Curriculums'}
                </button>
                <button
                  onClick={() => setSelectedCountry('EG')}
                  className={`py-2 px-3 text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
                    selectedCountry === 'EG'
                      ? 'bg-white text-neutral-900 shadow-md dark:bg-neutral-750 dark:text-white'
                      : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  🇪🇬 {lang === 'ar' ? 'المنهج المصري' : 'Egyptian'}
                </button>
                <button
                  onClick={() => setSelectedCountry('SA')}
                  className={`py-2 px-3 text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
                    selectedCountry === 'SA'
                      ? 'bg-white text-neutral-900 shadow-md dark:bg-neutral-750 dark:text-white'
                      : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  🇸🇦 {lang === 'ar' ? 'المنهج السعودي' : 'Saudi (Tracks)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                layout
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="flex"
              >
                <div className="w-full">
                  <CourseCard 
                    course={course} 
                    isAr={lang === 'ar'} 
                    role="student" 
                    isSubscribed={purchasedCourseIds.includes(course.id)}
                    onActionClick={() => {
                      if (onViewCourseClick) {
                        onViewCourseClick(course);
                      } else {
                        setActiveCourseDetails(course);
                      }
                    }} 
                    onSubscribeClick={(selectedCourse) => {
                      if (onSubscribeClick) {
                        onSubscribeClick(selectedCourse);
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty fallback state */}
          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-12 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800">
              <span className="text-3xl block">📚</span>
              <h3 className="text-base font-extrabold text-neutral-750 dark:text-neutral-300 mt-3">
                {lang === 'ar' ? 'عذراً، لا يوجد كورسات تطابق هذا الفلتر حالياً' : 'No courses match these filters yet.'}
              </h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1">
                {lang === 'ar' ? 'سيتم رفع وتوفير المناهج كاملة قريباً جداً.' : 'Full curriculums and courses will be available very soon.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Detailed Modal Box Popup */}
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
              {/* Close key */}
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
                    {lang === 'ar' ? 'جاري توجيهك لبوابة التفعيل...' : 'Redirecting to payment activation...'}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                    {lang === 'ar' ? 'سيتم نقلك لحجز واقتطاع المنهج لحظياً.' : 'Customizing study dashboard instantly.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 mt-2">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Course details & Instructor */}
                    <div className="flex-1 space-y-3">
                      <span className="inline-flex rounded bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 text-[10px] font-bold">
                        {activeCourseDetails.level}
                      </span>
                      <h3 className="text-xl font-black text-neutral-850 dark:text-neutral-100 leading-snug">
                        {activeCourseDetails.title}
                      </h3>

                      {/* Tutor info */}
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl">
                        <span className="text-3xl flex items-center justify-center">
                          {(() => {
                            const matchTeacher = teachersData[lang].find(t => t.name.trim() === activeCourseDetails.teacher.trim());
                            const avatar = matchTeacher?.avatar || activeCourseDetails.teacherAvatar || '👨‍🏫';
                            if (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.includes('/')) {
                              return <img src={avatar} alt={activeCourseDetails.teacher} className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800" referrerPolicy="no-referrer" />;
                            }
                            return avatar;
                          })()}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-150">
                            {activeCourseDetails.teacher}
                          </h4>
                        </div>
                      </div>

                      {/* Course stats metrics */}
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

                    {/* Standard items and requirements */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xs font-black uppercase text-neutral-400 dark:text-neutral-500">
                        {lang === 'ar' ? 'محتويات المنهج والدراسة العامة:' : 'Curriculum Contents include:'}
                      </h4>
                      <div className="space-y-1.5 p-3 bg-neutral-50/30 dark:bg-neutral-900/10 rounded-2xl border border-neutral-100 dark:border-neutral-800/40">
                        {[
                          lang === 'ar' ? 'محتوى مرئي شامل ٢٤/٧ عالي الدقة' : 'Full recorded Lectures accessibility 24/7',
                          lang === 'ar' ? 'ملخصات PDF جاهزة للطباعة بعد كل درس' : 'Printable PDF lecture notes and summaries',
                          lang === 'ar' ? 'تمارين وزارية ونماذج سابقة وحلول وتوضيحات' : 'Ministry syllabus questions and quizzes',
                          lang === 'ar' ? 'امتحان إلكتروني شهري لتحدي مستواك' : 'Global monthly online examinations and rankings'
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-bold">
                            <CheckSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active lock Alert or file download messages */}
                  {lockAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl text-xs font-bold border transition ${
                        lockAlert.startsWith('🔒')
                          ? 'bg-orange-50 border-orange-200 text-orange-950 dark:bg-orange-950/20 dark:border-orange-900/30 dark:text-orange-300'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-950 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-300'
                      }`}
                    >
                      <span>{lockAlert}</span>
                    </motion.div>
                  )}

                  {/* Dynamic FREE video player inside the modal */}
                  {previewVideoItem && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-neutral-950 p-5 rounded-3xl text-white space-y-4 relative border-2 border-indigo-500/20 shadow-xl"
                    >
                      <div className="h-44 sm:h-56 bg-black rounded-2xl flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                        <Play className="h-14 w-14 text-indigo-500 animate-pulse" />
                        <p className="text-xs font-extrabold mt-3">
                          {lang === 'ar' ? 'البث التجريبي متاح مجاناً للمعاينة 📺' : 'Free Demo Lecture Stream Active 📺'}
                        </p>
                        <p className="text-[10px] text-neutral-450 mt-1">
                          {lang === 'ar' ? 'أنت الآن تشاهد جزءاً مجانياً من هذا الكورس دون الحاجة للاشتراك.' : 'You are currently reviewing a free preview without subscribing.'}
                        </p>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] text-neutral-550 font-mono">
                          <span>04:15</span>
                          <span>{previewVideoItem.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div>
                          <h5 className="text-xs font-black text-white">{lang === 'ar' ? previewVideoItem.titleAr : previewVideoItem.titleEn}</h5>
                          <p className="text-[9px] text-neutral-400">{lang === 'ar' ? 'محاكاة كاملة لجودة وتجربة المشاهدة الفائقة بالمنهج.' : 'Simulated stream to showcase flawless online speed.'}</p>
                        </div>
                        <button
                          onClick={() => setPreviewVideoItem(null)}
                          className="w-full sm:w-auto px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-black rounded-lg transition border-0 cursor-pointer"
                        >
                          {lang === 'ar' ? 'إغلاق مشغل الفيديو' : 'Close Player'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Interactive Course Preview Syllabus list */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                      <span>{lang === 'ar' ? '🔍 تصفح فصول المجموعات الكاملة وعناصر المقرر (معاينة حرة):' : '🔍 FULL CURRICULUM SYLLABUS DETAIL (FREE PREVIEW MODE):'}</span>
                    </h4>

                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                      {generateMockModules(activeCourseDetails.id).map((mod) => {
                        const isExpanded = expandedModuleId === mod.id;
                        return (
                          <div 
                            key={mod.id} 
                            className="border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30"
                          >
                            <button
                              onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                              className="w-full text-right p-3.5 bg-neutral-100/50 dark:bg-neutral-800/60 flex items-center justify-between text-xs font-black border-0 cursor-pointer"
                            >
                              <span>{lang === 'ar' ? mod.titleAr : mod.titleEn}</span>
                              <span className="text-neutral-450 text-[10px]">
                                {isExpanded ? '▲' : '▼'}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="p-3.5 space-y-3 bg-white dark:bg-neutral-850 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                {mod.items.map((item) => {
                                  const isFree = item.isFree === true;
                                  return (
                                    <div 
                                      key={item.id} 
                                      className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5"
                                    >
                                      <div className="flex items-start gap-2">
                                        <span className="text-xs bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-lg shrink-0 mt-0.5">
                                          {item.type === 'video' && '🎥'}
                                          {item.type === 'file' && '📄'}
                                          {item.type === 'homework' && '📝'}
                                          {item.type === 'quiz' && '🧪'}
                                        </span>
                                        <div>
                                          <p className="text-xs font-bold leading-tight flex items-center gap-1.5 flex-wrap">
                                            <span>{lang === 'ar' ? item.titleAr : item.titleEn}</span>
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                              isFree 
                                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-455'
                                            }`}>
                                              {isFree ? (lang === 'ar' ? '🔓 مجاني' : '🔓 Free Trial') : (lang === 'ar' ? '🔒 مغلق' : '🔒 Premium')}
                                            </span>
                                          </p>
                                          <span className="text-[9px] text-neutral-450 font-bold">
                                            {item.type === 'video' && (lang === 'ar' ? 'درس فيديو' : 'Recorded Lecture')}
                                            {item.type === 'file' && (lang === 'ar' ? 'ملخص مكتوب' : 'Study Notes')}
                                            {item.type === 'homework' && (lang === 'ar' ? 'واجب ومتابعة' : 'Assignment Task')}
                                            {item.type === 'quiz' && (lang === 'ar' ? 'اختبار مخصص' : 'Interactive Assessment')}
                                            {item.duration && ` | ⏱️ ${item.duration}`}
                                            {item.fileSize && ` | 💾 ${item.fileSize}`}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="shrink-0 flex justify-end">
                                        {isFree ? (
                                          item.type === 'video' ? (
                                            <button
                                              onClick={() => {
                                                setPreviewVideoItem(item);
                                                setLockAlert(null);
                                              }}
                                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black cursor-pointer border-0 transition"
                                            >
                                              {lang === 'ar' ? 'تشغيل المقطع 📺' : 'Play Video 📺'}
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                setLockAlert(lang === 'ar' ? `📥 تم محاكاة تنزيل ملف "${item.titleAr}" المفتوح مجاناً للجميع!` : `📥 Simulated downloading resource: "${item.titleEn}"!`);
                                                setTimeout(() => setLockAlert(null), 3500);
                                              }}
                                              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-750 dark:text-white rounded-lg text-[10px] font-bold cursor-pointer border border-neutral-300 dark:border-neutral-700 transition"
                                            >
                                              {lang === 'ar' ? 'تحميل مجاني 💾' : 'Get PDF 💾'}
                                            </button>
                                          )
                                        ) : (
                                          <button
                                            onClick={() => {
                                              setLockAlert(lang === 'ar' ? `🔒 هذا المحتوى مغلق! يرجى الاشتراك وتفعيل الكورس لتتمكن من مشاهدة الدروس، تنزيل المذكرات، وحل الواجبات.` : `🔒 This content is premium! Active course subscription is required to run lessons.`);
                                            }}
                                            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-505 rounded-lg text-[10px] font-bold border-0 cursor-pointer flex items-center gap-1"
                                          >
                                            <Lock className="h-2.5 w-2.5" />
                                            <span>{lang === 'ar' ? 'شراء لفتح المحاضرة' : 'Premium Only'}</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action row price and buy button */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-750">
                    <div>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase">{lang === 'ar' ? 'سعر المقرّر بالكامل' : 'Full price'}</p>
                      <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {activeCourseDetails.price} {activeCourseDetails.currency}
                      </p>
                    </div>

                    <button
                      onClick={handleEnrollMock}
                      className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-650/10 cursor-pointer border-0"
                    >
                      <Sparkles className="h-4 w-4 text-white" />
                      <span>{lang === 'ar' ? 'اشترك الآن بالتفعيل الفوري' : 'Enroll in course'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
