"use client";
import { useEffect, useState } from 'react';
import { getCompanyInfo, getFeaturedProjects } from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactForm from '@/components/ContactForm';
import ProjectsPortfolio from '@/components/ProjectsPortfolio';
import ServicesSection from '@/components/ServicesSection';
import AboutUsSection from '@/components/AboutUsSection';
import LocationSection from '@/components/LocationSection';
import FAQSection from '@/components/FAQSection';
import InteractiveMasterPlan from '@/components/InteractiveMasterPlan';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [company, setCompany] = useState<any>(null);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  useEffect(() => {
    getCompanyInfo().then(res => { if (res) setCompany(res) });
    getFeaturedProjects().then(res => { if (res) setFeaturedProjects(res) });
  }, []);

  return (
    <>
      <PublicNavbar />

      <main className="min-h-screen bg-white overflow-x-hidden">

        {/* HERO SECTION CON VIDEO */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />

          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105"
              style={{ filter: "brightness(0.8)" }}
            >
              <source src="https://cdn.coverr.co/videos/coverr-flying-over-a-beautiful-beach-and-ocean-in-mexico-5727/1080p.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20"
          >
            <h2 className="text-[var(--color-gold-accent)] text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6 font-bold drop-shadow-lg bg-black/20 inline-block px-4 md:px-6 py-2 rounded-full backdrop-blur-md border border-[var(--color-gold-accent)]/30">
              {company?.name || 'GRUPO AAA S.A.S.'}
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 tracking-tight drop-shadow-2xl leading-tight font-serif">
              Vive el lujo en <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-gold-accent)]">Armonía Natural</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg lg:text-xl font-medium mb-10 md:mb-12 max-w-2xl mx-auto drop-shadow-lg px-2">
              Descubre parcelaciones campestres exclusivas diseñadas para elevar tu estilo de vida en el Caribe colombiano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#proyectos" className="bg-[var(--color-gold-accent)] text-white hover:bg-[#B89B2F] font-bold text-sm px-8 py-4 rounded-full transition shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                VER PORTAFOLIO
              </Link>
              <a href="https://api.whatsapp.com/send/?phone=573122384172&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md text-white border border-white/50 hover:bg-white hover:text-[var(--color-caribbean-dark)] font-bold text-sm px-8 py-4 rounded-full transition">
                ASESORÍA PERSONAL
              </a>
            </div>
          </motion.div>
        </section>

        {/* 1. PORTAFOLIO DE PROYECTOS */}
        <ProjectsPortfolio projects={featuredProjects} />

        {/* 1.5 PLANO INTERACTIVO DE LOTES */}
        <InteractiveMasterPlan companyPhone={company?.whatsappNumber} />

        {/* 2. SERVICIOS INMOBILIARIOS */}
        <ServicesSection />

        {/* 3. QUIÉNES SOMOS */}
        <AboutUsSection company={company} />

        {/* 4. UBICACIÓN Y CONECTIVIDAD */}
        <LocationSection />

        {/* 5. PREGUNTAS FRECUENTES */}
        <FAQSection />

        {/* 6. CONTACTO / CRM */}
        <section id="contacto" className="py-24 px-6 lg:px-8 bg-[var(--color-caribbean-dark)] relative overflow-hidden">
          {/* Decorative background for contact section */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1577002621008-0130932c510b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-white">
                <p className="text-[var(--color-caribbean-light)] uppercase tracking-widest text-xs font-bold mb-4">
                  Atención Exclusiva
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">Agenda tu Asesoría</h2>
                <p className="text-white/80 text-lg mb-10 font-light leading-relaxed">
                  Déjanos tus datos y uno de nuestros asesores comerciales se pondrá en contacto contigo para brindarte información detallada sobre nuestros proyectos, ubicación exacta y opciones de financiamiento sin intereses.
                </p>

                <div className="space-y-8">
                  {company?.contactPhone && (
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                        📞
                      </div>
                      <div>
                        <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Llámanos</p>
                        <p className="text-xl font-bold">{company.contactPhone}</p>
                      </div>
                    </div>
                  )}
                  {company?.contactEmail && (
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                        ✉️
                      </div>
                      <div>
                        <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Escríbenos</p>
                        <p className="text-lg font-bold">{company.contactEmail}</p>
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

      {/* Floating WhatsApp Button */}
      {company?.whatsappNumber && (
        <WhatsAppButton
          phone={company.whatsappNumber}
          message={company?.whatsappMessage || "Hola, me interesa conocer más sobre el Portafolio de Proyectos de Grupo AAA."}
        />
      )}
    </>
  );
}
