/**
 * App Component
 * Main application component with routing
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider, useTask } from './context/TaskContext';
import { Navbar } from './components';
import { Home, Login, Register } from './pages';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * Protected Route Wrapper
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useTask();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public Route Wrapper
 * Redirects to home if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useTask();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Main Layout Component
 */
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

/**
 * App Routes Component
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Login Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Register Route */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <TaskProvider>
      <AppRoutes />
    </TaskProvider>
  );
}

export default App;
