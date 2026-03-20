// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: setInterval en componentDidMount + cleanup en componentWillUnmount
import React, { Component } from 'react';

interface Alert { id: number; message: string; type: 'info' | 'warning' | 'critical'; }
interface State { alerts: Alert[]; currentIndex: number; visible: boolean; }

const MOCK_ALERTS: Alert[] = [
  { id: 1, message: 'Mantenimiento programado: domingo 02:00–04:00', type: 'info' },
  { id: 2, message: 'Nuevo límite de transferencias internacionales activo', type: 'warning' },
  { id: 3, message: 'Actualice su contraseña — vence en 7 días', type: 'critical' },
];

class AlertBanner extends Component<{}, State> {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { alerts: MOCK_ALERTS, currentIndex: 0, visible: true };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(prev => ({
        currentIndex: (prev.currentIndex + 1) % MOCK_ALERTS.length,
        visible: true,
      }));
    }, 4000);
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  handleDismiss() {
    this.setState({ visible: false });
  }

  render() {
    const { alerts, currentIndex, visible } = this.state;
    if (!visible) return null;
    const alert = alerts[currentIndex];
    const colors: Record<string, string> = {
      info: 'var(--accent-secondary)',
      warning: 'var(--accent-warning)',
      critical: 'var(--accent-danger)',
    };
    return (
      <div className="fade-up" style={{
        background: `rgba(${alert.type === 'critical' ? '239,68,68' : alert.type === 'warning' ? '245,158,11' : '14,165,233'},0.08)`,
        border: `1px solid rgba(${alert.type === 'critical' ? '239,68,68' : alert.type === 'warning' ? '245,158,11' : '14,165,233'},0.2)`,
        borderRadius: 'var(--radius-md)', padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        animationDelay: '0.1s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: colors[alert.type], fontSize: 16 }}>
            {alert.type === 'critical' ? '⚠' : alert.type === 'warning' ? '◉' : 'ℹ'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{alert.message}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {alerts.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === currentIndex ? colors[alert.type] : 'var(--text-muted)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          <button onClick={this.handleDismiss} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 16, lineHeight: 1
          }}>×</button>
        </div>
      </div>
    );
  }
}

export default AlertBanner;