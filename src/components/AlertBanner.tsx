import React, { useEffect, useState } from 'react';

interface Alert { id: number; message: string; type: 'info' | 'warning' | 'critical'; }
interface Props { }

const MOCK_ALERTS: Alert[] = [
  { id: 1, message: 'Mantenimiento programado: domingo 02:00–04:00', type: 'info' },
  { id: 2, message: 'Nuevo límite de transferencias internacionales activo', type: 'warning' },
  { id: 3, message: 'Actualice su contraseña — vence en 7 días', type: 'critical' },
];

/**
 * AlertBanner muestra un banner de notificaciones transitorias que rota entre alertas predefinidas.
 * @description Banner visible con un ciclo de alertas que cambia cada 4 segundos y se puede cerrar.
 * @param props - Props del componente (actualmente vacío).
 * @returns Un elemento JSX con el banner de alerta o null si está cerrado.
 * @example
 * <AlertBanner />
 */
const AlertBanner: React.FC<Props> = () => {
  // Estado de las alertas disponibles para mostrar.
  const [alerts] = useState<Alert[]>(MOCK_ALERTS);
  // Índice de la alerta actualmente visible.
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Controla si el banner está visible o oculto.
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // Crea un intervalo de rotación de alertas cada 4 segundos y mantiene el banner visible.
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_ALERTS.length);
      setVisible(true);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * handleDismiss oculta el banner.
   * @returns {void}
   */
  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  const alert = alerts[currentIndex];
  const colors: Record<string, string> = {
    info: 'var(--accent-secondary)',
    warning: 'var(--accent-warning)',
    critical: 'var(--accent-danger)',
  };

  return (
    <div
      className="fade-up"
      style={{
        background: `rgba(${alert.type === 'critical' ? '239,68,68' : alert.type === 'warning' ? '245,158,11' : '14,165,233'},0.08)`,
        border: `1px solid rgba(${alert.type === 'critical' ? '239,68,68' : alert.type === 'warning' ? '245,158,11' : '14,165,233'},0.2)`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animationDelay: '0.1s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: colors[alert.type], fontSize: 16 }}>
          {alert.type === 'critical' ? '⚠' : alert.type === 'warning' ? '◉' : 'ℹ'}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{alert.message}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {alerts.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === currentIndex ? colors[alert.type] : 'var(--text-muted)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;

/**
 * MIGRATION NOTES:
 * - Reemplazado setInterval en componentDidMount + componentWillUnmount con useEffect y cleanup.
 * - El patrón de ciclo de vida de clase (componentDidMount/componentWillUnmount) fue migrado a useEffect.
 * - Limitación conocida: la lógica de estilo y animación debe verificarse manualmente en el navegador.
 */
