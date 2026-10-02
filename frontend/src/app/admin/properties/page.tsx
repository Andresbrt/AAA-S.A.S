"use client";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminPropertiesPage() {
  const [loading, setLoading] = useState(true);

  // Simulating API loading for visual effect
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
            <MapPin className="w-6 h-6 text-blue-600" />
            Gestión de Lotes / Inmuebles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra el inventario interactivo, precios y estados del Master Plan.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Inmueble
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Módulo en construcción</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">
            Estamos conectando este módulo con el nuevo esquema de base de datos de Lotes interactivos (V6).
            Pronto podrás mapear los SVG aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
