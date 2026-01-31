import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('medhub_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem('medhub_cookie_consent', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[200] max-w-sm w-full"
                >
                    <div className="relative bg-[#0B0F1A]/90 backdrop-blur-xl border border-sky-500/20 rounded-[2rem] p-6 shadow-2xl shadow-sky-500/10 overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50" />

                        <div className="flex items-start gap-4">
                            <div className="bg-sky-500/10 p-3 rounded-2xl shrink-0 border border-sky-500/10">
                                <Cookie className="w-6 h-6 text-sky-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1 font-display">Cookies & Privacidade</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Usamos cookies para deixar sua experiência no Med Hub ainda mais
                                    <span className="text-sky-400 font-bold mx-1">incrível</span>.
                                    Ao continuar, você concorda com nossa política.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                                    >
                                        Aceitar tudo
                                    </button>
                                    <button
                                        onClick={handleAccept} // For now, simple dismiss matches accept
                                        className="px-4 py-3 text-slate-500 hover:text-white text-sm font-bold transition-colors"
                                    >
                                        Dispensar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
