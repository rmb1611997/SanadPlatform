import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe, LogIn, UserPlus, LogOut, User, GraduationCap, Coins, Bell, Shield, BookOpen, BarChart3, LayoutDashboard, Key, Wallet, ShieldAlert, Settings } from 'lucide-react';
import { translations } from '../data';
import { getPlatformSettings } from './AdminPlatformSettings';

interface HeaderProps {
  currentLang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: (tab: 'login' | 'signup') => void;
  loggedInUser: { name: string; country?: 'EG' | 'SA'; grade?: string; role?: 'student' | 'teacher' | 'admin'; isGuest?: boolean } | null;
  onLogout: () => void;
  currentView?: 'landing' | 'dashboard';
  setCurrentView?: (view: 'landing' | 'dashboard') => void;
  onLogoClick?: () => void;
}

export default function Header({
  currentLang,
  setLang,
  darkMode,
  setDarkMode,
  onOpenAuth,
  loggedInUser,
  onLogout,
  currentView = 'landing',
  setCurrentView,
  onLogoClick
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [isRamadan, setIsRamadan] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsRamadan(localStorage.getItem('sanad_ramadan_theme') === 'true');
    };
    checkTheme();
    window.addEventListener('ramadan_theme_toggle', checkTheme);
    return () => window.removeEventListener('ramadan_theme_toggle', checkTheme);
  }, []);

  const t = translations[currentLang];
  const isAr = currentLang === 'ar';
  const showSidebarToggle = loggedInUser && (loggedInUser.role === 'teacher' || loggedInUser.role === 'admin') && currentView === 'dashboard';
  const platformSettings = getPlatformSettings();
  const refundsEnabled = platformSettings.financial.refundsEnabled;

  // Helper to extract first name
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    let cleaned = fullName.replace(/^(أ\.\s*|أ\/\s*|د\.\s*|المعلم\s+|الاستاذ\s+|أستاذة\s+)/, '');
    return cleaned.trim().split(/\s+/)[0];
  };

  const getWalletBalance = () => {
    if (!loggedInUser) return 150;
    const saved = localStorage.getItem(`sanad_wallet_${loggedInUser.name}`);
    return saved ? Number(saved) : 150;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(currentLang === 'ar' ? 'en' : 'ar');
  };

  const navItems = loggedInUser ? [] : [
    { label: isAr ? 'الكورسات' : 'Courses', href: '#courses' },
    { label: isAr ? 'المدرسين' : 'Teachers', href: '#teachers' },
    { label: isAr ? 'المميزات' : 'Features', href: '#about' },
    { label: isAr ? 'الأسئلة الشائعة' : 'FAQ', href: '#faq' },
    { label: isAr ? 'تواصل معنا' : 'Contact Us', href: '#contact' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (setCurrentView && currentView !== 'landing') setCurrentView('landing');
    setTimeout(() => {
      const targetElement = document.querySelector(href);
      if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) onLogoClick();
    if (setCurrentView) {
      if (loggedInUser && loggedInUser.role === 'teacher') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notifs = loggedInUser?.role === 'student' ? [
    { id: 'n1', textAr: 'تم شحن رصيد المحفظة التعليمية بنجاح 💸', textEn: 'Wallet recharged successfully' },
    { id: 'n2', textAr: 'أ. أحمد سامي رفع مذكرة الفيزياء الجديدة المخصصة لصفك 📂', textEn: 'New Physics PDF booklet uploaded for you' }
  ] : [];

  return (
    <header
      dir={isAr ? 'rtl' : 'ltr'}
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-md border-b border-neutral-150 dark:border-neutral-800'
          : 'bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800/60'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <div className="flex items-center gap-4">
            {showSidebarToggle && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('sanad_toggle_sidebar'))}
                className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-200"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <a href="#home" onClick={handleLogoClick} className="flex items-center gap-4">
              <img src="/images/shortlogo.png" alt="Sanad" className="h-16 w-16 object-contain dark:brightness-0 dark:invert" referrerPolicy="no-referrer" />
              <span className={`text-4xl font-black tracking-tight ${isRamadan ? 'text-amber-600' : 'text-indigo-600'}`}>
                {isAr ? 'سند ' : 'SANAD'}
              </span>
            </a>
          </div>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => handleSmoothScroll(e, item.href)} className="text-sm font-black text-neutral-600 hover:text-indigo-600 tracking-wide">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loggedInUser && loggedInUser.role === 'student' && !loggedInUser.isGuest && (
              <button 
                onClick={() => {
                  if (setCurrentView) setCurrentView('dashboard');
                  window.dispatchEvent(new CustomEvent('open-wallet-tab'));
                }}
                className="flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 rounded-2xl transition hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <Wallet className="h-5 w-5 text-amber-500" />
                <span className="text-xs font-black text-amber-700 dark:text-amber-400 font-mono">
                  {getWalletBalance()} {loggedInUser.country === 'EG' ? (isAr ? 'جنيه' : 'EGP') : (isAr ? 'ريال' : 'SAR')}
                </span>
              </button>
            )}
            <button onClick={toggleLang} className="p-2.5 text-sm font-black text-neutral-700 dark:text-neutral-300">{isAr ? 'English' : 'العربية'}</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">{darkMode ? <Sun className="h-5.5 w-5.5" /> : <Moon className="h-5.5 w-5.5" />}</button>

            {loggedInUser && !loggedInUser.isGuest ? (
              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-indigo-500/30 transition-transform active:scale-95">
                  {loggedInUser.name[0].toUpperCase()}
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute ${isAr ? 'left-0' : 'right-0'} top-11 mt-2.5 w-64 rounded-2xl bg-white p-2 shadow-2xl border dark:bg-neutral-850 dark:border-neutral-750 z-50 text-right`}>
                    <div className="px-3 py-3 border-b mb-2">
                       <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">{loggedInUser.name}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      {loggedInUser.role === 'student' && (
                        <>
                          <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-stats-tab')); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
                            <BarChart3 className="h-4 w-4 text-indigo-500" />
                            <span>{isAr ? 'احصائياتي' : 'My Stats'}</span>
                          </button>
                          <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-courses-tab')); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            <span>{isAr ? 'كورساتي' : 'My Courses'}</span>
                          </button>
                          <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-wallet-tab')); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
                            <Wallet className="h-4 w-4 text-amber-500" />
                            <span>{isAr ? 'المحفظة' : 'Wallet'}</span>
                          </button>
                          {refundsEnabled && (
                            <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-refunds-tab')); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">
                              <ShieldAlert className="h-4 w-4 text-rose-500" />
                              <span>{isAr ? 'طلب استرداد' : 'Refund Request'}</span>
                            </button>
                          )}
                        </>
                      )}
                      {loggedInUser.role !== 'student' && setCurrentView && (
                        <button onClick={() => { setCurrentView(currentView === 'dashboard' ? 'landing' : 'dashboard'); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black hover:bg-neutral-50">
                           <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                           <span>{isAr ? 'لوحة التحكم 📊' : 'Dashboard'}</span>
                        </button>
                      )}
                      <div className="border-t my-1" />
                      <button onClick={() => { onLogout(); setProfileDropdownOpen(false); }} className="w-full text-start flex items-center gap-2 px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-xl">
                        <LogOut className="h-4 w-4" />
                        <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => onOpenAuth('login')} className="text-sm font-black text-neutral-700 dark:text-neutral-200 px-2">{t.navLogin}</button>
                <button onClick={() => onOpenAuth('signup')} className="px-7 py-3 text-sm font-black rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">{t.navRegister}</button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">{isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-neutral-900 px-4 py-4 space-y-3">
          {loggedInUser && !loggedInUser.isGuest ? (
            <div className="space-y-3">
              {loggedInUser.role === 'student' && (
                <>
                  <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-stats-tab')); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-50 rounded-xl text-xs font-black">
                    <BarChart3 className="h-4 w-4 text-indigo-500" />
                    <span>{isAr ? 'احصائياتي' : 'My Stats'}</span>
                  </button>
                  <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-courses-tab')); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-50 rounded-xl text-xs font-black">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span>{isAr ? 'كورساتي' : 'My Courses'}</span>
                  </button>
                   <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-wallet-tab')); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-50 rounded-xl text-xs font-black">
                    <Wallet className="h-4 w-4 text-amber-500" />
                    <span>{isAr ? 'المحفظة' : 'Wallet'}</span>
                  </button>
                  {refundsEnabled && (
                    <button onClick={() => { if (setCurrentView) setCurrentView('dashboard'); window.dispatchEvent(new CustomEvent('open-refunds-tab')); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-50 rounded-xl text-xs font-black">
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                      <span>{isAr ? 'طلب استرداد' : 'Refund Request'}</span>
                    </button>
                  )}
                </>
              )}
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-black">
                <LogOut className="h-4 w-4 inline mr-2" />
                <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { onOpenAuth('login'); setIsOpen(false); }} className="py-2.5 border rounded-xl font-black text-xs">{isAr ? 'دخول' : 'Login'}</button>
              <button onClick={() => { onOpenAuth('signup'); setIsOpen(false); }} className="py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs">{isAr ? 'حساب جديد' : 'Sign Up'}</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
