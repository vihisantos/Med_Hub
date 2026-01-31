import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardDoctor from '../DashboardDoctor';
import { ToastProvider } from '../../context/ToastContext';

// Mock API
const mockJobs = [
    {
        id: 1,
        title: 'Plantão Teste',
        hospital_name: 'Hospital Teste',
        location: 'São Paulo, SP',
        date: '2024-03-25',
        start_time: '19:00',
        end_time: '07:00',
        specialty: 'UTI',
        value: 'R$ 1.000',
        tags: ['Urgente']
    }
];

// Mock API module
vi.mock('../../utils/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

import { api } from '../../utils/api';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
        button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Auth Context - we'll create a simplified version for testing
// But actually we are wrapping in AuthProvider, check if we can mock the values being provided?
// It's easier to mock the hook useAuth directly
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        token: 'fake-token',
        user: { name: 'Dr. Teste', role: 'doctor' },
        logout: vi.fn(),
        isAuthenticated: true
    }),
    AuthProvider: ({ children }: any) => <>{children}</>
}));

describe('Dashboard Doctor', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders dashboard with user name', async () => {
        // Setup API mock to return fake data
        (api.get as any).mockResolvedValue({
            json: async () => mockJobs,
            ok: true
        });

        render(
            <BrowserRouter>
                <ToastProvider>
                    <DashboardDoctor />
                </ToastProvider>
            </BrowserRouter>
        );

        // Check if user name is displayed
        await waitFor(() => {
            expect(screen.getByText(/Dr. Teste/i)).toBeInTheDocument();
        });
    });

    it('displays job cards after loading', async () => {
        (api.get as any).mockResolvedValue({
            json: async () => mockJobs,
            ok: true
        });

        render(
            <BrowserRouter>
                <ToastProvider>
                    <DashboardDoctor />
                </ToastProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Plantão Teste')).toBeInTheDocument();
            expect(screen.getByText('Hospital Teste')).toBeInTheDocument();
        });
    });

    it('switches tabs correctly', async () => {
        (api.get as any).mockResolvedValue({
            json: async () => [], // Empty mainly
            ok: true
        });

        render(
            <BrowserRouter>
                <ToastProvider>
                    <DashboardDoctor />
                </ToastProvider>
            </BrowserRouter>
        );

        // Find and click the Applications tab
        // Use text match
        const appTab = await screen.findByText('Minhas Candidaturas');
        fireEvent.click(appTab);

        // Should see "Histórico" or "Em Andamento" header
        await waitFor(() => {
            expect(screen.getByText(/Em Andamento/i)).toBeInTheDocument();
        });
    });
});
