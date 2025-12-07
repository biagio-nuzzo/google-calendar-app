import { GoogleLogo, Button, Card, Spinner, Alert } from '../atoms';
import logoImg from '../../assets/logo.png';

type LoginCardProps = {
  onLogin: () => void;
  scriptReady: boolean;
  status: string;
  error: string;
  hasClientId: boolean;
};

export function LoginCard({ onLogin, scriptReady, status, error, hasClientId }: LoginCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="animate-fadeIn w-full max-w-md">
        <Card className="rounded-3xl p-8 shadow-2xl border-2 border-white/50 bg-white/95 backdrop-blur-sm">
          {/* Logo e Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6">
              <img src={logoImg} alt="Calendar Logo" className="h-24 w-auto mx-auto object-contain" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Calendar Wrapped 2025
            </h1>
            <p className="mt-3 text-base text-gray-600 font-medium">
              Scopri le statistiche del tuo anno su Google Calendar
            </p>
          </div>

          {/* Form di Login */}
          <div className="space-y-4">
            <Button 
              onClick={onLogin} 
              disabled={!scriptReady}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <GoogleLogo />
              <span>Accedi con Google</span>
            </Button>

            {/* Messaggi di stato */}
            {!scriptReady && (
              <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium">
                <Spinner />
                <span>Caricamento...</span>
              </div>
            )}
            {status && !error && <Alert variant="success">{status}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}
            {!hasClientId && (
              <Alert variant="warning">
                ⚠️ Configura{' '}
                <code className="rounded bg-orange-100 px-1 py-0.5">VITE_GOOGLE_CLIENT_ID</code> nel file{' '}
                <code className="rounded bg-orange-100 px-1 py-0.5">.env</code>
              </Alert>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
              🔒 Protetto da OAuth 2.0 • Accesso in sola lettura
            </p>
          </div>
        </Card>
        
        {/* Elementi decorativi */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
