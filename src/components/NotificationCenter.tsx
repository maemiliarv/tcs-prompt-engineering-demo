// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: WebSocket mock en componentDidMount + cleanup en componentWillUnmount
import React, { Component } from 'react';

interface Notification { id: number; text: string; time: string; read: boolean; type: 'tx' | 'alert' | 'promo'; }
interface State { notifications: Notification[]; open: boolean; }

class NotificationCenter extends Component<{}, State> {
  private wsInterval: ReturnType<typeof setInterval> | null = null;
  private counter = 3;

  constructor(props: {}) {
    super(props);
    this.state = {
      notifications: [
        { id: 1, text: 'Débito $45.00 — Supermaxi El Bosque', time: 'hace 2m', read: false, type: 'tx' },
        { id: 2, text: 'Oferta: 0% comisión transferencias hoy', time: 'hace 1h', read: false, type: 'promo' },
        { id: 3, text: 'Límite de tarjeta al 80%', time: 'hace 3h', read: true, type: 'alert' },
      ],
      open: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleMarkAll = this.handleMarkAll.bind(this);
  }

  componentDidMount() {
    // Simula WebSocket con setInterval
    this.wsInterval = setInterval(() => {
      this.counter++;
      this.setState(prev => ({
        notifications: [
          { id: this.counter, text: `Movimiento nuevo detectado — $${(Math.random() * 200).toFixed(2)}`, time: 'ahora', read: false, type: 'tx' },
          ...prev.notifications.slice(0, 4),
        ],
      }));
    }, 8000);
  }

  componentWillUnmount() {
    if (this.wsInterval) clearInterval(this.wsInterval);
  }

  handleToggle() { this.setState(prev => ({ open: !prev.open })); }
  handleMarkAll() {
    this.setState(prev => ({ notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  }

  render() {
    const { notifications, open } = this.state;
    const unread = notifications.filter(n => !n.read).length;
    const icons: Record<string, string> = { tx: '↕', alert: '⚠', promo: '★' };
    const colors: Record<string, string> = { tx: 'var(--accent-secondary)', alert: 'var(--accent-warning)', promo: 'var(--accent-purple)' };

    return (
      <div style={{ position: 'relative' }}>
        <button onClick={this.handleToggle} className="btn" style={{ position: 'relative', padding: '8px 12px' }}>
          🔔
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 16, height: 16,
              borderRadius: '50%', background: 'var(--accent-danger)',
              fontSize: 9, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{unread}</span>
          )}
        </button>
        {open && (
          <div style={{
            position: 'absolute', top: 44, right: 0, width: 300, zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Notificaciones</span>
              <button className="btn" style={{ padding: '4px 10px', fontSize: 11 }} onClick={this.handleMarkAll}>Marcar leídas</button>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', gap: 10, padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: n.read ? 'transparent' : 'rgba(0,200,150,0.03)'
              }}>
                <span style={{ color: colors[n.type], fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icons[n.type]}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, lineHeight: 1.4 }}>{n.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
                </div>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default NotificationCenter;