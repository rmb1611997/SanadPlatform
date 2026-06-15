import React, { useState } from 'react';
import { BookOpen, Plus, Layers, Play, CheckCircle } from 'lucide-react';
import { Course } from '../types';

import { CourseCard } from './CourseCard';

interface TeacherOverviewPageProps {
  user: { name: string; country?: 'EG' | 'SA' };
  lang: 'ar' | 'en';
  teacherMeta: { name: string; title: string; bio: string; specialty: string; rating: number; avatar: string };
  allCourses: Course[];
  teacherCourses: Course[];
  setActiveTab: (tab: any) => void;
  onPreviewCourse: (courseId: string) => void;
}

export default function TeacherOverviewPage({
  user,
  lang,
  teacherMeta,
  allCourses,
  teacherCourses,
  setActiveTab,
  onPreviewCourse
}: TeacherOverviewPageProps) {
  const isAr = lang === 'ar';
  const visibleCourses = teacherCourses;

  return (
    <div className="space-y-8 text-right">
      
      {/* Quick Shortcuts / Quick Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('courses')}
          className="p-5 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-750 border border-indigo-100 dark:border-neutral-700/60 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 active:scale-95 group cursor-pointer shadow-xs select-none"
        >
          <span className="p-3 bg-indigo-650 text-white rounded-2xl group-hover:scale-110 transition-transform duration-200">
            <Plus className="h-5 w-5" />
          </span>
          <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
            {isAr ? 'إضافة كورس جديد' : 'Add Course'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className="p-5 bg-emerald-50 hover:bg-emerald-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-750 border border-emerald-100 dark:border-neutral-700/60 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 active:scale-95 group cursor-pointer shadow-xs select-none"
        >
          <span className="p-3 bg-emerald-600 text-white rounded-2xl group-hover:scale-110 transition-transform duration-200">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
            {isAr ? 'إضافة مجموعة' : 'Add Group'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className="p-5 bg-blue-50 hover:bg-blue-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-750 border border-blue-100 dark:border-neutral-700/60 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 active:scale-95 group cursor-pointer shadow-xs select-none"
        >
          <span className="p-3 bg-blue-600 text-white rounded-2xl group-hover:scale-110 transition-transform duration-200">
            <Play className="h-5 w-5" />
          </span>
          <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
            {isAr ? 'إضافة فيديو' : 'Add Video'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('handouts')}
          className="p-5 bg-purple-50 hover:bg-purple-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-750 border border-purple-100 dark:border-neutral-700/60 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 active:scale-95 group cursor-pointer shadow-xs select-none"
        >
          <span className="p-3 bg-purple-600 text-white rounded-2xl group-hover:scale-110 transition-transform duration-200">
            <CheckCircle className="h-5 w-5" />
          </span>
          <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
            {isAr ? 'إضافة ملف' : 'Add File'}
          </span>
        </button>
      </div>

      {/* Courses Overview List (Full Width Grid) */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isAr={isAr} 
              role="teacher" 
              onActionClick={() => onPreviewCourse(course.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
