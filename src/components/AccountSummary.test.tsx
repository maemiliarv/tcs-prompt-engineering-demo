import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import AccountSummary from './AccountSummary';

describe('AccountSummary', () => {
    beforeEach(() => {
        cleanup();
        jest.restoreAllMocks();
        (global as any).fetch = jest.fn();
    });

    it('renders the balance header and fetches accounts on mount', async () => {
        (global as any).fetch.mockResolvedValueOnce({ json: async () => [] });

        render(<AccountSummary />);

        expect(screen.getByText(/Balance total/i)).toBeInTheDocument();
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/accounts', expect.any(Object)));
    });

    it('shows loading skeleton while API is pending', async () => {
        let resolve: (value: unknown) => void;
        const promise = new Promise(resolveFn => {
            resolve = resolveFn;
        });

        (global as any).fetch.mockReturnValueOnce(promise.then(() => ({ json: async () => [] })));

        render(<AccountSummary />);
        expect(screen.getAllByText((content, node) => node?.className?.includes('skeleton') ?? false).length).toBeGreaterThan(0);

        resolve!(true);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    });

    it('renders $0,00 when API returns empty array', async () => {
        (global as any).fetch.mockResolvedValueOnce({ json: async () => [] });

        render(<AccountSummary />);
        await waitFor(() => expect(screen.getByText(/Balance total/i)).toBeInTheDocument());

        expect(screen.getAllByText((content, node) => node?.textContent?.includes('0,00') ?? false).length).toBeGreaterThan(0);
    });

    it('handles API failure without crashing', async () => {
        (global as any).fetch.mockRejectedValueOnce(new Error('API error'));

        render(<AccountSummary />);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(screen.getByText(/Balance total/i)).toBeInTheDocument();
        expect(screen.getAllByText((content, node) => node?.textContent?.includes('0,00') ?? false).length).toBeGreaterThan(0);
    });

    it('renders account rows when API returns data', async () => {
        (global as any).fetch.mockResolvedValueOnce({
            json: async () => [
                { id: 'a', type: 'Ahorros', balance: 1200, currency: 'USD', change: 4 },
                { id: 'b', type: 'Corriente', balance: 450, currency: 'USD', change: -2 },
            ],
        });

        render(<AccountSummary />);
        await waitFor(() => expect(screen.getByText('Ahorros')).toBeInTheDocument());
        expect(screen.getByText('Corriente')).toBeInTheDocument();
        expect(screen.getByText(/↑ 4%/)).toBeInTheDocument();
        expect(screen.getByText(/↓ 2%/)).toBeInTheDocument();
    });

    it('aborts fetch when unmounting', () => {
        const abortMock = jest.fn();
        jest.spyOn(window, 'AbortController').mockImplementation(() => ({
            signal: {},
            abort: abortMock,
        } as any));

        (global as any).fetch.mockResolvedValueOnce({ json: async () => [] });
        const { unmount } = render(<AccountSummary />);
        unmount();

        expect(abortMock).toHaveBeenCalled();
    });
});