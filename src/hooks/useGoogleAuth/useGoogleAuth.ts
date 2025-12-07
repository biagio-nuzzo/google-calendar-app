import { useEffect, useState } from 'react';
import type { TokenClient, UseGoogleAuthReturn } from './types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [tokenClient, setTokenClient] = useState<TokenClient | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [status, setStatus] = useState('Pronto per il login con Google.');
  const [error, setError] = useState('');
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
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener(
            'error',
            () => reject(new Error('Google Identity Services non è disponibile')),
            { once: true }
          );
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Google Identity Services non è disponibile'));
        document.head.appendChild(script);
      });

    const initClient = (clientId: string) => {
      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services non è disponibile');
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: CALENDAR_SCOPE,
        prompt: '',
        callback: (tokenResponse) => {
          if (cancelled) return;
          setAccessToken(tokenResponse.access_token);
          setStatus('Autenticazione completata. Benvenuto nella dashboard!');
          setError('');
        },
      });

      setTokenClient(client);
      setScriptReady(true);
      setStatus('Pronto per il login con Google.');
    };

    ensureGoogleScript()
      .then(() => {
        if (cancelled) return;
        if (!GOOGLE_CLIENT_ID) {
          setError('Aggiungi VITE_GOOGLE_CLIENT_ID nel file .env per abilitare il login.');
          setStatus('');
          return;
        }
        initClient(GOOGLE_CLIENT_ID);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setStatus('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Configura VITE_GOOGLE_CLIENT_ID nel file .env');
      return;
    }
    if (!tokenClient) {
      setError('Il client Google non è ancora pronto. Riprova tra un istante.');
      return;
    }

    setError('');
    tokenClient.requestAccessToken({ prompt: accessToken ? '' : 'consent' });
  };

  const clearSession = () => {
    setAccessToken('');
    setStatus('Sessione ripulita. Accedi di nuovo per continuare.');
  };

  return {
    isAuthenticated,
    accessToken,
    status,
    error,
    scriptReady,
    handleLogin,
    clearSession,
  };
}
