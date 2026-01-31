// React import removed
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function LGPD() {
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
                    <h1 className="text-4xl font-display font-bold text-white mb-8">LGPD</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-brand-subtext">
                        <p>Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
                        <h3>1. Seus Direitos</h3>
                        <p>Você tem direito de saber quais dados coletamos e como os processamos.</p>
                        <h3>2. Encarregado de Dados</h3>
                        <p>Entre em contato com nosso DPO para solicitações relacionadas a seus dados.</p>
                        <p>[Texto jurídico completo seria inserido aqui...]</p>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
