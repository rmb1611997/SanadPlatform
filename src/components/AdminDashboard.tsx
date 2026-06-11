import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Users, BookOpen, Trash2, PlusCircle, 
  Key, RefreshCw, AlertTriangle, Settings, LogOut, CheckCircle, 
  Search, Shield, MapPin, Check, Plus, Lock, Unlock, Database,
  Menu, ChevronRight, CreditCard, Sparkles, TrendingUp, Bell,
  FileText, BarChart3, PieChart, HelpCircle, ToggleLeft, ToggleRight,
  UserCheck, UserX, Landmark
} from 'lucide-react';
import { 
  getAllUsers, deleteUserByAdmin, addTeacherByAdmin, resetUserPassword, 
  getSecurityLogs, SecurityLog, UserProfile 
} from '../utils/db';
import { coursesData } from '../data';

interface AdminDashboardProps {
  user: { name: string };
  lang: 'ar' | 'en';
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

interface Voucher {
  code: string;
  amount: number;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

interface NotificationObj {
  id: string;
  title: string;
  link: string;
  startDate: string;
  endDate?: string;
  isPermanent: boolean;
  createdAt: string;
}

export default function AdminDashboard({ user, lang, onLogout, darkMode, setDarkMode }: AdminDashboardProps) {
  const isAr = lang === 'ar';

  // Sidebar controls
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Separate, independent sidebar sections
  type SectionTab = 'home' | 'teachers' | 'students' | 'courses' | 'grades' | 'codes' | 'stats' | 'notifications' | 'settings';
  const [activeTab, setActiveTab] = useState<SectionTab>('home');

  // Core records loaded from DB
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Voucher dynamic management state
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('sanad_vouchers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Pre-seed some default vouchers in sandbox mode
    return [
      { code: 'SANAD50', amount: 50, isUsed: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { code: 'SANAD100', amount: 100, isUsed: false, createdAt: new Date(Date.now() - 43200000).toISOString() },
      { code: 'VIP500', amount: 500, isUsed: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { code: 'OMAR200', amount: 200, isUsed: true, usedBy: '01111111111', usedAt: new Date(Date.now() - 1800000).toISOString(), createdAt: new Date(Date.now() - 7200000).toISOString() }
    ];
  });

  // Global Notification state managed by Admin (synchronized with students platform)
  const [notifications, setNotifications] = useState<NotificationObj[]>(() => {
    const raw = localStorage.getItem('sanad_notifications');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [{
      id: 'init_n_1',
      title: '🚨 هام لجميع طلاب الثانوية: مراجعة الدوائر المعقدة وقانوني كيرشوف البث القادم!',
      link: 'https://youtube.com',
      startDate: new Date().toISOString().substring(0, 16),
      isPermanent: true,
      createdAt: new Date().toISOString()
    }];
  });

  // New notify form inputs
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyLink, setNotifyLink] = useState('');
  const [notifyPermanent, setNotifyPermanent] = useState(true);

  // Course registry state loaded from Custom DB
  const [courses, setCourses] = useState<any[]>(() => {
    const saved = localStorage.getItem('sanad_custom_courses_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return coursesData[lang] || [];
  });

  // Custom Grades definition
  const [customGrades, setCustomGrades] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanad_custom_grades');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      'الصف الأول الثانوي (مصر)',
      'الصف الثاني الثانوي (مصر)',
      'الصف الثالث الثانوي (مصر)',
      'السنة الأولى المشتركة (المسارات السعودية)',
      'مسار عام (المسارات السعودية)',
      'مسار علوم الحاسب والهندسة (المسارات السعودية)',
      'مسار صحة وحياة (المسارات السعودية)',
      'مسار إدارة الأعمال (المسارات السعودية)'
    ];
  });
  const [newGradeInput, setNewGradeInput] = useState('');

  // Voucher creation inputs
  const [customVoucherPrefix, setCustomVoucherPrefix] = useState('SND');
  const [customVoucherValue, setCustomVoucherValue] = useState<number>(100);

  // Forms & Modals state
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tCountry, setTCountry] = useState<'EG' | 'SA'>('EG');
  const [tLocation, setTLocation] = useState('');
  const [tGender, setTGender] = useState<'male' | 'female'>('male');
  const [tSpecialty, setTSpecialty] = useState('');
  const [tPassword, setTPassword] = useState('');

  // Password resets state
  const [editingPhone, setEditingPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Inline pricing edits
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingPriceVal, setEditingPriceVal] = useState<number>(100);

  // Feedback notifications
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // System controls (Local presets synchronized with admin panel switches)
  const [maintenance, setMaintenance] = useState(() => localStorage.getItem('sanad_maintenance_mode') === 'true');
  const [lockRegistration, setLockRegistration] = useState(() => localStorage.getItem('sanad_lock_signup') === 'true');
  const [basePriceMultiplier, setBasePriceMultiplier] = useState(() => {
    const saved = localStorage.getItem('sanad_pricing_multiplier');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Load everything on mount
  const loadData = () => {
    setUsers(getAllUsers());
    setLogs(getSecurityLogs());
  };

  useEffect(() => {
    loadData();
    // Pre-populate some security logs if none exist
    if (getSecurityLogs().length === 0) {
      localStorage.setItem('sanad_security_logs', JSON.stringify([
        { timestamp: new Date(Date.now() - 3600000).toISOString(), phone: '01111111111', event: 'login_success', role: 'student' },
        { timestamp: new Date(Date.now() - 5400000).toISOString(), phone: '01599999999', event: 'login_failed', ip: '197.34.120.45' },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), phone: '0512345678', event: 'login_success', role: 'student' },
        { timestamp: new Date(Date.now() - 14400000).toISOString(), phone: '01010101010', event: 'login_success', role: 'admin' },
        { timestamp: new Date(Date.now() - 28800000).toISOString(), phone: '01234567890', event: 'bruteforce_lockout_ip', ip: '102.164.20.12' },
      ]));
      setLogs(getSecurityLogs());
    }
  }, []);

  // Sync state modifications onto storage systems
  useEffect(() => {
    localStorage.setItem('sanad_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('sanad_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sanad_custom_courses_db', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sanad_custom_grades', JSON.stringify(customGrades));
  }, [customGrades]);

  // Operational toggles
  useEffect(() => {
    localStorage.setItem('sanad_maintenance_mode', String(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('sanad_lock_signup', String(lockRegistration));
  }, [lockRegistration]);

  useEffect(() => {
    localStorage.setItem('sanad_pricing_multiplier', String(basePriceMultiplier));
  }, [basePriceMultiplier]);

  const showToastSuccess = (text: string) => {
    setSuccess(text);
    setTimeout(() => setSuccess(''), 4000);
  };

  const showToastError = (text: string) => {
    setError(text);
    setTimeout(() => setError(''), 4000);
  };

  // General operations handlers
  const handleDeleteUser = (phone: string, roleName: string) => {
    if (phone === '01010101010') {
      showToastError(isAr ? '⚠️ عذراً! غير مسموح بحذف حساب السوبر أدمن الرئيسي للسلامة.' : '⚠️ Failed: Main Super Admin key cannot be terminated.');
      return;
    }
    const yes = window.confirm(isAr 
      ? `هل أنت متأكد من رغبتك في حذف حساب ${roleName === 'teacher' ? 'المدرس' : 'الطالب'} (${phone}) بالكامل؟`
      : `Are you absolutely sure you want to delete account (${phone})?`
    );
    if (yes) {
      deleteUserByAdmin(phone);
      showToastSuccess(isAr ? '🗑️ تم إلغاء وتصفية بيانات العضو بنجاح من المخطط!' : '🗑️ Member registry liquidated successfully.');
      loadData();
    }
  };

  const handleToggleBanUser = (phone: string) => {
    if (phone === '01010101010') return;
    const usersList = getAllUsers();
    const index = usersList.findIndex(u => u.phone === phone);
    if (index !== -1) {
      const state = !usersList[index].isBanned;
      usersList[index].isBanned = state;
      localStorage.setItem('sanad_users_db', JSON.stringify(usersList));
      loadData();
      showToastSuccess(isAr
        ? (state ? '🚫 تم حظر وإلغاء تفعيل حساب الطالب فورا!' : '🔓 تم فك حظر حساب الطالب وإعادة الترخيص!')
        : (state ? '🚫 Student has been blacklisted and blocked!' : '🔓 Student unbanned and restored successfully!')
      );
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tPhone.trim() || !tPassword.trim() || !tSpecialty.trim()) return;

    const res = await addTeacherByAdmin({
      name: tName,
      phone: tPhone,
      country: tCountry,
      location: tLocation,
      gender: tGender,
      specialty: tSpecialty,
      passwordPlane: tPassword
    });

    if (res.success) {
      showToastSuccess(isAr ? `🎉 تم بنجاح تشفير وتفعيل حساب المدرس الجديد: أ. ${tName}` : `🎉 Authorised tutor "Mr. ${tName}" registered successfully!`);
      // Reset inputs
      setTName('');
      setTPhone('');
      setTSpecialty('');
      setTPassword('');
      setTLocation('');
      loadData();
    } else {
      showToastError(res.error || 'Server error creating instructor');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    const ok = await resetUserPassword(editingPhone, newPassword);
    if (ok) {
      showToastSuccess(isAr ? `🔑 تم تحديث وتشفير كلمة المرور الجديدة للعضو (${editingPhone})` : `🔑 Secure password updated successfully for ${editingPhone}!`);
      setEditingPhone('');
      setNewPassword('');
    } else {
      showToastError(isAr ? '⚠️ عذراً، فشل تغيير شفرة المرور.' : '⚠️ Failed to replace key token.');
    }
  };

  // Voucher generator handler
  const handleGenerateVoucher = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous characters
    let suffix = '';
    for (let i = 0; i < 5; i++) {
      suffix += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const finalCode = `${customVoucherPrefix.trim().toUpperCase()}${customVoucherValue}${suffix}`;
    
    // Check duplication
    if (vouchers.some(v => v.code === finalCode)) {
      showToastError(isAr ? '⚠️ الرمز مكرر تلقائياً! حاول كتابة معيار مختلف.' : '⚠️ Generated code duplicates another key. Retry again.');
      return;
    }

    const newV: Voucher = {
      code: finalCode,
      amount: customVoucherValue,
      isUsed: false,
      createdAt: new Date().toISOString()
    };
    setVouchers([newV, ...vouchers]);
    showToastSuccess(isAr ? `💳 تم توليد كارت الشحن المقابل الكود: ${finalCode}` : `💳 New voucher created: ${finalCode}`);
  };

  const handleDeleteVoucher = (code: string) => {
    setVouchers(vouchers.filter(v => v.code !== code));
    showToastSuccess(isAr ? '🧹 تم تعطيل وإتلاف الكود بنجاح!' : '🧹 Voucher token terminated.');
  };

  // Course price update handler
  const handleUpdateCoursePrice = (courseId: string, itemPrice: number) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, price: itemPrice, discountPrice: Math.floor(itemPrice * 0.9) };
      }
      return c;
    });
    setCourses(updated);
    setEditingCourseId(null);
    showToastSuccess(isAr ? '💵 تم تحديث السعر الفعلي وإعادة تهيئة القيمة المقررة!' : '💵 Academic price restructured successfully!');
  };

  const handleToggleCourseVisibility = (courseId: string) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, isVisible: c.isVisible === undefined ? false : !c.isVisible };
      }
      return c;
    });
    setCourses(updated);
    showToastSuccess(isAr ? '👁️ تم تعديل وتحديث حالة ظهور الكورس لجميع الطلاب!' : '👁️ Course display metrics synchronized!');
  };

  // Notifications handlers
  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle.trim()) return;

    const newNotify: NotificationObj = {
      id: 'n_' + Date.now(),
      title: notifyTitle.trim(),
      link: notifyLink.trim() || 'https://sanadschool.com',
      startDate: new Date().toISOString().substring(0, 16),
      isPermanent: notifyPermanent,
      createdAt: new Date().toISOString()
    };

    // Update the notification (keep max 1 in list according to platform specifications)
    setNotifications([newNotify]);
    setNotifyTitle('');
    setNotifyLink('');
    showToastSuccess(isAr ? '📢 تم تفعيل وبث الإشعار الشامل بجميع الصفحات فوراً!' : '📢 Platform notice broadcasted active!');
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications([]);
    showToastSuccess(isAr ? '📯 تم إلغاء وتحييد لوحة الإشعارات العامة!' : '📯 General bulletin removed.');
  };

  // Grade/curriculum configuration helper
  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeInput.trim()) return;
    if (customGrades.includes(newGradeInput.trim())) {
      showToastError(isAr ? '⚠️ الصف التعليمي مضاف بالفعل!' : '⚠️ Grade name already registered.');
      return;
    }
    setCustomGrades([...customGrades, newGradeInput.trim()]);
    setNewGradeInput('');
    showToastSuccess(isAr ? '📚 تم إضافة وتأسيس المنهج المدرسي الجديد بنجاح!' : '📚 Academic Stream configured successfully.');
  };

  const handleRemoveGrade = (grade: string) => {
    setCustomGrades(customGrades.filter(g => g !== grade));
    showToastSuccess(isAr ? '📚 تم سحب وإلغاء إدراج الصف التعليمي.' : '📚 Grade category withdrawn.');
  };

  // Standard lists
  const filteredUsers = users.filter(usr => {
    return usr.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           usr.phone.includes(searchTerm) || 
           (usr.specialty && usr.specialty.includes(searchTerm)) ||
           (usr.studentCode && usr.studentCode.includes(searchTerm));
  });

  const studentsRoster = filteredUsers.filter(u => u.role === 'student');
  const teachersRoster = filteredUsers.filter(u => u.role === 'teacher');

  // Counters states
  const totalStudentsCount = users.filter(u => u.role === 'student').length;
  const totalTeachersCount = users.filter(u => u.role === 'teacher').length;
  const totalEgyptCount = users.filter(u => u.country === 'EG' && u.role === 'student').length;
  const totalSaudiCount = users.filter(u => u.country === 'SA' && u.role === 'student').length;
  
  // Charts mock logs curve
  const chartEnrollmentData = [
    { name: 'Jan', الطلاب: 120, المبيعات: 1800, المدرسون: 4 },
    { name: 'Feb', الطلاب: 190, المبيعات: 4400, المدرسون: 4 },
    { name: 'Mar', الطلاب: 350, المبيعات: 9500, المدرسون: 6 },
    { name: 'Apr', الطلاب: 480, المبيعات: 15200, المدرسون: 8 },
    { name: 'May', الطلاب: 610, المبيعات: 21900, المدرسون: 11 },
    { name: 'Jun', الطلاب: totalStudentsCount || 720, المبيعات: 28400, المدرسون: totalTeachersCount || 12 },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-850 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans antialiased">
      
      {/* -------------------- MAIN SIDEBAR -------------------- */}
      <aside 
        id="admin_sidebar"
        className={`fixed inset-y-0 z-40 bg-white dark:bg-neutral-850 border-r border-l border-neutral-200 dark:border-neutral-800 transition-all duration-300 select-none
          ${sidebarCollapsed ? 'w-20' : 'w-72'} 
          ${isAr ? 'right-0' : 'left-0'} 
          ${mobileSidebarOpen ? 'translate-x-0' : (isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
        `}
      >
        <div className="h-full flex flex-col justify-between py-5 px-3">
          
          <div className="space-y-6">
            {/* Sidebar Branding Header */}
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="p-2.5 rounded-2xl bg-orange-605 text-white font-extrabold shadow-md shadow-orange-500/20 shrink-0">
                  🛡️
                </span>
                {!sidebarCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-right leading-tight"
                  >
                    <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">{isAr ? 'سند التعليمية' : 'Sanad Admin'}</h2>
                    <span className="text-[10px] text-orange-600 font-bold">{isAr ? 'السوبر أدمن الرئيسي' : 'Master Controller'}</span>
                  </motion.div>
                )}
              </div>

              {/* Collapsed manual toggle handler for larger screens */}
              <button 
                id="sidebar_collapse_toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450 hover:text-neutral-700 transition"
                title={isAr ? 'تصغير / تكبير القائمة' : 'Toggle Sidebar'}
              >
                <ChevronRight className={`h-4.5 w-4.5 duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Platform indicators info */}
            {!sidebarCollapsed && (
              <div className="mx-2 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 rounded-2xl">
                <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'وضع الصيانة والتحقق:' : 'Status Metrics:'}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${maintenance ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                    <span>{maintenance ? (isAr ? 'وضع ترقية' : 'Maintenance') : (isAr ? 'نشط بالكامل' : 'Live')}</span>
                  </span>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 px-2 py-0.5 rounded-full font-black">
                    x{basePriceMultiplier} Mult
                  </span>
                </div>
              </div>
            )}

            {/* Sidebar Independent Nav Actions index */}
            <nav className="space-y-1" id="sidebar_nav">
              {[
                { id: 'home', icon: ShieldCheck, titleAr: 'لوحة التحكم الرئيسية', titleEn: 'Admin Overview' },
                { id: 'teachers', icon: BookOpen, titleAr: 'إدارة المدرسين المعلمين', titleEn: 'Instructors Control' },
                { id: 'students', icon: Users, titleAr: 'إدارة شؤون الطلاب', titleEn: 'Students Registry' },
                { id: 'courses', icon: Database, titleAr: 'إدارة المناهج والكورسات', titleEn: 'Platform Curriculum' },
                { id: 'grades', icon: FileText, titleAr: 'إدارة الصفوف والمناهج الدراسية', titleEn: 'Manage Academic Years' },
                { id: 'codes', icon: CreditCard, titleAr: 'إدارة الأكواد وكروت الشحن', titleEn: 'Recharge Voucher Cards' },
                { id: 'stats', icon: BarChart3, titleAr: 'الإحصائيات والتقاير المالية', titleEn: 'General Metrics' },
                { id: 'notifications', icon: Bell, titleAr: 'بث التنبيهات وإعلانات المنصة', titleEn: 'Global Notices' },
                { id: 'settings', icon: Settings, titleAr: 'إعدادات المنصة الأساسية', titleEn: 'System Controls' },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar_btn_${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id as SectionTab);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-xs font-black transition-all duration-200 outline-none
                      ${active 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/10' 
                        : 'text-neutral-550 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }
                      ${sidebarCollapsed ? 'justify-center font-normal' : 'justify-start'}
                    `}
                    title={isAr ? item.titleAr : item.titleEn}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{isAr ? item.titleAr : item.titleEn}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Exit control */}
          <div className="space-y-2 pt-4 border-t border-neutral-150 dark:border-neutral-800">
            <button
              id="sidebar_logout_btn"
              onClick={onLogout}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all
                ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              {!sidebarCollapsed && (
                <span>{isAr ? 'تسجيل الخروج الآمن' : 'Secure Exit'}</span>
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile Back-drop overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* -------------------- MAIN WORKSPACE AREA -------------------- */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isAr 
            ? (sidebarCollapsed ? 'md:mr-20' : 'md:mr-72') 
            : (sidebarCollapsed ? 'md:ml-20' : 'md:ml-72')
        }`}
      >
        
        {/* TOP STATUS HEADER BAR */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-md px-4 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar open trigger button */}
              <button
                id="mobile_sidebar_trigger"
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-650 hover:bg-neutral-200"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-sm font-black flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <span>{isAr ? 'منصة سند التعليمية' : 'Sanad Academy'}</span>
                  <span className="px-2 py-0.5 bg-indigo-500/10 dark:bg-indigo-505/15 text-indigo-650 dark:text-indigo-400 text-[10px] rounded-lg tracking-wider font-extrabold uppercase ml-1">
                    v4 Sandbox
                  </span>
                </h1>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center gap-3">
              {/* Quick shortcut indicator */}
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-black rounded-xl">
                👤 {user.name} | Super Admin
              </span>

              {/* Theme toggle directly inside Super Admin */}
              <button
                id="header_theme_toggle_btn"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 transition duration-200 text-xs"
                title={isAr ? 'تبديل المظهر' : 'Toggle Appearance'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <button
                id="header_logout_shortcut"
                onClick={onLogout}
                className="p-2 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950 dark:hover:bg-rose-950/20 transition duration-205"
                title={isAr ? 'خروج' : 'Logout'}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

          </div>
        </header>

        {/* -------------------- DYNAMIC MAIN PAGES CONTROLLER -------------------- */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8" id="admin_main_workspace">
          
          {/* TOP TOAST MESSAGES */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-250 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-350 text-xs font-black rounded-2xl shadow-md flex items-center gap-2"
                id="success_payout_toast"
              >
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-rose-50 text-rose-800 border-2 border-rose-250 dark:bg-rose-955/35 dark:border-rose-900/40 dark:text-rose-350 text-xs font-black rounded-2xl shadow-md flex items-center gap-2"
                id="error_warning_toast"
              >
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PAGE VIEW SWITCHER */}

          {/* SECTION 1: لوحة التحكم الرئيسية (HOME) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Dynamic Greeting */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-650 to-amber-700 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-2 text-right">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                    {isAr ? 'المراقبة الفورية نشطة' : 'Real-time Telemetry Shield'}
                  </span>
                  <p className="text-xl md:text-3xl font-black">
                    {isAr ? `مرحباً بك مجدداً د. سند 🛡️` : `Welcome back, Master Admin! 🛡️`}
                  </p>
                  <p className="text-xs text-orange-50 font-bold max-w-xl">
                    {isAr 
                      ? 'بصفتك المدير العام للمنصة، تحظى بصلاحيات كاملة لمتابعة ترخيص المدرسين والطلاب، فحص محاولات الحظر، إصدار كروت الشحن، وبث الإعلانات العامة لجميع الطلاب.'
                      : 'You are viewing the consolidated security logs, platform modifiers, student stage customizer, and licensed coupon generator registers.'
                    }
                  </p>
                </div>
                <div className="absolute left-0 bottom-0 top-0 overflow-hidden opacity-10 pointer-events-none flex items-center">
                  <ShieldCheck className="h-44 w-44 -translate-x-12" />
                </div>
              </div>

              {/* Bento Stats Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="home_bento_counters">
                {[
                  { title: isAr ? 'إجمالي الطلاب المسجلين' : 'Total Students', value: totalStudentsCount, icon: Users, color: 'indigo' },
                  { title: isAr ? 'طاقم معلمين سند' : 'Authorized Instructors', value: totalTeachersCount, icon: BookOpen, color: 'amber' },
                  { title: isAr ? 'الدول (مصر | السعودية)' : 'Active Countries', value: `${totalEgyptCount} / ${totalSaudiCount}`, icon: MapPin, color: 'rose' },
                  { title: isAr ? 'كروت الشحن الفعالة' : 'Active Coupons Balance', value: vouchers.filter(v => !v.isUsed).length, icon: CreditCard, color: 'emerald' },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 flex items-center gap-4 transition hover:-translate-y-1 shadow-xs">
                      <span className={`p-3 rounded-2xl bg-${card.color}-500/10 text-${card.color}-600 dark:bg-${card.color}-505/20 dark:text-${card.color}-400`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="text-right leading-snug">
                        <p className="text-[10px] text-neutral-400 font-bold">{card.title}</p>
                        <p className="text-lg md:text-xl font-black mt-0.5">{card.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Home Shortcuts & Operational Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Security telemetries */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
                    <h3 className="text-sm font-black flex items-center gap-2">
                      <span className="p-1 px-1.5 bg-rose-500/10 text-rose-600 rounded-lg text-xs">🚨</span>
                      <span>{isAr ? 'سجل الحماية والرقابة الأمنية للجلسات' : 'Security Log Audits'}</span>
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-bold">
                      {isAr ? 'تحديث فوري' : 'Live ticker'}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
                    {logs.slice(0, 6).map((log, index) => (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-all text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`p-1.5 rounded-xl ${
                            log.event === 'login_success' ? 'bg-indigo-505/10 text-indigo-650' : 'bg-rose-500/10 text-rose-600'
                          }`}>
                            {log.event === 'login_success' ? '✓' : '✖'}
                          </span>
                          <div className="text-right">
                            <p className="font-extrabold text-neutral-900 dark:text-white">
                              {log.event === 'login_success' 
                                ? (isAr ? 'دخول ناجح للمنصة' : 'Authorized Access Granted') 
                                : log.event === 'bruteforce_lockout_ip'
                                ? (isAr ? 'حظر IP لتخمين متكرر!' : 'Bruteforce IP Preventative block!')
                                : (isAr ? 'محاولة دخول فاشلة!' : 'Failed Authentication Attempt')
                              }
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-1 font-semibold">
                              {isAr ? 'الحساب المستهدف' : 'Target Target'}: <span className="font-mono font-bold select-all">{log.phone}</span>
                              {log.ip && ` | IP Address: ${log.ip}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] text-neutral-400 font-semibold">
                          {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations shortcut panel */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-850 pb-3">
                    <Sparkles className="h-4.5 w-4.5 text-orange-600" />
                    <span>{isAr ? 'إجراءات تشغيلية سريعة' : 'Operational Commands'}</span>
                  </h3>

                  <div className="p-5 rounded-3xl bg-neutral-900 text-white space-y-4">
                    <p className="text-xs font-black text-amber-400">⚡ {isAr ? 'نصيحة أمنية سريعة' : 'Admin Security Tip'}</p>
                    <p className="text-[11px] text-neutral-350 leading-relaxed font-semibold">
                      {isAr
                        ? 'تتبع المنصة محاولة الدخول المتزامنة لأكواد الطلاب. يرجى مراجعة الطلاب الحاصلين على محاولات جلوس متعددة لتفادي مشاركة الحسابات وقفل الحماية التلقائي.'
                        : 'Students profiles can only lock into a single viewport. Review students login histories to prevent sharing accounts.'
                      }
                    </p>
                    <div className="pt-2">
                      <button 
                        onClick={() => setActiveTab('students')}
                        className="w-full py-2.5 bg-orange-605 text-white hover:bg-orange-700 rounded-xl text-xs font-black transition text-center"
                      >
                        {isAr ? 'التحقق من سجلات الطلاب 🔍' : 'Check Students Records 🔍'}
                      </button>
                    </div>
                  </div>

                  {/* Active Notice Widget */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-right space-y-3">
                    <p className="text-xs font-black">📢 {isAr ? 'الإعلان الشامل النشط حالياً:' : 'Active Universal Broadcast:'}</p>
                    {notifications.length > 0 ? (
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-850 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-150/45 text-[11px] font-bold">
                        {notifications[0].title}
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-400 font-medium">{isAr ? 'لا يوجد تنبيه معروض للطلاب.' : 'No active alert broadcasted.'}</p>
                    )}
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1 justify-end"
                    >
                      <span>{isAr ? 'تعديل الإعلان وصياغته' : 'Modify notices'}</span>
                      <ChevronRight className="h-3 w-3 rotate-180" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: إدارة المدرسين (TEACHERS) */}
          {activeTab === 'teachers' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">👨‍🏫</span>
                    <span>{isAr ? 'إدارة وتراخيص المدرسين المعتمدين' : 'Certified Teachers Directory'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'تحكم بحسابات طاقم المعلمين، أعد ضبط كلمة المرور الخاصة بكل مدرس، أو احذف تراخيص التقديم.' : 'Configure official faculty access, reset keys, and allocate academic streams.'}
                  </p>
                </div>
                <div className="text-xs font-black bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-2xl">
                  {isAr ? `إجمالي المقيدين: ${teachersRoster.length} مدرس مفعّل` : `${teachersRoster.length} verified educators`}
                </div>
              </div>

              {/* Grid with Form and list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Register Tutors Form */}
                <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-5">
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 border-b pb-3">
                    <PlusCircle className="h-4.5 w-4.5 text-amber-600" />
                    <span>{isAr ? 'تسجيل مدرس رسمي جديد بالمنصة' : 'Register a Certified Tutor'}</span>
                  </h4>

                  <form onSubmit={handleCreateTeacher} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'اسم المدرس الكامل' : 'Full Name'}</label>
                      <input 
                        type="text"
                        required
                        value={tName}
                        onChange={(e) => setTName(e.target.value)}
                        placeholder={isAr ? 'أ. أحمد مصطفى' : 'Mr. John'}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'رقم الهاتف (اسم المستخدم للدخول)' : 'Phone Number (Username)'}</label>
                      <input 
                        type="text"
                        required
                        value={tPhone}
                        onChange={(e) => setTPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400">{isAr ? 'الدولة' : 'Country'}</label>
                        <select 
                          value={tCountry}
                          onChange={(e) => setTCountry(e.target.value as any)}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                        >
                          <option value="EG">🇪🇬 مصر</option>
                          <option value="SA">🇸🇦 السعودية</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400">{isAr ? 'المحافظة / المدينة' : 'Region'}</label>
                        <input 
                          type="text"
                          required
                          value={tLocation}
                          onChange={(e) => setTLocation(e.target.value)}
                          placeholder={isAr ? 'القاهرة' : 'Cairo'}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'التخصص والمرحلة الدراسية' : 'Academic Specialty'}</label>
                      <input 
                        type="text"
                        required
                        value={tSpecialty}
                        onChange={(e) => setTSpecialty(e.target.value)}
                        placeholder={isAr ? 'الفيزياء للثانوية العامة' : 'Physics master'}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400">{isAr ? 'الجنس' : 'Gender'}</label>
                        <select 
                          value={tGender}
                          onChange={(e) => setTGender(e.target.value as any)}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                        >
                          <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                          <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-amber-600">{isAr ? 'بطاقة المرور الابتدائية' : 'Initial Password'}</label>
                        <input 
                          type="text"
                          required
                          value={tPassword}
                          onChange={(e) => setTPassword(e.target.value)}
                          placeholder="teacherPass"
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-orange-605 text-white hover:bg-orange-700 rounded-xl text-xs font-black transition text-center mt-3"
                    >
                      {isAr ? 'تأكيد إنشاء حساب المدرس وتشفيره ⚡' : 'Confirm & Hash Educator Account ⚡'}
                    </button>
                  </form>
                </div>

                {/* 2. Teachers Directory */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Password resets helper inline modal */}
                  {editingPhone && (
                    <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 relative space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold flex items-center gap-1">
                          <Key className="h-4 w-4 text-orange-650" />
                          <span>{isAr ? `تعديل شفرة المرور للحساب: ${editingPhone}` : `Reset credentials for: ${editingPhone}`}</span>
                        </h4>
                        <button onClick={() => setEditingPhone('')} className="text-xs hover:text-rose-500 font-bold">
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                      <form onSubmit={handleResetPassword} className="flex gap-2">
                        <input 
                          type="text"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={isAr ? 'اكتب الرمز السري الجديد والآمن...' : 'New strong pass phrase'}
                          className="flex-1 bg-white text-xs px-3 py-2 rounded-xl dark:bg-neutral-900 border"
                        />
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black transition">
                          {isAr ? 'تحديث وتشفير' : 'Update'}
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-400">
                          <tr>
                            <th className="p-4">{isAr ? 'المدرس' : 'Teacher name'}</th>
                            <th className="p-4">{isAr ? 'التخصص الرئيسي' : 'Academic specialty'}</th>
                            <th className="p-4">{isAr ? 'الموقع' : 'Region'}</th>
                            <th className="p-4">{isAr ? 'الهاتف الفعال' : 'Phone'}</th>
                            <th className="p-4 text-left">{isAr ? 'التحكم الفني' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-neutral-805 dark:text-neutral-200 font-semibold">
                          {teachersRoster.map((teacher) => (
                            <tr key={teacher.phone} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">👨‍🏫</span>
                                  <div>
                                    <p className="font-extrabold text-neutral-900 dark:text-white leading-none">{teacher.name}</p>
                                    <span className="text-[9px] text-neutral-400 mt-1 block">
                                      {isAr ? 'صلاحيات مدرس معتمد' : 'Authorised academic level'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-orange-605">{teacher.specialty || (isAr ? 'عام' : 'General')}</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1.5">
                                  <span>{teacher.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}</span>
                                  <span className="text-neutral-400">({teacher.location || (isAr ? 'عام' : 'All')})</span>
                                </span>
                              </td>
                              <td className="p-4 font-mono select-all text-neutral-500">{teacher.phone}</td>
                              <td className="p-4 text-left">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button 
                                    onClick={() => {
                                      setEditingPhone(teacher.phone);
                                      window.scrollTo({ top: 340, behavior: 'smooth' });
                                    }}
                                    className="p-1.5 px-2 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black flex items-center gap-1"
                                    title={isAr ? 'تغيير كلمة المرور' : 'Change password'}
                                  >
                                    <Key className="h-3 w-3" />
                                    <span>{isAr ? 'الرقم السري' : 'Pass'}</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(teacher.phone, 'teacher')}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                                    title={isAr ? 'حذف الحساب' : 'Delete Account'}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 3: إدارة الطلاب (STUDENTS) */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">👨‍🎓</span>
                    <span>{isAr ? 'إدارة وسجلات الطلاب المقيدين' : 'Students Enrollment Hub'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'تابع عمليات تفعيل الطلاب، رموز الأكواد الفريدة ومحاضر الحلقات، واستخدم تحكم الحظر لتعطيل الحوارات.' : 'View student unique sandbox codes, claim ratios, and manage instant account suspensions.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-2xl">
                    🇪🇬 {totalEgyptCount} {isAr ? 'بمصر' : 'Egypt'}
                  </span>
                  <span className="text-xs font-black px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                    🇸🇦 {totalSaudiCount} {isAr ? 'بالسعودية' : 'KSA'}
                  </span>
                </div>
              </div>

              {/* Password resets inline helper */}
              {editingPhone && (
                <div className="p-4 rounded-3xl bg-indigo-50 border-2 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/40 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black flex items-center gap-1">
                      <Key className="h-4 w-4 text-indigo-650" />
                      <span>{isAr ? `تغيير كلمة المرور للطالب: ${editingPhone}` : `Reset credentials for student Phone: ${editingPhone}`}</span>
                    </h4>
                    <button onClick={() => setEditingPhone('')} className="text-xs hover:text-rose-500 font-bold">
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                  <form onSubmit={handleResetPassword} className="flex gap-2 max-w-md">
                    <input 
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isAr ? 'اكتب رمز المرور المسموح الجديد...' : 'Enter new strong password'}
                      className="flex-1 bg-white text-xs px-3 py-2 rounded-xl dark:bg-neutral-900 border text-neutral-900"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black transition">
                      {isAr ? 'تعديل وتشفير' : 'Update'}
                    </button>
                  </form>
                </div>
              )}

              {/* Filtering Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute right-3.5 top-3 h-4 w-4 text-neutral-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={isAr ? 'ابحث بالاسم، بكود الطالب الفريد، الهاتف...' : 'Search student by name, unique code, stage...'}
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-850 dark:text-neutral-100 outline-none"
                  />
                </div>
                <div className="text-xs font-bold text-neutral-400 leading-none">
                  {isAr ? `عدد النتائج المطابقة: ${studentsRoster.length} طالب` : `Showing ${studentsRoster.length} registered students`}
                </div>
              </div>

              {/* Students grid database table */}
              <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-400">
                      <tr>
                        <th className="p-4">{isAr ? 'الطالب وكود التفعيل' : 'Student details'}</th>
                        <th className="p-4">{isAr ? 'الصف والمرحلة الدراسية' : 'Class / Academic Level'}</th>
                        <th className="p-4">{isAr ? 'مستند الدولة والمدينة' : 'Curriculum country / State'}</th>
                        <th className="p-4">{isAr ? 'الهاتف الفعال' : 'Phone'}</th>
                        <th className="p-4">{isAr ? 'حالة الحساب' : 'Blacklist Status'}</th>
                        <th className="p-4 text-left">{isAr ? 'التحكم الفوري' : 'Operations'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-neutral-805 dark:text-neutral-200 font-semibold">
                      {studentsRoster.map((student) => (
                        <tr key={student.phone} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/10 transition-all ${student.isBanned ? 'bg-rose-500/5' : ''}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="p-2 bg-neutral-100 rounded-lg text-lg leading-none shrink-0">
                                {student.gender === 'female' ? '👩‍🎓' : '👨‍🎓'}
                              </span>
                              <div>
                                <p className="font-extrabold text-neutral-900 dark:text-white leading-none">{student.name}</p>
                                {student.studentCode && (
                                  <span className="text-[9px] px-1.5 py-0.5 mt-1 rounded bg-indigo-500/10 text-indigo-650 font-mono tracking-wider inline-block">
                                    🔢 {student.studentCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-500">{student.grade || (isAr ? 'ثانوية عامة' : 'Grade 12')}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-center">
                              <span>{student.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}</span>
                              <span className="text-[10px] text-neutral-400">({student.location || student.grade})</span>
                            </span>
                          </td>
                          <td className="p-4 font-mono select-all text-neutral-500">{student.phone}</td>
                          <td className="p-4">
                            {student.isBanned ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200 select-none">
                                {isAr ? '🚫 محظور فوراً' : '🚫 Blacklisted'}
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-750 border border-emerald-100 select-none">
                                {isAr ? '✓ نشط ومرخص' : '✓ Live & Auth'}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle ban */}
                              <button
                                onClick={() => handleToggleBanUser(student.phone)}
                                className={`p-1 px-1.5 rounded-lg text-[10px] font-black flex items-center gap-0.5 transition-all
                                  ${student.isBanned 
                                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                                  }
                                `}
                                title={student.isBanned ? (isAr ? 'إلغاء الحظر' : 'Unban account') : (isAr ? 'حظر الحساب' : 'Ban account')}
                              >
                                {student.isBanned ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                <span>{student.isBanned ? (isAr ? 'تنشيط' : 'Activate') : (isAr ? 'حظر' : 'Ban')}</span>
                              </button>

                              <button 
                                onClick={() => {
                                  setEditingPhone(student.phone);
                                  window.scrollTo({ top: 120, behavior: 'smooth' });
                                }}
                                className="p-1.5 bg-indigo-500/10 text-indigo-650 rounded-lg text-xs"
                                title={isAr ? 'تغيير شفرة المرور' : 'Reset password'}
                              >
                                <Key className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(student.phone, 'student')}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                                title={isAr ? 'حذف من المنصة' : 'Unregister student'}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: إدارة الكورسات (COURSES) */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-605 rounded-lg">📚</span>
                    <span>{isAr ? 'إدارة المناهج ومقررات الكورسات' : 'Platform Course Curriculums'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'مستودع الكورسات النشطة على المنصة، راقب الأسعار المقررة، وعدل معدل الظهور لجميع الطلاب فورياً.' : 'Oversee running academy chapters, alter price structures, and manage global student view rates.'}
                  </p>
                </div>
              </div>

              {/* Price Modifier Form Simulator */}
              {editingCourseId && (
                <div className="p-4 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black">{isAr ? 'تحديث السعر وقيمة الاشتراك للكورس المقابل:' : 'Edit subscriber price for targeted course:'}</h4>
                    <button onClick={() => setEditingCourseId(null)} className="text-xs text-rose-500 font-bold">{isAr ? 'إلغاء' : 'Cancel'}</button>
                  </div>
                  <div className="flex gap-2 max-w-sm">
                    <input 
                      type="number"
                      required
                      value={editingPriceVal}
                      onChange={(e) => setEditingPriceVal(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-white border text-xs px-3 py-2 rounded-xl text-neutral-900 outline-none"
                    />
                    <button 
                      onClick={() => handleUpdateCoursePrice(editingCourseId, editingPriceVal)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black transition"
                    >
                      {isAr ? 'تأكيد وحفظ السعر' : 'Update Pricing'}
                    </button>
                  </div>
                </div>
              )}

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const valPrice = Math.floor(course.price * basePriceMultiplier);
                  const isHidden = course.isVisible === false;
                  return (
                    <div 
                      key={course.id}
                      className={`rounded-3xl border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-850 overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-200
                        ${isHidden ? 'opacity-55' : ''}
                      `}
                    >
                      {/* Image header placeholder */}
                      <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-150 flex items-center justify-between">
                        <span className="text-[10px] font-black px-2 py-1 bg-indigo-505/15 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          {course.category}
                        </span>
                        <span className="text-[10px] font-black">
                          {course.country === 'EG' ? '🇪🇬 مصر' : course.country === 'SA' ? '🇸🇦 السعودية' : '🌐 المشترك'}
                        </span>
                      </div>

                      <div className="p-5 flex-1 space-y-3">
                        <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white leading-snug">{course.title}</h4>
                        <p className="text-[11px] text-neutral-450 font-medium">
                          {isAr ? 'المدرس المسؤول' : 'Assigned Tutor'}: <span className="font-extrabold text-neutral-700 dark:text-neutral-300">{course.teacher}</span>
                        </p>

                        <div className="space-y-1 text-[11px] text-neutral-400 font-semibold pt-1">
                          <p>🏫 {isAr ? 'المستوى الدراسي' : 'Stage'}: {course.level}</p>
                          <p>🎥 {isAr ? 'عدد الدروس' : 'Lessons count'}: {course.lessons} {isAr ? 'محاضرة' : 'videos'}</p>
                          <p>⏱️ {isAr ? 'المدة الإجمالية' : 'Total watch time'}: {course.duration}</p>
                        </div>

                        {/* Pricing overview with multiplier impact check */}
                        <div className="pt-2 flex items-center justify-between border-t border-neutral-100 mt-2">
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'سعر الكارت الأساسي' : 'Base fee'}</span>
                            <span className="text-xs font-black line-through text-neutral-400 font-mono">
                              {course.price} {course.country === 'SA' ? (isAr ? 'ريال' : 'SAR') : (isAr ? 'جنيه' : 'EGP')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-indigo-600 font-black block">
                              {isAr ? 'السعر النهائي للطلاب' : 'Final price (+Multiplier)'}
                            </span>
                            <span className="text-sm font-black text-indigo-650 font-mono">
                              {valPrice} {course.country === 'SA' ? (isAr ? 'ريال' : 'SAR') : (isAr ? 'جنيه' : 'EGP')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Administrative control tools footer */}
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-150 flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCourseId(course.id);
                            setEditingPriceVal(course.price);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="flex-1 py-1.5 px-3 bg-white dark:bg-neutral-800 border hover:bg-neutral-100 rounded-xl text-[10px] font-black tracking-tight"
                        >
                          💵 {isAr ? 'تعديل السعر' : 'Alter Fee'}
                        </button>

                        <button
                          onClick={() => handleToggleCourseVisibility(course.id)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all duration-200
                            ${isHidden 
                              ? 'bg-rose-500/10 text-rose-600 border border-rose-200' 
                              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                            }
                          `}
                        >
                          {isHidden ? (isAr ? '👁️ مخفي عن الطلاب' : '👁️ Hidden') : (isAr ? '👁️ مرئي بالمنصة' : '👁️ Visible')}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: إدارة الصفوف والمناهج (GRADES) */}
          {activeTab === 'grades' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-505/10 text-indigo-600 rounded-lg">🏫</span>
                    <span>{isAr ? 'إدارة الصفوف والمناهج والمسارات الأكاديمية' : 'Manage Stages & Curriculum Streams'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'قم بإضافة مسارات علمية أو عملية وتسمية الصفوف الدراسية المعتمدة للمنصة لتستعملها المدرسون والموجّهون.' : 'Create core academic years and assign specific streams to filter classes accordingly.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Academic years listing config */}
                <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-6 rounded-3xl space-y-5">
                  <h4 className="text-xs font-black border-b pb-3 block">📚 {isAr ? 'إضافة صف دراسي جديد' : 'Enroll Academic Level'}</h4>
                  
                  <form onSubmit={handleAddGrade} className="space-y-3">
                    <input 
                      type="text"
                      required
                      value={newGradeInput}
                      onChange={(e) => setNewGradeInput(e.target.value)}
                      placeholder={isAr ? 'مثال: الصف الثالث الإعدادي اللغات' : 'e.g. Grade 11 Language'}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500"
                    />
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-black transition">
                      {isAr ? 'تأكيد وإضافة المسار الدراسي' : 'Create Class Category'}
                    </button>
                  </form>
                </div>

                {/* Listing of classes with student count summaries */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-black flex items-center gap-2">
                    <span>🗂️</span>
                    <span>{isAr ? 'مسارات الصفوف والمرحلة الدراسية المقررة حالياً' : 'Currently setup school curricula pathways'}</span>
                  </h4>

                  <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden divide-y">
                    {customGrades.map((grade) => {
                      // Count dynamic students currently flagged to this level
                      const studentsInLevel = users.filter(usr => usr.role === 'student' && usr.grade === grade).length;
                      return (
                        <div key={grade} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/20 text-xs font-semibold">
                          <div className="text-right">
                            <p className="font-extrabold text-neutral-900 dark:text-white">{grade}</p>
                            <span className="text-[10px] text-neutral-400 font-bold mt-1 inline-block">
                              👤 {studentsInLevel} {isAr ? 'طلاب مسجلين حالياً' : 'active pupils enrolled'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveGrade(grade)}
                            className="p-1 px-2.5 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[10px] font-black rounded-lg transition"
                          >
                            {isAr ? 'حذف المسار' : 'De-list'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 6: إدارة الأكواد وكروت الشحن (CODES) */}
          {activeTab === 'codes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-505/10 text-indigo-600 rounded-lg">💳</span>
                    <span>{isAr ? 'إدارة الأكواد وكروت الشحن التعليمية' : 'Platform Recharge Voucher Center'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'أنشئ كروت شحن سند مسبقة الدفع بقيمة مخصصة، يستعملها الطلاب لشحن محفظتهم والاشتراك بالكورسات.' : 'Issue customized claim vouchers with numeric balances, allowing students to claim course access instantly.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Generator widget */}
                <div className="bg-white dark:bg-neutral-850 border border-neutral-205 dark:border-neutral-750 p-6 rounded-3xl space-y-5">
                  <h4 className="text-xs font-black pb-3 border-b flex items-center gap-1.5">
                    <PlusCircle className="h-4.5 w-4.5 text-orange-606" />
                    <span>{isAr ? 'توليد وإصدار كارت شحن جديد' : 'Generate claimed card'}</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'بادئة الكود (Prefix)' : 'Voucher Code Prefix'}</label>
                      <input 
                        type="text"
                        required
                        value={customVoucherPrefix}
                        onChange={(e) => setCustomVoucherPrefix(e.target.value)}
                        placeholder="SANAD"
                        maxLength={8}
                        className="w-full text-xs font-mono tracking-widest uppercase font-black py-2.5 px-3 rounded-xl border text-neutral-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'قيمة الرصيد بالكارت' : 'Card claim value'}</label>
                      <select
                        value={customVoucherValue}
                        onChange={(e) => setCustomVoucherValue(parseInt(e.target.value) || 100)}
                        className="w-full text-xs font-black py-2.5 px-3 rounded-xl border text-neutral-950"
                      >
                        <option value="50">50 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                        <option value="100">100 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                        <option value="150">150 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                        <option value="200">200 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                        <option value="250">250 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                        <option value="500">500 {isAr ? 'شحنة رصيد' : 'Credits'}</option>
                      </select>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border text-[10px] font-semibold text-neutral-450">
                      💡 {isAr 
                        ? 'توليد عشوائي آمن من 5 أحرف فريدة مضافة للبادئة لمنع التخمين.' 
                        : 'Suffixes cryptographically randomized to prevent concurrent sandbox claiming.'
                      }
                    </div>

                    <button
                      onClick={handleGenerateVoucher}
                      className="w-full py-2.5 bg-orange-605 text-white hover:bg-orange-700 text-xs font-black rounded-xl transition shadow-xs"
                    >
                      {isAr ? 'توليد الكود الآن ⚡' : 'Issue Prepaid Code ⚡'}
                    </button>
                  </div>
                </div>

                {/* Vouchers lists */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-black flex items-center justify-between">
                    <span>💳 {isAr ? 'أكواد ومستندات كروت الشحن الصادرة' : 'Issued claiming codes registry'}</span>
                    <span className="text-[10px] font-bold text-neutral-400">({vouchers.length} codes)</span>
                  </h4>

                  <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-400">
                          <tr>
                            <th className="p-4">{isAr ? 'الكود الرمزي' : 'Claim Voucher Code'}</th>
                            <th className="p-4">{isAr ? 'الرصيد' : 'Credit value'}</th>
                            <th className="p-4">{isAr ? 'طريقة وحالة الاستخدام' : 'Status / redeemer'}</th>
                            <th className="p-4 text-left">{isAr ? 'الإجراءات' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-neutral-805 dark:text-neutral-200 font-semibold select-all">
                          {vouchers.map((v) => (
                            <tr key={v.code} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                              <td className="p-4 font-mono font-black text-indigo-650 tracking-wider text-sm select-all">
                                {v.code}
                              </td>
                              <td className="p-4 font-black text-neutral-900 dark:text-white font-mono">{v.amount} credits</td>
                              <td className="p-4">
                                {v.isUsed ? (
                                  <div className="text-right text-[10px]">
                                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-705 border border-rose-100 font-black inline-block">
                                      {isAr ? '🚫 مستخدم مسبقاً' : '🚫 Redeemed'}
                                    </span>
                                    <p className="text-[9px] text-neutral-400 mt-1 font-bold">
                                      {isAr ? 'المستخدم' : 'Claimed user'}: <span className="font-mono">{v.usedBy}</span>
                                    </p>
                                  </div>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-705 border border-emerald-100 font-black inline-block text-[10px]">
                                    {isAr ? '💡 متاح للشحن' : '💡 Unclaimed / Active'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-left">
                                <button
                                  onClick={() => handleDeleteVoucher(v.code)}
                                  className="p-1 px-2 hover:bg-rose-50 rounded-lg text-rose-500 transition"
                                  title={isAr ? 'تعطيل الكود' : 'Invalidate code'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 7: الإحصائيات العامة (STATS) */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-505/10 text-indigo-605 rounded-lg font-black">📊</span>
                    <span>{isAr ? 'مركز الإحصائيات والأعمال البيعية سند التعليمية' : 'Consolidated Performance Analytics'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'تحليلات بيانية تفاعلية دقيقة تظهر خطوط نمو مبيعات الاشتراكات وعمليات تسجيل الطلاب.' : 'Visual curves rendering students acquisition data, course claimed values, and active audits.'}
                  </p>
                </div>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Custom Growth Chart (Tailwind-based) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-right space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="text-xs font-black flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-605" />
                      <span>{isAr ? 'حركة المبيعات وشحن البطاقات والمحافظ شهرياً' : 'Monthly Sales & Wallet Claims'}</span>
                    </h4>
                    <span className="text-[10px] font-black text-orange-655 bg-orange-50 px-2 py-0.5 rounded-md">
                      {isAr ? 'محققة بالكامل' : 'Complete list'}
                    </span>
                  </div>

                  <div className="relative pt-4 space-y-4">
                    {[
                      { month: isAr ? 'يناير' : 'January', amount: 1800, percent: 15 },
                      { month: isAr ? 'فبراير' : 'February', amount: 4400, percent: 35 },
                      { month: isAr ? 'مارس' : 'March', amount: 9500, percent: 55 },
                      { month: isAr ? 'أبريل' : 'April', amount: 15200, percent: 75 },
                      { month: isAr ? 'مايو' : 'May', amount: 21900, percent: 88 },
                      { month: isAr ? 'يونيو' : 'June', amount: 28400, percent: 100 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <div className="flex items-center justify-between">
                          <span>{item.month}</span>
                          <span className="font-mono text-neutral-500 dark:text-neutral-400">
                            {item.amount} {isAr ? 'جنيه/ريال' : 'Credits'} ({item.percent}%)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Students acquisition Chart (Tailwind-based) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-right space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="text-xs font-black flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-indigo-606" />
                      <span>{isAr ? 'معدلات نمو وتسجيل الطلاب والمدرسين المقيدين' : 'Teacher / Student Acquisition Tally'}</span>
                    </h4>
                    <span className="text-[10px] font-black text-indigo-655 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {isAr ? 'نشاط التدريس' : 'Active stats'}
                    </span>
                  </div>

                  <div className="relative pt-4 space-y-4">
                    {[
                      { month: isAr ? 'الربع الأول الدراسي' : 'Q1 Academic Intake', students: 120, teachers: 4, sPercent: 20, tPercent: 30 },
                      { month: isAr ? 'الربع الثاني الدراسي' : 'Q2 Academic Intake', students: 350, teachers: 7, sPercent: 50, tPercent: 60 },
                      { month: isAr ? 'الربع الثالث الحالي' : 'Active Intake Period', students: totalStudentsCount || 720, teachers: totalTeachersCount || 12, sPercent: 100, tPercent: 100 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2 border-b last:border-0 pb-3 last:pb-0 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <p className="font-black text-neutral-800 dark:text-neutral-300">{item.month}</p>
                        
                        {/* Student bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                            <span>{isAr ? 'الطلاب المقيدين' : 'Students enrolled'}</span>
                            <span className="font-mono">{item.students} {isAr ? 'طالباً' : 'students'}</span>
                          </div>
                          <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${item.sPercent}%` }}
                              className="h-full bg-indigo-550 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Teacher bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                            <span>{isAr ? 'المدرسين المعتمدين' : 'Tutors Licensed'}</span>
                            <span className="font-mono">{item.teachers} {isAr ? 'مدرساً' : 'teachers'}</span>
                          </div>
                          <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${item.tPercent}%` }}
                              className="h-full bg-emerald-555 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Extra analytic summaries */}
              <div className="p-5 bg-indigo-505/10 rounded-3xl border border-indigo-150 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-right">
                  <h4 className="text-xs font-black text-indigo-900 dark:text-white">🔐 {isAr ? 'حسابات حماية رصد IP للجلسات' : 'Sessions validation tracking active'}</h4>
                  <p className="text-[11px] text-neutral-450 font-semibold">
                    {isAr 
                      ? 'ترصد لوحة الهيكل الأمني كافة الدخول concurrent. حالياً نسبة فشل تسجيل الدخول مستقرة وضمن الحدود الطبيعية للمنصة.' 
                      : 'Concurrent sessions checkout statistics are safe and running inside standard parameters.'
                    }
                  </p>
                </div>
                <div className="text-xs font-black px-4 py-2 bg-indigo-550 text-white rounded-xl shadow-xs shrink-0 select-none">
                  {isAr ? 'تقرير الأمان والتحقق: ممتاز 💯' : 'Security Audit status: Healthy 💯'}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: الإشعارات وفضاء بث التنبيهات (NOTIFICATIONS) */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-rose-500/10 text-rose-600 rounded-lg font-black">📢</span>
                    <span>{isAr ? 'إجراء وبث التنبيهات العامة الشاملة للطلاب' : 'Universal Notice Broadcast Center'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'صغ الإعلان العام العاجل لتوجيهه لجميع حسابات الطلاب والمدرسين المشتركين فوراً بالقمة.' : 'Broadcast urgent messages across all student profiles platform-wide.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Notice Creator form */}
                <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black block border-b pb-3">{isAr ? 'صياغة بث الإشعار الجديد' : 'Draft New Broadcast Alert'}</h4>

                  <form onSubmit={handleCreateNotification} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'العنوان / نص التنبيه العاجل' : 'Alert text / Announcement text'}</label>
                      <textarea
                        required
                        value={notifyTitle}
                        onChange={(e) => setNotifyTitle(e.target.value)}
                        placeholder={isAr ? 'اكتب الرسالة العاجلة لجميع الطلاب هنا...' : 'Important: server maintenance upcoming this Wednesday.'}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-rose-500 min-h-24"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400">{isAr ? 'رابط الإجراء السريع (اختياري - مثلاً يوتيوب)' : 'Target redirect URL (Optional)'}</label>
                      <input 
                        type="url"
                        value={notifyLink}
                        onChange={(e) => setNotifyLink(e.target.value)}
                        placeholder="https://youtube.com/live-stream"
                        className="w-full text-xs font-mono py-2.1 px-3 rounded-xl border border-neutral-200 bg-neutral-50 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border">
                      <span className="text-[11px] font-bold text-neutral-450">{isAr ? 'ظهور دائم بالمنصة بدون وقت انتهاء' : 'Permanent announcement status'}</span>
                      <button 
                        type="button"
                        onClick={() => setNotifyPermanent(!notifyPermanent)}
                        className={`text-xs font-black px-3 py-1 bg-white rounded-xl border ${notifyPermanent ? 'text-indigo-600 border-indigo-200 shadow-sm' : ''}`}
                      >
                        {notifyPermanent ? (isAr ? 'دائم ✓' : 'Permanent ✓') : (isAr ? 'عادي' : 'Temporary')}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition shadow-xs"
                    >
                      {isAr ? 'تفعيل ونشر الإعلان فوراً بجميع المقررات ⚡' : 'Publish notice universal alert now ⚡'}
                    </button>
                  </form>
                </div>

                {/* Current Active notice list with student display preview */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black flex items-center gap-1.5">{isAr ? 'الإعلان الفعال حالياً بجميع المقررات' : 'Currently active platform notice'}</h4>
                  
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-5 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-250 dark:border-neutral-750 text-right space-y-4 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="p-1 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-black">📢 Broadcast active</span>
                        <button 
                          onClick={() => handleRemoveNotification(notif.id)}
                          className="p-1 px-2.5 hover:bg-rose-50 text-rose-500 text-[10px] font-black rounded-lg transition"
                        >
                          {isAr ? 'مسح التنبيه' : 'Deactivate notice'}
                        </button>
                      </div>

                      <div className="space-y-1.5 select-all">
                        <p className="text-xs font-black text-neutral-900 dark:text-white leading-relaxed">{notif.title}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">Redirect direct action: <a href={notif.link} target="_blank" rel="noreferrer" className="text-indigo-605 underline">{notif.link}</a></p>
                      </div>

                      {/* Mock Student Frame preview container */}
                      <div className="p-3.5 bg-neutral-900 text-white rounded-2xl space-y-1.5 select-none">
                        <p className="text-[9px] text-neutral-400 font-bold">👀 {isAr ? 'معاينة كيفية ظهور الإعلان لشاشات الطلاب:' : 'Preview in student layout header:'}</p>
                        <div className="p-2 px-3 rounded-xl bg-orange-600 text-white font-extrabold text-[10px] flex items-center justify-between shadow-md">
                          <span className="truncate">{notif.title}</span>
                          <span className="p-1 bg-white/25 rounded-md text-[8px] animate-pulse">Live notice</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="p-10 text-center rounded-3xl bg-neutral-100 border border-dashed border-neutral-300 text-neutral-450 text-xs">
                      {isAr ? 'لا يوجد أي إعلان نشط حالياً لطلاب سند.' : 'Notice board is completely empty.'}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* SECTION 9: الإعدادات وعقود التحكم (SETTINGS) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-505/10 text-indigo-605 rounded-lg">⚙️</span>
                    <span>{isAr ? 'تحكم وإعدادات خيارات الصيانة الفنية' : 'System-Wide Admin Configurations'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {isAr ? 'تحكم بالترقيات المباشرة، قم بقفل وفتح بوابات التسجيل الجديدة للطلاب، أو ارفع معامل الضرب لأسعار المقررات.' : 'Tweak platform accessibility levels, change price coefficients, adjust dark theme, or log out securely.'}
                  </p>
                </div>
              </div>

              {/* Setting togglers */}
              <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Platform Accessibility Switches */}
                <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-6">
                  <h4 className="text-xs font-black pb-3 border-b">{isAr ? 'بوابات الوصول والصيانة العامة' : 'Core service properties'}</h4>

                  <div className="space-y-4">
                    {/* Maintenance toggle */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200">
                      <div>
                        <h4 className="text-xs font-black">{isAr ? 'وضع الصيانة والترقية' : 'Maintenance update'}</h4>
                        <p className="text-[9px] text-neutral-400 mt-0.5">{isAr ? 'تأمين السيرفر ومنع مشاهدة الدروس مؤقتاً.' : 'Hold student lectures to push code.'}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setMaintenance(!maintenance);
                          showToastSuccess(isAr ? '🔧 تم تعديل حالة وضع الصيانة والترقية للمنصة!' : '🔧 Block/Maintenance updated successfully.');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 duration-200
                          ${maintenance ? 'bg-rose-600 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}
                        `}
                      >
                        {maintenance ? (isAr ? 'نشط 🔴' : 'Active 🔴') : (isAr ? 'معطل' : 'Disabled')}
                      </button>
                    </div>

                    {/* Registrations lock */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200">
                      <div>
                        <h4 className="text-xs font-black">{isAr ? 'إغلاق التسجيل الخارجي' : 'Lock student registration'}</h4>
                        <p className="text-[9px] text-neutral-400 mt-0.5">{isAr ? 'منع التسجيل الخارجي لحين فتح دفعات جديدة.' : 'Stop signup page inputs.'}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setLockRegistration(!lockRegistration);
                          showToastSuccess(isAr ? '🔒 تم تحديث حالة بوابة تراخيص تسجيل الطلاب الجدد!' : '🔒 Signup restrictions updated.');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 duration-200
                          ${lockRegistration ? 'bg-orange-605 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}
                        `}
                      >
                        {lockRegistration ? (isAr ? 'مغلق 🔒' : 'Locked 🔒') : (isAr ? 'مفتوح' : 'Open')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Platform price modifiers */}
                <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-6">
                  <h4 className="text-xs font-black pb-3 border-b">{isAr ? 'معلم المضاعف والمسار المالي' : 'Financial pricing modifiers'}</h4>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold">{isAr ? 'مضاعف الكورسات العام:' : 'Course multiplier ratio:'}</span>
                        <span className="font-mono font-black text-indigo-650">x{basePriceMultiplier}</span>
                      </div>
                      <input 
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.5"
                        value={basePriceMultiplier}
                        onChange={(e) => {
                          const multiplier = parseFloat(e.target.value);
                          setBasePriceMultiplier(multiplier);
                        }}
                        className="w-full accent-orange-605 cursor-pointer mt-1"
                      />
                      <div className="flex justify-between text-[9px] text-neutral-400 font-black pt-1">
                        <span>تخفيض x0.5</span>
                        <span>عادي x1.0</span>
                        <span>أقصى x2.5</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-505/10 text-indigo-600 rounded-2xl text-[10px] font-medium leading-relaxed">
                      💡 {isAr 
                        ? 'يضرب هذا المعامل تلقائياً بأسعار جميع الكورسات والموجّهين المعروضة على المنصة لتنفيذ حملات الخصومات السريعة.' 
                        : 'Price multiplier multiplies core fees with immediate impact visible on student checkout tabs.'
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
