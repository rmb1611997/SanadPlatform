import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Plus, Trash2, Edit2, Layers, Video, FileText, ClipboardList, 
  Database, Image, ArrowUp, ArrowDown, Sparkles, Check, AlertCircle, Eye, Globe
} from 'lucide-react';
import { Course } from '../types';

interface TeacherContentPageProps {
  lang: 'ar' | 'en';
  allCourses: Course[];
  setAllCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  teacherCourses: Course[];
  initialSubSection?: 'courses' | 'modules' | 'videos' | 'handouts' | 'tasks' | 'qbank' | 'reorder';
}

export default function TeacherContentPage({ 
  lang, 
  allCourses, 
  setAllCourses,
  teacherCourses,
  initialSubSection
}: TeacherContentPageProps) {
  const isAr = lang === 'ar';
  const [activeSubSection, setActiveSubSection] = useState<'courses' | 'modules' | 'videos' | 'handouts' | 'tasks' | 'qbank' | 'reorder'>(initialSubSection || 'courses');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);
  
  // Custom localStorage hooks
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('sanad_modules_config_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'm1', courseId: 'c1', titleAr: '📘 مجموعة الفصل الأول: التأسيس والمفاهيم الكبرى', titleEn: '📘 Module 1: Foundational Core Concepts', descriptionAr: 'شرح أساسي للكهربية وقوانين هرتز وكيرشوف.', descriptionEn: 'Basic overview of circuit physics.', isPermanent: true },
      { id: 'm2', courseId: 'c1', titleAr: '⚡ مجموعة الفصل الثاني: شدة التيار المعقد ومفاتيح التحكم', titleEn: '⚡ Module 2: Circuit Current and Knobs', descriptionAr: 'تطبيق عملي على طرق توزيع الجهد بالتوازي والتوالي.', descriptionEn: 'Advanced analysis of electric circuits.', isPermanent: true }
    ];
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('sanad_videos_config_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'v1', courseId: 'c1', moduleId: 'm1', titleAr: '🎥 الشرح: المحاضرة الأولى والتمهيد الشامل لفيزياء ٣ ثانوي', titleEn: '🎥 Video 1: Foundational Physics Grade 12 Intro', descriptionAr: 'المحاضرة التمهيدية الأولى.', descriptionEn: 'First introductory lecture.', duration: '٤٥ دقيقة', source: 'youtube', link: 'https://youtube.com', isFree: true, isPermanent: true },
      { id: 'v2', courseId: 'c1', moduleId: 'm1', titleAr: '🎥 الشرح: فك شفرات القوانين والمعادلات الذهبية', titleEn: '🎥 Video 2: Golden rules of Ohm', descriptionAr: 'شرح معملي تفاعلي لقوانين أوم بالكهربية.', descriptionEn: 'Interactive Ohm lab representation', duration: '٥٠ دقيقة', source: 'bunny', link: 'https://example.com/stream1', isFree: false, isPermanent: true }
    ];
  });

  const [handouts, setHandouts] = useState(() => {
    const saved = localStorage.getItem('sanad_handouts_config_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'h1', courseId: 'c1', moduleId: 'm1', titleAr: '📄 ملخص قوانين التيار والجهد والتكافؤ المقاومي (خرائط ذهنية)', titleEn: '📄 Gold Maps: Electric resistance maps', link: 'https://example.com/handout1.pdf', fileSize: '٤.٥ ميجابايت' }
    ];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sanad_tasks_config_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'tk1', courseId: 'c1', moduleId: 'm1', type: 'exam', titleAr: '📝 الامتحان التقييمي الأول: قوانين كيرشوف وتوزيع التيار', titleEn: '📝 First Quiz: Kirshoffs laws and currents', questionsCount: 15, duration: '٢٠ دقيقة', totalMarks: 20 },
      { id: 'tk2', courseId: 'c1', moduleId: 'm1', type: 'assignment', titleAr: '✏️ الواجب المنزلي: دوائر الحث والمقاومة المكافئة', titleEn: '✏️ Homework Assignment: Inductors and equivalents', questionsCount: 10, duration: '—', totalMarks: 10 }
    ];
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('sanad_questions_config_db');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'q1', type: 'mcq', questionAr: 'أي من القيم التالية تمثل المقاومة النوعية لسلك نحاسي كتلته نوعية عند ارتفاع درجة الحرارة؟', questionEn: 'Which of the following represents the resistivity of a copper wire at temperature rise?', optionsAr: ['تقل المقاومة', 'تزداد المقاومة وتزداد التصادمات الذرية', 'لا تلتزم بالنظام', 'تبقى ثابتة نهائياً'], optionsEn: ['Decreases', 'Increases', 'Varies randomly', 'Remains constant'], correctOption: 1, explanationAr: 'زيادة الحرارة ترفع سعة الاهتزازة مما يعيق حركة الإلكترونات الحرة.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sanad_modules_config_db', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('sanad_videos_config_db', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('sanad_handouts_config_db', JSON.stringify(handouts));
  }, [handouts]);

  useEffect(() => {
    localStorage.setItem('sanad_tasks_config_db', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sanad_questions_config_db', JSON.stringify(questions));
  }, [questions]);

  // Filter courses owned by this teacher
  const activeTeacherName = teacherCourses && teacherCourses.length > 0 ? teacherCourses[0].teacher : 'أ. أحمد سامي';

  const getTeacherDefaults = (teacherName: string): { category: 'math' | 'physics' | 'chemistry' | 'languages' | 'biology'; country: 'EG' | 'SA'; teacher: string } => {
    const name = (teacherName || '').toLowerCase();
    if (name.includes('أحمد') || name.includes('saimi') || name.includes('سامي')) {
      return { category: 'physics', country: 'EG', teacher: 'أ. أحمد سامي' };
    } else if (name.includes('فهد') || name.includes('otaibi') || name.includes('عتيبي')) {
      return { category: 'math', country: 'SA', teacher: 'أ. فهد العتيبي' };
    } else if (name.includes('فاروق') || name.includes('najjar') || name.includes('نجار')) {
      return { category: 'languages', country: 'EG', teacher: 'أ. فاروق النجار' };
    } else if (name.includes('نورة') || name.includes('harbi') || name.includes('حربي')) {
      return { category: 'chemistry', country: 'SA', teacher: 'أ. نورة الحربي' };
    }
    return { category: 'physics', country: 'EG', teacher: 'أ. أحمد سامي' };
  };

  const getTeacherAssignedGrades = (teacherName: string): string[] => {
    const name = (teacherName || '').toLowerCase();
    if (name.includes('أحمد') || name.includes('saimi') || name.includes('سامي')) {
      return [
        'الصف الثالث الثانوي',
        'الصف الثاني الثانوي',
        'الصف الأول الثانوي'
      ];
    } else if (name.includes('فهد') || name.includes('otaibi') || name.includes('عتيبي')) {
      return [
        'الصف الثالث ثانوي - مسارات',
        'الصف الثاني ثانوي - مسارات',
        'الصف الأول ثانوي - مسارات',
        'القدرات العامة والتحصيلي'
      ];
    } else if (name.includes('فاروق') || name.includes('najjar') || name.includes('نجار')) {
      return [
        'الصف الثالث الثانوي',
        'الصف الثاني الثانوي',
        'الصف الأول الثانوي'
      ];
    } else if (name.includes('نورة') || name.includes('harbi') || name.includes('حربي')) {
      return [
        'الصف الثالث ثانوي - مسارات',
        'الصف الثاني ثانوي - مسارات'
      ];
    }
    return [
      'الصف الثالث الثانوي',
      'الصف الثاني الثانوي',
      'الصف الأول الثانوي'
    ];
  };

  // Form input states
  // Course States
  const [courseGrade, setCourseGrade] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDiscount, setCourseDiscount] = useState('');
  const [courseImage, setCourseImage] = useState('https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
  const [courseCountry, setCourseCountry] = useState<'EG' | 'SA' | 'both'>('both');
  const [courseCategory, setCourseCategory] = useState<'math' | 'physics' | 'chemistry' | 'languages' | 'biology'>('physics');
  const [courseIsVisible, setCourseIsVisible] = useState<boolean>(true);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState(false);

  // Redesigned Course Operations States
  const [courseOpTab, setCourseOpTab] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('');
  const [selectedCourseToOp, setSelectedCourseToOp] = useState('');
  const [deleteConfirmedInView, setDeleteConfirmedInView] = useState(false);

  // Module States
  const [targetCourseId, setTargetCourseId] = useState('');
  const [modTitleAr, setModTitleAr] = useState('');
  const [modTitleEn, setModTitleEn] = useState('');
  const [modDescAr, setModDescAr] = useState('');
  const [modDescEn, setModDescEn] = useState('');
  const [modPubTime, setModPubTime] = useState('');
  const [modHideTime, setModHideTime] = useState('');
  const [modIsPermanent, setModIsPermanent] = useState(true);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  // Redesigned Module UI States
  const [moduleOpTab, setModuleOpTab] = useState<'add' | 'edit' | 'delete'>('add');
  const [moduleSelectedGrade, setModuleSelectedGrade] = useState('');
  const [moduleSelectedCourseId, setModuleSelectedCourseId] = useState('');
  const [moduleSelectedGroupId, setModuleSelectedGroupId] = useState('');
  const [moduleDeleteConfirmed, setModuleDeleteConfirmed] = useState(false);

  // Video States
  const [videoOpTab, setVideoOpTab] = useState<'add' | 'edit' | 'delete'>('add');
  const [vidSelectedGrade, setVidSelectedGrade] = useState('');
  const [vidSelectedVideoId, setVidSelectedVideoId] = useState('');
  const [vidDeleteConfirmed, setVidDeleteConfirmed] = useState(false);
  const [vidCourseId, setVidCourseId] = useState('');
  const [vidModuleId, setVidModuleId] = useState('');
  const [vidTitleAr, setVidTitleAr] = useState('');
  const [vidTitleEn, setVidTitleEn] = useState('');
  const [vidDescAr, setVidDescAr] = useState('');
  const [vidDescEn, setVidDescEn] = useState('');
  const [vidDuration, setVidDuration] = useState('٣٠ دقيقة');
  const [vidSource, setVidSource] = useState<'youtube' | 'bunny'>('youtube');
  const [vidLink, setVidLink] = useState('');
  const [vidIsFree, setVidIsFree] = useState(true);
  const [vidPubTime, setVidPubTime] = useState('');
  const [vidHideTime, setVidHideTime] = useState('');
  const [vidIsPermanent, setVidIsPermanent] = useState(true);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Handout States
  const [hCourseId, setHCourseId] = useState('');
  const [hModuleId, setHModuleId] = useState('');
  const [hTitleAr, setHTitleAr] = useState('');
  const [hTitleEn, setHTitleEn] = useState('');
  const [hLink, setHLink] = useState('');
  const [hSize, setHSize] = useState('٣.٠ ميجابايت');
  const [editingHandoutId, setEditingHandoutId] = useState<string | null>(null);

  // Advanced Handouts UI States
  const [handoutOpTab, setHandoutOpTab] = useState<'add' | 'edit' | 'delete'>('add');
  const [hGrade, setHGrade] = useState('');
  const [hDescAr, setHDescAr] = useState('');
  const [hFileName, setHFileName] = useState('');
  const [hFileType, setHFileType] = useState('');
  const [hPubTime, setHPubTime] = useState('');
  const [hHideTime, setHHideTime] = useState('');
  const [hSelectedId, setHSelectedId] = useState('');
  const [hDeleteConfirmOpen, setHDeleteConfirmOpen] = useState(false);

  // Sync state when selecting a handout to edit
  useEffect(() => {
    if (handoutOpTab === 'edit' && hSelectedId) {
      const match = handouts.find((h: any) => h.id === hSelectedId);
      if (match) {
        setEditingHandoutId(match.id);
        setHTitleAr(match.titleAr || '');
        setHTitleEn(match.titleEn || match.titleAr || '');
        setHDescAr(match.descAr || '');
        setHFileName(match.fileName || '');
        setHSize(match.fileSize || '٣.٠ ميجابايت');
        setHLink(match.link || '');
        setHFileType(match.fileType || 'pdf');
        setHPubTime(match.pubTime || '');
        setHHideTime(match.hideTime || '');
      }
    } else if (handoutOpTab !== 'edit' || !hSelectedId) {
      setEditingHandoutId(null);
      setHTitleAr('');
      setHTitleEn('');
      setHDescAr('');
      setHFileName('');
      setHSize('٣.٠ ميجابايت');
      setHLink('');
      setHFileType('');
      setHPubTime('');
      setHHideTime('');
    }
  }, [hSelectedId, handoutOpTab, handouts]);

  // Task States
  const [tCourseId, setTCourseId] = useState('');
  const [tModuleId, setTModuleId] = useState('');
  const [tType, setTType] = useState<'exam' | 'assignment'>('exam');
  const [tTitleAr, setTTitleAr] = useState('');
  const [tTitleEn, setTTitleEn] = useState('');
  const [tQuestCount, setTQuestCount] = useState(10);
  const [tDuration, setTDuration] = useState('٣٠ دقيقة');
  const [tMarks, setTMarks] = useState(10);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Question Bank MCQ States
  const [qAr, setQAr] = useState('');
  const [qEn, setQEn] = useState('');
  const [qOptAr0, setQOptAr0] = useState('');
  const [qOptAr1, setQOptAr1] = useState('');
  const [qOptAr2, setQOptAr2] = useState('');
  const [qOptAr3, setQOptAr3] = useState('');
  const [qOptEn0, setQOptEn0] = useState('');
  const [qOptEn1, setQOptEn1] = useState('');
  const [qOptEn2, setQOptEn2] = useState('');
  const [qOptEn3, setQOptEn3] = useState('');
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplain, setQExplain] = useState('');
  // Question full preview upload states
  const [uploadedExamImage, setUploadedExamImage] = useState<string | null>(null);

  // Trigger brief alert
  const triggerSuccessMsg = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCourseImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setCourseImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * 7️⃣ Course management handlers (Fully redesigned)
   */
  const handleSelectCourseForEdit = (courseId: string) => {
    setSelectedCourseToOp(courseId);
    const c = allCourses.find(item => item.id === courseId);
    if (c) {
      setCourseTitle(c.title);
      setCourseGrade(c.level);
      setCoursePrice(c.price.toString());
      setCourseDiscount((c as any).discountPrice ? (c as any).discountPrice.toString() : '');
      setCourseCountry(c.country || 'both');
      setCourseCategory(c.category || 'physics');
      setCourseImage(c.courseImage || 'https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
      setCourseIsVisible(c.isVisible !== false);
    } else {
      setCourseTitle('');
      setCourseGrade('');
      setCoursePrice('');
      setCourseDiscount('');
      setCourseImage('https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
      setCourseIsVisible(true);
    }
  };

  const handleCreateCourseNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const defaults = getTeacherDefaults(activeTeacherName);

    const newCourse: Course = {
      id: 'c_' + Date.now(),
      title: courseTitle,
      teacher: defaults.teacher,
      teacherTitle: isAr ? 'أستاذ المادة' : 'Certified Senior Educator',
      teacherAvatar: '👨‍🏫',
      courseImage: courseImage,
      lessons: 0,
      duration: '—',
      price: Number(coursePrice) || 0,
      currency: isAr ? 'جنيه / ريال' : 'EGP / SAR',
      rating: 4.9,
      category: defaults.category,
      country: defaults.country,
      level: courseGrade || (isAr ? 'الصف الثالث الثانوي' : 'Grade 12'),
      isVisible: courseIsVisible,
    };
    if (courseDiscount) {
      (newCourse as any).discountPrice = Number(courseDiscount);
    }
    setAllCourses(prev => [...prev, newCourse]);
    triggerSuccessMsg(isAr ? '🎉 تم إضافة الكورس بنجاح!' : '🎉 Course created successfully!');

    // Reset fields
    setCourseTitle('');
    setCourseGrade('');
    setCoursePrice('');
    setCourseDiscount('');
    setCourseImage('https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
    setCourseIsVisible(true);
  };

  const handleUpdateCourseNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseToOp || !courseTitle.trim()) return;

    setAllCourses(prev => prev.map(c => {
      if (c.id === selectedCourseToOp) {
        const defaults = getTeacherDefaults(c.teacher || activeTeacherName);
        return {
          ...c,
          title: courseTitle,
          level: courseGrade || c.level,
          price: Number(coursePrice) || 0,
          discountPrice: courseDiscount ? Number(courseDiscount) : undefined,
          category: defaults.category,
          country: defaults.country,
          teacherAvatar: c.teacherAvatar || '👨‍🏫',
          courseImage: courseImage,
          isVisible: courseIsVisible
        };
      }
      return c;
    }));
    triggerSuccessMsg(isAr ? '🎉 تم تعديل الكورس بنجاح!' : '🎉 Course updated successfully!');
    
    // Reset fields
    setCourseTitle('');
    setCourseGrade('');
    setCoursePrice('');
    setCourseDiscount('');
    setCourseImage('https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
    setCourseIsVisible(true);
    setSelectedCourseToOp('');
    setSelectedGradeFilter('');
  };

  const handleDeleteCourseNew = () => {
    if (!selectedCourseToOp) return;
    setAllCourses(prev => prev.filter(c => c.id !== selectedCourseToOp));
    triggerSuccessMsg(isAr ? '🗑 تم حذف الكورس بنجاح!' : '🗑 Course deleted successfully!');
    
    // Reset states
    setSelectedCourseToOp('');
    setSelectedGradeFilter('');
    setDeleteConfirmedInView(false);
  };

  /**
   * 8️⃣ Modules Config handlers
   */
  // Automatic synchronization of form fields in Edit mode when moduleSelectedGroupId changes
  useEffect(() => {
    if (moduleSelectedGroupId && moduleOpTab === 'edit') {
      const m = modules.find((x: any) => x.id === moduleSelectedGroupId);
      if (m) {
        setEditingModuleId(m.id);
        setTargetCourseId(m.courseId);
        setModTitleAr(m.titleAr);
        setModTitleEn(m.titleEn || '');
        setModDescAr(m.descriptionAr || '');
        setModDescEn(m.descriptionEn || '');
        setModPubTime(m.publishTime || '');
        setModHideTime(m.hideTime || '');
        setModIsPermanent(m.isPermanent !== false);
      }
    } else if (moduleOpTab !== 'edit') {
      setEditingModuleId(null);
      setModTitleAr('');
      setModTitleEn('');
      setModDescAr('');
      setModDescEn('');
      setModPubTime('');
      setModHideTime('');
      setModIsPermanent(true);
    }
  }, [moduleSelectedGroupId, moduleOpTab, modules]);

  const handleAddOrEditModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitleAr.trim() || !targetCourseId) return;

    if (editingModuleId) {
      setModules(prev => prev.map(m => {
        if (m.id === editingModuleId) {
          return {
            ...m,
            courseId: targetCourseId,
            titleAr: modTitleAr,
            titleEn: modTitleEn || modTitleAr,
            descriptionAr: modDescAr,
            descriptionEn: modDescEn || modDescAr,
            publishTime: modPubTime,
            hideTime: modHideTime,
            isPermanent: modIsPermanent
          };
        }
        return m;
      }));
      triggerSuccessMsg(isAr ? '🎉 تم تعديل المجموعة بنجاح!' : '🎉 Group updated successfully!');
      
      // Reset inputs & selection
      setEditingModuleId(null);
      setModuleSelectedGroupId('');
    } else {
      const newMod = {
        id: 'mod_' + Date.now(),
        courseId: targetCourseId,
        titleAr: modTitleAr,
        titleEn: modTitleEn || modTitleAr,
        descriptionAr: modDescAr,
        descriptionEn: modDescEn || modDescAr,
        publishTime: modPubTime,
        hideTime: modHideTime,
        isPermanent: modIsPermanent
      };
      setModules(prev => [...prev, newMod]);
      triggerSuccessMsg(isAr ? '🎉 تم إنشاء وإضافة المجموعة الجديدة بنجاح!' : '🎉 Group created and added successfully!');
      
      // Reset layout selection
      setTargetCourseId('');
      setModuleSelectedGrade('');
    }

    setModTitleAr('');
    setModTitleEn('');
    setModDescAr('');
    setModDescEn('');
    setModPubTime('');
    setModHideTime('');
    setModIsPermanent(true);
  };

  const handleEditModuleInit = (m: any) => {
    setEditingModuleId(m.id);
    setTargetCourseId(m.courseId);
    setModTitleAr(m.titleAr);
    setModTitleEn(m.titleEn || '');
    setModDescAr(m.descriptionAr || '');
    setModDescEn(m.descriptionEn || '');
    setModPubTime(m.publishTime || '');
    setModHideTime(m.hideTime || '');
    setModIsPermanent(m.isPermanent !== false);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDeleteModule = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه المجموعة بالكامل؟' : 'Are you sure you want to delete this module?')) {
      setModules(prev => prev.filter(m => m.id !== id));
      triggerSuccessMsg(isAr ? '🗑 تم الحذف بنجاح' : '🗑 Module deleted.');
    }
  };

  const handleRedesignedDeleteModule = () => {
    if (!moduleSelectedGroupId) return;
    setModules(prev => prev.filter(m => m.id !== moduleSelectedGroupId));
    setVideos(prev => prev.filter(v => v.moduleId !== moduleSelectedGroupId));
    setHandouts(prev => prev.filter(h => h.moduleId !== moduleSelectedGroupId));
    setTasks(prev => prev.filter(t => t.moduleId !== moduleSelectedGroupId));
    triggerSuccessMsg(isAr ? '🗑️ تم حذف المجموعة وكافة محتوياتها من الفيديوهات والملفات بنجاح!' : '🗑️ Group and all nested files/videos deleted successfully!');
    
    // Clear page selection
    setModuleSelectedGroupId('');
    setModuleDeleteConfirmed(false);
  };

  /**
   * 9️⃣ Video Management
   */
  const handleLoadVideoToEdit = (vidId: string) => {
    if (!vidId) {
      setEditingVideoId(null);
      setVidTitleAr('');
      setVidTitleEn('');
      setVidDescAr('');
      setVidDescEn('');
      setVidDuration('٣٠ دقيقة');
      setVidSource('youtube');
      setVidLink('');
      setVidIsFree(true);
      setVidPubTime('');
      setVidHideTime('');
      setVidIsPermanent(true);
      return;
    }
    const v = videos.find(x => x.id === vidId);
    if (v) {
      setEditingVideoId(v.id);
      setVidCourseId(v.courseId);
      setVidModuleId(v.moduleId);
      setVidTitleAr(v.titleAr);
      setVidTitleEn(v.titleEn || '');
      setVidDescAr(v.descriptionAr || '');
      setVidDescEn(v.descriptionEn || '');
      setVidDuration(v.duration || '٣٠ دقيقة');
      setVidSource(v.source || 'youtube');
      setVidLink(v.link || '');
      setVidIsFree(v.isFree !== false);
      setVidPubTime(v.publishTime || '');
      setVidHideTime(v.hideTime || '');
      setVidIsPermanent(v.isPermanent !== false);
    }
  };

  const handleRedesignedSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitleAr.trim() || !vidCourseId || !vidModuleId) {
      triggerSuccessMsg(isAr ? '⚠️ يرجى تحديد الكورس والمجموعة وإدخال عنوان للفيديو!' : '⚠️ Please select Course, Group and enter title!');
      return;
    }

    if (videoOpTab === 'edit' && vidSelectedVideoId) {
      setVideos(prev => prev.map(v => {
        if (v.id === vidSelectedVideoId) {
          return {
            ...v,
            courseId: vidCourseId,
            moduleId: vidModuleId,
            titleAr: vidTitleAr,
            titleEn: vidTitleAr,
            descriptionAr: vidDescAr,
            descriptionEn: vidDescAr,
            duration: vidDuration,
            source: vidSource,
            link: vidLink,
            isFree: vidIsFree,
            publishTime: vidPubTime,
            hideTime: vidHideTime,
            isPermanent: vidIsPermanent
          };
        }
        return v;
      }));
      triggerSuccessMsg(isAr ? '🎉 تم حفظ وتعديل المقطع بنجاح!' : '🎉 Video edited successfully!');
      setVidSelectedVideoId('');
      setEditingVideoId(null);
    } else {
      const newVid = {
        id: 'vid_' + Date.now(),
        courseId: vidCourseId,
        moduleId: vidModuleId,
        titleAr: vidTitleAr,
        titleEn: vidTitleAr,
        descriptionAr: vidDescAr,
        descriptionEn: vidDescAr,
        duration: vidDuration,
        source: vidSource,
        link: vidLink,
        isFree: vidIsFree,
        publishTime: vidPubTime,
        hideTime: vidHideTime,
        isPermanent: vidIsPermanent
      };
      setVideos(prev => [...prev, newVid]);
      triggerSuccessMsg(isAr ? '🎉 تم إضافة الفيديو بنجاح!' : '🎉 Video details saved!');
    }

    // Reset common form fields
    setVidTitleAr('');
    setVidTitleEn('');
    setVidDescAr('');
    setVidDescEn('');
    setVidLink('');
    setVidDuration('٣٠ دقيقة');
    setVidIsPermanent(true);
    setVidIsFree(true);
    setVidPubTime('');
    setVidHideTime('');
    setVidSelectedGrade('');
    setVidCourseId('');
    setVidModuleId('');
  };

  const handleRedesignedConfirmDeleteVideo = () => {
    if (!vidSelectedVideoId) return;
    setVideos(prev => prev.filter(v => v.id !== vidSelectedVideoId));
    triggerSuccessMsg(isAr ? '🗑️ تم إزالة وحذف الفيديو بنجاح!' : '🗑️ Video removed successfully!');
    setVidSelectedVideoId('');
    setVidSelectedGrade('');
    setVidCourseId('');
    setVidModuleId('');
    setVidDeleteConfirmed(false);
  };

  /**
   * 🔟 Handouts configuration pdf
   */
  const handleAddNewHandoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hTitleAr.trim() || !hCourseId || !hModuleId) {
      alert(isAr ? 'برجاء تعبئة جميع الحقول الإلزامية مثل الصف الدراسي والكورس والمجموعة وعنوان الملف.' : 'Please enter all mandatory fields.');
      return;
    }
    if (!hFileName) {
      alert(isAr ? 'برجاء رفع أو اختيار ملف أولاً.' : 'Please upload a session file first.');
      return;
    }

    const newHandout = {
      id: 'h_' + Date.now(),
      courseId: hCourseId,
      moduleId: hModuleId,
      titleAr: hTitleAr,
      titleEn: hTitleAr,
      descAr: hDescAr,
      fileName: hFileName,
      fileSize: hSize || '٣.٠ ميجابايت',
      fileType: hFileType || 'pdf',
      link: hLink || `https://sanadschool.run/handouts/${Date.now()}_${hFileName}`,
      pubTime: hPubTime || '',
      hideTime: hHideTime || '',
      createdAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setHandouts((prev: any) => [...prev, newHandout]);
    triggerSuccessMsg(isAr ? '🎉 تم إضافة المذكرة التعليمية وربطها بنجاح!' : '🎉 Handout published successfully!');

    setHTitleAr('');
    setHDescAr('');
    setHFileName('');
    setHFileType('');
    setHSize('٣.٠ ميجابايت');
    setHLink('');
    setHPubTime('');
    setHHideTime('');
  };

  const handleSaveHandoutEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHandoutId) return;
    if (!hTitleAr.trim() || !hCourseId || !hModuleId) {
      alert(isAr ? 'برجاء تعبئة جميع الحقول المطلوبة الكورس والمجموعة وعنوان الملف.' : 'Please fill all required fields.');
      return;
    }

    setHandouts((prev: any) => prev.map((h: any) => {
      if (h.id === editingHandoutId) {
        return {
          ...h,
          courseId: hCourseId,
          moduleId: hModuleId,
          titleAr: hTitleAr,
          titleEn: hTitleAr,
          descAr: hDescAr,
          fileName: hFileName || h.fileName,
          fileSize: hSize,
          fileType: hFileType || h.fileType,
          link: hLink || h.link,
          pubTime: hPubTime,
          hideTime: hHideTime
        };
      }
      return h;
    }));

    triggerSuccessMsg(isAr ? '✏️ تم تحديث بيانات المذكرة بنجاح!' : '✏️ Handout updated successfully!');
    setEditingHandoutId(null);
    setHSelectedId('');
    setHTitleAr('');
    setHDescAr('');
    setHFileName('');
    setHFileType('');
    setHSize('٣.٠ ميجابايت');
    setHLink('');
    setHPubTime('');
    setHHideTime('');
  };

  const handleConfirmDeleteHandout = () => {
    if (!hSelectedId) return;
    setHandouts((prev: any) => prev.filter((h: any) => h.id !== hSelectedId));
    triggerSuccessMsg(isAr ? '🗑️ تم حذف وتصفية الملف بالكامل من النظام!' : '🗑️ File deleted successfully!');
    setHSelectedId('');
    setHDeleteConfirmOpen(false);
  };

  /**
   * 1️⃣1️⃣ Tasks: Exam & Assignment configuration
   */
  const handleAddOrEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitleAr.trim() || !tCourseId) return;

    if (editingTaskId) {
      setTasks(prev => prev.map(tk => {
        if (tk.id === editingTaskId) {
          return {
            ...tk,
            courseId: tCourseId,
            moduleId: tModuleId,
            type: tType,
            titleAr: tTitleAr,
            titleEn: tTitleEn || tTitleAr,
            questionsCount: tQuestCount,
            duration: tDuration,
            totalMarks: tMarks
          };
        }
        return tk;
      }));
      triggerSuccessMsg(isAr ? '🎉 تم تعديل وحفظ بيانات التقييم بالكامل!' : '🎉 Work details updated!');
      setEditingTaskId(null);
    } else {
      const newTk = {
        id: 'tk_' + Date.now(),
        courseId: tCourseId,
        moduleId: tModuleId,
        type: tType,
        titleAr: tTitleAr,
        titleEn: tTitleEn || tTitleAr,
        questionsCount: tQuestCount,
        duration: tDuration,
        totalMarks: tMarks
      };
      setTasks(prev => [...prev, newTk]);
      triggerSuccessMsg(isAr ? '🎉 تم نشر وإتاحة الاختبار للطلاب بنجاح!' : '🎉 Assessment published!');
    }

    setTTitleAr('');
    setTTitleEn('');
    setTQuestCount(10);
    setTMarks(10);
    setTModuleId('');
  };

  const handleEditTaskInit = (tk: any) => {
    setEditingTaskId(tk.id);
    setTCourseId(tk.courseId);
    setTModuleId(tk.moduleId || '');
    setTType(tk.type || 'exam');
    setTTitleAr(tk.titleAr);
    setTTitleEn(tk.titleEn || '');
    setTQuestCount(tk.questionsCount || 10);
    setTDuration(tk.duration || '٣٠ دقيقة');
    setTMarks(tk.totalMarks || 10);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDeleteTask = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه المهمة ونتائج الطلاب فيها؟' : 'Are you sure you want to delete this assignment?')) {
      setTasks(prev => prev.filter(tk => tk.id !== id));
      triggerSuccessMsg('🗑 Deleted assessment.');
    }
  };

  /**
   * 1️⃣2️⃣ Question Bank MCQ handling
   */
  const handleAddQuestionToBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qAr.trim()) return;

    const newQ = {
      id: 'q_' + Date.now(),
      type: 'mcq',
      questionAr: qAr,
      questionEn: qEn || qAr,
      optionsAr: [qOptAr0, qOptAr1, qOptAr2, qOptAr3].filter(o => o.trim() !== ''),
      optionsEn: [qOptEn0, qOptEn1, qOptEn2, qOptEn3].filter(o => o.trim() !== ''),
      correctOption: qCorrect,
      explanationAr: qExplain
    };

    setQuestions(prev => [...prev, newQ]);
    triggerSuccessMsg(isAr ? '🎉 تم بناء وصياغة السؤال داخل البنك العام الموحد!' : '🎉 MCQ saved to unified question bank!');
    
    // Reset Form
    setQAr('');
    setQEn('');
    setQOptAr0('');
    setQOptAr1('');
    setQOptAr2('');
    setQOptAr3('');
    setQOptEn0('');
    setQOptEn1('');
    setQOptEn2('');
    setQOptEn3('');
    setQExplain('');
  };

  // Drag n drop simulation
  const handleSimulationImageDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setUploadedExamImage(event.target.result as string);
          
          // Save fully uploaded image exam to question bank
          const newQImg = {
            id: 'q_img_' + Date.now(),
            type: 'image_paper',
            questionAr: isAr ? '📄 صورة امتحان كاملة مرفوعة للمعاينة والحل اليدوي' : '📄 Full assessment paper uploaded as picture',
            questionEn: 'Full paper image',
            optionsAr: [],
            optionsEn: [],
            correctOption: 0,
            examImage: event.target.result as string
          };
          setQuestions(prev => [...prev, newQImg]);
          triggerSuccessMsg(isAr ? '🎉 تم رفع صورة الامتحان كاملة وبثها لغرف الطلاب بنجاح!' : '🎉 Full exam picture paper published successfully!');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  /**
   * 6️⃣ Content arrangement sequencing tools
   */
  const [reorderCourseId, setReorderCourseId] = useState('');
  const [selectedModuleIdForContentReorder, setSelectedModuleIdForContentReorder] = useState('');
  
  const moveModuleUp = (moduleId: string) => {
    const mainIndex = modules.findIndex(m => m.id === moduleId);
    if (mainIndex === -1) return;
    
    const targetCourse = modules[mainIndex].courseId;
    let prevIndex = -1;
    for (let i = mainIndex - 1; i >= 0; i--) {
      if (modules[i].courseId === targetCourse) {
        prevIndex = i;
        break;
      }
    }
    
    if (prevIndex === -1) return;
    const items = [...modules];
    const temp = items[mainIndex];
    items[mainIndex] = items[prevIndex];
    items[prevIndex] = temp;
    setModules(items);
    triggerSuccessMsg(isAr ? '⬆ تم رفع رتبة المجموعة في تتابع العرض' : '⬆ Reorganized current display hierarchy');
  };

  const moveModuleDown = (moduleId: string) => {
    const mainIndex = modules.findIndex(m => m.id === moduleId);
    if (mainIndex === -1) return;
    
    const targetCourse = modules[mainIndex].courseId;
    let nextIndex = -1;
    for (let i = mainIndex + 1; i < modules.length; i++) {
      if (modules[i].courseId === targetCourse) {
        nextIndex = i;
        break;
      }
    }
    
    if (nextIndex === -1) return;
    const items = [...modules];
    const temp = items[mainIndex];
    items[mainIndex] = items[nextIndex];
    items[nextIndex] = temp;
    setModules(items);
    triggerSuccessMsg(isAr ? '⬇ تم خفض رتبة المجموعة في تتابع العرض' : '⬇ Reorganized current display hierarchy');
  };

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const moveModuleItemUp = (itemType: 'video' | 'handout' | 'task', itemId: string) => {
    const targetModuleId = selectedModuleIdForContentReorder;
    if (!targetModuleId) return;

    const moduleVids = videos.filter(v => v.moduleId === targetModuleId).map(v => ({ ...v, itemType: 'video' as const }));
    const moduleHandouts = handouts.filter(h => h.moduleId === targetModuleId).map(h => ({ ...h, itemType: 'handout' as const }));
    const moduleTasks = tasks.filter(t => t.moduleId === targetModuleId).map(t => ({ ...t, itemType: 'task' as const }));

    const combined = [...moduleVids, ...moduleHandouts, ...moduleTasks];

    combined.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      const typeOrder: Record<string, number> = { 'video': 1, 'handout': 2, 'task': 3 };
      return (typeOrder[a.itemType] || 99) - (typeOrder[b.itemType] || 99);
    });

    const currIdx = combined.findIndex(item => item.itemType === itemType && item.id === itemId);
    if (currIdx <= 0) return;

    const temp = combined[currIdx];
    combined[currIdx] = combined[currIdx - 1];
    combined[currIdx - 1] = temp;

    const updatedVideos = [...videos];
    const updatedHandouts = [...handouts];
    const updatedTasks = [...tasks];

    combined.forEach((item, index) => {
      if (item.itemType === 'video') {
        const idx = updatedVideos.findIndex(v => v.id === item.id);
        if (idx !== -1) updatedVideos[idx] = { ...updatedVideos[idx], order: index };
      } else if (item.itemType === 'handout') {
        const idx = updatedHandouts.findIndex(h => h.id === item.id);
        if (idx !== -1) updatedHandouts[idx] = { ...updatedHandouts[idx], order: index };
      } else if (item.itemType === 'task') {
        const idx = updatedTasks.findIndex(t => t.id === item.id);
        if (idx !== -1) updatedTasks[idx] = { ...updatedTasks[idx], order: index };
      }
    });

    setVideos(updatedVideos);
    setHandouts(updatedHandouts);
    setTasks(updatedTasks);
    triggerSuccessMsg(isAr ? '⬆ تم رفع رتبة العنصر بداخل المجموعة الموحدة بنجاح' : '⬆ Item order bumped in the unified module successfully');
  };

  const moveModuleItemDown = (itemType: 'video' | 'handout' | 'task', itemId: string) => {
    const targetModuleId = selectedModuleIdForContentReorder;
    if (!targetModuleId) return;

    const moduleVids = videos.filter(v => v.moduleId === targetModuleId).map(v => ({ ...v, itemType: 'video' as const }));
    const moduleHandouts = handouts.filter(h => h.moduleId === targetModuleId).map(h => ({ ...h, itemType: 'handout' as const }));
    const moduleTasks = tasks.filter(t => t.moduleId === targetModuleId).map(t => ({ ...t, itemType: 'task' as const }));

    const combined = [...moduleVids, ...moduleHandouts, ...moduleTasks];

    combined.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      const typeOrder: Record<string, number> = { 'video': 1, 'handout': 2, 'task': 3 };
      return (typeOrder[a.itemType] || 99) - (typeOrder[b.itemType] || 99);
    });

    const currIdx = combined.findIndex(item => item.itemType === itemType && item.id === itemId);
    if (currIdx === -1 || currIdx >= combined.length - 1) return;

    const temp = combined[currIdx];
    combined[currIdx] = combined[currIdx + 1];
    combined[currIdx + 1] = temp;

    const updatedVideos = [...videos];
    const updatedHandouts = [...handouts];
    const updatedTasks = [...tasks];

    combined.forEach((item, index) => {
      if (item.itemType === 'video') {
        const idx = updatedVideos.findIndex(v => v.id === item.id);
        if (idx !== -1) updatedVideos[idx] = { ...updatedVideos[idx], order: index };
      } else if (item.itemType === 'handout') {
        const idx = updatedHandouts.findIndex(h => h.id === item.id);
        if (idx !== -1) updatedHandouts[idx] = { ...updatedHandouts[idx], order: index };
      } else if (item.itemType === 'task') {
        const idx = updatedTasks.findIndex(t => t.id === item.id);
        if (idx !== -1) updatedTasks[idx] = { ...updatedTasks[idx], order: index };
      }
    });

    setVideos(updatedVideos);
    setHandouts(updatedHandouts);
    setTasks(updatedTasks);
    triggerSuccessMsg(isAr ? '⬇ تم خفض رتبة العنصر بداخل المجموعة الموحدة بنجاح' : '⬇ Item order lowered in the unified module successfully');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDragDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const targetModuleId = selectedModuleIdForContentReorder;
    if (!targetModuleId) return;

    const moduleVids = videos.filter(v => v.moduleId === targetModuleId).map(v => ({ ...v, itemType: 'video' as const }));
    const moduleHandouts = handouts.filter(h => h.moduleId === targetModuleId).map(h => ({ ...h, itemType: 'handout' as const }));
    const moduleTasks = tasks.filter(t => t.moduleId === targetModuleId).map(t => ({ ...t, itemType: 'task' as const }));

    const combined = [...moduleVids, ...moduleHandouts, ...moduleTasks];

    combined.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      const typeOrder: Record<string, number> = { 'video': 1, 'handout': 2, 'task': 3 };
      return (typeOrder[a.itemType] || 99) - (typeOrder[b.itemType] || 99);
    });

    const reordered = [...combined];
    const [removed] = reordered.splice(draggedItemIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updatedVideos = [...videos];
    const updatedHandouts = [...handouts];
    const updatedTasks = [...tasks];

    reordered.forEach((item, index) => {
      if (item.itemType === 'video') {
        const idx = updatedVideos.findIndex(v => v.id === item.id);
        if (idx !== -1) updatedVideos[idx] = { ...updatedVideos[idx], order: index };
      } else if (item.itemType === 'handout') {
        const idx = updatedHandouts.findIndex(h => h.id === item.id);
        if (idx !== -1) updatedHandouts[idx] = { ...updatedHandouts[idx], order: index };
      } else if (item.itemType === 'task') {
        const idx = updatedTasks.findIndex(t => t.id === item.id);
        if (idx !== -1) updatedTasks[idx] = { ...updatedTasks[idx], order: index };
      }
    });

    setVideos(updatedVideos);
    setHandouts(updatedHandouts);
    setTasks(updatedTasks);
    setDraggedItemIndex(null);
    triggerSuccessMsg(isAr ? '🎯 تم إعادة ترتيب العناصر بسحب وإفلات سلس!' : '🎯 Items sequence reordered successfully via drag and drop!');
  };

  return (
    <div className="space-y-6 text-right">

      {/* Unified Styled Header Component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl leading-none">
              {activeSubSection === 'courses' && '📚'}
              {activeSubSection === 'modules' && '📘'}
              {activeSubSection === 'videos' && '🎥'}
              {activeSubSection === 'handouts' && '📄'}
              {activeSubSection === 'tasks' && '📝'}
              {activeSubSection === 'qbank' && '🧬'}
              {activeSubSection === 'reorder' && '🔄'}
            </span>
            <span>
              {activeSubSection === 'courses' && (isAr ? 'إدارة وتخطيط المناهج التعليمية' : 'Manage & Plan Curriculums')}
              {activeSubSection === 'modules' && (isAr ? 'تأسيس وتقسيم مجموعات الكورسات' : 'Add & Manage Groups/Modules')}
              {activeSubSection === 'videos' && (isAr ? 'إدارة ونشر الفيديوهات والمحاضرات' : 'Add & Manage Video Content')}
              {activeSubSection === 'handouts' && (isAr ? 'إدارة الملفات والملازم والمرفقات' : 'Manage Files & Handouts')}
              {activeSubSection === 'tasks' && (isAr ? 'صياغة الامتحانات والواجبات المنزلية' : 'Manage Exams & Assignments')}
              {activeSubSection === 'qbank' && (isAr ? 'بنك الأسئلة والتمارين التفاعلية' : 'Interactive Questions Bank')}
              {activeSubSection === 'reorder' && (isAr ? 'إعادة ترتيب هيكلية محتوى المجموعات' : 'Course Content Reordering Center')}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-450 font-bold">
            {activeSubSection === 'courses' && (isAr ? 'شاشتك المتكاملة لتسجيل المقررات، إعداد العناوين وتعديل الأسعار والمستويات الدراسية.' : 'Enroll courses, set pricing, choose academic configurations')}
            {activeSubSection === 'modules' && (isAr ? 'قسم الكورسات إلى مجموعات فصول تفصيلية لترتيب الشرح والواجبات بداخلها.' : 'Structure courses into logical modules or groups.')}
            {activeSubSection === 'videos' && (isAr ? 'ارفه وانشر الفيديوهات والشروحات مع حماية متكاملة لبث الفيديو ومنع تسريب المحتوى.' : 'Upload secure streaming lectures linked to student profiles.')}
            {activeSubSection === 'handouts' && (isAr ? 'أرفق المستندات والملازم المساعدة وبنك المسائل لدعم الشرح بملفات PDF.' : 'Attach PDFs and reading resources directly to student channels.')}
            {activeSubSection === 'tasks' && (isAr ? 'أنشئ اختبارات دورية تقييمية وواجبات منزلية للتحقق من استفادة الطلاب ومتابعة أدائهم.' : 'Create cumulative grade challenges, homework tasks, or timers.')}
            {activeSubSection === 'qbank' && (isAr ? 'بنك كامل لصياغة وحفظ مسائل الاختيار من متعدد مع شرح الحل النموذجي.' : 'Draft MCQ bank with custom answers and step-by-step guidance.')}
            {activeSubSection === 'reorder' && (isAr ? 'تحكم بالترتيب الزمني الدقيق لظهور الفيديوهات والملفات والواجبات بسحب وإفلات تفاعلي سلس.' : 'Control exactly how items appear inside the group via fluid drag-and-drop.')}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {activeSubSection === 'courses' && (
            <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 rounded-2xl shadow-sm select-none">
              📚 {allCourses.length} {isAr ? 'مقررات مسجلة' : 'Registered Courses'}
            </span>
          )}
          {activeSubSection === 'modules' && (
            <span className="text-xs font-black px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 rounded-2xl shadow-sm select-none">
              📘 {modules.length} {isAr ? 'مجموعات نشطة' : 'Active Groups'}
            </span>
          )}
          {activeSubSection === 'videos' && (
            <span className="text-xs font-black px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 rounded-2xl shadow-sm select-none">
              🎥 {videos.length} {isAr ? 'محاضرات فيديو وبث' : 'Secure Streaming Videos'}
            </span>
          )}
          {activeSubSection === 'handouts' && (
            <span className="text-xs font-black px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 rounded-2xl shadow-sm select-none">
              📄 {handouts.length} {isAr ? 'ملفات ومرفقات' : 'Active Handouts'}
            </span>
          )}
          {activeSubSection === 'tasks' && (
            <span className="text-xs font-black px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 rounded-2xl shadow-sm select-none">
              📝 {tasks.length} {isAr ? 'امتحانات وواجبات' : 'Exams and Tasks'}
            </span>
          )}
          {activeSubSection === 'qbank' && (
            <span className="text-xs font-black px-3 py-1.5 bg-neutral-500/10 text-neutral-600 dark:bg-neutral-500/15 dark:text-neutral-400 rounded-2xl shadow-sm select-none">
              🧬 {questions.length} {isAr ? 'قضايا ومسائل مخزنة' : 'Stored MCQs'}
            </span>
          )}
          {activeSubSection === 'reorder' && (
            <span className="text-xs font-black px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 rounded-2xl shadow-sm select-none">
              🔄 {isAr ? 'ترتيب مرن مفعل' : 'Drag-reorder enabled'}
            </span>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/25 dark:text-indigo-400 border border-indigo-500/15 text-xs font-black flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {activeSubSection === 'courses' && (
        <div className="space-y-6">
          {/* Main Segmented Mode Selection */}
          <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-3xl max-w-2xl mx-auto grid grid-cols-3 gap-2.5 border border-neutral-200/50 dark:border-neutral-800/60 shadow-lg shadow-indigo-500/5 my-4">
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setCourseOpTab('add');
                // Reset inputs
                setCourseTitle('');
                setCourseGrade('');
                setCoursePrice('');
                setCourseDiscount('');
                setCourseImage('📚');
                setSelectedCourseToOp('');
                setSelectedGradeFilter('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                courseOpTab === 'add'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-700 text-white shadow-md shadow-emerald-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Plus className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? '➕ إضافة كورس' : 'Add Course'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setCourseOpTab('edit');
                // Reset inputs
                setCourseTitle('');
                setCourseGrade('');
                setCoursePrice('');
                setCourseDiscount('');
                setCourseImage('📚');
                setSelectedCourseToOp('');
                setSelectedGradeFilter('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                courseOpTab === 'edit'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-750 text-white shadow-md shadow-amber-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Edit2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? '✏️ تعديل كورس' : 'Edit Course'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setCourseOpTab('delete');
                // Reset inputs
                setSelectedCourseToOp('');
                setSelectedGradeFilter('');
                setDeleteConfirmedInView(false);
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                courseOpTab === 'delete'
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-red-650 dark:from-rose-600 dark:via-red-600 dark:to-red-750 text-white shadow-md shadow-rose-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Trash2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? '🗑️ حذف كورس' : 'Delete Course'}</span>
            </motion.button>
          </div>

          {/* Tab Views */}
          <div className="max-w-4xl mx-auto">
            {/* 1) ADD TAB */}
            {courseOpTab === 'add' && (
              <form onSubmit={handleCreateCourseNew} className="bg-white dark:bg-neutral-855 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-6">
                <div className="border-b border-neutral-100 dark:border-neutral-805 pb-3">
                  <h3 className="text-base font-black text-neutral-800 dark:text-white">➕ {isAr ? 'إدخال كورس جديد' : 'New Course Details'}</h3>
                  <p className="text-[11px] text-neutral-450 dark:text-neutral-500 font-bold">{isAr ? 'قم بملء البيانات بالكامل لإطلاق الكورس.' : 'Enter variables to publish course to curriculum.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col justify-start">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الصف والمستوى الدراسي' : 'Educational Grade / Major'}</label>
                    <select
                      required
                      value={courseGrade}
                      onChange={e => setCourseGrade(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-105 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- اختر الصف الدراسي المعتمد --' : '-- Choose Grade Level --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'عنوان الكورس التفصيلي' : 'Course Core Title'}</label>
                    <input
                      required
                      type="text"
                      value={courseTitle}
                      onChange={e => setCourseTitle(e.target.value)}
                      placeholder={isAr ? 'مثال: فيزياء التيار والكهرباء الحديثة...' : 'Course title...'}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-neutral-500">{isAr ? 'وصف الكورس' : 'Description summary'}</label>
                  <textarea
                    rows={3}
                    value={courseDesc}
                    onChange={e => setCourseDesc(e.target.value)}
                    placeholder={isAr ? 'شرح بسيط لما يغطيه الكورس ومميزاته للطلاب...' : 'Course syllabus text summary...'}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none resize-none"
                  />
                </div>

                {/* Course Cover Image Picker */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-neutral-500">
                    {isAr ? '🖼️ صورة كارت الكورس الأساسية للطلاب (رفع مباشر)' : '🖼️ Course Card Image (Direct Device Upload)'}
                  </label>
                  
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('course-image-upload-add')?.click()}
                    className={`border-4 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden group ${
                      dragActive 
                        ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-inner' 
                        : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-900/80 shadow-xs'
                    }`}
                  >
                    <input 
                      type="file"
                      id="course-image-upload-add"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />

                    {courseImage && courseImage !== '📚' && courseImage.startsWith('data:') ? (
                      <div className="space-y-3 w-full flex flex-col items-center">
                        <img 
                          src={courseImage} 
                          alt="Course Cover Preview" 
                          className="max-h-36 object-contain rounded-2xl border-2 border-neutral-300 dark:border-neutral-800 shadow-lg max-w-xs transition duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-indigo-650 dark:text-indigo-400">
                            {isAr ? '✓ تم رفع الصورة بنجاح' : '✓ Image uploaded successfully'}
                          </p>
                          <p className="text-[10px] text-neutral-450 dark:text-neutral-500 font-bold">
                            {isAr ? 'اسحب وأفلت صورة أخرى هنا، أو اضغط للاستبدال' : 'Click or drag another file here to replace'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-4xl text-neutral-400">📤</div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                            {isAr ? 'انقر للرفع مباشرة من جهازك، أو اسحب صورة غلاف كارت الكورس وألقها هنا' : 'Click to select or drag & drop course cover image file here'}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold">
                            {isAr ? 'هذه هي الصورة الأساسية التي ستظهر داخل كارت الكورس للطلاب في المنصة.' : 'This image appears prominent on the course card.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'سعر الكورس الأساسي' : 'Base Price'}</label>
                      <input
                        required
                        type="number"
                        value={coursePrice}
                        onChange={e => setCoursePrice(e.target.value)}
                        placeholder="250"
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الخصم (اختياري)' : 'Discount Price (Optional)'}</label>
                      <input
                        type="number"
                        value={courseDiscount}
                        onChange={e => setCourseDiscount(e.target.value)}
                        placeholder="200"
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Course Status Segmented Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500 block">
                      {isAr ? '🔘 حالة الكورس للطلاب' : '🔘 Course Visibility Status'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setCourseIsVisible(true)}
                        className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                          courseIsVisible
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                        }`}
                      >
                        🟢 {isAr ? 'مفعل (ظاهر للجميع)' : 'Visible (Public)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseIsVisible(false)}
                        className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                          !courseIsVisible
                            ? 'bg-neutral-500 text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                        }`}
                      >
                        🔴 {isAr ? 'مخفي (للتحضير فقط)' : 'Hidden (Draft)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Intelligent Profile Metadata Box instead of selection dropdowns */}
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-150 dark:border-indigo-900/30 text-xs text-indigo-750 dark:text-indigo-400 space-y-2">
                  <p className="font-extrabold flex items-center gap-1.5">
                    <span>✨ {isAr ? 'بيانات المنهج المنسقة تلقائيًا:' : 'Intelligent Automated Metadata:'}</span>
                  </p>
                  <p className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-450">
                    {isAr 
                      ? 'بناءً على ملفك الشخصي المعتمد من الإدارة، يتم تصنيف الكورس وتحديد القيود الجغرافية والمنهج تلقائيًا بدون حاجة لتدخل يدوي.'
                      : 'Based on your authorized teacher credential profile, subject tags and country classifications are resolved dynamically.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-1 font-black">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'تصنيف المادة' : 'Subject Category'}</span>
                      <span className="text-neutral-900 dark:text-white capitalize">
                        {getTeacherDefaults(activeTeacherName).category === 'physics' ? (isAr ? '⚛️ فيزياء' : 'Physics') :
                         getTeacherDefaults(activeTeacherName).category === 'math' ? (isAr ? '🧮 رياضيات' : 'Mathematics') :
                         getTeacherDefaults(activeTeacherName).category === 'chemistry' ? (isAr ? '🧪 كيمياء' : 'Chemistry') :
                         getTeacherDefaults(activeTeacherName).category === 'biology' ? (isAr ? '🧬 أحياء' : 'Biology') : (isAr ? '📚 لغات وأدب' : 'Languages')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'البلد والمنهج' : 'Country Curriculum'}</span>
                      <span className="text-neutral-900 dark:text-white">
                        {getTeacherDefaults(activeTeacherName).country === 'EG' ? (isAr ? 'جمهورية مصر العربية 🇪🇬' : 'Egypt Curriculum 🇪🇬') : (isAr ? 'المملكة العربية السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isAr ? 'إضافة الكورس ونشره فورا للطلاب ⚡' : 'Publish and Broadcast Course ⚡'}</span>
                </button>
              </form>
            )}

            {/* 2) EDIT TAB */}
            {courseOpTab === 'edit' && (
              <div className="bg-white dark:bg-neutral-855 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-6">
                <div className="border-b border-neutral-100 dark:border-neutral-805 pb-3">
                  <h3 className="text-base font-black text-neutral-805 dark:text-white">✏️ {isAr ? 'تعديل بيانات كورس' : 'Edit Course'}</h3>
                  <p className="text-[11px] text-neutral-450 dark:text-neutral-500 font-bold">{isAr ? 'حدد الصف وسيتم تحميل الكورسات الخاصة به تلقائيًا لتعديل تفاصيلها الحالية.' : 'Choose the category filters dynamically to mutate course fields.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Grade */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? '1. اختيار الصف الدراسي' : '1. Choose Grade Level'}</label>
                    <select
                      value={selectedGradeFilter}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedGradeFilter(val);
                        setSelectedCourseToOp(''); // Reset course target
                        // Reset form fields
                        setCourseTitle('');
                        setCourseGrade('');
                        setCoursePrice('');
                        setCourseDiscount('');
                        setCourseImage('https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80');
                      }}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                    >
                      <option value="">{isAr ? '-- اختر الصف الدراسي المطلوب --' : '-- Select Target Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Course from Grade */}
                  {selectedGradeFilter && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? '2. اختيار الكورس المطلوب تعديله' : '2. Select Targeted Course'}</label>
                      <select
                        value={selectedCourseToOp}
                        onChange={e => handleSelectCourseForEdit(e.target.value)}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/10 dark:bg-neutral-900 outline-none"
                      >
                        <option value="">{isAr ? '-- اختر الكورس من القائمة --' : '-- Choose Course --'}</option>
                        {allCourses.filter(c => c.level === selectedGradeFilter).map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* If selected grade has no courses */}
                {selectedGradeFilter && allCourses.filter(c => c.level === selectedGradeFilter).length === 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center text-xs font-bold text-amber-600">
                    ⚠️ {isAr ? 'لا توجد أي كورسات نشطة مدخلة لهذا الصف الدراسي حاليا.' : 'No courses registered in this level yet.'}
                  </div>
                )}
                {selectedCourseToOp && (
                  <form onSubmit={handleUpdateCourseNew} className="p-5 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 space-y-5">
                    <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span className="text-[10px] font-black text-indigo-650 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">{isAr ? 'تحميل البيانات الحالية بنجاح' : 'Current data pre-populated'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 flex flex-col justify-start">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الصف والمستوى الدراسي المعتمد' : 'Authorized Grade Level'}</label>
                        <select
                          required
                          value={courseGrade}
                          onChange={e => setCourseGrade(e.target.value)}
                          className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-105 outline-none cursor-pointer"
                        >
                          <option value="">{isAr ? '-- اختر الصف الدراسي المعتمد --' : '-- Choose Grade Level --'}</option>
                          {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'عنوان الكورس' : 'Course Title'}</label>
                        <input
                          required
                          type="text"
                          value={courseTitle}
                          onChange={e => setCourseTitle(e.target.value)}
                          className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'وصف الكورس' : 'Description summary'}</label>
                      <textarea
                        rows={3}
                        value={courseDesc || ''}
                        onChange={e => setCourseDesc(e.target.value)}
                        placeholder={isAr ? 'شرح بسيط لما يغطيه الكورس ومميزاته للطلاب...' : 'Course syllabus text summary...'}
                        className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none resize-none"
                      />
                    </div>

                    {/* Course Cover Image Picker */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-neutral-500">
                        {isAr ? '🖼️ صورة كارت الكورس الأساسية للطلاب (رفع مباشر)' : '🖼️ Course Card Image (Direct Device Upload)'}
                      </label>
                      
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('course-image-upload-edit')?.click()}
                        className={`border-4 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[185px] relative overflow-hidden group ${
                          dragActive 
                            ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-inner' 
                            : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-900/80 shadow-xs'
                        }`}
                      >
                        <input 
                          type="file"
                          id="course-image-upload-edit"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />

                        {courseImage && courseImage !== '📚' && courseImage.startsWith('data:') ? (
                          <div className="space-y-3 w-full flex flex-col items-center">
                            <img 
                              src={courseImage} 
                              alt="Course Cover Preview" 
                              className="max-h-36 object-contain rounded-2xl border-2 border-neutral-300 dark:border-neutral-850 shadow-lg max-w-xs transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1">
                              <p className="text-xs font-black text-indigo-650 dark:text-indigo-400">
                                {isAr ? '✓ تم رفع الصورة بنجاح' : '✓ Image uploaded successfully'}
                              </p>
                              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 font-bold">
                                {isAr ? 'اسحب وأفلت صورة أخرى هنا، أو اضغط للاستبدال' : 'Click or drag another file here to replace'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-4xl text-neutral-400">📤</div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                                {isAr ? 'انقر للرفع مباشرة من جهازك، أو اسحب صورة غلاف كارت الكورس وألقها هنا' : 'Click to select or drag & drop course cover image file here'}
                              </p>
                              <p className="text-[10px] text-neutral-400 font-bold">
                                {isAr ? 'هذه هي الصورة الأساسية التي ستظهر داخل كارت الكورس للطلاب في المنصة.' : 'This image appears prominent on the course card.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-black text-neutral-500">{isAr ? 'السعر الكلي' : 'Full price'}</label>
                          <input
                            required
                            type="number"
                            value={coursePrice}
                            onChange={e => setCoursePrice(e.target.value)}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الخصم (اختياري)' : 'Discount Price (Optional)'}</label>
                          <input
                            type="number"
                            value={courseDiscount}
                            onChange={e => setCourseDiscount(e.target.value)}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Course Status Segmented Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-neutral-500 block">
                          {isAr ? '🔘 حالة الكورس للطلاب' : '🔘 Course Visibility Status'}
                        </label>
                        <div className="grid grid-cols-2 gap-3 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-850">
                          <button
                            type="button"
                            onClick={() => setCourseIsVisible(true)}
                            className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                              courseIsVisible
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                            }`}
                          >
                            🟢 {isAr ? 'مفعل (ظاهر للجميع)' : 'Visible (Public)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseIsVisible(false)}
                            className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                              !courseIsVisible
                                ? 'bg-neutral-500 text-white shadow-xs'
                                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
                            }`}
                          >
                            🔴 {isAr ? 'مخفي (للتحضير فقط)' : 'Hidden (Draft)'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-850 text-white text-xs font-black rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <span>💾 {isAr ? 'تحديث وحفظ التعديلات' : 'Save general updates'}</span>
                    </button>
                  </form>
                )}

                {/* If nothing selected */}
                {!selectedGradeFilter && (
                  <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-850 text-neutral-400">
                    <span className="text-2xl block mb-2 font-black">✏️</span>
                    <p className="text-xs font-bold">{isAr ? 'برجاء اختيار الصف الدراسي أولاً لتظهر لك جميع الكورسات لتعديلها.' : 'Please choose a grade level first to list active courses.'}</p>
                  </div>
                )}
              </div>
            )}

            {/* 3) DELETE TAB */}
            {courseOpTab === 'delete' && (
              <div className="bg-white dark:bg-neutral-855 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-6">
                <div className="border-b border-neutral-100 dark:border-neutral-805 pb-3">
                  <h3 className="text-base font-black text-neutral-805 dark:text-white">🗑️ {isAr ? 'حذف كورس' : 'Delete Course'}</h3>
                  <p className="text-[11px] text-neutral-450 dark:text-neutral-500 font-bold">{isAr ? 'اختر الصف الدراسي ثم الكورس وسيتحقق البرنامج من موافقتك الصريحة قبل إلغاء الحجز.' : 'Pick grade and course to delete securely. Safe confirmation triggers before execution.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Grade */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? '1. اختيار الصف الدراسي للاستهداف' : '1. Select Grade Level'}</label>
                    <select
                      value={selectedGradeFilter}
                      onChange={e => {
                        setSelectedGradeFilter(e.target.value);
                        setSelectedCourseToOp(''); // Reset
                        setDeleteConfirmedInView(false);
                      }}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                    >
                      <option value="">{isAr ? '-- اختر الصف المطلوب تصفية كورساته --' : '-- Choose Grade Level --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Course from chosen grade */}
                  {selectedGradeFilter && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? '2. اختيار الكورس المستهدف للحذف' : '2. Select target course'}</label>
                      <select
                        value={selectedCourseToOp}
                        onChange={e => {
                          setSelectedCourseToOp(e.target.value);
                          setDeleteConfirmedInView(false);
                        }}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/10 dark:bg-neutral-900 outline-none"
                      >
                        <option value="">{isAr ? '-- اختر الكورس المراد حذفه --' : '-- Select Targeted Course --'}</option>
                        {allCourses.filter(c => c.level === selectedGradeFilter).map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* No courses fallback */}
                {selectedGradeFilter && allCourses.filter(c => c.level === selectedGradeFilter).length === 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center text-xs font-bold text-amber-600">
                    ⚠️ {isAr ? 'لا توجد كورسات مدخلة بداخل هذا الصف الدراسي حالياً.' : 'No courses found in this grade level.'}
                  </div>
                )}

                {/* Once course is selected ask for confirmation */}
                {selectedCourseToOp && (
                  <div className="p-5 bg-rose-500/5 dark:bg-rose-950/10 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⚠️</span>
                      <div>
                        <h4 className="text-xs font-black text-rose-700 dark:text-rose-400">{isAr ? 'مراجعة بيانات الحذف والتصفية' : 'Course deletion summary overview'}</h4>
                        <p className="text-xs font-black text-neutral-805 dark:text-neutral-200">
                          {allCourses.find(c => c.id === selectedCourseToOp)?.title}
                        </p>
                      </div>
                    </div>

                    {!deleteConfirmedInView ? (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmedInView(true)}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isAr ? 'حذف هذا الكورس ⚙️' : 'Delete this course'}</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-650 text-white rounded-xl space-y-4"
                      >
                        <p className="text-xs font-extrabold text-right leading-relaxed">
                          🚨 {isAr ? 'هل أنت متأكد من الحذف؟ تفاصيل الكورس ومحتوياته سيتم إزالتها كلياً ولا يتم التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this course? This action is irreversible.'}
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleDeleteCourseNew}
                            className="py-1.5 px-4 bg-white text-red-750 text-xs font-black rounded-lg hover:bg-neutral-100 transition"
                          >
                            {isAr ? 'تأكيد الحذف النهائي ▶' : 'Confirm & Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmedInView(false)}
                            className="py-1.5 px-4 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-850 transition"
                          >
                            {isAr ? 'إلغاء وتراجع ✕' : 'Cancel'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* If nothing selected */}
                {!selectedGradeFilter && (
                  <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-850 text-neutral-400">
                    <span className="text-2xl block mb-2 font-black">🛡️</span>
                    <p className="text-xs font-bold">{isAr ? 'برجاء تحديد الصف الدراسي المطلوب أولاً ثم الكورس لإظهار تأكيد الحذف الفعال.' : 'Please choose target grade level and course to proceed.'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MODULES MANAGER SECTION */}
      {activeSubSection === 'modules' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-850 flex justify-between items-center text-right">
            <div className="w-full">
              <h3 className="text-sm font-black flex items-center gap-2 text-neutral-800 dark:text-neutral-100 justify-end">
                <span>📁</span>
                <span>{isAr ? 'منصة هيكلة وتنظيم المجموعات التعليمية' : 'Curriculum Modules and Groups Manager'}</span>
              </h3>
            </div>
          </div>

          {/* Segmented Controller Tab Bar */}
          <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-3xl max-w-2xl mx-auto grid grid-cols-3 gap-2.5 border border-neutral-200/50 dark:border-neutral-800/60 shadow-lg shadow-indigo-500/5 my-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setModuleOpTab('add');
                setModuleSelectedGrade('');
                setModuleSelectedCourseId('');
                setModuleSelectedGroupId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                moduleOpTab === 'add'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-700 text-white shadow-md shadow-emerald-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Plus className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'إضافة مجموعة جديدة' : 'Add Group'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setModuleOpTab('edit');
                setModuleSelectedGrade('');
                setModuleSelectedCourseId('');
                setModuleSelectedGroupId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                moduleOpTab === 'edit'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-750 text-white shadow-md shadow-amber-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Edit2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'تعديل مجموعة' : 'Edit Group'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setModuleOpTab('delete');
                setModuleSelectedGrade('');
                setModuleSelectedCourseId('');
                setModuleSelectedGroupId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                moduleOpTab === 'delete'
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-red-650 dark:from-rose-600 dark:via-red-600 dark:to-red-750 text-white shadow-md shadow-rose-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Trash2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'حذف مجموعة' : 'Delete Group'}</span>
            </motion.button>
          </div>

          {/* Core Content Area - Centered for pristine user experience without sidebar clutter */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white dark:bg-neutral-850 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-5">
              
              {/* TAB 1: ADD NEW GROUP */}
              {moduleOpTab === 'add' && (
                <form onSubmit={handleAddOrEditModule} className="space-y-4">
                  <div className="pb-3 border-b border-neutral-100 dark:border-neutral-750 flex justify-between items-center">
                    <span className="p-1 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[9px] font-black text-indigo-600 dark:text-indigo-450 uppercase">
                      {isAr ? 'عملية إضافة' : 'Insertion Engine'}
                    </span>
                    <h4 className="text-xs font-black text-neutral-800 dark:text-white">
                      {isAr ? '➕ إنشاء مجموعة جديدة داخل كورس' : '➕ Create New Group'}
                    </h4>
                  </div>

                  {/* 1. Grade Select */}
                  <div className="space-y-1.5 flex flex-col items-start text-right w-full">
                    <label className="text-[11px] font-black text-neutral-500 block w-full">{isAr ? '1. اختيار الصف الدراسي' : '1. Authorized Grade Level'}</label>
                    <select
                      required
                      value={moduleSelectedGrade}
                      onChange={e => {
                        setModuleSelectedGrade(e.target.value);
                        setTargetCourseId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- يرجى اختيار الصف الدراسي --' : '-- Choose Grade Level --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Course Select */}
                  <div className="space-y-1.5 flex flex-col items-start text-right w-full">
                    <label className="text-[11px] font-black text-neutral-500 block w-full">{isAr ? '2. اختيار الكورس المسند الكلي' : '2. Target Course'}</label>
                    <select
                      required
                      disabled={!moduleSelectedGrade}
                      value={targetCourseId}
                      onChange={e => setTargetCourseId(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!moduleSelectedGrade 
                          ? (isAr ? '-- يرجى تحديد الصف الدراسي أولاً --' : '-- Choose grade level first --')
                          : (isAr ? '-- يرجى اختيار الكورس المطلوب --' : '-- Choose parent course --')
                        }
                      </option>
                      {allCourses.filter(c => c.level === moduleSelectedGrade).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Group Name */}
                  <div className="space-y-1.5 flex flex-col items-start text-right w-full">
                    <label className="text-[11px] font-black text-neutral-500 block w-full">{isAr ? '3. اسم المجموعة' : '3. Group Name'}</label>
                    <input
                      required
                      type="text"
                      value={modTitleAr}
                      onChange={e => setModTitleAr(e.target.value)}
                      placeholder={isAr ? '📘 مثال: الباب الأول - الكهربية وقوانين أوم...' : 'Module: Foundation Core...'}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
                    />
                  </div>

                  {/* 4. Group Description */}
                  <div className="space-y-1.5 flex flex-col items-start text-right w-full">
                    <label className="text-[11px] font-black text-neutral-500 block w-full">{isAr ? '4. وصف المجموعة وموجز المحتويات' : '4. Group Description Summary'}</label>
                    <textarea
                      rows={3}
                      value={modDescAr}
                      onChange={e => setModDescAr(e.target.value)}
                      placeholder={isAr ? 'ادخل موجزاً عن المحتوى (محاضرات، بنوك أسئلة، ملازم PDF)...' : 'Enter chapter syllabus highlight notes...'}
                      className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none resize-none"
                    />
                  </div>

                  {/* 5. Schedule Options (Permanent display unless hidden) */}
                  <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between text-right">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase">{isAr ? 'إجراءات العرض والسرية' : 'Visibility Control'}</span>
                      <p className="text-[10px] font-extrabold text-neutral-700 dark:text-neutral-300">⚙️ {isAr ? 'جدولة مواعيد العرض (اختياري)' : 'Publish Timings (Optional)'}</p>
                    </div>

                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={modIsPermanent}
                          onChange={e => setModIsPermanent(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-650 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-450">
                          {isAr ? 'ظهور دائم وتلقائي للطلاب فوراً' : 'Display permanently immediately'}
                        </span>
                      </label>

                      {!modIsPermanent && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <div className="space-y-1 flex flex-col items-start w-full">
                            <span className="text-[9px] text-neutral-500 font-extrabold">{isAr ? 'موعد الظهور' : 'Show Time'}</span>
                            <input
                              type="datetime-local"
                              value={modPubTime}
                              onChange={e => setModPubTime(e.target.value)}
                              className="w-full text-[9px] font-bold py-1 px-1.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-neutral-150 outline-none"
                            />
                          </div>
                          <div className="space-y-1 flex flex-col items-start w-full">
                            <span className="text-[9px] text-neutral-500 font-extrabold">{isAr ? 'موعد الاختفاء' : 'Hide Time'}</span>
                            <input
                              type="datetime-local"
                              value={modHideTime}
                              onChange={e => setModHideTime(e.target.value)}
                              className="w-full text-[9px] font-bold py-1 px-1.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-neutral-150 outline-none"
                            />
                          </div>
                        </div>
                      )}
                      
                      {modIsPermanent && (
                        <p className="text-[9px] text-neutral-400 font-semibold leading-relaxed text-right">
                          {isAr 
                            ? '💡 بموجب هذا الخيار، سيتم عرض المجموعة بشكل دائم وغير مؤقت لجميع المشتركين دون مواعيد إخفاء تلقائية.' 
                            : 'This group continues showing endlessly without expiration.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>💾 {isAr ? 'تأكيد إضافة المجموعة ⚡' : 'Create Group ⚡'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: EDIT EXISTING GROUP */}
              {moduleOpTab === 'edit' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-neutral-100 dark:border-neutral-750 flex justify-between items-center">
                    <span className="p-1 px-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[9px] font-black text-orange-650 uppercase">
                      {isAr ? 'محرك التعديل' : 'Revision Core'}
                    </span>
                    <h4 className="text-xs font-black text-neutral-800 dark:text-white">
                      {isAr ? '✏️ تعديل بيانات مجموعة' : '✏️ Modify Group'}
                    </h4>
                  </div>

                  {/* Filter Grade */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار الصف الدراسي' : 'Select Grade Level'}</label>
                    <select
                      value={moduleSelectedGrade}
                      onChange={e => {
                        setModuleSelectedGrade(e.target.value);
                        setModuleSelectedCourseId('');
                        setModuleSelectedGroupId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- اختر الصف الدراسي --' : '-- Choose Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Course */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار الكورس' : 'Select Course'}</label>
                    <select
                      disabled={!moduleSelectedGrade}
                      value={moduleSelectedCourseId}
                      onChange={e => {
                        setModuleSelectedCourseId(e.target.value);
                        setModuleSelectedGroupId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!moduleSelectedGrade 
                          ? (isAr ? '-- اختر الصف الدراسي أولاً --' : '-- Choose Grade First --')
                          : (isAr ? '-- اختر الكورس المستهدف --' : '-- Select Course --')
                        }
                      </option>
                      {allCourses.filter(c => c.level === moduleSelectedGrade).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Group */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار المجموعة للتعديل' : 'Select Group to edit'}</label>
                    <select
                      disabled={!moduleSelectedCourseId}
                      value={moduleSelectedGroupId}
                      onChange={e => setModuleSelectedGroupId(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!moduleSelectedCourseId
                          ? (isAr ? '-- يرجى اختيار الكورس أولاً --' : '-- Select Course First --')
                          : (isAr ? '-- يرجى اختيار المجموعة المطلوبة --' : '-- Select Group --')
                        }
                      </option>
                      {modules.filter(m => m.courseId === moduleSelectedCourseId).map(m => (
                        <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Edit Form Fields - rendered only when moduleSelectedGroupId is active */}
                  {moduleSelectedGroupId ? (
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleAddOrEditModule}
                      className="space-y-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-750"
                    >
                      <div className="space-y-1.5 flex flex-col items-start w-full">
                        <label className="text-[10px] font-black text-orange-650 dark:text-orange-400">{isAr ? 'اسم المجموعة' : 'Group Title'}</label>
                        <input
                          required
                          type="text"
                          value={modTitleAr}
                          onChange={e => setModTitleAr(e.target.value)}
                          className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 flex flex-col items-start w-full">
                        <label className="text-[10px] font-black text-orange-650 dark:text-orange-400">{isAr ? 'وصف المجموعة وملاحظاتها الدراسية' : 'Syllabus/Chapter notes'}</label>
                        <textarea
                          rows={3}
                          value={modDescAr}
                          onChange={e => setModDescAr(e.target.value)}
                          className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none resize-none"
                        />
                      </div>

                      {/* Edit Timings */}
                      <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl space-y-2 border border-neutral-150 dark:border-neutral-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={modIsPermanent}
                            onChange={e => setModIsPermanent(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-500"
                          />
                          <span className="text-[10px] font-black text-neutral-500">{isAr ? 'ظهور دائم وتلقائي للطلاب دون موعد إخفاء' : 'View permanently immediately'}</span>
                        </label>

                        {!modIsPermanent && (
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="space-y-1 flex flex-col items-start w-full">
                              <span className="text-[9px] text-neutral-450 font-bold">{isAr ? 'موعد الظهور' : 'Show Time'}</span>
                              <input
                                type="datetime-local"
                                value={modPubTime}
                                onChange={e => setModPubTime(e.target.value)}
                                className="w-full text-[9px] py-1 px-1.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                              />
                            </div>
                            <div className="space-y-1 flex flex-col items-start w-full">
                              <span className="text-[9px] text-neutral-450 font-bold">{isAr ? 'موعد الاختفاء (اختياري)' : 'Hide Time'}</span>
                              <input
                                type="datetime-local"
                                value={modHideTime}
                                onChange={e => setModHideTime(e.target.value)}
                                className="w-full text-[9px] py-1 px-1.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition"
                      >
                        {isAr ? '💾 حفظ التعديلات الكلية للمجموعة' : 'Save group changes'}
                      </button>
                    </motion.form>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200">
                      <p className="text-xs text-neutral-400 font-bold">
                        {isAr ? '👇 يرجى تصفية المجموعات واختيار المجموعة بالأعلى لإظهار نموذج التعديل التفاعلي.' : 'Please choose grade, course and module target above to edit.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DELETE EXISTING GROUP */}
              {moduleOpTab === 'delete' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-neutral-100 dark:border-neutral-750 flex justify-between items-center">
                    <span className="p-1 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-[9px] font-black text-rose-500 uppercase">
                      {isAr ? 'منصة الحذف' : 'Deletion Panel'}
                    </span>
                    <h4 className="text-xs font-black text-neutral-808 dark:text-white">
                      {isAr ? '🗑️ حذف وإزالة مجموعة دراسية نهائياً' : '🗑️ Delete Group Module'}
                    </h4>
                  </div>

                  {/* Filter Grade */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار الصف الدراسي للتصفية' : 'Select Grade Level'}</label>
                    <select
                      value={moduleSelectedGrade}
                      onChange={e => {
                        setModuleSelectedGrade(e.target.value);
                        setModuleSelectedCourseId('');
                        setModuleSelectedGroupId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- يرجى اختيار الصف --' : '-- Select Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Course */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار الكورس المنسق تلقائيًا' : 'Select Course'}</label>
                    <select
                      disabled={!moduleSelectedGrade}
                      value={moduleSelectedCourseId}
                      onChange={e => {
                        setModuleSelectedCourseId(e.target.value);
                        setModuleSelectedGroupId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!moduleSelectedGrade 
                          ? (isAr ? '-- اختر الصف الدراسي أولاً --' : '-- Choose Grade First --')
                          : (isAr ? '-- اختر الكورس المستهدف --' : '-- Select Course --')
                        }
                      </option>
                      {allCourses.filter(c => c.level === moduleSelectedGrade).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Group */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'اختيار المجموعة للحذف النهائي' : 'Select Group to delete'}</label>
                    <select
                      disabled={!moduleSelectedCourseId}
                      value={moduleSelectedGroupId}
                      onChange={e => setModuleSelectedGroupId(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!moduleSelectedCourseId
                          ? (isAr ? '-- يرجى اختيار الكورس أولاً --' : '-- Select Course First --')
                          : (isAr ? '-- يرجى اختيار المجموعة المطلوبة --' : '-- Select Group --')
                        }
                      </option>
                      {modules.filter(m => m.courseId === moduleSelectedCourseId).map(m => (
                        <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                      ))}
                    </select>
                  </div>

                  {moduleSelectedGroupId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-750 space-y-4"
                    >
                      <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2">
                        <h5 className="text-xs font-black text-rose-700 dark:text-rose-400">
                          {isAr ? '⚠️ تملأ الصفحة تحذيرات المجموعات!' : '⚠️ Irreversible Deletion Warning'}
                        </h5>
                        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 leading-relaxed">
                          {isAr 
                            ? 'تنبيـه: حذف هذه المجموعة سيتسبب في حذف جميع المحاضرات المرتبطة بها والواجبات المنزلية والملفات المرفقة بها نهائيًا! يرجى التأكد قبل المتابعة.'
                            : 'Careful! Deleting this group will permanently filter-out/remove all associated videos, worksheets, tasks, etc.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRedesignedDeleteModule}
                        className="w-full text-xs font-black py-3 rounded-xl bg-rose-600 dark:bg-rose-700 hover:bg-rose-700 dark:hover:bg-rose-800 text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isAr ? 'تأكيد الحذف نهائياً' : 'Delete Module Permanently'}</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. VIDEOS MANAGER SECTION */}
      {activeSubSection === 'videos' && (
        <div className="space-y-6">
          {/* Header Dashboard */}
          <div className="p-5 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-850 flex justify-between items-center text-right">
            <div className="w-full">
              <h3 className="text-sm font-black flex items-center gap-2 text-neutral-800 dark:text-neutral-100 justify-end">
                <span>📹</span>
                <span>{isAr ? 'إدارة الفيديوهات' : 'Videos Management'}</span>
              </h3>
            </div>
          </div>

          {/* Segmented Controller Tab Bar */}
          <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-3xl max-w-2xl mx-auto grid grid-cols-3 gap-2.5 border border-neutral-200/50 dark:border-neutral-800/60 shadow-lg shadow-indigo-500/5 my-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setVideoOpTab('add');
                setVidSelectedGrade('');
                setVidCourseId('');
                setVidModuleId('');
                setVidSelectedVideoId('');
                setVidDeleteConfirmed(false);
                handleLoadVideoToEdit('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                videoOpTab === 'add'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-700 text-white shadow-md shadow-emerald-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Plus className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'إضافة فيديو جديد' : 'Add Video'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setVideoOpTab('edit');
                setVidSelectedGrade('');
                setVidCourseId('');
                setVidModuleId('');
                setVidSelectedVideoId('');
                setVidDeleteConfirmed(false);
                handleLoadVideoToEdit('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                videoOpTab === 'edit'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-750 text-white shadow-md shadow-amber-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Edit2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'تعديل فيديو موجود' : 'Edit Video'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setVideoOpTab('delete');
                setVidSelectedGrade('');
                setVidCourseId('');
                setVidModuleId('');
                setVidSelectedVideoId('');
                setVidDeleteConfirmed(false);
                handleLoadVideoToEdit('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                videoOpTab === 'delete'
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-red-650 dark:from-rose-600 dark:via-red-600 dark:to-red-750 text-white shadow-md shadow-rose-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Trash2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'حذف فيديو وبتره' : 'Delete Video'}</span>
            </motion.button>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* 1. ADD TAB WORKFLOW */}
            {videoOpTab === 'add' && (
              <form onSubmit={handleRedesignedSaveVideo} className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 text-right">
                  <h4 className="text-xs font-black text-indigo-650 dark:text-indigo-400">{isAr ? 'الخطوة الأولى: التصنيف والتبويب' : 'Step 1: Classification & Filtering'}</h4>
                  <p className="text-[11px] text-neutral-400 font-bold">{isAr ? 'حدد المسار الشجري للفيديو لربطه بمجموعته الصحيحة' : 'Route this video to the correct folder path'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Grade */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? '1. الصف الدراسي المعتمد' : '1. Target Grade'}</label>
                    <select
                      required
                      value={vidSelectedGrade}
                      onChange={e => {
                        setVidSelectedGrade(e.target.value);
                        setVidCourseId('');
                        setVidModuleId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- اختر الصف --' : '-- Select Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? '2. اختيار الكورس التلقائي' : '2. Target Course'}</label>
                    <select
                      required
                      disabled={!vidSelectedGrade}
                      value={vidCourseId}
                      onChange={e => {
                        setVidCourseId(e.target.value);
                        setVidModuleId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- اختر الكورس --' : '-- Select Course --'}</option>
                      {allCourses.filter(c => c.level === vidSelectedGrade).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Group / Module */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? '3. اختيار المجموعة التعليمية' : '3. Target Group'}</label>
                    <select
                      required
                      disabled={!vidCourseId}
                      value={vidModuleId}
                      onChange={e => setVidModuleId(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- اختر المجموعة --' : '-- Select Group --'}</option>
                      {modules.filter(m => m.courseId === vidCourseId).map(m => (
                        <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {vidModuleId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800"
                  >
                    <div className="pb-3 text-right">
                      <h4 className="text-xs font-black text-indigo-650 dark:text-indigo-400">{isAr ? 'الخطوة الثانية: تفاصيل المادة المرئية' : 'Step 2: Video Metadata & Hosting'}</h4>
                      <p className="text-[11px] text-neutral-400 font-bold">{isAr ? 'املأ حقول الإدخال لتنظيم وعرض المحاضرة بدقة' : 'Fill metadata forms to configure access rules'}</p>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5 text-right">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'عنوان الفيديو والدرس (بالعربية)' : 'Video Title (Arabic)'}</label>
                      <input
                        required
                        type="text"
                        value={vidTitleAr}
                        onChange={e => setVidTitleAr(e.target.value)}
                        placeholder={isAr ? "مثال: مقدمة علم الكهربية وتوزيع الشحنات" : "Example: Introduction to Physics"}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5 text-right">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'وصف تفصيلي لمحتويات المقطع (بالعربية)' : 'Video Description (Arabic)'}</label>
                      <textarea
                        value={vidDescAr}
                        onChange={e => setVidDescAr(e.target.value)}
                        rows={2}
                        placeholder={isAr ? "اكتب نبذة أو نقاط الشرح الرئيسية بالمقاطع كدليل مرجعي للطالب..." : "Enter summary keypoints for reference..."}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Duration */}
                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'مدة الفيديو بالدقائق ⏱️' : 'Duration (Minutes)'}</label>
                        <input
                          required
                          type="text"
                          value={vidDuration}
                          onChange={e => setVidDuration(e.target.value)}
                          placeholder="٤٥"
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-center"
                        />
                      </div>

                      {/* Display Mode Host */}
                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'طريقة البث والمزود الخارجي' : 'Video Streaming Platform'}</label>
                        <select
                          value={vidSource}
                          onChange={e => setVidSource(e.target.value as any)}
                          className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer"
                        >
                          <option value="youtube">YouTube Player</option>
                          <option value="bunny">Bunny CDN Host</option>
                        </select>
                      </div>

                      {/* Link/URL input */}
                      <div className="space-y-1.5 text-right md:col-span-1">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'رابط الفيديو للإحالة 🔗' : 'Video URL Link'}</label>
                        <input
                          required
                          type="text"
                          value={vidLink}
                          onChange={e => setVidLink(e.target.value)}
                          placeholder="https://youtu.be/... / https://iframe.mediadelivery.net/..."
                          className="w-full text-[11px] font-mono py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-805 dark:text-neutral-100 outline-none text-left"
                        />
                      </div>
                    </div>

                    {/* Timing & Settings */}
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-right space-y-4">
                      <span className="text-[10px] font-black text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 p-1 px-2.5 rounded-lg inline-block">
                        ⚙️ {isAr ? 'خيارات الجدولة والوصول العام' : 'Access Rules & Scheduling'}
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-neutral-500">{isAr ? 'وقت ظهور الفيديو (اختياري)' : 'Publish Access Time (Optional)'}</label>
                          <input
                            type="datetime-local"
                            value={vidPubTime}
                            onChange={e => setVidPubTime(e.target.value)}
                            className="w-full text-[10px] font-mono py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-750 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-neutral-500">{isAr ? 'وقت إخفاء الفيديو (اختياري)' : 'Expiration Time (Optional)'}</label>
                          <input
                            type="datetime-local"
                            value={vidHideTime}
                            onChange={e => setVidHideTime(e.target.value)}
                            className="w-full text-[10px] font-mono py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-750 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-850 space-y-2">
                        <label className="flex items-center gap-2 justify-end cursor-pointer">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-450">{isAr ? 'تفعيل ميزة "فيديو مجاني" ليتمكن أي طالب من مشاهدته بدون اشتراك مسبق' : 'Make this video Free Trial for un-subscribed students'}</span>
                          <input
                            type="checkbox"
                            checked={vidIsFree}
                            onChange={e => setVidIsFree(e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-650 accent-indigo-650 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-lg"
                    >
                      <span>💾</span>
                      <span>{isAr ? 'أرشفة ونشر المادة المرئية الحالية ⚡' : 'Publish Lecture Video ⚡'}</span>
                    </button>
                  </motion.div>
                )}

                {!vidModuleId && (
                  <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400">
                    <span className="text-2xl block mb-2 font-black">☝️</span>
                    <p className="text-xs font-bold leading-normal">{isAr ? 'يرجى تحديد الصف الدراسي، ثم الكورس، ثم المجموعة التعليمية لبدء إضافة الفيديو الجديد.' : 'Select the Grade, Course and Group path parameters first.'}</p>
                  </div>
                )}
              </form>
            )}

            {/* 2. EDIT TAB WORKFLOW */}
            {videoOpTab === 'edit' && (
              <div className="space-y-6">
                <form onSubmit={handleRedesignedSaveVideo} className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 text-right">
                    <h4 className="text-xs font-black text-amber-600 dark:text-amber-450">{isAr ? '1. العثور على الفيديو المطلوب وتصفيته' : '1. Filter and Find Video Target'}</h4>
                    <p className="text-[11px] text-neutral-400 font-bold">{isAr ? 'اختر الصف، الكورس والمجموعة للعثور على دروس المنهج' : 'Locate target lecture to view metadata inputs'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Grade select */}
                    <div className="space-y-1.5 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الصف الدراسي المعتمد' : 'Authorized Grade'}</label>
                      <select
                        value={vidSelectedGrade}
                        onChange={e => {
                          setVidSelectedGrade(e.target.value);
                          setVidCourseId('');
                          setVidModuleId('');
                          setVidSelectedVideoId('');
                          handleLoadVideoToEdit('');
                        }}
                        className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-909 dark:text-neutral-100 outline-none cursor-pointer"
                      >
                        <option value="">{isAr ? '-- اختر الصف --' : '-- Select Grade --'}</option>
                        {getTeacherAssignedGrades(activeTeacherName).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Course select */}
                    <div className="space-y-1.5 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الكورس المستهدف تلقائيًا' : 'Dynamic Target Course'}</label>
                      <select
                        disabled={!vidSelectedGrade}
                        value={vidCourseId}
                        onChange={e => {
                          setVidCourseId(e.target.value);
                          setVidModuleId('');
                          setVidSelectedVideoId('');
                          handleLoadVideoToEdit('');
                        }}
                        className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-909 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">{isAr ? '-- اختر الكورس --' : '-- Select Course --'}</option>
                        {allCourses.filter(c => c.level === vidSelectedGrade).map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Group select */}
                    <div className="space-y-1.5 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-neutral-500">{isAr ? 'المجموعة المستهدفة تلقائيًا' : 'Dynamic Target Group'}</label>
                      <select
                        disabled={!vidCourseId}
                        value={vidModuleId}
                        onChange={e => {
                          setVidModuleId(e.target.value);
                          setVidSelectedVideoId('');
                          handleLoadVideoToEdit('');
                        }}
                        className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">{isAr ? '-- اختر المجموعة --' : '-- Select Group --'}</option>
                        {modules.filter(m => m.courseId === vidCourseId).map(m => (
                          <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                        ))}
                      </select>
                    </div>

                    {/* Video select */}
                    <div className="space-y-1.5 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-neutral-500 text-amber-650 font-extrabold">{isAr ? 'اختر الفيديو المراد تعديله 🎯' : 'Select Target Video'}</label>
                      <select
                        disabled={!vidModuleId}
                        value={vidSelectedVideoId}
                        onChange={e => {
                          setVidSelectedVideoId(e.target.value);
                          handleLoadVideoToEdit(e.target.value);
                        }}
                        className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-amber-450 dark:border-amber-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">{isAr ? '-- اختر الفيديو المطلوب تعديله --' : '-- Select Target Video --'}</option>
                        {videos.filter(v => v.moduleId === vidModuleId).map(v => (
                          <option key={v.id} value={v.id}>{isAr ? v.titleAr : v.titleEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {vidSelectedVideoId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800"
                    >
                      <div className="pb-3 text-right">
                        <h4 className="text-xs font-black text-amber-600 dark:text-amber-450">{isAr ? '2. مراجعة وتحديث البيانات' : '2. Update Fields'}</h4>
                        <p className="text-[11px] text-neutral-400 font-bold">{isAr ? 'عدل المعلومات بالأسفل ثم احفظ النتيجة الفعالة' : 'Save changes to update data'}</p>
                      </div>

                      {/* Title */}
                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'عنوان الفيديو والدرس (بالعربية)' : 'Video Title (Arabic)'}</label>
                        <input
                          required
                          type="text"
                          value={vidTitleAr}
                          onChange={e => setVidTitleAr(e.target.value)}
                          placeholder={isAr ? "شرح المقاومة الكهربائية وقانون أوم" : "Physics Video Title"}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5 text-right">
                        <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الوصف ومخرجات التعلم المقررة' : 'Video Description (Arabic)'}</label>
                        <textarea
                          value={vidDescAr}
                          onChange={e => setVidDescAr(e.target.value)}
                          rows={2}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Duration */}
                        <div className="space-y-1.5 text-right">
                          <label className="text-[11px] font-black text-neutral-500">{isAr ? 'مدة المقطع بالدقائق ⏱️' : 'Duration (Minutes)'}</label>
                          <input
                            required
                            type="text"
                            value={vidDuration}
                            onChange={e => setVidDuration(e.target.value)}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-center"
                          />
                        </div>

                        {/* Display Mode Host */}
                        <div className="space-y-1.5 text-right">
                          <label className="text-[11px] font-black text-neutral-500">{isAr ? 'البوابة والبث الخارجي' : 'Platform Provider'}</label>
                          <select
                            value={vidSource}
                            onChange={e => setVidSource(e.target.value as any)}
                            className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer"
                          >
                            <option value="youtube">YouTube Player</option>
                            <option value="bunny">Bunny CDN Host</option>
                          </select>
                        </div>

                        {/* Link/URL input */}
                        <div className="space-y-1.5 text-right flex-1">
                          <label className="text-[11px] font-black text-neutral-500">{isAr ? 'رابط الفيديو المباشر 🔗' : 'Video Link URL'}</label>
                          <input
                            required
                            type="text"
                            value={vidLink}
                            onChange={e => setVidLink(e.target.value)}
                            className="w-full text-[11px] font-mono py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-805 dark:text-neutral-100 outline-none text-left"
                          />
                        </div>
                      </div>

                      {/* Timing & Rules */}
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-right space-y-4">
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-1 px-2.5 rounded-lg inline-block">
                          ⚙️ {isAr ? 'تعديل خيارات الجدولة وعرض المادة' : 'Update Schedule & Visibility Options'}
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-500">{isAr ? 'وقت تفعيل الظهور (اختياري)' : 'Scheduled Show (Optional)'}</label>
                            <input
                              type="datetime-local"
                              value={vidPubTime}
                              onChange={e => setVidPubTime(e.target.value)}
                              className="w-full text-[10px] font-mono py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-750 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-100"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-500">{isAr ? 'وقت انتهاء الظهور (اختياري)' : 'Expiration Time (Optional)'}</label>
                            <input
                              type="datetime-local"
                              value={vidHideTime}
                              onChange={e => setVidHideTime(e.target.value)}
                              className="w-full text-[10px] font-mono py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-750 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-100"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-850">
                          <label className="flex items-center gap-2 justify-end cursor-pointer">
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-450">{isAr ? 'تفعيل ميزة "فيديو مجاني" ليتمكن أي طالب من مشاهدته بدون اشتراك' : 'Set as Free Trial'}</span>
                            <input
                              type="checkbox"
                              checked={vidIsFree}
                              onChange={e => setVidIsFree(e.target.checked)}
                              className="w-4 h-4 rounded text-indigo-650 accent-indigo-650 cursor-pointer"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-lg"
                      >
                        <span>💾</span>
                        <span>{isAr ? 'حفظ تعديلات الفيديو الآن ⚡' : 'Save Changes Now ⚡'}</span>
                      </button>
                    </motion.div>
                  )}

                  {!vidSelectedVideoId && (
                    <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400">
                      <span className="text-2xl block mb-2">🔍</span>
                      <p className="text-xs font-bold leading-normal">{isAr ? 'يرجى تصفية الاختيارات بالأعلى وتحديد الفيديو المطلوب لاستعراض تفاصيله القابلة للتعديل والتحرير.' : 'Pick search filters above and select target video to edit.'}</p>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* 3. DELETE TAB WORKFLOW */}
            {videoOpTab === 'delete' && (
              <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 text-right">
                  <h4 className="text-xs font-black text-rose-600 dark:text-rose-400">{isAr ? 'مسار تصفية الفيديو المطلوب إزالته' : 'Locate Target Video to Delete'}</h4>
                  <p className="text-[11px] text-neutral-400 font-bold">{isAr ? 'خطوات اختيار الصف، الكورس، والمجموعة ومسح الفيديو بسلامة تامة' : 'Verify route parameters to securely delete the video'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Grade */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الصف الدراسي المعتمد' : 'educational Grade'}</label>
                    <select
                      value={vidSelectedGrade}
                      onChange={e => {
                        setVidSelectedGrade(e.target.value);
                        setVidCourseId('');
                        setVidModuleId('');
                        setVidSelectedVideoId('');
                        setVidDeleteConfirmed(false);
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-909 dark:text-neutral-100 outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- اختر الصف --' : '-- Select Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الكورس المستهدف' : 'Target Course'}</label>
                    <select
                      disabled={!vidSelectedGrade}
                      value={vidCourseId}
                      onChange={e => {
                        setVidCourseId(e.target.value);
                        setVidModuleId('');
                        setVidSelectedVideoId('');
                        setVidDeleteConfirmed(false);
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-909 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- اختر الكورس --' : '-- Select Course --'}</option>
                      {allCourses.filter(c => c.level === vidSelectedGrade).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Group */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'المجموعة التعليمية المستهدفة' : 'Target Group'}</label>
                    <select
                      disabled={!vidCourseId}
                      value={vidModuleId}
                      onChange={e => {
                        setVidModuleId(e.target.value);
                        setVidSelectedVideoId('');
                        setVidDeleteConfirmed(false);
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- اختر المجموعة --' : '-- Select Group --'}</option>
                      {modules.filter(m => m.courseId === vidCourseId).map(m => (
                        <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Video to Delete */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[11px] font-black text-neutral-500 text-rose-650 font-extrabold">{isAr ? 'اختر الفيديو المراد حذفه 🎯' : 'Select Target Video'}</label>
                    <select
                      disabled={!vidModuleId}
                      value={vidSelectedVideoId}
                      onChange={e => {
                        setVidSelectedVideoId(e.target.value);
                        setVidDeleteConfirmed(false);
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/40 bg-neutral-50 dark:bg-neutral-900 text-neutral-905 dark:text-neutral-100 outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- اختر الفيديو المراد إزالته --' : '-- Choose Video to Delete --'}</option>
                      {videos.filter(v => v.moduleId === vidModuleId).map(v => (
                        <option key={v.id} value={v.id}>{isAr ? v.titleAr : v.titleEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {vidSelectedVideoId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-rose-50 dark:bg-rose-950/20 border-2 border-dashed border-rose-200 dark:border-rose-900/30 rounded-2xl space-y-4 text-center text-right"
                  >
                    <p className="text-2xl text-center block">⚠️</p>
                    <div className="space-y-1">
                      <b className="text-xs font-black text-rose-700 dark:text-rose-450 block">{isAr ? 'تفاصيل المقطع المستهدف بالحذف:' : 'Selected Video Deletion overview:'}</b>
                      <p className="text-xs font-extrabold text-neutral-800 dark:text-rose-100 leading-normal">
                        {videos.find(v => v.id === vidSelectedVideoId)?.titleAr}
                      </p>
                    </div>

                    {!vidDeleteConfirmed ? (
                      <button
                        type="button"
                        onClick={() => setVidDeleteConfirmed(true)}
                        className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-600 hover:to-red-700 text-white text-xs font-black rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-500/10 hover:shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isAr ? 'تأكيد نية الحذف 🗑️' : 'Proceed with Deletion'}</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-650 text-white rounded-xl space-y-3"
                      >
                        <p className="text-xs font-black text-right leading-relaxed">
                          🚨 {isAr ? 'هل أنت متأكد بشكل قاطع من حذف هذا الفيديو؟ هذا الإجراء سيقوم بإزالة المقطع من جميع حسابات الطلاب ولن تتمكن من التراجع عن هذا الإجراء.' : 'Confirm permanent deletion. This is irreversible and student records for this video will be wiped.'}
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleRedesignedConfirmDeleteVideo}
                            className="py-1.5 px-4 bg-white text-red-750 text-xs font-black rounded-lg hover:bg-neutral-100 transition cursor-pointer"
                          >
                            {isAr ? 'حذف نهائي فوري ▶' : 'Confirm & Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setVidDeleteConfirmed(false)}
                            className="py-1.5 px-4 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-850 transition cursor-pointer"
                          >
                            {isAr ? 'إلغاء الحذف والتراجع ✕' : 'Cancel'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {!vidSelectedVideoId && (
                  <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-850 text-neutral-400">
                    <span className="text-2xl block mb-2">🗑️</span>
                    <p className="text-xs font-bold leading-normal">{isAr ? 'يرجى تصفية المعلمات بالأعلى وتحديد مخرجات الفيديو المطلوب سحبه وتصفيته لتأكيد الإجراء.' : 'Select filters and click video item to show secure deletion dialog.'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. HANDOUTS PDF SECTION */}
      {activeSubSection === 'handouts' && (
        <div className="space-y-6">
          {/* Colored Tab Controllers */}
          <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-3xl max-w-2xl mx-auto grid grid-cols-3 gap-2.5 border border-neutral-200/50 dark:border-neutral-800/60 shadow-lg shadow-indigo-500/5 my-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setHandoutOpTab('add');
                setHSelectedId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                handoutOpTab === 'add'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-700 text-white shadow-md shadow-emerald-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Plus className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'إضافة ملف جديد' : 'Add File'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setHandoutOpTab('edit');
                setHSelectedId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                handoutOpTab === 'edit'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 dark:from-amber-600 dark:via-orange-600 dark:to-orange-750 text-white shadow-md shadow-amber-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Edit2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'تعديل ملف موجود' : 'Edit File'}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setHandoutOpTab('delete');
                setHSelectedId('');
              }}
              className={`py-3 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                handoutOpTab === 'delete'
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-red-650 dark:from-rose-600 dark:via-red-600 dark:to-red-750 text-white shadow-md shadow-rose-500/20 border-transparent'
                  : 'bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm'
              }`}
            >
              <Trash2 className="h-4 w-4 shrink-0 text-current" />
              <span>{isAr ? 'حذف ملف' : 'Delete File'}</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Operational Form Block */}
            <div className="lg:col-span-12 bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800 shadow-xl text-right">
              
              {/* Form title based on active tab */}
              <div className="mb-6 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  {handoutOpTab === 'add' && <span className="bg-emerald-105 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-450 text-[10px] font-black px-2.5 py-1 rounded-md">{isAr ? 'بيئة إضافة آمنة' : 'Secure Add Mode'}</span>}
                  {handoutOpTab === 'edit' && <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-650 dark:text-amber-450 text-[10px] font-black px-2.5 py-1 rounded-md">{isAr ? 'تعديل البيانات' : 'Edit mode'}</span>}
                  {handoutOpTab === 'delete' && <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-650 dark:text-rose-450 text-[10px] font-black px-2.5 py-1 rounded-md">{isAr ? 'حذف من النظام' : 'Decompile mode'}</span>}
                </div>
                <h4 className="text-xs font-black text-neutral-850 dark:text-white">
                  {handoutOpTab === 'add' && (isAr ? '📦 إدخال مذكرات وملفات الكورسات الذكية' : 'Publish New File')}
                  {handoutOpTab === 'edit' && (isAr ? '🔧 مراجعة وتعديل المذكرة الحالية' : 'Amend PDF Handout')}
                  {handoutOpTab === 'delete' && (isAr ? '❌ سحب وفسخ المذكرات من الفروع' : 'Remove Handbook')}
                </h4>
              </div>

              {/* CASCADE SELECTORS BLOCK (Required by all modes) */}
              <div className="space-y-4 mb-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800">
                <p className="text-[10px] font-black text-neutral-450 mb-2">{isAr ? '🔍 الفلترة الهرمية لتحديد المجموعة المستهدفة تلقائياً:' : 'Dynamic Hierarchy Controls:'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Select Grade */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-neutral-550 block">{isAr ? 'الصف الدراسي *' : 'Grade *'}</label>
                    <select
                      required
                      value={hGrade}
                      onChange={e => {
                        setHGrade(e.target.value);
                        setHCourseId('');
                        setHModuleId('');
                        setHSelectedId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="">{isAr ? '-- اختر الصف --' : '-- Choose Grade --'}</option>
                      {getTeacherAssignedGrades(activeTeacherName).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Course */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-neutral-550 block">
                      {isAr ? 'الكورس المستهدف *' : 'Course *'}
                    </label>
                    <select
                      required
                      disabled={!hGrade}
                      value={hCourseId}
                      onChange={e => {
                        setHCourseId(e.target.value);
                        setHModuleId('');
                        setHSelectedId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-white outline-none cursor-pointer disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900"
                    >
                      <option value="">{isAr ? '-- اختر الكورس --' : '-- Choose Course --'}</option>
                      {allCourses.filter(c => c.level === hGrade && c.teacher === activeTeacherName).map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Module (Group) */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-neutral-550 block">
                      {isAr ? 'المجموعة التعليمية *' : 'Group/Module *'}
                    </label>
                    <select
                      required
                      disabled={!hCourseId}
                      value={hModuleId}
                      onChange={e => {
                        setHModuleId(e.target.value);
                        setHSelectedId('');
                      }}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-white outline-none cursor-pointer disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900"
                    >
                      <option value="">{isAr ? '-- اختر المجموعة --' : '-- Choose Group --'}</option>
                      {modules.filter((m: any) => m.courseId === hCourseId).map((m: any) => (
                        <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select File (Only inside Edit / Delete) */}
                {(handoutOpTab === 'edit' || handoutOpTab === 'delete') && (
                  <div className="mt-3 pt-3 border-t border-neutral-150 dark:border-neutral-800 space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-rose-650 dark:text-amber-450 block">
                      {isAr ? 'الملف المراد معالجته بالمخازن *' : 'Select Core Target File *'}
                    </label>
                    <select
                      required
                      disabled={!hModuleId}
                      value={hSelectedId}
                      onChange={e => setHSelectedId(e.target.value)}
                      className="w-full text-xs font-black py-2.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-white outline-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isAr ? '-- حدد المذكرة والمستند الرقمي من اللائحة --' : '-- Choose file to operate --'}</option>
                      {handouts.filter((h: any) => h.moduleId === hModuleId).map((h: any) => (
                        <option key={h.id} value={h.id}>{isAr ? h.titleAr : h.titleEn}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* TAB 1: ADD FILE OR TAB 2: EDIT CURRENT SELECTED FILE */}
              {(handoutOpTab === 'add' || (handoutOpTab === 'edit' && hSelectedId)) && (
                <form 
                  onSubmit={handoutOpTab === 'add' ? handleAddNewHandoutSubmit : handleSaveHandoutEdits} 
                  className="space-y-4"
                >
                  {/* File Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'عنوان الملف العريض (Ar) *' : 'File Title *'}</label>
                    <input
                      required
                      type="text"
                      value={hTitleAr}
                      onChange={e => setHTitleAr(e.target.value)}
                      placeholder={isAr ? "مثال: مراجعة نهائية على الفصل الأول - تيار كهربي" : "Enter booklet title"}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* File Description (الوصف ومخرجات التعلم المقررة) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500">{isAr ? 'الوصف ومخرجات التعلم المقررة' : 'Description & Scope Outcomes'}</label>
                    <textarea
                      value={hDescAr}
                      onChange={e => setHDescAr(e.target.value)}
                      rows={3}
                      placeholder={isAr ? "اكتب نبذة عن مخرجات التعلم مثل: أهداف المحاضرة، طريقة حل التمارين..." : "Enter learning output targets and summaries"}
                      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none text-right resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* FILE UPLOAD DRAG AND DROP ZONE */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-neutral-500 block">
                      {isAr ? 'رفع ملف المذكرة المقرر (PDF, Word, PPT, Excel, ZIP or Images) *' : 'Upload Booklet Document *'}
                    </label>

                    {/* Hidden input file picker */}
                    <input
                      id="handout_file_upload_input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const ext = file.name.split('.').pop()?.toLowerCase() || '';
                          const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'png', 'jpg', 'jpeg'];
                          if (!allowed.includes(ext)) {
                            alert(isAr ? 'عذراً، هذا النوع من الملفات غير مدعوم في المنصة. يرجى اختيار ملف PDF، Word، PPT أو ZIP.' : 'Invalid file format. Please upload PDF, Word, PPT, Excel, ZIP or Image.');
                            return;
                          }
                          setHFileName(file.name);
                          setHFileType(ext);
                          // Compute elegant size readouts
                          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          setHSize(`${sizeMB} ميجابايت`);
                          setHLink(`https://sanadschool.run/handouts/${Date.now()}_${file.name}`);
                        }
                      }}
                    />

                    <div
                      onDragOver={e => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={e => {
                        e.preventDefault();
                        setDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const ext = file.name.split('.').pop()?.toLowerCase() || '';
                          const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'png', 'jpg', 'jpeg'];
                          if (!allowed.includes(ext)) {
                            alert(isAr ? 'عذراً، هذا الملف غير مدعوم. يرجى سحب ملفات PDF, Word, Excel, PowerPoint, ZIP أو صور تعليمية.' : 'File format not supported.');
                            return;
                          }
                          setHFileName(file.name);
                          setHFileType(ext);
                          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          setHSize(`${sizeMB} ميجابايت`);
                          setHLink(`https://sanadschool.run/handouts/${Date.now()}_${file.name}`);
                        }
                      }}
                      onClick={() => document.getElementById('handout_file_upload_input')?.click()}
                      className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                        dragActive 
                          ? 'border-emerald-500 bg-emerald-500/5' 
                          : hFileName 
                            ? 'border-emerald-450 bg-emerald-50/10 dark:bg-emerald-950/5' 
                            : 'border-neutral-300 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      }`}
                    >
                      {hFileName ? (
                        <div className="space-y-2">
                          <span className="text-3xl block">
                            {hFileType === 'pdf' ? '📕' : (hFileType === 'zip' ? '📦' : '📘')}
                          </span>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 break-all">{hFileName}</p>
                            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-450 font-bold">
                              <span>الحجم: {hSize}</span>
                              <span>•</span>
                              <span>النوع: {hFileType.toUpperCase()}</span>
                              <span>•</span>
                              <span>تاريخ الرفع: الآن</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setHFileName('');
                              setHFileType('');
                            }}
                            className="text-[10px] font-black text-rose-500 hover:underline pt-1 cursor-pointer"
                          >
                            {isAr ? 'إزالة الملف وتغييره ✕' : 'Remove & pick other file'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-3xl block">📤</span>
                          <p className="text-xs font-black text-neutral-700 dark:text-neutral-200">
                            {isAr ? 'اسحب ملف المذكرة وأفلته هنا أو اضغط للتصفح' : 'Drag & drop booklet here or click to browse'}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold">
                            {isAr ? 'الأنواع المدعومة: PDF, Word, PowerPoint, Excel, ZIP, وصور الشرح التعليمية' : 'Supported files: PDF, Word, PowerPoint, Excel, ZIP or explanation layouts'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VISIBILITY CONTROLS - (تاريخ البداية والنهاية للظهور للتلاميذ) */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 space-y-3">
                    <p className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 flex items-center justify-end gap-1.5">
                      <span>التحكم في ظهور وجدولة الملف للطلاب (اختياري)</span>
                      <span>🗓️</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                      {/* Show from date */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-500 block">{isAr ? 'إظهار من (تاريخ النشر):' : 'Show From:'}</label>
                        <input
                          type="datetime-local"
                          value={hPubTime}
                          onChange={e => setHPubTime(e.target.value)}
                          className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-850 outline-none text-center"
                        />
                      </div>

                      {/* Hide at date */}
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-neutral-500 block">{isAr ? 'إخفاء في (تاريخ الانتهاء):' : 'Hide At (Optional):'}</label>
                        <input
                          type="datetime-local"
                          value={hHideTime}
                          onChange={e => setHHideTime(e.target.value)}
                          className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-850 outline-none text-center"
                        />
                      </div>
                    </div>

                    <p className="text-[9px] text-neutral-450 font-bold leading-normal text-right">
                      💡 {isAr 
                        ? 'في حالة عدم تحديد تاريخ الإخفاء، يبقى الملف متاحاً ومرئياً للطلاب بشكل دائم بمجرد النشر حتى يتم حذفه أو تعديل بياناته يدوياً.' 
                        : 'If no end date is set, the document remains active to registered student groups permanently.'}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 text-white text-xs font-black rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      handoutOpTab === 'add'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/10'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/10'
                    }`}
                  >
                    <span>💾</span>
                    <span>
                      {handoutOpTab === 'add' 
                        ? (isAr ? 'أرشفة ونشر الملف فوراً للطلاب ⚡' : 'Publish Handout File') 
                        : (isAr ? 'حفظ تعديلات الملف الحالية ⚡' : 'Save Document Edits')}
                    </span>
                  </button>
                </form>
              )}

              {/* TAB 3: DELETE PROCESS CONTAINER */}
              {handoutOpTab === 'delete' && (
                <div className="space-y-4">
                  {hSelectedId ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-rose-50 dark:bg-rose-950/20 border-2 border-dashed border-rose-200 dark:border-rose-900/30 rounded-2xl space-y-4 text-center text-right"
                    >
                      <p className="text-2xl text-center block">⚠️</p>
                      <div className="space-y-1 text-right">
                        <b className="text-xs font-black text-rose-700 dark:text-rose-450 block">{isAr ? 'الملف المحدد والمستهدف للشطب نهائياً:' : 'Selected handbook for permanent deletion:'}</b>
                        <p className="text-xs font-extrabold text-neutral-800 dark:text-rose-100 leading-normal">
                          {handouts.find((h: any) => h.id === hSelectedId)?.titleAr}
                        </p>
                        <div className="flex gap-2 flex-wrap text-[10px] text-neutral-450 font-bold pt-1.5 justify-end">
                          <span>📦 حجم الملف: {handouts.find((h: any) => h.id === hSelectedId)?.fileSize}</span>
                          <span>•</span>
                          <span>📂 الاسم: {handouts.find((h: any) => h.id === hSelectedId)?.fileName || handouts.find((h: any) => h.id === hSelectedId)?.titleAr}</span>
                        </div>
                      </div>

                      {/* Custom Dialog Alert */}
                      {!hDeleteConfirmOpen ? (
                        <button
                          type="button"
                          onClick={() => setHDeleteConfirmOpen(true)}
                          className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-600 hover:to-red-700 text-white text-xs font-black rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-500/10 hover:shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>{isAr ? 'طلب حذف ملف المذكرة 🗑️' : 'Request deletion'}</span>
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-650 text-white rounded-xl space-y-3"
                        >
                          <p className="text-xs font-black text-right leading-relaxed text-white">
                            🚨 {isAr 
                              ? 'هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن عملية الحذف بعد تنفيذها.' 
                              : 'Are you sure you want to delete this file? This action is permanent and cannot be undone.'}
                          </p>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={handleConfirmDeleteHandout}
                              className="py-1.5 px-4 bg-white text-red-750 text-xs font-black rounded-lg hover:bg-neutral-100 transition cursor-pointer"
                            >
                              {isAr ? 'تأكيد الحذف 🗑️' : 'Confirm Deletion'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setHDeleteConfirmOpen(false)}
                              className="py-1.5 px-4 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-850 transition cursor-pointer"
                            >
                              {isAr ? 'إلغاء الحذف والتراجع ✕' : 'Cancel'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-850 text-neutral-400">
                      <span className="text-2xl block mb-2">🗑️</span>
                      <p className="text-xs font-bold leading-normal">
                        {isAr 
                          ? 'يرجى تصفية المعلمات بالأعلى (الصف الدراسي ثم الكورس ثم المجموعة) ثم تحديد الملف المطلوب سحبه من النظام لتظهر نافذة التأكيد الآمنة.' 
                          : 'Select a hierarchy path above first, then click booklet item to enable secure delete dialog.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Idle Placeholder */}
              {handoutOpTab === 'edit' && !hSelectedId && (
                <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-150 dark:border-neutral-805 text-neutral-400">
                  <span className="text-2xl block mb-2">✏️</span>
                  <p className="text-xs font-bold leading-normal">
                    {isAr ? 'بالمسار العلوي، حدد المجموعة ثم الملف المراد تعديله لملء وتعديل حقول الاستمارة تلقائياً.' : 'Please select grade, course, group and then target handout booklet to review/modify details.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. TASKS EXAM & ASSIGNMENT SECTION */}
      {activeSubSection === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddOrEditTask} className="lg:col-span-1 bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
            <h4 className="text-xs font-black text-neutral-808 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-750">
              {isAr ? '➕ تصميم امتحانات وواجبات مقررة' : '➕ Construct exam & homework task'}
            </h4>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'تصنيف المهمة الأكاديمية' : 'Classify Task'}</label>
              <select
                value={tType}
                onChange={e => setTType(e.target.value as any)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              >
                <option value="exam">🏆 امتحان تراكمي معزز (Exam)</option>
                <option value="assignment">✏️ واجب منزلي أسبوعي (Assignment)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'كورس المهمة' : 'Target Course'}</label>
              <select
                required
                value={tCourseId}
                onChange={e => {
                  setTCourseId(e.target.value);
                  setTModuleId('');
                }}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              >
                <option value="">-- كورس المهمة --</option>
                {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'المجموعة التابعة (مستحب للتنظيم والترتيب)' : 'Target Module (Optional)'}</label>
              <select
                value={tModuleId}
                onChange={e => setTModuleId(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              >
                <option value="">-- {isAr ? 'اختر المجموعة' : 'Select Module'} --</option>
                {modules.filter(m => m.courseId === tCourseId).map(m => (
                  <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-neutral-450">{isAr ? 'عنوان المهمة (مثال: امتحان الحث الكهرومغناطيسي)' : 'Task Subject Title'}</label>
              <input
                required
                type="text"
                value={tTitleAr}
                onChange={e => setTTitleAr(e.target.value)}
                placeholder="شرح الواجب بالبنزين..."
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الأسئلة' : 'Questions'}</span>
                <input required type="number" value={tQuestCount} onChange={e => setTQuestCount(Number(e.target.value))} className="w-full text-xs py-1.5 px-2.5 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الدرجات' : 'Total marks'}</span>
                <input required type="number" value={tMarks} onChange={e => setTMarks(Number(e.target.value))} className="w-full text-xs py-1.5 px-2.5 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'المدة الزمنية' : 'Duration'}</span>
                <input type="text" value={tDuration} onChange={e => setTDuration(e.target.value)} placeholder="٣٠ دقيقة" className="w-full text-[10px] py-1.5 px-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition"
            >
              {isAr ? 'تأكيد الرفع على سيرفر سند ⚡' : 'Publish Task ⚡'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">{isAr ? 'الامتحانات والواجبات المتبثة' : 'Active Assessment list'}</h4>
            <div className="space-y-3">
              {tasks.map((tk) => {
                const associatedCourseName = allCourses.find(c => c.id === tk.courseId)?.title || 'كورس مفقود';
                const associatedModuleName = modules.find(m => m.id === tk.moduleId)?.titleAr;
                return (
                  <div key={tk.id} className="p-4 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xs flex justify-between items-center text-right">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-neutral-855 dark:text-white leading-tight">{isAr ? tk.titleAr : tk.titleEn}</p>
                      <div className="flex gap-1.5 items-center flex-wrap pt-1">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                          tk.type === 'exam' ? 'bg-amber-500/10 text-amber-600' : 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400'
                        }`}>
                          {tk.type === 'exam' ? (isAr ? 'امتحان' : 'EXAM') : (isAr ? 'واجب' : 'ASSIGNMENT')}
                        </span>
                        <span className="text-[9px] text-neutral-450 font-bold">📚 {associatedCourseName}</span>
                        {associatedModuleName && (
                          <span className="inline-block bg-blue-50 dark:bg-blue-950/45 text-[9px] font-bold px-2 py-0.5 rounded-md text-blue-600 dark:text-blue-400">
                            📦 {associatedModuleName}
                          </span>
                        )}
                        <span className="text-[8px] text-neutral-400 font-mono font-bold">⏱ {tk.duration} • 🔢 {tk.questionsCount} أسئلة • {tk.totalMarks} درجة</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleEditTaskInit(tk)} className="p-1 px-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDeleteTask(tk.id)} className="p-1 px-2.5 hover:bg-rose-50 text-rose-500 rounded-xl transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. QUESTION BANK SECTION */}
      {activeSubSection === 'qbank' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Design MCQs form */}
            <form onSubmit={handleAddQuestionToBank} className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
              <h4 className="text-xs font-black text-neutral-808 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-750">
                {isAr ? '🧠 تصميم أسئلة اختيار من متعدد (MCQs)' : '🧠 Formulate MCQ Question'}
              </h4>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-450">{isAr ? 'جسم السؤال (بالعربية)' : 'Question Body (Arabic)'}</label>
                <textarea
                  required
                  rows={2}
                  value={qAr}
                  onChange={e => setQAr(e.target.value)}
                  placeholder="مثال: أي من التاليات تعادل شدة تيار كيرشوف..."
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/40">
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الإختيار الأول A' : 'Option A'}</span>
                  <input required type="text" value={qOptAr0} onChange={e => setQOptAr0(e.target.value)} placeholder="أ تزداد" className="w-[100%] text-xs py-1.5 px-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الإختيار الثاني B' : 'Option B'}</span>
                  <input required type="text" value={qOptAr1} onChange={e => setQOptAr1(e.target.value)} placeholder="ب تقل" className="w-[100%] text-xs py-1.5 px-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الإختيار الثالث C' : 'Option C'}</span>
                  <input type="text" value={qOptAr2} onChange={e => setQOptAr2(e.target.value)} placeholder="ج تبقى ثابتة" className="w-[100%] text-xs py-1.5 px-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-450 font-black">{isAr ? 'الإختيار الرابع D' : 'Option D'}</span>
                  <input type="text" value={qOptAr3} onChange={e => setQOptAr3(e.target.value)} placeholder="د تنعدم مقاومة" className="w-[100%] text-xs py-1.5 px-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-450">{isAr ? 'مؤشر الإجابة السليمة' : 'Correct Option Index'}</label>
                <select
                  value={qCorrect}
                  onChange={e => setQCorrect(Number(e.target.value))}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                >
                  <option value={0}>{isAr ? 'الإختيار الأول A' : 'Option A'}</option>
                  <option value={1}>{isAr ? 'الإختيار الثاني B' : 'Option B'}</option>
                  <option value={2}>{isAr ? 'الإختيار الثالث C' : 'Option C'}</option>
                  <option value={3}>{isAr ? 'الإختيار الرابع D' : 'Option D'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-450">{isAr ? 'تفسير الإجابة العلمي والشرح (يظهر للطالب لدعمه)' : 'Explanation Details (Visible upon solving)'}</label>
                <input
                  type="text"
                  value={qExplain}
                  onChange={e => setQExplain(e.target.value)}
                  placeholder="بسبب تصادمات الشحنات بالذرات التكافؤية..."
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition"
              >
                {isAr ? 'تلقيم وإرسال للبنك الموحد ⚡' : 'Inject Question to Bank ⚡'}
              </button>
            </form>

            {/* Drag examination paper upload */}
            <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-neutral-808 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-750">
                  {isAr ? '🖼️ رفع امتحان ورقي مدمج بالكامل كصورة' : '🖼️ Upload Entire Written Exam Picture'}
                </h4>
                <p className="text-[10px] text-neutral-450 leading-relaxed">
                  {isAr 
                    ? 'بدلاً من صياغة سؤال مفرد، يمكنك تفريغ أو تصوير ورقة الامتحان الرسمية المطبوعة كاملة ورفعها ليتدرب عليها الطلاب في غرفهم.'
                    : 'Upload complete assessment sheet for students context.'}
                </p>

                {/* Drag zone simulation input */}
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulationImageDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <p className="text-4xl text-neutral-405">📁</p>
                    <p className="text-xs font-black text-neutral-750 dark:text-neutral-300">
                      {isAr ? 'انقر أو اسحب صورة الامتحان هنا للرفع الفوري' : 'Click or Drag Exam sheet picture here'}
                    </p>
                    <p className="text-[9px] text-neutral-400 font-bold">PDF, JPEG, PNG {isAr ? 'بحد أقصى ١٠ ميجابايت' : 'up to 10MB'}</p>
                  </div>
                </div>

                {uploadedExamImage && (
                  <div className="space-y-1 pt-3 text-center">
                    <span className="text-[10px] text-indigo-600 font-black">✓ {isAr ? 'تم تحميل الصورة في الذاكرة المؤقتة بنجاح' : 'Image loaded successfully'}</span>
                    <img src={uploadedExamImage} className="max-h-[140px] rounded-lg mx-auto border" alt="Exam preview" />
                  </div>
                )}
              </div>

              <div className="text-neutral-400 text-[10px] font-black italic bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 text-center border-none">
                {isAr ? '💡 يتم الحفظ والتحميل تلقائياً لطلاب الكورسات كواجب يدوي.' : '💡 Uploads directly as manual homework sheets.'}
              </div>
            </div>

          </div>

          {/* Question Listing database */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-neutral-808 dark:text-white pb-2 border-b border-neutral-150 dark:border-neutral-800">
              {isAr ? 'قاعدة عينات بنك الأسئلة المتوفرة' : 'Question bank depository'}
            </h4>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-2 text-right">
                  <div className="flex justify-between items-start">
                    <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                      {q.type}
                    </span>
                    <button onClick={() => setQuestions(prev => prev.filter(item => item.id !== q.id))} className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>

                  <p className="text-xs font-black text-neutral-909 dark:text-white">{isAr ? q.questionAr : q.questionEn}</p>
                  
                  {q.optionsAr.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 text-right">
                      {q.optionsAr.map((opt, oId) => (
                        <div key={oId} className={`p-2 rounded-xl text-[10px] font-bold ${
                          oId === q.correctOption ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/15' : 'bg-white dark:bg-neutral-800 border'
                        }`}>
                          <span>{['A', 'B', 'C', 'D'][oId]}: </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.examImage && (
                    <div className="pt-2 text-center">
                      <img src={q.examImage} className="max-h-[160px] rounded-lg border inline-block" alt="paper file" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. CONTROLLER REARRANGE SEQUENCING */}
      {activeSubSection === 'reorder' && (
        <div className="max-w-xl mx-auto space-y-6 text-right">
          <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-neutral-850 dark:text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تعديل إعادة ترتيب المحتويات والتسلسل التلقائي' : 'Curriculum Modules Sequencing'}</span>
              <span>↕</span>
            </h4>
            <p className="text-xs text-neutral-400 font-bold leading-relaxed">
              {isAr 
                ? 'قم بفرز أو تحريك عينات المجموعات بداخل الكورس صعوداً وهبوطاً ليتعرف الطالب على جدول العرض التتابع والتسلل الدراسي.'
                : 'Choose course and drag/re-order modules accordingly.'}
            </p>

            <select
              value={reorderCourseId}
              onChange={e => {
                setReorderCourseId(e.target.value);
                setSelectedModuleIdForContentReorder('');
              }}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 outline-none"
            >
              <option value="">-- {isAr ? 'اختر الكورس المستهدف لترتيب موديولاته' : 'Select Target Course'} --</option>
              {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          {reorderCourseId && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="pb-1 border-b border-neutral-100 dark:border-neutral-800">
                  <h5 className="text-[11px] font-black text-neutral-450 uppercase">{isAr ? 'المجموعات المسجلة بداخل الكورس' : 'Syllabus Groups'}</h5>
                </div>
                {modules.filter(m => m.courseId === reorderCourseId).length === 0 ? (
                  <p className="p-4 text-xs font-bold text-neutral-400 text-center bg-white dark:bg-neutral-850 rounded-2xl border">{isAr ? 'لا توجد مجموعات مضافة في هذا الكورس بعد.' : 'No modules added in this course yet.'}</p>
                ) : (
                  modules.filter(m => m.courseId === reorderCourseId).map((m, id, arr) => (
                    <div key={m.id} className="p-4 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-3xl flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-right shadow-xs">
                      <div className="space-y-1 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <h5 className="text-xs font-black text-neutral-855 dark:text-white leading-tight">{isAr ? m.titleAr : m.titleEn}</h5>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded font-bold text-neutral-450">#{id + 1}</span>
                        </div>
                        {m.descriptionAr && <p className="text-[9px] text-neutral-400 font-bold text-right">{m.descriptionAr}</p>}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Selected module contents ordering button option */}
                        <button
                          onClick={() => setSelectedModuleIdForContentReorder(selectedModuleIdForContentReorder === m.id ? '' : m.id)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition flex items-center gap-1 ${
                            selectedModuleIdForContentReorder === m.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/15'
                              : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-750'
                          }`}
                        >
                          <span>{isAr ? 'ترتيب المحتويات 🧩' : 'Arrange Content 🧩'}</span>
                        </button>

                        <div className="flex gap-1">
                          <button
                            disabled={id === 0}
                            onClick={() => moveModuleUp(m.id)}
                            className="p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 border transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-450" />
                          </button>
                          <button
                            disabled={id === arr.length - 1}
                            onClick={() => moveModuleDown(m.id)}
                            className="p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 border transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-450" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* REORDER THE CONTENTS WITHIN THE SELECTED MODULE */}
              {selectedModuleIdForContentReorder && (
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-indigo-500/10 space-y-5">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10">
                    <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-md text-center">
                      {isAr ? 'ترتيب محتوى المجموعة الموحد' : 'Unified Module Items Order'}
                    </span>
                    <h5 className="text-xs font-black text-neutral-850 dark:text-white">
                      {isAr ? 'الترتيب الشامل لعناصر المجموعة 🧩' : 'Arrange Full Module Content'}
                    </h5>
                  </div>

                  <p className="text-[10px] text-neutral-400 font-bold leading-relaxed text-right">
                    {isAr
                      ? 'رتب جميع الفيديوهات، المذكرات، والواجبات بحرية كاملة معاً في تتابع واحد بأسلوب السحب والإفلات أو الأسهم لتظهر للطالب بالمنصة بذات الترتيب تماماً.'
                      : 'Arrange all lectures, handouts, and assessments inside the module in a single unified progression flow using arrows or drag and drop.'}
                  </p>

                  {(() => {
                    const moduleVids = videos.filter(v => v.moduleId === selectedModuleIdForContentReorder).map(v => ({ ...v, itemType: 'video' as const }));
                    const moduleHandouts = handouts.filter(h => h.moduleId === selectedModuleIdForContentReorder).map(h => ({ ...h, itemType: 'handout' as const }));
                    const moduleTasks = tasks.filter(t => t.moduleId === selectedModuleIdForContentReorder).map(t => ({ ...t, itemType: 'task' as const }));

                    const combined = [...moduleVids, ...moduleHandouts, ...moduleTasks];
                    combined.sort((a, b) => {
                      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
                      if (a.order !== undefined) return -1;
                      if (b.order !== undefined) return 1;
                      const typeOrder: Record<string, number> = { 'video': 1, 'handout': 2, 'task': 3 };
                      return (typeOrder[a.itemType] || 99) - (typeOrder[b.itemType] || 99);
                    });

                    return (
                      <div className="space-y-3">
                        {combined.length === 0 ? (
                          <div className="p-8 text-center bg-white dark:bg-neutral-850 border border-neutral-150 dark:border-neutral-800 rounded-2xl">
                            <p className="text-neutral-400 text-xs font-bold">
                              {isAr ? 'لا توجد عناصر مضافة في هذه المجموعة بعد.' : 'No items added in this module yet.'}
                            </p>
                          </div>
                        ) : (
                          combined.map((item, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === combined.length - 1;
                            
                            // Define styles and labels based on itemType
                            let badgeStyle = '';
                            let badgeLabelAr = '';
                            let badgeLabelEn = '';
                            let subtitleAr = '';
                            let subtitleEn = '';
                            let badgeIcon = '🧩';

                            if (item.itemType === 'video') {
                              badgeIcon = '🎥';
                              badgeLabelAr = 'فيديو شرح';
                              badgeLabelEn = 'Video';
                              badgeStyle = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900';
                              subtitleAr = `مدة الشرح: ${item.duration || '٤٥ دقيقة'}`;
                              subtitleEn = `Video duration: ${item.duration || '45 mins'}`;
                            } else if (item.itemType === 'handout') {
                              badgeIcon = '📄';
                              badgeLabelAr = 'مذكرة PDF';
                              badgeLabelEn = 'PDF Handout';
                              badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900';
                              subtitleAr = `الملف المرفق: ${item.fileSize || '٣.٠ ميجابايت'}`;
                              subtitleEn = `File study: ${item.fileSize || '3.0 MB'}`;
                            } else if (item.itemType === 'task') {
                              const isExam = item.type === 'exam';
                              badgeIcon = isExam ? '🏆' : '✏️';
                              badgeLabelAr = isExam ? 'اختبار إلكتروني' : 'واجب ومتابعة';
                              badgeLabelEn = isExam ? 'Quiz Exam' : 'Homework Task';
                              badgeStyle = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900';
                              subtitleAr = `الدرجات: ${item.totalMarks || 10} درجة • المدة: ${item.duration || '—'}`;
                              subtitleEn = `Marks: ${item.totalMarks || 10} • Allowed time: ${item.duration || '—'}`;
                            }

                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDrop={(e) => handleDragDrop(e, idx)}
                                className={`p-4 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-750 flex flex-row items-center justify-between text-right shadow-xs transition duration-200 cursor-grab active:cursor-grabbing hover:border-indigo-500/40 select-none ${
                                  draggedItemIndex === idx ? 'opacity-35 border-dashed border-indigo-500 bg-indigo-50/10' : ''
                                }`}
                              >
                                <div className="space-y-1 pr-1 text-right flex-1 overflow-hidden">
                                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded-md font-extrabold text-neutral-450">
                                      #{idx + 1}
                                    </span>
                                    <span className={`text-[9px] font-black px-2 py-0.5 border rounded-md flex items-center gap-0.5 ${badgeStyle}`}>
                                      <span>{badgeIcon}</span>
                                      <span>{isAr ? badgeLabelAr : badgeLabelEn}</span>
                                    </span>
                                  </div>
                                  <h6 className="text-[11px] font-extrabold text-neutral-855 dark:text-neutral-200 text-right leading-tight truncate">
                                    {isAr ? item.titleAr : item.titleEn}
                                  </h6>
                                  <p className="text-[9px] text-neutral-400 font-bold">
                                    {isAr ? subtitleAr : subtitleEn}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 self-center pl-1">
                                  {/* Drag indicator icon */}
                                  <div className="hidden sm:flex text-neutral-300 dark:text-neutral-650 cursor-grab" title={isAr ? 'اسحب لترتيب هذا العنصر' : 'Drag to reorder'}>
                                    <Layers className="h-4 w-4" />
                                  </div>

                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      disabled={isFirst}
                                      onClick={() => moveModuleItemUp(item.itemType, item.id)}
                                      className="p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 border border-neutral-200 dark:border-neutral-750 transition-colors cursor-pointer"
                                      title="Move Up"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-450" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLast}
                                      onClick={() => moveModuleItemDown(item.itemType, item.id)}
                                      className="p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 border border-neutral-200 dark:border-neutral-750 transition-colors cursor-pointer"
                                      title="Move Down"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-450" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })()}

                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
