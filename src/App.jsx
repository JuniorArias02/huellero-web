import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAsistencias } from './features/asistencia/hooks/useAsistencias';
import { PanelMetricas } from './features/asistencia/components/PanelMetricas';
import { FiltrosBusqueda } from './features/asistencia/components/FiltrosBusqueda';
import { TablaAsistencia } from './features/asistencia/components/TablaAsistencia';
import { Sincronizador } from './features/asistencia/components/Sincronizador';
import { ConfiguracionPanel } from './features/asistencia/components/ConfiguracionPanel';
import { ReportesPanel } from './features/asistencia/components/ReportesPanel';
import { DirectorioPanel } from './features/asistencia/components/DirectorioPanel';
import { Login } from './features/auth/components/Login';
import { MainLayout } from './core/layouts/MainLayout';
import { Fingerprint, Database, Sparkles, RefreshCw, Settings, AlertCircle, UserSearch, Users } from 'lucide-react';

const SlideSection = ({ children, alignTop }) => (
  <section className="flex-1 w-full py-8 md:py-10 px-6 md:px-12 overflow-y-auto flex flex-col relative bg-cover bg-fixed custom-scrollbar">
    <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.05)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,rgba(139,92,246,0.05)_0%,transparent_40%)]" />
    <div className={`relative z-10 w-full flex-1 flex flex-col ${alignTop ? 'justify-start' : ''}`}>
      {children}
    </div>
  </section>
);

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('asistencia_user'));
  const location = useLocation();
  const navigate = useNavigate();

  const pathToIndex = {
    '/': 0,
    '/dashboard': 0,
    '/registros': 1,
    '/directorio': 2,
    '/reportes': 3,
    '/sincronizar': 4,
    '/configuracion': 5,
  };
  
  const activeSlide = pathToIndex[location.pathname] !== undefined ? pathToIndex[location.pathname] : 0;

  const {
    asistencias,
    loading,
    error,
    syncing,
    filtros,
    metricas,
    excelUrl,
    cargarAsistencias,
    actualizarFiltros,
    sincronizar
  } = useAsistencias();

  useEffect(() => {
    const handleForceLogout = () => setUsuario(null);
    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  useEffect(() => {
    if (pathToIndex[location.pathname] === undefined) {
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('asistencia_token');
    localStorage.removeItem('asistencia_user');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLoginSuccess={(user) => setUsuario(user)} />;
  }

  const btnPrimary = "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-500/50 hover:-translate-y-0.5 transition-all cursor-pointer";
  const btnSecondary = "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all cursor-pointer";

  return (
    <MainLayout usuario={usuario} onLogout={handleLogout}>
      <div className="h-full w-full overflow-hidden relative">
        <div
          className="h-[600%] flex flex-col transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateY(-${activeSlide * (100 / 6)}%)` }}
        >
          {/* SECCIÓN 01: Panel de Control (Dashboard) */}
          <SlideSection>
            <header className="mb-8 z-10 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-extrabold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                <span>Sistema de Control de Asistencia IPS CLINICAL HOUSE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tighter mb-2 leading-tight">
                Panel de Control y Monitoreo
              </h1>
              <p className="text-slate-400 font-medium text-sm md:text-base">Visualización en tiempo real de accesos y estadísticas globales de la clínica</p>
            </header>

            {/* En el Dashboard usamos las métricas generales sin filtros de búsqueda forzados */}
            <PanelMetricas metricas={metricas} />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-4 z-10 relative bg-white/[0.02] border border-white/[0.04] backdrop-blur-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex-1 max-w-2xl relative z-10">
                <h2 className="text-2xl font-bold text-white mb-4">Gestión e Importación de Marcaciones</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Plataforma corporativa para la administración de accesos del personal. 
                  Permite la sincronización de marcas registradas en el dispositivo biométrico Hikvision de forma segura. 
                  Centraliza la información de asistencia para la generación de reportes detallados y su exportación directa a formato Excel (.xlsx).
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button className={btnPrimary} onClick={() => navigate('/directorio')}>
                    <Users size={18} />
                    <span>Ver Personal</span>
                  </button>
                  <button className={btnSecondary} onClick={() => navigate('/reportes')}>
                    <UserSearch size={18} />
                    <span>Reporte Individual</span>
                  </button>
                  <button className={btnSecondary} onClick={() => navigate('/registros')}>
                    <Database size={18} />
                    <span>Historial General</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex justify-center items-center relative w-full lg:max-w-md">
                <div className="absolute w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[60px]  pointer-events-none" />
                <div className="relative bg-[#0a0f1d]/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 w-full max-w-[320px] group">
                  <div className="w-28 h-28 rounded-full border border-dashed border-blue-500/40 flex items-center justify-center relative mb-6 group-hover:border-blue-400/60 transition-colors">
                    <div className="absolute inset-2 bg-blue-500/10 rounded-full blur-md" />
                    <Fingerprint size={56} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Biométrico - Sede Principal</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 " />
                    Conexión Activa
                  </span>
                  <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-mono bg-black/20 p-3 rounded-xl border border-white/5 w-full">
                    IP: 190.145.135.122:8547<br />
                    Protocolo: Hikvision ISAPI<br />
                    Ubicación: Sede Principal
                  </p>
                </div>
              </div>
            </div>
          </SlideSection>

          {/* SECCIÓN 02: Historial de Marcaciones */}
          <SlideSection>
            <header className="mb-6 z-10 relative">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">
                Historial General de Marcaciones
              </h1>
              <p className="text-slate-400 font-medium text-sm">Filtre por fecha para ver todos los movimientos de la clínica y expórtelos en Excel.</p>
            </header>

            {error && (
              <div className="flex gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 items-start animate-fade-in relative z-10">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Fallo en Consulta</h4>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            <FiltrosBusqueda
              filtros={filtros}
              onCambiarFiltro={actualizarFiltros}
              onRecargar={() => cargarAsistencias()}
              excelUrl={excelUrl}
            />

            <TablaAsistencia asistencias={asistencias} loading={loading} />
          </SlideSection>

          {/* SECCIÓN 03: Directorio de Personal */}
          <SlideSection alignTop>
            <div className="w-full h-full">
              <DirectorioPanel />
            </div>
          </SlideSection>

          {/* SECCIÓN 04: Reportes Individuales */}
          <SlideSection alignTop>
            <div className="w-full pt-2 h-full">
              <ReportesPanel />
            </div>
          </SlideSection>

          {/* SECCIÓN 05: Sincronización */}
          <SlideSection alignTop>
            <div className="w-full pt-6">
              <Sincronizador onSincronizar={sincronizar} syncing={syncing} />
            </div>
          </SlideSection>

          {/* SECCIÓN 06: Configuración de Parámetros */}
          <SlideSection alignTop>
            <div className="w-full pt-6 pb-20">
              <ConfiguracionPanel onConfigSaved={() => cargarAsistencias()} />
            </div>
          </SlideSection>
        </div>
      </div>
    </MainLayout>
  );
}
