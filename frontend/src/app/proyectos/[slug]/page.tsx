import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/api';
import Image from 'next/image';
import PublicFooter from '@/components/PublicFooter';
import Navigation from '@/components/Navigation';
import { PiMapPinLight, PiRulerLight, PiSwimmingPoolLight, PiWhatsappLogoLight } from 'react-icons/pi';

interface PageProps {
  params: { slug: string };
}

// SEO Metadata dinámico
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Proyecto No Encontrado | Grupo AAA' };

  return {
    title: `${project.metaTitle || project.name} | Grupo AAA S.A.S`,
    description: project.metaDescription || project.shortDescription,
    openGraph: {
      title: project.metaTitle || project.name,
      description: project.metaDescription || project.shortDescription,
      images: [project.bannerImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const phone = '573122384172';
  const whatsappUrl = `https://wa.me/${phone}?text=Hola!%20Estoy%20interesado%20en%20el%20proyecto%20${encodeURIComponent(project.name)}.%20¿Me%20podrían%20dar%20más%20información?`;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[80vh] w-full flex items-center justify-center">
        <Image 
          src={project.bannerImageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'} 
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/30">
            {project.statusName || 'PREVENTA'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            {project.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 text-lg mb-8 font-light">
            <PiMapPinLight className="w-5 h-5" />
            {project.address || 'Ubicación Premium, Colombia'}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6 relative z-20 -mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,45,90,0.05)] rounded-[2.5rem] p-8 md:p-14">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Col: Details */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-bold text-[var(--color-caribbean-dark)] mb-6">Sobre el Proyecto</h2>
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed mb-10">
                  <p>{project.longDescription || project.shortDescription || 'Sin descripción disponible.'}</p>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--color-caribbean-dark)] mb-6">Amenidades Exclusivas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Mock Amenities if none exist */}
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <PiSwimmingPoolLight className="w-8 h-8 text-[var(--color-caribbean-blue)] mb-3" />
                    <span className="text-sm font-bold text-gray-700">Club Social</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <PiRulerLight className="w-8 h-8 text-[var(--color-caribbean-blue)] mb-3" />
                    <span className="text-sm font-bold text-gray-700">Lotes XL</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <PiMapPinLight className="w-8 h-8 text-[var(--color-caribbean-blue)] mb-3" />
                    <span className="text-sm font-bold text-gray-700">Vías Pavimentadas</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Pricing & CTA */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-sm border border-[var(--color-gold-accent)]/20 sticky top-32">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Inversión desde</span>
                  <div className="text-4xl font-bold text-[var(--color-caribbean-dark)] tracking-tight mb-8">
                    ${project.minPrice ? project.minPrice.toLocaleString() : '105.000.000'} <span className="text-lg font-light text-gray-400">COP</span>
                  </div>
                  
                  <div className="space-y-4">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[var(--color-caribbean-blue)] hover:bg-[#008CBA] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(0,163,224,0.2)] hover:-translate-y-1 tracking-wider text-sm uppercase">
                      <PiWhatsappLogoLight className="w-5 h-5" />
                      Contactar a Ventas
                    </a>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/public/projects/${project.slug}/brochure`} className="w-full bg-white border border-gray-200 hover:border-gray-300 text-[var(--color-caribbean-dark)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all tracking-wider text-sm uppercase">
                      Descargar Brochure
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
