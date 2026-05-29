import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronRight, UserCircle2, Clock } from 'lucide-react';
import { asistenciaApi } from '../services/asistenciaApi';

// Generador de colores consistentes basados en el nombre
const generarColorAvatar = (nombre) => {
  const colores = [
    'from-blue-500 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-rose-400 to-red-600',
    'from-amber-400 to-orange-600',
    'from-purple-500 to-fuchsia-600',
    'from-cyan-400 to-blue-600',
    'from-pink-500 to-rose-600'
  ];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colores[Math.abs(hash) % colores.length];
};

const obtenerIniciales = (nombre) => {
  if (!nombre) return 'U';
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const AvatarEmpleado = ({ emp, avatarColor, initials }) => {
  const [imgError, setImgError] = useState(false);
  const token = localStorage.getItem('asistencia_token');
  const fotoUrl = `http://localhost:8000/api/empleado/${emp.employeeNo}/foto?token=${token}`;

  return (
    <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg border-4 border-[#0a0f1d] z-10 mb-5 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
      {!imgError ? (
        <img 
          src={fotoUrl} 
          alt={emp.nombre} 
          className="w-full h-full object-cover" 
          onError={() => setImgError(true)} 
        />
      ) : (
        <span className="text-3xl font-black text-white drop-shadow-md tracking-tighter">
          {initials}
        </span>
      )}
    </div>
  );
};

export function DirectorioPanel() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await asistenciaApi.obtenerConfiguracion();
        setEmpleados(data.empleados || []);
      } catch (err) {
        console.error("Error al cargar empleados", err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const empleadosFiltrados = empleados.filter(emp => 
    (emp.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
    (emp.employeeNo || '').includes(busqueda)
  );

  return (
    <div className="w-full h-full flex flex-col relative z-10 pt-4">
      {/* Header Fijo */}
      <div className="mb-8 z-20 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 tracking-tight mb-2">
            Directorio del Personal
          </h1>
          <p className="text-slate-400 font-medium text-sm max-w-lg">
            Visualice a todos los miembros registrados en el sistema. Los avatares se generan automáticamente para mantener una estética profesional.
          </p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-[350px] shrink-0">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium placeholder-slate-500 shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold">Cargando directorio...</p>
        </div>
      ) : empleadosFiltrados.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 mt-10">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sin resultados</h2>
          <p className="text-slate-400 text-center">No se encontró personal con esos datos de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-12 animate-fade-in">
          {empleadosFiltrados.map((emp) => {
            const hasCustomRules = emp.jornadas !== null && emp.jornadas !== undefined;
            const avatarColor = generarColorAvatar(emp.nombre || emp.employeeNo);
            const initials = obtenerIniciales(emp.nombre);

            return (
              <div 
                key={emp.employeeNo} 
                className="group relative bg-[#0a0f1d]/60 backdrop-blur-md border border-white/[0.05] hover:border-emerald-500/30 rounded-[2rem] p-6 shadow-xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col items-center text-center"
              >
                {/* Decorative Glow */}
                <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${avatarColor} opacity-5 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none`} />

                <AvatarEmpleado emp={emp} avatarColor={avatarColor} initials={initials} />
                
                {/* Status Indicator (Ahora por fuera para que no se oculte con la imagen) */}
                <div className="absolute top-[100px] right-[40%] translate-x-12 w-6 h-6 bg-[#0a0f1d] rounded-full flex items-center justify-center z-20">
                  <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white truncate w-full mb-1 group-hover:text-emerald-300 transition-colors">
                  {emp.nombre || 'Sin Nombre'}
                </h3>
                <p className="font-mono text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full mb-5 border border-white/5">
                  ID: {emp.employeeNo}
                </p>

                {/* Footer Badges */}
                <div className="w-full mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
                  <div className={`flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2 py-1.5 rounded-lg border ${hasCustomRules ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    <Clock size={12} />
                    <span>{hasCustomRules ? 'Horario Especial' : 'Horario Global'}</span>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
