"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PiSparkleLight, PiMapPinLight, PiCubeLight } from 'react-icons/pi';

export default function ProjectsPortfolio({ projects }: { projects: any[] }) {
  // Datos reales de Corales del Viento (fallback automático si el backend aún no está conectado en Render)
  const defaultProjects = [
    {
      id: '8b6c778a-7393-415d-9bb2-ba01dcdf6a41',
      slug: 'corales-del-viento',
      name: 'Condominio Campestre Corales del Viento',
      location: 'San Bernardo del Viento, Córdoba',
      tag: 'Proyecto Insignia - En Preventa',
      description: 'Lotes campestres y costeros exclusivos a solo 150 metros del mar Caribe. Cuenta con Club House, piscina sin fin, vías amplias y acometidas de energía y agua. 100% saneado con matrícula individual.',
      area: 'Desde 180 m²',
      investment: 'Desde $48.443.200 COP',
      financing: 'Financiación Directa',
      mainImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/15930ea4-ed64-40d4-8ef2-b88f2c0fd173-IMG_0535.JPG.webp',
      bannerImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/47421d6e-4fbd-423d-9f1e-3aec64f0d4e0-LOGO_page-0001.webp',
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
          <h2 className="heading-luxury mb-4 font-serif">
            Portafolio de Proyectos
          </h2>
          <div className="w-16 h-1 bg-[var(--color-gold-accent)] mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Conoce nuestros proyectos campestres, residenciales y costeros estratégicamente estructurados en Córdoba y el Caribe colombiano.
          </p>
        </motion.div>

        {/* Grid */}
        <div className={`grid grid-cols-1 ${displayProjects.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-10`}>
          {displayProjects.map((project: any, index: number) => (
            <motion.div 
              key={project.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass-card overflow-hidden flex flex-col group bg-white/60"
            >
              {/* Header Tags */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/40 text-xs font-medium text-gray-700 bg-white/40 backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-[var(--color-caribbean-dark)] font-bold tracking-wider uppercase">
                  <PiSparkleLight className="text-[var(--color-gold-accent)]" size={16} /> {project.tag || 'Proyecto Insignia'}
                </span>
                <span className="flex items-center gap-1.5 opacity-70">
                  <PiMapPinLight size={16} /> {project.location || (project.cityName ? `${project.cityName}, ${project.departmentName}` : 'Córdoba, Colombia')}
                </span>
              </div>
              
              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden">
                {/* Background Image */}
                <Image 
                  src={project.mainImageUrl || project.image || project.bannerImageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"} 
                  alt={project.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Dark overlay to make logo pop if present, or just text pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-caribbean-dark)]/80 via-black/20 to-transparent transition-opacity duration-500" />
                
                {/* Logo Overlay */}
                {project.logoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="relative w-full h-full">
                      <Image 
                        src={project.logoUrl}
                        alt={`Logo ${project.name}`}
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                )}
                
                {(project.has3D || project.slug === 'corales-del-viento') && (
                  <div className="absolute bottom-4 right-4 text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 bg-white/90 border-white text-[var(--color-caribbean-dark)]">
                    <PiCubeLight size={16} /> Experiencia 3D Activa
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative z-10 bg-white/20">
                <h3 className="text-2xl font-bold text-[var(--color-caribbean-dark)] mb-3 font-serif">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 font-light">
                  {project.description || project.shortDescription}
                </p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-[var(--color-gold-accent)]/20">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Área</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">{project.area || 'Desde 180 m²'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Inversión</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-blue)]">{project.investment || (project.minPrice ? `Desde $${project.minPrice.toLocaleString()} COP` : 'Consultar')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">{project.financing ? 'Financiación' : 'Estado'}</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">{project.financing || 'En Preventa'}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Link href={`/proyectos/${project.slug || 'corales-del-viento'}`} className="w-full text-center btn-primary-glow shadow-none text-sm">
                    <span className="relative z-10">Ver Detalles del Proyecto</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/proyectos" className="inline-block btn-outline-gold px-10 py-4">
            Ver Portafolio Completo
          </Link>
        </div>
      </div>
    </section>
  );
}
