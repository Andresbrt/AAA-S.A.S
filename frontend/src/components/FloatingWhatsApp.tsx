'use client';
import { usePathname } from 'next/navigation';
import { PiWhatsappLogoLight } from 'react-icons/pi';
import { buildWhatsAppUrl } from '@/lib/contact';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const WHATSAPP_URL = buildWhatsAppUrl();

  if (
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/portal-asesores') || 
    pathname?.startsWith('/login')
  ) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick('floating_button')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:scale-110 transition-all duration-300"
      aria-label="Hablar por WhatsApp"
    >
      <PiWhatsappLogoLight size={32} />
      {/* Indicador de "En línea" (Puntito rojo/verde) */}
      <span className="absolute top-0 right-0 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
      </span>
    </a>
  );
}
