export function EmptyState() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-8">
      <div className="text-center text-white space-y-4">
        <h2 className="text-3xl font-bold">No calendar data available</h2>
        <p className="text-white/80">
          Try selecting a different time range or calendar.
        </p>
      </div>
    </div>
  );
}
