"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PiSparkleLight, PiMapPinLight, PiCubeLight } from 'react-icons/pi';

export default function ProjectsPortfolio({ projects }: { projects: any[] }) {
  // If no projects from backend, use a mockup to match the requested design
  const displayProjects = projects && projects.length > 0 ? projects : [
    {
      id: 1,
      name: 'Condominio Campestre Corales del Viento',
      location: 'San Bernardo del Viento, Córdoba',
      tag: 'Proyecto Insignia - En Ventas',
      description: 'Lotes exclusivos a 150m de la playa con Club House, piscina sin fin, vías amplias y acometidas de energía y agua. 100% saneado con matrícula individual.',
      area: 'Desde 450 m²',
      investment: 'Desde $60.000.000 COP',
      financing: 'Hasta 60 meses',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Bahía Cispatá Eco-Village',
      location: 'San Antero / Bahía Cispatá',
      tag: 'Próximo Lanzamiento - Preventa',
      description: 'Condominio náutico y ecológico con muelle privado, acceso directo a la bahía y canales navegables. Diseñado para descanso y deportes marinos.',
      area: 'Desde 600 m²',
      investment: 'Desde $130.000.000 COP',
      financing: 'Lista Cero Preventa',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop',
    }
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {displayProjects.map((project: any, index: number) => (
            <motion.div 
              key={project.id}
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
                <Image 
                  src={project.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"} 
                  alt={project.name} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-caribbean-dark)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {project.id === 1 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 text-[var(--color-caribbean-dark)] text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-white flex items-center gap-2">
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
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">{project.area || 'Desde 450 m²'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Inversión</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-blue)]">{project.investment || (project.minPrice ? `Desde $${project.minPrice.toLocaleString()} COP` : 'Consultar')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">{project.financing ? 'Financiación' : 'Estado'}</p>
                    <p className="text-sm font-bold text-[var(--color-caribbean-dark)]">{project.financing || 'En Ventas'}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  {project.id === 1 ? (
                    <>
                      <Link href="#mapa-interactivo" className="flex-1 text-center btn-primary-glow shadow-none text-sm">
                        <span className="relative z-10">VER MASTER PLAN 3D</span>
                      </Link>
                      <Link href="#mapa-interactivo" className="flex-1 text-center btn-outline-gold text-sm">
                        <span className="relative z-10">LOTES DISPONIBLES</span>
                      </Link>
                    </>
                  ) : (
                    <Link href="#contacto" className="w-full text-center btn-primary-glow shadow-none text-sm">
                      <span className="relative z-10">REGISTRAR INTERÉS EN PREVENTA</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
