// LEGACY CLASS COMPONENT — Insumo para migración
// Patrón: formulario controlado con múltiples setState + .bind(this) en constructor
import React, { Component } from 'react';

interface State {
  recipient: string;
  amount: string;
  note: string;
  sending: boolean;
  success: boolean;
  error: string | null;
}

class QuickTransfer extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { recipient: '', amount: '', note: '', sending: false, success: false, error: null };
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleRecipientChange(e: React.ChangeEvent<HTMLInputElement>) { this.setState({ recipient: e.target.value }); }
  handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) { this.setState({ amount: e.target.value }); }
  handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) { this.setState({ note: e.target.value }); }

  handleSubmit() {
    const { recipient, amount } = this.state;
    if (!recipient || !amount) { this.setState({ error: 'Completa destinatario y monto' }); return; }
    this.setState({ sending: true, error: null });
    setTimeout(() => {
      this.setState({ sending: false, success: true });
    }, 1500);
  }

  handleReset() {
    this.setState({ recipient: '', amount: '', note: '', success: false, error: null });
  }

  render() {
    const { recipient, amount, note, sending, success, error } = this.state;
    return (
      <div className="card fade-up" style={{ animationDelay: '0.25s' }}>
        <p className="label" style={{ marginBottom: 14 }}>Transferencia rápida</p>
        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 500, marginBottom: 4 }}>Transferencia enviada</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              ${parseFloat(amount || '0').toLocaleString()} → {recipient}
            </p>
            <button className="btn" onClick={this.handleReset}>Nueva transferencia</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input placeholder="Destinatario / cuenta" value={recipient} onChange={this.handleRecipientChange} />
            <input type="number" placeholder="Monto (USD)" value={amount} onChange={this.handleAmountChange} />
            <input placeholder="Nota (opcional)" value={note} onChange={this.handleNoteChange} />
            {error && <p style={{ fontSize: 12, color: 'var(--accent-danger)' }}>{error}</p>}
            <button className="btn btn-primary" onClick={this.handleSubmit} disabled={sending} style={{ justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
              {sending ? 'Enviando…' : 'Transferir'}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default QuickTransfer;