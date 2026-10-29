import { getCompanyInfo, getFeaturedProjects } from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import ContactForm from '@/components/ContactForm';
import { buildWhatsAppUrl, getCompanyPhoneDisplay } from '@/lib/contact';
import ProjectsPortfolio from '@/components/ProjectsPortfolio';
import ServicesSection from '@/components/ServicesSection';
import AboutUsSection from '@/components/AboutUsSection';
import LocationSection from '@/components/LocationSection';
import FAQSection from '@/components/FAQSection';
import Link from 'next/link';
import { PhoneCall, Mail } from 'lucide-react';
import SocialPopup from '@/components/SocialPopup';
import HeroVideo from '@/components/HeroVideo';
import HeroContent from '@/components/HeroContent';

export const revalidate = 60;

export default async function HomePage() {
  const [companyRes, featuredProjects] = await Promise.all([
    getCompanyInfo(),
    getFeaturedProjects()
  ]);

  const company = companyRes?.company || companyRes;

  return (
    <>
      <PublicNavbar />

      <main className="min-h-screen bg-white overflow-x-hidden">

        {/* HERO SECTION CON VIDEO */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

          <HeroVideo videoUrl={company?.heroVideoUrl} />
          <HeroContent company={company} />

          {/* Subtle scroll down arrow */}
          <Link 
            href="#proyectos" 
            aria-label="Ir al portafolio de proyectos"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors animate-bounce hidden sm:flex flex-col items-center gap-1 text-[10px] tracking-widest uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
          >
            <span>Explorar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </section>

        {/* 1. PORTAFOLIO DE PROYECTOS */}
        <ProjectsPortfolio projects={featuredProjects} />

        {/* 2. SERVICIOS INMOBILIARIOS */}
        <ServicesSection />

        {/* 3. QUIÉNES SOMOS */}
        <AboutUsSection company={company} />

        {/* 4. UBICACIÓN Y CONECTIVIDAD */}
        <LocationSection />

        {/* 5. PREGUNTAS FRECUENTES */}
        <FAQSection />

        {/* 6. CONTACTO / CRM */}
        <section id="contacto" className="py-24 px-6 lg:px-8 bg-[var(--color-caribbean-dark)] relative overflow-hidden" aria-labelledby="contacto-heading">
          {/* Decorative background for contact section */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1577002621008-0130932c510b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" aria-hidden="true" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-white">
                <p className="text-[var(--color-caribbean-light)] uppercase tracking-widest text-xs font-bold mb-4">
                  Atención Exclusiva
                </p>
                <h2 id="contacto-heading" className="text-4xl lg:text-5xl font-bold mb-6">Agenda tu Asesoría</h2>
                <p className="text-white/80 text-lg mb-10 font-light leading-relaxed">
                  Déjanos tus datos y uno de nuestros asesores comerciales se pondrá en contacto contigo para brindarte información detallada sobre nuestros proyectos, ubicación exacta y opciones de financiamiento sin intereses.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[var(--color-gold-accent)] border border-white/20 shadow-inner" aria-hidden="true">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Llámanos o Escríbenos</p>
                      <a 
                        href={buildWhatsAppUrl('Hola! Me gustaría comunicarme telefónicamente o por WhatsApp con Grupo AAA.')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xl font-bold hover:text-[var(--color-gold-accent)] transition-colors focus:outline-none focus:underline"
                        aria-label={`Llamar o escribir al teléfono ${getCompanyPhoneDisplay(company?.contactPhone)}`}
                      >
                        {getCompanyPhoneDisplay(company?.contactPhone)}
                      </a>
                    </div>
                  </div>
                  {company?.contactEmail && (
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[var(--color-gold-accent)] border border-white/20 shadow-inner" aria-hidden="true">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Escríbenos</p>
                        <a 
                          href={`mailto:${company.contactEmail}`}
                          className="text-lg font-bold hover:text-[var(--color-gold-accent)] transition-colors focus:outline-none focus:underline"
                        >
                          {company.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter company={company} />
      <SocialPopup />
    </>
  );
}
