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
  LogOut,
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Proyectos", href: "/admin/projects", icon: Building2 },
  { name: "Lotes / Inmuebles", href: "/admin/properties", icon: Home },
  { name: "Multimedia", href: "/admin/media", icon: ImageIcon },
  { name: "Leads (CRM)", href: "/admin/leads", icon: Users },
  { name: "Ajustes", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ 
  isOpen = false, 
  onClose 
}: { 
  isOpen?: boolean; 
  onClose?: () => void; 
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 bg-white w-64 border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AAA Admin
            </span>
          </Link>
          
          {/* Mobile close button */}
          <button 
            onClick={onClose}
            aria-label="Cerrar menú"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Menú Principal
          </p>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
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

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center w-full px-4 py-2.5 text-xs font-semibold text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Ver Sitio Público &rarr;
          </Link>

          <button 
            onClick={() => {
              localStorage.removeItem("admin_token");
              document.cookie = "auth_token=; path=/; max-age=0";
              window.location.href = "/portal-asesores";
            }}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
