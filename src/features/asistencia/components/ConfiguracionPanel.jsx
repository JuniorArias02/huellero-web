import React, { useState, useEffect } from 'react';
import { Settings, Save, Clock, Search, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { asistenciaApi } from '../services/asistenciaApi';

/**
 * Panel de Configuración para definir los horarios de entrada y salida (dos turnos) generales y específicos.
 */
export function ConfiguracionPanel({ onConfigSaved }) {
  const [generalConfig, setGeneralConfig] = useState({
    hora_entrada_m_defecto: '07:30',
    hora_salida_m_defecto: '11:30',
    hora_entrada_t_defecto: '14:00',
    hora_salida_t_defecto: '18:00',
    tolerancia_minutos: 20,
  });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // Cargar configuración actual al montar el componente
  const cargarConfiguracion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await asistenciaApi.obtenerConfiguracion();
      setGeneralConfig({
        hora_entrada_m_defecto: data.hora_entrada_m_defecto || '07:30',
        hora_salida_m_defecto: data.hora_salida_m_defecto || '11:30',
        hora_entrada_t_defecto: data.hora_entrada_t_defecto || '14:00',
        hora_salida_t_defecto: data.hora_salida_t_defecto || '18:00',
        tolerancia_minutos: Number(data.tolerancia_minutos) ?? 20,
      });
      setEmpleados(data.empleados || []);
    } catch (err) {
      setError(err.message || 'Error al cargar la configuración de asistencia.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralConfig((prev) => ({
      ...prev,
      [name]: name === 'tolerancia_minutos' ? Number(value) : value,
    }));
  };

  const handleEmpleadoHoraChange = (employeeNo, campo, horaVal) => {
    setEmpleados((prev) =>
      prev.map((emp) =>
        emp.employeeNo === employeeNo ? { ...emp, [campo]: horaVal } : emp
      )
    );
  };

  const handleRestablecerEmpleado = (employeeNo) => {
    setEmpleados((prev) =>
      prev.map((emp) =>
        emp.employeeNo === employeeNo
          ? { ...emp, horaEntradaM: '', horaSalidaM: '', horaEntradaT: '', horaSalidaT: '' }
          : emp
      )
    );
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        ...generalConfig,
        empleados: empleados.map((emp) => ({
          employeeNo: emp.employeeNo,
          nombre: emp.nombre,
          horaEntradaM: emp.horaEntradaM || '',
          horaSalidaM: emp.horaSalidaM || '',
          horaEntradaT: emp.horaEntradaT || '',
          horaSalidaT: emp.horaSalidaT || '',
        })),
      };
      await asistenciaApi.guardarConfiguracion(payload);
      setSuccessMsg('¡Configuración guardada correctamente!');
      if (onConfigSaved) {
        onConfigSaved();
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  // Filtrar empleados por búsqueda en tiempo real
  const empleadosFiltrados = empleados.filter(
    (emp) =>
      (emp.nombre || '').toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (emp.employeeNo || '').includes(filtroBusqueda)
  );

  return (
    <div className="card-sync" style={{ maxWidth: '950px', width: '100%', margin: '0 auto 3rem auto' }}>
      <div className="card-sync-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Settings size={28} style={{ color: 'var(--primary)' }} />
        <div>
          <h2>Configuración de Asistencia</h2>
          <p className="card-subtitle">Establezca los horarios de entrada, salida y tolerancias para cada jornada de trabajo</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner"></div>
          <p className="mt-2 text-muted">Cargando parámetros de asistencia...</p>
        </div>
      ) : (
        <form onSubmit={handleGuardar} className="sync-form">
          {/* Configuración General (2 Turnos + Tolerancia) */}
          <div className="sync-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Entrada Mañana (Defecto)</label>
              <div className="input-with-icon">
                <Clock size={14} className="input-icon" />
                <input
                  type="time"
                  name="hora_entrada_m_defecto"
                  value={generalConfig.hora_entrada_m_defecto}
                  onChange={handleGeneralChange}
                  required
                  className="sync-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Salida Mañana (Defecto)</label>
              <div className="input-with-icon">
                <Clock size={14} className="input-icon" />
                <input
                  type="time"
                  name="hora_salida_m_defecto"
                  value={generalConfig.hora_salida_m_defecto}
                  onChange={handleGeneralChange}
                  required
                  className="sync-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Entrada Tarde (Defecto)</label>
              <div className="input-with-icon">
                <Clock size={14} className="input-icon" />
                <input
                  type="time"
                  name="hora_entrada_t_defecto"
                  value={generalConfig.hora_entrada_t_defecto}
                  onChange={handleGeneralChange}
                  required
                  className="sync-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Salida Tarde (Defecto)</label>
              <div className="input-with-icon">
                <Clock size={14} className="input-icon" />
                <input
                  type="time"
                  name="hora_salida_t_defecto"
                  value={generalConfig.hora_salida_t_defecto}
                  onChange={handleGeneralChange}
                  required
                  className="sync-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tolerancia (Minutos)</label>
              <input
                type="number"
                name="tolerancia_minutos"
                min="0"
                max="120"
                value={generalConfig.tolerancia_minutos}
                onChange={handleGeneralChange}
                required
                className="sync-input"
              />
            </div>
          </div>

          {/* Sección de excepciones de horarios por empleado */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personalizaciones de Horario por Empleado</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Escriba un horario específico para sobrescribir los valores generales si corresponde.</p>
              </div>
              
              {/* Buscador reactivo */}
              <div className="input-with-icon" style={{ maxWidth: '280px' }}>
                <Search size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Buscar empleado por nombre/ID..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="filter-input filter-search"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.5rem' }}
                />
              </div>
            </div>

            {/* Listado de empleados */}
            <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.75rem', background: 'rgba(0, 0, 0, 0.15)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>ID</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Nombre</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Entrada M.</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Salida M.</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Entrada T.</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Salida T.</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {empleadosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No se encontraron empleados en el sistema.
                      </td>
                    </tr>
                  ) : (
                    empleadosFiltrados.map((emp) => {
                      const hasCustom = emp.horaEntradaM || emp.horaSalidaM || emp.horaEntradaT || emp.horaSalidaT;
                      return (
                        <tr key={emp.employeeNo} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>{emp.employeeNo}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{emp.nombre}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <input
                              type="time"
                              value={emp.horaEntradaM || ''}
                              onChange={(e) => handleEmpleadoHoraChange(emp.employeeNo, 'horaEntradaM', e.target.value)}
                              className="sync-input"
                              style={{ 
                                padding: '0.35rem 0.5rem', 
                                fontSize: '0.8rem', 
                                width: '90px', 
                                background: emp.horaEntradaM ? 'rgba(139, 92, 246, 0.1)' : 'rgba(10, 15, 29, 0.6)',
                                borderColor: emp.horaEntradaM ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input
                              type="time"
                              value={emp.horaSalidaM || ''}
                              onChange={(e) => handleEmpleadoHoraChange(emp.employeeNo, 'horaSalidaM', e.target.value)}
                              className="sync-input"
                              style={{ 
                                padding: '0.35rem 0.5rem', 
                                fontSize: '0.8rem', 
                                width: '90px', 
                                background: emp.horaSalidaM ? 'rgba(139, 92, 246, 0.1)' : 'rgba(10, 15, 29, 0.6)',
                                borderColor: emp.horaSalidaM ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input
                              type="time"
                              value={emp.horaEntradaT || ''}
                              onChange={(e) => handleEmpleadoHoraChange(emp.employeeNo, 'horaEntradaT', e.target.value)}
                              className="sync-input"
                              style={{ 
                                padding: '0.35rem 0.5rem', 
                                fontSize: '0.8rem', 
                                width: '90px', 
                                background: emp.horaEntradaT ? 'rgba(139, 92, 246, 0.1)' : 'rgba(10, 15, 29, 0.6)',
                                borderColor: emp.horaEntradaT ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <input
                              type="time"
                              value={emp.horaSalidaT || ''}
                              onChange={(e) => handleEmpleadoHoraChange(emp.employeeNo, 'horaSalidaT', e.target.value)}
                              className="sync-input"
                              style={{ 
                                padding: '0.35rem 0.5rem', 
                                fontSize: '0.8rem', 
                                width: '90px', 
                                background: emp.horaSalidaT ? 'rgba(139, 92, 246, 0.1)' : 'rgba(10, 15, 29, 0.6)',
                                borderColor: emp.horaSalidaT ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRestablecerEmpleado(emp.employeeNo)}
                              disabled={!hasCustom}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem', borderRadius: '0.4rem', border: 'none', opacity: hasCustom ? 1 : 0.4 }}
                              title="Restablecer todas las celdas al horario general de la empresa"
                            >
                              <RotateCcw size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback visual de errores o éxito */}
          {error && (
            <div className="alert-box alert-danger">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div className="alert-content">
                <p className="alert-title">Fallo al Guardar</p>
                <p className="alert-msg">{error}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="alert-box alert-success">
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <div className="alert-content">
                <p className="alert-title">Cambios Guardados</p>
                <p className="alert-msg">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Botón de guardado */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ minWidth: '185px' }}
            >
              {saving ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar Parámetros</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
