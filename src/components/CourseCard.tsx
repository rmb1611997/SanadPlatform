import React from 'react';
import { Course } from '../types';

export interface CourseCardProps {
  course: Course;
  isAr: boolean;
  role: 'student' | 'teacher' | 'admin';
  isSubscribed?: boolean;
  onActionClick?: (course: Course) => void;
  onSubscribeClick?: (course: Course) => void;
  // If the component is standalone, we shouldn't rely on 'setActiveTab' from TeacherOverviewPage directly in the card.
  // We'll expose 'onActionClick' to handle the button click.
}

export const getCourseImageSrc = (course: Course) => {
  if (course.courseImage && (course.courseImage.startsWith('http') || course.courseImage.startsWith('data:image') || course.courseImage.includes('/'))) {
    return course.courseImage;
  }
  const categoryImages: Record<string, string> = {
    physics: 'https://images.unsplash.com/photo-1636466483774-87cf7270e20a?auto=format&fit=crop&w=600&q=80',
    math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    chemistry: 'https://images.unsplash.com/photo-1603126859738-12ab56461c31?auto=format&fit=crop&w=600&q=80',
    biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80',
    languages: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    default: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80'
  };
  return categoryImages[course.category] || categoryImages.default;
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, isAr, role, isSubscribed = false, onActionClick, onSubscribeClick }) => {
  const getActionText = () => {
    if (role === 'teacher') return isAr ? 'عرض الكورس' : 'View Course';
    if (role === 'admin') return isAr ? 'إدارة كاملة' : 'Administer';
    return isAr ? 'عرض الكورس' : 'View Course';
  };

  return (
    <div
      className="
        group relative flex flex-col overflow-hidden
        rounded-[32px]
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        hover:border-indigo-300 dark:hover:border-indigo-500/50
        shadow-lg hover:shadow-[0_24px_48px_-15px_rgba(99,102,241,0.4)]
        hover:-translate-y-3
        transition-all duration-500 ease-out
      "
    >
      {/* SHIMMER HIGHLIGHT */}
      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-[32px]">
        <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] skew-x-[-20deg] ease-in-out" />
      </div>

      {/* IMAGE SECTION */}
      <div className="relative h-[380px] overflow-hidden rounded-t-[32px]">

        <img
          src={getCourseImageSrc(course)}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="
            w-full h-full object-cover
            transition-all duration-700
            group-hover:scale-110
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      </div>

      {/* BODY */}
      <div className="p-6">

        {/* SUBJECT & COUNTRY BUBBLES */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="
            px-3 py-1 rounded-lg
            bg-indigo-100 dark:bg-indigo-900/40
            text-indigo-700 dark:text-indigo-300
            text-xs font-black tracking-wide
          ">
            {course.category === 'physics'
              ? (isAr ? 'فيزياء' : 'Physics')
              : course.category === 'math'
              ? (isAr ? 'رياضيات' : 'Mathematics')
              : course.category === 'chemistry'
              ? (isAr ? 'كيمياء' : 'Chemistry')
              : course.category === 'biology'
              ? (isAr ? 'أحياء' : 'Biology')
              : (isAr ? 'لغات' : 'Languages')}
          </span>

          <span className="
            px-3 py-1 rounded-lg
            bg-amber-100 dark:bg-amber-900/30
            text-amber-700 dark:text-amber-400
            text-xs font-black tracking-wide
          ">
            {course.country === 'EG'
              ? (isAr ? 'مصر' : 'Egypt')
              : course.country === 'SA'
              ? (isAr ? 'السعودية' : 'Saudi Arabia')
              : (isAr ? 'مشترك' : 'International')}
          </span>
        </div>

        {/* TITLE */}
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="
            text-xl font-black text-center
            text-neutral-900 dark:text-white
            group-hover:text-indigo-600
            transition-colors duration-300
          ">
            {course.title}
          </h3>
          
          {role === 'student' && isSubscribed && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in fade-in zoom-in duration-500">
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                {isAr ? '✅ مشترك في الكورس' : '✅ Enrolled in Course'}
              </span>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="
          mt-2 text-sm text-center
          text-neutral-500 dark:text-neutral-400
          leading-relaxed line-clamp-2
        ">
          {course.description || (isAr
            ? 'كورس شامل يساعدك على فهم المنهج خطوة بخطوة بطريقة بسيطة وواضحة'
            : 'Complete course designed to help you learn step by step in a simple and clear way')}
        </p>

        {/* TEACHER & LEVEL */}
        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <h4 className="
            text-2xl font-black
            text-black dark:text-white
            group-hover:text-blue-900 dark:group-hover:text-blue-400
            transition-colors duration-300
          ">
            {course.teacher}
          </h4>
          <p className="mt-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {course.level}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-black text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-850 px-3 py-1.5 rounded-full w-max mx-auto border border-neutral-100 dark:border-neutral-750">
            <span className="flex items-center gap-1">📅 {isAr ? 'إنشاء:' : 'Created:'} {course.createdAt || '2026-01-01'}</span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">🔄 {isAr ? 'آخر تحديث:' : 'Updated:'} {course.updatedAt || '2026-06-11'}</span>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">

        <div className="flex items-center justify-between">

          {/* PRICE OR OWNERSHIP STATUS */}
          <div className="flex flex-col">
            {role === 'student' && isSubscribed ? (
              <div className="flex flex-col gap-1 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                  <span>✅ {isAr ? 'تم الاشتراك بنجاح' : 'Successfully Enrolled'}</span>
                </div>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">
                  {isAr ? 'المحتوى متاح بالكامل' : 'Full Access Active'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 relative z-10">
                {course.discountPrice ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-neutral-400/80 dark:text-neutral-500 line-through decoration-rose-500 decoration-[3px]">
                        {course.price}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shadow-sm animate-pulse">
                        {isAr ? 'خصم خاص 🔥' : 'Save 🔥'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-default w-max">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                        {course.discountPrice}
                      </span>
                      <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">
                        {course.country === 'EG' ? (isAr ? 'جنية' : 'EGP') : course.country === 'SA' ? (isAr ? 'ريال' : 'SAR') : course.currency}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-baseline gap-1.5 mt-1 px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-default w-max">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                      {course.price}
                    </span>
                    <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">
                      {course.country === 'EG' ? (isAr ? 'جنية' : 'EGP') : course.country === 'SA' ? (isAr ? 'ريال' : 'SAR') : course.currency}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BUTTONS WITH STRUCTURAL ALIGNMENT */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => onActionClick && onActionClick(course)}
              className="
                px-4 py-2 rounded-xl text-sm
                bg-gradient-to-r from-indigo-600 to-blue-500
                text-white font-black
                shadow-lg
                hover:scale-105
                transition-all duration-300
                w-full text-center cursor-pointer border-0
              "
            >
              {role === 'teacher' ? '📖' : role === 'admin' ? '🛡️' : (isSubscribed ? '📖' : '🎓')} {getActionText()}
            </button>

            {role === 'student' && !isSubscribed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSubscribeClick && onSubscribeClick(course);
                }}
                className="
                  px-4 py-2 rounded-xl text-xs
                  bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600
                  text-white font-black
                  shadow-md hover:shadow-lg
                  hover:scale-105
                  transition-all duration-300
                  w-full text-center cursor-pointer border-0
                "
              >
                💳 {isAr ? 'الاشتراك الآن' : 'Subscribe Now'}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
