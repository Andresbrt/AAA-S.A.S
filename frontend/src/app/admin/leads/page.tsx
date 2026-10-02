"use client";
import { useEffect, useState } from "react";
import { getAdminLeads } from "@/lib/api";
import { Loader2, Search, Filter, Users, Mail, Phone, Calendar, ArrowRight } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    getAdminLeads(token)
      .then((data) => {
        if (data && data.content) setLeads(data.content);
      })
      .finally(() => setLoading(false));
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            CRM de Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona los prospectos interesados en tus proyectos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Bandeja Vacía</h3>
            <p className="text-slate-500 mt-1">Aún no tienes clientes interesados registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prospecto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyecto de Interés</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                          {lead.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600 flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {lead.email}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {lead.phone || 'No especificado'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.projectName ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {lead.projectName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Consulta General</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'NEW' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {lead.status === 'NEW' ? 'Nuevo' : lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center font-medium text-sm">
                        Atender
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
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
