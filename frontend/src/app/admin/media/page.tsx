"use client";
import { Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminMediaPage() {
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
            <ImageIcon className="w-6 h-6 text-blue-600" />
            Galería Multimedia
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sube y administra imágenes de tus proyectos directamente al Cloud (Supabase).
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium">
          <UploadCloud className="w-4 h-4 mr-2" />
          Subir Archivos
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-8">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer group">
          <UploadCloud className="w-12 h-12 text-slate-300 mx-auto group-hover:text-blue-500 transition-colors" />
          <p className="mt-4 text-sm font-medium text-slate-900">Arrastra tus fotos aquí o haz clic para subir</p>
          <p className="text-xs text-slate-500 mt-1">Soporta JPG, PNG, WEBP (Max 5MB)</p>
        </div>
      </div>
    </div>
  );
}
