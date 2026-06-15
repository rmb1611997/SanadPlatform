import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function RamadanTheme() {
  const [isActive, setIsActive] = useState(false);
  const [greeting, setGreeting] = useState('رمضان كريم ومبارك، تقبل الله صالح الأعمال 🌙');

  useEffect(() => {
    const checkTheme = () => {
      const isEnabled = localStorage.getItem('sanad_ramadan_theme') === 'true';
      setIsActive(isEnabled);
      const savedGreeting = localStorage.getItem('sanad_ramadan_greeting');
      if (savedGreeting) setGreeting(savedGreeting);
      
      // Add padding to body if active to push content down
      if (isEnabled) {
        document.body.style.paddingTop = '40px'; // banner height
        document.documentElement.style.setProperty('--header-top', '40px');
        document.body.classList.add('ramadan-active');
      } else {
        document.body.style.paddingTop = '0';
        document.documentElement.style.removeProperty('--header-top');
        document.body.classList.remove('ramadan-active');
      }
    };

    checkTheme();

    const handleToggle = () => checkTheme();
    window.addEventListener('ramadan_theme_toggle', handleToggle);
    return () => {
      window.removeEventListener('ramadan_theme_toggle', handleToggle);
      document.body.style.paddingTop = '0';
      document.documentElement.style.removeProperty('--header-top');
      document.body.classList.remove('ramadan-active');
    };
  }, []);

  if (!isActive) return null;

  return (
    <>
      <style>
        {`
          body.ramadan-active {
            background-image: radial-gradient(circle at top right, rgba(245,158,11,0.05) 0%, transparent 40%),
                              radial-gradient(circle at bottom left, rgba(245,158,11,0.05) 0%, transparent 40%) !important;
          }

          /* Cards styling */
          body.ramadan-active .bg-white,
          body.ramadan-active .dark\\:bg-neutral-900,
          body.ramadan-active .dark\\:bg-neutral-850 {
            border-color: rgba(245,158,11,0.15) !important;
            transition: all 0.3s ease;
          }

          body.ramadan-active .bg-white:hover,
          body.ramadan-active .dark\\:bg-neutral-900:hover,
          body.ramadan-active .dark\\:bg-neutral-850:hover {
             box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.08), 0 8px 10px -6px rgba(245, 158, 11, 0.05) !important;
          }

          body.ramadan-active button:hover {
            position: relative;
            box-shadow: inset 0 0 10px rgba(245, 158, 11, 0.2);
            transition: all 0.3s ease;
          }
          body.ramadan-active button::after {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwek0xMCAwbDEwIDEwLTEwIDEwTDAgMTB6IiBmaWxsPSIjZjU5ZTBiIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==');
            background-size: 20px;
            transition: opacity 0.3s ease;
            pointer-events: none;
            mix-blend-mode: overlay;
          }
          body.ramadan-active button:hover::after {
            opacity: 1;
            border-radius: inherit;
          }
        `}
      </style>
      <div className="fixed top-0 inset-x-0 h-[40px] z-[100] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white flex items-center justify-center pointer-events-auto border-b border-amber-400/30 overflow-hidden">
         {/* Animated background pattern in banner */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwek0yMCAwbDIwIDIwLTIwIDIwTDAgMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30 animate-pulse mix-blend-overlay" />
        
        <p className="text-sm font-black tracking-wide animate-fade-in flex items-center gap-3 relative z-10 drop-shadow-md">
          <span className="text-lg animate-bounce" style={{ animationDuration: '2s' }}>🌙</span>
          {greeting}
          <span className="text-lg animate-bounce" style={{ animationDuration: '2.5s' }}>🏮</span>
        </p>
      </div>

      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {/* Stars Background */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              boxShadow: "0 0 8px rgba(251, 191, 36, 0.8)"
            }}
            animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.2, 1] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Decorative Mosque Silhouettes at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[20vh] opacity-5 dark:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iIzNiODJmNiIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMiwxNjBMNDgsMTYwQzk2LDE2MCwxOTIsMTYwLDI4OCwxNDRDMzg0LDEyOCw0ODAsOTYsNTc2LDk2QzY3Miw5Niw3NjgsMTI4LDg2NCwxMzguN0M5NjAsMTQ5LDEwNTYsMTM5LDExNTIsMTEyQzEyNDgsODUsMTM0NCw0MywxMzkyLDIxLjNMMTQ0MCwwTDE0NDAsMzIwTDEzOTIsMzIwQzEzNDQsMzIwLDEyNDgsMzIwLDExNTIsMzIwQzEwNTYsMzIwLDk2MCwzIwLDg2NCwzMjBDNzY4LDMyMCw2NzIsMzIwLDU3NiwzMjBDNDgwLDMyMCwzODQsMzIwLDI4OCwzMjBDMTkyLDMyMCw5NiwzMjAsNDgsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-cover bg-bottom mix-blend-multiply dark:mix-blend-lighten" />

      {/* Glowing Crescent Moon */}
      <motion.div
        initial={{ opacity: 0, y: -50, rotate: -20 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[100px] left-[5%] lg:left-[10%] w-20 h-20 sm:w-32 sm:h-32 opacity-90 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 fill-amber-300 w-full h-full opacity-80">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </motion.div>

      {/* Lanterns Right */}
      <div className="absolute top-[80px] right-[5%] lg:right-[15%] flex gap-8 sm:gap-16">
        {[1, 2].map((lantern) => (
          <motion.div
            key={`r-${lantern}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.5 + lantern * 0.5,
              ease: "easeOut"
            }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [-4, 4, -4] }}
              transition={{
                duration: 5 + lantern,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: "top center" }}
              className="flex flex-col items-center"
            >
              <div className="w-0.5 h-16 sm:h-28 bg-gradient-to-b from-amber-600/80 to-amber-300" />
              <div className="text-4xl sm:text-6xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">🏮</div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Lanterns Left */}
      <div className="absolute top-[80px] left-[15%] lg:left-[25%] hidden sm:flex gap-16 opacity-70">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: [3, -3, 3] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "top center" }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-12 bg-gradient-to-b from-amber-600/80 to-amber-300" />
            <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">🏮</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Islamic Pattern overlay on edges */}
      <div className="absolute inset-x-0 top-[40px] h-40 opacity-15 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwek0yMCAwbDIwIDIwLTIwIDIwTDAgMjB6IiBmaWxsPSIjYjQ1MzA5IiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] mix-blend-multiply dark:mix-blend-lighten [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>
    </>
  );
}
