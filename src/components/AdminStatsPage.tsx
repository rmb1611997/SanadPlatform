import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, Users, BookOpen, Trash2, Sliders, TrendingUp,
  PieChart, Award, Globe, FileText, Landmark, Hourglass, 
  CheckCircle, ShieldAlert, XCircle, Calendar, ArrowUpRight, Coins
} from 'lucide-react';
import { Course } from '../types';
import { UserProfile } from '../utils/db';

interface AdminStatsPageProps {
  lang: 'ar' | 'en';
  users: UserProfile[];
  courses: Course[];
  adminWithdrawals: any[];
  setAdminWithdrawals: React.Dispatch<React.SetStateAction<any[]>>;
  teacherRates: Record<string, number>;
  setTeacherRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  courseRates: Record<string, number>;
  setCourseRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  handleApproveWithdrawal: (id: string) => void;
  handleRejectWithdrawal: (id: string) => void;
  handleUpdateTeacherRate: (tName: string, rate: number) => void;
  handleUpdateCourseRate: (cId: string, rate: number) => void;
  uniqueTNameList: string[];
}

const countryMap: Record<string, { ar: string; en: string; flag: string; currencyAr: string; currencyEn: string }> = {
  EG: { ar: 'مصر', en: 'Egypt', flag: '🇪🇬', currencyAr: 'ج.م', currencyEn: 'EGP' },
  SA: { ar: 'السعودية', en: 'Saudi Arabia', flag: '🇸🇦', currencyAr: 'ر.س', currencyEn: 'SAR' },
  KW: { ar: 'الكويت', en: 'Kuwait', flag: '🇰🇼', currencyAr: 'د.ك', currencyEn: 'KWD' },
  AE: { ar: 'الإمارات', en: 'UAE', flag: '🇦🇪', currencyAr: 'د.إ', currencyEn: 'AED' },
  QA: { ar: 'قطر', en: 'Qatar', flag: '🇶🇦', currencyAr: 'ر.ق', currencyEn: 'QAR' },
  OM: { ar: 'عُمان', en: 'Oman', flag: '🇴🇲', currencyAr: 'ر.ع', currencyEn: 'OMR' },
  BH: { ar: 'البحرين', en: 'Bahrain', flag: '🇧🇭', currencyAr: 'د.ب', currencyEn: 'BHD' },
  JO: { ar: 'الأردن', en: 'Jordan', flag: '🇯🇴', currencyAr: 'د.أ', currencyEn: 'JOD' },
  IQ: { ar: 'العراق', en: 'Iraq', flag: '🇮🇶', currencyAr: 'د.ع', currencyEn: 'IQD' },
  YE: { ar: 'اليمن', en: 'Yemen', flag: '🇾🇪', currencyAr: 'ر.ي', currencyEn: 'YER' },
  LY: { ar: 'ليبيا', en: 'Libya', flag: '🇱🇾', currencyAr: 'د.ل', currencyEn: 'LYD' },
  SD: { ar: 'السودان', en: 'Sudan', flag: '🇸🇩', currencyAr: 'ج.س', currencyEn: 'SDG' },
  MA: { ar: 'المغرب', en: 'Morocco', flag: '🇲🇦', currencyAr: 'د.م', currencyEn: 'MAD' },
  DZ: { ar: 'الجزائر', en: 'Algeria', flag: '🇩🇿', currencyAr: 'د.ج', currencyEn: 'DZD' },
  TN: { ar: 'تونس', en: 'Tunisia', flag: '🇹🇳', currencyAr: 'د.ت', currencyEn: 'TND' }
};

const getCountryInfo = (code: string) => {
  const upper = code ? code.toUpperCase() : 'EG';
  if (countryMap[upper]) return countryMap[upper];
  return { ar: upper, en: upper, flag: '🌐', currencyAr: '', currencyEn: '' };
};

export default function AdminStatsPage({
  lang,
  users,
  courses,
  adminWithdrawals,
  setAdminWithdrawals,
  teacherRates,
  setTeacherRates,
  courseRates,
  setCourseRates,
  handleApproveWithdrawal,
  handleRejectWithdrawal,
  handleUpdateTeacherRate,
  handleUpdateCourseRate,
  uniqueTNameList
}: AdminStatsPageProps) {
  const isAr = lang === 'ar';

  const [finPeriod, setFinPeriod] = useState<string>('all');
  const [finTeacher, setFinTeacher] = useState<string>('all');
  const [finCourse, setFinCourse] = useState<string>('all');
  const [finCountry, setFinCountry] = useState<string>('EG');
  const [finSubject, setFinSubject] = useState<string>('all');
  const [finCustomStart, setFinCustomStart] = useState<string>('');
  const [finCustomEnd, setFinCustomEnd] = useState<string>('');

  const finTab: string = 'overview';

  const allCoursesList = courses || [];
  const studentsOnly = users.filter(u => u.role === 'student');
  const allTeachersList = users.filter(usr => usr.role === 'teacher');

  // Load and merge live subscription records from student profiles with historical ones
  const salesData = (() => {
    const key = 'sanad_sales_v4';
    let historicalSales: any[] = [];
    const stored = localStorage.getItem(key);
    if (stored) {
      try { historicalSales = JSON.parse(stored); } catch (e) {}
    } else {
      // Seed detailed historical sales distributed over the last 12 months
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
        
        const date = new Date();
        if (i === 0) {
          // Today
        } else if (i < 5) {
          date.setDate(now.getDate() - (i % 6));
        } else if (i < 15) {
          date.setDate(now.getDate() - (i % 28) - 1);
        } else {
          date.setMonth(now.getMonth() - (i % 11) - 1);
          date.setDate(1 + (i % 27));
        }

        let subject = 'الفيزياء';
        if ((crs as any).subject) {
          subject = (crs as any).subject;
        } else if (crs.category === 'physics' || crs.title.includes('فيزياء') || crs.title.includes('Physics')) {
          subject = 'الفيزياء';
        } else if (crs.category === 'chemistry' || crs.title.includes('كيمياء') || crs.title.includes('Chemistry')) {
          subject = 'الكيمياء';
        } else if (crs.category === 'biology' || crs.title.includes('أحياء') || crs.title.includes('Biology')) {
          subject = 'علم الأحياء';
        } else if (crs.category === 'math' || crs.title.includes('رياضيات') || crs.title.includes('Math')) {
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
          grade: (crs as any).level || (crs as any).grade || 'الصف الثالث الثانوي',
          price: basePrice || 200,
          timestamp: date.toISOString()
        });
      }
      localStorage.setItem(key, JSON.stringify(initialSales));
      historicalSales = initialSales;
    }

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

              let subject = (matchedCourse as any).subject || (matchedCourse.category === 'physics' ? 'الفيزياء' : (matchedCourse.category === 'chemistry' ? 'الكيمياء' : (matchedCourse.category === 'biology' ? 'علم الأحياء' : (matchedCourse.category === 'math' ? 'الرياضيات' : 'اللغة العربية'))));
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
                grade: matchedCourse.level || student.grade || 'الصف الثالث الثانوي',
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

  const totalRegisteredStudentsCount = studentsOnly.length;
  const totalSubscribedStudentsCount = useMemo(() => {
    const registeredSubscribed = studentsOnly.filter(s => {
      const stored = localStorage.getItem(`sanad_purchased_${s.name}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return true;
        } catch (e) {}
      }
      return false;
    });

    const studentPhonesInSales = new Set([
      ...registeredSubscribed.map(s => s.phone),
      ...salesData.map(s => s.studentPhone)
    ]);
    return studentPhonesInSales.size;
  }, [studentsOnly, salesData]);

  // Filter Sales based on period/dropdown selections
  const filteredSales = salesData.filter(sale => {
    if (finTeacher !== 'all' && sale.teacherName !== finTeacher) return false;
    if (finCourse !== 'all' && sale.courseId !== finCourse) return false;
    if (finCountry !== 'all' && sale.studentCountry !== finCountry) return false;
    if (finSubject !== 'all' && sale.subject !== finSubject) return false;

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

  // Extract all active countries dynamically
  const activeCountries = useMemo(() => {
    const list = new Set<string>();
    list.add('EG');
    list.add('SA');
    salesData.forEach(sale => {
      if (sale.studentCountry) {
        list.add(sale.studentCountry.toUpperCase());
      }
    });
    users.forEach(usr => {
      if (usr.role === 'student' && usr.country) {
        list.add(usr.country.toUpperCase());
      }
    });
    return Array.from(list);
  }, [salesData, users]);

  const getCurrencySuffix = () => {
    if (finCountry === 'EG') return isAr ? 'جنيه مصري' : 'EGP';
    if (finCountry === 'SA') return isAr ? 'ريال سعودي' : 'SAR';
    if (finCountry !== 'all') {
      const countryInfo = getCountryInfo(finCountry);
      return isAr ? countryInfo.currencyAr || countryInfo.ar : countryInfo.currencyEn || countryInfo.en;
    }
    return isAr ? 'ج.م / ر.س' : 'Credits';
  };

  // KPI Calculations
  const totalTeachersCount = users.filter(u => u.role === 'teacher' && (finCountry === 'all' || u.country === finCountry)).length;
  const activeTeachersCount = users.filter(u => u.role === 'teacher' && u.status !== 'suspended' && (finCountry === 'all' || u.country === finCountry)).length;
  const suspendedTeachersCount = users.filter(u => u.role === 'teacher' && u.status === 'suspended' && (finCountry === 'all' || u.country === finCountry)).length;

  const baseSalesPool = finCountry === 'all' ? salesData : salesData.filter(s => s.studentCountry === finCountry);
  const totalRevenueOverall = baseSalesPool.reduce((acc, s) => acc + s.price, 0);

  const now = new Date();
  const startOfTodayVal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeekVal = new Date(); startOfWeekVal.setDate(now.getDate() - 7);
  const startOfMonthVal = new Date(); startOfMonthVal.setMonth(now.getMonth() - 1);
  const startOfYearVal = new Date(); startOfYearVal.setFullYear(now.getFullYear() - 1);

  const todayRevenueSum = baseSalesPool.filter(s => new Date(s.timestamp) >= startOfTodayVal).reduce((acc, s) => acc + s.price, 0);
  const weekRevenueSum = baseSalesPool.filter(s => new Date(s.timestamp) >= startOfWeekVal).reduce((acc, s) => acc + s.price, 0);
  const monthRevenueSum = baseSalesPool.filter(s => new Date(s.timestamp) >= startOfMonthVal).reduce((acc, s) => acc + s.price, 0);
  const yearRevenueSum = baseSalesPool.filter(s => new Date(s.timestamp) >= startOfYearVal).reduce((acc, s) => acc + s.price, 0);

  // Dynamic values based on CURRENT filtered sales
  const filteredRevenueSum = filteredSales.reduce((acc, s) => acc + s.price, 0);
  const filteredSubsCount = filteredSales.length;

  const filteredNewSubsCount = filteredSales.filter(s => {
    const diff = (now.getTime() - new Date(s.timestamp).getTime()) / (1000 * 3600 * 24);
    return diff <= 10;
  }).length;

  const filteredActiveSubsCount = filteredSales.filter(s => {
    const diff = (now.getTime() - new Date(s.timestamp).getTime()) / (1000 * 3600 * 24);
    return diff <= 45;
  }).length;

  const filteredEndedSubsCount = filteredSales.filter(s => {
    const diff = (now.getTime() - new Date(s.timestamp).getTime()) / (1000 * 3600 * 24);
    return diff > 45;
  }).length;

  // Outstanding Owed Amounts & Withdrawals
  const pendingWithdrawalsCount = adminWithdrawals.filter(w => w.status === 'pending').length;
  const pendingWithdrawalsSum = adminWithdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalWithdrawnSum = adminWithdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const totalOutstandingTeacherBalance = allTeachersList.reduce((sum, teacher) => {
    const key = `sanad_teacher_wallet_${teacher.name}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return sum + Number(stored);
    }
    const teacherSales = salesData.filter(s => s.teacherName === teacher.name);
    const earnings = teacherSales.reduce((currSum, sale) => {
      const rate = courseRates[sale.courseId] !== undefined 
        ? courseRates[sale.courseId] 
        : (teacherRates[teacher.name] !== undefined ? teacherRates[teacher.name] : 70);
      return currSum + (sale.price * rate) / 100;
    }, 0);
    const withdrawalsSum = adminWithdrawals
      .filter(w => (w.teacherName === teacher.name || w.teacher === teacher.name) && w.status === 'completed')
      .reduce((currSum, w) => currSum + Number(w.amount || 0), 0);
    return sum + Math.max(0, earnings - withdrawalsSum);
  }, 0);

  // Dynamic Revenue Shares inside filtered set
  const filteredTeachersShareSum = filteredSales.reduce((acc, sale) => {
    const rate = courseRates[sale.courseId] !== undefined 
      ? courseRates[sale.courseId] 
      : (teacherRates[sale.teacherName] !== undefined ? teacherRates[sale.teacherName] : 70);
    return acc + (sale.price * rate) / 100;
  }, 0);
  const filteredPlatformShareSum = filteredRevenueSum - filteredTeachersShareSum;

  const handleResetAllFilters = () => {
    setFinPeriod('all');
    setFinTeacher('all');
    setFinCourse('all');
    setFinCountry('all');
    setFinSubject('all');
    setFinCustomStart('');
    setFinCustomEnd('');
  };

  // Dimensions & Standings
  const egCount = filteredSales.filter(s => s.studentCountry === 'EG').length;
  const egGross = filteredSales.filter(s => s.studentCountry === 'EG').reduce((acc, s) => acc + s.price, 0);
  const saCount = filteredSales.filter(s => s.studentCountry === 'SA').length;
  const saGross = filteredSales.filter(s => s.studentCountry === 'SA').reduce((acc, s) => acc + s.price, 0);

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

  const teacherLeaderboard = (() => {
    const map: Record<string, { name: string; gross: number; tNet: number; pNet: number; sales: number; courses: Record<string, any> }> = {};
    
    allTeachersList.forEach(t => {
      map[t.name] = { name: t.name, gross: 0, tNet: 0, pNet: 0, sales: 0, courses: {} };
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

    return Object.values(map).sort((a, b) => b.gross - a.gross);
  })();

  const courseLeaderboard = (() => {
    const map: Record<string, { id: string; title: string; teacher: string; gross: number; salesCount: number; subject: string; grade: string }> = {};

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

      // 1. Chart: Revenue Cumulative Progression (Dynamic based on selected filters)
  const getActiveTimelinePoints = () => {
    if (filteredSales.length === 0) return [0, 0, 0, 0, 0];
    const sorted = [...filteredSales].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const minTime = new Date(sorted[0].timestamp).getTime();
    const maxTime = new Date(sorted[sorted.length - 1].timestamp).getTime();
    const range = maxTime - minTime;
    if (range === 0) {
      const sum = sorted.reduce((acc, s) => acc + s.price, 0);
      return [0, 0, 0, sum, sum];
    }

    const interval = range / 4;
    const buckets = [0, 0, 0, 0, 0];
    sorted.forEach(sale => {
      const saleTime = new Date(sale.timestamp).getTime();
      const bucketIdx = Math.min(4, Math.floor((saleTime - minTime) / (interval || 1)));
      buckets[bucketIdx] += sale.price;
    });
    
    const cumulativePoints: number[] = [];
    let cumulativeSum = 0;
    buckets.forEach(value => {
      cumulativeSum += value;
      cumulativePoints.push(cumulativeSum);
    });
    return cumulativePoints;
  };
  const activeTimelineData = getActiveTimelinePoints();
  const maxTimelineVal = Math.max(...activeTimelineData, 100);

  // 2. Chart: Teacher levels/ratings within platform
  const getTeacherPerformanceLevels = () => {
    let excellent = 0;
    let veryGood = 0;
    let good = 0;
    let needsImprovement = 0;

    allTeachersList.forEach(t => {
      const tSales = salesData.filter(s => s.teacherName === t.name);
      const gross = tSales.reduce((sum, s) => sum + s.price, 0);
      if (gross >= 10000) excellent++;
      else if (gross >= 4000) veryGood++;
      else if (gross >= 1000) good++;
      else needsImprovement++;
    });

    return { excellent, veryGood, good, needsImprovement };
  };
  const teacherLevels = getTeacherPerformanceLevels();
  const totalLevelsSum = (teacherLevels.excellent + teacherLevels.veryGood + teacherLevels.good + teacherLevels.needsImprovement) || 1;

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* HEADER COCKPIT */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5 text-right">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2 justify-start">
            <span className="p-1 px-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-base">📊</span>
            <span>{isAr ? 'صفحة الإحصائيات الشاملة ومراقبة الأداء' : 'Unified Platform BI & Statistics Dashboard'}</span>
          </h3>
          <p className="text-xs text-neutral-400 font-bold">
            {isAr 
              ? 'لوحة تحليلات ذكية موحدة لمراقبة المدرسين، الإيرادات الكلية والاشتراكات، مبيعات الدول والمواد مع التحديث اللحظي المصفى.' 
              : 'Interactive financial and operations control room with dynamic time-period filtering and analytics charts.'
            }
          </p>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200 dark:border-neutral-75 border-neutral-150 p-6 shadow-md space-y-4 text-right">
        
        {/* SPECTACULAR PRO-LEVEL QUICK-SELECTION COUNTRIES */}
        <div className="space-y-4 py-4 flex flex-col items-center justify-center text-center">
          <label className="text-sm font-black text-neutral-500 dark:text-neutral-400 flex items-center gap-2 justify-center">
            <Globe className="h-5 w-5 text-indigo-550 animate-pulse" />
            <span>{isAr ? 'اختر الدولة لعرض الإحصائيات الخاصة بها فورياً:' : 'Select a country to instantly view its statistics:'}</span>
          </label>
          
          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-4xl px-4">
            {/* Dynamic country list */}
            {activeCountries.map(code => {
              const info = getCountryInfo(code);
              const count = salesData.filter(s => s.studentCountry.toUpperCase() === code.toUpperCase()).length;
              const isSelected = finCountry.toUpperCase() === code.toUpperCase();
              
              return (
                <button
                  key={code}
                  onClick={() => setFinCountry(code)}
                  className={`px-10 py-5 rounded-3xl text-sm font-extrabold transition-all flex items-center gap-4 border-2 shadow-sm relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105 font-black'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-750 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  style={{ minWidth: '200px' }}
                >
                  <span className="text-3xl leading-none">{info.flag}</span>
                  <div className="flex flex-col text-right">
                    <span className="font-extrabold text-[15px]">{isAr ? info.ar : info.en}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-100' : 'text-neutral-450'}`}>
                      {count} {isAr ? 'عملية' : 'sales'}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>



      {/* TAB 1: OVERVIEW & INSIGHTS (ALL REQUIRED KPI METRICS & GRAPHICS) */}
      <div className="space-y-6 animate-fade-in" text-right="true">
          
          {/* GENERAL CUMULATIVE & ACTIVE FILTERED TOTALS CARDS GRID */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column (Financial and Chronological Cards) */}
            <div className="flex-1 space-y-6 w-full">
              
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-neutral-450 text-right pr-0.5">📊 {isAr ? 'مؤشرات الأداء المالي الحظي والسيولة' : 'Platform Financial Performance & Outstanding Wages'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: Cumulative overall platform revenue */}
                  <div className="bg-gradient-to-br from-indigo-650 to-indigo-850 p-5 rounded-3xl text-white space-y-2 relative overflow-hidden shadow-sm">
                    <div className="absolute top-2 left-2 text-2xl opacity-15">👑</div>
                    <p className="text-[9px] text-indigo-200 font-black uppercase tracking-tight">{isAr ? 'إجمالي إيرادات المنصة كلياً' : 'Total Revenue (Cumulative)'}</p>
                    <h3 className="text-xl font-black font-mono">
                      {totalRevenueOverall.toLocaleString('en-US')} <span className="text-xs text-indigo-200">{getCurrencySuffix()}</span>
                    </h3>
                    <div className="text-[8.5px] text-white/80 font-bold flex items-center gap-1 justify-start">
                      <span>● {isAr ? 'حسابات تاريخية ومباشرة مدمجة' : 'Historical and student sales merged'}</span>
                    </div>
                  </div>

                  {/* Card 2: Revenue within selected filter period */}
                  <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-2 relative overflow-hidden shadow-xs">
                    <div className="absolute top-3 left-3 text-2xl opacity-15 text-indigo-500">💰</div>
                    <p className="text-[9px] text-neutral-400 font-black uppercase tracking-tight">{isAr ? 'الإيرادات في الفترة المحددة بالفلتر' : 'Filtered Revenue (Selected Period)'}</p>
                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {filteredRevenueSum.toLocaleString('en-US')} <span className="text-xs text-neutral-450">{getCurrencySuffix()}</span>
                    </h3>
                    <p className="text-[8.5px] text-neutral-450 font-bold">
                      {isAr ? `مطابقة لعدد ${filteredSales.length} عملية شراء مصفاة` : `Matches ${filteredSales.length} filtered transactions`}
                    </p>
                  </div>

                  {/* Card 3: Total outstanding money owed to teachers */}
                  <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-2 relative overflow-hidden shadow-xs">
                    <div className="absolute top-3 left-3 text-2xl opacity-15 text-rose-500">🏦</div>
                    <p className="text-[9px] text-rose-500 font-black uppercase tracking-tight">{isAr ? 'مستحقات المدرسين المتبقية (المحافظ)' : 'Owed to Teachers (Outstanding)'}</p>
                    <h3 className="text-xl font-black text-rose-600 dark:text-rose-450 font-mono">
                      {totalOutstandingTeacherBalance.toLocaleString('en-US')} <span className="text-xs text-neutral-450">{getCurrencySuffix()}</span>
                    </h3>
                    <p className="text-[8.5px] text-neutral-450 font-bold">
                      {isAr ? 'المستحقات غير المسحوبة حالياً في محافظ المعلمين' : 'Sum of current balances in teachers wallets'}
                    </p>
                  </div>

                  {/* Card 4: Withdrawals KPI Summary */}
                  <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-2 relative overflow-hidden shadow-xs">
                    <div className="absolute top-3 left-3 text-2xl opacity-15 text-emerald-500">💸</div>
                    <p className="text-[9px] text-emerald-605 font-black uppercase tracking-tight">{isAr ? 'إجمالي الأموال المسحوبة المستقرة' : 'Total Paid Out (Withdrawn)'}</p>
                    <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {totalWithdrawnSum.toLocaleString('en-US')} <span className="text-xs text-neutral-450">{getCurrencySuffix()}</span>
                    </h3>
                    <div className="text-[8.5px] text-amber-600 dark:text-amber-400 font-black">
                      ⏱️ {isAr ? `${pendingWithdrawalsCount} طلبات سحب معلقة بقيمة ${pendingWithdrawalsSum} ${getCurrencySuffix()}` : `${pendingWithdrawalsCount} pending payouts worth ${pendingWithdrawalsSum} ${getCurrencySuffix()}`}
                    </div>
                  </div>

                </div>
              </div>

              {/* DATES REVENUE MATRIX CARD (Today, Week, Month, Year overall values) */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-neutral-450 pr-0.5">⏱️ {isAr ? 'تقرير ومكاسب الفترات الزمنية القياسية' : 'Standard Chronological Revenue Logs'}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  
                  <div className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-150 dark:border-neutral-750 text-right space-y-1">
                    <p className="text-[8.5px] text-neutral-400 font-black">{isAr ? 'إيرادات مبيعات اليوم' : 'Revenue of Today'}</p>
                    <h4 className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {todayRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-450">{getCurrencySuffix()}</span>
                    </h4>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-150 dark:border-neutral-750 text-right space-y-1">
                    <p className="text-[8.5px] text-neutral-400 font-black">{isAr ? 'إيرادات الأسبوع الحالي' : 'Revenue of This Week'}</p>
                    <h4 className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {weekRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-450">{getCurrencySuffix()}</span>
                    </h4>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-150 dark:border-neutral-750 text-right space-y-1">
                    <p className="text-[8.5px] text-neutral-400 font-black">{isAr ? 'إيرادات الشهر الحالي' : 'Revenue of This Month'}</p>
                    <h4 className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                      {monthRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-450">{getCurrencySuffix()}</span>
                    </h4>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-150 dark:border-neutral-750 text-right space-y-1">
                    <p className="text-[8.5px] text-neutral-400 font-black">{isAr ? 'إيرادات مبيعات السنة' : 'Revenue of This Year'}</p>
                    <h4 className="text-base font-black text-amber-600 dark:text-amber-450 font-mono">
                      {yearRevenueSum.toLocaleString('en-US')} <span className="text-[10px] text-neutral-450">{getCurrencySuffix()}</span>
                    </h4>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column (Student accounts and subscriptions) - "في الجنب" */}
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <h4 className="text-[11px] font-black text-neutral-450 text-right pr-0.5">👥 {isAr ? 'إحصائيات الطلاب والحسابات الكلية' : 'Student & Account Metrics'}</h4>
              
              {/* Card A: Subscribed students only */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-md group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-3 left-3 text-3xl opacity-20">🎓</div>
                <h5 className="text-[11px] text-emerald-100 font-bold uppercase tracking-wide">{isAr ? 'الطلاب المشتركين في كورسات فقط' : 'Active Subscribed Students'}</h5>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono">{totalSubscribedStudentsCount}</span>
                  <span className="text-xs text-emerald-100 font-bold">{isAr ? 'طالب مشترك' : 'subscribers'}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-300 rounded-full" style={{ width: `${totalRegisteredStudentsCount > 0 ? (totalSubscribedStudentsCount / totalRegisteredStudentsCount) * 100 : 0}%` }} />
                </div>
                <p className="text-[10px] text-emerald-50/90 font-medium">
                  {isAr ? 'الطلاب الذين قاموا بشراء مادة أو كورس واحد على الأقل' : 'Students who purchased at least one course'}
                </p>
              </div>

              {/* Card B: Registered accounts total */}
              <div className="bg-white dark:bg-neutral-850 border border-neutral-150 dark:border-neutral-750 p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-xs group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-3 left-3 text-3xl opacity-20 text-indigo-500">➕</div>
                <h5 className="text-[11px] text-neutral-400 font-bold uppercase tracking-wide">{isAr ? 'إجمالي الطلاب الذين سجلوا حسابات' : 'Total Registered Accounts'}</h5>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-neutral-900 dark:text-white font-mono">{totalRegisteredStudentsCount}</span>
                  <span className="text-xs text-neutral-400 font-bold">{isAr ? 'حساب نشط' : 'active accounts'}</span>
                </div>
                <p className="text-[10px] text-neutral-450 font-medium leading-relaxed">
                  {isAr ? 'إجمالي الحسابات التي تم إنشاؤها على المنصة سواء اشتركوا أم لا' : 'Total student profiles established on the platform'}
                </p>
              </div>
            </div>

          </div>

          {/* DUAL KPI: STAFF & SUBSCRIPTIONS BREAKDOWNS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Box 1: Teachers & Staff Status Indicators */}
            <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-750 text-right space-y-3.5">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                <Users className="h-4 w-4 text-indigo-650" />
                <span>{isAr ? 'مؤشرات وإحصائيات طاقم المدرسين' : 'Teacher Staff Directory Indicators'}</span>
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-neutral-450">{isAr ? 'إجمالي المدرسين' : 'Total Teachers'}</p>
                  <p className="text-lg font-black text-indigo-650 font-mono">{totalTeachersCount}</p>
                </div>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-emerald-600">{isAr ? 'المدرسين النشطين' : 'Active Teachers'}</p>
                  <p className="text-lg font-black text-emerald-600 font-mono">{activeTeachersCount}</p>
                </div>
                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-rose-505">{isAr ? 'المدرسين الموقوفين' : 'Suspended Staff'}</p>
                  <p className="text-lg font-black text-rose-500 font-mono">{suspendedTeachersCount}</p>
                </div>
              </div>
            </div>
            {/* Box 2: Subscriptions (New, Active, Ended) inside selected filtered set */}
            <div className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-750 text-right space-y-3.5">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span>{isAr ? 'تفتيت حالة اشتراكات الكورسات بالفترة النشطة' : 'Active Subscriptions Lifecycle Stats'}</span>
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100 rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-blue-500">{isAr ? 'اشتراكات جديدة' : 'New Subs (<=10d)'}</p>
                  <p className="text-lg font-black text-blue-500 font-mono">{filteredNewSubsCount}</p>
                </div>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-emerald-655">{isAr ? 'اشتراكات نشطة' : 'Active (<=45d)'}</p>
                  <p className="text-lg font-black text-emerald-655 font-mono">{filteredActiveSubsCount}</p>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border rounded-2xl text-center space-y-1">
                  <p className="text-[8.5px] font-black text-neutral-450">{isAr ? 'اشتراكات منتهية' : 'Ended (>45d)'}</p>
                  <p className="text-lg font-black text-neutral-500 font-mono">{filteredEndedSubsCount}</p>
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC METRIC INSIGHT CHARTS SECTION (THE REQUIRED GRAPHICAL ANALYTICS) */}
          <div className="space-y-6">
            
            {/* ROW 1: DYNAMIC TIMELINE GRAPH FOR SELECTED COUNTRY */}
            <div className="grid grid-cols-1 gap-6">
              
              <div id="dynamic-revenue-chart" className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 text-right space-y-4 shadow-xs">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                    <span className="text-lg">📈</span>
                    <span>{isAr ? 'المنحنى البياني التراكمي للإيرادات' : 'Cumulative Revenue Timeline'}</span>
                  </h4>
                  <span className="text-[9px] font-black text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                    {getCurrencySuffix()} ({filteredRevenueSum.toLocaleString('en-US')})
                  </span>
                </div>

                {/* Timeline SVG */}
                <div className="space-y-4 pt-2">
                  <div className="h-56 w-full relative border-b border-r border-neutral-100 dark:border-neutral-800/60 flex items-end">
                    
                    {/* SVG Grids */}
                    <div className="absolute inset-x-0 bottom-1/4 border-b border-dashed border-neutral-155 dark:border-neutral-800/30" />
                    <div className="absolute inset-x-0 bottom-2/4 border-b border-dashed border-neutral-155 dark:border-neutral-800/30" />
                    <div className="absolute inset-x-0 bottom-3/4 border-b border-dashed border-neutral-155 dark:border-neutral-800/30" />
                    
                    <svg className="absolute inset-0 w-full h-full" overflow="visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="area-grad-dynamic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {(() => {
                        const pointsStr = activeTimelineData.map((val, idx) => {
                          const x = (idx / 4) * 400;
                          const y = 110 - (val / (maxTimelineVal || 1)) * 90;
                          return `${x},${y}`;
                        }).join(' ');
                        
                        const rawPath = `M ${pointsStr}`;
                        const areaPath = `${rawPath} L 400,120 L 0,120 Z`;

                        return (
                          <>
                            <path d={areaPath} fill="url(#area-grad-dynamic)" />
                            <path d={rawPath} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                            
                            {/* Circles for nodes */}
                            {activeTimelineData.map((val, idx) => {
                              const cx = (idx / 4) * 400;
                              const cy = 110 - (val / (maxTimelineVal || 1)) * 90;
                              return (
                                <g key={idx}>
                                  <circle cx={cx} cy={cy} r="4.5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                                  <text x={cx} y={cy - 8} fontSize="8.5" fontWeight="black" fill="#4f46e5" textAnchor="middle" fontFamily="monospace">
                                    {Math.round(val)}
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="flex justify-between text-[8.5px] text-neutral-450 font-black px-1 font-mono">
                    <span>{isAr ? 'البداية' : 'Start'}</span>
                    <span>{isAr ? 'الحقبة ٢' : 'P2'}</span>
                    <span>{isAr ? 'الحقبة ٣' : 'P3'}</span>
                    <span>{isAr ? 'الحقبة ٤' : 'P4'}</span>
                    <span>{isAr ? 'اليوم' : 'Today'}</span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-bold flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-xl">
                    <span>⚡ {isAr ? `إجمالي المبيعات المصفاة:` : `Total Filtered Sales:`}</span>
                    <span className="font-extrabold font-mono text-neutral-850 dark:text-gray-200">{filteredSales.length} {isAr ? 'عملية شراء' : 'Subs'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: SPLITS & PERFORMANCE STANDINGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* REVENUE DISTRIBUTION ("توزيع وتقاسم حصص الإيرادات النشطة" / "نسب مستقطعة") */}
              <div id="revenue-split-section" className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 text-right space-y-4 shadow-xs">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                    <PieChart className="h-4 w-4 text-emerald-600" />
                    <span>{isAr ? 'توزيع وتقاسم حصص الإيرادات النشطة' : 'Active Revenue Share Splits'}</span>
                  </h4>
                  <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md uppercase">
                    {isAr ? 'نسب مستقطعة' : 'Commission/Cuts'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="text-center space-y-0.5 z-10">
                      <p className="text-[7.5px] text-neutral-400 font-bold uppercase">{isAr ? 'إجمالي الإيرادات بالفترة' : 'Filtered Revenue'}</p>
                      <p className="text-sm font-black text-neutral-900 dark:text-white leading-none font-mono">{filteredRevenueSum}</p>
                      <p className="text-[8px] text-indigo-650 dark:text-indigo-400 font-extrabold">{isAr ? 'وحدة مصفاة' : 'Credits'}</p>
                    </div>
                    
                    {/* Circular ring */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" fill="transparent" stroke="rgba(244,244,245,0.8)" strokeWidth="10" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="54" 
                        fill="transparent" 
                        stroke="#10b981" 
                        strokeWidth="10" 
                        strokeDasharray={339}
                        strokeDashoffset={339 * (1 - (filteredRevenueSum > 0 ? (filteredTeachersShareSum / filteredRevenueSum) : 0.7))}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2 w-full max-w-sm">
                    {/* Standard withheld percentages */}
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-between text-xs font-bold border border-neutral-100 dark:border-neutral-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block" />
                        <span>{isAr ? 'النسبة المستقطعة للمنصة' : 'Withheld Commission Cut (Platform)'}</span>
                      </span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">
                        {filteredRevenueSum > 0 ? Math.round((filteredPlatformShareSum / filteredRevenueSum) * 100) : 30}%
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl flex items-center justify-between text-xs font-bold border border-emerald-100/30">
                      <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                        <span>{isAr ? 'حصة المدرسين المستحقة' : 'Teachers Disbursed share'}</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                        {filteredRevenueSum > 0 ? Math.round((filteredTeachersShareSum / filteredRevenueSum) * 100) : 70}%
                      </span>
                    </div>

                    <p className="text-[9.5px] text-neutral-400 text-center leading-normal pt-1 font-semibold border-t border-dashed mt-2">
                      📊 {isAr ? 'ملاحظة: يتم استقطاع نسبة ٣٠٪ افتراضياً للمنصة، في حين يُصرف ٧٠٪ كصافي أرباح للمدرسين ما لم يُعدل يدوياً.' : 'Platform defaults to a 30% withheld commission; remaining 70% is seamlessly routed to the respective tutor wallets.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* TEACHER STANDINGS */}
              <div id="teacher-ratings-standings" className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 text-right space-y-4 shadow-xs">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                    <Award className="h-4 w-4 text-amber-505 animate-pulse" />
                    <span>{isAr ? 'توزيع مستويات تقييم المدرسين بالمنصة' : 'Faculty standing level distribution'}</span>
                  </h4>
                  <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                    {isAr ? 'الأداء العام' : 'Overall Index'}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Excellent */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-emerald-50 text-emerald-650 font-black text-[9px] rounded-lg flex items-center justify-center">🏆</span>
                        <span className="font-extrabold text-neutral-900 dark:text-white">{isAr ? 'ممتاز (مبيعات >= 10,000)' : 'Excellent (>=10k)'}</span>
                      </span>
                      <span className="font-mono text-emerald-600 font-black">
                        {teacherLevels.excellent} {isAr ? 'معلمين' : 'Staff'} ({Math.round((teacherLevels.excellent / totalLevelsSum) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div style={{ width: `${(teacherLevels.excellent / totalLevelsSum) * 100}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  {/* Very Good */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 font-black text-[9px] rounded-lg flex items-center justify-center">⭐</span>
                        <span className="font-extrabold text-neutral-900 dark:text-white">{isAr ? 'جيد جداً (مبيعات 4,000 - 10,000)' : 'Very Good (4k-10k)'}</span>
                      </span>
                      <span className="font-mono text-indigo-600 font-black">
                        {teacherLevels.veryGood} {isAr ? 'معلمين' : 'Staff'} ({Math.round((teacherLevels.veryGood / totalLevelsSum) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div style={{ width: `${(teacherLevels.veryGood / totalLevelsSum) * 100}%` }} className="h-full bg-indigo-550 rounded-full" />
                    </div>
                  </div>

                  {/* Good */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-amber-55/20 text-amber-505 font-black text-[9px] rounded-lg flex items-center justify-center">📈</span>
                        <span className="font-extrabold text-neutral-900 dark:text-white">{isAr ? 'جيد (مبيعات 1,000 - 4,000)' : 'Good (1k-4k)'}</span>
                      </span>
                      <span className="font-mono text-amber-505 font-black">
                        {teacherLevels.good} {isAr ? 'معلمين' : 'Staff'} ({Math.round((teacherLevels.good / totalLevelsSum) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div style={{ width: `${(teacherLevels.good / totalLevelsSum) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>

                  {/* Needs Improvement */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-rose-50 text-rose-550 font-black text-[9px] rounded-lg flex items-center justify-center">🔧</span>
                        <span className="font-extrabold text-neutral-900 dark:text-white">{isAr ? 'يحتاج تحسين (مبيعات < 1,000)' : 'Needs Improvement (<1k)'}</span>
                      </span>
                      <span className="font-mono text-rose-550 font-black">
                        {teacherLevels.needsImprovement} {isAr ? 'معلمين' : 'Staff'} ({Math.round((teacherLevels.needsImprovement / totalLevelsSum) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div style={{ width: `${(teacherLevels.needsImprovement / totalLevelsSum) * 100}%` }} className="h-full bg-rose-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      {/* TAB 2: DETAILED TEACHERS PROFITS LEDGER */}
      {finTab === 'teachers' && (
        <div className="space-y-6 animate-fade-in" text-right="true">
          
          <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-75 border-neutral-205 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-indigo-50 text-right space-y-0.5">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'أداء المعلمين وصافي الحصص والعمولات ومبيعات الكورسات بالتفصيل' : 'Tutors Sales Ledgers & Multi-Course Split Breaks'}</h4>
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'يعرض الجدول إجمالي مبيعات كل مدرس، حصته وصافي عمولته، وأرباح المنصة مع القدرة على تفتيت الكورسات فرداً فرداً.' : 'Breakdown showing tutor aggregate gross, exact payouts, platform commission cuts and dynamic item-by-item sales.'}</p>
            </div>

            <div className="overflow-x-auto text-right text-xs">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450">
                  <tr>
                    <th className="p-4 text-right">{isAr ? 'اسم المعلم وطاقم التدريس' : 'Tutor / Faculty'}</th>
                    <th className="p-4 text-center">{isAr ? 'المبيعات والاشتراكات' : 'Subs'}</th>
                    <th className="p-4 text-right">{isAr ? 'إجمالي الإيراد الإيجابي الخام' : 'Gross aggregate'}</th>
                    <th className="p-4 text-center">{isAr ? 'نسبة المدرس الافتراضية' : 'Default Split %'}</th>
                    <th className="p-4 text-left">{isAr ? 'صافي مستحقات المدرس' : 'Tutor Payout (Net)'}</th>
                    <th className="p-4 text-left">{isAr ? 'عمولة وصافي المنصة' : 'Platform Split'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                  {teacherLeaderboard.map(tStat => {
                    const currentRate = teacherRates[tStat.name] !== undefined ? teacherRates[tStat.name] : 70;
                    return (
                      <g key={tStat.name}>
                        <tr className="bg-neutral-50/20 hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl p-1 bg-indigo-50/60 rounded-xl">👨‍🏫</span>
                              <div>
                                <p className="font-extrabold text-neutral-900 dark:text-white leading-none">{tStat.name}</p>
                                <span className="text-[9px] text-neutral-400 font-bold mt-1 block">{isAr ? 'عضو تدريس ومدرس معتمد في سند' : 'Approved Sanad Educator'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center font-mono font-black">{tStat.sales} {isAr ? 'اشتراك' : 'Sold'}</td>
                          <td className="p-4 font-mono font-black text-neutral-900 dark:text-neutral-200">{tStat.gross.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}</td>
                          <td className="p-4 text-center">
                            <span className="p-1 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-black text-[10px]">
                              {currentRate}%
                            </span>
                          </td>
                          <td className="p-4 text-left font-mono font-black text-emerald-600 dark:text-emerald-400">
                            {tStat.tNet.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                          </td>
                          <td className="p-4 text-left font-mono font-black text-amber-600 dark:text-amber-450">
                            {tStat.pNet.toLocaleString('en-US')} {isAr ? 'ج.م_ريال' : 'Credits'}
                          </td>
                        </tr>

                        {/* Courses split block nested inside row */}
                        {Object.keys(tStat.courses).length > 0 && (
                          <tr>
                            <td colSpan={6} className="bg-neutral-50/10 dark:bg-neutral-800/3 pt-1 pb-4 px-8 text-right">
                              <div className="p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                                <p className="text-[10px] font-black text-neutral-450 border-b pb-1">
                                  📚 {isAr ? `كافة مبيعات الكورسات الفردية للمعلم (${tStat.name}):` : `Nested course performance breakdown for instructor:`}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px]">
                                  {Object.entries(tStat.courses).map(([cid, info]: any) => {
                                    const cRate = courseRates[cid] !== undefined ? courseRates[cid] : currentRate;
                                    const tCourseNet = (info.revenue * cRate) / 100;
                                    const pCourseNet = info.revenue - tCourseNet;
                                    return (
                                      <div key={cid} className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-150 shadow-xs">
                                        <div className="flex flex-col text-right truncate">
                                          <span className="font-extrabold max-w-[180px] truncate text-neutral-800 dark:text-neutral-200">📘 {info.title}</span>
                                          <span className="text-[8px] text-neutral-450 mt-0.5">{isAr ? `عمولته ومكسبه: ` : `Specific rate: `} <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{cRate}%</strong></span>
                                        </div>
                                        <span className="font-mono flex items-center gap-1 text-[9.5px]">
                                          <span>{isAr ? `إجمالي:` : `Gross:`} <strong className="font-black text-indigo-650">{info.revenue}</strong></span>
                                          <span className="text-neutral-250">|</span>
                                          <span className="text-emerald-600 font-extrabold">{isAr ? `المدرس:` : `Tutor:`} {tCourseNet}</span>
                                          <span className="text-neutral-250">|</span>
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
                      </g>
                    );
                  })}
                  {teacherLeaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400 italic font-bold">
                        {isAr ? 'لم تسجل أي إيرادات للمدرسين في النطاق المحدد.' : 'No teacher stats matched.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: COURSE PERFORMANCE COMPARISON */}
      {finTab === 'courses' && (
        <div className="space-y-6 animate-fade-in" text-right="true">
          
          <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-75 border-neutral-205 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-indigo-50 text-right space-y-0.5">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white">{isAr ? 'تقييم ومقارنة أداء الكورسات والمقررات مبيعاً' : 'Course Performance Matrix & Financial Ranks'}</h4>
              <p className="text-[10px] text-neutral-400 font-bold">{isAr ? 'جدول مقارنة شامل يعرض مستويات المبيعات وإيرادات الكورسات والاشتراكات لتقييم المحتوى وتحديد الكورسات الأكثر نجاحاً.' : 'Evaluate the performance score of each learning track by aggregate student subscriptions and revenue claims.'}</p>
            </div>

            <div className="overflow-x-auto text-right text-xs">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b font-black text-neutral-450">
                  <tr>
                    <th className="p-4 text-right">{isAr ? 'اسم المادة والمقرر الدراسي' : 'Course details'}</th>
                    <th className="p-4 text-right">{isAr ? 'مدرس المادة' : 'Educator'}</th>
                    <th className="p-4 text-right">{isAr ? 'الصف والصف المستهدف' : 'Grade / Division'}</th>
                    <th className="p-4 text-center">{isAr ? 'الاشتراكات المحققة' : 'Enrollments'}</th>
                    <th className="p-4 text-left">{isAr ? 'إجمالي قيمة المبيعات' : 'Gross value'}</th>
                    <th className="p-4 text-center">{isAr ? 'شارة تقييم الأداء والمبيعات' : 'Earning Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs">
                  {courseLeaderboard.map((cStat, idx) => {
                    const isTop = idx === 0;
                    const isHigh = idx > 0 && idx < 3;
                    const isRegular = idx >= 3 && idx < 6;
                    
                    return (
                      <tr key={cStat.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/10">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📘</span>
                            <div>
                              <p className="font-extrabold text-neutral-900 dark:text-white leading-none">{cStat.title}</p>
                              <span className="text-[9px] text-neutral-400 font-black mt-1 block">{isAr ? 'كورس مقيد في قاعدة البيانات' : 'Academic Course Module'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-indigo-650 dark:text-indigo-400 font-black">{cStat.teacher}</td>
                        <td className="p-4 text-neutral-500 font-extrabold">{cStat.grade}</td>
                        <td className="p-4 text-center font-mono font-black">{cStat.salesCount} {isAr ? 'مشترك' : 'Subs'}</td>
                        <td className="p-4 text-left font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {cStat.gross.toLocaleString('en-US')} {isAr ? 'ج.م' : 'Credits'}
                        </td>
                        <td className="p-4 text-center">
                          {isTop ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/25 text-amber-700 border border-amber-205 font-black text-[9px]">
                              👑 {isAr ? 'الأعلى مبيعاً بالمنصة' : 'Top Course'}
                            </span>
                          ) : isHigh ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 border border-emerald-205 font-black text-[9px]">
                              🚀 {isAr ? 'أداء باهر وممتاز' : 'Excellent Performer'}
                            </span>
                          ) : isRegular ? (
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 border border-indigo-205 font-black text-[9px]">
                              ⚡ {isAr ? 'أداء مستقر متوسط' : 'Stable Margin'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-550 font-black text-[9px]">
                              📈 {isAr ? 'كورس واعد في طور النمو' : 'Growing Demand'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {courseLeaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-neutral-400 font-bold italic">
                        {isAr ? 'لم يظهر أية مبيعات للكورسات الحالية بالتصفية النشطة.' : 'No course sales matches current filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: DIMENSIONS ANALYTICS & BREAKDOWNS (COUNTRY, SUBJECT, GRADE) */}
      {finTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in" text-right="true">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Box 1: Geographic Country Split */}
            <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-4">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start border-b pb-3">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span>{isAr ? 'مبيعات وإيرادات المنصة بحسب الدول' : 'Revenue Volumes by Country'}</span>
              </h4>

              <div className="space-y-4 pt-1">
                
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 space-y-2">
                  <div className="flex justify-between items-center font-black text-xs">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🇪🇬</span>
                      <span>{isAr ? 'جمهورية مصر العربية (مستقل)' : 'Egypt Curriculum'}</span>
                    </span>
                    <span className="text-neutral-450 font-mono">({egCount} {isAr ? 'اشتراك' : 'Sold'})</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-bold">{isAr ? 'إجمالي المبيعات' : 'Gross Value:'}</span>
                    <span className="font-mono font-black text-indigo-650 dark:text-indigo-400 text-sm">
                      {egGross.toLocaleString('en-US')} {isAr ? 'جنيه مصري' : 'EGP'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/20 dark:bg-neutral-900 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="flex justify-between items-center font-black text-xs">
                    <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                      <span className="text-lg">🇸🇦</span>
                      <span>{isAr ? 'المملكة العربية السعودية (مسار)' : 'Saudi Arabian Pathways'}</span>
                    </span>
                    <span className="text-emerald-600 font-mono font-extrabold">({saCount} {isAr ? 'اشتراك' : 'Sold'})</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-bold">{isAr ? 'إجمالي المبيعات' : 'Gross Value:'}</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {saGross.toLocaleString('en-US')} {isAr ? 'ريال سعودي' : 'SAR'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Box 2: Academic Subjects Sales Comparison */}
            <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-1.5 shadow-xs">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start border-b pb-3">
                <BookOpen className="h-4 w-4 text-emerald-650" />
                <span>{isAr ? 'مبيعات المنصة بحسب المادة الدراسية' : 'Financial Tracks by Academic Subject'}</span>
              </h4>

              <div className="space-y-3.5 pt-2">
                {subjectBreakdownList.map(sub => {
                  const percent = filteredRevenueSum > 0 ? (sub.gross / filteredRevenueSum) * 100 : 0;
                  return (
                    <div key={sub.name} className="space-y-1 text-xs text-right">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-black text-neutral-800 dark:text-neutral-200">
                          📚 {sub.name} <span className="text-[9px] text-neutral-450">({sub.count} {isAr ? 'عملية' : 'sold'})</span>
                        </span>
                        <span className="font-mono font-black text-indigo-650">
                          {sub.gross.toLocaleString('en-US')} {isAr ? 'ج.م' : 'Cr'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="h-full bg-emerald-500" />
                      </div>
                    </div>
                  );
                })}
                {subjectBreakdownList.length === 0 && (
                  <p className="text-center italic text-neutral-450 text-xs py-10">{isAr ? 'لا توجد بيانات مسجلة.' : 'No data records.'}</p>
                )}
              </div>
            </div>

            {/* Box 3: Grade Level Splits */}
            <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-750 space-y-1.5">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start border-b pb-3">
                <FileText className="h-4 w-4 text-orange-605" />
                <span>{isAr ? 'تفصيل الإيرادات بحسب الصف الدراسي' : 'Revenues by Student Grade Level'}</span>
              </h4>

              <div className="space-y-3.5 pt-2">
                {gradeBreakdownList.map(gr => {
                  const percent = filteredRevenueSum > 0 ? (gr.gross / filteredRevenueSum) * 100 : 0;
                  return (
                    <div key={gr.name} className="space-y-1 text-xs text-right">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-black text-neutral-800 dark:text-neutral-200">
                          🎓 {gr.name} <span className="text-[9px] text-neutral-450">({gr.count} {isAr ? 'مبيع' : 'sold'})</span>
                        </span>
                        <span className="font-mono font-black text-orange-650">
                          {gr.gross.toLocaleString('en-US')} {isAr ? 'ج.م' : 'Cr'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className="h-full bg-orange-500" />
                      </div>
                    </div>
                  );
                })}
                {gradeBreakdownList.length === 0 && (
                  <p className="text-center italic text-neutral-450 text-xs py-10">{isAr ? 'لا توجد بيانات.' : 'No data records.'}</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 5: SLIDERS & CUSTOM SHARE MATRIX CONTROLLER */}
      {finTab === 'sharing' && (
        <div className="space-y-6 animate-fade-in" text-right="true">
          
          <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-750 p-6 shadow-xs space-y-6 text-right">
            
            <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5 text-right">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                <Sliders className="h-5 w-5 text-indigo-600 animate-spin-slow" />
                <span>{isAr ? 'غرفة التحكم بنسب توزيع الأرباح والعمولات' : 'Faculty Share & Commission Ratios Matrix'}</span>
              </h4>
              <p className="text-[10px] text-neutral-400 font-bold">
                {isAr 
                  ? 'ضبط حصص الأرباح المئوية المخصصة لكل مدرس بالمنصة. النطاق المتبقي يتم توجيهه مباشرة لدعمCommission وصافي أرباح المنصة. التعديل يعيد حساب الإيرادات والمطالبات ماليًا بشكل لحظي.' 
                  : 'Configure how much of student subscriptions funds belongs directly to tutor. Cascaded balances stream automatically to platform net values.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              
              <div className="space-y-4">
                <h5 className="text-[11px] font-black text-neutral-500 border-b pb-2">👨‍🏫 {isAr ? 'العقد المالي العام للمعلمين ونفس نسبهم' : 'Tutors Commission Ratios Control'}</h5>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {uniqueTNameList.map(tName => {
                    const currentRate = teacherRates[tName] !== undefined ? teacherRates[tName] : 70;
                    return (
                      <div key={tName} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 rounded-2xl space-y-2 text-right">
                        <div className="flex items-center justify-between font-black text-xs">
                          <span>👨‍🏫 {tName}</span>
                          <span className="font-mono text-indigo-650">
                            {currentRate}% {isAr ? 'للمعلم' : 'Tutor'} / {100 - currentRate}% {isAr ? 'للمنصة' : 'Platform'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-neutral-400">0%</span>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={currentRate}
                            onChange={(e) => handleUpdateTeacherRate(tName, Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                          />
                          <span className="text-[9px] text-neutral-400">100%</span>
                        </div>
                      </div>
                    );
                  })}
                  {uniqueTNameList.length === 0 && (
                    <p className="text-center italic text-neutral-450 text-xs py-10">{isAr ? 'لا يوجد مدرسین مسجلین ماليًا حالياً.' : 'No teachers found in directory.'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-r border-neutral-100 dark:border-neutral-800 md:pr-6 text-right">
                <h5 className="text-[11px] font-black text-neutral-500 border-b pb-2">📘 {isAr ? 'تخصيص نسب الكورسات الفردية (تباين العقد)' : 'Individual Course-Specific Override Settings'}</h5>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {allCoursesList.map(course => {
                    const currentRate = courseRates[course.id] !== undefined 
                      ? courseRates[course.id] 
                      : (teacherRates[course.teacher] !== undefined ? teacherRates[course.teacher] : 70);
                    const isOverridden = courseRates[course.id] !== undefined;

                    return (
                      <div key={course.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 rounded-2xl space-y-3 relative overflow-hidden text-right">
                        {isOverridden && (
                          <div className="absolute top-0 left-0 bg-indigo-650 text-white text-[7.5px] px-2 py-0.5 font-bold rounded-br-lg">
                            {isAr ? 'نسبة مخصصة' : 'Override'}
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2 text-xs">
                          <div className="space-y-0.5 text-right">
                            <span className="font-extrabold text-neutral-855 dark:text-white block truncate max-w-[150px]">{course.title}</span>
                            <span className="text-[9px] text-neutral-400 block font-bold">👨‍🏫 {course.teacher}</span>
                          </div>
                          <span className="font-mono text-indigo-650 font-extrabold shrink-0">
                            {currentRate}% {isAr ? 'للمعلم' : 'Tutor'} / {100 - currentRate}% {isAr ? 'للمنصة' : 'Platform'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-neutral-400">0%</span>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={currentRate}
                            onChange={(e) => handleUpdateCourseRate(course.id, Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                          />
                          <span className="text-[9px] text-neutral-400">100%</span>
                        </div>

                        {isOverridden && (
                          <button
                            onClick={() => {
                              const updated = { ...courseRates };
                              delete updated[course.id];
                              setCourseRates(updated);
                              localStorage.setItem('sanad_course_rates', JSON.stringify(updated));
                            }}
                            className="text-[9px] text-rose-500 hover:text-rose-600 font-black cursor-pointer inline-block mt-1"
                          >
                            🔄 {isAr ? 'استرجاع العقد العام الافتراضي للمدرس' : 'Reset to default tutor rate'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 6: WITHDRAWALS CENTER */}
      {finTab === 'withdrawals' && (
        <div className="space-y-6 animate-fade-in font-bold text-xs" text-right="true">
          
          <div className="bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-750 p-6 shadow-xs space-y-4 text-right">
            <div className="border-b pb-4 border-neutral-100 dark:border-neutral-800 space-y-0.5 text-right">
              <h4 className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5 justify-start">
                <Landmark className="h-4 w-4 text-indigo-600" />
                <span>{isAr ? 'طلبات سحب مستحقات المدرسين المعتمدة' : 'Teacher Payout Clearance Queue'}</span>
              </h4>
              <p className="text-[10px] text-neutral-455 font-normal">
                {isAr 
                  ? 'راديو الطلبات المعلقة المقدمة من طاقم المدرسين. المرجو مراجعتها والموافقة عليها بعد اكتمال المدفوعات اليدوية عبر الوسائل المخصصة.' 
                  : 'Receive, review, and clear withdrawals requests from teachers. Balance changes are adjusted instantly in history.'
                }
              </p>
            </div>

            <div className="space-y-4">
              {adminWithdrawals.map((w: any) => {
                const statusColors = w.status === 'completed' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                  : w.status === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border-rose-150'
                    : 'bg-amber-50 text-amber-700 border-amber-150 animate-pulse';

                return (
                  <div key={w.id} className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2 flex-wrap justify-start">
                        <span className="font-extrabold text-neutral-900 dark:text-white text-sm">👨‍🏫 {w.teacher || w.teacherName}</span>
                        <span className="text-[9px] text-neutral-400 font-mono">ID: {w.id}</span>
                        <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${statusColors}`}>
                          {w.status === 'completed' ? (isAr ? 'مكتمل وتم التحويل ✓' : 'Settled ✓') : (w.status === 'rejected' ? (isAr ? 'مرفوض ومسترجع ✕' : 'Rejected ✕') : (isAr ? 'قيد المراجعة المعلقة ⏱️' : 'Pending Review ⏱️'))}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-505">
                        {isAr ? 'تاريخ طلب السحب: ' : 'Requested on: '} {new Date(w.timestamp || w.date).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </p>
                      <div className="text-[11px] bg-white dark:bg-neutral-850 p-2.5 rounded-xl border border-neutral-200 mt-2 text-right">
                        <span className="text-neutral-450 block text-[9px]">{isAr ? 'تفاصيل ومعلومات الدفع للمدرس:' : 'Teacher Account Details:'}</span>
                        <strong className="text-indigo-650 block mt-0.5">{w.methodInfo || w.details || '-'}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto text-right">
                      <span className="text-xs font-black text-neutral-900 dark:text-white">
                        {isAr ? 'مبلغ السحب المطلوب: ' : 'Requested sum: '} 
                        <strong className="text-indigo-650 font-black text-base">{w.amount}</strong> {isAr ? 'ج.م / ر.س' : 'credits'}
                      </span>

                      {w.status === 'pending' && (
                        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end mt-1">
                          <button
                            onClick={() => handleRejectWithdrawal(w.id)}
                            className="py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-600 font-black rounded-lg text-[10px] cursor-pointer"
                          >
                            ✕ {isAr ? 'رفض الطلب واسترداد الرصيد للمحفظة' : 'Reject & Refund'}
                          </button>
                          <button
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-705 text-white font-black rounded-lg text-[10px] cursor-pointer"
                          >
                            ✓ {isAr ? 'قبول وتأكيد التحويل ومقاصة الرصيد' : 'Approve & Settle'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {adminWithdrawals.length === 0 && (
                <div className="text-center py-12 text-neutral-450 italic bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-150">
                  🌊 {isAr ? 'لا توجد أي لقرارات سحب مالي معلقة لخط المدرسين حالياً.' : 'No active or historical payout requests recorded.'}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
