import React, { useState, useEffect } from 'react';
import { useAsistencias } from './features/asistencia/hooks/useAsistencias';
import { PanelMetricas } from './features/asistencia/components/PanelMetricas';
import { FiltrosBusqueda } from './features/asistencia/components/FiltrosBusqueda';
import { TablaAsistencia } from './features/asistencia/components/TablaAsistencia';
import { Sincronizador } from './features/asistencia/components/Sincronizador';
import { Login } from './features/auth/components/Login';
import { Fingerprint, Database, Sparkles, RefreshCw, LayoutDashboard } from 'lucide-react';

/**
 * Componente Raíz de la Aplicación.
 * Controla el acceso mediante Autenticación por JWT y maneja la navegación vertical.
 */
export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('asistencia_user'));
  const [activeSlide, setActiveSlide] = useState(0);
  
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

  // Escuchar evento de cierre de sesión forzado desde apiClient (e.g. token expirado / HTTP 401)
  useEffect(() => {
    const handleForceLogout = () => {
      setUsuario(null);
    };
    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('asistencia_token');
    localStorage.removeItem('asistencia_user');
    setUsuario(null);
  };

  // Configuración de las secciones del elevador vertical
  const slides = [
    { id: 0, label: 'Dashboard', tooltip: 'Panel de Control', icon: <LayoutDashboard size={14} /> },
    { id: 1, label: 'Registros', tooltip: 'Historial de Marcas', icon: <Database size={14} /> },
    { id: 2, label: 'Sincronizar', tooltip: 'Importar Biométrico', icon: <RefreshCw size={14} /> }
  ];

  // Si no está autenticado, renderizar la pantalla de Login
  if (!usuario) {
    return <Login onLoginSuccess={(user) => setUsuario(user)} />;
  }

  return (
    <div className="vertical-slider-container">
      {/* Sistema de Navegación Vertical (Elevador) */}
      <div className="elevator-nav">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`elevator-item ${activeSlide === slide.id ? 'active' : ''}`}
            onClick={() => setActiveSlide(slide.id)}
          >
            <div className="elevator-dot"></div>
            <span className="elevator-tooltip">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {slide.icon}
                {slide.tooltip}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div
        className="vertical-slider-content"
        style={{ transform: `translateY(-${activeSlide * 100}vh)` }}
      >
        {/* SECCIÓN 01: Panel de Control (Dashboard) */}
        <section className="slide-section">
          {/* BARRA SUPERIOR DE NAVEGACIÓN */}
          <div className="top-nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Fingerprint size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.5px' }}>IPS CLINICAL HOUSE</span>
            </div>
            <div className="top-nav-profile">
              <div className="top-nav-user-info">
                <span className="top-nav-username">{usuario}</span>
                <span className="top-nav-role">Administrador</span>
              </div>
              <div className="top-nav-avatar">
                {usuario ? usuario.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>

          <header className="slide-header">
            <div className="welcome-badge">
              <Sparkles size={14} />
              <span>Sistema de Control de Asistencia IPS CLINICAL HOUSE</span>
            </div>
            <h1>Panel de Control y Monitoreo</h1>
            <p>Visualización en tiempo real de accesos y registros del personal</p>
          </header>

          {/* Grid de Métricas Principales */}
          <PanelMetricas metricas={metricas} />

          <div className="welcome-container">
            <div className="welcome-text">
              <h2>Gestión e Importación de Marcaciones</h2>
              <p>
                Plataforma corporativa para la administración de accesos del personal. 
                Permite la sincronización de marcas registradas en el dispositivo biométrico Hikvision de forma segura. 
                Centraliza la información de asistencia para la generación de reportes detallados y su exportación directa a formato Excel (.xlsx).
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setActiveSlide(1)}>
                  <Database size={18} />
                  <span>Ver Historial Completo</span>
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveSlide(2)}>
                  <RefreshCw size={18} />
                  <span>Sincronizar Terminal</span>
                </button>
              </div>
            </div>

            <div className="welcome-illustration">
              <div className="glow-orb"></div>
              <div className="device-card-mock">
                <div className="biometric-scanner-ring">
                  <Fingerprint size={56} />
                </div>
                <h3>Terminal Biométrico</h3>
                <span className="device-status-badge">Conexión Activa</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.4' }}>
                  Dirección IP: 190.145.135.122:8547 <br />
                  Protocolo: Hikvision ISAPI <br />
                  Base de Datos: Interna
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 02: Historial de Marcaciones */}
        <section className="slide-section">
          {/* BARRA SUPERIOR DE NAVEGACIÓN */}
          <div className="top-nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Fingerprint size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.5px' }}>IPS CLINICAL HOUSE</span>
            </div>
            <div className="top-nav-profile">
              <div className="top-nav-user-info">
                <span className="top-nav-username">{usuario}</span>
                <span className="top-nav-role">Administrador</span>
              </div>
              <div className="top-nav-avatar">
                {usuario ? usuario.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>

          <header className="slide-header">
            <h1>Historial de Marcaciones</h1>
            <p>Filtre por empleado, ID o rango de fechas y exporte el reporte en Excel</p>
          </header>

          {error && (
            <div className="alert-box alert-danger" style={{ marginBottom: '1.25rem', marginTop: 0 }}>
              <div className="alert-content">
                <p className="alert-title">Fallo en Consulta</p>
                <p className="alert-msg">{error}</p>
              </div>
            </div>
          )}

          {/* Filtros de Tabla */}
          <FiltrosBusqueda
            filtros={filtros}
            onCambiarFiltro={actualizarFiltros}
            onRecargar={() => cargarAsistencias()}
            excelUrl={excelUrl}
          />

          {/* Tabla Paginada de Asistencias */}
          <TablaAsistencia asistencias={asistencias} loading={loading} />
        </section>

        {/* SECCIÓN 03: Sincronización */}
        <section className="slide-section" style={{ justifyContent: 'flex-start' }}>
          {/* BARRA SUPERIOR DE NAVEGACIÓN */}
          <div className="top-nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Fingerprint size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.5px' }}>IPS CLINICAL HOUSE</span>
            </div>
            <div className="top-nav-profile">
              <div className="top-nav-user-info">
                <span className="top-nav-username">{usuario}</span>
                <span className="top-nav-role">Administrador</span>
              </div>
              <div className="top-nav-avatar">
                {usuario ? usuario.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
            <Sincronizador onSincronizar={sincronizar} syncing={syncing} />
          </div>
        </section>
      </div>
    </div>
  );
}
