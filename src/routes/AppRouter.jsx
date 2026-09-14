import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { MaintenancePage } from '../pages/Maintenance/MaintenancePage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProtectedRoute } from '../components/Protection/ProtectedRoute';

export const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Verifica si hay un usuario logueado en AWS Cognito al cargar o refrescar la pagina
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      // Cierra la sesion en AWS Cognito y elimina los tokens locales
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesion en Cognito:', error);
    } finally {
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <p>Cargando sesion...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MaintenancePage onLoginSuccess={handleLogin} />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<MaintenancePage onLoginSuccess={handleLogin} />} />
    </Routes>
  );
};

export default AppRouter;