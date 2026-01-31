import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardHospital from './pages/DashboardHospital';
import DashboardAdmin from './pages/DashboardAdmin';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Compliance from './pages/Compliance';
import LGPD from './pages/LGPD';
import CookieConsent from './components/CookieConsent';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
    const { isAuthenticated, user, token } = useAuth();

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function AppRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/lgpd" element={<LGPD />} />

                <Route
                    path="/doctor"
                    element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DashboardDoctor />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hospital"
                    element={
                        <ProtectedRoute allowedRoles={['hospital']}>
                            <DashboardHospital />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardAdmin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute>
                            <Documents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <AppRoutes />
                <CookieConsent />
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
