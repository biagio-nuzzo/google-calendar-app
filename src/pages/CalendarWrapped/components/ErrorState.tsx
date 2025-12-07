import { Alert } from '../../../ui/atoms/Alert';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 p-8">
      <div className="max-w-md">
        <Alert variant="error">{error}</Alert>
      </div>
    </div>
  );
}
