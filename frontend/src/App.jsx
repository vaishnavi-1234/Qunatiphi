import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import LoadingSpinner from './components/LoadingSpinner';

// Route guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route guard for guest users (redirect away from login/register if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Public / Guest Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />

            {/* Default Catch-all */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
