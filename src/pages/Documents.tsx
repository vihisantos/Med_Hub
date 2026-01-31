import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api, API_URL } from '../utils/api';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Plus, Search, Calendar, User, Upload } from 'lucide-react';



import PageTransition from '../components/PageTransition';

interface Document {
    id: number;
    file_name: string;
    file_url: string;
    month: string;
    created_at: string;
    uploader_name?: string; // For professionals
    recipient_name?: string; // For hospitals
}

interface Employee {
    id: number;
    name: string;
    role: string;
    specialty?: string;
}

export default function Documents() {
    const { user, token } = useAuth();
    const { addToast } = useToast();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Filter/Search
    const [searchTerm, setSearchTerm] = useState('');

    // Upload Form State
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [uploadMonth, setUploadMonth] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
        if (user?.role === 'hospital') {
            fetchEmployees();
        }
    }, [user, token]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            // Determine endpoint based on role
            const endpoint = user?.role === 'hospital' ? '/documents/sent' : '/documents/mine';
            const res = await api.get(endpoint, token);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (err) {
            console.error('Failed to fetch documents', err);
            addToast('Erro ao carregar documentos.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/documents/my-employees', token);
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (err) {
            console.error(err);
            // Mock data for demo purposes if API fails
            setEmployees([
                { id: 101, name: 'Dr. Roberto Silva', role: 'doctor', specialty: 'Cardiologia' },
                { id: 102, name: 'Dra. Julia Santos', role: 'doctor', specialty: 'Clínica Geral' },
                { id: 201, name: 'Enf. Carla Mendes', role: 'nurse' }
            ]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !selectedEmployeeId || !uploadMonth) {
            addToast('Preencha todos os campos.', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('user_id', selectedEmployeeId);
        formData.append('month', uploadMonth);
        // Optional: Let user type a custom name, or default to filename
        // formData.append('file_name', selectedFile.name); 

        try {
            const response = await api.upload('/documents/upload', formData, token);

            if (response.ok) {
                addToast('Documento enviado com sucesso!', 'success');
                setShowModal(false);
                setSelectedFile(null);
                setUploadMonth('');
                setSelectedEmployeeId('');
                fetchDocuments();
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error(err);
            addToast('Erro ao enviar documento.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.recipient_name && doc.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.uploader_name && doc.uploader_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
                <main className="max-w-7xl mx-auto px-4 py-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="flex flex-col items-start gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="text-brand-subtext hover:text-brand-text flex items-center gap-2 text-sm font-bold transition-colors"
                            >
                                ← Voltar
                            </button>
                            <div>
                                <span className="text-brand-accent font-bold tracking-wider uppercase text-sm mb-2 block">
                                    Gestão Administrativa
                                </span>
                                <h1 className="text-4xl font-display font-bold text-brand-text">
                                    {user?.role === 'hospital' ? 'Envio de Holerites' : 'Meus Documentos'}
                                </h1>
                                <p className="mt-2 text-brand-subtext font-medium max-w-2xl">
                                    {user?.role === 'hospital'
                                        ? 'Gerencie e envie comprovantes de pagamento para seus médicos e enfermeiros.'
                                        : 'Acesse seus holerites e comprovantes de rendimentos mensalmente.'}
                                </p>
                            </div>
                        </div>


                        {user?.role === 'hospital' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-brand-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-accent-hover transition-all flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Novo Documento
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-brand-surface rounded-2xl p-4 shadow-sm border border-brand-border mb-8 flex items-center">
                        <Search className="text-brand-subtext/40 w-5 h-5 ml-2" />
                        <input
                            type="text"
                            placeholder={user?.role === 'hospital' ? "Buscar por profissional ou arquivo..." : "Buscar por nome do arquivo..."}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 outline-none text-brand-text placeholder-brand-subtext/40 bg-transparent font-medium"
                        />
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-brand-subtext animate-pulse">Carregando documentos...</div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-brand-border rounded-3xl">
                            <FileText className="w-16 h-16 mx-auto text-brand-subtext/20 mb-4" />
                            <h3 className="text-xl font-bold text-brand-subtext/60">Nenhum documento encontrado</h3>
                            <p className="text-brand-subtext/40 mt-2">
                                {user?.role === 'hospital' ? 'Envie o primeiro holerite acima.' : 'Você ainda não recebeu documentos.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDocs.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-brand-surface p-6 rounded-2xl shadow-sm border border-brand-border hover:border-brand-accent/30 hover:shadow-md transition-all group relative"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-brand-accent/10 p-3 rounded-xl text-brand-accent">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider bg-brand-surface-highlight text-brand-text px-3 py-1 rounded-full">
                                            {doc.month}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-brand-text mb-1 truncate" title={doc.file_name}>
                                        {doc.file_name}
                                    </h3>
                                    <p className="text-sm text-brand-subtext mb-6">
                                        {user?.role === 'hospital' ? `Para: ${doc.recipient_name}` : `De: ${doc.uploader_name}`}
                                    </p>
                                    <a
                                        href={`${API_URL.replace('/api', '')}${doc.file_url}`} // Serves from /uploads/documents which is static in server
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="w-full text-center py-3 rounded-xl bg-brand-surface-highlight text-brand-text font-bold hover:bg-brand-accent hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Baixar PDF
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Upload Modal */}
                    <AnimatePresence>
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowModal(false)}
                                    className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-brand-surface rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 border border-brand-border"
                                >
                                    <h2 className="text-2xl font-bold mb-6 font-display text-brand-text">Enviar Holerite</h2>
                                    <form onSubmit={handleUpload} className="space-y-4">

                                        <div>
                                            <label className="block text-sm font-bold text-brand-subtext uppercase mb-2">Profissional</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3.5 w-5 h-5 text-brand-subtext/50" />
                                                <select
                                                    value={selectedEmployeeId}
                                                    onChange={e => setSelectedEmployeeId(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-brand-surface-highlight outline-none focus:border-brand-accent font-medium appearance-none text-brand-text"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {employees.map(emp => (
                                                        <option key={emp.id} value={emp.id}>
                                                            {emp.name} ({emp.role === 'nurse' ? 'Enf.' : 'Méd.'})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-subtext uppercase mb-2">Mês de Referência</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-brand-subtext/50" />
                                                <input
                                                    type="month"
                                                    value={uploadMonth}
                                                    onChange={e => setUploadMonth(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-transparent bg-brand-surface-highlight outline-none focus:border-brand-accent font-medium text-brand-text accent-brand-accent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-subtext uppercase mb-2">Arquivo (PDF/Imagem)</label>
                                            <div className="border-2 border-dashed border-brand-border rounded-xl p-8 text-center hover:bg-brand-surface-highlight transition-colors cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                {selectedFile ? (
                                                    <div className="text-brand-text font-bold flex items-center justify-center gap-2">
                                                        <FileText className="w-5 h-5 text-brand-accent" />
                                                        {selectedFile.name}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-brand-subtext/50">
                                                        <Upload className="w-8 h-8 mb-2" />
                                                        <span>Clique para selecionar</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 py-3 text-brand-subtext font-bold hover:bg-brand-surface-highlight rounded-xl transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className="flex-1 py-3 bg-brand-accent text-white font-bold rounded-xl shadow-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50"
                                            >
                                                {uploading ? 'Enviando...' : 'Enviar'}
                                            </button>
                                        </div>

                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
