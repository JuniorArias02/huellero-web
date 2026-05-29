import React from 'react';
import { Users, Fingerprint, ScanFace, CreditCard, ClipboardList } from 'lucide-react';

/**
 * Componente que muestra las tarjetas de métricas del Dashboard.
 */
export function PanelMetricas({ metricas }) {
  const { total, empleadosUnicos, modos } = metricas;

  return (
    <div className="metrics-grid">
      {/* Tarjeta: Total Marcas */}
      <div className="metric-card bg-gradient-blue">
        <div className="metric-icon">
          <ClipboardList size={24} />
        </div>
        <div className="metric-content">
          <h3>Total Registros</h3>
          <p className="metric-number">{total.toLocaleString()}</p>
          <span className="metric-subtitle">Marcaciones en Base de Datos</span>
        </div>
      </div>

      {/* Tarjeta: Empleados */}
      <div className="metric-card bg-gradient-purple">
        <div className="metric-icon">
          <Users size={24} />
        </div>
        <div className="metric-content">
          <h3>Personal Registrado</h3>
          <p className="metric-number">{empleadosUnicos}</p>
          <span className="metric-subtitle">Empleados identificados</span>
        </div>
      </div>

      {/* Tarjeta: Huellas */}
      <div className="metric-card bg-gradient-emerald">
        <div className="metric-icon">
          <Fingerprint size={24} />
        </div>
        <div className="metric-content">
          <h3>Vía Huella</h3>
          <p className="metric-number">{modos.huellas}</p>
          <span className="metric-subtitle">Biometría dactilar</span>
        </div>
      </div>

      {/* Tarjeta: Rostro */}
      <div className="metric-card bg-gradient-amber">
        <div className="metric-icon">
          <ScanFace size={24} />
        </div>
        <div className="metric-content">
          <h3>Vía Rostro</h3>
          <p className="metric-number">{modos.rostros}</p>
          <span className="metric-subtitle">Reconocimiento facial</span>
        </div>
      </div>

      {/* Tarjeta: Tarjetas */}
      <div className="metric-card bg-gradient-rose">
        <div className="metric-icon">
          <CreditCard size={24} />
        </div>
        <div className="metric-content">
          <h3>Vía Tarjeta / Otros</h3>
          <p className="metric-number">{modos.tarjetas + modos.otros}</p>
          <span className="metric-subtitle">Llaveros o contraseñas</span>
        </div>
      </div>
    </div>
  );
}
