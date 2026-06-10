import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const AppointmentsPage = lazy(() => import('./pages/appointments/AppointmentsPage'));
const PatientRecordsPage = lazy(() => import('./pages/records/PatientRecordsPage'));
const MedicationsPage = lazy(() => import('./pages/medications/MedicationsPage'));
const HealthMonitoringPage = lazy(() => import('./pages/health/HealthMonitoringPage'));
const AIChatPage = lazy(() => import('./pages/ai/AIChatPage'));
const DietFitnessPage = lazy(() => import('./pages/diet/DietFitnessPage'));

const StorePage = lazy(() => import('./pages/store/StorePage'));
const DataVisualizerPage = lazy(() => import('./pages/visualizer/DataVisualizerPage'));
const GoalSetterPage = lazy(() => import('./pages/goals/GoalSetterPage'));
const FeedbackPage = lazy(() => import('./pages/feedback/FeedbackPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  
  // Wait for auth state to resolve (Firebase)
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PageSuspense({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullPage />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  const theme = useSettingsStore((s) => s.theme);
  const notifications = useSettingsStore((s) => s.notifications);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Hourly water reminder
  React.useEffect(() => {
    let waterInterval;
    if (notifications?.water) {
      // 1 hour = 60 * 60 * 1000 ms = 3600000 ms
      waterInterval = setInterval(() => {
        const title = 'Hydration Reminder 💧';
        const body = "It's time to drink a glass of water to stay hydrated!";
        
        if (window.electronAPI) {
          window.electronAPI.notify.send(title, body);
        } else if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(title, { body });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(perm => {
              if (perm === 'granted') new Notification(title, { body });
            });
          }
        }
      }, 3600000);
    }
    return () => {
      if (waterInterval) clearInterval(waterInterval);
    };
  }, [notifications?.water]);

  return (
    <div className="flex min-h-screen w-full">
      <Routes>
        {/* Auth routes (no layout) */}
        <Route
          path="/login"
          element={
            <PageSuspense>
              <LoginPage />
            </PageSuspense>
          }
        />
        <Route
          path="/register"
          element={
            <PageSuspense>
              <RegisterPage />
            </PageSuspense>
          }
        />

        {/* Protected routes (with layout) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageSuspense>
                <DashboardPage />
              </PageSuspense>
            }
          />
          <Route path="appointments" element={<PageSuspense><AppointmentsPage /></PageSuspense>} />
          <Route path="records" element={<PageSuspense><PatientRecordsPage /></PageSuspense>} />
          <Route path="medications" element={<PageSuspense><MedicationsPage /></PageSuspense>} />
          <Route path="health" element={<PageSuspense><HealthMonitoringPage /></PageSuspense>} />
          <Route path="ai" element={<PageSuspense><AIChatPage /></PageSuspense>} />
          <Route path="diet" element={<PageSuspense><DietFitnessPage /></PageSuspense>} />
          <Route path="consultation" element={<Navigate to="/appointments" replace />} />
          <Route path="store" element={<PageSuspense><StorePage /></PageSuspense>} />
          <Route path="visualizer" element={<PageSuspense><DataVisualizerPage /></PageSuspense>} />
          <Route path="goals" element={<PageSuspense><GoalSetterPage /></PageSuspense>} />
          <Route path="feedback" element={<PageSuspense><FeedbackPage /></PageSuspense>} />
          <Route path="settings" element={<PageSuspense><SettingsPage /></PageSuspense>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
