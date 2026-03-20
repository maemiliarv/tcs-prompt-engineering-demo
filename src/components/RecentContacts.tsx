import React, { useEffect, useState } from 'react';

interface Contact {
  id: string;
  name: string;
  account: string;
  avatar: string;
  lastAmount: number;
}

/**
 * RecentContacts muestra los contactos frecuentes y permite seleccionar uno para ver su monto.
 * @description Carga los contactos desde API, muestra un estado de carga y habilita selección de usuario.
 * @param props - Component props (no requiere props).
 * @returns Un card con contactos frecuentes o animaciones esqueléticas mientras carga.
 * @example
 * <RecentContacts />
 */
const RecentContacts: React.FC = () => {
  // Lista de contactos frecuentes cargada desde la API.
  const [contacts, setContacts] = useState<Contact[]>([]);
  // Contacto actualmente seleccionado para mostrar su último monto.
  const [selected, setSelected] = useState<string | null>(null);
  // Indica si la lista de contactos se está cargando.
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * useEffect para cargar contactos al montar y cancelar la solicitud si el componente se desmonta.
   * @returns cleanup para abortar el fetch.
   */
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('/api/contacts', { signal })
      .then((r) => r.json())
      .then((data) => {
        setContacts(data);
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

  /**
   * handleSelect alterna la selección del contacto.
   * @returns void
   */
  const handleSelect = (id: string) => {
    setSelected((prevSelected) => (prevSelected === id ? null : id));
  };

  return (
    <div className="card fade-up" style={{ animationDelay: '0.3s' }}>
      <p className="label" style={{ marginBottom: 14 }}>Contactos frecuentes</p>
      {loading ? (
        <div style={{ display: 'flex', gap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: 40, height: 10 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                background: selected === c.id ? 'var(--bg-elevated)' : 'transparent',
                border: selected === c.id ? '1px solid var(--border-accent)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-purple))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {c.avatar}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {c.name.split(' ')[0]}
              </span>
              {selected === c.id && (
                <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  ${c.lastAmount.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * MIGRATION NOTES:
 * - Reemplazado class component con constructor, this.state y shouldComponentUpdate por useState y useEffect con cleanup.
 * - Limitación conocida: la migración puede dejar estilos y animaciones iguales, y se debe verificar visualmente en el navegador.
 */

export default RecentContacts;