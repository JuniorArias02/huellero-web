import React, { useState, useEffect } from 'react';
import { Menu, LogOut, CheckCircle, Timer } from 'lucide-react';

const SessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const obtenerExpiracion = () => {
      const token = localStorage.getItem('asistencia_token');
      if (!token) return 0;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000;
      } catch (e) {
        return 0;
      }
    };

    let exp = obtenerExpiracion();
    if (exp === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = exp - now;
      
      if (diff <= 0) {
        clearInterval(interval);
        window.dispatchEvent(new Event('auth-logout'));
        return;
      }
      
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${mins.toString().padStart(2, '0')}m`);
      } else {
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')} min`);
      }
      setIsExpiring(hours === 0 && mins < 5); // Alerta visual en los últimos 5 min
    }, 1000);

    const handleRefreshed = () => {
      exp = obtenerExpiracion();
    };

    window.addEventListener('auth-token-refreshed', handleRefreshed);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-token-refreshed', handleRefreshed);
    };
  }, []);

  if (!timeLeft) return null;

  return (
    <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${isExpiring ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
      <Timer size={14} />
      <span>{timeLeft}</span>
    </div>
  );
};

export function Navbar({ usuario, onLogout, toggleSidebar }) {
  return (
    <header className="h-24 bg-[#0a0f1d]/60 backdrop-blur-md border-b border-white/[0.04] px-6 md:px-10 flex justify-between items-center z-20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {/* Left part: Hamburger + Title */}
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={toggleSidebar} 
          className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
        >
          <Menu size={24} />
        </button>
        
        <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight drop-shadow-md hidden sm:block">
          Consola de Asistencia
        </h2>
        
        <div className="h-6 w-px bg-white/10 hidden lg:block mx-2"></div>
        
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <CheckCircle size={14} />
          <span>Conexión Biométrico Activa</span>
        </div>

        <SessionTimer />
      </div>

      {/* Right part: User Info & Logout */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex flex-col text-right">
          <span className="font-bold text-slate-100">{usuario}</span>
          <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase mt-0.5">Administrador</span>
        </div>
        
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-white/20">
          {usuario ? usuario.substring(0, 2).toUpperCase() : 'AD'}
        </div>
        
        <div className="h-8 w-px bg-white/10"></div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
          <span className="hidden sm:block text-sm font-bold">Salir</span>
        </button>
      </div>
    </header>
  );
}
