"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Home, 
  Users, 
  Image as ImageIcon, 
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Proyectos", href: "/admin/projects", icon: Building2 },
  { name: "Lotes / Inmuebles", href: "/admin/properties", icon: Home },
  { name: "Multimedia", href: "/admin/media", icon: ImageIcon },
  { name: "Leads (CRM)", href: "/admin/leads", icon: Users },
  { name: "Ajustes", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 bg-white w-64 border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 md:translate-x-0 -translate-x-full">
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          AAA Admin
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Menú Principal
        </p>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <item.icon 
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/portal-asesores";
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
