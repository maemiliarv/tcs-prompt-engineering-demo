import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock global de fetch para los tests
beforeEach(() => {
  global.fetch = jest.fn().mockImplementation((url: string) => {
    const responses: Record<string, unknown> = {
      '/api/accounts': [
        { id: 'CC001', type: 'Cuenta Corriente', balance: 12480.50, currency: 'USD', change: 2.3 },
      ],
      '/api/transactions?filter=Todos': [
        { id: 'T001', description: 'Supermaxi El Bosque', amount: 87.40, date: '19 Mar', type: 'debit', category: 'Alimentación' },
      ],
      '/api/transactions?filter=Débitos': [],
      '/api/transactions?filter=Créditos': [],
      '/api/profile': { name: 'María Emilia Rivadeneira', role: 'Cliente Premium', accountNumber: '•••• 4821', segment: 'Black', since: '2018', avatar: 'ME' },
      '/api/loans/001': [
        { id: 'L001', type: 'Crédito hipotecario', remaining: 42000, total: 80000, nextPayment: '31 Mar', status: 'Al día' },
      ],
      '/api/loans/002': [],
      '/api/spending': [
        { label: 'Alimentación', amount: 420, color: '#00c896' },
      ],
      '/api/contacts': [
        { id: 'C001', name: 'Ana Torres', account: '•••• 1234', avatar: 'AT', lastAmount: 150 },
      ],
    };

    const key = Object.keys(responses).find(k => url.toString().endsWith(k));
    if (key) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses[key]),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

// ── 1. Estructura general ──────────────────────────────────────────

describe('Dashboard — estructura general', () => {
  test('renderiza el header con logo Pichincha', () => {
    render(<App />);
    expect(screen.getByText('Pichincha')).toBeInTheDocument();
    expect(screen.getByText('Banca en línea')).toBeInTheDocument();
  });

  test('renderiza el selector de cuentas', () => {
    render(<App />);
    expect(screen.getByText('Cuenta Principal')).toBeInTheDocument();
    expect(screen.getByText('Cuenta Empresarial')).toBeInTheDocument();
  });

  test('renderiza el footer con los 10 componentes', () => {
    render(<App />);
    expect(screen.getByText('AccountSummary')).toBeInTheDocument();
    expect(screen.getByText('TransactionList')).toBeInTheDocument();
    expect(screen.getByText('RecentContacts')).toBeInTheDocument();
  });
});

// ── 2. CustomerProfile (componente 5) ─────────────────────────────

describe('CustomerProfile', () => {
  test('muestra el nombre del cliente tras cargar', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('María Emilia Rivadeneira')).toBeInTheDocument();
    });
  });

  test('muestra el segmento y número de cuenta', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Black/)).toBeInTheDocument();
    });
  });
});

// ── 3. AccountSummary (componente 1) ──────────────────────────────

describe('AccountSummary', () => {
  test('muestra el tipo de cuenta tras cargar', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Cuenta Corriente')).toBeInTheDocument();
    });
  });
});

// ── 4. TransactionList (componente 2) — filtros ───────────────────

describe('TransactionList — filtros', () => {
  test('muestra transacciones con filtro Todos por defecto', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Supermaxi El Bosque')).toBeInTheDocument();
    });
  });

  test('cambia al filtro Débitos al hacer click', async () => {
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByText('Débitos'));
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=Débitos')
      );
    });
  });

  test('cambia al filtro Créditos al hacer click', async () => {
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByText('Créditos'));
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=Créditos')
      );
    });
  });
});

// ── 5. LoanStatus (componente 6) — cambia con customerId ──────────

describe('LoanStatus — cambio de cuenta', () => {
  test('re-fetcha préstamos al cambiar a Cuenta Empresarial', async () => {
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByText('Cuenta Empresarial'));
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/loans/002')
      );
    });
  });
});

// ── 6. AlertBanner (componente 3) ─────────────────────────────────

describe('AlertBanner', () => {
  test('muestra la primera alerta al renderizar', () => {
    render(<App />);
    expect(screen.getByText('Mantenimiento programado: domingo 02:00–04:00')).toBeInTheDocument();
  });

  test('desaparece al hacer click en el botón de cerrar', () => {
    render(<App />);
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Mantenimiento programado: domingo 02:00–04:00')).not.toBeInTheDocument();
  });
});

// ── 7. CurrencyConverter (componente 4) ───────────────────────────

describe('CurrencyConverter', () => {
  test('renderiza el botón de convertir', () => {
    render(<App />);
    expect(screen.getByText('Convertir')).toBeInTheDocument();
  });

  test('muestra resultado al convertir un monto válido', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(screen.getByText('Convertir'));
    expect(screen.queryByText('—')).not.toBeInTheDocument();
  });
});

// ── 8. QuickTransfer (componente 7) ───────────────────────────────

describe('QuickTransfer', () => {
  test('muestra error si se intenta transferir sin datos', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Transferir'));
    expect(screen.getByText('Completa destinatario y monto')).toBeInTheDocument();
  });

  test('muestra confirmación tras transferencia exitosa', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Destinatario / cuenta'), { target: { value: 'Ana Torres' } });
    fireEvent.change(screen.getByPlaceholderText('Monto (USD)'), { target: { value: '50' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Transferir'));
      await new Promise(r => setTimeout(r, 1600));
    });
    expect(screen.getByText('Transferencia enviada')).toBeInTheDocument();
  });
});

// ── 9. NotificationCenter (componente 9) ──────────────────────────

describe('NotificationCenter', () => {
  test('muestra el botón de notificaciones', () => {
    render(<App />);
    expect(screen.getByText('🔔')).toBeInTheDocument();
  });

  test('abre el panel al hacer click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('🔔'));
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
  });

  test('cierra el panel al hacer click de nuevo', () => {
    render(<App />);
    fireEvent.click(screen.getByText('🔔'));
    fireEvent.click(screen.getByText('🔔'));
    expect(screen.queryByText('Notificaciones')).not.toBeInTheDocument();
  });
});

// ── 10. RecentContacts (componente 10) ────────────────────────────

describe('RecentContacts', () => {
  test('muestra contactos tras cargar', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });
  });

  test('muestra el último monto al seleccionar un contacto', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Ana'));
    await act(async () => {
      fireEvent.click(screen.getByText('Ana'));
    });
    expect(screen.getByText('$150')).toBeInTheDocument();
  });
});