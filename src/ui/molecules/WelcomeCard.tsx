import { Card, Badge } from '../atoms';

export function WelcomeCard() {
  return (
    <Card className="mb-6 p-8">
      <Badge variant="success">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Connesso
      </Badge>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">Benvenuto nella tua Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Sei autenticato con successo. Qui potrai visualizzare e gestire tutti i tuoi eventi del calendario Google.
      </p>
    </Card>
  );
}
