'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      // Small delay so it doesn't pop up instantly on page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 md:px-10"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-caribbean-blue)]"></div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--color-caribbean-dark)] mb-2 flex items-center gap-2">
                <span>🍪</span> Política de Privacidad y Cookies
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. 
                Al hacer clic en "Aceptar", consientes el uso de nuestras cookies y aceptas nuestra{' '}
                <Link href="/legal/politica-de-privacidad" className="text-[var(--color-caribbean-blue)] underline hover:text-[var(--color-caribbean-dark)] font-medium transition-colors">
                  Política de Tratamiento de Datos Personales (Ley 1581)
                </Link>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link 
                href="/legal/politica-de-privacidad" 
                onClick={() => setIsVisible(false)}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm transition-colors text-center"
              >
                Más información
              </Link>
              <button 
                onClick={acceptCookies}
                className="px-8 py-3 rounded-xl bg-[var(--color-caribbean-blue)] text-white font-bold hover:bg-[var(--color-caribbean-dark)] text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--color-caribbean-blue)]/30"
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
