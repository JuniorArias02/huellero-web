import React, { useState, useMemo } from 'react';
import { Fingerprint, ScanFace, CreditCard, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Tabla paginada de registros de asistencia.
 */
export function TablaAsistencia({ asistencias, loading }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState('todos');

  // Reiniciar a la página 1 cuando cambia la lista de asistencias
  React.useEffect(() => {
    setPaginaActual(1);
  }, [asistencias]);

  // Calcular items por página basado en el selector dinámico
  const itemsPorPagina = useMemo(() => {
    if (registrosPorPagina === 'todos') {
      return asistencias.length || 1;
    }
    return Number(registrosPorPagina);
  }, [registrosPorPagina, asistencias]);

  // Paginación de los datos
  const datosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return asistencias.slice(inicio, inicio + itemsPorPagina);
  }, [asistencias, paginaActual, itemsPorPagina]);

  const totalPaginas = Math.ceil(asistencias.length / itemsPorPagina) || 1;

  // Formateador de fecha local para Colombia
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    try {
      const fecha = new Date(fechaStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'America/Bogota'
      }).format(fecha);
    } catch {
      return fechaStr;
    }
  };

  // Renderizar badge según modo de verificación
  const renderModoVerificacion = (modo) => {
    const m = (modo || '').toLowerCase();
    
    if (m.includes('fp') || m.includes('huella')) {
      return (
        <span className="badge badge-success">
          <Fingerprint size={14} />
          <span>Huella</span>
        </span>
      );
    }
    
    if (m.includes('face') || m.includes('rostro')) {
      return (
        <span className="badge badge-warning">
          <ScanFace size={14} />
          <span>Rostro</span>
        </span>
      );
    }

    if (m.includes('card') || m.includes('tarjeta')) {
      return (
        <span className="badge badge-purple">
          <CreditCard size={14} />
          <span>Tarjeta</span>
        </span>
      );
    }

    return (
      <span className="badge badge-secondary">
        <HelpCircle size={14} />
        <span>{modo || 'Desconocido'}</span>
      </span>
    );
  };

  return (
    <div className="table-wrapper">
      <div className="table-responsive">
        <table className="asistencia-table">
          <thead>
            <tr>
              <th>Nº Serie</th>
              <th>ID Empleado</th>
              <th>Empleado</th>
              <th>Fecha y Hora</th>
              <th>Método de Acceso</th>
              <th>Tipo</th>
              <th>Puntualidad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <div className="spinner"></div>
                  <p className="mt-2 text-muted">Cargando registros...</p>
                </td>
              </tr>
            ) : asistencias.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <p className="text-muted text-xl font-bold">No se encontraron marcaciones</p>
                  <p className="text-sm text-gray">Prueba ajustando los filtros de fecha o sincroniza el dispositivo.</p>
                </td>
              </tr>
            ) : (
              datosPaginados.map((item) => (
                <tr key={item.serialNo} className="table-row">
                  <td className="font-mono text-xs">{item.serialNo}</td>
                  <td>
                    <span className="employee-id">{item.employeeNo}</span>
                  </td>
                  <td className="font-bold">{item.nombre}</td>
                  <td>{formatearFecha(item.fechaHora)}</td>
                  <td>{renderModoVerificacion(item.modoVerificacion)}</td>
                  <td>
                    {item.tipoRegistro.includes('Entrada') ? (
                      <span className="badge badge-purple">{item.tipoRegistro}</span>
                    ) : item.tipoRegistro.includes('Salida') ? (
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        {item.tipoRegistro}
                      </span>
                    ) : (
                      <span className="badge badge-secondary" style={{ opacity: 0.7 }}>Marcación</span>
                    )}
                  </td>
                  <td>
                    {item.tipoRegistro.includes('Entrada') ? (
                      item.estado === 'A tiempo' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge badge-success" style={{ width: 'fit-content' }}>A tiempo</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prog: {item.horaProgramada}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge" style={{ width: 'fit-content', background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            Tarde (+{item.retrasoMinutos} min)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prog: {item.horaProgramada}</span>
                        </div>
                      )
                    ) : item.tipoRegistro.includes('Salida') ? (
                      item.estado === 'Horas Extras' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge" style={{ width: 'fit-content', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            Extra (+{item.horasExtrasMinutos} min)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prog: {item.horaProgramada}</span>
                        </div>
                      ) : item.estado === 'Salida Temprana' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge" style={{ width: 'fit-content', background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            S. Temprana (-{item.salidaTempranaMinutos} min)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prog: {item.horaProgramada}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge badge-secondary" style={{ width: 'fit-content', opacity: 0.8 }}>Normal</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prog: {item.horaProgramada}</span>
                        </div>
                      )
                    ) : (
                      <span className="badge badge-secondary" style={{ opacity: 0.4 }}>N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {asistencias.length > 0 && !loading && (
        <div className="pagination-bar">
          <div className="pagination-left">
            <span className="pagination-info">
              Mostrando <strong>{Math.min(asistencias.length, (paginaActual - 1) * itemsPorPagina + 1)}-{Math.min(asistencias.length, paginaActual * itemsPorPagina)}</strong> de <strong>{asistencias.length}</strong> registros
            </span>
            <div className="pagination-size-selector">
              <span>Mostrar:</span>
              <select
                value={registrosPorPagina}
                onChange={(e) => {
                  const val = e.target.value;
                  setRegistrosPorPagina(val === 'todos' ? 'todos' : Number(val));
                  setPaginaActual(1);
                }}
                className="filter-size-select"
              >
                <option value={10}>10 filas</option>
                <option value={25}>25 filas</option>
                <option value={50}>50 filas</option>
                <option value={100}>100 filas</option>
                <option value="todos">Todas</option>
              </select>
            </div>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="btn btn-pagination"
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>
            <span className="pagination-pages">
              Pág. {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="btn btn-pagination"
            >
              <span>Siguiente</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}