"use client";
import { useEffect, useState } from "react";
import { getAdminProjects, getProperties, createProperty, updateProperty, deleteProperty } from "@/lib/api";
import { MapPin, Plus, Loader2, Edit3, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";

export default function AdminPropertiesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingProps, setFetchingProps] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    type: "LOTE",
    privateArea: "",
    price: "",
    status: "DISPONIBLE",
    floorOrTower: "150 - 300 metros", // Usado como "Ubicación o Distancia"
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/portal-asesores";
      return;
    }
    
    getAdminProjects(token).then(data => {
      if (data && data.content) {
        setProjects(data.content);
        if (data.content.length > 0) {
          setSelectedProjectId(data.content[0].id);
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    setFetchingProps(true);
    getProperties(selectedProjectId).then(data => {
      if (data && data.content) {
        setProperties(data.content);
      } else {
        setProperties([]);
      }
      setFetchingProps(false);
    });
  }, [selectedProjectId]);

  const openCreateModal = () => {
    setFormData({
      projectId: selectedProjectId,
      name: "",
      type: "LOTE",
      privateArea: "",
      price: "",
      status: "DISPONIBLE",
      floorOrTower: "150 - 300 metros"
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prop: any) => {
    setFormData({
      projectId: selectedProjectId,
      name: prop.name || "",
      type: prop.type || "LOTE",
      privateArea: prop.privateArea ? String(prop.privateArea) : "",
      price: prop.price ? String(prop.price) : "",
      status: prop.status || "DISPONIBLE",
      floorOrTower: prop.floorOrTower || "150 - 300 metros"
    });
    setEditingId(prop.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este inmueble?")) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    try {
      await deleteProperty(token, id);
      setProperties(properties.filter(p => p.id !== id));
    } catch(err) {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        privateArea: formData.privateArea ? parseFloat(formData.privateArea) : null,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (editingId) {
        await updateProperty(token, editingId, payload);
      } else {
        await createProperty(token, payload);
      }
      
      setIsModalOpen(false);
      // Refetch
      const res = await getProperties(selectedProjectId);
      if (res && res.content) setProperties(res.content);
    } catch(err) {
      alert("Error al guardar inmueble");
    } finally {
      setIsSubmitting(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Gestión de Lotes / Inmuebles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra el inventario interactivo, precios y estados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button onClick={openCreateModal} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Inmueble
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {fetchingProps ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No hay inmuebles</h3>
            <p className="text-slate-500 mt-1">Este proyecto aún no tiene lotes o inmuebles registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Referencia / Nombre</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ubicación</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Área</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Precio</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">{prop.name}</td>
                    <td className="px-6 py-4 text-slate-600">{prop.type}</td>
                    <td className="px-6 py-4 text-slate-600">{prop.floorOrTower || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{prop.privateArea} m²</td>
                    <td className="px-6 py-4 text-slate-600">
                      {prop.price ? `$${prop.price.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prop.status === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-700' :
                        prop.status === 'VENDIDO' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(prop)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prop.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        title={editingId ? "Editar Inmueble" : "Nuevo Inmueble"}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Ref (Ej. Lote 12)</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Inmueble</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="LOTE">Lote</option>
                <option value="CASA">Casa</option>
                <option value="APARTAMENTO">Apartamento</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / Distancia / Característica (Ej. 150m Playa, Lotes XL)</label>
            <input type="text" value={formData.floorOrTower} onChange={(e) => setFormData({...formData, floorOrTower: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input type="number" value={formData.privateArea} onChange={(e) => setFormData({...formData, privateArea: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="DISPONIBLE">Disponible</option>
              <option value="SEPARADO">Separado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
