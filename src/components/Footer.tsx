import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, GraduationCap, Shield, HelpCircle, FileText, X } from 'lucide-react';
import { translations } from '../data';

interface FooterProps {
  lang: 'ar' | 'en';
}

export default function Footer({ lang }: FooterProps) {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const t = translations[lang];

  return (
    <footer 
      id="footer"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="bg-neutral-900 text-neutral-400 py-6 px-4 border-t border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-neutral-800 pb-6 mb-4">
          
          {/* Col 1: Brand description */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="/src/assets/images/logoshort.png" alt="Sanad" className="h-16 w-16 object-contain filter brightness-0 invert" referrerPolicy="no-referrer" />
              <span className="text-4xl font-black text-white tracking-tight">
                {lang === 'ar' ? 'سند' : 'Sanad'}
              </span>
            </div>
            <p className="text-sm text-neutral-400 font-bold leading-relaxed max-w-sm text-center md:text-start">
              {lang === 'ar' ? 'سندك الحقيقي نحو التفوق والنجاح' : 'Your true support towards excellence and success'}
            </p>
          </div>

          {/* Col 2: Legal Policy shortcuts */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              {t.footerLegal}
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              <li>
                <button
                  type="button"
                  onClick={() => setModalType('privacy')}
                  className="text-start hover:text-indigo-500 transition flex items-center gap-1.5"
                >
                  <Shield className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  <span>{t.privacy}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalType('terms')}
                  className="text-start hover:text-indigo-500 transition flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  <span>{t.terms}</span>
                </button>
              </li>
              <li>
                <div className="text-xs text-neutral-450 mt-1">
                  🌐 {lang === 'ar' ? 'الشبكة المدعومة: مصر - السعودية' : 'Supported Networks: Egypt - Saudi Arabia'}
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower footer: copy & scroll to top layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 pt-4 mt-4 border-t border-neutral-800/50">
          <p className="text-xs font-bold text-neutral-500 text-center leading-relaxed flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span>{t.footerCopy} © 2026. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
            <span className="hidden sm:inline-block text-neutral-700">|</span>
            <span className="text-[12px] text-neutral-600 font-medium tracking-wide border-t sm:border-t-0 border-neutral-800/50 pt-2 sm:pt-0 mt-1 sm:mt-0 uppercase">Ramy Barakat — Founder, Owner & Builder</span>
          </p>
        </div>

      </div>

      {/* Policy Modal Overlay Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalType(null)}
            className="fixed inset-0 bg-neutral-900/80 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-800 border border-neutral-150 dark:border-neutral-700 z-10 space-y-4">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            {modalType === 'privacy' ? (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <span>{t.privacy}</span>
                </h3>
                <div className="text-xs sm:text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed space-y-2 max-h-72 overflow-y-auto pr-1">
                  <p>
                    {lang === 'ar' 
                      ? 'شروط خصوصية وحماية بيانات الطلاب في "سند":'
                      : 'Sanad Student Data Integrity Rules:'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '١. تلتزم منصة سند التزاماً كليّاً بحفظ خصوصية بيانات التسجيل وعلامات الطلاب ولا تتم مشاركتها مع أي جهة تسويقية ثالثة برّاً وبحراً.'
                      : '1. Sanad is completely committed to the absolute secrecy of your high school report cards and scores.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '٢. يتم الاستعانة برقم هاتف ولي الأمر فقط لإرسال التنبيهات الدورية ونسب الغياب ونتائج الاختبارات الشهرية المنجزة لتفعيل الرقابة الأسرية.'
                      : '2. Parent phone numbers are strictly used to auto-transmit mock report performance analytics and score percentages.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '٣. تستخدم ملفات تعريف الارتباط الكوكيز لتبسيط تجربة تصفح الكورسات وتفعيل المود الليلي وتفضيل لغة العرض.'
                      : '3. Standard local storage variables are maintained solely to persist dark-mode selections and preferred language catalogs.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  <span>{t.terms}</span>
                </h3>
                <div className="text-xs sm:text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed space-y-2 max-h-72 overflow-y-auto pr-1">
                  <p>
                    {lang === 'ar' 
                      ? 'الشروط العامة ومجالس السلوك المتبعة لطلاب "سند":'
                      : 'Detailed Code of Conduct rules for Sanad Pupils:'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '١. يمنع منعاً باتاً مشاركة الحساب الواحد بين أكثر من طالب، وفي حال تلمس النظام دخولات متزامنة ومكررة من مواقع جغرافية مختلفة، يتم تعليق العضوية احترازياً.'
                      : '1. Sharing active credentials among classmates leads to instant structural account suspension to prevent cheating.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '٢. كافة المواد المرئية وحصص البث وتراجم الشرح مملوكة فكرياً وحصرياً لمنصة سند، ويمنع إعادة رفعها أو تداولها تجارياً خارج نطاق الخدمة.'
                      : '2. Video contents, graphics, files, and lectures are under copyright protection. Plagiarism and secondary piracy are explicitly forbidden.'}
                  </p>
                  <p>
                    {lang === 'ar'
                      ? '٣. يلتزم الطالب بمجالس السير العامة والتعامل بمسؤولية واحترام متبادل مع السادة المعلمين والأكاديميين المساعدين في غرف النقاش.'
                      : '3. Students should conform to friendly respect levels toward teachers and fellow students on discussion threads.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </footer>
  );
}
