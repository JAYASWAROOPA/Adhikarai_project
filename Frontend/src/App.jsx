import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ROLES } from './constants/roles';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Citizen Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssistantPage from './pages/AssistantPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import DocumentVaultPage from './pages/DocumentVaultPage';
import OfficeLocatorPage from './pages/OfficeLocatorPage';
import OfficeDetailPage from './pages/OfficeDetailPage';
import AutoFillEngine from './components/autofill/AutoFillEngine';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOfficersPage from './pages/admin/AdminOfficersPage';
import AdminSchemesPage from './pages/admin/AdminSchemesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

// Officer Pages
import OfficerDashboardPage from './pages/officer/OfficerDashboardPage';
import OfficerVerificationsPage from './pages/officer/OfficerVerificationsPage';
import OfficerCitizenDetailPage from './pages/officer/OfficerCitizenDetailPage';
import OfficerAnalyticsPage from './pages/officer/OfficerAnalyticsPage';

// Helper component for route params in AutoFillEngine
const AutoFillRouteWrapper = () => {
  const { id } = useParams();
  return <AutoFillEngine schemeId={parseInt(id) || 1} />;
};

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Citizen Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.CITIZEN, ROLES.ADMIN]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/vault" element={<DocumentVaultPage />} />
            <Route path="/offices" element={<OfficeLocatorPage />} />
            <Route path="/offices/:id" element={<OfficeDetailPage />} />
            <Route path="/apply/:id" element={<AutoFillRouteWrapper />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/officers" element={<AdminOfficersPage />} />
            <Route path="/admin/schemes" element={<AdminSchemesPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          </Route>

          {/* Officer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.OFFICER, ROLES.ADMIN]} />}>
            <Route path="/officer" element={<OfficerDashboardPage />} />
            <Route path="/officer/verifications" element={<OfficerVerificationsPage />} />
            <Route path="/officer/citizens/:id" element={<OfficerCitizenDetailPage />} />
            <Route path="/officer/analytics" element={<OfficerAnalyticsPage />} />
          </Route>

          <Route path="*" element={<Box sx={{ p: 4, textAlign: 'center' }}><h2>404 - Page Not Found</h2></Box>} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
