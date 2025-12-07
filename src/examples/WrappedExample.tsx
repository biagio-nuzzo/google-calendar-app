// Example of how to integrate CalendarWrappedPage into your application
// You can add a route or button to navigate to the wrapped experience

import { CalendarWrappedPage } from './pages/CalendarWrappedPage';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { getDefaultTimeRange } from './constants/calendar';

// Example usage in a component:
export function AppWithWrapped() {
  const { isAuthenticated, accessToken } = useGoogleAuth();
  const { timeMin, timeMax } = getDefaultTimeRange();

  if (!isAuthenticated || !accessToken) {
    return <div>Please login first</div>;
  }

  return (
    <CalendarWrappedPage
      accessToken={accessToken}
      timeMin={timeMin}
      timeMax={timeMax}
      calendarIds={['primary']} // optional, defaults to primary calendar
    />
  );
}

// Or add a button in your main App to show the wrapped view:
// 
// const [showWrapped, setShowWrapped] = useState(false);
// 
// {showWrapped ? (
//   <CalendarWrappedPage
//     accessToken={accessToken}
//     timeMin={timeMin}
//     timeMax={timeMax}
//   />
// ) : (
//   // Your regular dashboard
// )}
