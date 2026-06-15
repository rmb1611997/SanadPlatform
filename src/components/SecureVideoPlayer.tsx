import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { motion } from 'motion/react';

interface SecureVideoPlayerProps {
  videoUrl: string;
  videoSource?: 'youtube' | 'vimeo' | 'bunny';
  studentName: string;
  studentPhone: string;
  title?: string;
  isAr?: boolean;
  onStart?: () => void;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
}

const buildEmbedUrl = (url: string, source?: string) => {
  if (!url) return { provider: null, embedUrl: null, isValid: false };

  // YouTube & Shorts
  if (source === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return { 
        provider: 'youtube', 
        embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=0&modestbranding=1&rel=0&iv_load_policy=3`, 
        isValid: true 
      };
    }
  }

  // Vimeo
  if (source === 'vimeo' || url.includes('vimeo.com')) {
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return { 
        provider: 'vimeo', 
        embedUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=0&title=0&byline=0&portrait=0`, 
        isValid: true 
      };
    }
  }

  // Improved Bunny Stream Detection (iframe.mediadelivery.net, video.bunnycdn.com, vz-*.b-cdn.net)
  const isBunny = source === 'bunny' || 
                  url.includes('iframe.mediadelivery.net') || 
                  url.includes('video.bunnycdn.com') ||
                  /vz-[a-zA-Z0-9-]+\.b-cdn\.net/.test(url);
  if (isBunny) {
    return { provider: 'bunny', embedUrl: url, isValid: true };
  }

  return { provider: null, embedUrl: null, isValid: false };
};

const formatWatermark = (name: string, phone: string) => {
  const firstName = name?.split(' ')[0] || 'سند';
  // Example: 01******89
  const maskedPhone = phone && phone.length > 4 
    ? phone.substring(0, 2) + '*'.repeat(phone.length - 4) + phone.substring(phone.length - 2)
    : '****';
  return `${firstName} | ${maskedPhone}`;
};

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoUrl,
  videoSource,
  studentName,
  studentPhone,
  title,
  isAr = true,
  onStart,
  onProgress,
  onComplete,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wmPos, setWmPos] = useState({ top: 10, left: 10 });
  const { embedUrl, isValid } = buildEmbedUrl(videoUrl, videoSource);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isValid) {
      setError(true);
      return;
    }

    // Watermark movement (5%-85%)
    const interval = setInterval(() => {
      setWmPos({
        top: Math.floor(Math.random() * 80) + 5,
        left: Math.floor(Math.random() * 80) + 5,
      });
    }, 15000);

    // 15s loading timeout
    const timeout = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 15000);

    // Sync fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isValid, loading]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (error || !isValid) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-neutral-900 rounded-3xl text-neutral-500 font-bold p-4 text-center">
        {isAr ? 'عذراً، تعذر تحميل الفيديو. يرجى التأكد من الاتصال أو المحاولة لاحقاً.' : 'Sorry, could not load the video. Please check your connection or try again later.'}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 animate-pulse">
           <span className="text-neutral-500 font-black">{isAr ? 'جاري التحضير...' : 'Loading...'}</span>
        </div>
      )}

      {/* Dynamic Watermark */}
      <motion.div 
        className="absolute z-40 pointer-events-none opacity-30 select-none px-3 py-1.5 rounded-full bg-neutral-900/40 backdrop-blur-sm border border-white/10 text-[10px] sm:text-xs font-mono font-bold text-white whitespace-nowrap"
        animate={{ top: `${wmPos.top}%`, left: `${wmPos.left}%` }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        {formatWatermark(studentName, studentPhone)}
      </motion.div>

      {/* Fullscreen Control */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>

      {/* Secure Iframe */}
      <iframe
        src={embedUrl!}
        title={title || 'Video Player'}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        onLoad={() => {
          setLoading(false);
          if (onStart) onStart();
        }}
        onError={() => {setError(true); setLoading(false);}}
      />
    </div>
  );
};

