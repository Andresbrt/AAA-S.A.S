'use client';
import { useState } from 'react';

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['Todas', 'Legal & Títulos', 'Financiero', 'Servicios & Obras', 'Ubicación'];

  const faqs = [
    {
      question: '¿Los lotes cuentan con escritura pública y matrícula independiente?',
      answer: 'Sí, absolutamente. Todos nuestros proyectos se entregan con escritura pública individual, desenglobe y matrícula inmobiliaria independiente libre de todo gravamen. Somos desarrolladores legales directos.',
      category: 'Legal & Títulos'
    },
    {
      question: '¿Cómo se garantiza el suministro de agua y energía eléctrica?',
      answer: 'Las parcelaciones se entregan con redes de energía eléctrica instaladas (acometida a punto cero del lote) y suministro de agua garantizado, ya sea a través de red de acueducto municipal o pozos profundos propios con planta de tratamiento, dependiendo del proyecto.',
      category: 'Servicios & Obras'
    },
    {
      question: '¿Puedo comprar si estoy reportado en centrales de riesgo o resido en el exterior?',
      answer: 'Sí. Ofrecemos financiación directa sin intermediación bancaria, lo que significa que no revisamos centrales de riesgo (Datacrédito) y los colombianos en el exterior o extranjeros pueden invertir fácilmente con mínimos requisitos.',
      category: 'Financiero'
    },
    {
      question: '¿Hay un tiempo límite para construir o un manual arquitectónico?',
      answer: 'No te obligamos a construir en un tiempo determinado; puedes dejar tu lote como inversión a largo plazo. Sin embargo, para proteger la plusvalía y la estética del condominio, existe un reglamento de propiedad horizontal y lineamientos de fachada (Diseño Bioclimático).',
      category: 'Legal & Títulos'
    },
    {
      question: '¿Qué tan accesible es el acceso a la playa desde mi lote?',
      answer: 'Dependiendo del proyecto. En el caso de Corales del Viento, el mar Caribe está a tan solo 150 metros caminando (2-3 minutos a pie) con acceso directo por vía conformada.',
      category: 'Ubicación'
    }
  ];

  const filteredFaqs = activeCategory === 'Todas' ? faqs : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-24 px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-xs font-bold mb-2 bg-blue-50 inline-block px-4 py-1.5 rounded-full">
            CLARIDAD ABSOLUTA
          </p>
          <h2 className="text-4xl font-bold text-[var(--color-caribbean-dark)] mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-500 mb-8">
            Respuestas claras y fundamentadas a las dudas más comunes de nuestros compradores.
          </p>
          
          {/* Search bar mock */}
          <div className="relative max-w-xl mx-auto mb-10">
            <input 
              type="text" 
              placeholder="¿Qué quieres saber? (ej: escrituras, agua, cuotas, playa...)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-caribbean-blue)] focus:ring-1 focus:ring-[var(--color-caribbean-blue)] text-sm shadow-sm"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-[var(--color-caribbean-dark)] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className={`border ${openIndex === idx ? 'border-[var(--color-caribbean-blue)] shadow-md' : 'border-gray-200'} rounded-2xl overflow-hidden transition-all duration-300`}>
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${openIndex === idx ? 'text-[var(--color-caribbean-blue)]' : 'text-gray-400'}`}>
                    0{idx + 1}
                  </span>
                  <span className={`text-sm md:text-base font-bold ${openIndex === idx ? 'text-[var(--color-caribbean-dark)]' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                </div>
                <span className={`transform transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-[var(--color-caribbean-blue)]' : 'text-gray-400'}`}>
                  ▼
                </span>
              </button>
              
              <div 
                className={`px-6 md:px-14 pb-5 text-gray-500 text-sm leading-relaxed transition-all duration-300 ${openIndex === idx ? 'block' : 'hidden'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">¿Tienes una duda particular que no está listada?</p>
          <a href="https://api.whatsapp.com/send/?phone=573122384172&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-[var(--color-caribbean-blue)] font-bold hover:underline">
            Hablar con un Asesor Jurídico &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
