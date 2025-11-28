
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BoardProvider } from './context/DashboardContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterEmployeePage } from './pages/RegisterEmployeePage';
import { BoardPage } from './pages/DashboardPage';
import { EmployeeListContainer } from './components/containers/EmployeeListContainer';
import { EmployeeDetailContainer } from './components/containers/EmployeeDetailContainer';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/presentation/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeListContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute>
              <RegisterEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Board"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/employees" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BoardProvider>
            <AppRoutes />
          </BoardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
