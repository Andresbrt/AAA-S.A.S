'use client';

import { useState, useEffect, useRef } from 'react';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop';
const DEFAULT_VIDEO = '/videos/hero-background.mp4';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function HeroVideo({ videoUrl, posterUrl = DEFAULT_POSTER }: HeroVideoProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(videoUrl || DEFAULT_VIDEO);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoUrl) {
      setCurrentSrc(videoUrl);
    }
  }, [videoUrl]);

  // Robust play trigger for Safari (macOS / iOS) and Chrome
  const attemptPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, ensure muted and retry once
        if (video) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    }
  };

  useEffect(() => {
    attemptPlay();
  }, [currentSrc]);

  const handleError = () => {
    if (currentSrc !== DEFAULT_VIDEO) {
      console.warn('Custom hero video failed to load. Falling back to local optimized video.');
      setCurrentSrc(DEFAULT_VIDEO);
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
        ref={videoRef}
        key={currentSrc}
        src={currentSrc}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={attemptPlay}
        onLoadedMetadata={attemptPlay}
        onError={handleError}
        className="w-full h-full object-cover scale-105 transition-opacity duration-700"
        style={{ filter: 'brightness(0.8)' }}
      />
    </div>
  );
}
