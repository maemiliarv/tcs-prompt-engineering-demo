// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: constructor + setState + componentDidMount + fetch
import React, { Component } from 'react';

interface Account {
  id: string;
  type: string;
  balance: number;
  currency: string;
  change: number;
}

interface State {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  totalBalance: number;
}

class AccountSummary extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      accounts: [],
      loading: false,
      error: null,
      totalBalance: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        const total = data.reduce((sum: number, a: Account) => sum + a.balance, 0);
        this.setState({ accounts: data, totalBalance: total, loading: false });
      })
      .catch(err => this.setState({ error: err.message, loading: false }));
  }

  render() {
    const { accounts, loading, totalBalance } = this.state;
    return (
      <div className="card fade-up">
        <p className="label">Balance total</p>
        {loading ? (
          <div className="skeleton" style={{ height: 36, width: 180, marginTop: 8 }} />
        ) : (
          <p className="value-lg" style={{ color: 'var(--accent-primary)', marginTop: 4 }}>
            ${totalBalance.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </p>
        )}
        <div className="divider" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading
            ? [1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 20, width: '100%' }} />
              ))
            : accounts.map(acc => (
                <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{acc.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      ${acc.balance.toLocaleString('es-EC')}
                    </span>
                    <span className={`badge ${acc.change >= 0 ? 'badge-green' : 'badge-red'}`}>
                      {acc.change >= 0 ? '↑' : '↓'} {Math.abs(acc.change)}%
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

export default AccountSummary;