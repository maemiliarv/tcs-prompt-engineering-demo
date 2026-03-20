import React, { Component } from 'react';
import './mockFetch';
import './styles/global.css';

import CustomerProfile   from './components/CustomerProfile';
import NotificationCenter from './components/NotificationCenter';
import AlertBanner        from './components/AlertBanner';
import AccountSummary     from './components/AccountSummary';
import SpendingChart      from './components/SpendingChart';
import TransactionList    from './components/TransactionList';
import LoanStatus         from './components/LoanStatus';
import QuickTransfer      from './components/QuickTransfer';
import CurrencyConverter  from './components/CurrencyConverter';
import RecentContacts     from './components/RecentContacts';

interface State {
  txFilter: string;
  customerId: string;
}

const FILTERS = ['Todos', 'Débitos', 'Créditos'];
const CUSTOMERS = [
  { id: '001', label: 'Cuenta Principal' },
  { id: '002', label: 'Cuenta Empresarial' },
];

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { txFilter: 'Todos', customerId: '001' };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
  }

  handleFilterChange(filter: string) { this.setState({ txFilter: filter }); }
  handleCustomerChange(id: string) { this.setState({ customerId: id }); }

  render() {
    const { txFilter, customerId } = this.state;

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

        {/* ── Top bar ── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,14,26,0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#000',
            }}>P</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Pichincha</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Banca en línea</p>
            </div>
          </div>

          {/* Center: account selector */}
          <div style={{ display: 'flex', gap: 4 }}>
            {CUSTOMERS.map(c => (
              <button key={c.id} onClick={() => this.handleCustomerChange(c.id)} className="btn" style={{
                fontSize: 12,
                background: customerId === c.id ? 'var(--bg-elevated)' : 'transparent',
                borderColor: customerId === c.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: customerId === c.id ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Right: profile + notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <CustomerProfile />
            <NotificationCenter />
          </div>
        </header>

        {/* ── Main content ── */}
        <main style={{ padding: '24px 28px', maxWidth: 1280, margin: '0 auto' }}>

          {/* Alert banner */}
          <div style={{ marginBottom: 20 }}>
            <AlertBanner />
          </div>

          {/* Row 1: Account summary + Spending chart + Loan status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr 1fr',
            gap: 16,
            marginBottom: 16,
          }}>
            <AccountSummary />
            <SpendingChart />
            <LoanStatus customerId={customerId} />
          </div>

          {/* Row 2: Transactions (wide) */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="label">Filtrar:</span>
              {FILTERS.map(f => (
                <button key={f} onClick={() => this.handleFilterChange(f)} className="btn" style={{
                  fontSize: 12, padding: '5px 12px',
                  background: txFilter === f ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: txFilter === f ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: txFilter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                  {f}
                </button>
              ))}
            </div>
            <TransactionList filter={txFilter} />
          </div>

          {/* Row 3: Quick transfer + Currency converter + Recent contacts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.2fr',
            gap: 16,
          }}>
            <QuickTransfer />
            <CurrencyConverter />
            <RecentContacts />
          </div>

          {/* Footer legend */}
          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', gap: 16,
          }}>
            <p className="label" style={{ width: '100%', marginBottom: 8 }}>
              Escenario 4 — 10 Class Components migrables · Metodología de Prompt Engineering · TCS Ecuador
            </p>
            {[
              { num: 1, name: 'AccountSummary',    pattern: 'constructor + componentDidMount' },
              { num: 2, name: 'TransactionList',   pattern: 'componentDidUpdate (filtro)' },
              { num: 3, name: 'AlertBanner',       pattern: 'setInterval + cleanup' },
              { num: 4, name: 'CurrencyConverter', pattern: 'setState local puro' },
              { num: 5, name: 'CustomerProfile',   pattern: 'AbortController + cleanup' },
              { num: 6, name: 'LoanStatus',        pattern: 'componentDidUpdate (prop)' },
              { num: 7, name: 'QuickTransfer',     pattern: 'formulario controlado + bind' },
              { num: 8, name: 'SpendingChart',     pattern: 'createRef + canvas' },
              { num: 9, name: 'NotificationCenter',pattern: 'WebSocket mock + cleanup' },
              { num: 10,name: 'RecentContacts',    pattern: 'shouldComponentUpdate' },
            ].map(c => (
              <div key={c.num} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, color: 'var(--accent-primary)',
                  flexShrink: 0,
                }}>{c.num}</span>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>{c.pattern}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
}

export default App;