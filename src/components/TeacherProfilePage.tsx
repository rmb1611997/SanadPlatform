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
  purchasedCourseIds?: string[];
}

export default function TeacherProfilePage({ teacher, courses, lang, onBack, onGetStarted, purchasedCourseIds = [] }: TeacherProfilePageProps) {
  const [activeCourseDetails, setActiveCourseDetails] = useState<Course | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [previewVideoItem, setPreviewVideoItem] = useState<any | null>(null);
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [showCardLightbox, setShowCardLightbox] = useState(false);

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

  const getSubjectLabel = (sub?: string) => {
    if (!sub) return '';
    const subLower = sub.toLowerCase();
    if (lang === 'ar') {
      if (subLower === 'physics') return 'الفيزياء';
      if (subLower === 'math') return 'الرياضيات';
      if (subLower === 'chemistry') return 'الكيمياء';
      if (subLower === 'biology') return 'علم الأحياء';
      // If it contains "خبير مادة", let's clean it up or just show the clean subject
      let cleaned = sub.replace(/خبير مادة\s*/, '').replace(/خبير\s*/, '').trim();
      return cleaned || sub;
    } else {
      if (subLower === 'physics') return 'Physics';
      if (subLower === 'math') return 'Mathematics';
      if (subLower === 'chemistry') return 'Chemistry';
      if (subLower === 'biology') return 'Biology';
      let cleaned = sub.replace(/Physics Senior Faculty Specialist\s*/i, 'Physics').replace(/Expert\s*/i, '').trim();
      return cleaned || sub;
    }
  };

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors pb-24 relative"
    >
      {/* Lightbox for Teacher card image */}
      {showCardLightbox && teacher.cardImage && (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4">
          <div className="absolute right-4 top-4">
            <button 
              onClick={() => setShowCardLightbox(false)}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-all cursor-pointer font-black"
            >
              ✕
            </button>
          </div>
          <div className="max-w-4xl max-h-screen overflow-hidden rounded-2xl shadow-2xl">
            <img src={teacher.cardImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl" alt="Teacher Card" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Clean Header Back Link */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-100 hover:scale-105 rounded-full transition shadow-md text-xs font-black cursor-pointer duration-150 border border-neutral-150 dark:border-neutral-750"
          >
            {lang === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{lang === 'ar' ? 'رجوع للخلف' : 'Back'}</span>
          </button>
        </div>
        
        {/* Master Teacher Profile Header Card */}
        <div className="relative overflow-hidden bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-150/85 dark:border-neutral-800 shadow-2xl p-6 md:p-10 mb-12">
          {/* Subtle Abstract Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 relative z-10">
            {/* Teacher Image Avatar Column & Cover Frame (يمين الصفحة) */}
            <div className="shrink-0 flex flex-col items-center gap-5">
              <div className="relative select-none group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-500 rounded-[64px] blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-[55px] overflow-hidden bg-white dark:bg-neutral-900 border-4 border-white dark:border-neutral-850 flex items-center justify-center shadow-2xl transform group-hover:scale-[1.03] transition-transform duration-500">
                  {teacher.pageImage ? (
                    <img 
                      src={teacher.pageImage} 
                      alt={teacher.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  ) : teacher.avatar && teacher.avatar.length <= 4 ? (
                    <span className="text-[140px] md:text-[190px] select-none leading-none pt-4" role="img" aria-label={teacher.name}>
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
            </div>

            {/* Teacher Details */}
            <div className="flex-1 text-center lg:text-right space-y-6 pt-4 lg:pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      teacher.subjects.map((sub, i) => (
                        <span key={i} className="text-xs font-black uppercase bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-3 py-1 rounded-xl">
                          📚 {getSubjectLabel(sub)}
                        </span>
                      ))
                    ) : (teacher.subject || teacher.specialty) ? (
                      <span className="text-xs font-black uppercase bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-3 py-1 rounded-xl">
                        📚 {getSubjectLabel(teacher.subject || teacher.specialty)}
                      </span>
                    ) : null}
                    {teacher.curriculum && (
                      <span className="text-xs font-black uppercase bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 px-3 py-1 rounded-xl">
                        📖 {lang === 'ar' ? `${teacher.curriculum}` : `Curriculum: ${teacher.curriculum}`}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white leading-tight">
                    {teacher.name}
                  </h1>

                  {teacher.bio && (
                    <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-extrabold max-w-2xl leading-relaxed">
                      {teacher.bio}
                    </p>
                  )}
                </div>

                
                {/* Support Phones displays */}
                {teacher.supportPhones && teacher.supportPhones.length > 0 && (
                  <div className="space-y-2 pt-2 text-right">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                      {lang === 'ar' ? 'الدعم الفني الخاص بالمدرس' : 'WhatsApp Support Desk & Student Care:'}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {teacher.supportPhones.map((ph, idx) => (
                        <a 
                          key={idx}
                          href={`https://wa.me/${ph}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-950 text-emerald-700 dark:text-emerald-450 text-xs font-black rounded-xl hover:bg-emerald-100 transition-all cursor-pointer shadow-sm"
                        >
                          <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.885 1.452 5.482 0 9.945-4.463 9.948-9.949.002-2.66-1.033-5.159-2.908-7.037-1.875-1.877-4.373-2.907-7.031-2.908-5.485 0-9.948 4.464-9.951 9.95-.001 1.796.5 3.51 1.45 4.968L1.921 22.09l4.726-1.24c-1.49-.91-2.28-.47-2.28-.47z" />
                          </svg>
                          <span>{ph} ({lang === 'ar' ? 'اضغط للمحادثة' : 'WhatsApp Support'})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social links dynamic visibility display */}
                {teacher.socialLinks && Object.values(teacher.socialLinks).some((link: any) => link && link.url && link.isVisible) && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">
                      {lang === 'ar' ? 'روابط التواصل الاجتماعي الرسمية للمدرس:' : 'Official Faculty Social Channels:'}
                    </span>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {teacher.socialLinks.facebook && teacher.socialLinks.facebook.isVisible && teacher.socialLinks.facebook.url && (
                        <a 
                          href={teacher.socialLinks.facebook.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-11 px-4 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                          title="Facebook"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                          <span>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
                        </a>
                      )}
                      {teacher.socialLinks.youtube && teacher.socialLinks.youtube.isVisible && teacher.socialLinks.youtube.url && (
                        <a 
                          href={teacher.socialLinks.youtube.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-11 px-4 gap-2 bg-red-650 hover:bg-red-750 text-white rounded-2xl text-xs font-black shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                          title="YouTube"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          <span>{lang === 'ar' ? 'يوتيوب' : 'YouTube'}</span>
                        </a>
                      )}
                      {teacher.socialLinks.tiktok && teacher.socialLinks.tiktok.isVisible && teacher.socialLinks.tiktok.url && (
                        <a 
                          href={teacher.socialLinks.tiktok.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-11 px-4 gap-2 bg-neutral-900 border border-neutral-800 hover:bg-black text-white rounded-2xl text-xs font-black shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                          title="TikTok"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.25 2.76 1.93 4.41 2.02v3.74c-1.74-.11-3.41-.71-4.79-1.78-.29-.22-.55-.47-.8-.74v7.35c.01 1.76-.46 3.53-1.42 4.96-1.72 2.45-4.66 3.82-7.65 3.39-3.23-.41-5.88-2.85-6.52-6.05-.72-3.72 1.34-7.53 4.91-8.72 1.05-.33 2.17-.41 3.26-.22v3.83c-.85-.24-1.77-.16-2.56.28-.96.53-1.57 1.55-1.55 2.66-.02 1.94 1.71 3.47 3.65 3.25 1.54-.11 2.73-1.4 2.78-2.95V.02z"/></svg>
                          <span>{lang === 'ar' ? 'تيك توك' : 'TikTok'}</span>
                        </a>
                      )}
                      {teacher.socialLinks.whatsapp && teacher.socialLinks.whatsapp.isVisible && teacher.socialLinks.whatsapp.url && (
                        <a 
                          href={teacher.socialLinks.whatsapp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-11 px-4 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                          title="WhatsApp"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.18.7 4.2 1.89 5.85L2.1 21.9l4.17-1.1c1.58.87 3.38 1.36 5.3 1.36 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.65 1.29-.45.05-.9.1-2.93-.72-2.03-.82-3.33-2.91-3.43-3.05-.1-.14-.82-1.11-.82-2.11s.52-1.49.71-1.69c.19-.2.42-.25.56-.25.14 0 .28 0 .4.01.12.01.28-.05.44.33.16.38.56 1.37.61 1.47.05.1.1.22.03.36-.07.14-.14.23-.23.33-.09.1-.2.23-.29.33-.11.11-.22.24-.09.46.13.22.58.95 1.24 1.54.85.76 1.56 1 1.78 1.1s.41-.01.56-.16c.15-.15.66-.77.83-1.03.18-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.19.49.3.06.11.06.63-.18 1.31z"/></svg>
                          <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                        </a>
                      )}
                      {teacher.socialLinks.telegram && teacher.socialLinks.telegram.isVisible && teacher.socialLinks.telegram.url && (
                        <a 
                          href={teacher.socialLinks.telegram.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-11 px-4 gap-2 bg-sky-505 hover:bg-sky-600 text-white rounded-2xl text-xs font-black shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                          title="Telegram"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.78-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z"/></svg>
                          <span>{lang === 'ar' ? 'تليجرام' : 'Telegram'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Multiple Academic Grades (الصفوف الدراسية) list display */}
                <div className="pt-4 border-t pt-4 border-neutral-100 dark:border-neutral-800">
                  <span className="text-sm font-black uppercase text-neutral-450 dark:text-neutral-500 block mb-3">
                    {lang === 'ar' ? 'الصفوف الدراسية المعتمدة للمعلّم:' : 'Accredited Class Grades for Students:'}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
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
                          className="text-xs md:text-sm font-black px-4 py-2 bg-indigo-50/60 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 text-neutral-800 dark:text-neutral-250 rounded-2xl transition border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs"
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
                    isSubscribed={purchasedCourseIds.includes(course.id)}
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

                      {purchasedCourseIds.includes(activeCourseDetails.id) && (
                        <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl w-max">
                          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black">
                            ✅ {lang === 'ar' ? 'أنت مشترك في هذا الكورس' : 'You are enrolled in this course'}
                          </span>
                        </div>
                      )}

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
                          {!purchasedCourseIds.includes(activeCourseDetails.id) && (
                            <button
                              onClick={handleEnrollMock}
                              className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition"
                            >
                              💳 {lang === 'ar' ? 'الاشتراك في الكورس' : 'Subscribe Now'}
                            </button>
                          )}
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
