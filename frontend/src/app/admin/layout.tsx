import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed on desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <Header />
        
        <main className="flex-1 p-6 pt-28 md:p-8 md:pt-28 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
