import React, { useState, useMemo } from 'react';
import { Fingerprint, ScanFace, CreditCard, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Tabla paginada de registros de asistencia.
 * UI Glassmorphic 2026.
 */
export function TablaAsistencia({ asistencias, loading }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState('todos');

  React.useEffect(() => {
    setPaginaActual(1);
  }, [asistencias]);

  const itemsPorPagina = useMemo(() => {
    if (registrosPorPagina === 'todos') return asistencias.length || 1;
    return Number(registrosPorPagina);
  }, [registrosPorPagina, asistencias]);

  const datosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return asistencias.slice(inicio, inicio + itemsPorPagina);
  }, [asistencias, paginaActual, itemsPorPagina]);

  const totalPaginas = Math.ceil(asistencias.length / itemsPorPagina) || 1;

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    try {
      const fecha = new Date(fechaStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'America/Bogota'
      }).format(fecha);
    } catch {
      return fechaStr;
    }
  };

  const Badge = ({ children, colorClass }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${colorClass}`}>
      {children}
    </span>
  );

  const renderModoVerificacion = (modo) => {
    const m = (modo || '').toLowerCase();
    if (m.includes('fp') || m.includes('huella')) {
      return <Badge colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><Fingerprint size={14} /> Huella</Badge>;
    }
    if (m.includes('face') || m.includes('rostro')) {
      return <Badge colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20"><ScanFace size={14} /> Rostro</Badge>;
    }
    if (m.includes('card') || m.includes('tarjeta')) {
      return <Badge colorClass="bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20"><CreditCard size={14} /> Tarjeta</Badge>;
    }
    if (m.includes('ninguno')) {
      return <Badge colorClass="bg-rose-500/10 text-rose-400 border-rose-500/20">Ninguno</Badge>;
    }
    return <Badge colorClass="bg-slate-500/10 text-slate-400 border-slate-500/20"><HelpCircle size={14} /> {modo || 'N/A'}</Badge>;
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-lg rounded-[2rem] overflow-hidden shadow-2xl z-10 relative flex flex-col w-full">
      <div className="overflow-x-auto overflow-y-auto max-h-[550px] w-full relative custom-scrollbar">
        <table className="w-full text-left text-sm text-slate-300 border-collapse">
          <thead className="bg-[#0a0f1d]/95 backdrop-blur-md sticky top-0 z-20">
            <tr>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Nº Serie</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">ID Empleado</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Empleado</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Fecha y Hora</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Acceso</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Tipo</th>
              <th className="px-6 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Puntualidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="w-10 h-10 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 font-medium">Sincronizando registros...</p>
                </td>
              </tr>
            ) : asistencias.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <p className="text-slate-300 text-lg font-bold mb-2">No se encontraron marcaciones</p>
                  <p className="text-sm text-slate-500">Ajusta los filtros de fecha o ejecuta una sincronización.</p>
                </td>
              </tr>
            ) : (
              datosPaginados.map((item) => (
                <tr key={item.serialNo} className="hover:bg-white/[0.02] transition-colors duration-200">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.serialNo < 0 ? '—' : item.serialNo}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-500/20">{item.employeeNo}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{item.nombre}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{formatearFecha(item.fechaHora, item.tipoRegistro === 'Inasistencia')}</td>
                  <td className="px-6 py-4">{renderModoVerificacion(item.modoVerificacion)}</td>
                  <td className="px-6 py-4">
                    {item.tipoRegistro.includes('Entrada') ? (
                      <Badge colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20">{item.tipoRegistro}</Badge>
                    ) : item.tipoRegistro.includes('Salida') ? (
                      <Badge colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20">{item.tipoRegistro}</Badge>
                    ) : item.tipoRegistro === 'Inasistencia' ? (
                      <Badge colorClass="bg-rose-500/10 text-rose-400 border-rose-500/20">Inasistencia</Badge>
                    ) : (
                      <Badge colorClass="bg-slate-500/10 text-slate-400 border-slate-500/20">Marcación</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.tipoRegistro.includes('Entrada') ? (
                      item.estado === 'A tiempo' ? (
                        <div className="flex flex-col gap-1">
                          <Badge colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit">A tiempo</Badge>
                          <span className="text-[10px] font-bold text-slate-500">Prog: {item.horaProgramada}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <Badge colorClass="bg-rose-500/10 text-rose-400 border-rose-500/20 w-fit">Tarde (+{item.retrasoMinutos}m)</Badge>
                          <span className="text-[10px] font-bold text-slate-500">Prog: {item.horaProgramada}</span>
                        </div>
                      )
                    ) : item.tipoRegistro.includes('Salida') ? (
                      item.estado === 'Horas Extras' ? (
                        <div className="flex flex-col gap-1">
                          <Badge colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit">Extra (+{item.horasExtrasMinutos}m)</Badge>
                          <span className="text-[10px] font-bold text-slate-500">Prog: {item.horaProgramada}</span>
                        </div>
                      ) : item.estado === 'Salida Temprana' ? (
                        <div className="flex flex-col gap-1">
                          <Badge colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20 w-fit">Temprana (-{item.salidaTempranaMinutos}m)</Badge>
                          <span className="text-[10px] font-bold text-slate-500">Prog: {item.horaProgramada}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <Badge colorClass="bg-slate-500/10 text-slate-400 border-slate-500/20 w-fit">Normal</Badge>
                          <span className="text-[10px] font-bold text-slate-500">Prog: {item.horaProgramada}</span>
                        </div>
                      )
                    ) : item.tipoRegistro === 'Inasistencia' ? (
                      <div className="flex flex-col gap-1">
                        <Badge colorClass="bg-red-500/20 text-red-400 border-red-500/30 w-fit">Falta</Badge>
                        <span className="text-[10px] font-bold text-slate-500">Día Laboral</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600 font-bold">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {asistencias.length > 0 && !loading && (
        <div className="bg-[#0a0f1d]/60 backdrop-blur-md border-t border-white/[0.05] p-5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-400 font-medium">
              Mostrando <strong className="text-white">{Math.min(asistencias.length, (paginaActual - 1) * itemsPorPagina + 1)}-{Math.min(asistencias.length, paginaActual * itemsPorPagina)}</strong> de <strong className="text-white">{asistencias.length}</strong>
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Filas:</span>
              <select
                value={registrosPorPagina}
                onChange={(e) => {
                  const val = e.target.value;
                  setRegistrosPorPagina(val === 'todos' ? 'todos' : Number(val));
                  setPaginaActual(1);
                }}
                className="bg-black/30 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500/50 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value="todos">Todas</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="text-xs font-bold text-slate-400">
              {paginaActual} / {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}