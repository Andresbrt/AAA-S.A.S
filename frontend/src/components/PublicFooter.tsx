import Link from 'next/link';
import { PiInstagramLogoLight, PiTiktokLogoLight, PiFacebookLogoLight } from 'react-icons/pi';

export default function PublicFooter({ company }: { company: any }) {
  return (
    <footer className="bg-[var(--color-caribbean-dark)] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Social Media CTA Section */}
        <div className="mb-16 bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Únete a nuestra comunidad</h3>
            <p className="text-white/70 font-light leading-relaxed">
              Descubre avances de obra, inspiración arquitectónica y exclusivas oportunidades de inversión antes que nadie. ¡Síguenos en nuestras redes sociales!
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            <a 
              href="https://www.instagram.com/grupoaaa_inversiones?stkn=M204eDJoaWJuZXRs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-caribbean-dark)]"
              aria-label="Síguenos en Instagram"
              title="Instagram"
            >
              <PiInstagramLogoLight className="w-7 h-7" />
            </a>
            
            <a 
              href="https://www.tiktok.com/@grupo.aaa?_r=1&_t=ZS-9A6rSjywCjl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-caribbean-dark)]"
              aria-label="Síguenos en TikTok"
              title="TikTok"
            >
              <PiTiktokLogoLight className="w-7 h-7" />
            </a>
            
            <a 
              href="https://www.facebook.com/share/1CYRi2nCtT/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-gold-accent)] hover:text-white hover:border-[var(--color-gold-accent)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-caribbean-dark)]"
              aria-label="Síguenos en Facebook"
              title="Facebook"
            >
              <PiFacebookLogoLight className="w-7 h-7" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div>
            <h3 className="text-2xl font-light tracking-widest uppercase mb-6">
              Grupo <span className="font-bold text-[var(--color-gold-accent)]">AAA</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {company?.aboutUs || 'Especialistas en parcelaciones campestres premium en Colombia. Conectamos la naturaleza con un estilo de vida de lujo y tranquilidad.'}
            </p>
            {company?.contactAddress && (
              <p className="text-white/70 text-sm mb-2">📍 {company.contactAddress}</p>
            )}
            {company?.contactPhone && (
              <p className="text-white/70 text-sm mb-2">📞 {company.contactPhone}</p>
            )}
            {company?.contactEmail && (
              <p className="text-white/70 text-sm">✉️ {company.contactEmail}</p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-6">Navegación</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Inicio</Link></li>
              <li><Link href="/proyectos" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Proyectos Exclusivos</Link></li>
              <li><Link href="/#nosotros" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Quiénes Somos</Link></li>
              <li><Link href="/#contacto" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Contáctanos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/legal/politica-de-privacidad" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Política de Tratamiento de Datos (Hábeas Data)</Link></li>
              <li><Link href="/legal/terminos" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Términos y Condiciones</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} GRUPO AAA S.A.S. (NIT: 901599132). Todos los derechos reservados.
          </p>
          <Link href="/portal-asesores" className="text-white/30 hover:text-white/70 text-xs transition-colors">
            Portal Asesores / CRM
          </Link>
        </div>
      </div>
    </footer>
  );
}
