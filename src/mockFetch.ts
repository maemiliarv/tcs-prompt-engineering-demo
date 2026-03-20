// Mock global de fetch — simula todos los endpoints del dashboard
// Remover en producción y reemplazar con API real

const originalFetch = window.fetch.bind(window);

const MOCK_DATA: Record<string, unknown> = {
  '/api/accounts': [
    { id: 'CC001', type: 'Cuenta Corriente', balance: 12480.50, currency: 'USD', change: 2.3 },
    { id: 'AH002', type: 'Cuenta de Ahorros', balance: 34200.00, currency: 'USD', change: 0.8 },
    { id: 'INV003', type: 'Inversión 30 días', balance: 8750.00, currency: 'USD', change: -0.2 },
  ],
  '/api/transactions?filter=Todos': [
    { id: 'T001', description: 'Supermaxi El Bosque', amount: 87.40, date: '19 Mar', type: 'debit', category: 'Alimentación' },
    { id: 'T002', description: 'Transferencia recibida — TCS', amount: 2400.00, date: '18 Mar', type: 'credit', category: 'Salario' },
    { id: 'T003', description: 'Netflix', amount: 15.99, date: '17 Mar', type: 'debit', category: 'Entretenimiento' },
    { id: 'T004', description: 'Farmacia Fybeca', amount: 32.50, date: '16 Mar', type: 'debit', category: 'Salud' },
  ],
  '/api/transactions?filter=Débitos': [
    { id: 'T001', description: 'Supermaxi El Bosque', amount: 87.40, date: '19 Mar', type: 'debit', category: 'Alimentación' },
    { id: 'T003', description: 'Netflix', amount: 15.99, date: '17 Mar', type: 'debit', category: 'Entretenimiento' },
    { id: 'T004', description: 'Farmacia Fybeca', amount: 32.50, date: '16 Mar', type: 'debit', category: 'Salud' },
  ],
  '/api/transactions?filter=Créditos': [
    { id: 'T002', description: 'Transferencia recibida — TCS', amount: 2400.00, date: '18 Mar', type: 'credit', category: 'Salario' },
    { id: 'T005', description: 'Reembolso seguro', amount: 120.00, date: '14 Mar', type: 'credit', category: 'Seguros' },
  ],
  '/api/profile': {
    name: 'María Emilia Rivadeneira',
    role: 'Cliente Premium',
    accountNumber: '•••• 4821',
    segment: 'Black',
    since: '2018',
    avatar: 'ME',
  },
  '/api/loans/001': [
    { id: 'L001', type: 'Crédito hipotecario', remaining: 42000, total: 80000, nextPayment: '31 Mar', status: 'Al día' },
    { id: 'L002', type: 'Crédito vehicular', remaining: 8200, total: 15000, nextPayment: '5 Abr', status: 'Al día' },
  ],
  '/api/loans/002': [
    { id: 'L003', type: 'Crédito personal', remaining: 3400, total: 5000, nextPayment: '28 Mar', status: 'Pendiente' },
  ],
  '/api/spending': [
    { label: 'Alimentación', amount: 420, color: '#00c896' },
    { label: 'Transporte', amount: 180, color: '#0ea5e9' },
    { label: 'Entretenimiento', amount: 140, color: '#8b5cf6' },
    { label: 'Salud', amount: 95, color: '#f59e0b' },
    { label: 'Otros', amount: 210, color: '#4a5568' },
  ],
  '/api/contacts': [
    { id: 'C001', name: 'Ana Torres', account: '•••• 1234', avatar: 'AT', lastAmount: 150 },
    { id: 'C002', name: 'Luis Mora', account: '•••• 5678', avatar: 'LM', lastAmount: 80 },
    { id: 'C003', name: 'Sofía Vega', account: '•••• 9012', avatar: 'SV', lastAmount: 320 },
    { id: 'C004', name: 'Diego Paz', account: '•••• 3456', avatar: 'DP', lastAmount: 45 },
    { id: 'C005', name: 'Karla Ruiz', account: '•••• 7890', avatar: 'KR', lastAmount: 200 },
  ],
};

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();
  const matchKey = Object.keys(MOCK_DATA).find(k => url.endsWith(k));
  if (matchKey) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    return new Response(JSON.stringify(MOCK_DATA[matchKey]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return originalFetch(input, init);
};

export {};