import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe, LogIn, UserPlus, LogOut, User, GraduationCap, Coins, Bell, Shield, BookOpen, BarChart3, LayoutDashboard, Key, Wallet } from 'lucide-react';
import { translations } from '../data';

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

  const t = translations[currentLang];
  const isAr = currentLang === 'ar';

  // Helper to extract first name
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    // Strip prefixes like 'أ. ', 'أ/ ', 'د. ', 'المعلم ', 'الاستاذ ', 'أستاذة '
    let cleaned = fullName.replace(/^(أ\.\s*|أ\/\s*|د\.\s*|المعلم\s+|الاستاذ\s+|أستاذة\s+)/, '');
    return cleaned.trim().split(/\s+/)[0];
  };

  // Helper to read wallet balance dynamically
  const getWalletBalance = () => {
    if (!loggedInUser) return 150;
    const saved = localStorage.getItem(`sanad_wallet_${loggedInUser.name}`);
    return saved ? Number(saved) : 150;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
    
    // Switch view back to landing if on dashboard
    if (setCurrentView && currentView !== 'landing') {
      setCurrentView('landing');
    }

    // Delay slightly to allow main page to render first before scrolling
    setTimeout(() => {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
    if (setCurrentView) {
      setCurrentView('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock Notifications based on role
  const getMockNotifications = () => {
    if (!loggedInUser) return [];
    if (loggedInUser.role === 'student') {
      return [
        { id: 'n1', textAr: 'تم شحن رصيد المحفظة التعليمية بنجاح 💸', textEn: 'Wallet recharged successfully' },
        { id: 'n2', textAr: 'أ. أحمد سامي رفع مذكرة الفيزياء الجديدة المخصصة لصفك 📂', textEn: 'New Physics PDF booklet uploaded for you' }
      ];
    } else if (loggedInUser.role === 'teacher') {
      return [
        { id: 'n1', textAr: 'استفسار جديد من الطالب يوسف بخصوص التوالي والتوازي ❓', textEn: 'New student question submitted on secondary tracks' },
        { id: 'n2', textAr: 'تحذير أمان: تم رصد جلسة فحص برمجية من المسؤول 🛡️', textEn: 'Security report logged by Super Admin' }
      ];
    } else {
      return [
        { id: 'n1', textAr: 'تقرير حماية: تم تسجيل دخول ناجح بمستوى صلاحية أدمن 🔐', textEn: 'Security access granted' },
        { id: 'n2', textAr: 'طلب سحب رصيد/تسوية مالية جديد معلق من كادر التدريس 💰', textEn: 'New pending billing requests' }
      ];
    }
  };

  const notifs = getMockNotifications();

  return (
    <header
      dir={isAr ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-md border-b border-neutral-150 dark:border-neutral-800'
          : 'bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800/60'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand Area */}
          <div className="flex items-center gap-3">
            <a href="#home" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="p-1 rounded-xl group-hover:scale-105 transition-all duration-350 shrink-0">
                <img src="/src/assets/images/logoshort.png" alt="Sanad" className="h-15 w-15 object-contain dark:brightness-0 dark:invert" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:!bg-none dark:!text-white">
                  {isAr ? 'سند ' : 'SANAD'}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-1.5 lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="px-3.5 py-2 text-xs font-black rounded-xl text-neutral-600 hover:text-indigo-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-indigo-400 dark:hover:bg-neutral-800 transition-all duration-150"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Utility Tools & Action Keys */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switch Button */}
            <button
              onClick={toggleLang}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400 transition flex items-center gap-1.5 text-xs font-bold"
              title={isAr ? 'English' : 'عربي'}
            >
              <Globe className="h-4.5 w-4.5" />
              <span className="text-[11px] font-black">{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Dark & Light Selector */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Bell (Visible when Logged In) */}
            {loggedInUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-indigo-650 dark:text-neutral-400 dark:hover:bg-neutral-800 relative transition-all cursor-pointer"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 border border-white dark:border-neutral-900 animate-pulse" />
                </button>

                {notifDropdownOpen && (
                  <div className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-72 rounded-2xl bg-white p-3 shadow-xl border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-750 text-right z-50`}>
                    <p className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-2 border-b pb-1">
                      {isAr ? '🔔 الإشعارات والتحميلات الأخيرة' : '🔔 Live Notifications'}
                    </p>
                    <div className="space-y-2">
                      {notifs.map((n) => (
                        <div key={n.id} className="p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800 text-[11px] font-bold">
                          {isAr ? n.textAr : n.textEn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authentication & Profile Dropdowns */}
            {loggedInUser && !loggedInUser.isGuest ? (
              <div className="relative flex items-center gap-2.5 pl-1.5">
                
                {/* Student specific top-level wallet indicator */}
                {loggedInUser.role === 'student' && (
                  <button 
                    onClick={() => {
                      if (setCurrentView) setCurrentView('dashboard');
                      window.dispatchEvent(new CustomEvent('open-wallet-tab'));
                    }}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 rounded-full font-bold text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition cursor-pointer"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    <span className="font-mono">{getWalletBalance()}</span>
                    <span>{loggedInUser.country === 'EG' ? (isAr ? 'جنيه' : 'EGP') : (isAr ? 'ريال' : 'SAR')}</span>
                  </button>
                )}

                {/* Welcoming Greeting with First Name ONLY */}
                <span className="text-[11px] font-black text-neutral-600 dark:text-neutral-300 bg-neutral-100/50 dark:bg-neutral-800/40 px-3 py-1 rounded-full border border-neutral-150/40 hidden lg:inline-flex">
                  {isAr ? `مرحباً، ${getFirstName(loggedInUser.name)} 👋` : `Hello, ${getFirstName(loggedInUser.name)} 👋`}
                </span>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs font-black ring-2 ring-indigo-50 dark:ring-indigo-950">
                    {loggedInUser.name[0].toUpperCase()}
                  </div>
                </button>

                {/* User Dropdown Menu based on System Roles */}
                {profileDropdownOpen && (
                  <div className={`absolute ${isAr ? 'left-0' : 'right-0'} top-11 mt-2.5 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-neutral-100 dark:bg-neutral-850 dark:border-neutral-750 z-50 text-right`}>
                    
                    {/* Compact User Header Account Box */}
                    <div className="px-3 py-3 border-b border-neutral-100 dark:border-neutral-750/80 mb-2">
                      {loggedInUser.role !== 'teacher' && (
                        <p className="text-[9px] uppercase font-black text-indigo-650 dark:text-indigo-400 tracking-wider">
                          {loggedInUser.role === 'student' ? (isAr ? 'حساب الطالب المعمد 🎓' : 'Verified Student') :
                           (isAr ? 'سوبر أدمن / مدير المنصة 🛡️' : 'Platform Administrator')}
                        </p>
                      )}
                      <p className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-1 truncate">
                        {loggedInUser.name}
                      </p>
                      
                      {loggedInUser.role === 'student' && (
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-450 dark:text-neutral-450 mt-1.5 font-bold">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>
                            {loggedInUser.country === 'EG' ? '🇪🇬 المنهج المصري ' : '🇸🇦 المنهج السعودي '}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-1 space-y-1">
                      {/* Active view toggler (Dashboard <-> Home) */}
                      {setCurrentView && (
                        <button
                          onClick={() => {
                            setCurrentView(currentView === 'dashboard' ? 'landing' : 'dashboard');
                            setProfileDropdownOpen(false);
                            if (currentView === 'dashboard') {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="w-full text-start flex items-center gap-2 px-3 py-2 text-[11px] font-black text-neutral-650 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all"
                        >
                          {currentView === 'dashboard' ? (
                            <>
                              <Globe className="h-4 w-4 text-indigo-500" />
                              <span>{isAr ? 'تصفح المنصة الرئيسية 🌐' : 'Explore Platform Home'}</span>
                            </>
                          ) : (
                            <>
                              <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                              <span>{isAr ? 'الذهاب للوحة التحكم والتعلم 📊' : 'Open Study Dashboard'}</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Student Meta Details & Wallet recharge summary */}
                      {loggedInUser.role === 'student' && (
                        <button 
                          onClick={() => {
                            if (setCurrentView) setCurrentView('dashboard');
                            window.dispatchEvent(new CustomEvent('open-wallet-tab'));
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-[10px] text-neutral-600 dark:text-neutral-400 bg-amber-50/40 hover:bg-amber-100/50 dark:bg-amber-955/10 dark:hover:bg-amber-900/30 rounded-xl border border-amber-100/30 transition cursor-pointer"
                        >
                          <span className="flex items-center gap-1 font-bold">
                            <Coins className="h-3.5 w-3.5 text-amber-500" />
                            <span>{isAr ? 'رصيد المحفظة التعليمية' : 'Learning Wallet'}</span>
                          </span>
                          <span className="font-extrabold text-indigo-650 dark:text-indigo-400 font-mono">
                            {getWalletBalance()} {loggedInUser.country === 'EG' ? (isAr ? 'جنيه' : 'EGP') : (isAr ? 'ريال' : 'SAR')}
                          </span>
                        </button>
                      )}

                      {/* Admin Quick actions */}
                      {loggedInUser.role === 'admin' && (
                        <div className="space-y-1">
                          <button
                            onClick={() => { setCurrentView?.('dashboard'); setProfileDropdownOpen(false); }}
                            className="w-full text-start flex items-center gap-2 px-3 py-2 text-[10px] text-neutral-450 hover:text-neutral-850 dark:hover:text-neutral-100 font-black"
                          >
                            <Key className="h-3.5 w-3.5 text-orange-500" />
                            <span>{isAr ? 'إدارة المدرسين والحماية الفنية' : 'Manage faculty roles'}</span>
                          </button>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="border-t border-neutral-100 dark:border-neutral-750/50 my-1" />

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-start flex items-center gap-2 px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 rounded-xl transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Sign Out Profile'}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-bold text-neutral-700 hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400 transition"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:shadow-none transition cursor-pointer"
                >
                  {t.navRegister}
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={toggleLang}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition hover:text-indigo-600"
            >
              <Globe className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-850"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          
          {loggedInUser && !loggedInUser.isGuest && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-right border border-neutral-150/40">
              <span className="text-[11px] font-black text-neutral-600 dark:text-neutral-300">
                {isAr ? `مرحباً، ${getFirstName(loggedInUser.name)} 👋` : `Hello, ${getFirstName(loggedInUser.name)} 👋`}
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="px-3 py-2 rounded-lg text-xs font-black text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-indigo-400 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Profile or Login split on mobile */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {loggedInUser && !loggedInUser.isGuest ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-right">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {loggedInUser.name[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-black text-neutral-800 dark:text-neutral-200 truncate">{loggedInUser.name}</h5>
                    {loggedInUser.role !== 'teacher' && (
                      <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold mt-0.5">
                        {loggedInUser.role === 'student' ? (isAr ? 'طالب معتمد 🎓' : 'Student') : (isAr ? 'مدير المنصة 🛡️' : 'Admin')}
                      </p>
                    )}
                  </div>
                </div>

                {loggedInUser.role === 'student' && (
                  <button 
                    onClick={() => {
                      if (setCurrentView) setCurrentView('dashboard');
                      window.dispatchEvent(new CustomEvent('open-wallet-tab'));
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 mt-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 rounded-xl text-[10px] text-neutral-600 dark:text-neutral-400 font-bold border border-amber-200/50 dark:border-amber-900/50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <Wallet className="h-4 w-4" />
                      <span>{isAr ? 'رصيد المحفظة' : 'Wallet Balance'}</span>
                    </span>
                    <span className="font-extrabold font-mono text-amber-700 dark:text-amber-400">
                      {getWalletBalance()} {loggedInUser.country === 'EG' ? (isAr ? 'جنيه' : 'EGP') : (isAr ? 'ريال' : 'SAR')}
                    </span>
                  </button>
                )}

                {setCurrentView && (
                  <button
                    onClick={() => {
                      setCurrentView(currentView === 'dashboard' ? 'landing' : 'dashboard');
                      setIsOpen(false);
                      if (currentView === 'dashboard') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-450 text-[11px] font-black"
                  >
                    {currentView === 'dashboard' ? (
                      <span>{isAr ? 'العودة للصفحة الرئيسية 🌐' : 'Go to Homepage'}</span>
                    ) : (
                      <span>{isAr ? 'لوحة التحكم والتعلم 📊' : 'Open Dashboard'}</span>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-black transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isAr ? 'تسجيل الخروج من المنصة' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-black rounded-xl text-neutral-700 hover:bg-neutral-50 border border-neutral-100 dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800 transition"
                >
                  {isAr ? 'تسجيل دخول' : 'Login'}
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-black rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  {isAr ? 'إنشاء حساب' : 'Sign Up'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
