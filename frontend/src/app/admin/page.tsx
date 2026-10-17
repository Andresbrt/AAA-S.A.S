"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Map, Users, TrendingUp, ImageIcon, MapPin, Loader2, Download } from "lucide-react";
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

  const handleDownloadReport = () => {
    if (!stats) return;
    const now = new Date().toLocaleString("es-CO");
    const csvContent = 
`REPORTE GENERAL - GRUPO AAA INMOBILIARIA
Fecha de generación: "${now}"

Métrica,Valor
Proyectos Activos,${stats.activeProjects ?? 0}
Lotes Disponibles,${stats.availableLots ?? 0}
Lotes Vendidos,${stats.soldLots ?? 0}
Total Lotes Registrados,${(stats.availableLots ?? 0) + (stats.soldLots ?? 0)}
Nuevos Leads (Interesados),${stats.newLeads ?? 0}

ÚLTIMOS LEADS REGISTRADOS:
Nombre,Correo,Teléfono,Estado,Fecha
` + leads.map(l => `"${l.fullName || ''}","${l.email || ''}","${l.phone || ''}","${l.status || ''}","${l.createdAt || ''}"`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_AAA_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="p-6 text-red-600 bg-red-50 rounded-2xl border border-red-100">
        Error al cargar los datos en tiempo real. ¿Tu sesión expiró?{" "}
        <a href="/portal-asesores" className="underline font-bold">Inicia sesión de nuevo</a>.
      </div>
    );
  }

  const statCards = [
    { name: "Proyectos Activos", value: stats?.activeProjects ?? 0, icon: Map, trend: "En plataforma" },
    { name: "Lotes Disponibles", value: stats?.availableLots ?? 0, icon: MapPin, trend: "Listos para venta" },
    { name: "Nuevos Leads", value: stats?.newLeads ?? 0, icon: Users, trend: "Formularios de contacto" },
    { name: "Lotes Vendidos", value: stats?.soldLots ?? 0, icon: TrendingUp, trend: "Total histórico" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard General</h1>
          <p className="text-sm text-slate-500 mt-1">
            Resumen de la actividad de AAA Inmobiliaria (En vivo desde la base de datos)
          </p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Download className="w-4 h-4" />
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
              <span className="text-emerald-600 font-medium">{stat.trend}</span>
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
            <Link href="/admin/leads" className="text-blue-600 text-sm font-medium hover:underline">
              Ver todos en CRM
            </Link>
          </div>
          
          <div className="space-y-4">
            {leads.length === 0 && <p className="text-sm text-gray-500 italic">No hay leads registrados aún.</p>}
            {leads.slice(0, 5).map((lead: any) => {
              const isNew = lead.status === 'NUEVO' || lead.status === 'NEW';
              return (
                <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {lead.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{lead.fullName}</p>
                      <p className="text-xs text-slate-500">{lead.email} - {lead.phone}</p>
                      {lead.projectName && (
                        <p className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full inline-block mt-1">
                          {lead.projectName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isNew 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isNew ? 'Nuevo' : lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/projects"
              className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group"
            >
              <Map className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium text-sm">Crear Nuevo Proyecto</span>
            </Link>
            <Link 
              href="/admin/properties"
              className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group"
            >
              <MapPin className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium text-sm">Registrar Nuevo Lote</span>
            </Link>
            <Link 
              href="/admin/media"
              className="w-full flex items-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-colors border border-slate-100 hover:border-blue-200 group"
            >
              <ImageIcon className="h-5 w-5 mr-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium text-sm">Subir Imágenes</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
