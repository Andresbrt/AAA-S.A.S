"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Sun, Waves, Car, Compass, Plane, ArrowUpRight, Navigation } from 'lucide-react';

export default function LocationSection() {
  const slideUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="ubicacion" aria-label="Información de ubicación del proyecto" title="Ubicación estratégica en el Caribe Colombiano" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--color-caribbean-blue)]/5 rounded-full blur-[100px] z-0 pointer-events-none -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={slideUp}
          className="text-center mb-16"
        >
          <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-xs font-bold mb-2" title="Clima tropical garantizado">
            ENTORNO CARIBEÑO
          </p>
          <h2 className="text-4xl font-bold text-[var(--color-caribbean-dark)] mb-4" title="Conectividad y Vías de Acceso al Condominio">
            Ubicación & Conectividad
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            San Bernardo del Viento, Córdoba: una de las bahías más protegidas, tranquilas y de mayor potencial del norte colombiano.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 bg-gray-50/50 rounded-3xl lg:rounded-[2.5rem] p-3 sm:p-5 lg:p-10 border border-gray-100 relative group">
          
          {/* Map Real Google Maps */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={slideRight}
            className="w-full lg:w-3/5 h-[380px] md:h-[440px] lg:h-[540px] relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-200 bg-[#E5E3DF]"
            title="Mapa interactivo y vías de acceso de Condominio Corales del Viento"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23158.58947186937!2d-76.01472060247147!3d9.349420335356847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e59bf0031585ccb%3A0x778be77018f3c7ec!2sCondominio%20campestre%20corales%20del%20viento!5e1!3m2!1ses!2sco!4v1793217623126!5m2!1ses!2sco"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación oficial en Google Maps"
              className="w-full h-full"
            />
            
            {/* Overlay badge de clima */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2.5 sm:p-3 border border-white flex items-center gap-2.5 pointer-events-none z-10"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-caribbean-dark)]">28°C - Soleado</p>
                <p className="text-[10px] text-[var(--color-caribbean-blue)]">Brisa Marina: 18 km/h NE - Oleaje Suave</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Info Card */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={scaleUp}
            className="w-full lg:w-2/5 bg-white rounded-3xl shadow-[0_15px_50px_rgba(55,111,135,0.08)] p-6 sm:p-8 lg:p-10 border-t-4 border-t-[var(--color-caribbean-blue)] border-x border-b border-gray-100 relative -mt-10 lg:mt-0 lg:-ml-20 z-20"
          >
            <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-[10px] font-bold mb-2">GEORREFERENCIACIÓN EXACTA</p>
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-caribbean-dark)] mb-2">Condominio Corales del Viento</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6">San Bernardo del Viento, Vereda Playas del Viento, Córdoba, Colombia</p>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-emerald-50/80 rounded-xl p-4 flex justify-between items-center mb-6 border border-blue-100/50">
              <p className="text-xs text-gray-600 font-medium">Coordenadas<br/>GPS</p>
              <p className="text-sm font-bold text-[var(--color-caribbean-blue)] text-right tracking-wider">9.354200,<br/>-75.952100</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3.5 group/item">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100/80 shadow-sm group-hover/item:scale-110 transition-transform">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">150 metros (5 min a pie)</p>
                  <p className="text-[11px] text-gray-500">Distancia exacta a la orilla del mar por la vía de acceso conformada</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group/item">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80 shadow-sm group-hover/item:scale-110 transition-transform">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">Aeropuerto Golfo de Morrosquillo (Tolú)</p>
                  <p className="text-[11px] text-gray-500">A solo 50 minutos de conexión aérea</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group/item">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 shadow-sm group-hover/item:scale-110 transition-transform">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">Aeropuerto Internacional Los Garzones (Montería)</p>
                  <p className="text-[11px] text-gray-500">A 90 minutos con vuelos nacionales e internacionales</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 group/item">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/80 shadow-sm group-hover/item:scale-110 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">Destinos Cercanos & Conectividad</p>
                  <p className="text-[11px] text-gray-500">Isla Fuerte (20 min en lancha), San Antero, Coveñas, Barranquilla y Santa Marta</p>
                </div>
              </div>
            </div>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=9.354200,-75.952100" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Navegar al proyecto usando Google Maps o Waze" 
              className="w-full bg-white flex items-center justify-center gap-2 border-2 border-[var(--color-caribbean-blue)] text-[var(--color-caribbean-blue)] hover:bg-[var(--color-caribbean-blue)] hover:text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_5px_15px_rgba(0,163,224,0.1)] hover:shadow-[0_8px_25px_rgba(0,163,224,0.25)] hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir en Google Maps / Waze</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
