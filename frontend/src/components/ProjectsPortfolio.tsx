"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PiSparkleLight, PiMapPinLight, PiCubeLight } from 'react-icons/pi';

export default function ProjectsPortfolio({ projects }: { projects: any[] }) {
  // Datos reales de Corales del Viento (fallback ultra-lujo y garantizado)
  const defaultProjects = [
    {
      id: '8b6c778a-7393-415d-9bb2-ba01dcdf6a41',
      slug: 'corales-del-viento',
      name: 'Condominio Campestre Corales del Viento',
      location: 'San Bernardo del Viento, Córdoba',
      tag: 'Frente al Mar · Zona Turística',
      description: 'En el caribe colombiano a 150 metros del mar (a 5 minutos a pie por vía de acceso conformada) en zona turística de alta valorización. Lotes 100% planos con defensa jurídica y escritura individual.',
      area: 'Desde 180 m²',
      investment: '$260.000 / m²',
      financing: 'Financiación Directa',
      logoUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/08e535d2-f7e8-4a1b-99e9-1949355cd0a9-LOGO_page-0001.webp',
      mainImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
      bannerImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
      has3D: true,
    }
  ];

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="proyectos" className="py-32 px-6 lg:px-8 relative bg-[#F9F8F6]">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-gold-accent)] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-[var(--color-caribbean-blue)] rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[var(--color-gold-accent)] uppercase tracking-[0.2em] text-xs font-bold mb-3">
            DESARROLLOS INMOBILIARIOS EXCLUSIVOS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-caribbean-dark)] mb-4 tracking-tight font-sans">
            Portafolio de Proyectos
          </h2>
          <div className="w-16 h-1 bg-[var(--color-gold-accent)] mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Conoce nuestros proyectos campestres, residenciales y costeros estratégicamente estructurados en Córdoba y el Caribe colombiano.
          </p>
        </motion.div>

        {/* Grid */}
        <div className={`grid grid-cols-1 ${displayProjects.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-10`}>
          {displayProjects.map((project: any, index: number) => {
            const cardBgImage = (project.mainImageUrl && !project.mainImageUrl.toLowerCase().includes('logo'))
              ? project.mainImageUrl
              : (project.bannerImageUrl && !project.bannerImageUrl.toLowerCase().includes('logo'))
                ? project.bannerImageUrl
                : 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg';

            const logo = project.logoUrl || (project.bannerImageUrl?.toLowerCase().includes('logo') ? project.bannerImageUrl : null);

            return (
              <motion.div 
                key={project.id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="glass-card overflow-hidden flex flex-col group bg-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl border border-white/60"
              >
                {/* Header Tags */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/40 text-xs font-medium text-gray-700 bg-white/40 backdrop-blur-md">
                  <span className="flex items-center gap-1.5 text-[var(--color-caribbean-dark)] font-bold tracking-wider uppercase">
                    <PiSparkleLight className="text-[var(--color-gold-accent)]" size={16} /> {project.tag || 'Proyecto Insignia'}
                  </span>
                  <span className="flex items-center gap-1.5 opacity-70">
                    <PiMapPinLight size={16} /> {project.location || (project.cityName ? `${project.cityName}, ${project.departmentName}` : 'San Bernardo del Viento, Córdoba')}
                  </span>
                </div>
                
                {/* Image Fotográfica Real (Sin distorsión) */}
                <div className="relative h-72 w-full overflow-hidden bg-slate-900">
                  <Image 
                    src={cardBgImage} 
                    alt={project.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dark overlay cinemático */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-caribbean-dark)]/85 via-black/20 to-transparent" />
                  
                  {/* Badge en la foto */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 text-[var(--color-caribbean-dark)] shadow-md mb-2">
                        {project.status?.replace('_', ' ') || 'EN VENTAS'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight drop-shadow-md">
                        {project.name}
                      </h3>
                    </div>

                    {(project.has3D || project.slug === 'corales-del-viento') && (
                      <div className="text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 bg-white/95 text-[var(--color-caribbean-dark)] border border-white">
                        <PiCubeLight size={15} /> 3D Activo
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 flex flex-col flex-grow relative z-10 bg-white/40">
                  {logo && (
                    <div className="relative h-12 w-44 mb-4">
                      <Image 
                        src={logo} 
                        alt={`Logo ${project.name}`} 
                        fill 
                        className="object-contain object-left" 
                      />
                    </div>
                  )}
                <p className="text-gray-600 text-sm leading-relaxed mb-8 font-light">
                  {project.description || project.shortDescription || 'En el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización.'}
                </p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-[var(--color-gold-accent)]/20">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Área</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">{project.area || 'Desde 180 m²'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Metro Cuadrado</p>
                    <p className="text-sm font-extrabold text-[var(--color-caribbean-blue)] tabular-nums">$260.000 COP</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Ubicación</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">A 5 min del mar</p>
                  </div>
                </div>

                
                {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Link href={`/proyectos/${project.slug || 'corales-del-viento'}`} prefetch={true} className="w-full text-center btn-primary-glow shadow-none text-sm">
                    <span className="relative z-10">Ver Detalles del Proyecto</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/proyectos" prefetch={true} className="inline-block btn-outline-gold px-10 py-4">
            Ver Portafolio Completo
          </Link>
        </div>
      </div>
    </section>
  );
}
