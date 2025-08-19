import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ScrollToTop from './components/ScrollToTop';
import Spinner from './components/Spinner';
import AnalyticsTracker from './components/AnalyticsTracker';
import AppErrorBoundary from './components/ErrorBoundary';
import { hasSupabase, supabaseInitError } from './lib/supabase';


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
import PospSection from './pages/dashboard/PospSection';
import UbankSection from './pages/dashboard/UbankSection';
import ParentPortalSection from './pages/dashboard/ParentPortalSection';
import MessagerieSection from './pages/dashboard/MessagerieSection';
import CalendarSection from './pages/dashboard/CalendarSection';
import StudentsPage from './pages/dashboard/StudentsPage';
import ClassesPage from './pages/dashboard/ClassesPage';
import AttendancePage from './pages/dashboard/AttendancePage';
import GradesPage from './pages/dashboard/GradesPage';
import BulletinsPage from './pages/dashboard/BulletinsPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import TeachersPage from './pages/dashboard/TeachersPage';
import ParentChildrenPage from './pages/dashboard/ParentChildrenPage';
import ParentAttendancePage from './pages/dashboard/ParentAttendancePage';
import ParentNotesPage from './pages/dashboard/ParentNotesPage';
import ParentPaymentsPage from './pages/dashboard/ParentPaymentsPage';

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  
  // Loading state is handled by AuthContext, no additional timeout needed

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  // Config error: Supabase not initialized
  if (!hasSupabase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="max-w-xl bg-white border border-red-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Configuration manquante</h2>
          <p className="text-gray-700 mb-4">
            {supabaseInitError || 'Les variables d\'environnement Supabase ne sont pas définies.'}
          </p>
          <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800 overflow-auto">
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
          </pre>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <ScrollToTop />
        <AnalyticsTracker />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/pedagogie" element={<PospPage />} />
            <Route path="/finances" element={<UbankPage />} />
            <Route path="/parents" element={<ParentPortalPage />} />
            <Route path="/portails" element={<ParentPortalPage />} />
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
                <DashboardPage />
              </PrivateRoute>
            } />
            <Route path="/dashboard/students" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <StudentsPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/classes" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <ClassesPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/teachers" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <TeachersPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/attendance" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin', 'teacher']}>
                  <DashboardLayout>
                    <AttendancePage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/grades" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin', 'teacher']}>
                  <DashboardLayout>
                    <GradesPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/bulletins" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <BulletinsPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/reports" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin', 'teacher', 'parent']}>
                  <DashboardLayout>
                    <ReportsPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            {/* Parent-specific routes */}
            <Route path="/dashboard/enfants" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['parent']}>
                  <DashboardLayout>
                    <ParentChildrenPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/attendance-parent" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['parent']}>
                  <DashboardLayout>
                    <ParentAttendancePage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/notes" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['parent']}>
                  <DashboardLayout>
                    <ParentNotesPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/paiements" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['parent']}>
                  <DashboardLayout>
                    <ParentPaymentsPage />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/payments" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <PaymentsPage />
                  </DashboardLayout>
                </RoleRoute>
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
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <UbankSection />
                  </DashboardLayout>
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="/dashboard/parents" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['school_admin']}>
                  <DashboardLayout>
                    <ParentPortalSection />
                  </DashboardLayout>
                </RoleRoute>
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
            <Route path="/dashboard/settings" element={
              <PrivateRoute>
                <DashboardLayout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
                      <p className="text-gray-600">Gérez vos paramètres de compte et préférences.</p>
                    </div>
                  </div>
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
    <AppErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<Spinner />}>
              <AppContent />
            </Suspense>
          </div>
        </AuthProvider>
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
