import { useState } from 'react';
import DashboardDoctor from './DashboardDoctor';
import DashboardHospital from './DashboardHospital';
import { LayoutDashboard, LogOut, User as UserIcon, FileText, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



export default function DashboardAdmin() {
    const [viewMode, setViewMode] = useState<'doctor' | 'hospital'>('hospital');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-bg">
            {/* Admin Controls Overlay/Header */}
            <div className="bg-brand-surface text-brand-text p-4 shadow-xl sticky top-0 z-50 border-b border-brand-border">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <LayoutDashboard className="h-6 w-6 text-brand-accent" />
                            <span className="font-bold text-lg font-display">Admin: {user?.name}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-brand-subtext hidden sm:block">Visualizando como:</span>
                            <div className="flex bg-brand-bg/50 rounded-lg p-1 border border-brand-border">
                                <button
                                    onClick={() => setViewMode('hospital')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'hospital' ? 'bg-brand-accent text-white shadow-sm' : 'text-brand-subtext hover:text-brand-text'}`}
                                >
                                    Hospital
                                </button>
                                <button
                                    onClick={() => setViewMode('doctor')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'doctor' ? 'bg-brand-accent text-white shadow-sm' : 'text-brand-subtext hover:text-brand-text'}`}
                                >
                                    Médico
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/documents')}
                            className="text-brand-subtext hover:text-brand-accent transition-colors p-2"
                            title="Documentos e Holerites"
                        >
                            <FileText className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => navigate('/chat')}
                            className="text-brand-subtext hover:text-brand-accent transition-colors p-2"
                            title="Chat"
                        >
                            <MessageCircle className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-brand-subtext hover:text-brand-accent transition-colors p-2"
                            title="Meu Perfil"
                        >
                            <UserIcon className="h-5 w-5" />
                        </button>
                        <button onClick={logout} className="text-brand-subtext hover:text-red-500 transition-colors flex items-center gap-2 group" title="Sair do Admin">
                            <span className="text-sm font-bold group-hover:underline">Sair</span>
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Render Selected Dashboard */}
            <div className="relative">
                {viewMode === 'hospital' ? <DashboardHospital /> : <DashboardDoctor />}
            </div>
        </div>
    );
}
