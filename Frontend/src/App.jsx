import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssistantPage from './pages/AssistantPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import ApplicationsPage from './pages/ApplicationsPage';

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
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>

          <Route path="*" element={<Box sx={{p: 4, textAlign: 'center'}}><h2>404 - Not Found</h2></Box>} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
