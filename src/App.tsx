import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ScrollToTop from './components/ScrollToTop';
import Spinner from './components/Spinner';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
            <p className="text-gray-700 mb-4">
              Désolé, une erreur inattendue s'est produite dans l'application.
            </p>
            <details className="text-left bg-gray-100 p-4 rounded-lg mb-4 max-h-40 overflow-auto">
              <summary className="cursor-pointer font-medium text-gray-800 mb-2">Détails de l'erreur</summary>
              <pre className="text-sm text-red-600 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Public pages
import HomePage from './pages/public/HomePage';
import PospPage from './pages/public/PospPage';
import UbankPage from './pages/public/UbankPage';
import ParentPortalPage from './pages/public/ParentPortalPage';
import AdvantagesPage from './pages/public/AdvantagesPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlatformAdminDashboard from './components/dashboard/PlatformAdminDashboard';
import DebugUserInfo from './components/DebugUserInfo';
import PospSection from './pages/dashboard/PospSection';
import UbankSection from './pages/dashboard/UbankSection';
import ParentPortalSection from './pages/dashboard/ParentPortalSection';
import MessagerieSection from './pages/dashboard/MessagerieSection';
import CalendarSection from './pages/dashboard/CalendarSection';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  console.log('AppContent: rendering', { user, loading });

  // Add a safety check to ensure we don't get stuck in loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('AppContent: forcing loading to false after timeout');
        console.log('AppContent: debug - loading is true after timeout', { user, loading });
        // Note: We should not force setLoading(false) here as it might hide real issues
      }
    }, 10000); // 10 second timeout for debugging purposes
    
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    console.log('AppContent: showing spinner - loading is true');
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Chargement de l'application...</p>
          <p className="mt-2 text-sm text-gray-500">Debug: loading={loading.toString()}, user={user ? 'present' : 'null'}</p>
        </div>
      </div>
    );
  }

  console.log('AppContent: rendering routes', { user });
  return (
    <>
      <DebugUserInfo />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/pedagogie" element={<PospPage />} />
            <Route path="/finances" element={<UbankPage />} />
            <Route path="/parents" element={<ParentPortalPage />} />
            <Route path="/avantages" element={<AdvantagesPage />} />
            <Route path="/tarifs" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/conditions" element={<TermsPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
            
            {/* Auth routes */}
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout>
                  {user?.role === 'platform_admin' ? <PlatformAdminDashboard /> : <DashboardPage />}
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/dashboard/pedagogie" element={
              <PrivateRoute>
                <DashboardLayout>
                  <PospSection />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/dashboard/finances" element={
              <PrivateRoute>
                <DashboardLayout>
                  <UbankSection />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/dashboard/parents" element={
              <PrivateRoute>
                <DashboardLayout>
                  <ParentPortalSection />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/dashboard/messagerie" element={
              <PrivateRoute>
                <DashboardLayout>
                  <MessagerieSection />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/dashboard/calendrier" element={
              <PrivateRoute>
                <DashboardLayout>
                  <CalendarSection />
                </DashboardLayout>
              </PrivateRoute>
            } />
            {/* Default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <PWAInstallPrompt />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
