import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import EventCard from '../components/EventCard';
import EventDetails from '../components/EventDetails';
import { Event } from '../types/events';
import { getEvents } from '../services/airtable/events';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setSelectedEvent(updatedEvent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!selectedEvent ? (
          <>
            <h1 className="text-2xl font-bold text-gray-100 mb-8">MSE Drive Club Events</h1>

            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={setSelectedEvent}
                />
              ))}
            </div>

            {events.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-400">No events available</p>
              </div>
            )}
          </>
        ) : (
          <EventDetails
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onUpdateEvent={handleUpdateEvent}
          />
        )}
      </main>
    </div>
  );
}