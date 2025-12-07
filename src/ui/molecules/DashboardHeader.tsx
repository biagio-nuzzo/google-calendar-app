import { GoogleLogo, Button } from '../atoms';

type DashboardHeaderProps = {
  onLogout: () => void;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="animate-slideIn mx-auto mb-8 flex max-w-7xl items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <GoogleLogo />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Calendar Dashboard</h1>
          <p className="text-sm text-gray-600">Gestisci i tuoi eventi</p>
        </div>
      </div>
      <Button variant="secondary" onClick={onLogout}>
        Esci
      </Button>
    </header>
  );
}
