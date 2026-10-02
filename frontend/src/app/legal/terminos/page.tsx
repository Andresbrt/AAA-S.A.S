import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

export const metadata = {
  title: 'Términos y Condiciones | Grupo AAA S.A.S',
  description: 'Términos y condiciones de uso del portal web y servicios inmobiliarios de Grupo AAA S.A.S.',
};

export default function TerminosPage() {
  return (
    <>
      <div className="bg-[var(--color-caribbean-dark)] pb-20">
        <PublicNavbar />
      </div>

      <main className="min-h-screen bg-gray-50 py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-caribbean-dark)] mb-8 font-serif">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 text-sm md:text-base leading-relaxed space-y-6">
            <p><strong>Última actualización:</strong> Octubre 2026</p>
            
            <p>
              Bienvenido al sitio web de <strong>Grupo AAA S.A.S (NIT: 901599132)</strong>. Al acceder y navegar por este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestro sitio web.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-caribbean-dark)] mt-8 mb-4">1. Naturaleza de la Información Inmobiliaria</h2>
            <p>
              Toda la información contenida en este sitio web, incluyendo renders, planos, áreas, precios, especificaciones y amenidades, es de carácter estrictamente <strong>ilustrativo e informativo</strong>. Grupo AAA S.A.S. se reserva el derecho de modificar dichos elementos sin previo aviso según las directrices técnicas, arquitectónicas, legales y comerciales aplicables. 
            </p>
            <p>
              Los precios de preventa y venta expuestos en la web (ej. &quot;Desde $50,000,000 COP&quot;) son precios base. El precio definitivo dependerá de la disponibilidad, ubicación, área final del lote y etapa de ventas al momento de la legalización comercial de la oferta.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-caribbean-dark)] mt-8 mb-4">2. Propiedad Intelectual</h2>
            <p>
              El contenido, diseño, textos, gráficos, logotipos, imágenes, audios y software incluidos en este sitio web son propiedad exclusiva de <strong>Grupo AAA S.A.S.</strong> y están protegidos por las leyes de propiedad intelectual y derechos de autor vigentes en la República de Colombia y tratados internacionales. Queda estrictamente prohibida su reproducción, distribución o modificación sin autorización expresa y por escrito de la compañía.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-caribbean-dark)] mt-8 mb-4">3. Reservas y Pagos</h2>
            <p>
              Las solicitudes de información o clics en &quot;Apartar Lote&quot; no constituyen, bajo ninguna circunstancia, un contrato vinculante ni garantizan el congelamiento del precio o separación oficial de un inmueble. La separación oficial de un lote requiere la firma de un formato de separación, la presentación de la documentación requerida (SARLAFT) y el pago de la cuota de separación en las cuentas bancarias oficiales a nombre de Grupo AAA S.A.S. (NIT: 901599132).
            </p>

            <h2 className="text-xl font-bold text-[var(--color-caribbean-dark)] mt-8 mb-4">4. Exención de Responsabilidad</h2>
            <p>
              El sitio web y sus componentes se ofrecen &quot;tal cual&quot;. Grupo AAA S.A.S. no se hace responsable de daños directos o indirectos derivados de interrupciones del servicio, errores tipográficos o alteraciones externas (hackeos).
            </p>

            <h2 className="text-xl font-bold text-[var(--color-caribbean-dark)] mt-8 mb-4">5. Legislación Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen bajo las leyes de la República de Colombia. Cualquier disputa relacionada con estos términos será sometida a la jurisdicción de los tribunales colombianos competentes.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
