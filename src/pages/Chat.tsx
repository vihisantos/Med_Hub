import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Send, Search, User, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface Contact {
    id: number;
    name: string;
    role: string;
    avatar_url?: string;
    last_message?: string;
    unread_count?: number;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
}

export default function Chat() {
    const { user, token } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [showMobileList, setShowMobileList] = useState(true);

    useEffect(() => {
        fetchContacts();
        const interval = setInterval(fetchContacts, 10000); // Polling for contacts/unread
        return () => clearInterval(interval);
    }, []);

    // Handle navigation from other pages (e.g. Dashboard)
    const location = useLocation();
    useEffect(() => {
        if (location.state?.contact) {
            const contactFromState = location.state.contact;
            // Ensure compatibility between DashboardCandidate and ChatContact interfaces
            // Dashboard passes 'candidate' which has similar fields.
            // We might need to fetch the contact or just set it if we trust the data.
            // For safety, we'll try to find it in the fetched contacts or set it directly.
            setSelectedContact({
                id: contactFromState.id,
                name: contactFromState.name,
                role: contactFromState.role || 'candidate', // Default fallback
                avatar_url: contactFromState.avatar_url,
                // Other fields optional
            });
        }
    }, [location.state]);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            const interval = setInterval(() => fetchMessages(selectedContact.id), 3000); // Polling for messages
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/messages/contacts', token);
            if (res.ok) {
                const data = await res.json();
                setContacts(data);
                setLoadingContacts(false);
            }
        } catch (err) {
            console.error('Failed to fetch contacts', err);
        }
    };

    const fetchMessages = async (contactId: number) => {
        try {
            const res = await api.get(`/messages/${contactId}`, token);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const res = await api.post('/messages', {
                receiver_id: selectedContact.id,
                content: newMessage
            }, token);

            if (res.ok) {
                setNewMessage('');
                fetchMessages(selectedContact.id); // Refresh immediately
            }
        } catch (err) {
            addToast('Erro ao enviar mensagem', 'error');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        setShowMobileList(false);
    };

    return (
        <div className="flex h-screen bg-brand-bg overflow-hidden">
            {/* Sidebar (Contacts) */}
            <div className={`w-full md:w-80 lg:w-96 bg-brand-surface border-r border-brand-border flex flex-col ${showMobileList ? 'block' : 'hidden md:flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-brand-border flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-brand-text">Mensagens</h2>
                    <button onClick={() => navigate(-1)} className="md:hidden p-2 text-brand-subtext">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => navigate(-1)} className="hidden md:block text-brand-subtext hover:text-brand-text text-sm font-bold">
                        Voltar
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-brand-subtext/50" />
                        <input
                            type="text"
                            placeholder="Buscar conversa..."
                            className="w-full pl-10 pr-4 py-2 bg-brand-surface-highlight border border-brand-border rounded-xl outline-none focus:border-brand-accent text-sm text-brand-text placeholder-brand-subtext/50"
                        />
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto">
                    {loadingContacts ? (
                        <div className="p-4 text-center text-sm text-brand-subtext">Carregando contatos...</div>
                    ) : contacts.length === 0 ? (
                        <div className="p-8 text-center">
                            <User className="w-12 h-12 mx-auto text-brand-subtext/20 mb-2" />
                            <p className="text-brand-subtext text-sm">Nenhum contato disponível.</p>
                            <p className="text-brand-subtext/60 text-xs mt-1">
                                {user?.role === 'hospital'
                                    ? 'Aprove candidatos para iniciar conversas.'
                                    : 'Aguarde a aprovação de uma vaga.'}
                            </p>
                        </div>
                    ) : (
                        contacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => handleSelectContact(contact)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-brand-surface-highlight transition-colors border-b border-brand-border ${selectedContact?.id === contact.id ? 'bg-brand-accent/10 border-l-4 border-l-brand-accent' : ''}`}
                            >
                                <div className="relative">
                                    {contact.avatar_url ? (
                                        <img src={`http://localhost:3000${contact.avatar_url}`} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-text font-bold text-lg">
                                            {contact.name.charAt(0)}
                                        </div>
                                    )}
                                    {/* Online Indicator (Mocked for now) */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-brand-text truncate">{contact.name}</h3>
                                    <p className="text-xs text-brand-subtext uppercase tracking-wider">{contact.role === 'nurse' ? 'Enfermeiro' : contact.role === 'doctor' ? 'Médico' : 'Hospital'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-brand-bg ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
                {selectedContact ? (
                    <>
                        <div className="bg-brand-surface p-4 border-b border-brand-border flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowMobileList(true)} className="md:hidden p-1 text-brand-text">
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                {selectedContact.avatar_url ? (
                                    <img src={`http://localhost:3000${selectedContact.avatar_url}`} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-text font-bold">
                                        {selectedContact.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-bold text-brand-text">{selectedContact.name}</h2>
                                    <span className="text-xs text-brand-accent font-medium flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Online agora
                                    </span>
                                </div>
                            </div>

                            {/* Hospital Actions in Chat */}
                            {user?.role === 'hospital' && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Rejeitar este candidato?')) return;
                                            // Send rejection message
                                            try {
                                                await api.post('/messages', {
                                                    receiver_id: selectedContact.id,
                                                    content: "Olá. Agradecemos seu interesse, mas infelizmente não seguiremos com sua candidatura neste momento."
                                                }, token);
                                                addToast('Mensagem de recusa enviada.', 'info');
                                                fetchMessages(selectedContact.id);
                                            } catch (e) { console.error(e); }
                                        }}
                                        className="p-2 text-brand-subtext hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Rejeitar Candidato"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Aprovar este candidato?')) return;
                                            try {
                                                await api.post('/messages', {
                                                    receiver_id: selectedContact.id,
                                                    content: "Parabéns! Sua candidatura foi aprovada. Por favor, compareça ao hospital amanhã às 08:00 para assinatura do contrato."
                                                }, token);
                                                addToast('Candidato aprovado e notificado!', 'success');
                                                fetchMessages(selectedContact.id);
                                            } catch (e) { console.error(e); }
                                        }}
                                        className="bg-brand-accent text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-brand-accent-hover transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="hidden sm:inline">Aprovar</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-brand-subtext/40">
                                    <div className="bg-brand-surface-highlight p-6 rounded-full mb-4">
                                        <Send className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>Envie a primeira mensagem para {selectedContact.name.split(' ')[0]}.</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] md:max-w-[60%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative group ${isMe
                                                    ? 'bg-brand-accent text-white rounded-tr-none'
                                                    : 'bg-brand-surface text-brand-text rounded-tl-none border border-brand-border'
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${isMe ? 'text-white/60' : 'text-brand-subtext/60'}`}>
                                                    {formatTime(msg.created_at)}
                                                    {isMe && <span>• Enviado</span>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="bg-brand-surface p-4 border-t border-brand-border">
                            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 bg-brand-surface-highlight border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all font-medium text-brand-text placeholder-brand-subtext/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-brand-accent text-white p-3 rounded-xl hover:bg-brand-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 transform duration-100"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-brand-subtext bg-brand-bg">
                        <div className="bg-brand-surface p-6 rounded-3xl shadow-sm mb-4 border border-brand-border">
                            <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-4 mx-auto">
                                <Send className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-brand-text mb-2">Med Hub Chat</h3>
                            <p className="text-center text-sm max-w-xs mx-auto">
                                Selecione um profissional ou hospital ao lado para iniciar uma conversa segura e direta.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
