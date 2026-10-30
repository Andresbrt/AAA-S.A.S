export const dynamic = 'force-dynamic';
export const revalidate = 60;

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProperties, getCompanyInfo } from '@/lib/api';
import Image from 'next/image';
import PublicFooter from '@/components/PublicFooter';
import PublicNavbar from '@/components/PublicNavbar';
import InteractiveMasterPlan from '@/components/InteractiveMasterPlan';
import ProjectGallery from '@/components/ProjectGallery';
import { PiMapPinLight, PiRulerLight, PiSwimmingPoolLight, PiWhatsappLogoLight } from 'react-icons/pi';
import { ShieldCheck, Waves, Sparkles, Flame, Trees, Car, Plane, CheckCircle2, Ruler, MapPin } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/contact';

function getAmenityIcon(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes('portería') || t.includes('seguridad')) return <ShieldCheck className="w-5 h-5 text-sky-600" />;
  if (t.includes('piscina') || t.includes('playa') || t.includes('mar')) return <Waves className="w-5 h-5 text-sky-600" />;
  if (t.includes('juegos') || t.includes('parque')) return <Sparkles className="w-5 h-5 text-sky-600" />;
  if (t.includes('bbq') || t.includes('asador')) return <Flame className="w-5 h-5 text-sky-600" />;
  if (t.includes('verde') || t.includes('ecol')) return <Trees className="w-5 h-5 text-sky-600" />;
  if (t.includes('vía') || t.includes('pavimentada')) return <Car className="w-5 h-5 text-sky-600" />;
  if (t.includes('montería') || t.includes('tolú') || t.includes('aeropuerto') || t.includes('garzones') || t.includes('morrosquillo')) return <Plane className="w-5 h-5 text-sky-600" />;
  if (t.includes('barranquilla') || t.includes('santa marta') || t.includes('isla fuerte') || t.includes('coveñas') || t.includes('conexión') || t.includes('cerca')) return <MapPin className="w-5 h-5 text-sky-600" />;
  return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// SEO Metadata dinámico
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let project = await getProjectBySlug(slug);
  if (!project && (slug === 'corales-del-viento' || slug === 'condominio-campestre-corales-del-viento')) {
    project = {
      name: 'Corales del Viento',
      shortDescription: 'En el caribe colombiano a solo 5 minutos del mar en zona turística de alta valorización.'
    } as any;
  }
  if (!project) return { title: 'Proyecto No Encontrado | Grupo AAA' };

  const ogImage = 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp';

  return {
    title: `${project.metaTitle || project.name} | Grupo AAA S.A.S`,
    description: project.metaDescription || project.shortDescription,
    openGraph: {
      title: project.metaTitle || project.name,
      description: project.metaDescription || project.shortDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `/proyectos/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [fetchedProject, companyData] = await Promise.all([
    getProjectBySlug(slug),
    getCompanyInfo()
  ]);
  let project = fetchedProject;
  const company = companyData?.company || companyData;

  if (!project && (slug === 'corales-del-viento' || slug === 'condominio-campestre-corales-del-viento')) {
    project = {
      id: '8b6c778a-7393-415d-9bb2-ba01dcdf6a41',
      name: 'Condominio Campestre Corales del Viento',
      slug: 'corales-del-viento',
      shortDescription: 'En el caribe colombiano a solo 150 metros del mar (5 min a pie) en zona turística de alta valorización.',
      longDescription: 'Condominio Campestre Corales del Viento te ofrece la oportunidad de construir el hogar de tus sueños en terreno 100% plano, con respaldo de defensa jurídica y escritura individual registrada. Ubicado estratégicamente en San Bernardo del Viento (Córdoba), en el caribe colombiano a solo 150 metros de la orilla del mar (a 5 minutos a pie por la vía de acceso conformada) en zona turística de alta valorización. Cuenta con una conectividad aérea y terrestre privilegiada: a 90 minutos del Aeropuerto Internacional Los Garzones de Montería y a 50 minutos del Aeropuerto Golfo de Morrosquillo en Tolú, con rápida conexión hacia Barranquilla, Santa Marta y Cartagena de Indias, y a minutos de destinos paradisíacos como Isla Fuerte, San Antero y Coveñas. Ofrece portería 24 horas, piscina, juegos infantiles, zona BBQ, amplias zonas verdes y vía principal pavimentada.',
      status: 'EN_VENTAS',
      minPrice: 260000,
      maxPrice: 260000,
      address: 'San Bernardo del Viento, Córdoba',
      cityName: 'San Bernardo del Viento',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23158.58947186937!2d-76.01472060247147!3d9.349420335356847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59bf0031585ccb%3A0x778be77018f3c7ec!2sCondominio%20campestre%20corales%20del%20viento!5e1!3m2!1ses!2sco!4v1793217623126!5m2!1ses!2sco',
      mainImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
      bannerImageUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
      logoUrl: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/08e535d2-f7e8-4a1b-99e9-1949355cd0a9-LOGO_page-0001.webp',
      galleryUrls: [
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lote-mar.jpg',
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/amenities.jpg',
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lote-campestre.jpg',
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/lifestyle.jpg',
        'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp'
      ],
      tags: [
        'Portería 24 horas',
        'Piscina & Club Social',
        'Juegos infantiles',
        'Zona BBQ',
        'Zonas verdes',
        'Vía principal pavimentada',
        'A 150m del mar (5 min a pie)',
        'Aeropuerto Los Garzones (Montería · 90 min)',
        'Aeropuerto Golfo de Morrosquillo (Tolú · 50 min)',
        'Conexión Barranquilla y Santa Marta',
        'Cerca de Isla Fuerte, Coveñas y San Antero'
      ]
    };
  }

  if (!project) {
    notFound();
  }

  const propsData = project.id ? await getProperties(project.id) : null;
  const properties = propsData?.content || [];

  const whatsappUrl = buildWhatsAppUrl(`Hola! Estoy interesado en el proyecto ${project.name} ($260.000/m²). ¿Me podrían brindar asesoría para separar mi lote?`);

  const officialMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23158.58947186937!2d-76.01472060247147!3d9.349420335356847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59bf0031585ccb%3A0x778be77018f3c7ec!2sCondominio%20campestre%20corales%20del%20viento!5e1!3m2!1ses!2sco!4v1793217623126!5m2!1ses!2sco';
  let finalMapUrl = project.mapUrl || officialMapUrl;
  if (finalMapUrl && finalMapUrl.includes('<iframe') && finalMapUrl.includes('src="')) {
    const match = finalMapUrl.match(/src="([^"]+)"/);
    if (match) finalMapUrl = match[1];
  }

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.shortDescription || project.description || 'Condominio Campestre en el Caribe Colombiano',
    url: `https://grupoaaa.com.co/proyectos/${project.slug}`,
    image: project.bannerImageUrl || project.mainImageUrl || 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.cityName || 'San Bernardo del Viento',
      addressRegion: 'Córdoba',
      addressCountry: 'CO'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'COP',
      lowPrice: project.minPrice || 260000,
      availability: 'https://schema.org/InStock'
    }
  };

  // Determinar imagen de fondo del Hero: usar la foto frontal nítida de portería
  const officialFrontPorteria = 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/porteria-frontal.jpg';
  const heroBgImage = (project.bannerImageUrl && !project.bannerImageUrl.toLowerCase().includes('logo') && !project.bannerImageUrl.toLowerCase().includes('0536'))
    ? project.bannerImageUrl
    : officialFrontPorteria;

  const logoDisplay = project.logoUrl || (project.bannerImageUrl?.toLowerCase().includes('logo') ? project.bannerImageUrl : null);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <PublicNavbar variant="transparent-light" />
      
      {/* Hero Section Ultra Lujo */}
      <section className="relative h-[70vh] lg:h-[80vh] w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Background Image en Alta Resolución */}
        <Image 
          src={heroBgImage} 
          alt={project.name}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 scale-105"
          priority
        />
        
        {/* Degradado y overlay para legibilidad cinematográfica */}
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/25 to-black/30"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          {/* Si existe logotipo oficial, dejar EXCLUSIVAMENTE el logo (sin título duplicado y sin badge 'Preventa') */}
          {logoDisplay ? (
            <>
              <div className="relative w-56 h-24 md:w-72 md:h-28 mx-auto mb-6 drop-shadow-2xl">
                <Image 
                  src={logoDisplay}
                  alt={project.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="sr-only">{project.name}</h1>
            </>
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-sans text-white mb-6 drop-shadow-2xl tracking-tight">
              {project.name}
            </h1>
          )}
          
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-light text-white/90 tracking-wide drop-shadow-md">
            <PiMapPinLight className="w-5 h-5 text-[var(--color-gold-accent)]" />
            {project.address || 'San Bernardo del Viento, Córdoba'}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6 relative z-20 -mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(55,111,135,0.08)] rounded-[2.5rem] p-8 md:p-14">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Col: Details */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-bold text-[var(--color-caribbean-dark)] mb-6">Sobre el Proyecto</h2>
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed mb-10">
                  <p>{project.longDescription || project.shortDescription || 'Sin descripción disponible.'}</p>
                </div>
                
                {/* Carrusel de Galería Minimalista */}
                <div className="mb-12">
                  <ProjectGallery images={project.galleryUrls} />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--color-caribbean-dark)] mb-6">Amenidades Exclusivas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag: string, index: number) => (
                      <div key={index} className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50/80 to-white rounded-2xl border border-gray-100 hover:border-sky-200 shadow-sm hover:shadow-md transition-all text-center group">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 group-hover:bg-sky-100/80 text-sky-600 flex items-center justify-center mb-3 transition-colors border border-sky-100/60 shadow-sm">
                          {getAmenityIcon(tag)}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-700 leading-snug">{tag}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50/80 to-white rounded-2xl border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 border border-sky-100/60">
                          <Waves className="w-5 h-5" />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-700">Club Social</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50/80 to-white rounded-2xl border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 border border-sky-100/60">
                          <Ruler className="w-5 h-5" />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-700">Lotes XL</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50/80 to-white rounded-2xl border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 border border-sky-100/60">
                          <Car className="w-5 h-5" />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-700">Vías Pavimentadas</span>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Right Col: Pricing & CTA */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-sm border border-[var(--color-gold-accent)]/20 sticky top-32">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 block">Valor Inversión</span>
                  <div className="text-3xl md:text-4xl font-extrabold font-sans text-[var(--color-caribbean-dark)] tracking-tight tabular-nums mb-2">
                    $260.000 <span className="text-base md:text-lg font-sans font-medium text-gray-500 tracking-normal">el m²</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 font-medium">Terreno 100% plano · Escritura individual</p>
                  
                  <div className="space-y-4">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[var(--color-gold-accent)] hover:bg-[#0369A1] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(2,132,199,0.25)] hover:-translate-y-1 tracking-wider text-sm uppercase">
                      <PiWhatsappLogoLight className="w-5 h-5" />
                      SEPARAR TU LOTE
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

      {/* Ubicación Google Maps - Apartado Dedicado */}
      {finalMapUrl && (
        <section className="py-16 md:py-24 bg-white relative border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6">
                <PiMapPinLight className="text-xl" />
                <span>Ubicación</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6">
                Conoce el Entorno
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Explora el mapa interactivo y descubre las vías de acceso, la cercanía a solo 150 metros de la orilla del mar (a 5 minutos a pie por la vía de acceso conformada) y la ubicación exacta de {project.name}.
              </p>
            </div>
            <div className="w-full h-[500px] md:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-white">
              <iframe 
                src={finalMapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Master Plan */}
      <InteractiveMasterPlan projectSlug={project.slug} properties={properties} />

      <PublicFooter company={company} />
    </main>
  );
}
