import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Zap, LayoutDashboard } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="fixed top-0 inset-x-0 z-50">
            {/* Prototype Banner */}
            <div className="bg-brand-accent/90 text-white text-xs font-bold py-1 text-center tracking-widest uppercase backdrop-blur-sm">
                🚧 Protótipo em Desenvolvimento • Exibindo versão de Demonstração
            </div>

            <div className="bg-brand-bg/90 backdrop-blur-md shadow-lg border-b border-brand-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center group gap-0.5">
                                <div className="scale-[0.35] origin-right w-10 flex justify-end">
                                    <AnimatedLogo />
                                </div>
                                <div className="font-display font-black text-2xl tracking-tighter select-none flex items-center mb-0.5">
                                    <span className="text-brand-accent">Med</span>
                                    <span className="text-white/20 ml-1">Hub</span>
                                </div>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-6">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-brand-light-blue flex items-center font-medium">
                                        <User className="h-4 w-4 mr-2" />
                                        {user?.name} ({user?.role})
                                    </span>
                                    <Link
                                        to={`/${user?.role === 'admin' ? 'admin' : user?.role === 'doctor' ? 'doctor' : 'hospital'}`}
                                        className="text-sm text-brand-text hover:text-brand-accent transition-colors font-bold flex items-center gap-1"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    {user?.role === 'hospital' && (
                                        <Link to="/pricing" className="text-sm text-brand-subtext hover:text-brand-accent transition-colors font-bold flex items-center gap-1">
                                            <Zap className="h-4 w-4 text-amber-400" />
                                            Planos
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="flex items-center px-4 py-2 border border-brand-border text-sm font-medium rounded-lg text-brand-subtext hover:text-brand-text hover:border-brand-text hover:bg-brand-surface-highlight transition-all focus:outline-none"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-brand-text hover:text-brand-accent font-medium text-base transition-colors">Entrar</Link>
                                    <Link to="/register" className="ml-4 px-6 py-2.5 rounded-lg bg-brand-accent text-brand-text hover:bg-brand-accent-hover hover:scale-105 font-bold text-sm shadow-md transition-all duration-200">
                                        Registrar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
