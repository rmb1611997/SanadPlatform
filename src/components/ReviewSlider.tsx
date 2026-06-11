import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewSliderProps {
  reviews: Review[];
  lang: 'ar' | 'en';
}

export default function ReviewSlider({ reviews, lang }: ReviewSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Autoplay functionality
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      slideNext();
    }, 6000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [activeIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      y: 20,
      opacity: 0,
      scale: 0.95,
      rotateX: 10
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: 'spring',
        stiffness: 110,
        damping: 18,
        mass: 0.8
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 150 : -150,
      y: -20,
      opacity: 0,
      scale: 0.95,
      rotateX: -10,
      transition: { duration: 0.4 }
    })
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-neutral-900/30 rounded-[40px] border border-neutral-200/50 dark:border-neutral-800 backdrop-blur-sm shadow-sm space-y-4 max-w-2xl mx-auto">
        <div className="bg-neutral-100/60 dark:bg-neutral-800/60 h-16 w-16 rounded-full flex items-center justify-center text-2xl shadow-inner">📝</div>
        <p className="text-neutral-500 dark:text-neutral-400 font-extrabold text-sm md:text-base">
          {lang === 'ar' ? 'لا توجود تقييمات مضافة حالياً' : 'No testimonials added yet'}
        </p>
      </div>
    );
  }

  const currentReview = reviews[activeIndex];

  return (
    <div 
      className="relative mx-auto mt-8 max-w-4xl px-4"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <div className="relative min-h-[350px] md:min-h-[280px] perspective-[1200px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full"
          >
            <div className="h-full rounded-[40px] bg-white dark:bg-neutral-850 p-8 md:p-12 border border-neutral-150/80 dark:border-neutral-800 shadow-2xl overflow-hidden group">
              {/* Decorative Abstract Shapes */}
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-[40px]">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-200/40 to-blue-200/10 dark:from-indigo-600/10 dark:to-blue-600/5 rounded-full blur-2xl transition-transform duration-1000 group-hover:scale-150" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-cyan-200/30 to-teal-200/10 dark:from-cyan-600/10 dark:to-teal-600/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
              </div>
              
              <div className="absolute top-6 md:top-10 left-6 md:left-10 text-indigo-100 dark:text-neutral-800/80 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
                <Quote className={`h-24 w-24 md:h-32 md:w-32 transform ${lang === 'ar' ? '' : 'scale-x-[-1]'}`} />
              </div>

              <div className={`relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 h-full ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Visual Avatar Structure */}
                <div className="relative shrink-0 mt-2">
                  <div className="h-28 w-28 md:h-36 md:w-36 rounded-[32px] bg-gradient-to-tr from-indigo-500 to-cyan-500 p-1 shadow-xl shadow-indigo-500/20 transform -rotate-3 transition duration-500 group-hover:rotate-0 group-hover:scale-105">
                    <div className="w-full h-full rounded-[28px] overflow-hidden bg-white dark:bg-neutral-900 border-2 border-white/50 dark:border-neutral-800 flex items-center justify-center text-6xl">
                       {currentReview.avatar}
                    </div>
                  </div>
                  <div className={`absolute -bottom-3 ${lang === 'ar' ? '-left-3' : '-right-3'} bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-extrabold text-[10px] px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transform rotate-3`}>
                    {currentReview.country === 'EG' ? '🇪🇬 مصر' : '🇸🇦 السعودية'}
                  </div>
                </div>

                {/* Review Content */}
                <div className={`flex flex-col h-full justify-center flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {/* Rating Stars */}
                  <div className={`flex items-center gap-1 mb-4 ${lang === 'ar' ? 'justify-end md:justify-start flex-row-reverse' : 'justify-start'}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                        key={i}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            i < Math.floor(currentReview.rating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                              : 'text-neutral-200 dark:text-neutral-700'
                          }`}
                        />
                      </motion.div>
                    ))}
                    <span className="text-xs font-black text-amber-500 dark:text-amber-400 mx-2">
                      {currentReview.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-neutral-800 dark:text-neutral-200 text-lg md:text-xl font-medium leading-relaxed mb-6 italic">
                    {lang === 'ar' ? '« ' : '"'}
                    {currentReview.comment}
                    {lang === 'ar' ? ' »' : '"'}
                  </p>

                  <div className="mt-auto">
                    <h4 className="text-lg font-black text-indigo-700 dark:text-indigo-400">
                      {currentReview.name}
                    </h4>
                    <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase mt-1">
                      {currentReview.level}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controllers */}
      <div className={`mt-10 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Navigation Dots */}
        <div className="flex gap-2.5">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-3 rounded-full transition-all duration-500 ${
                index === activeIndex 
                  ? 'w-10 bg-indigo-600 dark:bg-indigo-500 shadow-md shadow-indigo-600/30' 
                  : 'w-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            onClick={slidePrev}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 active:scale-95"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className={`h-6 w-6 text-neutral-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={slideNext}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 active:scale-95"
            aria-label="Next Testimonial"
          >
            <ChevronRight className={`h-6 w-6 text-neutral-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
