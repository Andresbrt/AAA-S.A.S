"use client";

import { 
  Settings, 
  Save, 
  Loader2, 
  Share2, 
  Type, 
  Link as LinkIcon, 
  Building, 
  Film, 
  UploadCloud, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import { getCompanyInfo, updateCompanySettings, uploadMedia } from "@/lib/api";
import { toast } from "sonner";

const DEFAULT_HERO_VIDEO = "/videos/hero-background.mp4";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Video Upload States
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

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

  const fetchCompanyData = useCallback(async () => {
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
      toast.error("Error al cargar la información de la empresa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleSave = async (customData?: typeof formData) => {
    if (!companyId) return;
    
    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast.error("No estás autenticado. Inicia sesión nuevamente.");
      return;
    }

    const payload = customData || formData;

    try {
      setSaving(true);
      await updateCompanySettings(token, companyId, payload);
      toast.success("Ajustes guardados correctamente. Los cambios ya son visibles en la web.");
    } catch (error: any) {
      console.error("Error saving company data:", error);
      toast.error(error?.message || "Hubo un error al guardar los ajustes.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Video Upload Handlers
  const handleVideoFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Por favor selecciona un archivo de video válido (.mp4, .webm, .mov)");
      return;
    }

    const maxMb = 50;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`El video supera el tamaño máximo permitido de ${maxMb} MB. Por favor optimízalo antes de subir.`);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token || !companyId) {
      toast.error("Sesión no válida. Inicia sesión como administrador.");
      return;
    }

    try {
      setUploadingVideo(true);
      toast.info("Subiendo video al almacenamiento Cloud de Grupo AAA...", { duration: 5000 });

      const res = await uploadMedia(token, file, "VIDEO", "COMPANY", companyId);
      if (res && res.url) {
        const updated = { ...formData, heroVideoUrl: res.url };
        setFormData(updated);
        await updateCompanySettings(token, companyId, updated);
        toast.success("¡Video de encabezado subido y asignado con éxito a la página principal!");
      } else {
        throw new Error("No se obtuvo la URL del archivo subido");
      }
    } catch (err: any) {
      console.error("Error subiendo video:", err);
      toast.error(err?.message || "Error al subir el video al servidor");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleRemoveHeroVideo = async () => {
    if (!confirm("¿Deseas quitar este video y volver al video por defecto del Caribe?")) return;
    const token = localStorage.getItem("admin_token");
    if (!token || !companyId) return;

    const updated = { ...formData, heroVideoUrl: "" };
    setFormData(updated);
    await handleSave(updated);
    toast.success("Video personalizado removido. La web mostrará el video predeterminado.");
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
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-[var(--background)]/90 backdrop-blur-md z-10 py-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Ajustes Globales del Sitio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona la información corporativa, redes y el video del encabezado principal de la web.
          </p>
        </div>
        <button 
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 font-medium cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SECCIÓN 1: Video del Encabezado (Hero Principal) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-600" />
              Video de Fondo del Encabezado (Hero Principal)
            </h3>
            {formData.heroVideoUrl ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Video Personalizado Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Video Predeterminado del Caribe
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 mb-6">
            Este video se reproduce en bucle en el encabezado principal de la página de inicio (detrás del título y la presentación de Grupo AAA).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Visualizador / Preview del Video */}
            <div className="lg:col-span-6 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vista Previa en Vivo
              </label>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                <video
                  key={formData.heroVideoUrl || "default-video"}
                  src={formData.heroVideoUrl || DEFAULT_HERO_VIDEO}
                  poster="/images/hero-poster.jpg"
                  controls
                  playsInline
                  loop
                  muted
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {formData.heroVideoUrl ? "Video del Sitio Activo" : "Video Predeterminado"}
                </div>
              </div>

              {formData.heroVideoUrl && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={formData.heroVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir video en tamaño completo
                  </a>

                  <button
                    type="button"
                    onClick={handleRemoveHeroVideo}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Restaurar video por defecto
                  </button>
                </div>
              )}
            </div>

            {/* Zona de Carga de Archivo & URL Manual */}
            <div className="lg:col-span-6 space-y-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subir Nuevo Video
              </label>

              {/* Input de archivo oculto */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleVideoFile(f);
                }}
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setVideoDragOver(true);
                }}
                onDragLeave={() => setVideoDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setVideoDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleVideoFile(f);
                }}
                onClick={() => {
                  if (!uploadingVideo) videoInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  videoDragOver
                    ? "border-blue-500 bg-blue-50/80 scale-[1.01]"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40"
                } ${uploadingVideo ? "opacity-60 pointer-events-none" : ""}`}
              >
                {uploadingVideo ? (
                  <div className="py-4 space-y-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-800">
                      Subiendo video a la nube...
                    </p>
                    <p className="text-xs text-slate-500">
                      Por favor espera mientras se transfiere y almacena el archivo.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Haz clic para seleccionar o arrastra tu video aquí
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Formatos soportados: <strong>MP4, WebM, MOV</strong>.<br />
                      Tamaño máximo permitido: <strong>50 MB</strong>.
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Elegir archivo de video
                    </button>
                  </>
                )}
              </div>

              {/* Opción alternativa: URL directa */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  O pega una URL directa de video (Opcional)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="heroVideoUrl"
                      value={formData.heroVideoUrl}
                      onChange={handleChange}
                      placeholder="https://... tu-video.mp4"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white font-mono text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium transition-colors shrink-0"
                  >
                    Aplicar URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Puedes utilizar un enlace directo de Supabase, AWS S3, Cloudinary o cualquier CDN.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* SECCIÓN 2: Información de la Empresa */}
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

        {/* SECCIÓN 3: Textos de Bienvenida (Homepage) */}
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
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="Descripción breve bajo el título principal..." />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: Redes Sociales */}
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
