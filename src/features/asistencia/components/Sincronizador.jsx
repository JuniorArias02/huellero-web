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
  const [status, setStatus] = useState(null); // { success: boolean, message: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFechas(prev => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (e) => {
    try {
      e.target.showPicker();
    } catch (err) {
      // Fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      // Formatear fechas a ISO 8601 con desfase de Colombia (-05:00)
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

  return (
    <div className="card-sync">
      <div className="card-sync-header">
        <h2>Importación desde Biométrico</h2>
        <p className="card-subtitle">
          Descargue y sincronice los registros de marcación directamente desde el dispositivo terminal de asistencia.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="sync-form">
        <div className="sync-grid">
          <div className="form-group">
            <label>Fecha y Hora de Inicio:</label>
            <div className="sync-input-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="datetime-local"
                name="fechaInicio"
                value={fechas.fechaInicio}
                onChange={handleChange}
                onClick={handleDateClick}
                disabled={syncing}
                required
                className="sync-input sync-input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fecha y Hora de Fin:</label>
            <div className="sync-input-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="datetime-local"
                name="fechaFin"
                value={fechas.fechaFin}
                onChange={handleChange}
                onClick={handleDateClick}
                disabled={syncing}
                required
                className="sync-input sync-input-with-icon"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={syncing}
          className={`btn btn-primary btn-block ${syncing ? 'loading' : ''}`}
        >
          {syncing ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              <span>Sincronizando con dispositivo...</span>
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              <span>Ejecutar Sincronización</span>
            </>
          )}
        </button>
      </form>

      {status && (
        <div className={`alert-box ${status.success ? 'alert-success' : 'alert-danger'}`}>
          {status.success ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <div className="alert-content">
            <p className="alert-title">{status.success ? 'Proceso Exitoso' : 'Error en la Conexión'}</p>
            <p className="alert-msg">{status.message}</p>
          </div>
        </div>
      )}

      <div className="sync-info-box">
        <div className="info-icon">
          <Info size={20} />
        </div>
        <div className="info-content">
          <h4>Instrucciones de Importación:</h4>
          <ul>
            <li>Seleccione el rango de fecha y hora requerido para la importación.</li>
            <li>El sistema se conectará directamente con la dirección del terminal biométrico.</li>
            <li>Los nuevos registros de marcación se descargarán de forma automática sin duplicar marcas existentes.</li>
            <li>Para reportes mensuales extensos, el proceso puede tardar unos segundos. Por favor, espere la confirmación.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
