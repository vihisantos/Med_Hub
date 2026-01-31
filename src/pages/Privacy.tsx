// React import removed
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function Privacy() {
    const navigate = useNavigate();
    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
                <Navbar />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-brand-subtext hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>
                    <h1 className="text-4xl font-display font-bold text-white mb-8">Política de Privacidade</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-brand-subtext">
                        <p>Sua privacidade é nossa prioridade. Esta política descreve como coletamos e usamos seus dados.</p>
                        <h3>1. Coleta de Dados</h3>
                        <p>Coletamos informações necessárias para a prestação de serviços de conexão profissional.</p>
                        <h3>2. Segurança</h3>
                        <p>Utilizamos criptografia de ponta para proteger suas informações pessoais.</p>
                        <p>[Texto jurídico completo seria inserido aqui...]</p>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
