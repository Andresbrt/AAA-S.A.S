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
      
      {/* Premium Hero Header */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh]">
        {/* Background Layer with architectural image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"
            alt="Luxury Real Estate Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Luxury Overlays: Dark Caribbean Blue blending with the image */}
        <div className="absolute inset-0 bg-[var(--color-caribbean-dark)]/80 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--color-caribbean-dark)]/90 z-10"></div>
        
        <div className="container mx-auto max-w-5xl relative z-20 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--color-gold-accent)]/30 bg-black/30 backdrop-blur-md mb-8 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold-accent)] animate-pulse shadow-[0_0_10px_var(--color-gold-accent)]"></span>
            <span className="text-[var(--color-gold-accent)] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
              Colección Exclusiva
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-2xl">
            Nuestros Proyectos
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md">
            Descubre nuestra selección de lotes campestres, condominios y proyectos costeros diseñados para un estilo de vida excepcional.
          </p>
        </div>
      </section>

      {/* Filters (Mockup UI for interaction designer persona) */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-20 z-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex gap-10 overflow-x-auto py-6 scrollbar-hide text-sm uppercase tracking-widest font-medium">
            <button className="text-[var(--color-caribbean-dark)] border-b-2 border-[var(--color-gold-accent)] pb-2 whitespace-nowrap">Todos</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-2 whitespace-nowrap">Lotes Campestres</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-2 whitespace-nowrap">Casas</button>
            <button className="text-gray-400 hover:text-[var(--color-caribbean-dark)] transition-colors pb-2 whitespace-nowrap">Frente al Mar</button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          {projects.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-3xl font-serif text-[var(--color-caribbean-dark)] mb-6">No hay proyectos disponibles en este momento.</h3>
              <p className="text-gray-500 font-light text-lg">Estamos trabajando en nuevos desarrollos. ¡Vuelve pronto!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {projects.map((project: any) => (
                <Link href={`/proyectos/${project.slug}`} key={project.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,45,90,0.1)] transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                  <div className={`relative h-[300px] w-full overflow-hidden ${project.logoUrl ? 'bg-[#F9F8F6]' : ''}`}>
                    <Image 
                      src={project.logoUrl || project.mainImageUrl || project.bannerImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'} 
                      alt={project.name}
                      fill
                      className={project.logoUrl ? "object-contain p-14 transition-transform duration-1000 group-hover:scale-105" : "object-cover transition-transform duration-1000 group-hover:scale-110"}
                    />
                    {!project.logoUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    )}
                    
                    <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${project.logoUrl ? 'bg-[var(--color-caribbean-dark)]/10 text-[var(--color-caribbean-dark)] border border-[var(--color-caribbean-dark)]/20' : 'bg-white/95 text-[var(--color-caribbean-dark)]'}`}>
                      {project.status?.replace('_', ' ') || 'PREVENTA'}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      {!project.logoUrl && (
                        <h3 className="text-3xl font-serif text-white mb-3 group-hover:text-[var(--color-gold-accent)] transition-colors drop-shadow-md">
                          {project.name}
                        </h3>
                      )}
                      <div className={`flex items-center text-xs tracking-[0.15em] ${project.logoUrl ? 'text-[var(--color-caribbean-dark)] font-medium bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-lg inline-flex shadow-sm' : 'text-white/90 drop-shadow-sm'}`}>
                        <PiMapPinLight className="w-4 h-4 mr-1.5" />
                        {project.cityName || 'Colombia'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-10 flex flex-col flex-grow">
                    <p className="text-gray-500 text-sm mb-10 line-clamp-3 font-light leading-relaxed flex-grow">
                      {project.shortDescription || 'Un exclusivo desarrollo inmobiliario pensado para brindarte la mejor calidad de vida y rentabilidad excepcional en ubicaciones premium.'}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Inversión desde</span>
                        <span className="text-2xl font-serif text-[var(--color-caribbean-dark)]">
                          ${project.minPrice ? project.minPrice.toLocaleString() : '105.000.000'} <span className="text-xs font-sans font-light text-gray-400 tracking-widest ml-1">COP</span>
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-caribbean-dark)] group-hover:border-[var(--color-caribbean-dark)] group-hover:text-white transition-all duration-300">
                        <span className="text-xl font-light">&rarr;</span>
                      </div>
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
