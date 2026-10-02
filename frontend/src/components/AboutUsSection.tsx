"use client";
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export default function AboutUsSection({ company }: { company: any }) {
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const slideUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideLeft: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="nosotros" aria-label="Información corporativa de Grupo AAA" title="Acerca de nuestra constructora inmobiliaria Grupo AAA" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p variants={slideUp} title="Nuestros valores corporativos" className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-xs font-bold mb-4 bg-blue-50 inline-block px-4 py-1.5 rounded-full border border-blue-100">
              TRAYECTORIA & CONFIANZA
            </motion.p>
            <motion.h2 variants={slideUp} title="Quiénes somos - Grupo AAA S.A.S Constructora" className="text-4xl lg:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6 leading-tight">
              Quiénes Somos · Grupo AAA S.A.S
            </motion.h2>
            <motion.div variants={slideUp} className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6 mb-10">
              <div className="relative pl-6 border-l-2 border-gray-100 hover:border-[var(--color-caribbean-blue)] transition-colors duration-300" title="Misión corporativa de Grupo AAA">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[var(--color-gold-accent)]" />
                <h3 className="font-bold text-[var(--color-caribbean-dark)] mb-2 uppercase tracking-wide text-sm">Misión</h3>
                <p>
                  Desarrollar y comercializar proyectos inmobiliarios que generen valor y bienestar para nuestros clientes, ofreciendo inmuebles con potencial de crecimiento, calidad y ubicación estratégica. Trabajamos con compromiso, transparencia y responsabilidad, acompañando a nuestros clientes durante el proceso de adquisición y construyendo relaciones basadas en la confianza.
                </p>
              </div>
              <div className="relative pl-6 border-l-2 border-gray-100 hover:border-[var(--color-caribbean-blue)] transition-colors duration-300" title="Visión corporativa de Grupo AAA">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[var(--color-caribbean-blue)]" />
                <h3 className="font-bold text-[var(--color-caribbean-dark)] mb-2 uppercase tracking-wide text-sm">Visión</h3>
                <p>
                  Consolidarnos como una empresa referente en el sector inmobiliario, reconocida por la calidad de nuestros proyectos, la confianza de nuestros clientes y nuestra capacidad para identificar y desarrollar oportunidades de inversión. Buscamos crecer de manera sostenible, ampliando nuestro portafolio y contribuyendo al desarrollo de espacios que mejoren la calidad de vida y generen valor a largo plazo.
                </p>
              </div>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div variants={slideUp} className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Estadísticas de la empresa">
              <div className="group bg-gray-50 hover:bg-white rounded-2xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-default hover:-translate-y-1" title="Más de 12 años de trayectoria en el sector inmobiliario">
                <p className="text-2xl font-bold text-[var(--color-caribbean-blue)] mb-1 group-hover:scale-110 transition-transform">+12</p>
                <p className="text-xs text-gray-500 font-medium">Años de<br/>Trayectoria</p>
              </div>
              <div className="group bg-gray-50 hover:bg-white rounded-2xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-default hover:-translate-y-1" title="4 grandes proyectos inmobiliarios entregados en Córdoba">
                <p className="text-2xl font-bold text-[var(--color-caribbean-blue)] mb-1 group-hover:scale-110 transition-transform">+4</p>
                <p className="text-xs text-gray-500 font-medium">Grandes<br/>Proyectos</p>
              </div>
              <div className="group bg-gray-50 hover:bg-white rounded-2xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-default hover:-translate-y-1" title="Más de 180 hectáreas de tierra gestionadas para proyectos campestres">
                <p className="text-2xl font-bold text-[var(--color-caribbean-blue)] mb-1 group-hover:scale-110 transition-transform">+180</p>
                <p className="text-xs text-gray-500 font-medium">Hectáreas<br/>Gestionadas</p>
              </div>
              <div className="group bg-gray-50 hover:bg-white rounded-2xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-default hover:-translate-y-1" title="Garantizamos seguridad jurídica con 100% blindaje notarial en nuestras ventas">
                <p className="text-2xl font-bold text-[var(--color-caribbean-blue)] mb-1 group-hover:scale-110 transition-transform">100%</p>
                <p className="text-xs text-gray-500 font-medium">Blindaje<br/>Notarial</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Image Content */}
          <motion.div 
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,45,90,0.2)] group" title="Fotografía arquitectónica de un condominio campestre de Grupo AAA">
              <Image 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                alt="Condominio campestre moderno desarrollado por Grupo AAA en el Caribe Colombiano"
                title="Proyectos inmobiliarios campestres en Córdoba - Grupo AAA"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002D5A] via-[#002D5A]/40 to-transparent opacity-80 mix-blend-multiply"></div>
            </div>
            
            {/* Floating Quote Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto md:translate-x-0 md:bottom-8 md:-left-12 bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-2xl border-l-4 border-[var(--color-caribbean-blue)] z-10"
              title="Promesa de valor de la Dirección General de Grupo AAA"
            >
              <p className="text-sm italic text-gray-700 mb-3 font-medium">
                &quot;Transformamos la tierra caribeña en un patrimonio seguro para tu familia y tus futuras generaciones.&quot;
              </p>
              <p className="text-xs font-bold text-[var(--color-caribbean-dark)] uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[var(--color-gold-accent)] inline-block"></span>
                Dirección General Grupo AAA
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
