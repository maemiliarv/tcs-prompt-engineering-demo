import React, { useEffect, useState } from 'react';

interface Profile {
  name: string;
  role: string;
  accountNumber: string;
  segment: string;
  since: string;
  avatar: string;
}

interface Props { }

/**
 * CustomerProfile muestra el avatar y datos básicos de un cliente.
 * @description Carga datos de perfil de /api/profile con un AbortController para cancelar al desmontar.
 * @param props - Props del componente (vacío).
 * @returns Un bloque que muestra skeletons o el perfil del usuario.
 * @example <CustomerProfile />
 */
const CustomerProfile: React.FC<Props> = () => {
  // Guarda el perfil del cliente cargado desde la API.
  const [profile, setProfile] = useState<Profile | null>(null);
  // Controla si la información del cliente aún está cargando.
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/profile', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {loading ? (
        <>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
          <div>
            <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 80, height: 12 }} />
          </div>
        </>
      ) : profile ? (
        <>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 600,
              color: '#000',
            }}
          >
            {profile.avatar}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{profile.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {profile.segment} · {profile.accountNumber}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CustomerProfile;

/**
 * MIGRATION NOTES:
 * - Reemplazado componentDidMount y componentWillUnmount con useEffect + cleanup.
 * - AbortController nativo para cancelar fetch en desmontaje.
 * - Limitación conocida: comportamiento visual/animaciones se debe validar manualmente en UI.
 */