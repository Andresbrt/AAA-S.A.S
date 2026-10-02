"use client";
import { useEffect, useState } from "react";
import { Map, Users, TrendingUp, ImageIcon, MapPin, Loader2 } from "lucide-react";
import { getDashboardStats, getAdminLeads } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/portal-asesores";
      return;
    }

    Promise.all([
      getDashboardStats(token),
      getAdminLeads(token)
    ]).then(([statsData, leadsData]) => {
      if (statsData) setStats(statsData);
      else setError(true);
      
      if (leadsData && leadsData.content) setLeads(leadsData.content);
      
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error al cargar datos. ¿Tu sesión expiró? <a href="/portal-asesores" className="underline font-bold">Inicia sesión de nuevo</a>.</div>;
  }

  const statCards = [
    { name: "Proyectos Activos", value: stats?.activeProjects || "0", icon: Map, trend: "En plataforma" },
    { name: "Lotes Disponibles", value: stats?.availableLots || "0", icon: MapPin, trend: "Listos para venta" },
    { name: "Nuevos Leads", value: stats?.newLeads || "0", icon: Users, trend: "Formularios de contacto" },
    { name: "Lotes Vendidos", value: stats?.soldLots || "0", icon: TrendingUp, trend: "Total histórico" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard General</h1>
          <p className="text-sm text-slate-500 mt-1">
            Resumen de la actividad de AAA Inmobiliaria (En vivo)
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200">
          Descargar Reporte
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Últimos Leads (Interesados)</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">Ver todos en CRM</button>
          </div>
          
          <div className="space-y-4">
            {leads.length === 0 && <p className="text-sm text-gray-500 italic">No hay leads registrados aún.</p>}
            {leads.map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {lead.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email} - {lead.phone}</p>
                    {lead.projectName && <p className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full inline-block mt-1">{lead.projectName}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${lead.status === 'NEW' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {lead.status === 'NEW' ? 'Nuevo' : lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group">
              <Map className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
              <span className="font-medium text-sm">Crear Nuevo Proyecto</span>
            </button>
            <button className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group">
              <MapPin className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
              <span className="font-medium text-sm">Registrar Nuevo Lote</span>
            </button>
            <button className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group">
              <ImageIcon className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600" />
              <span className="font-medium text-sm">Subir Imágenes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
