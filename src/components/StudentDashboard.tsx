import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Scroll, Wallet, MessageSquare, Compass, 
  LogOut, Play, CheckCircle2, AlertCircle, ShieldAlert, BadgeHelp, 
  Send, Sparkles, User, MapPin, Calendar, Smartphone, FileText, Check, Clock,
  Bell, Link as LinkIcon
} from 'lucide-react';
import { coursesData, translations } from '../data';
import { UserProfile } from '../utils/db';
import StudentCoursesTab from './StudentCoursesTab';
import StudentProfileTab from './StudentProfileTab';

interface StudentDashboardProps {
  user: {
    name: string;
    phone: string;
    role?: 'student' | 'teacher' | 'admin';
    country?: 'EG' | 'SA';
    grade?: string;
    location?: string;
    parentPhone?: string;
    isGuest?: boolean;
  };
  lang: 'ar' | 'en';
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  initialCourseId?: string | null;
  initialCourseAction?: 'view' | 'subscribe' | null;
  onClearInitialCourse?: () => void;
  onRequireAuth?: (tab: 'login' | 'signup', courseId?: string) => void;
  onTeacherSelect?: (teacherId: string) => void;
}

// Interactive Mock Quizzes
interface Quiz {
  id: string;
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
  questions: {
    qAr: string;
    qEn: string;
    optionsAr: string[];
    optionsEn: string[];
    correct: number;
    explanationAr: string;
    explanationEn: string;
  }[];
}

const mockQuizzes: Quiz[] = [
  {
    id: 'q_phys_1',
    titleAr: 'اختبار الفيزياء: قانون أوم والمقاومة الكهربية',
    titleEn: 'Physics Quiz: Ohms Law & Electrical Resistance',
    subjectAr: 'الفيزياء',
    subjectEn: 'Physics',
    questions: [
      {
        qAr: 'عند زيادة طول سلك معدني إلى الضعف ونقصان مساحة مقطعه إلى النصف، فإن مقاومته الكهربية:',
        qEn: 'When the length of a metal wire doubles and its cross-sectional area decreases to half, its resistance:',
        optionsAr: ['تزداد إلى أربعة أمثالها', 'تقل إلى الربع', 'تبقى ثابتة', 'تزداد إلى الضعف'],
        optionsEn: ['Increases to four times', 'Decreases to quarter', 'Stays constant', 'Doubles'],
        correct: 0,
        explanationAr: 'المقاومة تتناسب طردياً مع الطول وعكسياً مع المساحة (R = ρ * L / A). لذلك زيادة الطول للضعف ومساحة النصف تزيد المقاومة ٤ أمثال.',
        explanationEn: 'Resistance is proportional to length and inversely proportional to area (R = ρ * L / A). Hence (2 / 0.5 = 4 times).'
      },
      {
        qAr: 'أي من البدائل التالية يمثل وحدة قياس شدة التيار الكهربي؟',
        qEn: 'Which of the following units represents electric current intensity?',
        optionsAr: ['فولت . ثانية', 'كولوم / ثانية', 'أوم / فولت', 'جول . كولوم'],
        optionsEn: ['Volt. Seconds', 'Coulomb / Second', 'Ohm / Volt', 'Joule. Coulomb'],
        correct: 1,
        explanationAr: 'شدة التيار الكهربي تساوي معدل تدفق الشحنة الكهربية (I = Q / t)، وبالتالي تقاس بالكولوم لكل ثانية (الأمبير).',
        explanationEn: 'Current is the rate of charge flow (I = Q / t), measured in Coulomb per second (Ampere).'
      }
    ]
  },
  {
    id: 'q_math_1',
    titleAr: 'اختبار القدرات: المهارات الكمية وسرعة الحل',
    titleEn: 'Aptitude Quiz: Quantitative Speed Skills',
    subjectAr: 'القدرات العامة',
    subjectEn: 'General Aptitude',
    questions: [
      {
        qAr: 'إذا اشترى عمر ٥ كتب بمبلغ ٢٥٠ ريالاً، فكم كتاباً يستطيع شراءه بمبلغ ٦٠٠ ريال بنفس السعر؟',
        qEn: 'If Omar buys 5 books for 250 SAR, how many books can he buy for 600 SAR at the same rate?',
        optionsAr: ['١٠ كتب', '١٢ كتاباً', '١٥ كتاباً', '٨ كتب'],
        optionsEn: ['10 books', '12 books', '15 books', '8 books'],
        correct: 1,
        explanationAr: 'سعر الكتاب الواحد = ٢٥٠ ÷ ٥ = ٥٠ ريالاً. عدد الكتب التي يمكن شراؤها بمبلغ ٦٠٠ ريال = ٦٠٠ ÷ ٥٠ = ١٢ كتاباً.',
        explanationEn: 'Price per book = 250 / 5 = 50 SAR. Books purchased for 600 SAR = 600 / 50 = 12 books.'
      },
      {
        qAr: 'مستطيل محيطه ٢٨ سم وطوله يزيد عن عرضه بمقدار ٢ سم، فما هي مساحة المستطيل؟',
        qEn: 'A rectangle perimeter is 28 cm, and its length exceeds its width by 2 cm. What is its area?',
        optionsAr: ['٤٨ سم²', '٤٠ سم²', '٢٤ سم²', '٣٦ سم²'],
        optionsEn: ['48 cm²', '40 cm²', '24 cm²', '36 cm²'],
        correct: 0,
        explanationAr: 'المحيط = ٢ * (الطول + العرض) = ٢٨، إذن الطول + العرض = ١٤. وبما أن الطول يزيد بـ ٢، إذن العرض = ٦ والطول = ٨. المساحة = ٨ * ٦ = ٤٨ سم².',
        explanationEn: 'Perimeter = 2 * (L + W) = 28, so L + W = 14. Since L - W = 2, W = 6 and L = 8. Area = 8 * 6 = 48 cm².'
      }
    ]
  }
];

export default function StudentDashboard({ 
  user, 
  lang, 
  onLogout, 
  darkMode, 
  setDarkMode,
  initialCourseId = null,
  initialCourseAction = null,
  onClearInitialCourse,
  onRequireAuth,
  onTeacherSelect
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quizzes' | 'discussion' | 'wallet' | 'profile'>(() => {
    return user.isGuest ? 'courses' : 'overview';
  });

  useEffect(() => {
    if (user.isGuest) {
      setActiveTab('courses');
    } else if (initialCourseId) {
      setActiveTab('courses');
    }
  }, [initialCourseId, user.isGuest]);
  
  // Wallet Balance simulator
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`sanad_wallet_${user.name}`);
    return saved ? Number(saved) : 150; // default 150 credits
  });

  // Purchased courses simulator
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`sanad_purchased_${user.name}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Recharge state
  const [couponCode, setCouponCode] = useState('');
  const [walletSuccess, setWalletSuccess] = useState('');
  const [walletError, setWalletError] = useState('');

  // Quiz active stage
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Discussion Board messages
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: string; isAi?: boolean }[]>(() => {
    const saved = localStorage.getItem(`sanad_student_discussions_${user.name}`);
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', sender: 'أ. أحمد سامي', text: 'أهلاً بك يا بطل في منتدى الأسئلة والمناقشة المباشرة لمنصة سند! اسأل سؤالك وسأجيبك فوراً.', time: 'منذ ١٠ دقائق', isAi: false },
      { id: '2', sender: 'المساعد الأكاديمي الذكي', text: 'أنا مستشارك التعليمي الذكي هنا للوقوف معك طيلة العام الدراسي، كيف يمكنني إرشادك اليوم؟', time: 'الآن', isAi: true }
    ];
  });
  const [newMsg, setNewMsg] = useState('');

  // Schedulers for active teacher notification dynamically reflecting target times
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    link?: string;
    startDate: string;
    endDate?: string;
    isPermanent: boolean;
  } | null>(null);

  useEffect(() => {
    const handleOpenWallet = () => {
      setActiveTab('wallet');
      window.scrollTo(0, 0);
    };
    window.addEventListener('open-wallet-tab', handleOpenWallet);
    return () => window.removeEventListener('open-wallet-tab', handleOpenWallet);
  }, []);

  useEffect(() => {
    const checkNotificationVisibility = () => {
      const stored = localStorage.getItem('sanad_notifications');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) {
            const notif = list[0];
            const now = new Date().getTime();
            const startStr = notif.startDate;
            const endStr = notif.endDate;

            const startMs = startStr ? new Date(startStr).getTime() : 0;
            const isVisibleStart = now >= startMs;

            let isVisibleEnd = true;
            if (!notif.isPermanent && endStr) {
              const endMs = new Date(endStr).getTime();
              isVisibleEnd = now <= endMs;
            }

            if (isVisibleStart && isVisibleEnd) {
              setActiveNotification(notif);
              return;
            }
          }
        } catch (e) {
          console.error('Error parsing notifications in student dashboard', e);
        }
      }
      setActiveNotification(null);
    };

    checkNotificationVisibility();
    const intervalId = setInterval(checkNotificationVisibility, 4000); // Check every 4 seconds for real-time compliance
    return () => clearInterval(intervalId);
  }, []);

  // Sync wallet & courses to localstorage
  useEffect(() => {
    localStorage.setItem(`sanad_wallet_${user.name}`, walletBalance.toString());
  }, [walletBalance, user.name]);

  useEffect(() => {
    localStorage.setItem(`sanad_purchased_${user.name}`, JSON.stringify(purchasedCourseIds));
  }, [purchasedCourseIds, user.name]);

  useEffect(() => {
    localStorage.setItem(`sanad_student_discussions_${user.name}`, JSON.stringify(messages));
  }, [messages, user.name]);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletSuccess('');
    setWalletError('');

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    let amount = 0;
    let foundAndRedeemed = false;

    // Check dynamic coupons generated by Super Admin
    const localCouponsRaw = localStorage.getItem('sanad_vouchers');
    if (localCouponsRaw) {
      try {
        const couponsList = JSON.parse(localCouponsRaw);
        if (Array.isArray(couponsList)) {
          const matchIndex = couponsList.findIndex(
            (item: any) => item.code.toUpperCase() === cleanCode && !item.isUsed
          );
          if (matchIndex !== -1) {
            amount = couponsList[matchIndex].amount;
            couponsList[matchIndex].isUsed = true;
            couponsList[matchIndex].usedBy = user.phone || 'Unknown';
            couponsList[matchIndex].usedAt = new Date().toISOString();
            localStorage.setItem('sanad_vouchers', JSON.stringify(couponsList));
            foundAndRedeemed = true;
          }
        }
      } catch (err) {
        console.error("Error parsing sanad_vouchers", err);
      }
    }

    if (!foundAndRedeemed) {
      // Fallback fallback to legacy presets
      if (cleanCode === 'SANAD50') {
        amount = 50;
      } else if (cleanCode === 'SANAD100') {
        amount = 100;
      } else if (cleanCode === 'VIP500') {
        amount = 500;
      } else {
        setWalletError(lang === 'ar' ? '⚠️ رمز كرت شحن غير صالح أو تم استخدامه مسبقاً! جرب الرموز المسبقة: SANAD100 أو VIP500 أو الرموز الصادرة عن السوبر أدمن' : '⚠️ Invalid coupon reference or already claimed! Try preset codes: SANAD100, VIP500 or active keys issued by Super Admin');
        return;
      }
    }

    setWalletBalance(prev => prev + amount);
    setWalletSuccess(lang === 'ar' ? `🎉 تم شحن رصيد محفظتك بمبلغ ${amount} ${user.country === 'EG' ? 'جنيه' : 'ريال'} بنجاح!` : `🎉 Successfully recharged ${amount} credits to your student wallet!`);
    
    // Save new student wallet balance in localStorage too
    localStorage.setItem(`sanad_wallet_${user.name}`, (walletBalance + amount).toString());

    setCouponCode('');
  };

  const handleBuyCourse = (courseId: string, price: number) => {
    if (purchasedCourseIds.includes(courseId)) return;
    
    if (walletBalance < price) {
      // Prompt wallet activation tab
      setWalletError(lang === 'ar' ? '⚠️ عذراً! رصيد محفظتك غير كافٍ لتفعيل هذا الكورس. يرجى شحن الرصيد أولاً في تبويب المحفظة.' : '⚠️ Insufficient credits to unlock this course. Please recharge in the wallet tab.');
      setActiveTab('wallet');
      return;
    }

    setWalletBalance(prev => prev - price);
    setPurchasedCourseIds(prev => [...prev, courseId]);
    setWalletSuccess(lang === 'ar' ? '✨ تم تفعيل الكورس بنجاح وفتحه لك مدى الحياة! ابدأ المشاهدة الآن.' : '✨ Course activated and unlocked successfully! Happy learning!');
    setActiveTab('courses');
    setTimeout(() => setWalletSuccess(''), 4000);
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setQuizScore(0);
  };

  const selectAnswer = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIdx < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      selectedQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          correctCount++;
        }
      });
      const percent = Math.round((correctCount / selectedQuiz.questions.length) * 100);
      setQuizScore(percent);
      setQuizFinished(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: newMsg,
      time: lang === 'ar' ? 'الآن' : 'just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMsg('');

    // Responsive Sim chatbot reply
    setTimeout(() => {
      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'المساعد الأكاديمي الذكي 🤖',
        text: lang === 'ar' 
          ? `أهلاً بك! تلقيت سؤالك بخصوص المنهج والتفوق لطلاب ${user.grade}. نحن بصدد دراسة طلبك الدراسي وسأتواصل معك بكل التفصيل لضمان تحقيق الدرجة الكاملة!`
          : `Greetings! I received your inquiry for the ${user.grade} level. We are reviewing your homework and will support you dynamically to score 100%!`,
        time: lang === 'ar' ? 'الآن' : 'just now',
        isAi: true
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1000);
  };

  // Filter study catalog matching student's selected curriculum
  const myCountryCourses = coursesData[lang].filter(c => c.country === 'both' || c.country === user.country);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic validation alerts */}
        {walletSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300 text-sm font-bold flex gap-2"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{walletSuccess}</span>
          </motion.div>
        )}

        {/* Global Active Notification from Teacher (if scheduled & active) */}
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-6 p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 border-2 border-indigo-500/10 dark:border-indigo-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-indigo-600" />
            <div className="flex items-start gap-3.5 pr-2.5">
              <span className="p-3 bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-650 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap justify-start">
                  <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === 'ar' ? 'أحدث تنبيه هام من المدرس 📢' : 'URGENT NOTICE FROM TEACHER 📢'}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black">
                    ⏱️ {lang === 'ar' ? 'بدء الظهور:' : 'Published:'} {new Date(activeNotification.startDate).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs md:text-sm font-black text-neutral-800 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap mt-1">
                  {activeNotification.title}
                </p>
              </div>
            </div>

            {activeNotification.link && (
              <a
                href={activeNotification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto py-2.5 px-6 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-650/15 transition flex items-center justify-center gap-2 shrink-0 md:ml-2"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>{lang === 'ar' ? 'اضغط هنا للدخول المباشر للرابط المرفق 🔗' : 'Tap to Join Link Action 🔗'}</span>
              </a>
            )}
          </motion.div>
        )}

        {/* Dashboard Menu Buttons */}
        {!user.isGuest && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {[
              { id: 'overview', icon: Compass, labelAr: 'نظرة عامة', labelEn: 'Overview' },
              { id: 'courses', icon: BookOpen, labelAr: 'مناهجي الدراسية', labelEn: 'My Courses' },
              { id: 'quizzes', icon: Scroll, labelAr: 'الامتحانات الإلكترونية', labelEn: 'E-Quizzes' },
              { id: 'discussion', icon: MessageSquare, labelAr: 'اسأل المدرس والمستشار الذكي', labelEn: 'Q&A Board' },
              { id: 'wallet', icon: Wallet, labelAr: 'المحفظة والشحن', labelEn: 'Wallet' },
              { id: 'profile', icon: User, labelAr: 'الملف الشخصي والأمان', labelEn: 'Profile & Security' },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setWalletError('');
                    setSelectedQuiz(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap border ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-750'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Immersive Welcome banner */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
              
              <div className="relative z-10 space-y-4 max-w-3xl">
                <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  🎓 {lang === 'ar' ? 'سندك التعليمي المعتمد' : 'Your Professional Academy Path'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {lang === 'ar' ? `أهلاً بك يا بطل، ${user.name} 👋` : `Welcome, Student ${user.name} 👋`}
                </h2>
                <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                  {lang === 'ar' 
                    ? `أنت الآن تتابع المنهج الدراسي المخصص لـ (${user.grade}) في ${user.country === 'EG' ? 'جمهورية مصر العربية 🇪🇬' : 'المملكة العربية السعودية 🇸🇦'}. بوابتك الذكية مستعدة لحضور الدروس، الإجابة على الامتحانات، وطرح تساؤلاتك.`
                    : `You are studying the tailored curriculum for (${user.grade}) in ${user.country === 'EG' ? 'Egypt 🇪🇬' : 'Saudi Arabia 🇸🇦'}.`}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-indigo-100">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{user.country === 'EG' ? 'المحافظة' : 'المنطقة'}: {user.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Bento grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
                <span className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                  <BookOpen className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold">{lang === 'ar' ? 'كورسات المنهج' : 'Catalog Courses'}</p>
                  <p className="text-2xl font-black">{myCountryCourses.length}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
                <span className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold">{lang === 'ar' ? 'الكورسات المفتوحة' : 'Unlocked Classes'}</p>
                  <p className="text-2xl font-black">{purchasedCourseIds.length}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
                <span className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <Scroll className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold">{lang === 'ar' ? 'امتحانات منجزة' : 'Drafted Quizzes'}</p>
                  <p className="text-2xl font-black">2</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
                <span className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  <Wallet className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold">{lang === 'ar' ? 'رصيد المحفظة' : 'Credit Balance'}</p>
                  <p className="text-2xl font-black font-mono">{walletBalance}</p>
                </div>
              </div>
            </div>

            {/* Quick actions panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Wallet recharge quick action */}
              <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-extrabold">{lang === 'ar' ? 'شحن رصيد المحفظة' : 'Recharge Wallet Balance'}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                    {lang === 'ar' 
                      ? 'اشحن محفظتك محلياً لشراء المناهج والترم الدراسى المفعّل مباشرة ببطاقات sandbox.'
                      : 'Load digital credits cleanly.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-750 text-xs font-black rounded-xl transition"
                >
                  {lang === 'ar' ? 'افتح المحفظة الآن ⚡' : 'Go to Wallet ⚡'}
                </button>
              </div>

              {/* Quiz prompt action */}
              <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-extrabold">{lang === 'ar' ? 'اختبار القدرات والتحصيل' : 'E-Exams and Quizzes'}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                    {lang === 'ar' 
                      ? 'قّيم مستواك الدراسي مباشرة بعد كل وحدة لتحصل على علامات تفصيلية وتقارير متابعة لولي أمرك.'
                      : 'Test your capabilities and resolve homework.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-750 text-xs font-black rounded-xl transition"
                >
                  {lang === 'ar' ? 'دخول الامتحانات ✍️' : 'Go to Quizzes ✍️'}
                </button>
              </div>

              {/* Progress Report Simulation to Parents */}
              <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <h3 className="text-sm font-extrabold">{lang === 'ar' ? 'إرسال تقرير المتابعة لهاتف الأب' : 'Send Report to Parent'}</h3>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
                    {lang === 'ar' 
                      ? `رقم هاتف ولي الأمر المسجل: (${user.parentPhone})`
                      : `Registered Parent phone: ${user.parentPhone}`}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-550 font-medium leading-relaxed">
                    {lang === 'ar'
                      ? 'يرسل تلقائياً إحصائيات تقرير الطالب (معدل مشاهدة الدروس ودرجات الامتحانات) للوالد للتحقق.'
                      : 'Send instant SMS/WhatsApp reports.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setWalletSuccess(lang === 'ar' ? `💬 تم محاكاة إرسال تقرير الطالب الدراسي بنجاح لعدسة ولي الأمر على الرقم: ${user.parentPhone}` : `💬 SMS report sent to registered parent number: ${user.parentPhone}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-xs font-black rounded-xl transition"
                >
                  {lang === 'ar' ? 'محاكاة إرسال التقرير 💬' : 'Simulate Sending Report 💬'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STUDY CURRICULUMS / COURSES TAB */}
        {activeTab === 'courses' && (
          <StudentCoursesTab
            user={user}
            lang={lang}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            purchasedCourseIds={purchasedCourseIds}
            setPurchasedCourseIds={setPurchasedCourseIds}
            initialCourseId={initialCourseId}
            initialCourseAction={initialCourseAction}
            onClearInitialCourse={onClearInitialCourse}
            onRequireAuth={onRequireAuth}
            onTeacherSelect={onTeacherSelect}
          />
        )}

        {/* INTERACTIVE EXAMS / QUIZZES TAB */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            {!selectedQuiz ? (
              <div className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-1 pt-4">
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                    {lang === 'ar' ? 'الامتحانات التفاعلية لمستواك الدراسي' : 'E-Quizzes for your educational grade'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
                    {lang === 'ar' ? 'حدد فرع المادة وسجل اختبارك الآن للتقييم والتصحيح المباشر.' : 'Instant grading online tests.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {mockQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 text-[10px] font-extrabold">
                          📚 {lang === 'ar' ? quiz.subjectAr : quiz.subjectEn}
                        </span>
                        <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                          {lang === 'ar' ? quiz.titleAr : quiz.titleEn}
                        </h4>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          {lang === 'ar'
                            ? `يحتوي الاختيار على عدد ${quiz.questions.length} أسئلة MCQ للتحقق ومتابعة المستويات.`
                            : `Contains exactly ${quiz.questions.length} MCQ questions.`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-md shadow-indigo-600/10"
                      >
                        {lang === 'ar' ? 'ابدأ تقديم الاختبار الآن ✍️' : 'Start Quiz Now ✍️'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Quiz Gameplay
              <div className="max-w-xl mx-auto bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6 shadow-xl">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 pb-4">
                  <div>
                    <span className="text-xs text-neutral-450 dark:text-neutral-500 font-bold">
                      {lang === 'ar' ? selectedQuiz.subjectAr : selectedQuiz.subjectEn}
                    </span>
                    <h4 className="text-xs font-black mt-1">
                      {lang === 'ar' ? selectedQuiz.titleAr : selectedQuiz.titleEn}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 hover:underline"
                  >
                    {lang === 'ar' ? 'خروج' : 'Exit'}
                  </button>
                </div>

                {!quizFinished ? (
                  // Question State
                  <div className="space-y-5">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-450 dark:text-neutral-500">
                      <span>{lang === 'ar' ? `السؤال ${currentQuestionIdx + 1} من ${selectedQuiz.questions.length}` : `Question ${currentQuestionIdx + 1} of ${selectedQuiz.questions.length}`}</span>
                      <span>{Math.round(((currentQuestionIdx) / selectedQuiz.questions.length) * 100)}%</span>
                    </div>

                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-300" 
                        style={{ width: `${((currentQuestionIdx + 1) / selectedQuiz.questions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question body */}
                    <p className="text-sm font-bold text-neutral-900 dark:text-white leading-relaxed">
                      {lang === 'ar' ? selectedQuiz.questions[currentQuestionIdx].qAr : selectedQuiz.questions[currentQuestionIdx].qEn}
                    </p>

                    {/* Options */}
                    <div className="space-y-2">
                      {(lang === 'ar' 
                        ? selectedQuiz.questions[currentQuestionIdx].optionsAr 
                        : selectedQuiz.questions[currentQuestionIdx].optionsEn
                      ).map((opt, oIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => selectAnswer(oIdx)}
                            className={`w-full text-right p-3 rounded-xl border-2 text-xs font-bold transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-305'
                                : 'bg-neutral-50 border-neutral-100 hover:hover:border-neutral-200 text-neutral-600 dark:bg-neutral-900/30 dark:border-neutral-850 dark:text-neutral-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <Check className="h-4 w-4 text-indigo-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit navigation */}
                    <button
                      type="button"
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={handleNextQuestion}
                      className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition"
                    >
                      {currentQuestionIdx === selectedQuiz.questions.length - 1 
                        ? (lang === 'ar' ? 'إنهاء وحساب النتيجة 🏁' : 'Finish Quiz & Grade 🏁')
                        : (lang === 'ar' ? 'السؤال التالي ➜' : 'Next Question ➜')}
                    </button>
                  </div>
                ) : (
                  // Quiz summary Score state
                  <div className="text-center py-6 space-y-4">
                    <div className="mx-auto h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Scroll className="h-10 w-10 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-neutral-850 dark:text-white">
                        {lang === 'ar' ? 'تم تقديم وتقييم إجاباتك بنجاح!' : 'Quiz evaluation finished successfully!'}
                      </h4>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {lang === 'ar' ? 'الدرجة المحتسبة لعلامتك:' : 'Your scored metric percent:'}
                      </p>
                    </div>

                    <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {quizScore}%
                    </div>

                    <p className="text-xs font-medium text-indigo-705 dark:text-indigo-305 bg-indigo-50/80 dark:bg-indigo-950/20 p-3 rounded-xl">
                      {quizScore >= 90
                        ? (lang === 'ar' ? '🎉 تفوق ممتاز جداً بقانون سند! لقد حققت العلامة الكاملة.' : 'Amazing! You achieved the full grade perfectly.')
                        : (lang === 'ar' ? '💪 أداء طيب، احرص على مراجعة الشروحات الافتراضية للفيزياء مجدداً لحصد العلامات الكاملة.' : 'Good attempt, review the physics mind maps to improve!')}
                    </p>

                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="mt-4 px-6 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-black rounded-xl transition"
                    >
                      {lang === 'ar' ? 'الرجوع لقائمة الامتحانات' : 'Back to Quizzes'}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* Q&A / CHAT PORTAL TAB */}
        {activeTab === 'discussion' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden flex flex-col h-[520px]">
            {/* Header info */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-700 flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-indigo-500 text-white leading-none">🤖</span>
              <div>
                <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                  {lang === 'ar' ? 'غرفة المساعدة وتوجيه الأقران' : 'Academic Counselling Board'}
                </h4>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-450 font-bold mt-1">
                  ● {lang === 'ar' ? 'متصل: أ. أحمد سامي + مساعد الذكاء الاصطناعي' : 'Online: Active Academic support'}
                </p>
              </div>
            </div>

            {/* Chat Body messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isMe = m.sender === user.name;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 mb-1 px-1">{m.sender}</span>
                    <div className={`p-3 rounded-2xl text-xs max-w-[85%] font-semibold leading-relaxed ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : m.isAi
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-305 dark:border-indigo-900/30 rounded-bl-none'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-905 dark:text-neutral-250 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-neutral-400 font-medium mt-1 px-1">{m.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-750 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب تساؤلك أو مسألتك الفيزيائية والقدرات هنا...' : 'Ask your academic query or homework here...'}
                className="flex-1 rounded-xl px-4 py-2 text-xs border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        )}

        {/* WALLET & DIGITAL VOUCHERS TAB */}
        {activeTab === 'wallet' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full inline-block">
                  {lang === 'ar' ? 'رصيد محفظة الطالب المفعلة' : 'Primary Active Wallet'}
                </span>
                <div>
                  <p className="text-[10px] text-neutral-400 font-extrabold">{lang === 'ar' ? 'الرصيد الكلي المتوفر حالياً' : 'Total current available balance'}</p>
                  <div className="text-4xl font-extrabold font-mono text-indigo-400 mt-1 flex items-baseline justify-center gap-1.5">
                    <span>{walletBalance}</span>
                    <span className="text-sm font-black">
                      {user.country === 'EG' ? (lang === 'ar' ? 'جنيه مصرى' : 'EGP') : (lang === 'ar' ? 'ريال سعودى' : 'SAR')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-450 border-t border-neutral-800 pt-4 font-semibold">
                  {lang === 'ar' 
                    ? `رقم هاتف الطالب للحساب: ${user.phone}`
                    : `Student phone account: ${user.phone}`}
                </div>
              </div>
            </div>

            {/* Recharge card voucher form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold">
                  {lang === 'ar' ? 'شحن عن طريق كروت شحن سند التعليمية' : 'Recharge via Sand Prepaid Vouchers'}
                </h4>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                  {lang === 'ar'
                    ? 'اكتب الرمز المذكور في كرت شحن سند أو الفواتير لشحن حساب الطالب مسبقاً.'
                    : 'Enter your scratch card coupon reference to top-up instantly.'}
                </p>
              </div>

              {walletError && (
                <div className="p-3 bg-rose-50/80 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 text-xs text-rose-600 dark:text-rose-400 font-bold rounded-xl flex gap-1.5 align-middle">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{walletError}</span>
                </div>
              )}

              <form onSubmit={handleRecharge} className="space-y-3">
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full text-center tracking-widest uppercase font-mono py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none focus:border-indigo-500 duration-200"
                  placeholder="SANAD100 / VIP500"
                />
                
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-black rounded-xl transition"
                >
                  {lang === 'ar' ? 'تأكيد وشحن الكرت الآن ⚡' : 'Confirm & Load Voucher ⚡'}
                </button>
              </form>

              {/* Sand demo hint codes to test */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-150/40 rounded-2xl">
                <p className="text-[10px] font-black text-indigo-855 dark:text-indigo-400 text-center mb-1">
                  💡 {lang === 'ar' ? 'رموز تجريبية محاكية مجانية للSandbox' : 'Sandbox Simulated top-up codes:'}
                </p>
                <div className="flex justify-around text-[10px] font-mono text-neutral-550 dark:text-neutral-400 font-bold">
                  <span>SANAD100 (+100)</span>
                  <span>VIP500 (+500)</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PROFILE & SECURITY TAB */}
        {activeTab === 'profile' && (
          <StudentProfileTab user={user} lang={lang} />
        )}

      </div>
    </div>
  );
}
