"use client";
import { Settings, Save, Loader2, Share2, Type, Link as LinkIcon, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { getCompanyInfo, updateCompanySettings } from "@/lib/api";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    whatsappMessage: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    heroVideoUrl: ""
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const data = await getCompanyInfo();
      if (data && data.company) {
        setCompanyId(data.company.id);
        setFormData({
          name: data.company.name || "",
          contactEmail: data.company.contactEmail || "",
          contactPhone: data.company.contactPhone || "",
          whatsappNumber: data.company.whatsappNumber || "",
          whatsappMessage: data.company.whatsappMessage || "",
          instagramUrl: data.company.instagramUrl || "",
          facebookUrl: data.company.facebookUrl || "",
          youtubeUrl: data.company.youtubeUrl || "",
          heroTitle: data.company.heroTitle || "",
          heroSubtitle: data.company.heroSubtitle || "",
          heroVideoUrl: data.company.heroVideoUrl || ""
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyId) return;
    
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("No estás autenticado. Inicia sesión nuevamente.");
      return;
    }

    try {
      setSaving(true);
      await updateCompanySettings(token, companyId, formData);
      alert("Ajustes guardados correctamente. Los cambios ya son visibles en la página web.");
    } catch (error) {
      console.error("Error saving company data:", error);
      alert("Hubo un error al guardar los ajustes. Revisa la consola.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-[var(--background)]/80 backdrop-blur-md z-10 py-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Ajustes Globales del Sitio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cualquier cambio guardado aquí se reflejará inmediatamente en la página web pública.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Información Básica */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-blue-500" />
            Información de la Empresa
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo de Contacto</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono Fijo / General</label>
                <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número WhatsApp (sin +)</label>
                <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="573001234567" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje Inicial WhatsApp</label>
                <input type="text" name="whatsappMessage" value={formData.whatsappMessage} onChange={handleChange} placeholder="Hola, me gustaría información..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Textos de la Página de Inicio */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Type className="w-5 h-5 text-blue-500" />
            Textos de Bienvenida (Homepage)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título Principal (Hero)</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ej: Vive el lujo en Armonía Natural" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subtítulo (Descripción corta)</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="Descripción breve bajo el título principal..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Video de Fondo (Opcional)</label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <input type="text" name="heroVideoUrl" value={formData.heroVideoUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://... o /video/drone.mp4" />
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-5 h-5 text-blue-500" />
            Redes Sociales (Footer)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
              <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://instagram.com/tu_empresa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
              <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://facebook.com/tu_empresa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
              <input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://youtube.com/c/tu_empresa" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
