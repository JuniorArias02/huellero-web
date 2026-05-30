import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronRight, UserCircle2, Clock, UploadCloud, Edit2, Check, X } from 'lucide-react';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AvatarEmpleado = ({ emp, avatarColor, initials }) => {
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [version, setVersion] = useState(Date.now());
  const [fotoUrl, setFotoUrl] = useState(null);
  const token = localStorage.getItem('asistencia_token');

  useEffect(() => {
    let objectUrl = null;
    const fetchFoto = async () => {
      try {
        const response = await fetch(`${API_URL}/api/empleado/${emp.employeeNo}/foto`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          if (response.status === 204) {
            setImgError(true);
            return;
          }
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setFotoUrl(objectUrl);
          setImgError(false);
        } else {
          setImgError(true);
        }
      } catch (e) {
        setImgError(true);
      }
    };
    fetchFoto();
    
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [emp.employeeNo, token, version]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    setIsUploading(true);
    try {
      const response = await fetch(`${API_URL}/api/empleado/${emp.employeeNo}/foto`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setImgError(false);
        setVersion(Date.now()); // Forzamos recarga de la imagen cifrada
      } else {
        alert('Error al subir la foto');
      }
    } catch (error) {
      console.error(error);
      alert('Error de red al subir foto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative w-full h-48 ${!imgError ? 'bg-[#0a0f1d]' : `bg-gradient-to-br ${avatarColor}`} flex items-center justify-center overflow-hidden group/avatar cursor-pointer`}>
      <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" id={`upload-${emp.employeeNo}`} onChange={handleUpload} />
      
      <label htmlFor={`upload-${emp.employeeNo}`} className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer flex-col gap-2">
        {isUploading ? (
           <div className="w-6 h-6 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
        ) : (
           <>
             <UploadCloud size={28} className="text-white" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Cambiar Foto</span>
           </>
        )}
      </label>

      {!imgError ? (
        <img 
          src={fotoUrl} 
          alt={emp.nombre} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
          onError={() => setImgError(true)} 
        />
      ) : (
        <span className="text-5xl font-black text-white drop-shadow-lg tracking-tighter transition-transform duration-500 group-hover/avatar:scale-110">
          {initials}
        </span>
      )}

      {/* Degradado para fundir la imagen con la tarjeta */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0f1d] to-transparent pointer-events-none" />
    </div>
  );
};

const NombreEditable = ({ emp, onNombreChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(emp.nombre || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (nombre.trim() === '') return setIsEditing(false);
    if (nombre === emp.nombre) return setIsEditing(false);

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/empleado/${emp.employeeNo}/nombre`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('asistencia_token')}` 
        },
        body: JSON.stringify({ nombre: nombre.trim() })
      });

      if (response.ok) {
        onNombreChange(emp.employeeNo, nombre.trim());
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al guardar el nombre en el dispositivo.');
      }
    } catch (e) {
      alert('Error de conexión al guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 mb-5 w-full">
        <input 
          autoFocus
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 bg-black/40 border border-emerald-500/50 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          disabled={isSaving}
        />
        {isSaving ? (
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="flex flex-col gap-1">
            <button onClick={handleSave} className="text-emerald-400 hover:bg-emerald-500/20 p-1 rounded"><Check size={14} /></button>
            <button onClick={() => { setNombre(emp.nombre || ''); setIsEditing(false); }} className="text-rose-400 hover:bg-rose-500/20 p-1 rounded"><X size={14} /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group/name flex items-start justify-between w-full mb-5 gap-2">
      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors line-clamp-2">
        {emp.nombre || 'Personal No Identificado'}
      </h3>
      <button 
        onClick={() => setIsEditing(true)} 
        className="opacity-0 group-hover/name:opacity-100 p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all shrink-0"
        title="Editar nombre en el Biométrico"
      >
        <Edit2 size={16} />
      </button>
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

  const handleNombreChange = (employeeNo, nuevoNombre) => {
    setEmpleados(prev => prev.map(e => e.employeeNo === employeeNo ? { ...e, nombre: nuevoNombre } : e));
  };

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
                className="group relative bg-[#0a0f1d]/80 backdrop-blur-md border border-white/[0.05] hover:border-emerald-500/30 rounded-[1.5rem] shadow-xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col text-left h-full"
              >
                <AvatarEmpleado emp={emp} avatarColor={avatarColor} initials={initials} />
                
                {/* Info Container */}
                <div className="w-full px-6 pb-6 pt-4 flex flex-col flex-1 relative z-10">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400/90 font-black">
                      ID {emp.employeeNo}
                    </span>
                  </div>
                  
                  <NombreEditable emp={emp} onNombreChange={handleNombreChange} />

                  {/* Footer Badges */}
                  <div className="w-full mt-auto pt-4 border-t border-white/5">
                    <div className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border transition-colors ${hasCustomRules ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 group-hover:border-slate-500/40'}`}>
                      <Clock size={12} />
                      <span>{hasCustomRules ? 'Horario Especial' : 'Jornada Global'}</span>
                    </div>
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
