'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiMapPinLight, PiMagnifyingGlassLight } from 'react-icons/pi';
import { X, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  location?: string;
  cityName?: string;
  mainImageUrl?: string;
  bannerImageUrl?: string;
  logoUrl?: string;
  minPrice?: number;
  status?: string;
  tags?: string[];
}

export default function ProjectsCatalog({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['Todos', 'Frente al Mar', 'Lotes Campestres', 'En Desarrollo'];

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Category Filter
      const tags = (project.tags || []).map(t => t.toLowerCase());
      const desc = (project.shortDescription || '').toLowerCase();
      const name = (project.name || '').toLowerCase();

      let matchesCategory = true;
      if (activeCategory === 'Frente al Mar') {
        matchesCategory = tags.includes('frente al mar') || tags.includes('frente a playa') || desc.includes('mar') || desc.includes('playa') || desc.includes('costero');
      } else if (activeCategory === 'Lotes Campestres') {
        matchesCategory = tags.includes('campestre') || desc.includes('campestre') || name.includes('campestre') || tags.includes('lotes');
      } else if (activeCategory === 'En Desarrollo') {
        matchesCategory = project.status === 'EN_DESARROLLO' || project.status === 'EN_PLANOS' || tags.includes('desarrollo') || tags.includes('preventa');
      }


      // 2. Search Filter
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        name.includes(term) || 
        desc.includes(term) || 
        (project.cityName || '').toLowerCase().includes(term) ||
        (project.location || '').toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchTerm]);

  return (
    <>
      {/* Sticky Interactive Filters & Search */}
      <section className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide text-xs uppercase tracking-widest font-semibold items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[var(--color-caribbean-dark)] text-white shadow-md shadow-[var(--color-caribbean-dark)]/20 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Buscar proyecto o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 md:py-2.5 rounded-full border border-gray-200 text-base sm:text-xs focus:outline-none focus:border-[var(--color-caribbean-blue)] focus:ring-2 focus:ring-[var(--color-caribbean-blue)]/20 bg-gray-50 transition-all"
              />
              <PiMagnifyingGlassLight className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 rounded-full"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-10 text-xs uppercase tracking-wider text-gray-500 font-medium">
            <span>
              {filteredProjects.length === 1 
                ? '1 Proyecto Exclusivo Encontrado' 
                : `${filteredProjects.length} Proyectos Exclusivos`}
            </span>
            {(activeCategory !== 'Todos' || searchTerm) && (
              <button 
                onClick={() => { setActiveCategory('Todos'); setSearchTerm(''); }}
                className="text-[var(--color-caribbean-blue)] hover:underline font-bold"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto p-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[var(--color-caribbean-blue)] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Compass className="w-8 h-8 text-[var(--color-caribbean-blue)]" />
              </div>
              <h3 className="text-2xl font-sans font-bold text-[var(--color-caribbean-dark)] mb-3">
                No encontramos proyectos con esos criterios
              </h3>
              <p className="text-gray-500 font-light text-sm mb-6 leading-relaxed">
                Prueba buscando por otra categoría o término como "Caribe", "Playa" o "San Bernardo".
              </p>
              <button
                onClick={() => { setActiveCategory('Todos'); setSearchTerm(''); }}
                className="btn-primary-glow text-sm"
              >
                Ver Todos los Proyectos
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12"
            >
              <AnimatePresence>
                {filteredProjects.map((project: ProjectItem) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link 
                      href={`/proyectos/${project.slug}`} 
                      prefetch={true}
                      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(55,111,135,0.15)] transition-all duration-500 hover:-translate-y-3 border border-gray-100 h-full"
                    >
                      <div className={`relative h-[300px] w-full overflow-hidden ${project.logoUrl ? 'bg-[#F9F8F6]' : 'bg-slate-900'}`}>
                        <Image 
                          src={project.logoUrl || project.mainImageUrl || project.bannerImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'} 
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                            <h3 className="text-2xl font-sans font-bold text-white mb-2 group-hover:text-[var(--color-gold-accent)] transition-colors drop-shadow-md">
                              {project.name}
                            </h3>
                          )}
                          <div className={`flex items-center text-xs tracking-[0.15em] ${project.logoUrl ? 'text-[var(--color-caribbean-dark)] font-medium bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-lg inline-flex shadow-sm' : 'text-white/90 drop-shadow-sm'}`}>
                            <PiMapPinLight className="w-4 h-4 mr-1.5 text-[var(--color-gold-accent)]" />
                            {project.location || project.cityName || 'Córdoba, Colombia'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-grow">
                        <p className="text-gray-500 text-sm mb-8 line-clamp-3 font-light leading-relaxed flex-grow">
                          {project.shortDescription || 'Un exclusivo desarrollo inmobiliario pensado para brindarte la mejor calidad de vida y rentabilidad excepcional en ubicaciones premium.'}
                        </p>
                        
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                          <div>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Valor Metro Cuadrado</span>
                            <span className="text-2xl font-sans font-extrabold text-[var(--color-caribbean-dark)] tracking-tight tabular-nums">
                              $260.000 <span className="text-xs font-sans font-semibold text-gray-400 tracking-wider ml-1">COP / m²</span>
                            </span>
                          </div>
                          <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-caribbean-dark)] group-hover:border-[var(--color-caribbean-dark)] group-hover:text-white transition-all duration-300">
                            <span className="text-lg font-light">&rarr;</span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>
    </>
  );
}
