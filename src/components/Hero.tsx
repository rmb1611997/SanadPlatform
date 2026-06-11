import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, Award, ShieldCheck, GraduationCap } from 'lucide-react';
import { translations } from '../data';

const heroImg = "/images/herologo.png";

interface HeroProps {
  lang: 'ar' | 'en';
  onGetStarted: () => void;
  onBrowseCourses: () => void;
  isLoggedIn?: boolean;
}

export default function Hero({
  lang,
  onGetStarted,
  onBrowseCourses,
  isLoggedIn = false
}: HeroProps) {
  const t = translations[lang];

  return (
    <section 
      id="home"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-indigo-950/20 dark:via-neutral-900 dark:to-transparent"
    >
      {/* Dynamic Ambient Blur Spheres */}
      <div className="absolute top-1/4 -start-24 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/5" />
      <div className="absolute top-1/3 -end-24 -z-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content area */}
          <div className="lg:col-span-7 text-center lg:text-start space-y-6">
            {/* Promotion Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300 text-xs font-black"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-indigo-600 dark:text-indigo-400" />
              <span>
                {lang === 'ar' ? 'السند الأول لكافة الطلاب' : 'First Trust for High School & Pathways Students'}
              </span>
            </motion.div>

            {/* Giant Title */}
           <motion.h1
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="font-black text-neutral-900 dark:text-white leading-tight"
>
  {lang === 'ar' ? (
    <>
      {/* كلمة "منصة" ثابتة */}
      <span className="text-4xl sm:text-5xl lg:text-6xl">
        منصة{" "}
      </span>

      {/* كلمة "سند" (قابلة للتحكم) */}
      <span className="
        text-5xl sm:text-7xl lg:text-8xl
        bg-gradient-to-r from-indigo-600 to-blue-500
        bg-clip-text text-transparent
        dark:from-indigo-400 dark:to-blue-350
      ">
        سند
      </span>

      <br />

      {/* الجملة */}
     <span className="text-x2 sm:text-3xl lg:text-4xl font-bold text-neutral-700 dark:text-neutral-300">
  سندك الحقيقي نحو التفوق والنجاح
</span>
    </>
  ) : (
    <>
      {/* كلمة Platform ثابتة */}
      <span className="text-4xl sm:text-5xl lg:text-6xl">
        Platform{" "}
      </span>

      {/* كلمة SANAD (قابلة للتحكم) */}
      <span className="
        text-5xl sm:text-7xl lg:text-8xl
        bg-gradient-to-r from-indigo-600 to-blue-500
        bg-clip-text text-transparent
        dark:from-indigo-400 dark:to-blue-350
      ">
        SANAD
      </span>

      <br />

      {/* Subtitle */}
      <span className="text-x2 sm:text-3xl lg:text-4xl font-medium text-neutral-700 dark:text-neutral-300">
        Your Ultimate Pillar for Success
      </span>
    </>
  )}
</motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-350 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Buttons Row with micro-interaction */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              {!isLoggedIn && (
                <button
                  onClick={onGetStarted}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/15 hover:bg-indigo-700 active:scale-95 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <span>{t.heroCTAStart}</span>
                  <ArrowRight className={`h-4 w-4 transform group-hover:translate-x-1 transition duration-300 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </button>
              )}

              <button
                onClick={onBrowseCourses}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-7 py-3.5 text-sm font-extrabold text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 active:scale-95 transition dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-350 dark:hover:bg-neutral-800 dark:hover:text-indigo-400 shadow-sm"
              >
                <Play className="h-4 w-4 fill-current opacity-80" />
                <span>{t.heroCTACourses}</span>
              </button>
            </motion.div>

            {/* Quick Metrics Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center lg:justify-start items-center gap-6 pt-6 text-xs text-neutral-500 dark:text-neutral-400 font-bold"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{lang === 'ar' ? 'محتوى معتمد ومحدث' : '100% Ministry Aligned'}</span>
              </div>
              <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{lang === 'ar' ? 'كادر تعليمي نخبوي' : 'Elite Certified Faculty'}</span>
              </div>
            </motion.div>

          </div>
          {/* Right graphics area */}
          <div className="lg:col-span-5 relative flex justify-center mt-12 lg:mt-0 lg:-translate-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative z-10 group"
            >
    {/* Animated Glow Background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-blue-500/20 to-cyan-400/20 rounded-3xl blur-3xl animate-pulse" />

    {/* Floating Glow Ring */}
    <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse" />

    {/* Image */}
    <img
      src={heroImg}
      alt="Educational Sanad Landscape"
      referrerPolicy="no-referrer"
      className="
        relative z-10
        w-[400px] max-w-full
        rounded-2xl
        object-cover
        transition-all duration-700
        group-hover:scale-105
        group-hover:rotate-[1deg]
        drop-shadow-2xl
        dark:brightness-0 dark:invert
      "
    />
  </motion.div>
</div>

        </div>
      </div>
    </section>
  );
}
