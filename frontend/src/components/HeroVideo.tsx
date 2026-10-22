'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_POSTER = '/images/hero-poster.jpg';
const DEFAULT_VIDEO = '/videos/hero-background.mp4';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function HeroVideo({ videoUrl, posterUrl = DEFAULT_POSTER }: HeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active video source: prioritize custom company URL if available, fallback to local fast video
  const targetSrc = (videoUrl && videoUrl.trim() !== '') ? videoUrl : DEFAULT_VIDEO;

  // Robust play execution for Safari (macOS / iOS) and Chromium
  const attemptPlay = useCallback((targetEl?: HTMLVideoElement | null) => {
    const video = targetEl || videoRef.current;
    if (!video) return;

    // Safari requires DOM properties to be explicitly true
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy retry with explicit mute
          if (video) {
            video.muted = true;
            video.play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // If strict browser policy blocked it, window gesture listeners will trigger it
              });
          }
        });
    }
  }, []);

  // Update source smoothly on existing DOM element without destroying the video node
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If source actually changed
    const currentSrcAttr = video.getAttribute('src');
    if (currentSrcAttr !== targetSrc) {
      video.src = targetSrc;
      video.load();
      attemptPlay(video);
    } else if (video.paused) {
      attemptPlay(video);
    }
  }, [targetSrc, attemptPlay]);

  // Continuously listen to scroll, wheel, and touch interactions to activate playback immediately
  useEffect(() => {
    const activateVideo = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    // Scroll and interaction triggers
    window.addEventListener('scroll', activateVideo, { passive: true });
    window.addEventListener('wheel', activateVideo, { passive: true });
    window.addEventListener('touchmove', activateVideo, { passive: true });
    window.addEventListener('touchstart', activateVideo, { passive: true });
    window.addEventListener('pointerdown', activateVideo, { passive: true });
    window.addEventListener('click', activateVideo, { passive: true });

    // Also activate via IntersectionObserver when Hero is in viewport
    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && videoRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activateVideo();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(videoRef.current);
    }

    return () => {
      window.removeEventListener('scroll', activateVideo);
      window.removeEventListener('wheel', activateVideo);
      window.removeEventListener('touchmove', activateVideo);
      window.removeEventListener('touchstart', activateVideo);
      window.removeEventListener('pointerdown', activateVideo);
      window.removeEventListener('click', activateVideo);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [attemptPlay]);

  const handleError = () => {
    const video = videoRef.current;
    if (video && video.src !== DEFAULT_VIDEO && !video.src.endsWith(DEFAULT_VIDEO)) {
      console.warn('Custom hero video stream failed to load. Switching to local optimized copy.');
      video.src = DEFAULT_VIDEO;
      video.load();
      attemptPlay(video);
    }
  };

  return (
    <div 
      className="absolute inset-0 z-0 bg-slate-950 overflow-hidden"
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
            // Apply native properties directly to DOM node
            el.muted = true;
            el.defaultMuted = true;
            el.playsInline = true;
            el.setAttribute('playsinline', '');
            el.setAttribute('webkit-playsinline', '');
            el.setAttribute('muted', '');
            if (el.paused) {
              attemptPlay(el);
            }
          }
        }}
        src={targetSrc}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => attemptPlay()}
        onLoadedData={() => attemptPlay()}
        onPlaying={() => setIsPlaying(true)}
        onError={handleError}
        className={`w-full h-full object-cover scale-105 transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-95'
        }`}
        style={{ filter: 'brightness(0.8)' }}
      />
    </div>
  );
}

