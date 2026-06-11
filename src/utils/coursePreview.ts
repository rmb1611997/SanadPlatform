import { CourseModule, CourseModuleItem } from '../types';

// Generate premium mock module data for each course
export const generateMockModules = (courseId: string): CourseModule[] => {
  // 1. Try to read active customized assets from local teacher configuration
  const savedModStr = localStorage.getItem('sanad_modules_config_db');
  const savedVidStr = localStorage.getItem('sanad_videos_config_db');
  const savedHandStr = localStorage.getItem('sanad_handouts_config_db');
  const savedTaskStr = localStorage.getItem('sanad_tasks_config_db');
  const savedQuestStr = localStorage.getItem('sanad_questions_config_db');

  const rawModules = savedModStr ? JSON.parse(savedModStr) : [];
  const rawVideos = savedVidStr ? JSON.parse(savedVidStr) : [];
  const rawHandouts = savedHandStr ? JSON.parse(savedHandStr) : [];
  const rawTasks = savedTaskStr ? JSON.parse(savedTaskStr) : [];
  const rawQuestions = savedQuestStr ? JSON.parse(savedQuestStr) : [];

  // Filter modules for this course
  const courseModules = rawModules.filter((m: any) => m.courseId === courseId);

  if (courseModules.length === 0) {
    return [];
  }

  // We construct the list of modules with unified item sorting!
  return courseModules.map((mod: any) => {
      // Find all types of items associated with this module
      const modVids = rawVideos
        .filter((v: any) => v.moduleId === mod.id)
        .map((v: any) => ({
          id: v.id,
          type: 'video' as const,
          titleAr: v.titleAr || v.titleEn,
          titleEn: v.titleEn || v.titleAr,
          duration: v.duration || '٤٥ دقيقة',
          videoUrl: v.link || v.videoUrl || '',
          videoSource: v.source || 'youtube',
          order: v.order,
          isFree: v.isFree === true || String(v.isFree) === 'true'
        }));

      const modHandouts = rawHandouts
        .filter((h: any) => h.moduleId === mod.id)
        .map((h: any) => ({
          id: h.id,
          type: 'file' as const,
          titleAr: h.titleAr || h.titleEn,
          titleEn: h.titleEn || h.titleAr,
          fileSize: h.fileSize || '٣.٠ ميجابايت',
          order: h.order,
          isFree: false
        }));

      const modTasks = rawTasks
        .filter((t: any) => t.moduleId === mod.id)
        .map((t: any) => {
          // Construct homework/quiz questions from general question bank or fall back to mock questions
          const questionsList = rawQuestions.slice(0, t.questionsCount || 2).map((q: any) => ({
            qAr: q.questionAr,
            qEn: q.questionEn,
            optionsAr: q.optionsAr && q.optionsAr.length > 0 ? q.optionsAr : ['مثال ١', 'مثال ٢', 'مثال ٣', 'مثال ٤'],
            optionsEn: q.optionsEn && q.optionsEn.length > 0 ? q.optionsEn : ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correct: q.correctOption !== undefined ? q.correctOption : 0,
            explanationAr: q.explanationAr || 'تفسير وحل نموذجي بناءً على معايير سند التعليمية المعتمدة.',
            explanationEn: q.explanationEn || 'Systematic response analyzed by academic guidelines.'
          }));

          // fallback to standard questions if error or empty
          if (questionsList.length === 0) {
            questionsList.push({
              qAr: 'أي مما يلي يصف بدقة التفكير المنهجي لمستويات التفوق الدراسي بمرجع سند للأستاذ؟',
              qEn: 'Which of the following describes the accurate comprehension flow in materials?',
              optionsAr: ['الفهم المكتمل والتحليل', 'الحفظ العشوائي بدون دراسة', 'الانتظار دون بذل الجهد المكافي', 'تخطي الأسئلة بالكامل'],
              optionsEn: ['Deep conceptual understanding and analytical mapping', 'Rote memorization with zero practice', 'Leaving sheets blanks', 'Ignoring lessons entirely'],
              correct: 0,
              explanationAr: 'الفهم المكتمل والخرائط الذهنية تمنحك القدرة على المراجعة وصياغة الوعي بأقل مجهود.',
              explanationEn: 'Comprehensive logical retention empowers the student with confidence.'
            });
          }

          return {
            id: t.id,
            type: (t.type === 'homework' || t.type === 'assignment') ? ('homework' as const) : ('quiz' as const),
            titleAr: t.titleAr || t.titleEn,
            titleEn: t.titleEn || t.titleAr,
            duration: t.duration || '١٥ دقيقة',
            questions: questionsList,
            order: t.order,
            isFree: false
          };
        });

      // Combine all module items into one single array
      const items = [...modVids, ...modHandouts, ...modTasks];

      // Sort combined array based on teacher's order
      items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        // Fallback sequence if order is undefined: video first, then handout, then task
        const typeOrder: Record<string, number> = { 'video': 1, 'file': 2, 'homework': 3, 'quiz': 4 };
        return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      });

      return {
        id: mod.id,
        titleAr: mod.titleAr || mod.titleEn,
        titleEn: mod.titleEn || mod.titleAr,
        items
      };
    });

  // Fallback to beautiful default static modules if no teacher configuration has been initialized
  return [
    {
      id: `${courseId}_mod1`,
      titleAr: '📘 مجموعة الفصل الأول: التأسيس والمفاهيم الكبرى',
      titleEn: '📘 Module 1: Foundational Core Concepts',
      items: [
        {
          id: `${courseId}_mod1_v1`,
          type: 'video' as const,
          titleAr: '🎥 الشرح: المحاضرة الأولى والتمهيد الشامل',
          titleEn: '🎥 Video: First Lecture and Comprehensive Introduction',
          duration: '45 ' + (courseId.startsWith('c') ? 'دقيقة' : 'minutes'),
          isFree: true,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoSource: 'youtube'
        },
        {
          id: `${courseId}_mod1_v2`,
          type: 'video' as const,
          titleAr: '🎥 الشرح: فك شفرات القوانين والمعادلات الذهبية',
          titleEn: '🎥 Video: Deciphering Golden Rules and Formulae',
          duration: '38 ' + (courseId.startsWith('c') ? 'دقيقة' : 'minutes'),
          isFree: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoSource: 'youtube'
        },
        {
          id: `${courseId}_mod1_f1`,
          type: 'file' as const,
          titleAr: '📄 الملفات: ملخص ذهبي ومذكرة الأسئلة الشاملة (PDF)',
          titleEn: '📄 PDF: Golden Summary and Comprehensive Q&A Notebook',
          fileSize: '4.8 MB',
          isFree: false
        },
        {
          id: `${courseId}_mod1_f2`,
          type: 'file' as const,
          titleAr: '📄 الملفات: خرائط عقلية للفهم السريع وحفظ القواعد',
          titleEn: '📄 PDF: Instant Mind-Maps for Visual Concept Synthesis',
          fileSize: '2.4 MB',
          isFree: false
        },
        {
          id: `${courseId}_mod1_h1`,
          type: 'homework' as const,
          titleAr: '📝 الواجب: تدريبات تطبيقية قياسية للتأكيد على الفهم',
          titleEn: '📝 Homework: Standard Application Tasks for Practical Drill',
          isFree: false,
          questions: [
            {
              qAr: 'ما هي الطريقة الأنسب لحل المشكلات المعقدة بناءً على شرح المحاضرة الأول؟',
              qEn: 'What is the most accurate approach to critical solving based on lecture 1?',
              optionsAr: ['التجربة والخطأ المباشر', 'البدء من الفهم والتجزئة المنهجية للرموز', 'التخمين العشوائي', 'تركها للاختبار النهائي'],
              optionsEn: ['Direct trial and error', 'Conceptual framing & systematic parameter breakdown', 'Blind guessing', 'Postponing to the final exam'],
              correct: 1,
              explanationAr: 'الفهم المنهجي والتفكيك الرياضي هو حجر أساس منهجية سند للتفوق الدراسي.',
              explanationEn: 'Systematic conceptual breakdown guarantees an accurate logic flow with zero effort.'
            },
            {
              qAr: 'أي من العناصر التالية يعتبر الأقل تأثيراً في زمن المراجعة الكلي؟',
              qEn: 'Which of the following has the least effect on total revision time?',
              optionsAr: ['الحفظ التلقائي دون ممارسة', 'الفهم المرئي المكتمل', 'حل الامتحانات السابقة', 'الخرائط الذهنية الملخصة'],
              optionsEn: ['Rote memorization with zero practice', 'Complete visual comprehension', 'Solving past exam papers', 'Summary mind-maps'],
              correct: 0,
              explanationAr: 'الحفظ التلقائي دون تدريب حقيقي يرفع معدل التشويش ويستهلك وقتاً مضاعفاً.',
              explanationEn: 'Draft rote learning is unstable for secondary levels and slows retention.'
            }
          ]
        },
        {
          id: `${courseId}_mod1_q1`,
          type: 'quiz' as const,
          titleAr: '🧪 الاختبار: تقييم الوحدة الأولى وقياس دقة الاستيعاب',
          titleEn: '🧪 Test: Module 1 Assessment and Proficiency Measurement',
          isFree: false,
          questions: [
            {
              qAr: 'طالب متميز يذاكر ٤ ساعات يومياً بتركيز، فإذا رفع جودة فهمه بنسبة ٥٠٪، كم تعادل جودة تحصيله؟',
              qEn: 'A student studies 4 focused hours. If their comprehension index rises by 50%, what is their equivalent output?',
              optionsAr: ['٦ ساعات من التحصيل التقليدي', '٥ ساعات فقط', 'تحصيل ضعيف لزيادة المجهود', '١٢ ساعة كاملة'],
              optionsEn: ['6 hours of conventional study production', '5 standard hours only', 'Diminished results due to extra stress', '12 full hours'],
              correct: 0,
              explanationAr: 'ارتفاع جودة التركيز بنسبة ٥٠٪ ترفع العائد إلى (٤ * ١.٥ = ٦ ساعات).',
              explanationEn: 'Output scales linearly with focused learning index: 4 * 1.5 = 6 dynamic hours.'
            },
            {
              qAr: 'ما هي الاستراتيجية المثالية للحلول عند مواجهة سؤال صعب بالاختبار؟',
              qEn: 'What is the perfect strategic rule when encountering a tough exam question?',
              optionsAr: ['البكاء والانتقال للمنزل', 'استبعاد البدائل غير المنطقية أولاً ثم التحليل المتبقي', 'اختيار الإجابة (أ) دائماً', 'ترك السؤال فارغاً'],
              optionsEn: ['Panic and leave the room', 'Eliminate irrational options first, then analyze the remainder', 'Always choose choice (A)', 'Leave it blank'],
              correct: 1,
              explanationAr: 'تصفية الخيارات العشوائية ترفع احتمالية الإجابة الصحيحة للدرجة القصوى وتكسب وقتاً.',
              explanationEn: 'Process of deduction clears the mental canvas and saves crucial seconds.'
            }
          ]
        }
      ]
    },
    {
      id: `${courseId}_mod2`,
      titleAr: '📘 مجموعة الفصل الثاني: المهارات المتقدمة والتطبيقات والسر الإبداعي',
      titleEn: '📘 Module 2: Advanced Techniques, Application and Creative Strategy',
      items: [
        {
          id: `${courseId}_mod2_v1`,
          type: 'video' as const,
          titleAr: '🎥 الشرح: المحاضرة الثانية وأسرار التميز السريع',
          titleEn: '🎥 Video: Second Lecture and Secrets to Rapid Scoring',
          duration: '52 ' + (courseId.startsWith('c') ? 'دقيقة' : 'minutes'),
          isFree: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoSource: 'youtube'
        },
        {
          id: `${courseId}_mod2_f1`,
          type: 'file' as const,
          titleAr: '📄 الملفات: مرجع الفهم وحل التمارين الصعبة المرفقة',
          titleEn: '📄 PDF: Master Guide containing answers to tough curriculum drills',
          fileSize: '3.9 MB',
          isFree: false
        },
        {
          id: `${courseId}_mod2_h1`,
          type: 'homework' as const,
          titleAr: '📝 الواجب: تدريبات متقدمة مستوحاة من الامتحانات الرسمية السابقة',
          titleEn: '📝 Homework: Advanced homework tasks inspired by official past assessments',
          isFree: false,
          questions: [
            {
              qAr: 'أي من الطرق التالية تمكّك من تنظيم بيئة دراستك بكفاءة؟',
              qEn: 'Which of the following aids most in sorting out your learning atmosphere efficiently?',
              optionsAr: ['تشتيت انتباهك بالهاتف المحمول', 'إنشاء جدول زمني واضح مع فترات راحة قصيرة (Pomodoro)', 'الدراسة أثناء النوم فقط', 'الاستماع للموسيقى الصاخبة جداً'],
              optionsEn: ['Using social media continuously', 'Creating a robust timeline with spaced intervals (Pomodoro Technique)', 'Only studying when sleeping', 'Listening to extremely loud music'],
              correct: 1,
              explanationAr: 'تنظيم الفترات الزمنية يمنع شلل الإنتاجية ويضاعف قدرة الدماغ على التركيز والاحتفاظ بخرائط الذاكرة.',
              explanationEn: 'Spaced review avoids fatigue and cements information deep within neural networks.'
            }
          ]
        },
        {
          id: `${courseId}_mod2_q1`,
          type: 'quiz' as const,
          titleAr: '🧪 الاختبار: قياس مهارات حل المسائل السريعة لتبسيط الصعاب',
          titleEn: '🧪 Test: Assessing Rapid Problem Solving to simplify complex tasks',
          isFree: false,
          questions: [
            {
              qAr: 'إذا تعارض الفهم المطلق مع السعي نحو الحفظ البحت في منهجية سند، فما الأولى بالاتباع؟',
              qEn: 'If ultimate comprehension conflicts with rote-learning, which holds absolute priority in the Sanad ethos?',
              optionsAr: ['الفهم والتفكير والتحليل العميق', 'الحفظ الأعمى دون تساؤل', 'النقل والنسخ', 'الاعتماد الكلي على الحظ'],
              optionsEn: ['Deep comprehension, reasoning & analytical thinking', 'Blind mimicry and cramming', 'Plagiarism and copying', 'Complete reliance on pure luck'],
              correct: 0,
              explanationAr: 'منظومة الفهم والوعي هي ما تمنح الطالب القوة لتجاوز العقبات غير التقليدية وحيازة التفوق.',
              explanationEn: 'Understanding dynamic rules allows real knowledge transference rather than temporary retention.'
            }
          ]
        }
      ]
    }
  ];
};
