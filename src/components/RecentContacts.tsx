// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: shouldComponentUpdate para optimización + componentDidMount + React.memo equivalente
import React, { Component } from 'react';

interface Contact { id: string; name: string; account: string; avatar: string; lastAmount: number; }
interface State { contacts: Contact[]; selected: string | null; loading: boolean; }

class RecentContacts extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { contacts: [], selected: null, loading: true };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    fetch('/api/contacts')
      .then(r => r.json())
      .then(data => this.setState({ contacts: data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  shouldComponentUpdate(_: {}, nextState: State) {
    // Solo re-renderiza si contacts, selected o loading cambian
    return (
      nextState.contacts !== this.state.contacts ||
      nextState.selected !== this.state.selected ||
      nextState.loading !== this.state.loading
    );
  }

  handleSelect(id: string) {
    this.setState(prev => ({ selected: prev.selected === id ? null : id }));
  }

  render() {
    const { contacts, selected, loading } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.3s' }}>
        <p className="label" style={{ marginBottom: 14 }}>Contactos frecuentes</p>
        {loading ? (
          <div style={{ display: 'flex', gap: 12 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: 40, height: 10 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {contacts.map(c => (
              <button key={c.id} onClick={() => this.handleSelect(c.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: selected === c.id ? 'var(--bg-elevated)' : 'transparent',
                border: selected === c.id ? '1px solid var(--border-accent)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: '#fff'
                }}>{c.avatar}</div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c.name.split(' ')[0]}</span>
                {selected === c.id && (
                  <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    ${c.lastAmount.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default RecentContacts;