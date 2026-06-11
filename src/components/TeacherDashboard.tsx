import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, BookOpen, Clock, Play, GraduationCap, PlusCircle, 
  CheckCircle, MessageSquare, LogOut, Check, Search, MapPin, 
  Trash2, Plus, Sparkles, Filter, Award, ShieldCheck, BarChart3, Bell, ClipboardList, UserCheck, HelpCircle, Sun, Moon, Menu, X, Layers,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { coursesData, translations, teachersData } from '../data';
import { getAllUsers, UserProfile } from '../utils/db';

// Modular Page components
import TeacherOverviewPage from './TeacherOverviewPage';
import TeacherStatsPage from './TeacherStatsPage';
import TeacherNotificationsPage from './TeacherNotificationsPage';
import TeacherStudentsPage from './TeacherStudentsPage';
import TeacherContentPage from './TeacherContentPage';
import TeacherStaffPage from './TeacherStaffPage';

interface TeacherDashboardProps {
  user: { name: string; country: 'EG' | 'SA' };
  lang: 'ar' | 'en';
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function TeacherDashboard({ user, lang, onLogout, darkMode, setDarkMode }: TeacherDashboardProps) {
  const isAr = lang === 'ar';
  
  // Find which teacher logged in or generate a fallback teacher data structure matching user
  const teacherMeta = teachersData[lang].find(t => t.name.includes(user.name)) || {
    id: 't-fallback',
    name: user.name || (isAr ? 'معلم معتمد' : 'Certified Teacher'),
    title: isAr ? 'معلم مادة معتمد' : 'Certified Subject Teacher',
    specialty: isAr ? 'التعليم الثانوي والمسارات' : 'Secondary Stage & Tracks',
    bio: isAr ? 'معلم خبير ومعتمد يمتلك سنوات طوال من التميز الأكاديمي وصقل مهارات الطلاب للوصول إلى الدرجات النهائية بكل سهولة.' : 'High caliber expert teacher with a track record of academic refinement.',
    coursesCount: 0,
    rating: 5.0,
    studentsCount: 0,
    avatar: '👨‍🏫'
  };

  // Primary sidebar navigation tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'stats_general' | 'notifications' | 'students_roster' | 'student_code_checker' |
    'manage_courses' | 'courses' | 'modules' | 'videos' | 'handouts' | 'tasks' | 'qbank' |
    'stats_exams' | 'stats_views' | 'staff' | 'profile'
  >('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem('sanad_teacher_sidebar_collapsed');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sanad_teacher_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Local courses managed by this teacher
  const [allCourses, setAllCourses] = useState<any[]>(() => {
    const saved = localStorage.getItem('sanad_custom_courses_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading custom courses database:', e);
      }
    }
    return coursesData[lang];
  });

  useEffect(() => {
    localStorage.setItem('sanad_custom_courses_db', JSON.stringify(allCourses));
  }, [allCourses]);

  const teacherCourses = allCourses.filter(c => c.teacher.includes(teacherMeta.name) || c.teacher === 'أ. أحمد سامي' || c.teacher.includes('سامي'));

  // Q&A / Counseling questions from students
  const [pendingQuestions, setPendingQuestions] = useState(() => {
    const saved = localStorage.getItem('sanad_counseling_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'q_1', student: 'يوسف العثمان', grade: 'مسارات الرياض', text: 'كيف نميز بين التوالي والتوازي عندما يكون السلك مائلاً بزاوية؟', answered: false, reply: '' },
      { id: 'q_2', student: 'مريم الشاذلي', grade: 'الثانوية العامة القاهرة', text: 'هل مفرغات التيار تفصل الشحنات بالكامل أم تترك مقاومة مكافئة؟', answered: false, reply: '' },
    ];
  });

  const [counselingReplyText, setCounselingReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    localStorage.setItem('sanad_counseling_questions', JSON.stringify(pendingQuestions));
  }, [pendingQuestions]);

  // Load students on bootstrap
  const reloadStudents = () => {
    setStudents(getAllUsers().filter(u => u.role === 'student'));
  };

  useEffect(() => {
    reloadStudents();
  }, []);

  const handleUpdateStudent = (updatedStudent: UserProfile) => {
    const all = getAllUsers();
    const index = all.findIndex(u => u.phone === updatedStudent.phone);
    if (index !== -1) {
      all[index] = updatedStudent;
      localStorage.setItem('sanad_users_db', JSON.stringify(all));
    }
    reloadStudents();
  };

  const handleAnswerQuestion = (qId: string) => {
    const text = counselingReplyText[qId];
    if (!text || !text.trim()) return;

    setPendingQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, answered: true, reply: text };
      }
      return q;
    }));
    setCounselingReplyText(prev => ({ ...prev, [qId]: '' }));
  };

  const menuItems = [
    { id: 'home', labelAr: ' الرئيسية', labelEn: 'Home', icon: GraduationCap },
    { id: 'stats_general', labelAr: ' الإحصائيات', labelEn: 'General Stats', icon: BarChart3 },
    { id: 'notifications', labelAr: ' الإشعارات', labelEn: 'Notifications', icon: Bell },
    { id: 'students_roster', labelAr: ' بيانات الطلاب', labelEn: 'Student Records', icon: Users },
    { id: 'student_code_checker', labelAr: ' تفاصيل كود الطالب', labelEn: 'Student Code Details', icon: ClipboardList },
    { id: 'manage_courses', labelAr: ' إدارة الكورسات', labelEn: 'Manage Courses', icon: BookOpen },
    { id: 'courses', labelAr: ' الكورسات', labelEn: 'Courses', icon: Layers },
    { id: 'modules', labelAr: ' المجموعات', labelEn: 'Modules / Groups', icon: PlusCircle },
    { id: 'videos', labelAr: ' الفيديوهات', labelEn: 'Videos', icon: Play },
    { id: 'handouts', labelAr: ' المذكرات', labelEn: 'Handouts', icon: CheckCircle },
    { id: 'tasks', labelAr: ' الامتحانات والواجبات', labelEn: 'Exams & Homeworks', icon: Award },
    { id: 'qbank', labelAr: ' بنك الأسئلة', labelEn: 'Question Bank', icon: MessageSquare },
    { id: 'stats_exams', labelAr: ' إحصائيات الامتحانات والواجبات', labelEn: 'Exams Stats', icon: BarChart3 },
    { id: 'stats_views', labelAr: ' إحصائيات المشاهدات', labelEn: 'Views Stats', icon: Play },
    { id: 'staff', labelAr: ' إدارة الموظفين', labelEn: 'Staff & Employees', icon: ShieldCheck },
    { id: 'profile', labelAr: ' الملف الشخصي', labelEn: 'Teacher Profile', icon: UserCheck }
  ];

  // Update biography and title of teachersData locally
  const [profileBio, setProfileBio] = useState(teacherMeta.bio);
  const [profileSpecialty, setProfileSpecialty] = useState(teacherMeta.specialty);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    teacherMeta.bio = profileBio;
    teacherMeta.specialty = profileSpecialty;
    setProfileSuccessMsg(isAr ? '🎉 تم تحديث ونشر ملف التعريف العلمي بنجاح!' : '🎉 Biography updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-300 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* MOBILE DESKTOP FLOATING SIDEBAR NAVIGATION BAR */}
      <aside className={`fixed top-16 bottom-0 z-35 w-72 bg-white dark:bg-neutral-850 border-neutral-200 dark:border-neutral-750 p-5 flex flex-col justify-between transition-transform duration-300 shadow-2xl md:shadow-md h-[calc(100vh-4rem)] ${
        isAr ? 'right-0 border-l' : 'left-0 border-r'
      } ${
        mobileSidebarOpen 
          ? 'translate-x-0' 
          : (isAr 
              ? (sidebarCollapsed ? 'translate-x-full md:translate-x-full' : 'translate-x-full md:translate-x-0') 
              : (sidebarCollapsed ? '-translate-x-full md:-translate-x-full' : '-translate-x-full md:translate-x-0')
            )
      }`}>
        {/* Sidebar Header Container */}
        <div className="shrink-0 space-y-4 pb-1">
          {/* Logo and Mobile / Desktop collapse triggers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-650 text-white rounded-xl">⚡</span>
              <div className="text-right">
                <h3 className="text-sm font-black text-neutral-909 dark:text-white leading-tight">سند التعليمية</h3>
                <p className="text-[9px] text-neutral-400 font-bold mt-0.5">{isAr ? 'بوابة المعلمين وسكرتارية الشحن' : 'Educator workspace'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Collapse button on Desktop */}
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:flex p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
                title={isAr ? 'تصغير وتقليص القائمة' : 'Collapse Sidebar'}
              >
                {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>

              {/* Close button on Mobile */}
              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 md:hidden block"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User profile capsule card inside sidebar */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex items-center gap-3 text-right">
            <span className="text-2xl p-1 bg-white dark:bg-neutral-800 rounded-xl">{teacherMeta.avatar}</span>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-black text-neutral-855 dark:text-white truncate">{teacherMeta.name}</p>
              <p className="text-[9px] text-indigo-650 dark:text-indigo-400 font-bold truncate">{teacherMeta.specialty}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 pl-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <nav className="space-y-1 text-right">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-black rounded-xl transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-indigo-650/10 border-indigo-600/15 text-indigo-650 dark:bg-indigo-505/10 dark:border-indigo-500/10 dark:text-indigo-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  {Icon && (
                    <Icon 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-500'
                      }`} 
                    />
                  )}
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>
        </div>


      </aside>

      {/* Dynamic Main view body space */}
      <main className={`flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden min-h-screen transition-all duration-300 ${
        isAr 
          ? (sidebarCollapsed ? 'md:mr-0' : 'md:mr-72') 
          : (sidebarCollapsed ? 'md:ml-0' : 'md:ml-72')
      }`}>
        
        {/* Sleek, Modern Minimal Top Header Area */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-neutral-800/60 gap-4">
          <div className="flex items-center gap-3">
            {/* Extremely Charming Animated Sidebar Toggle Icon Button (Responsive) */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileSidebarOpen(true);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="group flex items-center justify-center p-3 bg-white dark:bg-neutral-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-slate-200 dark:border-neutral-750 text-neutral-600 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer focus:outline-none"
              title={isAr ? 'التحكم في القائمة الجانبية ↔️' : 'Toggle Sidebar ↔️'}
            >
              {/* Animated Custom Hamburger to Left/Right Panel Indicator */}
              <div className="flex flex-col gap-1 w-5 justify-center items-center">
                <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${sidebarCollapsed ? 'w-5' : 'w-3.5 -translate-x-0.5'}`} />
                <span className="h-0.5 bg-current rounded-full w-5 transition-all duration-300" />
                <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${sidebarCollapsed ? 'w-5' : 'w-2 translate-x-1'}`} />
              </div>
              
              {/* Dynamic status label inside toggle button */}
              <span className="max-w-0 overflow-hidden group-hover:max-w-28 group-hover:mr-2 group-hover:ml-0 transition-all duration-300 text-[10px] font-black tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <span>{isAr ? 'تصغير وعرض' : 'Menu'}</span>
                {sidebarCollapsed ? '📂' : '📁'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Tab router workspace switches */}
        <div className="transition-all duration-300">
          {activeTab === 'home' && (
            <TeacherOverviewPage
              user={user}
              lang={lang}
              teacherMeta={teacherMeta}
              allCourses={allCourses}
              teacherCourses={teacherCourses}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'stats_general' && (
            <TeacherStatsPage
              lang={lang}
              allCourses={allCourses}
              teacherCourses={teacherCourses}
              students={students}
              initialSubTab="general"
            />
          )}

          {activeTab === 'notifications' && (
            <TeacherNotificationsPage
              lang={lang}
            />
          )}

          {activeTab === 'students_roster' && (
            <TeacherStudentsPage
              lang={lang}
              students={students}
              onUpdateStudent={handleUpdateStudent}
              initialPanelTab="roster"
              activeTeacherName={teacherMeta.name}
              allCourses={allCourses}
            />
          )}

          {activeTab === 'student_code_checker' && (
            <TeacherStudentsPage
              lang={lang}
              students={students}
              onUpdateStudent={handleUpdateStudent}
              initialPanelTab="code_checker"
              activeTeacherName={teacherMeta.name}
              allCourses={allCourses}
            />
          )}

          {activeTab === 'manage_courses' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="reorder"
            />
          )}

          {activeTab === 'courses' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="courses"
            />
          )}

          {activeTab === 'modules' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="modules"
            />
          )}

          {activeTab === 'videos' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="videos"
            />
          )}

          {activeTab === 'handouts' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="handouts"
            />
          )}

          {activeTab === 'tasks' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="tasks"
            />
          )}

          {activeTab === 'qbank' && (
            <TeacherContentPage
              lang={lang}
              allCourses={allCourses}
              setAllCourses={setAllCourses}
              teacherCourses={teacherCourses}
              initialSubSection="qbank"
            />
          )}

          {activeTab === 'stats_exams' && (
            <TeacherStatsPage
              lang={lang}
              allCourses={allCourses}
              teacherCourses={teacherCourses}
              students={students}
              initialSubTab="quizzes"
            />
          )}

          {activeTab === 'stats_views' && (
            <TeacherStatsPage
              lang={lang}
              allCourses={allCourses}
              teacherCourses={teacherCourses}
              students={students}
              initialSubTab="views"
            />
          )}

          {activeTab === 'staff' && (
            <TeacherStaffPage
              lang={lang}
            />
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 text-right">
              {profileSuccessMsg && (
                <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/25 dark:text-indigo-400 border border-indigo-500/15 text-xs font-black rounded-2xl flex items-center gap-1.5">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
                <h4 className="text-sm font-black text-neutral-850 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  {isAr ? '✏️ تعديل ومواءمة سيرة المدرس وصورته' : '✏️ Maintain Academic Profile details'}
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-450">{isAr ? 'الصفة الأكاديمية والمسمى التخصصي' : 'Academic Title'}</label>
                  <input
                    required
                    type="text"
                    value={profileSpecialty}
                    onChange={e => setProfileSpecialty(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-450">{isAr ? 'السيرة الذاتية العلمية المعتمدة (الـ Bio)' : 'Biography / Bio Statement'}</label>
                  <textarea
                    required
                    rows={4}
                    value={profileBio}
                    onChange={e => setProfileBio(e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black rounded-xl transition"
                >
                  {isAr ? 'تحديث وتأكيد ملف السيرة علانية للطلاب ⚡' : 'Publish and update autobiography ⚡'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

// Simple layout icons locally built to bypass external image dependencies completely and visually shine!
function GraduateIcon(props: any) {
  return <GraduationCap {...props} />;
}
function ChartIcon(props: any) {
  return <BarChart3 {...props} />;
}
function NotificationIcon(props: any) {
  return <Bell {...props} />;
}
function StudentsIcon(props: any) {
  return <Users {...props} />;
}
function CubeIcon(props: any) {
  return <Layers {...props} />;
}
function MessageIcon(props: any) {
  return <MessageSquare {...props} />;
}
function StaffIcon(props: any) {
  return <UserCheck {...props} />;
}
function ProfileIcon(props: any) {
  return <CheckCircle {...props} />;
}
