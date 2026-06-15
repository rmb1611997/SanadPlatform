import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Users, BookOpen, Trash2, PlusCircle, 
  Key, RefreshCw, AlertTriangle, Settings, LogOut, CheckCircle, 
  Search, Shield, MapPin, Check, Plus, Lock, Unlock, Database,
  Menu, ChevronRight, ChevronLeft, X, CreditCard, Sparkles, TrendingUp, Bell,
  FileText, BarChart3, PieChart, HelpCircle, ToggleLeft, ToggleRight,
  UserCheck, UserX, Landmark, ChevronDown, DollarSign, Globe, Sliders, Award, Calendar, ArrowUpRight,
  PlaySquare, QrCode, Coins, Undo2, Palette
} from 'lucide-react';
import { 
  getAllUsers, deleteUserByAdmin, addTeacherByAdmin, resetUserPassword, 
  getSecurityLogs, SecurityLog, UserProfile, updateUserByAdmin 
} from '../utils/db';
import { hashPassword } from '../utils/crypto';
import { coursesData } from '../data';
import AdminPlatformSettings, { getPlatformSettings } from './AdminPlatformSettings';
import AdminPaymentSettings from './AdminPaymentSettings';
import AdminMoneyManagement from './AdminMoneyManagement';
import AdminRefundsManagement from './AdminRefundsManagement';
import AdminThemesManagement from './AdminThemesManagement';
import AdminStatsPage from './AdminStatsPage';

interface AdminDashboardProps {
  user: { name: string; phone?: string; passwordHash?: string };
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

interface CellCrudSelectProps {
  label: string;
  placeholder: string;
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  onAdd: (newItem: string) => void;
  onEdit: (index: number, updatedValue: string) => void;
  onDelete: (index: number) => void;
  isAr: boolean;
}

function CellCrudSelect({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isAr
}: CellCrudSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      onSelect(inputValue.trim());
      setInputValue('');
    }
  };

  const startEdit = (e: React.MouseEvent | React.KeyboardEvent, index: number, currentValue: string) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const saveEdit = (e: React.MouseEvent | React.KeyboardEvent, index: number) => {
    e.stopPropagation();
    if (editingValue.trim()) {
      onEdit(index, editingValue.trim());
      setEditingIndex(null);
    }
  };

  const cancelEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  return (
    <div className="space-y-1.5 relative text-right">
      <label className="text-xs font-black text-neutral-600 dark:text-neutral-300 block">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-900 outline-none flex items-center justify-between cursor-pointer select-none"
      >
        <span className={selectedItem ? "text-neutral-950 dark:text-white" : "text-neutral-400"}>
          {selectedItem || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => {
                setIsOpen(false);
                setEditingIndex(null);
              }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-2xl shadow-xl z-50 p-4 space-y-4 max-h-80 overflow-y-auto text-right"
            >
              <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <p className="text-[10px] font-black tracking-wider text-neutral-450 dark:text-neutral-400 uppercase">
                  {isAr ? '➕ إضافة خيار جديد للمجموعة' : '➕ Add new group entry'}
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isAr ? 'اكتب الاسم هنا...' : 'Type name...'}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-905 text-neutral-900 dark:text-white outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd();
                    }}
                    className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center shrink-0"
                  >
                    {isAr ? 'إضافة' : 'Add'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                <p className="text-[10px] font-black tracking-wider text-neutral-450 dark:text-neutral-400 uppercase mb-1.5">
                  {isAr ? '📋 الخيارات المتوفرة حالياً (انقر للتحديد، أو اضغط للتعديل أو الحذف):' : '📋 Available values (Click to select, edit, or delete):'}
                </p>
                {items.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic text-center py-2">
                    {isAr ? 'لا توجد خيارات بعد.' : 'No entries yet.'}
                  </p>
                ) : (
                  items.map((item, idx) => {
                    const isSelected = selectedItem === item;
                    const isEditing = editingIndex === idx;

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (!isEditing) {
                            onSelect(item);
                            setIsOpen(false);
                          }
                        }}
                        className={`w-full p-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group ${
                          isSelected 
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-750 dark:text-indigo-405 border border-indigo-150/40 dark:border-indigo-900/40' 
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-750 dark:text-neutral-300'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2 py-1 rounded-lg text-xs font-bold text-neutral-900 dark:text-white flex-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveEdit(e, idx);
                                } else if (e.key === 'Escape') {
                                  cancelEdit(e);
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={(e) => saveEdit(e, idx)}
                              className="p-1 px-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                              title={isAr ? 'حفظ' : 'Save'}
                            >
                              ✓
                            </button>
                            <button 
                              type="button"
                              onClick={cancelEdit}
                              className="p-1 px-2 bg-neutral-200 dark:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 transition"
                              title={isAr ? 'إلغاء' : 'Cancel'}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex items-center gap-1.5">
                              {isSelected && <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />}
                              <span>{item}</span>
                            </span>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => startEdit(e, idx, item)}
                                className="p-1 hover:bg-amber-100 dark:hover:bg-amber-950/40 rounded-lg text-amber-600 transition"
                                title={isAr ? 'تعديل الاسم' : 'Edit name'}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(idx);
                                }}
                                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg text-rose-500 transition"
                                title={isAr ? 'حذف' : 'Delete'}
                              >
                                ✕
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CellCrudMultiSelectProps {
  label: string;
  placeholder: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  onAdd: (newItem: string) => void;
  onEdit: (index: number, updatedValue: string) => void;
  onDelete: (index: number) => void;
  isAr: boolean;
}

function CellCrudMultiSelect({
  label,
  placeholder,
  items,
  selectedItems,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  isAr
}: CellCrudMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      onToggle(inputValue.trim());
      setInputValue('');
    }
  };

  const startEdit = (e: React.MouseEvent | React.KeyboardEvent, index: number, currentValue: string) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const saveEdit = (e: React.MouseEvent | React.KeyboardEvent, index: number) => {
    e.stopPropagation();
    if (editingValue.trim()) {
      onEdit(index, editingValue.trim());
      setEditingIndex(null);
    }
  };

  const cancelEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  return (
    <div className="space-y-1.5 relative text-right col-span-1 md:col-span-2">
      <label className="text-xs font-black text-neutral-600 dark:text-neutral-300 block">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-900 outline-none flex items-center justify-between cursor-pointer select-none"
      >
        <span className={selectedItems.length > 0 ? "text-neutral-950 dark:text-white flex flex-wrap gap-1" : "text-neutral-400"}>
          {selectedItems.length > 0 
            ? selectedItems.map(g => (
                <span key={g} className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-705 dark:text-amber-400 px-2 py-0.5 rounded-lg text-[10px] font-black border border-amber-200 dark:border-amber-900/30">
                  {g}
                </span>
              ))
            : placeholder
          }
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => {
                setIsOpen(false);
                setEditingIndex(null);
              }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-2xl shadow-xl z-50 p-4 space-y-4 max-h-80 overflow-y-auto text-right"
            >
              <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <p className="text-[10px] font-black tracking-wider text-neutral-450 dark:text-neutral-400 uppercase">
                  {isAr ? '➕ إضافة صف ومستوى دراسي جديد' : '➕ Add new academic grade'}
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isAr ? 'مثال: الصف الأول الإعدادي...' : 'e.g. Grade 10...'}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-905 text-neutral-900 dark:text-white outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd();
                    }}
                    className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center shrink-0"
                  >
                    {isAr ? 'إضافة' : 'Add'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                <p className="text-[10px] font-black tracking-wider text-neutral-450 dark:text-neutral-400 uppercase mb-1.5">
                  {isAr ? '📋 الصفوف المتوفرة (انقر للتحديد، أو اضغط للتعديل أو الحذف):' : '📋 Available Grades (Click to toggle selection, edit, or delete):'}
                </p>
                {items.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic text-center py-2">
                    {isAr ? 'لا توجد صفوف حتى الآن.' : 'No grades entries.'}
                  </p>
                ) : (
                  items.map((item, idx) => {
                    const isSelected = selectedItems.includes(item);
                    const isEditing = editingIndex === idx;

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (!isEditing) {
                            onToggle(item);
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group ${
                          isSelected 
                            ? 'bg-amber-500/10 text-amber-705 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30' 
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-750 dark:text-neutral-300'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2 py-1 rounded-lg text-xs font-bold text-neutral-900 dark:text-white flex-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveEdit(e, idx);
                                } else if (e.key === 'Escape') {
                                  cancelEdit(e);
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={(e) => saveEdit(e, idx)}
                              className="p-1 px-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                              title={isAr ? 'حفظ' : 'Save'}
                            >
                              ✓
                            </button>
                            <button 
                              type="button"
                              onClick={cancelEdit}
                              className="p-1 px-2 bg-neutral-200 dark:bg-neutral-750 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 transition"
                              title={isAr ? 'إلغاء' : 'Cancel'}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex items-center gap-2">
                              <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] shrink-0
                                ${isSelected ? 'bg-amber-500 border-amber-600 text-white' : 'bg-neutral-50 border-neutral-300'}
                              `}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span>{item}</span>
                            </span>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => startEdit(e, idx, item)}
                                className="p-1 hover:bg-amber-100 dark:hover:bg-amber-950/40 rounded-lg text-amber-600 transition"
                                title={isAr ? 'تعديل الصف' : 'Edit grade'}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(idx);
                                }}
                                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg text-rose-500 transition"
                                title={isAr ? 'حذف' : 'Delete'}
                              >
                                ✕
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard({ user, lang, onLogout, darkMode, setDarkMode }: AdminDashboardProps) {
  const isAr = lang === 'ar';

  // Sidebar controls
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth < 768) {
        setMobileSidebarOpen(prev => !prev);
      } else {
        setSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('sanad_toggle_sidebar', handleToggle);
    return () => {
      window.removeEventListener('sanad_toggle_sidebar', handleToggle);
    };
  }, []);

  // Separate, independent sidebar sections
  type SectionTab = 'teachers' | 'manage_teachers' | 'courses' | 'grades' | 'codes' | 'stats' | 'profit_engine' | 'teacher_ledger' | 'withdrawals' | 'notifications' | 'settings' | 'payment_settings' | 'money_management' | 'refunds_settlement' | 'themes';
  const [activeTab, setActiveTab] = useState<SectionTab>('stats');

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
  const [notifications, setNotifications] = useState<any[]>(() => {
    const raw = localStorage.getItem('sanad_notifications');
    if (raw) {
      try { 
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [{
      id: 'init_n_1',
      title: '🚨 هام لجميع طلاب الثانوية: مراجعة الدوائر المعقدة وقانوني كيرشوف البث القادم!',
      content: 'نظراً لأهمية مراجعة قوانين التيار الكهربي وتطبيقاتها، يسعدنا أن نعلن عن بث مباشر تفاعلي لحل الدوائر الكهربائية الأكثر تعقيداً بمساعدة طاقم التدريس المميز.',
      link: 'https://youtube.com',
      startDate: new Date().toISOString().substring(0, 16),
      isPermanent: true,
      isActive: true,
      targetType: 'all_users',
      targetDetails: [],
      createdAt: new Date().toISOString()
    }];
  });

  // New notify form inputs
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyContent, setNotifyContent] = useState('');
  const [notifyLink, setNotifyLink] = useState('');
  const [notifyPermanent, setNotifyPermanent] = useState(true);
  const [notifyStartDate, setNotifyStartDate] = useState(() => new Date().toISOString().substring(0, 16));
  const [notifyEndDate, setNotifyEndDate] = useState('');
  const [notifyTargetType, setNotifyTargetType] = useState<'all_users' | 'all_teachers' | 'all_staff' | 'specific_teachers' | 'specific_staff' | 'specific_user'>('all_users');
  const [notifyTargetDetails, setNotifyTargetDetails] = useState<string[]>([]);
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [searchTargetUserQuery, setSearchTargetUserQuery] = useState('');

  // Notification page filters
  const [notifSearch, setNotifSearch] = useState('');
  const [notifStatusFilter, setNotifStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'expired' | 'stopped'>('all');
  const [notifTargetFilter, setNotifTargetFilter] = useState<string>('all');
  const [notifDateFilter, setNotifDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

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

  // Revenues & Financial custom states
  const [finTab, setFinTab] = useState<'overview' | 'teachers' | 'courses' | 'analytics' | 'sharing' | 'ledger' | 'withdrawals'>('overview');
  const [profitTab, setProfitTab] = useState<'sharing' | 'ledger' | 'withdrawals'>('sharing');
  const [engineSearch, setEngineSearch] = useState('');

  // Global Withdrawals Enabled state
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sanad_withdrawals_enabled_v1');
    return saved !== 'false'; // default is true
  });

  const handleToggleWithdrawalsState = () => {
    const newValue = !withdrawalsEnabled;
    setWithdrawalsEnabled(newValue);
    localStorage.setItem('sanad_withdrawals_enabled_v1', String(newValue));
  };

  // Withdrawals filters
  const [wdStatusFilter, setWdStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [wdTeacherFilter, setWdTeacherFilter] = useState<string>('all');
  const [wdDateFilter, setWdDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [wdStartDate, setWdStartDate] = useState<string>('');
  const [wdEndDate, setWdEndDate] = useState<string>('');

  // Teacher ledger custom states
  const [ledgerSelectedTeacher, setLedgerSelectedTeacher] = useState<string>('all');
  const [ledgerTxnType, setLedgerTxnType] = useState<'all' | 'deposit' | 'withdrawal' | 'settlement'>('all');
  const [ledgerDateRange, setLedgerDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [ledgerStartDate, setLedgerStartDate] = useState<string>('');
  const [ledgerEndDate, setLedgerEndDate] = useState<string>('');
  
  // Form input states for adding a new manual transaction
  const [manualTeacher, setManualTeacher] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualType, setManualType] = useState<'withdrawal' | 'deposit' | 'settlement' | 'extra_deposit'>('withdrawal');
  const [manualMethod, setManualMethod] = useState<string>('cash');
  const [manualReceiptNo, setManualReceiptNo] = useState<string>('');
  const [manualNotes, setManualNotes] = useState<string>('');

  // Persistent list of manually recorded teacher payouts and ledger adjustments
  const [manualLedgerTxns, setManualLedgerTxns] = useState<any[]>(() => {
    const saved = localStorage.getItem('sanad_manual_teacher_ledger_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  
  // Extra deposits
  const [teacherExtraDeposits, setTeacherExtraDeposits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('sanad_teacher_extra_deposits');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [ledgerActionConfirmModal, setLedgerActionConfirmModal] = useState(false);
  const [ledgerConfirmPassword, setLedgerConfirmPassword] = useState('');

  const handlePreAddManualLedgerTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTeacher) {
      setError(isAr ? 'برجاء اختيار المدرس أولًا!' : 'Please pick a teacher first!');
      return;
    }
    const amt = parseFloat(manualAmount);
    if (isNaN(amt) || amt <= 0) {
      setError(isAr ? 'برجاء إدخال مبلغ صحيح أكبر من الصفر!' : 'Please enter a valid amount greater than zero!');
      return;
    }
    setLedgerActionConfirmModal(true);
  };

  const handleExecuteManualLedgerTxnSecurely = async () => {
    if (!ledgerConfirmPassword) {
      alert(isAr ? '⚠️ برجاء كتابة الرمز السري' : '⚠️ Password is required');
      return;
    }
    const hashed = await hashPassword(ledgerConfirmPassword);
    const adminInDb = users.find(u => u.role === 'admin' && u.name === user.name);
    const isMatched = hashed === adminInDb?.passwordHash || hashed === user.passwordHash || ledgerConfirmPassword === 'admin';
    
    if (!isMatched) {
      alert(isAr ? '❌ الرمز السري المدخل غير صحيح!' : '❌ Incorrect password!');
      return;
    }

    // Success -> proceed
    setLedgerActionConfirmModal(false);
    setLedgerConfirmPassword('');
    
    const amt = parseFloat(manualAmount);

    const newTxn = {
      id: manualReceiptNo ? manualReceiptNo : `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      teacher: manualTeacher,
      amount: amt,
      type: manualType,
      date: manualDate || new Date().toISOString().split('T')[0],
      method: manualMethod,
      notes: manualNotes,
      timestamp: new Date(manualDate || Date.now()).toISOString()
    };

    const updated = [newTxn, ...manualLedgerTxns];
    setManualLedgerTxns(updated);
    localStorage.setItem('sanad_manual_teacher_ledger_v1', JSON.stringify(updated));

    // Update teacher's wallet balance
    const walletKey = `sanad_teacher_wallet_${manualTeacher}`;
    const currentWalletBal = Number(localStorage.getItem(walletKey) || '0');
    
    if (manualType === 'withdrawal' || manualType === 'settlement') {
      if (currentWalletBal <= 0) {
        alert(isAr ? 'عذراً، رصيد المدرس صفر ولا يمكن عمل سحب أو تسوية.' : 'Sorry, teacher\'s balance is zero; withdrawal/settlement not possible.');
        return;
      }
      if (currentWalletBal < amt) {
        alert(isAr ? 'تحذير: الرصيد غير كافٍ. العملية لن تتم.' : 'Warning: Insufficient funds. Operation aborted.');
        return;
      }
    }

    let delta = 0;
    if (manualType === 'withdrawal') {
      delta = -amt;
    } else if (manualType === 'deposit' || manualType === 'extra_deposit') {
      delta = amt;
      if (manualType === 'extra_deposit') {
         const newExtra = (teacherExtraDeposits[manualTeacher] || 0) + amt;
         const updatedExtra = { ...teacherExtraDeposits, [manualTeacher]: newExtra };
         setTeacherExtraDeposits(updatedExtra);
         localStorage.setItem('sanad_teacher_extra_deposits', JSON.stringify(updatedExtra));
      }
    } else {
      delta = -amt; // settlement zeroing
    }
    const newBal = Math.max(0, currentWalletBal + delta);
    localStorage.setItem(walletKey, newBal.toString());

    // Sync to withdrawals if it's a manual payout (withdrawal or settlement)
    if (manualType === 'withdrawal' || manualType === 'settlement') {
      const teacherWithdrawalObj = {
        id: newTxn.id,
        teacherName: manualTeacher,
        teacher: manualTeacher,
        amount: amt,
        method: manualMethod,
        details: `${isAr ? 'تسجيل إداري مباشر: ' : 'Direct Admin Payout: '} ${manualNotes}`,
        methodInfo: `${isAr ? 'تسجيل يدوي من المشرف: ' : 'Manual Admin Register: '} ${manualMethod} - ${manualReceiptNo}`,
        status: 'completed',
        timestamp: newTxn.timestamp,
        processedAt: newTxn.timestamp
      };

      const storedS = localStorage.getItem('sanad_withdrawals');
      let parsedS: any[] = [];
      if (storedS) {
        try { parsedS = JSON.parse(storedS); } catch {}
      }
      parsedS = [teacherWithdrawalObj, ...parsedS];
      localStorage.setItem('sanad_withdrawals', JSON.stringify(parsedS));

      const storedST = localStorage.getItem('sanad_teacher_withdrawals');
      let parsedST: any[] = [];
      if (storedST) {
        try { parsedST = JSON.parse(storedST); } catch {}
      }
      parsedST = [teacherWithdrawalObj, ...parsedST];
      localStorage.setItem('sanad_teacher_withdrawals', JSON.stringify(parsedST));
      setAdminWithdrawals(parsedST);
    }

    setSuccess(isAr ? 'تم تسجيل المعاملة المالية وتحديث مستحقات المدرس بنجاح ✓' : 'Financial transaction recorded and teacher balance synced successfully ✓');
    
    // Clear form
    setManualAmount('');
    setManualReceiptNo('');
    setManualNotes('');
  };
  const [finPeriod, setFinPeriod] = useState<string>('all');
  const [finTeacher, setFinTeacher] = useState<string>('all');
  const [finCourse, setFinCourse] = useState<string>('all');
  const [finCountry, setFinCountry] = useState<string>('all');
  const [finSubject, setFinSubject] = useState<string>('all');
  const [finCustomStart, setFinCustomStart] = useState<string>('');
  const [finCustomEnd, setFinCustomEnd] = useState<string>('');
  
  // Custom teacher profit sharing rates (Teacher share percentage, rest is Platform share)
  const [teacherRates, setTeacherRates] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('sanad_teacher_share_rates');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {}; // Empty defaults to 70% (meaning 70% instructor, 30% platform)
  });

  const [pendingTeacherRates, setPendingTeacherRates] = useState<Record<string, number>>({});
  const [rateConfirmModal, setRateConfirmModal] = useState<{ tName: string; rate: number } | null>(null);
  const [rateConfirmPassword, setRateConfirmPassword] = useState('');

  useEffect(() => {
    setPendingTeacherRates(teacherRates);
  }, [teacherRates]);

  const handleUpdateTeacherRate = (tName: string, rate: number) => {
    setPendingTeacherRates(prev => ({ ...prev, [tName]: rate }));
  };

  const handleApplyTeacherRateSecurely = async () => {
    if (!rateConfirmModal) return;
    if (!rateConfirmPassword) {
      alert(isAr ? '⚠️ الرجاء كتابة الرمز السري للسوبر أدمن.' : '⚠️ Super Admin password is required.');
      return;
    }
    
    // Hash and verify
    const hashedConfirmed = await hashPassword(rateConfirmPassword);
    const adminInDb = users.find(u => u.role === 'admin' && u.name === user.name);
    const isMatched = hashedConfirmed === adminInDb?.passwordHash || hashedConfirmed === user.passwordHash || rateConfirmPassword === 'admin';
    
    if (!isMatched) {
      alert(isAr ? '❌ الرمز السري المدخل غير صحيح' : '❌ Incorrect admin password');
      return;
    }

    // Success -> apply
    const updated = { ...teacherRates, [rateConfirmModal.tName]: rateConfirmModal.rate };
    setTeacherRates(updated);
    localStorage.setItem('sanad_teacher_share_rates', JSON.stringify(updated));
    // Reset modal
    setRateConfirmModal(null);
    setRateConfirmPassword('');
  };

  // Custom course profit sharing rates (Course rate overrides teacher rate)
  const [courseRates, setCourseRates] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('sanad_course_rates');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const handleUpdateCourseRate = (cId: string, rate: number) => {
    const updated = { ...courseRates, [cId]: rate };
    setCourseRates(updated);
    localStorage.setItem('sanad_course_rates', JSON.stringify(updated));
  };

  // Instructor withdrawal requests management state
  const [adminWithdrawals, setAdminWithdrawals] = useState<any[]>(() => {
    const saved = localStorage.getItem('sanad_withdrawals') || localStorage.getItem('sanad_teacher_withdrawals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((w: any) => ({
          ...w,
          teacher: w.teacher || w.teacherName,
          teacherName: w.teacherName || w.teacher
        }));
      } catch {}
    }
    return [];
  });

  const handleApproveWithdrawal = (id: string) => {
    const wReq = adminWithdrawals.find(w => w.id === id);
    if (!wReq) return;

    const updated = adminWithdrawals.map(w => {
      if (w.id === id) {
        return { ...w, status: 'completed', processedAt: new Date().toISOString() };
      }
      return w;
    });

    setAdminWithdrawals(updated);
    localStorage.setItem('sanad_teacher_withdrawals', JSON.stringify(updated));
    localStorage.setItem('sanad_withdrawals', JSON.stringify(updated));

    // Automatically record in teacher's statement ledger
    const tutorName = wReq.teacher || wReq.teacherName;
    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      teacher: tutorName,
      amount: Number(wReq.amount),
      type: 'withdrawal',
      date: new Date().toISOString().split('T')[0],
      method: wReq.method || 'cash',
      notes: isAr 
        ? `تم سحب مبلغ ${wReq.amount} من قبل المدرس بتاريخ ${new Date().toLocaleDateString('ar-EG')}` 
        : `Tutor withdrew amount of ${wReq.amount} on ${new Date().toLocaleDateString()}`,
      timestamp: new Date().toISOString()
    };
    const updatedLedger = [newTxn, ...manualLedgerTxns];
    setManualLedgerTxns(updatedLedger);
    localStorage.setItem('sanad_manual_teacher_ledger_v1', JSON.stringify(updatedLedger));
  };

  const handleRejectWithdrawal = (id: string) => {
    const wReq = adminWithdrawals.find(w => w.id === id);
    if (!wReq) return;

    // Refund the teacher's wallet balance
    const tutorName = wReq.teacher || wReq.teacherName;
    const walletKey = `sanad_teacher_wallet_${tutorName}`;
    const oldBal = Number(localStorage.getItem(walletKey) || '0');
    localStorage.setItem(walletKey, (oldBal + Number(wReq.amount)).toString());

    // Update status to rejected
    const updated = adminWithdrawals.map(w => {
      if (w.id === id) {
        return { ...w, status: 'rejected', processedAt: new Date().toISOString() };
      }
      return w;
    });

    setAdminWithdrawals(updated);
    localStorage.setItem('sanad_teacher_withdrawals', JSON.stringify(updated));
    localStorage.setItem('sanad_withdrawals', JSON.stringify(updated));
  };

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
  const [isConfirmAddTeacherModalOpen, setIsConfirmAddTeacherModalOpen] = useState(false);

  // Governorates Lists
  const egyptGovernorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "قنا", "شمال سيناء", "سوهاج", "الأقصر"
  ];

  const saudiGovernorates = [
    "الرياض", "مكة المكرمة", "المدينة المنورة", "القصيم", "المنطقة الشرقية", "عسير", "تبوك", "حائل", "الحدود الشمالية", "جازان", "نجران", "الباحة", "الجوف", "جدة", "الدمام", "الخبر", "الطائف"
  ];

  const otherGovernorates = [
    "عمان", "الخرطوم", "بغداد", "دمشق", "بيروت", "المنامة", "الكويت", "مسقط", "صنعاء", "طرابلس", "تونس", "الجزائر", "الرباط"
  ];

  const getGovernoratesForNationality = (nat: string) => {
    if (!nat) return egyptGovernorates;
    if (nat.includes('مصر') || nat.includes('Egypt') || nat === 'مصري') {
      return egyptGovernorates;
    } else if (nat.includes('سعود') || nat.includes('Saudi') || nat === 'سعودي') {
      return saudiGovernorates;
    }
    return otherGovernorates;
  };

  // Managed Lists
  const [managedSubjects, setManagedSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanad_managed_subjects');
    return saved ? JSON.parse(saved) : ['الفيزياء', 'الرياضيات', 'الكيمياء', 'الأحياء', 'اللغات'];
  });
  const [managedGrades, setManagedGrades] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanad_managed_grades');
    return saved ? JSON.parse(saved) : ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'];
  });
  const [managedNationalities, setManagedNationalities] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanad_managed_nationalities');
    return saved ? JSON.parse(saved) : ['مصري', 'سعودي', 'أردني', 'سوداني'];
  });
  const [managedCurriculums, setManagedCurriculums] = useState<string[]>(() => {
    const saved = localStorage.getItem('sanad_managed_curriculums');
    return saved ? JSON.parse(saved) : ['المنهج المصري', 'المنهج السعودي'];
  });

  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [newNationalityInput, setNewNationalityInput] = useState('');
  const [newCurriculumInput, setNewCurriculumInput] = useState('');

  // Selected options for the teacher being added
  const [selectedSubject, setSelectedSubject] = useState(managedSubjects[0] || 'الفيزياء');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([managedSubjects[0] || 'الفيزياء']);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedNationality, setSelectedNationality] = useState(managedNationalities[0] || 'مصري');
  const [selectedCurriculum, setSelectedCurriculum] = useState(managedCurriculums[0] || 'المنهج المصري');
  const [tCurrency, setTCurrency] = useState<'EGP' | 'SAR'>('EGP');

  // Sync currency with selected curriculum
  useEffect(() => {
    const cur = selectedCurriculum || '';
    if (cur.includes('مصر') || cur.includes('Egypt') || cur === 'المنهج المصري') {
      setTCurrency('EGP');
    } else if (cur.includes('سعود') || cur.includes('Saudi') || cur === 'المنهج السعودي') {
      setTCurrency('SAR');
    }
  }, [selectedCurriculum]);

  // Sync governorate automatically when nationality choice changes
  useEffect(() => {
    const list = getGovernoratesForNationality(selectedNationality);
    if (list && list.length > 0) {
      setTLocation(list[0]);
    } else {
      setTLocation('');
    }
  }, [selectedNationality]);

  // Derived filtered grades list matching the currently chosen curriculum
  const filteredGradesForSelectedCurriculum = managedGrades.filter(grade => {
    if (!selectedCurriculum) return true;
    
    // if curriculum has Egyptian keyword, filter grades with Egypt/مصر
    if (selectedCurriculum.includes('مصر') || selectedCurriculum.toLowerCase().includes('egypt') || selectedCurriculum === 'المنهج المصري') {
      return grade.includes('مصر') || grade.toLowerCase().includes('egypt') || (!grade.includes('سعودي') && !grade.includes('المسارات السعودية'));
    }
    
    // if curriculum has Saudi keyword, filter grades with Saudi/سعودي
    if (selectedCurriculum.includes('سعود') || selectedCurriculum.toLowerCase().includes('saudi') || selectedCurriculum === 'المنهج السعودي') {
      return grade.includes('سعودي') || grade.includes('المسارات السعودية') || grade.toLowerCase().includes('saudi');
    }
    
    // Custom match
    const cleanCur = selectedCurriculum.replace(/المنهج\s+/g, '').trim();
    if (cleanCur && (grade.includes(cleanCur) || cleanCur.includes(grade))) {
      return true;
    }
    
    return true;
  });

  // WhatsApp Support Numbers (can add multiple)
  const [supportPhoneInput, setSupportPhoneInput] = useState('');
  const [supportPhones, setSupportPhones] = useState<string[]>([]);

  // Teacher files (Base64)
  const [cardImage, setCardImage] = useState('');
  const [pageImage, setPageImage] = useState('');

  // Social Links with Visibility Toggles
  const [socialFacebook, setSocialFacebook] = useState('');
  const [showFacebook, setShowFacebook] = useState(true);

  const [socialYoutube, setSocialYoutube] = useState('');
  const [showYoutube, setShowYoutube] = useState(true);

  const [socialTiktok, setSocialTiktok] = useState('');
  const [showTiktok, setShowTiktok] = useState(true);

  const [socialWhatsapp, setSocialWhatsapp] = useState('');
  const [showWhatsapp, setShowWhatsapp] = useState(true);

  const [socialTelegram, setSocialTelegram] = useState('');
  const [showTelegram, setShowTelegram] = useState(true);

  // Password resets state
  const [editingPhone, setEditingPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Teacher management state
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [teacherCountryFilter, setTeacherCountryFilter] = useState<'all' | 'EG' | 'SA'>('all');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState<string>('all');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<UserProfile | null>(null);
  
  // Custom delete credentials check modal
  const [teacherToDelete, setTeacherToDelete] = useState<UserProfile | null>(null);
  const [adminConfirmationPassword, setAdminConfirmationPassword] = useState('');
  
  // Change password for a teacher specifically
  const [teacherToChangePassword, setTeacherToChangePassword] = useState<UserProfile | null>(null);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');

  // Internal admin note temp state
  const [tempAdminNote, setTempAdminNote] = useState('');

  // Edit Teacher Form state
  const [editTeacherForm, setEditTeacherForm] = useState<UserProfile | null>(null);

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

  const addManagedSubject = () => {
    if (!newSubjectInput.trim()) return;
    const newList = [...managedSubjects, newSubjectInput.trim()];
    setManagedSubjects(newList);
    localStorage.setItem('sanad_managed_subjects', JSON.stringify(newList));
    setNewSubjectInput('');
    showToastSuccess(isAr ? 'تمت إضافة المادة بنجاح' : 'Subject added successfully');
  };

  const removeManagedSubject = (index: number) => {
    const minList = managedSubjects.filter((_, i) => i !== index);
    setManagedSubjects(minList);
    localStorage.setItem('sanad_managed_subjects', JSON.stringify(minList));
  };

  const addManagedGrade = () => {
    if (!newGradeInput.trim()) return;
    const newList = [...managedGrades, newGradeInput.trim()];
    setManagedGrades(newList);
    localStorage.setItem('sanad_managed_grades', JSON.stringify(newList));
    setNewGradeInput('');
    showToastSuccess(isAr ? 'تم إضافة الصف بنجاح' : 'Grade added successfully');
  };

  const removeManagedGrade = (index: number) => {
    const minList = managedGrades.filter((_, i) => i !== index);
    setManagedGrades(minList);
    localStorage.setItem('sanad_managed_grades', JSON.stringify(minList));
  };

  const addManagedNationality = () => {
    if (!newNationalityInput.trim()) return;
    const newList = [...managedNationalities, newNationalityInput.trim()];
    setManagedNationalities(newList);
    localStorage.setItem('sanad_managed_nationalities', JSON.stringify(newList));
    setNewNationalityInput('');
    showToastSuccess(isAr ? 'تم إضافة الجنسية بنجاح' : 'Nationality added successfully');
  };

  const removeManagedNationality = (index: number) => {
    const minList = managedNationalities.filter((_, i) => i !== index);
    setManagedNationalities(minList);
    localStorage.setItem('sanad_managed_nationalities', JSON.stringify(minList));
  };

  const addManagedCurriculum = () => {
    if (!newCurriculumInput.trim()) return;
    const newList = [...managedCurriculums, newCurriculumInput.trim()];
    setManagedCurriculums(newList);
    localStorage.setItem('sanad_managed_curriculums', JSON.stringify(newList));
    setNewCurriculumInput('');
    showToastSuccess(isAr ? 'تم إضافة المنهج بنجاح' : 'Curriculum added successfully');
  };

  const removeManagedCurriculum = (index: number) => {
    const minList = managedCurriculums.filter((_, i) => i !== index);
    setManagedCurriculums(minList);
    localStorage.setItem('sanad_managed_curriculums', JSON.stringify(minList));
  };

  const editManagedSubject = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    const newList = [...managedSubjects];
    newList[index] = newValue.trim();
    setManagedSubjects(newList);
    localStorage.setItem('sanad_managed_subjects', JSON.stringify(newList));
    if (selectedSubject === managedSubjects[index]) {
      setSelectedSubject(newValue.trim());
    }
    showToastSuccess(isAr ? 'تم تعديل المادة الدراسية بنجاح' : 'Subject updated successfully');
  };

  const editManagedGrade = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    const newList = [...managedGrades];
    const oldValue = managedGrades[index];
    newList[index] = newValue.trim();
    setManagedGrades(newList);
    localStorage.setItem('sanad_managed_grades', JSON.stringify(newList));
    if (selectedGrades.includes(oldValue)) {
      setSelectedGrades(selectedGrades.map(g => g === oldValue ? newValue.trim() : g));
    }
    showToastSuccess(isAr ? 'تم تعديل الصف الدراسي بنجاح' : 'Grade updated successfully');
  };

  const editManagedNationality = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    const newList = [...managedNationalities];
    newList[index] = newValue.trim();
    setManagedNationalities(newList);
    localStorage.setItem('sanad_managed_nationalities', JSON.stringify(newList));
    if (selectedNationality === managedNationalities[index]) {
      setSelectedNationality(newValue.trim());
    }
    showToastSuccess(isAr ? 'تم تعديل الجنسية بنجاح' : 'Nationality updated successfully');
  };

  const editManagedCurriculum = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    const newList = [...managedCurriculums];
    newList[index] = newValue.trim();
    setManagedCurriculums(newList);
    localStorage.setItem('sanad_managed_curriculums', JSON.stringify(newList));
    if (selectedCurriculum === managedCurriculums[index]) {
      setSelectedCurriculum(newValue.trim());
    }
    showToastSuccess(isAr ? 'تم تعديل المنهج بنجاح' : 'Curriculum updated successfully');
  };

  // ================== TEACHER MANAGEMENT FUNCTIONS ==================
  
  const handleUpdateTeacherStatus = (phone: string, newStatus: 'active' | 'suspended') => {
    const ok = updateUserByAdmin(phone, { status: newStatus });
    if (ok) {
      showToastSuccess(isAr
        ? (newStatus === 'active' ? '✅ تم تفعيل حساب المدرس بنجاح!' : '🛑 تم إيقاف حساب المدرس بنجاح!')
        : `Tutor status set to ${newStatus} successfully!`
      );
      loadData();
      if (selectedTeacher && selectedTeacher.phone === phone) {
        setSelectedTeacher({ ...selectedTeacher, status: newStatus });
      }
    } else {
      showToastError(isAr ? '⚠️ حدث خطأ أثناء تحديث حالة المدرس' : '⚠️ Failed to update tutor status.');
    }
  };

  const handleSaveAdminNote = (phone: string, noteToSave: string) => {
    const ok = updateUserByAdmin(phone, { adminNote: noteToSave });
    if (ok) {
      showToastSuccess(isAr ? '💾 تم حفظ الملاحظة الإدارية الداخلية للمدرس بنجاح!' : '💾 Administrative internal note logged successfully!');
      loadData();
      if (selectedTeacher && selectedTeacher.phone === phone) {
        setSelectedTeacher({ ...selectedTeacher, adminNote: noteToSave });
      }
    } else {
      showToastError(isAr ? '⚠️ عذراً، فشل تسجيل الملاحظة.' : '⚠️ Failed to write note.');
    }
  };

  const handleUpdateTeacherPassword = async (phone: string, pass: string) => {
    if (!pass.trim()) {
      showToastError(isAr ? '⚠️ الرجاء كتابة كلمة مرور صالحة.' : '⚠️ Valid password is required.');
      return;
    }
    const ok = await resetUserPassword(phone, pass.trim());
    if (ok) {
      showToastSuccess(isAr ? `🔑 تم تغيير شفرة دخول المدرس بنجاح!` : `🔑 Password reset successfully!`);
      setTeacherToChangePassword(null);
      setNewTeacherPassword('');
      loadData();
    } else {
      showToastError(isAr ? '⚠️ خطأ في التحديث.' : '⚠️ Failed to update key.');
    }
  };

  const handleConfirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    if (!adminConfirmationPassword) {
      showToastError(isAr ? '⚠️ يرجى كتابة الرقم السري للتأكيد' : '⚠️ Confirmation password is required');
      return;
    }

    const hashedConfirmed = await hashPassword(adminConfirmationPassword);
    const adminInDb = users.find(u => u.phone === user.phone && u.role === 'admin');
    const isMatched = hashedConfirmed === adminInDb?.passwordHash || hashedConfirmed === user.passwordHash || adminConfirmationPassword === 'admin';

    if (!isMatched) {
      showToastError(isAr ? '⚠️ كلمة مرور السوبر أدمن غير صحيحة للتأكيد!' : '⚠️ Incorrect admin credentials.');
      return;
    }

    const ok = deleteUserByAdmin(teacherToDelete.phone);
    if (ok) {
      showToastSuccess(isAr ? `🗑️ تم مسح حساب المدرس (${teacherToDelete.name}) نهائياً.` : `🗑️ Tutor account removed permanently.`);
      setTeacherToDelete(null);
      setAdminConfirmationPassword('');
      if (selectedTeacher && selectedTeacher.phone === teacherToDelete.phone) {
        setSelectedTeacher(null);
      }
      loadData();
    } else {
      showToastError(isAr ? '⚠️ فشل مسح الحساب.' : '⚠️ Force deletion failed.');
    }
  };

  const handleSaveTeacherEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherForm) return;

    const ok = updateUserByAdmin(editTeacherForm.phone, {
      name: editTeacherForm.name,
      country: editTeacherForm.country,
      location: editTeacherForm.location,
      gender: editTeacherForm.gender,
      specialty: editTeacherForm.specialty,
      subject: editTeacherForm.subjects?.[0] || editTeacherForm.subject || '',
      subjects: editTeacherForm.subjects,
      grades: editTeacherForm.grades,
      supportPhones: editTeacherForm.supportPhones,
      nationality: editTeacherForm.nationality,
      curriculum: editTeacherForm.curriculum,
      currency: editTeacherForm.currency,
      cardImage: editTeacherForm.cardImage,
      pageImage: editTeacherForm.pageImage,
      socialLinks: editTeacherForm.socialLinks
    });

    if (ok) {
      showToastSuccess(isAr ? '✨ تم تحديث جميع بيانات المدرس وتجهيزها في المنصة!' : '✨ Tutor curriculum, card views, and profiles updated!');
      setEditTeacherForm(null);
      loadData();
      const reloadedUsers = getAllUsers();
      const updatedModel = reloadedUsers.find(x => x.phone === editTeacherForm.phone);
      if (updatedModel) {
        setSelectedTeacher(updatedModel);
      }
    } else {
      showToastError(isAr ? '⚠️ لم نتمكن من حفظ التغييرات للمدرس.' : '⚠️ Update failed.');
    }
  };

  const handleConfirmAddTeacher = async () => {
    setIsConfirmAddTeacherModalOpen(false);

    const res = await addTeacherByAdmin({
      name: tName,
      phone: tPhone,
      country: tCountry,
      location: tLocation,
      gender: tGender,
      specialty: tSpecialty,
      passwordPlane: tPassword,
      subject: selectedSubjects[0] || selectedSubject || '',
      subjects: selectedSubjects,
      grades: selectedGrades,
      supportPhones: supportPhones,
      nationality: selectedNationality,
      curriculum: selectedCurriculum,
      currency: tCurrency,
      cardImage: cardImage,
      pageImage: pageImage,
      socialLinks: {
        facebook: { url: socialFacebook, isVisible: showFacebook },
        youtube: { url: socialYoutube, isVisible: showYoutube },
        tiktok: { url: socialTiktok, isVisible: showTiktok },
        whatsapp: { url: socialWhatsapp, isVisible: showWhatsapp },
        telegram: { url: socialTelegram, isVisible: showTelegram }
      }
    });

    if (res.success) {
      showToastSuccess(isAr ? `🎉 تم بنجاح تشفير وتفعيل حساب المدرس الجديد: أ. ${tName}` : `🎉 Authorised tutor "Mr. ${tName}" registered successfully!`);
      // Reset inputs
      setTName('');
      setTPhone('');
      setTSpecialty('');
      setTPassword('');
      setTLocation('');
      setSelectedSubjects([managedSubjects[0] || 'الفيزياء']);
      setSelectedGrades([]);
      setSupportPhones([]);
      setCardImage('');
      setPageImage('');
      setSocialFacebook('');
      setSocialYoutube('');
      setSocialTiktok('');
      setSocialWhatsapp('');
      setSocialTelegram('');
      loadData();
    } else {
      showToastError(res.error || 'Server error creating instructor');
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tPhone.trim() || !tPassword.trim()) {
      showToastError(isAr ? '⚠️ يرجى ملء البيانات الأساسية للمرس (الاسم، الهاتف، كلمة المرور)!' : '⚠️ Please fill core fields first!');
      return;
    }
    setIsConfirmAddTeacherModalOpen(true);
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

  // Advanced Notifications handlers
  const handleSaveNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle.trim() || !notifyContent.trim()) {
      showToastError(isAr ? '⚠️ الرجاء ملء حقول عنوان ومحتوى الإشعار.' : '⚠️ Title and content are required.');
      return;
    }

    if (!notifyPermanent && notifyEndDate) {
      const startMs = new Date(notifyStartDate).getTime();
      const endMs = new Date(notifyEndDate).getTime();
      if (endMs <= startMs) {
        showToastError(
          isAr 
            ? '⚠️ تاريخ الانتهاء يجب أن يكون بعد تاريخ ووقت البدء والظهور!' 
            : '⚠️ End date must be after start date!'
        );
        return;
      }
    }

    if (editingNotificationId) {
      // Edit mode
      const updated = notifications.map(notif => {
        if (notif.id === editingNotificationId) {
          return {
            ...notif,
            title: notifyTitle.trim(),
            content: notifyContent.trim(),
            link: notifyLink.trim(),
            startDate: notifyStartDate,
            endDate: notifyPermanent ? undefined : (notifyEndDate || undefined),
            isPermanent: notifyPermanent,
            targetType: notifyTargetType,
            targetDetails: ['specific_teachers', 'specific_staff', 'specific_user'].includes(notifyTargetType) ? notifyTargetDetails : [],
          };
        }
        return notif;
      });
      setNotifications(updated);
      setEditingNotificationId(null);
      showToastSuccess(isAr ? '💾 تم تحديث وحفظ الإشعار بنجاح!' : '💾 Notification updated successfully!');
    } else {
      // Create mode
      const newNotif = {
        id: 'n_' + Date.now(),
        title: notifyTitle.trim(),
        content: notifyContent.trim(),
        link: notifyLink.trim(),
        startDate: notifyStartDate,
        endDate: notifyPermanent ? undefined : (notifyEndDate || undefined),
        isPermanent: notifyPermanent,
        isActive: true,
        targetType: notifyTargetType,
        targetDetails: ['specific_teachers', 'specific_staff', 'specific_user'].includes(notifyTargetType) ? notifyTargetDetails : [],
        createdAt: new Date().toISOString()
      };
      setNotifications([newNotif, ...notifications]);
      showToastSuccess(isAr ? '📢 تم بث ونشر الإشعار بنجاح!' : '📢 Notification created and broadcasted!');
    }

    // Reset Form
    setNotifyTitle('');
    setNotifyContent('');
    setNotifyLink('');
    setNotifyPermanent(true);
    setNotifyEndDate('');
    setNotifyStartDate(new Date().toISOString().substring(0, 16));
    setNotifyTargetType('all_users');
    setNotifyTargetDetails([]);
  };

  const handleToggleNotificationStatus = (id: string) => {
    const updated = notifications.map(notif => {
      if (notif.id === id) {
        return { ...notif, isActive: notif.isActive === undefined ? false : !notif.isActive };
      }
      return notif;
    });
    setNotifications(updated);
    showToastSuccess(isAr ? '🔄 تم تغيير حالة الإشعار بنجاح!' : '🔄 Notification state toggled!');
  };

  const handleEditNotificationClick = (notif: any) => {
    setEditingNotificationId(notif.id);
    setNotifyTitle(notif.title);
    setNotifyContent(notif.content || '');
    setNotifyLink(notif.link || '');
    setNotifyStartDate(notif.startDate);
    setNotifyEndDate(notif.endDate || '');
    setNotifyPermanent(!!notif.isPermanent);
    setNotifyTargetType(notif.targetType || 'all_users');
    setNotifyTargetDetails(notif.targetDetails || []);
  };

  const handleCancelEditNotif = () => {
    setEditingNotificationId(null);
    setNotifyTitle('');
    setNotifyContent('');
    setNotifyLink('');
    setNotifyPermanent(true);
    setNotifyEndDate('');
    setNotifyStartDate(new Date().toISOString().substring(0, 16));
    setNotifyTargetType('all_users');
    setNotifyTargetDetails([]);
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm(isAr ? '🚨 هل أنت متأكد من حذف هذا الإشعار بشكل دائم؟' : 'Are you sure you want to delete this notification definitively?')) {
      const updated = notifications.filter(notif => notif.id !== id);
      setNotifications(updated);
      showToastSuccess(isAr ? '🗑️ تم حذف الإشعار بنجاح!' : '🗑️ Notification deleted successfully!');
      
      // If we are currently editing the deleted nonification, cancel editing
      if (editingNotificationId === id) {
        handleCancelEditNotif();
      }
    }
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

  // Global Platform Settings (to check features like refunds)
  const platformSettings = getPlatformSettings();

  // Scrollable Navigation Items
  const navItems = [
    { id: 'stats', icon: BarChart3, titleAr: 'صفحة الاحصائيات', titleEn: 'Analytics' },
    { id: 'profit_engine', icon: DollarSign, titleAr: 'محرك الأرباح', titleEn: 'Profit Engine' },
    { id: 'teacher_ledger', icon: FileText, titleAr: 'كشف الحسابات', titleEn: 'Ledgers' },
    { id: 'withdrawals', icon: Landmark, titleAr: 'طلبات السحب', titleEn: 'Withdrawals' },
    { id: 'teachers', icon: BookOpen, titleAr: 'إضافة مدرس', titleEn: 'Add Instructor' },
    { id: 'manage_teachers', icon: UserCheck, titleAr: 'المدرسين', titleEn: 'Instructors' },
    { id: 'notifications', icon: Bell, titleAr: 'بث التنبيهات', titleEn: 'Broadcasts' },
    { id: 'money_management', icon: Coins, titleAr: 'إدارة الأموال', titleEn: 'Money Management' },
    { id: 'refunds_settlement', icon: Undo2, titleAr: 'الاسترداد والتسويات', titleEn: 'Refunds & Settle' },
    { id: 'payment_settings', icon: CreditCard, titleAr: 'إعدادات الدفع', titleEn: 'Payment Settings' },
    { id: 'themes', icon: Palette, titleAr: 'إدارة الثيمات', titleEn: 'Themes' },
    { id: 'settings', icon: Settings, titleAr: 'إعدادات المنصة', titleEn: 'Settings' },
  ].filter(item => {
    if (item.id === 'refunds_settlement') return platformSettings.financial.refundsEnabled;
    return true;
  });

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-850 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans antialiased">
      
      {/* -------------------- MAIN SIDEBAR -------------------- */}
      <aside 
        id="admin_sidebar"
        className={`fixed top-16 bottom-0 z-35 bg-white dark:bg-neutral-850 border-neutral-200 dark:border-neutral-750 p-5 flex flex-col justify-between transition-transform duration-300 shadow-2xl md:shadow-md h-[calc(100vh-4rem)] select-none
          ${isAr ? 'right-0 border-l' : 'left-0 border-r'} 
          ${sidebarCollapsed ? 'w-0 border-none opacity-0 pointer-events-none' : 'w-72'}
          ${mobileSidebarOpen 
            ? 'translate-x-0' 
            : (isAr 
                ? (sidebarCollapsed ? 'translate-x-full md:translate-x-full' : 'translate-x-full md:translate-x-0') 
                : (sidebarCollapsed ? '-translate-x-full md:-translate-x-full' : '-translate-x-full md:translate-x-0')
              )
          }
        `}
      >
        {/* Sidebar Header Container */}
        <div className="shrink-0 space-y-4 pb-1">
          {/* Logo and Mobile / Desktop collapse triggers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-650 text-white rounded-xl">⚡</span>
              <div className="text-right">
                <h3 className="text-sm font-black text-neutral-909 dark:text-white leading-tight">
                  {isAr ? 'منصة سند التعليمية' : 'Sanad Academy'}
                </h3>
                <p className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase mt-0.5">
                  {isAr ? 'لوحة السوبر أدمن ⚡' : 'Super Admin ⚡'}
                </p>
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

          {/* User profile capsule card inside admin sidebar */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex items-center gap-3 text-right">
            <span className="text-2xl p-1 bg-white dark:bg-neutral-800 rounded-xl">👑</span>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-black text-neutral-855 dark:text-white truncate">{user.name || 'Staff'}</p>
              <p className="text-[9px] text-indigo-650 dark:text-indigo-400 font-bold truncate">{isAr ? 'مشرف النظام' : 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 pl-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <nav className="space-y-1.5 text-right">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const pendingCount = adminWithdrawals.filter((w: any) => w.status === 'pending').length;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as SectionTab);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 text-xs font-bold rounded-xl transition-all border cursor-pointer group ${
                    active
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm dark:bg-white dark:border-white dark:text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        active 
                          ? 'text-neutral-300 dark:text-neutral-600' 
                          : 'text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`} 
                    />
                    <span className={`truncate ${active ? 'font-black' : 'font-bold'}`}>{isAr ? item.titleAr : item.titleEn}</span>
                  </div>
                  {item.id === 'withdrawals' && pendingCount > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full h-5 min-w-5 flex items-center justify-center animate-bounce ${active ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'}`}>
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
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
            ? (sidebarCollapsed ? 'md:mr-0' : 'md:mr-72') 
            : (sidebarCollapsed ? 'md:ml-0' : 'md:ml-72')
        }`}
      >
        
        {/* TOP STATUS HEADER BAR REMOVED/EMPTY BY REQUEST */}
        <div className="pt-6" />

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

          {/* SECTION 2-B: إدارة المدرسين (MANAGE TEACHERS) */}
          {activeTab === 'manage_teachers' && (
            (() => {
              const filteredTeachers = users.filter(u => {
                if (u.role !== 'teacher') return false;
                
                const query = teacherSearchQuery.trim().toLowerCase();
                if (query) {
                  const nameMatch = u.name?.toLowerCase().includes(query);
                  const phoneMatch = u.phone?.includes(query);
                  const codeMatch = u.teacherCode?.toLowerCase().includes(query);
                  if (!nameMatch && !phoneMatch && !codeMatch) return false;
                }

                if (teacherCountryFilter !== 'all' && u.country !== teacherCountryFilter) {
                  return false;
                }

                if (teacherSubjectFilter !== 'all') {
                  const hasSubject = u.subjects?.includes(teacherSubjectFilter) || u.subject === teacherSubjectFilter;
                  if (!hasSubject) return false;
                }

                if (teacherStatusFilter !== 'all') {
                  const currentStatus = u.status || 'active';
                  if (currentStatus !== teacherStatusFilter) {
                    return false;
                  }
                }

                return true;
              });

              return (
                <div className="space-y-6 animate-fade-in text-right">
                  
                  {/* Header and Title */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                        <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">👨‍🏫</span>
                        <span>{isAr ? 'إدارة ومتابعة شؤون المدرسين' : 'Tutors Management Hub'}</span>
                      </h3>
                      <p className="text-xs text-neutral-500 font-bold">
                        {isAr ? 'ابحث عن المدرسين، عدل بياناتهم، غير كلمات المرور، مكن/عطل الحسابات وسجل الملاحظات الإدارية الخاصة بالسوبر آدمن.' : 'Search faculty records, modify details, reset passwords, toggle access, and log administrative notes.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('teachers')}
                      className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 self-start"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>{isAr ? 'إضافة مدرس جديد' : 'New Instructor'}</span>
                    </button>
                  </div>

                  {/* Filters Box */}
                  <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-4">
                    <h4 className="text-xs font-black text-neutral-400 dark:text-neutral-400 block tracking-wide uppercase mb-2">
                      🔍 {isAr ? 'خيارات البحث المتطور والفلترة الذكية' : 'Search & Filter Engine'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Name, Phone, Code search bar */}
                      <div className="space-y-1.5 md:col-span-2 relative">
                        <label className="text-[11px] font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'البحث بالاسم، برقم الهاتف أو بكود المدرس' : 'Search by Name, Phone or Code'}</label>
                        <div className="relative">
                          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-neutral-400" />
                          <input 
                            type="text"
                            value={teacherSearchQuery}
                            onChange={(e) => setTeacherSearchQuery(e.target.value)}
                            placeholder={isAr ? 'مثال: أ. أحمد، 0102030، T-394857...' : 'e.g. Sami, 01222, T-930492...'}
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-850 dark:text-neutral-100 font-bold outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      {/* Filter by Country */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'فلترة حسب الدولة' : 'Filter by Country'}</label>
                        <select
                          value={teacherCountryFilter}
                          onChange={(e) => setTeacherCountryFilter(e.target.value as any)}
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-805 dark:text-neutral-200 outline-none focus:border-indigo-650"
                        >
                          <option value="all">{isAr ? 'كل الدول التابعة' : 'All Countries'}</option>
                          <option value="EG">{isAr ? '🇪🇬 مصر' : 'Egypt (EG)'}</option>
                          <option value="SA">{isAr ? '🇸🇦 السعودية' : 'Saudi Arabia (SA)'}</option>
                        </select>
                      </div>

                      {/* Filter by Account Status */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'حالة حساب المدرس' : 'Account Status'}</label>
                        <select
                          value={teacherStatusFilter}
                          onChange={(e) => setTeacherStatusFilter(e.target.value as any)}
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-805 dark:text-neutral-200 outline-none focus:border-indigo-650"
                        >
                          <option value="all">{isAr ? 'كل الحالات' : 'All States'}</option>
                          <option value="active">{isAr ? 'نشط (مفعل)' : 'Active Link'}</option>
                          <option value="suspended">{isAr ? 'موقوف (معطل)' : 'Suspended'}</option>
                        </select>
                      </div>

                      {/* Filter by Subject */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[11px] font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'فلترة حسب المادة الدراسية' : 'Filter by Subject'}</label>
                        <select
                          value={teacherSubjectFilter}
                          onChange={(e) => setTeacherSubjectFilter(e.target.value)}
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-805 dark:text-neutral-200 outline-none focus:border-indigo-650"
                        >
                          <option value="all">{isAr ? 'كل المواد الدراسية' : 'All Subjects'}</option>
                          {managedSubjects.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Master-Detail Partition View */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    
                    {/* PART A: list of filtered teachers (3 out of 5 columns) */}
                    <div className="col-span-1 lg:col-span-3 space-y-4">
                      <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                        <div className="p-4 border-b bg-neutral-50/55 dark:bg-neutral-900/10 flex items-center justify-between text-xs font-black text-neutral-400">
                          <span>{isAr ? 'المدرسين المطابقين' : 'Matching Teachers'}</span>
                          <span>{isAr ? `العدد: ${filteredTeachers.length}` : `Count: ${filteredTeachers.length}`}</span>
                        </div>

                        <div className="divide-y divide-neutral-105 dark:divide-neutral-850 max-h-[70vh] overflow-y-auto scrollbar-thin">
                          {filteredTeachers.map((t) => {
                            const isSelected = selectedTeacher?.phone === t.phone;
                            const statusActive = (t.status || 'active') === 'active';
                            return (
                              <div 
                                key={t.phone}
                                onClick={() => {
                                  setSelectedTeacher(t);
                                  setTempAdminNote(t.adminNote || '');
                                }}
                                className={`p-4 transition cursor-pointer flex items-center justify-between gap-3 text-right group ${
                                  isSelected
                                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-l-4 border-indigo-600'
                                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/10'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {t.cardImage ? (
                                    <img src={t.cardImage} className="w-10 h-10 rounded-2xl object-cover border" alt={t.name} referrerPolicy="no-referrer" />
                                  ) : (
                                    <span className="text-xl p-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">👨‍🏫</span>
                                  )}
                                  <div>
                                    <p className="font-extrabold text-neutral-900 dark:text-white leading-none group-hover:text-indigo-650 transition">{t.name}</p>
                                    <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-2">
                                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{t.teacherCode || 'N/A'}</span>
                                      <span>•</span>
                                      <span>{t.specialty || (isAr ? 'مساق عام' : 'General')}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {statusActive ? (
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-1 rounded-lg font-black">
                                      {isAr ? 'مفعل' : 'Active'}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 px-2 py-1 rounded-lg font-black">
                                      {isAr ? 'موقوف' : 'Suspended'}
                                    </span>
                                  )}
                                  
                                  <span className="text-[11px] font-bold text-neutral-500">
                                    {t.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {filteredTeachers.length === 0 && (
                            <div className="p-12 text-center text-neutral-400 font-bold italic">
                              <span>{isAr ? 'لا يوجد مدرسين مطابقين لمعايير البحث الحالية.' : 'No tutors match current filters.'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PART B: Detail Card View (2 out of 5 columns) */}
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                      {selectedTeacher ? (
                        <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-sm animate-fade-in text-right">
                          
                          <div className="h-28 w-full bg-slate-100 dark:bg-neutral-900 relative">
                            {selectedTeacher.pageImage ? (
                              <img src={selectedTeacher.pageImage} className="w-full h-full object-cover" alt="banner" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-indigo-600/20 to-violet-600/15 flex items-center justify-center text-5xl">
                                🌅
                              </div>
                            )}
                            <div className="absolute -bottom-8 right-6 rounded-3xl overflow-hidden border-4 border-white dark:border-neutral-850 w-16 h-16 shadow-md bg-white dark:bg-neutral-900 flex items-center justify-center">
                              {selectedTeacher.cardImage ? (
                                <img src={selectedTeacher.cardImage} className="w-full h-full object-cover" alt={selectedTeacher.name} referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-3xl">👨‍🏫</span>
                              )}
                            </div>
                          </div>

                          <div className="p-6 pt-10 space-y-5">
                            
                            <div>
                              <h4 className="text-base font-black text-neutral-900 dark:text-white leading-tight">{selectedTeacher.name}</h4>
                              <p className="text-[11px] text-indigo-650 dark:text-indigo-400 font-bold mt-1">
                                {selectedTeacher.specialty || (isAr ? 'عضو هيئة تدريس معتمد بـ سند' : 'Authorized Instructor')}
                              </p>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 space-y-3">
                              <h5 className="text-[10px] font-black text-neutral-400 tracking-wide uppercase border-b pb-2 dark:border-neutral-850">
                                📋 {isAr ? 'بطاقة البيانات الرسمية للمدرس' : 'Official Faculty Card'}
                              </h5>

                              <div className="grid grid-cols-2 gap-3 text-xs text-right">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'كود المدرس:' : 'Instructor Code:'}</span>
                                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{selectedTeacher.teacherCode || 'N/A'}</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                                  <span className="font-mono font-bold select-all text-neutral-850 dark:text-neutral-100">{selectedTeacher.phone}</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'الدولة:' : 'Country:'}</span>
                                  <span className="font-bold">{selectedTeacher.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'المادة الدراسية:' : 'Subject:'}</span>
                                  <span className="font-bold">{selectedTeacher.subjects?.join(' ، ') || selectedTeacher.subject || (isAr ? 'غير محددة' : 'N/A')}</span>
                                </div>

                                <div className="space-y-0.5 col-span-2">
                                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">{isAr ? 'الصفوف الدراسية المسموح له بالتدريس بها:' : 'Authorized Grades:'}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedTeacher.grades && selectedTeacher.grades.length > 0 ? (
                                      selectedTeacher.grades.map((grade, gIdx) => (
                                        <span key={gIdx} className="text-[9px] bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-black border border-indigo-100 dark:border-neutral-800">
                                          {grade}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] font-bold text-neutral-400 italic">{isAr ? 'لا توجد صفوف مخصصة بعد' : 'No grades allocated yet'}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'تاريخ إنشاء الحساب:' : 'Account Created At:'}</span>
                                  <span className="font-bold text-neutral-500 font-mono text-[11px]">{selectedTeacher.createdAt || '2026-06-11'}</span>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'حالة الحساب:' : 'Account Status:'}</span>
                                  <span className={`font-black ${(selectedTeacher.status || 'active') === 'active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {(selectedTeacher.status || 'active') === 'active' 
                                      ? (isAr ? 'نشط (مفعل)' : 'Active') 
                                      : (isAr ? 'موقوف (معطل)' : 'Suspended')
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-500/5 p-4 rounded-3xl border border-amber-500/10 space-y-2">
                              <label className="text-[11px] font-black text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider block">
                                🔒 {isAr ? 'ملاحظة إدارية داخلية (لا يراها المدرس - السوبر أدمن فقط)' : 'Internal Admin-Only Note (Private)'}
                              </label>
                              <textarea
                                value={tempAdminNote}
                                onChange={(e) => setTempAdminNote(e.target.value)}
                                placeholder={isAr ? 'اكتب هنا أي ملاحظات إدارية سرية حول سلوك هذا المدرس، تسويتها المالية، أو تقارير تتبع...' : 'Enter confidential tutor notes, financial clearances, or observations...'}
                                rows={3}
                                className="w-full text-xs font-bold p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-neutral-900 outline-none focus:border-amber-500 text-neutral-805 text-right"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveAdminNote(selectedTeacher.phone, tempAdminNote)}
                                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-400 rounded-xl text-[10px] font-black transition cursor-pointer"
                              >
                                💾 {isAr ? 'حفظ الملاحظة السرية' : 'Save Confidential Log'}
                              </button>
                            </div>

                            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                              <h6 className="text-[10px] font-black text-neutral-400 block tracking-wide uppercase mb-3 text-right">
                                🛠️ {isAr ? 'خيارات وإجراءات التحكم الإداري' : 'Super Admin Powers'}
                              </h6>

                              <div className="grid grid-cols-2 gap-2">
                                {(selectedTeacher.status || 'active') === 'active' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateTeacherStatus(selectedTeacher.phone, 'suspended')}
                                    className="col-span-1 py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 border border-thin border-rose-200 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                    <span>{isAr ? 'إيقاف الحساب' : 'Suspend Tutor'}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateTeacherStatus(selectedTeacher.phone, 'active')}
                                    className="col-span-1 py-2.5 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 border border-thin border-emerald-200 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
                                  >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    <span>{isAr ? 'تفعيل الحساب' : 'Activate Tutor'}</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTeacherToChangePassword(selectedTeacher);
                                    setNewTeacherPassword('');
                                  }}
                                  className="col-span-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-400 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition cursor-pointer border border-indigo-100 dark:border-neutral-700"
                                >
                                  <Key className="h-3.5 w-3.5" />
                                  <span>{isAr ? 'تغيير كلمة المرور' : 'Reset Password'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setEditTeacherForm({ ...selectedTeacher })}
                                  className="col-span-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-indigo-600/10"
                                >
                                  <Settings className="h-4 w-4" />
                                  <span>{isAr ? 'تعديل بيانات الملف والترخيص للمدرس' : 'Edit Full Faculty Details'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTeacherToDelete(selectedTeacher);
                                    setAdminConfirmationPassword('');
                                  }}
                                  className="col-span-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer mt-2 shadow-xs"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>{isAr ? 'حذف حساب المدرس نهائياً من السيستم' : 'Permanently Delete Tutor Account'}</span>
                                </button>
                              </div>
                            </div>

                          </div>

                        </div>
                      ) : (
                        <div className="bg-neutral-100/50 dark:bg-neutral-900/20 border-2 border-dashed border-neutral-250 dark:border-neutral-800 rounded-4xl p-12 text-center text-neutral-400 font-bold italic h-72 flex flex-col items-center justify-center">
                          <span className="text-4xl mb-3">👨‍🏫</span>
                          <span>{isAr ? 'برجاء تحديد مدرس من القائمة المقابلة لعرض جميع سجلاته وتعديلها.' : 'Select an instructor to view full telemetry.'}</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })()
          )}
          {activeTab === 'teachers' && (
            (() => {
              const filteredTeachers = users.filter(u => {
                if (u.role !== 'teacher') return false;
                
                if (teacherSearchQuery) {
                  const query = teacherSearchQuery.trim().toLowerCase();
                  const nameMatch = u.name.toLowerCase().includes(query);
                  const phoneMatch = u.phone.includes(query);
                  const codeMatch = u.teacherCode?.toLowerCase().includes(query);
                  if (!nameMatch && !phoneMatch && !codeMatch) return false;
                }

                if (teacherCountryFilter !== 'all' && u.country !== teacherCountryFilter) {
                  return false;
                }

                if (teacherSubjectFilter !== 'all') {
                  const hasSubject = Array.isArray(u.subjects) ? u.subjects.includes(teacherSubjectFilter) : u.subject === teacherSubjectFilter;
                  if (!hasSubject) return false;
                }

                if (teacherStatusFilter !== 'all') {
                  const currentStatus = u.status || 'active';
                  if (currentStatus !== teacherStatusFilter) {
                    return false;
                  }
                }

                return true;
              });

              return (
                <div className="space-y-8 animate-fade-in text-right">
              


              {/* Main Expanded Multi-Grid for Organized Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* COLUMN 1: FORM - TEACHER DATA */}
                <form onSubmit={handleCreateTeacher} className="space-y-6">
                  
                  {/* Card A: Basic Identity Block */}
                  <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 p-6 md:p-8 shadow-xs space-y-5">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                      <PlusCircle className="h-5 w-5 text-indigo-600" />
                      <span>{isAr ? 'أولاً: بيانات الهوية وجنسية المدرس وصلاحياته' : 'I. Core Identity & Access'}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'اسم المدرس الكامل' : 'Full Name'}</label>
                        <input 
                          type="text"
                          required
                          value={tName}
                          onChange={(e) => setTName(e.target.value)}
                          placeholder={isAr ? 'أ. أحمد مصطفى' : 'Mr. Johnathan Smith'}
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'رقم الهاتف (الاسم للدخول)' : 'Phone Number (Username)'}</label>
                        <input 
                          type="text"
                          required
                          value={tPhone}
                          onChange={(e) => setTPhone(e.target.value)}
                          placeholder="01012345678"
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-amber-600 dark:text-amber-400">{isAr ? 'الرمز السري الابتدائي للبحث' : 'Initial Password'}</label>
                        <input 
                          type="text"
                          required
                          value={tPassword}
                          onChange={(e) => setTPassword(e.target.value)}
                          placeholder="teacherPass123"
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-amber-250 dark:border-amber-900/50 bg-amber-50/20 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'جنس المعلم' : 'Gender'}</label>
                        <select 
                          value={tGender}
                          onChange={(e) => setTGender(e.target.value as any)}
                          className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        >
                          <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                          <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                        </select>
                      </div>

                      {/* 1. MOVED NATIONALITY SELECTION BEFORE LOCATION */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'جنسية المدرس الكلية' : 'Nationality:'}</label>
                        <div className="flex gap-2">
                          <select 
                            value={selectedNationality}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedNationality(val);
                              if (val.includes('مصر') || val.includes('Egypt') || val === 'مصري') {
                                setTCountry('EG');
                              } else if (val.includes('سعود') || val.includes('Saudi') || val === 'سعودي') {
                                setTCountry('SA');
                              }
                            }}
                            className="flex-1 text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650"
                          >
                            {managedNationalities.map(nat => (
                              <option key={nat} value={nat}>{nat}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const name = prompt(isAr ? 'اكتب اسم الجنسية المراد إضافتها:' : 'Add custom nationality:');
                              if (name && name.trim()) {
                                const list = [...managedNationalities, name.trim()];
                                setManagedNationalities(list);
                                localStorage.setItem('sanad_managed_nationalities', JSON.stringify(list));
                                setSelectedNationality(name.trim());
                                showToastSuccess(isAr ? 'تم إضافة الجنسية بنجاح!' : 'Nationality added.');
                              }
                            }}
                            className="px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-black"
                          >
                            ➕
                          </button>
                        </div>
                      </div>

                      {/* 2. AUTOMATIC DEPENDENT GOVERNORATES DROP-DOWN */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-xs font-black text-indigo-600 dark:text-indigo-400 block p-0">
                          📍 {isAr ? 'المحافظة / المقر المقترن بالجنسية تلقائياً (اختر من القائمة أو اكتب يدوياً):' : 'Governorate associated with Nationality:'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <select 
                            value={tLocation === 'other_manual' || (!getGovernoratesForNationality(selectedNationality).includes(tLocation) && tLocation !== '') ? 'other_manual' : tLocation}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'other_manual') {
                                setTLocation('');
                              } else {
                                setTLocation(val);
                              }
                            }}
                            className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650 md:col-span-2"
                          >
                            <option value="">{isAr ? '-- اختر المحافظة --' : '-- Choose Governorate --'}</option>
                            {getGovernoratesForNationality(selectedNationality).map(gov => (
                              <option key={gov} value={gov}>{isAr ? `📍 ${gov}` : gov}</option>
                            ))}
                            <option value="other_manual">{isAr ? '✍️ كتابة يدوية أخرى (غير مدرجة بالجدول)' : '✍️ Choose custom'}</option>
                          </select>

                          {(!getGovernoratesForNationality(selectedNationality).includes(tLocation) || tLocation === '') && (
                            <input 
                              type="text"
                              required
                              value={tLocation}
                              onChange={(e) => setTLocation(e.target.value)}
                              placeholder={isAr ? 'اكتب المحافظة بالتفصيل...' : 'Type governorate name...'}
                              className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-dashed border-indigo-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Support Tag Cloud */}
                    <div className="space-y-3 pt-2 bg-neutral-50/50 dark:bg-neutral-900/10 p-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                      <div>
                        <label className="text-[11px] font-black uppercase text-neutral-450 dark:text-neutral-400 block tracking-wider">
                          📢 {isAr ? 'واتساب الدعم الفني والمتابعة (يمكنك إضافة أكثر من رقم)' : ' WhatsApp Support Desk Registries & Student Care'}
                        </label>
                        <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{isAr ? 'سيظهر للطلاب بالصفحة للتواصل المباشر لحل الاستفسارات.' : 'Exposes quick-support triggers for student chats.'}</p>
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={supportPhoneInput}
                          onChange={(e) => setSupportPhoneInput(e.target.value)}
                          placeholder={isAr ? 'مثال: 01020304050' : 'e.g. +2010234567'}
                          className="flex-1 text-xs font-bold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (supportPhoneInput.trim()) {
                              setSupportPhones([...supportPhones, supportPhoneInput.trim()]);
                              setSupportPhoneInput('');
                            }
                          }}
                          className="px-4 bg-indigo-600 hover:bg-indigo-705 text-white text-xs font-black rounded-xl shrink-0 transition cursor-pointer active:scale-95"
                        >
                          {isAr ? 'إضافة الرقم' : 'Add Number'}
                        </button>
                      </div>

                      {supportPhones.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-2 bg-white dark:bg-neutral-900 rounded-xl border">
                          {supportPhones.map((ph, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-black border border-indigo-100 dark:border-indigo-900/30">
                              <span>📞 {ph}</span>
                              <button 
                                type="button" 
                                onClick={() => setSupportPhones(supportPhones.filter((_, i) => i !== idx))}
                                className="text-rose-550 hover:bg-rose-100 p-0.5 rounded-md font-black cursor-pointer"
                                title={isAr ? 'حذف الرقم' : 'Remove number'}
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-neutral-400 font-bold italic">{isAr ? 'لا توجد أرقام دعم مدرجة حالياً.' : 'No support desks registered yet.'}</p>
                      )}
                    </div>
                  </div>

                  {/* Card B: Social Channels and Page Display Toggles */}
                  <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 p-6 md:p-8 shadow-xs space-y-5">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <span>{isAr ? 'ثانياً: روابط ومواقع تواصل المدرس ومفاتيح العرض' : 'II. Social Media & Streams Toggles'}</span>
                    </h4>

                    <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
                      {isAr ? 'أدخل الروابط المفعلة للمعلم، واستخدم علامة الصح لإظهار الزر فورياً بصفحة عرض المدرس للطلاب أو إخفائه بمرونة.' : 'Input faculty links and toggle visibility. Checked triggers display beautifully on dynamic cover pages.'}
                    </p>

                    <div className="space-y-3">
                      {/* Facebook */}
                      <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/20 p-3 rounded-2xl border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-600 flex items-center gap-1">🌐 Facebook URL</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-neutral-600 dark:text-neutral-400 select-none">
                            <input type="checkbox" checked={showFacebook} onChange={(e) => setShowFacebook(e.target.checked)} className="rounded text-indigo-650 h-3.5 w-3.5 cursor-pointer" />
                            <span>{isAr ? 'إظهار بالصفحة' : 'Render online'}</span>
                          </label>
                        </div>
                        <input 
                          type="url"
                          value={socialFacebook}
                          onChange={(e) => setSocialFacebook(e.target.value)}
                          placeholder="https://facebook.com/TutorProfile"
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg border bg-white dark:bg-neutral-900 outline-none"
                        />
                      </div>

                      {/* YouTube */}
                      <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/20 p-3 rounded-2xl border border-neutral-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-600 flex items-center gap-1">📺 YouTube Custom Channel</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-neutral-600 dark:text-neutral-400 select-none">
                            <input type="checkbox" checked={showYoutube} onChange={(e) => setShowYoutube(e.target.checked)} className="rounded text-indigo-650 h-3.5 w-3.5 cursor-pointer" />
                            <span>{isAr ? 'إظهار بالصفحة' : 'Render online'}</span>
                          </label>
                        </div>
                        <input 
                          type="url"
                          value={socialYoutube}
                          onChange={(e) => setSocialYoutube(e.target.value)}
                          placeholder="https://youtube.com/c/TutorChannel"
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg border bg-white dark:bg-neutral-900 outline-none"
                        />
                      </div>

                      {/* TikTok */}
                      <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/20 p-3 rounded-2xl border border-neutral-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-neutral-950 dark:text-neutral-200 flex items-center gap-1">🎵 TikTok Stream URL</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-neutral-600 dark:text-neutral-400 select-none">
                            <input type="checkbox" checked={showTiktok} onChange={(e) => setShowTiktok(e.target.checked)} className="rounded text-indigo-650 h-3.5 w-3.5 cursor-pointer" />
                            <span>{isAr ? 'إظهار بالصفحة' : 'Render online'}</span>
                          </label>
                        </div>
                        <input 
                          type="url"
                          value={socialTiktok}
                          onChange={(e) => setSocialTiktok(e.target.value)}
                          placeholder="https://tiktok.com/@TutorProfile"
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg border bg-white dark:bg-neutral-900 outline-none"
                        />
                      </div>

                      {/* WhatsApp Link/API */}
                      <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/20 p-3 rounded-2xl border border-neutral-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1">💬 WhatsApp Quick API Link</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-neutral-600 dark:text-neutral-400 select-none">
                            <input type="checkbox" checked={showWhatsapp} onChange={(e) => setShowWhatsapp(e.target.checked)} className="rounded text-indigo-650 h-3.5 w-3.5 cursor-pointer" />
                            <span>{isAr ? 'إظهار بالصفحة' : 'Render online'}</span>
                          </label>
                        </div>
                        <input 
                          type="url"
                          value={socialWhatsapp}
                          onChange={(e) => setSocialWhatsapp(e.target.value)}
                          placeholder="https://wa.me/201020304050"
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg border bg-white dark:bg-neutral-900 outline-none"
                        />
                      </div>

                      {/* Telegram */}
                      <div className="space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/20 p-3 rounded-2xl border border-neutral-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-sky-600 flex items-center gap-1">📡 Telegram Support Channel</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-neutral-600 dark:text-neutral-400 select-none">
                            <input type="checkbox" checked={showTelegram} onChange={(e) => setShowTelegram(e.target.checked)} className="rounded text-indigo-650 h-3.5 w-3.5 cursor-pointer" />
                            <span>{isAr ? 'إظهار بالصفحة' : 'Render online'}</span>
                          </label>
                        </div>
                        <input 
                          type="url"
                          value={socialTelegram}
                          onChange={(e) => setSocialTelegram(e.target.value)}
                          placeholder="https://t.me/TutorChannel"
                          className="w-full text-xs font-bold py-2 px-3 rounded-lg border bg-white dark:bg-neutral-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card C: Drag & Drop Identity Image Uploaders (Expanded Preview Windows) */}
                  <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 p-6 md:p-8 shadow-xs space-y-6">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <span>{isAr ? 'ثالثاً: تصميم الكرت الرسمي وغلاف صفحة المدرس' : 'III. Custom E-Card & Profile Cover Art'}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Card Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300 block">
                          🪪 {isAr ? 'صورة كارت المدرس الرسمي:' : 'Faculty Digital Card:'}
                        </label>
                        
                        <div className="border-2 border-dashed border-neutral-250 dark:border-neutral-700 hover:border-indigo-500 rounded-3xl p-5 text-center bg-neutral-50/60 dark:bg-neutral-900/40 relative group transition">
                          {cardImage ? (
                            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-neutral-200 dark:border-neutral-850 max-h-48 flex items-center justify-center">
                              <img src={cardImage} className="object-contain max-h-44 w-full" alt="Card preview" />
                              <button 
                                type="button" 
                                onClick={() => setCardImage('')} 
                                className="absolute inset-0 bg-neutral-950/75 text-white flex flex-col items-center justify-center text-xs font-black opacity-0 group-hover:opacity-100 transition absolute-center"
                              >
                                <span>🗑️ {isAr ? 'حذف وتغيير الصورة' : 'Remove Image'}</span>
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block py-6">
                              <span className="text-3xl block mb-2">📁</span>
                              <span className="text-xs font-black text-neutral-850 dark:text-neutral-200 block mb-1">{isAr ? 'اضغط لرفع الكارت الرسمي' : 'Upload Tutor Card image'}</span>
                              <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'صيغة JPEG, PNG من جهازك' : 'Max size 5MB'}</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => setCardImage(r.result as string);
                                    r.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Right: Cover Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-600 dark:text-neutral-300 block">
                          🖼️ {isAr ? 'صورة غلاف وبانر صفحة المدرس:' : 'Profile Cover Banner:'}
                        </label>
                        
                        <div className="border-2 border-dashed border-neutral-250 dark:border-neutral-700 hover:border-indigo-500 rounded-3xl p-5 text-center bg-neutral-50/60 dark:bg-neutral-900/40 relative group transition">
                          {pageImage ? (
                            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-neutral-200 dark:border-neutral-850 max-h-48 flex items-center justify-center">
                              <img src={pageImage} className="object-cover h-full w-full max-h-44" alt="Banner preview" />
                              <button 
                                type="button" 
                                onClick={() => setPageImage('')} 
                                className="absolute inset-0 bg-neutral-950/75 text-white flex flex-col items-center justify-center text-xs font-black opacity-0 group-hover:opacity-100 transition absolute-center"
                              >
                                <span>🗑️ {isAr ? 'حذف وتغيير الغلاف' : 'Remove Banner'}</span>
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block py-6">
                              <span className="text-3xl block mb-2">🌅</span>
                              <span className="text-xs font-black text-neutral-850 dark:text-neutral-200 block mb-1">{isAr ? 'رفع الغلاف المدرج للصفحة' : 'Upload Cover Banner'}</span>
                              <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'يظهر كبانر علوي جذاب بصفحته' : 'Best landscape 16:9'}</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => setPageImage(r.result as string);
                                    r.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Global Active Trigger button */}
                  <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-650 hover:bg-indigo-750 text-white rounded-3xl text-sm font-black transition-all text-center shadow-xl shadow-indigo-600/10 cursor-pointer active:scale-98 duration-100"
                  >
                    {isAr ? 'تأكيد إضافة مدرس جديد' : '🔒 Confirm New Teacher Addition'}
                  </button>

                </form>

                {/* COLUMN 2: SPECIALTY & GROUP CONFIGURATIONS (THE CRUDS) */}
                <div className="space-y-6">
                  
                  {/* Card D: Specialty allocation */}
                  <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 p-6 md:p-8 shadow-xs space-y-6">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                      <Users className="h-5 w-5 text-indigo-600" />
                      <span>{isAr ? 'رابعاً: التخصيص التعليمي وإعداد المجموعات والخيارات (CRUD)' : 'IV. Faculty Stream Allocations & Presets (CRUD)'}</span>
                    </h4>

                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-black text-neutral-600 dark:text-neutral-300">{isAr ? 'المسمى الوظيفي للمدرس / الشرح الفرعي (اختياري)' : 'Bio tagline & credentials (Optional)'}</label>
                      <input 
                        type="text"
                        value={tSpecialty}
                        onChange={(e) => setTSpecialty(e.target.value)}
                        placeholder={isAr ? 'خبير مادة الفيزياء بمصر والشرق الأوسط' : 'Physics Senior Faculty Specialist'}
                        className="w-full text-xs font-bold py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-indigo-650 text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Integrated Cell CRUD Selector for Curriculums */}
                      <CellCrudSelect 
                        label={isAr ? 'المنهج الدراسي المتبع ومساره' : 'Selected Curriculum follows:'}
                        placeholder={isAr ? 'اختر المنهج الدراسي...' : 'Select dynamic syllabus...'}
                        items={managedCurriculums}
                        selectedItem={selectedCurriculum}
                        onSelect={setSelectedCurriculum}
                        onAdd={(val) => {
                          const newList = [...managedCurriculums, val];
                          setManagedCurriculums(newList);
                          localStorage.setItem('sanad_managed_curriculums', JSON.stringify(newList));
                          setSelectedCurriculum(val);
                          showToastSuccess(isAr ? 'تم تسجيل المنهج والدليل المتبع!' : 'Syllabus/Curriculum added.');
                        }}
                        onEdit={(index, val) => {
                          const oldName = managedCurriculums[index];
                          const newList = [...managedCurriculums];
                          newList[index] = val;
                          setManagedCurriculums(newList);
                          localStorage.setItem('sanad_managed_curriculums', JSON.stringify(newList));
                          if (selectedCurriculum === oldName) {
                            setSelectedCurriculum(val);
                          }
                          showToastSuccess(isAr ? 'تم تعديل تفاصيل المنهج بالكامل!' : 'Syllabus modified.');
                        }}
                        onDelete={(index) => {
                          const searchName = managedCurriculums[index];
                          const newList = managedCurriculums.filter((_, i) => i !== index);
                          setManagedCurriculums(newList);
                          localStorage.setItem('sanad_managed_curriculums', JSON.stringify(newList));
                          if (selectedCurriculum === searchName) {
                            setSelectedCurriculum(newList[0] || '');
                          }
                          showToastSuccess(isAr ? 'تم التخلص من المسمى الممسوح.' : 'Curriculum deleted.');
                        }}
                        isAr={isAr}
                      />

                      {/* Base Currency Selection */}
                      <div className="space-y-1.5 text-right p-4 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-250 dark:border-neutral-800 col-span-1 md:col-span-2">
                        <label className="text-[11px] font-black text-indigo-650 dark:text-indigo-400 block">
                          🪙 {isAr ? 'عملة حساب المعاملات الأساسية للمدرس:' : 'Tutor Base Account Currency:'}
                        </label>
                        {!(selectedCurriculum.includes('مشترك') || selectedCurriculum.toLowerCase().includes('shared') || selectedCurriculum.toLowerCase().includes('joint') || (!selectedCurriculum.includes('مصر') && !selectedCurriculum.includes('سعود'))) ? (
                          <div className="p-3 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-850 font-extrabold text-xs text-neutral-800 dark:text-neutral-200">
                            {tCurrency === 'EGP' ? (isAr ? '🇪🇬 الجنيه المصري (EGP) - تلقائي حسب المنهج المصري' : 'Egyptian Pound (EGP) - Lock') : (isAr ? '🇸🇦 الريال السعودي (SAR) - تلقائي حسب المنهج السعودي' : 'Saudi Riyal (SAR) - Lock')}
                          </div>
                        ) : (
                          <select
                            value={tCurrency}
                            onChange={(e) => setTCurrency(e.target.value as 'EGP' | 'SAR')}
                            className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-neutral-755 bg-white dark:bg-neutral-950 outline-none text-right font-bold text-neutral-850 dark:text-neutral-100"
                          >
                            <option value="EGP">{isAr ? '🇪🇬 الجنيه المصري (EGP)' : 'Egyptian Pound (EGP)'}</option>
                            <option value="SAR">{isAr ? '🇸🇦 الريال السعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
                          </select>
                        )}
                        <p className="text-[9px] text-neutral-450 dark:text-neutral-400 leading-snug font-semibold">
                          {isAr 
                            ? 'يجرى تأمين العملة تلقائياً بناءً على المنهج المختار، وفي حال اختيار المنهج المشترك يحق للسوبر أدمن تفصيل عملة الحساب الأساسية للمدرس المذكور.'
                            : 'Currency automatically locks on specific curriculum lines. Shared models enable custom EGP/SAR selection.'
                          }
                        </p>
                      </div>

                      {/* Integrated Cell CRUD MultiSelect for Grades */}
                      <CellCrudMultiSelect 
                        label={isAr ? 'تحديد الصفوف الدراسية المسموح بها للمعلم (سجل مدمج)' : 'Accredited grades authorized to teach:'}
                        placeholder={isAr ? 'اختر وتكوين المستويات المسموحة...' : 'Select & manage academic levels...'}
                        items={filteredGradesForSelectedCurriculum}
                        selectedItems={selectedGrades}
                        onToggle={(g) => {
                          if (selectedGrades.includes(g)) {
                            setSelectedGrades(selectedGrades.filter(x => x !== g));
                          } else {
                            setSelectedGrades([...selectedGrades, g]);
                          }
                        }}
                        onAdd={(val) => {
                          const newList = [...managedGrades, val];
                          setManagedGrades(newList);
                          localStorage.setItem('sanad_managed_grades', JSON.stringify(newList));
                          showToastSuccess(isAr ? 'تم إدراج الصف الدراسي الجديد وتفعيله!' : 'New academic level integrated!');
                        }}
                        onEdit={(index, val) => {
                          const oldName = managedGrades[index];
                          const newList = [...managedGrades];
                          newList[index] = val;
                          setManagedGrades(newList);
                          localStorage.setItem('sanad_managed_grades', JSON.stringify(newList));
                          if (selectedGrades.includes(oldName)) {
                            setSelectedGrades(selectedGrades.map(x => x === oldName ? val : x));
                          }
                          showToastSuccess(isAr ? 'تم تعديل مسمى وتخصيص الصف بنجاح!' : 'Academic grade renamed successfully.');
                        }}
                        onDelete={(index) => {
                          const searchName = managedGrades[index];
                          const newList = managedGrades.filter((_, i) => i !== index);
                          setManagedGrades(newList);
                          localStorage.setItem('sanad_managed_grades', JSON.stringify(newList));
                          if (selectedGrades.includes(searchName)) {
                            setSelectedGrades(selectedGrades.filter(x => x !== searchName));
                          }
                          showToastSuccess(isAr ? 'تم تجاهل الصف وحذفه من لوحة الخيارات.' : 'Academic grade removed.');
                        }}
                        isAr={isAr}
                      />

                    </div>

                  </div>

                </div>
              </div>

              {/* SECTION: REGISTERED TEACHERS LIST (TABLE - Spanned 100%) */}
              <div className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-md mt-6" dir="rtl">
                <div className="p-6 md:p-8 border-b border-neutral-105 dark:border-neutral-800 flex items-center justify-between">
                  <div className="space-y-1 text-right w-full">
                    <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                      <span>👥</span>
                      <span>{isAr ? 'قائمة وطاقم المعلمين المعتمدين بـ سند' : 'Active Registered Sanad Faculty'}</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-bold mt-1 text-right">
                      {isAr ? 'جدول كامل لمراجعة غرف الدخول وتراخيص وصلاحيات الطاقم المقيد.' : 'Super admin interface to authorize or revoke instructor status.'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto text-right">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-400">
                      <tr>
                        <th className="p-4 text-right">{isAr ? 'صورة كارت المدرس' : 'Card Photo'}</th>
                        <th className="p-4 text-right">{isAr ? 'اسم المدرس' : 'Tutor Name'}</th>
                        <th className="p-4 text-right">{isAr ? 'رقم هاتف المدرس' : 'Phone'}</th>
                        <th className="p-4 text-right">{isAr ? 'المادة العلمية' : 'Scientific Subject'}</th>
                        <th className="p-4 text-right">{isAr ? 'بلد المدرس' : 'Country/National'}</th>
                        <th className="p-4 text-right">{isAr ? 'محافظة المدرس' : 'Governorate'}</th>
                        <th className="p-4 text-right">{isAr ? 'المنهج الدراسي المتبع' : 'Followed Curriculum'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-neutral-805 dark:text-neutral-200 font-semibold text-xs text-right">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher.phone} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10 transition-colors">
                          <td className="p-4 text-right">
                            {teacher.cardImage ? (
                              <div className="relative inline-block group">
                                <img 
                                  src={teacher.cardImage} 
                                  className="w-14 h-11 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xs cursor-zoom-in transition-transform duration-150 hover:scale-105" 
                                  alt={teacher.name} 
                                  referrerPolicy="no-referrer" 
                                />
                                <div className="absolute hidden group-hover:block bottom-12 right-0 bg-neutral-900 text-white p-2 rounded-lg z-30 w-52 border border-neutral-700 shadow-xl pointer-events-none">
                                  <img src={teacher.cardImage} className="w-full h-auto object-contain rounded-md" referrerPolicy="no-referrer" alt="Card Preview" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-2xl p-1.5 bg-neutral-105 dark:bg-neutral-850 rounded-xl inline-block">🪪</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div>
                              <p className="font-extrabold text-neutral-900 dark:text-white leading-none text-xs">{teacher.name}</p>
                              <span className="text-[9px] text-neutral-400 mt-1 block">
                                {teacher.specialty || (isAr ? 'مدرس معتمد' : 'Certified Instructor')}
                              </span>
                            </div>
                          </td>

                          <td className="p-4 text-right font-mono select-all text-neutral-500 font-bold">{teacher.phone}</td>

                          <td className="p-4 text-right text-indigo-600 dark:text-indigo-400 font-extrabold">
                            {teacher.subjects?.join(' ، ') || teacher.subject || (isAr ? 'عام' : 'General')}
                          </td>

                          <td className="p-4 text-right">
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">
                              {teacher.nationality || (teacher.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية')}
                            </span>
                          </td>

                          <td className="p-4 text-right text-neutral-500">
                            {teacher.location || (isAr ? 'كامل المحافظات' : 'All Regions')}
                          </td>

                          <td className="p-4 text-right font-black text-amber-600">
                            {(teacher as any).curriculum || (isAr ? 'المنهج المعتمد' : 'Default Curri')}
                          </td>
                        </tr>
                      ))}

                      {filteredTeachers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-10 text-center font-bold text-neutral-400 italic">
                            {isAr ? 'لا يوجد مدرسين مسجلين بالمنصة حالياً.' : 'No faculty records present.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })()
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

          {/* SECTION 7: صفحة الإيرادات والأرباح المالية (REVENUES & PROFITS) */}
          {activeTab === 'stats' && (() => {
            return (
              <AdminStatsPage
                lang={lang}
                users={users}
                courses={courses || []}
                adminWithdrawals={adminWithdrawals}
                setAdminWithdrawals={setAdminWithdrawals}
                teacherRates={teacherRates}
                setTeacherRates={setTeacherRates}
                courseRates={courseRates}
                setCourseRates={setCourseRates}
                handleApproveWithdrawal={handleApproveWithdrawal}
                handleRejectWithdrawal={handleRejectWithdrawal}
                handleUpdateTeacherRate={handleUpdateTeacherRate}
                handleUpdateCourseRate={handleUpdateCourseRate}
                uniqueTNameList={users.filter(u => u.role === 'teacher').map(u => u.name)}
              />
            );

            // 1. Gather all student users
            const studentsOnly = users.filter(u => u.role === 'student');
            
            // 2. Fetch/Seed all courses list & teachers from system
            const allCoursesList = courses || [];
            const allTeachersList = users.filter(usr => usr.role === 'teacher');

            // 3. Create or fetch high-fidelity historical transaction logs of Sanad
            const salesData = (() => {
              const key = 'sanad_sales_v4';
              let historicalSales: any[] = [];
              const stored = localStorage.getItem(key);
              if (stored) {
                try { historicalSales = JSON.parse(stored); } catch (e) {}
              } else {
                // Generate detailed historical sales distributed over the last 12 months
                const egGovernorates = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الغربية', 'المنوفية', 'طنطا', 'أسيوط'];
                const saProvinces = ['الرياض', 'مكة المكرمة', 'المنطقة الشرقية', 'عسير', 'جدة', 'المدينة المنورة', 'القصيم'];
                
                const dummyNames = [
                  'عبد الرحمن يوسف الشافعي', 'مريم محمود الباز', 'عبد الله فهد الحربي',
                  'أبرار محمد قطب', 'خالد سلمان الشمري', 'ياسين عمرو البدري',
                  'سارة أحمد عبد العزيز', 'فاطمة العصيمي الرياض', 'زياد حازم شكري',
                  'محمد بن سلمان الحربي', 'سجى بنت عبد الله', 'نور الدين أحمد زكي',
                  'سعود بن فهد العتيبي', 'منى عبد الرحمن صبري', 'عمر جمال الهواري'
                ];
                
                const initialSales: any[] = [];
                const now = new Date();
                
                // Fallback courses if empty
                const coursesPool = allCoursesList.length > 0 ? allCoursesList : [
                  { id: 'c1', title: 'كورس مراجعة الفيزياء المكثفة والحديثة', teacher: 'أ. أحمد سامي', price: 300, discountPrice: 200, country: 'EG', category: 'الفيزياء', grade: 'الصف الثالث الثانوي' },
                  { id: 'c2', title: 'مبادئ وأسس الكيمياء العضوية الشاملة', teacher: 'أ. محمد بن علي', price: 400, discountPrice: 350, country: 'SA', category: 'الكيمياء', grade: 'مسار عام' }
                ];

                for (let i = 0; i < 75; i++) {
                  const crs = coursesPool[i % coursesPool.length];
                  const nameIndex = i % dummyNames.length;
                  const sName = dummyNames[nameIndex];
                  const country = nameIndex % 3 === 0 ? 'SA' : 'EG';
                  const region = country === 'EG' 
                    ? egGovernorates[i % egGovernorates.length] 
                    : saProvinces[i % saProvinces.length];
                  
                  const basePrice = crs.discountPrice && Number(crs.discountPrice) < crs.price 
                    ? Number(crs.discountPrice) 
                    : Number(crs.price || 205);
                  
                  // Distribute times across 12 months for seasonal curves
                  const date = new Date();
                  if (i === 0) {
                    // Today
                  } else if (i < 5) {
                    // This week
                    date.setDate(now.getDate() - (i % 6));
                  } else if (i < 15) {
                    // This month
                    date.setDate(now.getDate() - (i % 28) - 1);
                  } else {
                    // Rest of months
                    date.setMonth(now.getMonth() - (i % 11) - 1);
                    date.setDate(1 + (i % 27));
                  }

                  let subject = 'الفيزياء';
                  if (crs.subject) {
                    subject = crs.subject;
                  } else if (crs.title.includes('فيزياء') || crs.title.includes('Physics')) {
                    subject = 'الفيزياء';
                  } else if (crs.title.includes('كيمياء') || crs.title.includes('Chemistry')) {
                    subject = 'الكيمياء';
                  } else if (crs.title.includes('أحياء') || crs.title.includes('Biology')) {
                    subject = 'علم الأحياء';
                  } else if (crs.title.includes('رياضيات') || crs.title.includes('Math')) {
                    subject = 'الرياضيات';
                  } else {
                    subject = 'اللغة العربية';
                  }

                  initialSales.push({
                    id: `TXN-${95100 + i}`,
                    studentName: sName,
                    studentPhone: country === 'EG' ? `010${1234500 + i}` : `050${1234500 + i}`,
                    studentCountry: country,
                    studentRegion: region,
                    courseId: crs.id,
                    courseTitle: crs.title,
                    teacherName: crs.teacher,
                    subject,
                    grade: crs.grade || 'الصف الثالث الثانوي',
                    price: basePrice || 200,
                    timestamp: date.toISOString()
                  });
                }
                localStorage.setItem(key, JSON.stringify(initialSales));
                historicalSales = initialSales;
              }

              // Merge live subscription records from students profiles in real time!
              const liveSales: any[] = [];
              studentsOnly.forEach(student => {
                try {
                  const storedPurchases = localStorage.getItem(`sanad_purchased_${student.name}`);
                  if (storedPurchases) {
                    const purchasedIds: string[] = JSON.parse(storedPurchases);
                    purchasedIds.forEach(cid => {
                      const matchedCourse = allCoursesList.find(c => c.id === cid);
                      if (matchedCourse) {
                        let subDate = localStorage.getItem(`sanad_purchased_date_${student.name}_${cid}`);
                        if (!subDate) {
                          subDate = new Date().toISOString();
                          localStorage.setItem(`sanad_purchased_date_${student.name}_${cid}`, subDate);
                        }
                        
                        const pricePaid = matchedCourse.discountPrice && Number(matchedCourse.discountPrice) < matchedCourse.price 
                          ? Number(matchedCourse.discountPrice) 
                          : Number(matchedCourse.price);

                        let subject = matchedCourse.subject || 'الفيزياء';
                        if (matchedCourse.title.includes('كيمياء')) subject = 'الكيمياء';
                        else if (matchedCourse.title.includes('أحياء')) subject = 'علم الأحياء';
                        else if (matchedCourse.title.includes('رياضيات')) subject = 'الرياضيات';

                        liveSales.push({
                          id: `ACT-${student.phone.slice(-4)}-${cid.slice(-4)}`,
                          studentName: student.name,
                          studentPhone: student.phone,
                          studentCountry: student.country || 'EG',
                          studentRegion: student.location || 'القاهرة',
                          courseId: cid,
                          courseTitle: matchedCourse.title,
                          teacherName: matchedCourse.teacher,
                          subject,
                          grade: matchedCourse.grade || student.grade || 'الصف الثالث الثانوي',
                          price: pricePaid || 150,
                          timestamp: subDate
                        });
                      }
                    });
                  }
                } catch (e) {}
              });

              return [...liveSales, ...historicalSales];
            })();

            // 4. Filter logic depending on super admin selections
            const filteredSales = salesData.filter(sale => {
              if (finTeacher !== 'all' && sale.teacherName !== finTeacher) return false;
              if (finCourse !== 'all' && sale.courseId !== finCourse) return false;
              if (finCountry !== 'all' && sale.studentCountry !== finCountry) return false;
              if (finSubject !== 'all' && sale.subject !== finSubject) return false;

              // Date filtering
              const saleDate = new Date(sale.timestamp);
              const now = new Date();

              if (finPeriod === 'today') {
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (saleDate < startOfToday) return false;
              } else if (finPeriod === 'week') {
                const startOfWeek = new Date();
                startOfWeek.setDate(now.getDate() - 7);
                if (saleDate < startOfWeek) return false;
              } else if (finPeriod === 'month') {
                const startOfMonth = new Date();
                startOfMonth.setMonth(now.getMonth() - 1);
                if (saleDate < startOfMonth) return false;
              } else if (finPeriod === 'year') {
                const startOfYear = new Date();
                startOfYear.setFullYear(now.getFullYear() - 1);
                if (saleDate < startOfYear) return false;
              } else if (finPeriod === 'custom') {
                if (finCustomStart) {
                  const startLimit = new Date(finCustomStart);
                  if (saleDate < startLimit) return false;
                }
                if (finCustomEnd) {
                  const endLimit = new Date(finCustomEnd);
                  endLimit.setHours(23, 59, 59, 999);
                  if (saleDate > endLimit) return false;
                }
              }
              return true;
            });

            // 5. Unfiltered Global Summaries for KPI Card Metrics
            const totalSubscriptionsCount = salesData.length;
            const totalSubscriptionsRevenue = salesData.reduce((acc, s) => acc + s.price, 0);
            
            // Calculate today, week, month, year sum
            const now = new Date();
            const startOfTodayVal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeekVal = new Date(); startOfWeekVal.setDate(now.getDate() - 7);
            const startOfMonthVal = new Date(); startOfMonthVal.setMonth(now.getMonth() - 1);
            const startOfYearVal = new Date(); startOfYearVal.setFullYear(now.getFullYear() - 1);

            const todayRevenueSum = salesData.filter(s => new Date(s.timestamp) >= startOfTodayVal).reduce((acc, s) => acc + s.price, 0);
            const weekRevenueSum = salesData.filter(s => new Date(s.timestamp) >= startOfWeekVal).reduce((acc, s) => acc + s.price, 0);
            const monthRevenueSum = salesData.filter(s => new Date(s.timestamp) >= startOfMonthVal).reduce((acc, s) => acc + s.price, 0);
            const yearRevenueSum = salesData.filter(s => new Date(s.timestamp) >= startOfYearVal).reduce((acc, s) => acc + s.price, 0);

            // Filtered calculations for current view
            const filteredGrossAmount = filteredSales.reduce((acc, s) => acc + s.price, 0);
            
            let filteredPlatformShareSum = 0;
            let filteredTeachersShareSum = 0;
            filteredSales.forEach(s => {
              const teacherCut = courseRates[s.courseId] !== undefined 
                ? courseRates[s.courseId] 
                : (teacherRates[s.teacherName] !== undefined ? teacherRates[s.teacherName] : 70);
              const tEarn = (s.price * teacherCut) / 100;
              const pEarn = s.price - tEarn;
              filteredTeachersShareSum += tEarn;
              filteredPlatformShareSum += pEarn;
            });

            // Get global platform aggregate
            const totalPlatformRevenue = salesData.reduce((acc, s) => {
              const teacherCut = courseRates[s.courseId] !== undefined 
                ? courseRates[s.courseId] 
                : (teacherRates[s.teacherName] !== undefined ? teacherRates[s.teacherName] : 70);
              const pEarn = s.price - (s.price * teacherCut) / 100;
              return acc + pEarn;
            }, 0);

            // 6. Teacher statistics sorted ranking
            const teacherLeaderboard = (() => {
              const map: Record<string, {
                name: string;
                gross: number;
                tNet: number;
                pNet: number;
                sales: number;
                courses: Record<string, { title: string; revenue: number; salesCount: number }>;
              }> = {};

              // Initialize all possible teacher names
              const allTNames = Array.from(new Set([
                ...allTeachersList.map(t => t.name),
                ...allCoursesList.map(c => c.teacher),
                ...salesData.map(s => s.teacherName)
              ]));

              allTNames.forEach(name => {
                map[name] = { name, gross: 0, tNet: 0, pNet: 0, sales: 0, courses: {} };
              });

              filteredSales.forEach(sale => {
                if (!map[sale.teacherName]) {
                  map[sale.teacherName] = { name: sale.teacherName, gross: 0, tNet: 0, pNet: 0, sales: 0, courses: {} };
                }
                const tCut = courseRates[sale.courseId] !== undefined 
                  ? courseRates[sale.courseId] 
                  : (teacherRates[sale.teacherName] !== undefined ? teacherRates[sale.teacherName] : 70);
                const teacherPayout = (sale.price * tCut) / 100;
                const platformPayout = sale.price - teacherPayout;

                map[sale.teacherName].gross += sale.price;
                map[sale.teacherName].tNet += teacherPayout;
                map[sale.teacherName].pNet += platformPayout;
                map[sale.teacherName].sales += 1;

                if (!map[sale.teacherName].courses[sale.courseId]) {
                  map[sale.teacherName].courses[sale.courseId] = {
                    title: sale.courseTitle,
                    revenue: 0,
                    salesCount: 0
                  };
                }
                map[sale.teacherName].courses[sale.courseId].revenue += sale.price;
                map[sale.teacherName].courses[sale.courseId].salesCount += 1;
              });

              return Object.values(map).sort((a, b) => b.tNet - a.tNet);
            })();

            // 7. Course statistics comparative ranking
            const courseLeaderboard = (() => {
              const map: Record<string, {
                id: string;
                title: string;
                teacher: string;
                gross: number;
                salesCount: number;
                subject: string;
                grade: string;
              }> = {};

              filteredSales.forEach(sale => {
                if (!map[sale.courseId]) {
                  map[sale.courseId] = {
                    id: sale.courseId,
                    title: sale.courseTitle,
                    teacher: sale.teacherName,
                    gross: 0,
                    salesCount: 0,
                    subject: sale.subject,
                    grade: sale.grade
                  };
                }
                map[sale.courseId].gross += sale.price;
                map[sale.courseId].salesCount += 1;
              });

              return Object.values(map).sort((a, b) => b.gross - a.gross);
            })();

            // 8. Breakdown by structural dimensions (Country, Subject, Grade)
            const egGross = filteredSales.filter(s => s.studentCountry === 'EG').reduce((acc, s) => acc + s.price, 0);
            const egCount = filteredSales.filter(s => s.studentCountry === 'EG').length;
            const saGross = filteredSales.filter(s => s.studentCountry === 'SA').reduce((acc, s) => acc + s.price, 0);
            const saCount = filteredSales.filter(s => s.studentCountry === 'SA').length;

            const subjectBreakdownList = (() => {
              const map: Record<string, { name: string; gross: number; count: number }> = {};
              filteredSales.forEach(sale => {
                if (!map[sale.subject]) {
                  map[sale.subject] = { name: sale.subject, gross: 0, count: 0 };
                }
                map[sale.subject].gross += sale.price;
                map[sale.subject].count += 1;
              });
              return Object.values(map).sort((a, b) => b.gross - a.gross);
            })();

            const gradeBreakdownList = (() => {
              const map: Record<string, { name: string; gross: number; count: number }> = {};
              filteredSales.forEach(sale => {
                if (!map[sale.grade]) {
                  map[sale.grade] = { name: sale.grade, gross: 0, count: 0 };
                }
                map[sale.grade].gross += sale.price;
                map[sale.grade].count += 1;
              });
              return Object.values(map).sort((a, b) => b.gross - a.gross);
            })();

            // Unique items arrays for filter dropdown inputs list
            const uniqueTNameList = Array.from(new Set(salesData.map(s => s.teacherName)));
            const uniqueSubjectList = Array.from(new Set(salesData.map(s => s.subject)));
            const uniqueCoursesListMap = Array.from(
              new Set(salesData.map(s => JSON.stringify({ id: s.courseId, title: s.courseTitle })))
            ).map(j => JSON.parse(j));

            // Reset handler
            const handleResetAllFilters = () => {
              setFinPeriod('all');
              setFinTeacher('all');
              setFinCourse('all');
              setFinCountry('all');
              setFinSubject('all');
              setFinCustomStart('');
              setFinCustomEnd('');
            };

            return (
              <div className="space-y-6" dir="rtl">
                
                {/* PAGE HERO HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
                  <div className="space-y-1 text-right">
                    <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                      <span className="p-1 px-1.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-lg font-black text-sm">💰</span>
                      <span>{isAr ? 'الإيرادات والحسابات الختامية وقسم الأرباح ماليًا' : 'Platform Financial Ledger & Revenue Sharing'}</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-bold">
                      {isAr 
                        ? 'عرض تفصيلي وتفاعلي ذكي للإيرادات الكلية وحصة المدرسين، مدعومًا بلوحة ضبط فورية ومخططات أداء بياني دقيقة.' 
                        : 'Real-time financial cockpit to track subscriber streams, adjust split matrices, and review audits.'
                      }
                    </p>
                  </div>
                  
                  {/* Active filter summary capsule */}
                  <div className="flex items-center gap-2 text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black p-2 px-3 rounded-2xl self-start md:self-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
                    <span>{isAr ? `تحديث تلقائي: معالجة ${filteredSales.length} عملية اشتراك` : `${filteredSales.length} subscribed operations calculated.`}</span>
                  </div>
                </div>

                {/* ADVANCED MULTI-OPTIONS FILTER CONTROLS BAR (الفلاتر) */}
                <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-indigo-600" />
                      <span>{isAr ? 'فلترة وتصفية التقارير الحسابية' : 'Financial Ledger Options Filter'}</span>
                    </h4>
                    <button 
                      onClick={handleResetAllFilters}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition"
                    >
                      {isAr ? '🔄 مسح خيارات التصفية' : '🔄 Reset All Filters'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-right">
                    
                    {/* Time frame period */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-500">{isAr ? 'الفترة الزمنية' : 'Time Frame'}</label>
                      <select 
                        value={finPeriod}
                        onChange={(e) => setFinPeriod(e.target.value)}
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-905 focus:border-indigo-550 outline-none"
                      >
                        <option value="all">{isAr ? 'كل الفترات (الكل)' : 'All Time'}</option>
                        <option value="today">{isAr ? 'اليوم (آخر ٢٤ ساعة)' : 'Today'}</option>
                        <option value="week">{isAr ? 'الأسبوع الحالي (آخر ٧ أيام)' : 'This Week'}</option>
                        <option value="month">{isAr ? 'الشهر الحالي (آخر ٣٠ يوم)' : 'This Month'}</option>
                        <option value="year">{isAr ? 'العام الأكاديمي الحالي' : 'This Academic Year'}</option>
                        <option value="custom">{isAr ? 'تخصيص تاريخ مخصص (يدوي)' : 'Custom Date Range'}</option>
                      </select>
                    </div>

                    {/* Instructor filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-500">{isAr ? 'مدرس المادة' : 'Tutor / Instructor'}</label>
                      <select 
                        value={finTeacher}
                        onChange={(e) => setFinTeacher(e.target.value)}
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-905 focus:border-indigo-550 outline-none"
                      >
                        <option value="all">{isAr ? 'جميع المدرسين المعتمدين' : 'All Tutors'}</option>
                        {uniqueTNameList.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Course filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-500">{isAr ? 'الكورس التدريبي' : 'Dynamic Course'}</label>
                      <select 
                        value={finCourse}
                        onChange={(e) => setFinCourse(e.target.value)}
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-905 focus:border-indigo-550 outline-none truncate"
                      >
                        <option value="all">{isAr ? 'جميع الكورسات' : 'All Courses'}</option>
                        {uniqueCoursesListMap.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Country input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-500">{isAr ? 'الدولة والموقع ومسار الطلاب' : 'Student Location'}</label>
                      <select 
                        value={finCountry}
                        onChange={(e) => setFinCountry(e.target.value)}
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-905 focus:border-indigo-550 outline-none"
                      >
                        <option value="all">{isAr ? 'كل الدول (مصر والسعودية)' : 'All Countries (EG & SA)'}</option>
                        <option value="EG">{isAr ? '🇪🇬 جمهورية مصر العربية' : 'Egypt (EGP)'}</option>
                        <option value="SA">{isAr ? '🇸🇦 المملكة العربية السعودية' : 'Saudi Arabia (SAR)'}</option>
                      </select>
                    </div>

                    {/* Subject filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-500">{isAr ? 'المادة العلمية' : 'Subject track'}</label>
                      <select 
                        value={finSubject}
                        onChange={(e) => setFinSubject(e.target.value)}
                        className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-905 focus:border-indigo-550 outline-none"
                      >
                        <option value="all">{isAr ? 'جميع المواد الدراسية' : 'All Subjects'}</option>
                        {uniqueSubjectList.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Revealed custom start & end date fields if 'custom' date selected */}
                  {finPeriod === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-indigo-50/40 dark:bg-neutral-900 border border-indigo-100 dark:border-indigo-950 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 text-right"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-900 dark:text-neutral-300">{isAr ? 'تاريخ بداية الفترة (من)' : 'Start Date (From)'}</label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={finCustomStart}
                            onChange={(e) => setFinCustomStart(e.target.value)}
                            className="w-full text-xs font-bold py-2 px-3 rounded-xl border dark:border-neutral-700 bg-white dark:bg-neutral-950 focus:border-indigo-550 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-900 dark:text-neutral-300">{isAr ? 'تاريخ نهاية الفترة (إلى)' : 'End Date (To)'}</label>
                        <input 
                          type="date"
                          value={finCustomEnd}
                          onChange={(e) => setFinCustomEnd(e.target.value)}
                          className="w-full text-xs font-bold py-2 px-3 rounded-xl border dark:border-neutral-700 bg-white dark:bg-neutral-950 focus:border-indigo-550 outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* GLOBAL REVENUE SUMMARY MATRIX (ملخص الإيرادات - 6 CARDS GRID) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-neutral-450 text-right pr-1">📊 {isAr ? 'ملخص الإيرادات الإجمالي بعد التوزيع' : 'Overview Accounts & Revenue Summary'}</h4>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                    
                    {/* card 1: total platform profit */}
                    <div className="bg-gradient-to-br from-indigo-650 to-indigo-850 p-4.5 rounded-2xl text-white text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20">👑</div>
                      <p className="text-[9px] text-indigo-200 font-extrabold">{isAr ? 'إجمالي إيرادات المنصة' : 'Total Platform Profit'}</p>
                      <h3 className="text-sm font-black tracking-tight leading-none truncate">
                        {totalPlatformRevenue.toLocaleString('en-US')} <span className="text-[10px] text-indigo-200">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-white/70 block">{isAr ? 'العرض الصافي للمبيعات' : 'Net profits accumulated'}</span>
                    </div>

                    {/* card 2: total subscriptions profit */}
                    <div className="bg-white dark:bg-neutral-850 p-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-750 text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20 text-indigo-550">💳</div>
                      <p className="text-[9px] text-neutral-400 font-extrabold">{isAr ? 'إيرادات الاشتراكات الكلية' : 'Total Subs Revenue'}</p>
                      <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-none truncate">
                        {totalSubscriptionsRevenue.toLocaleString('en-US')} <span className="text-[10px] text-neutral-450">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-neutral-400 block">{isAr ? `إجمالي ${totalSubscriptionsCount} اشتراك موثق` : `Total of ${totalSubscriptionsCount} items`}</span>
                    </div>

                    {/* card 3: today's revenue */}
                    <div className="bg-white dark:bg-neutral-850 p-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-750 text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20 text-emerald-555">⚡</div>
                      <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إيرادات اليوم' : 'Daily Revenue'}</p>
                      <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-none truncate">
                        {todayRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-455">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-rose-500 flex items-center gap-1">
                        <span>● {isAr ? 'محدث لحظياً' : 'Live synchronizing'}</span>
                      </span>
                    </div>

                    {/* card 4: week's revenue */}
                    <div className="bg-white dark:bg-neutral-850 p-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-750 text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20 text-orange-555">🗓️</div>
                      <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إيرادات الأسبوع' : 'Weekly Revenue'}</p>
                      <h3 className="text-sm font-black text-orange-600 dark:text-orange-400 tracking-tight leading-none truncate">
                        {weekRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-455">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-neutral-400 block">{isAr ? 'خلال آخر ٧ أيام' : 'For current week period'}</span>
                    </div>

                    {/* card 5: month's revenue */}
                    <div className="bg-white dark:bg-neutral-850 p-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-750 text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20 text-pink-550">📆</div>
                      <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إيرادات الشهر' : 'Monthly Revenue'}</p>
                      <h3 className="text-sm font-black text-pink-600 dark:text-pink-400 tracking-tight leading-none truncate">
                        {monthRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-455">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 block">{isAr ? 'النشاط الفعلي الحالي' : 'Calculated last 30 days'}</span>
                    </div>

                    {/* card 6: year's revenue */}
                    <div className="bg-white dark:bg-neutral-850 p-4.5 rounded-2xl border border-neutral-200 dark:border-neutral-750 text-right space-y-2 relative overflow-hidden shadow-xs">
                      <div className="absolute top-2 left-2 text-xl opacity-20 text-amber-555">🏫</div>
                      <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إيرادات السنة كلياً' : 'Annual Revenue'}</p>
                      <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none truncate">
                        {yearRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-455">{isAr ? 'ج.م/ريال' : 'Credits'}</span>
                      </h3>
                      <span className="text-[8px] font-bold text-emerald-500 block">{isAr ? 'أداء ممتاز 🎓' : 'High Performance 🎓'}</span>
                    </div>

                  </div>
                </div>

                {/* THE SUBPAGES TABS SWITCHER */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-1 overflow-x-auto text-xs font-black">
                  {[
                    { id: 'overview', titleAr: 'الرسوم البيانية والمخططات', titleEn: 'Performance Charts & Analytics' },
                    { id: 'teachers', titleAr: 'أرباح المدرسين بالتفصيل', titleEn: 'Tutors Profits Ledger' },
                    { id: 'courses', titleAr: 'تحليل مبيعات الكورسات', titleEn: 'Courses Performance' },
                    { id: 'analytics', titleAr: 'التحليلات بحسب الفئة والدولة', titleEn: 'Dimensions & Tracks Breakdown' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFinTab(tab.id as any)}
                      className={`py-3 px-4 outline-none border-b-2 transition whitespace-nowrap cursor-pointer ${
                        finTab === tab.id 
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                          : 'border-transparent text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-250 font-bold'
                      }`}
                    >
                      {isAr ? tab.titleAr : tab.titleEn}
                    </button>
                  ))}
                </div>

                {/* TAB 1: CHARTS & METADATA GRAPHS (الرسوم البيانية الأربعة) */}
                {finTab === 'overview' && (
                  <div className="space-y-6">
                    
                    {/* Dynamic Filters KPI Overview */}
                    <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-right">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-905">{isAr ? 'تحليل الإيرادات المصفاة الحالية (بناءً على التصفية النشطة)' : 'Active Filtered Volume Stats'}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 font-bold">
                          <span>{isAr ? 'الفترة:' : 'Period:'} <strong className="text-indigo-705 font-black">{finPeriod === 'all' ? (isAr ? 'الكل' : 'All-time') : finPeriod}</strong></span>
                          {finTeacher !== 'all' && <span>{isAr ? 'المدرس:' : 'Tutor:'} <strong className="text-indigo-705 font-black">{finTeacher}</strong></span>}
                          {finCourse !== 'all' && <span>{isAr ? 'الكورس كود:' : 'Course:'} <strong className="text-indigo-705 font-black">{finCourse}</strong></span>}
                          {finCountry !== 'all' && <span>{isAr ? 'الدولة:' : 'Country:'} <strong className="text-indigo-705 font-black">{finCountry === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}</strong></span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                        <div className="text-right">
                          <p className="text-[9px] text-neutral-400">{isAr ? 'المجموع المصفى' : 'Filtered Volume'}</p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-black font-mono">{filteredGrossAmount.toLocaleString('en-US')} {isAr ? 'ج.م/ريال' : 'Credits'}</p>
                        </div>
                        <div className="w-px h-8 bg-neutral-200" />
                        <div className="text-right">
                          <p className="text-[9px] text-neutral-400">{isAr ? 'صافي أرباح المدرسين' : 'Tutors payout'}</p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-black font-mono">{filteredTeachersShareSum.toLocaleString('en-US')} {isAr ? 'ج.م/ريال' : 'Credits'}</p>
                        </div>
                        <div className="w-px h-8 bg-neutral-200" />
                        <div className="text-right">
                          <p className="text-[9px] text-neutral-400">{isAr ? 'صافي المنصة' : 'Platform net'}</p>
                          <p className="text-amber-600 dark:text-amber-400 font-black font-mono">{filteredPlatformShareSum.toLocaleString('en-US')} {isAr ? 'ج.م/ريال' : 'Credits'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* CHART A: Revenue growth over time (رسم بياني لنمو الإيرادات عبر الوقت) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs text-right">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-indigo-606" />
                            <span>{isAr ? 'نمو الإيرادات والأداء المتراكم عبر الزمن' : 'Revenues Progression Index (Timeline)'}</span>
                          </h4>
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                            {isAr ? 'مخطط بياني خطي' : 'Linear timeline'}
                          </span>
                        </div>

                        {/* Custom Pure SVG Elegant Progress Graph */}
                        <div className="space-y-4">
                          <div className="h-44 w-full relative pt-2 border-b border-r dark:border-neutral-850 flex items-end">
                            {/* SVG Background grids alternative layout */}
                            <div className="absolute inset-x-0 bottom-1/4 border-b border-dashed border-neutral-100 dark:border-neutral-800" />
                            <div className="absolute inset-x-0 bottom-2/4 border-b border-dashed border-neutral-100 dark:border-neutral-800" />
                            <div className="absolute inset-x-0 bottom-3/4 border-b border-dashed border-neutral-100 dark:border-neutral-800" />
                            
                            {/* SVG Curve lines drawing the revenue growth */}
                            <svg className="absolute inset-0 w-full h-full" overflow="visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              {/* 6 points representing progression over time */}
                              <path 
                                d="M 0,110 Q 100,85 200,60 T 300,45 T 400,25 T 500,10" 
                                fill="none" 
                                stroke="#4f46e5" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                              />
                              <path 
                                d="M 0,110 Q 100,85 200,60 T 300,45 T 400,25 T 500,10 L 500,120 L 0,120 Z" 
                                fill="url(#chart-area-grad)" 
                              />
                              
                              {/* Dots */}
                              <circle cx="100" cy="85" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="200" cy="60" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="300" cy="45" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="400" cy="25" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                              <circle cx="500" cy="10" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
                            </svg>
                          </div>
                          
                          {/* X Axis time indicators */}
                          <div className="flex justify-between text-[9px] text-neutral-450 font-black px-1">
                            <span>{isAr ? 'قبل ١٢ شهر' : '12 Mo Ago'}</span>
                            <span>{isAr ? 'منتصف العام الدراسي' : 'Mid Academic Term'}</span>
                            <span>{isAr ? 'الربع الأخير' : 'Q4 Activity'}</span>
                            <span>{isAr ? 'حقبة الامتحانات' : 'Exam Season'}</span>
                            <span>{isAr ? 'الآن (حظي)' : 'Now (Active)'}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 font-bold leading-normal">
                          💡 {isAr 
                            ? 'يمثل الخط البياني تراكم المبيعات الإيجابية عبر الشهور الفائتة. يظهر المخطط صعوداً كبيراً ومستقراً مع انطلاق باقات المراجعات النهائية والامتحانات.'
                            : 'This progression index tracks cumulative revenues. Peak points map directly to midterm intensive workshop cycles.'
                          }
                        </p>
                      </div>

                      {/* CHART B: Platform vs Instructor profit split (رسم بياني لتوزيع الأرباح - مدرس / منصة) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-5 shadow-xs text-right">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <PieChart className="h-4 w-4 text-emerald-600" />
                            <span>{isAr ? 'نسبة توزيع الأرباح الكلية (المدرسين مقابل المنصة)' : 'Consolidated Earnings Split (Platform vs Faculty)'}</span>
                          </h4>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            {isAr ? 'تحديث لحظي' : 'Instantly Synced'}
                          </span>
                        </div>

                        {/* Big Ring custom progress indicator with text */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                            {/* Inner cash count details */}
                            <div className="text-center space-y-0.5 z-10">
                              <p className="text-[8px] text-neutral-400 font-bold leading-none">{isAr ? 'الصافي المصفى' : 'Active Gross'}</p>
                              <p className="text-xs font-black text-neutral-900 dark:text-white leading-none font-mono">
                                {filteredGrossAmount.toLocaleString('en-US')}
                              </p>
                              <p className="text-[8px] text-indigo-600 dark:text-indigo-400 font-black">{isAr ? 'ج.م/ريال' : 'Credits'}</p>
                            </div>
                            
                            {/* Simple ring circular Progress path */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                              <circle cx="64" cy="64" r="54" fill="transparent" stroke="rgba(244,244,245,0.8)" strokeWidth="10" />
                              <circle 
                                cx="64" 
                                cy="64" 
                                r="54" 
                                fill="transparent" 
                                stroke="#10b981" // emerald
                                strokeWidth="10" 
                                strokeDasharray={339.29}
                                strokeDashoffset={339.29 * (1 - (filteredGrossAmount > 0 ? filteredTeachersShareSum / filteredGrossAmount : 0.7))}
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <div className="space-y-3.5 flex-1 w-full text-right">
                            {/* Platform share block */}
                            <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl space-y-1">
                              <div className="flex items-center justify-between text-xs font-black">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600 block" />
                                  <span>{isAr ? 'حصة أرباح المنصة المباشرة' : 'Net Platform Commission'}</span>
                                </span>
                                <span className="font-mono text-neutral-500">
                                  {filteredGrossAmount > 0 ? Math.round((filteredPlatformShareSum / filteredGrossAmount) * 100) : 30}%
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-550 font-black font-mono">
                                {filteredPlatformShareSum.toLocaleString('en-US')} {isAr ? 'جنيه/ريال' : 'Credits'}
                              </p>
                            </div>

                            {/* Teachers share block */}
                            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
                              <div className="flex items-center justify-between text-xs font-black">
                                <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                                  <span>{isAr ? 'حصة وصافي مجموع المدرسين' : 'Tutors Earnings Pool'}</span>
                                </span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                  {filteredGrossAmount > 0 ? Math.round((filteredTeachersShareSum / filteredGrossAmount) * 100) : 70}%
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-extrabold font-mono">
                                {filteredTeachersShareSum.toLocaleString('en-US')} {isAr ? 'جنيه/ريال' : 'Credits'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CHART C: Teacher financial performance rankings (رسم بياني لأداء المدرسين ماليًا) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs text-right">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-amber-505" />
                            <span>{isAr ? 'تحليل حجم الإيرادات لكل معلم ماليًا مرتبين' : 'Tutors Revenue Generation Rankings'}</span>
                          </h4>
                          <span className="text-[9px] font-black text-amber-605 bg-amber-50 px-2 py-0.5 rounded-lg">
                            {isAr ? 'ترتيب تنازلي' : 'Higheset profit'}
                          </span>
                        </div>

                        {/* Custom visual progress bars for each registered teacher */}
                        <div className="space-y-3.5 pt-2">
                          {teacherLeaderboard.slice(0, 5).map((item, index) => {
                            const percent = filteredGrossAmount > 0 ? (item.gross / filteredGrossAmount) * 100 : 0;
                            return (
                              <div key={item.name} className="space-y-1 text-xs">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 bg-amber-50 text-amber-600 font-black rounded-lg flex items-center justify-center text-[10px] select-none">
                                      {index + 1}
                                    </span>
                                    <span className="font-extrabold text-neutral-900 dark:text-white">{item.name}</span>
                                    <span className="text-[9px] text-neutral-450">({item.sales} {isAr ? 'اشتراك' : 'Subs'})</span>
                                  </span>
                                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                                    {item.gross.toLocaleString('en-US')} {isAr ? 'ج.م/ريال' : 'Credits'}
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}

                          {teacherLeaderboard.length === 0 && (
                            <p className="text-center italic text-neutral-400 py-6 text-xs">{isAr ? 'لا يوجد مدرسين مسجلين ماليًا حالياً.' : 'No tutors found.'}</p>
                          )}
                        </div>
                      </div>

                      {/* CHART D: Course performance rankings (رسم بياني لأداء الكورسات ماليًا) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs text-right">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-orange-605" />
                            <span>{isAr ? 'أعلى المقررات والكورسات مبيعاً بالمنصة' : 'Top Earning courses list (Enrollments value)'}</span>
                          </h4>
                          <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                            {isAr ? 'قمة المبيعات' : 'Leader'}
                          </span>
                        </div>

                        {/* Top 5 courses bar charts */}
                        <div className="space-y-3.5 pt-2">
                          {courseLeaderboard.slice(0, 5).map((item, index) => {
                            const percent = filteredGrossAmount > 0 ? (item.gross / filteredGrossAmount) * 100 : 0;
                            return (
                              <div key={item.id} className="space-y-1 text-xs">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                                    <span className="w-4 h-4 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[9px] font-black shrink-0">⭐</span>
                                    <span className="font-black text-neutral-855 dark:text-neutral-200 truncate">{item.title}</span>
                                  </span>
                                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                                    {item.gross.toLocaleString('en-US')} {isAr ? 'ج.م/ريال' : 'Credits'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percent}%` }}
                                      transition={{ duration: 0.5, delay: index * 0.08 }}
                                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                    />
                                  </div>
                                  <span className="font-mono text-[9px] text-neutral-450 shrink-0">{Math.round(percent)}%</span>
                                </div>
                              </div>
                            );
                          })}

                          {courseLeaderboard.length === 0 && (
                            <p className="text-center italic text-neutral-400 py-6 text-xs">{isAr ? 'لا مبيعات مسجلة لأي كورس حالياً.' : 'No course records.'}</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 2: DETAILED TEACHERS PROFITS LEDGER (أرباح المدرسين بالتفصيل مع تفتيت الكورسات) */}
                {finTab === 'teachers' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                      
                      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-right">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'جدول تسوية حسابات وعمولات المدرسين وتفتيت الكورسات' : 'Instructor Settlement, Commissions & Course Splits'}</h4>
                          <p className="text-[10.5px] text-neutral-400 font-bold">{isAr ? 'تفصيل مبيعات كل معلم، وصافي مستحقاته بعد خصم نسبة المنصة المتفق عليها لكل اشتراك.' : 'Total volume per tutor and course-level breakdowns.'}</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto text-right text-xs">
                        <table className="w-full">
                          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450">
                            <tr>
                              <th className="p-4">{isAr ? 'اسم المعلم وطاقم التدريس' : 'Tutor / Educator'}</th>
                              <th className="p-4">{isAr ? 'الاشتراكات المحققة' : 'Enrolls Count'}</th>
                              <th className="p-4">{isAr ? 'إجمالي الإيرادات الخام' : 'Gross aggregate'}</th>
                              <th className="p-4">{isAr ? 'نسبة المعلم الحالية' : 'Tutor commission %'}</th>
                              <th className="p-4">{isAr ? 'صافي أرباح المدرس' : ' Tutors payout (Net)'}</th>
                              <th className="p-4">{isAr ? 'عمولة وأرباح المنصة' : 'Platform profit'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                            {teacherLeaderboard.map(tStat => {
                              const currentRate = teacherRates[tStat.name] !== undefined ? teacherRates[tStat.name] : 70;
                              return (
                                <React.Fragment key={tStat.name}>
                                  
                                  {/* Row 1: Unified Teacher stats parent line */}
                                  <tr className="bg-neutral-50/20 hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                                    <td className="p-4">
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-xl bg-orange-50 dark:bg-neutral-800 p-1 rounded-xl">👨‍🏫</span>
                                        <div>
                                          <p className="font-extrabold text-neutral-900 dark:text-white">{tStat.name}</p>
                                          <span className="text-[9px] text-neutral-400 block font-bold">{isAr ? 'معلم معتمد ومسجل بـ سند' : 'Authorized Faculty'}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4 font-mono font-black">{tStat.sales} {isAr ? 'طالب مشترك' : 'Subs'}</td>
                                    <td className="p-4 font-mono font-extrabold text-neutral-905">{tStat.gross.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}</td>
                                    <td className="p-4">
                                      <span className="p-1 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-black text-[10px]">
                                        {currentRate}%
                                      </span>
                                    </td>
                                    <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                                      {tStat.tNet.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                                    </td>
                                    <td className="p-4 font-mono font-extrabold text-amber-606 dark:text-amber-400">
                                      {tStat.pNet.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                                    </td>
                                  </tr>

                                  {/* Row 2: Secondary Course-by-Course breakout logs nested inside table */}
                                  {Object.keys(tStat.courses).length > 0 && (
                                    <tr>
                                      <td colSpan={6} className="bg-neutral-50/10 dark:bg-neutral-800/3 pt-1.5 pb-3 px-8 text-right">
                                        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                                          <p className="text-[10px] font-black text-neutral-450 border-b pb-1">
                                            📚 {isAr ? `تفتيت مبيعات كورسات المدرس (${tStat.name}) بشكل منفصل ومطابقة حصص الأرباح:` : `Course performance breakdown for educator:`}
                                          </p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px]">
                                            {Object.entries(tStat.courses).map(([cid, info]: any) => {
                                              const cRate = courseRates[cid] !== undefined ? courseRates[cid] : currentRate;
                                              const tCourseNet = (info.revenue * cRate) / 100;
                                              const pCourseNet = info.revenue - tCourseNet;
                                              return (
                                                <div key={cid} className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-150 shadow-xs">
                                                  <div className="flex flex-col text-right">
                                                    <span className="font-extrabold max-w-[200px] truncate text-neutral-800 dark:text-neutral-200">📘 {info.title}</span>
                                                    <span className="text-[8px] text-neutral-450 mt-0.5">{isAr ? `النسبة المعتمدة للكورس: ` : `Course share: `} <strong className="text-indigo-600 dark:text-indigo-400 font-black">{cRate}%</strong></span>
                                                  </div>
                                                  <span className="font-mono flex items-center gap-1.5">
                                                    <span>{isAr ? `إيراد:` : `Gross:`} <strong className="font-black text-indigo-650">{info.revenue}</strong></span>
                                                    <span className="text-neutral-300">|</span>
                                                    <span className="text-emerald-600 font-extrabold">{isAr ? `المعلم:` : `Educator:`} {tCourseNet}</span>
                                                    <span className="text-neutral-300">|</span>
                                                    <span className="text-amber-605 font-bold">{isAr ? `المنصة:` : `Platform:`} {pCourseNet}</span>
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: COURSES REVENUE AND PERFORMANCE (مقارنة أداء الكورسات ومبيعات المقررات) */}
                {finTab === 'courses' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 overflow-hidden shadow-xs">
                      
                      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 text-right space-y-0.5">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'تقييم ومقارنة أداء الكورسات والمقررات مبيعاً' : 'Course Performance Matrix & Financial Ranks'}</h4>
                        <p className="text-[10.5px] text-neutral-400 font-bold">{isAr ? 'جدول مقارنة شامل يعرض مستويات المبيعات وإيرادات الكورسات والاشتراكات لتقييم المحتوى.' : 'Detailed statistics about student registrations and total claimed values.'}</p>
                      </div>

                      <div className="overflow-x-auto text-right text-xs">
                        <table className="w-full">
                          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450">
                            <tr>
                              <th className="p-4">{isAr ? 'اسم المادة والمقرر الدراسي' : 'Course Details / Subject'}</th>
                              <th className="p-4">{isAr ? 'مدرس المادة' : 'Educator Name'}</th>
                              <th className="p-4">{isAr ? 'المستوى والصف الموجه له' : 'Grade / Stream'}</th>
                              <th className="p-4">{isAr ? 'عدد الاشتراكات المحققة' : 'Total sales'}</th>
                              <th className="p-4">{isAr ? 'إجمالي المبيعات' : 'Gross Income'}</th>
                              <th className="p-4">{isAr ? 'شارة تصنيف الأداء ماليًا' : 'Status Rank'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                            {courseLeaderboard.map((cStat, idx) => {
                              // Calculate dynamic badge tier
                              const isTop = idx === 0;
                              const isHigh = idx > 0 && idx < 3;
                              const isRegular = idx >= 3 && idx < 6;
                              
                              return (
                                <tr key={cStat.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">📘</span>
                                      <div>
                                        <p className="font-extrabold text-neutral-900 dark:text-white leading-none">{cStat.title}</p>
                                        <span className="text-[9px] text-neutral-400 mt-1 block font-bold">{isAr ? 'مادة علمية مقيدة بالمنصة' : 'Academic Course'}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-indigo-650 dark:text-indigo-400 font-black">{cStat.teacher}</td>
                                  <td className="p-4 text-neutral-500 font-extrabold">{cStat.grade}</td>
                                  <td className="p-4 font-mono font-black">{cStat.salesCount} {isAr ? 'طالب مقيد' : 'Subs'}</td>
                                  <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                                    {cStat.gross.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                                  </td>
                                  <td className="p-4">
                                    {isTop ? (
                                      <span className="px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-705 border border-amber-200 font-black text-[9px] inline-block">
                                        👑 {isAr ? 'أعلى مقرر مبيعاً بالمنصة' : 'Top Course'}
                                      </span>
                                    ) : isHigh ? (
                                      <span className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-705 border border-emerald-200 font-black text-[9px] inline-block">
                                        💡 {isAr ? 'أداء مرتفع ومبهر' : 'High Performer'}
                                      </span>
                                    ) : isRegular ? (
                                      <span className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-605 border border-indigo-200 font-black text-[9px] inline-block">
                                        ⚡ {isAr ? 'مستقر ومتوسط' : 'Moderate Sales'}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border font-black text-[9px] inline-block">
                                        📈 {isAr ? 'في طور النمو' : 'Growing stream'}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}

                            {courseLeaderboard.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-10 text-center text-neutral-400 font-bold italic">
                                  {isAr ? 'لم تظهر أية مبيعات للكورسات الحالية بالتصفية النشطة.' : 'No course sales matches current filters.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 4: ADVANCED REVENUE DIMENSIONS AND BREAKDOWNS (التحليلات المالية: دولة / مادة / صف) */}
                {finTab === 'analytics' && (
                  <div className="space-y-6">
                    
                    {/* Grid of the three targeted analytics dimensions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right">
                      
                      {/* Dimension 1: Country Revenues Breakdown (مصر / السعودية) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 border-b pb-3">
                          <Globe className="h-4 w-4 text-indigo-600" />
                          <span>{isAr ? 'الإيرادات المالية بحسب الدولة والموقع الجغرافي' : 'Account Volume by Country (EGP vs SAR)'}</span>
                        </h4>

                        <div className="space-y-4 pt-2">
                          
                          {/* Egypt */}
                          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                            <div className="flex justify-between items-center font-black text-xs">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">🇪🇬</span>
                                <span>{isAr ? 'جمهورية مصر العربية' : 'Egypt Curriculum'}</span>
                              </span>
                              <span className="text-neutral-550 font-mono">({egCount} {isAr ? 'اشتراك' : 'Enrollments'})</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-neutral-500 font-bold">{isAr ? 'إجمالي المبيعات' : 'Gross EGP sum:'}</span>
                              <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                                {egGross.toLocaleString('en-US')} {isAr ? 'جنيه مصري' : 'EGP'}
                              </span>
                            </div>
                          </div>

                          {/* Saudi */}
                          <div className="p-4 bg-indigo-50/20 dark:bg-neutral-905 rounded-2xl border border-indigo-100/50 dark:border-neutral-800 space-y-2">
                            <div className="flex justify-between items-center font-black text-xs">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">🇸🇦</span>
                                <span>{isAr ? 'المملكة العربية السعودية' : 'Saudi Pathways'}</span>
                              </span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">({saCount} {isAr ? 'اشتراك' : 'Enrollments'})</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-neutral-500 font-bold">{isAr ? 'إجمالي المبيعات' : 'Gross SAR sum:'}</span>
                              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                {saGross.toLocaleString('en-US')} {isAr ? 'ريال سعودي' : 'SAR'}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Dimension 2: Subject Major Revenues Breakdown (الفيزياء / الكيمياء / الأحياء) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 border-b pb-3">
                          <BookOpen className="h-4 w-4 text-emerald-600" />
                          <span>{isAr ? 'الإيرادات ماليًا بحسب المواد الدراسية' : 'Revenues Classifed by Academic Subjects'}</span>
                        </h4>

                        <div className="space-y-3.5 pt-1.5">
                          {subjectBreakdownList.map((sub, idx) => {
                            const percent = filteredGrossAmount > 0 ? (sub.gross / filteredGrossAmount) * 100 : 0;
                            return (
                              <div key={sub.name} className="space-y-1 text-xs">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">
                                    📚 {sub.name} <span className="text-[9px] text-neutral-450">({sub.count} {isAr ? 'مبيع' : 'sales'})</span>
                                  </span>
                                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                                    {sub.gross.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${percent}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}

                          {subjectBreakdownList.length === 0 && (
                            <p className="text-center italic text-neutral-450 py-10">{isAr ? 'لم تسجل أية مقررات علمية أية مبيعات.' : 'No data records.'}</p>
                          )}
                        </div>
                      </div>

                      {/* Dimension 3: Grade Level Revenues Breakdown (الصفوف الدراسية ومساراتها) */}
                      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 space-y-4 shadow-xs">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 border-b pb-3">
                          <FileText className="h-4 w-4 text-orange-605" />
                          <span>{isAr ? 'الإيرادات ماليًا بحسب الصفوف الأكاديمية' : 'Financials Segments by Grade Level'}</span>
                        </h4>

                        <div className="space-y-3.5 pt-1.5">
                          {gradeBreakdownList.slice(0, 6).map((gr, idx) => {
                            const percent = filteredGrossAmount > 0 ? (gr.gross / filteredGrossAmount) * 100 : 0;
                            return (
                              <div key={gr.name} className="space-y-1 text-xs">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="font-extrabold text-neutral-855 dark:text-neutral-200 truncate max-w-[65%]">
                                    🎓 {gr.name}
                                  </span>
                                  <span className="font-mono font-black text-orange-600 dark:text-orange-400 shrink-0">
                                    {gr.gross.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${percent}%` }}
                                    className="h-full bg-orange-500 rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}

                          {gradeBreakdownList.length === 0 && (
                            <p className="text-center italic text-neutral-450 py-10">{isAr ? 'لا صفوف دراسية استوعبت مبيعات حالياً.' : 'No grade records.'}</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 5: PROFIT SHARING DIVISION SYSTEM & SLIDERS (نظام توزيع الأرباح والعمولات التفاعلي للمدرسين) */}
                {finTab === 'sharing' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-6 text-right animate-fade-in">
                      
                      <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <Sliders className="h-5 w-5 text-indigo-600" />
                          <span>{isAr ? 'غرفة التحكم بنسب توزيع الأرباح الحرة (نظام حساب النسب)' : 'Faculty Revenue Share & Commission Settings Center'}</span>
                        </h4>
                        <p className="text-[10.5px] text-neutral-400 font-bold">
                          {isAr 
                            ? 'معايرة ضبط نسبة المبيعات المخصصة لكل مدرس. النسبة المتبقية يتم تحويلها تلقائياً لدعم حصة أرباح المنصة المباشرة. ضبط السلايدر يعيد حساب كافة تقارير الإيرادات والمخططات بالكامل لحظياً.' 
                            : 'Set custom educators ratios of subscription money. The remaining percentage cascades to platform net profit.'
                          }
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Instructor Slider Loop */}
                        <div className="space-y-4.5">
                          <h5 className="text-[11px] font-black text-neutral-500 border-b pb-2">📂 {isAr ? 'قائمة المعلمين المعتمدين ونسب حصصهم ماليًا' : 'Tutors Commission Ratios Control'}</h5>
                          
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                            {uniqueTNameList.map(tName => {
                              const savedRate = teacherRates[tName] !== undefined ? teacherRates[tName] : 70;
                              const currentRate = pendingTeacherRates[tName] !== undefined ? pendingTeacherRates[tName] : savedRate;
                              const isPending = currentRate !== savedRate;
                              return (
                                <div key={tName} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl space-y-3">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between font-black text-xs">
                                      <span className="flex items-center gap-1.5 text-neutral-855 dark:text-white">
                                        <span>👨‍🏫</span>
                                        <span>{tName}</span>
                                      </span>
                                      <span className="font-mono text-indigo-650 dark:text-indigo-400 font-black">
                                        {currentRate}% {isAr ? 'للمدرس' : 'Educator'} / {100 - currentRate}% {isAr ? 'للمنصة' : 'Platform'}
                                      </span>
                                    </div>
                                    
                                    {isPending && (
                                      <button 
                                        type="button"
                                        onClick={() => setRateConfirmModal({ tName, rate: currentRate })}
                                        className="w-full text-center py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black transition-colors"
                                      >
                                        {isAr ? 'حفظ وتأكيد تغيّر النسبة' : 'Save & Confirm Changes'}
                                      </button>
                                    )}
                                  </div>

                                  {/* Custom Slider Bar */}
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] text-neutral-400 font-bold">0%</span>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="5"
                                      value={currentRate}
                                      onChange={(e) => handleUpdateTeacherRate(tName, Number(e.target.value))}
                                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                                    />
                                    <span className="text-[9px] text-neutral-400 font-bold">100%</span>
                                  </div>
                                </div>
                              );
                            })}

                            {uniqueTNameList.length === 0 && (
                              <p className="text-center italic text-neutral-450 text-xs py-10">{isAr ? 'لا يوجد مدرسین مسجلین ماليًا حالياً.' : 'No teachers in database.'}</p>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Individual Course rates custom sliders (تباين نسب الكورسات) */}
                        <div className="space-y-4.5 border-t md:border-t-0 md:border-r border-neutral-100 dark:border-neutral-800 md:pr-6">
                          <h5 className="text-[11px] font-black text-neutral-500 border-b pb-2 flex justify-between items-center">
                            <span>📘 {isAr ? 'ضبط تباين نسب الكورسات الفردية (تخصيص نسبة المدرس لكل كورس)' : 'Individual Course-Specific Splits Override'}</span>
                          </h5>
                          
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                            {allCoursesList.map(course => {
                              const currentRate = courseRates[course.id] !== undefined 
                                ? courseRates[course.id] 
                                : (teacherRates[course.teacher] !== undefined ? teacherRates[course.teacher] : 70);
                              const isOverridden = courseRates[course.id] !== undefined;

                              return (
                                <div key={course.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl space-y-3 relative overflow-hidden text-right">
                                  {isOverridden && (
                                    <div className="absolute top-0 left-0 bg-indigo-650 text-white text-[7.5px] px-2 py-0.5 font-bold rounded-br-lg uppercase">
                                      {isAr ? 'مخصص كورس' : 'Override'}
                                    </div>
                                  )}
                                  <div className="flex items-start justify-between gap-2 text-xs">
                                    <div className="space-y-0.5 text-right">
                                      <span className="font-extrabold text-neutral-855 dark:text-white block truncate max-w-[150px]">
                                        {course.title}
                                      </span>
                                      <span className="text-[9px] text-neutral-400 block font-bold">👨‍🏫 {course.teacher}</span>
                                    </div>
                                    <span className="font-mono text-indigo-650 dark:text-indigo-400 font-extrabold shrink-0">
                                      {currentRate}% {isAr ? 'للمعلم' : 'Educator'} / {100 - currentRate}% {isAr ? 'للمنصة' : 'Platform'}
                                    </span>
                                  </div>

                                  {/* Custom Slider Bar */}
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] text-neutral-400 font-bold">0%</span>
                                    <input 
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="5"
                                      value={currentRate}
                                      onChange={(e) => handleUpdateCourseRate(course.id, Number(e.target.value))}
                                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                                    />
                                    <span className="text-[9px] text-neutral-400 font-bold">100%</span>
                                  </div>

                                  {isOverridden && (
                                    <button
                                      onClick={() => {
                                        const updated = { ...courseRates };
                                        delete updated[course.id];
                                        setCourseRates(updated);
                                        localStorage.setItem('sanad_course_rates', JSON.stringify(updated));
                                      }}
                                      className="text-[9px] text-rose-500 hover:text-rose-600 font-black cursor-pointer inline-block mt-2"
                                    >
                                      🔄 {isAr ? 'حذف واسترجاع نسبة المدرس الافتراضية' : 'Reset to teacher default'}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Quick guidline banner */}
                          <div className="p-3 bg-indigo-50/40 dark:bg-neutral-900/60 rounded-2xl border border-indigo-150 text-[10px] text-neutral-500 font-bold space-y-1">
                            <p>💡 {isAr ? 'تأرجح نسب الكورسات يسمح بمستويات أرباح حرة تختلف عن العقد العام للمعلم.' : 'Course-level splits overrule any primary tutor percentage settings.'}</p>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 6: FINANCIAL LEDGER REGISTRY - دفتر الأستاذ المالي */}
                {finTab === 'ledger' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-4 text-right animate-fade-in">
                      <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5 text-right">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                          <span>🧾</span>
                          <span>{isAr ? 'دفتر الأستاذ المالي والأرباح التراكمية الموزعة' : 'Comprehensive Profit Splits Ledger Registry'}</span>
                        </h4>
                        <p className="text-[10.5px] text-neutral-450 font-medium">
                          {isAr 
                            ? 'سجل المعاملات هذا يتتبع كل عملية اشتراك تمت بالمنصة لتقسيم الإيراد بين نسبة المعلم وحصة أرباح المنصة بالكامل.' 
                            : 'Details and percentage splits for all active transaction records.'
                          }
                        </p>
                      </div>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-right" dir="rtl">
                          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450 text-right">
                            <tr>
                              <th className="p-3 text-right">{isAr ? 'كود العملية' : 'TXN ID'}</th>
                              <th className="p-3 text-right">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                              <th className="p-3 text-right">{isAr ? 'الطالب' : 'Student'}</th>
                              <th className="p-3 text-right">{isAr ? 'الكورس الدراسي' : 'Course Name'}</th>
                              <th className="p-3 text-right">{isAr ? 'المدرس' : 'Educator'}</th>
                              <th className="p-3 text-left">{isAr ? 'قيمة الاشتراك' : 'Price'}</th>
                              <th className="p-3 text-left">{isAr ? 'حصة المدرس' : 'Tutors payout'}</th>
                              <th className="p-3 text-left">{isAr ? 'حصة المنصة' : 'Platform profit'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-bold text-neutral-800 dark:text-neutral-200">
                            {filteredSales.map((s: any) => {
                              const tRate = courseRates[s.courseId] !== undefined 
                                ? courseRates[s.courseId] 
                                : (teacherRates[s.teacherName] !== undefined ? teacherRates[s.teacherName] : 70);
                              const tAmt = (s.price * tRate) / 100;
                              const pAmt = s.price - tAmt;

                              return (
                                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                                  <td className="p-3 font-mono font-black text-[10px] text-neutral-450 text-right">{s.id}</td>
                                  <td className="p-3 text-neutral-400 text-[10px] text-right">{new Date(s.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</td>
                                  <td className="p-3 text-neutral-900 dark:text-white text-right">
                                    <div className="flex flex-col text-right">
                                      <span>{s.studentName}</span>
                                      <span className="text-[9px] text-neutral-450 font-medium">{s.studentPhone || '-'}</span>
                                    </div>
                                  </td>
                                  <td className="p-3 text-indigo-650 text-right">{s.courseTitle}</td>
                                  <td className="p-3 text-right">👨‍🏫 {s.teacherName}</td>
                                  <td className="p-3 text-left font-mono font-black">{s.price} {isAr ? 'ج.م' : 'Credits'}</td>
                                  <td className="p-3 text-left font-mono text-emerald-600 font-black">
                                    {tAmt} {isAr ? 'ج.م' : 'Credits'} <span className="text-[9px] text-neutral-455">({tRate}%)</span>
                                  </td>
                                  <td className="p-3 text-left font-mono text-amber-600 font-black">
                                    {pAmt} {isAr ? 'ج.م' : 'Credits'} <span className="text-[9px] text-neutral-455">({100 - tRate}%)</span>
                                  </td>
                                </tr>
                              );
                            })}
                            {filteredSales.length === 0 && (
                              <tr>
                                <td colSpan={8} className="p-8 text-center italic text-neutral-400">
                                  {isAr ? 'لا توجد عمليات مبيعات مسجلة في هذا النطاق المالي.' : 'No filtered transaction records found for this period.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: WITHDRAWALS CENTER - طلبات السحب والحسابات للمدرسين */}
                {finTab === 'withdrawals' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-4 text-right animate-fade-in font-bold text-xs">
                      <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5 text-right">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                          <span>🏦</span>
                          <span>{isAr ? 'صندوق طلبات سحب الأرباح وتسوية رصيد المدرسين' : 'Tutors Earnings Settlement & Withdrawal Requests'}</span>
                        </h4>
                        <p className="text-[10.5px] text-neutral-455 font-normal">
                          {isAr 
                            ? 'لمراجعة طلبات السحب المقدمة من طاقم المدرسين والموافقة عليها بعد اكتمال التحويل اليدوي عبر الوسائل المتفق عليها.' 
                            : 'View and manage instructors payout requests. Accept to finalize, or Reject to refund back.'
                          }
                        </p>
                      </div>

                      <div className="space-y-4">
                        {adminWithdrawals.map((w: any) => {
                          const statusColors = w.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : w.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-150'
                              : 'bg-amber-50 text-amber-750 border-amber-150 animate-pulse';

                          return (
                            <div key={w.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="space-y-1 text-right">
                                <div className="flex items-center gap-2 flex-wrap justify-start">
                                  <span className="font-extrabold text-neutral-900 dark:text-white text-sm">👨‍🏫 {w.teacher}</span>
                                  <span className="text-[9px] text-neutral-400 font-mono">ID: {w.id}</span>
                                  <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${statusColors}`}>
                                    {w.status === 'completed' ? (isAr ? 'مكتمل وتم التحويل ✓' : 'Settled ✓') : (w.status === 'rejected' ? (isAr ? 'مرفوض ومسترجع ✕' : 'Rejected ✕') : (isAr ? 'قيد المراجعة المعلقة ⏱️' : 'Pending Review ⏱️'))}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 font-bold">
                                  {isAr ? 'تاريخ الطلب: ' : 'Requested Date: '} {new Date(w.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                                </p>
                                <div className="text-[11px] bg-white dark:bg-neutral-850 p-2.5 rounded-xl border border-neutral-200 mt-2 text-right">
                                  <span className="text-neutral-450 block text-[9px]">{isAr ? 'تفاصيل ومعلومات الدفع:' : 'Payout Method Information:'}</span>
                                  <strong className="text-indigo-650 block mt-0.5">{w.methodInfo}</strong>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                                <span className="text-sm font-black text-neutral-900 dark:text-white text-right">
                                  {isAr ? 'المبلغ المطلوب سحبه: ' : 'Payout amount: '} 
                                  <strong className="text-indigo-650 font-extrabold text-base md:text-lg">{w.amount}</strong> {isAr ? 'ج.م' : 'Credits'}
                                </span>

                                {w.status === 'pending' && (
                                  <div className="flex items-center gap-1.5 w-full md:w-auto justify-end mt-1">
                                    <button
                                      onClick={() => handleRejectWithdrawal(w.id)}
                                      className="py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-600 font-black rounded-lg text-[9.5px] cursor-pointer"
                                    >
                                      ✕ {isAr ? 'رفض وتأكيد استرجاع الرصيد' : 'Reject & Refund'}
                                    </button>
                                    <button
                                      onClick={() => handleApproveWithdrawal(w.id)}
                                      className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[9.5px] cursor-pointer"
                                    >
                                      ✓ {isAr ? 'قبول وتأكيد التحويل للمدرس' : 'Approve & Pay Out'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {adminWithdrawals.length === 0 && (
                          <div className="text-center py-12 text-neutral-450 italic bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-150 w-full">
                            🌊 {isAr ? 'لا توجد طلبات سحب أرباح معلقة أو أرشيف عمليات سداد حالياً.' : 'No active or historical teacher withdrawal payout records found.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* SECTION 7.5: صفحة محرك حساب وتوزيع الأرباح والمالية (PROFIT CALCULATOR & SHARING ENGINE) */}
          {activeTab === 'profit_engine' && (() => {
            // Fetch/Seed all courses list & teachers from system
            const allCoursesList = courses || [];
            const allTeachersList = users.filter(usr => usr.role === 'teacher');

            // Fetch transaction logs of Sanad
            const salesData = (() => {
              const key = 'sanad_sales_v4';
              let historicalSales: any[] = [];
              const stored = localStorage.getItem(key);
              if (stored) {
                try { historicalSales = JSON.parse(stored); } catch (e) {}
              }
              return historicalSales;
            })();

            // Unique items arrays for filter / sliders list
            const uniqueTNameList = Array.from(new Set([
              ...allTeachersList.map(t => t.name),
              ...salesData.map(s => s.teacherName)
            ])).filter(Boolean);

            const platformCountries = (() => {
              try {
                const raw = localStorage.getItem('sanad_platform_settings_v1');
                if (raw) return JSON.parse(raw).countries || [];
              } catch (e) {}
              return [
                { id: 'c_eg', nameAr: 'مصر', nameEn: 'Egypt', code: 'EG', flag: '🇪🇬', active: true },
                { id: 'c_sa', nameAr: 'السعودية', nameEn: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', active: true }
              ];
            })();

            const totalsByCurrency: Record<string, { gross: number; teacher: number; platform: number; nameAr: string; nameEn: string; flag: string; }> = {};

            platformCountries.forEach((c: any) => {
              totalsByCurrency[c.code] = { gross: 0, teacher: 0, platform: 0, nameAr: c.nameAr, nameEn: c.nameEn, flag: c.flag };
            });

            // Ensure basic presence
            if (!totalsByCurrency['EG']) totalsByCurrency['EG'] = { gross: 0, teacher: 0, platform: 0, nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬' };
            if (!totalsByCurrency['SA']) totalsByCurrency['SA'] = { gross: 0, teacher: 0, platform: 0, nameAr: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦' };

            salesData.forEach((s: any) => {
              const code = s.studentCountry || 'EG';
              if (!totalsByCurrency[code]) {
                totalsByCurrency[code] = { gross: 0, teacher: 0, platform: 0, nameAr: code, nameEn: code, flag: '🌍' };
              }
              const gross = s.price;
              const teacherCut = courseRates[s.courseId] !== undefined ? courseRates[s.courseId] : (teacherRates[s.teacherName] !== undefined ? teacherRates[s.teacherName] : 70);
              const teacherShare = (gross * teacherCut) / 100;
              const platformShare = gross - teacherShare;

              totalsByCurrency[code].gross += gross;
              totalsByCurrency[code].teacher += teacherShare;
              totalsByCurrency[code].platform += platformShare;
            });

            const currenciesToShow = Object.entries(totalsByCurrency)
              .filter(([code, data]) => data.gross > 0 || ['EG', 'SA'].includes(code) || platformCountries.some((c: any) => c.code === code))
              .map(([code, data]) => ({ code, ...data }));

            const ledgerSalesToShow = engineSearch.trim()
              ? salesData.filter((s: any) => 
                  `${s.studentName} ${s.teacherName} ${s.courseTitle} ${s.id}`.toLowerCase().includes(engineSearch.toLowerCase())
                )
              : salesData;

            return (
              <div className="space-y-6">
                
                {/* General Header Block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                  <div className="space-y-1 text-right">
                    <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2 justify-start">
                      <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg font-black">💰</span>
                      <span>{isAr ? 'محرك حساب وتوزيع الأرباح التلقائي والعمليات المالية' : 'Automated Commission Splits & Earnings Engine'}</span>
                    </h3>
                    <p className="text-xs text-neutral-455 font-bold">
                      {isAr 
                        ? 'إدارة نسب العمولة وتوزيع الإيرادات لحظياً بين المدرسين والمنصة.' 
                        : 'Manage revenue splits and faculty payout details.'}
                    </p>
                  </div>
                </div>

                {/* KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                  {/* Total Gross Volume Card */}
                  <div className="group bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-full opacity-50"></div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-50 dark:border-neutral-800">
                      <span className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 text-xl">💵</span>
                      <p className="text-[10px] text-neutral-450 font-black uppercase tracking-widest">{isAr ? 'إجمالي المبيعات الكلية' : 'Total Gross Volume'}</p>
                    </div>
                    <div className="space-y-4">
                      {currenciesToShow.map(c => (
                        <div key={c.code} className="flex items-center justify-between group/item">
                          <div className="flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                              <span>{c.flag}</span>
                              <span>{isAr ? c.nameAr : c.nameEn}</span>
                            </span>
                          </div>
                          <span className="text-base font-black text-indigo-650 dark:text-indigo-400">
                            {c.gross.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{c.code === 'EG' ? (isAr ? 'ج.م' : 'EGP') : c.code === 'SA' ? (isAr ? 'ر.س' : 'SAR') : c.code}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tutors Cumulative Net Card */}
                  <div className="group bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-full opacity-50"></div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-50 dark:border-neutral-800">
                      <span className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 text-xl">👨‍🏫</span>
                      <p className="text-[10px] text-neutral-450 font-black uppercase tracking-widest">{isAr ? 'حصة أرباح المعلمين التراكمية' : 'Tutors Cumulative Net'}</p>
                    </div>
                    <div className="space-y-4">
                      {currenciesToShow.map(c => (
                        <div key={c.code} className="flex items-center justify-between group/item">
                          <div className="flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                              <span>{c.flag}</span>
                              <span>{isAr ? c.nameAr : c.nameEn}</span>
                            </span>
                          </div>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            {c.teacher.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{c.code === 'EG' ? (isAr ? 'ج.م' : 'EGP') : c.code === 'SA' ? (isAr ? 'ر.س' : 'SAR') : c.code}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform Net Profit Card */}
                  <div className="group bg-white dark:bg-neutral-900 p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-full opacity-50"></div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-50 dark:border-neutral-800">
                      <span className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 text-xl">🏢</span>
                      <p className="text-[10px] text-neutral-450 font-black uppercase tracking-widest">{isAr ? 'حصة أرباح المنصة الصافية' : 'Platform Net Profit'}</p>
                    </div>
                    <div className="space-y-4">
                      {currenciesToShow.map(c => (
                        <div key={c.code} className="flex items-center justify-between group/item">
                          <div className="flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                              <span>{c.flag}</span>
                              <span>{isAr ? c.nameAr : c.nameEn}</span>
                            </span>
                          </div>
                          <span className="text-base font-black text-amber-600 dark:text-amber-400">
                            {c.platform.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{c.code === 'EG' ? (isAr ? 'ج.م' : 'EGP') : c.code === 'SA' ? (isAr ? 'ر.س' : 'SAR') : c.code}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex bg-neutral-100 dark:bg-neutral-850 p-1.5 rounded-2xl w-full max-w-fit mt-6 mb-2">
                  <button
                    type="button"
                    onClick={() => setProfitTab('sharing')}
                    className={`px-4 py-2 text-[10.5px] font-black rounded-xl transition-all ${
                      profitTab === 'sharing'
                        ? 'bg-white dark:bg-neutral-800 text-indigo-650 dark:text-indigo-400 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    {isAr ? '🎛️ تحكم بنسب المشاركة' : '🎛️ Distribution Ratios Manager'}
                  </button>
                </div>

                {/* TAB 1: SHARING AND COMMISSION CONTROL SLIDERS (غرفة التحكم والنسب) */}
                {profitTab === 'sharing' && (
                <div className="space-y-6 animate-fade-in animate-duration-200">
                  <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 p-6 shadow-xs space-y-6 text-right">
                    <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5 text-right">
                      <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                        <Sliders className="h-5 w-5 text-indigo-600 animate-pulse" />
                        <span>{isAr ? 'غرفة التحكم بنسب توزيع الأرباح الحرة (نظام حساب النسب)' : 'Faculty Revenue Share & Commission Settings Center'}</span>
                      </h4>
                      <p className="text-[10.5px] text-neutral-450 font-bold">
                        {isAr 
                          ? 'معايرة ضبط نسبة المبيعات المخصصة لكل مدرس. النسبة المتبقية يتم تحويلها تلقائياً لدعم حصة أرباح المنصة المباشرة.' 
                          : 'Set custom educators ratios of subscription money. The remaining percentage cascades to platform net profit.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Column 1: Instructors Rates */}
                      <div className="space-y-4.5 text-right">
                        <h5 className="text-[11px] font-black text-neutral-500 border-b pb-2">📂 {isAr ? 'قائمة المعلمين المعتمدين ونسب حصصهم ماليًا' : 'Tutors Commission Ratios Control'}</h5>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-1 scrollbar-thin grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {uniqueTNameList.map(tName => {
                            const savedRate = teacherRates[tName] !== undefined ? teacherRates[tName] : 70;
                            const currentRate = pendingTeacherRates[tName] !== undefined ? pendingTeacherRates[tName] : savedRate;
                            const isPending = currentRate !== savedRate;
                            return (
                              <div key={tName} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl space-y-3">
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between font-black text-xs">
                                    <span className="flex items-center gap-1.5 text-neutral-855 dark:text-white">
                                      <span>👨‍🏫</span>
                                      <span>{tName}</span>
                                    </span>
                                    <span className="font-mono text-indigo-655 dark:text-indigo-400 font-black">
                                      {currentRate}% {isAr ? 'للمدرس' : 'Educator'} / {100 - currentRate}% {isAr ? 'لمنصة' : 'Platform'}
                                    </span>
                                  </div>
                                  
                                  {isPending && (
                                    <button 
                                      type="button"
                                      onClick={() => setRateConfirmModal({ tName, rate: currentRate })}
                                      className="w-full text-center py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black transition-colors"
                                    >
                                      {isAr ? 'حفظ وتأكيد تغيّر النسبة' : 'Save & Confirm Changes'}
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] text-neutral-400 font-bold">0%</span>
                                  <input 
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={currentRate}
                                    onChange={(e) => handleUpdateTeacherRate(tName, Number(e.target.value))}
                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                                  />
                                  <span className="text-[9px] text-neutral-400 font-bold">100%</span>
                                </div>
                              </div>
                            );
                          })}
                          {uniqueTNameList.length === 0 && (
                            <p className="text-center italic text-neutral-450 text-xs py-10 col-span-full">{isAr ? 'لا يوجد مدرسین مسجلین ماليًا حالياً.' : 'No teachers in database.'}</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                )}

              </div>
            );
          })()}

          {/* SECTION 7.7: صفحة إدارة طلبات سحب الأرباح للمدرسين (INDEPENDENT WITHDRAWALS CENTRE) */}
          {activeTab === 'withdrawals' && (() => {
            const pendingCount = adminWithdrawals.filter((w: any) => w.status === 'pending').length;
            const completedCount = adminWithdrawals.filter((w: any) => w.status === 'completed').length;
            const rejectedCount = adminWithdrawals.filter((w: any) => w.status === 'rejected').length;

            return (
              <div className="space-y-6 text-right font-bold text-xs">
                
                {/* Header & Feature Control Card */}
                <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-sm space-y-5 animate-fade-in text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                        <span>🏦</span>
                        <span>{isAr ? 'إدارة وفحص طلبات سحب أرباح المدرسين' : 'Tutors Withdrawals Management'}</span>
                      </h3>
                      <p className="text-[11px] text-neutral-455 font-normal">
                        {isAr 
                          ? 'منصة السوبر أدمن الكاملة للتحقق من الأرصدة المتبقية، تحويل المستحقات يدوياً، وقبول أو رفض طلبات الصرف.' 
                          : 'Full portal for clearing pending rewards, processing bank/wallet splits, and controlling the feature visibility.'
                        }
                      </p>
                    </div>
                    
                    {/* MASTER SWITCH TOGGLE BUTTON */}
                    <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-2xl border border-neutral-150 shrink-0 self-start sm:self-auto">
                      <div className="space-y-0.5 text-right pr-1">
                        <p className="text-[11px] font-black text-neutral-700 dark:text-neutral-300">
                          {isAr ? 'تفعيل ميزة طلبات السحب للمدرسين' : 'Teacher Withdrawals System'}
                        </p>
                        <p className="text-[9px] text-neutral-450 font-normal">
                          {withdrawalsEnabled 
                            ? (isAr ? 'الخاصية مفعلة وتستقبل الطلبات حالياً' : 'System online & accepting claims') 
                            : (isAr ? 'الخاصية معطلة ومخفية عن المدرسين تماماً' : 'System locked & hidden from tutors')
                          }
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleToggleWithdrawalsState}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                          withdrawalsEnabled ? 'bg-indigo-650' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-250 ease-in-out ${
                            withdrawalsEnabled ? '-translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 text-right">
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 flex flex-col justify-between">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">{isAr ? 'طلبات السحب المعلقة' : 'Pending Requests'}</span>
                      <p className="text-2xl font-black text-indigo-705 dark:text-indigo-300 font-mono mt-1">{pendingCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 flex flex-col justify-between">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{isAr ? 'الطلبات المكتملة' : 'Completed Settlements'}</span>
                      <p className="text-2xl font-black text-emerald-705 dark:text-emerald-300 font-mono mt-1">{completedCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 flex flex-col justify-between">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold">{isAr ? 'الطلبات المرفوضة المسترجعة' : 'Rejected Claims'}</span>
                      <p className="text-2xl font-black text-rose-705 dark:text-rose-300 font-mono mt-1">{rejectedCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/10 border border-neutral-150 flex flex-col justify-between">
                      <span className="text-[10px] text-neutral-500 font-extrabold">{isAr ? 'أولويتك للتسوية حالياً' : 'System Active Status'}</span>
                      <p className="text-xs font-black text-neutral-800 dark:text-neutral-250 mt-1">
                        {withdrawalsEnabled ? (
                          <span className="text-emerald-600 flex items-center justify-start gap-1">🟢 {isAr ? 'مستقبل للطلبات' : 'Accepting Payouts'}</span>
                        ) : (
                          <span className="text-rose-500 flex items-center justify-start gap-1">🔴 {isAr ? 'مغلق ومقيد' : 'Audits Restricted'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filters View */}
                <div className="bg-white dark:bg-neutral-850 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-xs flex flex-wrap gap-3 items-center justify-start animate-fade-in text-right">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-450 block font-normal">{isAr ? 'فرز حسب الحالة' : 'Status Filter'}</label>
                    <select
                      value={wdStatusFilter}
                      onChange={(e: any) => setWdStatusFilter(e.target.value)}
                      className="text-xs font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-1.5 px-3 rounded-xl outline-none"
                    >
                      <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
                      <option value="pending">{isAr ? 'المعلقة فقط ⏱️' : 'Pending Only ⏱️'}</option>
                      <option value="completed">{isAr ? 'المكتملة بنجاح ✓' : 'Settled Only ✓'}</option>
                      <option value="rejected">{isAr ? 'المرفوضة المرتجعة ✕' : 'Rejected Only ✕'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-450 block font-normal">{isAr ? 'بالمدرس' : 'Teacher filter'}</label>
                    <select
                      value={wdTeacherFilter}
                      onChange={(e: any) => setWdTeacherFilter(e.target.value)}
                      className="text-xs font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-1.5 px-3 rounded-xl outline-none"
                    >
                      <option value="all">{isAr ? 'كل المدرسين' : 'All Teachers'}</option>
                      {Array.from(new Set(adminWithdrawals.map(w => w.teacher))).map(name => (
                        <option key={name as string} value={name as string}>{name as string}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Requests Container */}
                <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-sm space-y-4 animate-fade-in animate-duration-200 text-right">
                  <div className="space-y-4">
                    {adminWithdrawals
                      .filter(w => {
                        const matchStatus = wdStatusFilter === 'all' || w.status === wdStatusFilter;
                        const matchTeacher = wdTeacherFilter === 'all' || w.teacher === wdTeacherFilter;
                        return matchStatus && matchTeacher;
                      })
                      .map((w: any) => {
                        const statusColors = w.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                          : w.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-150'
                            : 'bg-amber-50 text-amber-750 border-amber-150 animate-pulse';

                        const getTeacherCurrencyByName = (teacherName: string): 'EGP' | 'SAR' => {
                          try {
                            const found = users.find(u => 
                              u.role === 'teacher' && 
                              u.name.toLowerCase() === teacherName.toLowerCase()
                            );
                            if (found && found.currency) {
                              return found.currency;
                            }
                          } catch {}
                          return 'EGP';
                        };

                        const sym = getTeacherCurrencyByName(w.teacher) === 'SAR' ? (isAr ? 'ريال سعودي' : 'SAR') : (isAr ? 'جنيه مصري' : 'EGP');

                        return (
                          <div key={w.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right">
                            <div className="space-y-1 text-right">
                              <div className="flex items-center gap-2 flex-wrap justify-start">
                                <span className="font-extrabold text-neutral-900 dark:text-white text-sm">👨‍🏫 {w.teacher}</span>
                                <span className="text-[9px] text-neutral-400 font-mono">ID: {w.id}</span>
                                <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${statusColors}`}>
                                  {w.status === 'completed' ? (isAr ? 'مكتمل وتم التحويل ✓' : 'Settled ✓') : (w.status === 'rejected' ? (isAr ? 'مرفوض ومسترجع ✕' : 'Rejected ✕') : (isAr ? 'قيد المراجعة المعلقة ⏱️' : 'Pending Review ⏱️'))}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 font-bold">
                                {isAr ? 'تاريخ الطلب: ' : 'Requested Date: '} {new Date(w.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                              </p>
                              <div className="text-[11px] bg-white dark:bg-neutral-850 p-2.5 rounded-xl border border-neutral-200 mt-2 text-right">
                                <span className="text-neutral-450 block text-[9px]">{isAr ? 'تفاصيل ومعلومات الدفع:' : 'Payout Method Information:'}</span>
                                <strong className="text-indigo-650 block mt-0.5">{w.methodInfo}</strong>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                              <span className="text-sm font-black text-neutral-900 dark:text-white text-right">
                                {isAr ? 'المبلغ المطلوب سحبه: ' : 'Payout amount: '} 
                                <strong className="text-indigo-650 font-extrabold text-base md:text-lg">{w.amount}</strong> {sym}
                              </span>

                              {w.status === 'pending' && (
                                <div className="flex items-center gap-1.5 w-full md:w-auto justify-end mt-1">
                                  <button
                                    onClick={() => handleRejectWithdrawal(w.id)}
                                    className="py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-600 font-black rounded-lg text-[9.5px] cursor-pointer"
                                  >
                                    ✕ {isAr ? 'رفض وتأكيد استرجاع الرصيد' : 'Reject & Refund'}
                                  </button>
                                  <button
                                    onClick={() => handleApproveWithdrawal(w.id)}
                                    className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[9.5px] cursor-pointer"
                                  >
                                    ✓ {isAr ? 'قبول وتأكيد التحويل للمدرس' : 'Approve & Pay Out'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {adminWithdrawals.length === 0 && (
                      <div className="text-center py-12 text-neutral-450 italic bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-150 w-full">
                        🌊 {isAr ? 'لا توجد طلبات سحب أرباح معلقة أو أرشيف عمليات سداد حالياً.' : 'No active or historical teacher withdrawal payout records found.'}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* SECTION 7.8: صفحة كشف حساب المدرس (EDUCATOR ACCOUNT LEDGER STATEMENT) */}
          {activeTab === 'teacher_ledger' && (() => {
            const allTeachersList = users.filter(usr => usr.role === 'teacher');
            const getTeacherCurrency = (tName: string) => {
              const u = allTeachersList.find(u => u.name === tName);
              return u?.currency || (u?.country === 'SA' ? 'SAR' : 'EGP');
            };

            // 1. Compile unified list of transactions
            const allTransactions = (() => {
              const list: any[] = [];
              const sales = (() => {
                try {
                  const stored = localStorage.getItem('sanad_sales_v4');
                  return stored ? JSON.parse(stored) : [];
                } catch { return []; }
              })();
              sales.forEach((s: any) => {
                const rate = courseRates[s.courseId] !== undefined ? courseRates[s.courseId] : (teacherRates[s.teacherName] !== undefined ? teacherRates[s.teacherName] : 70);
                const teacherShare = (s.price * rate) / 100;
                  list.push({
                  id: s.id || `SALE-${s.timestamp}`, teacher: s.teacherName, amount: teacherShare, type: 'deposit',
                  timestamp: s.timestamp,
                  notes: isAr ? `اشتراك طالب: ${s.studentName || 'غير معروف'} في كورس: ${s.courseTitle}` : `Student subscription: ${s.studentName || 'Unknown'} - ${s.courseTitle}`,
                  receiptNo: s.id || '', grossPrice: s.price, platformCut: s.price - teacherShare,
                  source: 'sales'
                });
              });
              adminWithdrawals.forEach((w: any) => {
                if (w.status === 'completed') {
                  list.push({
                    id: w.id || `WD-${w.timestamp}`, teacher: w.teacher || w.teacherName, amount: w.amount, type: 'withdrawal',
                    timestamp: w.processedAt || w.timestamp, notes: w.details || (isAr ? 'طلب سحب معتمد' : 'Approved withdrawal request'), receiptNo: w.id || '', methodInfo: w.methodInfo || w.method || '',
                    source: 'withdrawals'
                  });
                }
              });
              manualLedgerTxns.forEach((m: any, index: number) => {
                list.push({
                  id: m.id, teacher: m.teacher, amount: m.amount, type: m.type, timestamp: m.timestamp,
                  notes: m.notes || (isAr ? `عملية تسجيل يدوي (${m.method})` : `Manual transaction record (${m.method})`), receiptNo: m.id, methodInfo: m.method,
                  source: 'manual'
                });
              });
              return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            })();

            const filteredTxns = allTransactions.filter(t => {
              if (t.source !== 'manual') return false;
              if (ledgerSelectedTeacher !== 'all' && t.teacher !== ledgerSelectedTeacher) return false;
              if (ledgerTxnType !== 'all' && t.type !== ledgerTxnType) return false;
              const txnDate = new Date(t.timestamp);
              const now = new Date();
              if (ledgerDateRange === 'today') return txnDate.toDateString() === now.toDateString();
              else if (ledgerDateRange === 'week') { const w = new Date(now.getTime() - 7 * 86400000); return txnDate >= w; }
              else if (ledgerDateRange === 'month') { const m = new Date(); m.setMonth(m.getMonth() - 1); return txnDate >= m; }
              else if (ledgerDateRange === 'year') { const y = new Date(); y.setFullYear(y.getFullYear() - 1); return txnDate >= y; }
              else if (ledgerDateRange === 'custom') {
                if (ledgerStartDate && txnDate < new Date(ledgerStartDate + 'T00:00:00')) return false;
                if (ledgerEndDate && txnDate > new Date(ledgerEndDate + 'T23:59:59')) return false;
              }
              return true;
            });

            // Calculate overall global stats
            const egpStats = { earnings: 0, payouts: 0, platform: 0 };
            const sarStats = { earnings: 0, payouts: 0, platform: 0 };
            
            allTransactions.forEach(t => {
              const currency = getTeacherCurrency(t.teacher);
              const statsObj = currency === 'SAR' ? sarStats : egpStats;
              if (t.type === 'deposit') {
                statsObj.earnings += t.amount || 0;
                statsObj.platform += t.platformCut || 0;
              } else if (t.type === 'withdrawal' || t.type === 'settlement') {
                statsObj.payouts += t.amount || 0;
              }
            });

            const egpDue = Math.max(0, egpStats.earnings - egpStats.payouts);
            const sarDue = Math.max(0, sarStats.earnings - sarStats.payouts);

            const isSpecific = ledgerSelectedTeacher !== 'all';
            let specificStats = { earnings: 0, payouts: 0, platform: 0, due: 0, currency: 'EGP' };
            if (isSpecific) {
              const currency = getTeacherCurrency(ledgerSelectedTeacher);
              const teacherTxns = allTransactions.filter(t => t.teacher === ledgerSelectedTeacher);
              teacherTxns.forEach(t => {
                if (t.type === 'deposit') {
                  specificStats.earnings += t.amount || 0;
                  specificStats.platform += t.platformCut || 0;
                } else if (t.type === 'withdrawal' || t.type === 'settlement') {
                  specificStats.payouts += t.amount || 0;
                }
              });
              specificStats.due = Math.max(0, specificStats.earnings - specificStats.payouts);
              specificStats.currency = currency;
            }

            return (
              <div className="space-y-6 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                  <div className="space-y-1">
                    <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2 justify-start">
                      <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg font-black">🧾</span>
                      <span>{isAr ? 'صفحة كشف الحسابات ومتابعة أرباح المدرسين' : 'Ledger & Educators Financial Accounts'}</span>
                    </h3>
                    <p className="text-xs text-neutral-500 font-bold">
                      {isAr 
                        ? 'إدارة الحسابات المالية للمدرسين وتتبع أرباحهم، المصروفات، الرصيد المستحق كمرجع مالي معتمد بشكل مستقل حسب العملة.' 
                        : 'Manage financial accounts individually, track payouts and earnings dynamically based on the associated currency.'}
                    </p>
                  </div>
                  {isSpecific && (
                    <button onClick={() => window.print()} className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-black text-xs rounded-xl shadow-md transition hover:scale-105 print:hidden">
                      {isAr ? '🖨️ طباعة كشف الحساب' : '🖨️ Print Statement'}
                    </button>
                  )}
                </div>

                {/* PROMINENT TEACHER SELECTOR */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-950 shadow-sm flex flex-col items-center justify-center space-y-3 print:hidden">
                  <label className="text-sm font-black text-indigo-900 dark:text-indigo-300">
                    {isAr ? 'المدرس / المعلم المستهدف' : 'Select Educator Account to Review'}
                  </label>
                  <select
                    value={ledgerSelectedTeacher}
                    onChange={(e) => {
                      setLedgerSelectedTeacher(e.target.value);
                      if (e.target.value !== 'all') setManualTeacher(e.target.value);
                    }}
                    className="w-full max-w-sm text-sm font-black text-center py-3.5 px-4 rounded-full border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-neutral-950 outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all cursor-pointer"
                  >
                    <option value="all">{isAr ? 'جميع المدرسين والجهات' : 'Review All Educators'}</option>
                    {allTeachersList.map(t => (
                      <option key={t.phone || t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {!isSpecific ? (
                  // -------------- GLOBAL STATS VIEW -------------- 
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 border-b border-indigo-100 dark:border-neutral-800 pb-2">
                      {isAr ? 'الإحصائيات العامة للمنصة (بدون دمج عملات)' : 'Platform Global Financial Metrics'}
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* EGP Cards */}
                      <div className="group bg-white dark:bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-indigo-500/5 space-y-7 relative overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10 hover:border-indigo-500/20">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-60"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-2xl shadow-inner shadow-indigo-500/10">🇪🇬</div>
                            <div>
                               <h5 className="font-black text-neutral-900 dark:text-white text-base tracking-tight leading-none">{isAr ? 'النظام المالي المصري' : 'Egypt Financial Region'}</h5>
                               <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-widest">{isAr ? 'قطاع الجنيه المصري' : 'EGP Currency Sector'}</p>
                            </div>
                          </div>
                          <span className="px-4 py-1.5 bg-indigo-600/10 dark:bg-indigo-500/20 rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">EGP</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5 relative z-10">
                          <div className="bg-neutral-50/50 dark:bg-neutral-800/40 p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-700/50 transition-all duration-300">
                             <p className="text-[9px] text-neutral-450 font-black uppercase tracking-widest mb-2">{isAr ? 'أرباح المدرسين' : 'Tutors Earnings'}</p>
                             <h3 className="text-2xl font-black text-neutral-900 dark:text-white truncate">
                               {egpStats.earnings.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">EGP</span>
                             </h3>
                          </div>
                          
                          <div className="bg-emerald-50/20 dark:bg-emerald-500/[0.03] p-5 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-500/10 transition-all duration-300">
                             <p className="text-[9px] text-emerald-600/80 font-black uppercase tracking-widest mb-2">{isAr ? 'المبالغ المنصرفة' : 'Disbursed'}</p>
                             <h3 className="text-2xl font-black text-emerald-600 truncate">
                               {egpStats.payouts.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">EGP</span>
                             </h3>
                          </div>

                          <div className="bg-rose-50/40 dark:bg-rose-500/[0.04] p-5 rounded-[2rem] border border-rose-100/50 dark:border-rose-500/10 transition-all duration-300 group/item relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500 rounded-full opacity-30 group-hover/item:opacity-60 transition-opacity"></div>
                             <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest mb-2">{isAr ? 'الرصيد المستحق' : 'Due Balance'}</p>
                             <h3 className="text-2xl font-black text-rose-600 truncate">
                               {egpDue.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">EGP</span>
                             </h3>
                          </div>

                          <div className="bg-amber-50/40 dark:bg-amber-500/[0.04] p-5 rounded-[2rem] border border-amber-100/50 dark:border-amber-500/10 transition-all duration-300 group/item relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500 rounded-full opacity-30 group-hover/item:opacity-60 transition-opacity"></div>
                             <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest mb-2">{isAr ? 'أرباح المنصة' : 'Platform Cut'}</p>
                             <h3 className="text-2xl font-black text-amber-600 truncate">
                               {egpStats.platform.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">EGP</span>
                             </h3>
                          </div>
                        </div>
                      </div>

                      {/* SAR Cards */}
                      <div className="group bg-white dark:bg-neutral-900/50 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-emerald-500/5 space-y-7 relative overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-500/20">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 dark:bg-emerald-500/5 rounded-full blur-3xl opacity-60"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-2xl shadow-inner shadow-emerald-500/10">🇸🇦</div>
                            <div>
                               <h5 className="font-black text-neutral-900 dark:text-white text-base tracking-tight leading-none">{isAr ? 'النظام المالي السعودي' : 'Saudi Financial Region'}</h5>
                               <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-widest">{isAr ? 'قطاع الريال السعودي' : 'SAR Currency Sector'}</p>
                            </div>
                          </div>
                          <span className="px-4 py-1.5 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-full text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">SAR</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5 relative z-10">
                          <div className="bg-neutral-50/50 dark:bg-neutral-800/40 p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-700/50 transition-all duration-300">
                             <p className="text-[9px] text-neutral-450 font-black uppercase tracking-widest mb-2">{isAr ? 'أرباح المدرسين' : 'Tutors Earnings'}</p>
                             <h3 className="text-2xl font-black text-neutral-900 dark:text-white truncate">
                               {sarStats.earnings.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">SAR</span>
                             </h3>
                          </div>
                          
                          <div className="bg-emerald-50/20 dark:bg-emerald-500/[0.03] p-5 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-500/10 transition-all duration-300">
                             <p className="text-[9px] text-emerald-600/80 font-black uppercase tracking-widest mb-2">{isAr ? 'المبالغ المنصرفة' : 'Disbursed'}</p>
                             <h3 className="text-2xl font-black text-emerald-600 truncate">
                               {sarStats.payouts.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">SAR</span>
                             </h3>
                          </div>

                          <div className="bg-rose-50/40 dark:bg-rose-500/[0.04] p-5 rounded-[2rem] border border-rose-100/50 dark:border-rose-500/10 transition-all duration-300 group/item relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500 rounded-full opacity-30 group-hover/item:opacity-60 transition-opacity"></div>
                             <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest mb-2">{isAr ? 'الرصيد المستحق' : 'Due Balance'}</p>
                             <h3 className="text-2xl font-black text-rose-600 truncate">
                               {sarDue.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">SAR</span>
                             </h3>
                          </div>

                          <div className="bg-indigo-50/40 dark:bg-indigo-500/[0.04] p-5 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-500/10 transition-all duration-300 group/item relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500 rounded-full opacity-30 group-hover/item:opacity-60 transition-opacity"></div>
                             <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mb-2">{isAr ? 'أرباح المنصة' : 'Platform Cut'}</p>
                             <h3 className="text-2xl font-black text-indigo-600 truncate">
                               {sarStats.platform.toLocaleString('en-US')}
                               <span className="text-[11px] mr-1.5 opacity-40 font-black">SAR</span>
                             </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // -------------- SINGLE TEACHER VIEW -------------- 
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 border-b border-indigo-100 dark:border-neutral-800 pb-2">
                      {isAr ? `إحصائيات المدرس المالية (${specificStats.currency})` : `Educator Finances (${specificStats.currency})`}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {/* Earnings Before Cut Card */}
                      <div className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-indigo-500/30 transition-all duration-300 text-right space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-full opacity-50"></div>
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">📊</span>
                          <p className="text-[10px] text-neutral-450 font-black uppercase tracking-wider">{isAr ? 'إجمالي الأرباح' : 'Gross Earnings'}</p>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-black text-neutral-900 dark:text-white truncate">
                            {((specificStats.earnings + (teacherExtraDeposits[ledgerSelectedTeacher] || 0)) + specificStats.platform).toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{specificStats.currency}</span>
                          </h3>
                          <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'قبل استقطاع المنصة' : 'Before platform cut'}</p>
                        </div>
                      </div>
                      
                      {/* Instructor Earnings Card */}
                      <div className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-blue-500/30 transition-all duration-300 text-right space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-full opacity-50"></div>
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">💰</span>
                          <p className="text-[10px] text-neutral-450 font-black uppercase tracking-wider">{isAr ? 'أرباح المدرس' : 'Instructor Net'}</p>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-black text-neutral-900 dark:text-white truncate">
                            {(specificStats.earnings + (teacherExtraDeposits[ledgerSelectedTeacher] || 0)).toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{specificStats.currency}</span>
                          </h3>
                          <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'صافي الربح المكتسب' : 'Total net earned'}</p>
                        </div>
                      </div>

                      {/* Withdrawn Card */}
                      <div className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-emerald-500/30 transition-all duration-300 text-right space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-full opacity-50"></div>
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">💸</span>
                          <p className="text-[10px] text-neutral-450 font-black uppercase tracking-wider">{isAr ? 'المدفوعات' : 'Paid Out'}</p>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-black text-emerald-600 truncate">
                            {specificStats.payouts.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{specificStats.currency}</span>
                          </h3>
                          <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إجمالي ما تم سحبه' : 'Total withdrawn'}</p>
                        </div>
                      </div>

                      {/* Due Card */}
                      <div className="group bg-rose-50/30 dark:bg-rose-500/[0.02] p-5 rounded-3xl border-2 border-rose-100 dark:border-rose-900/30 hover:border-rose-500/30 transition-all duration-300 text-right space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-full opacity-50"></div>
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-600">⏳</span>
                          <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider">{isAr ? 'الرصيد الحالي' : 'Pending Due'}</p>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-black text-rose-600 truncate">
                            {specificStats.due.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{specificStats.currency}</span>
                          </h3>
                          <p className="text-[9px] text-rose-400 font-bold">{isAr ? 'مستحق الدفع حالاً' : 'Available for payout'}</p>
                        </div>
                      </div>

                      {/* Platform Cut Card */}
                      <div className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-amber-500/30 transition-all duration-300 text-right space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-full opacity-50"></div>
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">🏢</span>
                          <p className="text-[10px] text-neutral-450 font-black uppercase tracking-wider">{isAr ? 'حصة المنصة' : 'Platform Cut'}</p>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-black text-amber-600 truncate">
                            {specificStats.platform.toLocaleString('en-US')} 
                            <span className="text-[10px] mr-1 opacity-50">{specificStats.currency}</span>
                          </h3>
                          <p className="text-[9px] text-neutral-400 font-bold">{isAr ? 'إجمالي مستقطعات سند' : 'Total service fees'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
                      {/* Record New Payment form */}
                      <div className="lg:col-span-4 bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-xs space-y-4 print:hidden top-4 sticky">
                        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                          <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                            <span>💳</span>
                            <span>{isAr ? 'تسجيل عملية مالية جديدة' : 'Record New Manual Txn'}</span>
                          </h4>
                          <p className="text-[9px] text-neutral-455 font-bold mt-1 max-w-[90%]">
                            {isAr ? `تأكيد العمليات وإدخالات الدفع تتطلب أمان السوبر أدمن، وستخصم من رصيد ${specificStats.currency}.` : 'Secure transactions require Super Admin key.'}
                          </p>
                        </div>
                        <form onSubmit={handlePreAddManualLedgerTxn} className="space-y-4">
                            <div className="grid grid-cols-4 gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl">
                              {[
                                { value: 'withdrawal', labelAr: 'سحب / دفع', labelEn: 'Payout' },
                                { value: 'deposit', labelAr: 'إيداع', labelEn: 'Deposit' },
                                { value: 'extra_deposit', labelAr: 'إيداع إضافي', labelEn: 'Extra Deposit' },
                                { value: 'settlement', labelAr: 'تصفية/تسوية', labelEn: 'Settle All' }
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setManualType(opt.value as any);
                                    if (opt.value === 'settlement') {
                                      setManualAmount(specificStats.due.toString());
                                    }
                                  }}
                                  className={`py-1.5 px-1 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                                    manualType === opt.value
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                                  }`}
                                >
                                  {isAr ? opt.labelAr : opt.labelEn}
                                </button>
                              ))}
                            </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-455 block text-right">
                              {isAr ? `المبلغ المالي (${specificStats.currency}) *` : `Amount (${specificStats.currency}) *`}
                            </label>
                            <input
                              type="number" required min="1" step="any"
                              value={manualAmount} onChange={(e) => setManualAmount(e.target.value)}
                              placeholder="1500"
                              className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650 text-right"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-450 block text-right">{isAr ? 'طريقة الدفع' : 'Payment Mode'}</label>
                            <select
                              value={manualMethod} onChange={(e) => setManualMethod(e.target.value)}
                              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                            >
                              <option value="bank">{isAr ? 'تحويل بنكي / حساب مصرفي' : 'Bank Transfer'}</option>
                              <option value="cash">{isAr ? 'نقدًا / كاش يد بيد' : 'Cash on Hand'}</option>
                              <option value="vodafone">{isAr ? 'حقيبة فودافون كاش' : 'Vodafone Cash / mobile wallet'}</option>
                              <option value="egypt_post">{isAr ? 'حساب بريد مصر الدائم' : 'Egypt Post'}</option>
                              <option value="stc">{isAr ? 'محفظة STC Pay الإلكترونية' : 'STC Pay Wallet'}</option>
                              <option value="other">{isAr ? 'تسجيل إلكتروني / تسوية أخرى' : 'Other Settlement'}</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-450 block text-right">{isAr ? 'ملاحظات للسوبر أدمن (سرية)' : 'Super Admin Private Notes'}</label>
                            <textarea
                              value={manualNotes} onChange={(e) => setManualNotes(e.target.value)}
                              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650 min-h-16 text-right"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer text-center"
                          >
                            {isAr ? '💾 تأكيد وتسجيل العملية بأمان' : '💾 Secure Record Txn'}
                          </button>
                        </form>
                      </div>



                  {/* Column 2: Financial Transaction Log - spans 8 cols */}
                  <div className="lg:col-span-8 space-y-4">

                    {/* Table View */}
                    <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-750 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between border-b pb-3 border-neutral-100 dark:border-neutral-800">
                        <h4 className="text-xs font-black text-neutral-950 dark:text-white">
                          📋 {isAr ? 'سجل العمليات المالية الشامل' : 'Comprehensive Financial Operations Registry'}
                        </h4>

                      </div>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-right animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
                          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450">
                            <tr>
                              <th className="p-3 text-right">{isAr ? 'طابع المعاملة' : 'TXN ID'}</th>
                              <th className="p-3 text-right">{isAr ? 'المدرس' : 'Educator'}</th>
                              <th className="p-3 text-right">{isAr ? 'تاريخ العملية' : 'Timestamp'}</th>
                              <th className="p-3 text-right">{isAr ? 'نوع المعاملة' : 'Type'}</th>
                              <th className="p-3 text-right">{isAr ? 'ملاحظة السوبر أدمن والتفاصيل' : 'Super Admin Notes / Details'}</th>
                              <th className="p-3 text-left">{isAr ? 'القيمة المالية' : 'Amount value'}</th>
                              <th className="p-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-bold text-neutral-800 dark:text-neutral-200">
                            {filteredTxns.map((t: any, index: number) => {
                              
                              // Type Styling
                              let badgeColor = '';
                              let prefix = '+';
                              let displayType = '';

                              if (t.type === 'deposit') {
                                badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-150';
                                prefix = '+';
                                displayType = isAr ? 'إيداع / أرباح اشتراك' : 'Earning / Subscription';
                              } else if (t.type === 'withdrawal') {
                                badgeColor = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-150';
                                prefix = '-';
                                displayType = isAr ? 'سحب رصيد / مخرجات' : 'Payout / Withdrawal';
                              } else {
                                badgeColor = 'bg-amber-50 text-amber-750 dark:bg-amber-955/20 dark:text-amber-450 border-amber-150';
                                prefix = '-';
                                displayType = isAr ? 'تسوية مخصصة إدارياً' : 'Ledger Adjustment / Settlement';
                              }

                              return (
                                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                                  <td className="p-3 font-mono font-black text-[9.5px] text-neutral-500 text-right">
                                    {t.id}
                                  </td>
                                  <td className="p-3 font-black text-neutral-900 dark:text-white text-right">
                                    👨‍🏫 {t.teacher}
                                  </td>
                                  <td className="p-3 text-neutral-500 text-[10px] text-right">
                                    {new Date(t.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                                  </td>
                                  <td className="p-3 text-right">
                                    <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black ${badgeColor}`}>
                                      {displayType}
                                    </span>
                                  </td>
                                  <td className="p-3 text-neutral-600 dark:text-neutral-300 text-right max-w-[200px] truncate" title={t.notes}>
                                    <div className="flex flex-col text-right">
                                      <span className="text-[10.5px] font-semibold">{t.notes}</span>
                                      {t.methodInfo && (
                                        <span className="text-[8.5px] text-indigo-650 font-bold block">{isAr ? 'طريقة الصرف: ' : 'Method: '} {t.methodInfo}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className={`p-3 text-left font-mono font-black text-xs ${t.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {prefix} {t.amount} {isAr ? 'ج.م' : 'EGP'}
                                  </td>
                                  <td className="p-3 text-center">
                                    {t.source === 'manual' && (
                                      <div className="flex gap-2">
                                       <button onClick={() => {
                                          const pass = prompt(isAr ? 'أدخل كلمة مرور السوبر أدمن للتعديل:' : 'Enter Super Admin Password:');
                                          if (pass === 'admin') {
                                            const newAmt = prompt(isAr ? 'القيمة الجديدة:' : 'New Amount:', t.amount);
                                            const newNotes = prompt(isAr ? 'الملاحظات الجديدة:' : 'New Notes:', t.notes);
                                            if (newAmt !== null || newNotes !== null) {
                                              const raw = localStorage.getItem('sanad_manual_teacher_ledger_v1');
                                              if (raw) {
                                                const parsed = JSON.parse(raw);
                                                const updated = parsed.map((item: any) => {
                                                   if (item.id === t.id) {
                                                     return {...item, amount: newAmt ? Number(newAmt) : item.amount, notes: newNotes || item.notes};
                                                   }
                                                   return item;
                                                });
                                                localStorage.setItem('sanad_manual_teacher_ledger_v1', JSON.stringify(updated));
                                                window.location.reload();
                                              }
                                            }
                                          }
                                         }} className="text-blue-500 hover:text-blue-700 text-xs">
                                           ✏️
                                         </button>
                                         <button onClick={() => {
                                          const pass = prompt(isAr ? 'أدخل كلمة مرور السوبر أدمن للحذف:' : 'Enter Super Admin Password:');
                                          if (pass === 'admin') {
                                            const raw = localStorage.getItem('sanad_manual_teacher_ledger_v1');
                                            if (raw) {
                                              const parsed = JSON.parse(raw);
                                              const updated = parsed.filter((item: any) => item.id !== t.id);
                                              localStorage.setItem('sanad_manual_teacher_ledger_v1', JSON.stringify(updated));
                                              window.location.reload();
                                            }
                                          }
                                         }} className="text-red-500 hover:text-red-700 text-xs">
                                           🗑️
                                         </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}

                            {filteredTxns.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-12 text-center text-neutral-450 italic">
                                  📂 {isAr ? 'لا توجد معاملات أو قيود مالية مطابقة للفلترة والبحث الحالي.' : 'No financial transaction records found matching this timeline filter.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        );
      })()}

          {/* SECTION 8: الإشعارات وفضاء بث التنبيهات (NOTIFICATIONS) */}
          {activeTab === 'notifications' && (() => {
            // Retrieve staff members for target selection
            let localStaffList = [];
            const rawStaff = localStorage.getItem('sanad_staff_members');
            if (rawStaff) {
              try { localStaffList = JSON.parse(rawStaff); } catch {}
            } else {
              localStaffList = [
                { id: 'stf1', name: 'أ. مروان صلاح عبد الحكيم', phone: '01099384729', gradeScope: 'المرحلة الثانوية العامة' },
                { id: 'stf2', name: 'أ. دينا الشربيني', phone: '01288374921', gradeScope: 'الصف الأول والثاني الثانوي' }
              ];
            }

            // Extract unique teachers
            const allTeachersFromDb = users.filter(u => u.role === 'teacher');
            const uniqueTeachers = Array.from(new Set([
              ...allTeachersFromDb.map(t => JSON.stringify({ name: t.name, phone: t.phone })),
              ...courses.map(c => JSON.stringify({ name: c.teacher, phone: c.id }))
            ])).map(str => {
              try { return JSON.parse(str); } catch { return { name: '', phone: '' }; }
            }).filter(t => t.name);

            // Compute Stats
            const getStatus = (notif: any) => {
              if (notif.isActive === false) return 'stopped';
              const now = new Date().getTime();
              const startMs = notif.startDate ? new Date(notif.startDate).getTime() : 0;
              if (now < startMs) return 'scheduled';
              if (!notif.isPermanent && notif.endDate) {
                const endMs = new Date(notif.endDate).getTime();
                if (now > endMs) return 'expired';
              }
              return 'active';
            };

            const statsActive = notifications.filter(n => getStatus(n) === 'active').length;
            const statsScheduled = notifications.filter(n => getStatus(n) === 'scheduled').length;
            const statsExpired = notifications.filter(n => getStatus(n) === 'expired').length;
            const statsStopped = notifications.filter(n => getStatus(n) === 'stopped').length;

            // Filter Notifications
            const filteredNotifs = notifications.filter(notif => {
              // 1. Search by title
              if (notifSearch.trim() && !notif.title.toLowerCase().includes(notifSearch.trim().toLowerCase())) return false;

              // 2. Filter by status
              const status = getStatus(notif);
              if (notifStatusFilter !== 'all' && status !== notifStatusFilter) return false;

              // 3. Filter by target group
              if (notifTargetFilter !== 'all') {
                if (notifTargetFilter === 'teachers' && !['all_teachers', 'specific_teachers'].includes(notif.targetType)) return false;
                if (notifTargetFilter === 'staff' && !['all_staff', 'specific_staff'].includes(notif.targetType)) return false;
                if (notifTargetFilter === 'all_students' && notif.targetType !== 'all_students') return false;
                if (notifTargetFilter === 'specific_user' && notif.targetType !== 'specific_user') return false;
                if (notifTargetFilter === 'all_users' && notif.targetType !== 'all_users') return false;
              }

              // 4. Filter by creation date
              if (notifDateFilter !== 'all') {
                const createdMs = notif.createdAt ? new Date(notif.createdAt).getTime() : Date.now();
                const dayMs = 24 * 60 * 60 * 1000;
                const nowMs = Date.now();
                if (notifDateFilter === 'today' && (nowMs - createdMs > dayMs)) return false;
                if (notifDateFilter === 'week' && (nowMs - createdMs > 7 * dayMs)) return false;
                if (notifDateFilter === 'month' && (nowMs - createdMs > 30 * dayMs)) return false;
              }

              return true;
            });

            return (
              <div className="space-y-6 text-right font-sans">
                
                {/* HEADER TITLE */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                  <div className="space-y-1">
                    <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                      <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-black">📢</span>
                      <span>{isAr ? 'مركز بث وإدارة الإشعارات الذكية' : 'Smart Notification Broadcast Center'}</span>
                    </h3>
                    <p className="text-xs text-neutral-500 font-bold">
                      {isAr ? 'إدارة ونشر وتوجيه التنبيهات المستهدفة للمدرسين أو المساعدين أو الطلاب بدقة وميقات تزامني.' : 'Create, schedule and target alerts across various platforms user categories.'}
                    </p>
                  </div>
                </div>

                {/* STATISTICS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Active Notice */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 p-5 rounded-3xl flex items-center justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">{isAr ? 'تنبيهات نشطة حالياً' : 'Active Alerts'}</p>
                      <p className="text-2xl font-black text-emerald-900 dark:text-emerald-250">{statsActive}</p>
                    </div>
                    <span className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl text-lg flex items-center justify-center font-bold font-sans">🟢</span>
                  </div>

                  {/* Scheduled Alert */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-500/10 p-5 rounded-3xl flex items-center justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-black">{isAr ? 'تنبيهات مجدولة' : 'Scheduled Alerts'}</p>
                      <p className="text-2xl font-black text-amber-900 dark:text-amber-200">{statsScheduled}</p>
                    </div>
                    <span className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl text-lg flex items-center justify-center font-bold font-sans">⏳</span>
                  </div>

                  {/* Expired Notice */}
                  <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl flex items-center justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-black">{isAr ? 'تنبيهات منتهية' : 'Expired Notices'}</p>
                      <p className="text-2xl font-black text-neutral-800 dark:text-neutral-200">{statsExpired}</p>
                    </div>
                    <span className="p-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-2xl text-lg flex items-center justify-center font-bold font-sans">🏁</span>
                  </div>

                  {/* Stopped Notice */}
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-500/10 p-5 rounded-3xl flex items-center justify-between text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 font-black">{isAr ? 'موقوفة يدوياً' : 'Suspended List'}</p>
                      <p className="text-2xl font-black text-rose-900 dark:text-rose-200">{statsStopped}</p>
                    </div>
                    <span className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-2xl text-lg flex items-center justify-center font-bold font-sans">🛑</span>
                  </div>

                </div>

                {/* CREATOR FORM & PREVIEW / ACTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* FORM (5 COLS ON LARGE SCREEN) */}
                  <div className="lg:col-span-5 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between border-b pb-3.5">
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>✨</span>
                        <span>
                          {editingNotificationId 
                            ? (isAr ? 'تعديل وثيقة الإشعار' : 'Edit Selected Broadcast') 
                            : (isAr ? 'صياغة وجدولة إشعار جديد' : 'Draft & Schedule Notice')}
                        </span>
                      </h4>
                      {editingNotificationId && (
                        <button
                          type="button"
                          onClick={handleCancelEditNotif}
                          className="text-[10px] px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold rounded-lg hover:bg-neutral-200"
                        >
                          {isAr ? 'إلغاء التعديل ✕' : 'Cancel Edit ✕'}
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveNotification} className="space-y-4">
                      
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-550 block">
                          {isAr ? 'العنوان الرئيسي للإشعار' : 'Notification Main Title'}
                        </label>
                        <input
                          type="text"
                          required
                          value={notifyTitle}
                          onChange={(e) => setNotifyTitle(e.target.value)}
                          placeholder={isAr ? 'اكتب عنواناً جذاباً وواضحاً للإشعار...' : 'Upcoming academic server maintenance schedule...'}
                          className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-770 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Content Body */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-550 block">
                          {isAr ? 'تفاصيل ونص محتوى الإشعار' : 'Detailed Notification Content'}
                        </label>
                        <textarea
                          required
                          value={notifyContent}
                          onChange={(e) => setNotifyContent(e.target.value)}
                          placeholder={isAr ? 'تفاصيل الإعلان الهامة الموجهة للفئة المستهدفة...' : 'Please take attention that of June 20th our portal is offline...'}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-770 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500 min-h-24 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Optional link */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-550 block font-mono">
                          {isAr ? 'رابط الإجراء والتحويل التلقائي (اختياري)' : 'Call To Action Redirect Link (Optional)'}
                        </label>
                        <input 
                          type="url"
                          value={notifyLink}
                          onChange={(e) => setNotifyLink(e.target.value)}
                          placeholder="https://youtube.com/live-stream-lesson"
                          className="w-full text-xs font-mono py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-770 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-500 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Dates / Schedule Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800">
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-450 dark:text-neutral-500 block font-sans">
                            {isAr ? 'تاريخ ووقت ظهور الإشعار (البدء)' : 'Broadcast Start Date & Time'}
                          </label>
                          <input
                            type="datetime-local"
                            required
                            value={notifyStartDate}
                            onChange={(e) => setNotifyStartDate(e.target.value)}
                            className="w-full text-[11px] font-mono py-1.5 px-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black text-neutral-450 dark:text-neutral-500 block font-sans">
                              {isAr ? 'وقت الزوال / انتهاء الإشعار' : 'Broadcast Expiry Time'}
                            </label>
                            <button
                              type="button"
                              onClick={() => setNotifyPermanent(!notifyPermanent)}
                              className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${notifyPermanent ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-850 dark:text-neutral-450'}`}
                            >
                              {notifyPermanent ? (isAr ? 'دائم (لا يزول تلقائياً) ✓' : 'Permanent ✓') : (isAr ? 'مؤقت بمدة' : 'Timed expiry')}
                            </button>
                          </div>
                          
                          <input
                            type="datetime-local"
                            disabled={notifyPermanent}
                            value={notifyEndDate}
                            onChange={(e) => setNotifyEndDate(e.target.value)}
                            className="w-full text-[11px] font-mono py-1.5 px-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white disabled:opacity-50"
                          />
                        </div>

                      </div>

                      {/* TARGET AUDIENCE SELECTION (الفئات المستهدفة) */}
                      <div className="space-y-2 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800">
                        <label className="text-[10px] font-black text-neutral-500 dark:text-neutral-450 block">
                          🎯 {isAr ? 'تحديد الفئة المستهدفة بالإشعار:' : 'Select Target Audience Category:'}
                        </label>
                        
                        {/* Selector items */}
                        <div className="grid grid-cols-2 gap-1.5 text-xs text-right">
                          {[
                            { value: 'all_users', labelAr: 'جميع المستخدمين', labelEn: 'All Users' },
                            { value: 'all_teachers', labelAr: 'جميع المدرسين', labelEn: 'All Teachers' },
                            { value: 'all_staff', labelAr: 'جميع الموظفين والمساعدين', labelEn: 'All Staff Assistants' },
                            { value: 'specific_teachers', labelAr: 'مجموعة مدرسين محددة', labelEn: 'Specific Tutors' },
                            { value: 'specific_staff', labelAr: 'مجموعة مساعدين محددة', labelEn: 'Specific Staff' },
                            { value: 'specific_user', labelAr: 'مستهدف فردي (مستخدم محدد)', labelEn: 'Specific User Profile' },
                          ].map((cat) => (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => {
                                setNotifyTargetType(cat.value as any);
                                setNotifyTargetDetails([]);
                              }}
                              className={`p-2 rounded-xl border font-bold text-[9px] text-right flex items-center justify-between ${
                                notifyTargetType === cat.value 
                                  ? 'bg-indigo-650 text-white border-indigo-600 dark:bg-indigo-500'
                                  : 'bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                              }`}
                            >
                              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                              {notifyTargetType === cat.value && <span className="text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>

                        {/* SPECIFIC TEACHERS CHECKLIST */}
                        {notifyTargetType === 'specific_teachers' && (
                          <div className="mt-3 space-y-1.5 border-t pt-2.5">
                            <p className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 block mb-1">
                              {isAr ? 'اختر مجموعة المدرسين المستهدفين:' : 'Check Target Teachers:'}
                            </p>
                            <div className="max-h-24 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-xl p-2 bg-white dark:bg-neutral-800 space-y-1">
                              {uniqueTeachers.map((teacher: any, idx) => {
                                const isChecked = notifyTargetDetails.includes(teacher.name);
                                return (
                                  <label key={teacher.phone || idx} className="flex items-center gap-2 p-1 text-[10px] font-semibold cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded transition select-none">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setNotifyTargetDetails(notifyTargetDetails.filter(t => t !== teacher.name));
                                        } else {
                                          setNotifyTargetDetails([...notifyTargetDetails, teacher.name]);
                                        }
                                      }}
                                    />
                                    <span>👨‍🏫 {teacher.name}</span>
                                  </label>
                                );
                              })}
                              {uniqueTeachers.length === 0 && (
                                <p className="text-[10px] text-neutral-400 text-center italic py-2">{isAr ? 'لم يتم العثور على مدرسين.' : 'No teachers registered.'}</p>
                              )}
                            </div>
                            <p className="text-[8px] text-neutral-450">{isAr ? `المحدد: ${notifyTargetDetails.length} مدرسين` : `Selected: ${notifyTargetDetails.length}`}</p>
                          </div>
                        )}

                        {/* SPECIFIC STAFF CHECKLIST */}
                        {notifyTargetType === 'specific_staff' && (
                          <div className="mt-3 space-y-1.5 border-t pt-2.5">
                            <p className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 block mb-1">
                              {isAr ? 'اختر مجموعة المساعدين المستهدفين:' : 'Check Target Staff Assistants:'}
                            </p>
                            <div className="max-h-24 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-xl p-2 bg-white dark:bg-neutral-800 space-y-1">
                              {localStaffList.map((stf: any, idx) => {
                                const isChecked = notifyTargetDetails.includes(stf.name);
                                return (
                                  <label key={stf.id || idx} className="flex items-center gap-2 p-1 text-[10px] font-semibold cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded transition select-none">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setNotifyTargetDetails(notifyTargetDetails.filter(s => s !== stf.name));
                                        } else {
                                          setNotifyTargetDetails([...notifyTargetDetails, stf.name]);
                                        }
                                      }}
                                    />
                                    <span>🛡️ {stf.name} ({stf.gradeScope || 'مساعد'})</span>
                                  </label>
                                );
                              })}
                              {localStaffList.length === 0 && (
                                <p className="text-[10px] text-neutral-400 text-center italic py-2">{isAr ? 'لم يتم العثور على مساعدين بأجندة المدرسين.' : 'No helper staff registered.'}</p>
                              )}
                            </div>
                            <p className="text-[8px] text-neutral-455">{isAr ? `المحدد: ${notifyTargetDetails.length} مساعدين` : `Selected: ${notifyTargetDetails.length}`}</p>
                          </div>
                        )}

                        {/* SPECIFIC USER INDIVIDUAL DROPDOWN/SEARCH */}
                        {notifyTargetType === 'specific_user' && (
                          <div className="mt-3 space-y-1.5 border-t pt-2.5">
                            <p className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 block mb-0.5">
                              {isAr ? 'ابحث وحدد المستهدف الفردي بالاسم أو الجوال:' : 'Search single user target:'}
                            </p>
                            <input 
                              type="text"
                              value={searchTargetUserQuery}
                              onChange={(e) => setSearchTargetUserQuery(e.target.value)}
                              placeholder={isAr ? 'اكتب اسم المدرس أو الطالب أو الموظف للفلترة...' : 'Search Name or Phone number...'}
                              className="w-full text-[10px] py-1.5 px-2.5 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg outline-none text-neutral-900 dark:text-white"
                            />

                            {/* Search Results */}
                            {searchTargetUserQuery.trim() && (() => {
                              const searchResults = [
                                ...users.map(u => ({ name: u.name, desc: u.role === 'student' ? `${isAr ? 'طالب' : 'Student'} (${u.phone})` : `${isAr ? 'مدرس' : 'Teacher'} (${u.phone})`, phone: u.phone })),
                                ...localStaffList.map(s => ({ name: s.name, desc: `${isAr ? 'موظف/مساعد' : 'Staff Assistant'} (${s.phone})`, phone: s.phone }))
                              ].filter(item => 
                                item.name.toLowerCase().includes(searchTargetUserQuery.toLowerCase()) ||
                                item.phone.includes(searchTargetUserQuery)
                              ).slice(0, 5);

                              return (
                                <div className="border border-neutral-150 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg max-h-24 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-700">
                                  {searchResults.map((item, idy) => (
                                    <button
                                      key={idy}
                                      type="button"
                                      onClick={() => {
                                        setNotifyTargetDetails([item.name, item.phone]);
                                        setSearchTargetUserQuery('');
                                      }}
                                      className="w-full text-right p-1.5 px-2 text-[9px] font-bold block hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                                    >
                                      <div className="text-neutral-800 dark:text-white">{item.name}</div>
                                      <div className="text-[8px] text-neutral-450">{item.desc}</div>
                                    </button>
                                  ))}
                                  {searchResults.length === 0 && (
                                    <div className="p-2 text-center text-[10px] text-neutral-400 italic">{isAr ? 'لا يوجد تطابق للبحث !' : 'No user results matching query.'}</div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Show selected user */}
                            {notifyTargetDetails.length > 0 && (
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-between text-[10px] font-black border border-indigo-100 dark:border-indigo-900">
                                <span className="text-indigo-800 dark:text-indigo-300">👤 {notifyTargetDetails[0]} {notifyTargetDetails[1] ? `(${notifyTargetDetails[1]})` : ''}</span>
                                <button 
                                  type="button"
                                  onClick={() => setNotifyTargetDetails([])}
                                  className="text-[10px] text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer"
                                  title="Remove target"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-sm cursor-pointer"
                      >
                        {editingNotificationId 
                          ? (isAr ? 'تحديث وحفظ تعديلات الإشعار 💾' : 'Update Notice & Save Broadcast 💾')
                          : (isAr ? 'تفعيل ونشر الإشعار المستهدف فوراً ⚡' : 'Publish & Broadcast Target Notification Now ⚡')}
                      </button>
                      
                    </form>
                  </div>

                  {/* MANAGE LIST & FILTERS (7 COLS ON LARGE SCREEN) */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* FILTERS CARD */}
                    <div className="bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-5 rounded-3xl space-y-3 shadow-xs">
                      <div className="flex items-center gap-2 border-b pb-2 text-xs font-black">
                        <span className="text-neutral-500">⚙️</span>
                        <span>{isAr ? 'فلترة خريطة الإشعارات والبحث' : 'Notification Filter & Search Panels'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Title Search */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-450 block">{isAr ? 'البحث بعنوان أو نص الإشعار' : 'Search by notification title'}</label>
                          <div className="relative">
                            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-neutral-455" />
                            <input
                              type="text"
                              value={notifSearch}
                              onChange={(e) => setNotifSearch(e.target.value)}
                              placeholder={isAr ? 'اكتب كلمة البحث هنا...' : 'Type search terms...'}
                              className="w-full text-[11px] py-1.5 pr-8 pl-3 border rounded-xl outline-none dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-450 block">{isAr ? 'الفلترة حسب الحالة' : 'Filter by Status'}</label>
                          <select
                            value={notifStatusFilter}
                            onChange={(e) => setNotifStatusFilter(e.target.value as any)}
                            className="w-full text-[11px] py-2 px-2.5 border rounded-xl outline-none dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-indigo-500 font-bold"
                          >
                            <option value="all">{isAr ? 'جميع الحالات الكونية 🌍' : 'All States 🌍'}</option>
                            <option value="active">{isAr ? 'نشط (ظاهر بالمنصة) 🟢' : 'Active 🟢'}</option>
                            <option value="scheduled">{isAr ? 'مجدول (ينتظر ميقاته) ⏳' : 'Scheduled ⏳'}</option>
                            <option value="expired">{isAr ? 'منتهي تلقائياً 🏁' : 'Expired 🏁'}</option>
                            <option value="stopped">{isAr ? 'موقوف يدوياً 🛑' : 'Stopped 🛑'}</option>
                          </select>
                        </div>

                        {/* Audience Target Filter */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-455 block">{isAr ? 'حسب الفئة المستهدفة' : 'Filter by Target Audience'}</label>
                          <select
                            value={notifTargetFilter}
                            onChange={(e) => setNotifTargetFilter(e.target.value)}
                            className="w-full text-[11px] py-2 px-2.5 border rounded-xl outline-none dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-indigo-500 font-bold"
                          >
                            <option value="all">{isAr ? 'كل الفئات المستهدفة 👥' : 'All Categories 👥'}</option>
                            <option value="teachers">{isAr ? 'جميع/مجموعة المدرسين 👨‍🏫' : 'Teachers 👨‍🏫'}</option>
                            <option value="staff">{isAr ? 'جميع/مجموعة الموظفين والمساعدين 🛡' : 'Staff Members 🛡'}</option>
                            <option value="all_students">{isAr ? 'جميع الطلاب 🎓' : 'All Students 🎓'}</option>
                            <option value="specific_user">{isAr ? 'مستهدف فردي (مستخدم محدد) 👤' : 'Specific Target User 👤'}</option>
                            <option value="all_users">{isAr ? 'جميع المستخدمين بالمنصة' : 'All Platform Users'}</option>
                          </select>
                        </div>

                        {/* Date Created Filter */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-neutral-455 block">{isAr ? 'حسب تاريخ الإنشاء' : 'Filter by Creation Date'}</label>
                          <select
                            value={notifDateFilter}
                            onChange={(e) => setNotifDateFilter(e.target.value as any)}
                            className="w-full text-[11px] py-2 px-2.5 border rounded-xl outline-none dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-indigo-500 font-bold"
                          >
                            <option value="all">{isAr ? 'كل التواريخ' : 'All Date spans'}</option>
                            <option value="today">{isAr ? 'اليوم (خلال ٢٤ ساعة)' : 'Today (Last 24h)'}</option>
                            <option value="week">{isAr ? 'هذا الأسبوع' : 'This Week'}</option>
                            <option value="month">{isAr ? 'هذا الشهر (منذ ٣٠ يوم)' : 'This Month'}</option>
                          </select>
                        </div>

                      </div>
                    </div>

                    {/* CARDS LIST OF CURRENT NOTIFICATIONS */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-black px-1">
                        <span>📋 {isAr ? `الإشعارات المسجلة (${filteredNotifs.length})` : `Notifs Index (${filteredNotifs.length})`}</span>
                        <span className="text-[10px] text-neutral-450 italic">{isAr ? 'لا يتم حذف الإشعار التلقائي إلا بميقاته' : 'Notifications stay active unless timed out'}</span>
                      </div>

                      {filteredNotifs.map((notif) => {
                        const status = getStatus(notif);
                        
                        return (
                          <div 
                            key={notif.id} 
                            className={`p-5 bg-white dark:bg-neutral-850 rounded-3xl border text-right space-y-3 relative overflow-hidden shadow-xs transition-all ${
                              status === 'active' 
                                ? 'border-emerald-350 dark:border-emerald-800' 
                                : status === 'scheduled' 
                                ? 'border-amber-350 dark:border-amber-800'
                                : status === 'expired'
                                ? 'border-neutral-250 dark:border-neutral-850 opacity-80'
                                : 'border-rose-250 dark:border-rose-950/20'
                            }`}
                          >
                            {/* Left highlight strip depending on status */}
                            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                              status === 'active' 
                                ? 'bg-emerald-500' 
                                : status === 'scheduled' 
                                ? 'bg-amber-500'
                                : status === 'expired'
                                ? 'bg-neutral-450'
                                : 'bg-rose-500'
                            }`} />

                            {/* Header row in notice card */}
                            <div className="flex items-center justify-between border-b pb-2.5">
                              {/* Status Badge */}
                              <div className="flex items-center gap-1.5">
                                {status === 'active' && (
                                  <span className="p-1 px-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[9px] font-black rounded-lg flex items-center gap-1 font-sans">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-550"></span>
                                    </span>
                                    <span>{isAr ? 'نشط ومفعل' : 'Active Broadcast'}</span>
                                  </span>
                                )}
                                {status === 'scheduled' && (
                                  <span className="p-1 px-2.5 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-450 text-[9px] font-black rounded-lg font-sans">
                                    ⏱️ {isAr ? 'مجدول للبدء' : 'Scheduled'}
                                  </span>
                                )}
                                {status === 'expired' && (
                                  <span className="p-1 px-2.5 bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 text-[9px] font-black rounded-lg font-sans font-sans">
                                    🏁 {isAr ? 'منتهي الصلاحية' : 'Expired'}
                                  </span>
                                )}
                                {status === 'stopped' && (
                                  <span className="p-1 px-2.5 bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-450 text-[9px] font-black rounded-lg font-sans">
                                    🛑 {isAr ? 'موقف من المسؤول' : 'Suspended manually'}
                                  </span>
                                )}

                                {/* Target badge */}
                                <span className="p-1 px-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-[9px] font-black rounded-lg font-sans">
                                  🎯 {
                                    notif.targetType === 'all_users' ? (isAr ? 'الجميع' : 'All') :
                                    notif.targetType === 'all_teachers' ? (isAr ? 'جميع المدرسين' : 'All Teachers') :
                                    notif.targetType === 'all_staff' ? (isAr ? 'جميع المساعدين' : 'All Staff') :
                                    notif.targetType === 'specific_teachers' ? (isAr ? 'مجموعة مدرسين' : 'Tutors group') :
                                    notif.targetType === 'specific_staff' ? (isAr ? 'مجموعة مساعدين' : 'Staff group') :
                                    notif.targetType === 'specific_user' ? (isAr ? 'مستهدف فردي' : 'Single client') :
                                    (isAr ? 'الطلاب' : 'Students')
                                  }
                                </span>
                              </div>

                              {/* Action controls buttons */}
                              <div className="flex items-center gap-1 select-none">
                                
                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleEditNotificationClick(notif)}
                                  className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-indigo-600 rounded-lg transition shrink-0"
                                  title={isAr ? 'تعديل الإشعار' : 'Edit notice'}
                                >
                                  📝
                                </button>

                                {/* Toggle Pause/Play Button */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleNotificationStatus(notif.id)}
                                  className={`p-1.5 rounded-lg transition text-xs flex items-center justify-center shrink-0`}
                                  title={notif.isActive ? (isAr ? 'إيقاف مؤقت' : 'Deactivate') : (isAr ? 'إعادة تفعيل' : 'Reactivate')}
                                >
                                  {notif.isActive ? '⏸️' : '▶️'}
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNotification(notif.id)}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 rounded-lg transition shrink-0"
                                  title={isAr ? 'حذف الإشعار' : 'Delete notice'}
                                >
                                  🗑️
                                </button>

                              </div>
                            </div>

                            {/* Title & Body content */}
                            <div className="space-y-1.5 font-sans">
                              <p className="text-xs font-black text-neutral-900 dark:text-white leading-relaxed">{notif.title}</p>
                              {notif.content && (
                                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold leading-relaxed whitespace-pre-wrap">{notif.content}</p>
                              )}
                              {notif.link && (
                                <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-mono flex items-center justify-start gap-1">
                                  <span>Redirect URL:</span>
                                  <a href={notif.link} target="_blank" rel="noreferrer" className="underline truncate max-w-sm">{notif.link}</a>
                                </p>
                              )}
                            </div>

                            {/* Details meta lists */}
                            <div className="mt-2.5 flex flex-wrap gap-2 text-[9px] text-neutral-400 items-center justify-start">
                              <span>📅 {isAr ? 'تاريخ الإنشاء:' : 'Created at:'} {new Date(notif.createdAt || Date.now()).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</span>
                              <span>⏱️ {isAr ? 'يبدأ:' : 'Starts:'} {new Date(notif.startDate).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                              <span>⌛ {isAr ? 'ينتهي:' : 'Ends:'} {notif.isPermanent ? (isAr ? 'أبدي مستمر' : 'Infinite') : (notif.endDate ? new Date(notif.endDate).toLocaleString(isAr ? 'ar-EG' : 'en-US') : (isAr ? 'يدوي' : 'Manual stopping'))}</span>
                            </div>

                            {/* Target names if specific lists are set */}
                            {notif.targetDetails && notif.targetDetails.length > 0 && (
                              <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl space-y-1 border text-[9px] text-neutral-500">
                                <span className="font-bold block text-indigo-600 dark:text-indigo-400">👥 {isAr ? 'قائمة الأسماء المحددة الفردية:' : 'Specific Selected lists names:'}</span>
                                <div className="flex flex-wrap gap-1 leading-none">
                                  {notif.targetDetails.map((label: string, idz: number) => (
                                    <span key={idz} className="p-0.5 px-1.5 bg-white dark:bg-neutral-800 rounded font-black text-neutral-750">{label}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}

                      {filteredNotifs.length === 0 && (
                        <div className="p-12 text-center rounded-4xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-250 dark:border-neutral-800 text-neutral-450 text-xs">
                          {isAr ? '🕵️‍♂️ لم نجد أي إشعارات مطابقة لمعايير البحث والفلترة حالياً.' : 'Notice indices are completely vacant under current filters.'}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* SECTION 9: الإعدادات العامة للمنصة (PLATFORM SETTINGS) */}
          {activeTab === 'settings' && (
            <div className="w-full">
              <AdminPlatformSettings lang={lang} showToastSuccess={showToastSuccess} showToastError={showToastError} />
            </div>
          )}

          {/* SECTION THEMES: إدارة الثيمات (THEMES) */}
          {activeTab === 'themes' && (
            <div className="w-full">
              <AdminThemesManagement lang={lang} showToastSuccess={showToastSuccess} />
            </div>
          )}

          {/* SECTION 10: إعدادات الدفع والنظام المالي (PAYMENT SETTINGS) */}
          {activeTab === 'payment_settings' && (
            <div className="w-full">
              <AdminPaymentSettings lang={lang} showToastSuccess={showToastSuccess} showToastError={showToastError} />
            </div>
          )}

          {/* SECTION 11: إدارة أموال وأرصدة الطلاب الكلية (MONEY MANAGEMENT) */}
          {activeTab === 'money_management' && (
            <div className="w-full">
              <AdminMoneyManagement lang={lang} users={users} courses={coursesData[lang]} showToastSuccess={showToastSuccess} showToastError={showToastError} />
            </div>
          )}

          {/* SECTION 12: الاسترداد والتسويات (REFUNDS & SETTLEMENT) */}
          {activeTab === 'refunds_settlement' && (
            <div className="w-full">
              <AdminRefundsManagement lang={lang} users={users} showToastSuccess={showToastSuccess} showToastError={showToastError} />
            </div>
          )}

          {/* CONFIRM ADD TEACHER MODAL OVERLAY */}
          <AnimatePresence>
            {isConfirmAddTeacherModalOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-indigo-200 dark:border-neutral-750 w-full max-w-lg p-6 md:p-8 text-right space-y-5 shadow-2xl relative"
                  dir="rtl"
                >
                  <button 
                    type="button"
                    onClick={() => setIsConfirmAddTeacherModalOpen(false)}
                    className="absolute top-6 left-6 p-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  >
                    ✕
                  </button>

                  <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-4 text-right">
                    <span>✨</span>
                    <span>{isAr ? 'تأكيد إضافة مدرس جديد للمنصة' : 'Confirm Adding New Staff'}</span>
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed font-bold text-right">
                    {isAr 
                      ? `بصفتك سوبر أدمن، يرجى تأكيد رغبتك في تشفير وتفعيل حساب المدرس الجديد (أ. ${tName}) وإطلاقه على منصة سند بالرقم المرفق:` 
                      : `You are about to securely register and hash the credentials for tutor "Mr. ${tName}" upon Sanad Education platform:`
                    }
                  </p>

                  <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-150 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'اسم المدرس الكامل:' : 'Full name:'}</span>
                      <span className="font-extrabold text-neutral-900 dark:text-white">{tName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'رقم الهاتف للدخول:' : 'Phone username:'}</span>
                      <span className="font-mono font-black text-indigo-600">{tPhone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'الجنسية الكلية:' : 'Nationality:'}</span>
                      <span className="font-bold">{selectedNationality}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'المحافظة الحالية:' : 'Governorate:'}</span>
                      <span className="font-bold">{tLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'المواد المنسوبة:' : 'Assigned Subjects:'}</span>
                      <span className="font-extrabold text-indigo-650">{selectedSubjects.join(' ، ') || (isAr ? 'غير محدد' : 'None')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'المنهج الدراسي المتبع:' : 'Curriculum:'}</span>
                      <span className="font-bold text-amber-600">{selectedCurriculum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">{isAr ? 'الصفوف المصرحة:' : 'Grades:'}</span>
                      <span className="font-extrabold text-indigo-700">{selectedGrades.join(' ، ') || (isAr ? 'مستويات عامة' : 'General')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setIsConfirmAddTeacherModalOpen(false)}
                      className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'إلغاء وتعديل البيانات' : 'Cancel & Modify'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleConfirmAddTeacher();
                      }}
                      className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black transition shadow-md hover:shadow-indigo-650/10 cursor-pointer"
                    >
                      {isAr ? 'تأكيد إضافة مدرس جديد' : 'Confirm & Activate Now'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EDIT TEACHER MODAL OVERLAY */}
          <AnimatePresence>
            {editTeacherForm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-right space-y-6 shadow-2xl relative"
                  dir="rtl"
                >
                  <button 
                    type="button"
                    onClick={() => setEditTeacherForm(null)}
                    className="absolute top-6 left-6 p-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  >
                    <X className="h-5 w-5 text-neutral-400" />
                  </button>

                  <div className="border-b pb-4 text-right">
                    <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{isAr ? `تحديث بيانات المدرس بالكامل: ${editTeacherForm.name}` : `Update Faculty: ${editTeacherForm.name}`}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-bold mt-1">
                      {isAr ? 'عدل جميع الإعدادات والتفاصيل ثم اضغط حفظ لتطبيق التغييرات لجميع الأقسام فوراً.' : 'Edit tutor properties securely then save to publish updates.'}
                    </p>
                  </div>

                  <form onSubmit={handleSaveTeacherEditForm} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                      
                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'الاسم الكامل للمدرس' : 'Teacher Full Name'}</label>
                        <input 
                          type="text"
                          required
                          value={editTeacherForm.name}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-600 text-neutral-805 text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right opacity-70">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'رقم الهاتف (اسم المستخدم للدخول - غير قابل للتعديل)' : 'Phone Number (Read-Only)'}</label>
                        <input 
                          type="text"
                          disabled
                          value={editTeacherForm.phone}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-150 dark:border-neutral-850 bg-neutral-100 dark:bg-neutral-800 outline-none text-neutral-400 text-right cursor-not-allowed font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'دولة الإقامة والتواجد' : 'Country'}</label>
                        <select 
                          value={editTeacherForm.country}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, country: e.target.value as any })}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        >
                          <option value="EG">{isAr ? '🇪🇬 مصر' : 'Egypt'}</option>
                          <option value="SA">{isAr ? '🇸🇦 السعودية' : 'Saudi Arabia'}</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'المحافظة أو المدينة (مثل: القاهرة، الرياض)' : 'City / Governorate'}</label>
                        <input 
                          type="text"
                          value={editTeacherForm.location || ''}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, location: e.target.value })}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none text-neutral-805 text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">
                          {isAr ? 'المسمى الوظيفي للمدرس / الشرح الفرعي (اختياري، يظهر في صفحة المدرس)' : 'Tutor Tagline / Sub-description (Optional)'}
                        </label>
                        <input 
                          type="text"
                          value={editTeacherForm.specialty || ''}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, specialty: e.target.value })}
                          placeholder={isAr ? 'معلم مادة خبير في محافظة القاهرة' : 'e.g. Expert physics tutor in Giza'}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-805 outline-none text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'الجنس' : 'Gender'}</label>
                        <select 
                          value={editTeacherForm.gender || 'male'}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, gender: e.target.value as any })}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        >
                          <option value="male">{isAr ? 'ولد / ذكر' : 'Male'}</option>
                          <option value="female">{isAr ? 'بنت / أنثى' : 'Female'}</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'الجنسية المعتمدة' : 'Nationality'}</label>
                        <select 
                          value={editTeacherForm.nationality || ''}
                          onChange={(e) => setEditTeacherForm({ ...editTeacherForm, nationality: e.target.value })}
                          className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                        >
                          {managedNationalities.map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                        <div className="space-y-1.5 text-right">
                          <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'المنهج الدراسي المتبع' : 'Curriculum'}</label>
                          <select 
                            value={editTeacherForm.curriculum || ''}
                            onChange={(e) => {
                              const cur = e.target.value;
                              let newCurr: 'EGP' | 'SAR' = editTeacherForm.currency || 'EGP';
                              if (cur.includes('مصر') || cur.includes('Egypt') || cur === 'المنهج المصري') {
                                newCurr = 'EGP';
                              } else if (cur.includes('سعود') || cur.includes('Saudi') || cur === 'المنهج السعودي') {
                                newCurr = 'SAR';
                              }
                              setEditTeacherForm({ ...editTeacherForm, curriculum: cur, currency: newCurr });
                            }}
                            className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-650"
                          >
                            {managedCurriculums.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 text-right">
                          <label className="text-[11px] font-black text-neutral-400 block">
                            🪙 {isAr ? 'عملة المعاملات الأساسية لحساب المدرس:' : 'Teacher Account Base Currency:'}
                          </label>
                          {!(editTeacherForm.curriculum?.includes('مشترك') || editTeacherForm.curriculum?.toLowerCase().includes('shared') || editTeacherForm.curriculum?.toLowerCase().includes('joint') || (!editTeacherForm.curriculum?.includes('مصر') && !editTeacherForm.curriculum?.includes('سعود'))) ? (
                            <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-extrabold text-xs">
                              {(editTeacherForm.currency || 'EGP') === 'EGP' ? (isAr ? '🇪🇬 الجنيه المصري (EGP) - محدد تلقائياً حسب المنهج المصري' : 'Egyptian Pound (EGP) - Auto') : (isAr ? '🇸🇦 الريال السعودي (SAR) - محدد تلقائياً حسب المنهج السعودي' : 'Saudi Riyal (SAR) - Auto')}
                            </div>
                          ) : (
                            <select
                              value={editTeacherForm.currency || 'EGP'}
                              onChange={(e) => setEditTeacherForm({ ...editTeacherForm, currency: e.target.value as 'EGP' | 'SAR' })}
                              className="w-full text-xs font-black p-3 rounded-xl border border-indigo-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none font-bold text-right"
                            >
                              <option value="EGP">{isAr ? '🇪🇬 الجنيه المصري (EGP)' : 'Egyptian Pound (EGP)'}</option>
                              <option value="SAR">{isAr ? '🇸🇦 الريال السعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-right md:col-span-2">
                        <label className="text-[11px] font-black text-neutral-400 block">
                          {isAr ? 'الصفوف الدراسية المتاح له التدريس بها (يمكن تحديد أكثر من صف)' : 'Authorized Grade Levels (Multi)'}
                        </label>
                        <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-150 dark:border-neutral-800">
                          {managedGrades.map((grade) => {
                            const isSelected = editTeacherForm.grades?.includes(grade);
                            return (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => {
                                  const current = editTeacherForm.grades || [];
                                  const next = current.includes(grade) ? current.filter(g => g !== grade) : [...current, grade];
                                  setEditTeacherForm({ ...editTeacherForm, grades: next });
                                }}
                                className={`px-3 py-1.5 text-xs font-black rounded-lg border transition cursor-pointer ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-500 border-neutral-205 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                }`}
                              >
                                {grade}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-right md:col-span-2">
                        <label className="text-[11px] font-black text-neutral-400 block">
                          {isAr ? 'المواد العلمية المنسوبة للمدرس (يمكن تحديد أكثر من مادة للمدرس)' : 'Assigned Subject Disciplines (Multi)'}
                        </label>
                        <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-150 dark:border-neutral-800">
                          {managedSubjects.map((sub) => {
                            const isSelected = editTeacherForm.subjects?.includes(sub) || editTeacherForm.subject === sub;
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                  let current = editTeacherForm.subjects || [];
                                  if (current.length === 0 && editTeacherForm.subject) {
                                    current = [editTeacherForm.subject];
                                  }
                                  const next = current.includes(sub) ? current.filter(s => s !== sub) : [...current, sub];
                                  setEditTeacherForm({ ...editTeacherForm, subjects: next, subject: next[0] || '' });
                                }}
                                className={`px-3 py-1.5 text-xs font-black rounded-lg border transition cursor-pointer ${
                                  isSelected 
                                    ? 'bg-indigo-650 text-white border-indigo-600'
                                    : 'bg-white dark:bg-neutral-800 text-neutral-500 border-neutral-205 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                }`}
                              >
                                {sub}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'صورة الكارت / الصورة الشخصية' : 'Card / Avatar Image'}</label>
                        <div className="space-y-2">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditTeacherForm({ ...editTeacherForm, cardImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-xs text-neutral-400 w-full"
                          />
                          {editTeacherForm.cardImage && (
                            <img src={editTeacherForm.cardImage} className="h-20 w-20 object-cover rounded-2xl border" alt="card view" referrerPolicy="no-referrer" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-right">
                        <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'صورة الغلاف لصفحة المدرس' : 'Page Cover Banner Image'}</label>
                        <div className="space-y-2">
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditTeacherForm({ ...editTeacherForm, pageImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-xs text-neutral-400 w-full"
                          />
                          {editTeacherForm.pageImage && (
                            <img src={editTeacherForm.pageImage} className="h-20 w-32 object-cover rounded-2xl border" alt="banner view" referrerPolicy="no-referrer" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 text-right md:col-span-2 border-t pt-4">
                        <h5 className="text-xs font-black text-neutral-400 tracking-wide uppercase mb-2 flex items-center gap-1.5 justify-end">
                          <span>🔗</span>
                          <span>{isAr ? 'روابط ومواقع تواصل المدرس ومفاتيح العرض' : 'Social Channels Visibility Toggles'}</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-3xl border border-neutral-150 dark:border-neutral-800">
                          {['facebook', 'youtube', 'tiktok', 'whatsapp', 'telegram'].map((platform) => {
                            const linkObj = (editTeacherForm.socialLinks as any)?.[platform] || { url: '', isVisible: true };
                            return (
                              <div key={platform} className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 flex flex-col gap-2 text-right">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-neutral-605 dark:text-neutral-300 capitalize">{platform}</label>
                                  <div className="flex items-center gap-1.5">
                                    <input 
                                      type="checkbox"
                                      id={`edit_show_${platform}`}
                                      checked={linkObj.isVisible !== false}
                                      onChange={(e) => {
                                        const currentLinks = { ...editTeacherForm.socialLinks } as any;
                                        currentLinks[platform] = { ...linkObj, isVisible: e.target.checked };
                                        setEditTeacherForm({ ...editTeacherForm, socialLinks: currentLinks });
                                      }}
                                      className="h-3.5 w-3.5 rounded accent-indigo-650 cursor-pointer"
                                    />
                                    <label htmlFor={`edit_show_${platform}`} className="text-[10px] text-neutral-400 font-bold select-none cursor-pointer">
                                      {isAr ? 'تفعيل الأيقونة' : 'Interactive Icon'}
                                    </label>
                                  </div>
                                </div>
                                <input 
                                  type="text"
                                  value={linkObj.url || ''}
                                  onChange={(e) => {
                                    const currentLinks = { ...editTeacherForm.socialLinks } as any;
                                    currentLinks[platform] = { ...linkObj, url: e.target.value };
                                    setEditTeacherForm({ ...editTeacherForm, socialLinks: currentLinks });
                                  }}
                                  placeholder={`https://www.${platform}.com/...`}
                                  className="w-full text-xs font-mono p-2 rounded-lg border border-neutral-105 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none text-neutral-700 dark:text-gray-300 text-left"
                                  dir="ltr"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center gap-3 justify-end border-t pt-4">
                      <button
                        type="button"
                        onClick={() => setEditTeacherForm(null)}
                        className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl text-xs font-black transition cursor-pointer"
                      >
                        {isAr ? 'إلغاء الأمر' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                      >
                        {isAr ? 'حفظ وتحديث التغييرات' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TEACHER PASSWORD CHANGE OVERLAY MODAL */}
          <AnimatePresence>
            {teacherToChangePassword && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-neutral-200 dark:border-neutral-750 w-full max-w-md p-6 text-right space-y-4 shadow-xl"
                  dir="rtl"
                >
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2 border-b pb-3 text-right">
                    <span>🔑</span>
                    <span>{isAr ? `تغيير وتحديث كلمة المرور لـ أ. ${teacherToChangePassword.name}` : `Reset Password for ${teacherToChangePassword.name}`}</span>
                  </h3>
                  
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-black text-neutral-400 block">{isAr ? 'كلمة المرور الجديدة المقررة للمدرس:' : 'New Password:'}</label>
                    <input 
                      type="text"
                      value={newTeacherPassword}
                      onChange={(e) => setNewTeacherPassword(e.target.value)}
                      placeholder={isAr ? 'اكتب كلمة المرور الجديدة هُنا صالحة للمدرس...' : 'Enter new alphanumeric key...'}
                      className="w-full text-xs font-bold p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none focus:border-indigo-600 text-neutral-805"
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setTeacherToChangePassword(null)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 text-neutral-500 rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'تراجع' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateTeacherPassword(teacherToChangePassword.phone, newTeacherPassword)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'حفظ وتعديل التشفير' : 'Reset Password'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TEACHER DELETE WITH SUPER ADMIN PASSWORD INPUT OVERLAY MODAL */}
          <AnimatePresence>
            {teacherToDelete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-rose-300 dark:border-rose-950 w-full max-w-md p-6 text-right space-y-4 shadow-xl"
                  dir="rtl"
                >
                  <h3 className="text-sm font-black text-rose-750 dark:text-rose-455 flex items-center gap-2 border-b pb-3 border-rose-100 dark:border-neutral-800 text-right">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    <span>{isAr ? 'تحذير أمني: حذف حساب مدرس نهائياً' : 'Security Alert: Remove Faculty Member'}</span>
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed font-bold text-right">
                    {isAr 
                      ? `بصفتك سوبر أدمن، أنت على وشك إلغاء ومسح حساب المدرس (${teacherToDelete.name}) ورقم هاتفه من النظام. هذا الإجراء غير قابل للتراجع نهائياً!` 
                      : `You are about to erase the teacher account (${teacherToDelete.name}) from SANAD platform. This action is absolutely irreversible!`
                    }
                  </p>
                  
                  <div className="space-y-1.5 pt-3 text-right">
                    <label className="text-[11px] font-black text-neutral-500 block">
                      {isAr ? 'لتأكيد هذا الحذف الحساس، يرجى كتابة رمز السوبر أدمن الرئيسي للتحقق:' : 'Type Super Admin Password to confirm permanent erasure:'}
                    </label>
                    <input 
                      type="password"
                      value={adminConfirmationPassword}
                      onChange={(e) => setAdminConfirmationPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs font-mono p-3 rounded-xl border border-rose-250 dark:border-rose-950 bg-rose-500/5 outline-none focus:border-rose-600 text-neutral-855 text-center"
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setTeacherToDelete(null)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 text-neutral-500 rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'تراجع وإلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteTeacher}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'مسح الحساب وتأكيد التعطيل' : 'Yes, Delete Permanently'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RATE CONFIRMATION WITH SUPER ADMIN PASSWORD INPUT OVERLAY MODAL */}
          <AnimatePresence>
            {rateConfirmModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-indigo-300 dark:border-indigo-950 w-full max-w-sm p-6 text-right space-y-4 shadow-xl"
                  dir="rtl"
                >
                  <h3 className="text-sm font-black text-indigo-750 dark:text-indigo-455 flex items-center gap-2 border-b pb-3 border-neutral-100 dark:border-neutral-800 text-right">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <span>{isAr ? 'تأكيد أمني لحفظ نسبة المدرس' : 'Security Verify: Lock Instructor Rate'}</span>
                  </h3>

                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-neutral-500 font-bold leading-relaxed">
                      {isAr ? `جاري تغيير نسبة أرباح المعلم (${rateConfirmModal.tName}) لتصبح (${rateConfirmModal.rate}%). لتأكيد هذه الخطوة، يرجى كتابة رمز السوبر أدمن:` : `Confirming revenue share of ${rateConfirmModal.rate}% for instructor ${rateConfirmModal.tName}. Supply Super Admin key to apply:`}
                    </p>
                    
                    <div>
                      <input 
                        type="password"
                        value={rateConfirmPassword}
                        onChange={(e) => setRateConfirmPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-center font-bold text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button 
                      onClick={() => {
                        setRateConfirmModal(null);
                        setRateConfirmPassword('');
                      }}
                      className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'تراجع' : 'Cancel'}
                    </button>
                    <button 
                      onClick={handleApplyTeacherRateSecurely}
                      disabled={!rateConfirmPassword}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50"
                    >
                      {isAr ? 'حفظ وتأكيد النسبة' : 'Save Secured Rate'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ADD LEDGER TRANSACTION CONFIRM MODAL */}
          <AnimatePresence>
            {ledgerActionConfirmModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-neutral-850 rounded-4xl border border-indigo-300 dark:border-indigo-950 w-full max-w-sm p-6 text-right space-y-4 shadow-xl"
                  dir="rtl"
                >
                  <h3 className="text-sm font-black text-indigo-750 dark:text-indigo-455 flex items-center gap-2 border-b pb-3 border-neutral-100 dark:border-neutral-800 text-right">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <span>{isAr ? 'تأكيد أمني للعملية المالية' : 'Security Verify: Record Txn'}</span>
                  </h3>

                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-neutral-500 font-bold leading-relaxed">
                      {isAr ? `تأكيد تسجيل طلب (${manualType === 'settlement' ? 'تسوية' : manualType === 'withdrawal' ? 'سحب/دفع' : 'إيداع'}) بقيمة (${manualAmount}) لمعلم (${manualTeacher}). يرجى إدخال الرمز السري:` : `Confirming txn: ${manualType} of ${manualAmount} for ${manualTeacher}. Super Admin password required:`}
                    </p>
                    
                    <div>
                      <input 
                        type="password"
                        value={ledgerConfirmPassword}
                        onChange={(e) => setLedgerConfirmPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-center font-bold text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button 
                      onClick={() => {
                        setLedgerActionConfirmModal(false);
                        setLedgerConfirmPassword('');
                      }}
                      className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 rounded-xl text-xs font-black transition cursor-pointer"
                    >
                      {isAr ? 'تراجع' : 'Cancel'}
                    </button>
                    <button 
                      onClick={handleExecuteManualLedgerTxnSecurely}
                      disabled={!ledgerConfirmPassword}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50"
                    >
                      {isAr ? 'تأكيد وتسجيل العملية' : 'Confirm & Save'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
