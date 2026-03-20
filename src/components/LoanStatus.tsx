// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: componentDidUpdate con prop externa + loading/error state completo
import React, { Component } from 'react';

interface Loan { id: string; type: string; remaining: number; total: number; nextPayment: string; status: string; }
interface Props { customerId: string; }
interface State { loans: Loan[]; loading: boolean; error: string | null; }

class LoanStatus extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { loans: [], loading: false, error: null };
  }

  componentDidMount() { this.fetchLoans(); }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.customerId !== this.props.customerId) this.fetchLoans();
  }

  fetchLoans() {
    this.setState({ loading: true, error: null });
    fetch(`/api/loans/${this.props.customerId}`)
      .then(r => { if (!r.ok) throw new Error('Error al cargar préstamos'); return r.json(); })
      .then(data => this.setState({ loans: data, loading: false }))
      .catch(err => this.setState({ error: err.message, loading: false }));
  }

  render() {
    const { loans, loading, error } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
        <p className="label" style={{ marginBottom: 14 }}>Préstamos activos</p>
        {loading && <div className="skeleton" style={{ height: 80 }} />}
        {error && <p style={{ color: 'var(--accent-danger)', fontSize: 13 }}>{error}</p>}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loans.map(loan => {
              const pct = Math.round(((loan.total - loan.remaining) / loan.total) * 100);
              return (
                <div key={loan.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{loan.type}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Próximo pago: {loan.nextPayment}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        ${loan.remaining.toLocaleString('es-EC')}
                      </p>
                      <span className={`badge ${loan.status === 'Al día' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 10 }}>
                        {loan.status}
                      </span>
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
  }
}

export default LoanStatus;