import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { FAQItem } from '../types';
import { translations } from '../data';

interface FAQProps {
  faqItems: FAQItem[];
  lang: 'ar' | 'en';
}

export default function FAQ({ faqItems, lang }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>('q1'); // Toggle open state, default to first question open
  const [activeFAQCategory, setActiveFAQCategory] = useState<string>('all');

  const t = translations[lang];

  // Optional categorization filter
  const faqCategories = [
    { key: 'all', label: lang === 'ar' ? 'الكل' : 'All Topics' },
    { key: 'general', label: lang === 'ar' ? 'عام' : 'General' },
    { key: 'curriculum', label: lang === 'ar' ? 'المناهج والدول' : 'Syllabus & Countries' },
    { key: 'payment', label: lang === 'ar' ? 'الدفع والتفعيل' : 'Payments & Invoicing' },
    { key: 'community', label: lang === 'ar' ? 'حلول الأسئلة' : 'Community Ask' }
  ];

  const filteredFAQ = faqItems.filter((item) => {
    return activeFAQCategory === 'all' || item.category === activeFAQCategory;
  });

  return (
    <section 
      id="faq"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-20 bg-white dark:bg-neutral-900 overflow-hidden border-t border-b border-neutral-100 dark:border-neutral-805"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'الإجابات الفورية لـ استفساراتك' : 'Sanad Help & Answers Hub'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {t.faqTitle}
          </h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-medium">
            {t.faqSubtitle}
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {faqCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveFAQCategory(c.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFAQCategory === c.key
                  ? 'bg-indigo-55/15 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-400 font-black'
                  : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Accordeon List */}
        <div className="space-y-4">
          {filteredFAQ.map((item) => {
            const isOpen = openId === item.id;
            
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 dark:bg-neutral-900/40 dark:border-neutral-800 transition-all duration-300"
              >
                {/* Header Clickable Button */}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-start font-bold text-neutral-850 hover:text-indigo-600 dark:text-neutral-150 dark:hover:text-indigo-450 transition"
                >
                  <span className="text-sm md:text-base font-black truncate me-4">
                    {item.question}
                  </span>
                  
                  <div className={`p-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-750 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400 border-indigo-500/10' : 'text-neutral-400'}`}>
                    <ChevronDown className="h-4.5 w-4.5" />
                  </div>
                </button>

                {/* Collapsible Content Block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 text-xs sm:text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed font-semibold">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
