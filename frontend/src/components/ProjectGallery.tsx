"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi';

export default function ProjectGallery({ images }: { images?: string[] }) {
  const defaultImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', // Luxury pool/house
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', // Modern architecture
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', // Interior
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop', // Coastal/Nature
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, displayImages.length]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden group shadow-sm border border-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image 
            src={displayImages[currentIndex]} 
            alt={`Galería ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button onClick={prev} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-caribbean-dark)] transition-all">
          <PiCaretLeftLight size={24} />
        </button>
        <button onClick={next} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-caribbean-dark)] transition-all">
          <PiCaretRightLight size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {displayImages.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/40 hover:bg-white/80 w-2'}`}
          />
        ))}
      </div>
    </div>
  );
}
