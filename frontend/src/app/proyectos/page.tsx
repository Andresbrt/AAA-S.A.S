import { Metadata } from 'next';
import { getAllPublicProjects, getCompanyInfo } from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import Image from 'next/image';
import ProjectsCatalog, { ProjectItem } from '@/components/ProjectsCatalog';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Catálogo de Proyectos | Grupo AAA S.A.S',
  description: 'Explora nuestro portafolio de proyectos campestres, residenciales y costeros en Colombia.',
};

export default async function ProyectosPage() {
  const [data, companyData] = await Promise.all([
    getAllPublicProjects(0, 50),
    getCompanyInfo()
  ]);

  const company = companyData?.company || companyData;

  const defaultProjects: ProjectItem[] = [
    {
      id: '8b6c778a-7393-415d-9bb2-ba01dcdf6a41',
      slug: 'corales-del-viento',
      name: 'Condominio Campestre Corales del Viento',
      shortDescription: 'En el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización. Lotes 100% planos con escritura individual.',
      location: 'San Bernardo del Viento, Córdoba',
      mainImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp',
      bannerImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp',
      logoUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/08e535d2-f7e8-4a1b-99e9-1949355cd0a9-LOGO_page-0001.webp',
      minPrice: 260000,
      status: 'PREVENTA',
      tags: ['Frente al Mar', 'Lotes Campestres', 'Portería 24h', 'Piscina']
    }
  ];

  const projects: ProjectItem[] = data.content && data.content.length > 0 ? data.content : defaultProjects;

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
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-sans text-white mb-6 drop-shadow-2xl tracking-tight">
            Nuestros Proyectos
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md">
            Descubre nuestra selección de lotes campestres, condominios y proyectos costeros diseñados para un estilo de vida excepcional.
          </p>
        </div>
      </section>

      {/* Interactive Catalog Component with Live Filter and Search */}
      <ProjectsCatalog initialProjects={projects} />

      <PublicFooter company={company} />
    </main>
  );
}
