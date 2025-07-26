import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

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
import SimpleRegister from './pages/auth/SimpleRegister';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ScrollToTop from './components/ScrollToTop';
import PospSection from './pages/dashboard/PospSection';
import UbankSection from './pages/dashboard/UbankSection';
import ParentPortalSection from './pages/dashboard/ParentPortalSection';
import MessagerieSection from './pages/dashboard/MessagerieSection';
import CalendarSection from './pages/dashboard/CalendarSection';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Header />
                <HomePage />
                <Footer />
              </>
            } />
            <Route path="/pedagogie" element={
              <>
                <Header />
                <PospPage />
                <Footer />
              </>
            } />
            <Route path="/finances" element={
              <>
                <Header />
                <UbankPage />
                <Footer />
              </>
            } />
            <Route path="/portails" element={
              <>
                <Header />
                <ParentPortalPage />
                <Footer />
              </>
            } />
            <Route path="/avantages" element={
              <>
                <Header />
                <AdvantagesPage />
                <Footer />
              </>
            } />
            <Route path="/tarifs" element={
              <>
                <Header />
                <PricingPage />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <ContactPage />
                <Footer />
              </>
            } />
            <Route path="/faq" element={
              <>
                <Header />
                <FaqPage />
                <Footer />
              </>
            } />
            <Route path="/conditions" element={
              <>
                <Header />
                <TermsPage />
                <Footer />
              </>
            } />
            <Route path="/confidentialite" element={
              <>
                <Header />
                <PrivacyPage />
                <Footer />
              </>
            } />

            {/* Auth routes */}
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/inscription-simple" element={<SimpleRegister />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout>
                  <DashboardPage />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
