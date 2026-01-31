import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import MapTooltip from './MapTooltip';

export default function Footer() {
    return (
        <footer className="bg-brand-bg text-brand-text pt-16 pb-8 border-t border-brand-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <h2 className="text-2xl font-display font-bold text-brand-text tracking-tight">
                                Med <span className="text-brand-accent">Hub</span>
                            </h2>
                        </div>
                        <p className="text-brand-subtext leading-relaxed text-sm mb-6">
                            Conectando os melhores profissionais de saúde às principais oportunidades do mercado. Gestão, agilidade e confiança.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-10 w-10 bg-brand-surface-highlight rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-brand-subtext">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-brand-surface-highlight rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-brand-subtext">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 bg-brand-surface-highlight rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-brand-subtext">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-6 text-brand-text">Plataforma</h3>
                        <ul className="space-y-4 text-brand-subtext text-sm">
                            <li><Link to="/login" className="hover:text-brand-accent transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-brand-accent transition-colors">Cadastrar Médico</Link></li>
                            <li><Link to="/register" className="hover:text-brand-accent transition-colors">Cadastrar Hospital</Link></li>
                            <li><a href="#" className="hover:text-brand-accent transition-colors">Funcionalidades</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-6 text-brand-text">Legal</h3>
                        <ul className="space-y-4 text-brand-subtext text-sm">
                            <li><Link to="/terms" className="hover:text-brand-accent transition-colors">Termos de Uso</Link></li>
                            <li><Link to="/privacy" className="hover:text-brand-accent transition-colors">Política de Privacidade</Link></li>
                            <li><Link to="/compliance" className="hover:text-brand-accent transition-colors">Compliance</Link></li>
                            <li><Link to="/lgpd" className="hover:text-brand-accent transition-colors">LGPD</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-6 text-brand-text">Contato</h3>
                        <ul className="space-y-4 text-brand-subtext text-sm">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 text-brand-accent mr-3 shrink-0" />
                                <span>contato@medhub.com.br</span>
                            </li>
                            <li className="flex items-start">
                                <Phone className="h-5 w-5 text-brand-accent mr-3 shrink-0" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-brand-accent mr-3 shrink-0 mt-1" />
                                <MapTooltip />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-subtext">
                    <p>&copy; 2026 Med Hub. Todos os direitos reservados.</p>
                    <p className="mt-2 md:mt-0 flex items-center">
                        Feito com <span className="text-red-500 mx-1">♥</span> para a saúde.
                    </p>
                </div>
            </div>
        </footer>
    );
}
