import { Spinner } from '../../../ui/atoms/Spinner';

export function LoadingState() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="text-white scale-[3]">
            <Spinner />
          </div>
        </div>
        <p className="text-white text-xl">Analyzing your calendar...</p>
      </div>
    </div>
  );
}
