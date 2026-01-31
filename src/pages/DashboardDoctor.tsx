import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import {
    Search, MapPin, Calendar, Clock, CheckCircle, XCircle,
    Clock3, Stethoscope, Building2, Briefcase, Filter, ArrowRight, LogOut,
    User as UserIcon, FileText, MessageCircle, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

// ... (MOCK DATA FOR UI DEVELOPMENT)
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Plantão Noturno - UTI Geral',
        hospital_name: 'Hospital Santa Catarina',
        location: 'São Paulo, SP',
        date: '2024-03-25',
        start_time: '19:00',
        end_time: '07:00',
        specialty: 'UTI',
        value: 'R$ 1.800',
        tags: ['Urgente', 'Noturno']
    },
    {
        id: 2,
        title: 'Plantão Pediátrico - PS',
        hospital_name: 'Hospital Infantil Sabará',
        location: 'São Paulo, SP',
        date: '2024-03-26',
        start_time: '07:00',
        end_time: '19:00',
        specialty: 'Pediatria',
        value: 'R$ 1.500',
        tags: ['Diurno']
    },
    {
        id: 3,
        title: 'Clínica Médica - Enfermaria',
        hospital_name: 'Hospital 9 de Julho',
        location: 'São Paulo, SP',
        date: '2024-03-28',
        start_time: '07:00',
        end_time: '13:00',
        specialty: 'Clínica Geral',
        value: 'R$ 900',
        tags: ['6 horas']
    }
];

const MOCK_APPLICATIONS = [
    {
        id: 101,
        job_id: 1,
        title: 'Cardiologia - Ambulatório',
        hospital_name: 'Hospital Sírio-Libanês',
        location: 'Bela Vista, SP',
        date: '2024-03-20',
        status: 'accepted',
        start_time: '08:00',
        end_time: '18:00'
    },
    {
        id: 102,
        job_id: 2,
        title: 'Ortopedia - Pronto Socorro',
        hospital_name: 'Hospital Albert Einstein',
        location: 'Morumbi, SP',
        date: '2024-03-22',
        status: 'pending',
        start_time: '19:00',
        end_time: '07:00'
    }
];

interface Job {
    id: number;
    title: string;
    location: string;
    date: string;
    start_time: string;
    end_time: string;
    hospital_name: string;
    specialty?: string;
    value?: string;
    tags?: string[];
}

interface Application {
    id: number;
    job_id: number;
    status: string;
    title: string;
    location: string;
    date: string;
    start_time: string;
    end_time: string;
    hospital_name: string;
}

export default function DashboardDoctor() {
    const { token, user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { addToast } = useToast();
    const navigate = useNavigate();

    // Load data 
    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'jobs') {
                const res = await api.get('/jobs', token);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setJobs(data);
                } else {
                    setJobs(MOCK_JOBS);
                }
            } else {
                const res = await api.get('/applications/my-applications', token);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setApplications(data);
                } else {
                    setApplications(MOCK_APPLICATIONS);
                }
            }
        } catch (err) {
            console.warn("API unavailable, using mock data for UI demo.", err);
            if (activeTab === 'jobs') setJobs(MOCK_JOBS);
            else setApplications(MOCK_APPLICATIONS);
            addToast("Modo Demonstração: Dados simulados carregados.", "info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, activeTab]);

    const handleApply = async (jobId: number) => {
        if (window.confirm('Confirmar candidatura?')) {
            addToast(`Candidatura enviada para vaga ${jobId} com sucesso!`, "success");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-brand-primary-900 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-brand-accent rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent selection:text-white pb-20">

                {/* Decorative Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl opacity-50"></div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                    {/* Profile & Header Section */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 mb-12">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4 lg:sticky lg:top-24 h-fit mb-8 lg:mb-0"
                        >
                            <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-accent/20 to-brand-primary-900/20"></div>

                                <div className="relative z-10">
                                    <div className="w-24 h-24 rounded-2xl bg-brand-surface border-4 border-brand-surface shadow-xl mb-6 flex items-center justify-center overflow-hidden">
                                        <UserIcon className="w-10 h-10 text-brand-subtext" />
                                    </div>

                                    <h1 className="text-3xl font-bold font-display text-white mb-1">
                                        {user?.role === 'nurse' ? 'Enf.' : 'Dr.'} {user?.name?.split(' ')[0] || (user?.role === 'nurse' ? 'Enfermeiro' : 'Médico')}
                                    </h1>
                                    <p className="text-brand-accent font-medium mb-6">Cardiologia • CRM/SP 123456</p>

                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center text-brand-subtext text-sm">
                                            <MapPin className="w-4 h-4 mr-2" /> São Paulo, SP
                                        </div>
                                        <div className="flex items-center text-brand-subtext text-sm">
                                            <Building2 className="w-4 h-4 mr-2" /> Med Hub Verified
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigate('/documents')}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors gap-2 group"
                                        >
                                            <FileText className="w-5 h-5 text-brand-subtext group-hover:text-brand-accent transition-colors" />
                                            <span className="text-xs font-medium">Doc</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/chat')}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors gap-2 group"
                                        >
                                            <MessageCircle className="w-5 h-5 text-brand-subtext group-hover:text-brand-accent transition-colors" />
                                            <span className="text-xs font-medium">Chat</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors gap-2 group"
                                        >
                                            <UserIcon className="w-5 h-5 text-brand-subtext group-hover:text-brand-accent transition-colors" />
                                            <span className="text-xs font-medium">Perfil</span>
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-colors gap-2 group"
                                        >
                                            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                                            <span className="text-xs font-medium text-red-400">Sair</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            {/* Tabs & Filters */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <div className="flex items-center space-x-1 p-1 bg-brand-surface/50 backdrop-blur-sm rounded-xl border border-white/5 w-fit mb-6">
                                    <button
                                        onClick={() => setActiveTab('jobs')}
                                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'jobs'
                                            ? 'bg-brand-accent text-brand-bg shadow-lg transform scale-[1.02]'
                                            : 'text-brand-subtext hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        <span>Oportunidades</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('applications')}
                                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'applications'
                                            ? 'bg-brand-accent text-brand-bg shadow-lg transform scale-[1.02]'
                                            : 'text-brand-subtext hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Stethoscope className="h-4 w-4" />
                                        <span>Minhas Candidaturas</span>
                                    </button>
                                </div>

                                {activeTab === 'jobs' && (
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-brand-accent/20 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100 duration-500"></div>
                                        <div className="relative bg-brand-surface/80 backdrop-blur-xl rounded-2xl shadow-lg border border-brand-border/50 overflow-hidden flex items-center p-2">
                                            <Search className="ml-4 text-brand-subtext/50 h-5 w-5" />
                                            <input
                                                type="text"
                                                placeholder="Busque por hospital, especialidade ou cidade..."
                                                className="w-full px-4 py-3 text-base font-medium text-brand-text placeholder-brand-subtext/40 focus:outline-none bg-transparent"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <button className="hidden sm:flex items-center bg-white/5 text-brand-subtext hover:text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors mr-2">
                                                <Filter className="h-4 w-4 mr-2" />
                                                Filtros
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'jobs' ? (
                                    <motion.div
                                        key="jobs"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="space-y-4"
                                    >
                                        {filteredJobs.map((job) => (
                                            <motion.div
                                                key={job.id}
                                                variants={itemVariants}
                                                className="glass-card rounded-3xl p-6 group hover:bg-brand-surface/80 relative"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                                            <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold rounded-full uppercase tracking-wider">
                                                                {job.specialty}
                                                            </span>
                                                            {job.tags?.map((tag, i) => (
                                                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 text-brand-subtext text-xs font-medium rounded-full">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <h3 className="font-display font-bold text-xl text-white mb-2">{job.title}</h3>
                                                        <div className="grid grid-cols-2 lg:flex gap-4 text-sm text-brand-subtext">
                                                            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-brand-accent" /> {job.hospital_name}</span>
                                                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-accent" /> {job.location}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 min-w-[140px]">
                                                        <div className="text-right">
                                                            <p className="text-xs text-brand-subtext font-medium mb-1">Valor do Plantão</p>
                                                            <p className="text-xl font-bold text-white tracking-tight">{job.value}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleApply(job.id)}
                                                            className="px-6 py-2.5 bg-white text-brand-bg font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                                                        >
                                                            Candidatar
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="applications"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="space-y-4"
                                    >
                                        <h2 className="text-xl font-bold font-display text-white mb-6">Em Andamento</h2>
                                        {applications.map((app) => (
                                            <motion.div
                                                key={app.id}
                                                variants={itemVariants}
                                                className="glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className={`
                                                        w-12 h-12 rounded-2xl flex items-center justify-center border
                                                        ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}
                                                    `}>
                                                        {app.status === 'accepted' && <CheckCircle className="h-6 w-6" />}
                                                        {app.status === 'rejected' && <XCircle className="h-6 w-6" />}
                                                        {app.status === 'pending' && <Clock3 className="h-6 w-6" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">{app.title}</h3>
                                                        <p className="text-sm text-brand-subtext">{app.hospital_name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-xs text-brand-subtext">Data</p>
                                                        <p className="text-sm font-medium text-white">{new Date(app.date).toLocaleDateString('pt-BR')}</p>
                                                    </div>

                                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                                                         ${app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                                'bg-yellow-500/10 text-yellow-500'}
                                                    `}>
                                                        {app.status === 'accepted' ? 'Aprovado' : app.status === 'rejected' ? 'Recusado' : 'Em Análise'}
                                                    </div>

                                                    <button className="p-2 hover:bg-white/5 rounded-full text-brand-subtext hover:text-white transition-colors">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
