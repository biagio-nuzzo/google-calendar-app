// Components
import {
  LoginCard,
  DashboardHeader,
  WelcomeCard,
  CalendarStatsOverview,
} from "./ui/molecules";
import { Alert } from "./ui/atoms";

// Hooks
import { useGoogleAuth } from "./hooks/useGoogleAuth";
import { useCalendarStats } from "./hooks/useCalendarStats";

// Utils
import { getDefaultTimeRange } from "./constants/calendar";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const {
    isAuthenticated,
    accessToken,
    status,
    error,
    scriptReady,
    handleLogin,
    clearSession,
  } = useGoogleAuth();

  // Ottieni range temporale (ultimo anno)
  const { timeMin, timeMax } = getDefaultTimeRange();

  // Usa hook calendario solo se autenticato
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

            {/* Statistiche Calendario */}
            <CalendarStatsOverview stats={stats} loading={statsLoading} />

            {/* Messaggi */}
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
