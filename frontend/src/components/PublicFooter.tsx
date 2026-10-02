import Link from 'next/link';

export default function PublicFooter({ company }: { company: any }) {
  return (
    <footer className="bg-[var(--color-caribbean-dark)] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-8">
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
              <li><Link href="/#proyectos" className="text-white/70 hover:text-[var(--color-gold-accent)] transition-colors text-sm">Proyectos Exclusivos</Link></li>
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
