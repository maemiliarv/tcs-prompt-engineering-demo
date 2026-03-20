import React, { useEffect, useState } from 'react';

interface Account {
  id: string;
  type: string;
  balance: number;
  currency: string;
  change: number;
}

interface AccountSummaryProps { }

/**
 * @description
 * Componente de resumen de cuentas que recupera los datos de cuentas bancarias,
 * calcula el balance total y muestra tarjetas de estado o cargas fantasma (skeleton) mientras se carga.
 *
 * @param props - Props del componente (actualmente vacío).
 * @returns Renderiza el resumen de balances y la lista de cuentas con variación.
 * @example
 * <AccountSummary />
 */
const AccountSummary: React.FC<AccountSummaryProps> = () => {
  // Mantiene los datos de cuentas del usuario para renderizar la lista
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Indica si los datos de cuentas están en proceso de carga
  const [loading, setLoading] = useState(false);

  // Guarda el mensaje de error si la carga de cuentas falla
  const [error, setError] = useState<string | null>(null);

  // Calcula el total del balance de todas las cuentas para mostrarlo en el encabezado
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    // useEffect reemplaza componentDidMount para hacer fetch y limpiar en unmount
    const controller = new AbortController();
    const signal = controller.signal;

    /**
     * @description
     * Obtiene las cuentas desde la API y calcula el balance total.
     * @returns Promise<void>
     */
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/accounts', { signal });
        const data: Account[] = await response.json();
        const total = data.reduce((sum: number, a: Account) => sum + a.balance, 0);
        setAccounts(data);
        setTotalBalance(total);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="card fade-up">
      <p className="label">Balance total</p>
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: 180, marginTop: 8 }} />
      ) : (
        <p className="value-lg" style={{ color: 'var(--accent-primary)', marginTop: 4 }}>
          ${totalBalance.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
        </p>
      )}
      <div className="divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading
          ? [1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 20, width: '100%' }} />
          ))
          : accounts.map(acc => (
            <div
              key={acc.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{acc.type}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  ${acc.balance.toLocaleString('es-EC')}
                </span>
                <span className={`badge ${acc.change >= 0 ? 'badge-green' : 'badge-red'}`}>
                  {acc.change >= 0 ? '↑' : '↓'} {Math.abs(acc.change)}%
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

/**
 * MIGRATION NOTES:
 * - Se reemplazó el patrón de Class Component con constructor/setState/componentDidMount
 *   por un Functional Component con useState y useEffect.
 * - Se reemplazó el manejo de axios cancelToken por AbortController nativo en useEffect.
 * - Limitación conocida: si los nombres de variables son genéricos, la documentación puede ser demasiado general y requiere revisión del equipo.
 */

export default AccountSummary;
