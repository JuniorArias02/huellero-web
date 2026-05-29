import React from 'react';
import { useAsistencias } from '../hooks/useAsistencias';
import { PanelMetricas } from './PanelMetricas';
import { FiltrosBusqueda } from './FiltrosBusqueda';
import { TablaAsistencia } from './TablaAsistencia';
import { UserSearch, AlertCircle } from 'lucide-react';

export function ReportesPanel() {
  // Hook independiente para no mutar las métricas globales
  const { asistencias, loading, error, filtros, actualizarFiltros, metricas, excelUrl, cargarAsistencias } = useAsistencias();

  return (
    <div className="w-full h-full flex flex-col relative z-10">
      <header className="mb-6 z-10 relative">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight mb-2">
          Reporte Individual del Personal
        </h1>
        <p className="text-slate-400 font-medium text-sm">Busque a un empleado para generar su reporte detallado de horas extras, inasistencias y tardanzas.</p>
      </header>

      {error && (
        <div className="flex gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 items-start animate-fade-in relative z-10">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm mb-1">Error al cargar reporte</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Buscador y Rango de Fechas Exclusivo */}
      <div className="mb-8 z-10 relative">
        <FiltrosBusqueda
          filtros={filtros}
          onCambiarFiltro={actualizarFiltros}
          onRecargar={() => cargarAsistencias()}
          excelUrl={excelUrl}
        />
      </div>

      {filtros.busqueda && filtros.busqueda.trim() !== '' ? (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          {/* Métricas Exclusivas del Empleado */}
          <PanelMetricas metricas={metricas} />
          
          {/* Historial Exclusivo */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Registros Encontrados
            </h3>
            <TablaAsistencia asistencias={asistencias} loading={loading} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 mt-12 mb-20 animate-fade-in pointer-events-none">
          <div className="w-24 h-24 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mb-6 shadow-inner">
            <UserSearch size={48} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Ningún empleado seleccionado</h2>
          <p className="text-slate-400 font-medium text-center max-w-md">
            Utilice la barra de búsqueda superior ingresando el nombre o ID para generar automáticamente el reporte estadístico.
          </p>
        </div>
      )}
    </div>
  );
}
