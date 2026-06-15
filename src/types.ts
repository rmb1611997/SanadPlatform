export interface Course {
  id: string;
  title: string;
  teacher: string;
  teacherTitle: string;
  teacherAvatar: string;
  lessons: number;
  duration: string;
  price: number;
  discountPrice?: number;
  currency: string;
  rating: number;
  category: 'math' | 'physics' | 'chemistry' | 'languages' | 'biology';
  country: 'EG' | 'SA' | 'both';
  level: string; // e.g. "ثانوي عمومی" or "Grade 12"
  courseImage?: string;
  isVisible?: boolean; // True for Visible, False/undefined for Hidden
  description?: string; // Course description
  createdAt?: string; // Course creation date
  updatedAt?: string; // Last updated date
}

export interface CourseModuleItem {
  id: string;
  type: 'video' | 'file' | 'homework' | 'quiz';
  titleAr: string;
  titleEn: string;
  duration?: string; // for videos
  fileSize?: string; // for PDFs
  isFree?: boolean; // for free preview videos
  videoUrl?: string;
  videoSource?: 'youtube' | 'bunny' | string;
  questions?: { qAr: string; qEn: string; optionsAr: string[]; optionsEn: string[]; correct: number; explanationAr?: string; explanationEn?: string; }[];
}

export interface CourseModule {
  id: string;
  titleAr: string;
  titleEn: string;
  items: CourseModuleItem[];
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  coursesCount: number;
  rating: number;
  avatar: string;
  studentsCount: number;
  subject?: string;
  subjects?: string[];
  grades?: string[];
  curriculumAr?: string;
  curriculumEn?: string;
  country?: 'EG' | 'SA' | 'both';
  supportPhones?: string[];
  nationality?: string;
  curriculum?: string;
  cardImage?: string;
  pageImage?: string;
  socialLinks?: {
    facebook?: { url: string; isVisible: boolean };
    youtube?: { url: string; isVisible: boolean };
    tiktok?: { url: string; isVisible: boolean };
    whatsapp?: { url: string; isVisible: boolean };
    telegram?: { url: string; isVisible: boolean };
  };
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Review {
  id: string;
  name: string;
  level: string;
  avatar: string;
  rating: number;
  comment: string;
  country: 'EG' | 'SA';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LanguageStrings {
  navHome: string;
  navCourses: string;
  navTeachers: string;
  navAbout: string;
  navContact: string;
  navLogin: string;
  navRegister: string;
  
  heroTitle: string;
  heroSubtitle: string;
  heroCTAStart: string;
  heroCTACourses: string;
  
  coursesTitle: string;
  coursesSubtitle: string;
  coursesFilterAll: string;
  coursesFilterMath: string;
  coursesFilterPhysics: string;
  coursesFilterChemistry: string;
  coursesFilterBiology: string;
  coursesFilterLanguages: string;
  countrySelectAll: string;
  countrySelectEG: string;
  countrySelectSA: string;
  lessonsCount: string;
  priceFree: string;
  courseDetailsBtn: string;
  
  teachersTitle: string;
  teachersSubtitle: string;
  teacherCourses: string;
  teacherStudents: string;
  
  featuresTitle: string;
  featuresSubtitle: string;
  
  reviewsTitle: string;
  reviewsSubtitle: string;
  
  faqTitle: string;
  faqSubtitle: string;
  
  contactTitle: string;
  contactSubtitle: string;
  contactName: string;
  contactEmail: string;
  contactMessage: string;
  contactSubmit: string;
  contactSuccessTitle: string;
  contactSuccessMsg: string;
  
  footerDesc: string;
  footerQuickLinks: string;
  footerLegal: string;
  footerCopy: string;
  terms: string;
  privacy: string;
  
  // New features
  filterByCountry: string;
  egCurriculum: string;
  saCurriculum: string;
  loginTitle: string;
  signupTitle: string;
  countryModalTitle: string;
  chooseCountryPrompt: string;
}
