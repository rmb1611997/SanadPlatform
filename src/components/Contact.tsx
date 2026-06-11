import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Send, User, MessageCircle, MapPin, Phone, HelpCircle } from 'lucide-react';
import { translations } from '../data';

interface ContactProps {
  lang: 'ar' | 'en';
}

export default function Contact({ lang }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const t = translations[lang];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(lang === 'ar' ? 'من فضلك أكتب اسمك بالكامل' : 'Please fill your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(lang === 'ar' ? 'من فضلك أكتب بريد إلكتروني صالح ومكتمل' : 'Please input a complete email address');
      return;
    }

    if (message.length < 10) {
      setErrorMessage(lang === 'ar' ? 'من فضلك أكتب رسالة من ١٠ أحرف على الأقل لشرح غايتك' : 'Please detail your message with at least 10 letters');
      return;
    }

    setIsSubmitting(true);
    // Simulate real communication
    setTimeout(() => {
      setIsSubmitting(false);
      setDone(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <section 
      id="contact"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="py-20 bg-neutral-50/50 dark:bg-neutral-900/60 relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid for layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          
          {/* Column 1: Contact texts and address coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-350 text-xs font-bold">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'الدعم وقنوات الإرشاد فوريّة' : 'Customer Support & Inquiries'}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {t.contactTitle}
            </h2>
            <p className="text-sm md:text-base text-neutral-550 dark:text-neutral-400 font-medium leading-relaxed">
              {t.contactSubtitle}
            </p>

            {/* Direct Coordinates card details */}
            <div className="space-y-4 pt-4 text-xs sm:text-sm font-bold">
              {/* Egypt Office Coordinate info */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-neutral-850 flex items-center justify-center text-indigo-600 border border-neutral-100 dark:border-neutral-750">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {lang === 'ar' ? 'مقر القاهرة - جمهورية مصر العربية' : 'Egypt Office - Cairo'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {lang === 'ar' ? 'ش البطل أحمد عبد العزيز، المهندسين، الجيزة' : 'El Batal Ahmed Abdelaziz St., Mohandessin, Giza'}
                  </p>
                </div>
              </div>

              {/* Saudi Office info */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-neutral-850 flex items-center justify-center text-indigo-600 border border-neutral-100 dark:border-neutral-750">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {lang === 'ar' ? 'مكتب الرياض - المملكة العربية السعودية' : 'Saudi Office - Riyadh'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {lang === 'ar' ? 'طريق الملك فهد، العليا، شمال برج المملكة' : 'King Fahd Rd, Al Olaya, Riyadh'}
                  </p>
                </div>
              </div>

              {/* Direct Phones Info */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-neutral-855 flex items-center justify-center text-indigo-600 border border-neutral-100 dark:border-neutral-750">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {lang === 'ar' ? 'الخط الساخن الموحد للطالب' : 'Consolidated Hotline Support'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5" dir="ltr">
                    +20 100 2235 600 / +966 500 120 440
                  </p>
                </div>
              </div>

              {/* Direct Mail info */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-neutral-855 flex items-center justify-center text-indigo-600 border border-neutral-100 dark:border-neutral-750">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {lang === 'ar' ? 'بريد شؤون المدارس والطلاب' : 'General Inquiries Email'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    support@sanad-edu.com
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Column 2: Interactive Contact Form card */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-750 shadow-xl shadow-neutral-150/40 dark:shadow-none relative overflow-hidden">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.4 }}
                      className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/40"
                    >
                      <CheckCircle className="h-12 w-12" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-neutral-850 dark:text-neutral-100">
                      {t.contactSuccessTitle}
                    </h3>
                    <p className="text-sm text-neutral-510 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed font-semibold">
                      {t.contactSuccessMsg}
                    </p>
                    <button
                      type="button"
                      onClick={() => setDone(false)}
                      className="mt-6 py-2 px-5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg hover:underline"
                    >
                      {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Transmit another query'}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    
                    {errorMessage && (
                      <div className="p-3 bg-rose-50 text-xs text-rose-600 rounded-xl dark:bg-rose-950/30 dark:text-rose-450 font-bold">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{t.contactName}</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={lang === 'ar' ? 'أكتب اسمك هنا' : 'e.g. Abdullah'}
                          className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 outline-none focus:border-indigo-500 text-neutral-800 dark:text-neutral-100 transition duration-200"
                        />
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{t.contactEmail}</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 outline-none focus:border-indigo-500 text-neutral-800 dark:text-neutral-100 transition duration-200"
                        />
                      </div>
                    </div>

                    {/* Message input */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{t.contactMessage}</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={lang === 'ar' ? 'أكتب نص رسالتك أو استفسارك بوضوح...' : 'Detail your request or stage notes...'}
                        rows={5}
                        className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700 outline-none focus:border-indigo-500 text-neutral-800 dark:text-neutral-100 transition duration-200 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-[0.99] disabled:opacity-40 select-none transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 dark:shadow-none"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>
                          <Send className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          <span>{t.contactSubmit}</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
