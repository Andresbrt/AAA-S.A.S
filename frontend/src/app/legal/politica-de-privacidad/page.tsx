import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Tratamiento de Datos Personales | Grupo AAA S.A.S.',
  description: 'Conoce nuestra política de protección y tratamiento de datos personales conforme a la Ley 1581 de 2012 (Colombia).',
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-28 pb-20">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          
          <div className="text-center mb-12">
            <p className="text-[var(--color-caribbean-blue)] uppercase tracking-widest text-sm font-semibold mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6">Política de Tratamiento de Datos Personales</h1>
            <p className="text-gray-500">Última actualización: 1 de Octubre de 2026</p>
          </div>

          <div className="prose prose-lg prose-blue max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">1. Introducción</h2>
              <p>
                Dando cumplimiento a la <strong>Ley 1581 de 2012</strong> y al Decreto Reglamentario 1377 de 2013 de la República de Colombia, 
                <strong> GRUPO AAA S.A.S.</strong>, en adelante &quot;La Empresa&quot;, establece la presente Política de Tratamiento de Datos Personales. 
                El objetivo es garantizar el derecho fundamental constitucional al Hábeas Data que tienen todas las personas que nos han suministrado 
                sus datos personales a través de nuestros canales presenciales y digitales (sitio web, formularios de leads, redes sociales).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">2. Finalidad del Tratamiento de Datos</h2>
              <p>
                Los datos personales proporcionados voluntariamente por los clientes, leads e interesados a través de nuestra plataforma, 
                tales como nombres, teléfonos, correos electrónicos y preferencias de proyectos inmobiliarios, serán utilizados para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Proveer información detallada sobre nuestros proyectos inmobiliarios, lotes y parcelaciones.</li>
                <li>Realizar gestiones comerciales, de mercadeo y envío de publicidad relacionada con <em>Corales del Viento</em> y otros proyectos.</li>
                <li>Contactar al titular a través de correo electrónico, WhatsApp o llamadas telefónicas para seguimiento comercial.</li>
                <li>Elaborar perfiles de clientes para ofrecer productos personalizados.</li>
                <li>Evaluar la calidad de nuestros servicios y productos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">3. Derechos del Titular (Hábeas Data)</h2>
              <p>
                De acuerdo con la legislación colombiana, el titular de los datos personales tiene los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales frente a La Empresa.</li>
                <li><strong>Solicitar prueba</strong> de la autorización otorgada para el tratamiento de sus datos.</li>
                <li><strong>Ser informado</strong> sobre el uso que se le ha dado a sus datos personales.</li>
                <li><strong>Revocar la autorización</strong> y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales.</li>
                <li><strong>Acceder en forma gratuita</strong> a sus datos personales que hayan sido objeto de Tratamiento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">4. Autorización y Consentimiento</h2>
              <p>
                Al aceptar los Términos y Condiciones y marcar la casilla de verificación en nuestros formularios de contacto, 
                el usuario otorga de manera libre, previa, expresa e informada, su autorización a <strong>GRUPO AAA S.A.S.</strong> 
                para el tratamiento de sus datos personales bajo las finalidades aquí descritas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">5. Canales de Atención</h2>
              <p>
                Para ejercer sus derechos de actualización, rectificación o supresión de datos, los titulares podrán comunicarse con nosotros a través de:
              </p>
              <div className="bg-[var(--color-caribbean-blue)]/5 p-6 rounded-xl mt-4 border border-[var(--color-caribbean-blue)]/20">
                <p className="mb-2"><strong>Razón Social:</strong> GRUPO AAA S.A.S.</p>
                <p className="mb-2"><strong>Correo Electrónico:</strong> habeasdata@grupoaaa.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--color-caribbean-dark)] mb-4">6. Vigencia</h2>
              <p>
                La presente política rige a partir de su fecha de publicación. Las bases de datos en las que se registrarán los 
                datos personales tendrán una vigencia igual al tiempo en que se mantenga y utilice la información para las finalidades 
                descritas en esta política.
              </p>
            </section>
          </div>
          
          <div className="mt-12 text-center pt-8 border-t border-gray-200">
            <Link href="/" className="inline-block bg-[var(--color-caribbean-blue)] text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              Volver a la página principal
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
