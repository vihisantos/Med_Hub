import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, Star, Zap, Building2, FileText, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const Pricing = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Basic',
            price: 'R$ 0',
            description: 'Para clínicas pequenas começando agora.',
            features: [
                '1 vaga ativa por vez',
                'Sem acesso a contatos diretos',
                'Taxa de serviço por contratação',
                'Painel de controle básico'
            ],
            cta: 'Começar Agora',
            highlight: false,
            icon: <Building2 className="w-6 h-6 text-slate-400" />
        },
        {
            name: 'Pro (Verified)',
            price: 'R$ 299',
            description: 'O selo de confiança para atrair os melhores.',
            features: [
                'Vagas ilimitadas',
                'Selo de Empresa Verificada 🛡️',
                'Acesso total ao banco de dados',
                'Prioridade nas buscas de profissionais',
                'Suporte prioritário 24/7'
            ],
            cta: 'Upgrade para Pro',
            highlight: true,
            icon: <Shield className="w-6 h-6 text-brand-primary-400" />
        },
        {
            name: 'Enterprise',
            price: 'Sob Consulta',
            description: 'Gestão completa para grandes redes hospitalares.',
            features: [
                'Multi-unidades centralizadas',
                'Gestão automática de escalas (IA)',
                'API de integração com ERP',
                'Account Manager exclusivo',
                'Treinamentos in-company'
            ],
            cta: 'Falar com Consultor',
            highlight: false,
            icon: <Zap className="w-6 h-6 text-emerald-400" />
        }
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-brand-subtext hover:text-brand-primary-400 transition-all font-bold group absolute top-10 left-4 sm:left-8"
                    >
                        <div className="p-2 bg-brand-surface/40 rounded-xl border border-brand-border/10 group-hover:border-brand-primary-400/30 group-hover:bg-brand-surface-highlight transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Voltar
                    </motion.button>
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-extrabold text-white mb-6 font-display"
                        >
                            Impulsione sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-400 to-brand-primary-600">Gestão Médica</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-400 max-w-2xl mx-auto"
                        >
                            Escolha o plano ideal para sua instituição e garanta os melhores profissionais na sua escala, com segurança e verificação.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative p-8 rounded-[2.5rem] border ${plan.highlight ? 'bg-brand-surface border-brand-primary-500/50 shadow-2xl shadow-brand-primary-500/10' : 'bg-brand-surface/40 border-brand-border/5'} flex flex-col`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-sky-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                        Mais Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className="mb-4">{plan.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{plan.description}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">{plan.price}</span>
                                        {plan.price !== 'Sob Consulta' && <span className="text-slate-500 text-sm">/mês</span>}
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${plan.highlight
                                        ? 'bg-sky-500 text-white hover:bg-sky-400 shadow-xl shadow-sky-500/20'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* How Verification Works */}
                    <div className="bg-brand-surface/40 backdrop-blur-md border border-brand-border/5 rounded-[3rem] p-12 relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
                            <Shield className="w-64 h-64 text-brand-primary-400" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Como funciona a Verificação? 🛡️</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                    O selo de verificação é concedido após nossa equipe validar juridicamente os dados da instituição (CNPJ e alvarás). Isso garante aos médicos e enfermeiros que sua vaga é real e segura.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-brand-primary-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">1. Envio de Documentos</h4>
                                            <p className="text-sm text-slate-500">Anexe o cartão CNPJ e comprovante de endereço.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Shield className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">2. Análise Jurídica</h4>
                                            <p className="text-sm text-slate-500">Nossa equipe valida os dados em até 48h úteis.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <Star className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">3. Selo Ativo</h4>
                                            <p className="text-sm text-slate-500">Seu perfil ganha o badge e sobe no ranking de buscas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-brand-surface/50 p-8 rounded-[2rem] border border-brand-border/5">
                                <h3 className="text-xl font-bold text-white mb-6">Benefícios de ser Verificado</h3>
                                <div className="space-y-4">
                                    {[
                                        'Aumento de 300% na taxa de candidaturas',
                                        'Badge de confiança em todas as vagas',
                                        'Acesso antecipado a novos perfis',
                                        'Link direto para contato via WhatsApp',
                                        'Destaque visual no dashboard dos profissionais'
                                    ].map(benefit => (
                                        <div key={benefit} className="flex items-center gap-3 text-slate-400">
                                            <Star className="w-4 h-4 text-amber-400 shrink-0" />
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Pricing;
