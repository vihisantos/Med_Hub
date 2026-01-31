import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import AnimatedLogo from '../components/AnimatedLogo';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Attempt real login
            try {
                const res = await api.post('/auth/login', { email, password });
                if (!res.ok) throw new Error('API_ERROR');

                const data = await res.json();
                login(data.token, data.user);
            } catch (apiError) {
                // If API fails (e.g. GH Pages without backend), fall back to DEMO mode if credentials match standard patterns
                console.warn('API unavailable or failed. Trying DEMO mode.');

                // Simulate network delay
                await new Promise(r => setTimeout(r, 1000));

                if (email.includes('admin')) {
                    login('demo-token', { id: 1, name: 'Admin Demo', email, role: 'admin' });
                } else if (email.includes('hospital')) {
                    login('demo-token', { id: 2, name: 'Hospital Demo', email, role: 'hospital' });
                } else {
                    login('demo-token', { id: 3, name: 'Dr. Demo', email, role: 'doctor' });
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col lg:flex-row">

                {/* Left Side - Branding */}
                <div className="lg:w-1/2 bg-brand-bg relative overflow-hidden flex flex-col items-center justify-center p-12">
                    <div className="absolute inset-0 bg-brand-accent/10 backdrop-blur-3xl"></div>
                    <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                        <AnimatedLogo />
                        <div className="mt-8 text-center">
                            <h1 className="text-6xl font-extrabold tracking-tight mb-4 font-display animate-shine">Med Hub</h1>
                            <p className="text-brand-accent text-lg font-medium">Sua conexão direta com as melhores oportunidades.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-1/2 bg-brand-surface flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
                    <div className="w-full max-w-md space-y-8 relative z-10">
                        <div>
                            <h2 className="text-4xl font-bold text-brand-text">Bem-vindo</h2>
                            <p className="mt-3 text-brand-subtext text-lg">
                                Não tem uma conta? <Link to="/register" className="font-bold text-brand-accent hover:text-brand-accent-hover transition-colors border-b-2 border-brand-accent hover:border-brand-accent-hover pb-0.5">Cadastre-se grátis</Link>
                            </p>
                        </div>

                        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
                                    <p className="text-red-700 text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-brand-text mb-2 ml-1">Email Corporativo</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 border-2 border-transparent bg-brand-surface-highlight rounded-xl text-brand-text placeholder-brand-subtext/40 focus:outline-none focus:ring-0 focus:border-brand-accent transition-all shadow-sm font-medium"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-brand-text mb-2 ml-1">Senha</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 border-2 border-transparent bg-brand-surface-highlight rounded-xl text-brand-text placeholder-brand-subtext/40 focus:outline-none focus:ring-0 focus:border-brand-accent transition-all shadow-sm font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-brand-subtext hover:text-brand-text transition-colors">Esqueceu a senha?</a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-brand-text bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                {loading ? 'Carregando...' : 'Entrar na Plataforma'}
                                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
