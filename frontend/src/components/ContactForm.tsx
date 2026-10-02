'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    dataConsent: false,
    honeypot: '' // Anti-spam
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dataConsent) {
      alert("Debes aceptar la política de tratamiento de datos.");
      return;
    }
    
    setStatus('loading');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      await axios.post(`${API_URL}/public/leads`, {
        ...formData,
        origin: 'WEBSITE_CONTACT_FORM'
      });
      
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        dataConsent: false,
        honeypot: ''
      });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10 max-w-2xl mx-auto w-full">
      {status === 'success' && (
        <div className="bg-green-50/80 border border-green-200 text-green-800 p-4 rounded-xl mb-6 text-center">
          <p className="font-medium">¡Gracias por contactarnos!</p>
          <p className="text-sm mt-1">Hemos recibido tu solicitud y un asesor se pondrá en contacto contigo pronto.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50/80 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-center">
          <p className="font-medium">Ocurrió un error</p>
          <p className="text-sm mt-1">Por favor, intenta nuevamente más tarde o contáctanos por WhatsApp.</p>
        </div>
      )}

      {/* HONEYPOT (Invisible para usuarios) */}
      <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-caribbean-blue)] bg-white/50 backdrop-blur-sm transition-all"
            placeholder="Ej. Juan Pérez"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-caribbean-blue)] bg-white/50 backdrop-blur-sm transition-all"
            placeholder="Ej. +57 300 000 0000"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-caribbean-blue)] bg-white/50 backdrop-blur-sm transition-all"
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">¿En qué proyecto estás interesado?</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-caribbean-blue)] bg-white/50 backdrop-blur-sm transition-all resize-none"
          placeholder="Escribe tu mensaje aquí..."
        ></textarea>
      </div>

      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center pt-1">
            <input
              type="checkbox"
              name="dataConsent"
              required
              checked={formData.dataConsent}
              onChange={handleChange}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-[var(--color-caribbean-dark)] checked:bg-[var(--color-caribbean-dark)] hover:shadow-md"
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </div>
          <span className="text-sm text-gray-600 font-light leading-relaxed">
            Autorizo el tratamiento de mis datos personales de acuerdo con la {' '}
            <Link href="/legal/politica-de-privacidad" className="text-[var(--color-caribbean-blue)] underline hover:text-[var(--color-caribbean-dark)] font-medium">
              Política de Tratamiento de Datos (Ley 1581 de 2012)
            </Link>.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-primary-glow flex justify-center items-center py-4 text-lg"
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Enviando...
          </span>
        ) : (
          'Solicitar Asesoría'
        )}
      </button>
    </form>
  );
}
