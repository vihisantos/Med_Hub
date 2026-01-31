import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import {
    User as UserIcon, Mail, Phone, MapPin,
    Stethoscope, Briefcase, Plus, X,
    LogOut, Edit3, Check, Calendar,
    Award, Shield, FileText, Camera, Building2, Zap, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '../types';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    bio: string;
    specialties: string[];
    experiences: Experience[];
    location: string;
    registration: string;
}

const initialProfile: ProfileData = {
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    bio: '',
    specialties: [],
    experiences: [],
    location: '',
    registration: '',
};

const Profile = () => {
    const { user, updateUser, logout, token } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [profile, setProfile] = useState<ProfileData>(initialProfile);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [specialtyInput, setSpecialtyInput] = useState('');

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                avatarUrl: user.avatar_url || '',
                bio: user.bio || '',
                specialties: user.specialties || [],
                experiences: user.experiences || [],
                location: user.location || '',
                registration: user.registration || user.crm || user.coren || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSpecialty = () => {
        const val = specialtyInput.trim();
        if (val && !profile.specialties.includes(val)) {
            setProfile((prev) => ({
                ...prev,
                specialties: [...prev.specialties, val],
            }));
            setSpecialtyInput('');
        }
    };

    const handleRemoveSpecialty = (spec: string) => {
        setProfile((prev) => ({
            ...prev,
            specialties: prev.specialties.filter((s) => s !== spec),
        }));
    };

    const [newExp, setNewExp] = useState<Partial<Experience>>({
        hospital: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const addExperience = () => {
        if (!newExp.hospital?.trim() || !newExp.position?.trim() || !newExp.startDate) {
            addToast('Hospital, cargo e data inicial são obrigatórios', 'error');
            return;
        }
        const exp: Experience = {
            id: crypto.randomUUID(),
            hospital: newExp.hospital,
            position: newExp.position,
            startDate: newExp.startDate,
            endDate: newExp.endDate,
            description: newExp.description
        };
        setProfile((prev) => ({
            ...prev,
            experiences: [exp, ...prev.experiences],
        }));
        setNewExp({ hospital: '', position: '', startDate: '', endDate: '', description: '' });
    };

    const removeExperience = (id: string) => {
        setProfile((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((exp) => exp.id !== id),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.put('/users/me', {
                ...profile,
                avatar_url: profile.avatarUrl,
            }, token);

            if (!res.ok) throw new Error('Falha ao atualizar perfil');

            const updatedUser = await res.json();
            updateUser(updatedUser);
            addToast('Perfil atualizado com sucesso!', 'success');
            setEditMode(false);
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isNurse = user?.role === 'nurse';
    const isHospital = user?.role === 'hospital';

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary-500/30">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-brand-subtext hover:text-brand-primary-400 transition-all font-bold group"
                    >
                        <div className="p-2 bg-brand-surface/40 rounded-xl border border-brand-border/10 group-hover:border-brand-primary-400/30 group-hover:bg-brand-surface-highlight transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Voltar
                    </motion.button>

                    {/* Upper Profile Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mb-12"
                    >
                        {/* Glass Background Card */}
                        <div className="bg-brand-surface/40 backdrop-blur-xl border border-brand-border/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            {/* Decorative Banner Gradient */}
                            <div className="h-48 bg-gradient-to-r from-brand-primary-600/20 via-brand-primary-700/20 to-brand-primary-800/20 relative">
                                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top_-1px]"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg/40 to-transparent"></div>
                            </div>

                            <div className="px-8 pb-10 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-8">
                                {/* Avatar with Glow */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-brand-primary-500 to-brand-primary-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                                    <div className="relative w-40 h-40 rounded-full border-4 border-brand-bg bg-brand-surface flex items-center justify-center overflow-hidden shadow-2xl">
                                        {profile.avatarUrl ? (
                                            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-20 h-20 text-brand-subtext" />
                                        )}
                                        {editMode && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera className="text-white w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2 pb-2 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        <h1 className="text-4xl font-extrabold tracking-tight text-white font-display">
                                            {profile.name || 'Seu Nome'}
                                        </h1>
                                        <div className="flex gap-2 justify-center md:justify-start">
                                            <span className="px-3 py-1 bg-brand-primary-500/10 text-brand-primary-400 text-xs font-bold rounded-full border border-brand-primary-500/20 uppercase tracking-widest">
                                                {isHospital ? 'Hospital / Clínica' : isNurse ? 'Enfermagem' : 'Medicina'}
                                            </span>
                                            {user?.is_verified ? (
                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                                    Verificado
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/pricing')}
                                                    className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20 uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-1"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    Selo de Verificação
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-400 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-sky-400" />
                                            {isHospital ? `CNPJ: ${profile.registration || 'Não informado'}` : isNurse ? `COREN: ${profile.registration || 'Não informado'}` : `CRM: ${profile.registration || 'Não informado'}`}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-sky-400" />
                                            {profile.location || 'Localização não informada'}
                                        </div>
                                    </div>
                                </div>

                                <div className="pb-2 flex gap-3">
                                    {!editMode ? (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-sky-100 transition-all shadow-xl shadow-sky-500/10 active:scale-95"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Editar Perfil
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setEditMode(false)}
                                            className="px-6 py-3 bg-brand-surface text-brand-text rounded-2xl font-bold border border-brand-border/10 hover:bg-brand-surface-highlight transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="p-3 bg-brand-surface text-brand-subtext rounded-2xl border border-brand-border/10 hover:text-rose-400 transition-all active:scale-95"
                                        title="Sair"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Info & Specs */}
                        <div className="space-y-8">
                            {/* Bio / About */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-sky-400" />
                                    {isHospital ? 'História' : 'Sobre'}
                                </h3>
                                {editMode ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        className="w-full bg-brand-surface/50 border border-brand-border/10 rounded-xl px-4 py-3 text-brand-text placeholder-brand-subtext focus:border-brand-primary-500 transition-all outline-none resize-none min-h-[150px]"
                                        placeholder="Conte um pouco sobre sua trajetória profissional..."
                                    />
                                ) : (
                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        {profile.bio || (isHospital ? 'Adicione a história de sua instituição para atrair os melhores profissionais.' : 'Adicione uma apresentação para que hospitais conheçam melhor seu trabalho.')}
                                    </p>
                                )}
                            </motion.div>

                            {/* Specialties */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-brand-surface/40 backdrop-blur-md border border-brand-border/20 rounded-[2rem] p-8 shadow-xl"
                            >
                                <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-3">
                                    <Award className="w-5 h-5 text-brand-primary-400" />
                                    {isHospital ? 'Especialidades Atendidas' : 'Especialidades'}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <AnimatePresence>
                                        {profile.specialties.map(spec => (
                                            <motion.span
                                                key={spec}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="px-4 py-2 bg-brand-surface/80 text-brand-text text-sm font-bold rounded-xl border border-brand-border/10 flex items-center gap-2 group hover:border-brand-primary-500/30 transition-all"
                                            >
                                                {spec}
                                                {editMode && (
                                                    <button
                                                        onClick={() => handleRemoveSpecialty(spec)}
                                                        className="p-1 hover:bg-rose-500/20 hover:text-rose-400 rounded-md transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {editMode && (
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={specialtyInput}
                                            onChange={(e) => setSpecialtyInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                                            className="w-full bg-brand-surface/80 border border-brand-border/10 rounded-xl pl-4 pr-12 py-3 text-brand-text placeholder-brand-subtext focus:border-brand-primary-500 outline-none transition-all"
                                            placeholder="Ex: UTI Adulto"
                                        />
                                        <button
                                            onClick={handleAddSpecialty}
                                            className="absolute right-2 top-2 p-1.5 bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-400 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMNS: Experiences & Forms */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Detailed Info Form (Only in Edit Mode) */}
                            {editMode && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900/40 backdrop-blur-md border border-sky-500/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Stethoscope className="w-24 h-24 text-sky-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-text mb-8 flex items-center gap-3 relative z-10">
                                        <Edit3 className="w-5 h-5 text-brand-primary-400" />
                                        {isHospital ? 'Dados da Instituição' : 'Dados Profissionais'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">{isHospital ? 'Razão Social' : 'Nome de Exibição'}</label>
                                            <div className="relative group">
                                                {isHospital ? <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" /> : <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />}
                                                <input
                                                    name="name"
                                                    ref={nameInputRef}
                                                    value={profile.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-sky-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Email Profissional</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-sky-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Telefone / WhatsApp</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                                                <input
                                                    name="phone"
                                                    value={profile.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-sky-500 outline-none transition-all"
                                                    placeholder="(11) 99999-9999"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Localização</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                                                <input
                                                    name="location"
                                                    value={profile.location}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-sky-500 outline-none transition-all"
                                                    placeholder="Cidade, UF"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">{isHospital ? 'CNPJ' : isNurse ? 'Número do COREN' : 'Número do CRM'}</label>
                                            <div className="relative group">
                                                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                                                <input
                                                    name="registration"
                                                    value={profile.registration}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:border-sky-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full mt-10 py-5 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white font-extrabold text-lg rounded-[1.5rem] shadow-xl shadow-brand-primary-500/20 hover:shadow-brand-primary-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Check className="w-6 h-6" />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Experience Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-xl"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        {isHospital ? <Building2 className="w-5 h-5 text-sky-400" /> : <Briefcase className="w-5 h-5 text-sky-400" />}
                                        {isHospital ? 'Unidades / Equipe' : 'Experiência Profissional'}
                                    </h3>
                                </div>

                                {editMode && (
                                    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6 mb-10 space-y-4">
                                        <h4 className="font-bold text-sky-400 text-sm uppercase tracking-wider mb-2">{isHospital ? 'Adicionar Unidade / Setor' : 'Adicionar Novo Cargo'}</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                placeholder={isHospital ? "Nome da Unidade / Hospital" : "Hospital / Instituição"}
                                                value={newExp.hospital}
                                                onChange={e => setNewExp({ ...newExp, hospital: e.target.value })}
                                                className="w-full bg-brand-surface border border-brand-border/10 rounded-xl px-4 py-3 text-brand-text focus:border-brand-primary-500 outline-none"
                                            />
                                            <input
                                                placeholder={isHospital ? "Diretoria / Responsável" : "Cargo / Especialidade"}
                                                value={newExp.position}
                                                onChange={e => setNewExp({ ...newExp, position: e.target.value })}
                                                className="w-full bg-brand-surface border border-brand-border/10 rounded-xl px-4 py-3 text-brand-text focus:border-brand-primary-500 outline-none"
                                            />
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Data Início</label>
                                                <input
                                                    type="date"
                                                    value={newExp.startDate}
                                                    onChange={e => setNewExp({ ...newExp, startDate: e.target.value })}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-sky-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Data Término (Opcional)</label>
                                                <input
                                                    type="date"
                                                    value={newExp.endDate}
                                                    onChange={e => setNewExp({ ...newExp, endDate: e.target.value })}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-sky-500 outline-none"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Descrição das atividades..."
                                                value={newExp.description}
                                                onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                                                className="w-full md:col-span-2 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-sky-500 outline-none min-h-[80px]"
                                            />
                                        </div>
                                        <button
                                            onClick={addExperience}
                                            className="w-full py-3 bg-sky-500/10 text-sky-400 font-bold rounded-xl border border-sky-500/20 hover:bg-sky-500 hover:text-white transition-all"
                                        >
                                            Adicionar à Lista
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-6 relative">
                                    <div className="absolute left-7 top-0 bottom-0 w-px bg-slate-800 hidden md:block"></div>

                                    {profile.experiences.length > 0 ? (
                                        profile.experiences.map((exp, idx) => (
                                            <motion.div
                                                key={exp.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex flex-col md:flex-row gap-6 group relative"
                                            >
                                                <div className="md:w-14 items-start justify-center hidden md:flex">
                                                    <div className="w-4 h-4 rounded-full bg-sky-500 mt-2 z-10 group-hover:scale-150 transition-transform"></div>
                                                </div>

                                                <div className="flex-1 bg-slate-800/40 border border-white/5 rounded-2xl p-6 group-hover:bg-slate-800/60 group-hover:border-white/10 transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">{exp.position}</h4>
                                                            <p className="text-slate-400 font-bold">{exp.hospital}</p>
                                                        </div>
                                                        {editMode && (
                                                            <button
                                                                onClick={() => removeExperience(exp.id)}
                                                                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 bg-slate-900/50 w-fit px-3 py-1 rounded-lg">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(exp.startDate).toLocaleDateString('pt-BR')} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString('pt-BR') : 'Atual'}
                                                    </div>

                                                    <p className="text-slate-400 text-sm leading-relaxed">
                                                        {exp.description || (isHospital ? 'Detalhes sobre a unidade, serviços oferecidos ou equipe.' : 'Responsabilidades e conquistas nesta instituição.')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10">
                                            {isHospital ? <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-4" /> : <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />}
                                            <p className="text-slate-500 font-medium italic">{isHospital ? 'Nenhuma unidade ou equipe registrada.' : 'Nenhuma experiência registrada.'}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Profile;