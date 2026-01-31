// React import removed
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function Compliance() {
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
                    <h1 className="text-4xl font-display font-bold text-white mb-8">Compliance</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-brand-subtext">
                        <p>Nossa conformidade com as normas do setor de saúde e regulamentações governamentais.</p>
                        <h3>1. Ética Médica</h3>
                        <p>Seguimos rigorosamente o código de ética médica e regulamentações do CFM.</p>
                        <h3>2. Transparência</h3>
                        <p>Operamos com total transparência em todas as relações contratuais.</p>
                        <p>[Texto jurídico completo seria inserido aqui...]</p>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
