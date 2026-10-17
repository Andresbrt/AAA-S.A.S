"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Trash2,
  Film,
  CheckCircle2,
  XCircle,
  FolderOpen,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminProjects, getMedia, uploadMedia, deleteMedia, getCompanyInfo, updateCompanySettings, type MediaFile } from "@/lib/api";
import { compressImageToWebp } from "@/lib/image-utils";
import ImageFramerModal from "@/components/admin/ImageFramerModal";

const MEDIA_TYPES = [
  { value: "GALLERY_IMAGE", label: "Galería", multiple: true },
  { value: "MAIN_IMAGE", label: "Imagen principal", multiple: false },
  { value: "BANNER_IMAGE", label: "Banner / Portada", multiple: false },
  { value: "LOGO", label: "Logo", multiple: false },
] as const;

const TYPE_LABELS: Record<string, string> = {
  GALLERY_IMAGE: "Galería",
  MAIN_IMAGE: "Principal",
  BANNER_IMAGE: "Banner",
  LOGO: "Logo",
  VIDEO: "Video",
  IMAGE: "Imagen",
  PLAN: "Plano",
  BROCHURE: "Brochure",
};

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm";
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 50;

type UploadItem = { name: string; status: "uploading" | "done" | "error"; error?: string };

export default function AdminMediaPage() {
  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [mediaType, setMediaType] = useState<string>("GALLERY_IMAGE");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stagingImages, setStagingImages] = useState<File[] | null>(null);
  const [pendingVideos, setPendingVideos] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUploading = uploads.some((u) => u.status === "uploading");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      window.location.href = "/portal-asesores";
      return;
    }
    setToken(t);
    getAdminProjects(t)
      .then((data) => {
        const list = data?.content ?? [];
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMedia = useCallback(async () => {
    if (!token || !projectId) return;
    setLoadingMedia(true);
    try {
      setFiles(await getMedia(token, "PROJECT", projectId));
    } catch (e: any) {
      toast.error(e?.message || "No se pudieron cargar los archivos");
    } finally {
      setLoadingMedia(false);
    }
  }, [token, projectId]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const executeUpload = async (filesToUpload: File[]) => {
    if (!token || !projectId || filesToUpload.length === 0) return;

    setUploads(filesToUpload.map((f) => ({ name: f.name, status: "uploading" })));
    let ok = 0;

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const isVideo = file.type.startsWith("video/");
      const setStatus = (status: UploadItem["status"], error?: string) =>
        setUploads((prev) => prev.map((u, idx) => (idx === i ? { ...u, status, error } : u)));

      try {
        if (!ACCEPTED.split(",").includes(file.type)) {
          throw new Error(`Formato no soportado (${file.type || "desconocido"})`);
        }
        if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) {
          throw new Error(`El video supera ${MAX_VIDEO_MB} MB`);
        }
        // Las imágenes que vienen del Framer ya están en formato óptimo; si viniera alguna cruda, se asegura compresión
        const toUpload = isVideo ? file : (file.type === "image/webp" ? file : await compressImageToWebp(file, 0.9));
        if (!isVideo && toUpload.size > MAX_IMAGE_MB * 1024 * 1024) {
          throw new Error(`La imagen supera ${MAX_IMAGE_MB} MB`);
        }
        await uploadMedia(token, toUpload, isVideo ? "VIDEO" : mediaType, "PROJECT", projectId);
        setStatus("done");
        ok++;
      } catch (e: any) {
        setStatus("error", e?.message || "Error al subir");
      }
    }

    if (ok > 0) toast.success(`${ok} de ${filesToUpload.length} archivo(s) subido(s)`);
    if (ok < filesToUpload.length) toast.error("Algunos archivos no se pudieron subir");
    if (inputRef.current) inputRef.current.value = "";
    loadMedia();
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    if (!token || !projectId) {
      toast.error("Selecciona un proyecto primero");
      return;
    }
    let selected = Array.from(fileList);
    if (selected.length === 0) return;

    const typeConfig = MEDIA_TYPES.find((t) => t.value === mediaType);
    const hasImages = selected.some((f) => f.type.startsWith("image/"));
    if (typeConfig && !typeConfig.multiple && hasImages) {
      const firstImage = selected.find((f) => f.type.startsWith("image/"))!;
      selected = [firstImage, ...selected.filter((f) => f.type.startsWith("video/"))];
    }

    const images = selected.filter((f) => f.type.startsWith("image/"));
    const videos = selected.filter((f) => f.type.startsWith("video/"));

    if (images.length > 0) {
      setPendingVideos(videos);
      setStagingImages(images);
    } else if (videos.length > 0) {
      executeUpload(videos);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!token || !confirm(`¿Eliminar "${file.originalName}"?`)) return;
    setDeletingId(file.id);
    try {
      await deleteMedia(token, file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success("Archivo eliminado");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [settingHeroId, setSettingHeroId] = useState<string | null>(null);

  const handleCopyUrl = async (file: MediaFile) => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedId(file.id);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleSetHeroVideo = async (file: MediaFile) => {
    if (!token) return;
    setSettingHeroId(file.id);
    try {
      const companyData = await getCompanyInfo();
      if (!companyData || !companyData.company?.id) {
        throw new Error("No se encontró la información de la empresa");
      }
      await updateCompanySettings(token, companyData.company.id, {
        name: companyData.company.name || "GRUPO AAA S.A.S",
        contactEmail: companyData.company.contactEmail || "",
        contactPhone: companyData.company.contactPhone || "",
        whatsappNumber: companyData.company.whatsappNumber || "",
        whatsappMessage: companyData.company.whatsappMessage || "",
        instagramUrl: companyData.company.instagramUrl || "",
        facebookUrl: companyData.company.facebookUrl || "",
        youtubeUrl: companyData.company.youtubeUrl || "",
        heroTitle: companyData.company.heroTitle || "",
        heroSubtitle: companyData.company.heroSubtitle || "",
        heroVideoUrl: file.url,
      });
      toast.success("¡Video asignado como fondo del Hero principal de la web!");
    } catch (e: any) {
      toast.error(e?.message || "Error al asignar video de Hero");
    } finally {
      setSettingHeroId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            Galería Multimedia
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sube fotos y videos de tus proyectos directamente al Cloud (Supabase).
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="media-project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {projects.length === 0 && <option value="">Sin proyectos</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            id="media-type-select"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {MEDIA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>Fotos como: {t.label}</option>
            ))}
          </select>
          <button
            id="media-upload-btn"
            onClick={() => inputRef.current?.click()}
            disabled={!projectId || isUploading}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200 font-medium"
          >
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            {isUploading ? "Subiendo..." : "Subir Archivos"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        id="media-file-input"
        type="file"
        multiple
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
        <div
          id="media-dropzone"
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!isUploading) handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-10 sm:p-12 text-center transition-all cursor-pointer group ${
            dragging ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-slate-200 hover:bg-slate-50 hover:border-blue-300"
          }`}
        >
          <UploadCloud className={`w-12 h-12 mx-auto transition-colors ${dragging ? "text-blue-500" : "text-slate-300 group-hover:text-blue-500"}`} />
          <p className="mt-4 text-sm font-medium text-slate-900">Arrastra tus fotos y videos aquí o haz clic para subir</p>
          <p className="text-xs text-slate-500 mt-1">
            Fotos JPG, PNG, WEBP (máx. {MAX_IMAGE_MB} MB, se optimizan a WEBP) · Videos MP4, MOV, WEBM (máx. {MAX_VIDEO_MB} MB)
          </p>
        </div>

        {uploads.length > 0 && (
          <ul className="mt-6 space-y-2">
            {uploads.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm px-4 py-2 rounded-lg bg-slate-50">
                <span className="truncate text-slate-700">{u.name}</span>
                <span className="flex items-center gap-1 shrink-0">
                  {u.status === "uploading" && <><Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Subiendo</>}
                  {u.status === "done" && <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Listo</>}
                  {u.status === "error" && <><XCircle className="w-4 h-4 text-red-600" /><span className="text-red-600">{u.error}</span></>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Archivos del proyecto</h2>
          <span className="text-sm text-slate-500">{files.length} archivo(s)</span>
        </div>

        {loadingMedia ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-300" />
            <p className="mt-3 text-sm">Este proyecto aún no tiene fotos ni videos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((f) => {
              const isVideo = f.contentType?.startsWith("video/");
              return (
                <div key={f.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  {isVideo ? (
                    <video src={f.url} className="w-full h-full object-cover" muted loop playsInline preload="metadata"
                      onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.url} alt={f.altText || f.originalName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  )}
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-white/90 text-slate-800 shadow-sm z-10">
                    {isVideo && <Film className="w-3 h-3 text-blue-600" />}
                    {TYPE_LABELS[f.mediaType] ?? f.mediaType}
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all z-10">
                    {isVideo && (
                      <button
                        title="Poner como Video de Portada (Hero Principal)"
                        onClick={() => handleSetHeroVideo(f)}
                        disabled={settingHeroId === f.id}
                        className="p-1.5 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        {settingHeroId === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      title="Copiar enlace directo"
                      onClick={() => handleCopyUrl(f)}
                      className="p-1.5 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      {copiedId === f.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => handleDelete(f)}
                      disabled={deletingId === f.id}
                      className="p-1.5 rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-colors"
                    >
                      {deletingId === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs truncate">
                    <p className="font-medium truncate">{f.originalName}</p>
                    <p className="text-[10px] text-white/80">{(f.fileSize / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {stagingImages && stagingImages.length > 0 && (
        <ImageFramerModal
          files={stagingImages}
          onComplete={(processed) => {
            const allFiles = [...processed, ...pendingVideos];
            setStagingImages(null);
            setPendingVideos([]);
            executeUpload(allFiles);
          }}
          onCancel={() => {
            setStagingImages(null);
            setPendingVideos([]);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      )}
    </div>
  );
}
