"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center px-6 transition-all duration-300">
      
      <div className="flex items-center md:hidden mr-4">
        <button className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar proyectos, leads..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ring-2 ring-white">
          A
        </div>
      </div>
    </header>
  );
}
