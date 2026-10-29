import Link from 'next/link';
import { PiHouseLight, PiCompassLight, PiWhatsappLogoLight } from 'react-icons/pi';
import { buildWhatsAppUrl } from '@/lib/contact';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-caribbean-dark)] text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-caribbean-blue)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gold-accent)]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10">
        <span className="inline-block text-[var(--color-gold-accent)] text-xs md:text-sm font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[var(--color-gold-accent)]/30 mb-6">
          Error 404 · Página No Encontrada
        </span>

        <h1 className="text-6xl md:text-8xl font-sans font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-sans font-medium text-white/95 mb-4">
          La propiedad o página no existe
        </h2>

        <p className="text-white/70 text-sm md:text-base font-light mb-10 leading-relaxed max-w-md mx-auto">
          Es posible que el enlace haya cambiado o que el proyecto ya no se encuentre disponible. Te invitamos a regresar a nuestro portafolio principal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-gold-accent)] hover:bg-[#B89B2F] text-white font-bold text-sm px-6 py-3.5 rounded-full transition shadow-lg shadow-[var(--color-gold-accent)]/30"
          >
            <PiHouseLight size={18} />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white hover:text-[var(--color-caribbean-dark)] text-white border border-white/40 font-bold text-sm px-6 py-3.5 rounded-full transition backdrop-blur-sm"
          >
            <PiCompassLight size={18} />
            <span>Ver Proyectos</span>
          </Link>

          <a
            href={buildWhatsAppUrl('Hola! Estaba navegando en el sitio web y no pude encontrar lo que buscaba. ¿Me podrían asesorar?')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm px-6 py-3.5 rounded-full transition shadow-md"
          >
            <PiWhatsappLogoLight size={18} />
            <span>Asesor VIP</span>
          </a>
        </div>
      </div>
    </main>
  );
}
