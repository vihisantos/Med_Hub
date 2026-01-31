// React import removed
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function Terms() {
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
                    <h1 className="text-4xl font-display font-bold text-white mb-8">Termos de Uso</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-brand-subtext">
                        <p>Bem-vindo ao Med Hub. Ao acessar nosso sistema, você concorda com os termos descritos abaixo.</p>
                        <h3>1. Aceitação</h3>
                        <p>O uso da plataforma implica na aceitação integral destes termos.</p>
                        <h3>2. Responsabilidades</h3>
                        <p>Os profissionais de saúde são responsáveis pela veracidade das informações fornecidas.</p>
                        <p>[Texto jurídico completo seria inserido aqui...]</p>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
