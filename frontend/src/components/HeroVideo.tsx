'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_POSTER = '/images/hero-poster.jpg';
const LOCAL_VIDEO = '/videos/hero-background.mp4';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function HeroVideo({ videoUrl, posterUrl = DEFAULT_POSTER }: HeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // If videoUrl is the default Supabase ultralight video or unset, use the local fast file (/videos/hero-background.mp4).
  // This avoids mid-load source changes that cause Safari to pause and require a click.
  const isDefaultVideo = !videoUrl || videoUrl.includes('hero-ultralight') || videoUrl.includes('hero-background');
  const activeSrc = isDefaultVideo ? LOCAL_VIDEO : videoUrl;

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce native DOM properties for Safari & Chrome
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true))
          .catch(() => {
            // Retry muted in case of browser policy restriction
            if (video) {
              video.muted = true;
              video.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      setIsPlaying(true);
    }
  }, []);

  // Update source smoothly ONLY if a different custom video was passed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentSrcAttr = video.getAttribute('src');
    if (currentSrcAttr !== activeSrc && !video.src.endsWith(activeSrc)) {
      video.src = activeSrc;
      video.load();
      playVideo();
    } else {
      playVideo();
    }
  }, [activeSrc, playVideo]);

  // Activate playback on ANY scroll, wheel, touch or interaction continuously
  useEffect(() => {
    const onScrollOrInteract = () => {
      playVideo();
    };

    // Attach continuous listeners for scroll, wheel, touch, and pointers
    window.addEventListener('scroll', onScrollOrInteract, { passive: true });
    window.addEventListener('wheel', onScrollOrInteract, { passive: true });
    window.addEventListener('touchmove', onScrollOrInteract, { passive: true });
    window.addEventListener('touchstart', onScrollOrInteract, { passive: true });
    window.addEventListener('pointerdown', onScrollOrInteract, { passive: true });
    window.addEventListener('pointermove', onScrollOrInteract, { passive: true });
    window.addEventListener('keydown', onScrollOrInteract, { passive: true });
    window.addEventListener('click', onScrollOrInteract, { passive: true });

    // IntersectionObserver when Hero enters viewport
    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && videoRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(videoRef.current);
    }

    // Attempt play immediately on mount
    playVideo();

    return () => {
      window.removeEventListener('scroll', onScrollOrInteract);
      window.removeEventListener('wheel', onScrollOrInteract);
      window.removeEventListener('touchmove', onScrollOrInteract);
      window.removeEventListener('touchstart', onScrollOrInteract);
      window.removeEventListener('pointerdown', onScrollOrInteract);
      window.removeEventListener('pointermove', onScrollOrInteract);
      window.removeEventListener('keydown', onScrollOrInteract);
      window.removeEventListener('click', onScrollOrInteract);
      if (observer) observer.disconnect();
    };
  }, [playVideo]);

  return (
    <div 
      className="absolute inset-0 z-0 bg-slate-950 overflow-hidden cursor-pointer"
      onClick={playVideo}
      style={{
        backgroundImage: `url(${posterUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <video
        ref={(el) => {
          videoRef.current = el;
          if (el) {
            el.muted = true;
            el.defaultMuted = true;
            el.playsInline = true;
            el.setAttribute('playsinline', '');
            el.setAttribute('webkit-playsinline', '');
            el.setAttribute('muted', '');
            if (el.paused) {
              el.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }
        }}
        src={activeSrc}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={playVideo}
        onLoadedData={playVideo}
        onLoadedMetadata={playVideo}
        onPlaying={() => setIsPlaying(true)}
        className={`w-full h-full object-cover scale-105 transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-95'
        }`}
        style={{ filter: 'brightness(0.8)' }}
      >
        <source src={activeSrc} type="video/mp4" />
      </video>
    </div>
  );
}
