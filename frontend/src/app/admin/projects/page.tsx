"use client";
import { useEffect, useState } from "react";
import { getAdminProjects } from "@/lib/api";
import { Loader2, Plus, Building2, MapPin, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/portal-asesores";
      return;
    }

    getAdminProjects(token)
      .then((data) => {
        if (data && data.content) {
          setProjects(data.content);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 font-medium">
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
                        project.statusName === 'EN_VENTA' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {project.statusName === 'EN_VENTA' ? 'En Venta' : project.statusName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/proyectos/${project.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver en la web">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
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
    </div>
  );
}
