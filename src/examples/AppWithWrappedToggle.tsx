// Example of App.tsx modified to include a toggle for the Wrapped view
// Replace your existing App.tsx with this if you want an easy way to switch between views
// NOTE: This is just an example - adjust the import paths if you use this code

import { useState, useMemo } from 'react';
import {
  LoginCard,
  DashboardHeader,
  WelcomeCard,
  CalendarStatsOverview,
} from './ui/molecules';
import { Alert, Button } from './ui/atoms';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useCalendarStats } from './hooks/useCalendarStats';
import { getDefaultTimeRange } from './constants/calendar';
import { CalendarWrappedPage } from './pages/CalendarWrappedPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const [showWrapped, setShowWrapped] = useState(false);

  const {
    isAuthenticated,
    accessToken,
    status,
    error,
    scriptReady,
    handleLogin,
    clearSession,
  } = useGoogleAuth();

  const { timeMin, timeMax } = useMemo(() => getDefaultTimeRange(), []);

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useCalendarStats({
    accessToken: accessToken || '',
    timeMin,
    timeMax,
    calendarIds: ['primary'],
  });

  // Show wrapped view when authenticated and toggled on
  if (isAuthenticated && showWrapped && accessToken) {
    return (
      <div className="relative">
        {/* Exit button */}
        <button
          onClick={() => setShowWrapped(false)}
          className="fixed top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all"
        >
          ← Back to Dashboard
        </button>
        
        <CalendarWrappedPage
          accessToken={accessToken}
          timeMin={timeMin}
          timeMax={timeMax}
          calendarIds={['primary']}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated ? (
        <LoginCard
          onLogin={handleLogin}
          scriptReady={scriptReady}
          status={status}
          error={error}
          hasClientId={!!GOOGLE_CLIENT_ID}
        />
      ) : (
        <div className="min-h-screen p-6">
          <DashboardHeader onLogout={clearSession} />

          <main className="animate-fadeIn mx-auto max-w-7xl">
            <WelcomeCard />

            {/* Button to show wrapped view */}
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={() => setShowWrapped(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                🎉 View Your Calendar Wrapped
              </Button>
            </div>

            <CalendarStatsOverview stats={stats} loading={statsLoading} />

            {statsError && (
              <Alert variant="error" className="mt-6">
                Errore nel caricamento delle statistiche: {statsError}
              </Alert>
            )}
            {status && (
              <Alert variant="success" className="mt-6">
                {status}
              </Alert>
            )}
            {error && (
              <Alert variant="error" className="mt-6">
                {error}
              </Alert>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
