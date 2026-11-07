"use client";
import { useEffect, useState } from "react";
import { getAdminProjects, createProject, updateProject, uploadMedia, deleteProject, ProjectRequest } from "@/lib/api";
import { Loader2, Plus, Building2, MapPin, Edit3, Trash2, Eye, FileText, UploadCloud, CheckCircle2, ExternalLink, Calculator, Sparkles } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import { toast } from "sonner";
import { compressImageToWebp } from "@/lib/image-utils";

const DEFAULT_FORM_DATA = {
  name: '',
  address: '',
  mapUrl: '',
  status: 'EN_PLANOS',
  shortDescription: '',
  longDescription: '',
  minPrice: '',
  tags: '',
  featured: true,
  published: true,
  hasFinancingCalculator: false,
  reservationAmount: '1000000',
  downPaymentPercentage: '20',
  interestFreeMonths: '12',
  interestMonths: '24',
  monthlyInterestRate: '1'
};

const formatCOP = (val: number): string => {
  return `$${Math.round(val).toLocaleString('es-CO')}`;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [currentBrochureUrl, setCurrentBrochureUrl] = useState<string | null>(null);
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
      let projectId = editingId;
      const payload: ProjectRequest = {
        ...formData,
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        hasFinancingCalculator: Boolean(formData.hasFinancingCalculator),
        reservationAmount: formData.reservationAmount !== '' ? parseFloat(formData.reservationAmount) : 1000000,
        downPaymentPercentage: formData.downPaymentPercentage !== '' ? parseFloat(formData.downPaymentPercentage) : 20,
        interestFreeMonths: formData.interestFreeMonths !== '' ? parseInt(formData.interestFreeMonths, 10) : 12,
        interestMonths: formData.interestMonths !== '' ? parseInt(formData.interestMonths, 10) : 24,
        monthlyInterestRate: formData.monthlyInterestRate !== '' ? parseFloat(formData.monthlyInterestRate) : 1.0,
      };

      if (editingId) {
        await updateProject(token, editingId, payload);
      } else {
        const projectResponse = await createProject(token, payload);
        projectId = projectResponse.id;
        // Si hay un error más adelante, no queremos crear duplicados si el usuario vuelve a intentar
        if (projectId) setEditingId(projectId); 
      }

      if (projectId) {
        try {
          if (mainImageFile) {
            const compressedMain = await compressImageToWebp(mainImageFile);
            await uploadMedia(token, compressedMain, 'MAIN_IMAGE', 'PROJECT', projectId);
          }
          if (bannerImageFile) {
            const compressedBanner = await compressImageToWebp(bannerImageFile);
            await uploadMedia(token, compressedBanner, 'BANNER_IMAGE', 'PROJECT', projectId);
          }
          if (logoImageFile) {
            const compressedLogo = await compressImageToWebp(logoImageFile);
            await uploadMedia(token, compressedLogo, 'LOGO', 'PROJECT', projectId);
          }
          if (brochureFile) {
            await uploadMedia(token, brochureFile, 'BROCHURE', 'PROJECT', projectId, `Brochure ${formData.name}`);
          }
          if (galleryFiles && galleryFiles.length > 0) {
            for (let i = 0; i < galleryFiles.length; i++) {
               const compressedGallery = await compressImageToWebp(galleryFiles[i]);
               await uploadMedia(token, compressedGallery, 'GALLERY_IMAGE', 'PROJECT', projectId);
            }
          }
        } catch (mediaErr: any) {
          toast.warning(`Proyecto guardado, pero falló un archivo multimedia: ${mediaErr?.message || 'Verifica formato y tamaño.'}`, { duration: 8000 });
          console.error("Error al subir archivos:", mediaErr);
        }
      }

      setIsModalOpen(false);
      setFormData(DEFAULT_FORM_DATA);
      setEditingId(null);
      setMainImageFile(null);
      setBannerImageFile(null);
      setLogoImageFile(null);
      setBrochureFile(null);
      setCurrentBrochureUrl(null);
      setGalleryFiles(null);
      await fetchProjects(token);
      toast.success(editingId ? "Proyecto actualizado con éxito" : "Proyecto creado con éxito");
    } catch (err) {
      toast.error("Error al guardar los datos del proyecto. Revisa la información.");
      console.error(err);
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
      longDescription: project.longDescription || '',
      minPrice: project.minPrice ? String(project.minPrice) : '',
      tags: project.tags ? project.tags.join(', ') : '',
      featured: project.featured || false,
      published: project.published !== false, // default to true if undefined
      hasFinancingCalculator: project.hasFinancingCalculator ?? false,
      reservationAmount: project.reservationAmount !== undefined && project.reservationAmount !== null
        ? String(project.reservationAmount)
        : '1000000',
      downPaymentPercentage: project.downPaymentPercentage !== undefined && project.downPaymentPercentage !== null
        ? String(project.downPaymentPercentage)
        : '20',
      interestFreeMonths: project.interestFreeMonths !== undefined && project.interestFreeMonths !== null
        ? String(project.interestFreeMonths)
        : '12',
      interestMonths: project.interestMonths !== undefined && project.interestMonths !== null
        ? String(project.interestMonths)
        : '24',
      monthlyInterestRate: project.monthlyInterestRate !== undefined && project.monthlyInterestRate !== null
        ? String(Number(project.monthlyInterestRate))
        : '1'
    });
    setEditingId(project.id);
    setMainImageFile(null);
    setBannerImageFile(null);
    setLogoImageFile(null);
    setBrochureFile(null);
    setCurrentBrochureUrl(project.brochureUrl || null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData(DEFAULT_FORM_DATA);
    setEditingId(null);
    setMainImageFile(null);
    setBannerImageFile(null);
    setLogoImageFile(null);
    setBrochureFile(null);
    setCurrentBrochureUrl(null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este proyecto y todos sus lotes asociados? Esta acción no se puede deshacer.")) {
      return;
    }
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    try {
      await deleteProject(token, projectId);
      toast.success("Proyecto eliminado con éxito");
      await fetchProjects(token);
    } catch (err) {
      toast.error("Error al eliminar el proyecto.");
      console.error(err);
    }
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

  // Cálculos reactivos para la vista previa de financiamiento
  const previewBasePrice = formData.minPrice && !isNaN(parseFloat(formData.minPrice)) && parseFloat(formData.minPrice) > 0
    ? parseFloat(formData.minPrice)
    : 51030200;

  const calcReservation = formData.reservationAmount !== '' && !isNaN(parseFloat(formData.reservationAmount))
    ? parseFloat(formData.reservationAmount)
    : 1000000;

  const calcDownPaymentPct = formData.downPaymentPercentage !== '' && !isNaN(parseFloat(formData.downPaymentPercentage))
    ? parseFloat(formData.downPaymentPercentage)
    : 20;

  const calcInterestFreeMonths = formData.interestFreeMonths !== '' && !isNaN(parseInt(formData.interestFreeMonths, 10))
    ? parseInt(formData.interestFreeMonths, 10)
    : 12;

  const calcInterestMonths = formData.interestMonths !== '' && !isNaN(parseInt(formData.interestMonths, 10))
    ? parseInt(formData.interestMonths, 10)
    : 24;

  const calcMonthlyRate = formData.monthlyInterestRate !== '' && !isNaN(parseFloat(formData.monthlyInterestRate))
    ? parseFloat(formData.monthlyInterestRate)
    : 1.0;

  const calcTotalDownPayment = previewBasePrice * (calcDownPaymentPct / 100);
  const calcDownPaymentNet = Math.max(0, calcTotalDownPayment - calcReservation);
  const calcFinancedBalance = Math.max(0, previewBasePrice - calcTotalDownPayment);

  const calcQuota12 = calcInterestFreeMonths > 0
    ? Math.round(calcFinancedBalance / calcInterestFreeMonths)
    : 0;

  let calcQuota24 = 0;
  if (calcInterestMonths > 0) {
    const i = calcMonthlyRate / 100;
    if (i === 0) {
      calcQuota24 = Math.round(calcFinancedBalance / calcInterestMonths);
    } else {
      const comp = Math.pow(1 + i, calcInterestMonths);
      calcQuota24 = Math.round(calcFinancedBalance * (i * comp) / (comp - 1));
    }
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
          id="btn-create-project"
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brochure</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} id={`row-${project.id}`} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.mainImageUrl || project.bannerImageUrl ? (
                          <img src={project.mainImageUrl || project.bannerImageUrl} alt={project.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {project.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{project.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{project.description || project.shortDescription}</p>
                          {project.hasFinancingCalculator && (
                            <div className="flex items-center gap-2 mt-1">
                              <span id="table-calc-badge" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Calculator className="w-2.5 h-2.5 text-emerald-600" /> Calculadora Activa
                              </span>
                              {project.reservationAmount && (
                                <span id="table-val-reservation" className="text-[10px] text-slate-500">
                                  Sep: ${Math.round(project.reservationAmount).toLocaleString('es-CO')}
                                </span>
                              )}
                              {project.downPaymentPercentage && (
                                <span id="table-val-dp" className="text-[10px] text-slate-500">
                                  ({project.downPaymentPercentage}%)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                        {project.locationName || project.cityName || 'Sin ubicación'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.brochureUrl ? (
                        <a
                          href={project.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 transition-colors"
                          title="Ver Brochure PDF en Supabase"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          PDF Activo
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          Auto-generado
                        </span>
                      )}
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
                        <button id="btn-edit-project" onClick={() => handleEditClick(project)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(project.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
        maxWidth="max-w-3xl"
      >
        <div id="project-modal" className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inversión Desde (Precio Base COP)</label>
              <input type="number" value={formData.minPrice} onChange={(e) => setFormData({...formData, minPrice: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. 105000000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
            <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Breve descripción para las tarjetas..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga (Sobre el Proyecto)</label>
            <textarea value={formData.longDescription} onChange={(e) => setFormData({...formData, longDescription: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Descripción detallada para la página interna del proyecto..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenidades (Separadas por comas)</label>
            <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Club Social, Lotes XL, Vías Pavimentadas" />
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

          {/* Apartado Calculadora de Financiamiento */}
          <fieldset className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 mt-4">
            <legend className="text-sm font-bold text-slate-800 px-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              Calculadora de Financiamiento
            </legend>

            <div className="mb-3">
              <label className="relative inline-flex items-center cursor-pointer gap-2">
                <input 
                  type="checkbox" 
                  id="hasFinancingCalculator"
                  checked={formData.hasFinancingCalculator} 
                  onChange={(e) => setFormData({...formData, hasFinancingCalculator: e.target.checked})} 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer" 
                />
                <span className="text-sm font-semibold text-slate-700">
                  Habilitar Calculadora Interactiva en la Página Pública
                </span>
              </label>
              <p className="text-xs text-slate-500 ml-6">
                Permite a los usuarios simular planes de pago a 12 (0%) y 24 meses desde la ficha pública del proyecto.
              </p>
            </div>

            <div id="calc-fields-container" className={formData.hasFinancingCalculator ? "space-y-4 pt-2 border-t border-slate-200" : "hidden"}>
              {/* Grid de 5 Campos de Parámetros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="reservationAmount" className="block text-xs font-semibold text-slate-700 mb-1">
                    Valor Separación (COP)
                  </label>
                  <input 
                    type="number" 
                    id="reservationAmount"
                    value={formData.reservationAmount} 
                    onChange={(e) => setFormData({...formData, reservationAmount: e.target.value})} 
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="1000000" 
                  />
                  <span className="text-[10px] text-slate-400">Abona a la cuota inicial</span>
                </div>

                <div>
                  <label htmlFor="downPaymentPercentage" className="block text-xs font-semibold text-slate-700 mb-1">
                    % Cuota Inicial
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      id="downPaymentPercentage"
                      step="0.5"
                      value={formData.downPaymentPercentage} 
                      onChange={(e) => setFormData({...formData, downPaymentPercentage: e.target.value})} 
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-7" 
                      placeholder="20" 
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Total exigido a los 30 días</span>
                </div>

                <div>
                  <label htmlFor="monthlyInterestRate" className="block text-xs font-semibold text-slate-700 mb-1">
                    Tasa Mensual (% MV)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      id="monthlyInterestRate"
                      step="0.1"
                      value={formData.monthlyInterestRate} 
                      onChange={(e) => setFormData({...formData, monthlyInterestRate: e.target.value})} 
                      className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-7" 
                      placeholder="1" 
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Amortización francesa</span>
                </div>

                <div>
                  <label htmlFor="interestFreeMonths" className="block text-xs font-semibold text-slate-700 mb-1">
                    Plazo Sin Interés (Meses)
                  </label>
                  <input 
                    type="number" 
                    id="interestFreeMonths"
                    value={formData.interestFreeMonths} 
                    onChange={(e) => setFormData({...formData, interestFreeMonths: e.target.value})} 
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="12" 
                  />
                  <span className="text-[10px] text-slate-400">Tasa 0% interés fija</span>
                </div>

                <div>
                  <label htmlFor="interestMonths" className="block text-xs font-semibold text-slate-700 mb-1">
                    Plazo Con Interés (Meses)
                  </label>
                  <input 
                    type="number" 
                    id="interestMonths"
                    value={formData.interestMonths} 
                    onChange={(e) => setFormData({...formData, interestMonths: e.target.value})} 
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="24" 
                  />
                  <span className="text-[10px] text-slate-400">Plazo con financiación</span>
                </div>
              </div>

              {/* Tarjeta de Previsualización en Vivo */}
              <div id="admin-live-preview" data-testid="financing-preview" className="rounded-xl border border-blue-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-800">
                      Vista Previa en Vivo (Lote de Referencia: {formatCOP(previewBasePrice)} COP)
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Simulación Reactiva
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center mb-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Separación:</span>
                    <strong id="preview-val-res" className="text-xs font-extrabold text-slate-800">
                      {formatCOP(calcReservation)}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                    <span className="block text-[10px] uppercase font-bold text-blue-600">Inicial 30 días:</span>
                    <strong id="preview-val-dp" className="text-xs font-extrabold text-blue-900">
                      {formatCOP(calcDownPaymentNet)}
                    </strong>
                    <span className="block text-[9px] text-blue-500">({formData.downPaymentPercentage}% - sep)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Saldo a Financiar:</span>
                    <strong id="preview-val-balance" className="text-xs font-extrabold text-slate-800">
                      {formatCOP(calcFinancedBalance)}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center pt-2 border-t border-dashed border-slate-200">
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                    <span id="preview-label-12m" className="block text-[10px] uppercase font-bold text-emerald-700">
                      Cuota {formData.interestFreeMonths || 12} Meses (0%):
                    </span>
                    <strong id="preview-val-q12" className="text-sm font-extrabold text-emerald-800">
                      {formatCOP(calcQuota12)}/mes
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <span id="preview-label-24m" className="block text-[10px] uppercase font-bold text-indigo-700">
                      Cuota {formData.interestMonths || 24} Meses ({formData.monthlyInterestRate || 1}%):
                    </span>
                    <strong id="preview-val-q24" className="text-sm font-extrabold text-indigo-800">
                      {formatCOP(calcQuota24)}/mes
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

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

          {/* Apartado Exclusivo de Brochure PDF con Compresión Automática en Supabase */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                Brochure Oficial del Proyecto (PDF)
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Compresión inteligente en Supabase
              </span>
            </div>

            <div className="relative rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50/60 via-white to-slate-50/60 p-4 hover:border-[#0284C7] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#376F87] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {brochureFile ? brochureFile.name : currentBrochureUrl ? "Brochure PDF cargado actualmente" : "Subir catálogo / brochure en formato PDF"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {brochureFile
                        ? `Tamaño original: ${(brochureFile.size / (1024 * 1024)).toFixed(2)} MB · Se comprimirá automáticamente al guardar`
                        : "Máx. 25 MB. Se optimiza automáticamente antes de almacenarse en Supabase para carga ultrarrápida."}
                    </p>
                    {currentBrochureUrl && !brochureFile && (
                      <a
                        href={currentBrochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline mt-1"
                      >
                        Ver PDF actual <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#376F87] text-white hover:bg-[#2A5669] transition-colors shadow-sm shrink-0">
                  {brochureFile || currentBrochureUrl ? "Cambiar PDF" : "Seleccionar PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button id="btn-cancel" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancelar
            </button>
            <button id="btn-save-project" onClick={handleCreateSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
