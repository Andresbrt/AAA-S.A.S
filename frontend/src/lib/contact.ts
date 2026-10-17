/**
 * Fuente única de verdad para los datos de contacto de Grupo AAA.
 * Todos los botones de WhatsApp y teléfonos del sitio se gestionan desde aquí.
 */
export const COMPANY_WHATSAPP_NUMBER = '573122384172';
export const COMPANY_PHONE_DISPLAY = '+57 312 238 4172';
export const COMPANY_EMAIL = 'info@aaasas.com';

export const DEFAULT_WHATSAPP_MESSAGE = 'Hola, me gustaría recibir más información sobre los proyectos de Grupo AAA.';

/**
 * Normaliza y devuelve el teléfono de la empresa para mostrar.
 * Si la base de datos trae el número provisional de prueba (+57 300 000 0000 o vacío),
 * devuelve automáticamente el número real de la empresa (+57 312 238 4172).
 */
export function getCompanyPhoneDisplay(phone?: string | null): string {
  if (!phone || phone.includes('300 000 0000') || phone.includes('3000000000')) {
    return COMPANY_PHONE_DISPLAY;
  }
  return phone;
}

/** Construye un enlace oficial de WhatsApp con mensaje personalizado. */
export function buildWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
