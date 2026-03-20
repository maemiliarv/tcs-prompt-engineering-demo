import React, { useEffect, useRef, useState } from 'react';

interface Category {
  label: string;
  amount: number;
  color: string;
}

interface SpendingChartProps {}

/**
 * @description Muestra un grafico de dona con la distribucion de gastos por categoria,
 * junto con el detalle monetario de cada rubro para el periodo actual.
 * @param {SpendingChartProps} _props Propiedades del componente. Este componente no recibe props.
 * @returns {JSX.Element} Una tarjeta con el estado de carga o un resumen visual de los gastos por categoria.
 * @example
 * ```tsx
 * <SpendingChart />
 * ```
 */
const SpendingChart: React.FC<SpendingChartProps> = (_props) => {
  // Conserva el listado de categorias y montos que alimentan el resumen de gastos del mes.
  const [categories, setCategories] = useState<Category[]>([]);
  // Indica si la informacion de gastos aun se esta preparando para mostrarse al usuario.
  const [loading, setLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * @description Dibuja el grafico de dona en el canvas con base en los montos consolidados por categoria.
   * @returns {void} No retorna valor; actualiza la representacion visual del resumen de gastos.
   */
  const drawChart = (): void => {
    const canvas = canvasRef.current;
    if (!canvas || categories.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = categories.reduce((s, c) => s + c.amount, 0);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let startAngle = -Math.PI / 2;
    categories.forEach((cat) => {
      const slice = (cat.amount / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();
      startAngle += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();

    ctx.fillStyle = '#f0f4ff';
    ctx.font = '600 18px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${(total / 1000).toFixed(1)}k`, cx, cy - 6);
    ctx.fillStyle = '#8896b0';
    ctx.font = '400 11px DM Sans, sans-serif';
    ctx.fillText('este mes', cx, cy + 12);
  };

  // Recupera la distribucion de gastos para presentar el panorama financiero actual.
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('/api/spending', { signal })
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        if (!signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Redibuja el resumen visual cuando cambian los importes por categoria.
  useEffect(() => {
    drawChart();
  }, [categories]);

  return (
    <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
      <p className="label" style={{ marginBottom: 14 }}>Gastos por categoria</p>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <canvas ref={canvasRef} width={160} height={160} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {categories.map((cat) => (
              <div key={cat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.label}</span>
                </div>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  ${cat.amount.toLocaleString('es-EC')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;

/**
 * MIGRATION NOTES
 * - Se reemplazo el patron de Class Component basado en state y metodos de ciclo de vida
 *   por Hooks: useState para el estado, useEffect para efectos secundarios y useRef para
 *   conservar la referencia al canvas.
 * - Limitacion conocida: si las variables tienen nombres poco descriptivos, la documentacion
 *   generada puede ser generica y requerira revision del equipo.
 */
