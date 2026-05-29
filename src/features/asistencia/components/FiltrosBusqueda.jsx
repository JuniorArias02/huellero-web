import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, RotateCcw, Calendar } from 'lucide-react';

/**
 * Componente para filtrar y buscar asistencias de forma controlada mediante un botón.
 */
export function FiltrosBusqueda({ filtros, onCambiarFiltro, onRecargar, excelUrl }) {
  const [valoresLocales, setValoresLocales] = useState({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
    busqueda: filtros.busqueda
  });

  useEffect(() => {
    setValoresLocales({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      busqueda: filtros.busqueda
    });
  }, [filtros]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValoresLocales((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (e) => {
    try {
      e.target.showPicker();
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCambiarFiltro(valoresLocales);
  };

  const inputClass = "w-full bg-black/20 border border-white/10 text-white text-sm rounded-xl px-11 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans placeholder-slate-500 hover:bg-black/30";
  const btnClass = "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-3 transition-all duration-300 shadow-lg cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-5 p-6 bg-white/[0.02] border border-white/[0.04] backdrop-blur-lg rounded-[2rem] mb-6 shadow-2xl relative z-10 w-full">
      
      {/* Búsqueda */}
      <div className="flex-1 min-w-[250px]">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Búsqueda de Empleado</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            type="text"
            name="busqueda"
            placeholder="Buscar por nombre o ID..."
            value={valoresLocales.busqueda}
            onChange={handleInputChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="flex flex-wrap items-end gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Desde</label>
          <div className="relative w-44">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="fechaInicio"
              value={valoresLocales.fechaInicio}
              onChange={handleInputChange}
              onClick={handleDateClick}
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Hasta</label>
          <div className="relative w-44">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="fechaFin"
              value={valoresLocales.fechaFin}
              onChange={handleInputChange}
              onClick={handleDateClick}
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className={`${btnClass} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50 hover:-translate-y-0.5`}
          title="Buscar asistencias"
        >
          <Search size={18} />
          <span>Buscar</span>
        </button>

        <button
          type="button"
          onClick={onRecargar}
          className={`${btnClass} bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20 hover:-translate-y-0.5 px-4`}
          title="Actualizar tabla"
        >
          <RotateCcw size={18} />
        </button>

        <a
          href={excelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnClass} bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50 hover:-translate-y-0.5 ml-2`}
        >
          <FileSpreadsheet size={18} />
          <span>Exportar Excel</span>
        </a>
      </div>
    </form>
  );
}
