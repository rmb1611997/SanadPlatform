/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import Teachers from './components/Teachers';
import Features from './components/Features';
import TeacherProfilePage from './components/TeacherProfilePage';
import ReviewSlider from './components/ReviewSlider';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

import { seedDatabaseIfNeeded, getAllUsers } from './utils/db';
import { coursesData, teachersData, featuresData, reviewsData, faqData, translations } from './data';
import { Course, Teacher } from './types';

interface LoggedUser {
  name: string;
  phone: string;
  role: 'student' | 'teacher' | 'admin';
  country?: 'EG' | 'SA';
  grade?: string;
  location?: string;
  parentPhone?: string;
  isGuest?: boolean;
}

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sanad_dark_mode');
    return saved === 'true';
  });
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'EG' | 'SA'>('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  
  // Auth state
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [loggedInUser, setLoggedInUser] = useState<LoggedUser | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [selectedLandingCourseId, setSelectedLandingCourseId] = useState<string | null>(null);
  const [landingCourseAction, setLandingCourseAction] = useState<'view' | 'subscribe' | null>(null);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    if (loggedInUser && !loggedInUser.isGuest) {
      const saved = localStorage.getItem(`sanad_purchased_${loggedInUser.name}`);
      setPurchasedCourseIds(saved ? JSON.parse(saved) : []);
    } else {
      setPurchasedCourseIds([]);
    }
  }, [loggedInUser]);

  const t = translations[lang];

  // Check for saved user sessions on mount (Remember Me functionality)
  useEffect(() => {
    const init = async () => {
      await seedDatabaseIfNeeded();

      const persistentPhone = localStorage.getItem('sanad_user_session_persistent');
      const tempPhone = sessionStorage.getItem('sanad_user_session_temp');
      const activePhone = persistentPhone || tempPhone;

      if (activePhone) {
        const allUsers = getAllUsers();
        const found = allUsers.find(u => u.phone === activePhone);
        if (found) {
          if ((found as any).isBanned) {
            localStorage.removeItem('sanad_user_session_persistent');
            sessionStorage.removeItem('sanad_user_session_temp');
            return;
          }
          setLoggedInUser({
            name: found.name,
            phone: found.phone,
            role: found.role,
            country: found.country,
            grade: found.grade,
            location: found.location
          });
          if (found.country) {
            setSelectedCountry(found.country);
          }
          setCurrentView('dashboard');
        }
      }
    };
    init();
  }, []);

  // Apply dark mode class to html document and save choice
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sanad_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sanad_dark_mode', 'false');
    }
  }, [darkMode]);

  const handleOpenAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleLoginSuccess = (user: LoggedUser) => {
    setLoggedInUser(user);
    if (user.country) {
      setSelectedCountry(user.country);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('sanad_user_session_persistent');
    sessionStorage.removeItem('sanad_user_session_temp');
    setLoggedInUser(null);
    setSelectedCountry('all');
    setCurrentView('landing');
  };

  const handleViewCourseClick = (course: Course) => {
    if (loggedInUser) {
      if (loggedInUser.role === 'student') {
        setSelectedLandingCourseId(course.id);
        setLandingCourseAction('view');
        setCurrentView('dashboard');
      }
    } else {
      const guestUser: LoggedUser = {
        name: lang === 'ar' ? 'زائر المنصة' : 'Guest Visitor',
        phone: 'guest',
        role: 'student',
        country: selectedCountry === 'all' ? 'EG' : selectedCountry,
        grade: '1',
        location: lang === 'ar' ? 'المنصة التعليمية' : 'Platform',
        parentPhone: '00000',
        isGuest: true
      };
      setLoggedInUser(guestUser);
      setSelectedLandingCourseId(course.id);
      setLandingCourseAction('view');
      setCurrentView('dashboard');
    }
  };

  const handleSubscribeCourseClick = (course: Course) => {
    if (!loggedInUser) {
      setSelectedLandingCourseId(course.id);
      setLandingCourseAction('subscribe');
      handleOpenAuth('login');
    } else {
      if (loggedInUser.role === 'student') {
        setSelectedLandingCourseId(course.id);
        setLandingCourseAction('subscribe');
        setCurrentView('dashboard');
      }
    }
  };

  const handleConsultTeacher = () => {
    // Scroll directly to contact section to submit counseling request
    const contactSec = document.querySelector('#contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamically load active courses list
  const getCoursesList = (): Course[] => {
    const saved = localStorage.getItem('sanad_custom_courses_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing custom courses from storage:', e);
      }
    }
    return lang === 'ar' ? coursesData.ar : coursesData.en;
  };

  const getTeachersList = (): Teacher[] => {
    return lang === 'ar' ? teachersData.ar : teachersData.en;
  };

  const allCourses = getCoursesList();
  const allTeachers = getTeachersList();

  let filteredTeachers = allTeachers;
  let filteredCourses = allCourses;

  if (loggedInUser) {
    if (loggedInUser.role === 'student') {
      const userCountry = loggedInUser.country || 'EG';
      filteredTeachers = allTeachers.filter(t => t.country === userCountry || t.country === 'both');
      filteredCourses = allCourses.filter(c => c.country === userCountry || c.country === 'both');
    } else if (loggedInUser.role === 'teacher') {
      const teacherName = loggedInUser.name;
      filteredTeachers = allTeachers.filter(t => t.name.includes(teacherName) || teacherName.includes(t.name));
      filteredCourses = allCourses.filter(c => 
        c.teacher === teacherName || 
        c.teacher.includes(teacherName) || 
        teacherName.includes(c.teacher) ||
        (teacherName.includes('سامي') && c.teacher.includes('سامي')) ||
        (teacherName.includes('العتيبي') && c.teacher.includes('العتيبي'))
      );
    }
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 ${
        lang === 'ar' ? 'font-sans' : 'font-sans'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Premium Navigation Header */}
      <Header
        currentLang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={handleOpenAuth}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogoClick={() => setSelectedTeacherId(null)}
      />

      <main className="pt-16">
        {selectedTeacherId ? (
          (() => {
            const currentTeacher = filteredTeachers.find(t => t.id === selectedTeacherId);
            if (!currentTeacher) {
              return (
                <div className="py-20 text-center">
                  <p>{lang === 'ar' ? 'المدرس غير موجود' : 'Teacher not found'}</p>
                  <button onClick={() => setSelectedTeacherId(null)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl">
                    {lang === 'ar' ? 'العودة' : 'Back'}
                  </button>
                </div>
              );
            }
            return (
              <TeacherProfilePage
                teacher={currentTeacher}
                courses={filteredCourses as any}
                lang={lang}
                onBack={() => {
                  setSelectedTeacherId(null);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onGetStarted={() => handleOpenAuth('signup')}
              />
            );
          })()
        ) : loggedInUser && currentView === 'dashboard' ? (
          loggedInUser.role === 'student' ? (
            <StudentDashboard
              user={loggedInUser}
              lang={lang}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              initialCourseId={selectedLandingCourseId}
              initialCourseAction={landingCourseAction}
              onClearInitialCourse={() => {
                setSelectedLandingCourseId(null);
                setLandingCourseAction(null);
              }}
              onRequireAuth={(tab, courseId) => {
                setLoggedInUser(null);
                setCurrentView('landing');
                if (courseId) {
                  setSelectedLandingCourseId(courseId);
                  setLandingCourseAction('subscribe');
                }
                handleOpenAuth(tab);
              }}
              onTeacherSelect={(teacherId) => {
                setSelectedTeacherId(teacherId);
              }}
            />
          ) : loggedInUser.role === 'teacher' ? (
            <TeacherDashboard
              user={loggedInUser}
              lang={lang}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          ) : (
            <AdminDashboard
              user={loggedInUser}
              lang={lang}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              lang={lang}
              isLoggedIn={!!loggedInUser}
              onGetStarted={() => handleOpenAuth('signup')}
              onBrowseCourses={() => {
                const courseSec = document.querySelector('#courses');
                if (courseSec) courseSec.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Featured Elite Teachers Section */}
            <Teachers
              teachers={filteredTeachers}
              lang={lang}
              onSelectTeacher={(teacherId) => setSelectedTeacherId(teacherId)}
            />

            {/* Suggested Courses Section: Top 3 Courses below Teachers list */}
            <Courses
              courses={filteredCourses as any}
              lang={lang}
              onGetStarted={() => handleOpenAuth('signup')}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              suggestedOnly={false}
              isLoggedIn={!!loggedInUser}
              onSubscribeClick={handleSubscribeCourseClick}
              onViewCourseClick={handleViewCourseClick}
              purchasedCourseIds={purchasedCourseIds}
            />

            {/* Features Platform Advantages Section */}
            <Features
              features={lang === 'ar' ? featuresData.ar : featuresData.en}
              lang={lang}
            />

            {/* Student Testimonials Reviews Section */}
            <section className="py-24 bg-gradient-to-b from-neutral-50 to-neutral-100/50 dark:from-neutral-900/60 dark:to-neutral-900/30 border-y border-neutral-100/80 dark:border-neutral-800/50 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 dark:bg-indigo-900/10 blur-3xl" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-3xl opacity-60" />
              </div>

              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 px-4 py-1.5 text-xs font-black tracking-wide text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    {lang === 'ar' ? 'قصص نجاح من طلاب "سند"' : 'Success Stories from "Sanad" Students'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white leading-tight">
                    {lang === 'ar' ? 'آلاف الطلاب وثقوا في سند وأكملوا رحلتهم محققين الدرجات النهائية.' : 'Thousands trusted Sanad and achieved top marks.'}
                  </h2>
                  <p className="text-sm md:text-lg text-neutral-550 dark:text-neutral-400 font-bold max-w-2xl mx-auto">
                    {lang === 'ar' ? 'اقرأ شهاداتهم بكل مصداقية لتتعرف على تجاربهم الملهمة.' : 'Read their authentic testimonials to learn about their inspiring experiences.'}
                  </p>
                </div>

                <ReviewSlider
                  reviews={lang === 'ar' ? reviewsData.ar as any : reviewsData.en as any}
                  lang={lang}
                />
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <FAQ
              faqItems={lang === 'ar' ? faqData.ar : faqData.en}
              lang={lang}
            />
          </>
        )}
      </main>

      {/* Footer Area with builtin legal modals */}
      <Footer lang={lang} />

      {/* Dynamic Popups Auth Dialog */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        lang={lang}
        initialTab={authTab}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
