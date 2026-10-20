'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiWhatsappLogoLight, PiFileTextLight, PiMapPinLight } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { buildWhatsAppUrl } from '@/lib/contact';
import { trackLotSelect, trackWhatsAppClick } from '@/lib/analytics';

export interface Lot {
  id: string | number;
  number: string;
  name: string;
  area: number;
  price: number;
  status: string;
  type: string;
  dimensions?: string;
  distance?: string;
  tag?: string;
  image: string;
}

export default function InteractiveMasterPlan({ projectSlug, companyPhone, properties }: { projectSlug?: string, companyPhone?: string, properties?: any[] }) {
  // Map API properties to the expected format. Use floorOrTower as the "type" category (e.g. 150m Playa)
  // and type (LOTE/CASA) as tag if needed.
  const apiLots = properties?.map((p, index) => ({
    id: p.id,
    number: p.name?.replace(/\D/g, '') || String(index + 1).padStart(2, '0'),
    name: p.projectName || 'Proyecto',
    area: p.privateArea || p.builtArea || 0,
    price: p.price || 0,
    status: p.status || 'DISPONIBLE',
    type: p.floorOrTower || (p.type === 'LOTE' ? 'Lote' : p.type),
    dimensions: 'Según Plano',
    distance: p.floorOrTower || '150 - 300 metros',
    tag: p.type === 'LOTE' ? 'Condominio Campestre' : p.type,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
  })) || [];

  // Fallback inventory for Corales del Viento if properties are not yet registered or loading
  const defaultCoralesLots: Lot[] = [
    {
      id: 'lot-01',
      number: '01',
      name: 'Corales del Viento · Manzana A',
      area: 200,
      price: 53825000,
      status: 'DISPONIBLE',
      type: '150m Playa',
      dimensions: '10m x 20m',
      distance: '150 metros a la orilla del mar',
      tag: 'Primera Franja Costera',
      image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/15930ea4-ed64-40d4-8ef2-b88f2c0fd173-IMG_0535.JPG.webp'
    },
    {
      id: 'lot-02',
      number: '02',
      name: 'Corales del Viento · Manzana A',
      area: 180,
      price: 48443200,
      status: 'DISPONIBLE',
      type: '150m Playa',
      dimensions: '9m x 20m',
      distance: '160 metros a la orilla del mar',
      tag: 'Oportunidad Preventa',
      image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/90cfc907-9663-4a13-9c1a-6ac8730269e0-IMG_0536.JPG.webp'
    },
    {
      id: 'lot-03',
      number: '03',
      name: 'Corales del Viento · Manzana A',
      area: 180,
      price: 48443200,
      status: 'VENDIDO',
      type: '150m Playa',
      dimensions: '9m x 20m',
      distance: '170 metros a la orilla del mar',
      tag: 'Adjudicado',
      image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp'
    },
    {
      id: 'lot-04',
      number: '04',
      name: 'Corales del Viento · Manzana B',
      area: 220,
      price: 59200000,
      status: 'DISPONIBLE',
      type: 'Lotes XL',
      dimensions: '11m x 20m',
      distance: '190 metros a la orilla del mar',
      tag: 'Lote Esquinero',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
      id: 'lot-05',
      number: '05',
      name: 'Corales del Viento · Manzana B',
      area: 250,
      price: 67500000,
      status: 'DISPONIBLE',
      type: 'Lotes XL',
      dimensions: '12.5m x 20m',
      distance: '210 metros a la orilla del mar',
      tag: 'Frente a Zona Verde',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'lot-06',
      number: '06',
      name: 'Corales del Viento · Manzana B',
      area: 300,
      price: 81000000,
      status: 'DISPONIBLE',
      type: 'Lotes XL',
      dimensions: '15m x 20m',
      distance: '230 metros a la orilla del mar',
      tag: 'Área Premium',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
      id: 'lot-07',
      number: '07',
      name: 'Corales del Viento · Manzana C',
      area: 180,
      price: 48443200,
      status: 'VENDIDO',
      type: '150m Playa',
      dimensions: '9m x 20m',
      distance: '240 metros a la orilla del mar',
      tag: 'Adjudicado',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
      id: 'lot-08',
      number: '08',
      name: 'Corales del Viento · Manzana C',
      area: 210,
      price: 56500000,
      status: 'DISPONIBLE',
      type: '150m Playa',
      dimensions: '10.5m x 20m',
      distance: '250 metros a la orilla del mar',
      tag: 'Cerca a Club House',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'lot-09',
      number: '09',
      name: 'Corales del Viento · Manzana C',
      area: 240,
      price: 64800000,
      status: 'DISPONIBLE',
      type: 'Lotes XL',
      dimensions: '12m x 20m',
      distance: '260 metros a la orilla del mar',
      tag: 'Lote Familiar',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
      id: 'lot-10',
      number: '10',
      name: 'Corales del Viento · Manzana D',
      area: 190,
      price: 51200000,
      status: 'DISPONIBLE',
      type: '150m Playa',
      dimensions: '9.5m x 20m',
      distance: '280 metros a la orilla del mar',
      tag: 'Vista despejada',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    },
    {
      id: 'lot-11',
      number: '11',
      name: 'Corales del Viento · Manzana D',
      area: 320,
      price: 112369400,
      status: 'DISPONIBLE',
      type: 'Lotes XL',
      dimensions: '16m x 20m',
      distance: '290 metros a la orilla del mar',
      tag: 'Lote Imperial XL',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'lot-12',
      number: '12',
      name: 'Corales del Viento · Manzana D',
      area: 180,
      price: 48443200,
      status: 'VENDIDO',
      type: '150m Playa',
      dimensions: '9m x 20m',
      distance: '300 metros a la orilla del mar',
      tag: 'Adjudicado',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop'
    }
  ];

  const lots: Lot[] = apiLots.length > 0 ? apiLots : defaultCoralesLots;

  const [selectedLot, setSelectedLot] = useState<Lot>(lots.find(l => l.status === 'DISPONIBLE') || lots[0]);
  const [filter, setFilter] = useState('Todos los Lotes');

  // Si no hay lotes, mostramos un mensaje amigable
  if (lots.length === 0) {
    return (
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6">
            <PiMapPinLight className="text-xl" />
            <span>Master Plan</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6">
            Lotes y Disponibilidad
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            El inventario de este proyecto se está actualizando. Pronto podrás ver el master plan interactivo.
          </p>
        </div>
      </section>
    );
  }

  const filteredLots = lots.filter(lot => {
    if (filter === 'Todos los Lotes') return true;
    if (filter === 'Frente a Playa') return lot.type === '150m Playa';
    if (filter === 'Lotes XL') return lot.type === 'Lotes XL' || lot.type === 'Reserva Natural';
    
    // Dynamic fallback for custom types introduced from DB
    return lot.type?.toLowerCase().includes(filter.toLowerCase()) || lot.distance?.toLowerCase().includes(filter.toLowerCase());
  }).sort((a, b) => {
    // Primero ordenar por Disponibilidad (Disponibles arriba, Vendidos abajo)
    if (a.status === 'DISPONIBLE' && b.status === 'VENDIDO') return -1;
    if (a.status === 'VENDIDO' && b.status === 'DISPONIBLE') return 1;
    // Luego ordenar por número de lote para mantener el orden numérico dentro de su categoría
    return parseInt(a.number) - parseInt(b.number);
  });

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M COP`;
  };

  const handleWhatsApp = () => {
    trackWhatsAppClick('masterplan_selected_lot', `Lote ${selectedLot.number}`);
    const message = `Hola, estoy muy interesado en el LOTE #${selectedLot.number} (${selectedLot.name}) por un valor de $${selectedLot.price.toLocaleString()} COP. ¿Me podrían brindar más información?`;
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="mapa-interactivo" className="py-16 lg:py-24 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-caribbean-blue)] uppercase tracking-[0.2em] text-xs font-bold mb-3">
            SALA DE VENTAS VIRTUAL
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6 font-serif">
            Master Plan Interactivo
          </h2>
          <div className="w-16 h-1 bg-[var(--color-gold-accent)] mx-auto mb-6 md:mb-8"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Explora nuestro mapa interactivo. Selecciona la parcela de tu interés para conocer sus dimensiones, ubicación exacta y valor de inversión.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-10 md:mb-14">
          <span className="w-full text-center md:w-auto text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-0">Filtrar por:</span>
          <button onClick={() => setFilter('Todos los Lotes')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Todos los Lotes' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Todos</button>
          <button onClick={() => setFilter('Frente a Playa')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Frente a Playa' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Frente a Playa</button>
          <button onClick={() => setFilter('Lotes XL')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Lotes XL' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Lotes XL</button>
        </div>

        {/* Main Interface */}
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-3 md:p-5 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Left Column: The "Map" Grid */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4 border border-gray-100 rounded-2xl p-3 md:p-5 bg-gray-50 shadow-inner">
            
            {/* Ocean Block */}
            <div className="bg-blue-50 text-blue-700 text-center py-4 rounded-xl font-bold tracking-[0.2em] text-xs border border-blue-100 flex items-center justify-center gap-3">
              🌊 OCÉANO CARIBE · ACCESO A 150m
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[600px] pr-2 pb-4 custom-scrollbar">
              <AnimatePresence>
                {filteredLots.map((lot, index) => (
                  <motion.button 
                    key={lot.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      if (lot.status === 'DISPONIBLE') {
                        setSelectedLot(lot);
                        trackLotSelect(lot.number, lot.area, lot.price);
                      }
                    }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]
                      ${selectedLot?.id === lot.id 
                        ? 'border-[var(--color-gold-accent)] bg-white shadow-[0_10px_30px_rgba(212,175,55,0.15)] scale-[1.02] z-10' 
                        : 'border-gray-200/60 bg-white/40 hover:bg-white'}
                      ${lot.status === 'VENDIDO' 
                        ? 'opacity-40 cursor-not-allowed filter grayscale bg-gray-50 border-gray-100' 
                        : 'hover:border-[var(--color-caribbean-blue)]/50 cursor-pointer hover:shadow-lg'}
                    `}
                  >
                    <p className={`text-[9px] sm:text-[10px] font-bold mb-3 uppercase tracking-widest ${lot.status === 'VENDIDO' ? 'text-gray-400' : 'text-[var(--color-caribbean-blue)]'}`}>{lot.type}</p>
                    <p className="font-bold text-[var(--color-caribbean-dark)] text-lg sm:text-2xl font-serif mb-1">Lote {lot.number}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 font-light tracking-wide">{lot.area} m²</p>
                    
                    {lot.status === 'DISPONIBLE' ? (
                      <>
                        <p className="font-bold text-[var(--color-caribbean-dark)] mb-3 text-sm tracking-wider">{formatPrice(lot.price)}</p>
                        <span className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-emerald-700 tracking-[0.2em] uppercase bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                          DISPONIBLE
                        </span>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-gray-400 mb-3 text-sm line-through tracking-wider">VENDIDO</p>
                        <span className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 
                          VENDIDO
                        </span>
                      </>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-2 pt-5 border-t border-gray-200">
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Disponible</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Club Social</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Vendido</div>
            </div>
          </div>

          {/* Right Column: Details Pane */}
          <AnimatePresence mode="wait">
            {selectedLot && (
              <motion.div 
                key={selectedLot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full lg:w-[45%] flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative"
              >
                
                {/* Image Header */}
                <div className="relative h-64 w-full bg-gray-100">
                  <Image 
                    src={selectedLot.image} 
                    alt={`Lote ${selectedLot.number}`} 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md border border-white/50 text-[var(--color-caribbean-dark)] text-[10px] font-bold uppercase px-4 py-2 rounded-full flex items-center gap-2 tracking-[0.2em] shadow-sm">
                    <span className="text-[var(--color-gold-accent)]">★</span> {selectedLot.tag}
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="text-[var(--color-gold-accent)] font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Lote #{selectedLot.number}</span>
                      <h3 className="text-3xl font-bold text-white font-serif tracking-wide">{selectedLot.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-5 md:p-8 flex flex-col flex-grow relative z-10">
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-100 font-light">
                    Ubicación privilegiada en la primera franja de acceso a la playa de San Bernardo del Viento. Topografía 100% plana, delimitada y lista para construir la villa de sus sueños.
                  </p>

                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                    <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Área Total</span>
                      <span className="font-bold text-[var(--color-caribbean-dark)] text-lg tracking-wide">{selectedLot.area} m²</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Dimensiones</span>
                      <span className="font-medium text-gray-600">{selectedLot.dimensions}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">A la Playa</span>
                      <span className="font-bold text-[var(--color-caribbean-blue)]">{selectedLot.distance}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-start text-sm">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Respaldo Legal</span>
                      <span className="font-medium text-gray-600">Título Notariado e Impuestos al día</span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 mb-10 text-[var(--color-caribbean-dark)] shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden border border-[var(--color-gold-accent)]/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold-accent)]/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col mb-6 pb-6 border-b border-gray-100 relative z-10">
                      <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Inversión Total</span>
                      <span className="text-3xl sm:text-4xl font-serif text-[var(--color-caribbean-dark)] tracking-tight">${selectedLot.price.toLocaleString()} <span className="text-lg font-sans text-gray-400 font-light">COP</span></span>
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <span className="block text-[9px] text-gray-400 mb-1 tracking-[0.2em] uppercase font-bold">Cuota Inicial Sugerida</span>
                        <span className="font-bold text-[var(--color-caribbean-blue)] text-lg tracking-wide">$10.000.000 COP</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-[var(--color-caribbean-dark)] px-4 py-2 rounded-full text-[9px] font-bold text-white tracking-widest uppercase shadow-md">0% Interés</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 mt-auto">
                    <button 
                      onClick={handleWhatsApp}
                      className="w-full bg-[var(--color-caribbean-dark)] hover:bg-[#2b596d] text-white font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-[0_10px_20px_rgba(55,111,135,0.25)] hover:-translate-y-0.5 tracking-wider text-xs md:text-sm uppercase"
                    >
                      <PiWhatsappLogoLight className="w-4 h-4 md:w-5 md:h-5" />
                      APARTAR LOTE AHORA
                    </button>
                    <a href={buildWhatsAppUrl('Hola! Estoy interesado en el proyecto Corales del Viento. ¿Me podrías compartir el plano en PDF con los precios y lotes disponibles?')} target="_blank" rel="noopener noreferrer" className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[var(--color-caribbean-dark)] font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all tracking-wider text-xs md:text-sm uppercase">
                      <PiFileTextLight className="w-4 h-4 md:w-5 md:h-5" />
                      SOLICITAR PLANO Y PRECIOS
                    </a>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,163,224,0.5); }
      `}} />
    </section>
  );
}
