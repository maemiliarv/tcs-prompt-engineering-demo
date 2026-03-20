// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: componentDidMount + AbortController para cancelar fetch al desmontar
import React, { Component } from 'react';

interface Profile {
  name: string;
  role: string;
  accountNumber: string;
  segment: string;
  since: string;
  avatar: string;
}
interface State { profile: Profile | null; loading: boolean; }

class CustomerProfile extends Component<{}, State> {
  private abortController: AbortController | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { profile: null, loading: true };
  }

  componentDidMount() {
    this.abortController = new AbortController();
    fetch('/api/profile', { signal: this.abortController.signal })
      .then(r => r.json())
      .then(data => this.setState({ profile: data, loading: false }))
      .catch(err => { if (err.name !== 'AbortError') this.setState({ loading: false }); });
  }

  componentWillUnmount() {
    if (this.abortController) this.abortController.abort();
  }

  render() {
    const { profile, loading } = this.state;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {loading ? (
          <>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
            <div>
              <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: 80, height: 12 }} />
            </div>
          </>
        ) : profile ? (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 600, color: '#000'
            }}>
              {profile.avatar}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{profile.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                {profile.segment} · {profile.accountNumber}
              </p>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default CustomerProfile;