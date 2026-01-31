import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Shield, Users, LayoutDashboard, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
            <Navbar />

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-primary-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-brand-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-20 w-96 h-96 bg-brand-primary-700/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface/80 border border-brand-accent/20 backdrop-blur-md mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                            </span>
                            <span className="text-sm font-medium text-brand-subtext">Plataforma #1 em Gestão de Plantões</span>
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-8 leading-[1.1]">
                            O Futuro da <br />
                            <span className="text-gradient">Gestão Médica</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl text-brand-subtext mb-12 max-w-2xl mx-auto leading-relaxed">
                            Conectamos os melhores hospitais aos profissionais mais qualificados.
                            Simplifique escalas, automatize pagamentos e garanta a cobertura total dos seus plantões.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate(`/${user?.role === 'admin' ? 'admin' : user?.role === 'doctor' ? 'doctor' : 'hospital'}`)}
                                    className="group relative inline-flex justify-center items-center px-8 py-4 rounded-xl bg-brand-accent text-white font-bold overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-2">
                                        <LayoutDashboard className="h-5 w-5" />
                                        Acessar Dashboard
                                    </span>
                                </button>
                            ) : (
                                <>
                                    <Link to="/register" className="group relative inline-flex justify-center items-center px-8 py-4 rounded-xl bg-brand-accent text-white font-bold overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative flex items-center gap-2">
                                            Começar Gratuitamente
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                    <Link to="/login" className="px-8 py-4 rounded-xl text-brand-subtext font-semibold hover:text-white transition-colors border border-transparent hover:border-brand-border hover:bg-white/5">
                                        Fazer Login
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Profissionais', value: '10k+' },
                            { label: 'Hospitais', value: '500+' },
                            { label: 'Plantões/Mês', value: '50k+' },
                            { label: 'Satisfação', value: '4.9/5' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-display">{stat.value}</div>
                                <div className="text-sm text-brand-subtext uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
                            Tecnologia que <span className="text-gradient">Salva Vidas</span>
                        </h2>
                        <p className="text-brand-subtext text-lg max-w-2xl mx-auto">
                            Nossa plataforma foi desenhada para eliminar a burocracia e deixar você focar no que importa: o paciente.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Activity className="h-8 w-8 text-brand-accent" />,
                                title: "Tempo Real",
                                desc: "Visualize e candidate-se a vagas instantaneamente. Notificações push garantem que você nunca perca uma oportunidade."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-brand-accent" />,
                                title: "Ranking Inteligente",
                                desc: "Sistema de matchmaking que conecta o perfil ideal à necessidade específica do hospital."
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-brand-accent" />,
                                title: "Compliance Total",
                                desc: "Validação automática de documentos (CRM/COREN) e gestão fiscal integrada para pagamentos seguros."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="glass-card p-8 rounded-3xl group"
                            >
                                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-accent/20 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 font-display group-hover:text-brand-accent transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-brand-subtext leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust */}
            <section className="py-24 bg-brand-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-12 font-display">Confiam no Med Hub</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder logos - using text for now but styled like logos */}
                        {['Albert Einstein', 'Sírio Libanês', 'Rede D\'Or', 'Unimed', 'HCor'].map((name) => (
                            <span key={name} className="text-xl font-bold text-white/80 hover:text-white transition-colors cursor-default select-none">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="glass-card rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden border-brand-accent/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50"></div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 font-display">
                            Pronto para transformar sua <br /> gestão de escalas?
                        </h2>
                        <p className="text-xl text-brand-subtext mb-10 max-w-2xl mx-auto">
                            Junte-se a mais de 500 hospitais e 10.000 profissionais que já modernizaram seus plantões.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-white text-brand-bg font-bold hover:bg-gray-100 transition-all text-lg hover:-translate-y-1 shadow-xl">
                                Criar Conta Grátis
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
