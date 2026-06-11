import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, PlusCircle, Trash2, Edit2, Shield, Phone, Bookmark, Check, UserCheck } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  gradeScope: string;
  taskDescription: string;
  permission: 'full' | 'moderate' | 'view';
}

interface TeacherStaffPageProps {
  lang: 'ar' | 'en';
}

export default function TeacherStaffPage({ lang }: TeacherStaffPageProps) {
  const isAr = lang === 'ar';
  
  // Custom Sync hook with localStorage
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const raw = localStorage.getItem('sanad_staff_members');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return [
      {
        id: 'stf1',
        name: 'أ. مروان صلاح عبد الحكيم',
        phone: '01099384729',
        gradeScope: 'المرحلة الثانوية العامة (الصف ٣ و ٢)',
        taskDescription: 'متابعة وفحص الواجبات المنزلية، الرد على أسئلة الطلاب، وإعداد كشوف المتميزين.',
        permission: 'moderate'
      },
      {
        id: 'stf2',
        name: 'أ. دينا الشربيني',
        phone: '01288374921',
        gradeScope: 'الصف الأول والثاني الثانوي',
        taskDescription: 'مراجعة طلبات استلام أو تفعيل الأكواد المدفوعة ومتابعة اتصالات أولياء الأمور.',
        permission: 'moderate'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sanad_staff_members', JSON.stringify(staff));
  }, [staff]);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gradeScope, setGradeScope] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [permission, setPermission] = useState<'full' | 'moderate' | 'view'>('moderate');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !gradeScope.trim()) return;

    if (editingId) {
      setStaff(prev => prev.map(item => {
        if (item.id === editingId) {
          return { ...item, name, phone, gradeScope, taskDescription, permission };
        }
        return item;
      }));
      setSuccess(isAr ? '🎉 تم حفظ وتعديل بيانات المساعد بنجاح!' : '🎉 Assistant profile updated!');
      setEditingId(null);
    } else {
      const newStaff: StaffMember = {
        id: 'stf_' + Date.now(),
        name,
        phone,
        gradeScope,
        taskDescription,
        permission
      };
      setStaff(prev => [...prev, newStaff]);
      setSuccess(isAr ? '🎉 تم تسجيل مساعد المدرس الجديد بنجاح!' : '🎉 Staff assistant enrolled!');
    }

    setName('');
    setPhone('');
    setGradeScope('');
    setTaskDescription('');
    setPermission('moderate');

    setTimeout(() => setSuccess(''), 4000);
  };

  const handleEditInit = (item: StaffMember) => {
    setEditingId(item.id);
    setName(item.name);
    setPhone(item.phone);
    setGradeScope(item.gradeScope);
    setTaskDescription(item.taskDescription);
    setPermission(item.permission);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(isAr ? '👮 هل أنت متأكد من حذف عضو طاقم المساعدين هذا بشكل دائم؟' : 'Are you sure you want to delete this staff assistant?')) {
      setStaff(prev => prev.filter(item => item.id !== id));
      setSuccess(isAr ? '🗑 تم شطب ملف المساعد بنجاح!' : '🗑 Staff member removed.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Unified Styled Header Component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">👮‍♀️</span>
            <span>{isAr ? 'إدارة وتعيين صلاحيات مساعدي المدرس (Staff)' : 'Teaching staff Assistant Center'}</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
            {isAr 
              ? 'سجل حسابات طاقم مساعديك وسكرتارتك الخاصة، حدد مهامهم الرقابية وصلاحيات الفحص لدرجات حلول الطلاب.'
              : 'Register assistants, specify assigned boundaries, and customize permissions.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 rounded-2xl shadow-sm select-none">
            👥 {staff.length} {isAr ? 'مساعدين نشطين' : 'Active Assistants'}
          </span>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-500/15 text-xs font-black flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
            <h4 className="text-xs font-black text-neutral-808 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-750">
              {editingId ? (isAr ? '✏️ تعديل بيانات مساعد' : '✏️ Edit Assistant') : (isAr ? '➕ تسجيل مساعد جديد' : '➕ Enroll New Assistant')}
            </h4>

            {/* Assistant Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'اسم المساعد الكامل' : 'Full Name'}</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="أدخل الاسم..."
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              />
            </div>

            {/* Contact Mobile */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'رقم الهاتف / الاتصال' : 'Mobile Phone'}</label>
              <input
                required
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010..."
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              />
            </div>

            {/* Grade Boundaries */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'الصف والمسار التعليمي المسؤول عنه' : 'Assigned Grades Scope'}</label>
              <input
                required
                type="text"
                value={gradeScope}
                onChange={e => setGradeScope(e.target.value)}
                placeholder="مثال: الصف الثالث الثانوي..."
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              />
            </div>

            {/* Permission selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'طبيعة الصلاحيات الإشرافية' : 'Authorized Permissions'}</label>
              <select
                value={permission}
                onChange={e => setPermission(e.target.value as any)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              >
                <option value="view">👁️ مشاهدة كشوف الحضور والدرجات فقط</option>
                <option value="moderate">✍️ مراجعة وحفظ غرف المذاكرات وتلقين درجات</option>
                <option value="full">👑 حظر الطلاب أو تعيين كود الطالب</option>
              </select>
            </div>

            {/* Task summary details */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'المهام ومذكرة التذكير السلوكي' : 'Assigned Duties Summary'}</label>
              <textarea
                rows={2}
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                placeholder="ما هي حدود المتابعة المكلف بها..."
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition"
            >
              {isAr ? 'تسجيل وتأكيد الإضافة ⚡' : 'Enforce Registration ⚡'}
            </button>
          </form>
        </div>

        {/* Assistants Listing Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'قائمة أعضاء طاقم المساعدين المسجلين' : 'Active teaching assistants'}</h4>
            <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-full">
              {staff.length} {isAr ? 'أعضاء قيد الدوام' : 'active assistants'}
            </span>
          </div>

          <div className="space-y-4">
            {staff.map((s) => (
              <div 
                key={s.id}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 rounded-2xl text-lg select-none">
                      👤
                    </span>
                    <div className="text-right">
                      <h5 className="text-xs font-black text-neutral-900 dark:text-white leading-tight">{s.name}</h5>
                      <span className="text-[9px] text-neutral-400 font-bold flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span className="font-mono">{s.phone}</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400">🏫 {s.gradeScope}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditInit(s)} className="p-1 px-2.5 text-neutral-400 hover:text-indigo-600 rounded-lg transition"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1 px-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl space-y-1.5 border-none text-right">
                  <p className="text-[10px] font-black text-neutral-400 flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    <span>{isAr ? 'المهام المكلف بها:' : 'Duties:'}</span>
                  </p>
                  <p className="text-xs text-neutral-650 dark:text-neutral-305 font-medium leading-relaxed italic">{s.taskDescription}</p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-50 dark:border-neutral-800/60 text-right">
                  <span className="text-[10px] font-black text-neutral-550">{isAr ? 'مستوى الصلاحية المعتمد:' : 'Boundaries permission:'}</span>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${
                    s.permission === 'full' 
                      ? 'bg-rose-500/10 text-rose-600' 
                      : s.permission === 'moderate' 
                      ? 'bg-indigo-500/10 text-indigo-650' 
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}>
                    <Shield className="h-3 w-3" />
                    <span>{s.permission === 'full' ? (isAr ? 'صلاحية سيادية كاملة' : 'Full Admin access') : s.permission === 'moderate' ? (isAr ? 'صلاحية وساطة متوسطة' : 'Intermediate moderator') : (isAr ? 'رؤية وقراءة فقط' : 'View-only')}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
