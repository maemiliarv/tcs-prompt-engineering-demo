import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  category: string;
}

interface Props {
  filter: string;
}

/**
 * @description Muestra las ultimas transacciones asociadas al filtro seleccionado,
 * incluyendo su descripcion, fecha, categoria y monto, junto con un estado visual de carga.
 * @param {Props} props Propiedades del componente.
 * @param {string} props.filter Criterio usado para solicitar y etiquetar las transacciones visibles.
 * @returns {JSX.Element} Una tarjeta con placeholders de carga o la lista de transacciones filtradas.
 * @example
 * ```tsx
 * <TransactionList filter="Esta semana" />
 * ```
 */
const TransactionList: React.FC<Props> = ({ filter }) => {
  // Guarda las transacciones que se mostraran segun el filtro activo del usuario.
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Indica si la lista aun se esta preparando para presentarse en pantalla.
  const [loading, setLoading] = useState<boolean>(false);

  // Actualiza la lista cada vez que cambia el filtro para reflejar el periodo seleccionado.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    /**
     * @description Obtiene las transacciones del filtro actual y sincroniza la informacion mostrada en la tarjeta.
     * @returns {void} No retorna valor; actualiza la lista de transacciones y el estado de carga.
     */
    const loadTransactions = (): void => {
      setLoading(true);

      fetch(`/api/transactions?filter=${filter}`, { signal })
        .then((r) => r.json())
        .then((data: Transaction[]) => setTransactions(data))
        .catch(() => {
          if (!signal.aborted) {
            setLoading(false);
          }
        })
        .finally(() => {
          if (!signal.aborted) {
            setLoading(false);
          }
        });
    };

    loadTransactions();

    return () => {
      controller.abort();
    };
  }, [filter]);

  return (
    <div className="card fade-up" style={{ animationDelay: '0.05s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p className="label">Últimas transacciones</p>
        <span className="badge badge-blue">{filter}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 44, width: '100%', marginBottom: 4 }} />
            ))
          : transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  marginBottom: 4,
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.description}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {tx.date} · {tx.category}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: tx.type === 'credit' ? 'var(--accent-primary)' : 'var(--accent-danger)',
                  }}
                >
                  {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('es-EC')}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TransactionList;

/**
 * MIGRATION NOTES
 * - Se reemplazo el patron de Class Component basado en constructor y this.state por useState.
 * - Se reemplazaron componentDidMount y componentDidUpdate por useEffect con dependencia en filter.
 * - Se reemplazo componentWillUnmount por el cleanup de useEffect usando AbortController nativo.
 * - Limitacion conocida: si las variables tienen nombres poco descriptivos, la documentacion generada puede ser generica y requerira revision del equipo.
 */
