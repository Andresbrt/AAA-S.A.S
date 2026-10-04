"use client";
import { useEffect, useState } from "react";
import { getAdminProjects, createProject, updateProject, uploadMedia } from "@/lib/api";
import { Loader2, Plus, Building2, MapPin, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', mapUrl: '', status: 'EN_PLANOS', shortDescription: '', featured: true, published: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  const fetchProjects = async (token: string) => {
    try {
      const data = await getAdminProjects(token);
      if (data && data.content) {
        setProjects(data.content);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/portal-asesores";
      return;
    }
    fetchProjects(token);
  }, []);

  const handleCreateSubmit = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setIsSubmitting(true);
    try {
      let projectResponse;
      if (editingId) {
        projectResponse = await updateProject(token, editingId, formData);
      } else {
        projectResponse = await createProject(token, formData);
      }

      if (projectResponse?.id) {
        if (mainImageFile) {
          await uploadMedia(token, mainImageFile, 'MAIN_IMAGE', 'PROJECT', projectResponse.id);
        }
        if (bannerImageFile) {
          await uploadMedia(token, bannerImageFile, 'BANNER_IMAGE', 'PROJECT', projectResponse.id);
        }
        if (logoImageFile) {
          await uploadMedia(token, logoImageFile, 'LOGO', 'PROJECT', projectResponse.id);
        }
        if (galleryFiles && galleryFiles.length > 0) {
          for (let i = 0; i < galleryFiles.length; i++) {
             await uploadMedia(token, galleryFiles[i], 'GALLERY_IMAGE', 'PROJECT', projectResponse.id);
          }
        }
      }

      setIsModalOpen(false);
      setFormData({ name: '', address: '', mapUrl: '', status: 'EN_PLANOS', shortDescription: '', featured: true, published: true });
      setEditingId(null);
      setMainImageFile(null);
      setBannerImageFile(null);
      setLogoImageFile(null);
      setGalleryFiles(null);
      await fetchProjects(token);
    } catch (err) {
      alert("Error al guardar el proyecto. Revisa los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (project: any) => {
    setFormData({
      name: project.name || '',
      address: project.address || project.locationName || '',
      mapUrl: project.mapUrl || '',
      status: project.status || 'EN_PLANOS',
      shortDescription: project.description || project.shortDescription || '',
      featured: project.featured || false,
      published: project.published !== false // default to true if undefined
    });
    setEditingId(project.id);
    setMainImageFile(null);
    setBannerImageFile(null);
    setLogoImageFile(null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ name: '', address: '', mapUrl: '', status: 'EN_PLANOS', shortDescription: '', featured: true, published: true });
    setEditingId(null);
    setMainImageFile(null);
    setBannerImageFile(null);
    setLogoImageFile(null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-xl border border-red-200">
        Error al cargar los proyectos. Intenta recargar la página.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Gestión de Proyectos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra todos los desarrollos inmobiliarios y sus etapas.
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Proyecto
        </button>
      </div>

      {/* Projects Table/Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No hay proyectos</h3>
            <p className="text-slate-500 mt-1">Comienza creando tu primer proyecto inmobiliario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.bannerImageUrl ? (
                          <img src={project.bannerImageUrl} alt={project.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {project.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{project.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                        {project.locationName || 'Sin ubicación'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'EN_PLANOS' || project.status === 'EN_CONSTRUCCION'
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {project.status?.replace('_', ' ') || 'Desconocido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/proyectos/${project.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver en la web">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEditClick(project)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Corales del Viento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. San Bernardo, Córdoba" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
              <input 
                type="text" 
                value={formData.mapUrl} 
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.includes('<iframe') && val.includes('src="')) {
                    const match = val.match(/src="([^"]+)"/);
                    if (match) val = match[1];
                  }
                  setFormData({...formData, mapUrl: val});
                }} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Pega el link o el código <iframe> completo..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="BORRADOR">Borrador</option>
                <option value="EN_PLANOS">En Planos</option>
                <option value="EN_CONSTRUCCION">En Construcción</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="VENDIDO">Vendido</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
            <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Breve descripción para las tarjetas..."></textarea>
          </div>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
              <span className="text-sm font-medium text-gray-700">Público (Visible en la web)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
              <span className="text-sm font-medium text-gray-700">Destacado (Página principal)</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Principal (Tarjeta)</label>
              <input 
                type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner (Fondo del Proyecto)</label>
              <input 
                type="file" accept="image/*" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo del Proyecto (Opcional)</label>
              <input 
                type="file" accept="image/png, image/svg+xml" onChange={(e) => setLogoImageFile(e.target.files?.[0] || null)} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Galería (Múltiples fotos)</label>
              <input 
                type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancelar
            </button>
            <button onClick={handleCreateSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
