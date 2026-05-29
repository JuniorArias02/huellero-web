import React from 'react';
import { Users, Fingerprint, ScanFace, CreditCard, ClipboardList, Clock, UserX } from 'lucide-react';

/**
 * Componente que muestra las tarjetas de métricas del Dashboard.
 * Diseño Glassmorphism Premium 2026
 */
export function PanelMetricas({ metricas }) {
  const { total, empleadosUnicos, nombreEmpleado, modos, puntualidad } = metricas;

  const Card = ({ title, value, subtitle, icon, colorFrom, colorTo, iconColor, iconBg }) => (
    <div className="relative overflow-hidden p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.04] backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-5 group">
      {/* Glow de fondo decorativo */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-10 group-hover:opacity-25 blur-xl transition-opacity duration-500`} />
      
      {/* Icono */}
      <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${iconBg} ${iconColor} border border-white/10 group-hover:scale-110 transition-transform duration-500 ease-out`}>
        {icon}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col min-w-0">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 truncate">{title}</h3>
        <p className="text-3xl font-black text-white font-mono tracking-tighter leading-none mb-1.5 drop-shadow-md">{value}</p>
        <span className="text-[11px] text-slate-500 font-medium truncate">{subtitle}</span>
      </div>
    </div>
  );

  return (
    <div className="mb-8 relative z-10">
      {nombreEmpleado && (
        <div className="mb-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 shadow-lg animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-300 font-bold text-sm tracking-wide">
            Mostrando Reporte Individual: <span className="text-white font-black">{nombreEmpleado}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {!nombreEmpleado && (
          <Card 
            title="Personal Registrado" 
            value={empleadosUnicos} 
            subtitle="Empleados identificados" 
            icon={<Users size={24} strokeWidth={2.5} />} 
            colorFrom="from-purple-600" colorTo="to-fuchsia-600" 
            iconBg="bg-purple-500/10" iconColor="text-purple-400" 
          />
        )}
        <Card 
          title="Total Registros" 
          value={total.toLocaleString()} 
          subtitle={nombreEmpleado ? "Marcaciones de este empleado" : "Marcaciones en Base de Datos"} 
          icon={<ClipboardList size={24} strokeWidth={2.5} />} 
          colorFrom="from-blue-600" colorTo="to-indigo-600" 
          iconBg="bg-blue-500/10" iconColor="text-blue-400" 
        />
        
        {puntualidad && (
          <>
            <Card 
              title="Puntualidad" 
              value={puntualidad.totalEntradas > 0 ? `${100 - puntualidad.porcentajeTardanza}%` : '100%'} 
              subtitle={`${puntualidad.entradasATiempo} de ${puntualidad.totalEntradas} a tiempo`} 
              icon={<CheckCircleIcon />} 
              colorFrom="from-emerald-600" colorTo="to-teal-600" 
              iconBg="bg-emerald-500/10" iconColor="text-emerald-400" 
            />
            <Card 
              title="Inasistencias (Faltas)" 
              value={puntualidad.faltas} 
              subtitle="Días sin marcación detectada" 
              icon={<UserX size={24} strokeWidth={2.5} />} 
              colorFrom="from-red-600" colorTo="to-rose-600" 
              iconBg="bg-red-500/10" iconColor="text-red-400" 
            />
            <Card 
              title="Llegadas Tardes" 
              value={puntualidad.entradasTarde} 
              subtitle={`Total retraso: ${puntualidad.totalRetrasoMinutos} min`} 
              icon={<Clock size={24} strokeWidth={2.5} />} 
              colorFrom="from-rose-600" colorTo="to-red-600" 
              iconBg="bg-rose-500/10" iconColor="text-rose-400" 
            />
            <Card 
              title="Horas Extras" 
              value={`${Math.round((puntualidad.totalHorasExtrasMinutos / 60) * 10) / 10} h`} 
              subtitle={`Acumulado: ${puntualidad.totalHorasExtrasMinutos} min extra`} 
              icon={<Clock size={24} strokeWidth={2.5} />} 
              colorFrom="from-amber-600" colorTo="to-orange-600" 
              iconBg="bg-amber-500/10" iconColor="text-amber-400" 
            />
          </>
        )}
      </div>
    </div>
  );
}

// Icono auxiliar para puntualidad
function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
