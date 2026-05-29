import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Info, Calendar } from 'lucide-react';

/**
 * Panel de Sincronización con el Dispositivo Biométrico.
 */
export function Sincronizador({ onSincronizar, syncing }) {
  const [fechas, setFechas] = useState({
    fechaInicio: '2026-05-01T00:00',
    fechaFin: '2026-05-31T23:59'
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFechas(prev => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (e) => {
    try { e.target.showPicker(); } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const fInicioIso = `${fechas.fechaInicio}:00-05:00`;
      const fFinIso = `${fechas.fechaFin}:59-05:00`;

      const response = await onSincronizar({
        fechaInicio: fInicioIso,
        fechaFin: fFinIso
      });

      setStatus({
        success: true,
        message: `¡Sincronización completada con éxito! Se importaron ${response.sincronizados} nuevas marcaciones del personal al sistema.`
      });
    } catch (err) {
      setStatus({
        success: false,
        message: err.message || 'Ocurrió un error inesperado al conectar con el dispositivo.'
      });
    }
  };

  const inputClass = "w-full bg-black/20 border border-white/10 text-white text-base rounded-xl px-12 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans hover:bg-black/30 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer";

  return (
    <div className="relative bg-white/[0.02] border border-white/[0.04] backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full z-10 overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
      
      <div className="relative z-10 mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 tracking-tight">
          Importación desde Biométrico
        </h2>
        <p className="text-slate-400 text-sm md:text-base font-medium">
          Descargue y sincronice los registros de marcación directamente desde el dispositivo terminal de la Sede Principal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha y Hora de Inicio</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="datetime-local"
                name="fechaInicio"
                value={fechas.fechaInicio}
                onChange={handleChange}
                onClick={handleDateClick}
                disabled={syncing}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha y Hora de Fin</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="datetime-local"
                name="fechaFin"
                value={fechas.fechaFin}
                onChange={handleChange}
                onClick={handleDateClick}
                disabled={syncing}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={syncing}
          className={`w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl font-extrabold text-base transition-all duration-300 border shadow-lg mt-2 cursor-pointer ${
            syncing 
              ? 'bg-blue-600/50 border-blue-500/20 text-blue-200 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(37,99,235,0.5)]'
          }`}
        >
          <RefreshCw size={22} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Sincronizando con dispositivo...' : 'Ejecutar Sincronización'}</span>
        </button>
      </form>

      {status && (
        <div className={`relative z-10 mt-8 p-5 rounded-2xl border flex gap-4 items-start animate-fade-in ${
          status.success 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {status.success ? <CheckCircle2 size={24} className="mt-0.5 shrink-0" /> : <AlertTriangle size={24} className="mt-0.5 shrink-0" />}
          <div>
            <h4 className="font-bold text-base mb-1">{status.success ? 'Proceso Exitoso' : 'Error en la Conexión'}</h4>
            <p className="text-sm opacity-90 leading-relaxed">{status.message}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mt-8 p-6 bg-black/20 border border-white/5 rounded-2xl flex gap-4 text-sm text-slate-300">
        <div className="text-blue-400 shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white mb-2 text-base">Instrucciones de Importación:</h4>
          <ul className="space-y-2 list-disc pl-4 text-slate-400 font-medium">
            <li>Seleccione el rango de fecha y hora requerido para la importación.</li>
            <li>El sistema se conectará directamente con la dirección del terminal biométrico de la <strong className="text-slate-200">Sede Principal</strong>.</li>
            <li>Los nuevos registros de marcación se descargarán de forma automática sin duplicar marcas existentes.</li>
            <li>Para reportes mensuales extensos, el proceso puede tardar unos segundos.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
