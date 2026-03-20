import React, { useState } from 'react';

interface Props { }

/**
 * QuickTransfer es un componente de transferencia rápida que valida campos y simula el envío.
 * @description Muestra un formulario para destinatario, monto y nota opcional; valida datos; simula el envío y luego muestra un estado de éxito.
 * @param props - Props del componente (sin props específicas).
 * @returns Un card con un formulario de transferencia o un mensaje de éxito tras el envío.
 * @example
 * <QuickTransfer />
 */
const QuickTransfer: React.FC<Props> = () => {
  // Destinatario o número de cuenta para la transferencia.
  const [recipient, setRecipient] = useState<string>('');
  // Monto ingresado por el usuario en USD.
  const [amount, setAmount] = useState<string>('');
  // Nota opcional que acompaña a la transferencia.
  const [note, setNote] = useState<string>('');
  // Indica si la transferencia se está procesando.
  const [sending, setSending] = useState<boolean>(false);
  // Indica si la transferencia se completó con éxito.
  const [success, setSuccess] = useState<boolean>(false);
  // Mensaje de validación o error de envío.
  const [error, setError] = useState<string | null>(null);

  /**
   * handleRecipientChange actualiza el destinatario ingresado.
   * @returns void
   */
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  /**
   * handleAmountChange actualiza el monto ingresado.
   * @returns void
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  /**
   * handleNoteChange actualiza la nota opcional.
   * @returns void
   */
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  /**
   * handleSubmit valida datos básicos y simula el envío de la transferencia.
   * @returns void
   */
  const handleSubmit = () => {
    if (!recipient || !amount) {
      setError('Completa destinatario y monto');
      return;
    }
    setSending(true);
    setError(null);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1500);
  };

  /**
   * handleReset devuelve el formulario a su estado inicial.
   * @returns void
   */
  const handleReset = () => {
    setRecipient('');
    setAmount('');
    setNote('');
    setSuccess(false);
    setError(null);
  };

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
          <button className="btn" onClick={handleReset}>Nueva transferencia</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Destinatario / cuenta" value={recipient} onChange={handleRecipientChange} />
          <input type="number" placeholder="Monto (USD)" value={amount} onChange={handleAmountChange} />
          <input placeholder="Nota (opcional)" value={note} onChange={handleNoteChange} />
          {error && <p style={{ fontSize: 12, color: 'var(--accent-danger)' }}>{error}</p>}
          <button className="btn btn-primary" onClick={handleSubmit} disabled={sending} style={{ justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
            {sending ? 'Enviando…' : 'Transferir'}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * MIGRATION NOTES:
 * - Reemplazado el class component (constructor + this.state + this.setState + handlers bind) por useState y funciones inline.
 * - Limitación conocida: en componentes con nombres poco descriptivos, los comentarios JSDoc pueden ser genéricos y deben revisarse con el equipo.
 */

export default QuickTransfer;