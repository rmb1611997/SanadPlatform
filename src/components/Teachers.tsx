import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Star, ArrowUpRight, Filter, BookOpen, GraduationCap } from 'lucide-react';
import { Teacher } from '../types';
import { translations } from '../data';

interface TeachersProps {
  teachers: Teacher[];
  lang: 'ar' | 'en';
  onSelectTeacher: (teacherId: string) => void;
  hideFilters?: boolean;
}

const arabicPhrases = [
  'نخبة من كبار الخبراء والأكاديميين المكرسين لتمكين مسيرتك العلمية وتكاملها 🎓',
  'شرح مبسط، توجيه دقيق، ومتابعة فورية تضمن لك الدرجات النهائية 📈',
  'نهيئ لك بيئة تعلم ذكية وتفاعلية تتجاوز توقعاتك بكل كفاءة 🏛️',
  'نصنع قصص النجاح الحقيقية خطوة بخطوة مع كوكبة متميزة 🌟'
];

const englishPhrases = [
  'Elite academic experts dedicated to empowering your scientific potential 🎓',
  'Simplified concepts, precise guidance, and constant tracking for top scores 📈',
  'Providing an interactive educational atmosphere to help you exceed expectations 🏛️',
  'We create true success stories step-by-step with premier educators 🌟'
];

export default function Teachers({ teachers, lang, onSelectTeacher, hideFilters = false }: TeachersProps) {
  const t = translations[lang];
  const phrases = lang === 'ar' ? arabicPhrases : englishPhrases;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<'ALL' | 'EG' | 'SA'>('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % phrases.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const filteredTeachers = teachers.filter(t => selectedCountry === 'ALL' || t.country === selectedCountry || t.country === 'both');

  return (
    <section 
      id="teachers"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-neutral-50/50 dark:to-neutral-900/50 pb-8 rounded-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 text-xs font-bold shadow-xs">
            <Award className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'نخبة الكوادر التعليمية بمصر والشرق الأوسط' : 'Elite Academic Leaders'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white border-none pb-0">
            {t.teachersTitle}
          </h2>
          
          {/* Smooth custom automatic writing effect on beautiful typography layout */}
          <div className="min-h-[48px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIdx}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-sm md:text-base font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-350 bg-clip-text text-transparent px-4 py-1 tracking-wide leading-relaxed font-sans text-center max-w-2xl select-none"
              >
                {phrases[currentIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Global Level Country Segment Control (same as courses) */}
        {!hideFilters && (
          <div className="flex justify-center mb-16 relative z-30">
            <div className="relative overflow-visible">
              <div className="flex p-1.5 bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-2xl shadow-inner border border-neutral-200/60 dark:border-neutral-700 max-w-full overflow-x-auto scroller-hide">
                <button
                  onClick={() => setSelectedCountry('ALL')}
                  className={`py-2 px-3 whitespace-nowrap text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
                    selectedCountry === 'ALL'
                      ? 'bg-white text-neutral-900 shadow-md dark:bg-neutral-750 dark:text-white'
                      : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  🌐 {lang === 'ar' ? 'جميع المدرسين' : 'All Teachers'}
                </button>
                <button
                  onClick={() => setSelectedCountry('EG')}
                  className={`py-2 px-3 whitespace-nowrap text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
                    selectedCountry === 'EG'
                      ? 'bg-white text-neutral-900 shadow-md dark:bg-neutral-750 dark:text-white'
                      : 'text-neutral-550 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  🇪🇬 {lang === 'ar' ? 'المنهج المصري' : 'Egyptian'}
                </button>
                <button
                  onClick={() => setSelectedCountry('SA')}
                  className={`py-2 px-3 whitespace-nowrap text-xs md:text-sm font-black rounded-xl transition duration-200 cursor-pointer ${
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

        {/* Teachers Cards Grid with animation */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50/50 dark:bg-neutral-850/30 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 max-w-lg mx-auto space-y-4 shadow-xs">
            <p className="text-neutral-500 dark:text-neutral-400 font-extrabold text-sm">
              {lang === 'ar' 
                ? 'لا يوجد مدرسين مضافين حالياً 👨‍🏫' 
                : 'No academic teachers registered yet 👨‍🏫'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-36 max-w-6xl mx-auto pt-24">
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher, index) => {
                // Assign custom vibrant gradient color schemes to make it look extremely energetic and colorful!
                const bgGradients = [
                  "from-violet-500 via-indigo-500 to-indigo-600",
                  "from-emerald-400 via-teal-500 to-teal-600",
                  "from-rose-500 via-pink-500 to-orange-500",
                  "from-cyan-400 via-blue-500 to-blue-600"
                ];
                const glowColors = [
                  "hover:shadow-violet-500/15",
                  "hover:shadow-emerald-500/15",
                  "hover:shadow-rose-500/15",
                  "hover:shadow-cyan-500/15"
                ];
                const borderColors = [
                  "hover:border-violet-400/50",
                  "hover:border-emerald-400/50",
                  "hover:border-rose-400/50",
                  "hover:border-cyan-400/50"
                ];
                const grad = bgGradients[index % bgGradients.length];
                const glow = glowColors[index % glowColors.length];
                const borderCol = borderColors[index % borderColors.length];

                // Subject details mapping for clear badge & colors coordination
                const getSubjectColorBadge = (sub?: string) => {
                  switch (sub) {
                    case 'physics':
                      return 'bg-blue-50 text-blue-700 border-blue-250 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30';
                    case 'math':
                      return 'bg-purple-50 text-purple-700 border-purple-250 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/30';
                    case 'chemistry':
                      return 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30';
                    case 'biology':
                      return 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/30';
                    default:
                      return 'bg-indigo-50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/40 dark:text-indigo-305 dark:border-indigo-900/30';
                  }
                };

                const getSubjectLabel = (sub?: string) => {
                  if (!sub) return lang === 'ar' ? 'المناهج العامة المعتمدة' : 'General Academic Specialty';
                  const subLower = sub.toLowerCase();
                  if (lang === 'ar') {
                    if (subLower === 'physics') return 'الفيزياء والمسارات العلمية';
                    if (subLower === 'math') return 'الرياضيات والقدرات قياس';
                    if (subLower === 'chemistry') return 'الكيمياء والبيولوجيا العضوية';
                    if (subLower === 'biology') return 'علم الأحياء والجيولوجيا';
                    return sub;
                  } else {
                    if (subLower === 'physics') return 'Physics & Advanced Tracks';
                    if (subLower === 'math') return 'Mathematics & Qudrat Exam';
                    if (subLower === 'chemistry') return 'Modern Organic Chemistry';
                    if (subLower === 'biology') return 'Biology & Earth Geology';
                    return sub;
                  }
                };

                // Academic Grades mapping
                const teacherGrades = (teacher as any).grades || ['1', '2', '3'];
                const getGradeLabel = (g: string) => {
                  if (lang === 'ar') {
                    if (g === '1') return 'الأول الثانوي';
                    if (g === '2') return 'الثاني الثانوي';
                    if (g === '3') return 'الثالث الثانوي';
                    return g;
                  } else {
                    if (g === '1') return '1st Sec';
                    if (g === '2') return '2nd Sec';
                    if (g === '3') return '3rd Sec (Thanaweya)';
                    return `Grade ${g}`;
                  }
                };

                return (
                  <motion.div
                    key={teacher.id}
                    layoutId={teacher.id}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => onSelectTeacher(teacher.id)}
                    className={`group relative flex flex-col justify-between overflow-visible rounded-[32px] bg-white dark:bg-neutral-850 p-8 pt-44 pb-8 border border-neutral-150/85 dark:border-neutral-800 shadow-md hover:shadow-2xl ${glow} ${borderCol} transition-all duration-350 cursor-pointer min-h-[420px]`}
                  >
                    {/* Large Prominent teacher picture offset frame at the top - EXTREMELY ENLARGED */}
                    <div className="absolute -top-16 md:-top-20 left-1/2 -smart-translate-x-1/2 transform -translate-x-1/2 select-none z-10">
                      <div className={`relative h-44 w-44 md:h-56 md:w-56 rounded-[44px] p-2 bg-gradient-to-tr ${grad} shadow-xl transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-350 flex items-center justify-center`}>
                        <div className="w-full h-full rounded-[36px] bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden border border-white/20 shadow-inner">
                          {teacher.cardImage ? (
                            <img 
                              src={teacher.cardImage} 
                              alt={teacher.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          ) : teacher.avatar && teacher.avatar.length <= 4 ? (
                            <span className="text-[100px] md:text-[130px] select-none leading-none pt-2" role="img" aria-label={teacher.name}>
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

                        {/* Highly polished small gold rating badge */}
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-xl py-1 px-2.5 shadow-md flex items-center gap-1 text-[11px] font-black border border-white/20 select-none">
                          <Star className="h-3 w-3 fill-white text-white" />
                          <span>{teacher.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content block in Center */}
                    <div className="text-center space-y-4 flex-1 flex flex-col justify-start">
                      <div className="space-y-3">
                        {/* Name - Enlarged and Prominent */}
                        <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {teacher.name}
                        </h3>

                        {/* Subject Material (المادة العلمية) */}
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${getSubjectColorBadge(teacher.subject)}`}>
                            <BookOpen className="h-3 w-3" />
                            <span>{getSubjectLabel(teacher.subject)}</span>
                          </span>
                        </div>

                        {/* Academic Grades (الصف الدراسي) - Handles multiple grades beautifully */}
                        <div className="mt-2 text-center">
                          <span className="text-[10px] font-black uppercase text-neutral-450 dark:text-neutral-500 block mb-1">
                            {lang === 'ar' ? 'الصفوف المعتمدة للمعلّم:' : 'Accredited Class Grades:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {teacherGrades.map((g: string) => (
                              <span 
                                key={g} 
                                className="text-[10px] font-black px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-150 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors border border-neutral-200/50 dark:border-neutral-700/60"
                              >
                                🎓 {getGradeLabel(g)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call to action element - view teacher page */}
                    <div className="pt-4 mt-4 border-t border-neutral-150/50 dark:border-neutral-800/60 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTeacher(teacher.id);
                        }}
                        className="w-full py-3 text-xs font-black rounded-2xl border border-neutral-200 bg-white text-neutral-700 group-hover:border-indigo-500 group-hover:bg-indigo-650 group-hover:text-white active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:group-hover:bg-indigo-500 dark:group-hover:text-white dark:group-hover:border-indigo-500 transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-sans tracking-wide"
                      >
                        <span>{lang === 'ar' ? 'تصفح صفحة الأستاذ بالكامل' : 'View Full Teacher Profile'}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
