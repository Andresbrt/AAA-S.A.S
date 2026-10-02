"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

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
          
          {/* Map Simulation */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={slideRight}
            className="w-full lg:w-3/5 h-[350px] md:h-[400px] lg:h-[500px] relative rounded-[2rem] overflow-hidden shadow-inner border border-gray-200 bg-[#E5E3DF]"
            title="Vista satelital de San Bernardo del Viento, Córdoba"
          >
            <Image 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
              alt="Mapa Satelital y vías de acceso a San Bernardo del Viento" 
              title="Geolocalización del proyecto inmobiliario"
              fill
              className="object-cover opacity-80 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2000ms]"
            />
            
            {/* Custom Map Markers & Widgets (Mockup Simulation) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 w-64 border border-[var(--color-caribbean-blue)]/20 z-10"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--color-gold-accent)] rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 rounded-full bg-[var(--color-gold-accent)] animate-ping opacity-75"></div>
              </div>
              <p className="text-xs font-bold text-[var(--color-caribbean-dark)] mb-1 mt-2 text-center">Condominio Corales del Viento</p>
              <p className="text-[10px] text-gray-500 mb-2 text-center">A 150m de la orilla del mar Caribe<br/>San Bernardo del Viento, Córdoba</p>
              <button className="w-full bg-gradient-to-r from-[var(--color-caribbean-blue)] to-[#008CBA] text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition-all">
                📍 Ver Proyecto
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 border border-white flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <span className="text-2xl animate-pulse">☀️</span>
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
            className="w-full lg:w-2/5 bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,45,90,0.08)] p-6 sm:p-8 lg:p-10 border-t-4 border-t-[var(--color-caribbean-blue)] border-x border-b border-gray-100 relative -mt-10 lg:mt-0 lg:-ml-20 z-20"
          >
            <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-[10px] font-bold mb-2">GEORREFERENCIACIÓN EXACTA</p>
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-caribbean-dark)] mb-2">Condominio Corales del Viento</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6">San Bernardo del Viento, Vereda Playas del Viento, Córdoba, Colombia</p>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-emerald-50/80 rounded-xl p-4 flex justify-between items-center mb-8 border border-blue-100/50">
              <p className="text-xs text-gray-600 font-medium">Coordenadas<br/>GPS</p>
              <p className="text-sm font-bold text-[var(--color-caribbean-blue)] text-right tracking-wider">9.354200,<br/>-75.952100</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 group/item">
                <div className="text-xl group-hover/item:scale-125 transition-transform">🏖️</div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">150 metros</p>
                  <p className="text-xs text-gray-500">Acceso a la orilla del mar Caribe</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group/item">
                <div className="text-xl group-hover/item:scale-125 transition-transform">🚗</div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">3,2 km (5 min)</p>
                  <p className="text-xs text-gray-500">Casco Urbano San Bernardo del Viento</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group/item">
                <div className="text-xl group-hover/item:scale-125 transition-transform">🚤</div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">20 minutos en lancha</p>
                  <p className="text-xs text-gray-500">Isla Fuerte (Reserva de coral y buceo)</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group/item">
                <div className="text-xl group-hover/item:scale-125 transition-transform">✈️</div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-caribbean-dark)] group-hover/item:text-[var(--color-caribbean-blue)] transition-colors">85 km (1h 20m)</p>
                  <p className="text-xs text-gray-500">Aeropuerto Los Garzones (Montería)</p>
                </div>
              </div>
            </div>

            <Link href="https://maps.google.com" target="_blank" title="Navegar al proyecto usando Google Maps o Waze" className="w-full bg-white block text-center border-2 border-[var(--color-caribbean-blue)] text-[var(--color-caribbean-blue)] hover:bg-[var(--color-caribbean-blue)] hover:text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_5px_15px_rgba(0,163,224,0.1)] hover:shadow-[0_8px_25px_rgba(0,163,224,0.25)] hover:-translate-y-0.5">
              Abrir en Google Maps / Waze
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
