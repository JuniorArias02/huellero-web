import React from 'react';
import { Users, Fingerprint, ScanFace, CreditCard, ClipboardList, Clock } from 'lucide-react';

/**
 * Componente que muestra las tarjetas de métricas del Dashboard.
 */
export function PanelMetricas({ metricas }) {
  const { total, empleadosUnicos, modos, puntualidad } = metricas;

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

      {/* Tarjeta: Puntualidad General */}
      {puntualidad && (
        <div className="metric-card bg-gradient-emerald">
          <div className="metric-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
            <ClipboardList size={24} />
          </div>
          <div className="metric-content">
            <h3>Puntualidad</h3>
            <p className="metric-number">
              {puntualidad.totalEntradas > 0 ? `${100 - puntualidad.porcentajeTardanza}%` : '100%'}
            </p>
            <span className="metric-subtitle">
              {puntualidad.entradasATiempo} de {puntualidad.totalEntradas} entradas a tiempo
            </span>
          </div>
        </div>
      )}

      {/* Tarjeta: Llegadas Tardes */}
      {puntualidad && (
        <div className="metric-card bg-gradient-rose">
          <div className="metric-icon" style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>Llegadas Tardes</h3>
            <p className="metric-number">{puntualidad.entradasTarde}</p>
            <span className="metric-subtitle">
              Total retraso: {puntualidad.totalRetrasoMinutos} minutos
            </span>
          </div>
        </div>
      )}

      {/* Tarjeta: Horas Extras */}
      {puntualidad && (
        <div className="metric-card bg-gradient-amber">
          <div className="metric-icon" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>Horas Extras</h3>
            <p className="metric-number">{Math.round((puntualidad.totalHorasExtrasMinutos / 60) * 10) / 10} h</p>
            <span className="metric-subtitle">
              Acumulado: {puntualidad.totalHorasExtrasMinutos} min extra
            </span>
          </div>
        </div>
      )}

      {/* Tarjeta: Salidas Tempranas */}
      {puntualidad && (
        <div className="metric-card bg-gradient-purple">
          <div className="metric-icon" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>Salidas Tempranas</h3>
            <p className="metric-number">{puntualidad.salidasTempranas}</p>
            <span className="metric-subtitle">
              Tiempo no lab: {puntualidad.totalSalidaTempranaMinutos} min
            </span>
          </div>
        </div>
      )}

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
