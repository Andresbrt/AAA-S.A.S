"use client";
import { useState, useEffect } from 'react';
import { PiInstagramLogoLight, PiTiktokLogoLight, PiFacebookLogoLight, PiX } from 'react-icons/pi';

export default function SocialPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró en esta sesión
    const hasSeenPopup = sessionStorage.getItem('hasSeenSocialPopup');
    
    if (!hasSeenPopup) {
      // Mostrar después de 3 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenSocialPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Decorative Header */}
        <div className="h-32 bg-[var(--color-caribbean-dark)] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-caribbean-dark)] to-transparent" />
          
          <h3 className="relative z-10 text-white font-serif text-2xl font-bold tracking-wide">
            ¡Únete al Grupo AAA!
          </h3>
        </div>

        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-20 backdrop-blur-md"
        >
          <PiX className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-8 font-light leading-relaxed">
            Descubre los mejores proyectos campestres y síguenos para estar al tanto de 
            nuevos lanzamientos, avances de obra y <strong className="text-[var(--color-gold-accent)] font-medium">ofertas exclusivas</strong> antes que nadie.
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <a 
              href="https://www.instagram.com/grupoaaa_inversiones?stkn=M204eDJoaWJuZXRs" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closePopup}
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[var(--color-caribbean-dark)] hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <PiInstagramLogoLight className="w-8 h-8" />
            </a>
            
            <a 
              href="https://www.tiktok.com/@grupo.aaa?_r=1&_t=ZS-9A6rSjywCjl" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closePopup}
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[var(--color-caribbean-dark)] hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <PiTiktokLogoLight className="w-8 h-8" />
            </a>
            
            <a 
              href="https://www.facebook.com/share/1CYRi2nCtT/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closePopup}
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[var(--color-caribbean-dark)] hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <PiFacebookLogoLight className="w-8 h-8" />
            </a>
          </div>

          <button onClick={closePopup} className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors">
            En otro momento
          </button>
        </div>
      </div>
    </div>
  );
}
