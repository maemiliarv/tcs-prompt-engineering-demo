import React, { useEffect, useState } from 'react';

interface Loan { id: string; type: string; remaining: number; total: number; nextPayment: string; status: string; }
interface Props { customerId: string; }

/**
 * LoanStatus muestra el estado de préstamos activos de un cliente.
 * @description Muestra un resumen de préstamos, carga datos desde la API y refresca al cambiar customerId.
 * @param props - Props del componente.
 * @param props.customerId - ID del cliente para cargar sus préstamos.
 * @returns Un card con estado de carga, error o lista de préstamos.
 * @example
 * <LoanStatus customerId="001" />
 */
const LoanStatus: React.FC<Props> = ({ customerId }) => {
  // Lista de préstamos del cliente.
  const [loans, setLoans] = useState<Loan[]>([]);
  // Indica si se está cargando información de préstamos.
  const [loading, setLoading] = useState<boolean>(false);
  // Mensaje de error en caso de fallo de carga.
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchLoans obtiene los préstamos para el customerId actual.
   * @returns void
   */
  const fetchLoans = () => {
    setLoading(true);
    setError(null);

    fetch(`/api/loans/${customerId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar préstamos');
        return r.json();
      })
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, [customerId]);

  return (
    <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
      <p className="label" style={{ marginBottom: 14 }}>Préstamos activos</p>
      {loading && <div className="skeleton" style={{ height: 80 }} />}
      {error && <p style={{ color: 'var(--accent-danger)', fontSize: 13 }}>{error}</p>}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loans.map((loan) => {
            const pct = Math.round(((loan.total - loan.remaining) / loan.total) * 100);
            return (
              <div key={loan.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{loan.type}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Próximo pago: {loan.nextPayment}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>${loan.remaining.toLocaleString('es-EC')}</p>
                    <span className={`badge ${loan.status === 'Al día' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 10 }}>{loan.status}</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-primary)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% pagado</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * MIGRATION NOTES:
 * - Reemplazado componentDidMount/componentDidUpdate por useEffect con dependencia customerId.
 * - Se mantiene la lógica de fetch y estado de carga/error sin cambios funcionales.
 * - Limitación conocida: revisar manualmente comportamientos visuales y animaciones en navegador.
 */

export default LoanStatus;