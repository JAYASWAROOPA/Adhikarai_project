import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar takes fixed width */}
      <Sidebar />
      
      {/* Main content area takes the rest */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedRoute;
