import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Play, FileText, CheckCircle, AlertCircle, 
  ArrowLeft, Eye, HelpCircle, Send, Check, DollarSign, Award, Download, Lock
} from 'lucide-react';
import { Course, CourseModule, CourseModuleItem, Teacher } from '../types';
import { CourseCard, getCourseImageSrc } from './CourseCard';
import { generateMockModules } from '../utils/coursePreview';
import { SecureVideoPlayer } from './SecureVideoPlayer';
import { teachersData } from '../data';

const getEmbedUrl = (url: string, source?: string): { isEmbeddable: boolean; embedUrl: string } => {
  if (!url) return { isEmbeddable: false, embedUrl: '' };

  const isBunny = source === 'bunny' || url.includes('bunny') || url.includes('iframe.mediadelivery.net');
  
  if (isBunny) {
    const isLocalOrMp4 = url.endsWith('.mp4') || url.includes('.m3u8') || url.endsWith('.webm');
    if (isLocalOrMp4) {
      return { isEmbeddable: false, embedUrl: url };
    }
    // For bunny CDN iframe link, it is ready to be used as embed URL
    return { isEmbeddable: true, embedUrl: url };
  }

  // YouTube processing
  let videoId = '';
  const regExpParam = /[?&]v=([^&#]*)/;
  const matchParam = url.match(regExpParam);
  if (matchParam && matchParam[1]) {
    videoId = matchParam[1];
  } else {
    const regExpShort = /youtu\.be\/([^?&#]*)/;
    const matchShort = url.match(regExpShort);
    if (matchShort && matchShort[1]) {
      videoId = matchShort[1];
    } else {
      const regExpEmbed = /youtube\.com\/embed\/([^?&#]*)/;
      const matchEmbed = url.match(regExpEmbed);
      if (matchEmbed && matchEmbed[1]) {
        videoId = matchEmbed[1];
      } else {
        const regExpShorts = /youtube\.com\/shorts\/([^?&#]*)/;
        const matchShorts = url.match(regExpShorts);
        if (matchShorts && matchShorts[1]) {
          videoId = matchShorts[1];
        }
      }
    }
  }

  if (videoId) {
    return { isEmbeddable: true, embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` };
  }

  if (url.includes('iframe') || url.includes('embed') || url.includes('mediadelivery.net') || url.includes('youtube.com')) {
    return { isEmbeddable: true, embedUrl: url };
  }

  return { isEmbeddable: false, embedUrl: url };
};

interface StudentCoursesTabProps {
  user: {
    name: string;
    phone: string;
    country?: 'EG' | 'SA';
    grade?: string;
    isGuest?: boolean;
  };
  lang: 'ar' | 'en';
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  purchasedCourseIds: string[];
  setPurchasedCourseIds: React.Dispatch<React.SetStateAction<string[]>>;
  initialCourseId?: string | null;
  initialCourseAction?: 'view' | 'subscribe' | null;
  onClearInitialCourse?: () => void;
  onRequireAuth?: (tab: 'login' | 'signup', courseId?: string) => void;
  onTeacherSelect?: (teacherId: string) => void;
}

export default function StudentCoursesTab({
  user,
  lang,
  walletBalance,
  setWalletBalance,
  purchasedCourseIds,
  setPurchasedCourseIds,
  initialCourseId = null,
  initialCourseAction = null,
  onClearInitialCourse,
  onRequireAuth,
  onTeacherSelect
}: StudentCoursesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'mine'>('all');
  const [insideCourse, setInsideCourse] = useState<Course | null>(null);
  
  // Custom interaction states for Inside Course
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoItem, setActiveVideoItem] = useState<CourseModuleItem | null>(null);
  
  // Interactive Homework state
  const [activeHomeworkItem, setActiveHomeworkItem] = useState<CourseModuleItem | null>(null);
  const [homeworkAnswers, setHomeworkAnswers] = useState<Record<number, number>>({});
  const [homeworkSubmitted, setHomeworkSubmitted] = useState(false);
  const [homeworkScore, setHomeworkScore] = useState<number | null>(null);

  // Interactive Quiz state
  const [activeQuizItem, setActiveQuizItem] = useState<CourseModuleItem | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const [enrollError, setEnrollError] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState('');

  // Course watch history and completion scores loaded from localStorage
  const [watchProgress, setWatchProgress] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`sanad_student_watch_${user.name}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [completedScores, setCompletedScores] = useState<Record<string, { type: 'homework' | 'quiz', score: number }>>(() => {
    const saved = localStorage.getItem(`sanad_student_scores_${user.name}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(`sanad_student_watch_${user.name}`, JSON.stringify(watchProgress));
  }, [watchProgress, user.name]);

  useEffect(() => {
    localStorage.setItem(`sanad_student_scores_${user.name}`, JSON.stringify(completedScores));
  }, [completedScores, user.name]);

  // Import courses lists
  const isAr = lang === 'ar';
  
  // Custom dynamic load and safety of lists
  const importCoursesList = (): Course[] => {
    // Dynamically retrieve fresh courses from localStorage or default list
    const defaultCourses: Course[] = [
      {
        id: 'c1',
        title: 'الفيزياء الكهربية والحديثة - الصف الثالث الثانوي',
        teacher: 'الأستاذ أحمد سامي',
        teacherTitle: 'مدرس الفيزياء الأول',
        teacherAvatar: '👨‍🏫',
        lessons: 42,
        duration: '٣٢ ساعة',
        price: 250,
        currency: 'جنيه / ريال',
        rating: 4.92,
        category: 'physics',
        country: 'both',
        level: 'الصف الثالث الثانوي',
        description: 'امتحانات دورية وتدريبات شاملة تغطي كافة فصول الفيزياء الكهربية والحديثة مع المدرس المعتمد للوصول للدرجة النهائية.',
        createdAt: '2026-01-10',
        updatedAt: '2026-06-10'
      },
      {
        id: 'c2',
        title: 'الرياضيات البحتة (التفاضل والتكامل) للثانوية العامة',
        teacher: 'الأستاذ فهد العتيبي',
        teacherTitle: 'مدرس الرياضيات الأول',
        teacherAvatar: '👨‍🏫',
        lessons: 35,
        duration: '٢٨ ساعة',
        price: 300,
        currency: 'جنيه / ريال',
        rating: 4.85,
        category: 'math',
        country: 'EG',
        level: 'الثانوية العامة المصرية',
        description: 'شرح مبسط لقواعد التفاضل والتكامل برؤية هندسية مبتكرة وأمثلة وتدريبات تفاعلية لحل أصعب المسائل.',
        createdAt: '2026-01-15',
        updatedAt: '2026-06-08'
      },
      {
        id: 'c3',
        title: 'رياضيات ٥ - مسار العلوم الطبيعية (السعودية)',
        teacher: 'الأستاذ فهد العتيبي',
        teacherTitle: 'مدرس رياضيات المسارات',
        teacherAvatar: '👨‍🏫',
        lessons: 30,
        duration: '٢٤ ساعة',
        price: 350,
        currency: 'ريال',
        rating: 4.9,
        category: 'math',
        country: 'SA',
        level: 'المرحلة الثانوية - مسارات',
        description: 'دورة تفصيلية ومكثفة لمقرر رياضيات 5 المسارات السعودية مع حل نماذج اختبارات نهاية الفصل والأسئلة الهامة.',
        createdAt: '2026-02-01',
        updatedAt: '2026-06-11'
      },
      {
        id: 'c4',
        title: 'دورة القدرات العامة - التأسيس والتدريب والحلول السريعة',
        teacher: 'الأستاذ فهد العتيبي',
        teacherTitle: 'مدرس القدرات والتحصيلي',
        teacherAvatar: '👨‍🏫',
        lessons: 25,
        duration: '٢٠ ساعة',
        price: 180,
        currency: 'ريال',
        rating: 4.95,
        category: 'math',
        country: 'SA',
        level: 'القدرات العامة',
        description: 'التأسيس والحل السريع لكل تجميعات الكمي واللفظي بذكاء وسرعة لضمان تحصيل الدرجة الكاملة 100% بإذن الله.',
        createdAt: '2026-02-12',
        updatedAt: '2026-06-09'
      },
      {
        id: 'c5',
        title: 'الكيمياء العضوية المتقدمة - كيمياء وتجارب معملية تفاعلية',
        teacher: 'الأستاذة نورة الحربي',
        teacherTitle: 'معلمة الكيمياء القديرة',
        teacherAvatar: '👩‍🏫',
        lessons: 28,
        duration: '٢٢ ساعة',
        price: 280,
        currency: 'جنيه / ريال',
        rating: 4.88,
        category: 'chemistry',
        country: 'both',
        level: 'الثانوي العام والمسارات',
        description: 'تجارب معملية ثلاثية الأبعاد وشرح وافٍ لمعادلات وتفاعلات المركبات العضوية لتيسير الحفظ والفهم.',
        createdAt: '2026-02-20',
        updatedAt: '2026-06-10'
      },
      {
        id: 'c6',
        title: 'شرح النحو والبلاغة بالخرائط الذهنية المبسطة للطلاب والناشئين',
        teacher: 'الأستاذ فاروق النجار',
        teacherTitle: 'أستاذ اللسان العربي القدير',
        teacherAvatar: '👨‍🏫',
        lessons: 38,
        duration: '٣٠ ساعة',
        price: 200,
        currency: 'جنيه / ريال',
        rating: 4.97,
        category: 'languages',
        country: 'both',
        level: 'المرحلة الثانوية',
        description: 'تبسيط شامل لدروس القواعد النحوية ومناهج البلاغة باستخدام الخرائط الذهنية لتثبيت القواعد في الأذهان.',
        createdAt: '2026-03-01',
        updatedAt: '2026-06-11'
      },
      {
        id: 'c7',
        title: 'الأحياء - الوراثة والبيولوجيا الجزيئية والدنا',
        teacher: 'الأستاذ أحمد سامي',
        teacherTitle: 'أستاذ العلوم الحديثة',
        teacherAvatar: '👨‍🏫',
        lessons: 32,
        duration: '٢٦ ساعة',
        price: 240,
        currency: 'جنيه / ريال',
        rating: 4.79,
        category: 'biology',
        country: 'EG',
        level: 'الصف الثالث الثانوي',
        description: 'تفسير كامل لدروس الوراثة والبيولوجيا الجزيئية والهندسة الوراثية بروسومات كرتونية وتوضيحية رائعة ومبسطة.',
        createdAt: '2026-03-10',
        updatedAt: '2026-06-10'
      }
    ];

    const engCourses: Course[] = [
      {
        id: 'c1',
        title: 'Electrodynamics & Modern Physics - High School Grade 12',
        teacher: 'Mr. Ahmed Saimi',
        teacherTitle: 'Senior Physics Specialist',
        teacherAvatar: '👨‍🏫',
        lessons: 42,
        duration: '32 Hours',
        price: 250,
        currency: 'EGP / SAR',
        rating: 4.92,
        category: 'physics',
        country: 'both',
        level: 'Grade 12 (High School)'
      },
      {
        id: 'c2',
        title: 'Pure Mathematics (Calculus) for Egyptian Curriculum',
        teacher: 'Mr. Fahad Al-Otaibi',
        teacherTitle: 'Senior Mathematics Instructor',
        teacherAvatar: '👨‍🏫',
        lessons: 35,
        duration: '28 Hours',
        price: 300,
        currency: 'EGP',
        rating: 4.85,
        category: 'math',
        country: 'EG',
        level: 'Thanaweya Amma (Egypt)'
      },
      {
        id: 'c3',
        title: 'Mathematics 5 - Natural Sciences Track (KSA)',
        teacher: 'Mr. Fahad Al-Otaibi',
        teacherTitle: 'Senior Mathematics Instructor',
        teacherAvatar: '👨‍🏫',
        lessons: 30,
        duration: '24 Hours',
        price: 350,
        currency: 'SAR',
        rating: 4.90,
        category: 'math',
        country: 'SA',
        level: 'Secondary Stage - Saudi Tracks'
      },
      {
        id: 'c4',
        title: 'General Qudrat Prep Course - Quick Solutions & Strategies',
        teacher: 'Mr. Fahad Al-Otaibi',
        teacherTitle: 'Qudrat & Tahsili Expert',
        teacherAvatar: '👨‍🏫',
        lessons: 25,
        duration: '20 Hours',
        price: 180,
        currency: 'SAR',
        rating: 4.95,
        category: 'math',
        country: 'SA',
        level: 'Qudrat (KSA Exam)'
      },
      {
        id: 'c5',
        title: 'Advanced Organic Chemistry - Interactive Remote Lab Experiments',
        teacher: 'Mrs. Noura Al-Harbi',
        teacherTitle: 'Senior Chemistry Instructor',
        teacherAvatar: '👩‍🏫',
        lessons: 28,
        duration: '22 Hours',
        price: 280,
        currency: 'EGP / SAR',
        rating: 4.88,
        category: 'chemistry',
        country: 'both',
        level: 'High School & Tracks'
      },
      {
        id: 'c6',
        title: 'Arabic Grammar & Rhetoric using Mind-Mapping Methodology',
        teacher: 'Mr. Farouk Al-Najjar',
        teacherTitle: 'Arabic Literature Specialist',
        teacherAvatar: '👨‍🏫',
        lessons: 38,
        duration: '30 Hours',
        price: 200,
        currency: 'EGP / SAR',
        rating: 4.97,
        category: 'languages',
        country: 'both',
        level: 'Secondary Stage'
      },
      {
        id: 'c7',
        title: 'Biology - Genetics & Molecular DNA Engineering',
        teacher: 'Mr. Ahmed Saimi',
        teacherTitle: 'Senior Science Expert',
        teacherAvatar: '👨‍🏫',
        lessons: 32,
        duration: '26 Hours',
        price: 240,
        currency: 'EGP',
        rating: 4.79,
        category: 'biology',
        country: 'EG',
        level: 'Thanaweya Amma (Egypt)'
      }
    ];

    const saved = localStorage.getItem('sanad_custom_courses_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    return isAr ? defaultCourses : engCourses;
  };

  const allCourses = importCoursesList().filter(course => {
    if (!user || !user.country) return true;
    return course.country === 'both' || course.country === user.country;
  });

  // Subscribed courses
  const myCourses = allCourses.filter(course => purchasedCourseIds.includes(course.id));

  useEffect(() => {
    if (initialCourseId) {
      const course = allCourses.find(c => c.id === initialCourseId);
      if (course) {
        handleEnterCourse(course);
      }
      onClearInitialCourse?.();
    } else if (user.isGuest && !insideCourse) {
      if (allCourses.length > 0) {
        handleEnterCourse(allCourses[0]);
      }
    }
  }, [initialCourseId, initialCourseAction, user.isGuest, allCourses, insideCourse]);

  // Helper function to handle entering any course directly
  const handleEnterCourse = (course: Course) => {
    setInsideCourse(course);
    setActiveVideoUrl(null);
    setActiveHomeworkItem(null);
    setActiveQuizItem(null);
    setHomeworkAnswers({});
    setHomeworkSubmitted(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    // Expand the first module by default
    const freshMods = generateMockModules(course.id);
    if (freshMods.length > 0) {
      setExpandedModuleId(freshMods[0].id);
    }
  };

  // Course subscription handler using virtual credits
  const handleSubscribe = (course: Course) => {
    setEnrollError('');
    setEnrollSuccess('');

    if (user.phone === 'guest') {
      if (onRequireAuth) {
        onRequireAuth('login', course.id);
      }
      return;
    }

    if (purchasedCourseIds.includes(course.id)) {
      setEnrollError(isAr ? '⚠️ أنت مشترك بالفعل في هذا الكورس!' : '⚠️ You are already subscribed to this course!');
      return;
    }

    const finalPrice = (course.discountPrice && Number(course.discountPrice) < course.price) ? Number(course.discountPrice) : course.price;

    if (walletBalance < finalPrice) {
      setEnrollError(
        isAr 
          ? `⚠️ رصيد محفظتك غير كافٍ! ثمن الكورس ${finalPrice} ورصيدك الحالي ${walletBalance}. اشحن المحفظة للاشتراك.`
          : `⚠️ Insufficient balance! The course costs ${finalPrice} and your current balance is ${walletBalance}. Please recharge first.`
      );
      return;
    }

    // Deduct and subscribe
    setWalletBalance(prev => prev - finalPrice);
    const updated = [...purchasedCourseIds, course.id];
    setPurchasedCourseIds(updated);
    setEnrollSuccess(
      isAr 
        ? `🎉 مبارك! تم اشتراكك بنجاح في كورس "${course.title}". تصفحه الآن في قسم "كورساتي".`
        : `🎉 Success! You have enrolled in "${course.title}". Start learning in the "My Courses" section.`
    );
  };

  const dismissAlerts = () => {
    setEnrollError('');
    setEnrollSuccess('');
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Banner */}
      {(enrollError || enrollSuccess) && (
        <div 
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            enrollError 
              ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300'
          } text-sm font-bold shadow-xs`}
        >
          <div className="flex items-center gap-2">
            {enrollError ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
            <span>{enrollError || enrollSuccess}</span>
          </div>
          <button onClick={dismissAlerts} className="text-xs underline hover:opacity-80">
            {isAr ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Main Course Hub UI */}
      {!insideCourse ? (
        <div className="space-y-6">
          {/* Top Sub-Tabs Toggle: All Courses vs My Courses */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-700 pb-px">
            <button
              id="btn_all_courses_tab"
              onClick={() => {
                setActiveSubTab('all');
                dismissAlerts();
              }}
              className={`flex-1 py-3 text-center text-sm font-black transition relative ${
                activeSubTab === 'all'
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-neutral-550 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'
              }`}
            >
              📚 {isAr ? 'جميع كورسات المنصة (All Courses)' : 'Discover All Platform Courses'}
            </button>
            <button
              id="btn_my_courses_tab"
              onClick={() => {
                setActiveSubTab('mine');
                dismissAlerts();
              }}
              className={`flex-1 py-3 text-center text-sm font-black transition relative ${
                activeSubTab === 'mine'
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-neutral-550 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'
              }`}
            >
              📌 {isAr ? 'كورساتي (My Courses)' : 'My Enrolled Courses'}
              {myCourses.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold">
                  {myCourses.length}
                </span>
              )}
            </button>
          </div>

          {/* ACTIVE TAB: ALL COURSES */}
          {activeSubTab === 'all' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20 text-center">
                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  💡 {isAr ? 'تصفح كل المناهج المتاحة وقم بتوسيع نطاق دراستك. اضغط على "اشترك الآن" للتفعيل الفوري.' : 'Discover and subscribe to advanced high school programs instantly.'}
                </p>
              </div>

              <div id="student_all_courses_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.filter(course => course.isVisible !== false).map((course) => {
                  const isOwned = purchasedCourseIds.includes(course.id);
                  return (
                    <motion.div 
                      key={course.id} 
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                      <CourseCard 
                        course={course} 
                        isAr={isAr} 
                        role="student" 
                        isSubscribed={isOwned}
                        onActionClick={() => handleEnterCourse(course)} 
                        onSubscribeClick={() => handleSubscribe(course)}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE TAB: MY COURSES */}
          {activeSubTab === 'mine' && (
            <div className="space-y-4">
              {myCourses.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 space-y-4">
                  <BookOpen className="h-12 w-12 text-neutral-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-neutral-800 dark:text-white">
                      {isAr ? 'لا يوجد أي اشتراكات جارية في حسابك حالياً.' : 'You have not enrolled in any courses yet.'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {isAr ? 'تصفح قائمة "جميع كورسات المنصة" لتتمكن من تفعيل مناهجك المفضلة والبدء بالدراسة.' : 'Go to all courses tab and spend some credits to unlock premium tracks.'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveSubTab('all')}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                  >
                    {isAr ? 'اكتشف كورسات جديدة الآن' : 'Discover Courses Now'}
                  </button>
                </div>
              ) : (
                <div id="student_my_courses_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => {
                    return (
                      <motion.div 
                        key={course.id} 
                        whileHover={{ y: -8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      >
                        <CourseCard 
                          course={course} 
                          isAr={isAr} 
                          role="student" 
                          isSubscribed={true}
                          onActionClick={() => handleEnterCourse(course)} 
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 📖 COURSE INSIDE VIEW */
        <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
            
            {/* Back Navigation Bar */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-750 pb-4">
              {!user.isGuest ? (
                <button
                  onClick={() => setInsideCourse(null)}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{isAr ? 'الرجوع لقائمة المناهج' : 'Back to Courses list'}</span>
                </button>
              ) : (
                <div />
              )}
              <div className="text-right">
                <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-[10px] font-black">
                  {insideCourse.teacher}
                </span>
              </div>
            </div>

            {/* Extremely Stunning Dynamic Course Preview Banner Container */}
            <div className={`relative rounded-[32px] overflow-hidden p-6 sm:p-8 bg-neutral-900 border border-neutral-800 dark:border-neutral-700/50 shadow-2xl flex flex-col ${isAr ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 lg:gap-8 justify-between w-full`}>
              
              {/* Animated soft gradient background effects and lively shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-neutral-950 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.22),transparent_60%)] pointer-events-none animate-pulse" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
              
              {/* Live Decorative Shapes to fulfill "تأثيرات وأشكال حية جذابة" */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute bottom-5 left-1/3 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none animate-bounce duration-[10000ms]" />

              {/* Main Info section */}
              <div className={`relative z-10 space-y-4 w-full lg:w-2/3 ${isAr ? 'text-right' : 'text-left'}`}>
                
                {/* Level / Grace Grade text bubble */}
                <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
                  🏫 {insideCourse.level}
                </div>

                {/* Course Title */}
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-sky-200 leading-tight">
                  {insideCourse.title}
                </h1>

                {/* Description Placement beneath Course Title */}
                <p className="text-xs sm:text-sm text-indigo-200/95 leading-relaxed font-bold max-w-xl">
                  {insideCourse.description || (isAr 
                    ? 'كورس تحضيري شامل خطوة بخطوة للوصول للدرجة الكاملة بأساليب شرح متميزة.' 
                    : 'A comprehensive step-by-step preparatory course to help you achieve full marks.')}
                </p>

                {/* Beautified Teacher Layout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-5 py-4 rounded-3xl w-max max-w-full backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors duration-300">
                  <span className="text-4xl drop-shadow-lg flex items-center justify-center">
                    {(() => {
                      const matchTeacher = teachersData[lang].find(t => t.name.trim() === insideCourse.teacher.trim());
                      const avatar = matchTeacher?.avatar || insideCourse.teacherAvatar || '👨‍🏫';
                      if (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.includes('/')) {
                        return <img src={avatar} alt={insideCourse.teacher} className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-md bg-neutral-800" referrerPolicy="no-referrer" />;
                      }
                      return avatar;
                    })()}
                  </span>
                  <div className={`flex flex-col ${isAr ? 'text-right' : 'text-left'}`}>
                    <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 drop-shadow-md">
                      {insideCourse.teacher}
                    </div>
                  </div>
                  <div className="sm:ml-auto sm:mr-4 mt-2 sm:mt-0 flex">
                    <button
                      onClick={() => {
                        const teacherId = teachersData[lang].find(t => t.name.trim() === insideCourse.teacher.trim())?.id;
                        if (teacherId && onTeacherSelect) {
                          onTeacherSelect(teacherId);
                        } else {
                          // Fallback or handle if not found
                          console.log('Teacher not found in list', insideCourse.teacher);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition duration-300 shadow-md flex items-center gap-2 border border-indigo-400/50 cursor-pointer"
                    >
                      <span>{isAr ? 'زيارة صفحة المعلم' : 'Visit Teacher Profile'}</span>
                      <ArrowLeft className={`w-3 h-3 ${isAr ? '' : 'rotate-180'}`} />
                    </button>
                  </div>
                </div>

                {/* Sleek Course Dates Display */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-1">
                  <span className="bg-white/5 border border-white/10 text-neutral-300 px-3 py-1 rounded-full text-[11px] font-black">
                    📅 {isAr ? 'تاريخ الإنشاء:' : 'Created:'} <span className="text-indigo-300 font-extrabold">{insideCourse.createdAt || '2026-01-10'}</span>
                  </span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-black">
                    🔄 {isAr ? 'آخر تحديث للكورس:' : 'Last Updated:'} <span className="text-emerald-300 font-extrabold">{insideCourse.updatedAt || '2026-06-11'}</span>
                  </span>
                </div>

              </div>

              {/* Course professional photo representation to the left (with effects) - Enlarged */}
              <div className="relative z-10 w-full lg:w-1/3 flex justify-center">
                <div className="relative group/photo h-[340px] w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] border-4 border-white/15 transition-all duration-500 hover:scale-[1.03] hover:-rotate-1">
                  
                  {/* Glowing shimmer outline */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/photo:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  
                  {/* Actual Course Image with custom function */}
                  <img
                    src={getCourseImageSrc(insideCourse)}
                    alt={insideCourse.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/photo:scale-110"
                  />
                  
                  {/* Visual gradient filter over the image to keep it premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                </div>
              </div>

            </div>

          {/* Active Interactive Player Block - If video is playing */}
          {activeVideoUrl && activeVideoItem && (
            <div className="bg-neutral-900 rounded-3xl overflow-hidden p-6 text-white space-y-4 relative shadow-2xl border-4 border-neutral-800">
              <div className="absolute top-2 right-2 bg-black/60 px-3 py-1 text-[10px] rounded-full text-indigo-400 font-mono z-10">
                {activeVideoItem.duration}
              </div>
              
              <SecureVideoPlayer
                videoUrl={activeVideoUrl}
                videoSource={activeVideoItem.videoSource}
                studentName={user.name}
                studentPhone={user.phone}
                title={isAr ? activeVideoItem.titleAr : activeVideoItem.titleEn}
                isAr={isAr}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <h5 className="text-sm font-black text-white">{isAr ? activeVideoItem.titleAr : activeVideoItem.titleEn}</h5>
                  <p className="text-[10px] text-neutral-400">{isAr ? 'شاهد المحاضرة حتى نهايتها لحصد علامات المشاهدة في ملفك.' : 'Keep watching to unlock score progress metrics.'}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      // Mark as watched
                      const updated = { ...watchProgress, [activeVideoItem.id]: true };
                      setWatchProgress(updated);
                      setActiveVideoUrl(null);
                      setActiveVideoItem(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1 transition cursor-pointer border-0"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isAr ? 'أكملت المشاهدة' : 'Mark as Finished'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveVideoUrl(null);
                      setActiveVideoItem(null);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-bold rounded-xl cursor-pointer border-0"
                  >
                    {isAr ? 'إغلاق المشغل' : 'Close Player'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE INTERACTIVE HOMEWORK FORM */}
          {activeHomeworkItem && (
            <div className="bg-neutral-50 dark:bg-neutral-850 p-6 rounded-3xl border-2 border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-155 dark:border-neutral-750 pb-3">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  ✏️ {isAr ? 'حل الواجب المدرسي المعتمد' : 'Interactive Assignment Desk'}
                </span>
                <button 
                  onClick={() => {
                    setActiveHomeworkItem(null);
                    setHomeworkAnswers({});
                    setHomeworkSubmitted(false);
                    setHomeworkScore(null);
                  }}
                  className="text-xs text-neutral-400 hover:underline"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {isAr ? activeHomeworkItem.titleAr : activeHomeworkItem.titleEn}
              </h4>

              {!homeworkSubmitted ? (
                <div className="space-y-4">
                  {activeHomeworkItem.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                      <p className="text-xs font-black text-neutral-800 dark:text-gray-200">
                        {qIdx + 1}. {isAr ? q.qAr : q.qEn}
                      </p>
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {(isAr ? q.optionsAr : q.optionsEn).map((opt, oIdx) => {
                          const isSelected = homeworkAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setHomeworkAnswers(p => ({ ...p, [qIdx]: oIdx }))}
                              className={`w-full text-right p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' 
                                  : 'bg-neutral-50/50 hover:bg-neutral-50 border-neutral-100 dark:bg-neutral-900/40 dark:border-neutral-800 text-neutral-600'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="h-4 w-4 text-indigo-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    disabled={Object.keys(homeworkAnswers).length < (activeHomeworkItem.questions?.length || 0)}
                    onClick={() => {
                      // Calculate Homework grade
                      let correct = 0;
                      activeHomeworkItem.questions?.forEach((q, idx) => {
                        if (homeworkAnswers[idx] === q.correct) correct++;
                      });
                      const percent = Math.round((correct / (activeHomeworkItem.questions?.length || 1)) * 100);
                      
                      setHomeworkScore(percent);
                      setHomeworkSubmitted(true);
                      
                      // Save grade in completedScores database
                      const scoreKey = activeHomeworkItem.id;
                      setCompletedScores(prev => ({
                        ...prev,
                        [scoreKey]: { type: 'homework', score: percent }
                      }));
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-black rounded-xl"
                  >
                    {isAr ? 'تسجيل إجابات الواجب للمراجعة 🏁' : 'Submit My Work 🏁'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {homeworkScore}%
                  </div>
                  <p className="text-xs font-bold text-neutral-800 dark:text-gray-200">
                    {isAr ? '🎉 تم تسجيل وحفظ أداء واجبك المدرسي بنجاح!' : '🎉 Work recorded successfully!'}
                  </p>
                  <p className="text-[10px] text-neutral-450">
                    {homeworkScore >= 80 
                      ? (isAr ? 'ممتاز جداً! هذا الأداء الباهر يؤهلك لنيل تصنيف الأبطال المتفوقين مجدداً.' : 'Outstanding comprehension!')
                      : (isAr ? 'أداء طيب، يمكنك الاطلاع على الخلاصات والملخصات لرفع معدلك القادم.' : 'Review concepts to score higher.')}
                  </p>
                  <button
                    onClick={() => {
                      setActiveHomeworkItem(null);
                      setHomeworkAnswers({});
                      setHomeworkSubmitted(false);
                      setHomeworkScore(null);
                    }}
                    className="px-6 py-1.5 bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl hover:bg-neutral-300"
                  >
                    {isAr ? 'العودة لدروس المقرّر' : 'Close Assignment'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE INTERACTIVE QUIZ FORM */}
          {activeQuizItem && (
            <div className="bg-neutral-50 dark:bg-neutral-850 p-6 rounded-3xl border-2 border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-155 dark:border-neutral-750 pb-3">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  🧪 {isAr ? 'حل الامتحان التجريبي للوحدة' : 'Interactive Module Assessment'}
                </span>
                <button 
                  onClick={() => {
                    setActiveQuizItem(null);
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                  }}
                  className="text-xs text-neutral-400 hover:underline"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {isAr ? activeQuizItem.titleAr : activeQuizItem.titleEn}
              </h4>

              {!quizSubmitted ? (
                <div className="space-y-4">
                  {activeQuizItem.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                      <p className="text-xs font-black text-neutral-800 dark:text-gray-200">
                        {qIdx + 1}. {isAr ? q.qAr : q.qEn}
                      </p>
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {(isAr ? q.optionsAr : q.optionsEn).map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setQuizAnswers(p => ({ ...p, [qIdx]: oIdx }))}
                              className={`w-full text-right p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' 
                                  : 'bg-neutral-50/50 hover:bg-neutral-50 border-neutral-100 dark:bg-neutral-900/40 dark:border-neutral-800 text-neutral-600'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="h-4 w-4 text-indigo-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    disabled={Object.keys(quizAnswers).length < (activeQuizItem.questions?.length || 0)}
                    onClick={() => {
                      // Calculate Quiz grade
                      let correct = 0;
                      activeQuizItem.questions?.forEach((q, idx) => {
                        if (quizAnswers[idx] === q.correct) correct++;
                      });
                      const percent = Math.round((correct / (activeQuizItem.questions?.length || 1)) * 100);
                      
                      setQuizScore(percent);
                      setQuizSubmitted(true);
                      
                      // Save grade in completedScores database
                      const scoreKey = activeQuizItem.id;
                      setCompletedScores(prev => ({
                        ...prev,
                        [scoreKey]: { type: 'quiz', score: percent }
                      }));
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-xl"
                  >
                    {isAr ? 'إنهاء وحساب التقييم الفوري 🏆' : 'Submit and Grade Assessment 🏆'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="text-2xl font-black text-indigo-650 dark:text-indigo-400 font-mono">
                    {quizScore}%
                  </div>
                  <p className="text-xs font-bold text-neutral-800 dark:text-gray-200">
                    {isAr ? '🎉 تم تصحيح الامتحان الإلكتروني بنجاح!' : '🎉 Exam evaluated successfully!'}
                  </p>
                  <p className="text-[10px] text-neutral-455">
                    {quizScore >= 90
                      ? (isAr ? 'متفوق بارع بدرجة الشرف ومستواك مبهر وممتاز!' : 'Excellent performance on all parameters.')
                      : (isAr ? 'أداء متوسط، ننصحك بإعادة مشاهدة محاضرة الفيديو للتمكن من فك شفرات القوانين الصعبة.' : 'Comprehension level: Medium. Please re-watch visual files.')}
                  </p>
                  <button
                    onClick={() => {
                      setActiveQuizItem(null);
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className="px-6 py-1.5 bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl hover:bg-neutral-300"
                  >
                    {isAr ? 'الرجوع ومتابعة الدروس' : 'Close Quiz'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sequential Modules (المجموعات) List */}
          <div className="space-y-6 pt-4">
            
            {generateMockModules(insideCourse.id).map((mod, mIdx) => {
              const isOpen = expandedModuleId === mod.id;
              return (
                <div 
                  key={mod.id} 
                  className="border border-neutral-200 dark:border-neutral-700/60 rounded-3xl overflow-hidden bg-white dark:bg-neutral-800/55 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Module Header - Large scale, simple, and high contrast */}
                  <button
                    onClick={() => setExpandedModuleId(isOpen ? null : mod.id)}
                    className="w-full text-right p-6 bg-neutral-50 hover:bg-neutral-100/80 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 transition duration-300 pointer-events-auto cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-sm shrink-0">
                        {mIdx + 1}
                      </div>
                      <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white leading-tight">
                        {isAr ? mod.titleAr : mod.titleEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        {mod.items.length} {isAr ? 'محاضرة / مرفق' : 'items'}
                      </span>
                      <span className="text-neutral-400 font-black text-sm">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {/* Module Items (stacked under each other sequentially as lists) */}
                  {isOpen && (
                    <div className="p-6 space-y-4 bg-white dark:bg-neutral-850/50">
                      {mod.items.length === 0 ? (
                        <p className="text-xs text-neutral-400 text-center py-4">
                          {isAr ? '⚠️ لا يوجد محتوى مضاف حالياً في هذه المجموعة.' : 'No items uploaded in this group yet.'}
                        </p>
                      ) : (
                        mod.items.map((item, idx) => {
                          const isWatched = watchProgress[item.id];
                          const scoreData = completedScores[item.id];
                          const isSubscribed = purchasedCourseIds.includes(insideCourse.id);
                           const isItemFree = item.isFree === true;
                          const hasAccess = (isSubscribed || isItemFree) && !user.isGuest;
 
                          const handleLockedClick = () => {
                            if (user.isGuest) {
                              if (onRequireAuth) {
                                onRequireAuth('login', insideCourse.id);
                              }
                              return;
                            }
                            setEnrollError(
                              isAr 
                                ? `⚠️ هذا المحتوى مغلق! يرجى الاشتراك وتفعيل هذا الكورس لتتمكن من مشاهدة الدروس، تنزيل المذكرات، وحل الواجبات والاختبارات.` 
                                : `⚠️ This resource is locked! Please activate this course to participate or download files.`
                            );
                            window.scrollTo({ top: 100, behavior: 'smooth' });
                          };
 
                          return (
                            <div 
                              key={item.id} 
                              style={{ id: item.id }}
                              className="p-5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                              <div className="flex items-center gap-4">
                                {/* Type Icon badge - Big size */}
                                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                                  {item.type === 'video' && '🎥'}
                                  {item.type === 'file' && '📄'}
                                  {item.type === 'homework' && '📝'}
                                  {item.type === 'quiz' && '🧪'}
                                </div>
                                
                                <div className="space-y-1">
                                  <h4 className="text-sm sm:text-base font-black text-neutral-850 dark:text-neutral-150 leading-tight flex items-center gap-2 flex-wrap">
                                    <span>{isAr ? item.titleAr : item.titleEn}</span>
                                    {!isSubscribed && (
                                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm shrink-0 leading-none ${
                                        isItemFree && !user.isGuest
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
                                      }`}>
                                        {isItemFree ? (user.isGuest ? (isAr ? '🔓 مجاني (يتطلب تسجيل)' : '🔓 Free (Requires login)') : (isAr ? '🔓 مجاني' : '🔓 Free')) : (isAr ? '🔒 مغلق' : '🔒 Premium')}
                                      </span>
                                    )}
                                  </h4>
                                  
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-450">
                                      {item.type === 'video' && (isAr ? 'شرح بالفيديو' : 'Video Explanation')}
                                      {item.type === 'file' && (isAr ? 'ملخص ومذكرة' : 'PDF Study Sheet')}
                                      {item.type === 'homework' && (isAr ? 'واجب ومتابعة' : 'Homework Task')}
                                      {item.type === 'quiz' && (isAr ? 'امتحان وجدول تقييم' : 'Interactive Assessment')}
                                    </span>

                                    {item.duration && (
                                      <span className="text-[10px] text-neutral-400 font-bold">⏱️ {item.duration}</span>
                                    )}
                                    {item.fileSize && (
                                      <span className="text-[10px] text-neutral-400 font-bold">💾 {item.fileSize}</span>
                                    )}

                                    {/* Completion metrics */}
                                    {isWatched && item.type === 'video' && (
                                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded">
                                        ✓ {isAr ? 'تمت المشاهدة' : 'Watched'}
                                      </span>
                                    )}

                                    {scoreData && (
                                      <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded">
                                        ⭐ {isAr ? 'الدرجة:' : 'Score:'} {scoreData.score}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action control button with Large labels & simple style */}
                              <div className="flex items-center justify-end gap-2 shrink-0 md:w-auto w-full">
                                {/* Video Play */}
                                {item.type === 'video' && (
                                  <button
                                    onClick={hasAccess ? () => {
                                      setActiveVideoUrl(item.videoUrl || 'simulated_url');
                                      setActiveVideoItem(item);
                                      window.scrollTo({ top: 300, behavior: 'smooth' });
                                    } : handleLockedClick}
                                    style={{ border: 0 }}
                                    className={`w-full md:w-auto px-6 py-3 text-xs font-black rounded-xl transition duration-300 shadow-md ${
                                      hasAccess 
                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 hover:shadow-indigo-500/20 text-white cursor-pointer' 
                                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                                    }`}
                                  >
                                    {isAr 
                                      ? (hasAccess ? 'مشاهدة 📺' : '🔒 مغلق') 
                                      : (hasAccess ? 'Watch 📺' : '🔒 Locked')}
                                  </button>
                                )}

                                {/* Document file handout */}
                                {item.type === 'file' && (
                                  <button
                                    onClick={hasAccess ? () => {
                                      setEnrollSuccess(isAr ? `📥 جاري تفريغ وفك شفرة مذكرة "${item.titleAr}"...` : `📥 Downloading study resource bundle...`);
                                      setTimeout(() => setEnrollSuccess(''), 3000);
                                    } : handleLockedClick}
                                    style={{ border: 0 }}
                                    className={`w-full md:w-auto px-6 py-3 text-xs font-black rounded-xl transition duration-300 shadow-md ${
                                      hasAccess 
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-105 hover:shadow-emerald-500/20 text-white cursor-pointer' 
                                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                                    }`}
                                  >
                                    {isAr 
                                      ? (hasAccess ? 'فتح المذكرة 📄' : '🔒 مغلق') 
                                      : (hasAccess ? 'Open 📄' : '🔒 Locked')}
                                  </button>
                                )}

                                {/* Solve Homework */}
                                {item.type === 'homework' && (
                                  <button
                                    onClick={hasAccess ? () => {
                                      setActiveHomeworkItem(item);
                                      setActiveVideoUrl(null);
                                      setActiveQuizItem(null);
                                      setHomeworkAnswers({});
                                      setHomeworkSubmitted(false);
                                    } : handleLockedClick}
                                    style={{ border: 0 }}
                                    className={`w-full md:w-auto px-6 py-3 text-xs font-black rounded-xl transition duration-300 shadow-md ${
                                      hasAccess 
                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 hover:shadow-indigo-500/20 text-white cursor-pointer' 
                                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                                    }`}
                                  >
                                    {hasAccess ? (
                                      scoreData ? (isAr ? 'إعادة فتح الواجب 🔄' : 'Retake Assignment 🔄') : (isAr ? 'فتح وحل الواجب ✍️' : 'Do Homework ✍️')
                                    ) : (
                                      isAr ? '🔒 مغلق' : '🔒 Locked'
                                    )}
                                  </button>
                                )}

                                {/* Solve Quiz */}
                                {item.type === 'quiz' && (
                                  <button
                                    onClick={hasAccess ? () => {
                                      setActiveQuizItem(item);
                                      setActiveVideoUrl(null);
                                      setActiveHomeworkItem(null);
                                      setQuizAnswers({});
                                      setQuizSubmitted(false);
                                    } : handleLockedClick}
                                    style={{ border: 0 }}
                                    className={`w-full md:w-auto px-6 py-3 text-xs font-black rounded-xl transition duration-300 shadow-md ${
                                      hasAccess 
                                        ? 'bg-gradient-to-r from-purple-650 to-indigo-600 hover:scale-105 hover:shadow-indigo-500/20 text-white cursor-pointer' 
                                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                                    }`}
                                  >
                                    {hasAccess ? (
                                      scoreData ? (isAr ? 'إعادة التقديم 🔁' : 'Retake Quiz 🔁') : (isAr ? 'فتح الامتحان 🧪' : 'Launch Quiz 🧪')
                                    ) : (
                                      isAr ? '🔒 مغلق' : '🔒 Locked'
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
