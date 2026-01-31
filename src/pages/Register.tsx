import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import AnimatedLogo from '../components/AnimatedLogo';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail, Lock, User, Stethoscope, Building2,
    FileText, MapPin, Phone, ArrowRight
} from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    // User Type State
    const [role, setRole] = useState<'doctor' | 'nurse' | 'hospital'>('doctor');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        crm: '',
        coren: '',
        specialty: '',
        cnpj: '',
        address: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Standardize registration and location based on role
            const registration = role === 'doctor' ? formData.crm : (role === 'nurse' ? formData.coren : formData.cnpj);
            const location = role === 'hospital' ? formData.address : '';

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role,
                phone: formData.phone,
                registration,
                location,
                specialty: formData.specialty || '',
                specialties: formData.specialty ? [formData.specialty] : [],
                experiences: []
            };

            const res = await api.post('/auth/register', payload);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Erro no registro. Verifique os dados.');
            }

            login(data.token, data.user);

            // Redirect based on role
            if (role === 'hospital') {
                navigate('/hospital');
            } else if (role === 'doctor') {
                navigate('/doctor');
            } else {
                navigate('/profile'); // Nurses might not have a dedicated dashboard yet
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-bg">
            <Navbar />
            <div className="flex-grow flex flex-col lg:flex-row">

                {/* Left Side - Branding */}
                <div className="lg:w-1/2 bg-brand-bg relative overflow-hidden flex flex-col items-center justify-center p-12 order-last lg:order-first">
                    <div className="absolute inset-0 bg-brand-accent/5 backdrop-blur-3xl"></div>
                    <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
                        <AnimatedLogo />
                        <div className="mt-8">
                            <h1 className="text-5xl font-extrabold tracking-tight mb-4 font-display text-white leading-tight">
                                {role === 'doctor' ? 'Carreira Médica' : role === 'nurse' ? 'Oportunidades Enfermagem' : 'Gestão Hospitalar'}
                            </h1>
                            <p className="text-brand-subtext text-lg font-medium max-w-md mx-auto">
                                {role === 'hospital'
                                    ? 'Encontre os melhores profissionais para compor sua escala com agilidade.'
                                    : 'Descubra plantões que se encaixam na sua rotina e valorizam seu trabalho.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-1/2 bg-brand-surface flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
                    <div className="w-full max-w-lg space-y-6 relative z-10 my-8">

                        {/* Header */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl font-bold text-brand-text">Crie sua conta</h2>
                            <p className="mt-2 text-brand-subtext text-lg">
                                Já tem cadastro? <Link to="/login" className="font-bold text-brand-accent hover:text-brand-accent-hover transition-colors border-b-2 border-brand-accent/30">Faça Login</Link>
                            </p>
                        </div>

                        {/* Role Toggle */}
                        <div className="bg-brand-surface-highlight/50 p-1 rounded-2xl shadow-inner flex border border-brand-border/50">
                            <button
                                type="button"
                                onClick={() => setRole('doctor')}
                                className={`flex-1 flex items-center justify-center py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'doctor'
                                    ? 'bg-brand-accent text-white shadow-xl'
                                    : 'text-brand-subtext hover:bg-brand-surface/50'
                                    }`}
                            >
                                <Stethoscope className="w-4 h-4 mr-2" />
                                Médico
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('nurse')}
                                className={`flex-1 flex items-center justify-center py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'nurse'
                                    ? 'bg-brand-accent text-white shadow-xl'
                                    : 'text-brand-subtext hover:bg-brand-surface/50'
                                    }`}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Enf.
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('hospital')}
                                className={`flex-1 flex items-center justify-center py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'hospital'
                                    ? 'bg-brand-accent text-white shadow-xl'
                                    : 'text-brand-subtext hover:bg-brand-surface/50'
                                    }`}
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Hospital
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
                                    <p className="text-red-500 text-sm font-bold">{error}</p>
                                </div>
                            )}

                            {/* Common Fields */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                    placeholder={role === 'hospital' ? "Nome da Instituição" : "Nome Completo"}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                    placeholder="Email de Acesso"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                    placeholder="Telefone / WhatsApp"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Conditional Fields */}
                            {(role === 'doctor' || role === 'nurse') ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                        </div>
                                        <input
                                            name={role === 'doctor' ? 'crm' : 'coren'}
                                            type="text"
                                            required
                                            className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                            placeholder={role === 'doctor' ? 'CRM' : 'COREN'}
                                            value={role === 'doctor' ? formData.crm : formData.coren}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Stethoscope className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                        </div>
                                        <input
                                            name="specialty"
                                            type="text"
                                            required
                                            className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                            placeholder="Especialidade"
                                            value={formData.specialty}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                        </div>
                                        <input
                                            name="cnpj"
                                            type="text"
                                            required
                                            className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                            placeholder="CNPJ"
                                            value={formData.cnpj}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                        </div>
                                        <input
                                            name="address"
                                            type="text"
                                            required
                                            className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                            placeholder="Localização / Endereço"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-brand-subtext group-focus-within:text-brand-accent transition-colors opacity-50" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-14 pr-6 py-4 border-2 border-transparent bg-brand-surface-highlight/50 rounded-2xl text-brand-text placeholder-brand-subtext/30 focus:outline-none focus:ring-0 focus:border-brand-accent/50 transition-all shadow-sm font-bold"
                                    placeholder="Senha de Acesso"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-5 px-8 border border-transparent rounded-[20px] shadow-2xl text-sm font-black uppercase tracking-widest text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all transform hover:-translate-y-1 mt-8 shadow-brand-accent/30"
                            >
                                {loading ? 'Sincronizando...' : 'Finalizar Cadastro'}
                                {!loading && <ArrowRight className="ml-3 h-5 w-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
}
