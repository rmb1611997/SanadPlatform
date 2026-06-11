import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import Hls from 'hls.js';

interface SecureVideoPlayerProps {
  videoUrl: string;
  videoSource?: string;
  studentName: string;
  studentPhone: string;
  title?: string;
  isAr?: boolean;
}

const getEmbedUrl = (url: string, source?: string): { isEmbeddable: boolean; embedUrl: string } => {
  if (!url) return { isEmbeddable: false, embedUrl: '' };

  const isBunny = source === 'bunny' || url.includes('bunny') || url.includes('iframe.mediadelivery.net');
  
  if (isBunny) {
    // If it is a direct media file (ends in .m3u8, .mp4, etc), use native video element
    const isLocalOrMp4 = url.endsWith('.mp4') || url.includes('.m3u8') || url.endsWith('.webm') || url.includes('playlist.m3u8');
    if (isLocalOrMp4) {
      return { isEmbeddable: false, embedUrl: url };
    }
    // Otherwise, treat as embeddable iframe
    return { isEmbeddable: true, embedUrl: url };
  }

  // YouTube processing
  let videoId = '';
  const regExpParam = /[?&]v=([^&#]*)/;
  const matchParam = url.match(regExpParam);
  if (matchParam && matchParam[1]) {
    videoId = matchParam[1];
  } else {
    const regExpShort = /youtu\.be\/([^?&#]*)/;
    const matchShort = url.match(regExpShort);
    if (matchShort && matchShort[1]) {
      videoId = matchShort[1];
    } else {
      const regExpEmbed = /youtube\.com\/embed\/([^?&#]*)/;
      const matchEmbed = url.match(regExpEmbed);
      if (matchEmbed && matchEmbed[1]) {
        videoId = matchEmbed[1];
      } else {
        const regExpShorts = /youtube\.com\/shorts\/([^?&#]*)/;
        const matchShorts = url.match(regExpShorts);
        if (matchShorts && matchShorts[1]) {
          videoId = matchShorts[1];
        }
      }
    }
  }

  if (videoId) {
    return { isEmbeddable: true, embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3` };
  }

  if (url.includes('iframe') || url.includes('embed') || url.includes('mediadelivery.net') || url.includes('youtube.com')) {
    return { isEmbeddable: true, embedUrl: url };
  }

  return { isEmbeddable: false, embedUrl: url };
};

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoUrl,
  videoSource,
  studentName,
  studentPhone,
  title,
  isAr = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: 20, left: 15 });

  const parsedVideo = getEmbedUrl(videoUrl, videoSource);
  const firstName = studentName ? studentName.split(' ')[0] : 'سند';
  const watermarkText = `${firstName} | ${studentPhone || '📞'}`;

  // Gently move watermark to random spots inside the video container so it is not static
  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 65) + 15; // 15% to 80% boundary
      const left = Math.floor(Math.random() * 60) + 15; // 15% to 75% boundary
      setWatermarkPos({ top, left });
    }, 8500); // long interval keeps it elegant and non-distracting
    return () => clearInterval(interval);
  }, []);

  // Set up HLS or standard video source dynamically
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || parsedVideo.isEmbeddable) return;

    if (hlsInstance) {
      hlsInstance.destroy();
      setHlsInstance(null);
    }

    const isM3U8 = videoUrl.includes('.m3u8') || videoUrl.includes('playlist') || videoSource === 'bunny' || videoUrl.includes('mediadelivery');

    if (isM3U8) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 10,
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play().catch(() => {});
        });
        setHlsInstance(hls);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // iOS Safari native playback support
        videoElement.src = videoUrl;
        videoElement.load();
      } else {
        // Fallback
        videoElement.src = videoUrl;
      }
    } else {
      // Standard video
      videoElement.src = videoUrl;
      videoElement.load();
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [videoUrl, parsedVideo.isEmbeddable]);

  // Hook up simple anti-inspect key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable typical inspect keyboard shortcuts when looking/playing
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-neutral-800/80 dark:border-neutral-700/60 select-none"
    >
      {/* Dynamic Watermark overlay (Super Elegant, floating, animated) */}
      <div 
        /* inline styles guarantee we cannot override it globally without breaking design, plus hard to inspect outer classes */
        style={{
          position: 'absolute',
          top: `${watermarkPos.top}%`,
          left: `${watermarkPos.left}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 9999,
        }}
        className="opacity-25 md:opacity-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/60 backdrop-blur-[2px] border border-white/5 shadow-md pointer-events-none select-none text-[10px] sm:text-xs font-mono font-bold tracking-wider text-white"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {watermarkText}
      </div>

      {/* Actual Player Output Area */}
      {parsedVideo.isEmbeddable ? (
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {/* Transparent overlay over iframes to block context menu of Youtube/iframe, yet keeping basic interactions */}
          <div 
            className="absolute inset-0 bg-transparent z-40 pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
          />
          <iframe
            src={parsedVideo.embedUrl}
            title={title || 'Secure Stream'}
            className="w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : videoUrl ? (
        <video
          ref={videoRef}
          controls
          autoPlay
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-contain pointer-events-auto"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3 p-4 bg-neutral-950">
          <Play className="h-16 w-16 text-indigo-500 animate-pulse pointer-events-none" />
          <p className="text-sm font-bold text-neutral-200">
            {isAr ? 'بروتوكول البث الآمن للمحاضرة' : 'Secure Streaming Protocol'}
          </p>
          <div className="h-1.5 w-[75%] bg-neutral-800 rounded-full overflow-hidden relative">
            <div className="h-full bg-indigo-500 animate-[pulse_1.5s_infinite]" style={{ width: '45%' }} />
          </div>
        </div>
      )}
    </div>
  );
};
