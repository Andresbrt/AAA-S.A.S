"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center px-6 transition-all duration-300">
      
      <div className="flex items-center md:hidden mr-4">
        <button 
          onClick={onToggleSidebar}
          aria-label="Abrir menú de navegación"
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar proyectos, leads..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          aria-label="Notificaciones"
          className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-600 rounded-full"></span>
        </button>
        
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
          A
        </div>
      </div>
    </header>
  );
}
