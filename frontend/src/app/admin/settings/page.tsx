"use client";
import { Settings, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Ajustes Globales
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configuración general de la empresa, redes sociales y correos de notificación.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-3xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Información Pública de la Empresa</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
            <input type="text" defaultValue="AAA Inmobiliaria" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono Principal</label>
              <input type="text" defaultValue="+57 300 000 0000" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo de Contacto</label>
              <input type="email" defaultValue="contacto@grupoaaa.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
