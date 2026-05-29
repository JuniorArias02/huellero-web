import React from 'react';
import { NavLink } from 'react-router-dom';
import { Fingerprint, LayoutDashboard, Database, RefreshCw, Settings, UserSearch, Users } from 'lucide-react';

export function Sidebar({ isOpen }) {
  const menuItems = [
    { path: '/dashboard', label: 'Panel de Control', icon: <LayoutDashboard size={22} /> },
    { path: '/registros', label: 'Historial General', icon: <Database size={22} /> },
    { path: '/directorio', label: 'Directorio de Personal', icon: <Users size={22} /> },
    { path: '/reportes', label: 'Reporte Individual', icon: <UserSearch size={22} /> },
    { path: '/sincronizar', label: 'Sincronización', icon: <RefreshCw size={22} /> },
    { path: '/configuracion', label: 'Configuración', icon: <Settings size={22} /> }
  ];

  return (
    <aside 
      className={`${isOpen ? 'w-[280px]' : 'w-[88px]'} transition-all duration-300 ease-in-out bg-[#090e1a]/95 backdrop-blur-md border-r border-white/[0.04] flex flex-col z-30 relative shadow-[4px_0_24px_rgba(0,0,0,0.5)] shrink-0 overflow-hidden`}
    >
      {/* Glow de fondo superior */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-600/10 blur-3xl pointer-events-none -z-10" />

      {/* Brand / Logo */}
      <div className="h-24 flex items-center border-b border-white/[0.04] px-6">
        <div className="flex items-center min-w-max">
          {/* Icon Container: Always 40px wide to center perfectly in 88px parent (with px-6 = 24px padding) */}
          <div className="w-[40px] flex justify-center shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-30 rounded-xl" />
              <div className="relative p-2 bg-gradient-to-br from-blue-600/20 to-blue-900/40 rounded-xl text-blue-400 border border-blue-500/30">
                <Fingerprint size={24} />
              </div>
            </div>
          </div>
          
          {/* Brand Text */}
          <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 ml-4 w-[140px]' : 'opacity-0 ml-0 w-0'}`}>
            <span className="font-extrabold text-base tracking-widest text-white leading-tight">IPS CLINICAL</span>
            <span className="text-[11px] text-blue-400 font-bold tracking-[0.25em] leading-none mt-1">HOUSE</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-8 space-y-2 overflow-y-auto overflow-x-hidden">
        
        {/* Menu Label */}
        <div className={`text-[10px] font-bold text-slate-500 tracking-wider uppercase px-8 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-10 mb-5' : 'opacity-0 max-h-0 mb-0'}`}>
          Menú Principal
        </div>
        
        {menuItems.map((item) => (
          <div key={item.path} className="px-4">
            <NavLink
              to={item.path}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center px-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative ${
                  isActive
                    ? 'text-blue-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Fondo activo con gradiente y borde */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/5 border border-blue-500/20 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(37,99,235,0.1)]" />
                  )}
                  
                  {/* Icon Container: perfectly spaced */}
                  <div className={`w-[40px] flex justify-center shrink-0 transition-transform duration-300 relative ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  
                  {/* Text Label: Slides in/out smoothly */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out flex whitespace-nowrap items-center ${isOpen ? 'w-[160px] opacity-100 ml-3 translate-x-0' : 'w-0 opacity-0 ml-0 -translate-x-4'}`}>
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          </div>
        ))}
      </nav>
      
    </aside>
  );
}
