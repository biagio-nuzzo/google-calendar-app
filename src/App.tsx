// Components
import { LoginCard } from "./ui/molecules";
import { useMemo } from "react";

// Hooks
import { useGoogleAuth } from "./hooks/useGoogleAuth";

// Utils
import { getDefaultTimeRange } from "./constants/calendar";

// Pages
import { CalendarWrappedPage } from "./pages/CalendarWrapped";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const {
    isAuthenticated,
    accessToken,
    status,
    error,
    scriptReady,
    handleLogin,
  } = useGoogleAuth();

  // Ottieni range temporale (ultimo anno) solo una volta per evitare refetch continui
  const { timeMin, timeMax } = useMemo(() => getDefaultTimeRange(), []);

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
        <CalendarWrappedPage
          accessToken={accessToken || ''}
          timeMin={timeMin}
          timeMax={timeMax}
          calendarIds={['primary']}
        />
      )}
    </div>
  );
}

export default App;
