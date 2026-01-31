import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import {
    Plus, MapPin, Calendar, X, Users, Search,
    Stethoscope, Clock, CheckCircle, XCircle, LogOut, User as UserIcon,
    FileText, MessageCircle, Shield, Mail
} from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

// --- MOCK DATA ---
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Plantão UTI Geral - Noturno',
        description: 'Necessário experiência em UTI. Plantão de 12h.',
        location: 'São Paulo, SP',
        date: '2024-04-15',
        start_time: '19:00',
        end_time: '07:00',
        status: 'open',
        applicants_count: 3
    },
    {
        id: 2,
        title: 'Pediatria - Pronto Socorro',
        description: 'Atendimento de porta. Grande fluxo.',
        location: 'São Paulo, SP',
        date: '2024-04-16',
        start_time: '07:00',
        end_time: '19:00',
        status: 'open',
        applicants_count: 5
    },
    {
        id: 3,
        title: 'Clínica Médica - Enfermaria',
        description: 'Evolução de pacientes internados.',
        location: 'São Paulo, SP',
        date: '2024-04-18',
        start_time: '07:00',
        end_time: '13:00',
        status: 'closed',
        applicants_count: 1
    }
];

const MOCK_APPLICATIONS = [
    {
        id: 101,
        doctor_id: 10,
        doctor_name: 'Dr. Roberto Silva',
        doctor_email: 'roberto@medico.com',
        status: 'pending',
        crm: '123456-SP',
        specialty: 'Cardiologia'
    },
    {
        id: 102,
        doctor_id: 11,
        doctor_name: 'Dra. Julia Santos',
        doctor_email: 'julia@medico.com',
        status: 'accepted',
        crm: '654321-SP',
        specialty: 'Clínica Geral'
    },
    {
        id: 103,
        doctor_id: 12,
        doctor_name: 'Dr. Marcelo Costa',
        doctor_email: 'marcelo@medico.com',
        status: 'rejected',
        crm: '789123-SP',
        specialty: 'Pediatria'
    }
];

interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    applicants_count?: number;
}

interface Application {
    id: number;
    doctor_id: number;
    doctor_name: string;
    doctor_email: string;
    status: string;
    crm?: string;
    specialty?: string;
}

export default function DashboardHospital() {
    const { token, user, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Form State
    const [newJob, setNewJob] = useState({ title: '', description: '', location: '', profession: 'doctor', date: '', start_time: '', end_time: '' });

    // Selection State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);

    // Candidate Profile View State
    const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);

    useEffect(() => {
        fetchJobs();
    }, [token]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/jobs/my-jobs', token);
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                setJobs(data);
                if (data.length > 0) setSelectedJob(data[0]);
            } else {
                console.warn("API failed or unauthorized, using MOCK data.");
                setJobs(MOCK_JOBS);
                setSelectedJob(MOCK_JOBS[0]);
            }
        } catch (err) {
            console.error(err);
            setJobs(MOCK_JOBS);
            setSelectedJob(MOCK_JOBS[0]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedJob) {
            loadApplications(selectedJob.id);
        }
    }, [selectedJob]);

    const loadApplications = async (jobId: number) => {
        setLoadingApps(true);
        try {
            const res = await api.get(`/applications/job/${jobId}`, token);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setApplications(data);
            } else {
                setApplications(MOCK_APPLICATIONS);
            }
        } catch (err) {
            setApplications(MOCK_APPLICATIONS);
        } finally {
            setLoadingApps(false);
        }
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/jobs', newJob, token);
            if (res.ok) {
                setShowModal(false);
                setNewJob({ title: '', description: '', location: '', profession: 'doctor', date: '', start_time: '', end_time: '' });
                fetchJobs();
                addToast('Vaga criada com sucesso e publicada para médicos!', 'success');
            } else if (res.status === 403) {
                const data = await res.json();
                if (data.code === 'LIMIT_REACHED') {
                    addToast(data.message, 'error');
                    setShowModal(false);
                    // Optional: automatically redirect or show upgrade modal
                    setTimeout(() => navigate('/pricing'), 2000);
                } else {
                    addToast('Erro ao criar vaga. Tente novamente.', 'error');
                }
            } else {
                addToast('Modo Demo: Vaga criada (Simulação)', 'info');
                setShowModal(false);
            }
        } catch (err) {
            addToast('Erro de conexão ao criar vaga.', 'error');
            setShowModal(false);
        }
    };

    const handleStatusUpdate = async (appId: number, status: 'accepted' | 'rejected') => {
        setApplications(prev => prev.map(app =>
            app.id === appId ? { ...app, status } : app
        ));
        try {
            await api.patch(`/applications/${appId}/status`, { status }, token);
        } catch (err) {
            console.error("Failed to update status on server");
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent/30 pb-20">

                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl opacity-50"></div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="text-brand-accent font-bold tracking-widest uppercase text-xs mb-1 block">Gestão de Escalas</span>
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-brand-text font-display tracking-tight">
                                    {user?.name || 'Hospital Santa Cora'}
                                </h1>
                                <div className="flex items-center bg-brand-surface/40 p-1 rounded-full border border-brand-border/50 backdrop-blur-sm">
                                    <button
                                        onClick={() => navigate('/documents')}
                                        className="p-2 rounded-full hover:bg-brand-surface-highlight text-brand-subtext hover:text-brand-accent transition-all"
                                        title="Holerites e Documentos"
                                    >
                                        <FileText className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className="p-2 rounded-full hover:bg-brand-surface-highlight text-brand-subtext hover:text-brand-accent transition-all"
                                        title="Chat"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="p-2 rounded-full hover:bg-brand-surface-highlight text-brand-subtext hover:text-brand-accent transition-all"
                                        title="Meu Perfil"
                                    >
                                        <UserIcon className="h-5 w-5" />
                                    </button>
                                    <div className="w-px h-4 bg-brand-border/50 mx-1"></div>
                                    <button
                                        onClick={logout}
                                        className="p-2 rounded-full hover:bg-red-500/10 text-brand-subtext hover:text-red-500 transition-all"
                                        title="Sair"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-brand-subtext font-medium text-sm">
                                Gerencie suas vagas e selecione os melhores profissionais do mercado.
                            </p>
                        </motion.div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 pr-4 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="scale-[0.4] origin-right w-12 flex justify-end">
                                    <AnimatedLogo />
                                </div>
                                <div className="font-display font-black text-2xl tracking-tighter select-none">
                                    <span className="text-brand-accent">Med</span>
                                    <span className="text-white/20 ml-1">Hub</span>
                                </div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const activeJobs = jobs.filter(j => j.status === 'open').length;
                                    const isFree = !user?.subscription_tier || user.subscription_tier === 'free';

                                    if (isFree && activeJobs >= 1) {
                                        setShowUpgradeModal(true);
                                    } else {
                                        setShowModal(true);
                                    }
                                }}
                                className="flex items-center px-8 py-4 bg-brand-accent text-white rounded-2xl font-bold shadow-2xl shadow-brand-accent/20 hover:bg-brand-accent-hover transition-all"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nova Oportunidade
                            </motion.button>
                        </div>
                    </div>

                    {/* Verification Promo Banner */}
                    {!user?.is_verified && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10 p-1 bg-gradient-to-r from-brand-primary-500/20 via-brand-primary-600/10 to-transparent rounded-[2rem] border border-brand-primary-500/20 backdrop-blur-sm"
                        >
                            <div className="bg-brand-bg/60 p-6 rounded-[1.9rem] flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-sky-500/20">
                                        <Shield className="w-8 h-8 text-brand-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Sua instituição ainda não é Verificada? 🛡️</h3>
                                        <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium">
                                            Instituições com o selo de verificação recebem <span className="text-brand-primary-400 font-bold">3x mais candidaturas</span> e transmitem mais segurança para os plantonistas.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="px-8 py-3.5 bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 shrink-0"
                                >
                                    Saber Mais
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-center py-24 animate-pulse text-brand-subtext font-medium">Carregando painel de controle...</div>
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-8 mb-12">

                            {/* LEFT COLUMN: JOB LIST */}
                            <div className="lg:col-span-4 flex flex-col bg-brand-surface/30 backdrop-blur-xl rounded-[32px] border border-brand-border/50 shadow-2xl overflow-hidden min-h-[500px]">
                                <div className="p-6 border-b border-brand-border/50 bg-brand-surface/20">
                                    <h2 className="text-lg font-bold font-display text-brand-text flex items-center tracking-tight">
                                        <Clock className="mr-2 h-5 w-5 text-brand-accent" />
                                        Minhas Vagas
                                    </h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {jobs.map((job) => (
                                        <motion.div
                                            key={job.id}
                                            onClick={() => setSelectedJob(job)}
                                            layoutId={`job-${job.id}`}
                                            className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 group relative overflow-hidden ${selectedJob?.id === job.id
                                                ? 'bg-brand-surface border-brand-accent/50 shadow-lg shadow-brand-accent/5'
                                                : 'bg-brand-surface/40 border-transparent hover:border-brand-border/50 hover:bg-brand-surface/60'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h3 className={`font-bold text-base truncate flex-1 ${selectedJob?.id === job.id ? 'text-brand-text' : 'text-brand-subtext'}`}>
                                                    {job.title}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] shrink-0 font-black uppercase tracking-widest ${job.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-subtext/10 text-brand-subtext'}`}>
                                                    {job.status === 'open' ? 'Ativa' : 'Fechada'}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-brand-subtext/60 mb-4">
                                                <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-50" />
                                                {new Date(job.date).toLocaleDateString('pt-BR')} • {job.start_time.slice(0, 5)}
                                            </div>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border/30">
                                                <div className="flex -space-x-1.5">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-7 w-7 rounded-lg bg-brand-bg border-2 border-brand-surface flex items-center justify-center text-[10px] font-bold text-brand-text shadow-sm">
                                                            {String.fromCharCode(64 + i)}
                                                        </div>
                                                    ))}
                                                    {job.applicants_count && job.applicants_count > 3 && (
                                                        <div className="h-7 w-7 rounded-lg bg-brand-surface-highlight text-brand-text border-2 border-brand-surface flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                            +{job.applicants_count - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-brand-accent group-hover:translate-x-1 transition-transform">
                                                    Ver candidatos →
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: CANDIDATES */}
                            <div className="lg:col-span-8 flex flex-col h-full">
                                <AnimatePresence mode="wait">
                                    {selectedJob ? (
                                        <motion.div
                                            key={selectedJob.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col bg-brand-surface/40 backdrop-blur-xl rounded-[32px] shadow-2xl border border-brand-border/50 overflow-hidden min-h-[600px]"
                                        >
                                            {/* Header */}
                                            <div className="p-10 bg-gradient-to-br from-brand-surface-highlight/30 to-brand-surface/10 relative overflow-hidden shrink-0">
                                                <div className="absolute top-0 right-0 p-12 opacity-5">
                                                    <Users className="h-40 w-40 transform rotate-12 text-brand-text" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-2 text-brand-accent text-xs font-black uppercase tracking-widest mb-2">
                                                        <MapPin className="h-3 w-3" /> {selectedJob.location}
                                                    </div>
                                                    <h2 className="text-3xl font-bold font-display tracking-tight text-white">{selectedJob.title}</h2>

                                                    <div className="flex gap-4 mt-8">
                                                        <div className="bg-brand-bg/40 backdrop-blur-md rounded-2xl px-5 py-3 border border-brand-border/50">
                                                            <span className="block text-[10px] text-brand-subtext font-black uppercase tracking-tighter mb-1">Data</span>
                                                            <span className="font-bold text-brand-text text-sm">{new Date(selectedJob.date).toLocaleDateString('pt-BR')}</span>
                                                        </div>
                                                        <div className="bg-brand-bg/40 backdrop-blur-md rounded-2xl px-5 py-3 border border-brand-border/50">
                                                            <span className="block text-[10px] text-brand-subtext font-black uppercase tracking-tighter mb-1">Horário</span>
                                                            <span className="font-bold text-brand-text text-sm">{selectedJob.start_time.slice(0, 5)} - {selectedJob.end_time.slice(0, 5)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Scrollable list */}
                                            <div className="flex-1 overflow-y-auto p-10 bg-transparent custom-scrollbar">
                                                <h3 className="text-[10px] font-black text-brand-subtext uppercase tracking-[0.2em] mb-8 flex items-center">
                                                    Plantonistas Interessados <span className="ml-3 h-px bg-brand-border flex-1"></span> <span className="ml-3 text-brand-accent">{applications.length}</span>
                                                </h3>

                                                {loadingApps ? (
                                                    <div className="py-20 text-center text-brand-subtext font-medium italic opacity-50">Localizando profissionais...</div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {applications.map((app) => (
                                                            <motion.div
                                                                key={app.id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="bg-brand-surface/60 p-6 rounded-[24px] border border-brand-border/50 shadow-sm hover:shadow-xl hover:bg-brand-surface-highlight/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group relative"
                                                            >
                                                                <div className="flex items-center w-full min-w-0 flex-1 cursor-pointer" onClick={() => setSelectedCandidate(app)}>
                                                                    <div className="h-16 w-16 rounded-2xl bg-brand-bg text-brand-text flex items-center justify-center font-bold text-2xl mr-5 border border-brand-border/50 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                                                        {app.doctor_name.charAt(4)}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                            <h4 className="font-bold text-brand-text text-xl truncate group-hover:text-brand-accent transition-colors tracking-tight mr-2">{app.doctor_name}</h4>
                                                                            <span className="text-[9px] text-brand-accent font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded bg-brand-accent/5 border border-brand-accent/10 whitespace-nowrap">Perfil Premium</span>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center text-xs text-brand-subtext space-x-3 opacity-80">
                                                                            <span className="flex items-center"><Stethoscope className="h-3.5 w-3.5 mr-1.5 text-brand-accent/60" /> {app.specialty || 'Generalista'}</span>
                                                                            <span className="opacity-30">•</span>
                                                                            <span>CRM {app.crm || '123456-SP'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    {app.status === 'pending' ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); navigate('/chat', { state: { contact: { id: app.doctor_id, name: app.doctor_name, role: 'doctor' } } }); }}
                                                                                className="p-3.5 rounded-xl bg-brand-surface hover:bg-brand-accent hover:text-white text-brand-subtext transition-all border border-brand-border/50 group/msg" title="Chat Direto"
                                                                            >
                                                                                <MessageCircle className="h-5 w-5" />
                                                                            </button>
                                                                            <div className="h-8 w-px bg-brand-border/50 mx-1"></div>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'rejected'); }}
                                                                                className="p-3.5 rounded-xl bg-brand-surface hover:bg-red-500 hover:text-white text-brand-subtext transition-all border border-brand-border/50" title="Recusar"
                                                                            >
                                                                                <XCircle className="h-5 w-5" />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'accepted'); }}
                                                                                className="px-8 py-3.5 rounded-xl bg-brand-accent text-white font-black text-sm shadow-xl shadow-brand-accent/20 hover:bg-brand-accent-hover hover:-translate-y-0.5 transition-all uppercase tracking-tighter"
                                                                            >
                                                                                Contratar
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={`
                                                                        flex items-center px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] border shadow-sm
                                                                        ${app.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                                                    `}>
                                                                            {app.status === 'accepted' ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                                                            {app.status === 'accepted' ? 'Escalado' : 'Recusado'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                        {applications.length === 0 && (
                                                            <div className="text-center py-20 px-10 rounded-[32px] border-2 border-dashed border-brand-border/40 bg-brand-surface/10">
                                                                <Users className="h-16 w-16 mx-auto mb-6 text-brand-subtext opacity-20" />
                                                                <p className="text-brand-subtext font-bold text-lg">Aguardando Profissionais</p>
                                                                <p className="text-brand-subtext/60 text-sm mt-2 max-w-sm mx-auto">Sua vaga está sendo divulgada para milhares de especialistas na rede Med Hub.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-brand-subtext/40 border-4 border-dashed border-brand-border/30 rounded-[48px] bg-brand-surface/10 backdrop-blur-sm p-12 text-center">
                                            <div className="h-32 w-32 bg-brand-surface/40 rounded-full flex items-center justify-center mb-8 border border-brand-border/50">
                                                <Search className="h-12 w-12 opacity-50 text-brand-accent" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-brand-text mb-3">Gerenciamento de Escalas</h3>
                                            <p className="max-w-xs text-brand-subtext leading-relaxed">Selecione uma vaga no painel lateral para visualizar e aprovar candidatos qualificados.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* MODAL - NEW JOB */}
                    <AnimatePresence>
                        {showModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowModal(false)}
                                    className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                    className="relative bg-brand-surface rounded-[40px] shadow-3xl max-w-2xl w-full overflow-hidden border border-brand-border shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]"
                                >
                                    <div className="p-10 bg-brand-surface-highlight/30 border-b border-brand-border/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-bold font-display tracking-tight text-white focus:outline-none">Criar Oportunidade</h2>
                                                <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mt-1">Configuração de Plantão</p>
                                            </div>
                                            <button onClick={() => setShowModal(false)} className="bg-brand-bg/50 p-2 rounded-xl text-brand-subtext hover:text-white transition-all">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleCreateJob} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Título da Vaga</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Plantão UTI Geral - Noturno"
                                                    required
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text placeholder-brand-subtext/50"
                                                    value={newJob.title}
                                                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Descrição e Requisitos</label>
                                                <textarea
                                                    placeholder="Descreva as qualificações e responsabilidades..."
                                                    rows={4}
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text resize-none placeholder-brand-subtext/50"
                                                    value={newJob.description}
                                                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Unidade / Local</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-6 top-5 h-5 w-5 text-brand-accent/50" />
                                                    <input
                                                        type="text"
                                                        placeholder="Unidade Morumbi"
                                                        required
                                                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text placeholder-brand-subtext/50"
                                                        value={newJob.location}
                                                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Data do Plantão</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-6 top-5 h-5 w-5 text-brand-accent/50" />
                                                    <input
                                                        type="date"
                                                        required
                                                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text accent-brand-primary-500 placeholder-brand-subtext/50"
                                                        value={newJob.date}
                                                        onChange={e => setNewJob({ ...newJob, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Entrada</label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text accent-brand-primary-500 placeholder-brand-subtext/50"
                                                    value={newJob.start_time}
                                                    onChange={e => setNewJob({ ...newJob, start_time: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-black text-brand-subtext uppercase tracking-widest mb-3">Saída</label>
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-brand-border/50 bg-brand-surface focus:border-brand-primary-500 focus:ring-0 outline-none transition-all font-bold text-brand-text accent-brand-primary-500 placeholder-brand-subtext/50"
                                                    value={newJob.end_time}
                                                    onChange={e => setNewJob({ ...newJob, end_time: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                className="w-full py-5 bg-brand-accent text-white rounded-2xl font-black text-lg shadow-2xl shadow-brand-accent/30 hover:bg-brand-accent-hover hover:-translate-y-1 transition-all uppercase tracking-widest"
                                            >
                                                Publicar na Rede
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* MODAL - CANDIDATE PROFILE (Updated for Dashboard Integration) */}
                    <AnimatePresence>
                        {selectedCandidate && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedCandidate(null)}
                                    className="absolute inset-0 bg-brand-bg/90 backdrop-blur-xl"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                    className="relative bg-brand-surface rounded-[48px] shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-brand-border custom-scrollbar overflow-x-hidden"
                                >
                                    <div className="relative">
                                        <div className="h-56 bg-gradient-to-br from-brand-accent/30 via-brand-surface to-brand-bg relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent opacity-50"></div>
                                            <button onClick={() => setSelectedCandidate(null)} className="absolute top-8 right-8 bg-brand-bg/40 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-brand-accent transition-all z-20 border border-white/10">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="px-12 -mt-20 pb-12 relative z-10">
                                            <div className="flex flex-col md:flex-row gap-8 items-end">
                                                <div className="w-40 h-40 rounded-[40px] border-8 border-brand-surface bg-brand-bg flex items-center justify-center shadow-3xl overflow-hidden shrink-0">
                                                    <div className="text-5xl font-bold text-brand-accent/30">{selectedCandidate.doctor_name.charAt(4)}</div>
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Médico Verificado</span>
                                                    </div>
                                                    <h2 className="text-4xl font-bold text-white font-display tracking-tight">{selectedCandidate.doctor_name}</h2>
                                                    <p className="text-brand-subtext font-medium text-xl mt-1">{selectedCandidate.specialty || 'Clínica Médica'}</p>
                                                </div>
                                                <div className="flex gap-4 pb-4 w-full md:w-auto">
                                                    <button onClick={() => navigate('/chat')} className="flex-1 md:flex-initial bg-brand-surface/80 hover:bg-brand-border text-brand-text px-8 py-4 rounded-2xl font-bold border border-brand-border transition-all flex items-center justify-center">
                                                        <MessageCircle className="h-5 w-5 mr-3" />
                                                        Chat
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedCandidate.id, 'accepted');
                                                            setSelectedCandidate(null);
                                                            addToast('Profissional contratado com sucesso!', 'success');
                                                        }}
                                                        className="flex-1 md:flex-initial bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-brand-accent/30 transition-all flex items-center justify-center uppercase tracking-widest text-sm"
                                                    >
                                                        Finalizar Escala
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-12 mt-12 border-t border-brand-border/50 pt-12">
                                                <div className="space-y-8">
                                                    <div>
                                                        <h3 className="text-xs font-black text-brand-subtext uppercase tracking-widest mb-5">Identificação Profissional</h3>
                                                        <div className="bg-brand-bg/50 p-6 rounded-[24px] border border-brand-border/50 space-y-4">
                                                            <div className="flex items-center text-sm text-brand-text font-bold">
                                                                <Mail className="w-4 h-4 mr-3 text-brand-accent/50" />
                                                                {selectedCandidate.doctor_email}
                                                            </div>
                                                            <div className="flex items-center text-sm text-brand-text font-bold">
                                                                <Stethoscope className="w-4 h-4 mr-3 text-brand-accent/50" />
                                                                CRM: {selectedCandidate.crm}
                                                            </div>
                                                            <div className="flex items-center text-sm text-brand-text font-bold">
                                                                <MapPin className="w-4 h-4 mr-3 text-brand-accent/50" />
                                                                São Paulo, SP
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xs font-black text-brand-subtext uppercase tracking-widest mb-5">Especialidades</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['Medicina Intensiva', 'Cardiologia', 'ACLS', 'VNI'].map(s => (
                                                                <span key={s} className="text-[10px] font-bold bg-brand-surface-highlight/50 text-brand-text px-4 py-2 rounded-xl border border-brand-border/50 tracking-wide">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2 space-y-12">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-5 font-display tracking-tight">Síntese Profissional</h3>
                                                        <p className="text-brand-subtext leading-relaxed text-lg">
                                                            Médico especialista com vasta experiência em unidades de terapia intensiva e prontos-socorros de alta complexidade. Foco em resultados clínicos e gestão de fluxos hospitalares.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-6 font-display tracking-tight">Trajetória Profissional</h3>
                                                        <div className="space-y-8">
                                                            <div className="relative pl-8 border-l-2 border-brand-accent/30">
                                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-accent border-4 border-brand-surface shadow-lg shadow-brand-accent/20"></div>
                                                                <h4 className="font-bold text-brand-text text-lg tracking-tight">Chefe de Equipe - UTI</h4>
                                                                <p className="text-brand-accent font-bold text-sm">Hospital Santa Majestade</p>
                                                                <p className="text-brand-subtext text-xs mt-1 font-medium opacity-60">Jan 2021 — Presente</p>
                                                            </div>
                                                            <div className="relative pl-8 border-l-2 border-brand-border">
                                                                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-brand-border"></div>
                                                                <h4 className="font-bold text-brand-text text-lg tracking-tight">Médico de Porta</h4>
                                                                <p className="text-brand-subtext font-bold text-sm">Santa Casa de Misericórdia</p>
                                                                <p className="text-brand-subtext text-xs mt-1 opacity-60">2019 — 2021</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6">
                                                        <div className="bg-brand-bg/30 p-8 rounded-[32px] border border-brand-border/30 flex items-center justify-between group cursor-pointer hover:bg-brand-accent/5 transition-all">
                                                            <div className="flex items-center gap-6">
                                                                <div className="h-14 w-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                                                                    <FileText className="h-7 w-7" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white tracking-tight">Curriculum Vitae Integrado</p>
                                                                    <p className="text-brand-subtext text-sm">PDF • 4.2 MB • Atualizado em Março/24</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Plus className="h-6 w-6 rotate-45" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* MODAL - UPGRADE */}
                    <AnimatePresence>
                        {showUpgradeModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-sm"
                                onClick={() => setShowUpgradeModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="bg-brand-surface w-full max-w-lg rounded-[2.5rem] border border-brand-primary-500/30 overflow-hidden relative shadow-2xl shadow-brand-primary-500/20"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600" />
                                    <div className="p-10 text-center">
                                        <div className="w-20 h-20 bg-sky-500/10 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-sky-500/20">
                                            <Shield className="w-10 h-10 text-brand-primary-400" />
                                        </div>

                                        <h2 className="text-3xl font-extrabold text-white mb-2 font-display">
                                            Limite de Vagas Atingido
                                        </h2>
                                        <p className="text-brand-subtext mb-8 text-lg">
                                            Hospitais no plano gratuito podem publicar apenas <span className="text-brand-text font-bold">1 vaga</span> por vez.
                                        </p>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => navigate('/pricing')}
                                                className="w-full py-4 bg-brand-primary-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary-500/20 hover:bg-brand-primary-600 hover:-translate-y-1 transition-all"
                                            >
                                                Ver Planos Premium
                                            </button>
                                            <button
                                                onClick={() => setShowUpgradeModal(false)}
                                                className="w-full py-4 text-brand-subtext hover:text-white font-bold transition-all"
                                            >
                                                Entendi, talvez depois
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
