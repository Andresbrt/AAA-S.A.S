'use client';
import { MessageCircle } from 'lucide-react';

interface Props {
  phone: string;
  message?: string;
}

export default function WhatsAppButton({ phone, message = 'Hola, me gustaría recibir más información.' }: Props) {
  // Format phone number to remove any non-numeric characters for the link
  const formattedPhone = phone?.replace(/\D/g, '') || '';
  
  if (!formattedPhone) return null;

  const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] hover:-translate-y-2 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        ¡Hablemos por WhatsApp!
      </span>
    </a>
  );
}
