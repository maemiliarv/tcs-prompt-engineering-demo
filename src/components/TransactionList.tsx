// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: componentDidUpdate al cambiar prop/filtro + fetch reactivo
import React, { Component } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  category: string;
}
interface Props { filter: string; }
interface State { transactions: Transaction[]; loading: boolean; }

class TransactionList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { transactions: [], loading: false };
  }

  componentDidMount() { this.loadTransactions(); }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filter !== this.props.filter) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.setState({ loading: true });
    fetch(`/api/transactions?filter=${this.props.filter}`)
      .then(r => r.json())
      .then(data => this.setState({ transactions: data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { transactions, loading } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.05s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p className="label">Últimas transacciones</p>
          <span className="badge badge-blue">{this.props.filter}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading
            ? [1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 44, width: '100%', marginBottom: 4 }} />
              ))
            : transactions.map(tx => (
                <div key={tx.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)', marginBottom: 4
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.description}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{tx.date} · {tx.category}</p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
                    color: tx.type === 'credit' ? 'var(--accent-primary)' : 'var(--accent-danger)'
                  }}>
                    {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('es-EC')}
                  </span>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

export default TransactionList;