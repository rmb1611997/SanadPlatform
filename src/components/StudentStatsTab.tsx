import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Sparkles, 
  CheckCircle2, 
  Scroll, 
  Wallet, 
  PlayCircle, 
  ClipboardCheck, 
  Activity,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentStatsTabProps {
  user: any;
  lang: 'ar' | 'en';
  walletBalance: number;
  purchasedCourseIds: string[];
}

export default function StudentStatsTab({ user, lang, walletBalance, purchasedCourseIds }: StudentStatsTabProps) {
  const isAr = lang === 'ar';

  // Mock data for visualizations
  const courseStatusData = [
    { name: isAr ? 'مكتملة' : 'Completed', value: 2, color: '#10b981' },
    { name: isAr ? 'قيد الدراسة' : 'In Progress', value: 3, color: '#6366f1' },
    { name: isAr ? 'لم تبدأ' : 'Not Started', value: purchasedCourseIds.length - 5 > 0 ? purchasedCourseIds.length - 5 : 1, color: '#f59e0b' }
  ];

  const contentProgressData = [
    { name: isAr ? 'فيديو' : 'Videos', completed: 45, remaining: 25 },
    { name: isAr ? 'واجبات' : 'Assignments', completed: 12, remaining: 4 },
    { name: isAr ? 'امتحانات' : 'Quizzes', completed: 3, remaining: 2 }
  ];

  const activityData = [
    { day: '1', usage: 20 }, { day: '2', usage: 45 }, { day: '3', usage: 10 }, { day: '4', usage: 80 }, { day: '5', usage: 35 },
    { day: '6', usage: 60 }, { day: '7', usage: 20 }, { day: '8', usage: 90 }, { day: '9', usage: 50 }, { day: '10', usage: 10 },
    { day: '11', usage: 40 }, { day: '12', usage: 70 }, { day: '13', usage: 30 }, { day: '14', usage: 10 }, { day: '15', usage: 60 },
    { day: '16', usage: 85 }, { day: '17', usage: 25 }, { day: '18', usage: 45 }, { day: '19', usage: 95 }, { day: '20', usage: 55 },
    { day: '21', usage: 20 }, { day: '22', usage: 10 }, { day: '23', usage: 75 }, { day: '24', usage: 40 }, { day: '25', usage: 65 },
    { day: '26', usage: 35 }, { day: '27', usage: 80 }, { day: '28', usage: 45 }, { day: '29', usage: 10 }, { day: '30', usage: 90 }
  ];

  const overallCompletion = 68; // Percentage

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🚀 QUICK SUMMARY BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: isAr ? 'الكورسات المشترك بها' : 'Enrolled Courses', 
            value: purchasedCourseIds.length, 
            icon: Sparkles, 
            color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' 
          },
          { 
            label: isAr ? 'الكورسات المكتملة' : 'Completed Courses', 
            value: 2, 
            icon: CheckCircle2, 
            color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
          },
          { 
            label: isAr ? 'الشهادات المحققة' : 'Certificates Earned', 
            value: 1, 
            icon: Award, 
            color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' 
          },
          { 
            label: isAr ? 'رصيد المحفظة' : 'Wallet Balance', 
            value: walletBalance, 
            icon: Wallet, 
            color: 'bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' 
          }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex items-center gap-4`}
          >
            <span className={`p-3 rounded-2xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </span>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📊 MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Progress Circle */}
        <div className="lg:col-span-1 p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col items-center justify-center space-y-6">
          <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-widest">
            {isAr ? 'التقدم الإجمالي' : 'Overall Progress'}
          </h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-neutral-100 dark:text-neutral-750"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - overallCompletion / 100)}
                className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-neutral-800 dark:text-white">{overallCompletion}%</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                {isAr ? 'معدل الإنجاز' : 'Total Achievement'}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium px-4">
            {isAr 
              ? 'مستوى رائع! لقد أكملت أكثر من نصف المهام التعليمية لهذا الشهر. استمر في هذا التقدم للوصول للقمة.' 
              : 'Great job! You have completed over half of the learning tasks this month. Keep going to reach the top.'}
          </p>
        </div>

        {/* Course Status Donut Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-widest">
              {isAr ? 'حالة الكورسات' : 'Course Status'}
            </h3>
            <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
              {isAr ? 'تحديث لحظي' : 'Real-time sync'}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {courseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              {courseStatusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-black text-neutral-600 dark:text-neutral-300">{item.name}</span>
                  </div>
                  <span className="text-base font-black text-neutral-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 📽️ CONTENT & ASSIGNMENTS PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Content Consumption Comparison */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-indigo-500" />
              <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-widest">
                {isAr ? 'مشاهدة المحتوى' : 'Content Progress'}
              </h3>
            </div>
          </div>
          
          <div className="space-y-8">
            {contentProgressData.map((item, i) => {
              const total = item.completed + item.remaining;
              const percent = (item.completed / total) * 100;
              return (
                <div key={i} className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-neutral-700 dark:text-neutral-300">{item.name}</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-600">{item.completed}</span>
                      <span className="text-[10px] text-neutral-400 font-bold mx-1">/</span>
                      <span className="text-xs font-bold text-neutral-400">{total}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden flex shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exams and Tasks simple chart */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-widest">
                {isAr ? 'الواجبات والاختبارات' : 'Assignments & Tests'}
              </h3>
            </div>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentProgressData.slice(1)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 900, fill: '#6B7280' }}
                  width={80}
                  orientation={isAr ? 'right' : 'left'}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="completed" 
                  name={isAr ? 'مكتمل' : 'Completed'} 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24} 
                />
                <Bar 
                  dataKey="remaining" 
                  name={isAr ? 'متبقي' : 'Remaining'} 
                  fill="#E5E7EB" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 📈 STUDY ACTIVITY (LAST 30 DAYS) */}
      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-widest">
              {isAr ? 'النشاط الدراسي (آخر 30 يوم)' : 'Study Activity (Last 30 Days)'}
            </h3>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase">{isAr ? 'نشاط مرتفع' : 'High Activity'}</span>
            </div>
          </div>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 900 }}
              />
              <Area 
                type="monotone" 
                dataKey="usage" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsage)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 flex justify-between items-center text-[10px] font-black text-neutral-400 dark:text-neutral-500 tracking-tighter uppercase px-2">
          <span>{isAr ? 'منذ 30 يوم' : '30 Days Ago'}</span>
          <span>{isAr ? 'اليوم' : 'Today'}</span>
        </div>
      </div>

    </div>
  );
}
