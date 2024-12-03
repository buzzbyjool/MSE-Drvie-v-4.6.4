import { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getCalendarEvents } from '../services/airtable/calendar';
import { Event, Region } from '../types/airtable';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../types/auth';
import Navigation from './Navigation';

const REGION_LABELS: Record<Region, string> = {
  'France-Nord': 'Northern France',
  'France-Sud': 'Southern France',
  'France-Est': 'Eastern France',
  'France-Ouest': 'Western France',
  'Luxembourg': 'Luxembourg',
  'Belgique': 'Belgium',
  'Andorre': 'Andorra'
};

// Refresh interval in milliseconds (30 seconds)
const REFRESH_INTERVAL = 30 * 1000;

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    try {
      const fetchedEvents = await getCalendarEvents();
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchEvents();

    // Set up periodic refresh
    const intervalId = setInterval(fetchEvents, REFRESH_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchEvents]);

  // Refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEvents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchEvents]);

  const filterEvents = (event: Event) => {
    if (!user) return false;
    
    // Admin can see all events
    if (user.role === ROLES.ADMIN) return true;

    // Editor and Manager can see all events except Admin-only events
    if ((user.role === ROLES.EDITOR || user.role === ROLES.MANAGER) && event.privacy !== 'Admin') {
      return true;
    }

    // Public events are visible to all
    if (event.privacy === 'Public') return true;

    // Admin-only events are not visible to regular users
    if (event.privacy === 'Admin') return false;

    // For region-specific events, check if user's region matches
    return event.privacy === user.region;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time unavailable';
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const filteredEvents = events
    .filter(filterEvents)
    .filter(event => {
      try {
        const eventDate = new Date(event.startDate);
        if (isNaN(eventDate.getTime())) {
          console.warn('Invalid date found:', event.startDate);
          return false;
        }
        return eventDate.getMonth() === currentMonth.getMonth() &&
               eventDate.getFullYear() === currentMonth.getFullYear();
      } catch (error) {
        console.error('Error filtering event date:', error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } catch (error) {
        console.error('Error sorting dates:', error);
        return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Club Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-gray-200 font-medium">
              {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        )}

        {!loading && (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden 
                         transition-all duration-300 hover:border-lime-500 hover:shadow-lime-500/10"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-lime-500 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-100 mb-3">
                    {event.title}
                  </h2>

                  <p className="text-gray-400 mb-4">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-4 h-4 text-lime-500" />
                        <span>{formatTime(event.startDate)}</span>
                      </div>
                      {event.privacy !== 'Public' && event.privacy !== 'Admin' && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-lime-500" />
                          <span>{REGION_LABELS[event.privacy as Region]}</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      event.privacy === 'Public' 
                        ? 'bg-lime-500/20 text-lime-300'
                        : event.privacy === 'Admin'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {event.privacy === 'Public' ? 'Public Event' : 
                       event.privacy === 'Admin' ? 'Administrators Only' : 
                       'Regional Event'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-400">No events scheduled for this month</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}