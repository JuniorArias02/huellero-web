import React, { useState, useEffect } from 'react';
import { Settings, Save, Clock, Search, RotateCcw, AlertCircle, CheckCircle, Plus, Trash2, CalendarDays, UserCog, ChevronDown, ChevronUp } from 'lucide-react';
import { asistenciaApi } from '../services/asistenciaApi';

const DIAS = [
  { id: 1, label: 'Lunes', short: 'L' },
  { id: 2, label: 'Martes', short: 'M' },
  { id: 3, label: 'Miércoles', short: 'X' },
  { id: 4, label: 'Jueves', short: 'J' },
  { id: 5, label: 'Viernes', short: 'V' },
  { id: 6, label: 'Sábado', short: 'S' },
  { id: 7, label: 'Domingo', short: 'D' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export function ConfiguracionPanel({ onConfigSaved }) {
  const [generalConfig, setGeneralConfig] = useState({
    jornadas: [],
    tolerancia_minutos: 20,
    tolerancia_extra_minutos: 20,
  });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [expandedEmp, setExpandedEmp] = useState(null);

  const cargarConfiguracion = async () => {
    setLoading(true); setError(null);
    try {
      const data = await asistenciaApi.obtenerConfiguracion();
      setGeneralConfig({
        jornadas: data.jornadas || [],
        tolerancia_minutos: Number(data.tolerancia_minutos) || 20,
        tolerancia_extra_minutos: Number(data.tolerancia_extra_minutos) || 20,
      });
      setEmpleados(data.empleados || []);
    } catch (err) {
      setError(err.message || 'Error al cargar la configuración.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarConfiguracion(); }, []);

  const handleGuardar = async (e) => {
    if (e) e.preventDefault();
    setSaving(true); setError(null); setSuccessMsg(null);
    try {
      const payload = {
        ...generalConfig,
        empleados: empleados.map((emp) => ({
          employeeNo: emp.employeeNo,
          nombre: emp.nombre,
          jornadas: emp.jornadas
        })),
      };
      await asistenciaApi.guardarConfiguracion(payload);
      setSuccessMsg('¡Configuración de motor de horarios actualizada con éxito!');
      if (onConfigSaved) onConfigSaved();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const addJornada = (target, empId = null) => {
    const newJornada = { id: generateId(), nombre: 'Nuevo Turno', entrada: '08:00', salida: '17:00', activa: true, dias: [1,2,3,4,5,6] };
    if (target === 'global') {
      setGeneralConfig(p => ({ ...p, jornadas: [...p.jornadas, newJornada] }));
    } else {
      setEmpleados(p => p.map(e => e.employeeNo === empId ? { ...e, jornadas: [...(e.jornadas || []), newJornada] } : e));
    }
  };

  const removeJornada = (target, idJornada, empId = null) => {
    if (target === 'global') {
      setGeneralConfig(p => ({ ...p, jornadas: p.jornadas.filter(j => j.id !== idJornada) }));
    } else {
      setEmpleados(p => p.map(e => e.employeeNo === empId ? { ...e, jornadas: e.jornadas.filter(j => j.id !== idJornada) } : e));
    }
  };

  const updateJornada = (target, idJornada, field, value, empId = null) => {
    if (target === 'global') {
      setGeneralConfig(p => ({ ...p, jornadas: p.jornadas.map(j => j.id === idJornada ? { ...j, [field]: value } : j) }));
    } else {
      setEmpleados(p => p.map(e => e.employeeNo === empId ? { ...e, jornadas: e.jornadas.map(j => j.id === idJornada ? { ...j, [field]: value } : j) } : e));
    }
  };

  const toggleDiaEnJornada = (target, idJornada, diaId, empId = null) => {
    const toggleArray = (arr) => {
      const active = arr || [1,2,3,4,5,6];
      const res = active.includes(diaId) ? active.filter(x => x !== diaId) : [...active, diaId];
      return res.sort();
    };

    if (target === 'global') {
      setGeneralConfig(p => ({
        ...p,
        jornadas: p.jornadas.map(j => j.id === idJornada ? { ...j, dias: toggleArray(j.dias) } : j)
      }));
    } else {
      setEmpleados(p => p.map(e => {
        if (e.employeeNo === empId) {
          return { ...e, jornadas: e.jornadas.map(j => j.id === idJornada ? { ...j, dias: toggleArray(j.dias) } : j) };
        }
        return e;
      }));
    }
  };

  const togglePersonalizacionEmp = (emp) => {
    setEmpleados(p => p.map(e => {
      if (e.employeeNo === emp.employeeNo) {
        if (e.jornadas) {
          return { ...e, jornadas: null };
        } else {
          return { ...e, jornadas: JSON.parse(JSON.stringify(generalConfig.jornadas)) };
        }
      }
      return e;
    }));
    if (expandedEmp !== emp.employeeNo) setExpandedEmp(emp.employeeNo);
  };

  const empleadosFiltrados = empleados.filter(emp => 
    (emp.nombre || '').toLowerCase().includes(filtroBusqueda.toLowerCase()) || 
    (emp.employeeNo || '').includes(filtroBusqueda)
  );

  const renderJornadasBuilder = (target, jornadasList, empId = null) => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jornadasList.map(jor => (
          <div key={jor.id} className={`bg-black/30 border rounded-3xl p-5 transition-all flex flex-col gap-5 ${jor.activa ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'border-white/5 opacity-50'}`}>
            <div className="flex justify-between items-center">
              <input 
                type="text" value={jor.nombre} 
                onChange={(e) => updateJornada(target, jor.id, 'nombre', e.target.value, empId)}
                className="bg-transparent text-white font-extrabold text-xl focus:outline-none focus:border-b focus:border-indigo-500/50 w-[150px]"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => updateJornada(target, jor.id, 'activa', !jor.activa, empId)} className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg border ${jor.activa ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                  {jor.activa ? 'Activa' : 'Inactiva'}
                </button>
                <button type="button" onClick={() => removeJornada(target, jor.id, empId)} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Hora Entrada</label>
                <input type="time" value={jor.entrada} onChange={(e) => updateJornada(target, jor.id, 'entrada', e.target.value, empId)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Hora Salida</label>
                <input type="time" value={jor.salida} onChange={(e) => updateJornada(target, jor.id, 'salida', e.target.value, empId)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Días que aplica este turno</label>
              <div className="flex flex-wrap gap-1.5">
                {DIAS.map(d => {
                  const isSelected = (jor.dias || [1,2,3,4,5,6]).includes(d.id);
                  return (
                    <button
                      key={d.id} type="button"
                      onClick={() => toggleDiaEnJornada(target, jor.id, d.id, empId)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all duration-300 ${
                        isSelected 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                          : 'bg-black/30 text-slate-500 border border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {d.short}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addJornada(target, empId)} className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-5 flex flex-col items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all min-h-[220px] cursor-pointer">
          <Plus size={36} className="mb-3" />
          <span className="text-sm font-bold">Crear Nuevo Turno</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#0a0f1d]/80 border border-white/[0.04] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full z-10 mb-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/20 text-indigo-400">
          <Settings size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-1">
            Motor de Horarios Inteligente
          </h2>
          <p className="text-slate-400 text-sm font-medium">Configura múltiples turnos y asigna los días específicos para cada uno.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Cargando motor de horarios...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* Configuración Global */}
          <div className="bg-black/20 p-8 rounded-[2rem] border border-white/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><CalendarDays size={120} /></div>
            
            <div className="flex flex-wrap justify-between items-center mb-8">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-3">
                <CalendarDays size={24} className="text-indigo-400" />
                Jornadas Globales (Por Defecto)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tolerancia Tarde</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={generalConfig.tolerancia_minutos} onChange={(e) => setGeneralConfig(p => ({...p, tolerancia_minutos: Number(e.target.value)}))} className="w-12 bg-transparent text-white text-center font-bold focus:outline-none border-b border-indigo-500/50" />
                    <span className="text-xs font-bold text-slate-500">Min</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tolerancia Extras</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={generalConfig.tolerancia_extra_minutos} onChange={(e) => setGeneralConfig(p => ({...p, tolerancia_extra_minutos: Number(e.target.value)}))} className="w-12 bg-transparent text-white text-center font-bold focus:outline-none border-b border-purple-500/50" />
                    <span className="text-xs font-bold text-slate-500">Min</span>
                  </div>
                </div>
              </div>
            </div>
            
            {renderJornadasBuilder('global', generalConfig.jornadas)}
          </div>

          {/* Excepciones de Empleados */}
          <div>
            <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 mb-1">
                  <UserCog size={22} className="text-purple-400" />
                  Personalización por Empleado
                </h3>
                <p className="text-sm text-slate-400">Si un empleado tiene horarios especiales, configúralos aquí.</p>
              </div>
              <div className="relative w-full max-w-[350px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Buscar empleado..." value={filtroBusqueda} onChange={(e) => setFiltroBusqueda(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" />
              </div>
            </div>

            <div className="border border-white/5 bg-black/20 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                <table className="w-full text-left border-collapse text-sm text-slate-300">
                  <thead className="bg-[#0a0f1d]/95 sticky top-0 z-20 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-white/5">ID Empleado</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-white/5">Nombre</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-white/5">Estado de Reglas</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {empleadosFiltrados.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-bold">No se encontraron empleados.</td></tr>
                    ) : (
                      empleadosFiltrados.map((emp) => {
                        const hasCustom = emp.jornadas !== null && emp.jornadas !== undefined;
                        const isExpanded = expandedEmp === emp.employeeNo;
                        
                        return (
                          <React.Fragment key={emp.employeeNo}>
                            <tr className={`hover:bg-white/[0.02] transition-colors ${isExpanded ? 'bg-white/[0.03]' : ''}`}>
                              <td className="px-6 py-4 font-mono text-xs text-purple-400">{emp.employeeNo}</td>
                              <td className="px-6 py-4 font-bold text-white">{emp.nombre}</td>
                              <td className="px-6 py-4">
                                {hasCustom ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-widest">
                                    Personalizado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-extrabold uppercase tracking-widest">
                                    Global
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => togglePersonalizacionEmp(emp)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${hasCustom ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
                                    {hasCustom ? 'Remover' : 'Personalizar'}
                                  </button>
                                  {hasCustom && (
                                    <button onClick={() => setExpandedEmp(isExpanded ? null : emp.employeeNo)} className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20">
                                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            
                            {/* Panel Expansible Full Width para Edición de Empleado */}
                            {isExpanded && hasCustom && (
                              <tr className="bg-black/40 border-b border-white/5">
                                <td colSpan="4" className="p-0">
                                  <div className="p-8 border-l-4 border-purple-500 animate-fade-in">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-purple-300/80">Jornadas Exclusivas de {emp.nombre}</label>
                                    {renderJornadasBuilder('emp', emp.jornadas || [], emp.employeeNo)}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 sticky bottom-0 bg-[#0a0f1d]/90 backdrop-blur-xl p-4 rounded-3xl z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex-1">
              {error && <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 animate-fade-in w-fit"><AlertCircle size={18} /><span className="text-sm font-bold">{error}</span></div>}
              {successMsg && <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 animate-fade-in w-fit"><CheckCircle size={18} /><span className="text-sm font-bold">{successMsg}</span></div>}
            </div>

            <button onClick={handleGuardar} disabled={saving} className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 min-w-[220px] ${saving ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,70,229,0.6)] cursor-pointer'}`}>
              {saving ? <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Guardando...</> : <><Save size={18} /> Aplicar Cambios Globales</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
