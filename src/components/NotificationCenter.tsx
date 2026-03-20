import React, { useEffect, useState } from 'react';

interface Notification { id: number; text: string; time: string; read: boolean; type: 'tx' | 'alert' | 'promo'; }
interface Props { }

/**
 * NotificationCenter muestra un ícono de notificaciones y un panel desplegable con mensajes.
 * @description Simula la llegada de notificaciones periódicas y permite marcar todas como leídas.
 * @param props - Props del componente (vacío).
 * @returns Renderiza un botón de campana y un panel de notificaciones.
 * @example
 * <NotificationCenter />
 */
const NotificationCenter: React.FC<Props> = () => {
  // Estado local de las notificaciones visibles en el panel.
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'Débito $45.00 — Supermaxi El Bosque', time: 'hace 2m', read: false, type: 'tx' },
    { id: 2, text: 'Oferta: 0% comisión transferencias hoy', time: 'hace 1h', read: false, type: 'promo' },
    { id: 3, text: 'Límite de tarjeta al 80%', time: 'hace 3h', read: true, type: 'alert' },
  ]);
  // Controla si el panel de notificaciones está abierto.
  const [open, setOpen] = useState<boolean>(false);
  // Contador interno para IDs de notificaciones nuevas.
  const [counter, setCounter] = useState<number>(3);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prev) => {
        const value = prev + 1;
        setNotifications((prevNotifications) => [
          { id: value, text: `Movimiento nuevo detectado — $${(Math.random() * 200).toFixed(2)}`, time: 'ahora', read: false, type: 'tx' },
          ...prevNotifications.slice(0, 4),
        ]);
        return value;
      });
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Alterna la visibilidad del panel de notificaciones.
   * @returns void
   */
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  /**
   * Marca todas las notificaciones como leídas.
   * @returns void
   */
  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = notifications.filter((n) => !n.read).length;
  const icons: Record<string, string> = { tx: '↕', alert: '⚠', promo: '★' };
  const colors: Record<string, string> = { tx: 'var(--accent-secondary)', alert: 'var(--accent-warning)', promo: 'var(--accent-purple)' };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleToggle} className="btn" style={{ position: 'relative', padding: '8px 12px' }}>
        🔔
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--accent-danger)',
              fontSize: 9,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 44,
            right: 0,
            width: 300,
            zIndex: 100,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>Notificaciones</span>
            <button className="btn" style={{ padding: '4px 10px', fontSize: 11 }} onClick={handleMarkAll}>
              Marcar leídas
            </button>
          </div>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                gap: 10,
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: n.read ? 'transparent' : 'rgba(0,200,150,0.03)',
              }}
            >
              <span style={{ color: colors[n.type], fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icons[n.type]}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, lineHeight: 1.4 }}>{n.text}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
              </div>
              {!n.read && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * MIGRATION NOTES:
 * - Reemplazado componentDidMount/setInterval y componentWillUnmount/clearInterval por useEffect con cleanup.
 * - El patrón de actualización de estado con setState fue reemplazado por useState y setters.
 * - Limitación conocida: las animaciones y transiciones deben verificarse manualmente en UI.
 */

export default NotificationCenter;