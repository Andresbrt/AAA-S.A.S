'use client';
import { PiWhatsappLogoLight } from 'react-icons/pi';

export default function FloatingWhatsApp() {
  const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=573122384172&text&type=phone_number&app_absent=0";

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
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
