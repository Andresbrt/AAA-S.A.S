"use client";
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function ServicesSection() {
  const services = [
    {
      title: 'Estructuración & urbanismo',
      description: 'Selección y desarrollo de tierras con estudios topográficos, red vial afirmada, tendido eléctrico certificado y redes de agua potable garantizadas.',
      badge: '✓ Obras garantizadas',
      icon: '🏛️'
    },
    {
      title: 'Seguridad Jurídica',
      description: 'Bufete jurídico interno propio. Gestionamos desenglobes, saneamiento catastral, paz y salvos y escrituración pública individual inmediata ante notaría.',
      badge: '✓ 100% blindado',
      icon: '⚖️'
    },
    {
      title: 'Construcción Bioclimática',
      description: 'Arquitectura adaptada a la brisa marina caribeña. Ofrecemos modelos de casas campestres llave en mano en madera teca y concreto a la vista.',
      badge: '✓ Llave en mano',
      icon: '📐'
    },
    {
      title: 'Gerencia Inmobiliaria',
      description: 'Asesoramos a inversionistas y fondos familiares en la selección de activos con la mayor tasa interna de retorno (TIR) y plusvalía en el litoral cordobés.',
      badge: '✓ +22% anual',
      icon: '📈'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <section id="servicios" aria-label="Catálogo de servicios inmobiliarios" title="Servicios inmobiliarios y jurídicos de Grupo AAA" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold-accent)]/10 rounded-full blur-[100px] z-0 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-caribbean-blue)]/10 rounded-full blur-[100px] z-0 pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-xs font-bold mb-2" title="Enfoque integral 360 grados">
            CAPACIDAD INTEGRAL 360°
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-caribbean-dark)] mb-4" title="Nuestro portafolio de servicios inmobiliarios">
            Servicios Inmobiliarios y Jurídicos
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-sm md:text-base">
            Grupo AAA S.A.S no solo vende lotes; estructuramos, urbanizamos, saneamos y construimos con estándares de excelencia en todo el Caribe.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {services.map((service, idx) => (
            <motion.div 
              variants={itemVariants}
              key={idx} 
              title={`Servicio: ${service.title}`}
              aria-label={`Información sobre ${service.title}`}
              className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 lg:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full hover:shadow-[0_15px_45px_rgba(0,45,90,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-caribbean-blue)] to-[var(--color-gold-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="text-3xl mb-4 lg:mb-6 bg-gradient-to-br from-blue-50 to-emerald-50 w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--color-caribbean-dark)] mb-4 group-hover:text-[var(--color-caribbean-blue)] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
              <div className="bg-[#E6F7F1] text-[#008A5E] text-xs font-bold px-4 py-2.5 rounded-lg text-center mt-auto border border-[#008A5E]/20 group-hover:bg-[#008A5E] group-hover:text-white transition-colors duration-300 shadow-sm">
                {service.badge}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
