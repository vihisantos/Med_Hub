import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Landing from '../Landing';

// Mock components that use context
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar Mock</div>
}));

vi.mock('../../components/Footer', () => ({
    default: () => <div data-testid="footer">Footer Mock</div>
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
}));

// Mock Auth Context because Landing uses it for "Entrar" button logic
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        user: null
    })
}));

describe('Landing Page', () => {
    it('renders hero section correctly', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        // Check for key text elements
        expect(screen.getByText(/O Sistema Operacional/i)).toBeInTheDocument();
        expect(screen.getByText(/Medicina do Futuro/i)).toBeInTheDocument();
        expect(screen.getByText(/Conectando médicos, hospitais e pacientes/i)).toBeInTheDocument();

        // Check availability of actions
        expect(screen.getByText('Começar Agora')).toBeInTheDocument();
        expect(screen.getByText('Ver Demonstração')).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByText('Gestão de Escalas')).toBeInTheDocument();
        expect(screen.getByText('Prontuário Digital')).toBeInTheDocument();
        expect(screen.getByText('Telemedicina HD')).toBeInTheDocument();
    });

    it('renders statistics section', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByText(/50k/i)).toBeInTheDocument(); // Users count
        expect(screen.getByText(/120/i)).toBeInTheDocument(); // Hospitals count
    });
});
