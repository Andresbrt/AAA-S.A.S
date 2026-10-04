import { Metadata } from 'next';
import { getAllPublicProjects } from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import Image from 'next/image';
import Link from 'next/link';
import { PiMapPinLight } from 'react-icons/pi';

export const metadata: Metadata = {
  title: 'Catálogo de Proyectos | Grupo AAA S.A.S',
  description: 'Explora nuestro portafolio de proyectos campestres, residenciales y costeros en Colombia.',
};

export default async function ProyectosPage() {
  const data = await getAllPublicProjects(0, 50);
  const projects = data.content || [];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <PublicNavbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 bg-[var(--color-caribbean-dark)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-caribbean-dark)] to-transparent"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[var(--color-gold-accent)]/50 text-[var(--color-gold-accent)] text-xs font-bold uppercase tracking-widest mb-6">
            Portafolio Inmobiliario
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6">
            Nuestros Proyectos
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            Descubre nuestra selección de lotes campestres, condominios y proyectos costeros diseñados para un estilo de vida excepcional.
          </p>
        </div>
      </section>

      {/* Filters (Mockup UI for interaction designer persona) */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide text-sm uppercase tracking-wider font-medium">
            <button className="text-[var(--color-caribbean-dark)] border-b-2 border-[var(--color-gold-accent)] pb-1 whitespace-nowrap">Todos</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-1 whitespace-nowrap">Lotes Campestres</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-1 whitespace-nowrap">Casas</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-1 whitespace-nowrap">Frente al Mar</button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6 flex-grow">
        <div className="container mx-auto max-w-6xl">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-serif text-[var(--color-caribbean-dark)] mb-4">No hay proyectos disponibles en este momento.</h3>
              <p className="text-gray-500 font-light">Estamos trabajando en nuevos desarrollos. ¡Vuelve pronto!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project: any) => (
                <Link href={`/proyectos/${project.slug}`} key={project.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,45,90,0.08)] transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className={`relative h-64 w-full overflow-hidden ${project.logoUrl ? 'bg-[#F9F8F6]' : ''}`}>
                    <Image 
                      src={project.logoUrl || project.mainImageUrl || project.bannerImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'} 

                      alt={project.name}
                      fill
                      className={project.logoUrl ? "object-contain p-12 transition-transform duration-700 group-hover:scale-105" : "object-cover transition-transform duration-700 group-hover:scale-110"}
                    />
                    {!project.logoUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    )}
                    
                    <div className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.logoUrl ? 'bg-[var(--color-caribbean-dark)]/10 text-[var(--color-caribbean-dark)] border border-[var(--color-caribbean-dark)]/20' : 'bg-white/90 text-[var(--color-caribbean-dark)]'}`}>
                      {project.status?.replace('_', ' ') || 'PREVENTA'}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      {!project.logoUrl && (
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[var(--color-gold-accent)] transition-colors">
                          {project.name}
                        </h3>
                      )}
                      <div className={`flex items-center text-xs tracking-wider ${project.logoUrl ? 'text-[var(--color-caribbean-dark)] font-medium bg-white/50 backdrop-blur px-2 py-1 rounded-md inline-flex' : 'text-white/80'}`}>
                        <PiMapPinLight className="w-4 h-4 mr-1" />
                        {project.cityName || 'Colombia'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-light leading-relaxed flex-grow">
                      {project.shortDescription || 'Un exclusivo desarrollo inmobiliario pensado para brindarte la mejor calidad de vida y rentabilidad.'}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Inversión desde</span>
                        <span className="text-xl font-bold text-[var(--color-caribbean-dark)]">
                          ${project.minPrice ? project.minPrice.toLocaleString() : '105.000.000'} <span className="text-xs font-normal text-gray-400">COP</span>
                        </span>
                      </div>
                      <span className="text-[var(--color-caribbean-blue)] font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Ver Detalles &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter company={{}} />
    </main>
  );
}
