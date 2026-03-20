// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: createRef para canvas + dibujo en componentDidMount y componentDidUpdate
import React, { Component, createRef } from 'react';

interface Category { label: string; amount: number; color: string; }
interface State { categories: Category[]; loading: boolean; }

class SpendingChart extends Component<{}, State> {
  private canvasRef = createRef<HTMLCanvasElement>();

  constructor(props: {}) {
    super(props);
    this.state = { categories: [], loading: true };
  }

  componentDidMount() {
    fetch('/api/spending')
      .then(r => r.json())
      .then(data => this.setState({ categories: data, loading: false }, () => this.drawChart()))
      .catch(() => this.setState({ loading: false }));
  }

  componentDidUpdate() {
    this.drawChart();
  }

  drawChart() {
    const canvas = this.canvasRef.current;
    if (!canvas || this.state.categories.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { categories } = this.state;
    const total = categories.reduce((s, c) => s + c.amount, 0);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let startAngle = -Math.PI / 2;
    categories.forEach(cat => {
      const slice = (cat.amount / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();
      startAngle += slice;
    });
    // donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();
    // center text
    ctx.fillStyle = '#f0f4ff';
    ctx.font = '600 18px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${(total / 1000).toFixed(1)}k`, cx, cy - 6);
    ctx.fillStyle = '#8896b0';
    ctx.font = '400 11px DM Sans, sans-serif';
    ctx.fillText('este mes', cx, cy + 12);
  }

  render() {
    const { categories, loading } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="label" style={{ marginBottom: 14 }}>Gastos por categoría</p>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <canvas ref={this.canvasRef} width={160} height={160} style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {categories.map(cat => (
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
  }
}

export default SpendingChart;