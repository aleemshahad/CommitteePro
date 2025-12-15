import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/common/Navigation';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import {
    Committees,
    Payments,
    Draws,
    Reports,
    Settings,
} from './pages/PlaceholderPages';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                    <h1>⚠️ Something went wrong</h1>
                    <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
                        {this.state.error?.message}
                        {'\n\n'}
                        {this.state.error?.stack}
                    </pre>
                    <button onClick={() => window.location.reload()}>Reload Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// App Layout with Navigation
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app-layout">
            <Navigation />
            <main className="main-content">{children}</main>
        </div>
    );
};

// Main App Routes
const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/committees"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Committees />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Payments />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/draws"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Draws />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Reports />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Settings />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

// Main App Component
const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <LanguageProvider>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </LanguageProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;
