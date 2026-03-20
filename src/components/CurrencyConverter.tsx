import React, { useState } from 'react';

interface Props { }

const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, COP: 4050, PEN: 3.72, BRL: 5.1, MXN: 17.2,
};

/**
 * CurrencyConverter muestra un card para convertir un monto entre monedas con tasas predefinidas.
 * @description Conversor de divisas local que permite elegir moneda origen, destino y calcular el monto.
 * @param props - Props del componente (vacío).
 * @returns El formulario del conversor y el resultado de cálculo.
 * @example
 * <CurrencyConverter />
 */
const CurrencyConverter: React.FC<Props> = () => {
  // Monto ingresado por el usuario.
  const [amount, setAmount] = useState<string>('');
  // Moneda de origen seleccionada.
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  // Moneda de destino seleccionada.
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  // Resultado de la conversión.
  const [result, setResult] = useState<number | null>(null);

  /**
   * Actualiza el monto y limpia el resultado previo.
   * @param e - Evento de cambio del input de cantidad.
   * @returns void
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setResult(null);
  };

  /**
   * Actualiza la moneda de origen y limpia el resultado previo.
   * @param e - Evento de cambio del select de moneda origen.
   * @returns void
   */
  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
    setResult(null);
  };

  /**
   * Actualiza la moneda de destino y limpia el resultado previo.
   * @param e - Evento de cambio del select de moneda destino.
   * @returns void
   */
  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
    setResult(null);
  };

  /**
   * Intercambia las monedas de origen y destino.
   * @returns void
   */
  const handleSwap = () => {
    setFromCurrency((prevFrom) => {
      setToCurrency(prevFrom);
      return toCurrency;
    });
    setResult(null);
  };

  /**
   * Convierte el monto según las tasas y actualiza el resultado.
   * @returns void
   */
  const handleConvert = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const inUSD = val / RATES[fromCurrency];
    setResult(parseFloat((inUSD * RATES[toCurrency]).toFixed(4)));
  };

  return (
    <div className="card fade-up" style={{ animationDelay: '0.15s' }}>
      <p className="label" style={{ marginBottom: 14 }}>Conversor de divisas</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input type="number" placeholder="0.00" value={amount} onChange={handleAmountChange} style={{ flex: 2 }} />
        <select value={fromCurrency} onChange={handleFromChange} style={{ flex: 1 }}>
          {Object.keys(RATES).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <button onClick={handleSwap} className="btn" style={{ padding: '6px 12px', fontSize: 16 }}>⇅</button>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 2, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: result ? 'var(--accent-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {result ?? '—'}
        </div>
        <select value={toCurrency} onChange={handleToChange} style={{ flex: 1 }}>
          {Object.keys(RATES).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleConvert} style={{ width: '100%', justifyContent: 'center' }}>
        Convertir
      </button>
    </div>
  );
};

export default CurrencyConverter;

/**
 * MIGRATION NOTES:
 * - Patrón de Class Component con constructor y setState fue reemplazado por useState.
 * - No hay efecto de ciclo de vida; la lógica local se mantiene en handlers.
 * - Limitación conocida: la verificación visual de animaciones debe hacerse en el navegador.
 */