import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

/**
 * MainLayout: Contenedor principal de la aplicación.
 * Diseño modular: separa Navbar y Sidebar para mejor mantenibilidad y UX.
 */
export function MainLayout({ children, usuario, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050914] text-slate-100 font-sans">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        
        {/* Navbar Component */}
        <Navbar 
          usuario={usuario} 
          onLogout={onLogout} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Content Body */}
        <main className="flex-1 overflow-hidden relative bg-[#050914]">
          {children}
        </main>
      </div>
    </div>
  );
}
