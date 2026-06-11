import { Course, Teacher, Feature, Review, FAQItem, LanguageStrings } from './types';

export const teachersData = {
  ar: [
    {
      id: 't1',
      name: 'أ. أحمد سامي',
      title: 'خبير الفيزياء للثانوية العامة والمسارات',
      specialty: 'الفيزياء والمسارات',
      bio: 'كبير مسؤولي المناهج ومستشار المادة بوزارة التربية وخبير تدريس الفيزياء الرقمية بمصر والشرق الأوسط بخبرة تتعدى ٢٠ عاماً.',
      coursesCount: 3,
      rating: 4.9,
      avatar: '👨‍🏫',
      studentsCount: 1250,
      subject: 'physics',
      grades: ['1', '2', '3'],
      curriculumAr: 'المنهج المصري العام والمسارات الثانوية السعودية',
      curriculumEn: 'Egyptian General Syllabus & Saudi Secondary Tracks',
      country: 'EG'
    },
    {
      id: 't2',
      name: 'أ. فهد العتيبي',
      title: 'كبير معلمي الرياضيات والمسارات والقدرات والتحصيلي',
      specialty: 'الرياضيات والتحصيلي',
      bio: 'متخصص في تبسيط غوامض المسائل الرياضية وتأهيل الطلاب لاجتياز اختبارات القدرات والتحصيلي بأعلى الدرجات والنسب القياسية.',
      coursesCount: 2,
      rating: 4.8,
      avatar: '👨‍🏫',
      studentsCount: 980,
      subject: 'math',
      grades: ['2', '3'],
      curriculumAr: 'مسار الرياضيات المطور واختبارات قياس القدرات والتحصيلي',
      curriculumEn: 'Advanced Mathematics, Qudrat & Tahsili Systems',
      country: 'SA'
    },
    {
      id: 't3',
      name: 'أ. مراد السيوفي',
      title: 'محاضر الكيمياء العضوية وخبير المعامل الافتراضية',
      specialty: 'الكيمياء الحديثة',
      bio: 'يقدم كيمياء الثانوية العامة بأسلوب المعامل ثلاثية الأبعاد والخرائط الحركية العقلية المتكاملة التي تغنيك تماماً عن الفهم العشوائي.',
      coursesCount: 4,
      rating: 4.9,
      avatar: '👨‍🏫',
      studentsCount: 1420,
      subject: 'chemistry',
      grades: ['1', '3'],
      curriculumAr: 'الكيمياء العضوية والغير عضوية والمسار العلمي المشترك',
      curriculumEn: 'Organic & Inorganic Chemistry Tracks',
      country: 'EG'
    },
    {
      id: 't4',
      name: 'د. منى زهران',
      title: 'محاضرة الأحياء ومسؤولة المراجعات الطبية بالمنصة',
      specialty: 'الأحياء والجيولوجيا',
      bio: 'تبسيط ممتع لتركيب الوراثة وعلم الأحياء بأقل مجهود وبأسلوب قصصي مرئي فريد حاز على ثقة آلاف الطلاب لسنوات.',
      coursesCount: 3,
      rating: 4.9,
      avatar: '👩‍🏫',
      studentsCount: 1100,
      subject: 'biology',
      grades: ['1', '2', '3'],
      curriculumAr: 'منهج علم الأحياء، علوم الوراثة، والجيولوجيا العصرية',
      curriculumEn: 'Cell Biology, Genetics & Earth Sciences',
      country: 'EG'
    }
  ] as any[],
  en: [
    {
      id: 't1',
      name: 'Mr. Ahmed Samy',
      title: 'Senior Physics Advisor & Digital Labs Director',
      specialty: 'Physics & Secondary Tracks',
      bio: 'Curriculum development board member & expert with 20+ years of digital physics teaching across Egypt & the GCC region.',
      coursesCount: 3,
      rating: 4.9,
      avatar: '👨‍🏫',
      studentsCount: 1250,
      subject: 'physics',
      grades: ['1', '2', '3'],
      curriculumAr: 'المنهج المصري العام والمسارات الثانوية السعودية',
      curriculumEn: 'Egyptian General Syllabus & Saudi Secondary Tracks',
      country: 'EG'
    },
    {
      id: 't2',
      name: 'Mr. Fahd Al-Otaibi',
      title: 'Mathematics, Qudrat & Tahsili Master Teacher',
      specialty: 'Mathematics & Qudrat',
      bio: 'Specialized in breaking down complex algebraic formulas and coaching pathways students towards absolute perfect scores.',
      coursesCount: 2,
      rating: 4.8,
      avatar: '👨‍🏫',
      studentsCount: 980,
      subject: 'math',
      grades: ['2', '3'],
      curriculumAr: 'مسار الرياضيات المطور واختبارات قياس القدرات والتحصيلي',
      curriculumEn: 'Advanced Mathematics, Qudrat & Tahsili Systems',
      country: 'SA'
    },
    {
      id: 't3',
      name: 'Mr. Morad El-Sayoufi',
      title: 'Organic Chemistry Lecturer & Lab Architect',
      specialty: 'Modern Chemistry',
      bio: 'Pioneering organic and analytical chemistry courses with advanced 3D virtual visual labs and complete concept tracking maps.',
      coursesCount: 4,
      rating: 4.9,
      avatar: '👨‍🏫',
      studentsCount: 1420,
      subject: 'chemistry',
      grades: ['1', '3'],
      curriculumAr: 'الكيمياء العضوية والغير عضوية والمسار العلمي المشترك',
      curriculumEn: 'Organic & Inorganic Chemistry Tracks',
      country: 'EG'
    },
    {
      id: 't4',
      name: 'Dr. Mona Zahran',
      title: 'Chief Biology Lecturer & Clinical Cell Advisor',
      specialty: 'Biology & Earth Science',
      bio: 'Delivering stellar, visual summaries of genetics, anatomy, and zoology utilizing dynamic storytelling and simplified clinical modules.',
      coursesCount: 3,
      rating: 4.9,
      avatar: '👩‍🏫',
      studentsCount: 1100,
      subject: 'biology',
      grades: ['1', '2', '3'],
      curriculumAr: 'منهج علم الأحياء، علوم الوراثة، والجيولوجيا العصرية',
      curriculumEn: 'Cell Biology, Genetics & Earth Sciences',
      country: 'EG'
    }
  ] as any[]
};

export const coursesData = {
  ar: [
    {
      id: 'c1',
      title: 'الفيزياء الكهربية والحديثة - الصف الثالث الثانوي',
      teacher: 'أ. أحمد سامي',
      teacherTitle: 'مدرس الفيزياء الأول',
      teacherAvatar: '👨‍🏫',
      lessons: 42,
      duration: '٣٢ ساعة',
      price: 250,
      currency: 'جنيه / ريال',
      rating: 4.92,
      category: 'physics',
      country: 'both',
      level: 'الصف الثالث الثانوي',
      description: 'امتحانات دورية وتدريبات شاملة تغطي كافة فصول الفيزياء الكهربية والحديثة مع المدرس المعتمد للوصول للدرجة النهائية.',
      createdAt: '2026-01-10',
      updatedAt: '2026-06-10'
    },
    {
      id: 'c2',
      title: 'الرياضيات البحتة (التفاضل والتكامل) للثانوية العامة',
      teacher: 'أ. فهد العتيبي',
      teacherTitle: 'مدرس الرياضيات الأول',
      teacherAvatar: '👨‍🏫',
      lessons: 35,
      duration: '٢٨ ساعة',
      price: 300,
      currency: 'جنيه / ريال',
      rating: 4.85,
      category: 'math',
      country: 'EG',
      level: 'الثانوية العامة المصرية',
      description: 'شرح مبسط لقواعد التفاضل والتكامل برؤية هندسية مبتكرة وأمثلة وتدريبات تفاعلية لحل أصعب المسائل.',
      createdAt: '2026-01-15',
      updatedAt: '2026-06-08'
    },
    {
      id: 'c3',
      title: 'رياضيات ٥ - مسار العلوم الطبيعية (السعودية)',
      teacher: 'أ. فهد العتيبي',
      teacherTitle: 'مدرس رياضيات المسارات',
      teacherAvatar: '👨‍🏫',
      lessons: 30,
      duration: '٢٤ ساعة',
      price: 350,
      currency: 'ريال',
      rating: 4.9,
      category: 'math',
      country: 'SA',
      level: 'المرحلة الثانوية - مسارات',
      description: 'دورة تفصيلية ومكثفة لمقرر رياضيات 5 المسارات السعودية مع حل نماذج اختبارات نهاية الفصل والأسئلة الهامة.',
      createdAt: '2026-02-01',
      updatedAt: '2026-06-11'
    },
    {
      id: 'c4',
      title: 'دورة القدرات العامة - التأسيس والتدريب والحلول السريعة',
      teacher: 'أ. فهد العتيبي',
      teacherTitle: 'مدرس القدرات والتحصيلي',
      teacherAvatar: '👨‍🏫',
      lessons: 25,
      duration: '٢٠ ساعة',
      price: 180,
      currency: 'ريال',
      rating: 4.95,
      category: 'math',
      country: 'SA',
      level: 'القدرات العامة',
      description: 'التأسيس والالحاق السريع لكل تجميعات الكمي واللفظي بذكاء وسرعة لضمان تحصيل الدرجة الكاملة 100% بإذن الله.',
      createdAt: '2026-02-12',
      updatedAt: '2026-06-09'
    },
    {
      id: 'c5',
      title: 'الكيمياء العضوية المتقدمة - كيمياء وتجارب معملية تفاعلية',
      teacher: 'أ. نورة الحربي',
      teacherTitle: 'معلمة الكيمياء القديرة',
      teacherAvatar: '👩‍🏫',
      lessons: 28,
      duration: '٢٢ ساعة',
      price: 280,
      currency: 'جنيه / ريال',
      rating: 4.88,
      category: 'chemistry',
      country: 'both',
      level: 'الثانوي العام والمسارات',
      description: 'تجارب معملية ثلاثية الأبعاد وشرح وافٍ لمعادلات وتفاعلات المركبات العضوية لتيسير الحفظ والفهم.',
      createdAt: '2026-02-20',
      updatedAt: '2026-06-10'
    },
    {
      id: 'c6',
      title: 'شرح النحو والبلاغة بالخرائط الذهنية المبسطة للطلاب والناشئين',
      teacher: 'أ. فاروق النجار',
      teacherTitle: 'أستاذ اللسان العربي القدير',
      teacherAvatar: '👨‍🏫',
      lessons: 38,
      duration: '٣٠ ساعة',
      price: 200,
      currency: 'جنيه / ريال',
      rating: 4.97,
      category: 'languages',
      country: 'both',
      level: 'المرحلة الثانوية',
      description: 'تبسيط شامل لدروس القواعد النحوية ومناهج البلاغة باستخدام الخرائط الذهنية لتثبيت القواعد في الأذهان.',
      createdAt: '2026-03-01',
      updatedAt: '2026-06-11'
    },
    {
      id: 'c7',
      title: 'الأحياء - الوراثة والبيولوجيا الجزيئية والدنا',
      teacher: 'أ. أحمد سامي',
      teacherTitle: 'أستاذ العلوم الحديثة',
      teacherAvatar: '👨‍🏫',
      lessons: 32,
      duration: '٢٦ ساعة',
      price: 240,
      currency: 'جنيه / ريال',
      rating: 4.79,
      category: 'biology',
      country: 'EG',
      level: 'الصف الثالث الثانوي',
      description: 'تفسير كامل لدروس الوراثة والبيولوجيا الجزيئية والهندسة الوراثية برسومات توضيحية مبسطة.',
      createdAt: '2026-03-10',
      updatedAt: '2026-06-10'
    }
  ] as Course[],
  en: [
    {
      id: 'c1',
      title: 'Electrodynamics & Modern Physics - High School Grade 12',
      teacher: 'Mr. Ahmed Saimi',
      teacherTitle: 'Senior Physics Specialist',
      teacherAvatar: '👨‍🏫',
      lessons: 42,
      duration: '32 Hours',
      price: 250,
      currency: 'EGP / SAR',
      rating: 4.92,
      category: 'physics',
      country: 'both',
      level: 'Grade 12 (High School)'
    },
    {
      id: 'c2',
      title: 'Pure Mathematics (Calculus) for Egyptian Curriculum',
      teacher: 'Mr. Fahad Al-Otaibi',
      teacherTitle: 'Senior Mathematics Instructor',
      teacherAvatar: '👨•🏫',
      lessons: 35,
      duration: '28 Hours',
      price: 300,
      currency: 'EGP',
      rating: 4.85,
      category: 'math',
      country: 'EG',
      level: 'Thanaweya Amma (Egypt)'
    },
    {
      id: 'c3',
      title: 'Mathematics 5 - Natural Sciences Track (KSA)',
      teacher: 'Mr. Fahad Al-Otaibi',
      teacherTitle: 'Senior Mathematics Instructor',
      teacherAvatar: '👨‍🏫',
      lessons: 30,
      duration: '24 Hours',
      price: 350,
      currency: 'SAR',
      rating: 4.90,
      category: 'math',
      country: 'SA',
      level: 'Secondary Stage - Saudi Tracks'
    },
    {
      id: 'c4',
      title: 'General Qudrat Prep Course - Quick Solutions & Strategies',
      teacher: 'Mr. Fahad Al-Otaibi',
      teacherTitle: 'Qudrat & Tahsili Expert',
      teacherAvatar: '👨‍🏫',
      lessons: 25,
      duration: '20 Hours',
      price: 180,
      currency: 'SAR',
      rating: 4.95,
      category: 'math',
      country: 'SA',
      level: 'Qudrat (KSA Exam)'
    },
    {
      id: 'c5',
      title: 'Advanced Organic Chemistry - Interactive Remote Lab Experiments',
      teacher: 'Mrs. Noura Al-Harbi',
      teacherTitle: 'Senior Chemistry Instructor',
      teacherAvatar: '👩‍🏫',
      lessons: 28,
      duration: '22 Hours',
      price: 280,
      currency: 'EGP / SAR',
      rating: 4.88,
      category: 'chemistry',
      country: 'both',
      level: 'High School & Tracks'
    },
    {
      id: 'c6',
      title: 'Arabic Grammar & Rhetoric using Mind-Mapping Methodology',
      teacher: 'Mr. Farouk Al-Najjar',
      teacherTitle: 'Arabic Literature Specialist',
      teacherAvatar: '👨‍🏫',
      lessons: 38,
      duration: '30 Hours',
      price: 200,
      currency: 'EGP / SAR',
      rating: 4.97,
      category: 'languages',
      country: 'both',
      level: 'Secondary Stage'
    },
    {
      id: 'c7',
      title: 'Biology - Genetics & Molecular DNA Engineering',
      teacher: 'Mr. Ahmed Saimi',
      teacherTitle: 'Senior Science Expert',
      teacherAvatar: '👨‍🏫',
      lessons: 32,
      duration: '26 Hours',
      price: 240,
      currency: 'EGP',
      rating: 4.79,
      category: 'biology',
      country: 'EG',
      level: 'Thanaweya Amma (Egypt)'
    }
  ] as Course[]
};

export const featuresData = {
  ar: [
    {
      id: 'f1',
      title: 'تعلّم في أي وقت ومن أي مكان',
      description: 'منصتنا متوفرة طوال ٢٤ ساعة لتتمكن من مراجعة دروسك وفيديوهاتك وقتما وأينما أحببت.',
      iconName: 'Clock'
    },
    {
      id: 'f2',
      title: 'فيديوهات تعليمية عالية الجودة',
      description: 'شروحات بجودة فنية 4K مع نظام صوتي نقي ومؤثرات بصرية تساعدك على استيعاب المادة بسهولة.',
      iconName: 'Tv'
    },
    {
      id: 'f3',
      title: 'امتحانات إلكترونية تفاعلية',
      description: 'اختبارات ومحاكاة للامتحانات النهائية بعد كل وحدة مع تقييم تلقائي وتصحيح تفصيلي للأخطاء.',
      iconName: 'FileQuestion'
    },
    {
      id: 'f4',
      title: 'واجبات ومتابعة مستمرة',
      description: 'واجبات دورية ومتابعة دؤوبة من طاقم الإشراف لضمان التزام الطالب وفهمه للمحتوى.',
      iconName: 'ClipboardList'
    },
    {
      id: 'f5',
      title: 'دعم فني وتواصل سريع',
      description: 'فريق دعم فني يعمل حول الساعة لمساعدتك على تخطي الصعوبات التقنية وضمان التعلم البسيط.',
      iconName: 'Headphones'
    },
    {
      id: 'f6',
      title: 'متابعة تقدم الطالب لحظة بلحظة',
      description: 'تقارير بيانية تفصيلية ترسل لولي الأمر تظهر معدل المشاهدة ودرجات الاختبار المنجزة.',
      iconName: 'TrendingUp'
    }
  ],
  en: [
    {
      id: 'f1',
      title: 'Learn Anytime, Anywhere',
      description: 'Our platform is available 24/7 so you can study your lectures whenever and wherever suits you best.',
      iconName: 'Clock'
    },
    {
      id: 'f2',
      title: 'High-Quality Video Lectures',
      description: '4K resolution crystal-clear videos and professional sound quality with modern annotations.',
      iconName: 'Tv'
    },
    {
      id: 'f3',
      title: 'Interactive E-Quizzes & Mock Exams',
      description: 'Self-grading tests and unit exams that match standard Egyptian and Saudi ministry rules with instant answers.',
      iconName: 'FileQuestion'
    },
    {
      id: 'f4',
      title: 'Homework & Regular Follow-Up',
      description: 'Regular tasks scheduled to ensure continuity of studies under senior academic assistant advice.',
      iconName: 'ClipboardList'
    },
    {
      id: 'f5',
      title: 'Fast Technical Support',
      description: 'A round-the-clock supportive customer success squad to solve device difficulties promptly.',
      iconName: 'Headphones'
    },
    {
      id: 'f6',
      title: 'Real-time Student Progress Analytics',
      description: 'In-depth performance analytics curves sent directly to parents tracking attendance and quiz success.',
      iconName: 'TrendingUp'
    }
  ]
};

export const reviewsData = {
  ar: [] as Review[],
  en: [] as Review[]
};

export const faqData = {
  ar: [
    {
      id: 'q1',
      question: 'كيف يمكنني التسجيل والدراسة على منصة سند؟',
      answer: 'يمكنك البدء بالضغط على زر "إنشاء حساب" مجاناً، بعد تفعيل حسابك بالايميل يمكنك البدء بتصفح الكورسات وتفعيل المناهج ببطاقات الشحن أو الدفع الإلكتروني.',
      category: 'general'
    },
    {
      id: 'q2',
      question: 'هل المناهج معتمدة لمصر والسعودية ومحدثة لهذا العام؟',
      answer: 'نعم بالتأكيد! نحرص بشكل دوري وسنوي على ترقية الدروس وحذف الإضافات غير المقررة لتلائم أحدث مناهج وزارات التربية والتعليم في مصر (الثانوية العامة) والمملكة العربية السعودية (نظام المسارات).',
      category: 'curriculum'
    },
    {
      id: 'q3',
      question: 'ما هي وسائل الدفع المتاحة لتفعيل الكورسات؟',
      answer: 'نوفر باقة مرنة وشاملة للدولتين: في مصر عبر فوري، ميزة، فودافون كاش، وفي السعودية عبر مدى، فيزا، ماستركارد، وأبل باي.',
      category: 'payment'
    },
    {
      id: 'q4',
      question: 'كيف يتواصل الطلاب مع المدرسين لحل الأسئلة؟',
      answer: 'تحتوي منصة سند على منتدى تفاعلي وحلقات نقاش داخل كل كورس، حيث يستطيع الطالب كتابة سؤاله أو تصويره ليجيب المدرس أو المساعدون الأكاديميون فوراً.',
      category: 'community'
    },
    {
      id: 'q5',
      question: 'هل الكورسات تبث مباشرة أم مسجلة؟',
      answer: 'تجمع منصة سند بين الاثنين! فيديوهات الشرح المنهجي الأساسي تكون مسجلة بجودة بالغة لتوفير المجهود، وتُجرى حصص مراجعة وتدريبات حية (بث مباشر) أسبوعياً للإجابة وتلقي التعليقات.',
      category: 'general'
    }
  ],
  en: [
    {
      id: 'q1',
      question: 'How do I register and start learning on Sanad?',
      answer: 'Click the "Create Account" button to register a free student profile. After confirmation, browse courses and instantly enroll using secure online payments or discount cards.',
      category: 'general'
    },
    {
      id: 'q2',
      question: 'Are curriculums customized for Egyptian and Saudi schools?',
      answer: 'Absolutely! Our content creators annually modify our structures to follow Ministry of Education requirements in both Egypt (Thanaweya Amma) and Saudi Arabia (Pathway Academic Lines).',
      category: 'curriculum'
    },
    {
      id: 'q3',
      question: 'What payment techniques are supported on Sanad?',
      answer: 'In Egypt: Fawry, Meeza, Vodafone Cash. In Saudi Arabia: Mada, Credit Cards, and Apple Pay.',
      category: 'payment'
    },
    {
      id: 'q4',
      question: 'How do students ask tutors direct questions?',
      answer: 'Every paid study bundle comes with access to private Discord/WhatsApp channels and internal discussion boards staffed by top-tier academic teaching assistants.',
      category: 'community'
    },
    {
      id: 'q5',
      question: 'Are classes recorded or streamed in real-time?',
      answer: 'Sanad utilizes a hybrid framework: robust high-definition pre-recorded concept units for flexible independent study, coupled with weekly Live review and problem-solving interactive sessions.',
      category: 'general'
    }
  ]
};

export const translations: Record<'ar' | 'en', LanguageStrings> = {
  ar: {
    navHome: 'الرئيسية',
    navCourses: 'الكورسات',
    navTeachers: 'المدرسون',
    navAbout: 'من نحن',
    navContact: 'تواصل معنا',
    navLogin: 'تسجيل الدخول',
    navRegister: 'إنشاء حساب',
    
    heroTitle: 'سندك نحو التفوق والنجاح الدراسى',
    heroSubtitle: 'منصة تعليمية متكاملة تجمع أفضل المدرسين والمحتوى التعليمي الحديث لمساعدة الطلاب على تحقيق أفضل النتائج الدراسية.',
    heroCTAStart: 'ابدأ التعلم الآن',
    heroCTACourses: 'استعرض الكورسات',
    
    coursesTitle: 'الكورسات المميزة والمسارات التعليمية',
    coursesSubtitle: 'اختر المادة والمدرس المناسب وابدأ رحلة العلم نحو تحقيق طموحك الأكاديمي المكتمل.',
    coursesFilterAll: 'جميع التخصصات',
    coursesFilterMath: 'رياضيات',
    coursesFilterPhysics: 'فيزياء',
    coursesFilterChemistry: 'كيمياء',
    coursesFilterBiology: 'أحياء',
    coursesFilterLanguages: 'لغات وعربية',
    countrySelectAll: 'كل الدول والمناهج',
    countrySelectEG: 'المنهج المصري 🇪🇬',
    countrySelectSA: 'المنهج السعودي 🇸🇦',
    lessonsCount: 'درساً',
    priceFree: 'مجاني',
    courseDetailsBtn: 'عرض التفاصيل',
    
    teachersTitle: 'كادر معلمي منصة سند',
    teachersSubtitle: 'أفضل المحاضرين والخبراء الأكاديميين المكرسين جهدهم لدعم مسيرتك وتفوقك.',
    teacherCourses: 'كورس مفعل',
    teacherStudents: 'طالب مسجل',
    
    featuresTitle: 'لماذا يختار الطالب "سند"؟',
    featuresSubtitle: 'نوفر لك المناخ التعليمي المثالي والأدوات الذكية لتتفوق وتصل للقمة بأقل مجهود.',
    
    reviewsTitle: 'قصص نجاح من طلاب "سند"',
    reviewsSubtitle: 'آلاف الطلاب وثقوا في سند وأكملوا رحلتهم محققين الدرجات النهائية. اقرأ شهاداتهم بكل مصداقية.',
    
    faqTitle: 'لديك استفسار؟ اطلع على الأسئلة الشائعة',
    faqSubtitle: 'اكتشف الإجابات الشافية عن التسجيل، تفعيل الحسابات، ودراسة المناهج المعتمدة.',
    
    contactTitle: 'دعنا نكن سندك اليوم',
    contactSubtitle: 'لديك فكرة، شكوى، أو استفسار؟ املأ النموذج وسيتم الرد عليك في أقل من ساعة من ممثلي خدمة الطالب.',
    contactName: 'الاسم الكامل',
    contactEmail: 'البريد الإلكتروني',
    contactMessage: 'نص الرسالة',
    contactSubmit: 'إرسال الرسالة',
    contactSuccessTitle: 'تم إرسال رسالتك بنجاح!',
    contactSuccessMsg: 'شكراً لتواصلك مع منصة سند، سنتواصل معك على بريدك الإلكتروني في أقرب وقت ممكن.',
    
    footerDesc: 'المنصة التعليمية الشاملة للثانوي والمسارات في مصر والوطن العربي. نسعى لتمكين العقول الشابة من النجاح والتفوق المستدام.',
    footerQuickLinks: 'روابط سريعة وسهلة',
    footerLegal: 'سياسات وقوانين الاستعمال',
    footerCopy: 'جميع الحقوق محفوظة لمنصة سند التعليمية',
    terms: 'الشروط والأحكام ومجالس السلوك',
    privacy: 'سياسة الخصوصية وحماية بيانات الطلاب',
    
    filterByCountry: 'تصنيف المناهج بحسب الدولة:',
    egCurriculum: 'المنهج المصري',
    saCurriculum: 'المنهج السعودي',
    loginTitle: 'تسجيل الدخول إلى حسابك',
    signupTitle: 'إنشاء حساب طالب جديد',
    countryModalTitle: 'مرحباً بك في منصة سند',
    chooseCountryPrompt: 'يرجى اختيار المنهج الدراسي الذي تود تصفحه لتخصيص تجربتك التعليمية بالكامل:'
  },
  en: {
    navHome: 'Home',
    navCourses: 'Courses',
    navTeachers: 'Tutors',
    navAbout: 'About Us',
    navContact: 'Contact Us',
    navLogin: 'Login',
    navRegister: 'Sign Up',
    
    heroTitle: 'Your Ultimate Pillar for Academic Success',
    heroSubtitle: 'An integrated educational platform hosting top-performing teachers and interactive contents curated to assist high school students across Egypt & Saudi Arabia.',
    heroCTAStart: 'Get Started Now',
    heroCTACourses: 'Discover Courses',
    
    coursesTitle: 'Premier Curriculums & Featured Bundles',
    coursesSubtitle: 'Select your subject, match with a verified master teacher, and commence your journey towards academic success.',
    coursesFilterAll: 'All Subjects',
    coursesFilterMath: 'Mathematics',
    coursesFilterPhysics: 'Physics',
    coursesFilterChemistry: 'Chemistry',
    coursesFilterBiology: 'Biology',
    coursesFilterLanguages: 'Languages',
    countrySelectAll: 'All Countries & Tracks',
    countrySelectEG: 'Egypt Curriculum 🇪🇬',
    countrySelectSA: 'Saudi Curriculum 🇸🇦',
    lessonsCount: 'Lectures',
    priceFree: 'Free Trial',
    courseDetailsBtn: 'Show Details',
    
    teachersTitle: 'Sanad Certified Elite Instructors',
    teachersSubtitle: 'Highly respected academic experts equipped with virtual laboratory teaching instruments at your service.',
    teacherCourses: 'Courses',
    teacherStudents: 'Students',
    
    featuresTitle: 'Why Choose "Sanad" Academy?',
    featuresSubtitle: 'We deliver the ideal academic atmosphere and modern tools to guarantee scoring higher under continuous coaching.',
    
    reviewsTitle: 'Real Stories of Success from Sanad Graduates',
    reviewsSubtitle: 'Thousands of high school graduates relied on our classes to enroll in top medical and engineering colleges. Read their paths.',
    
    faqTitle: 'Frequently Asked Questions & Support Desk',
    faqSubtitle: 'Find instant detailed solutions about subscriptions, school tracks, and interactive digital voucher approvals.',
    
    contactTitle: 'Let Us Be Your Support (Sanad) Today',
    contactSubtitle: 'Got queries, recommendations, or complaints? Reach out and our coordinators will call you back within the hour.',
    contactName: 'Full Name',
    contactEmail: 'Email Address',
    contactMessage: 'Message Body',
    contactSubmit: 'Send Message Now',
    contactSuccessTitle: 'Message Transmitted Successfully!',
    contactSuccessMsg: 'Thank you for reaching out to Sanad! An advisor will write to you via email very shortly.',
    
    footerDesc: 'The ultimate fully integrated educational workspace for secondary curricula and tracks in the Middle East. Elevating dreams, one student at a time.',
    footerQuickLinks: 'Dynamic Navigation',
    footerLegal: 'Legal Framework',
    footerCopy: 'All rights reserved © Sanad Educational Platform',
    terms: 'Terms of Use & Student Code of Conduct',
    privacy: 'Privacy Policy & Student Data Security',
    
    filterByCountry: 'Filter curriculum by country:',
    egCurriculum: 'Egypt Curriculums',
    saCurriculum: 'Saudi Curriculums',
    loginTitle: 'Access Your Student Account',
    signupTitle: 'Register a New Student Account',
    countryModalTitle: 'Welcome to Sanad Platform',
    chooseCountryPrompt: 'Please choose your primary high school curriculum to personalize your study catalog:'
  }
};
