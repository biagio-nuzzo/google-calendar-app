import { useEffect, useState } from 'react';
import { LoginCard, DashboardHeader, WelcomeCard, StatsCard } from './ui/molecules';
import { Alert } from './ui/atoms';

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type TokenClientConfig = {
  client_id: string;
  scope: string;
  prompt?: string;
  callback: (tokenResponse: TokenResponse) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

function App() {
  const [tokenClient, setTokenClient] = useState<TokenClient | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState("Pronto per il login con Google.");
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  const isAuthenticated = Boolean(accessToken);

  useEffect(() => {
    let cancelled = false;

    const ensureGoogleScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google?.accounts?.oauth2) {
          resolve();
          return;
        }

        const existing = document.querySelector<HTMLScriptElement>(
          'script[src="https://accounts.google.com/gsi/client"]'
        );
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () =>
              reject(new Error("Google Identity Services non è disponibile")),
            { once: true }
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Google Identity Services non è disponibile"));
        document.head.appendChild(script);
      });

    const initClient = (clientId: string) => {
      if (!window.google?.accounts?.oauth2) {
        throw new Error("Google Identity Services non è disponibile");
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: CALENDAR_SCOPE,
        prompt: "",
        callback: (tokenResponse) => {
          if (cancelled) return;
          setAccessToken(tokenResponse.access_token);
          setStatus("Autenticazione completata. Benvenuto nella dashboard!");
          setError("");
        },
      });

      setTokenClient(client);
      setScriptReady(true);
      setStatus("Pronto per il login con Google.");
    };

    ensureGoogleScript()
      .then(() => {
        if (cancelled) return;
        if (!GOOGLE_CLIENT_ID) {
          setError(
            "Aggiungi VITE_GOOGLE_CLIENT_ID nel file .env per abilitare il login."
          );
          setStatus("");
          return;
        }
        initClient(GOOGLE_CLIENT_ID);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setStatus("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Configura VITE_GOOGLE_CLIENT_ID nel file .env");
      return;
    }
    if (!tokenClient) {
      setError("Il client Google non è ancora pronto. Riprova tra un istante.");
      return;
    }

    setError("");
    tokenClient.requestAccessToken({ prompt: accessToken ? "" : "consent" });
  };

  const clearSession = () => {
    setAccessToken("");
    setStatus("Sessione ripulita. Accedi di nuovo per continuare.");
  };

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

            <div className="grid gap-6 md:grid-cols-3">
              <StatsCard
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title="Eventi"
                description="Visualizza i tuoi prossimi appuntamenti"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatsCard
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Sincronizzato"
                description="Calendario sempre aggiornato"
                gradient="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatsCard
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Sicuro"
                description="Protetto da OAuth 2.0"
                gradient="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>

            {status && <Alert variant="success" className="mt-6">{status}</Alert>}
            {error && <Alert variant="error" className="mt-6">{error}</Alert>}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
