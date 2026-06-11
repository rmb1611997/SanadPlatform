import { motion } from 'motion/react';
import { Sparkles, Clock, Tv, FileQuestion, ClipboardList, Headphones, TrendingUp } from 'lucide-react';
import { Feature } from '../types';
import { translations } from '../data';

interface FeaturesProps {
  features: Feature[];
  lang: 'ar' | 'en';
}

// Convert string name to React component reference
const iconMap: Record<string, any> = {
  Clock: Clock,
  Tv: Tv,
  FileQuestion: FileQuestion,
  ClipboardList: ClipboardList,
  Headphones: Headphones,
  TrendingUp: TrendingUp
};

export default function Features({ features, lang }: FeaturesProps) {
  const t = translations[lang];

  return (
    <section 
      id="about"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-20 bg-neutral-50/50 dark:bg-neutral-900/60 relative overflow-hidden"
    >
      {/* Decorative accent light circles */}
      <div className="absolute top-1/2 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'الأدوات التعليمية الأحدث بين يديك' : 'The Ultimate Digital Academy'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {t.featuresTitle}
          </h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-medium">
            {t.featuresSubtitle}
          </p>
        </div>

        {/* Bento Grid style or clean 3-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = iconMap[feature.iconName] || Tv;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-750 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300"
              >
                {/* Decorative hover gradient border on card top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-400 opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Animated Icon holder */}
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-450 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300 shadow-sm">
                  <IconComponent className="h-5.5 w-5.5" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-base font-black text-neutral-850 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed font-bold">
                  {feature.description}
                </p>

                {/* Micro-sparkle decor */}
                <div className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-15 text-neutral-400 transition duration-300">
                  <Sparkles className="h-5 w-5" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
