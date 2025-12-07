import { GoogleLogo, Button, Card, Spinner, Alert } from '../atoms';

type LoginCardProps = {
  onLogin: () => void;
  scriptReady: boolean;
  status: string;
  error: string;
  hasClientId: boolean;
};

export function LoginCard({ onLogin, scriptReady, status, error, hasClientId }: LoginCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-fadeIn w-full max-w-md">
        <Card className="rounded-3xl p-8">
          {/* Logo e Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <GoogleLogo />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Benvenuto</h1>
            <p className="mt-2 text-sm text-gray-600">
              Accedi con il tuo account Google per gestire il tuo calendario
            </p>
          </div>

          {/* Form di Login */}
          <div className="space-y-4">
            <Button onClick={onLogin} disabled={!scriptReady}>
              <GoogleLogo />
              <span>Accedi con Google</span>
            </Button>

            {/* Messaggi di stato */}
            {!scriptReady && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
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
            <p className="text-xs text-gray-500">Protetto da OAuth 2.0 • Accesso in sola lettura</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
