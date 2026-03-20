// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: estado local puro sin fetch — setState funcional
import React, { Component } from 'react';

interface State {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  result: number | null;
}

const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, COP: 4050, PEN: 3.72, BRL: 5.1, MXN: 17.2,
};

class CurrencyConverter extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { amount: '', fromCurrency: 'USD', toCurrency: 'EUR', result: null };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.handleConvert = this.handleConvert.bind(this);
  }

  handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ amount: e.target.value, result: null });
  }
  handleFromChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ fromCurrency: e.target.value, result: null });
  }
  handleToChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ toCurrency: e.target.value, result: null });
  }
  handleSwap() {
    this.setState(prev => ({ fromCurrency: prev.toCurrency, toCurrency: prev.fromCurrency, result: null }));
  }
  handleConvert() {
    const { amount, fromCurrency, toCurrency } = this.state;
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const inUSD = val / RATES[fromCurrency];
    this.setState({ result: parseFloat((inUSD * RATES[toCurrency]).toFixed(4)) });
  }

  render() {
    const { amount, fromCurrency, toCurrency, result } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.15s' }}>
        <p className="label" style={{ marginBottom: 14 }}>Conversor de divisas</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="number" placeholder="0.00" value={amount} onChange={this.handleAmountChange} style={{ flex: 2 }} />
          <select value={fromCurrency} onChange={this.handleFromChange} style={{ flex: 1 }}>
            {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <button onClick={this.handleSwap} className="btn" style={{ padding: '6px 12px', fontSize: 16 }}>⇅</button>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 2, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: result ? 'var(--accent-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {result ?? '—'}
          </div>
          <select value={toCurrency} onChange={this.handleToChange} style={{ flex: 1 }}>
            {Object.keys(RATES).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={this.handleConvert} style={{ width: '100%', justifyContent: 'center' }}>
          Convertir
        </button>
      </div>
    );
  }
}

export default CurrencyConverter;