'use client';

import { useState, useEffect, useRef } from 'react';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop';
const DEFAULT_VIDEO = 'https://cdn.coverr.co/videos/coverr-flying-over-a-beautiful-beach-and-ocean-in-mexico-5727/1080p.mp4';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function HeroVideo({ videoUrl, posterUrl = DEFAULT_POSTER }: HeroVideoProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(videoUrl || DEFAULT_VIDEO);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Update src if prop changes
  useEffect(() => {
    if (videoUrl) {
      setCurrentSrc(videoUrl);
      setHasError(false);
    }
  }, [videoUrl]);

  // Robust Autoplay handler for Safari / iOS WebKit & Chrome
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const startPlayback = async () => {
      try {
        await video.play();
      } catch (err) {
        // Retry muted autoplay
        video.muted = true;
        try {
          await video.play();
        } catch (retryErr) {
          console.warn('Autoplay prevented by browser policy:', retryErr);
        }
      }
    };

    startPlayback();
  }, [currentSrc]);

  const handleError = () => {
    if (!hasError && currentSrc !== DEFAULT_VIDEO) {
      console.warn('Hero video failed to load or decode. Falling back to default Caribbean video.');
      setHasError(true);
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
        onError={handleError}
        className="w-full h-full object-cover scale-105 transition-opacity duration-1000"
        style={{ filter: 'brightness(0.8)' }}
      >
        <source src={currentSrc} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
  );
}
